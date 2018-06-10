using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VoidJudge.Data;
using VoidJudge.Models.Auth;
using Claim = System.Security.Claims.Claim;
using ClaimTypes = System.Security.Claims.ClaimTypes;

namespace VoidJudge.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly VoidJudgeContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(IConfiguration configuration, VoidJudgeContext context, PasswordHasher<User> passwordHasher)
        {
            _configuration = configuration;
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<LoginResult> LoginAsync(LoginUser loginUser, string ipAddress)
        {
            var jwsth = new JwtSecurityTokenHandler();

            var user = await _context.Users.SingleOrDefaultAsync(u =>
                u.LoginName == loginUser.LoginName);
            if (user == null) return new LoginResult { Type = AuthResult.Wrong };
            if (_passwordHasher.VerifyHashedPassword(user, user.Password, loginUser.Password) !=
                PasswordVerificationResult.Success) return new LoginResult { Type = AuthResult.Wrong };

            var role = await (from u in _context.Users
                              join ur in _context.UserRoles on u.Id equals ur.UserId
                              join r in _context.Roles on ur.RoleId equals r.Id
                              where u.Id == user.Id
                              select r).SingleOrDefaultAsync();

            if (role == null) return new LoginResult { Type = AuthResult.Error };

            // push the user’s name into a claim, so we can identify the user later on.
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, role.Type),
                new Claim("id", user.Id.ToString()),
                new Claim("ipAddress", ipAddress)
            };
            //sign the token using a secret key.This secret will be shared between your API and anything that needs to check that the token is legit.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //.NET Core’s JwtSecurityToken class takes on the heavy lifting and actually creates the token.
            /**
                 * Claims (Payload)
                    Claims 部分包含了一些跟这个 token 有关的重要信息。 JWT 标准规定了一些字段，下面节选一些字段:

                    iss: The issuer of the token，token 是给谁的
                    sub: The subject of the token，token 主题
                    exp: Expiration Time。 token 过期时间，Unix 时间戳格式
                    iat: Issued At。 token 创建时间， Unix 时间戳格式
                    jti: JWT ID。针对当前 token 的唯一标识
                    除了规定的字段外，可以包含其他任何 JSON 兼容的字段。
                 * */
            var token = jwsth.WriteToken(new JwtSecurityToken(
                issuer: _configuration["Issuer"],
                audience: _configuration["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                notBefore: DateTime.Now,
                signingCredentials: creds));

            user.LastLoginTime = DateTime.Now;
            await _context.SaveChangesAsync();

            return new LoginResult { Type = AuthResult.Ok, Token = token };
        }

        public async Task<AuthResult> ResetPasswordAsync(ResetUser resetUser)
        {
            var user = await _context.Users.FindAsync(resetUser.Id);
            if (user == null) return AuthResult.Wrong;
            if (_passwordHasher.VerifyHashedPassword(user, user.Password, resetUser.Password) !=
                PasswordVerificationResult.Success) return AuthResult.Wrong;
            user.Password = _passwordHasher.HashPassword(user, resetUser.NewPassword);
            await _context.SaveChangesAsync();
            return AuthResult.Ok;
        }

        public async Task<bool> IsUserExistAsync(long id)
        {
            return (await _context.Users.FindAsync(id)) != null;
        }

        public bool CompareRoleAuth(string roleTypeA, string roleTypeB)
        {
            return int.Parse(roleTypeA) <= int.Parse(roleTypeB);
        }

        public async Task<Role> CheckRoleTypeAsync(string roleType)
        {
            return await _context.Roles.SingleOrDefaultAsync(x => x.Type == roleType);
        }
    }
}