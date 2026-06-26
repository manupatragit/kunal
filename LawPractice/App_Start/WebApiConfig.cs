using System.Web.Http;
using System.Web.Http.Cors;
using LawPractice.Common;
using Newtonsoft.Json.Serialization;

namespace LawPractice
{
    public static class WebApiConfig
    {
        public static string UrlPrefix => "api";
        public static string UrlPrefixRelative => "~/api";

        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            ((DefaultContractResolver)config.Formatters.JsonFormatter.SerializerSettings.ContractResolver).IgnoreSerializableAttribute = true;
            // Web API routes
            var corsAttr = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(corsAttr);
            config.MapHttpAttributeRoutes();
            config.Filters.Add(new ApiActionFilter());
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: UrlPrefix + "/{controller}/{action}"
            );
        }
    }
}
