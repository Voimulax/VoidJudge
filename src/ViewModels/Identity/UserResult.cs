using System.Collections.Generic;

namespace VoidJudge.ViewModels.Identity
{
    public class AddResultUser
    {
        public string LoginName { get; set; }
    }

    public enum AddResultType
    {
        Ok,
        Wrong,
        Repeat,
        Error,
    }

    public class AddUserResult : ApiResult
    {
        public IList<AddResultUser> Data { get; set; } = null;
    }

    public enum GetResultType
    {
        Ok,
        Unauthorized,
        UserNotFound,
        Error,
    }

    public class GetUserResult : ApiResult
    {
        public GetUserViewModel Data { get; set; } = null;
    }

    public class GetStudentResult : ApiResult
    {
        public GetStudentViewModel Data { get; set; } = null;
    }

    public class GetUsersResult : ApiResult
    {
        public IList<GetUserViewModel> Data { get; set; } = null;
    }

    public class GetStudentsResult : ApiResult
    {
        public IList<GetStudentViewModel> Data { get; set; } = null;
    }

    public enum PutResultType
    {
        Ok,
        Forbiddance,
        ConcurrencyException,
        UserNotFound,
        Repeat,
        Wrong,
        Error
    }

    public class PutUserResult : ApiResult
    {
        public PutUserViewModel Data { get; set; } = null;
    }

    public class PutStudentResult : ApiResult
    {
        public PutStudentViewModel Data { get; set; } = null;
    }

    public enum DeleteResultType
    {
        Ok,
        Forbiddance,
        UserNotFound,
        Error,
    }
}