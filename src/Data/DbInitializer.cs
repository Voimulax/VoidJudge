using System;
using System.Linq;
using VoidJudge.Models.Auth;
using VoidJudge.Models.Contest;

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
                new User {LoginName = "admin", UserName = "admin", Password = "AQAAAAEAACcQAAAAEJdVGeOLJzje7DKUb+XA7cqs5mH0pmgfdB2MGO/nYsSRSD003NwRj3rPf9TyRmU5OA==", CreateTime = DateTime.Now},
                new User {LoginName = "teacher", UserName = "teacher", Password = "AQAAAAEAACcQAAAAEJ060Eht26I7v5b3tsYm4b5piPHt5bMK1nURUwf9Ns4yLxwts1KIdlZPV/Xw3rTXFw==", CreateTime = DateTime.Now},
                new User {LoginName = "123", UserName = "student", Password = "AQAAAAEAACcQAAAAEK5iiQiTMuTeBaTfsqlr5PUjQcWQPcg2W9b7RliK6MjiFnWekvMQOCbkFTGDMZZbqQ==", CreateTime = DateTime.Now},
            };

            foreach (var user in users)
            {
                context.Add(user);
                context.SaveChanges();
            }

            var roles = new[]
            {
                new Role {Name = "Admin", Type = RoleTypes.Admin},
                new Role {Name = "Teacher", Type = RoleTypes.Teacher},
                new Role {Name = "Student", Type = RoleTypes.Student}
            };

            foreach (var role in roles)
            {
                context.Add(role);
                context.SaveChanges();
            }

            var userRoles = new[]
            {
                new UserRole {UserId = 1, RoleId = 1},
                new UserRole {UserId = 2, RoleId = 2},
                new UserRole {UserId = 3, RoleId = 3},
            };

            foreach (var userRole in userRoles)
            {
                context.Add(userRole);
                context.SaveChanges();
            }

            var claims = new[]
            {
                new Claim {Name = "Group", Type = ClaimTypes.Group},
                new Claim {Name = "IPAddress", Type = ClaimTypes.IPAddress}
            };

            foreach (var claim in claims)
            {
                context.Add(claim);
                context.SaveChanges();
            }

            var userClaims = new[]
            {
                new UserClaim{ ClaimId = 1,UserId = 3,Value = "15-1"}
            };

            foreach (var userClaim in userClaims)
            {
                context.Add(userClaim);
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
                new Contest{Name = "c11", UserId = 2, StartTime = st1,EndTime = et1,State = ContestState.UnPublished},
                new Contest{Name = "c12", UserId = 2, StartTime = st1,EndTime = et1,State = ContestState.NotDownloaded},
                new Contest{Name = "c13", UserId = 2, StartTime = st1,EndTime = et1,State = ContestState.DownLoaded},
                new Contest{Name = "c21", UserId = 2, StartTime = st2,EndTime = et2,State = ContestState.UnPublished},
                new Contest{Name = "c22", UserId = 2, StartTime = st2,EndTime = et2,State = ContestState.NotDownloaded},
                new Contest{Name = "c31", UserId = 2, StartTime = st3,EndTime = et3,State = ContestState.UnPublished},
                new Contest{Name = "c32", UserId = 2, StartTime = st3,EndTime = et3,State = ContestState.NotDownloaded},
            };

            foreach (var contest in contests)
            {
                context.Add(contest);
                context.SaveChanges();
            }

            context.SaveChanges();
        }
    }
}