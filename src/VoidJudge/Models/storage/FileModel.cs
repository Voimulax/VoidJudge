using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VoidJudge.Models.Identity;

namespace VoidJudge.Models.Storage
{
    public enum FileType
    {
        Upload, Build
    }

    public class FileModel
    {
        public long Id { get; set; }

        public long UserId { get; set; }
        public UserModel User { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string OriginName { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(256)")]
        public string SaveName { get; set; }

        [Required]
        [Column(TypeName = "int")]
        public FileType Type { get; set; }
        public DateTime CreateTime { get; set; }
    }
}