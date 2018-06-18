using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Services.Storage;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Services.Contest
{
    public class SubmissionService : ISubmissionService
    {
        private readonly IFileService _fileService;
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public SubmissionService(VoidJudgeContext context, IMapper mapper, IFileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<ApiResult> AddSubmissionAsync(long contestId, long problemId, long userId, AddSubmissionViewModel addSubmission)
        {
            var contest = await _context.Contests.Include(c => c.Problems).ThenInclude(p => p.Submissions).Include(c => c.Enrollments).ThenInclude(e => e.Student).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = AddSubmissionResultType.ContestNotFound };
            if (contest.ProgressState != ContestProgressState.InProgress)
            {
                return new ApiResult { Error = AddSubmissionResultType.Forbiddance };
            }

            var enrollment = contest.Enrollments.SingleOrDefault(e =>
                e.StudentId == addSubmission.StudentId && e.Student.UserId == userId);
            if (enrollment == null) return new ApiResult { Error = AddSubmissionResultType.Unauthorized };

            var problem = contest.Problems.SingleOrDefault(p => p.Id == problemId && p.Id == addSubmission.ProblemId);
            if (problem == null) return new ApiResult { Error = AddSubmissionResultType.ProblemNotFound };

            var submissions = problem.Submissions.Where(p => p.StudentId == addSubmission.StudentId).ToList();
            if (submissions.Count > 0)
            {
                foreach (var s in submissions)
                {
                    if (s.Type != SubmissionType.Binary) continue;

                    var fileResult = await _fileService.DeleteFileAsync(s.Content);
                    switch (fileResult)
                    {
                        case DeleteFileResultType.Error:
                            return new ApiResult { Error = AddSubmissionResultType.Error };
                        case DeleteFileResultType.Ok:
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
                _context.RemoveRange(submissions);
            }

            var submission = _mapper.Map<AddSubmissionViewModel, SubmissionModel>(addSubmission);
            submission.CreateTime = DateTime.Now;

            if (submission.Type == SubmissionType.Binary)
            {
                var fileResult = await _fileService.AddFileAsync(addSubmission.File, userId);
                switch (fileResult.Error)
                {
                    case AddFileResultType.Error:
                        return new ApiResult { Error = AddSubmissionResultType.Error };
                    case AddFileResultType.FileTooBig:
                        return new ApiResult { Error = AddSubmissionResultType.FileTooBig };
                    case AddFileResultType.Ok:
                        submission.Content = fileResult.Data;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            await _context.Submissions.AddAsync(submission);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = AddSubmissionResultType.Ok };
        }

        public async Task<ApiResult> GetSubmissionsFileAsync(long contestId, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Problems).ThenInclude(p => p.Submissions).ThenInclude(s => s.Student).ThenInclude(s => s.User).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetSubmissionResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = GetSubmissionResultType.Unauthorized };
            if (contest.ProgressState != ContestProgressState.Ended)
            {
                return new ApiResult { Error = GetSubmissionResultType.Forbiddance };
            }

            if (contest.State == ContestState.DownLoaded && !string.IsNullOrEmpty(contest.SubmissionsFileName))
            {
                return new GetSubmissionFileResult { Error = GetSubmissionResultType.Ok, Data = contest.SubmissionsFileName };
            }

            var zipFolders = new List<ZipFolderViewModel>();
            try
            {
                foreach (var p in contest.Problems)
                {
                    var zipFiles = new List<ZipFileViewModel>();
                    var zipFolder = new ZipFolderViewModel { ZipFolderName = p.Name, ZipFiles = zipFiles };
                    zipFiles.AddRange(p.Submissions.Select(s => new ZipFileViewModel { OriginName = s.Content, ZipName = $"{s.StudentId}-{s.Student.User.UserName}-{s.Student.Group}{Path.GetExtension(s.Content)}" }));
                    zipFolders.Add(zipFolder);
                }
            }
            catch (Exception)
            {
                return new ApiResult { Error = GetSubmissionResultType.Error };
            }

            var fileResult = await _fileService.ZipFoldersAsync(zipFolders, userId);
            switch (fileResult.Error)
            {
                case AddFileResultType.Error:
                    return new ApiResult { Error = GetSubmissionResultType.Error };
                case AddFileResultType.Ok:
                    contest.State = ContestState.DownLoaded;
                    contest.SubmissionsFileName = fileResult.Data;
                    await _context.SaveChangesAsync();
                    return new GetSubmissionFileResult { Error = GetSubmissionResultType.Ok, Data = fileResult.Data };
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task<ApiResult> GetSubmissionsInfoAsync(long contestId, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Problems).ThenInclude(p => p.Submissions).Include(c => c.Enrollments).ThenInclude(e => e.Student).ThenInclude(s => s.User).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetSubmissionResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = GetSubmissionResultType.Unauthorized };
            if (contest.ProgressState != ContestProgressState.Ended && contest.ProgressState != ContestProgressState.InProgress)
            {
                return new ApiResult { Error = GetSubmissionResultType.Forbiddance };
            }

            var submissionInfos = new List<GetSubmissionInfoViewModel>();
            foreach (var enrollment in contest.Enrollments)
            {
                if (enrollment.StudentId == null) continue;
                var submissionStates = new List<SubmissionStateViewModel>();
                var submissionInfo = new GetSubmissionInfoViewModel { Id = enrollment.Student.UserId, StudentId = enrollment.StudentId.Value, UserName = enrollment.Student.User.UserName, Group = enrollment.Student.Group, IsLogged = enrollment.Token != null, SubmissionStates = submissionStates };
                submissionStates.AddRange(from problem in contest.Problems.OrderBy(p => p.Id)
                                          let submission = problem.Submissions.SingleOrDefault(s => s.StudentId == enrollment.StudentId)
                                          select submission == null
                                              ? new SubmissionStateViewModel { ProblemName = problem.Name, IsSubmitted = false }
                                              : new SubmissionStateViewModel { ProblemName = problem.Name, IsSubmitted = true });

                submissionInfos.Add(submissionInfo);
            }

            return new GetSubmissionInfoResult { Error = GetSubmissionResultType.Ok, Data = submissionInfos };
        }
    }
}