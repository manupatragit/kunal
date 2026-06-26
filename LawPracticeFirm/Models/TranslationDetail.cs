using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Summary details model
    /// </summary>
    public class TranslationDetail
    {
        public long MasterCaseId { get; set; }
        public string UserCaseId { get; set; }
        public string Translation { get; set; }
        public string OrderIds { get; set; }
        public string OrderDates { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string MatterName { get; set; }
    }
}