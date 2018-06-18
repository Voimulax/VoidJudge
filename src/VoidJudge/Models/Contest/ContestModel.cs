using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public enum ContestState
    {
        UnPublished, NotDownloaded, DownLoaded
    }

    public enum ContestProgressState
    {
        UnPublished, NoStarted, InProgress, Ended
    }

    public class ContestModel
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

        public ICollection<EnrollmentModel> Enrollments { get; set; } = new Collection<EnrollmentModel>();
        public ICollection<ProblemModel> Problems { get; set; } = new Collection<ProblemModel>();

        public long OwnerId { get; set; }
        public TeacherModel Owner { get; set; }

        public DateTime CreateTime { get; set; }
        public string SubmissionsFileName { get; set; }

        public ContestProgressState ProgressState
        {
            get
            {
                if (State == ContestState.UnPublished) return ContestProgressState.UnPublished;

                var time = DateTime.Now;
                if (StartTime >= time) return ContestProgressState.NoStarted;
                if (StartTime < time && EndTime > time) return ContestProgressState.InProgress;
                return ContestProgressState.Ended;
            }
        }
    }
}