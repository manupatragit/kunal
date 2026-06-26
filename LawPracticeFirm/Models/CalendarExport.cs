using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Calender export model
    /// </summary>
    public class CalendarExport
    {
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public string AdvocateName { get; set; }
        public string MatterName { get; set; }
        public string Task_EventName { get; set; }
        public string MatterType { get; set; }
        public string CourtName { get; set; }
        public string MatterNo { get; set; }
    }
}