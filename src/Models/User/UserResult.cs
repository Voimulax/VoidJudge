using System.Collections.Generic;

namespace VoidJudge.Models.User
{
    public class AddResultUser
    {
        public string LoginName { get; set; }
    }

    public static class AddResultTypes
    {
        public const string Ok = "0";
        public const string Wrong = "1";
        public const string Repeat = "2";
        public const string Error = "3";
    }

    public class AddUserResult : ApiResult
    {
        public IEnumerable<AddResultUser> Data { get; set; } = null;
    }

    public static class GetResultTypes
    {
        public const string Ok = "0";
        public const string Unauthorized = "1";
        public const string UserNotFound = "2";
        public const string Error = "3";
    }

    public class GetUserResult : ApiResult
    {
        public UserInfo<GetUserBasicInfo> Data { get; set; } = null;
    }

    public class GetUsersResult : ApiResult
    {
        public IEnumerable<UserInfo<GetUserBasicInfo>> Data { get; set; } = null;
    }

    public static class PutResultTypes
    {
        public const string Ok = "0";
        public const string ConcurrencyException = "1";
        public const string UserNotFound = "2";
        public const string Wrong = "3";
        public const string Error = "4";
    }

    public class PutUserResult: ApiResult
    {
        public UserInfo<PutUserBasicInfo> Data { get; set; } = null;
    }

    public static class DeleteResultTypes
    {
        public const string Ok = "0";
        public const string Forbiddance = "1";
        public const string UserNotFound = "2";
        public const string Error = "3";
    }
}