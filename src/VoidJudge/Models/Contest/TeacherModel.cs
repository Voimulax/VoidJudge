using System.Collections.Generic;
using System.Collections.ObjectModel;
using VoidJudge.Models.Identity;

namespace VoidJudge.Models.Contest
{
    public class TeacherModel
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public UserModel User { get; set; }
        public ICollection<ContestModel> Contests { get; set; } = new Collection<ContestModel>();
    }
}