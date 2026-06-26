using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Web.Mvc;

namespace NJDGDetail.Controllers
{
    [FirmControllerAuthorization()]
    public class AddCaseController : BaseFirmController
    {
        /// <summary>
        /// Add new case view
        /// </summary>
        /// <returns></returns>
        public ActionResult AddCase()
        {
            return View();
        }
        /// <summary>
        /// Add Fill Tri District State
        /// </summary>
        /// <param name="courtid"></param>
        /// <param name="courttype"></param>
        /// <param name="iDistrict"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddFillTriDistrictState(string courtid = "", string courttype = "", string iDistrict = "0")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    courtid = courtid,
                    courttype = courttype,
                    iDistrict = iDistrict,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillTriDistrictState"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<TriState> casedata = new List<TriState>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string Statename = data.data[i].StateName;
                    string Stateid = data.data[i].StateId;
                    // Add parts to the list.
                    casedata.Add(new TriState { Stateid = Stateid, Statename = Statename });
                }
                return Json(casedata, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add Fill Tri District State by State id
        /// </summary>
        /// <param name="stateid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddFillTriDistrictStatebyStateid(string stateid = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    stateid = stateid,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillTriDistrictStatebyStateid"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<TriDistrict> casedata = new List<TriDistrict>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string DistrictId = data.data[i].DistrictId;
                    string District = data.data[i].District;
                    // Add parts to the list.
                    casedata.Add(new TriDistrict { DistrictId = DistrictId, District = District });
                }
                return Json(casedata, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Add District Case Type
        /// </summary>
        /// <param name="crttype"></param>
        /// <param name="dsttype"></param>
        /// <param name="compesttype"></param>
        /// <param name="compestcourt"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddDistrictCaseType(string crttype = "", string dsttype = "", string compesttype = "", string compestcourt = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    stateid = crttype,
                    districtid = dsttype,
                    courtcompestbtype = compesttype,
                    courtcompestbcourt = compestcourt,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillDistrictCaseType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<CaseType> casedata = new List<CaseType>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string courtid = data.data[i].courtid;
                    string courtname = data.data[i].courtname;
                    string DistrictCaseType = data.data[i].DistrictCaseType;
                    // Add parts to the list.
                    casedata.Add(new CaseType { courtid = courtid, courtname = courtname, DistrictCaseType = DistrictCaseType });
                }
                return Json(casedata, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add Court Complex Est Type
        /// </summary>
        /// <param name="crttype"></param>
        /// <param name="dsttype"></param>
        /// <param name="compesttype"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddCourtComplexEstType(string crttype = "", string dsttype = "", string compesttype = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    stateid = crttype,
                    districtid = dsttype,
                    courtcompestbtype = compesttype,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillAllDistrictNameByCompEst"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillDistrictCaseTypeList> FillDistrictCaseTypeList = new List<FillDistrictCaseTypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string id = data.data[i].CompEstbCourt;
                    string name = data.data[i].CompEstbCodeName;
                    // Add parts to the list.
                    FillDistrictCaseTypeList.Add(new FillDistrictCaseTypeList { courtid = id, courtname = name });
                }
                return Json(FillDistrictCaseTypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add District By Court
        /// </summary>
        /// <param name="courttype"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddDistrictByCourt(string courttype = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    stateid = courttype,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillDistrictCourt"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillDistrictCourtList> FillDistrictCourtList = new List<FillDistrictCourtList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string id = data.data[i].courtid;
                    string name = data.data[i].courtname;
                    // Add parts to the list.
                    FillDistrictCourtList.Add(new FillDistrictCourtList { courtid = id, courtname = name });
                }
                return Json(FillDistrictCourtList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add Court Name By Court Type
        /// </summary>
        /// <param name="courttype"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddCourtNameByCourtType(string courttype = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    casetype = courttype,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillCourtnamebyCourttype"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillCourtnamebyCourttypeList> FillCourtnamebyCourttypeList = new List<FillCourtnamebyCourttypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string courtid = data.data[i].CourtId;
                    string courtname = data.data[i].CourtName;
                    if (!String.IsNullOrEmpty(courtname))
                    {
                        courtname = courtname.Replace("HIGH COURT", "");
                    }
                    // Add parts to the list.
                    FillCourtnamebyCourttypeList.Add(new FillCourtnamebyCourttypeList { courtid = courtid, courtname = courtname });
                }
                return Json(FillCourtnamebyCourttypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Add case type details
        /// </summary>
        /// <param name="crtid"></param>
        /// <param name="courttitle"></param>
        /// <param name="bench"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Addcasetype(string crtid = "", string courttitle = "", string bench = "", string side = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    court = crtid,
                    courttitle = courttitle,
                    benchid = bench,
                    sideid = side,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillCaseType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillCasetypeList> FillCasetypeList = new List<FillCasetypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string casetype = data.data[i].casetype;
                    string casetypename = data.data[i].casetypename;
                    if (casetype != null)
                    {
                        // Add parts to the list.
                        FillCasetypeList.Add(new FillCasetypeList { casetype = casetype, casetypename = casetypename });
                    }
                }
                return Json(FillCasetypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add case type ITCE details
        /// </summary>
        /// <param name="crtid"></param>
        /// <param name="courttitle"></param>
        /// <param name="bench"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddcasetypeITCE(string crtid = "", string courttitle = "", string bench = "", string side = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    court = crtid,
                    courttitle = courttitle,
                    benchid = bench,
                    sideid = side,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillCaseType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillCasetypeList> FillCasetypeList = new List<FillCasetypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string casetype = data.data[i].casetype;
                    string casetypename = data.data[i].casetypename;
                    // Add parts to the list.
                    FillCasetypeList.Add(new FillCasetypeList { casetype = casetype, casetypename = casetypename });
                }
                return Json(FillCasetypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get bench name details
        /// </summary>
        /// <param name="crtid"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetBenchName(string crtid = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    court = crtid,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillBenchType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillBenchList> FillBenchList = new List<FillBenchList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string casetype = data.data[i].BenchValue;
                    string casename = data.data[i].BenchName;
                    // Add parts to the list.
                    FillBenchList.Add(new FillBenchList { casetype = casetype, casetypename = casename });
                }
                return Json(FillBenchList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get Side bench list details
        /// </summary>
        /// <param name="benchid"></param>
        /// <param name="court"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetSide(string benchid = "", string court = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    court = court,
                    benchid = benchid,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillSide"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillBenchList> FillBenchList = new List<FillBenchList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string casetype = data.data[i].casetype;
                    string casename = data.data[i].casetypename;
                    // Add parts to the list.
                    FillBenchList.Add(new FillBenchList { casetype = casetype, casetypename = casename });
                }
                return Json(FillBenchList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add bench type list
        /// </summary>
        /// <param name="bench"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddBenchtype(string bench = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                    court = bench,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillBenchType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillBenchList> FillBenchList = new List<FillBenchList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string casetype = data.data[i].BenchValue;
                    if (!String.IsNullOrEmpty(casetype))
                    {
                        casetype = casetype.Replace("#", "@$!");
                    }
                    string casename = data.data[i].BenchName;
                    // Add parts to the list.
                    FillBenchList.Add(new FillBenchList { casetype = casetype, casetypename = casename });
                }
                return Json(FillBenchList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// File stamp register
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult FillStampRegister()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "mykase",
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillStampRegister"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillStampRegisterList> FillStampRegisterList = new List<FillStampRegisterList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string value = data.data[i].value;
                    string Name = data.data[i].Name;
                    // Add parts to the list.
                    FillStampRegisterList.Add(new FillStampRegisterList { value = value, Name = Name });
                }
                return Json(FillStampRegisterList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Bind rera court type
        /// </summary>
        /// <param name="reracourt"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult BindReraCourtType(string reracourt = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userId = userId,
                    reracourt = ""
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillReraCourt"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillCasetypeList> FillCasetypeList = new List<FillCasetypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string court = data.data[i].vCourt;
                    string casetypename = data.data[i].vCourtName;
                    if (court != null)
                    {
                        // Add parts to the list.
                        FillCasetypeList.Add(new FillCasetypeList { casetype = court, casetypename = casetypename });
                    }
                }
                return Json(FillCasetypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get Rera court case type
        /// </summary>
        /// <param name="reracourt"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetReraCourtCaseType(string reracourt = "")
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userId = userId,
                    reracourt = reracourt
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillReraCaseType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<FillCasetypeList> FillCasetypeList = new List<FillCasetypeList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string court = data.data[i].vCourt;
                    string casetypename = data.data[i].vCaseType;
                    if (court != null)
                    {
                        // Add parts to the list.
                        FillCasetypeList.Add(new FillCasetypeList { casetype = court, casetypename = casetypename });
                    }
                }
                return Json(FillCasetypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
