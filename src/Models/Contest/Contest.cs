using System;

namespace VoidJudge.Models.Contest
{
    public enum ContestState
    {
        NoOver, NoDownload, Over
    }

    public class Contest
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ContestState State { get; set; }
    }
}