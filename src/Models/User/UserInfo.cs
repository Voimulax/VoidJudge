using System.Collections.Generic;

namespace VoidJudge.Models.User
{
    public class UserBasicInfo
    {
        public string LoginName { get; set; }
        public string UserName { get; set; }
    }

    public class AddUserBasicInfo: UserBasicInfo
    {
        public string Password { get; set; }
    }

    public class GetUserBasicInfo : UserBasicInfo
    {
        public long Id { get; set; }
    }

    public class PutUserBasicInfo : UserBasicInfo
    {
        public long Id { get; set; }
        public string Password { get; set; } = null;
    }

    public class UserClaimInfo
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class UserInfo<T> where T: UserBasicInfo
    {
        public T BasicInfo { get; set; }
        public string RoleType { get; set; } = null;
        public IEnumerable<UserClaimInfo> ClaimInfos { get; set; } = null;
    }
}