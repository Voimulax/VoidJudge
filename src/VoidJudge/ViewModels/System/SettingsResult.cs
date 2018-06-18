using System.Collections.Generic;

namespace VoidJudge.ViewModels.System
{
    public enum PutSettingsResultType
    {
        Ok, Wrong, Error
    }

    public enum GetSettingsResultType
    {
        Ok, Error
    }

    public class GetSettingsResult : ApiResult
    {
        public IList<SettingsViewModel> Data { get; set; } = null;
    }
}