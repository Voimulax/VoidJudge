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

    public class GetProblemResult : ApiResult
    {
        public IList<GetProblemViewModel> Data { get; set; }
    }

    public enum DeleteProblemResultType
    {
        Ok, Unauthorized, ContestNotFound, ProblemNotFound, Forbiddance, Error
    }
}