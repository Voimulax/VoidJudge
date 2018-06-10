using System;
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

        public ContestService(VoidJudgeContext context)
        {
            _context = context;
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
            if (contest == null) return new GetUserResult { Error = ContestResultTypes.NotFound };
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
            if (contests.Count == 0) return new GetUserResult { Error = ContestResultTypes.NotFound };
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
                                            new ContestClaimInfo{Type = ContestClaimTypes.State, Value = $"{(int)c.State}"}
                                         }
                                     }
                                 }).SingleOrDefaultAsync();
            if (contest == null) return new GetUserResult { Error = ContestResultTypes.NotFound };
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
            if (contests.Count == 0) return new GetUserResult { Error = ContestResultTypes.NotFound };
            return new GetsContestResult { Error = ContestResultTypes.Ok, Data = contests };
        }

        private async Task<ApiResult> StudentGetContestAsync(long id, long userId)
        {
            throw new System.NotImplementedException();
        }

        private async Task<ApiResult> StudentGetContestsAsync(long userId)
        {
            throw new System.NotImplementedException();
        }
    }
}