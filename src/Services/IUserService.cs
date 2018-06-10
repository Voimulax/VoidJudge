using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public interface IUserService
    {
        Task<AddUserResult> AddUsersAsync(IEnumerable<User<AddUserBasicInfo>> addUsers);
        Task<GetUserResult> GetUserAsync(long id, string roleCode = null);
        Task<IEnumerable<User<GetUserBasicInfo>>> GetUsersAsync(IEnumerable<string> roleCodes);
        Task<PutUserResult> PutUserAsync(User<PutUserBasicInfo> putUser);
        Task<DeleteResult> DeleteUserAsync(long id);
    }
}