using System.Collections.Generic;

namespace VoidJudge.Models.User
{
    public class AddResultUser
    {
        public string LoginName { get; set; }
    }

    public enum AddResult
    {
        Ok, Wrong, Repeat, Error
    }

    public class AddUserResult
    {
        public AddResult Type { get; set; }
        public IEnumerable<AddResultUser> Repeat { get; set; } = null;
    }

    public enum GetResult
    {
        Ok, Unauthorized, UserNotFound, Error
    }

    public class GetUserResult
    {
        public GetResult Type { get; set; }
        public User<GetUserBasicInfo> User { get; set; } = null;
    }

    public enum PutResult
    {
        Ok, ConcurrencyException, UserNotFound, Error
    }

    public class PutUserResult
    {
        public PutResult Type { get; set; }
        public User<PutUserBasicInfo> User { get; set; } = null;
    }

    public enum DeleteResult
    {
        Ok, Forbiddance, UserNotFound, Error
    }
}