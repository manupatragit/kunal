using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataAccess.Models
{
    public class InvoiceEditList
    {
        public string Iid { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceId { get; set; }
        public string PaymentType { get; set; }

        public string Firmid { get; set; }
        public string userid { get; set; }
        public string QtyORHour { get; set; }
        public string billedbyname { get; set; }
        public string billyby { get; set; }
        public string caseid { get; set; }
        public string casename { get; set; }
        public string date_time { get; set; }
        public string itemname { get; set; }

        public string iupdate { get; set; }
        public string iupload { get; set; }
        public string price { get; set; }

        public string type { get; set; }
        public string CaseName { get; set; }
        public string UserName { get; set; }
       
        public string Price { get; set; }
        public string TotalAmount { get; set; }
        public string tempCaseName { get; set; }
        public string tempUserName { get; set; }

    }
}