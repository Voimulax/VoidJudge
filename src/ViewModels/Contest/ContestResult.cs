using System.Collections.Generic;
using VoidJudge.ViewModels;

namespace VoidJudge.ViewModels.Contest
{
    public enum ContestResultType
    {
        Ok,
        NotFound,
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

}