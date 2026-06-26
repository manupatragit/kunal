using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.BAL;
using NJDGDetail.DAL;
using QueryStringEDAES;
using System;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;
namespace NJDGDetail.Models
{
    public class AddCaseObjectController : BaseFirmApiController
    {
        static int iidIndex = 0;
        static int courtidIndex = 0;
        static int courtnameIndex = 0;
        static int casetypeIndex = 0;
        static int casetypenameIndex = 0;
        static int benchidIndex = 0;
        static int benchnameIndex = 0;
        static int sideidIndex = 0;
        static int sidenameIndex = 0;
        static int totalcaseIndex = 0;
        static bool isInitialized = false;
        static int ditrictvalueIndex = 0;
        static int ditrictnameIndex = 0;

        /// <summary>
        /// Initialize add court index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeAddCourtIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    courtidIndex = reader.GetOrdinal("vcourtid");
                    courtnameIndex = reader.GetOrdinal("vcourtname");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read add court name data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadAddCourtNameData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.Iid = reader.GetInt32(iidIndex);
            addcase.Courtid = reader.GetString(courtidIndex);
            addcase.Courtname = reader.GetString(courtnameIndex);
            return addcase;
        }

        /// <summary>
        /// Get all court name
        /// </summary>
        /// <returns></returns>
        public static AddCaseObjectList GetAllCourtname()
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCourtName, null))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddCourtIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddCourtNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize add case index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeAddCaseIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    casetypeIndex = reader.GetOrdinal("vcasetype");
                    casetypenameIndex = reader.GetOrdinal("vcasetypename");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }

        /// <summary>
        /// Read add case name data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadAddCaseNameData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.Casetype = reader.GetString(casetypeIndex);
            addcase.Casetypename = reader.GetString(casetypenameIndex);
            return addcase;
        }

        /// <summary>
        /// Get all case type by court id
        /// </summary>
        /// <param name="crtid"></param>
        /// <param name="courtitle"></param>
        /// <param name="bench"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetAllCaseTypeByCourtId(string crtid, string courtitle, string bench, string side)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@courtid", crtid);
            param[1] = new SqlParameter("@vcourtitle", courtitle);
            param[2] = new SqlParameter("@vbench", bench);
            param[3] = new SqlParameter("@vside", side);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCaseTypeByCourtID, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddCaseIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddCaseNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Get district case type
        /// </summary>
        /// <param name="courttype"></param>
        /// <param name="dsttype"></param>
        /// <param name="compesttype"></param>
        /// <param name="compestcourt"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetDistrictCaseType(string courttype, string dsttype, string compesttype, string compestcourt)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@courttype", courttype);
            param[1] = new SqlParameter("@disticttype", dsttype);
            param[2] = new SqlParameter("@CompEstbType", compesttype);
            param[3] = new SqlParameter("@CompEstCourt", compestcourt);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetDistrictCaseType, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddDistrictCaseTypeIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadDistrictCaseTypeData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize add district case type index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeAddDistrictCaseTypeIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    ditrictvalueIndex = reader.GetOrdinal("vCaseType");
                    ditrictnameIndex = reader.GetOrdinal("vCaseTypeName");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read district case type
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadDistrictCaseTypeData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.BenchID = reader.GetString(ditrictvalueIndex);
            addcase.Benchname = reader.GetString(ditrictnameIndex);
            return addcase;
        }
        /// <summary>
        /// Get district by court
        /// </summary>
        /// <param name="court"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetDistrictByCourt(string court)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@court", court);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetDistrictNameByCourt, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddDistrictIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddDistrictNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize add district index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeAddDistrictIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    ditrictvalueIndex = reader.GetOrdinal("vDistrictValue");
                    ditrictnameIndex = reader.GetOrdinal("vDistrictName");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read add district name data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadAddDistrictNameData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.BenchID = reader.GetString(ditrictvalueIndex);
            addcase.Benchname = reader.GetString(ditrictnameIndex);
            return addcase;
        }
        /// <summary>
        /// Get all district name by comp est
        /// </summary>
        /// <param name="courttype"></param>
        /// <param name="dsttype"></param>
        /// <param name="compesttype"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetAllDistrictNameByCompEst(string courttype, string dsttype, string compesttype)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@courttype", courttype);
            param[1] = new SqlParameter("@disticttype", dsttype);
            param[2] = new SqlParameter("@CompEstbType", compesttype);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetDistrictCourtCompEstb, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddDistrictByCompEstIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadDistrictByCompEstData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize add district by comp est index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeAddDistrictByCompEstIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    ditrictvalueIndex = reader.GetOrdinal("vCompEstbCourt");
                    ditrictnameIndex = reader.GetOrdinal("vCompEstbCodeName");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read district by comp est data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadDistrictByCompEstData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.BenchID = reader.GetString(ditrictvalueIndex);
            addcase.Benchname = reader.GetString(ditrictnameIndex);
            return addcase;
        }
        /// <summary>
        /// Get all court name by court type
        /// </summary>
        /// <param name="courttype"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetAllCourtnameByCourtType(string courttype)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@courttype", courttype);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCourtNameByCourtId, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddCourtIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddCourtNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize get bench index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeGetBenchIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    benchidIndex = reader.GetOrdinal("vbench");
                    benchnameIndex = reader.GetOrdinal("BenchName");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Initialize NCB bench index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeGetNCBenchIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    benchidIndex = reader.GetOrdinal("vbench");
                    benchnameIndex = reader.GetOrdinal("vbenchname");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read bench data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadBenchData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.BenchID = reader.GetString(benchidIndex);
            addcase.Benchname = reader.GetString(benchnameIndex);
            return addcase;
        }
        /// <summary>
        /// Get bench details
        /// </summary>
        /// <param name="crtid"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetBench(string crtid)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@courtid", crtid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetBenchName, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetBenchIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadBenchData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Initialize get side index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeGetSideIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    sideidIndex = reader.GetOrdinal("vside");
                    sidenameIndex = reader.GetOrdinal("Side");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read side data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadSideData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.SideID = reader.GetString(sideidIndex);
            addcase.Sidename = reader.GetString(sidenameIndex);
            return addcase;
        }
        /// <summary>
        /// Get side
        /// </summary>
        /// <param name="bench"></param>
        /// <param name="court"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetSide(string bench, string court)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@benchid", bench);
            param[1] = new SqlParameter("@court", court);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetSidebyBenchId, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetSideIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadSideData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Get bench type
        /// </summary>
        /// <param name="crtid"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetBenchType(string crtid)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@courtid", crtid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetNCBench, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetNCBenchIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadBenchData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKasecaseLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Insert district CNR
        /// </summary>
        /// <param name="userfirmid"></param>
        /// <param name="Userid"></param>
        /// <param name="caseid"></param>
        /// <param name="Cnrno"></param>
        /// <returns></returns>
        public static string InsertDistrictCNR(string userfirmid, string Userid, string caseid, string Cnrno)
        {
            var db = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                userid = WebConfigurationManager.AppSettings["matteridname"] + Userid,
                cnrno = Cnrno,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMyKaseCNRCase"), "POST", builders);
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;
            if (status == "True")
            {
                //insert cnr in mykase map table
                var insertusermap = db.usp_savecaselinkentry(userfirmid, caseid, Cnrno, Userid);
            }
            return "";
        }
        /// <summary>
        /// Insert new case details
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string InsertCaseDetailNew(AddCaseObject addcaseobj, int iflag, string useremail, string usermobile, string userfirmid, string userid)
        {
            string ds = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var db = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = addcaseobj.Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = "Mykase_User",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;
            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);
                // add case in casewatch
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = addcaseobj.Username,
                    Casetype = addcaseobj.Casetype,
                    Caseno = addcaseobj.Caseno,
                    Caseyear = addcaseobj.Caseyear,
                    DiaryNo = addcaseobj.Diaryno,
                    Court = addcaseobj.Court,
                    FileNo = "",
                    BenchID = addcaseobj.BenchID,
                    SideID = addcaseobj.SideID,
                    courttitle = addcaseobj.Courttitle,
                    stampreg = addcaseobj.Stampreg,
                    Flag = 0,
                    districtid = addcaseobj.District,
                    stateId = addcaseobj.TriState,
                };
                LogService("Flag:" + iflag);
                LogService("Accesstoken:mykase123456789abcdef");
                LogService("userid:" + addcaseobj.Username);
                LogService("Casetype:" + addcaseobj.Casetype);
                LogService("Caseno:" + addcaseobj.Caseno);
                LogService("Caseyear:" + addcaseobj.Caseyear);
                LogService("DiaryNo:" + addcaseobj.Diaryno);
                LogService("Court:" + addcaseobj.Court);
                LogService("FileNo:");
                LogService("BenchID:" + addcaseobj.BenchID);
                LogService("SideID:" + addcaseobj.SideID);
                LogService("courttitle:" + addcaseobj.Courttitle);
                LogService("stampreg:" + addcaseobj.Stampreg);
                LogService("districtid:" + addcaseobj.District);
                LogService("stateId:" + addcaseobj.TriState);
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddCaseTypeMykase"), "POST", builders1);
                ds = resid1;
                return ds;
            }
            else
            {
                ds = "false";
                return ds;
            }
        }
        /// <summary>
        /// Update new case details
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="districtname"></param>
        /// <returns></returns>
        public static string UpdateCaseDetailNew(AddCaseObject addcaseobj, int iflag, string useremail, string usermobile, string userfirmid, string userid, string districtname)
        {
            string ds = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            string finalcaseid = "";
            var db = new LawPracticeEntities();
            ////insert user login to casewatch
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = addcaseobj.Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = "Mykase_User",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;
            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);
                //add case
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = addcaseobj.Username,
                    Casetype = addcaseobj.Casetype,
                    Caseno = addcaseobj.Caseno,
                    Caseyear = addcaseobj.Caseyear,
                    DiaryNo = addcaseobj.Diaryno,
                    Court = addcaseobj.Court,
                    FileNo = "",
                    BenchID = addcaseobj.BenchID,
                    SideID = addcaseobj.SideID,
                    courttitle = addcaseobj.Courttitle,
                    stampreg = addcaseobj.Stampreg,
                    Flag = iflag,
                    districtid = addcaseobj.District,
                    stateId = addcaseobj.TriState,
                };
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddCaseTypeMykase"), "POST", builders1);
                dynamic data1 = JObject.Parse(resid1);
                string status1 = data1.Status;
                string Message1 = data1.Message;
                string dbstatus = "";
                string dbmessage = "";
                if (Message1.ToString() == "Sorry! Unable to Add now.")
                {
                    ds = resid1;
                }
                else
                {
                    dbstatus = data1.data[0].dbStatus;
                    dbmessage = data1.data[0].dbMessage;
                }
                ds = resid1;
                if (Convert.ToInt32(dbstatus) > 0)
                {
                    var chkmtrcase = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == addcaseobj.Matterid.ToString()).FirstOrDefault();
                    if (chkmtrcase == null)
                    {
                        tblUserCasesMapCaseStatusMaster tbl = new tblUserCasesMapCaseStatusMaster();
                        tbl.MatterID = Guid.Parse(addcaseobj.Matterid.ToString());
                        tbl.UserCaseId = Convert.ToInt32(dbstatus.ToString());
                        tbl.CreatedOn = DateTime.Now;
                        db.tblUserCasesMapCaseStatusMasters.Add(tbl);
                        db.SaveChanges();
                        try
                        {
                            if (!String.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtname"])))
                            {
                                Tbl_CaseDistrict tbl1 = new Tbl_CaseDistrict();
                                tbl1.caseId = Guid.Parse(addcaseobj.Matterid.ToString());
                                tbl1.Firmid = Guid.Parse(userfirmid);
                                tbl1.Userid = Guid.Parse(userid);
                                tbl1.districtid = addcaseobj.BenchID.ToString();
                                tbl1.districtname = districtname;
                                tbl1.date_time = DateTime.Now;
                                var rslt = db.usp_savecasedistrict(tbl1.Firmid.ToString(), tbl1.Userid.ToString(), tbl1.caseId.ToString(), tbl1.districtid.ToString(), tbl1.districtname.ToString());
                            }
                        }
                        catch (Exception es)
                        {
                        }
                    }
                    else
                    {
                        //remove old case
                        var addfClientd = new WebClient();
                        object rawfiled = new
                        {
                            Accesstoken = "mykase123456789abcdef",
                            id = chkmtrcase.UserCaseId,
                        };
                        addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        string buildersd = JsonConvert.SerializeObject(rawfiled);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string residd = addfClientd.UploadString(new Uri(apiUrl + "/API/Search/RemoveCasebyAdminUser"), "POST", buildersd);
                        dynamic datad = JObject.Parse(residd);
                        string statusd = datad.Status;
                        if (statusd.ToString() == "True")
                        {
                            tblUserCasesMapCaseStatusMaster tbl = new tblUserCasesMapCaseStatusMaster();
                            var mtcase = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == addcaseobj.Matterid.ToString()).FirstOrDefault();
                            mtcase.MatterID = Guid.Parse(addcaseobj.Matterid.ToString());
                            mtcase.UserCaseId = Convert.ToInt32(dbstatus.ToString());
                            db.Entry(mtcase).State = EntityState.Modified;
                            db.SaveChanges();
                        }
                    }
                }
                return ds;
            }
            else
            {
                ds = "false";
                return ds;
            }
        }
        /// <summary>
        /// Initialize total case index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeTotalCaseIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    totalcaseIndex = reader.GetOrdinal("totalCase");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read total case data
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static AddCaseObject ReadTotalCaseData(SqlDataReader reader)
        {
            AddCaseObject addcase = new AddCaseObject();
            addcase.TotalCase = reader.GetInt32(totalcaseIndex);
            return addcase;
        }
        /// <summary>
        /// Get total case
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public static AddCaseObjectList GetTotalCase(string username)
        {
            AddCaseObjectList courtnamel = new AddCaseObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@username", username);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetTotalCase, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeTotalCaseIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadTotalCaseData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        /// <summary>
        /// Insert case note details
        /// </summary>
        /// <param name="notes"></param>
        /// <param name="username"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static int InsertCaseNotesDetail(string notes, string username, string caseid)
        {
            int aff = 0;
            {
                try
                {
                    SqlParameter[] sqlPram = new SqlParameter[3];
                    sqlPram[0] = new SqlParameter("@notes", notes);
                    sqlPram[1] = new SqlParameter("@caseid", caseid);
                    sqlPram[2] = new SqlParameter("@userid", username);
                    aff = SqlDbDAL.ExecuteNonQuerySP(SpNames.InsertCaseNoteDetail, sqlPram);
                    return aff;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        /// <summary>
        /// Insert case detail document
        /// </summary>
        /// <param name="document"></param>
        /// <param name="username"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static int InsertCaseUploadDocumentDetail(string document, string username, string caseid)
        {
            int aff = 0;
            {
                try
                {
                    SqlParameter[] sqlPram = new SqlParameter[3];
                    sqlPram[0] = new SqlParameter("@uploadDocument", document);
                    sqlPram[1] = new SqlParameter("@caseid", caseid);
                    sqlPram[2] = new SqlParameter("@userid", username);
                    aff = SqlDbDAL.ExecuteNonQuerySP(SpNames.InsertCaseUploadDocumentDetail, sqlPram);
                    return aff;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}