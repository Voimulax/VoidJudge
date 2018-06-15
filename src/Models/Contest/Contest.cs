using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public enum ContestState
    {
        UnPublished, NotDownloaded, DownLoaded
    }

    public class Contest
    {
        public long Id { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Notice { get; set; }

        [Column(TypeName = "int")]
        public ContestState State { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new Collection<Enrollment>();
        public ICollection<Problem> Problems { get; set; } = new Collection<Problem>();

        public long OwnerId { get; set; }
        public Teacher Owner { get; set; }
    }
}