using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class GlobalSearchApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "GlobalSearch";

        /// <summary>
        /// Global Load Knowldge Details by row id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult GlobalLoadKnowldgeDetailsbyrowid()
        {
            try
            {
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                var strdoctext = "";
                var type = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]));
                var strdoctitle = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["strtxt"]));
                if (type == 1)
                {
                    if (dirtoken != null)
                    {
                        if (dirtoken == "0")
                        {
                            dirtoken = "00000000-0000-0000-0000-000000000000";
                        }
                        var db = new LawPracticeEntities();
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        List<usp_wf_GetKnowldgeDetailswithFolder_Result> list = new List<usp_wf_GetKnowldgeDetailswithFolder_Result>();
                        list = db.usp_wf_GetKnowldgeDetailswithFolder(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize, dirtoken, pageid).ToList();
                        foreach (var data in list.ToList())
                        {
                            usp_wf_GetKnowldgeDetailswithFolder_Result newItem = new usp_wf_GetKnowldgeDetailswithFolder_Result();
                            newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                            list[list.IndexOf(data)].Id = newItem.Id;
                            if (!String.IsNullOrEmpty(data.AzureFileId))
                            {
                                newItem.AzureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AzureFileId.ToString()));
                                list[list.IndexOf(data)].AzureFileId = newItem.AzureFileId;
                            }
                        }
                        var param = controllername + ">LoadKnowldgeDetailsbyrowid>usp_wf_GetKnowldgeDetailswithFolder_Result>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var a = JsonConvert.SerializeObject(list);
                        return Ok(a);
                    }
                    else
                    {
                        return Ok();
                    }
                }
                else
                {
                    if (dirtoken != null)
                    {
                        if (dirtoken == "0")
                        {
                            dirtoken = "00000000-0000-0000-0000-000000000000";
                        }
                        var db = new LawPracticeEntities();
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        List<usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result> list = new List<usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result>();
                        list = db.usp_wf_GetKnowldgeDetailswithFolder_DocIndex2(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize, dirtoken, pageid).ToList();
                        foreach (var data in list.ToList())
                        {
                            usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result newItem = new usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result();
                            newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                            list[list.IndexOf(data)].Id = newItem.Id;
                            if (!String.IsNullOrEmpty(data.AzureFileId))
                            {
                                newItem.AzureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AzureFileId.ToString()));
                                list[list.IndexOf(data)].AzureFileId = newItem.AzureFileId;
                            }
                        }
                        var param = controllername + ">LoadKnowldgeDetailsbyrowid>usp_wf_GetKnowldgeDetailswithFolder_Result>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var a = JsonConvert.SerializeObject(list);
                        return Ok(a);
                    }
                    else
                    {
                        return Ok();
                    }
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Receive Message by row id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadReceiveMessagebyrowid()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                string guid = System.Guid.NewGuid().ToString();
                var list = db.usp_CaseCommuniquelistGlobal(firmid, userid, pagenum, pagesize, search).ToList();
                foreach (var data in list.ToList())
                {
                    if (data.CaseId != null)
                    {
                        var decryptid = Convert.ToBase64String(QueryAES.EncryptAes(data.CaseId.ToString()));
                        list[list.IndexOf(data)].CaseId = decryptid;
                    }
                    else
                    {
                        list[list.IndexOf(data)].CaseId = "";
                    }
                }
                var comlist = JsonConvert.SerializeObject(list);
                return Ok(comlist);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Message), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Message), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Chat Message by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadChatMessagebyrowid()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                string guid = System.Guid.NewGuid().ToString();
                var chatlist = db.sp_GetChatArchive(firmid, userid, search, pagenum, pagesize).ToList();
                return Ok(chatlist);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Message), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Message), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

    }
}