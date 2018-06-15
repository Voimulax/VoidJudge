using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services
{
    public class ContestService : IContestService
    {
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public ContestService(VoidJudgeContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResult> GetContestAsync(long id, RoleType roleType, long userId)
        {
            switch (roleType)
            {
                case RoleType.Admin:
                    return await AdminGetContestAsync(id);
                case RoleType.Teacher:
                    return await TeacherGetContestAsync(id, userId);
                case RoleType.Student:
                    return await StudentGetContestAsync(id, userId);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task<ApiResult> GetContestsAsync(RoleType roleType, long userId)
        {
            switch (roleType)
            {
                case RoleType.Admin:
                    return await AdminGetContestsAsync();
                case RoleType.Teacher:
                    return await TeacherGetContestsAsync(userId);
                case RoleType.Student:
                    return await StudentGetContestsAsync(userId);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private async Task<ApiResult> AdminGetContestAsync(long id)
        {
            var contest = await _context.Contests
                .Where(c => c.State == ContestState.DownLoaded && c.Id == id)
                .Include(c => c.Owner)
                    .ThenInclude(o => o.User)
                .Select(c => new GetContestResult
                {
                    Error = ContestResultType.Ok,
                    Data = _mapper.Map<Contest, AdminContestViewModel>(c)
                }).SingleOrDefaultAsync();
            return contest ?? new GetContestResult { Error = ContestResultType.NotFound };
        }

        private async Task<ApiResult> AdminGetContestsAsync()
        {
            var contests = await _context.Contests
                .Where(c => c.State == ContestState.DownLoaded)
                .Include(c => c.Owner)
                .ThenInclude(o => o.User)
                .Select(c => _mapper.Map<Contest, AdminContestViewModel>(c))
                .ToListAsync();
            return contests.Count == 0 ?
                new GetsContestResult<AdminContestViewModel> { Error = ContestResultType.NotFound } :
                new GetsContestResult<AdminContestViewModel> { Error = ContestResultType.Ok, Data = contests };
        }

        private async Task<ApiResult> TeacherGetContestAsync(long id, long userId)
        {
            var contest = await _context.Contests
                .Include(c => c.Owner)
                .Where(c => c.Id == id && c.Owner.UserId == userId)
                .Select(c => new GetContestResult
                {
                    Error = ContestResultType.Ok,
                    Data = _mapper.Map<Contest, TeacherContestViewModel>(c)
                }).SingleOrDefaultAsync();
            return contest ?? new GetContestResult { Error = ContestResultType.NotFound };
        }

        private async Task<ApiResult> TeacherGetContestsAsync(long userId)
        {
            var contests = await _context.Contests
                .Include(c => c.Owner)
                .Where(c => c.Owner.UserId == userId)
                .Select(c => _mapper.Map<Contest, TeacherContestViewModel>(c)).ToListAsync();
            return contests.Count == 0 ?
                new GetsContestResult<TeacherContestViewModel> { Error = ContestResultType.NotFound } :
                new GetsContestResult<TeacherContestViewModel> { Error = ContestResultType.Ok, Data = contests };
        }

        private async Task<ApiResult> StudentGetContestAsync(long id, long userId)
        {
            var enrollment = await _context.Enrollments
                .Where(e => e.ContestId == id)
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Contest)
                    .ThenInclude(c => c.Owner)
                        .ThenInclude(o => o.User)
                .Where(e => e.Student.UserId == userId && e.Contest.State != ContestState.UnPublished)
                .SingleOrDefaultAsync();
            if (enrollment == null) return new GetContestResult { Error = ContestResultType.NotFound };
            var contest = _mapper.Map<Contest, StudentContestViewModel>(enrollment.Contest);
            return contest == null ? new GetContestResult { Error = ContestResultType.NotFound } : new GetContestResult { Error = ContestResultType.Ok, Data = contest };
        }

        private async Task<ApiResult> StudentGetContestsAsync(long userId)
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Contest)
                    .ThenInclude(c => c.Owner)
                        .ThenInclude(o => o.User)
                .Where(e => e.Student.UserId == userId && e.Contest.State != ContestState.UnPublished)
                .ToListAsync();
            if (enrollments.Count == 0) return new GetsContestResult<StudentContestViewModel> { Error = ContestResultType.NotFound };
            var contests = enrollments.Select(cs => _mapper.Map<Contest, StudentContestViewModel>(cs.Contest)).ToList();
            return new GetsContestResult<StudentContestViewModel> { Error = ContestResultType.Ok, Data = contests };
        }
    }
}