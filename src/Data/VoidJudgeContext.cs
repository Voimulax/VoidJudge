using Microsoft.EntityFrameworkCore;
using VoidJudge.Models.Auth;

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

    }
}