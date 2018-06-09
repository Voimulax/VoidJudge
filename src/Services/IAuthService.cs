using System.Threading.Tasks;
using VoidJudge.Models.Auth;

namespace VoidJudge.Services
{
    public interface IAuthService
    {
        LoginResult Login(LoginUser loginUser, string ipAddress);
        AuthResult ResetPassword(ResetUser resetUser);
        Task<bool> IsUserExist(long id);
        bool CompareRoleAuth(string roleCodeA, string roleCodeB);
        Role CheckRoleCode(string roleCode);
    }
}