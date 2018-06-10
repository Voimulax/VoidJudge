namespace VoidJudge.Models.Contest
{
    public class ContestUser
    {
        public long Id { get; set; }
        public long ContestId { get; set; }
        public long UserId { get; set; }
        public string UserToken { get; set; }
    }
}