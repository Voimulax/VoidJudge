using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VoidJudge.Data;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Auth;
using VoidJudge.ViewModels.Identity;
using Claim = System.Security.Claims.Claim;
using ClaimTypes = System.Security.Claims.ClaimTypes;

namespace VoidJudge.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly VoidJudgeContext _context;
        private readonly PasswordHasher<UserModel> _passwordHasher;

        public AuthService(IConfiguration configuration, VoidJudgeContext context, PasswordHasher<UserModel> passwordHasher)
        {
            _configuration = configuration;
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<ApiResult> LoginAsync(LoginUserViewModel loginUser, string ipAddress)
        {
            var jwsth = new JwtSecurityTokenHandler();

            var user = await _context.Users.Where(u => u.LoginName == loginUser.LoginName).Include(u => u.Role)
                .SingleOrDefaultAsync();
            if (user == null) return new ApiResult { Error = AuthResultType.Wrong };
            if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginUser.Password) !=
                PasswordVerificationResult.Success) return new ApiResult { Error = AuthResultType.Wrong };

            // push the user’s name into a claim, so we can identify the user later on.
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, $"{(int)user.Role.Type}"),
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
                _configuration["Issuer"],
                _configuration["Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                notBefore: DateTime.Now,
                signingCredentials: creds));

            user.LastLoginTime = DateTime.Now;
            await _context.SaveChangesAsync();

            return new ApiDataResult { Error = AuthResultType.Ok, Data = new { Token = token } };
        }

        public async Task<ApiResult> ResetPasswordAsync(ResetUserViewModel resetUser)
        {
            var user = await _context.Users.FindAsync(resetUser.Id);
            if (user == null) return new ApiResult { Error = AuthResultType.Wrong };
            if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, resetUser.Password) !=
                PasswordVerificationResult.Success) return new ApiResult { Error = AuthResultType.Wrong };
            user.PasswordHash = _passwordHasher.HashPassword(user, resetUser.NewPassword);
            await _context.SaveChangesAsync();
            return new ApiResult { Error = AuthResultType.Ok };
        }

        public async Task<bool> IsUserExistAsync(long id)
        {
            return (await _context.Users.FindAsync(id)) != null;
        }

        public bool CompareRoleAuth(RoleType a, RoleType b)
        {
            return (int)a <= (int)b;
        }

        public RoleType GetRoleTypeFromRequest(IEnumerable<Claim> claims)
        {
            var v = claims.SingleOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            return Enum.Parse<RoleType>(v);
        }

        public long GetUserIdFromRequest(IEnumerable<Claim> claims)
        {
            return long.Parse(claims.SingleOrDefault(x => x.Type == "id")?.Value);
        }

        public string GetIpAddressFromRequest(IEnumerable<Claim> claims)
        {
            return claims.SingleOrDefault(x => x.Type == "ipAddress")?.Value;
        }

        public async Task<RoleModel> GetRoleFromRoleTypeAsync(RoleType roleType, bool isLoadUsers = false)
        {
            if (isLoadUsers) return await _context.Roles.Include(r => r.Users).SingleOrDefaultAsync(x => x.Type == roleType);
            return await _context.Roles.SingleOrDefaultAsync(x => x.Type == roleType);
        }
    }
}