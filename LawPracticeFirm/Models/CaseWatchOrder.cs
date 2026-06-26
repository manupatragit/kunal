using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case watch order
    /// </summary>
    public class CaseWatchOrder
    {
        public string Id { get; set; }
        public string Order_Date { get; set; }
        public string Status { get; set; }
        public string Filename { get; set; }
        public string Filepath { get; set; }
        public DateTime OrderDateForTimeLine { get; set; }
        public string OrderData { get; set; }
        public string DisputeLandDetails { get; set; }
        public string JudgeName { get; set; }
        public string BusinessDate { get; set; }
        public string Hearing { get; set; }
        public string Purpose { get; set; }
        public string vCauseListType { get; set; }
        public string Courttype { get; set; }
        public string vLocalFile { get; set; }
        public string Ordernotescount { get; set; }
        public string vCourt { get; set; }

    }
}