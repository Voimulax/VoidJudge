namespace VoidJudge.ViewModels.Storage
{
    public enum AddFileResultType
    {
        Ok, FileTooBig, Error
    }

    public class AddFileResult : ApiResult
    {
        public string Data { get; set; }
    }

    public enum DeleteFileResultType
    {
        Ok, Error
    }

    public enum GetFileResultType
    {
        Ok, Error
    }

    public class GetFileResult : ApiResult
    {
        public GetFileViewModel Data { get; set; } = null;
    }
}