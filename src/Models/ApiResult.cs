namespace VoidJudge.Models
{
    public class ApiResult
    {
        public string Error { get; set; }
    }

    public class ApiDataResult : ApiResult
    {
        public object Data { get; set; }
    }
}