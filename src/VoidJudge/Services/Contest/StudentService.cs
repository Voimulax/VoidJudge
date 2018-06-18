using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public class StudentService : IStudentService
    {
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public StudentService(VoidJudgeContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResult> AddStudentsAsync(long contestId, IList<AddStudentViewModel> addStudents, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Enrollments).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = AddStudentResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = AddStudentResultType.Unauthorized };

            if (contest.ProgressState == ContestProgressState.InProgress ||
                contest.ProgressState == ContestProgressState.Ended)
            {
                return new ApiResult { Error = AddStudentResultType.Forbiddance };
            }

            var addStudentIds = addStudents.Select(p => p.StudentId).ToHashSet();
            var students = await _context.Students.Where(s => addStudentIds.Contains(s.Id)).ToListAsync();
            if (addStudentIds.Count != students.Count)
            {
                var studentIds = students.Select(s => s.Id).ToHashSet();
                addStudentIds.ExceptWith(studentIds);
                var result = addStudentIds.Select(pid => new AddStudentViewModel { StudentId = pid }).ToList();
                return new AddStudentResult { Error = AddStudentResultType.StudentsNotFound, Data = result };
            }

            var enrollments = contest.Enrollments.ToList();
            _context.Enrollments.RemoveRange(enrollments);
            await _context.SaveChangesAsync();

            enrollments = addStudentIds.Select(pid => new EnrollmentModel { ContestId = contestId, StudentId = pid }).ToList();
            await _context.Enrollments.AddRangeAsync(enrollments);
            await _context.SaveChangesAsync();
            return new ApiResult { Error = AddStudentResultType.Ok };
        }

        public async Task<ApiResult> GetStudentsAsync(long contestId, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Enrollments).ThenInclude(e => e.Student).ThenInclude(e => e.User).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetStudentResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = GetStudentResultType.Unauthorized };

            var result = contest.Enrollments.Select(e => e.Student)
                .Select(s => _mapper.Map<StudentModel, GetStudentViewModel>(s)).ToList();
            return new GetStudentResult { Error = GetStudentResultType.Ok, Data = result };
        }

        public async Task<ApiResult> UnLockAsync(long contestId, long userId, long studentId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Enrollments).ThenInclude(e => e.Student).ThenInclude(e => e.User).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetStudentResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = GetStudentResultType.Unauthorized };

            var enrollment = contest.Enrollments.SingleOrDefault(e => e.Student.UserId == studentId);
            if (enrollment == null) return new ApiResult { Error = GetStudentResultType.Error };

            if (enrollment.Token != null)
            {
                enrollment.Token = "";
                await _context.SaveChangesAsync();
            }
            return new ApiResult { Error = GetStudentResultType.Ok };
        }
    }
}