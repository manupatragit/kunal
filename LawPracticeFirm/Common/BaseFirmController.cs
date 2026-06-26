using System;
using System.Web;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;

namespace LawPracticeFirm.Common
{
    [FirmControllerActionFilter]
    public class BaseFirmController : Controller
    {
        protected string Area { get; set; }

        protected string Controller { get; set; }

        protected string Action { get; set; }
        protected FirmEmployee LoggedInUser { get; set; }

        public bool IsAutheticated { get; set; }

        public BusinessRepositoryFactory Repository => new BusinessRepositoryFactory();

        public BaseFirmController()
        {
            IsAutheticated = false;
            //Area= (System.Web.HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
        }

        /// <summary>
        /// Validate session that valid or not
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public bool ValidateSession(HttpContext context)
        {
            var result = true;
            var session = GetSession(context);
            if (session == null)
            {
                result = false;
            }
            else
            {
                var browser = string.IsNullOrEmpty(context.Request.Headers["User-Agent"]) ? string.Empty : Convert.ToString(context.Request.Headers["User-Agent"]);
                if (DateTime.Now.Subtract(session.CreationTime).Minutes > 300 || session.Browser != browser)
                {
                    result = false;
                }
            }
            return result;
        }
        /// <summary>
        /// Get user logged in details from session
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public FirmUserSession GetSession(HttpContext context)
        {
            var obj = context.Session.Get<FirmUserSession>("User");
            if (obj != null)
            {
                LoggedInUser = obj.FirmUserDetails;
            }

            return obj;
        }
        /// <summary>
        /// Remove user session details
        /// </summary>
        /// <param name="context"></param>
        protected void RemoveSession(HttpContext context)
        {

            context.Session.Remove("User");
        }
    }
}
