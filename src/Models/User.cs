using System;

namespace VoidJudge.Models
{
    public enum UserType
    {
        Admin, Teacher, Student
    }

    public class LoginUser
    {
        public string LoginName { get; set; }
        public string Password { get; set; }
    }

    public class User
    {
        public long UserID { get; set; }
        public string LoginName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public UserType UserType { get; set; }
        public DateTime CreateTime{ get; set; }
        public DateTime LastLoginTime { get; set; }
    }
}