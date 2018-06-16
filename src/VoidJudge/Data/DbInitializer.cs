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
                new RoleModel {Name = "Admin", Type = RoleType.Admin},
                new RoleModel {Name = "Teacher", Type = RoleType.Teacher},
                new RoleModel {Name = "Student", Type = RoleType.Student}
            };

            foreach (var role in roles)
            {
                context.Add(role);
                context.SaveChanges();
            }

            var users = new[]
            {
                new UserModel {RoleId = 1, LoginName = "admin", UserName = "admin", PasswordHash = "AQAAAAEAACcQAAAAEJdVGeOLJzje7DKUb+XA7cqs5mH0pmgfdB2MGO/nYsSRSD003NwRj3rPf9TyRmU5OA==", CreateTime = DateTime.Now},
                new UserModel {RoleId = 2, LoginName = "teacher", UserName = "teacher", PasswordHash = "AQAAAAEAACcQAAAAEJ060Eht26I7v5b3tsYm4b5piPHt5bMK1nURUwf9Ns4yLxwts1KIdlZPV/Xw3rTXFw==", CreateTime = DateTime.Now},
                new UserModel {RoleId = 3, LoginName = "123", UserName = "student", PasswordHash = "AQAAAAEAACcQAAAAEK5iiQiTMuTeBaTfsqlr5PUjQcWQPcg2W9b7RliK6MjiFnWekvMQOCbkFTGDMZZbqQ==", CreateTime = DateTime.Now},
            };

            foreach (var user in users)
            {
                context.Add(user);
                context.SaveChanges();
            }

            var students = new[]
            {
                new StudentModel{Id = 123, UserId = 3, Group="15-1"}
            };

            foreach (var student in students)
            {
                context.Add(student);
                context.SaveChanges();
            }

            var teachers = new[]
            {
                new TeacherModel{UserId = 2}
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
                new ContestModel{Name = "c11", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.UnPublished,CreateTime = st1},
                new ContestModel{Name = "c12", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.NotDownloaded,CreateTime = st1},
                new ContestModel{Name = "c13", OwnerId = 1, StartTime = st1,EndTime = et1,State = ContestState.DownLoaded,CreateTime = st1},
                new ContestModel{Name = "c21", OwnerId = 1, StartTime = st2,EndTime = et2,State = ContestState.UnPublished,CreateTime = st2},
                new ContestModel{Name = "c22", OwnerId = 1, StartTime = st2,EndTime = et2,State = ContestState.NotDownloaded,CreateTime = st2},
                new ContestModel{Name = "c31", OwnerId = 1, StartTime = st3,EndTime = et3,State = ContestState.UnPublished,CreateTime = st3},
                new ContestModel{Name = "c32", OwnerId = 1, StartTime = st3,EndTime = et3,State = ContestState.NotDownloaded,CreateTime = st3},
            };

            foreach (var contest in contests)
            {
                context.Add(contest);
                context.SaveChanges();
            }

            var enrollments = new[]
            {
                new EnrollmentModel{StudentId = 123,ContestId = 1},
                new EnrollmentModel{StudentId = 123,ContestId = 2},
                new EnrollmentModel{StudentId = 123,ContestId = 3},
                new EnrollmentModel{StudentId = 123,ContestId = 4},
                new EnrollmentModel{StudentId = 123,ContestId = 5},
                new EnrollmentModel{StudentId = 123,ContestId = 6},
                new EnrollmentModel{StudentId = 123,ContestId = 7},
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