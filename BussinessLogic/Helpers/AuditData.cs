using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Web;
using System.Management;

namespace LawPractice.Models
{
    public class AuditData
    {
        public enum REQUEST_TYPE
        {
            WEB = 1,
            SERVICE = 2,
            API = 3
        }

        public enum EventType
        {
            Registration = 1,
            Login = 2,
            Logout = 3,
            Matter = 4,
            Case = 5,
            Activites = 6,
            Calendar = 7,
            Client = 8,
            User = 9,
            Lead = 10,
            CustomField = 11,
            FileDirectory = 12,
            Contact = 13,
            Message = 14,
            Timer = 15,
            Template = 16,
            WorkFlow = 17,
            ChangePassowrd = 18,
            Firm = 19,
            Knowledge = 20,
            ManuSearch = 21,
            Employee = 22,
            CW=23,
            
        }

        public enum Severity
        {
            High = 1,
            Low = 2,
            Normal = 3
        }
        public static string GetMacAddress()
        {
            NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();
            String sMacAddress = string.Empty;
            foreach (NetworkInterface adapter in nics)
            {
                if (sMacAddress == String.Empty)// only return MAC Address from first card  
                {
                    IPInterfaceProperties properties = adapter.GetIPProperties();
                    sMacAddress = adapter.GetPhysicalAddress().ToString();
                }
            }
            return sMacAddress;
        }
        /// <summary>
        /// Get my IP
        /// </summary>
        /// <returns></returns>
        public static string myIP()
        {
            string ipAdd = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ipAdd))
            {
                ipAdd = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {

            }
            return ipAdd;
        }

        
    }

}