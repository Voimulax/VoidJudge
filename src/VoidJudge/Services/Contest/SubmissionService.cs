﻿using System;
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
    }
}