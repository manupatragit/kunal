using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Http;

namespace NoticeManagement.Api
{
    public class CustomizeFormApiController : BaseFirmApiController
    {
        private ICustomizeForm CustomizeFormRepository;
        public CustomizeFormApiController()
        {
            this.CustomizeFormRepository = new CustomizeFormRepository(new LawPracticeEntities());
        }

        /// <summary>
        /// Remove Field
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult RemoveField()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                CustomizeFormRepository.matterremovefield(firmid.ToString(), ctype.ToString(), fid.ToString());
                var output = "Record removed successfully.";
                return Ok(output);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Custom Fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult CustomFields([FromBody] JObject paramJObject)
        {
            List<DataAccess.Modals.CustomField> output = null;
            try
            {
                output = CustomizeFormRepository.CustomFieldList();
            }
            catch (Exception ex)
            {
            }
            return Ok(output);
        }

        /// <summary>
        /// Firm Get Custom Field
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult FirmGetCustomField([FromBody] JObject paramJObject)
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
                var noticeid = Convert.ToString(headers.GetValues("noticeid").First());
                long rty = Convert.ToInt32(configurationtype);
                if (String.IsNullOrEmpty(noticeid) || noticeid == "undefined" || noticeid == "null")
                {
                    noticeid = "";
                }
                var data = CustomizeFormRepository.FirmGetCustomField(firmid.ToString(), rty.ToString(), noticeid);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Post Save Firm Custom Fields
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult PostSaveFirmCustomFields(FirmConfiguredCustomField fm)
        {
            var firmid = LoggedInUser.FirmId.ToString();
            try
            {
                CustomizeFormRepository.savefirmcustom(fm, firmid.ToString());
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Custom Field Count
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult CustomFieldCount()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
                long ctype = Convert.ToInt32(configurationtype);
                var data = CustomizeFormRepository.customfieldcount(firmid.ToString(), ctype.ToString());
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Reset custom field
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ResetCF(FirmConfiguredCustomField fm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var loginuserid = LoggedInUser.UserId.ToString();
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var data = CustomizeFormRepository.ResetCF(firmid.ToString(), loginuserid.ToString(), ctype);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Publish Page
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult PublishPage(FirmConfiguredCustomField fm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var result = CustomizeFormRepository.publish(firmid.ToString(), ctype);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        #region Get customize coulmn header 

        /// <summary>
        /// Customize Col Get Header
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [FirmApiAuthorization()]
        public IHttpActionResult CustomizeColGetHeader()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").FirstOrDefault());
                long rty = Convert.ToInt32(configurationtype);
                var data = CustomizeFormRepository.GetHeaderNameCustomizeCol(firmid.ToString(), rty.ToString());
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        #endregion

        #region Common code for save customize field col map

        /// <summary>
        /// Save Customize Field Col Map
        /// </summary>
        /// <param name="guid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        [FirmApiAuthorization()]
        public void fnSaveCustomizeFieldColMap(string guid, string firmid, string userid)
        {
            var mcol1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col1"]);
            var mcol2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col2"]);
            var mcol3 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col3"]);
            var mcol4 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col4"]);
            var mcol5 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col5"]);
            var mcol6 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col6"]);
            var mcol7 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col7"]);
            var mcol8 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col8"]);
            var mcol9 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col9"]);
            var mcol10 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col10"]);
            var mcol11 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col11"]);
            var mcol12 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col12"]);
            var mcol13 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col13"]);
            var mcol14 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col14"]);
            var mcol15 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col15"]);
            var colcollection = QueryAES.UrlDecode(HttpContext.Current.Request.Form["headerval"]);
            CustomizeFieldCollection stuff1 = null;
            if (!String.IsNullOrEmpty(colcollection))
            {
                stuff1 = JsonSerializer.Deserialize<CustomizeFieldCollection>(colcollection);
            }
            int? ftype = null;
            try
            {
                ftype = Convert.ToInt32(stuff1.ftype);
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            int? sum = null;
            try
            {
                sum = Convert.ToInt32(stuff1.sum);
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt1 = null;
            try
            {
                ctxt1 = stuff1.ctxt1;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt2 = null;
            try
            {
                ctxt2 = stuff1.ctxt2;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt3 = null;
            try
            {
                ctxt3 = stuff1.ctxt3;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }

            string ctxt4 = null;
            try
            {
                ctxt4 = stuff1.ctxt4;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt5 = null;
            try
            {
                ctxt5 = stuff1.ctxt5;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt6 = null;
            try
            {
                ctxt6 = stuff1.ctxt6;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt7 = null;
            try
            {
                ctxt7 = stuff1.ctxt7;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt8 = null;
            try
            {
                ctxt8 = stuff1.ctxt8;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt9 = null;
            try
            {
                ctxt9 = stuff1.ctxt9;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt10 = null;
            try
            {
                ctxt10 = stuff1.ctxt10;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt11 = null;
            try
            {
                ctxt11 = stuff1.ctxt11;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt12 = null;
            try
            {
                ctxt12 = stuff1.ctxt12;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt13 = null;
            try
            {
                ctxt13 = stuff1.ctxt13;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            string ctxt14 = null;
            try
            {
                ctxt14 = stuff1.ctxt14;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }

            string ctxt15 = null;
            try
            {
                ctxt15 = stuff1.ctxt15;
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            if (mcol1 == "undefined")
            {
                mcol1 = null;
            }
            if (mcol2 == "undefined")
            {
                mcol2 = null;
            }
            if (mcol3 == "undefined")
            {
                mcol3 = null;
            }
            if (mcol4 == "undefined")
            {
                mcol4 = null;
            }
            if (mcol5 == "undefined")
            {
                mcol5 = null;
            }
            if (mcol6 == "undefined")
            {
                mcol6 = null;
            }
            if (mcol7 == "undefined")
            {
                mcol7 = null;
            }
            if (mcol8 == "undefined")
            {
                mcol8 = null;
            }

            if (mcol9 == "undefined")
            {
                mcol9 = null;
            }

            if (mcol10 == "undefined")
            {
                mcol10 = null;
            }

            if (mcol11 == "undefined")
            {
                mcol11 = null;
            }

            if (mcol12 == "undefined")
            {
                mcol12 = null;
            }

            if (mcol13 == "undefined")
            {
                mcol13 = null;
            }

            if (mcol14 == "undefined")
            {
                mcol14 = null;
            }

            if (mcol15 == "undefined")
            {
                mcol15 = null;
            }

            // map column
            for (int i = 1; i <= sum; i++)
            {
                var pid = guid;
                var column_no = "col" + i;
                var column_name = "";
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    column_name = ctxt;
                }
                CustomizeFormRepository.SaveCustomizeFieldColMap(firmid.ToString(), userid, column_no, column_name, pid, ftype);
            }
        }
        #endregion

        #region bind customize field attribute on edit

        /// <summary>
        /// Sp Column Maps
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpColMaps1()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                if (fid != null)
                {
                    var cid = Convert.ToInt32(fid);
                    var cases = CustomizeFormRepository.spcolmap1(firmid.ToString(), cid.ToString());
                    return Ok(cases);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        #endregion

        #region Customize field history

        /// <summary>
        /// Load Custom Field Version
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult LoadCustomFieledVersion()
        {
            try
            {
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var ModuleType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ModuleType"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var loginuserid = LoggedInUser.UserId.ToString();
                if (ModuleType != null)
                {
                    var data = CustomizeFormRepository.CustomFieldVersion(firmid.ToString(), loginuserid.ToString(), ModuleType.ToString());
                    return Ok(data);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load Custom Field Header
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult LoadCustomFieledHeader()
        {
            try
            {
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var VersionDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["VersionDate"]);
                var ModuleType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ModuleType"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var loginuserid = LoggedInUser.UserId.ToString();
                if (VersionDate != null)
                {
                    var data = CustomizeFormRepository.CustomFieldHistoryHeader(firmid.ToString(), loginuserid.ToString(), ModuleType, VersionDate.ToString());
                    return Ok(data);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load Custom Field Histroy
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult LoadCustomFieledHistroy()
        {
            try
            {
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var VersionDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["VersionDate"]);
                var ModuleType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ModuleType"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var loginuserid = LoggedInUser.UserId.ToString();
                if (VersionDate != null)
                {
                    var data = CustomizeFormRepository.CustomFieldHistory(firmid.ToString(), loginuserid.ToString(), VersionDate.ToString(), pagenum, pagesize, ModuleType);
                    return Ok(data);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        #endregion
    }
}
