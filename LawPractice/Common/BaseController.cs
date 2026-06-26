
using System.Web.Mvc;
using System.Web;
using BussinessLogic.BusinessRepository;
using BussinessLogic.BusinessEntity;
using System;

namespace LawPractice.Common
{
    [ControllerActionFilter]
    public class BaseController : Controller
    {
        protected string Area { get; set; }

        protected string Controller { get; set; }

        protected string Action { get; set; }
        protected ApplicationUser LoggedInUser { get; set; }

        public bool IsAutheticated { get; set; }

        public BusinessRepositoryFactory Repository
        {
            get
            {
                return new BusinessRepositoryFactory();
            }
        }

        public BaseController()
        {
            IsAutheticated = false;
            //Area= (System.Web.HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
        }


        protected void CreateSession<T>(HttpContext context, ApplicationUser user)
        {
            context.Session.Set("User", new ApplicationUserSession { Browser = context.Request.Headers["User-Agent"].ToString(), ApplicationUserDetails = user, CreationTime = DateTime.Now });
        }

        public bool ValidateSession(HttpContext context)
        {
            var result = true;
            var session = GetSession<ApplicationUser>(context);
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

        public ApplicationUserSession GetSession<T>(HttpContext context)
        {
            var obj = context.Session.Get<ApplicationUserSession>("User");
            if (LoggedInUser == null && obj != null)
            {
                LoggedInUser = obj.ApplicationUserDetails;
            }
            
            return obj;
        }

        protected void RemoveSession(HttpContext context)
        {

            context.Session.Remove("User");
        }
    }
}
