using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LawPracticeFirm.Common
{
    public class FirmControllerActionFilter : ActionFilterAttribute
    {
        /// <summary>
        /// On action executing
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var b = ((BaseFirmController)filterContext.Controller);
            if (b.IsAutheticated)
            {
                if (!b.ValidateSession(HttpContext.Current))
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "Timeout" }));
                }
            }
            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
        }
    }
}