using System.Collections.Generic;

namespace VoidJudge.Models.Contest
{
    public static class ContestResultTypes
    {
        public const string Ok = "0";
        public const string NotFound = "1";
        public const string Error = "2";
    }

    public class GetContestResult : ApiResult
    {
        public ContestInfo Data { get; set; }
    }

    public class GetsContestResult : ApiResult
    {
        public IEnumerable<ContestInfo> Data { get; set; }
    }

}