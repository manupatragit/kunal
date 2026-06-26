using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using Newtonsoft.Json.Linq;
using LawPractice.Areas.Firm.Common;

namespace LawPractice.Areas.Firm.API
{
    public class AccountApiController : BaseFirmApiController
    {
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public string Login([FromBody]JObject paramJObject)
        {
            var request = paramJObject.ToObject<User>();
            var headers = Request.Headers;
            var password = Convert.ToString(headers.GetValues("Password").First());
            var key = Convert.ToString(headers.GetValues("Key").First());
            //Decrypt Password
            var user = Repository.FirmUser.Login(request.UserName, password, key,Area);

            CreateSession(HttpContext.Current, user);            

            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
            return (Area + y);
        }

        

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ForgotPassword([FromBody]JObject paramJObject) { return false; }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ValidateEmail([FromBody]JObject paramJObject) { return false; }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public ApplicationUser UserProfile() { return null; }

        [System.Web.Mvc.HttpPost]
        public bool ChangePassword([FromBody]JObject paramJObject) { return false; }
    }
}