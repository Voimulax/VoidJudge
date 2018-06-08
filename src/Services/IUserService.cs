using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models.Auth;
using VoidJudge.Models.User;

namespace VoidJudge.Services
{
    public interface IUserService
    {
        Task<AddUserResult> AddUsers(IEnumerable<User<AddUserBasicInfo>> addUsers);
        Task<User<IdUserBasicInfo>> GetUser(long id, string roleCode);
        Task<IEnumerable<User<IdUserBasicInfo>>> GetUsers(string roleCode);
        Task<PutResult> PutUser(User<IdUserBasicInfo> putUser);
        Task<DeleteResult> DeleteUser(long id);
        Role CheckRoleCode(string roleCode);
        bool CheckAuth(IEnumerable<System.Security.Claims.Claim> claims, string roleCode);
    }
}