using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataAccess.Models
{
    public class InvoicePayment
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
    }
}