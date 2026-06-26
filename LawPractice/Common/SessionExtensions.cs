using System;
using Newtonsoft.Json;
using System.Web.SessionState;
using BussinessLogic.BusinessEntity;

namespace LawPractice.Common
{
    public static class SessionExtensions
    {
        public static void Set<T>(this HttpSessionState session, string key, T value)
        {
            var source = JsonConvert.SerializeObject(value);
            session[key]= source;
        }

        public static T Get<T>(this HttpSessionState session, string key)
        {
            var value = session[key] as string; //session.GetString(key);
            return value == null ? default(T) :
                                  JsonConvert.DeserializeObject<T>(value);
        }
    }

    public class UserSession
    {
        public string Browser { get; set; }

        public string Platform { get; set; }

        public string MajorVersion { get; set; }

        public string MinorVersion { get; set; }

        public DateTime CreationTime { get; set; }

        public string IpAddress { get; set; }
    }

    public class ApplicationUserSession : UserSession
    {
        public ApplicationUser ApplicationUserDetails { get; set; }
    }
}

