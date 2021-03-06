﻿using System.Threading.Tasks;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public interface ISubmissionService
    {
        Task<ApiResult> AddSubmissionAsync(long contestId, long problemId, long userId, AddSubmissionViewModel addSubmission);
        Task<ApiResult> GetSubmissionsFileAsync(long contestId, long userId);
        Task<ApiResult> GetSubmissionsInfoAsync(long contestId, long userId);
    }
}