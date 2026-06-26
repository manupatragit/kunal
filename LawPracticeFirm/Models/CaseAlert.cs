using System;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case Alert
    /// </summary>
    public class CaseAlert
    {
        public int ID { get; set; }
        public string masterappealno { get; set; }
        public string Courtname { get; set; }
        public string vCaseName { get; set; }
        public string vnexthearing { get; set; }
        public string vDisposedDate { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string AlertFor { get; set; }
        public string AlertType { get; set; }
        public string createdOn { get; set; }
        public string isSent { get; set; }
        public string alertDays { get; set; }
        public string firmid { get; set; }
        public string alertdate { get; set; }
        public string Manualnexthearing { get; set; }
    }
}
