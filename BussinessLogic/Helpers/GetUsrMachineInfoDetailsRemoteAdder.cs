using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BussinessLogic
{
    public class GetUsrMachineInfoDetailsRemoteAdder
    {
        public static string stServer
        {
            get { return "https://www.manupatra.com"; }
        }
        public static string stReferer
        {
            get { return HttpContext.Current.Request.ServerVariables["HTTP_REFERER"]; }
        }
        public static string stUserIp
        {
            get { return HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]; }
        }

        public static string stUserAddress
        {
            get { return HttpContext.Current.Request.ServerVariables["REMOTE_HOST"]; }
        }

        public static string stScriptName
        {
            get { return HttpContext.Current.Request.ServerVariables["SCRIPT_NAME"]; }
        }

        public static string stServerPort
        {
            get { return HttpContext.Current.Request.ServerVariables["SERVER_PORT"]; }
        }

        public static string stForwardFor
        {
            get { return HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]; }
        }


        public static string stLOGON_USER
        {
            get { return HttpContext.Current.Request.ServerVariables["LOGON_USER"]; }
        }
        public static string stUserAgent
        {
            get { return HttpContext.Current.Request.UserAgent; }
        }
        public static string IsSuccess
        {
            get { return "4"; }
        }
        public static string IsError
        {
            get { return "0"; }
        }

    }
}
