using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic
{
    public class MyWebClient : WebClient
    {
        //time in milliseconds
        private int timeout;
        public int Timeout
        {
            get
            {
                return timeout;
            }
            set
            {
                timeout = value;
            }
        }

        public MyWebClient()
        {
            this.timeout = 20000;
        }

        public MyWebClient(int timeout)
        {
            this.timeout = timeout;
        }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var result = base.GetWebRequest(address);
            result.Timeout = this.timeout;
            return result;
        }
    }

}
