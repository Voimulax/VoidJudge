using System;

namespace VoidJudge.Models.Contest
{
    public enum ContestState
    {
        UnPublished, NoDownload, Over
    }

    public class Contest
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Notice { get; set; }
        public ContestState State { get; set; }
    }
}