using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public class UserService : IUserService
    {
        private readonly VoidJudgeContext _context;

        public UserService(VoidJudgeContext context)
        {
            _context = context;
        }

        public async Task<AddUserResult> AddUsers(IEnumerable<User<AddUserBasicInfo>> addUsers)
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
                            Password = u.BasicInfo.Password,
                            CreateTime = time
                        };

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            IEnumerable<ClaimWithLoginName> claimWithLoginNames = new List<ClaimWithLoginName>();
            claimWithLoginNames = addUsers.Aggregate(claimWithLoginNames, (current, cu) => current.Concat(GetClaimWithLoginNames(cu)));

            var userClaims = (from cwl in claimWithLoginNames
                              join c in _context.Claims on cwl.Type equals c.Type
                              join u in _context.Users on cwl.LoginName equals u.LoginName
                              select new UserClaim { UserId = u.Id, ClaimId = c.Id, Value = cwl.Value }).ToList();

            if (userClaims.Count != claimWithLoginNames.Count())
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

        public async Task<User<IdUserBasicInfo>> GetUser(long id, string roleCode)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;
            var role = await (from ur in _context.UserRoles
                              where user.Id == ur.UserId
                              join r in _context.Roles on ur.RoleId equals r.Id
                              select r).FirstOrDefaultAsync();

            if (roleCode == "2" && role.Code != roleCode) return null;
            if (roleCode == "1" && role.Code == "2") return null;

            var claims = await (from uc in _context.UserClaims
                                where uc.UserId == user.Id
                                join u in _context.Users on uc.UserId equals u.Id
                                join c in _context.Claims on uc.ClaimId equals c.Id
                                select new UserClaimInfo { Type = c.Type, Value = uc.Value }).ToListAsync();

            return new User<IdUserBasicInfo>
            {
                BasicInfo = new IdUserBasicInfo { Id = user.Id, LoginName = user.LoginName, UserName = user.UserName },
                RoleCode = role.Code,
                ClaimInfos = claims
            };
        }

        public async Task<IEnumerable<User<IdUserBasicInfo>>> GetUsers(string roleCode)
        {
            var role = CheckRoleCode(roleCode);
            if (role == null) return null;
            var userIds = await (from ur in _context.UserRoles
                                 where ur.RoleId == role.Id
                                 select ur.UserId).ToListAsync();

            var users = new ConcurrentBag<User<IdUserBasicInfo>>();
            foreach (var id in userIds)
            {
                users.Add(await GetUser(id, roleCode));
            }

            return users.ToList();
        }

        public async Task<PutResult> PutUser(User<IdUserBasicInfo> putUser)
        {
            var user = await _context.Users.FindAsync(putUser.BasicInfo.Id);
            if (user == null) return PutResult.UserNotFound;

            var userRole = _context.UserRoles.FirstOrDefault(x => x.UserId == user.Id);
            if (userRole == null) return PutResult.Error;

            var userClaims = (from pc in putUser.ClaimInfos
                              join uc in _context.UserClaims on user.Id equals uc.UserId
                              join c in _context.Claims on uc.ClaimId equals c.Id
                              where c.Type == pc.Type
                              select uc).ToList();
            if (userClaims.Count() != putUser.ClaimInfos.Count()) return PutResult.Error;

            user.LoginName = putUser.BasicInfo.LoginName;
            user.UserName = putUser.BasicInfo.UserName;

            userRole.RoleId = _context.Roles.FirstOrDefault(x => x.Code == putUser.RoleCode).Id;

            foreach (var userClaim in userClaims)
            {
                userClaim.Value = (from pc in putUser.ClaimInfos
                                   join c in _context.Claims on pc.Type equals c.Type
                                   where c.Id == userClaim.ClaimId
                                   select pc.Value).FirstOrDefault();
            }

            _context.Entry(user).State = EntityState.Modified;
            _context.Entry(userRole).State = EntityState.Modified;
            foreach (var userClaim in userClaims)
            {
                _context.Entry(userClaim).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
                return PutResult.Ok;
            }
            catch (DbUpdateConcurrencyException)
            {
                return PutResult.ConcurrencyException;
            }
        }

        public async Task<DeleteResult> DeleteUser(long id)
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

        public bool CheckAuth(IEnumerable<System.Security.Claims.Claim> claims, string roleCode)
        {
            var claim = claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);
            if (claim == null) return false;
            var role = _context.Roles.FirstOrDefault(x => x.Name == claim.Value);
            if (role == null) return false;
            var r = CheckRoleCode(roleCode);
            if (r == null) return false;
            return int.Parse(roleCode) >= int.Parse(role.Code);
        }

        public Role CheckRoleCode(string roleCode)
        {
            return _context.Roles.FirstOrDefault(x => x.Code == roleCode);
        }

        private class ClaimWithLoginName
        {
            public string LoginName { get; set; }
            public string Type { get; set; }
            public string Value { get; set; }
        }

        private class RoleCodeWithLoginName
        {
            public string LoginName { get; set; }
            public string RoleCode { get; set; }
        }

        private static IEnumerable<ClaimWithLoginName> GetClaimWithLoginNames(User<AddUserBasicInfo> addUser)
        {
            if (addUser.ClaimInfos == null) return new List<ClaimWithLoginName>();
            var loginName = addUser.BasicInfo.LoginName;
            return addUser.ClaimInfos.Select(x =>
                new ClaimWithLoginName { LoginName = loginName, Type = x.Type, Value = x.Value });
        }

        private static RoleCodeWithLoginName GetRoleCodeWithLoginNames(User<AddUserBasicInfo> addUser)
        {
            if (addUser.RoleCode == null) return null;
            var loginName = addUser.BasicInfo.LoginName;
            return new RoleCodeWithLoginName { LoginName = addUser.BasicInfo.LoginName, RoleCode = addUser.RoleCode };
        }
    }
}