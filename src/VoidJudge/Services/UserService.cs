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
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Services
{
    public class UserService : IUserService
    {
        private readonly VoidJudgeContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public UserService(VoidJudgeContext context, PasswordHasher<User> passwordHasher, IAuthService authService, IMapper mapper)
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
                                select _mapper.Map<User, AddResultUser>(u)).ToListAsync();

            if (repeat.Any())
            {
                return new AddUserResult { Error = AddResultType.Repeat, Data = repeat };
            }

            var time = DateTime.Now;
            var tasks = addUsers.Select(async au =>
            {
                var u = _mapper.Map<AddUserViewModel, User>(au);
                u.RoleId = (await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(au.RoleType.ToString()))).Id;
                u.PasswordHash = _passwordHasher.HashPassword(u, u.PasswordHash);
                u.CreateTime = time;
                return u;
            }).ToList();

            var users = new ConcurrentBag<User>();
            try
            {
                foreach (var task in tasks)
                {
                    users.Add(await task);
                }
            }
            catch (Exception)
            {
                return new AddUserResult { Error = AddResultType.Wrong };
            }

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            var ats = addUsers.Where(au => au.RoleType == (int)RoleType.Teacher).ToList();
            if (ats.Count <= 0) return new AddUserResult { Error = AddResultType.Ok };

            var teachers = (from s in ats
                            join u in _context.Users on s.LoginName equals u.LoginName
                            select new Teacher { UserId = u.Id }).ToList();

            await _context.Teachers.AddRangeAsync(teachers);
            await _context.SaveChangesAsync();

            return new AddUserResult { Error = AddResultType.Ok };
        }

        public async Task<ApiResult> GetUserAsync(long id, RoleType? roleType = null)
        {
            var user = await _context.Users.Include(u => u.Role).Where(u => u.Id == id).SingleOrDefaultAsync();
            if (user == null) return new GetUserResult { Error = GetResultType.UserNotFound };

            if (roleType != null && !_authService.CompareRoleAuth(roleType.Value, user.Role.Type))
            {
                return new GetUserResult { Error = GetResultType.Unauthorized };
            }

            return new GetUserResult
            {
                Error = GetResultType.Ok,
                Data = _mapper.Map<User, GetUserViewModel>(user)
            };
        }

        public async Task<ApiResult> GetUsersAsync(IList<string> roleTypes)
        {
            var roles = await GetRolesAsync(roleTypes);
            if (roles == null) return new GetUserResult { Error = GetResultType.UserNotFound };
            var users = roles.ToList().Aggregate(new List<GetUserViewModel>(),
                (lr, r) => lr.Concat(r.Users.Select(_mapper.Map<User, GetUserViewModel>).ToList()).ToList());

            return new GetUsersResult { Error = GetResultType.Ok, Data = users };
        }

        public async Task<ApiResult> PutUserAsync(PutUserViewModel putUser)
        {
            var user = await _context.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == putUser.Id);
            if (user == null) return new PutUserResult { Error = PutResultType.UserNotFound };

            if (user.Role.Type == RoleType.Teacher)
            {
                var count = (await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == user.Id)
                    .SingleOrDefaultAsync()).Contests.Count;
                if (count > 0)
                {
                    return new PutUserResult { Error = PutResultType.Forbiddance };
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
                        return new PutStudentResult { Error = PutResultType.Repeat };
                    }
                }

                user.LoginName = putUser.LoginName;
                user.UserName = putUser.UserName;

                try
                {
                    var role = await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(putUser.RoleType.ToString()));
                    if (role == null) return new PutUserResult { Error = PutResultType.Wrong };
                    if (user.Role.Type == RoleType.Teacher && role.Type != RoleType.Teacher)
                    {
                        var teacher = await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == user.Id)
                            .SingleOrDefaultAsync();
                        if (teacher.Contests.Count > 0)
                        {
                            return new PutUserResult { Error = PutResultType.Forbiddance };
                        }

                        _context.Teachers.Remove(teacher);
                        await _context.SaveChangesAsync();
                    }
                    else if (user.Role.Type != RoleType.Teacher && role.Type == RoleType.Teacher)
                    {
                        var teacher = new Teacher { UserId = user.Id };

                        await _context.Teachers.AddAsync(teacher);
                        await _context.SaveChangesAsync();
                    }
                    else user.RoleId = role.Id;
                }
                catch (Exception)
                {
                    return new PutUserResult { Error = PutResultType.Wrong };
                }
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return new PutUserResult { Error = PutResultType.Ok, Data = putUser };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new PutUserResult { Error = PutResultType.ConcurrencyException };
            }
        }

        public async Task<ApiResult> DeleteUserAsync(long id)
        {
            var user = await _context.Users.Include(u => u.Role).Where(u => u.Id == id).SingleOrDefaultAsync();
            if (user == null)
            {
                return new ApiResult { Error = DeleteResultType.UserNotFound };
            }

            if (user.Role.Type == RoleType.Teacher)
            {
                var count = (await _context.Teachers.Include(t => t.Contests).Where(t => t.UserId == id)
                    .SingleOrDefaultAsync()).Contests.Count;
                if (count > 0)
                {
                    return new ApiResult { Error = DeleteResultType.Forbiddance };
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteResultType.Ok };
        }

        public async Task<ApiResult> AddStudentsAsync(IList<AddStudentViewModel> addStudents)
        {
            addStudents = addStudents.ToList();

            var repeat = await (from u in _context.Users
                                from au in addStudents
                                where u.LoginName == au.LoginName
                                select _mapper.Map<User, AddResultUser>(u)).ToListAsync();

            if (repeat.Any())
            {
                return new AddUserResult { Error = AddResultType.Repeat, Data = repeat };
            }

            var time = DateTime.Now;
            var tasks = addStudents.Select(async au =>
            {
                var u = _mapper.Map<AddStudentViewModel, User>(au);
                u.RoleId = (await _authService.GetRoleFromRoleTypeAsync(Enum.Parse<RoleType>(au.RoleType.ToString()))).Id;
                u.PasswordHash = _passwordHasher.HashPassword(u, u.PasswordHash);
                u.CreateTime = time;
                return u;
            }).ToList();

            var users = new ConcurrentBag<User>();
            try
            {
                foreach (var task in tasks)
                {
                    users.Add(await task);
                }
            }
            catch (Exception)
            {
                return new AddUserResult { Error = AddResultType.Wrong };
            }

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            var ss = addStudents.Select(_mapper.Map<AddStudentViewModel, Student>).ToList();
            var students = await (from u in _context.Users
                                  from s in ss
                                  where u.LoginName == s.Id.ToString()
                                  select new Student { Id = s.Id, UserId = u.Id, Group = s.Group }).ToListAsync();

            await _context.Students.AddRangeAsync(students);
            await _context.SaveChangesAsync();

            return new AddUserResult { Error = AddResultType.Ok };
        }

        public async Task<ApiResult> GetStudentAsync(long id)
        {
            var student = await _context.Students.Where(s => s.UserId == id).Include(s => s.User).SingleOrDefaultAsync();
            if (student == null) return new GetStudentResult { Error = GetResultType.UserNotFound };

            return new GetStudentResult
            {
                Error = GetResultType.Ok,
                Data = _mapper.Map<Student, GetStudentViewModel>(student)
            };
        }

        public async Task<ApiResult> GetStudentsAsync()
        {
            var ss = await _context.Students.Include(s => s.User).ToListAsync();
            var students = ss.Select(_mapper.Map<Student, GetStudentViewModel>).ToList();

            return new GetStudentsResult { Error = GetResultType.Ok, Data = students };
        }

        public async Task<ApiResult> PutStudentAsync(PutStudentViewModel putStudent)
        {
            var user = await _context.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == putStudent.Id);
            if (user == null) return new PutUserResult { Error = PutResultType.UserNotFound };

            var count = (await _context.Enrollments.Where(e => e.StudentId == long.Parse(user.LoginName)).ToListAsync())
                .Count;
            if (count > 0)
            {
                return new PutStudentResult { Error = PutResultType.Forbiddance };
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
                        return new PutStudentResult { Error = PutResultType.Repeat };
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
                return new PutStudentResult { Error = PutResultType.Ok, Data = putStudent };
            }
            catch (DbUpdateConcurrencyException)
            {
                return new PutStudentResult { Error = PutResultType.ConcurrencyException };
            }
        }

        public async Task<ApiResult> DeleteStudentAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new ApiResult { Error = DeleteResultType.UserNotFound };
            }

            var count = (await _context.Enrollments.Where(e => e.StudentId == long.Parse(user.LoginName)).ToListAsync())
                .Count;
            if (count > 0)
            {
                return new PutUserResult { Error = DeleteResultType.Forbiddance };
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteResultType.Ok };
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

        private async Task<IEnumerable<Role>> GetRolesAsync(IEnumerable<string> roleTypes)
        {
            try
            {
                var rs = roleTypes.Select(Enum.Parse<RoleType>).ToList();
                var ts = rs.Select(async x => await _authService.GetRoleFromRoleTypeAsync(x,true)).ToList();
                var roles = new List<Role>();
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