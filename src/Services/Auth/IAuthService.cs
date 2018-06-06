using VoidJudge.Models;

namespace VoidJudge.Services.Auth
{
    public interface IAuthService
    {
        string Login(LoginUser loginUser);
    }
}