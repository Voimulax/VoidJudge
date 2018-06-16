using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VoidJudge.Models.Identity;

namespace VoidJudge.Models.storage
{
    public class FileModel
    {
        public long Id { get; set; }

        public long UserId { get; set; }
        public UserModel User { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string UploadName { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string SaveName { get; set; }
        public DateTime CreateTime { get; set; }
    }
}