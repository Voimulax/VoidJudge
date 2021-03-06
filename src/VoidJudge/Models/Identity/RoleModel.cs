﻿using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Identity
{
    public enum RoleType
    {
        Admin,
        Teacher,
        Student
    }

    public class RoleModel
    {
        public long Id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(256)")]
        public string Name { get; set; }

        [Required]
        [Column(TypeName = "int")]
        public RoleType Type { get; set; }
        public ICollection<UserModel> Users { get; set; } = new Collection<UserModel>();
    }
}