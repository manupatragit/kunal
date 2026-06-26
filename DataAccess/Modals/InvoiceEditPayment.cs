using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataAccess.Models
{
    public class InvoiceEditPayment
    {
        public string PaymentType { get; set; }
        public string PaymentMode { get; set; }
        public string Amount { get; set; }
        public string PDate { get; set; }

        public string BankName { get; set; }
        public string DdNo { get; set; }
        public string Ddidate { get; set; }

        public string ChequeNo { get; set; }
        public string RefNo { get; set; }
        public string Chqidate { get; set; }
        public string OtherDetails { get; set; }

        public string Cleared { get; set; }
        public string Firmid { get; set; }
        public string Id { get; set; }
        public string InvoiceId { get; set; }
        public string date_time { get; set; }

        public string iupdate { get; set; }

        public string iupload { get; set; }

        public string userid { get; set; }

       
    }
}