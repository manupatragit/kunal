using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Summary details model
    /// </summary>
    public class SummaryDetail
    {
        public long MasterCaseId { get; set; }
        public string UserCaseId { get; set; }
        public string JobId { get; set; }
        public string Summary { get; set; }
        public string OrderIds { get; set; }
        public string OrderDates { get; set; } 
        public DateTime? CreatedOn { get; set; }
        public string MatterName { get; set; }
    }
}