using System.Collections.Generic;

namespace VoidJudge.ViewModels.Contest
{
    public enum AddStudentResultType
    {
        Ok, Unauthorized, Forbiddance, ContestNotFound, StudentsNotFound, Wrong, Error
    }

    public class AddStudentResult : ApiResult
    {
        public IList<AddStudentViewModel> Data { get; set; }
    }

    public enum GetStudentResultType
    {
        Ok, Unauthorized, ContestNotFound, Error
    }

    public class GetStudentResult : ApiResult
    {
        public IList<GetStudentViewModel> Data { get; set; }
    }
}