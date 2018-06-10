using Microsoft.EntityFrameworkCore;
using VoidJudge.Models.Auth;
using VoidJudge.Models.Contest;

namespace VoidJudge.Data
{
    public class VoidJudgeContext : DbContext
    {
        public VoidJudgeContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<UserClaim> UserClaims { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<ContestProblem> ContestProblems { get; set; }
        public DbSet<ContestUser> ContestUsers { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<ContestFile> ContestFiles { get; set; }
    }
}