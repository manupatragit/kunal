using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case Cause List Details
    /// </summary>
    public class CaseCauseListDetails
    {
        public int CaseId { get; set; }
        public string Case { get; set; }
        public string Court { get; set; }
        public string Courtname { get; set; }
      
    }
}