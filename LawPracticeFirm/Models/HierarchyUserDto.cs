using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// DTO for hierarchy parent user dropdown
    /// </summary>
    public class HierarchyUserDto
    {
        public Guid Id { get; set; }
        public string UserFullName { get; set; }
        public int UserLevel { get; set; }
        public Guid? ParentUserId { get; set; }
        public string UserName { get; set; }
        public string ParentChain { get; set; }
    }
}
