using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LawPractice.Areas.Administration
{
    public class AdministrationAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Administration";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                name:"Administration_default",
                url: "Administration/{controller}/{action}/{id}",
                defaults: new { area = "Administration", controller = "Account", action = "Login", id = UrlParameter.Optional },
                constraints: new { area = new AdministrationRouteConstraint() },
                namespaces: new[] { "LawPractice.Areas.Administration.Controllers" }
            );
        }
    }
    internal class AdministrationRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary routeValues, RouteDirection routeDirection)
        {
            var result = true;
            var company = Convert.ToString(routeValues[parameterName]);
            var controller = Convert.ToString(routeValues["controller"]);
            var action = Convert.ToString(routeValues["action"]);
            if (!string.IsNullOrEmpty(company))
            {
                if (!company.ToUpper().Equals("ADMINISTRATION"))
                {
                    result = false;
                }
            }

            return result;
        }
    }
}