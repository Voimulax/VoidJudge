using System;
using System.Linq;
using VoidJudge.Models.Auth;

namespace VoidJudge.Data
{
    public static class DbInitializer
    {
        public static void Initialize(VoidJudgeContext context)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            var users = new[]
            {
                new User {LoginName = "admin", UserName = "admin", Password = "a", CreateTime = DateTime.Now},
                new User {LoginName = "teacher", UserName = "teacher", Password = "t", CreateTime = DateTime.Now},
                new User {LoginName = "123", UserName = "student", Password = "1", CreateTime = DateTime.Now},
            };

            context.Users.AddRange(users);

            var roles = new[]
            {
                new Role {Name = "Admin", Code = "0"},
                new Role {Name = "Teacher", Code = "1"},
                new Role {Name = "Student", Code = "2"}
            };

            context.Roles.AddRange(roles);

            var userRoles = new[]
            {
                new UserRole {UserId = 1, RoleId = 1},
                new UserRole {UserId = 2, RoleId = 2},
                new UserRole {UserId = 3, RoleId = 3},
            };

            context.UserRoles.AddRange(userRoles);

            var claims = new[]
            {
                new Claim {Name = "班级", Type = "group"},
                new Claim {Name = "IP地址", Type = "ipAddress"}
            };

            context.Claims.AddRange(claims);

            var userClaims = new[]
            {
                new UserClaim{ClaimId = 1,UserId = 3,Value = "15-1"}
            };

            context.UserClaims.AddRange(userClaims);

            context.SaveChanges();
        }
    }
}