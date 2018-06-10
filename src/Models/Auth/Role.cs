namespace VoidJudge.Models.Auth
{
    public static class RoleTypes
    {
        public const string Admin = "0";
        public const string Teacher = "1";
        public const string Student = "2";
    }

    public class Role
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}