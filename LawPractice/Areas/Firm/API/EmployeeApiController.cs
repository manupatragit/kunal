using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using LawPractice.Areas.Firm.Common;
using Newtonsoft.Json.Linq;

namespace LawPractice.Areas.Firm.API
{
    public class EmployeeApiController : BaseFirmApiController
    {
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public Tuple<string, List<URL>, List<URL>, FirmEmployee> UserProfile([FromBody]JObject paramJObject) {
            //var request = paramJObject.ToObject<FirmEmployee>();
            //long userId = 0;
            //if (request.UserId != 0)
            //{
            //    userId = request.UserId;
            //}
            //else
            //{
            //    userId = LoggedInUser.UserId;
            //}

            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                //Get URLs
                return new Tuple<string, List<URL>, List<URL>, FirmEmployee>(firm,Repository.Firm.GetMangeUrLs("FIRM", firm, LoggedInUser), Repository.Firm.GetAddUrLs( "FIRM", firm, LoggedInUser), LoggedInUser);
            }

            return null;
        }

        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser =true)]
        [FirmApiAuthorization(Module = Module.Users, AccessRight = AccessRight.Manage)]
        [FirmApiAuthorization(Module = Module.Users, AccessRight = AccessRight.Read)]
        public string FirmEmployeeList([FromBody]JObject paramJObject)
        {
            var d= Repository.FirmUser.GetFirmEmployees(LoggedInUser.FirmId, 1);
            return d;
        }

        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        [FirmApiAuthorization(Module = Module.Users, AccessRight = AccessRight.Manage)]
        public bool UpdateProfile([FromBody]JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var result=Repository.Firm.UpdateFirmInputData(request);
            if (result)
            {
                LoggedInUser.Details = Repository.FirmUser.UserProfile(LoggedInUser.FirmId, LoggedInUser.UserId, Convert.ToInt32(ModuleType.User));
                UpdateSession(HttpContext.Current, LoggedInUser);
            }
            return result;
        }

    }
}