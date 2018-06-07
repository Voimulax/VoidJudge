namespace VoidJudge.Models.Auth
{
    public class UserClaim
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long ClaimId { get; set; }
        public string Value { get; set; }
    }
}