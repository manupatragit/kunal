using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using LawPracticeFirm.Common;
using Newtonsoft.Json.Linq;

namespace LawPracticeFirm.API
{
    public class FirmApiController : BaseFirmApiController
    {
        /// <summary>
        /// Firm info 
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public Tuple<List<ApplicationUrl>, List<ApplicationUrl>, FirmDetail> FirmInfo([FromBody] JObject paramJObject)
        {
            var landing = CacheManager.UrlList.Where(w => w.Type.ToUpper() == "LANDING").ToList();
            var other = CacheManager.UrlList.Where(w => w.Type.ToUpper() == "OTHER").ToList();
            var d = Repository.Firm.FirmDetails(Area);
            return new Tuple<List<ApplicationUrl>, List<ApplicationUrl>, FirmDetail>(landing, other, d);
        }
        #region Custom Fields
        /// <summary>
        /// Custom Field
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public List<CustomField> CustomFields([FromBody] JObject paramJObject)
        {
            return Repository.Configuration.CustomFieldList();
        }

        /// <summary>
        /// Custom Form Custom Fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public List<CustomField> CustomFormCustomFields([FromBody] JObject paramJObject)
        {
            return Repository.Configuration.CustomformCustomFieldList();
        }

        /// <summary>
        /// Configured Custom Fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public FirmCustomFieldList ConfiguredCustomFields([FromBody] JObject paramJObject)
        {
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var formid = string.Empty;
            if (Convert.ToInt32(configurationtype) == 6)
            {
                formid = Convert.ToString(headers.GetValues("id").First());
            }
            var data = new FirmCustomFieldList();
            data.CustomFieldList = Repository.Configuration.FirmCustomFieldList(LoggedInUser.FirmId.ToString(), Convert.ToInt32(configurationtype), formid);
            if (Convert.ToInt32(configurationtype) == 6)
            {
                Repository.Configuration.GetCustomFormName(LoggedInUser.FirmId.ToString(), formid.ToString(), data);
            }
            return data;
        }

