using AutoMapper;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.Models.System;
using VoidJudge.ViewModels.Contest;
using VoidJudge.ViewModels.Identity;
using VoidJudge.ViewModels.System;
using AddStudentViewModel = VoidJudge.ViewModels.Identity.AddStudentViewModel;
using GetStudentViewModel = VoidJudge.ViewModels.Contest.GetStudentViewModel;

namespace VoidJudge.Helpers.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AddUserViewModel, UserModel>()
                .ForMember(u => u.PasswordHash, o => o.MapFrom(a => a.Password));
            CreateMap<UserModel, GetUserViewModel>();
            CreateMap<PutUserViewModel, UserModel>();
            CreateMap<UserModel, AddResultUser>();

            CreateMap<AddStudentViewModel, UserModel>()
                .ForMember(u => u.PasswordHash, o => o.MapFrom(a => a.Password));
            CreateMap<AddStudentViewModel, StudentModel>()
                .ForMember(s => s.Id, o => o.MapFrom(u => u.LoginName));
            CreateMap<StudentModel, ViewModels.Identity.GetStudentViewModel>()
                .ForMember(g => g.Id, o => o.MapFrom(s => s.User.Id))
                .ForMember(g => g.LoginName, o => o.MapFrom(s => s.User.LoginName))
                .ForMember(g => g.UserName, o => o.MapFrom(s => s.User.UserName))
                .ForMember(g => g.RoleType, o => o.MapFrom(s => s.User.Role.Type));

            CreateMap<PutStudentViewModel, StudentModel>()
                .ForMember(s => s.Id, o => o.MapFrom(p => p.LoginName))
                .ForMember(s => s.UserId, o => o.MapFrom(p => p.Id));

            CreateMap<ContestModel, AdminContestViewModel>()
                .ForMember(c => c.OwnerName, o => o.MapFrom(c => c.Owner.User.UserName));
            CreateMap<ContestModel, TeacherContestViewModel>().ReverseMap();
            CreateMap<ContestModel, StudentContestViewModel>()
                .ForMember(c => c.OwnerName, o => o.MapFrom(c => c.Owner.User.UserName));

            CreateMap<StudentModel, GetStudentViewModel>()
                .ForMember(s => s.StudentId, o => o.MapFrom(s => s.Id))
                .ForMember(s => s.UserName, o => o.MapFrom(s => s.User.UserName));

            CreateMap<AddProblemViewModel, ProblemModel>();
            CreateMap<ProblemModel, GetProblemViewModel>();
            CreateMap<ProblemModel, GetStudentProblemViewModel>();

            CreateMap<AddSubmissionViewModel, SubmissionModel>();

            CreateMap<SettingsModel, SettingsViewModel>();
        }
    }
}