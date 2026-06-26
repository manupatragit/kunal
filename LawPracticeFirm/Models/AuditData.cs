using QueryStringEDAES;
using System;
using System.Net.NetworkInformation;
using System.Web;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Audit data
    /// </summary>
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
            TrdsrcIPR = 24,
            TrdPropIPR = 25,
            TrdAgtIPR = 26,
            CpysrcIPR = 27,
            CpyAppIPR = 28,
            PtntsrcIPR = 29,
            PtntAppIPR = 30,
            GIsrcIPR = 31,
            GIAppIPR = 32,
            DgnsrcIPR = 33,
            DgnAppIPR = 34,
            IPRComn = 35,
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
        /// <summary>
        /// Helper function to decode and trim form values
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetFormValue(string key)
        {
            var value = HttpContext.Current.Request.Form[key];
            return string.IsNullOrWhiteSpace(value) ? string.Empty : QueryAES.UrlDecode(value).Trim();
        }
        /// <summary>
        /// Get Normalized GUID value, return empty GUID if value is null or "null"
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string NormalizeGuid(string value)
        {
            return string.IsNullOrEmpty(value) || value == "null" ? Guid.Empty.ToString() : value;
        }
        /// <summary>
        /// Get Http Request header value, return empty string if value is null or whitespace
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetHttpRequestHeader(string key)
        {
            var value = HttpContext.Current.Request.Headers[key];
            return string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
        }
        /// <summary>
        /// Get Decrypted value from Base64 encoded string with replace, return empty string if value is null or whitespace
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string GetFormValueWithFromBase64StringWithReplace(string value)
        {
            return string.IsNullOrWhiteSpace(value) ? string.Empty : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(value)).Trim();
        }
    }
}