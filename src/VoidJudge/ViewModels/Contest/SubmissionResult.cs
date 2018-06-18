using System.Collections.Generic;

namespace VoidJudge.ViewModels.Contest
{
    public enum AddSubmissionResultType
    {
        Ok, Unauthorized, ContestNotFound, ProblemNotFound, Forbiddance, FileTooBig, Wrong, Error
    }
    public enum GetSubmissionResultType
    {
        Ok, Unauthorized, ContestNotFound, Forbiddance, Error
    }

    public class GetSubmissionFileResult : ApiResult
    {
        public string Data { get; set; }
    }

    public class GetSubmissionInfoResult : ApiResult
    {
        public IList<GetSubmissionInfoViewModel> Data { get; set; }
    }
}