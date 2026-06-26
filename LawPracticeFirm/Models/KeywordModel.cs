using DataAccess.Modals;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Data;
using System.Net;
using System.Text;

namespace LawPracticeFirm.Models.Keyword
{
    public class KeywordModel
    {
        /// <summary>
        /// User search keyword
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public static DataTable UserSearchKeywords(string userId,string pagenum, string pagesize)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("vKeyword"); dt.Columns.Add("isActive"); dt.Columns.Add("vCourtType");

            DataTable keylist = new DataTable();
            keylist.Columns.Add("TotalRecord"); keylist.Columns.Add("RowId"); keylist.Columns.Add("iid");
            keylist.Columns.Add("vUsername"); keylist.Columns.Add("vKeyword"); keylist.Columns.Add("ddate");
            keylist.Columns.Add("isActive"); keylist.Columns.Add("vCourtType"); keylist.Columns.Add("courtTypeName");
            keylist.Columns.Add("vCourtName");
            
            try
            {
                
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    UserId = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    Pageindex = pagenum,
                    Pagesize = pagesize
                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UserSearchKeywords"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;

                    // Add parts to the list.
                    keylist.Rows.Add(
                    data.data[i].TotalRecord,
                    data.data[i].RowId,
                    data.data[i].iid,
                    data.data[i].vUsername,
                    data.data[i].vKeyword,
                    data.data[i].ddate,
                    data.data[i].isActive,
                    data.data[i].vCourtType,
                    data.data[i].courtTypeName,
                    data.data[i].vCourtName
                    );
                }
                if (keylist.Rows.Count > 0)
                {
                    DataView view = new DataView(keylist);
                    view.Sort = "vKeyword asc";
                    DataTable distinctValues1 = view.ToTable(true, "vKeyword", "isActive", "vCourtType");
                    DataRow[] distinctValues = distinctValues1.Select("isActive='1' and vCourtType='3'");
                    foreach (DataRow dr in distinctValues)
                    {
                        object[] row = dr.ItemArray;
                        dt.Rows.Add(row);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return dt;

        }
        /// <summary>
        /// Active user keyword
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="courttype"></param>
        /// <param name="IsCWuser"></param>
        /// <param name="CUUserId"></param>
        /// <returns></returns>
        public static DataTable ActiveUsersKeywords(string userId, string courttype,int IsCWuser,string CUUserId)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("vKeyword");
            try
            {

                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClientConnection();
                //For CW Live User Migartion
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                if (IsCWuser == 1)
                {
                    userIdDetail = CUUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = strusername;
                }
                object rawfile = new
                {
                    UserId = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    Courttype = courttype
                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ActiveUsersKeywords"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];


                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;

                    // Add parts to the list.
                    dt.Rows.Add(data.data[i].vKeyword);
                }                
            }
            catch (Exception ex)
            {

            }
            return dt;

        }
    }
}