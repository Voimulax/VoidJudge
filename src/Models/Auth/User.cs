using System;

namespace VoidJudge.Models.Auth
{
    public class LoginUser
    {
        public string LoginName { get; set; }
        public string Password { get; set; }
    }

    public class User
    {
        public long Id { get; set; }
        public string LoginName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime CreateTime{ get; set; }
        public DateTime LastLoginTime { get; set; }
    }
}