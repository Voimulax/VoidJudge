using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Identity
{

    public class UserModel
    {
        public long Id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(256)")]
        public string LoginName { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(256)")]
        public string UserName { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(128)")]
        public string PasswordHash { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime LastLoginTime { get; set; }

        [Required]
        public long RoleId { get; set; }
        public RoleModel Role { get; set; }
    }
}