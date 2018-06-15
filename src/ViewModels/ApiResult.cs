using System;

namespace VoidJudge.ViewModels
{
    public class ApiResult
    {
        public object Error { get; set; }
    }

    public class ApiDataResult : ApiResult
    {
        public object Data { get; set; }
    }
}