using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models;
using VoidJudge.Models.Auth;
using Claim = System.Security.Claims.Claim;

namespace VoidJudge.Services
{
    public interface IAuthService
    {
        Task<ApiResult> LoginAsync(LoginUser loginUser, string ipAddress);
        Task<ApiResult> ResetPasswordAsync(ResetUser resetUser);
        Task<bool> IsUserExistAsync(long id);
        bool CompareRoleAuth(string roleTypeA, string roleTypeB);
        string GetRoleTypeFromRequest(IEnumerable<Claim> claims);
        long GetUserIdFromRequest(IEnumerable<Claim> claims);
        Task<Role> CheckRoleTypeAsync(string roleType);
    }
}