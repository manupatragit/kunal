using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class FirmEmployee
    {
        public Guid UserId { get; set; }
        
        public string UserPhoto { get; set; }
        public string FirmCode { get; set; }
        
        public long RoleId { get; set; }
        public string RoleName { get; set; }
        public string UserFullName { get; set; }
        public Guid FirmId { get; set; }

        [DefaultValue(false)]
        public bool IsClient { get; set; }
        public string Packmodule { get; set; }
        public string Cases { get; set; }

        public string Events { get; set; }

        public string Tasks { get; set; }

        public string Password { get; set; }

        public string Details { get; set; }

        public string Name { get; set; }

        public string FirstName { get; set; } = "New";

        public string MiddleName { get; set; } = string.Empty;

        public string LastName { get; set; } = "User";

        public string FullName { get; set; }

        public List<Permission> Permissions { get; set; }

        public string Email { get; set; }

        public string UserName { get; set; }
        public int IsCaseWatchUser { get; set; }

        [DefaultValue(false)]
        public bool IsAdmin { get; set; }

        [DefaultValue("Employee")]
        public string DefaultController { get; set; } = "Firm";

        [DefaultValue("Index")]
        public string DefaultAction { get; set; } = "dashboard";

        // Hierarchy Feature properties
        public int UserLevel { get; set; } = 1;
        public List<Guid> SubordinateUserIds { get; set; } = new List<Guid>();
        public bool IsHierarchyFirm { get; set; } = false;
       
    }
   
    public class FieldDetail
    {
        public long CustomFieldId { get; set; }

        public dynamic Info { get; set; }
    }

    [Serializable]
    public class ApplicationUrl
    {
        public int Id { get; set; }
        public int Sequence { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }

        public string Url { get; set; }

        public string Type { get; set; }
    }

}
