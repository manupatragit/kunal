using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Web.SessionState;

namespace LawPracticeFirm
{
    public class Application : System.Web.HttpApplication
    {
        public static string AppKey { get; private set; }

        public static string AppSecret { get; private set; }
        protected void Application_PreSendRequestHeaders()
        {
            if (HttpContext.Current != null)
            {
                HttpContext.Current.Response.Headers.Remove("Server");
                HttpContext.Current.Response.Headers.Remove("X-AspNet-Version");
            }
        }
        protected void Application_Start()
        {
            //RouteTable.Routes.MapMvcAttributeRoutes();
            InitializeAppKeyAndSecret();
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
      

        protected void Application_PostAuthorizeRequest()
        {
            if (IsWebApiRequest())
            {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }

        private bool IsWebApiRequest()
        {
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith(WebApiConfig.UrlPrefixRelative);
        }
        private void InitializeAppKeyAndSecret()
        {
            var appKey = WebConfigurationManager.AppSettings["DropboxAppKey"];
            var appSecret = WebConfigurationManager.AppSettings["DropboxAppSecret"];

            if (string.IsNullOrWhiteSpace(appKey) ||
                string.IsNullOrWhiteSpace(appSecret))
            {
                var infoPath = HttpContext.Current.Server.MapPath("~/App_Data/DropboxInfo.json");

                if (File.Exists(infoPath))
                {
                    string json;

                    using (var stream = new FileStream(infoPath, FileMode.Open, FileAccess.Read))
                    {
                        var reader = (TextReader)new StreamReader(stream);
                        json = reader.ReadToEnd();
                    }
                    var ser = new JavaScriptSerializer();
                    var info = ser.Deserialize<Dictionary<string, string>>(json);

                    appKey = info["AppKey"];
                    appSecret = info["AppSecret"];
                }
            }

            AppKey = appKey;
            AppSecret = appSecret;
        }
        /// <summary>
        /// Check Seesion for change Password.
        /// </summary>
        protected void Application_PreRequestHandlerExecute()
        {
            HttpContext context = System.Web.HttpContext.Current;
            if (context.Session != null && context.Session.Count != 0)
            {
                if (context.Session["sessionuserid"] != null)
                {
                    if (HttpContext.Current.Session["tempUserGrid"] != null && context.Session["tempUserGrid"].ToString() == "")
                    {
                        string currentsession = context.Session["sessionuserid"].ToString();
                        if (Application["SessionAbandonFlags"] != null &&
                          ((List<string>)Application["SessionAbandonFlags"]).Contains(currentsession))
                        {
                            HttpContext.Current.Application.Remove(currentsession);
                            Session.Abandon();
                        }
                    }
                }
            }
        }
    }
}
