using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic.BusinessEntity
{
    public class AttachWorkFlowItems
    {
        public long Id { get; set; }
        public long ObjectId { get; set; }
        public string PreviousObjectIds { get; set; }
        public string NextObjctIds { get; set; }
        public long FormId { get; set; }
        public string AssignTo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ObjectType { get; set; }
    }

    public class AttachWorkFlow
    {
        public long WorkFlowAttachId { get; set; }

        public long WorkFlowId { get; set; }

        public long AttachedItemId { get; set; }

        public long ConfigurationTypeId { get; set; }

        public bool IsPublished { get; set; }
        public List<AttachWorkFlowItems> Items { get; set; }
    }

    public class AttachWorkFlowItem
    {
        public long Id { get; set; }
        public long AttachedItemId { get; set; }

        public long AttachedItemConfigurationtype { get; set; }

        public string AttachedItemConfigurationName { get; set; }

        public bool IsPublished { get; set; }
    }
}
