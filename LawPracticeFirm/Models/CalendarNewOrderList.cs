using System;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Calender new order list
    /// </summary>
    public class CalendarNewOrderList
    {
        public string Casetype { get; set; }
        public string CaseNo { get; set; }
        public string Caseyear { get; set; }
        public string Casename { get; set; }
        public string Advname { get; set; }
        public string Court { get; set; }
        public string Disposeddt { get; set; }
        public string strfile { get; set; }
        public string Notes { get; set; }
        public string iid { get; set; }
        public string UserCaseId { get; set; }
    }
}