namespace VoidJudge.Models.Contest
{
    public enum SubmissionType
    {
        Binary, Text
    }

    public class Submission
    {
        public long Id { get; set; }
        public long ContestId { get; set; }
        public long UserId { get; set; }
        public string Type { get; set; }
        public SubmissionType Value { get; set; }
    }
}