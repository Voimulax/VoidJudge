using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Services
{
    public interface IUserService
    {
        Task<ApiResult> AddUsersAsync(IList<AddUserViewModel> addUsers);
        Task<ApiResult> GetUserAsync(long id, RoleType? roleType = null);
        Task<ApiResult> GetUsersAsync(IList<string> roleTypes);
        Task<ApiResult> PutUserAsync(PutUserViewModel putUser);
        Task<ApiResult> DeleteUserAsync(long id);

        Task<ApiResult> AddStudentsAsync(IList<AddStudentViewModel> addStudents);
        Task<ApiResult> GetStudentAsync(long id);
        Task<ApiResult> GetStudentsAsync();
        Task<ApiResult> PutStudentAsync(PutStudentViewModel putStudent);
        Task<ApiResult> DeleteStudentAsync(long id);
    }
}