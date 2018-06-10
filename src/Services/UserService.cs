using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public class UserService : IUserService
    {
        private readonly VoidJudgeContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IAuthService _authService;

        public UserService(VoidJudgeContext context, PasswordHasher<User> passwordHasher, IAuthService authService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _authService = authService;
        }

        public async Task<AddUserResult> AddUsersAsync(IEnumerable<User<AddUserBasicInfo>> addUsers)
        {
            addUsers = addUsers.ToList();

            var repeat = await (from u in _context.Users
                                from cu in addUsers
                                where u.LoginName == cu.BasicInfo.LoginName
                                select new AddResultUser { LoginName = u.LoginName }).ToListAsync();

            if (repeat.Any())
            {
                return new AddUserResult { Type = AddResult.Repeat, Repeat = repeat };
            }

            var time = DateTime.Now;
            var users = from u in addUsers
                        select new User
                        {
                            LoginName = u.BasicInfo.LoginName,
                            UserName = u.BasicInfo.UserName,
                            Password = _passwordHasher.HashPassword(null, u.BasicInfo.Password),
                            CreateTime = time
                        };

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            var userClaims = (from au in addUsers
                              where au.ClaimInfos != null
                              from uc in au.ClaimInfos
                              join c in _context.Claims on uc.Type equals c.Type
                              join u in _context.Users on au.BasicInfo.LoginName equals u.LoginName
                              select new UserClaim { UserId = u.Id, ClaimId = c.Id, Value = uc.Value }).ToList();

            if (userClaims.Count != addUsers.Sum(x => x.ClaimInfos?.Count() ?? 0))
            {
                return new AddUserResult { Type = AddResult.Error };
            }

            await _context.UserClaims.AddRangeAsync(userClaims);
            await _context.SaveChangesAsync();

            var userRoles = (from au in addUsers
                             join r in _context.Roles on au.RoleCode equals r.Code
                             join u in _context.Users on au.BasicInfo.LoginName equals u.LoginName
                             select new UserRole { UserId = u.Id, RoleId = r.Id }).ToList();
            if (userRoles.Count != addUsers.Count())
            {
                return new AddUserResult { Type = AddResult.Error };
            }

            await _context.UserRoles.AddRangeAsync(userRoles);
            await _context.SaveChangesAsync();

            return new AddUserResult { Type = AddResult.Ok };
        }

        public async Task<GetUserResult> GetUserAsync(long id, string roleCode = null)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new GetUserResult { Type = GetResult.UserNotFound };
            var role = await (from ur in _context.UserRoles
                              where user.Id == ur.UserId
                              join r in _context.Roles on ur.RoleId equals r.Id
                              select r).FirstOrDefaultAsync();

            if (roleCode != null && !_authService.CompareRoleAuth(roleCode, role.Code))

            {
                return new GetUserResult { Type = GetResult.Unauthorized };
            }

            var userClaims = await (from uc in _context.UserClaims
                                    where uc.UserId == user.Id
                                    join u in _context.Users on uc.UserId equals u.Id
                                    join c in _context.Claims on uc.ClaimId equals c.Id
                                    select new UserClaimInfo { Type = c.Type, Value = uc.Value }).ToListAsync();

            return new GetUserResult
            {
                Type = GetResult.Ok,
                User = new User<GetUserBasicInfo>
                {
                    BasicInfo =
                        new GetUserBasicInfo { Id = user.Id, LoginName = user.LoginName, UserName = user.UserName },
                    RoleCode = role.Code,
                    ClaimInfos = userClaims
                }
            };
        }

        public async Task<IEnumerable<User<GetUserBasicInfo>>> GetUsersAsync(IEnumerable<string> roleCodes)
        {
            var roles = await GetRolesAsync(roleCodes);
            if (roles == null) return null;
            var userIds = await (from ur in _context.UserRoles
                                 join r in roles on ur.RoleId equals r.Id
                                 where ur.RoleId == r.Id
                                 select ur.UserId).ToListAsync();

            var users = new ConcurrentBag<User<GetUserBasicInfo>>();
            var tasks = new List<Task>();
            foreach (var id in userIds)
            {
                var iid = id;
                tasks.Add(Task.Run(async () =>
                {
                    var result = await GetUserAsync(iid);
                    if (result.Type == GetResult.Ok) users.Add((result.User));
                }));
            }
            foreach (var task in tasks)
            {
                await task;
            }

            return users.ToList();
        }

        public async Task<PutUserResult> PutUserAsync(User<PutUserBasicInfo> putUser)
        {
            var user = await _context.Users.FindAsync(putUser.BasicInfo.Id);
            if (user == null) return new PutUserResult { Type = PutResult.UserNotFound };

            user.LoginName = putUser.BasicInfo.LoginName;
            user.UserName = putUser.BasicInfo.UserName;
            if (putUser.BasicInfo.Password != null)
            {
                putUser.BasicInfo.Password = GetRandomPassword();
                user.Password = _passwordHasher.HashPassword(user, putUser.BasicInfo.Password);
            }

            if (putUser.RoleCode != null)
            {
                var userRole = _context.UserRoles.FirstOrDefault(x => x.UserId == user.Id);
                if (userRole == null) return new PutUserResult { Type = PutResult.Error };

                var role = await _authService.CheckRoleCodeAsync(putUser.RoleCode);
                if (role == null) return new PutUserResult { Type = PutResult.Error };

                userRole.RoleId = role.Id;

                _context.Entry(userRole).State = EntityState.Modified;
            }

            if (putUser.ClaimInfos != null)
            {
                var userClaims = (from pc in putUser.ClaimInfos
                    join uc in _context.UserClaims on user.Id equals uc.UserId
                    join c in _context.Claims on uc.ClaimId equals c.Id
                    where c.Type == pc.Type
                    select uc).ToList();
                if (userClaims.Count() != putUser.ClaimInfos.Count()) return new PutUserResult { Type = PutResult.Error };

                foreach (var userClaim in userClaims)
                {
                    userClaim.Value = (from pc in putUser.ClaimInfos
                        join c in _context.Claims on pc.Type equals c.Type
                        where c.Id == userClaim.ClaimId
                        select pc.Value).FirstOrDefault();
                }

                foreach (var userClaim in userClaims)
                {
                    _context.Entry(userClaim).State = EntityState.Modified;
                }
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return new PutUserResult { Type = PutResult.Ok, User = putUser };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new PutUserResult { Type = PutResult.ConcurrencyException };
            }
        }

        public async Task<DeleteResult> DeleteUserAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return DeleteResult.UserNotFound;
            }

            var userRole = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == id);
            _context.UserRoles.Remove(userRole);
            var userClaims = await _context.UserClaims.Where(x => x.UserId == id).ToListAsync();
            _context.UserClaims.RemoveRange(userClaims);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return DeleteResult.Ok;
        }

        private static string GetRandomPassword()
        {
            var r = new Random();
            var res = new List<int>();
            for (var i = 0; i < 6; i++)
            {
                res.Add(r.Next(10));
            }
            return string.Join("", res);
        }

        private async Task<IEnumerable<Role>> GetRolesAsync(IEnumerable<string> roleCodes)
        {
            try
            {
                var codes = roleCodes.ToList();
                var ts = codes.Select(async x => await _authService.CheckRoleCodeAsync(x));
                var roles=new List<Role>();
                foreach (var t in ts)
                {
                    roles.Add(await t);
                }
                return roles.Count != codes.Count ? null : roles;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}