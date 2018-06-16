using System.Collections.Generic;

namespace VoidJudge.ViewModels.Identity
{
    public abstract class UserViewModel
    {
        public string LoginName { get; set; }
    }

    public abstract class BaseUserViewModel : UserViewModel
    {
        public string UserName { get; set; }
        public int RoleType { get; set; }
    }

    public class LoginUserViewModel : UserViewModel
    {
        public string Password { get; set; }
    }

    public class AddUserViewModel : BaseUserViewModel
    {
        public long? Id { get; set; } = null;
        public string Password { get; set; }
    }

    public class AddStudentViewModel : AddUserViewModel
    {
        public string Group { get; set; }
    }

    public class GetUserViewModel : BaseUserViewModel
    {
        public long Id { get; set; }
    }

    public class GetStudentViewModel : GetUserViewModel
    {
        public string Group { get; set; }
    }

    public class PutUserViewModel : BaseUserViewModel
    {
        public long Id { get; set; }
        public string Password { get; set; } = null;
    }

    public class PutStudentViewModel : PutUserViewModel
    {
        public string Group { get; set; }
    }

    public class ResetUserViewModel
    {
        public long Id { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}