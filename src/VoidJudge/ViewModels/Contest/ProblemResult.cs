using System.Collections.Generic;

namespace VoidJudge.ViewModels.Contest
{
    public enum AddProblemResultType
    {
        Ok, Unauthorized, ContestNotFound, Forbiddance, FileTooBig, Wrong, Error
    }

    public enum GetProblemResultType
    {
        Ok, Unauthorized, ContestNotFound, Error
    }

    public class GetProblemResult<T> : ApiResult where T: GetProblemViewModel
    {
        public IList<T> Data { get; set; }
    }

    public enum DeleteProblemResultType
    {
        Ok, Unauthorized, ContestNotFound, ProblemNotFound, Forbiddance, Error
    }
}