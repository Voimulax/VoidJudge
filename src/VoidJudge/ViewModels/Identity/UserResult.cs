using System.Collections.Generic;

namespace VoidJudge.ViewModels.Identity
{
    public class AddResultUser
    {
        public string LoginName { get; set; }
    }

    public enum AddUserResultType
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

    public enum GetUserResultType
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

    public enum PutUserResultType
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

    public enum DeleteUserResultType
    {
        Ok,
        Forbiddance,
        UserNotFound,
        Error,
    }
}