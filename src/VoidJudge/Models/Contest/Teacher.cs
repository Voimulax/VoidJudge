using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using VoidJudge.Models.Identity;

namespace VoidJudge.Models.Contest
{
    public class Teacher
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public User User { get; set; }
        public ICollection<Contest> Contests { get; set; } = new Collection<Contest>();
    }
}