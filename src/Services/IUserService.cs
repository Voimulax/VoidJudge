using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public interface IUserService
    {
        Task<AddUserResult> AddUsers(IEnumerable<User<AddUserBasicInfo>> addUsers);
        Task<GetUserResult> GetUser(long id, string roleCode = null);
        Task<IEnumerable<User<GetUserBasicInfo>>> GetUsers(IEnumerable<string> roleCodes);
        Task<PutUserResult> PutUser(User<PutUserBasicInfo> putUser);
        Task<DeleteResult> DeleteUser(long id);
    }
}