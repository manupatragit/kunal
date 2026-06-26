using LawPracticeFirm.Common;
using System;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
namespace LawPracticeFirm
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapMvcAttributeRoutes();
            routes.MapRoute(
                "Firm_default",
                url: "{company}/{controller}/{action}/{type}/{id}/{anotherid}",
                defaults: new { controller = "firm", action = "home", type = UrlParameter.Optional, id = UrlParameter.Optional.ToString(), anotherid = UrlParameter.Optional },
                constraints: new { company = new FirmRouteConstraint() },
                namespaces: new[] { "LawPracticeFirm.Controllers" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "home", action = "index", id = UrlParameter.Optional ,}
            );
        }
    }
    internal class FirmRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary routeValues, RouteDirection routeDirection)
        {
            var result = true;
            var company = Convert.ToString(routeValues[parameterName]);
            if (IsWebApiRequest())
            {
                return false;
            }
            if (!string.IsNullOrEmpty(company))
            {
                var firmexist = CacheManager.FindFirmByName(company);// new BusinessRepositoryFactory().Firm.FirmDetails(company);
                if (company.ToUpper().Equals("ADMINISTRATION"))
                {
                    result = false;
                }
                else if (firmexist)
                {
                    var match = Regex.Match(company, @"^\w{3,15}$", RegexOptions.IgnoreCase);
                    if (!match.Success)
                    {
                        result = false;
                    }
                }
                else
                {
                    result = false;
                }
            }
            return result;
        }
        private bool IsWebApiRequest()
        {
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath != null && HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith(WebApiConfig.UrlPrefixRelative);
        }
    }
}
