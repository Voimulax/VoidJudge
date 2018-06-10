using System;

namespace VoidJudge.Models.Contest
{
    public enum ContestState
    {
        UnPublished, NotDownloaded, DownLoaded
    }

    public class Contest
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Notice { get; set; }
        public ContestState State { get; set; }
    }
}