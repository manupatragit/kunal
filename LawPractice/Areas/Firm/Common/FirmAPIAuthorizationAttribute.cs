using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Controllers;
using BussinessLogic.Common;
using LawPractice.Common;

namespace LawPractice.Areas.Firm.Common
{
    public class FirmApiAuthorizationAttribute : System.Web.Http.AuthorizeAttribute
    {
        private string _responseReason;

       private BaseFirmApiController _controller;
       public Module Module { get; set; }
        public AccessRight AccessRight { get; set; }

        public bool AdminUser { get; set; }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            _responseReason = string.Empty;
            _controller = (BaseFirmApiController)actionContext.ControllerContext.Controller;
            if (!_controller.IsAutheticated && !IsAuthorized(actionContext))
            {
                HandleUnauthorizedRequest(actionContext);

            }
            //base.OnAuthorization(actionContext);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden,
                   new ResponseError(false, _responseReason),
                   JsonMediaTypeFormatter.DefaultMediaType);

            //base.HandleUnauthorizedRequest(actionContext);
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var result = true;


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
                            //result = session.UserDetails.Permissions.FindAll(r => r.ModuleName == Module).FindAll(a => a.AccessRights.FindAll(s => s.Equals(AccessRight)).Count > 0).Count > 0;
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
                _responseReason = "InValid";
            }
            _controller.IsAutheticated = result;
            return result;
        }
    }

}
