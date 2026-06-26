using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class WebClientConnection : System.Net.WebClient
    {
        public int Timeout { get; set; }

        protected override WebRequest GetWebRequest(Uri Address)
        {
            WebRequest WebReq = base.GetWebRequest(Address);
            WebReq.Timeout = 540000; // milliSeconds
            return WebReq;
        }
    }
}