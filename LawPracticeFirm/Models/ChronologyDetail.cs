using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Chronology details model
    /// </summary>
    public class ChronologyDetail
    {
        public long MasterCaseId { get; set; }
        public string UserCaseId { get; set; }
        public string JobId { get; set; }
        public string Chronology { get; set; }
        public string Remarks { get; set; }
        public string OrderIds { get; set; }
        public string OrderDates { get; set; }      
        public DateTime? CreatedOn { get; set; }  
        public string MatterName { get; set; }     
    }

}