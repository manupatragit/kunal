using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BussinessLogic.Common;

namespace LawPractice.Areas.Firm.Common
{
    public class FirmControllerAuthorizationAttribute : AuthorizeAttribute
    {
        private string _responseReason;

        private BaseFirmController _controller;
        public Module Module { get; set; }
        public AccessRight AccessRight { get; set; }

        public bool AdminUser { get; set; }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            _responseReason = string.Empty;
            var result = true;
            _controller = ((BaseFirmController)filterContext.Controller);
            if (!_controller.IsAutheticated)
            {
                var session = _controller.GetSession(HttpContext.Current);
                if (session != null)
                {
                    if (_controller.ValidateSession(HttpContext.Current))
                    {
                        if (AdminUser)
                        {
                            result = session.FirmUserDetails.IsAdmin;
                        }
                        else
                        {
                            if (!session.FirmUserDetails.IsAdmin && Module != 0)
                            {
                                if (AccessRight != 0)
                                {
                                    result = session.FirmUserDetails.Permissions.FindAll(r => r.ModuleName == Module).FindAll(a => a.AccessRights.FindAll(s => s.Equals(AccessRight)).Count > 0).Count > 0;
                                }
                                else
                                {
                                    result = session.FirmUserDetails.Permissions.FindAll(r => r.ModuleName == Module).Count > 0;
                                }
                                //Validate Permissions

                                if (!result)
                                {
                                    _responseReason = "UnAuthorized";
                                }
                            }
                        }
                        
                    }
                    else
                    {
                        result = false;
                        _responseReason = "SessionTimeOut";
                    }
                }
                else
                {
                    result = false;
                    _responseReason = "InValid";
                }
                _controller.IsAutheticated = result;
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
            if (_responseReason== "UnAuthorized")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
            }
            else if (_responseReason == "SessionTimeOut")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "Timeout" }));
            }
            else if (_responseReason == "InValid")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Account", action = "Login" }));
            }
        }
    }
}