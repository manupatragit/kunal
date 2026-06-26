using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;

namespace LawPractice.Common
{
    public class ApplicationControllerAuthorizationAttribute : AuthorizeAttribute
    {
        private string responseReason;

        private BaseController controller;
        public Module Module { get; set; }
        public AccessRight AccessRight { get; set; }

        public bool AdminUser { get; set; }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            responseReason = string.Empty;
            var result = true;
            controller = ((BaseController)filterContext.Controller);
            if (!controller.IsAutheticated)
            {
                var session = controller.GetSession<ApplicationUser>(HttpContext.Current);
                if (session != null)
                {
                    if (controller.ValidateSession(HttpContext.Current))
                    {
                        if (AdminUser)
                        {
                            result = session.ApplicationUserDetails.IsAdmin;
                        }
                        else
                        {
                            if (!session.ApplicationUserDetails.IsAdmin && Module != 0)
                            {
                                if (AccessRight != 0)
                                {
                                    result = session.ApplicationUserDetails.Permissions.FindAll(r => r.ModuleName == Module).FindAll(a => a.AccessRights.FindAll(s => s.Equals(AccessRight)).Count > 0).Count > 0;
                                }
                                else
                                {
                                    result = session.ApplicationUserDetails.Permissions.FindAll(r => r.ModuleName == Module).Count > 0;
                                }
                                //Validate Permissions

                                if (!result)
                                {
                                    responseReason = "UnAuthorized";
                                }
                            }
                        }
                        
                    }
                    else
                    {
                        result = false;
                        responseReason = "SessionTimeOut";
                    }
                }
                else
                {
                    result = false;
                    responseReason = "InValid";
                }
                controller.IsAutheticated = result;
                if (!result)
                {
                    HandleUnauthorizedRequest(filterContext);
                }
            }

            
            //base.OnAuthorization(filterContext);
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //base.HandleUnauthorizedRequest(filterContext);
            if (responseReason== "UnAuthorized")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
            }
            else if (responseReason == "SessionTimeOut")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "Timeout" }));
            }
            else if (responseReason == "InValid")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Account", action = "Login" }));
            }
        }
    }
}