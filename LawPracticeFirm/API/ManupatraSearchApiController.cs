using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class ManupatraSearchApiController : BaseFirmApiController
    {
        // GET: ManupatraSearchApi
        private LawPracticeEntities db1 = new LawPracticeEntities();

        /// <summary>
        /// View Search Query Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewSearchQueryData()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                List<sp_GetSearchQuery_Result> list = new List<sp_GetSearchQuery_Result>();
                list = db.sp_GetSearchQuery(firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Act State Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ActStateData()
        {
            DataTable dt = new DataTable();
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(db_manuconn))
                using (SqlCommand cmd = new SqlCommand("usp_esp_GetState", conn))
                {
                    SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                    adapt.SelectCommand.CommandType = CommandType.StoredProcedure;
                    adapt.Fill(dt);
                }
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Act By State
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ActByState()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
            DataTable dt = new DataTable();
            GetActDataObjList gList = new GetActDataObjList();
            string stateid = "0", act = "";
            try
            {
                stateid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["stateid"]);
                act = QueryAES.UrlDecode(HttpContext.Current.Request.Form["act"]);
                using (SqlConnection conn = new SqlConnection(db_manuconn))
                using (SqlCommand cmd = new SqlCommand("usp_GetAct", conn))
                {
                    SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                    adapt.SelectCommand.CommandType = CommandType.StoredProcedure;
                    adapt.SelectCommand.Parameters.Add(new SqlParameter("@istateid", SqlDbType.VarChar, 100));
                    adapt.SelectCommand.Parameters["@istateid"].Value = stateid;

                    adapt.SelectCommand.Parameters.Add(new SqlParameter("@actname", SqlDbType.VarChar, 100));
                    adapt.SelectCommand.Parameters["@actname"].Value = act;
                    adapt.Fill(dt);
                }
                
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    GetActDataObj oob = new GetActDataObj();
                    oob.Value = dt.Rows[i]["iActID"].ToString();
                    oob.Text = dt.Rows[i]["vactdesc"].ToString();
                    gList.Add(oob);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(dt);
            
        }

        /// <summary>
        /// Act Section
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ActSection()
        {
            DataTable dt = new DataTable();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
            string actid = "0";
            try
            {
                actid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["actid"]);
                using (SqlConnection conn = new SqlConnection(db_manuconn))
                using (SqlCommand cmd = new SqlCommand("usp_GetActSection", conn))
                {
                    SqlDataAdapter adapt = new SqlDataAdapter(cmd);
                    adapt.SelectCommand.CommandType = CommandType.StoredProcedure;
                    adapt.SelectCommand.Parameters.Add(new SqlParameter("@iActid", SqlDbType.VarChar, 50));
                    adapt.SelectCommand.Parameters["@iActid"].Value = actid;
                    adapt.Fill(dt);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(dt);
        }

        /// <summary>
        /// Insert Search Query
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertSearchQuery()
        {
            var db = new LawPracticeEntities();
            string message = "";
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string vSearchName = "", vText = "", vAct = "", vcitation = "", stateid = "", Section = "", act = "", qry = "";
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["stateid"]))))
            {
                stateid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["stateid"]);
            }
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["act"]))))
            {
                act = QueryAES.UrlDecode(HttpContext.Current.Request.Form["act"]);
            }
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Section"]))))
            {
                Section = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Section"]);
            }
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["citation"]))))
            {
                vcitation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["citation"]);
            }
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["qry"]))))
            {
                vText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["qry"]);
            }
            if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchname"]))))
            {
                vSearchName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchname"]);
            }
            vAct = "Act=" + act;
            if (!string.IsNullOrEmpty(Section) && Section != "0")
            {
                vAct = vAct + "&Sec=" + Section;
            }
            int result = 0;
            try
            {
                result = db.sp_InsertSearchQuery(vSearchName,vText,vAct,vcitation,firmid,userid);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            if (result > 0)
            {
                message = "Success";
            }
            else
            {
                message = "exceed";
            }
            return Ok(message);
        }

        /// <summary>
        /// Change Status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChangeStatus()
        {
            var db = new LawPracticeEntities();
            string result = "", status = "", enqId = "";
            try
            {
                if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]))))
                {
                    status = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]));
                }
                if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["enqId"]))))
                {
                    enqId = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["enqId"]));
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();

                int res = db.usp_UpdateIsActiveManupatraAlertQuery(Convert.ToInt32(status), Convert.ToInt32(enqId), firmid,userid);
                if (res > 0)
                {
                    result = "Success";
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(result);
        }

        /// <summary>
        /// Remove Search Query
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveSearchQuery()
        {
            var db = new LawPracticeEntities();
           
            string result = "", eiid="0";
            try
            {
                if (!string.IsNullOrEmpty(Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["iid"]))))
                {
                    eiid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["iid"]));
                }
                    int res = db.sp_DeleteSearchQuery(Convert.ToInt32(eiid));
                    if (res > 0)
                    {
                        result = "Success";
                    }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok(result);
        }
    }

    
    public class GetActDataObj
    {
        private string iActID = "";
        private string vactdesc = "";
        public string Value
        {
            get
            {
                return iActID;
            }
            set
            {
                iActID = value;
            }
        }
        public string Text
        {
            get
            {
                return vactdesc;
            }

            set
            {
                vactdesc = value;
            }
        }
    }
    public class GetActDataObjList : List<GetActDataObj>
    {
        public GetActDataObjList()
        { }
    }
}