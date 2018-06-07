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

            var users = new User[]
            {
                new User {LoginName = "admin", UserName = "admin", Password = "a", CreateTime = DateTime.Now},
                new User {LoginName = "teacher", UserName = "teacher", Password = "t", CreateTime = DateTime.Now},
                new User {LoginName = "123", UserName = "student", Password = "1", CreateTime = DateTime.Now},
            };

            foreach (var user in users)
            {
                context.Users.Add(user);
            }

            var roles = new Role[]
            {
                new Role {Name = "Admin", Code = "0"},
                new Role {Name = "Teacher", Code = "1"},
                new Role {Name = "Student", Code = "2"}
            };

            foreach (var role in roles)
            {
                context.Roles.Add(role);
            }

            var userRoles = new UserRole[]
            {
                new UserRole {UserId = 1, RoleId = 1},
                new UserRole {UserId = 2, RoleId = 2},
                new UserRole {UserId = 3, RoleId = 3},
            };

            foreach (var userRole in userRoles)
            {
                context.UserRoles.Add(userRole);
            }

            var claims = new Claim[]
            {
                new Claim {Name = "班级", Type = "group"}
            };

            foreach (var claim in claims)
            {
                context.Claims.Add(claim);
            }

            context.SaveChanges();
        }
    }
}