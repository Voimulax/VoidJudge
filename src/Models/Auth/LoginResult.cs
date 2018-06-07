namespace VoidJudge.Models.Auth
{
    public enum AuthResult
    {
        Ok, Wrong, Error
    }

    public class LoginResult
    {
        public AuthResult Type { get; set; }
        public string Token { get; set; } = null;
    }
}