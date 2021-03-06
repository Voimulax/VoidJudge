﻿using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.Services.Storage;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Services.Contest
{
    public class ContestService : IContestService
    {
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;

        public ContestService(VoidJudgeContext context, IMapper mapper, IFileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<ApiResult> GetContestAsync(long id, RoleType roleType, long userId, string token)
        {
            switch (roleType)
            {
                case RoleType.Admin:
                    return await AdminGetContestAsync(id);
                case RoleType.Teacher:
                    return await TeacherGetContestAsync(id, userId);
                case RoleType.Student:
                    return await StudentGetContestAsync(id, userId, token);
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

        public async Task<ApiResult> AddContestAsync(TeacherContestViewModel addContest, long userId)
        {
            if (addContest.StartTime >= addContest.EndTime)
            {
                return new ApiResult { Error = AddContestResultType.Wrong };
            }
            var time = DateTime.Now;
            if (addContest.StartTime <= time || addContest.EndTime <= time)
            {
                return new ApiResult { Error = AddContestResultType.Wrong };
            }

            var owner = await _context.Teachers.SingleOrDefaultAsync(o => o.UserId == userId);

            var contest = _mapper.Map<TeacherContestViewModel, ContestModel>(addContest);
            contest.CreateTime = DateTime.Now;
            contest.OwnerId = owner.Id;
            contest.State = ContestState.UnPublished;

            await _context.Contests.AddAsync(contest);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = AddContestResultType.Ok };
        }

        public async Task<ApiResult> PutContestAsync(TeacherContestViewModel putContest, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).SingleOrDefaultAsync(c => c.Id == putContest.Id);
            if (contest == null) return new ApiResult { Error = PutContestResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = PutContestResultType.Unauthorized };

            _context.Entry(contest).State = EntityState.Modified;

            if (putContest.StartTime >= putContest.EndTime)
            {
                return new ApiResult { Error = PutContestResultType.Wrong };
            }

            if (contest.State == ContestState.UnPublished)
            {
                if (putContest.State == 1)
                {
                    var time = DateTime.Now;
                    if (putContest.StartTime <= time || putContest.EndTime <= time)
                    {
                        return new ApiResult { Error = PutContestResultType.Wrong };
                    }
                }

                contest.Name = putContest.Name;
                contest.Notice = putContest.Notice;
                contest.StartTime = putContest.StartTime;
                contest.EndTime = putContest.EndTime;
                contest.State = Enum.Parse<ContestState>(putContest.State.ToString());
            }
            else if (contest.State == ContestState.NotDownloaded)
            {

                if (contest.ProgressState == ContestProgressState.NoStarted)
                {
                    var time = DateTime.Now;
                    if (putContest.StartTime <= time || putContest.EndTime <= time)
                    {
                        return new ApiResult { Error = PutContestResultType.Wrong };
                    }
                    contest.Name = putContest.Name;
                    contest.Notice = putContest.Notice;
                    contest.StartTime = putContest.StartTime;
                    contest.EndTime = putContest.EndTime;
                    contest.State = Enum.Parse<ContestState>(putContest.State.ToString());
                }
                else if (contest.ProgressState == ContestProgressState.InProgress)
                {
                    var time = DateTime.Now;
                    if (time >= putContest.EndTime || contest.StartTime >= putContest.EndTime)
                    {
                        return new ApiResult { Error = PutContestResultType.Wrong };
                    }
                    contest.EndTime = putContest.EndTime;
                    contest.Notice = putContest.Notice;
                }
                else
                {
                    return new ApiResult { Error = PutContestResultType.Wrong };
                }
            }
            else
            {
                return new ApiResult { Error = PutContestResultType.Wrong };
            }

            try
            {
                await _context.SaveChangesAsync();
                return new ApiResult { Error = PutContestResultType.Ok };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new ApiResult { Error = PutContestResultType.ConcurrencyException };
            }
        }

        public async Task<ApiResult> DeleteContestAsync(long id, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).SingleOrDefaultAsync(c => c.Id == id);
            if (contest == null) return new ApiResult { Error = DeleteContestResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = DeleteContestResultType.Unauthorized };
            switch (contest.State)
            {
                case ContestState.NotDownloaded:
                    switch (contest.ProgressState)
                    {
                        case ContestProgressState.NoStarted:
                            _context.Contests.Remove(contest);
                            await _context.SaveChangesAsync();
                            return new ApiResult { Error = DeleteContestResultType.Ok };
                        case ContestProgressState.InProgress:
                            return new ApiResult { Error = DeleteContestResultType.Forbiddance };
                        case ContestProgressState.UnPublished:
                        case ContestProgressState.Ended:
                        default:
                            return new ApiResult { Error = DeleteContestResultType.Forbiddance };
                    }
                case ContestState.UnPublished:
                    _context.Contests.Remove(contest);
                    await _context.SaveChangesAsync();
                    return new ApiResult { Error = DeleteContestResultType.Ok };
                case ContestState.DownLoaded:
                    return new ApiResult { Error = DeleteContestResultType.Forbiddance };
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task<ApiResult> ClearContestAsync(long id)
        {
            var contest = await _context.Contests.Include(c => c.Problems).ThenInclude(p => p.Submissions).SingleOrDefaultAsync(c => c.Id == id);
            if (contest == null) return new ApiResult { Error = DeleteContestResultType.ContestNotFound };

            if (contest.State == ContestState.DownLoaded)
            {
                if (!string.IsNullOrEmpty(contest.SubmissionsFileName))
                {
                    var fileResult = await _fileService.DeleteFileAsync(contest.SubmissionsFileName);
                    if(fileResult == DeleteFileResultType.Error) return new ApiResult { Error = DeleteContestResultType.Error };
                }

                foreach (var problem in contest.Problems)
                {
                    foreach (var submission in problem.Submissions)
                    {
                        if (submission.Type != SubmissionType.Binary) continue;
                        var fileResultS = await _fileService.DeleteFileAsync(submission.Content);
                        if (fileResultS == DeleteFileResultType.Error) return new ApiResult { Error = DeleteContestResultType.Error };
                    }
                    _context.Submissions.RemoveRange(problem.Submissions);
                    if (problem.Type != ProblemType.TestPaper) continue;
                    var fileResultP = await _fileService.DeleteFileAsync(problem.Content);
                    if (fileResultP == DeleteFileResultType.Error) return new ApiResult { Error = DeleteContestResultType.Error };
                }
                _context.Problems.RemoveRange(contest.Problems);
                _context.Contests.Remove(contest);
                await _context.SaveChangesAsync();

                return new ApiResult { Error = DeleteContestResultType.Ok };
            }
            else
            {
                return new ApiResult { Error = DeleteContestResultType.Forbiddance };
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
                    Error = GetContestResultType.Ok,
                    Data = _mapper.Map<ContestModel, AdminContestViewModel>(c)
                }).SingleOrDefaultAsync();
            return contest ?? new GetContestResult { Error = GetContestResultType.ContestNotFound };
        }

        private async Task<ApiResult> AdminGetContestsAsync()
        {
            var contests = await _context.Contests
                .Where(c => c.State == ContestState.DownLoaded)
                .Include(c => c.Owner)
                .ThenInclude(o => o.User)
                .Select(c => _mapper.Map<ContestModel, AdminContestViewModel>(c))
                .ToListAsync();
            return contests.Count == 0 ?
                new GetsContestResult<AdminContestViewModel> { Error = GetContestResultType.ContestNotFound } :
                new GetsContestResult<AdminContestViewModel> { Error = GetContestResultType.Ok, Data = contests };
        }

        private async Task<ApiResult> TeacherGetContestAsync(long id, long userId)
        {
            var contest = await _context.Contests
                .Include(c => c.Owner)
                .Where(c => c.Id == id && c.Owner.UserId == userId)
                .Select(c => new GetContestResult
                {
                    Error = GetContestResultType.Ok,
                    Data = _mapper.Map<ContestModel, TeacherContestViewModel>(c)
                }).SingleOrDefaultAsync();
            return contest ?? new GetContestResult { Error = GetContestResultType.ContestNotFound };
        }

        private async Task<ApiResult> TeacherGetContestsAsync(long userId)
        {
            var contests = await _context.Contests
                .Include(c => c.Owner)
                .Where(c => c.Owner.UserId == userId)
                .Select(c => _mapper.Map<ContestModel, TeacherContestViewModel>(c)).ToListAsync();
            return contests.Count == 0 ?
                new GetsContestResult<TeacherContestViewModel> { Error = GetContestResultType.ContestNotFound } :
                new GetsContestResult<TeacherContestViewModel> { Error = GetContestResultType.Ok, Data = contests };
        }

        private async Task<ApiResult> StudentGetContestAsync(long id, long userId, string token)
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
            if (enrollment == null) return new GetContestResult { Error = GetContestResultType.ContestNotFound };

            if (enrollment.Contest.ProgressState == ContestProgressState.InProgress)
            {
                if (!string.IsNullOrEmpty(enrollment.Token))
                {
                    if (enrollment.Token != token)
                    {
                        return new GetContestResult { Error = GetContestResultType.InvaildToken };
                    }
                }
                else
                {
                    enrollment.Token = token;
                    await _context.SaveChangesAsync();
                }
            }

            var contest = _mapper.Map<ContestModel, StudentContestViewModel>(enrollment.Contest);
            return contest == null ? new GetContestResult { Error = GetContestResultType.ContestNotFound } : new GetContestResult { Error = GetContestResultType.Ok, Data = contest };
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
            if (enrollments.Count == 0) return new GetsContestResult<StudentContestViewModel> { Error = GetContestResultType.ContestNotFound };
            var contests = enrollments.Select(cs => _mapper.Map<ContestModel, StudentContestViewModel>(cs.Contest)).ToList();
            return new GetsContestResult<StudentContestViewModel> { Error = GetContestResultType.Ok, Data = contests };
        }
    }
}