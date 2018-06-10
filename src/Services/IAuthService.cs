using System.Threading.Tasks;
using VoidJudge.Models;
using VoidJudge.Models.Auth;

namespace VoidJudge.Services
{
    public interface IAuthService
    {
        Task<ApiResult> LoginAsync(LoginUser loginUser, string ipAddress);
        Task<ApiResult> ResetPasswordAsync(ResetUser resetUser);
        Task<bool> IsUserExistAsync(long id);
        bool CompareRoleAuth(string roleTypeA, string roleTypeB);
        Task<Role> CheckRoleTypeAsync(string roleType);
    }
}