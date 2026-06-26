using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Drafter details model
    /// </summary>
    public class AIDrafterDetail
    {
        public string DraftQuery { get; set; }
        public string QueryType { get; set; }
        public string ResultDraft { get; set; }
        public string Job_Id { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}