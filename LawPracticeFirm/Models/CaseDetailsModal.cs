using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class CaseDetailsModal
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public List<CaseDetailsResult> data { get; set; }
    }
    public class CaseDetailsResult
    {
        public string Id { get; set; }
        public string CaseId { get; set; }
        public string Case_Diary { get; set; }
        public string Court { get; set; }
        public string Case_Name { get; set; }
        public string Bench_Name { get; set; }
        public string Advocate { get; set; }
        public string Next_Hearing { get; set; }
        public string Disposed_Date { get; set; }
        public string Status { get; set; }
        public string District { get; set; }
    }
}