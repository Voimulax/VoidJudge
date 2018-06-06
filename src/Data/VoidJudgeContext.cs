using Microsoft.EntityFrameworkCore;
using VoidJudge.Models;

namespace VoidJudge.Data
{
    public class VoidJudgeContext : DbContext
    {
        public VoidJudgeContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}