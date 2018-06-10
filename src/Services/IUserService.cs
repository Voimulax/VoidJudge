using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public interface IUserService
    {
        Task<ApiResult> AddUsersAsync(IEnumerable<UserInfo<AddUserBasicInfo>> addUsers);
        Task<ApiResult> GetUserAsync(long id, string roleType = null);
        Task<ApiResult> GetUsersAsync(IEnumerable<string> roleTypes);
        Task<ApiResult> PutUserAsync(UserInfo<PutUserBasicInfo> putUser);
        Task<ApiResult> DeleteUserAsync(long id);
    }
}