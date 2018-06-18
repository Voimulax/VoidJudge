using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public interface IStudentService
    {
        Task<ApiResult> AddStudentsAsync(long contestId, IList<AddStudentViewModel> addStudents, long userId);
        Task<ApiResult> GetStudentsAsync(long contestId, long userId);
        Task<ApiResult> UnLockAsync(long contestId, long userId, long studentId);
    }
}