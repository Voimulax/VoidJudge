using Microsoft.EntityFrameworkCore;
using VoidJudge.Models.Contest;
using VoidJudge.Models.Identity;
using VoidJudge.Models.storage;

namespace VoidJudge.Data
{
    public class VoidJudgeContext : DbContext
    {
        public VoidJudgeContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<RoleModel> Roles { get; set; }
        public DbSet<ContestModel> Contests { get; set; }
        public DbSet<StudentModel> Students { get; set; }
        public DbSet<TeacherModel> Teachers { get; set; }
        public DbSet<EnrollmentModel> Enrollments { get; set; }
        public DbSet<ProblemModel> Problems { get; set; }
        public DbSet<SubmissionModel> Submissions { get; set; }
        public DbSet<FileModel> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users);

            modelBuilder.Entity<UserModel>()
                .HasIndex(u => u.LoginName)
                .IsUnique();

            modelBuilder.Entity<RoleModel>()
                .HasIndex(r => r.Type)
                .IsUnique();

            modelBuilder.Entity<UserModel>()
                .HasOne<StudentModel>()
                .WithOne(s => s.User)
                .HasForeignKey<StudentModel>(s => s.UserId);

            modelBuilder.Entity<UserModel>()
                .HasOne<TeacherModel>()
                .WithOne(t => t.User)
                .HasForeignKey<TeacherModel>(t => t.UserId);

            modelBuilder.Entity<EnrollmentModel>()
                .HasOne(c => c.Student)
                .WithMany(s => s.ContestStudents)
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EnrollmentModel>()
                .HasOne(c => c.Contest)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(c => c.ContestId);

            modelBuilder.Entity<ContestModel>()
                .HasOne(c => c.Owner)
                .WithMany(o => o.Contests)
                .HasForeignKey(c => c.OwnerId);

            modelBuilder.Entity<SubmissionModel>()
                .HasOne(s => s.Problem)
                .WithMany(p => p.Submissions)
                .HasForeignKey(s => s.ProblemId);

            modelBuilder.Entity<StudentModel>()
                .HasMany<SubmissionModel>()
                .WithOne(s => s.Student)
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProblemModel>()
                .HasOne(p => p.Contest)
                .WithMany(c => c.Problems)
                .HasForeignKey(p => p.ContestId);

            modelBuilder.Entity<FileModel>()
                .HasIndex(f => f.SaveName)
                .IsUnique();
        }
    }
}