using System.Threading.Tasks;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public interface IContestService
    {
        Task<ApiResult> GetContestAsync(long id, RoleType roleType, long userId, string token);
        Task<ApiResult> GetContestsAsync(RoleType roleType, long userId);
        Task<ApiResult> AddContestAsync(TeacherContestViewModel addContest, long userId);
        Task<ApiResult> PutContestAsync(TeacherContestViewModel putContest, long userId);
        Task<ApiResult> DeleteContestAsync(long id, long userId);
    }
}