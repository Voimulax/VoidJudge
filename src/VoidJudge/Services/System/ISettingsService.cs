using System.Collections.Generic;
using System.Threading.Tasks;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.System;

namespace VoidJudge.Services.System
{
    public interface ISettingsService
    {
        Task<ApiResult> GetSettingsAsync();
        IList<SettingsViewModel> GetSettings();
        Task<ApiResult> PutSettingsAsync(IList<SettingsViewModel> putSettings);
        Task<ApiResult> InitSettingsAsync();
        void InitSettings();
    }
}