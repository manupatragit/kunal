using System;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using LawPractice.Common;
using Newtonsoft.Json.Linq;

namespace LawPractice.Controllers.API
{
    public class FirmAccountApiController : BaseApiController
    {
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public string Registration([FromBody]JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmDetail>();
            var requestuser = paramJObject.ToObject<FirmEmployee>();
            var headers = Request.Headers;
            var password = Convert.ToString(headers.GetValues("Password").First());
            //var key = Convert.ToString(headers.GetValues("Key").First());
            if (CacheManager.FindFirmByName(request.FirmCode))
            {
                throw new ValidationException("Firm Code already exist!");
            }

            request.AdminUser = new FirmEmployee
            {
                UserName = requestuser.UserName,
                Password = password,
                Email=requestuser.Email,
                FirstName= requestuser.FirstName,
                MiddleName=requestuser.MiddleName,
                LastName=requestuser.LastName
            };
            var result= Repository.Firm.AddFirm(request);
            CacheManager.RefreshFirmList();
            if (result)
            {
                var firmurl = Convert.ToString(ConfigurationManager.AppSettings["firmurl"]);
                firmurl = firmurl.EndsWith("/") ? firmurl : string.Concat(firmurl, "/");
                return string.Concat(firmurl, request.FirmCode);
            }
            
            return string.Empty;
        }
    }
}