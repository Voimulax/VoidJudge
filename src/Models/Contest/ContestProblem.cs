namespace VoidJudge.Models.Contest
{
    public enum ContestProblemType
    {
        TestPaper, Judge
    }

    public class ContestProblem
    {
        public long Id { get; set; }
        public long ContestId { get; set; }
        public string Name { get; set; }
        public ContestProblemType Type { get; set; }
        public string Content { get; set; }
    }
}