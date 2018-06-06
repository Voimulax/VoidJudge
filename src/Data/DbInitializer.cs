using System;
using System.Linq;
using VoidJudge.Models;

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
                new User{LoginName = "admin",UserName = "admin",Password = "a",UserType = UserType.Admin,CreateTime = DateTime.Now},
                new User{LoginName = "teacher",UserName = "teacher",Password = "t",UserType = UserType.Teacher,CreateTime = DateTime.Now},
                new User{LoginName = "123",UserName = "student",Password = "1",UserType = UserType.Student,CreateTime = DateTime.Now},
            };

            foreach (var user in users)
            {
                context.Users.Add(user);
            }

            context.SaveChanges();
        }
    }
}