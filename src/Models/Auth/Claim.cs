namespace VoidJudge.Models.Auth
{
    public static class ClaimTypes
    {
        public const string Group = "group";
        public const string IPAddress = "ipAddress";
    }

    public class Claim
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}