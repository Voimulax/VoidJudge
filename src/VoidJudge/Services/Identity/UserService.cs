using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.Services.Auth;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Services.Identity
{
    public class UserService : IUserService
    {
        private readonly VoidJudgeContext _context;
        private readonly PasswordHasher<UserModel> _passwordHasher;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public UserService(VoidJudgeContext context, PasswordHasher<UserModel> passwordHasher, IAuthService authService, IMapper mapper)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<ApiResult> AddUsersAsync(IList<AddUserViewModel> addUsers)
        {
            addUsers = addUsers.ToList();

            var repeat = await (from u in _context.Users
                                from au in addUsers
                                where u.LoginName == au.LoginName
                                select _mapper.Map<UserModel, AddResultUser>(u)).ToListAsync();

            if (repeat.Any())
            {
                return new AddUserResult { Error = AddUserResultType.Repeat, Data = repeat };
            }

            var tasks = addUsers.Select(async au =>
            {
                var u = _mapper.Map<AddUserViewModel, UserModel>(au);
                u.RoleId = (await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(au.RoleType.ToString()))).Id;
                u.PasswordHash = _passwordHasher.HashPassword(u, u.PasswordHash);
                u.CreateTime = DateTime.Now;
                return u;
            }).ToList();

            var users = new ConcurrentBag<UserModel>();
            try
            {
                foreach (var task in tasks)
                {
                    users.Add(await task);
                }
            }
            catch (Exception)
            {
                return new AddUserResult { Error = AddUserResultType.Wrong };
            }

            await _context.Users.AddRangeAsync(users.OrderBy(u => u.CreateTime));
            await _context.SaveChangesAsync();

            var ats = addUsers.Where(au => au.RoleType == (int)RoleType.Teacher).ToList();
            if (ats.Count <= 0) return new AddUserResult { Error = AddUserResultType.Ok };

            var teachers = (from s in ats
                            join u in _context.Users on s.LoginName equals u.LoginName
                            select new TeacherModel { UserId = u.Id }).ToList();

            await _context.Teachers.AddRangeAsync(teachers);
            await _context.SaveChangesAsync();

            return new AddUserResult { Error = AddUserResultType.Ok };
        }

        public async Task<ApiResult> GetUserAsync(long id, RoleType? roleType = null)
        {
            var user = await _context.Users.Include(u => u.Role).Where(u => u.Id == id).SingleOrDefaultAsync();
            if (user == null) return new GetUserResult { Error = GetUserResultType.UserNotFound };

            if (roleType != null && !_authService.CompareRoleAuth(roleType.Value, user.Role.Type))
            {
                return new GetUserResult { Error = GetUserResultType.Unauthorized };
            }

            return new GetUserResult
            {
                Error = GetUserResultType.Ok,
                Data = _mapper.Map<UserModel, GetUserViewModel>(user)
            };
        }

        public async Task<ApiResult> GetUsersAsync(IList<string> roleTypes)
        {
            var roles = await GetRolesAsync(roleTypes);
            if (roles == null) return new GetUserResult { Error = GetUserResultType.UserNotFound };
            var users = roles.ToList().Aggregate(new List<GetUserViewModel>(),
                (lr, r) => lr.Concat(r.Users.Select(_mapper.Map<UserModel, GetUserViewModel>).ToList()).OrderBy(gu => gu.Id).ToList());

            return new GetUsersResult { Error = GetUserResultType.Ok, Data = users };
        }

        public async Task<ApiResult> PutUserAsync(PutUserViewModel putUser)
        {
            var user = await _context.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == putUser.Id);
            if (user == null) return new PutUserResult { Error = PutUserResultType.UserNotFound };

            if (user.Role.Type == RoleType.Teacher)
            {
                var count = (await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == user.Id)
                    .SingleOrDefaultAsync()).Contests.Count;
                if (count > 0)
                {
                    return new PutUserResult { Error = PutUserResultType.Forbiddance };
                }
            }

            if (putUser.Password != null)
            {
                putUser.Password = GetRandomPassword();
                user.PasswordHash = _passwordHasher.HashPassword(user, putUser.Password);
            }
            else
            {
                if (user.LoginName != putUser.LoginName)
                {
                    var uu = await _context.Users.SingleOrDefaultAsync(u => u.LoginName == putUser.LoginName);
                    if (uu != null)
                    {
                        return new PutStudentResult { Error = PutUserResultType.Repeat };
                    }
                }

                user.LoginName = putUser.LoginName;
                user.UserName = putUser.UserName;

                try
                {
                    var role = await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(putUser.RoleType.ToString()));
                    if (role == null) return new PutUserResult { Error = PutUserResultType.Wrong };
                    if (user.Role.Type == RoleType.Teacher && role.Type != RoleType.Teacher)
                    {
                        var teacher = await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == user.Id)
                            .SingleOrDefaultAsync();
                        if (teacher.Contests.Count > 0)
                        {
                            return new PutUserResult { Error = PutUserResultType.Forbiddance };
                        }

                        _context.Teachers.Remove(teacher);
                        await _context.SaveChangesAsync();
                    }
                    else if (user.Role.Type != RoleType.Teacher && role.Type == RoleType.Teacher)
                    {
                        var teacher = new TeacherModel { UserId = user.Id };

                        await _context.Teachers.AddAsync(teacher);
                        await _context.SaveChangesAsync();
                    }
                    else user.RoleId = role.Id;
                }
                catch (Exception)
                {
                    return new PutUserResult { Error = PutUserResultType.Wrong };
                }
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return new PutUserResult { Error = PutUserResultType.Ok, Data = putUser };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new PutUserResult { Error = PutUserResultType.ConcurrencyException };
            }
        }

        public async Task<ApiResult> DeleteUserAsync(long id)
        {
            var user = await _context.Users.Include(u => u.Role).Where(u => u.Id == id).SingleOrDefaultAsync();
            if (user == null)
            {
                return new ApiResult { Error = DeleteUserResultType.UserNotFound };
            }

            if (user.Role.Type == RoleType.Teacher)
            {
                var count = (await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == id)
                    .SingleOrDefaultAsync()).Contests.Count;
                if (count > 0)
                {
                    return new ApiResult { Error = DeleteUserResultType.Forbiddance };
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteUserResultType.Ok };
        }

        public async Task<ApiResult> AddStudentsAsync(IList<AddStudentViewModel> addStudents)
        {
            addStudents = addStudents.ToList();

            var repeat = await (from u in _context.Users
                                from au in addStudents
                                where u.LoginName == au.LoginName
                                select _mapper.Map<UserModel, AddResultUser>(u)).ToListAsync();

            if (repeat.Any())
            {
                return new AddUserResult { Error = AddUserResultType.Repeat, Data = repeat };
            }

            var tasks = addStudents.Select(async au =>
            {
                var u = _mapper.Map<AddStudentViewModel, UserModel>(au);
                u.RoleId = (await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(au.RoleType.ToString()))).Id;
                u.PasswordHash = _passwordHasher.HashPassword(u, u.PasswordHash);
                u.CreateTime = DateTime.Now;
                return u;
            }).ToList();

            var users = new ConcurrentBag<UserModel>();
            try
            {
                foreach (var task in tasks)
                {
                    users.Add(await task);
                }
            }
            catch (Exception)
            {
                return new AddUserResult { Error = AddUserResultType.Wrong };
            }

            await _context.Users.AddRangeAsync(users.OrderBy(u => u.CreateTime));
            await _context.SaveChangesAsync();

            var ss = addStudents.Select(_mapper.Map<AddStudentViewModel, StudentModel>).ToList();
            var students = await (from u in _context.Users
                                  from s in ss
                                  where u.LoginName == s.Id.ToString()
                                  select new StudentModel { Id = s.Id, UserId = u.Id, Group = s.Group }).ToListAsync();

            await _context.Students.AddRangeAsync(students);
            await _context.SaveChangesAsync();

            return new AddUserResult { Error = AddUserResultType.Ok };
        }

        public async Task<ApiResult> GetStudentAsync(long id)
        {
            var student = await _context.Students.Where(s => s.UserId == id).Include(s => s.User).SingleOrDefaultAsync();
            if (student == null) return new GetStudentResult { Error = GetUserResultType.UserNotFound };

            return new GetStudentResult
            {
                Error = GetUserResultType.Ok,
                Data = _mapper.Map<StudentModel, GetStudentViewModel>(student)
            };
        }

        public async Task<ApiResult> GetStudentsAsync()
        {
            var ss = await _context.Students.Include(s => s.User).ToListAsync();
            var students = ss.Select(_mapper.Map<StudentModel, GetStudentViewModel>).OrderBy(s => s.Id).ToList();

            return new GetStudentsResult { Error = GetUserResultType.Ok, Data = students };
        }

        public async Task<ApiResult> PutStudentAsync(PutStudentViewModel putStudent)
        {
            var user = await _context.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == putStudent.Id);
            if (user == null) return new PutUserResult { Error = PutUserResultType.UserNotFound };

            var count = (await _context.Enrollments.Where(e => e.StudentId == long.Parse(user.LoginName)).ToListAsync())
                .Count;
            if (count > 0)
            {
                return new PutStudentResult { Error = PutUserResultType.Forbiddance };
            }

            if (putStudent.Password != null)
            {
                putStudent.Password = GetRandomPassword();
                user.PasswordHash = _passwordHasher.HashPassword(user, putStudent.Password);
            }
            else
            {
                if (user.LoginName != putStudent.LoginName)
                {
                    var uu = await _context.Users.SingleOrDefaultAsync(u => u.LoginName == putStudent.LoginName);
                    if (uu != null)
                    {
                        return new PutStudentResult { Error = PutUserResultType.Repeat };
                    }
                }

                user.LoginName = putStudent.LoginName;
                user.UserName = putStudent.UserName;

                var student = await _context.Students.FindAsync(long.Parse(user.LoginName));
                student.Group = putStudent.Group;

                _context.Entry(student).State = EntityState.Modified;
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return new PutStudentResult { Error = PutUserResultType.Ok, Data = putStudent };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new PutStudentResult { Error = PutUserResultType.ConcurrencyException };
            }
        }

        public async Task<ApiResult> DeleteStudentAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new ApiResult { Error = DeleteUserResultType.UserNotFound };
            }

            var count = (await _context.Enrollments.Where(e => e.StudentId == long.Parse(user.LoginName)).ToListAsync())
                .Count;
            if (count > 0)
            {
                return new PutUserResult { Error = DeleteUserResultType.Forbiddance };
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteUserResultType.Ok };
        }

        private static string GetRandomPassword()
        {
            var r = new Random();
            var res = new List<int>();
            for (var i = 0; i < 6; i++)
            {
                res.Add(r.Next(10));
            }
            return string.Join("", res);
        }

        private async Task<IEnumerable<RoleModel>> GetRolesAsync(IEnumerable<string> roleTypes)
        {
            try
            {
                var rs = roleTypes.Select(Enum.Parse<RoleType>).ToList();
                var ts = rs.Select(async x => await _authService.GetRoleFromRoleTypeAsync(x, true)).ToList();
                var roles = new List<RoleModel>();
                foreach (var t in ts)
                {
                    roles.Add(await t);
                }
                return roles.Count != rs.Count ? null : roles;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}