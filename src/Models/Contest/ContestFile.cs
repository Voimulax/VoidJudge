namespace VoidJudge.Models.Contest
{
    public enum ContestFileType
    {
        TestPaper, AnswerSheet
    }

    public class ContestFile
    {
        public long Id { get; set; }
        public long ContestId { get; set; }
        public long UserId { get; set; }
        public string UploadName { get; set; }
        public string SaveName { get; set; }
        public ContestFileType Type { get; set; }
    }
}