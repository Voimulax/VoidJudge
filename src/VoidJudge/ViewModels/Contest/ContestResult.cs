using System.Collections.Generic;

namespace VoidJudge.ViewModels.Contest
{
    public enum GetContestResultType
    {
        Ok,
        ContestNotFound,
        InvaildToken,
        Error
    }

    public class GetContestResult : ApiResult
    {
        public ContestViewModel Data { get; set; }
    }

    public class GetsContestResult<T> : ApiResult where T : ContestViewModel
    {
        public IList<T> Data { get; set; }
    }

    public enum AddContestResultType
    {
        Ok,
        Wrong,
        Error
    }

    public enum PutContestResultType
    {
        Ok,
        Unauthorized,
        ConcurrencyException,
        ContestNotFound,
        Wrong,
        Error
    }

    public enum DeleteContestResultType
    {
        Ok,
        Unauthorized,
        Forbiddance,
        ContestNotFound,
        Error
    }
}