using System;
using System.Web;
using System.Web.Http;
using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;
using LawPractice.Common;

namespace LawPractice.Areas.Firm.Common
{
    public class BaseFirmApiController:ApiController
    {
        protected string Area { get; set; }

        protected string Controller { get; set; }

        protected string Action { get; set; }

        protected FirmEmployee LoggedInUser { get; set; }

        public bool IsAutheticated { get; set; }

        public BusinessRepositoryFactory Repository => new BusinessRepositoryFactory();

        public BaseFirmApiController()
        {
            IsAutheticated = false;
            if (HttpContext.Current.Request.UrlReferrer != null)
                Area = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
        }

        protected void CreateSession(HttpContext context, FirmEmployee user)
        {
            var browser = string.IsNullOrEmpty(context.Request.Headers["User-Agent"]) ? string.Empty : Convert.ToString(context.Request.Headers["User-Agent"]);
            context.Session.Set("User", new FirmUserSession { Browser = browser, FirmUserDetails = user, CreationTime=DateTime.Now });
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

        public FirmUserSession GetSession(HttpContext context)
        {
            var obj = context.Session.Get<FirmUserSession>("User");
            if (obj != null)
            {
                LoggedInUser = obj.FirmUserDetails;
            }

            return obj;
        }

        protected void UpdateSession(HttpContext context, FirmEmployee user)
        {
            var session = GetSession(context);
            if (session != null)
            {
                session.CreationTime = DateTime.Now;
                session.FirmUserDetails = user;
                context.Session.Set("User", session);
            }
        }


        protected void RemoveSession(HttpContext context)
        {

            context.Session.Remove("User");
        }
    }
}