using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LawPractice
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //routes.MapMvcAttributeRoutes();
            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { area = "", controller = "Home", action = "Index", id = UrlParameter.Optional, company= "" },
                constraints: new { company = new RouteConstraint() },
                namespaces: new[] { "LawPractice.Controllers" }
            );

            routes.MapRoute(
                name: "Error",
                url: "{*catchall}",
                defaults: new { area = "", controller = "Error", action = "Index", id = UrlParameter.Optional },
               
                namespaces: new[] { "LawPractice.Controllers" }
            );
        }
    }

    internal class RouteConstraint : IRouteConstraint
    {

        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary routeValues, RouteDirection routeDirection)
        {

            var controllername = Convert.ToString(routeValues["controller"]);
            var actionname = Convert.ToString(routeValues["action"]);

            return (string.IsNullOrEmpty(Convert.ToString(routeValues[parameterName])));
            
        }
    }
}
