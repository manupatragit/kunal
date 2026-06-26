using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class ApplicationUser
    {
        public long UserId { get; set; }
        public string Name { get; set; }

        public string FirstName { get; set; } = "New";

        public string MiddleName { get; set; } = string.Empty;

        public string LastName { get; set; } = "User";

        public string FullName { get; set; }

        public List<Permission> Permissions { get; set; }

        public string Email { get; set; }

        public string UserName { get; set; }

        [DefaultValue(false)]
        public bool IsAdmin { get; set; }

        [DefaultValue("Employee")]
        public string DefaultController { get; set; } = "Users";

        [DefaultValue("Index")]
        public string DefaultAction { get; set; } = "Index";
    }
}
