using VoidJudge.Models.Auth;

namespace VoidJudge.Services.Auth
{
    public interface IAuthService
    {
        LoginResult Login(LoginUser loginUser, string ipAddress);
        AuthResult ResetPassword(ResetUser resetUser);
    }
}