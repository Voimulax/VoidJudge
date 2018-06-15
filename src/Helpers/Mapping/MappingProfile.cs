using System.Linq;
using AutoMapper;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.ViewModels.Contest;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Helpers.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AddUserViewModel, User>()
                .ForMember(u => u.PasswordHash, o => o.MapFrom(a => a.Password));
            CreateMap<User, GetUserViewModel>();
            CreateMap<PutUserViewModel, User>();
            CreateMap<User, AddResultUser>();

            CreateMap<AddStudentViewModel, User>()
                .ForMember(u => u.PasswordHash, o => o.MapFrom(a => a.Password));
            CreateMap<AddStudentViewModel, Student>()
                .ForMember(s => s.Id, o => o.MapFrom(u => u.LoginName));
            CreateMap<Student, GetStudentViewModel>()
                .ForMember(g => g.Id, o => o.MapFrom(s => s.User.Id))
                .ForMember(g => g.LoginName, o => o.MapFrom(s => s.User.LoginName))
                .ForMember(g => g.UserName, o => o.MapFrom(s => s.User.UserName))
                .ForMember(g => g.RoleType, o => o.MapFrom(s => s.User.Role.Type));

            CreateMap<PutStudentViewModel, Student>()
                .ForMember(s => s.Id, o => o.MapFrom(p => p.LoginName))
                .ForMember(s => s.UserId, o => o.MapFrom(p => p.Id));

            CreateMap<Contest, AdminContestViewModel>()
                .ForMember(c => c.OwnerName, o => o.MapFrom(c => c.Owner.User.UserName));
            CreateMap<Contest, TeacherContestViewModel>();
            CreateMap<Contest, StudentContestViewModel>()
                .ForMember(c => c.OwnerName, o => o.MapFrom(c => c.Owner.User.UserName));
        }
    }
}