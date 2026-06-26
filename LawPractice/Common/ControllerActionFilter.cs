using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LawPractice.Common
{
    public class ControllerActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var b = ((BaseController)filterContext.Controller);
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

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            base.OnResultExecuting(filterContext);
        }

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            base.OnResultExecuted(filterContext);
        }
    }
}