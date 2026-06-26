using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataAccess.Models
{
    public class InvoiceList
    {
        public string Type { get; set; }
        public string ItemName { get; set; }
        public System.Guid CaseName { get; set; }
        public System.Guid UserName { get; set; }
        public string Quantity { get; set; }
        public string Price { get; set; }

        public string TotalAmount { get; set; }
        public string tempCaseName { get; set; }
        public string tempUserName { get; set; }
       
    }
}