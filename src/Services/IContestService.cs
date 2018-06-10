using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.Models;
using VoidJudge.Models.Contest;

namespace VoidJudge.Services
{
    public interface IContestService
    {
        Task<ApiResult> GetContestAsync(long id);
        Task<ApiResult> GetContestsAsync();
    }
}