        /// <summary>
        /// Save Firm Custom Fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization(AdminUser = true)]
        [System.Web.Mvc.HttpPost]
        public bool SaveFirmCustomFields([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmCustomFieldList>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var result = Repository.Configuration.AddFirmCustomFieldList(request, Convert.ToInt32(configurationtype), LoggedInUser.FirmId.ToString());
            return result;
        }
        #endregion

        #region Case
        /// <summary>
        /// Firm Cases List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmCasesList([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var caseurl = CacheManager.FindUrlByName("caseDetail");
            var userurl = CacheManager.FindUrlByName("userDetail");
            var clienturl = CacheManager.FindUrlByName("ClientDetail");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, caseurl));
                urls.Add(string.Concat("/", firm, userurl));
                urls.Add(string.Concat("/", firm, clienturl));
            }
            var d = string.Empty;
            if (request.Id > 0)
            {
                d = Repository.Firm.GetUserSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), Convert.ToString(request.Id));
            }
            else
            {
                d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Case));
            }
            return new Tuple<string, List<string>>(d, urls);
        }

        /// <summary>
        /// Firm Cases
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public string FirmCases([FromBody] JObject paramJObject)
        {
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            var d = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), pname);
            return d;
        }

        /// <summary>
        /// Case Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> CaseDetails([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var u = Repository.Firm.GetDetails(LoggedInUser.FirmId.ToString(), request.Id, Convert.ToInt32(configurationtype));
            return new Tuple<string, string>(string.Empty, u);
        }

        /// <summary>
        /// Add New Case
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddNewCase([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var result = Repository.Case.AddCase(request.Data, LoggedInUser.FirmId.ToString());
            return result;
        }

        /// <summary>
        /// Update Case Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateCaseDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            if (request.Id <= 0)
            {
                return false;
            }
            var result = Repository.Firm.UpdateFirmInputData(request, request.Id);
            return result;
        }
        #endregion

        #region Task

        /// <summary>
        /// Firm Tasks List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmTasksList([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var taskurl = CacheManager.FindUrlByName("TaskDetail");
            var userurl = CacheManager.FindUrlByName("UserDetail");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, taskurl));
                urls.Add(string.Concat("/", firm, userurl));
            }
            var d = string.Empty;
            if (request.Id > 0)
            {
                d = Repository.Firm.GetUserSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), Convert.ToString(request.Id));
            }
            else
            {
                d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Task));
            }
            return new Tuple<string, List<string>>(d, urls);
        }

        /// <summary>
        /// Firm Tasks
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public string FirmTasks([FromBody] JObject paramJObject)
        {
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            var d = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), pname);
            return d;
        }

        /// <summary>
        /// Task Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> TaskDetails([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var u = Repository.Firm.GetDetails(LoggedInUser.FirmId.ToString(), request.Id, Convert.ToInt32(configurationtype));
            return new Tuple<string, string>(string.Empty, u);
        }

        /// <summary>
        /// Add New Task
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddNewTask([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var result = Repository.Task.AddTask(request.Data, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            return result;
        }

        /// <summary>
        /// Update Task Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateTaskDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            if (request.Id <= 0)
            {
                return false;
            }
            var result = Repository.Firm.UpdateFirmInputData(request, request.Id);
            return result;
        }
        #endregion

        #region Events
        /// <summary>
        /// Firm Events List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmEventsList([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var taskurl = CacheManager.FindUrlByName("TaskDetail");
            var userurl = CacheManager.FindUrlByName("UserDetail");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, taskurl));
                urls.Add(string.Concat("/", firm, userurl));
            }
            var d = string.Empty;
            if (request.Id > 0)
            {
                d = Repository.Firm.GetUserSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Event), Convert.ToString(request.Id));
            }
            else
            {
                d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Event));
            }
            return new Tuple<string, List<string>>(d, urls);
        }

        /// <summary>
        /// Firm Events
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public string FirmEvents([FromBody] JObject paramJObject)
        {
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            var d = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), pname);
            return d;
        }

        /// <summary>
        /// Event Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> EventDetails([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var u = Repository.Firm.GetDetails(LoggedInUser.FirmId.ToString(), request.Id, Convert.ToInt32(configurationtype));
            return new Tuple<string, string>(string.Empty, u);
        }

        /// <summary>
        /// Add New Event
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddNewEvent([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var result = Repository.Event.AddEvent(request.Data, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            return result;
        }

        /// <summary>
        /// Update Event Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateEventDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            if (request.Id <= 0)
            {
                return false;
            }
            var result = Repository.Firm.UpdateFirmInputData(request, request.Id);
            return result;
        }
        #endregion

        #region Client

        /// <summary>
        /// Firm Client List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmClientList([FromBody] JObject paramJObject)
        {
            var url = CacheManager.FindUrlByName("clientDetail");
            var caseurl = CacheManager.FindUrlByName("CaseList");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, url));
                urls.Add(string.Concat("/", firm, caseurl));
            }
            var d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Client));
            return new Tuple<string, List<string>>(d, urls);
        }

        /// <summary>
        /// Firm Clients
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public string FirmClients([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<CustomField>();
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            var d = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Client), pname, request.DefaultValues);
            return d;
        }

        /// <summary>
        /// Client Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> ClientDetails([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var headers = Request.Headers;
            var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
            var u = Repository.FirmClient.GetInformation(LoggedInUser.FirmId.ToString(), request.Id.ToString());
            return u;
        }

        /// <summary>
        /// Add Client
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddClient([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var result = Repository.FirmClient.AddClient(request.Client, request.Data, LoggedInUser.FirmId.ToString());
            return result;
        }

        /// <summary>
        /// Update Client Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateClientDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            if (request.Id <= 0)
            {
                return false;
            }
            var result = Repository.Firm.UpdateFirmInputData(request, request.Id);
            return result;
        }
        #endregion

        #region Work Flow

        /// <summary>
        /// Add work flow
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddWorkFlow([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<WorkFlow>();

            var d = Repository.WorkFlow.AddWorkFlow(request, LoggedInUser.FirmId.ToString());

            return true;
        }

        /// <summary>
        /// Work flow list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<List<WorkFlow>, List<string>> WorkFlowList([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<WorkFlow>();
            var types = new string[] { "WORKFLOWDETAIL", "ATTACHWORKFLOW" };
            string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
            var urls = CacheManager.UrlList.Where(u => types.Contains(u.Type)).OrderBy(o => o.Sequence).Select(s => string.Concat("/", firm, s.Url)).ToList();
            var d = Repository.WorkFlow.GetWorkFlows(LoggedInUser.FirmId.ToString());
            return new Tuple<List<WorkFlow>, List<string>>(d, urls);
        }

        /// <summary>
        /// Update Work Flow
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateWorkFlow([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<WorkFlow>();
            var d = Repository.WorkFlow.UpdateWorkFlowDetail(request, LoggedInUser.FirmId.ToString());
            return true;
        }

        /// <summary>
        /// Remove Work Flow
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool RemoveWorkFlow([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<WorkFlow>();
            var d = Repository.WorkFlow.DeleteWorkFlow(request.Id.ToString());
            return true;
        }

        /// <summary>
        /// Work Flow Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public WorkFlow WorkFlowDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<WorkFlow>();
            var d = Repository.WorkFlow.GetWorkFlowDetail(request.Id.ToString(), request.IsPublished);
            return d;
        }

        /// <summary>
        /// Attach Work Flow
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public long AttachWorkFlow([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<AttachWorkFlow>();
            var d = Repository.WorkFlow.AttachWorkFlow(request);
            return d;
        }

        /// <summary>
        /// Attach Work Flow Detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public AttachWorkFlow AttachWorkFlowDetail([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<AttachWorkFlow>();
            var d = Repository.WorkFlow.AttachWorkFlowDetail(request.WorkFlowAttachId.ToString(), request.WorkFlowId.ToString());
            return d;
        }

        /// <summary>
        /// Attach Work Flow Item List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        public List<AttachWorkFlowItem> AttachWorkFlowItemList([FromBody] JObject paramJObject)
        {
            var workFlowId = Convert.ToInt64(Request.Headers.GetValues("wfId").First());
            var d = Repository.WorkFlow.AttachWorkFlowItemList(workFlowId.ToString());
            return d;
        }

        /// <summary>
        /// get custom cases
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization(AdminUser = true)]
        [System.Web.Mvc.HttpPost]
        public List<CustomField> CustomCases([FromBody] JObject paramJObject)
        {
            return Repository.Configuration.CustomCaseList();
        }
        #endregion

        #region CustomForms
        /// <summary>
        /// Firm Custom Forms List
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmCustomFormsList([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmInputData>();
            var isPublished = false;
            if (Request.Headers.Contains("published"))
            {
                isPublished = Convert.ToBoolean(Request.Headers.GetValues("published").First());
            }
            var formurl = CacheManager.FindUrlByName("FormDetail");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, formurl));
            }
            var d = string.Empty;
            if (request.Id > 0)
            {
                d = Repository.Firm.GetUserSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Custom), Convert.ToString(request.Id));
            }
            else
            {
                d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Custom), 0, isPublished);
            }
            return new Tuple<string, List<string>>(d, urls);
        }
        #endregion

    }
}