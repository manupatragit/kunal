using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Controllers;
using BussinessLogic.Common;
namespace LawPracticeFirm.Common
{
    public class FirmApiAuthorizationAttribute : System.Web.Http.AuthorizeAttribute
    {
        private string _responseReason;
       private BaseFirmApiController _controller;
       public Module Module { get; set; }
        public AccessRight AccessRight { get; set; }
        public bool AdminUser { get; set; }
        /// <summary>
        /// Handle authorized request
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            _responseReason = string.Empty;
            _controller = (BaseFirmApiController)actionContext.ControllerContext.Controller;
            if (!_controller.IsAutheticated && !IsAuthorized(actionContext))
            {
                HandleUnauthorizedRequest(actionContext);
            }
        }
        /// <summary>
        /// Handle unauthorized request
        /// </summary>
        /// <param name="actionContext"></param>
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden,
                   new ResponseError(false, _responseReason),
                   JsonMediaTypeFormatter.DefaultMediaType);
        }
        /// <summary>
        /// Handle isauthorized request
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var result = true;
            var session = _controller.GetSession(HttpContext.Current);
            if (session != null)
            {
                 if (_controller.ValidateSession(HttpContext.Current))
                {
                    // RBI: Partner/User treated as Admin for API authorization
                    bool isRBIPartnerUser = false;
                    try
                    {
                        string rbiFirmId = ConfigurationManager.AppSettings["RBICustomization"];
                        isRBIPartnerUser = !string.IsNullOrEmpty(rbiFirmId)
                            && session.FirmUserDetails.FirmId.ToString().ToUpper() == rbiFirmId.ToUpper()
                            && (session.FirmUserDetails.RoleId == 2 || session.FirmUserDetails.RoleId == 3);
                    }
                    catch { }

                    if (isRBIPartnerUser)
                    {
                        result = true;
                    }
                    else if (AdminUser)
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
                _responseReason = "InValid";
            }
            _controller.IsAutheticated = result;
            return result;
        }
    }
}
