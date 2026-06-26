using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using LawPractice.Common;
using Newtonsoft.Json.Linq;

namespace LawPractice.Areas.Administration.ApiController.API
{
    public class ApplicationUserApiController : BaseApiController
    {
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public string Login([FromBody]JObject paramJObject)
        {
            var request = paramJObject.ToObject<ApplicationUser>();
            var headers = Request.Headers;
            var password = Convert.ToString(headers.GetValues("Password").First());
            var user = Repository.ApplicationUser.Login(request.UserName, password);
            if (user != null)
            {
                CreateSession(HttpContext.Current, user);
            }
            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));

            return Area+y;
        }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool Registration([FromBody]JObject paramJObject) {
            return false; }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ForgotPassword([FromBody]JObject paramJObject) { return false; }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ValidateEmail([FromBody]JObject paramJObject) { return false; }

        [ApiAuthorization(Roles = "Admins")]
        [System.Web.Mvc.HttpPost]
        public ApplicationUser UserProfile() { return null; }

        [ApiAuthorization(Roles = "Admins")]
        [System.Web.Mvc.HttpPost]
        public bool ChangePassword([FromBody]JObject paramJObject) { return false; }
    }
}