﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VoidJudge.Data;
using VoidJudge.Models.Auth;

namespace VoidJudge.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly VoidJudgeContext _context;

        public AuthService(IConfiguration configuration, VoidJudgeContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public LoginResult Login(LoginUser loginUser, string ipAddress)
        {
            var jwsth = new JwtSecurityTokenHandler();

            var user = _context.Users.FirstOrDefault(u =>
                u.LoginName == loginUser.LoginName && u.Password == loginUser.Password);
            if (user == null) return new LoginResult { Type = LoginType.Wrong };

            var role = (from ur in _context.UserRoles
                        from u in _context.Users
                        from r in _context.Roles
                        where u.Id == user.Id && ur.UserId == u.Id && ur.RoleId == r.Id
                        select r).FirstOrDefault();

            if (role == null) return new LoginResult { Type = LoginType.Error };

            // push the user’s name into a claim, so we can identify the user later on.
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, role.Name),
                new Claim("id", user.Id.ToString()),
                new Claim("loginName", user.LoginName),
                new Claim("userName", user.UserName),
                new Claim("userType", role.Code)
            };
            //sign the token using a secret key.This secret will be shared between your API and anything that needs to check that the token is legit.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecurityKey"]));
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
                issuer: "https://void-judge.firebaseapp.com",
                audience: "https://void-judge.firebaseapp.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                notBefore: DateTime.Now,
                signingCredentials: creds));

            user.LastLoginTime = DateTime.Now;
            _context.SaveChanges();

            return new LoginResult { Type = LoginType.Ok, Token = token };
        }
    }
}