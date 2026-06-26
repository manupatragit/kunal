using System;
using System.Web;
using System.Web.Http;
using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;

namespace LawPractice.Common
{
    public class BaseApiController:ApiController
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

        public BaseApiController()
        {
            IsAutheticated = false;
            Area = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
        }

        protected void CreateSession(HttpContext context, ApplicationUser user)
        {
            var browser = string.IsNullOrEmpty(context.Request.Headers["User-Agent"]) ? string.Empty : Convert.ToString(context.Request.Headers["User-Agent"]);
            context.Session.Set("User", new ApplicationUserSession { Browser = browser, ApplicationUserDetails = user, CreationTime=DateTime.Now });
        }

        public bool ValidateSession(HttpContext context)
        {
            var result = true;
            var session = GetSession(context);
            if (session==null)
            {
                result = false;
            }
            else
            {
                var browser = string.IsNullOrEmpty(context.Request.Headers["User-Agent"]) ? string.Empty : Convert.ToString(context.Request.Headers["User-Agent"]);
                if (DateTime.Now.Subtract(session.CreationTime).Minutes>30 || session.Browser!= browser)
                {
                    result = false;
                }
                else
                {
                    session.CreationTime = DateTime.Now;
                    context.Session.Set("User", session);
                }
            }
            return result;
        }

        public ApplicationUserSession GetSession(HttpContext context)
        {
            var obj = context.Session.Get<ApplicationUserSession>("User");
            if (obj != null)
            {
                LoggedInUser = obj.ApplicationUserDetails;
            }

            return obj;
        }

        protected void UpdateSession<T>(HttpContext context, ApplicationUser user)
        {
            var session = GetSession(context);
            if (session != null)
            {
                session.CreationTime = DateTime.Now;
                session.ApplicationUserDetails = user;
                context.Session.Set("User", session);
            }
        }


        protected void RemoveSession(HttpContext context)
        {

            context.Session.Remove("User");
        }
    }
}