using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using VoidJudge.Models.Identity;

namespace VoidJudge.Models.Contest
{
    public class StudentModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }
        public long UserId { get; set; }
        public UserModel User { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string Group { get; set; }
        public ICollection<EnrollmentModel> ContestStudents { get; set; } = new Collection<EnrollmentModel>();
    }
}