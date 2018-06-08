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

    public class IdUserBasicInfo : UserBasicInfo
    {
        public long Id { get; set; }
    }

    public class UserClaimInfo
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class User<T> where T: UserBasicInfo
    {
        public T BasicInfo { get; set; }
        public string RoleCode { get; set; }
        public IEnumerable<UserClaimInfo> ClaimInfos { get; set; }
    }
}