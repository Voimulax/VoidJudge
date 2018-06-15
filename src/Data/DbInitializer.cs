using System;
using System.Linq;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;

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

            var roles = new[]
            {
                new Role {Name = "Admin", Type = RoleType.Admin},
                new Role {Name = "Teacher", Type = RoleType.Teacher},
                new Role {Name = "Student", Type = RoleType.Student}
            };

            foreach (var role in roles)
            {
                context.Add(role);
                context.SaveChanges();
            }

            var users = new[]
            {
                new User {RoleId = 1, LoginName = "admin", UserName = "admin", PasswordHash = "AQAAAAEAACcQAAAAEJdVGeOLJzje7DKUb+XA7cqs5mH0pmgfdB2MGO/nYsSRSD003NwRj3rPf9TyRmU5OA==", CreateTime = DateTime.Now},
                new User {RoleId = 2, LoginName = "teacher", UserName = "teacher", PasswordHash = "AQAAAAEAACcQAAAAEJ060Eht26I7v5b3tsYm4b5piPHt5bMK1nURUwf9Ns4yLxwts1KIdlZPV/Xw3rTXFw==", CreateTime = DateTime.Now},
                new User {RoleId = 3, LoginName = "123", UserName = "student", PasswordHash = "AQAAAAEAACcQAAAAEK5iiQiTMuTeBaTfsqlr5PUjQcWQPcg2W9b7RliK6MjiFnWekvMQOCbkFTGDMZZbqQ==", CreateTime = DateTime.Now},
            };

            foreach (var user in users)
            {
                context.Add(user);
                context.SaveChanges();
            }

            var students = new[]
            {
                new Student{Id = 123, UserId = 3, Group="15-1"}
            };

            foreach (var student in students)
            {
                context.Add(student);
                context.SaveChanges();
            }

            var teachers = new[]
            {
                new Teacher{UserId = 2}
            };

            foreach (var teacher in teachers)
            {
                context.Add(teacher);
                context.SaveChanges();
            }

            var dt = DateTime.Now;
            var st1 = new DateTime(dt.Year, dt.Month, dt.Day, 9, 0, 0) - new TimeSpan(1, 0, 0, 0);
            var et1 = new DateTime(dt.Year, dt.Month, dt.Day, 14, 0, 0) - new TimeSpan(1, 0, 0, 0);
            var st2 = new DateTime(dt.Year, dt.Month, dt.Day, 0, 0, 0) - new TimeSpan(1, 0, 0, 0);
            var et2 = new DateTime(dt.Year, dt.Month, dt.Day, 0, 0, 0) + new TimeSpan(1, 0, 0, 0);
            var st3 = new DateTime(dt.Year, dt.Month, dt.Day, 9, 0, 0) + new TimeSpan(1, 0, 0, 0);
            var et3 = new DateTime(dt.Year, dt.Month, dt.Day, 14, 0, 0) + new TimeSpan(1, 0, 0, 0);

            var contests = new[]
            {
                new Contest{Name = "c11", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.UnPublished},
                new Contest{Name = "c12", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.NotDownloaded},
                new Contest{Name = "c13", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.DownLoaded},
                new Contest{Name = "c21", OwnerId = 1, StartTime = st2,EndTime = et2,State = ContestState.UnPublished},
                new Contest{Name = "c22", OwnerId = 1, StartTime = st2,EndTime = et2,State = ContestState.NotDownloaded},
                new Contest{Name = "c31", OwnerId = 1, StartTime = st3,EndTime = et3,State = ContestState.UnPublished},
                new Contest{Name = "c32", OwnerId = 1, StartTime = st3,EndTime = et3,State = ContestState.NotDownloaded},
            };

            foreach (var contest in contests)
            {
                context.Add(contest);
                context.SaveChanges();
            }

            var enrollments = new[]
            {
                new Enrollment{StudentId = 123,ContestId = 1},
                new Enrollment{StudentId = 123,ContestId = 2},
                new Enrollment{StudentId = 123,ContestId = 3},
                new Enrollment{StudentId = 123,ContestId = 4},
                new Enrollment{StudentId = 123,ContestId = 5},
                new Enrollment{StudentId = 123,ContestId = 6},
                new Enrollment{StudentId = 123,ContestId = 7},
            };

            foreach (var enrollment in enrollments)
            {
                context.Add(enrollment);
                context.SaveChanges();
            }

            context.SaveChanges();
        }
    }
}