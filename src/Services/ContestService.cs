using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models;
using VoidJudge.Models.Auth;
using VoidJudge.Models.Contest;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public class ContestService : IContestService
    {
        private readonly VoidJudgeContext _context;
        private readonly IUserService _userService;

        public ContestService(VoidJudgeContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<ApiResult> GetContestAsync(long id, string roleType, long userId)
        {
            switch (roleType)
            {
                case RoleTypes.Admin:
                    return await AdminGetContestAsync(id);
                case RoleTypes.Teacher:
                    return await TeacherGetContestAsync(id, userId);
                case RoleTypes.Student:
                    return await StudentGetContestAsync(id, userId);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task<ApiResult> GetContestsAsync(string roleType, long userId)
        {
            switch (roleType)
            {
                case RoleTypes.Admin:
                    return await AdminGetContestsAsync();
                case RoleTypes.Teacher:
                    return await TeacherGetContestsAsync(userId);
                case RoleTypes.Student:
                    return await StudentGetContestsAsync(userId);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task<ApiResult> GetSubmissionsAsync(long contestId, long userId)
        {
            throw new NotImplementedException();
        }

        private async Task<ApiResult> AdminGetContestAsync(long id)
        {
            var contest = await (from c in _context.Contests
                                 where c.State == ContestState.DownLoaded && c.Id == id
                                 join u in _context.Users on c.UserId equals u.Id
                                 select new GetContestResult
                                 {
                                     Error = ContestResultTypes.Ok,
                                     Data = new ContestInfo
                                     {
                                         BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                         ClaimInfos = new[]
                                         {
                                            new ContestClaimInfo{Type = ContestClaimTypes.AuthorName, Value = u.UserName}
                                         }
                                     }
                                 }).SingleOrDefaultAsync();
            if (contest == null) return new GetContestResult { Error = ContestResultTypes.NotFound };
            return contest;
        }

        private async Task<ApiResult> AdminGetContestsAsync()
        {
            var contests = await (from c in _context.Contests
                                  where c.State == ContestState.DownLoaded
                                  join u in _context.Users on c.UserId equals u.Id
                                  select new ContestInfo
                                  {
                                      BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                      ClaimInfos = new[]
                                      {
                                          new ContestClaimInfo{Type = ContestClaimTypes.AuthorName, Value = u.UserName}
                                      }
                                  }).ToListAsync();
            if (contests.Count == 0) return new GetsContestResult { Error = ContestResultTypes.NotFound };
            return new GetsContestResult { Error = ContestResultTypes.Ok, Data = contests };
        }

        private async Task<ApiResult> TeacherGetContestAsync(long id, long userId)
        {
            var contest = await (from c in _context.Contests
                                 where c.UserId == userId && c.Id == id
                                 join u in _context.Users on c.UserId equals u.Id
                                 select new GetContestResult
                                 {
                                     Error = ContestResultTypes.Ok,
                                     Data = new ContestInfo
                                     {
                                         BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                         ClaimInfos = new[]
                                         {
                                            new ContestClaimInfo{Type = ContestClaimTypes.Notice, Value = c.Notice},
                                            new ContestClaimInfo{Type = ContestClaimTypes.State, Value = $"{(int)c.State}"}
                                         }
                                     }
                                 }).SingleOrDefaultAsync();
            if (contest == null) return new GetContestResult { Error = ContestResultTypes.NotFound };
            contest.Data.UserInfos = await GetContestUserInfosAsync(contest.Data.BasicInfo.Id);
            return contest;
        }

        private async Task<ApiResult> TeacherGetContestsAsync(long userId)
        {
            var contests = await (from c in _context.Contests
                                  where c.UserId == userId
                                  join u in _context.Users on c.UserId equals u.Id
                                  select new ContestInfo
                                  {
                                      BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                      ClaimInfos = new[]
                                      {
                                        new ContestClaimInfo{Type = ContestClaimTypes.State, Value = $"{(int)c.State}"}
                                      }
                                  }).ToListAsync();
            if (contests.Count == 0) return new GetsContestResult { Error = ContestResultTypes.NotFound };
            return new GetsContestResult { Error = ContestResultTypes.Ok, Data = contests };
        }

        private async Task<ApiResult> StudentGetContestAsync(long id, long userId)
        {
            var contest = await (from c in _context.Contests
                                 where c.Id == id && c.State == ContestState.NotDownloaded
                                 join cu in _context.ContestUsers on c.Id equals cu.ContestId
                                 join u in _context.Users on c.UserId equals u.Id
                                 select new ContestInfo
                                 {
                                     BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                     ClaimInfos = new[]
                                     {
                                          new ContestClaimInfo{Type = ContestClaimTypes.AuthorName, Value = u.UserName},
                                          new ContestClaimInfo{Type = ContestClaimTypes.Notice, Value = c.Notice}
                                      }
                                 }).SingleOrDefaultAsync();
            if (contest == null) return new GetContestResult { Error = ContestResultTypes.NotFound };
            return new GetContestResult { Error = ContestResultTypes.Ok, Data = contest };
        }

        private async Task<ApiResult> StudentGetContestsAsync(long userId)
        {
            var contests = await (from c in _context.Contests
                                  where c.State == ContestState.NotDownloaded
                                  join cu in _context.ContestUsers on c.Id equals cu.ContestId
                                  join u in _context.Users on c.UserId equals u.Id
                                  select new ContestInfo
                                  {
                                      BasicInfo = new ContestBasicInfo { Id = c.Id, Name = c.Name, StartTime = c.StartTime, EndTime = c.EndTime },
                                      ClaimInfos = new[]
                                      {
                                          new ContestClaimInfo{Type = ContestClaimTypes.AuthorName, Value = u.UserName},
                                          new ContestClaimInfo{Type = ContestClaimTypes.Notice, Value = c.Notice}
                                      }
                                  }).ToListAsync();
            if (contests.Count == 0) return new GetsContestResult { Error = ContestResultTypes.NotFound };
            return new GetsContestResult { Error = ContestResultTypes.Ok, Data = contests };
        }

        private async Task<IEnumerable<ContestUserInfo>> GetContestUserInfosAsync(long contestId)
        {
            var userIds = await (from c in _context.ContestUsers
                                 where c.Id == contestId
                                 select c.UserId).ToListAsync();

            var users = new ConcurrentBag<UserInfo<GetUserBasicInfo>>();
            var tasks = new List<Task>();
            foreach (var id in userIds)
            {
                var iid = id;
                tasks.Add(Task.Run(async () =>
                {
                    if (!(await _userService.GetUserAsync(iid) is GetUserResult res)) return;
                    if (res.Error == GetResultTypes.Ok) users.Add(res.Data);
                }));
            }
            foreach (var task in tasks)
            {
                await task;
            }

            var result = (from u in users
                          select new ContestUserInfo
                          {
                              Id = u.BasicInfo.Id,
                              LoginName = u.BasicInfo.LoginName,
                              UserName = u.BasicInfo.UserName,
                              Group = u.ClaimInfos.ToArray()[0].Value
                          }).ToList();
            return result.Count == 0 ? null : result;
        }
    }
}