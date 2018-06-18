namespace VoidJudge.ViewModels.Contest
{
    public enum AddSubmissionResultType
    {
        Ok, Unauthorized, ContestNotFound, ProblemNotFound, Forbiddance, FileTooBig, Wrong, Error
    }
    public enum GetSubmissionResultType
    {
        Ok, Unauthorized, ContestNotFound, Forbiddance, Error
    }

    public class GetSubmissionResult : ApiResult
    {
        public string Data { get; set; }
    }
}