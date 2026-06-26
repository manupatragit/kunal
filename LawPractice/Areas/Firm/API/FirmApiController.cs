using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using LawPractice.Areas.Firm.Common;
using Newtonsoft.Json.Linq;

namespace LawPractice.Areas.Firm.API
{
    public class FirmApiController : BaseFirmApiController
    {
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public FirmDetail FirmInfo([FromBody]JObject paramJObject)
        {
            return Repository.Firm.FirmDetails(Area);
        }

        [FirmApiAuthorization(AdminUser = true)]
        [System.Web.Mvc.HttpPost]
        public List<CustomField> CustomFields([FromBody]JObject paramJObject)
        {
            return Repository.Configuration.CustomFieldList();
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public List<FirmCustomField> ConfiguredCustomFields([FromBody]JObject paramJObject)
        {
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            return Repository.Configuration.FirmCustomFieldList(LoggedInUser.FirmId, Convert.ToInt32(configurationtype));
        }

        [FirmApiAuthorization(AdminUser = true)]
        [System.Web.Mvc.HttpPost]
        public bool SaveFirmCustomFields([FromBody]JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmCustomFieldList>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var result= Repository.Configuration.AddFirmCustomFieldList(request.CustomFieldList, Convert.ToInt32(configurationtype), LoggedInUser);
            return result;
        }

        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        [FirmApiAuthorization(Module = Module.Matters, AccessRight = AccessRight.Manage)]
        [FirmApiAuthorization(Module = Module.Matters, AccessRight = AccessRight.Read)]
        public string FirmCasesList([FromBody]JObject paramJObject)
        {
            //var d = Repository.FirmUser.GetFirmEmployees(UserInfo.FirmId, 1);
            return "[]";
        }
    }
}