using System.Threading.Tasks;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public interface IProblemService
    {
        Task<ApiResult> AddProblemAsync(long contestId, long userId, AddProblemViewModel addProblem);
        Task<ApiResult> GetProblemsAsync(long contestId, long userId);
        Task<ApiResult> DeleteProblemAsync(long contestId, long userId, long problemId);
    }
}