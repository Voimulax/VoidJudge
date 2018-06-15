using System.Threading.Tasks;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels;

namespace VoidJudge.Services
{
    public interface IContestService
    {
        Task<ApiResult> GetContestAsync(long id, RoleType roleType, long userId);
        Task<ApiResult> GetContestsAsync(RoleType roleType, long userId);
    }
}