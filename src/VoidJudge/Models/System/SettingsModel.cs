using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.System
{
    public enum SettingsType
    {
        UploadLimit
    }

    public class SettingsModel
    {
        public long Id { get; set; }

        [Required]
        [Column(TypeName = "int")]
        public SettingsType Type { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Value { get; set; }
    }
}