using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class ProcessEntryDetalsModal
    {
       public string Case_details { set; get; }
        public string Issue_date { set; get; }

        public string Pw_Details { set; get; }

        public string Type_Of_Process { set; get; }

        public string Evidance_Date { set; get; }

        public string Service_Status { set; get; }
        public string Not_Serve_Reason { set; get; }
        public string Pw_Presence_status_on_date_of_evidance { set; get; }
        public string Pw_Absent_reason { set; get; }

        public string Court_Action { set; get; }
        public string Absent_other_reason { set; get; }

        public string Present_other_reason { set; get; }

        public string Note { set; get; }

    }
}