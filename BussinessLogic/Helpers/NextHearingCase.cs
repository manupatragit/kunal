using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class NextHearingCase
    {
       

        public string id { get; set; }
        public string CreatedDate { get; set; }
        public string CourseName { get; set; }
        public string Casetype { get; set; }
        public string CaseNo { get; set; }
        public string Caseyear { get; set; }
        public string Court { get; set; }
        public string Disposeddt { get; set; }
        public string Advname { get; set; }
        public string Casename { get; set; }
        public string Localfile { get; set; }
        public string OrderDateFinal { get; set; }
        public string Finaldate { get; set; }

        public string LastFinaldate { get; set; }
        public int y { get; set; }

        public string t { get; set; }
        public string Ismanual { get; set; }
        public string EventType { get; set; }

    }
}