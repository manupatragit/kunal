using System;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BussinessLogic.BusinessRepository;
using LawPractice.Common;

namespace LawPractice.Areas.Firm
{
    public class FirmAreaRegistration : AreaRegistration 
    {
        public override string AreaName => "Firm";

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Firm_default",
                url: "{company}/{controller}/{action}/{caseid}/{userid}",
                defaults: new { area = "Firm", controller = "Home", action = "Index", caseid = UrlParameter.Optional, userid = UrlParameter.Optional },
                constraints: new { company = new FirmRouteConstraint() },
                namespaces: new[] { "LawPractice.Areas.Firm.Controllers" }
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
                var firmexist = CacheManager.FindBy(company);// new BusinessRepositoryFactory().Firm.FirmDetails(company);
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