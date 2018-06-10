using System;
using System.Collections.Generic;

namespace VoidJudge.Models.Contest
{
    public static class ContestClaimTypes
    {
        public const string AuthorName = "authorName";
        public const string Notice = "notice";
        public const string State = "state";
    }

    public class ContestClaimInfo
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class ContestBasicInfo
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class ContestInfo
    {
        public ContestBasicInfo BasicInfo { get; set; }
        public IEnumerable<ContestClaimInfo> ClaimInfos { get; set; } = null;
    }
}