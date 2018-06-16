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

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<File> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.LoginName)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Type)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne<Student>()
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.UserId);

            modelBuilder.Entity<User>()
                .HasOne<Teacher>()
                .WithOne(t => t.User)
                .HasForeignKey<Teacher>(t => t.UserId);

            modelBuilder.Entity<Enrollment>()
                .HasOne(c => c.Student)
                .WithMany(s => s.ContestStudents)
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Enrollment>()
                .HasOne(c => c.Contest)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(c => c.ContestId);

            modelBuilder.Entity<Contest>()
                .HasOne(c => c.Owner)
                .WithMany(o => o.Contests)
                .HasForeignKey(c => c.OwnerId);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Problem)
                .WithMany(p => p.Submissions)
                .HasForeignKey(s => s.ProblemId);

            modelBuilder.Entity<Student>()
                .HasMany<Submission>()
                .WithOne(s => s.Student)
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Problem>()
                .HasOne(p => p.Contest)
                .WithMany(c => c.Problems)
                .HasForeignKey(p => p.ContestId);

            modelBuilder.Entity<File>()
                .HasIndex(f => f.SaveName)
                .IsUnique();
        }
    }
}