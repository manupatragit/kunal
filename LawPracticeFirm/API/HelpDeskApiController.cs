using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class HelpDeskApiController : BaseFirmApiController
    {
        private LawPracticeEntities db = new LawPracticeEntities();

        /// <summary>
        /// Help Content List
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HelpContentList()
        {
            try
            {
                string leadid = QueryAES.UrlDecode(QueryAES.UrlDecode(HttpContext.Current.Request.Form["leadid"]));
                List<sp_GetHelpList_Result> list = new List<sp_GetHelpList_Result>();
                list = db.sp_GetHelpList().ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Help Content Sub Topic List
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HelpContentSubTopicList()
        {
            try
            {
                int subid = 0;
                subid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["subid"]));
                List<sp_GetHelpListSubtopic_Result> list = new List<sp_GetHelpListSubtopic_Result>();
                list = db.sp_GetHelpListSubtopic(subid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Help Search Topic
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HelpSearchTopic()
        {
            try
            {
                string search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var list = db.sp_GetHelpTopic(search).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Help Topic by ID
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HelpTopicID()
        {
            try
            {
                int tid = 0;
                tid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["tid"]));
                var list = db.sp_GetHelpTopicID(tid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

    }
}