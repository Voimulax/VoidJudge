namespace VoidJudge.Models.Auth
{
    public enum LoginType
    {
        Ok, Wrong, Error
    }

    public class LoginResult
    {
        public LoginType Type { get; set; }
        public string Token { get; set; } = null;
    }
}