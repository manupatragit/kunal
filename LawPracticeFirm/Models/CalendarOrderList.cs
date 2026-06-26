using System;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Calender order list
    /// </summary>
    public class CalendarOrderList
    {
        public string Casetype { get; set; }
        public string CaseNo { get; set; }
        public string Caseyear { get; set; }
        public string Casename { get; set; }
        public string Advname { get; set; }
        public string Court { get; set; }
        public string Disposeddt { get; set; }
        public string strfile { get; set; }
        public string DiaryNo { get; set; }
        public string csno { get; set; }
        public string Vordernexthearing { get; set; }
        public string ManualNexthearing { get; set; }
        public string IsReraCheck { get; set; }
        public string Matterids { get; set; }
        public string Mattername { get; set; }
        public string UserCaseId { get; set; }
        public string CursorKey { get; set; }
    }
}