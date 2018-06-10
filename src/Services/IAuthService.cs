using System.Threading.Tasks;
using VoidJudge.Models.Auth;

namespace VoidJudge.Services
{
    public interface IAuthService
    {
        Task<LoginResult> LoginAsync(LoginUser loginUser, string ipAddress);
        Task<AuthResult> ResetPasswordAsync(ResetUser resetUser);
        Task<bool> IsUserExistAsync(long id);
        bool CompareRoleAuth(string roleCodeA, string roleCodeB);
        Task<Role> CheckRoleCodeAsync(string roleCode);
    }
}