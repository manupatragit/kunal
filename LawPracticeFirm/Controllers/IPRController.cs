using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;

using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using BussinessLogic.Models;
using static LawPracticeFirm.Models.AuditData;
using System.Threading;
using BussinessLogic;
using System.Data;
using System.Data.SqlClient;
using LawPracticeFirm.API;
using OfficeOpenXml;
using IPRManagement.BusinessLayer.BusinessRepository;
using System.IO;
//using DataAccess.ADODBAccess;
//using LawPracticeFirm.DAL;

namespace LawPracticeFirm.Controllers
{
    public class IPRController : BaseFirmController
    {

        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "IPRController";

        /// <summary>
		/// Check Data value and change Date format
		/// </summary>
		/// <param name="datavalue"></param>
		/// <returns></returns>
        public string checkformatvalue(string datavalue)
        {
            if (datavalue == null || datavalue.ToLower() == "null" || datavalue.ToLower() == "undefine" || datavalue == "1900-01-01" || datavalue == "1900/01/01" || datavalue == "0")
            {
                return "";
            }
            else
            {
                string pattern = "^\\d{4}-((0\\d)|(1[012]))-(([012]\\d)|3[01])";
                if (Regex.IsMatch(datavalue, pattern))
                {
                    datavalue = datavalue.Split(' ')[0];
                    datavalue = DateTime.ParseExact(datavalue, "yyyy-MM-dd", null).ToString("dd/MM/yyyy").Split(' ')[0];
                }
                return datavalue;
            }
        }
        //public string checkformatvalue(string datavalue)
        //      {
        //          if (datavalue == null || datavalue.ToLower() == "null" || datavalue.ToLower() == "undefine" || datavalue == "1900-01-01" || datavalue == "1900/01/01" || datavalue == "0")
        //          {
        //              return "";
        //          }
        //          else
        //          {
        //              string pattern = "^\\d{4}-((0\\d)|(1[012]))-(([012]\\d)|3[01])";
        //              if (Regex.IsMatch(datavalue, pattern))
        //              {
        //                  datavalue = DateTime.ParseExact(datavalue, "yyyy-MM-dd", null).ToString("dd/MM/yyyy").Split(' ')[0];
        //              }
        //              return datavalue;
        //          }
        //      }

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult IPRDashboard()
        {
            return View();
        }
        //public void SearchInternIPR()
        //{           
        //    Response.Redirect("https://www.google.co.in/?gfe_rd=cr&ei=BpszVKXmIsPN8gfBi4GABg&gws_rd=ssl");
        //}
        public ActionResult IPRSearch(string key = "", string IP = "")
        {
            var frmids = Session["sessionfirmid"].ToString();
            var usrids = Session["sessionuserid"].ToString();
            var imagepath = Server.MapPath(@"/Documents/IPRImages/");
            //string imgPathtest = ConfigurationManager.AppSettings["IPRImagePathTest"];
            string imgPath = ConfigurationManager.AppSettings["IPRImagePath"];
            ViewBag.ImagePath = imgPath;

            return View();
        }
        public ActionResult CreateIPRCase()
        {
            return View();
        }
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewAddedTrademarks()
        {
            var IP = System.Web.HttpContext.Current.Request.QueryString["IP"];
            var AppNo = System.Web.HttpContext.Current.Request.Form["applicationno"];
            string RoleId = LoggedInUser.RoleId.ToString();
            ViewBag.CalenderAppNo = AppNo;
            ViewBag.IP = IP;
            ViewBag.Name = "";
            ViewBag.RoleId = RoleId;
            if (IP == "1")
            {
                ViewBag.Name = "Delete Trademarks Request";
            }
            return View();
        }

        public ActionResult ViewSharedTrademark()
        {
            return View();
        }

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult TrademarkArchive()
        {
            var abc = Session["FirmCode"];
            ViewBag.UserName = LoggedInUser.UserName;
            ViewBag.UserFullName = LoggedInUser.UserFullName;
            ViewBag.RoleId = LoggedInUser.RoleId.ToString();

            return View();
        }
        /// <summary>
        /// Phonetic Search
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PhoneticSearch()
        {
            ViewBag.RoleId = LoggedInUser.RoleId.ToString();
            return View();
        }

        /// <summary>
        /// Method for redirecting to IPR MyList Page
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewIPRCase()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];

            var newqueryname = Request.QueryString["IP"];
            ViewBag.queryname = newqueryname;
            ViewBag.RoleId = LoggedInUser.RoleId.ToString();

            return View();
        }

        /// <summary>
        /// Method for redirecting to IPR Proprietor Search Page
        /// </summary>
        /// <param name="IP"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ProprietorSearch(string IP = "")
        {
            return View();
        }
        

        /// <summary>
        /// Method for redirecting to IPR Agent Search Page
        /// </summary>
        /// <param name="IP"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AgentSearch(string IP = "")
        {
            return View();
        }

        /// <summary>
        /// Method for redirecting to IPR Journal Resources Page
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Resources()
        {
            return View();
        }

        /// <summary>
        /// Method for redirecting to IPR Journal Search history Page
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult JournalAlertHistory()
        {
            return View();
        }

        /// <summary>
        /// Method for redirecting to journal Search Page
        /// </summary>
        /// <param name="IP"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult IPRJournalSearch()
        {
            return View();
        }

        /// <summary>
        /// Sending excel from IPR Details Modal.
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendEmailForIPR()
        {
            try
            {
                string markName = "";

                string Username = LoggedInUser.UserFullName;

                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                IPRApiController api = new IPRApiController();
                string ip = Request.Form["IPList"];
                string To = Request.Form["To"];
                string tradeiid = Request.Form["tradeval"];

                byte[] conVal1 = Convert.FromBase64String(ip);
                byte[] conVal2 = Convert.FromBase64String(To);
                byte[] conVal3 = Convert.FromBase64String(tradeiid);

                string decodeIp = Encoding.UTF8.GetString(conVal1);
                string decodeRecName = Encoding.UTF8.GetString(conVal2);
                string decodeTradeiid = Encoding.UTF8.GetString(conVal3);

                switch (decodeIp)
                {
                    case "1":
                        markName = "Trade Mark";
                        break;
                    case "2":
                        markName = "Copyright";
                        break;
                    case "3":
                        markName = "Patent";
                        break;
                    case "4":
                        markName = "GI";
                        break;
                    case "5":
                        markName = "Design";
                        break;
                }

                try
                {
                    DataTable casedeatils = new DataTable();
                    //DateTime dtt = DateTime.Now;
                    //string exlfilename = "IPR_" + markName + "_DetailsReport_" + decodeTradeiid + "-" + dtt.Day + "-" + dtt.DayOfWeek + "-" + dtt.Year;
                    string userId1 = userId;

                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        userid = strusername,
                        Accesstoken = "mykase123456789abcdef",
                        iid = decodeTradeiid,
                        ip = decodeIp
                    };

                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRDetailsbyIid"), "POST", builders);

                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    int pageid = 0;

                    if (decodeIp == "1")
                    {
                        casedeatils.Columns.Add("TM Application No.");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Date of Application");
                        casedeatils.Columns.Add("Mark");
                        casedeatils.Columns.Add("User Detail/Used Since");
                        casedeatils.Columns.Add("Certificate Details");
                        casedeatils.Columns.Add("Valid Upto/Renewed Upto");
                        casedeatils.Columns.Add("Proprietor's Name");
                        casedeatils.Columns.Add("proprietor address");
                        casedeatils.Columns.Add("Agent Name");
                        casedeatils.Columns.Add("Agent Address");
                        casedeatils.Columns.Add("Goods & Service Details");
                        casedeatils.Columns.Add("Publication Details");
                        casedeatils.Columns.Add("Status");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vClass"], data.data[i]["dApplDate"],
                                data.data[i]["vWordMark"], data.data[i]["vUsedSince"], data.data[i]["CertificationDetails"], data.data[i]["dValidUpto"], data.data[i]["vProprietor"], data.data[i]["vProprietorAddress"], data.data[i]["Agent"], data.data[i]["AgentAddress"], data.data[i]["dGSDescription"], data.data[i]["PublicationDetails"], data.data[i]["vStatus"]);
                        }
                    }

                    if (decodeIp == "2")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Diary Number");
                        casedeatils.Columns.Add("Date");
                        casedeatils.Columns.Add("Title Of Work");
                        casedeatils.Columns.Add("Category");
                        casedeatils.Columns.Add("Applicant");
                        casedeatils.Columns.Add("No. Of Pages");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vDiaryNo"], data.data[i]["dApplDate"], data.data[i]["vTitleofWork"],
                                data.data[i]["vCategory"], data.data[i]["vApplicantName"], data.data[i]["NoofPages"]);
                        }
                    }

                    if (decodeIp == "3")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Application Number");
                        casedeatils.Columns.Add("Publication Number");
                        casedeatils.Columns.Add("Publication Date");
                        casedeatils.Columns.Add("Date Of Filing Of Application ");
                        casedeatils.Columns.Add("Title Of The Invention");
                        casedeatils.Columns.Add("Internal Classification");
                        casedeatils.Columns.Add("Priority Document Number");
                        casedeatils.Columns.Add("Priority Date");
                        casedeatils.Columns.Add("Name Of Priority Country");
                        casedeatils.Columns.Add("Patent Of Addition To Application Number Filing Date");
                        casedeatils.Columns.Add("Divisional To Application Number Filing Date");

                        casedeatils.Columns.Add("Name Of Applicant");
                        casedeatils.Columns.Add("Address Of Applicant");
                        casedeatils.Columns.Add("Name Of Inventor");
                        casedeatils.Columns.Add("Inventory Country");
                        casedeatils.Columns.Add("Inventory Address");
                        casedeatils.Columns.Add("Abstract");
                        casedeatils.Columns.Add("No. Of Pages");
                        casedeatils.Columns.Add("No. Of Claims");
                        casedeatils.Columns.Add("The Patent Office Journal No. And Date");
                        casedeatils.Columns.Add("Applicant Country");
                        casedeatils.Columns.Add("Complete Specification");
                        casedeatils.Columns.Add("Status");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vPublicationNo"], data.data[i]["dPublicationDate"],
                                data.data[i]["dDateOffiling"], data.data[i]["vInventionTitle"], data.data[i]["vClassification"], data.data[i]["vPriorityDocumentNo"], data.data[i]["dPriorityDate"],
                                data.data[i]["vPriorityCountryName"], data.data[i]["dAdditionAppNoFillingDate"], data.data[i]["dDivisionalAppNoFillingDate"],
                                data.data[i]["vApplicantName"], data.data[i]["vApplicantAddress"], data.data[i]["vInventorName"], data.data[i]["vInventoryCountry"],
                                data.data[i]["vInventoryAddress"], data.data[i]["vAbstract"], data.data[i]["vNoofPages"], data.data[i]["vNoofClaims"],
                                data.data[i]["PatentOffJournal"], data.data[i]["vApplicantCountryName"], data.data[i]["vCompSpecification"], data.data[i]["vStatus"]
                                );
                        }
                    }

                    if (decodeIp == "4")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Application Number");
                        casedeatils.Columns.Add("Geographical Indication");
                        casedeatils.Columns.Add("Status");
                        casedeatils.Columns.Add("Applicant Name");
                        casedeatils.Columns.Add("Applicant Address");
                        casedeatils.Columns.Add("Date Of Filing");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Goods");
                        casedeatils.Columns.Add("Geographical Area");
                        casedeatils.Columns.Add("Priority Country");
                        casedeatils.Columns.Add("Journal Number");
                        casedeatils.Columns.Add("Availability Date");
                        casedeatils.Columns.Add("Certificate Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplicationNo"], data.data[i]["vGeoIndication"], data.data[i]["vStatus"],
                                data.data[i]["vApplicantName"], data.data[i]["vApplicantAddress"], data.data[i]["dDateofFiling"], data.data[i]["vClass"], data.data[i]["vGoods"], data.data[i]["vGeoArea"], data.data[i]["vPriorityCountry"], data.data[i]["vJournalNo"], data.data[i]["dAvailDate"], data.data[i]["vCertificateNo"]);
                        }
                    }

                    if (decodeIp == "5")
                    {
                        //casedeatils.Columns.Add("Design Number.");
                        //casedeatils.Columns.Add("Class");
                        //casedeatils.Columns.Add("Applicant Details");
                        //casedeatils.Columns.Add("Address");
                        //casedeatils.Columns.Add("Registration Date");
                        //casedeatils.Columns.Add("Title");
                        //casedeatils.Columns.Add("Priority Number");
                        //casedeatils.Columns.Add("Priority Status");
                        //casedeatils.Columns.Add("Priority Date");
                        //casedeatils.Columns.Add("Priority Country");
                        //casedeatils.Columns.Add("Design Image");

                        casedeatils.Columns.Add("Design Number.");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Address");
                        casedeatils.Columns.Add("Applicant Details");
                        casedeatils.Columns.Add("Registration Date");
                        casedeatils.Columns.Add("Title");
                        casedeatils.Columns.Add("Priority No.");
                        casedeatils.Columns.Add("Priority Status");
                        casedeatils.Columns.Add("Priority Date");
                        casedeatils.Columns.Add("Priority Country");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            string vClassDetail = "=\"" + data.data[i]["vClass"] + "\"";

                            casedeatils.Rows.Add(data.data[i]["vDesignNo"], vClassDetail, data.data[i]["vAddress"], data.data[i]["vApplDetails"],
                                 data.data[i]["dDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"],
                                data.data[i]["vPriorityStatus"], data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountry"]);
                        }

                    }


                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_" + markName + "_DetailsReport_" + date.Hour + date.Minute + date.Second + date.Millisecond;

                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    //send email to user
                    string msgbody = "";
                    //string msgsubject = "Regarding Case Notice from mykase";
                    string strsubject = "", strbody = "";
                    strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                    string userName = FindUserNameFromEmail(decodeRecName);
                    strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                    strbody = strbody.Replace("#User#", userName);
                    strbody = strbody.Replace("#Mark#", markName);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, decodeRecName, "", "", strsubject, strbody, fullpath);

                    }
                    catch (Exception ex)
                    {

                    }

                    //remove files

                }
                catch (Exception er)
                {

                }
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }
        /// <summary>
        /// Download IPR detail by TradeId
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void DownloadIPRDetails()
        {
            try
            {
                string markName = "";
                string Username = LoggedInUser.UserFullName;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                IPRApiController api = new IPRApiController();
                var decodeIp = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
                var decodeTradeiid = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
                switch (decodeIp)
                {
                    case "1":
                        markName = "Trade Mark";
                        break;
                    case "2":
                        markName = "Copyright";
                        break;
                    case "3":
                        markName = "Patent";
                        break;
                    case "4":
                        markName = "GI";
                        break;
                    case "5":
                        markName = "Design";
                        break;
                }
                try
                {
                    DataTable casedeatils = new DataTable();
                    //DateTime dtt = DateTime.Now;
                    //string exlfilename = "IPR_" + markName + "_DetailsReport_" + decodeTradeiid + "-" + dtt.Day + "-" + dtt.DayOfWeek + "-" + dtt.Year;
                    string userId1 = userId;
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        userid = strusername,
                        Accesstoken = "mykase123456789abcdef",
                        iid = decodeTradeiid,
                        ip = decodeIp
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRDetailsbyIid"), "POST", builders);
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    int pageid = 0;
                    if (decodeIp == "1")
                    {
                        casedeatils.Columns.Add("TM Application No.");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Date of Application");
                        casedeatils.Columns.Add("Mark");
                        casedeatils.Columns.Add("User Detail/Used Since");
                        casedeatils.Columns.Add("Certificate Details");
                        casedeatils.Columns.Add("Valid Upto/Renewed Upto");
                        casedeatils.Columns.Add("Proprietor's Name");
                        casedeatils.Columns.Add("proprietor address");
                        casedeatils.Columns.Add("Agent Name");
                        casedeatils.Columns.Add("Agent Address");
                        casedeatils.Columns.Add("Goods & Service Details");
                        casedeatils.Columns.Add("Publication Details");
                        casedeatils.Columns.Add("Status");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            var valUpToDate = data.data[i]["dValidUpto"];
                            if (valUpToDate == "1900-01-01T00:00:00")
                            {
                                valUpToDate = "";
                            }
                            else
                            {
                                valUpToDate = Convert.ToDateTime(valUpToDate).ToString("dd/MM/yyyy");
                            }
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vClass"], data.data[i]["dApplDate"],
                                data.data[i]["vWordMark"], data.data[i]["vUsedSince"], data.data[i]["CertificationDetails"],
                                valUpToDate, data.data[i]["vProprietor"], data.data[i]["vProprietorAddress"],
                                data.data[i]["Agent"], data.data[i]["AgentAddress"], data.data[i]["dGSDescription"],
                                data.data[i]["PublicationDetails"], data.data[i]["vStatus"]);
                        }
                    }

                    if (decodeIp == "2")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Diary Number");
                        casedeatils.Columns.Add("Date");
                        casedeatils.Columns.Add("Title Of Work");
                        casedeatils.Columns.Add("Category");
                        casedeatils.Columns.Add("Applicant");
                        casedeatils.Columns.Add("No. Of Pages");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vDiaryNo"], data.data[i]["dApplDate"], data.data[i]["vTitleofWork"],
                                data.data[i]["vCategory"], data.data[i]["vApplicantName"], data.data[i]["NoofPages"]);
                        }
                    }
                    if (decodeIp == "3")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Application Number");
                        casedeatils.Columns.Add("Publication Number");
                        casedeatils.Columns.Add("Publication Date");
                        casedeatils.Columns.Add("Date Of Filing Of Application ");
                        casedeatils.Columns.Add("Title Of The Invention");
                        casedeatils.Columns.Add("Internal Classification");
                        casedeatils.Columns.Add("Priority Document Number");
                        casedeatils.Columns.Add("Priority Date");
                        casedeatils.Columns.Add("Name Of Priority Country");
                        casedeatils.Columns.Add("Patent Of Addition To Application Number Filing Date");
                        casedeatils.Columns.Add("Divisional To Application Number Filing Date");
                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vPublicationNo"], data.data[i]["dPublicationDate"],
                                data.data[i]["dDateOffiling"], data.data[i]["vInventionTitle"], data.data[i]["vClassification"], data.data[i]["vPriorityDocumentNo"], data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountryName"], data.data[i]["dAdditionAppNoFillingDate"], data.data[i]["dDivisionalAppNoFillingDate"]);
                        }
                    }

                    if (decodeIp == "4")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Application Number");
                        casedeatils.Columns.Add("Geographical Indication");
                        casedeatils.Columns.Add("Status");
                        casedeatils.Columns.Add("Applicant Name");
                        casedeatils.Columns.Add("Applicant Address");
                        casedeatils.Columns.Add("Date Of Filing");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Goods");
                        casedeatils.Columns.Add("Geographical Area");
                        casedeatils.Columns.Add("Priority Country");
                        casedeatils.Columns.Add("Journal Number");
                        casedeatils.Columns.Add("Availability Date");
                        casedeatils.Columns.Add("Certificate Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vApplicationNo"], data.data[i]["vGeoIndication"], data.data[i]["vStatus"],
                                data.data[i]["vApplicantName"], data.data[i]["vApplicantAddress"], data.data[i]["dDateofFiling"], data.data[i]["vClass"], data.data[i]["vGoods"], data.data[i]["vGeoArea"], data.data[i]["vPriorityCountry"], data.data[i]["vJournalNo"], data.data[i]["dAvailDate"], data.data[i]["vCertificateNo"]);
                        }
                    }

                    if (decodeIp == "5")
                    {
                        //casedeatils.Columns.Add("RowId");
                        casedeatils.Columns.Add("Design Number.");
                        casedeatils.Columns.Add("Class");
                        casedeatils.Columns.Add("Applicant Details");
                        casedeatils.Columns.Add("Address");
                        casedeatils.Columns.Add("Registration Date");
                        casedeatils.Columns.Add("Title");
                        casedeatils.Columns.Add("Priority Number");
                        casedeatils.Columns.Add("Priority Status");
                        casedeatils.Columns.Add("Priority Date");
                        casedeatils.Columns.Add("Priority Country");
                        casedeatils.Columns.Add("Design Image");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            casedeatils.Rows.Add(data.data[i]["vDesignNo"], data.data[i]["vClass"], data.data[i]["vApplDetails"],
                                data.data[i]["vAddress"], data.data[i]["dDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"], data.data[i]["vPriorityStatus"], data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountry"], data.data[i]["vImgPath"]);
                        }

                    }

                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_" + markName + "_DetailsReport_" + date.Hour + date.Minute + date.Second + date.Millisecond;
                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                    //gv.AlternatingRowStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    Response.Output.Write(objStringWriter.ToString());
                    Response.Flush();
                    Response.End();
                    //var gv = new GridView();
                    //gv.DataSource = casedeatils;
                    //gv.DataBind();
                    //gv.HeaderStyle.BackColor = Color.Gray;
                    //gv.HeaderStyle.ForeColor = Color.White;
                    //Response.ClearContent();
                    //Response.Buffer = true;
                    //Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    //Response.ContentType = "application/ms-excel";
                    //Response.Charset = "";
                    //StringWriter objStringWriter = new StringWriter();
                    //HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    //gv.RenderControl(objHtmlTextWriter);
                    ////Response.Output.Write(objStringWriter.ToString());

                    //var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    //var filename = exlfilename + ".xls";
                    //var fullpath = path + filename;

                    //if (!Directory.Exists(path))
                    //{
                    //    Directory.CreateDirectory(path);
                    //}
                    //System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    //string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    ////send email to user
                    //string msgbody = "";
                    ////string msgsubject = "Regarding Case Notice from mykase";
                    //string strsubject = "", strbody = "";
                    //strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";

                    //remove files

                }
                catch (Exception er)
                {

                }
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// Method for sending Email for Proprietor and Applicant Details
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendEmailForIPRProprietorAndApplicant()
        {
            DataTable dt = new DataTable();
            var dtt = DateTime.Now.ToString("dd-MMMM-yyyy");

            DateTime dtt1 = new DateTime();

            string markName = "";
            string exlfilename = "";

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            int PageNum = 1;
            int PageSize = 50;

            int IprTypeId = Convert.ToInt32(HttpContext.Request.Form["iprid"]);

            string PropName = HttpContext.Request.Form["propname"];
            string PropAddress = HttpContext.Request.Form["propadd"];
            string EmailId = HttpContext.Request.Form["To"];

            if (String.IsNullOrEmpty(PropName) || PropName=="undefined")
            {
                PropName = "";
            }

            if (String.IsNullOrEmpty(PropAddress))
            {
                PropAddress = "";
            }

            try
            {
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();
                object rawfile = new
                {
                    IprTypeId = IprTypeId,
                    pageNumber = PageNum,
                    pageSize = PageSize,
                    vProprietorSearch = PropName,
                    vProprietorAddressSearch = PropAddress
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                switch (IprTypeId)
                {
                    case 1:
                        exlfilename = "TrademarkProprietorReport_" + dtt;
                        markName = "Trade mark Proprietor";

                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Mark");
                        dt.Columns.Add("Application Number");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Application Date");
                        dt.Columns.Add("Status");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vWordMark"], data.data[i]["vApplNo"], data.data[i]["vClass"], data.data[i]["vApplDate"], data.data[i]["vStatus"]);
                        }
                        break;

                    case 2:

                        exlfilename = "CopyrightApplicantReport_" + dtt;
                        markName = "Copyright Applicant";

                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Category");
                        dt.Columns.Add("Status");
                        dt.Columns.Add("Application Date");
                        dt.Columns.Add("ROC Number");
                        dt.Columns.Add("Title Of Work");
                        dt.Columns.Add("Diary Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplicantName"], data.data[i]["vCategory"], data.data[i]["vStatus"],
                                data.data[i]["dApplDate"], data.data[i]["vROCNumber"], data.data[i]["vTitleofWork"], data.data[i]["vDiaryNo"]);
                        }

                        break;

                    case 3:
                        //exlfilename = "PatentApplicantReport_" + dtt;
                        //markName = "Patent Applicant";
                        //dt.Columns.Add("Sr. No.");
                        //dt.Columns.Add("Application Number");
                        //dt.Columns.Add("Title Of The Invention");
                        //dt.Columns.Add("Status");
                        //dt.Columns.Add("Date Of Filing Of Application ");
                        //dt.Columns.Add("Applicant Name");

                        //for (int i = 0; i < data1.Count; i++)
                        //{
                        //    dynamic data = JObject.Parse(resid);
                        //    dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vInventionTitle"], data.data[i]["vStatus"],
                        //        data.data[i]["dDateOffiling"], data.data[i]["vApplicantName"]);
                        //}

                        exlfilename = "PatentApplicantReport_" + dtt;
                        markName = "Patent Applicant";
                        dt.Columns.Add("Sr. No.");
                        dt.Columns.Add("Application Number");
                        dt.Columns.Add("Applicant Type");
                        dt.Columns.Add("Date Of Filing");
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Title Of Invention");
                        dt.Columns.Add("International Application Number");
                        dt.Columns.Add("Priority Date");
                        dt.Columns.Add("Priority Country Name");
                        dt.Columns.Add("International Filing Date");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vApplicationType"], data.data[i]["dDateOffiling"],
                                data.data[i]["vApplicantName"], data.data[i]["vInventionTitle"], data.data[i]["vFieldofInvention"], data.data[i]["vInterApplNo"], 
                                data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountryName"], data.data[i]["dAdditionAppNoFillingDate"]);
                        }
                        break;

                    case 4:
                        exlfilename = "GIApplicantReport_" + dtt;
                        markName = "Geographical Indication Applicant";
                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Geographical Indication");
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Status");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Date Of Filing");
                        dt.Columns.Add("Availability Date");
                        dt.Columns.Add("Journal Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vGeoIndication"], data.data[i]["vApplicantName"], data.data[i]["vStatus"],
                                data.data[i]["vClass"], data.data[i]["dDateofFiling"], data.data[i]["vRegistrationValidUpto"], data.data[i]["vJournalNo"]);
                        }

                        break;

                    case 5:
                        exlfilename = "DesignApplicantReport_" + dtt;
                        markName = "Design Applicant";

                        dt.Columns.Add("Design Number.");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Applicant Details");
                        dt.Columns.Add("Address");
                        dt.Columns.Add("Registration Date");
                        dt.Columns.Add("Title");
                        dt.Columns.Add("Priority Number");
                        dt.Columns.Add("Priority Status");
                        dt.Columns.Add("Priority Date");
                        dt.Columns.Add("Priority Country");
                        dt.Columns.Add("Design Image");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["vDesignNo"], data.data[i]["vClass"], data.data[i]["vApplDetails"],
                                data.data[i]["vAddress"], data.data[i]["vDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"], data.data[i]["vPriorityStatus"], data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountry"], data.data[i]["vImgPath"]);
                        }

                        break;
                }

                var gv = new GridView();
                gv.DataSource = dt;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                //Response.Output.Write(objStringWriter.ToString());

                var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                var filename = exlfilename + ".xls";
                var fullpath = path + filename;

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());

                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                //send email to user
                string msgbody = "";
                string strsubject = "", strbody = "";
                strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                string userName = FindUserNameFromEmail(EmailId);
                strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                strbody = strbody.Replace("#User#", userName);
                strbody = strbody.Replace("#Mark#", markName);
                try
                {
                    CommomUtility objmail = new CommomUtility();
                    objmail.SendEmail(fromemail, EmailId, "", "", strsubject, strbody, fullpath);
                }
                catch (Exception ex)
                {

                }
            }

            catch (Exception ex)

            {

            }

        }

        [AuthLog(Roles = "Firm,User,Client")]
        public void SendEmailForAgentDetails()
        {
            string UserId = LoggedInUser.UserId.ToString();
            string FirmId = LoggedInUser.FirmId.ToString();


            JObject jObject = new JObject();

            int pagenum = 1, pagesize = 10;
            var AgentName = HttpContext.Request.Form["agentname"];
            var AgentAddress = HttpContext.Request.Form["agentaddress"];
            var UserMail = HttpContext.Request.Form["mail"];

            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
            //var apiUrl = "http://localhost:44389";
            var addfClient = new WebClient();
            object rawfile = new
            {
                pageNumber = pagenum,
                pageSize = pagesize,
                vAgentName = AgentName,
                vAgentAddress = AgentAddress
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/AgentDetailsByNameAndAddress"), "POST", builders);
            jObject = JObject.Parse(res);
            dynamic data1 = jObject["data"];

            DataTable dt = new DataTable();

            dt.Columns.Add("RowId");
            dt.Columns.Add("vApplNo");
            dt.Columns.Add("vWordMark");
            dt.Columns.Add("vProprietor");
            dt.Columns.Add("vStatus");
            dt.Columns.Add("vClass");
            dt.Columns.Add("dApplDate");
            dt.Columns.Add("vUsedSince");

            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(res);
                dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vWordMark"], data.data[i]["vProprietor"],
                    data.data[i]["vStatus"], data.data[i]["vClass"], data.data[i]["dApplDate"], data.data[i]["vUsedSince"]);
            }

            var dttnow = DateTime.Now;

            DateTime dtt = new DateTime(dttnow.Year, dttnow.Month, dttnow.Day);

            string exlfilename = "AgentDetails_Report" + " " + dtt.ToString("dd-MMMM-yyyy");

            var gv = new GridView();
            gv.DataSource = dt;
            gv.DataBind();
            gv.HeaderStyle.BackColor = Color.Gray;
            gv.HeaderStyle.ForeColor = Color.White;
            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
            Response.ContentType = "application/ms-excel";
            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
            gv.RenderControl(objHtmlTextWriter);
            //Response.Output.Write(objStringWriter.ToString());

            var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + FirmId + "/" + UserId + "/");
            var filename = exlfilename + ".xls";
            var fullpath = path + filename;

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());

            string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

            //send email to user
            string msgbody = "";
            string strsubject = "", strbody = "";
            strsubject = "Regarding Agent Details from Mykase.";
            string userName = FindUserNameFromEmail(UserMail);
            strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
            strbody = strbody.Replace("#User#", userName);
            strbody = strbody.Replace("#Mark#", "Agent");
            try
            {
                CommomUtility objmail = new CommomUtility();
                objmail.SendEmail(fromemail, UserMail, "", "", strsubject, strbody, fullpath);
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Method for uploading Multiple Email Ids (At Max 5 Email Id's) in the Table
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public int SaveEmailIdsForTracker()
        {
            int count = 0;
            try
            {
                string emails = HttpContext.Request.Form["emails"];
                var alertDataSet = HttpContext.Request.Form["emails"];

                System.Data.DataTable DeserializeEmailObj = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Data.DataTable>(alertDataSet);

                int tradeiid = Convert.ToInt32(HttpContext.Request.Form["tradeid"]);

                string UserId = LoggedInUser.UserId.ToString();
                string Firmid = LoggedInUser.FirmId.ToString();


                var repo = new IPRRepository();
                count = repo.UploadMultipleEmails(UserId, Firmid, DeserializeEmailObj, tradeiid);


            }

            catch (Exception ex)
            { }

            return count;
        }

        /// <summary>
        /// Method for Sending Multiple Emails To User For Trademark Details
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendMultipleEmailsForTMDetails()
        {
            string tradeiid = Request.Form["tradeiid"];
            string Emails = Request.Form["getEmailVal1"];

            string UserId = LoggedInUser.UserId.ToString();
            string FirmId = LoggedInUser.FirmId.ToString();

            string Ipname = "1";

            try
            {
                DataTable casedeatils = new DataTable();
                DateTime dtt = DateTime.Now;
                string exlfilename = "IPR_TradeMark_DetailsReport_" + "-" + dtt.Day + "-" + dtt.DayOfWeek + "-" + dtt.Year;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + UserId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = UserId,
                    Accesstoken = "mykase123456789abcdef",
                    iid = tradeiid,
                    ip = Ipname
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRDetailsbyIid"), "POST", builders);

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                if (Ipname == "1")
                {
                    casedeatils.Columns.Add("TM Application No.");
                    casedeatils.Columns.Add("Class");
                    casedeatils.Columns.Add("Date of Application");
                    casedeatils.Columns.Add("Mark");
                    casedeatils.Columns.Add("User Detail/Used Since");
                    casedeatils.Columns.Add("Certificate Details");
                    casedeatils.Columns.Add("Valid Upto/Renewed Upto");
                    casedeatils.Columns.Add("Proprietor's Name");
                    casedeatils.Columns.Add("Agent Name");
                    casedeatils.Columns.Add("Agent Address");
                    casedeatils.Columns.Add("Goods & Service Details");
                    casedeatils.Columns.Add("Publication Details");
                    casedeatils.Columns.Add("Status");

                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);

                        casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vClass"], data.data[i]["dApplDate"],
                            data.data[i]["vWordMark"], data.data[i]["vUsedSince"], data.data[i]["CertificationDetails"], data.data[i]["dValidUpto"], data.data[i]["vProprietor"], data.data[i]["Agent"], data.data[i]["AgentAddress"], data.data[i]["dGSDescription"], data.data[i]["PublicationDetails"], data.data[i]["vStatus"]);
                    }

                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                    //gv.AlternatingRowStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + FirmId + "/" + UserId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());

                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    switch (Emails.Split(',').Length)
                    {
                        case 1:
                            string msgbody = "";
                            //string msgsubject = "Regarding Case Notice from mykase";
                            string strsubject = "", strbody = "";
                            strsubject = "Regarding TradeMark Details from Mykase.";
                            string userName = FindUserNameFromEmail(Emails);
                            strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                            strbody = strbody.Replace("#User#", userName);
                            strbody = strbody.Replace("#Mark#", "Trade Mark");
                            try
                            {
                                CommomUtility objmail = new CommomUtility();
                                objmail.SendEmail(fromemail, Emails, "", "", strsubject, strbody, fullpath);
                            }

                            catch (Exception ex)
                            {
                                string msg = ex.Message.ToString();
                            }

                            break;

                        default:
                            foreach (string UserEmail in Emails.Split(','))
                            {
                                msgbody = "";
                                strsubject = "";
                                strbody = "";
                                strsubject = "Regarding TradeMark Details from Mykase.";
                                userName = FindUserNameFromEmail(UserEmail);
                                strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                                strbody = strbody.Replace("#User#", userName);
                                strbody = strbody.Replace("#Mark#", "Trade Mark");
                                try
                                {
                                    CommomUtility objmail = new CommomUtility();
                                    objmail.SendEmail(fromemail, UserEmail.Trim(), "", "", strsubject, strbody, fullpath);
                                }

                                catch (Exception ex)
                                {
                                    string msg = ex.Message.ToString();
                                }

                            }
                            break;
                    }
                }
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
            }
        }

        /// <summary>
        /// Method for downloading PDF For Trademark Search Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExporttoPDFNewCases()
        {
            string pagenum = "1";
            var pagesize1 = "50";

            pagenum = HttpContext.Request.QueryString["pagenum"];
            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);


            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            pagesize1 = HttpContext.Request.QueryString["pagesize1"];

            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;

            var db = new LawPracticeEntities();

            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();

            string pdffileName = "Mykase_trademark_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            DataTable casedeatils = new DataTable();
            try
            {
                //List<IPRList> casedeatils = new List<IPRList>();                              
                string userId1 = userId;
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    jurisdiction = JurisdictionList,
                    ip = IPList,
                    vclass = searchclass,
                    proprietor = Proprietor,
                    ApplicationDatefrom = dateapplicationfrom,
                    ApplicationDateto = dateapplicationto,
                    Status = searchstatus,
                    userdetails = searchuserdetetail,
                    usedsincefrom = usedsincefrom1,
                    usedsinceto = usedsinceto1,
                    agent = "",
                    ApplNo = applicationno,
                    vtype = searchtype,
                    searchtext = filtertradmark,
                    pageindex = pagenum,
                    pagesize = pagesize1

                };


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Proprietor");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");

                for (int i = 0; i < data1.Count; i++)
                {

                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vWordMark"], data.data[i]["vProprietor"], data.data[i]["vApplNo"],
                        data.data[i]["vStatus"], data.data[i]["vClass"], data.data[i]["dApplDate"], data.data[i]["vUsedSince"]);
                }
            }
            catch (Exception ex)
            {

            }
            string strtemplate = "";
            var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            strtemplate += "<style> table { overflow: visible !important; }";
            strtemplate += " thead { display:table-header-group }";
            strtemplate += " tfoot { display: table-row-group }";
            strtemplate += " tr { page-break-inside:avoid }</style>";

            strtemplate += "<div style='width:100%'>";
            strtemplate += "<div style='float:left;width:25%'>";
            //strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:left;width:50%'>";
            strtemplate += "<center><p>&nbsp;</p></center>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:right;'>";
            //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "</div>";
            strtemplate += "<br><br><br>";
            strtemplate += "<center>";

            strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
            strtemplate += " <p></p>";

            strtemplate += " <p></p>";
            strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
            strtemplate += "  <thead><tr> ";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application Number </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mark</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Client/Proprietor Name </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class Details</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of Application </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>User Details</th>";
            //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
            strtemplate += "</tr></thead><tbody>";

            for (int i = 0; casedeatils.Rows.Count > i; i++)
            {

                var AppNo = casedeatils.Rows[i].ItemArray[3];
                var mark = casedeatils.Rows[i].ItemArray[1];
                var prop = casedeatils.Rows[i].ItemArray[2];
                var status = casedeatils.Rows[i].ItemArray[4];
                var ClassDetails = casedeatils.Rows[i].ItemArray[5];
                var AppDate = casedeatils.Rows[i].ItemArray[6];
                var UsedSince = casedeatils.Rows[i].ItemArray[7];

                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppNo + "</td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + mark + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + prop + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + status + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ClassDetails + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppDate + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + UsedSince + " </td>";
                var closesate = "";
                strtemplate += "</tr>";
            }

            strtemplate += "</tbody></table>";
            string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
            htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
            //htmlToPdf.Zoom = 0.55f;
            //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

            //Added by umesh on 6 may 22 
            var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
            htmlToPdf.Margins = pageMargins;
            htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

            var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
            var pffth = folderPath + pdffileName + ".pdf";
            System.IO.File.WriteAllBytes(pffth, pdfBytes);

            //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Searched Trademark Data in PDF";
            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                null, null);
        }

        /// <summary>
        /// Method for downloading PDF for Trademark Tracker (View Added Trademark Page)
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ViewAddedTrademarkExporttoPDFNewCases()
        {
            var pagenum = "1";
            var pagesize1 = "50";

            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            var sort = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]));
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);

            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            pagenum = HttpContext.Request.QueryString["pagenum"];

            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingToDate"]);
            if(dHearingDatefrom=="Invalid Date")
            {
                dHearingDatefrom = "";
            }
            if (dHearingDateto == "Invalid Date")
            {
                dHearingDateto = "";
            }

            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            dateapplicationto = (dateapplicationto == null || dateapplicationto.ToLower() == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom.ToLower() == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail.ToLower() == "null") ? "" : searchuserdetetail;
            JurisdictionList = (searchtype == null || JurisdictionList.ToLower() == "null") ? "" : JurisdictionList;

            if (sort == null)
            {
                sort = 0;
            }

            colname = (colname == null || colname.ToLower() == "null") ? "" : colname;

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            var db = new LawPracticeEntities();
            var ds = new LawPracticeFirm.API.IPRApiController();
            var ds1 = ds.exporttoexcel(userId, firmId, filtertradmark, searchclass, Proprietor, searchstatus, applicationno, searchtype, dateapplicationto, dateapplicationfrom, searchuserdetetail, JurisdictionList, usedsincefrom1, usedsinceto1, pagenum, sort, colname, dHearingDatefrom, dHearingDateto);
            DataTable casedeatils = new DataTable();
            string pdffileName = "Mykase_trademark_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");

            try
            {
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Proprietor");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");
                casedeatils.Columns.Add("HearingDate");


                for (int i = 0; i < ds1.Count; i++)
                {
                    var markStatus = "";
                    if (ds1[i].vWordMark == "" || ds1[i].vStatus == "")
                    {
                        markStatus = "In Process";
                    }
                    else
                    {
                        markStatus = ds1[i].vStatus;
                    }
                    DateTime hDate = DateTime.Parse(ds1[i].vHearingDate);
                    string newFormat = hDate.ToString("dd-MM-yyyy");
                    if (newFormat == "01-01-1900")
                    {
                        newFormat = "";
                    }

                    //casedeatils.Rows.Add(
                    //    ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, ds1[i].vStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                    //    );
                    casedeatils.Rows.Add(
                        ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, markStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                        );
                }
            }
            catch (Exception ex)
            {

            }

            string strtemplate = "";
            var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            strtemplate += "<style> table { overflow: visible !important; }";
            strtemplate += " thead { display:table-header-group }";
            strtemplate += " tfoot { display: table-row-group }";
            strtemplate += " tr { page-break-inside:avoid }</style>";

            strtemplate += "<div style='width:100%'>";
            strtemplate += "<div style='float:left;width:25%'>";
            //strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:left;width:50%'>";
            strtemplate += "<center><p>&nbsp;</p></center>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:right;'>";
            //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "</div>";
            strtemplate += "<br><br><br>";
            strtemplate += "<center>";

            strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
            strtemplate += " <p></p>";

            strtemplate += " <p></p>";
            strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
            strtemplate += "  <thead><tr> ";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application Number </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mark</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Client/Proprietor Name </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class Details</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of Application </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>User Details</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Hearing Date</th>";
            //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
            strtemplate += "</tr></thead><tbody>";


            for (int i = 0; casedeatils.Rows.Count > i; i++)
            {

                var AppNo = casedeatils.Rows[i].ItemArray[3];
                var mark = casedeatils.Rows[i].ItemArray[1];
                var prop = casedeatils.Rows[i].ItemArray[2];
                var status = casedeatils.Rows[i].ItemArray[4];
                var ClassDetails = casedeatils.Rows[i].ItemArray[5];
                var AppDate = casedeatils.Rows[i].ItemArray[6];
                var UsedSince = casedeatils.Rows[i].ItemArray[7];
                var HearingDate= casedeatils.Rows[i].ItemArray[8];

                //strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";

                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppNo + "</td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + mark + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + prop + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + status + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ClassDetails + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppDate + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + UsedSince + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + HearingDate + " </td>";
                var closesate = "";

                strtemplate += "</tr>";
            }


            strtemplate += "</tbody></table>";

            string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }


            var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


            htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
            //htmlToPdf.Zoom = 0.55f;
            //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

            //Added by umesh on 6 may 22 
            var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
            htmlToPdf.Margins = pageMargins;
            htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

            var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
            var pffth = folderPath + pdffileName + ".pdf";
            System.IO.File.WriteAllBytes(pffth, pdfBytes);

            //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Searched Trademark Data in PDF";
            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                null, null);
        }


        /// <summary>
        /// Download shared trademark
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ViewSharedTrademarkExporttoPDF()
        {
            var pagenum = "1";
            var pagesize1 = "50";

            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            var sort = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]));
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);

            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingToDate"]);

            pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            pagenum = HttpContext.Request.QueryString["pagenum"];

            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            dateapplicationto = (dateapplicationto == null || dateapplicationto.ToLower() == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom.ToLower() == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail.ToLower() == "null") ? "" : searchuserdetetail;
            JurisdictionList = (searchtype == null || JurisdictionList.ToLower() == "null") ? "" : JurisdictionList;

            if (sort == null)
            {
                sort = 0;
            }

            colname = (colname == null || colname.ToLower() == "null") ? "" : colname;

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            var db = new LawPracticeEntities();
            var ds = new LawPracticeFirm.API.IPRApiController();
            var ds1 = ds.exportsharetoexcel(userId, firmId, filtertradmark, searchclass, Proprietor, searchstatus, applicationno, searchtype, dateapplicationto, dateapplicationfrom, searchuserdetetail, JurisdictionList, usedsincefrom1, usedsinceto1, pagenum, sort, colname, dHearingDatefrom, dHearingDateto);
            DataTable casedeatils = new DataTable();
            string pdffileName = "SharedTrademark_" + DateTime.Now.ToString("dd-MMMM-yyyy");

            try
            {
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Proprietor");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");
                casedeatils.Columns.Add("HearingDate");

                for (int i = 0; i < ds1.Count; i++)
                {
                    var markStatus = "";
                    if (ds1[i].vWordMark == "" || ds1[i].vStatus == "")
                    {
                        markStatus = "In Process";
                    }
                    else
                    {
                        markStatus = ds1[i].vStatus;
                    }

                    DateTime hDate = DateTime.Parse(ds1[i].vHearingDate);
                    string newFormat = hDate.ToString("dd-MM-yyyy");
                    if (newFormat == "01-01-1900")
                    {
                        newFormat = "";
                    }

                    //casedeatils.Rows.Add(
                    //    ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, ds1[i].vStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                    //    );
                    casedeatils.Rows.Add(
                        ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, markStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                        );
                }
            }
            catch (Exception ex)
            {

            }

            string strtemplate = "";
            var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            strtemplate += "<style> table { overflow: visible !important; }";
            strtemplate += " thead { display:table-header-group }";
            strtemplate += " tfoot { display: table-row-group }";
            strtemplate += " tr { page-break-inside:avoid }</style>";

            strtemplate += "<div style='width:100%'>";
            strtemplate += "<div style='float:left;width:25%'>";
            //strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:left;width:50%'>";
            strtemplate += "<center><p>&nbsp;</p></center>";
            strtemplate += "</div>";
            strtemplate += "<div style='float:right;'>";
            //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
            strtemplate += "</div>";
            strtemplate += "</div>";
            strtemplate += "<br><br><br>";
            strtemplate += "<center>";

            strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
            strtemplate += " <p></p>";

            strtemplate += " <p></p>";
            strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
            strtemplate += "  <thead><tr> ";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application Number </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mark</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Client/Proprietor Name </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class Details</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of Application </th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>User Details</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Hearing Date</th>";
            //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
            strtemplate += "</tr></thead><tbody>";


            for (int i = 0; casedeatils.Rows.Count > i; i++)
            {

                var AppNo = casedeatils.Rows[i].ItemArray[3];
                var mark = casedeatils.Rows[i].ItemArray[1];
                var prop = casedeatils.Rows[i].ItemArray[2];
                var status = casedeatils.Rows[i].ItemArray[4];
                var ClassDetails = casedeatils.Rows[i].ItemArray[5];
                var AppDate = casedeatils.Rows[i].ItemArray[6];
                var UsedSince = casedeatils.Rows[i].ItemArray[7];
                var hearingDate = casedeatils.Rows[i].ItemArray[8];

                //strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";

                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppNo + "</td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + mark + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + prop + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + status + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ClassDetails + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppDate + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + UsedSince + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + hearingDate + " </td>";
                var closesate = "";

                strtemplate += "</tr>";
            }


            strtemplate += "</tbody></table>";

            string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }


            var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


            htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
            //htmlToPdf.Zoom = 0.55f;
            //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

            //Added by umesh on 6 may 22 
            var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
            htmlToPdf.Margins = pageMargins;
            htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

            var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
            var pffth = folderPath + pdffileName + ".pdf";
            System.IO.File.WriteAllBytes(pffth, pdfBytes);

            //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Searched Trademark Data in PDF";
            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                null, null);
        }

        /// <summary>
        /// Export to Excel Method For Proprietor Search Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public string ExportoExcelProprietorSearch()
        {
            List<sp_GetIPRProprietorSearchResults_Result> dataList = new List<sp_GetIPRProprietorSearchResults_Result>();
            string SerializedValue = "";
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            var pageindex = HttpContext.Request.QueryString["pageindex"];
            var pageSize = HttpContext.Request.QueryString["pagesize1"];
            DataTable dt = new DataTable();

            try
            {
                var db = new LawPracticeEntities();
                dataList = db.sp_GetIPRProprietorSearchResults(userId, firmId, "", "", "", "", 0, 0, Convert.ToInt32(pageindex), Convert.ToInt32(pageSize), 0, "").ToList();
                int i = 0, j = 1, k = 1, l = 1, m = 1, n = 1;

                using (var package = new ExcelPackage())
                {
                    i = i + 1;
                    //Trade Mark WorkSheet
                    var worksheet1 = package.Workbook.Worksheets.Add("Trade Mark");

                    worksheet1.Cells[1, i].Value = "S.No";
                    worksheet1.Cells[1, i + 1].Value = "Application Number";
                    worksheet1.Cells[1, i + 2].Value = "Trade Mark";
                    worksheet1.Cells[1, i + 3].Value = "Status";
                    worksheet1.Cells[1, i + 4].Value = "Class";
                    worksheet1.Cells[1, i + 5].Value = "Date of Application";
                    worksheet1.Cells[1, i + 6].Value = "Appropriate Office";
                    worksheet1.Cells[1, i + 7].Value = "Trade Mark Type";
                    worksheet1.Cells[1, i + 8].Value = "Class Details";
                    worksheet1.Cells[1, i + 9].Value = "Proprietor Name";
                    worksheet1.Cells[1, i + 10].Value = "Proprietor Address";
                    worksheet1.Cells[1, i + 11].Value = "User Detail";
                    worksheet1.Cells[1, i + 12].Value = "Agent";
                    worksheet1.Cells[1, i + 13].Value = "Agent Address";
                    worksheet1.Cells[1, i + 14].Value = "Documents";

                    //Copyright WorkSheet
                    var worksheet2 = package.Workbook.Worksheets.Add("Copyright");

                    worksheet2.Cells[1, i].Value = "S.No";
                    worksheet2.Cells[1, i + 1].Value = "Diary Number";
                    worksheet2.Cells[1, i + 2].Value = "RoC no.";
                    worksheet2.Cells[1, i + 3].Value = "Title of the Work";
                    worksheet2.Cells[1, i + 4].Value = "Status";
                    worksheet2.Cells[1, i + 5].Value = "Category";
                    worksheet2.Cells[1, i + 6].Value = "Date";
                    worksheet2.Cells[1, i + 7].Value = "Applicant Name";

                    //Patent WorkSheet
                    var worksheet3 = package.Workbook.Worksheets.Add("Patent");

                    worksheet3.Cells[1, i].Value = "S.No";
                    worksheet3.Cells[1, i + 1].Value = "Application Number";
                    worksheet3.Cells[1, i + 2].Value = "Publication Number";
                    worksheet3.Cells[1, i + 3].Value = "Publication Date";
                    worksheet3.Cells[1, i + 4].Value = "Date of filing of Application";
                    worksheet3.Cells[1, i + 5].Value = "Title of the Invention";
                    worksheet3.Cells[1, i + 6].Value = "International Classification";
                    worksheet3.Cells[1, i + 7].Value = "Priority Document No.";
                    worksheet3.Cells[1, i + 8].Value = "Priority Date";
                    worksheet3.Cells[1, i + 9].Value = "Name of Priority Country";
                    worksheet3.Cells[1, i + 10].Value = "International Application No. Filing Date";
                    worksheet3.Cells[1, i + 11].Value = "International Publication No.";
                    worksheet3.Cells[1, i + 12].Value = "Patent of Addition to Application Number Filing Date";
                    worksheet3.Cells[1, i + 13].Value = "Divisional to Application Number Filing Date";
                    worksheet3.Cells[1, i + 14].Value = "Name of Applicant";
                    worksheet3.Cells[1, i + 15].Value = "Address of Applicant";
                    worksheet3.Cells[1, i + 16].Value = "Applicant Country";
                    worksheet3.Cells[1, i + 17].Value = "Name of Inventor";
                    worksheet3.Cells[1, i + 18].Value = "Inventory Country";
                    worksheet3.Cells[1, i + 19].Value = "Inventor Address";
                    worksheet3.Cells[1, i + 20].Value = "Abstract";
                    worksheet3.Cells[1, i + 21].Value = "No. of Pages";
                    worksheet3.Cells[1, i + 22].Value = "No. of Claims";
                    worksheet3.Cells[1, i + 23].Value = "The Patent Office Journal No. and Date";
                    worksheet3.Cells[1, i + 24].Value = "Complete Specification";

                    // GI WorkSheet
                    var worksheet4 = package.Workbook.Worksheets.Add("GI");

                    worksheet4.Cells[1, i].Value = "S.No";
                    worksheet4.Cells[1, i + 1].Value = "Geographical Indication";
                    worksheet4.Cells[1, i + 2].Value = "Status";
                    worksheet4.Cells[1, i + 3].Value = "Class";
                    worksheet4.Cells[1, i + 4].Value = "Date of Filing";
                    worksheet4.Cells[1, i + 5].Value = "Applicant Name";
                    worksheet4.Cells[1, i + 6].Value = "Applicant Address";
                    worksheet4.Cells[1, i + 7].Value = "Goods";
                    worksheet4.Cells[1, i + 8].Value = "Geographical Area";
                    worksheet4.Cells[1, i + 9].Value = "Priority Country";
                    worksheet4.Cells[1, i + 10].Value = "Journal Number";
                    worksheet4.Cells[1, i + 11].Value = "Availability Date";
                    worksheet4.Cells[1, i + 12].Value = "Certificate Number";
                    worksheet4.Cells[1, i + 13].Value = "Certificate Date";
                    worksheet4.Cells[1, i + 14].Value = "Registration Valid Upto";

                    // Design WorkSheet
                    var worksheet5 = package.Workbook.Worksheets.Add("Design");

                    worksheet5.Cells[1, i].Value = "S.No";
                    worksheet5.Cells[1, i + 1].Value = "Design Number";
                    worksheet5.Cells[1, i + 2].Value = "Class";
                    worksheet5.Cells[1, i + 3].Value = "Name Of Applicant";
                    worksheet5.Cells[1, i + 4].Value = "Address Of Applicant";
                    worksheet5.Cells[1, i + 5].Value = "Date Of Registration";
                    worksheet5.Cells[1, i + 6].Value = "Title";
                    worksheet5.Cells[1, i + 7].Value = "Priority";
                    worksheet5.Cells[1, i + 8].Value = "Design Image";

                    foreach (var item in dataList)
                    {
                        try
                        {
                            //List<IPRList> casedeatils = new List<IPRList>();                              
                            string userId1 = userId;
                            string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                            //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                            var addfClient = new WebClient();
                            object rawfile = new
                            {
                                userid = strusername,
                                Accesstoken = "mykase123456789abcdef",
                                iid = item.IPRRefId,
                                ip = item.IPTypeId
                            };


                            addfClient.Encoding = System.Text.Encoding.UTF8;
                            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                            string builders = JsonConvert.SerializeObject(rawfile);
                            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRDetailsbyIid"), "POST", builders);


                            dynamic jObject = JObject.Parse(resid);
                            dynamic data1 = jObject["data"];
                            int pageid = 0;


                            if (item.IPTypeId == 1)
                            {
                                j = ++j;
                                worksheet1.Cells["A" + j.ToString()].Value = data1[0].vApplNo.ToString();
                                worksheet1.Cells["B" + j.ToString()].Value = data1[0].vWordMark.ToString();
                                worksheet1.Cells["C" + j.ToString()].Value = data1[0].vStatus.ToString();
                                worksheet1.Cells["D" + j.ToString()].Value = data1[0].vClass.ToString();
                                worksheet1.Cells["E" + j.ToString()].Value = data1[0].dApplDate.ToString();
                                worksheet1.Cells["F" + j.ToString()].Value = "-";
                                worksheet1.Cells["G" + j.ToString()].Value = data1[0].dGSDescription.ToString();
                                worksheet1.Cells["H" + j.ToString()].Value = data1[0].CertificationDetails.ToString();
                                worksheet1.Cells["I" + j.ToString()].Value = data1[0].vProprietor.ToString();
                                worksheet1.Cells["J" + j.ToString()].Value = "-";
                                worksheet1.Cells["K" + j.ToString()].Value = data1[0].vUsedSince.ToString();
                                worksheet1.Cells["L" + j.ToString()].Value = data1[0].Agent.ToString();
                                worksheet1.Cells["M" + j.ToString()].Value = data1[0].AgentAddress.ToString();
                                worksheet1.Cells["N" + j.ToString()].Value = "-";
                            }

                            else if (item.IPTypeId == 2)
                            {
                                k = ++k;
                                worksheet2.Cells["A" + k.ToString()].Value = i++;
                                worksheet2.Cells["B" + k.ToString()].Value = data1[0].vDiaryNo.ToString();
                                worksheet2.Cells["C" + k.ToString()].Value = data1[0].vROCNumber.ToString();
                                worksheet2.Cells["D" + k.ToString()].Value = data1[0].vTitleofWork.ToString();
                                worksheet2.Cells["E" + k.ToString()].Value = data1[0].vStatus.ToString();
                                worksheet2.Cells["F" + k.ToString()].Value = data1[0].vCategory.ToString();
                                worksheet2.Cells["G" + k.ToString()].Value = data1[0].dApplDate.ToString();
                                worksheet2.Cells["H" + k.ToString()].Value = data1[0].vApplicantName.ToString();
                            }

                            else if (item.IPTypeId == 3)
                            {
                                m = ++m;
                                worksheet3.Cells["A" + m.ToString()].Value = i++;
                                worksheet3.Cells["B" + m.ToString()].Value = data1[0].vApplNo.ToString();
                                worksheet3.Cells["C" + m.ToString()].Value = data1[0].vPublicationNo.ToString();
                                worksheet3.Cells["D" + m.ToString()].Value = data1[0].dPublicationDate.ToString();
                                worksheet3.Cells["E" + m.ToString()].Value = data1[0].dDateOffiling.ToString();
                                worksheet3.Cells["F" + m.ToString()].Value = data1[0].vInventionTitle.ToString();
                                worksheet3.Cells["G" + m.ToString()].Value = data1[0].vClassification.ToString();
                                worksheet3.Cells["H" + m.ToString()].Value = data1[0].vPriorityDocumentNo.ToString();
                                worksheet3.Cells["I" + m.ToString()].Value = data1[0].dPriorityDate.ToString();
                                worksheet3.Cells["J" + m.ToString()].Value = data1[0].vPriorityCountryName.ToString();
                                worksheet3.Cells["K" + m.ToString()].Value = data1[0].dAdditionAppNoFillingDate.ToString();
                                worksheet3.Cells["L" + m.ToString()].Value = data1[0].dDivisionalAppNoFillingDate.ToString();
                                worksheet3.Cells["M" + m.ToString()].Value = data1[0].vApplicantName.ToString();
                                worksheet3.Cells["N" + m.ToString()].Value = data1[0].vApplicantAddress.ToString();
                                worksheet3.Cells["O" + m.ToString()].Value = data1[0].vInventorName.ToString();
                                worksheet3.Cells["P" + m.ToString()].Value = data1[0].vInventoryCountry.ToString();
                                worksheet3.Cells["Q" + m.ToString()].Value = data1[0].vInventoryAddress.ToString();
                                worksheet3.Cells["R" + m.ToString()].Value = data1[0].vAbstract.ToString();
                                worksheet3.Cells["S" + m.ToString()].Value = data1[0].vNoofPages.ToString();
                                worksheet3.Cells["T" + m.ToString()].Value = data1[0].vNoofClaims.ToString();
                                worksheet3.Cells["U" + m.ToString()].Value = data1[0].PatentOffJournal.ToString();
                                worksheet3.Cells["V" + m.ToString()].Value = data1[0].vApplicantCountryName.ToString();
                                worksheet3.Cells["W" + m.ToString()].Value = data1[0].vCompSpecification.ToString();
                            }

                            else if (item.IPTypeId == 4)
                            {
                                m = ++m;
                                worksheet4.Cells["A" + m.ToString()].Value = i++;
                                worksheet4.Cells["B" + m.ToString()].Value = data1[0].vGeoIndication.ToString();
                                worksheet4.Cells["C" + m.ToString()].Value = data1[0].vStatus.ToString();
                                worksheet4.Cells["D" + m.ToString()].Value = data1[0].vClass.ToString();
                                worksheet4.Cells["E" + m.ToString()].Value = data1[0].dDateofFiling.ToString();
                                worksheet4.Cells["F" + m.ToString()].Value = data1[0].vApplicantName.ToString();
                                worksheet4.Cells["G" + m.ToString()].Value = data1[0].vApplicantAddress.ToString();
                                worksheet4.Cells["H" + m.ToString()].Value = data1[0].vGoods.ToString();
                                worksheet4.Cells["I" + m.ToString()].Value = data1[0].vGeoArea.ToString();
                                worksheet4.Cells["J" + m.ToString()].Value = data1[0].vPriorityCountry.ToString();
                                worksheet4.Cells["K" + m.ToString()].Value = data1[0].vJournalNo.ToString();
                                worksheet4.Cells["L" + m.ToString()].Value = data1[0].dAvailDate.ToString();
                                worksheet4.Cells["M" + m.ToString()].Value = data1[0].vCertificateNo.ToString();
                                worksheet4.Cells["N" + m.ToString()].Value = data1[0].dCertificateDate.ToString();
                                worksheet4.Cells["O" + m.ToString()].Value = data1[0].vRegistrationValidUpto.ToString();
                            }

                            else if (item.IPTypeId == 5)
                            {
                                m = ++m;
                                worksheet5.Cells["A" + m.ToString()].Value = i++;
                                worksheet5.Cells["B" + m.ToString()].Value = data1[0].vDesignNo.ToString();
                                worksheet5.Cells["C" + m.ToString()].Value = data1[0].vClass.ToString();
                                worksheet5.Cells["D" + m.ToString()].Value = data1[0].vApplDetails.ToString();
                                worksheet5.Cells["E" + m.ToString()].Value = data1[0].vAddress.ToString();
                                worksheet5.Cells["F" + m.ToString()].Value = data1[0].dDateOfRegistration.ToString();
                                worksheet5.Cells["G" + m.ToString()].Value = data1[0].vTitle.ToString();
                                worksheet5.Cells["H" + m.ToString()].Value = data1[0].vPriorityNo.ToString();
                                worksheet5.Cells["I" + m.ToString()].Value = "";
                            }
                        }

                        catch (Exception ex)
                        {
                            return ex.Message.ToString();
                        }
                    }

                    // Save the Excel file to a memory stream
                    var memoryStream = new MemoryStream();
                    package.SaveAs(memoryStream);

                    Response.Clear();
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment; filename=ProprietorSearchList.xlsx");
                    Response.BinaryWrite(memoryStream.ToArray());
                    Response.End();
                }
            }

            catch (Exception ex)
            {
                //StreamWriter sw = new StreamWriter("Exptoexcel_propSearch-Error.txt");
                //sw.Write(ex.InnerException.ToString());
                return ex.Message.ToString();
            }

            return "";
        }

        /// <summary>
        /// Export to Excel Method for Patent Search Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelNewPatentSearch()
        {
            int pagesize1 = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pageindex"]));
            pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            var IPList = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]);
            var tradeId = QueryAES.UrlDecode(HttpContext.Request.QueryString["tradeid"]);
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            var vsort = QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]);
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            var classification = QueryAES.UrlDecode(HttpContext.Request.QueryString["classification"]);
            var patentno = QueryAES.UrlDecode(HttpContext.Request.QueryString["patentnumber"]);
            var applicantName = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicantname"]);
            var categoryno = QueryAES.UrlDecode(HttpContext.Request.QueryString["categoryno"]);
            var rocno = QueryAES.UrlDecode(HttpContext.Request.QueryString["rocno"]);

            var Prioritydatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["prioritydategfrom"]);
            var Prioritydateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["prioritydateto"]);

            tradeId = (tradeId == null || tradeId == "null") ? "" : tradeId;
            filtertradmark = (filtertradmark == null || filtertradmark == "null") ? "" : filtertradmark;
            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            searchclass = (searchclass == null || searchclass == "null") ? "" : searchclass;
            searchtype = (searchtype == null || searchtype == "null") ? "" : searchtype;
            searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            dateapplicationto = (dateapplicationto == null || dateapplicationto == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail == "null") ? "" : searchuserdetetail;
            Proprietor = (Proprietor == null || Proprietor == "null") ? "" : Proprietor;
            JurisdictionList = (JurisdictionList == null || JurisdictionList == "null") ? "" : JurisdictionList;
            usedsincefrom1 = (usedsincefrom1 == null || usedsincefrom1 == "null") ? "" : usedsincefrom1;
            usedsinceto1 = (usedsinceto1 == null || usedsinceto1 == "null") ? "" : usedsinceto1;
            vsort = (vsort == null || vsort == "null") ? "0" : vsort;
            colname = (colname == null || colname == "null") ? "" : colname;
            classification = (classification == null || classification == "null") ? "" : classification;
            patentno = (patentno == null || patentno == "null") ? "" : patentno;
            applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
            categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
            rocno = (rocno == null || rocno == "null") ? "" : rocno;

            Prioritydatefrom = (Prioritydatefrom == null || Prioritydatefrom == "null") ? "" : Prioritydatefrom;
            Prioritydateto = (Prioritydateto == null || Prioritydateto == "null") ? "" : Prioritydateto;

            if (vsort == null)
            {
                vsort = "0";
            }

            if (colname == null || colname == "undefined")
            {
                colname = "";
            }
            string userId = LoggedInUser.UserId.ToString();

            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_patent_search_results_" + DateTime.Now.ToString("dd-MM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    jurisdiction = JurisdictionList,
                    ip = IPList,
                    vclass = searchclass,
                    proprietor = Proprietor,
                    Datefilingfrom = dateapplicationfrom,
                    Datefilingto = dateapplicationto,
                    vStatus = searchstatus,
                    userdetails = searchuserdetetail,
                    usedsincefrom = usedsincefrom1,
                    usedsinceto = usedsinceto1,
                    agent = "",
                    ApplicationNo = applicationno,
                    vtype = searchtype,
                    searchtext = filtertradmark,
                    pageindex = pagenum,
                    pagesize = pagesize1,
                    ApplicantName= applicantName,
                    Prioritydatefrom= Prioritydatefrom,
                    Prioritydateto= Prioritydateto

                };


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("Sr. No.");
                casedeatils.Columns.Add("Applicant No");
                casedeatils.Columns.Add("Title");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Date Of Filing");
                casedeatils.Columns.Add("Name Of Applicant");
                casedeatils.Columns.Add("Patent No");

                for (int i = 0; i < data1.Count; i++)
                {
                    string formatedDate = "";
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    var dateD = data.data[i]["dDateOffiling"];
                    JValue value = new JValue(data.data[i]["dDateOffiling"]);
                    string input = value.ToString(); // Convert JValue to string
                    string result = input.Trim('{', '}');
                    if(result!="")
                    {
                        formatedDate = Convert.ToDateTime(result).ToShortDateString(); ;
                    }
                    //var dateD=data.data[i]["dDateOffiling"];
                    casedeatils.Rows.Add(
                        data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vInventionTitle"], data.data[i]["vNewStatus"],
                        formatedDate, data.data[i]["vApplicantName"], data.data[i]["vPatentno"]);
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// Export to excel for Copyright Search Page 
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelNewCopyrightSearch()
        {
            var pagesize = 10;
            var pagenum = 1;
            var applicantname = HttpContext.Request.QueryString["txtApplicant"];
            var filtertrademark = HttpContext.Request.QueryString["filtertradmark"];
            var iplist = HttpContext.Request.QueryString["IPList"];
            var datefrom = HttpContext.Request.QueryString["dtFrom"];
            var dateto = HttpContext.Request.QueryString["dtTo"];
            var diaryno = HttpContext.Request.QueryString["diaryno"];
            var category = HttpContext.Request.QueryString["category"];
            var RocNo = HttpContext.Request.QueryString["roc"];
            var vStatus = HttpContext.Request.QueryString["status"];
            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);

            datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
            dateto = (dateto == null || dateto == "null") ? "" : dateto;
            diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
            category = (category == null || category == "null") ? "" : category;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            string userId = LoggedInUser.UserId.ToString();

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_trademark_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new

                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    category = category,
                    datefrom = datefrom,
                    dateto = dateto,
                    vstatus = vStatus,
                    applicant = applicantname,
                    rocno = RocNo,
                    pageindex = pagenum,
                    pagesize = pagesize,
                    vsort = 0,
                    colname = "",
                    ip = iplist,
                    diaryno = diaryno
                };

                string content = JsonConvert.SerializeObject(rawfile);

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Title of Work");
                casedeatils.Columns.Add("Diary No");
                casedeatils.Columns.Add("Status Name");
                casedeatils.Columns.Add("Date of Filing");
                casedeatils.Columns.Add("Category Name");
                casedeatils.Columns.Add("RoC No");

                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vApplicantName"], data.data[i]["vTitleofWork"], data.data[i]["vDiaryNo"],
                        data.data[i]["StatusName"], data.data[i]["dDateOffiling"], data.data[i]["vCategory"], data.data[i]["vROCNumber"]);
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Export to pdf for Copyright Search Page 
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ExportoPDFCopyrightSearch()
        {
            var pagesize = 10;
            var pagenum = 1;
            string message = "";

            var iplist = Convert.ToString(HttpContext.Request.QueryString["IPList"]);//HttpContext.Request.Form["IPList"];
            var filtertrademark = Convert.ToString(HttpContext.Request.QueryString["filtertradmark"]); //HttpContext.Request.Form["filtertradmark"];
            var applicantname = Convert.ToString(HttpContext.Request.QueryString["txtappdetails"]); //Request.Form["txtappdetails"];
            var status = Convert.ToString(HttpContext.Request.QueryString["status"]); //Request.Form["status"];
            var datefrom = Convert.ToString(HttpContext.Request.QueryString["txtdateregisterfrom"]);//HttpContext.Request.Form["txtdateregisterfrom"];
            var dateto = Convert.ToString(HttpContext.Request.QueryString["txtdateregisterto"]);//HttpContext.Request.Form["txtdateregisterto"];
            var vClass = Convert.ToString(HttpContext.Request.QueryString["class"]);//HttpContext.Request.Form["class"];
            var RocNo = Convert.ToString(HttpContext.Request.QueryString["RoCNo"]);//HttpContext.Request.Form["class"];
            var diaryno = Convert.ToString(HttpContext.Request.QueryString["dairyNo"]);//HttpContext.Request.Form["dairyNo"];
            var categoryName = Convert.ToString(HttpContext.Request.QueryString["CategoryName"]);//HttpContext.Request.Form["CategoryName"];

            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]); //Convert.ToInt32(HttpContext.Request.Form["pagenum"]);

            RocNo = (RocNo == null || RocNo == "null" || RocNo == "undefined") ? "" : RocNo;
            datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
            dateto = (dateto == null || dateto == "null") ? "" : dateto;
            diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
            categoryName = (categoryName == null || categoryName == "null") ? "" : categoryName;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            var db = new LawPracticeEntities();
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "Mykase_Copyright_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();

                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmid,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    diaryno = diaryno,
                    category = categoryName,
                    datefrom = datefrom,
                    dateto = dateto,
                    applicant = applicantname,
                    rocno = RocNo,
                    vstatus = status,
                    pageindex = pagenum,
                    pagesize = pagesize,
                    vsort = 0,
                    colname = "",
                    ip = iplist
                };

                //object rawfile = new
                //{
                //    userid = strusername,
                //    Accesstoken = "mykase123456789abcdef",
                //    searchtext = filtertrademark,
                //    categoryid = category,
                //    applicationDatefrom = datefrom,
                //    applicationDateto = dateto,
                //    vstatus = "",
                //    ApplicantName = applicantname,
                //    rocno = RocNo,
                //    pageindex = pagenum,
                //    pagesize = pagesize,
                //    vsort = 0,
                //    colname = "",
                //    ip = iplist

                //};


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Title Of Work");
                casedeatils.Columns.Add("Diary No");
                casedeatils.Columns.Add("Status Name");
                casedeatils.Columns.Add("Date Of Filing");
                casedeatils.Columns.Add("Category Name");
                casedeatils.Columns.Add("RoC No");

                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    casedeatils.Rows.Add(
                        data.data[i]["RowId"], data.data[i]["vApplicantName"], data.data[i]["vTitleofWork"], data.data[i]["vDiaryNo"],
                        data.data[i]["StatusName"], data.data[i]["dDateOffiling"], data.data[i]["vCategory"], data.data[i]["vROCNumber"]);
                }

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                //strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";

                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";

                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title Of Work</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Filing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ROC No.</th>";
                strtemplate += "</tr></thead><tbody>";


                for (int i = 0; casedeatils.Rows.Count > i; i++)
                {

                    var ApplName = casedeatils.Rows[i].ItemArray[1];
                    var Title = casedeatils.Rows[i].ItemArray[2];
                    var DiaryNo = casedeatils.Rows[i].ItemArray[3];
                    var Status = casedeatils.Rows[i].ItemArray[4];
                    var DateofFiling = casedeatils.Rows[i].ItemArray[5];
                    if (DateofFiling != "")
                    {
                        DateofFiling = Convert.ToDateTime(DateofFiling).ToShortDateString();
                    }
                    else
                    {
                        DateofFiling = "";
                    }
                    //var CategoryId = casedeatils.Rows[i].ItemArray[6];
                    var CategoryName = casedeatils.Rows[i].ItemArray[6];
                    var ROC = casedeatils.Rows[i].ItemArray[7];
                    //var EntryDate = casedeatils.Rows[i].ItemArray[9];

                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ApplName + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + Title + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + DiaryNo + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + Status + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + DateofFiling + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + CategoryId + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + CategoryName + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ROC + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + EntryDate + " </td>";
                    var closesate = "";

                    strtemplate += "</tr>";
                }

                strtemplate += "</tbody></table>";

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }


                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                //htmlToPdf.Zoom = 0.55f;
                //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

                //Added by umesh on 6 may 22 
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);

                //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Searched Copyright Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Copyright PDF",
                    null, null);

                message = "Your PDF has been downloaded successfully!";
            }
            catch (Exception ex)
            {
                message = "There was an error in downloading the PDF, please try again later";
            }

            return Content(message, "text/plain");
        }

        /// <summary>
        /// Export to excel for Trademark Search Page 
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public string ExportoExcelNewCases()
        {
            var pagesize1 = "50";

            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);

            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            var pagenum = HttpContext.Request.QueryString["pagenum"];

            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null" || searchtype == "undefined") ? "" : searchtype;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail.ToLower() == "null" || searchuserdetetail == "undefined") ? "" : filtertradmark;

            var db = new LawPracticeEntities();

            string userId = LoggedInUser.UserId.ToString();

            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_trademark_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    jurisdiction = JurisdictionList,
                    ip = IPList,
                    vclass = searchclass,
                    proprietor = Proprietor,
                    ApplicationDatefrom = dateapplicationfrom,
                    ApplicationDateto = dateapplicationto,
                    Status = searchstatus,
                    userdetails = searchuserdetetail,
                    usedsincefrom = usedsincefrom1,
                    usedsinceto = usedsinceto1,
                    agent = "",
                    ApplNo = applicationno,
                    vtype = searchtype,
                    searchtext = filtertradmark,
                    pageindex = pagenum,
                    pagesize = pagesize1

                };


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Client/Proprietor Name");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");


                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    var RowId = data.data[i]["RowId"];
                    //string status = data.Status;
                    string dApplDate = "", vUsedSince = "";
                    try
                    {
                        dApplDate = data.data[i]["dApplDate"];
                    }
                    catch { }
                    try
                    {
                        vUsedSince = data.data[i]["vUsedSince"];
                    }
                    catch { }

                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vWordMark"], data.data[i]["vProprietor"], data.data[i]["vApplNo"],
                        data.data[i]["vStatus"], data.data[i]["vClass"], dApplDate, vUsedSince);
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }

            return "";
        }

        /// <summary>
        /// Export To Excel for Design Search Page
        /// </summary>

        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelNewDesignSearch()
        {
            var pagesize = 10;
            var pagenum = 1;
            var filtertrademark = HttpContext.Request.QueryString["filtertradmark"];
            var designno = HttpContext.Request.QueryString["designnum"];
            var iplist = "5";
            var appDetails = HttpContext.Request.QueryString["txtappdetails"];
            var status = HttpContext.Request.QueryString["status"];
            var dateofregisterfrom = HttpContext.Request.QueryString["txtdateregisterfrom"];
            var dateofregisterto = HttpContext.Request.QueryString["txtdateregisterto"];

            var title = HttpContext.Request.QueryString["title"];
            var pcountry = HttpContext.Request.QueryString["country"];
            var vClass = HttpContext.Request.QueryString["vclass"];
            pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);

            designno = (designno == null || designno == "null") ? "" : designno;
            iplist = (iplist == null || iplist == "null") ? "5" : iplist;
            appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
            status = (status == null || status == "null") ? "" : status;
            dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null") ? "" : dateofregisterfrom;
            dateofregisterto = (dateofregisterto == null || dateofregisterto == "null") ? "" : dateofregisterto;
            title = (title == null || title == "null") ? "" : title;
            pcountry = (pcountry == null || pcountry == "null") ? "" : pcountry;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            //if (vsort == null)
            //{
            //    vsort = "0";
            //}

            //if (colname == null || colname == "undefined")
            //{
            //    colname = "";
            //}
            string userId = LoggedInUser.UserId.ToString();

            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_design_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    ip = iplist,
                    designno = designno,
                    vclass = vClass,
                    appdetails = appDetails,
                    Status = status,
                    dateofRegisterFrom = dateofregisterfrom,
                    dateofRegisterTo = dateofregisterto,
                    title = title,
                    pcountry = pcountry,
                    pageindex = pagenum,
                    pagesize = pagesize,
                    vsort = 0,
                    colname = "",

                };


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Design No");
                casedeatils.Columns.Add("vClass");
                casedeatils.Columns.Add("Address");
                casedeatils.Columns.Add("Applicant Details");
                casedeatils.Columns.Add("Date Of Registration");
                casedeatils.Columns.Add("Title");
                casedeatils.Columns.Add("Priority No");
                casedeatils.Columns.Add("Patent Of Journal No");

                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    //string vClassName = "  " + data.data[i]["vClass"] + "  ";
                    string vClassFormattedValue = "=\"" + data.data[i]["vClass"] + "\"";

                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vDesignNo"], vClassFormattedValue, data.data[i]["vAddress"], data.data[i]["vApplDetails"],
                          data.data[i]["dDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"], data.data[i]["vPatentOffJournalNo"]);
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// Export to Excel for View Added Trademark Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ViewAddedTrademarkExportoExcelNewCases()
        {

            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);

            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            var sort = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]));
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            string pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            string pagenum = HttpContext.Request.QueryString["pagenum"];
            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingToDate"]);
            if(dHearingDatefrom=="Invalid Date")
            {
                dHearingDatefrom = "";
            }
            if (dHearingDateto == "Invalid Date")
            {
                dHearingDateto = "";
            }
            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            dateapplicationto = (dateapplicationto == null || dateapplicationto.ToLower() == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom.ToLower() == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail.ToLower() == "null") ? "" : searchuserdetetail;
            JurisdictionList = (searchtype == null || JurisdictionList.ToLower() == "null") ? "" : JurisdictionList;
            //searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            colname = (colname == null || colname.ToLower() == "null") ? "" : colname;

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            var db = new LawPracticeEntities();
            var ds = new LawPracticeFirm.API.IPRApiController();
            var ds1 = ds.exporttoexcel(userId, firmId, filtertradmark, searchclass, Proprietor, searchstatus, applicationno, searchtype, dateapplicationto, dateapplicationfrom, searchuserdetetail, JurisdictionList, usedsincefrom1, usedsinceto1, pagenum, sort, colname, dHearingDatefrom, dHearingDateto);

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_trademark_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");

                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Proprietor");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");
                casedeatils.Columns.Add("HearingDate");


                for (int i = 0; i < ds1.Count; i++)
                {
                    var markStatus="";
                    if(ds1[i].vWordMark=="" || ds1[i].vStatus=="")
                    {
                        markStatus = "In Process";
                    }
                    else
                    {
                        markStatus = ds1[i].vStatus;
                    }
                    DateTime hDate = DateTime.Parse(ds1[i].vHearingDate);
                    string newFormat = hDate.ToString("dd-MM-yyyy");
                    if (newFormat == "01-01-1900")
                    {
                        newFormat = "";
                    }

                    //casedeatils.Rows.Add(
                    //    ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, ds1[i].vStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                    //    );
                    casedeatils.Rows.Add(
                        ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, markStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                        );
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }
       
        /// <summary>
        /// Export to Excel for View shared Trademark Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ViewSharedTrademarkExportoExcel()
        {

            var IPList = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["IPList"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtapplicationno"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);

            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            var sort = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]));
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            string pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            string pagenum = HttpContext.Request.QueryString["pagenum"];
            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingToDate"]);

            filtertradmark = (filtertradmark == null || filtertradmark.ToLower() == "null") ? "" : filtertradmark;
            searchclass = (searchclass == null || searchclass.ToLower() == "null") ? "" : searchclass;
            Proprietor = (Proprietor == null || Proprietor.ToLower() == "null") ? "" : Proprietor;
            searchstatus = (searchstatus == null || searchstatus.ToLower() == "null") ? "" : searchstatus;
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            dateapplicationto = (dateapplicationto == null || dateapplicationto.ToLower() == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom.ToLower() == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail.ToLower() == "null") ? "" : searchuserdetetail;
            JurisdictionList = (searchtype == null || JurisdictionList.ToLower() == "null") ? "" : JurisdictionList;
            //searchtype = (searchtype == null || searchtype.ToLower() == "null") ? "" : searchtype;
            colname = (colname == null || colname.ToLower() == "null") ? "" : colname;

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            var db = new LawPracticeEntities();
            var ds = new LawPracticeFirm.API.IPRApiController();
            var ds1 = ds.exportsharetoexcel(userId, firmId, filtertradmark, searchclass, Proprietor, searchstatus, applicationno, searchtype, dateapplicationto, dateapplicationfrom, searchuserdetetail, JurisdictionList, usedsincefrom1, usedsinceto1, pagenum, sort, colname, dHearingDatefrom, dHearingDateto);

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "Sharedtrademark_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                //var newObject = ds1.Cast<object>().ToArray();
                //var SerializedData = JsonConvert.SerializeObject(ds1);


                //dynamic jObject = JObject.Parse(SerializedData);
                //dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("Proprietor");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("ApplicationDate");
                casedeatils.Columns.Add("UsedSince");
                casedeatils.Columns.Add("HearingDate");


                for (int i = 0; i < ds1.Count; i++)
                {
                    var markStatus = "";
                    if (ds1[i].vWordMark == "" || ds1[i].vStatus == "")
                    {
                        markStatus = "In Process";
                    }
                    else
                    {
                        markStatus = ds1[i].vStatus;
                    }
                    //dynamic data = JObject.Parse(SerializedData);
                    //string status = data.Status;
                    DateTime hDate = DateTime.Parse(ds1[i].vHearingDate);
                    string newFormat = hDate.ToString("dd-MM-yyyy");
                    if (newFormat == "01-01-1900")
                    {
                        newFormat = "";
                    }
                    //casedeatils.Rows.Add(
                    //    ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, ds1[i].vStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                    //    );
                    casedeatils.Rows.Add(
                        ds1[i].RowId, ds1[i].vWordMark, ds1[i].vProprietor, ds1[i].vApplNo, markStatus, ds1[i].vClass, ds1[i].dApplDate, ds1[i].vUsedSince, newFormat
                        );

                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// Export to Excel for View Added Trademark Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ViewAddedCopyrightExportoExcelNewCases()
        {
            try
            {
                int pageNum = 1;
                int pageSize = 10;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                string vStatus = HttpContext.Request.QueryString["statusforcopyright"];
                pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);
                var searchtext = HttpContext.Request.QueryString["filtertradmark"];
                var diaryno = HttpContext.Request.QueryString["txtdiaryno"];
                var categoryno = HttpContext.Request.QueryString["ctgry1"];
                var datefrom = HttpContext.Request.QueryString["txtdatefrom"];
                var dateto = HttpContext.Request.QueryString["txtdateto"];
                var applicant = HttpContext.Request.QueryString["txtApplicant"];
                var rocno = HttpContext.Request.QueryString["txtroc"];
                var iprcounter = HttpContext.Request.QueryString["hdncounter"];
                var sort = Convert.ToInt32(HttpContext.Request.QueryString["vsort"]);
                var colname = HttpContext.Request.QueryString["colname"];

                diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
                categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                applicant = (applicant == null || applicant == "null") ? "" : applicant;
                rocno = (rocno == null || rocno == "null") ? "" : rocno;
                iprcounter = (iprcounter == null || iprcounter == "null") ? "" : iprcounter;
                colname = (colname == null || colname == "null") ? "" : colname;
                vStatus = (vStatus == "null" || string.IsNullOrEmpty(vStatus)) ? "" : vStatus;

                var vStatuslist = "";
                if (vStatus != "")
                {
                    foreach (var item in vStatus.Split(','))
                    {
                        vStatuslist += "'" + item + "',";
                    }
                    vStatuslist = vStatuslist.TrimStart('\'');
                    vStatuslist = vStatuslist.TrimEnd('\'', ',');
                }

                var list = DataAccessIPRADO.GetIPRCopyrightList(userId, firmId, pageNum, pageSize, searchtext, diaryno, categoryno, datefrom, dateto, vStatuslist, applicant, rocno, sort, colname);

                try
                {
                    DataTable casedeatils = new DataTable();
                    string exlfilename = "Mykase_Copyright_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                    casedeatils.Columns.Add("Applicant Name");
                    casedeatils.Columns.Add("Title Of Work");
                    casedeatils.Columns.Add("Diary No.");
                    casedeatils.Columns.Add("Status");
                    casedeatils.Columns.Add("Date Of Application");
                    casedeatils.Columns.Add("Category");

                    for (int i = 0; i < list.Rows.Count; i++)
                    {
                        casedeatils.Rows.Add(
                            checkformatvalue(list.Rows[i]["vApplicantName"].ToString()), checkformatvalue(list.Rows[i]["vTitleofWork"].ToString()), checkformatvalue(list.Rows[i]["vDiaryNo"].ToString()),
                            checkformatvalue(list.Rows[i]["StatusName"].ToString()), checkformatvalue(list.Rows[i]["dApplDate"].ToString()), checkformatvalue(list.Rows[i]["vCategoryName"].ToString()));
                    }

                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    Response.Output.Write(objStringWriter.ToString());
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }



        /// <summary>
        /// Export to Excel for added patent
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportAddedPatentToExcel()
        {
            try
            {
                int pageNum = 1, pageSize = 10;
                string vStatus = "";
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var searchtext = HttpContext.Request.QueryString["filtertradmark"];
                var applicationno = HttpContext.Request.QueryString["applicationno"];
                vStatus = HttpContext.Request.QueryString["status"];
                var applicantName = HttpContext.Request.QueryString["applicant"];
                var patentno = HttpContext.Request.QueryString["patentno"];
                var datefrom = HttpContext.Request.QueryString["datefrom"];
                var dateto = HttpContext.Request.QueryString["dateto"];
                var priorityDateFrom = HttpContext.Request.QueryString["pdatefrom"];
                var priorityDateTo = HttpContext.Request.QueryString["pdateto"];
                var publishDateFrom = HttpContext.Request.QueryString["pubDateFrom"];
                var publishDateTo = HttpContext.Request.QueryString["pubDateTo"];
                pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);

                searchtext = (searchtext == null || searchtext == "null") ? "" : searchtext;
                applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
                vStatus = (vStatus == null || vStatus == "null") ? "" : vStatus;
                applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
                patentno = (patentno == null || patentno == "null") ? "" : patentno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                priorityDateFrom = (priorityDateFrom == null || priorityDateFrom == "null") ? "" : priorityDateFrom;
                priorityDateTo = (priorityDateTo == null || priorityDateTo == "null") ? "" : priorityDateTo;
                publishDateFrom = (publishDateFrom == null || publishDateFrom == "null") ? "" : publishDateFrom;
                publishDateTo = (publishDateTo == null || publishDateTo == "null") ? "" : publishDateTo;


                var list = DataAccessIPRADO.GetAddedPatentDetails(userId, firmId, pageNum, pageSize, searchtext, datefrom, dateto, vStatus, applicantName, priorityDateFrom, priorityDateTo, publishDateFrom, publishDateTo, patentno, applicationno);

                try
                {
                    DataTable casedeatils = new DataTable();
                    string exlfilename = "Mykase_Patent_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                    casedeatils.Columns.Add("Applicant No.");
                    casedeatils.Columns.Add("Title");
                    casedeatils.Columns.Add("Status");
                    casedeatils.Columns.Add("Date Of Filing");
                    casedeatils.Columns.Add("Name Of Applicant");
                    casedeatils.Columns.Add("Patent No.");

                    for (int i = 0; i < list.Rows.Count; i++)
                    {
                        casedeatils.Rows.Add(
                            list.Rows[i]["vApplNo"].ToString(),
                            list.Rows[i]["vInventionTitle"].ToString(),
                            list.Rows[i]["StatusName"].ToString(),
                            list.Rows[i]["dDateOffiling"].ToString(),
                            list.Rows[i]["vApplicantName"].ToString(),
                            list.Rows[i]["vPatentNum"].ToString());
                    }

                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    Response.Output.Write(objStringWriter.ToString());
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }


        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetIPRClassList1()
        {
            List<IPRList> casedeatils = new List<IPRList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef"

                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/ClassList"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];


                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string idd = data.data[i].idd;
                    string Name = data.data[i].Name;
                    string className = data.data[i].className;

                    // Add parts to the list.
                    casedeatils.Add(new IPRList
                    {
                        id = idd,
                        name = Name,
                        className = className

                    });


                }
                //return Json(casedeatils, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

            }
            return Json(casedeatils, JsonRequestBehavior.AllowGet);

        }

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetIPRClassListForDesign()
        {
            List<IPRList> casedeatils = new List<IPRList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef"

                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/ClassListForDesign"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];


                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string idd = data.data[i].idd;
                    string Name = data.data[i].Name;
                    string className = data.data[i].className;

                    // Add parts to the list.
                    casedeatils.Add(new IPRList
                    {
                        id = idd,
                        name = Name,
                        className = className

                    });


                }
                //return Json(casedeatils, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

            }
            return Json(casedeatils, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// this method is for Exporting the list to pdf for Patent Search Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFNewPatentSearch()
        {
            int pagesize1 = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
            pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            var IPList = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]);
            var tradeId = QueryAES.UrlDecode(HttpContext.Request.QueryString["tradeid"]);
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            var vsort = QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]);
            var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            var classification = QueryAES.UrlDecode(HttpContext.Request.QueryString["classification"]);
            var patentno = QueryAES.UrlDecode(HttpContext.Request.QueryString["patentnumber"]);
            var applicantName = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicantname"]);
            var categoryno = QueryAES.UrlDecode(HttpContext.Request.QueryString["categoryno"]);
            var rocno = QueryAES.UrlDecode(HttpContext.Request.QueryString["rocno"]);
            var Prioritydatefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["prioritydategfrom"]);
            var Prioritydateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["prioritydateto"]);

            tradeId = (tradeId == null || tradeId == "null") ? "" : tradeId;
            filtertradmark = (filtertradmark == null || filtertradmark == "null") ? "" : filtertradmark;
            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            searchclass = (searchclass == null || searchclass == "null") ? "" : searchclass;
            searchtype = (searchtype == null || searchtype == "null") ? "" : searchtype;
            searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            dateapplicationto = (dateapplicationto == null || dateapplicationto == "null") ? "" : dateapplicationto;
            dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom == "null") ? "" : dateapplicationfrom;
            searchuserdetetail = (searchuserdetetail == null || searchuserdetetail == "null") ? "" : searchuserdetetail;
            Proprietor = (Proprietor == null || Proprietor == "null") ? "" : Proprietor;
            JurisdictionList = (JurisdictionList == null || JurisdictionList == "null") ? "" : JurisdictionList;
            usedsincefrom1 = (usedsincefrom1 == null || usedsincefrom1 == "null") ? "" : usedsincefrom1;
            usedsinceto1 = (usedsinceto1 == null || usedsinceto1 == "null") ? "" : usedsinceto1;
            vsort = (vsort == null || vsort == "null") ? "0" : vsort;
            colname = (colname == null || colname == "null") ? "" : colname;
            classification = (classification == null || classification == "null") ? "" : classification;
            patentno = (patentno == null || patentno == "null") ? "" : patentno;
            applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
            categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
            rocno = (rocno == null || rocno == "null") ? "" : rocno;

            Prioritydatefrom = (Prioritydatefrom == null || Prioritydatefrom == "null") ? "" : Prioritydatefrom;
            Prioritydateto = (Prioritydateto == null || Prioritydateto == "null") ? "" : Prioritydateto;

            if (vsort == null)
            {
                vsort = "0";
            }

            if (colname == null || colname == "undefined")
            {
                colname = "";
            }

            var db = new LawPracticeEntities();
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "Mykase_Patent_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRPatentReport_" + DateTime.Now;
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    jurisdiction = JurisdictionList,
                    ip = IPList,
                    vclass = searchclass,
                    proprietor = Proprietor,
                    Datefilingfrom = dateapplicationfrom,
                    Datefilingto = dateapplicationto,
                    Status = searchstatus,
                    userdetails = searchuserdetetail,
                    usedsincefrom = usedsincefrom1,
                    usedsinceto = usedsinceto1,
                    agent = "",
                    ApplNo = applicationno,
                    vtype = searchtype,
                    searchtext = filtertradmark,
                    pageindex = pagenum,
                    pagesize = pagesize1,
                    vsort = vsort,
                    colname = colname,
                    DateofPriorityfrom = dateapplicationfrom,
                    DateofPriorityto = dateapplicationto,
                    Classification = classification,
                    patentno = patentno,
                    ApplicantName = applicantName,
                    categoryid = categoryno,
                    rocno = rocno,
                    Prioritydatefrom = Prioritydatefrom,
                    Prioritydateto = Prioritydateto

                };


                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                //string content = JsonConvert.SerializeObject(rawfile);

                //StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                //addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var response1 = await addfClient.PostAsync(new Uri(apiUrl).ToString(), queryString);

                //var res= await response1.Content.ReadAsStringAsync();

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Applicant No.");
                casedeatils.Columns.Add("Title");
                casedeatils.Columns.Add("Status Name");
                casedeatils.Columns.Add("Date Of Filing");
                casedeatils.Columns.Add("Name Of Applicant");
                casedeatils.Columns.Add("Patent No.");
                //casedeatils.Columns.Add("Date of Filing");
                //casedeatils.Columns.Add("Priority Date");
                //casedeatils.Columns.Add("Complete Specification");
                //casedeatils.Columns.Add("Entry Date");

                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vInventionTitle"], data.data[i]["vstatus"],
                        data.data[i]["dDateOffiling"], data.data[i]["vApplicantName"], data.data[i]["vPatentNo"]);
                }

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                //strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";

                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";

                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application Number </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Filing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name Of Applicant</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent No.</th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of Application </th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>User Details</th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
                strtemplate += "</tr></thead><tbody>";


                for (int i = 0; casedeatils.Rows.Count > i; i++)
                {

                    var AppNo = casedeatils.Rows[i].ItemArray[1];
                    var title = casedeatils.Rows[i].ItemArray[2];
                    var status = casedeatils.Rows[i].ItemArray[3];
                    var dateoffiling = casedeatils.Rows[i].ItemArray[4];
                    if (dateoffiling != "")
                    {
                        dateoffiling = Convert.ToDateTime(dateoffiling).ToShortDateString();
                    }
                    else
                    {
                        dateoffiling = "";
                    }
                    var nameofapp = casedeatils.Rows[i].ItemArray[5];
                    var patentNo = casedeatils.Rows[i].ItemArray[6];

                    //strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";

                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppNo + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + title + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + status + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + dateoffiling + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + nameofapp + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + patentNo + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + AppDate + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + UsedSince + " </td>";
                    var closesate = "";

                    strtemplate += "</tr>";
                }


                strtemplate += "</tbody></table>";

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }


                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                //htmlToPdf.Zoom = 0.55f;
                //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

                //Added by umesh on 6 may 22 
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);

                //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Searched Trademark Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                    null, null);

            }
            catch (Exception ex)
            {
                //return ex.Message;
            }

        }

        /// <summary>
        ///  This method is for exporting the list to pdf for Design Search Page 
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFNewDesignSearch()
        {

            var pagesize = 10;
            var pagenum = 1;
            var filtertrademark = HttpContext.Request.QueryString["filtertradmark"];
            var designno = HttpContext.Request.QueryString["designnum"];
            var iplist = "5";
            var appDetails = HttpContext.Request.QueryString["txtappdetails"];

            var status = HttpContext.Request.QueryString["status"];
            var dateofregisterfrom = HttpContext.Request.QueryString["txtdateregisterfrom"];
            var dateofregisterto = HttpContext.Request.QueryString["dateregisterto"];
            var title = HttpContext.Request.QueryString["txttitle"];
            var pcountry = HttpContext.Request.QueryString["txtpriorityCountry"];
            var vClass = HttpContext.Request.QueryString["class"];
            pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);

            designno = (designno == null || designno == "null") ? "" : designno;
            iplist = (iplist == null || iplist == "null") ? "5" : iplist;
            appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
            status = (status == null || status == "null") ? "" : status;
            dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null" || dateofregisterto == "undefined") ? "" : dateofregisterfrom;
            dateofregisterto = (dateofregisterto == null || dateofregisterto == "null" || dateofregisterto == "undefined") ? "" : dateofregisterto;
            title = (title == null || title == "null" || title == "undefined") ? "" : title;
            pcountry = (pcountry == null || pcountry == "null" || pcountry == "undefined") ? "" : pcountry;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            var db = new LawPracticeEntities();
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "Mykase_Design_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    ip = iplist,
                    designno = designno,
                    vclass = vClass,
                    appdetails = appDetails,
                    Status = status,
                    dateofRegisterFrom = dateofregisterfrom,
                    dateofRegisterTo = dateofregisterto,
                    title = title,
                    pcountry = pcountry,
                    pageindex = pagenum,
                    pagesize = pagesize,
                    vsort = 0,
                    colname = "",

                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                //casedeatils.Columns.Add("S.NO.");
                //casedeatils.Columns.Add("Design Number");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Address");
                //casedeatils.Columns.Add("ApplicantDetails");
                //casedeatils.Columns.Add("Date Of Registration");
                //casedeatils.Columns.Add("Title");
                //casedeatils.Columns.Add("Priority");
                //casedeatils.Columns.Add("Patent Office Journal No");

                //for (int i = 0; i < data1.Count; i++)
                //{
                //    dynamic data = JObject.Parse(resid);
                //    //string status = data.Status;
                //    casedeatils.Rows.Add(
                //        data.data[i]["RowId"], data.data[i]["vDesignNo"], data.data[i]["vClass"], data.data[i]["vAddress"], data.data[i]["vApplDetails"],
                //        data.data[i]["dDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"], data.data[i]["vPatentOffJournalNo"]);
                //}

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";

                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";

                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>S.NO.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Design Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Details</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Registration</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent Office Journal No</th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Country</th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority No</th>";
                //strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Date</th>";
                strtemplate += "</tr></thead><tbody>";


                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);

                    var rowNo = data.data[i]["RowId"];
                    var DesignNo = data.data[i]["vDesignNo"];
                    var DesignClass = data.data[i]["vClass"];
                    var Address = data.data[i]["vAddress"];
                    var ApplicantDetails = data.data[i]["vApplDetails"];
                    var DateOfRegistration = data.data[i]["dDateOfRegistration"];
                    var Title = data.data[i]["vTitle"];
                    var PriorityNo = data.data[i]["vPriorityNo"];
                    var PatentOffJournalNo = data.data[i]["vPatentOffJournalNo"];

                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + rowNo + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + DesignNo + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + DesignClass + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + Address + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ApplicantDetails + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + DateOfRegistration + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + Title + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + PriorityNo + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + PatentOffJournalNo + " </td>";
                    var closesate = "";

                    strtemplate += "</tr>";
                }


                strtemplate += "</tbody></table>";

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }


                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                //htmlToPdf.Zoom = 0.55f;
                //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

                //Added by umesh on 6 may 22 
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);

                //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Searched Trademark Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                    null, null);

            }
            catch (Exception ex)
            {
                //return ex.Message;
            }

        }

        /// <summary>
        /// Get IPR status list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetIPRStatusList()
        {
            List<IPRList> casedeatils = new List<IPRList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef"

                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/StatusList"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string id = data.data[i].iid;
                    string Name = data.data[i].Name;


                    // Add parts to the list.
                    casedeatils.Add(new IPRList
                    {
                        id = id,
                        name = Name,


                    });


                }
                //return Json(casedeatils, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

            }
            return Json(casedeatils, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// This method is for exporting the list to excel for GI Search Page
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelNewGISearch()
        {
            int pagesize1 = 10, pageindex = 1;
            //pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
            //pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
            //var IPList = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]);
            //var tradeId = QueryAES.UrlDecode(HttpContext.Request.QueryString["tradeid"]);
            //var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            //var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            //var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            //var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            //var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            //var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            //var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            //var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            //var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            //var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            //var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            //var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            //var vsort = QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]);
            //var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            //var classification = QueryAES.UrlDecode(HttpContext.Request.QueryString["classification"]);
            //var patentno = QueryAES.UrlDecode(HttpContext.Request.QueryString["patentnumber"]);
            //var applicantName = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicantname"]);
            //var categoryno = QueryAES.UrlDecode(HttpContext.Request.QueryString["categoryno"]);
            //var rocno = QueryAES.UrlDecode(HttpContext.Request.QueryString["rocno"]);
            //var journalno = QueryAES.UrlDecode(HttpContext.Request.QueryString["journalno"]);
            //var registereddate = QueryAES.UrlDecode(HttpContext.Request.QueryString["registdate"]);
            //var vclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["class"]);
            //var dateoffilingfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["doffrom"]);
            //var dateoffilingto = QueryAES.UrlDecode(HttpContext.Request.QueryString["dofto"]);

            //tradeId = (tradeId == null || tradeId == "null") ? "" : tradeId;
            //filtertradmark = (filtertradmark == null || filtertradmark == "null") ? "" : filtertradmark;
            //applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            //searchclass = (searchclass == null || searchclass == "null") ? "" : searchclass;
            //searchtype = (searchtype == null || searchtype == "null") ? "" : searchtype;
            //searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            //dateapplicationto = (dateapplicationto == null || dateapplicationto == "null") ? "" : dateapplicationto;
            //dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom == "null") ? "" : dateapplicationfrom;
            //searchuserdetetail = (searchuserdetetail == null || searchuserdetetail == "null") ? "" : searchuserdetetail;
            //Proprietor = (Proprietor == null || Proprietor == "null") ? "" : Proprietor;
            //JurisdictionList = (JurisdictionList == null || JurisdictionList == "null") ? "" : JurisdictionList;
            //usedsincefrom1 = (usedsincefrom1 == null || usedsincefrom1 == "null") ? "" : usedsincefrom1;
            //usedsinceto1 = (usedsinceto1 == null || usedsinceto1 == "null") ? "" : usedsinceto1;
            //vsort = (vsort == null || vsort == "null") ? "0" : vsort;
            //colname = (colname == null || colname == "null") ? "" : colname;
            //classification = (classification == null || classification == "null") ? "" : classification;
            //patentno = (patentno == null || patentno == "null") ? "" : patentno;
            //applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
            //categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
            //rocno = (rocno == null || rocno == "null") ? "" : rocno;
            //journalno = (journalno == null || journalno == "null") ? "" : journalno;
            //registereddate = (registereddate == null || registereddate == "null") ? "" : registereddate;
            //vclass = (vclass == null || vclass == "null") ? "" : vclass;
            //dateoffilingfrom = (dateoffilingfrom == null || dateoffilingfrom == "null") ? "" : dateoffilingfrom;
            //dateoffilingto = (dateoffilingto == null || dateoffilingto == "null") ? "" : dateoffilingto;



            var pagesize = 10;
            var pagenum = 1;
            var filtertrademark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]); //HttpContext.Current.Request.Form["filtertradmark"];
            var iplist = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]); //HttpContext.Current.Request.Form["IPList"];
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applino"]); //HttpContext.Current.Request.Form["applicationno"];
            var status = QueryAES.UrlDecode(HttpContext.Request.QueryString["status"]); //HttpContext.Current.Request.Form["status"];
            var vclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["vclass"]); //HttpContext.Current.Request.Form["vclass"];
            var journalno = QueryAES.UrlDecode(HttpContext.Request.QueryString["journalno"]);// HttpContext.Current.Request.Form["journalno"];
            var datefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["filingdatefrom"]); //HttpContext.Current.Request.Form["doffrom"];
            var dateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["filingdateto"]); //HttpContext.Current.Request.Form["dofto"];
            var validupto = QueryAES.UrlDecode(HttpContext.Request.QueryString["registeredDate"]); //HttpContext.Current.Request.Form["registdate"];
            var vsort = 0;
            var vcolname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);// HttpContext.Current.Request.Form["colname"];

            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"])); //Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);

            iplist = (iplist == null || iplist == "null") ? "4" : iplist;
            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            status = (status == null || status == "null") ? "" : status;
            vclass = (vclass == null || vclass == "null") ? "" : vclass;
            journalno = (journalno == null || journalno == "null") ? "" : journalno;
            datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
            dateto = (dateto == null || dateto == "null") ? "" : dateto;
            validupto = (validupto == null || validupto == "null") ? "" : validupto;
            vcolname = (vcolname == null || vcolname == "null") ? "" : vcolname;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            //if (vsort == null)
            //{
            //    vsort = "0";
            //}

            if (vcolname == null || vcolname == "undefined")
            {
                vcolname = "";
            }
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_GI_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();

                //object rawfile = new
                //{
                //    userid = strusername,
                //    Accesstoken = "mykase123456789abcdef",
                //    jurisdiction = JurisdictionList,
                //    ip = IPList,
                //    vclass = searchclass,
                //    proprietor = Proprietor,
                //    ApplicationDatefrom = dateapplicationfrom,
                //    ApplicationDateto = dateapplicationto,
                //    Status = searchstatus,
                //    userdetails = searchuserdetetail,
                //    usedsincefrom = usedsincefrom1,
                //    usedsinceto = usedsinceto1,
                //    agent = "",
                //    ApplNo = applicationno,
                //    vtype = searchtype,
                //    searchtext = filtertradmark,
                //    pageindex = pageindex,
                //    pagesize = pagesize1,
                //    vsort = vsort,
                //    colname = colname,
                //    DateofPriorityfrom = dateapplicationfrom,
                //    DateofPriorityto = dateapplicationto,
                //    Classification = classification,
                //    patentno = patentno,
                //    ApplicantName = applicantName,
                //    categoryid = categoryno,
                //    rocno = rocno,
                //    JournalNo = journalno,
                //    registeredDate = registereddate,
                //    dDateoffilingfrom = dateoffilingfrom,
                //    dDateoffilingto = dateoffilingto,
                //};

                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    ip = iplist,
                    ApplicationNo1 = applicationno,
                    Status1 = status,
                    vClass1 = vclass,
                    JournalNo1 = journalno,
                    DateFrom = datefrom,
                    DateTo = dateto,
                    ValidUpto = validupto,
                    vsort = vsort,
                    colname = vcolname,
                    pageindex = pagenum,
                    pagesize = pagesize
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                casedeatils.Columns.Add("Sr. No.");
                casedeatils.Columns.Add("Name Of GI");
                casedeatils.Columns.Add("Applicant");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Date Of Filing");
                casedeatils.Columns.Add("Application No");
                //casedeatils.Columns.Add("Registered Proprietor");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Goods");
                //casedeatils.Columns.Add("Journal No");
                //casedeatils.Columns.Add("Application No");

                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Rows.Add(
                         data.data[i]["RowId"], data.data[i]["vGeoIndication"], data.data[i]["vApplicantName"], data.data[i]["vStatus"],
                        data.data[i]["vClass"], data.data[i]["dDateoffiling"], data.data[i]["vApplicationNo"]);
                }
                //    casedeatils.Rows.Add(
                //         data.data[i]["RowId"], data.data[i]["vGIName"], data.data[i]["vApplicantName"], data.data[i]["vStatus"],
                //        data.data[i]["dDateoffiling"], data.data[i]["vRegisteredProp"], data.data[i]["vClass"], 
                //        data.data[i]["vGoods"], data.data[i]["vJournalNo"], data.data[i]["vApplicationNo"]);
                //}

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();

            }

            catch (Exception ex) { }

        }

        /// <summary>
        /// This method is used for exporting the list to the pdf for GI Search Page
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExporttoPdfNewGISearch()
        {
            //int pagesize1 = 10, pageindex = 1;
            //pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
            //pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
            //var IPList = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]);
            //var tradeId = QueryAES.UrlDecode(HttpContext.Request.QueryString["tradeid"]);
            //var filtertradmark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            //var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicationno"]);
            //var searchclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchclass"]);
            //var searchtype = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchtype"]);
            //var searchstatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchstatus"]);
            //var dateapplicationto = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationto"]);
            //var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["txtdateapplicationfrom"]);
            //var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchuserdetetail"]);
            //var Proprietor = QueryAES.UrlDecode(HttpContext.Request.QueryString["Proprietor"]);
            //var JurisdictionList = QueryAES.UrlDecode(HttpContext.Request.QueryString["JurisdictionList"]);
            //var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsincefrom"]);
            //var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Request.QueryString["usedsinceto"]);
            //var vsort = QueryAES.UrlDecode(HttpContext.Request.QueryString["vsort"]);
            //var colname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);
            //var classification = QueryAES.UrlDecode(HttpContext.Request.QueryString["classification"]);
            //var patentno = QueryAES.UrlDecode(HttpContext.Request.QueryString["patentnumber"]);
            //var applicantName = QueryAES.UrlDecode(HttpContext.Request.QueryString["applicantname"]);
            //var categoryno = QueryAES.UrlDecode(HttpContext.Request.QueryString["categoryno"]);
            //var rocno = QueryAES.UrlDecode(HttpContext.Request.QueryString["rocno"]);
            //var journalno = QueryAES.UrlDecode(HttpContext.Request.QueryString["journalno"]);
            //var registereddate = QueryAES.UrlDecode(HttpContext.Request.QueryString["registdate"]);
            //var vclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["class"]);
            //var dateoffilingfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["doffrom"]);
            //var dateoffilingto = QueryAES.UrlDecode(HttpContext.Request.QueryString["dofto"]);

            //tradeId = (tradeId == null || tradeId == "null") ? "" : tradeId;
            //filtertradmark = (filtertradmark == null || filtertradmark == "null") ? "" : filtertradmark;
            //applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            //searchclass = (searchclass == null || searchclass == "null") ? "" : searchclass;
            //searchtype = (searchtype == null || searchtype == "null") ? "" : searchtype;
            //searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            //dateapplicationto = (dateapplicationto == null || dateapplicationto == "null") ? "" : dateapplicationto;
            //dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom == "null") ? "" : dateapplicationfrom;
            //searchuserdetetail = (searchuserdetetail == null || searchuserdetetail == "null") ? "" : searchuserdetetail;
            //Proprietor = (Proprietor == null || Proprietor == "null") ? "" : Proprietor;
            //JurisdictionList = (JurisdictionList == null || JurisdictionList == "null") ? "" : JurisdictionList;
            //usedsincefrom1 = (usedsincefrom1 == null || usedsincefrom1 == "null") ? "" : usedsincefrom1;
            //usedsinceto1 = (usedsinceto1 == null || usedsinceto1 == "null") ? "" : usedsinceto1;
            //vsort = (vsort == null || vsort == "null") ? "0" : vsort;
            //colname = (colname == null || colname == "null") ? "" : colname;
            //classification = (classification == null || classification == "null") ? "" : classification;
            //patentno = (patentno == null || patentno == "null") ? "" : patentno;
            //applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
            //categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
            //rocno = (rocno == null || rocno == "null") ? "" : rocno;
            //journalno = (journalno == null || journalno == "null") ? "" : journalno;
            //registereddate = (registereddate == null || registereddate == "null") ? "" : registereddate;
            //vclass = (vclass == null || vclass == "null") ? "" : vclass;
            //dateoffilingfrom = (dateoffilingfrom == null || dateoffilingfrom == "null") ? "" : dateoffilingfrom;
            //dateoffilingto = (dateoffilingto == null || dateoffilingto == "null") ? "" : dateoffilingto;


            //if (vsort == null)
            //{
            //    vsort = "0";
            //}

            //if (colname == null || colname == "undefined")
            //{
            //    colname = "";
            //}

            var pagesize = 10;
            var pagenum = 1;
            var filtertrademark = QueryAES.UrlDecode(HttpContext.Request.QueryString["filtertradmark"]);
            var iplist = QueryAES.UrlDecode(HttpContext.Request.QueryString["IPList"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["applino"]);
            var status = QueryAES.UrlDecode(HttpContext.Request.QueryString["status"]);
            var vclass = QueryAES.UrlDecode(HttpContext.Request.QueryString["vclass"]);
            var journalno = QueryAES.UrlDecode(HttpContext.Request.QueryString["journalno"]);
            var datefrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["filingdatefrom"]);
            var dateto = QueryAES.UrlDecode(HttpContext.Request.QueryString["filingdateto"]);
            var validupto = QueryAES.UrlDecode(HttpContext.Request.QueryString["registeredDate"]);
            var vsort = 0;
            var vcolname = QueryAES.UrlDecode(HttpContext.Request.QueryString["colname"]);

            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));

            iplist = (iplist == null || iplist == "null") ? "4" : iplist;
            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            status = (status == null || status == "null") ? "" : status;
            vclass = (vclass == null || vclass == "null") ? "" : vclass;
            journalno = (journalno == null || journalno == "null") ? "" : journalno;
            datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
            dateto = (dateto == null || dateto == "null") ? "" : dateto;
            validupto = (validupto == null || validupto == "null") ? "" : validupto;
            vcolname = (vcolname == null || vcolname == "null") ? "" : vcolname;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            var db = new LawPracticeEntities();
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "Mykase_GI_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            try
            {

                //List<IPRList> casedeatils = new List<IPRList>();
                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_GI_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new WebClient();

                //object rawfile = new
                //{
                //    userid = strusername,
                //    Accesstoken = "mykase123456789abcdef",
                //    jurisdiction = JurisdictionList,
                //    ip = IPList,
                //    vclass = searchclass,
                //    proprietor = Proprietor,
                //    ApplicationDatefrom = dateapplicationfrom,
                //    ApplicationDateto = dateapplicationto,
                //    Status = searchstatus,
                //    userdetails = searchuserdetetail,
                //    usedsincefrom = usedsincefrom1,
                //    usedsinceto = usedsinceto1,
                //    agent = "",
                //    ApplNo = applicationno,
                //    vtype = searchtype,
                //    searchtext = filtertradmark,
                //    pageindex = pageindex,
                //    pagesize = pagesize1,
                //    vsort = vsort,
                //    colname = colname,
                //    DateofPriorityfrom = dateapplicationfrom,
                //    DateofPriorityto = dateapplicationto,
                //    Classification = classification,
                //    patentno = patentno,
                //    ApplicantName = applicantName,
                //    categoryid = categoryno,
                //    rocno = rocno,
                //    JournalNo = journalno,
                //    registeredDate = registereddate,
                //    dDateoffilingfrom = dateoffilingfrom,
                //    dDateoffilingto = dateoffilingto,
                //};

                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmid,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = filtertrademark,
                    ip = iplist,
                    ApplicationNo1 = applicationno,
                    Status1 = status,
                    vClass1 = vclass,
                    JournalNo1 = journalno,
                    DateFrom = datefrom,
                    DateTo = dateto,
                    ValidUpto = validupto,
                    vsort = vsort,
                    colname = vcolname,
                    pageindex = pagenum,
                    pagesize = pagesize
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/SearchIPR"), "POST", builders);

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                int pageid = 0;

                //casedeatils.Columns.Add("RowId");
                //casedeatils.Columns.Add("Applicant Name");
                //casedeatils.Columns.Add("Applictation No.");
                //casedeatils.Columns.Add("Status");
                //casedeatils.Columns.Add("Journal No");
                //casedeatils.Columns.Add("Registered Date");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Date Of Filing");
                //casedeatils.Columns.Add("Registered Prop");
                //casedeatils.Columns.Add("Goods");
                //casedeatils.Columns.Add("GIName");
                //casedeatils.Columns.Add("Geo Indication");

                //casedeatils.Columns.Add("Sr. No.");
                //casedeatils.Columns.Add("Name Of GI");
                //casedeatils.Columns.Add("Applicant");
                //casedeatils.Columns.Add("Status");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Date Of Filing");
                //casedeatils.Columns.Add("Application No");

                //for (int i = 0; i < data1.Count; i++)
                //{
                // dynamic data = JObject.Parse(resid);
                //casedeatils.Rows.Add(
                //data.data[i]["RowId"], data.data[i]["vApplicantName"], data.data[i]["vApplicationNo"], data.data[i]["vStatus"], data.data[i]["vJournalNo"],
                //data.data[i]["dRegisteredDate"], data.data[i]["vClass"], data.data[i]["dDateoffiling"], data.data[i]["vRegisteredProp"], 
                //data.data[i]["vGoods"], data.data[i]["vGIName"], data.data[i]["vGeoIndication"]);
                //}

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                //strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";

                //strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";

                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Sr. No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name Of GI</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Filing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application No.</th>";
                strtemplate += "</thead></tr>";

                //dynamic giDetails = JObject.Parse(resid);
                dynamic giDetails = jObject["data"];
                for (int i = 0; giDetails.Count > i; i++)
                {
                    dynamic getGIDetails = JObject.Parse(resid);
                    var RowId = getGIDetails.data[i]["RowId"].Value;
                    var GIName = getGIDetails.data[i]["vGeoIndication"].Value;
                    var ApplicationName = getGIDetails.data[i]["vApplicantName"].Value;
                    var Status = getGIDetails.data[i]["vStatus"].Value;
                    var ClassName = getGIDetails.data[i]["vClass"].Value;
                    var FillingDate = getGIDetails.data[i]["dDateoffiling"].Value;
                    var ApplicationNo = getGIDetails.data[i]["vApplicationNo"].Value;

                    strtemplate += "<tr>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + RowId + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + GIName + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ApplicationName + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + Status + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ClassName + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + FillingDate + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ApplicationNo + " </td>";
                    strtemplate += "</tr>";

                    //var applicant = casedeatils.Rows[i].ItemArray[1];
                    //var applino = casedeatils.Rows[i].ItemArray[2];
                    //var vJournalNo = casedeatils.Rows[i].ItemArray[4];
                    //var dRegisteredDate = casedeatils.Rows[i].ItemArray[5];
                    //var vClass = casedeatils.Rows[i].ItemArray[6];
                    //var dDateoffiling = casedeatils.Rows[i].ItemArray[7];
                    //var vRegisteredProp = casedeatils.Rows[i].ItemArray[8];
                    //var vGoods = casedeatils.Rows[i].ItemArray[9];
                    //var vGIName = casedeatils.Rows[i].ItemArray[10];
                    //var vGeoIndication = casedeatils.Rows[i].ItemArray[11];

                    //strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";

                    //strtemplate += "<tr>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + applicant + "</td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + applino + "  </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + status + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vJournalNo + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + dRegisteredDate + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vClass + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + dDateoffiling + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vRegisteredProp + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vGoods + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vGIName + " </td>";
                    //strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + vGeoIndication + " </td>";
                    //strtemplate += "</tr>";
                }


                strtemplate += "</tbody></table>";

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }


                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();


                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                //htmlToPdf.Zoom = 0.55f;
                //htmlToPdf.Size = NReco.PdfGenerator.PageSize.A3;

                //Added by umesh on 6 may 22 
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);

                //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Searched GI Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search GI PDF",
                    null, null);
            }

            catch (Exception ex) { }

        }

        public string ReplaceString(string input)
        {
            string result = "";
            if (input != null)
            {
                input = Regex.Replace(input, "(=|\\*|\\/|\\+|\\-|\\@)", "");
                result = input;
            }

            return input;
        }

        public string convertDate(string datevalue)
        {
            string convertDateValue = "";
            if (datevalue.Contains("Used Since"))
            {
                var replaceValue = Regex.Replace(datevalue, @"Used\s*Since\s*\:*", "", RegexOptions.IgnoreCase);
                convertDateValue = Convert.ToDateTime(replaceValue).ToString("dd MMMM yyyy");
            }

            else if (Regex.IsMatch(datevalue, @"[0-3][0-9]\-[0-1][0-9]\-[1-2][0-9]{3}", RegexOptions.IgnoreCase))
            {
                var replaceValue = datevalue;
                convertDateValue = Convert.ToDateTime(replaceValue).ToString("dd MMMM yyyy");
            }

            else if (Regex.IsMatch(datevalue, @"[0-3][0-9]\/[0-1][0-9]\/[1-2][0-9]{3}", RegexOptions.IgnoreCase))
            {
                var replaceValue = datevalue;
                convertDateValue = Convert.ToDateTime(replaceValue).ToString("dd MMMM yyyy");
            }

            if (convertDateValue == "")
            {
                return datevalue;
            }

            return convertDateValue;
        }

        /// <summary>
        /// This method is used for seperating the username from the e-mail id of the receiver.
        /// </summary>
        /// <param name="inputVal"></param>
        /// <returns></returns>
        public string FindUserNameFromEmail(string inputVal)
        {
            if (Regex.IsMatch(inputVal, "[a-z]+.*?@[a-z]+\\.com", RegexOptions.IgnoreCase))
            {
                string[] splitVal = inputVal.Split('@');
                inputVal = splitVal[0].Trim();
            }
            return inputVal;
        }

        //Adding By Prem kumar Propritor Details

        [AuthLog(Roles = "Firm,User,Client")]
        public string PropriterDetailsByNameAndAddressExcel()
        {
            try
            {
                // int pagesize = 10, pageNumber = 1;
                var IprTypeId = System.Web.HttpContext.Current.Request.Form["IpType"];
                //var vProprietorSearch = RemoveSpecialCharacter(QueryAES.UrlDecode(HttpContext.Request.QueryString["vProprietorSearch"]));
                //var vProprietorAddressSearch = RemoveSpecialCharacter(QueryAES.UrlDecode(HttpContext.Request.QueryString["vProprietorAddressSearch"]));
                var vProprietorSearch = System.Web.HttpContext.Current.Request.Form["vProprietorSearch"];
                var vProprietorAddressSearch = System.Web.HttpContext.Current.Request.Form["vProprietorAddressSearch"];

                if (string.IsNullOrEmpty(vProprietorAddressSearch) || string.IsNullOrEmpty(vProprietorSearch))
                {
                    return "";
                }

                if (vProprietorAddressSearch == "undefined")
                {
                    vProprietorAddressSearch = "";
                }

                if (vProprietorSearch == "undefined")
                {
                    vProprietorSearch = "";
                }

                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://localhost:44389";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    IprTypeId = IprTypeId,
                    vProprietorSearch = vProprietorSearch,
                    vProprietorAddressSearch = vProprietorAddressSearch
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddressExcelDownload"), "POST", builders);
                JObject jObject = JObject.Parse(res);

                if (IprTypeId == "1")
                {
                    using (ExcelPackage package = new ExcelPackage())
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("PropriterDetails");
                        worksheet.Cells[1, 1].Value = "Word Mark";
                        worksheet.Cells[1, 1 + 1].Value = "Proprietor";
                        worksheet.Cells[1, 1 + 2].Value = "Appl. No.";
                        worksheet.Cells[1, 1 + 3].Value = "Class";
                        worksheet.Cells[1, 1 + 4].Value = "Appl. Date";
                        worksheet.Cells[1, 1 + 5].Value = "Journal No.";
                        worksheet.Cells[1, 1 + 6].Value = "Journal Date";
                        worksheet.Cells[1, 1 + 7].Value = "Status";
                        worksheet.Cells[1, 1 + 8].Value = "Used Since";
                        worksheet.Cells[1, 1 + 9].Value = "Valid Upto";
                        worksheet.Cells[1, 1 + 10].Value = "dGSDescription";
                        worksheet.Cells[1, 1 + 11].Value = "Agent";
                        worksheet.Cells[1, 1 + 12].Value = "Agent Address";
                        worksheet.Cells[1, 1 + 13].Value = "Publication Details";
                        worksheet.Cells[1, 1 + 14].Value = "Proprietor Address";

                        int row = 2;
                        foreach (var item in jObject["data"])
                        {
                            worksheet.Cells["A" + row.ToString()].Value = item["vWordMark"].ToString();
                            worksheet.Cells["B" + row.ToString()].Value = item["vProprietor"].ToString();
                            worksheet.Cells["C" + row.ToString()].Value = item["vApplNo"].ToString();
                            worksheet.Cells["D" + row.ToString()].Value = item["vClass"].ToString();
                            worksheet.Cells["E" + row.ToString()].Value = item["dApplDate"].ToString();
                            worksheet.Cells["F" + row.ToString()].Value = item["vJournalNo"].ToString();
                            worksheet.Cells["G" + row.ToString()].Value = item["dJournalDate"].ToString();
                            worksheet.Cells["H" + row.ToString()].Value = item["vStatus"].ToString();
                            worksheet.Cells["I" + row.ToString()].Value = item["vUsedSince"].ToString();
                            worksheet.Cells["J" + row.ToString()].Value = item["dValidUpto"].ToString();
                            worksheet.Cells["K" + row.ToString()].Value = item["dGSDescription"].ToString();
                            worksheet.Cells["L" + row.ToString()].Value = item["Agent"].ToString();
                            worksheet.Cells["M" + row.ToString()].Value = item["AgentAddress"].ToString();
                            worksheet.Cells["N" + row.ToString()].Value = item["PublicationDetails"].ToString();
                            worksheet.Cells["O" + row.ToString()].Value = item["vProprietorAddress"].ToString();

                            row++;
                        }

                        MemoryStream memoryStream = new MemoryStream();
                        package.SaveAs(memoryStream);

                        Response.Clear();
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment; filename=Trademark_Proprietor_Report_by_mykase.xlsx");
                        Response.BinaryWrite(memoryStream.ToArray());
                        Response.End();
                        return "";
                    }
                }

                if (IprTypeId == "2")
                {
                    using (ExcelPackage package = new ExcelPackage())
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("ApplicantDetails_For_Copyright");
                        worksheet.Cells[1, 1].Value = "Diary Number";
                        worksheet.Cells[1, 1 + 1].Value = "ROC Number";
                        worksheet.Cells[1, 1 + 2].Value = "Title Of Work";
                        worksheet.Cells[1, 1 + 3].Value = "Status";
                        worksheet.Cells[1, 1 + 4].Value = "Category";
                        worksheet.Cells[1, 1 + 5].Value = "Application Date";

                        int row = 2;
                        foreach (var item in jObject["data"])
                        {
                            worksheet.Cells["A" + row.ToString()].Value = item["vDiaryNo"].ToString();
                            worksheet.Cells["B" + row.ToString()].Value = item["vROCNumber"].ToString();
                            worksheet.Cells["C" + row.ToString()].Value = item["vTitleofWork"].ToString();
                            worksheet.Cells["D" + row.ToString()].Value = item["vStatus"].ToString();
                            worksheet.Cells["E" + row.ToString()].Value = item["vCategory"].ToString();
                            worksheet.Cells["F" + row.ToString()].Value = item["dApplDate"].ToString();

                            row++;
                        }

                        MemoryStream memoryStream = new MemoryStream();
                        package.SaveAs(memoryStream);

                        Response.Clear();
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment; filename=Copyright_Applicant_Report_by_mykase.xlsx");
                        Response.BinaryWrite(memoryStream.ToArray());
                        Response.End();
                        return "";
                    }
                }

                if (IprTypeId == "3")
                {
                    using (ExcelPackage package = new ExcelPackage())
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("ApplicantDetails_For_Patent");
                        //worksheet.Cells[1, 1].Value = "Application Number";
                        //worksheet.Cells[1, 1 + 1].Value = "Publication Number";
                        //worksheet.Cells[1, 1 + 2].Value = "Publication Date";
                        //worksheet.Cells[1, 1 + 3].Value = "Date Of Filing";
                        //worksheet.Cells[1, 1 + 4].Value = "Title Of Invention";
                        //worksheet.Cells[1, 1 + 5].Value = "Classification";
                        //worksheet.Cells[1, 1 + 6].Value = "Priority Document Number";
                        //worksheet.Cells[1, 1 + 7].Value = "Priority Date";
                        //worksheet.Cells[1, 1 + 8].Value = "Priority Country Name";
                        //worksheet.Cells[1, 1 + 9].Value = "International Filing Date";
                        //worksheet.Cells[1, 1 + 10].Value = "International Application Number";
                        //worksheet.Cells[1, 1 + 11].Value = "Filing Date For Additional Application Number";
                        //worksheet.Cells[1, 1 + 12].Value = "Filing Date For Divisional Application Number ";
                        //worksheet.Cells[1, 1 + 13].Value = "Applicant Name";
                        //worksheet.Cells[1, 1 + 14].Value = "Applicant Address";
                        //worksheet.Cells[1, 1 + 15].Value = "Country Name Of Applicant";
                        //worksheet.Cells[1, 1 + 16].Value = "Name Of The Inventor";
                        //worksheet.Cells[1, 1 + 17].Value = "Country Of Inventory";
                        //worksheet.Cells[1, 1 + 18].Value = "Address Of Inventory";
                        //worksheet.Cells[1, 1 + 19].Value = "Abstract";
                        //worksheet.Cells[1, 1 + 20].Value = "No Of Pages";
                        //worksheet.Cells[1, 1 + 21].Value = "No Of Claims";
                        //worksheet.Cells[1, 1 + 22].Value = "Journal Of Patent's Office";
                        //worksheet.Cells[1, 1 + 23].Value = "Complete Specification";

                        worksheet.Cells[1, 1].Value = "Application Number";
                        worksheet.Cells[1, 1 + 1].Value = "Applicant Type";
                        worksheet.Cells[1, 1 + 2].Value = "Date Of Filing";
                        worksheet.Cells[1, 1 + 3].Value = "Applicant Name";
                        worksheet.Cells[1, 1 + 4].Value = "Title Of Invention";
                        worksheet.Cells[1, 1 + 5].Value = "Field Of Invention";
                        worksheet.Cells[1, 1 + 6].Value = "International Application Number";
                        worksheet.Cells[1, 1 + 7].Value = "Priority Date";
                        worksheet.Cells[1, 1 + 8].Value = "Priority Country Name";
                        worksheet.Cells[1, 1 + 9].Value = "International Filing Date";

                        int row = 2;
                        foreach (var item in jObject["data"])
                        {
                            worksheet.Cells["A" + row.ToString()].Value = item["vApplNo"].ToString();
                            worksheet.Cells["B" + row.ToString()].Value = item["vApplicationType"].ToString();
                            worksheet.Cells["C" + row.ToString()].Value = item["dDateOffiling"].ToString();
                            worksheet.Cells["D" + row.ToString()].Value = item["vApplicantName"].ToString();
                            worksheet.Cells["E" + row.ToString()].Value = item["vInventionTitle"].ToString();
                            worksheet.Cells["F" + row.ToString()].Value = item["vFieldofInvention"].ToString();
                            worksheet.Cells["G" + row.ToString()].Value = item["vInterApplNo"].ToString();
                            worksheet.Cells["H" + row.ToString()].Value = item["dPriorityDate"].ToString();
                            worksheet.Cells["I" + row.ToString()].Value = item["vPriorityCountryName"].ToString();
                            worksheet.Cells["J" + row.ToString()].Value = item["dAdditionAppNoFillingDate"].ToString();

                            //worksheet.Cells["A" + row.ToString()].Value = item["vApplNo"].ToString();
                            //worksheet.Cells["B" + row.ToString()].Value = item["vPublicationNo"].ToString();
                            //worksheet.Cells["C" + row.ToString()].Value = item["dPublicationDate"].ToString();
                            //worksheet.Cells["D" + row.ToString()].Value = item["dDateOffiling"].ToString();
                            //worksheet.Cells["E" + row.ToString()].Value = item["vInventionTitle"].ToString();
                            //worksheet.Cells["F" + row.ToString()].Value = item["vClassification"].ToString();
                            //worksheet.Cells["G" + row.ToString()].Value = item["vPriorityDocumentNo"].ToString();
                            //worksheet.Cells["H" + row.ToString()].Value = item["dPriorityDate"].ToString();
                            //worksheet.Cells["I" + row.ToString()].Value = item["vPriorityCountryName"].ToString();
                            //worksheet.Cells["J" + row.ToString()].Value = item["vInterApplNo"].ToString();
                            //worksheet.Cells["K" + row.ToString()].Value = item["dAdditionAppNoFillingDate"].ToString();
                            //worksheet.Cells["L" + row.ToString()].Value = item["dDivisionalAppNoFillingDate"].ToString();
                            //worksheet.Cells["M" + row.ToString()].Value = item["vApplicantName"].ToString();
                            //worksheet.Cells["N" + row.ToString()].Value = item["vApplicantAddress"].ToString();
                            //worksheet.Cells["O" + row.ToString()].Value = item["vApplicantCountryName"].ToString();
                            //worksheet.Cells["P" + row.ToString()].Value = item["vInventorName"].ToString();
                            //worksheet.Cells["Q" + row.ToString()].Value = item["vInventoryCountry"].ToString();
                            //worksheet.Cells["R" + row.ToString()].Value = item["vInventoryAddress"].ToString();
                            //worksheet.Cells["S" + row.ToString()].Value = item["vAbstract"].ToString();
                            //worksheet.Cells["T" + row.ToString()].Value = item["vNoofPages"].ToString();
                            //worksheet.Cells["U" + row.ToString()].Value = item["vNoofClaims"].ToString();
                            //worksheet.Cells["V" + row.ToString()].Value = item["PatentOffJournal"].ToString();
                            //worksheet.Cells["W" + row.ToString()].Value = item["vCompSpecification"].ToString();

                            row++;
                        }

                        MemoryStream memoryStream = new MemoryStream();
                        package.SaveAs(memoryStream);

                        Response.Clear();
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment; filename=PatentReport_by_mykase.xlsx");
                        Response.BinaryWrite(memoryStream.ToArray());
                        Response.End();
                        return "";
                    }
                }

                if (IprTypeId == "4")
                {
                    using (ExcelPackage package = new ExcelPackage())
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("ApplicantDetails_For_Geographical_Indication");
                        worksheet.Cells[1, 1].Value = "Geographical Indication ";
                        worksheet.Cells[1, 1 + 1].Value = "Status";
                        worksheet.Cells[1, 1 + 2].Value = "Class";
                        worksheet.Cells[1, 1 + 3].Value = "Date Of Filing";
                        worksheet.Cells[1, 1 + 4].Value = "Name Of Applicant";
                        worksheet.Cells[1, 1 + 5].Value = "Address Of Applicant";
                        worksheet.Cells[1, 1 + 6].Value = "Goods";
                        worksheet.Cells[1, 1 + 7].Value = "Geographical Area";
                        worksheet.Cells[1, 1 + 8].Value = "Country Of Priority";
                        worksheet.Cells[1, 1 + 9].Value = "Journal Number";
                        worksheet.Cells[1, 1 + 10].Value = "Available Date";
                        worksheet.Cells[1, 1 + 11].Value = "Certificate Number";
                        worksheet.Cells[1, 1 + 12].Value = "Date Of Certification";
                        worksheet.Cells[1, 1 + 13].Value = "Validity Of Registration Till";

                        int row = 2;
                        foreach (var item in jObject["data"])
                        {
                            worksheet.Cells["A" + row.ToString()].Value = item["vGeoIndication"].ToString();
                            worksheet.Cells["B" + row.ToString()].Value = item["vStatus"].ToString();
                            worksheet.Cells["C" + row.ToString()].Value = item["vClass"].ToString();
                            worksheet.Cells["D" + row.ToString()].Value = item["dDateofFiling"].ToString();
                            worksheet.Cells["E" + row.ToString()].Value = item["vApplicantName"].ToString();
                            worksheet.Cells["F" + row.ToString()].Value = item["vApplicantAddress"].ToString();
                            worksheet.Cells["G" + row.ToString()].Value = item["vGoods"].ToString();
                            worksheet.Cells["H" + row.ToString()].Value = item["vGeoArea"].ToString();
                            worksheet.Cells["I" + row.ToString()].Value = item["vPriorityCountry"].ToString();
                            worksheet.Cells["J" + row.ToString()].Value = item["vJournalNo"].ToString();
                            worksheet.Cells["K" + row.ToString()].Value = item["dAvailDate"].ToString();
                            worksheet.Cells["L" + row.ToString()].Value = item["vCertificateNo"].ToString();
                            worksheet.Cells["M" + row.ToString()].Value = item["dCertificateDate"].ToString();
                            worksheet.Cells["N" + row.ToString()].Value = item["vRegistrationValidUpto"].ToString();

                            row++;
                        }

                        MemoryStream memoryStream = new MemoryStream();
                        package.SaveAs(memoryStream);

                        Response.Clear();
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment; filename=GIPropDetailBymykase.xlsx");
                        Response.BinaryWrite(memoryStream.ToArray());
                        Response.End();
                        return "";
                    }
                }

                if (IprTypeId == "5")
                {
                    using (ExcelPackage package = new ExcelPackage())
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("ApplicantDetails_For_Design");
                        worksheet.Cells[1, 1].Value = "Design No.";
                        worksheet.Cells[1, 1 + 1].Value = "Status";
                        worksheet.Cells[1, 1 + 2].Value = "Class";
                        worksheet.Cells[1, 1 + 3].Value = "Applicant Details";
                        worksheet.Cells[1, 1 + 4].Value = "Address";
                        worksheet.Cells[1, 1 + 5].Value = "Date Of Registration";
                        worksheet.Cells[1, 1 + 6].Value = "Title";
                        worksheet.Cells[1, 1 + 7].Value = "Priority No.";

                        int row = 2;
                        foreach (var item in jObject["data"])
                        {
                            worksheet.Cells["A" + row.ToString()].Value = item["vDesignNo"].ToString();
                            worksheet.Cells["B" + row.ToString()].Value = item["vStatus"].ToString();
                            worksheet.Cells["C" + row.ToString()].Value = item["vClass"].ToString();
                            worksheet.Cells["D" + row.ToString()].Value = item["vApplDetails"].ToString();
                            worksheet.Cells["E" + row.ToString()].Value = item["vAddress"].ToString();
                            worksheet.Cells["F" + row.ToString()].Value = item["dDateOfRegistration"].ToString();
                            worksheet.Cells["G" + row.ToString()].Value = item["vTitle"].ToString();
                            worksheet.Cells["H" + row.ToString()].Value = item["vPriorityNo"].ToString();
                            row++;
                        }

                        MemoryStream memoryStream = new MemoryStream();
                        package.SaveAs(memoryStream);

                        Response.Clear();
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment; filename=Design_Applicant_Report_by_mykase.xlsx");
                        Response.BinaryWrite(memoryStream.ToArray());
                        Response.End();
                        return "";
                    }
                }

                return "";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to Excel for Agent
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExcelDownloadForAgent()
        {
            JObject jObject = new JObject();
            var AgentName = HttpContext.Request.QueryString["vAgentName"];
            var AgentAddress = HttpContext.Request.QueryString["vAgentAddress"];

            DataTable casedeatils = new DataTable();
            string exlfilename = "Mykase_trademark_Agent_" + DateTime.Now.ToString("dd-MMMM-yyyy");
            string ApiURL = ConfigurationManager.AppSettings["IPRapiurl"];
            var addfClient = new WebClient();
            object rawfile = new
            {
                AgentName = AgentName,
                AgentAddress = AgentAddress
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var res = addfClient.UploadString(new Uri(ApiURL + "/API/IPR/AgentDetailsForExcel"), "POST", builders);
            jObject = JObject.Parse(res);
            dynamic data1 = jObject["data"];

            casedeatils.Columns.Add("Word Mark");
            casedeatils.Columns.Add("Proprietor");
            casedeatils.Columns.Add("Appl. No.");
            casedeatils.Columns.Add("Class");
            casedeatils.Columns.Add("Appl. Date");
            casedeatils.Columns.Add("Journal No.");
            casedeatils.Columns.Add("Journal Date");
            casedeatils.Columns.Add("Status");
            casedeatils.Columns.Add("Used Since");
            casedeatils.Columns.Add("Valid Upto");
            casedeatils.Columns.Add("dGSDescription");
            casedeatils.Columns.Add("Agent");
            casedeatils.Columns.Add("Agent Address");
            casedeatils.Columns.Add("Publication Details");
            casedeatils.Columns.Add("Proprietor Address");

            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(res);
                casedeatils.Rows.Add(
                     data.data[i]["vWordMark"], data.data[i]["vProprietor"], data.data[i]["vApplNo"], data.data[i]["vClass"],
                    data.data[i]["dApplDate"], data.data[i]["vJournalNo"], data.data[i]["dJournalDate"],
                    data.data[i]["vStatus"], data.data[i]["vUsedSince"], data.data[i]["dValidUpto"],
                    data.data[i]["dGSDescription"], data.data[i]["Agent"], data.data[i]["AgentAddress"], data.data[i]["PublicationDetails"], data.data[i]["vProprietorAddress"]
                    );
            }
            var gv = new GridView();
            gv.DataSource = casedeatils;
            gv.DataBind();
            gv.HeaderStyle.BackColor = Color.Gray;
            gv.HeaderStyle.ForeColor = Color.White;
            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
            Response.ContentType = "application/ms-excel";
            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
            gv.RenderControl(objHtmlTextWriter);
            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();

            //using (ExcelPackage package = new ExcelPackage())
            //{
            //    package.Workbook.Properties.Title = "Mykase_trademark_details_" + DateTime.Now.ToString("dd-MMMM-yyyyy");
            //    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("PropriterDetails");
            //    worksheet.Cells[1, 1].Value = "Word Mark";
            //    worksheet.Cells[1, 1 + 1].Value = "Proprietor";
            //    worksheet.Cells[1, 1 + 2].Value = "Appl. No.";
            //    worksheet.Cells[1, 1 + 3].Value = "Class";
            //    worksheet.Cells[1, 1 + 4].Value = "Appl. Date";
            //    worksheet.Cells[1, 1 + 5].Value = "Journal No.";
            //    worksheet.Cells[1, 1 + 6].Value = "Journal Date";
            //    worksheet.Cells[1, 1 + 7].Value = "Status";
            //    worksheet.Cells[1, 1 + 8].Value = "Used Since";
            //    worksheet.Cells[1, 1 + 9].Value = "Valid Upto";
            //    worksheet.Cells[1, 1 + 10].Value = "dGSDescription";
            //    worksheet.Cells[1, 1 + 11].Value = "Agent";
            //    worksheet.Cells[1, 1 + 12].Value = "Agent Address";
            //    worksheet.Cells[1, 1 + 13].Value = "Publication Details";
            //    worksheet.Cells[1, 1 + 14].Value = "Proprietor Address";

            //    int row = 2;
            //    foreach (var item in jObject["data"])
            //    {
            //        worksheet.Cells["A" + row.ToString()].Value = item["vWordMark"].ToString();
            //        worksheet.Cells["B" + row.ToString()].Value = item["vProprietor"].ToString();
            //        worksheet.Cells["C" + row.ToString()].Value = item["vApplNo"].ToString();
            //        worksheet.Cells["D" + row.ToString()].Value = item["vClass"].ToString();
            //        worksheet.Cells["E" + row.ToString()].Value = item["dApplDate"].ToString();
            //        worksheet.Cells["F" + row.ToString()].Value = item["vJournalNo"].ToString();
            //        worksheet.Cells["G" + row.ToString()].Value = item["dJournalDate"].ToString();
            //        worksheet.Cells["H" + row.ToString()].Value = item["vStatus"].ToString();
            //        worksheet.Cells["I" + row.ToString()].Value = item["vUsedSince"].ToString();
            //        worksheet.Cells["J" + row.ToString()].Value = item["dValidUpto"].ToString();
            //        worksheet.Cells["K" + row.ToString()].Value = item["dGSDescription"].ToString();
            //        worksheet.Cells["L" + row.ToString()].Value = item["Agent"].ToString();
            //        worksheet.Cells["M" + row.ToString()].Value = item["AgentAddress"].ToString();
            //        worksheet.Cells["N" + row.ToString()].Value = item["PublicationDetails"].ToString();
            //        worksheet.Cells["O" + row.ToString()].Value = item["vProprietorAddress"].ToString();

            //        row++;
            //    }

            //    MemoryStream memoryStream = new MemoryStream();
            //    package.SaveAs(memoryStream);

            //    Response.Clear();
            //    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //    Response.AddHeader("content-disposition", "attachment; filename=Trademark_Agent_Report_by_mykase.xlsx");
            //    Response.BinaryWrite(memoryStream.ToArray());
            //    Response.End();
            //    return "";
            //}
        }

        /// <summary>
        /// This method is for Exporting the list to pdf for Copyright My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFCopyrightMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "CopyrightData_" + DateTime.Now.ToString("dd MM yyyy").Replace(" ", "_");

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRCopyrightReport_" + DateTime.Now;
                string userId1 = userId;

                var list = DataAccessIPRADO.ViewIPRCopyrightCaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.sp_GetIPRCopyrightCaseList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                //casedeatils.Columns.Add("RowId");
                //casedeatils.Columns.Add("Applicant Name");
                //casedeatils.Columns.Add("Applicant Address");
                //casedeatils.Columns.Add("Title of Work");
                //casedeatils.Columns.Add("Diary No");
                //casedeatils.Columns.Add("Roc No");
                //casedeatils.Columns.Add("Category");
                //casedeatils.Columns.Add("Date");


                //for (int i = 0; i < data1.Count; i++)
                //{
                //    casedeatils.Rows.Add(
                //        data1[i]["RowId"],
                //        data1[i]["ApplicantCat_Name"], data1[i]["ApplicantCat_Address"], data1[i]["Title_Work"],
                //        data1[i]["Diary_No"], data1[i]["Roc_No"], data1[i]["Category"], data1[i]["dDate"]);
                //}

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";

                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";

                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title of Work</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Roc No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
                strtemplate += "</tr></thead><tbody>";


                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantCat_Name"].ToString()) + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantCat_Address"].ToString()) + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Title_Work"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Diary_No"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Roc_No"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Category"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dDate"].ToString()) + " </td>";
                    var closesate = "";
                    strtemplate += "</tr>";
                }
                strtemplate += "</tbody></table>";
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Copyright Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Copyright PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to Excel for Copyright My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelCopyrightMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            //var iptypeid = 2;

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRCopyrightReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRCopyrightCaseList(firmid, userId, pagenum, pagesize);
                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.sp_GetIPRCopyrightCaseList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Applicant Address");
                casedeatils.Columns.Add("Title of Work");
                casedeatils.Columns.Add("Diary No");
                casedeatils.Columns.Add("Roc No");
                casedeatils.Columns.Add("Category");
                casedeatils.Columns.Add("Date");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["ApplicantCat_Name"].ToString()), checkformatvalue(list.Rows[i]["ApplicantCat_Address"].ToString()), checkformatvalue(list.Rows[i]["Title_Work"].ToString()),
                        checkformatvalue(list.Rows[i]["Diary_No"].ToString()), checkformatvalue(list.Rows[i]["Roc_No"].ToString()), checkformatvalue(list.Rows[i]["Category"].ToString()), checkformatvalue(list.Rows[i]["dDate"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to pdf for Patent My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFPatentMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "PatentData_" + DateTime.Now.ToString("dd MM yyyy").Replace(" ", "_");
            //var iptypeid = 2;

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRPatentReport_" + DateTime.Now;
                string userId1 = userId;
                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.sp_GetIPRPatentCaseList(firmid, userId, pagenum, pagesize).ToList();
                var list = DataAccessIPRADO.ViewIPRPatentCaseList(firmid, userId, pagenum, pagesize);
                //string resid = JsonConvert.SerializeObject(list);

                //dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                //casedeatils.Columns.Add("RowId");
                //casedeatils.Columns.Add("Applicant Name");
                //casedeatils.Columns.Add("Application No");
                //casedeatils.Columns.Add("Publication Date");
                //casedeatils.Columns.Add("Date of filing of Application");
                //casedeatils.Columns.Add("Title of the Invention");
                //casedeatils.Columns.Add("International Classification");
                //casedeatils.Columns.Add("Priority Document No");
                //casedeatils.Columns.Add("Priority Date");
                //casedeatils.Columns.Add("Name of Priority Country");
                //casedeatils.Columns.Add("International Application No");
                //casedeatils.Columns.Add("International Application Filing Date");
                //casedeatils.Columns.Add("International Publication No");
                //casedeatils.Columns.Add("Patent of Addition to Application Number");
                //casedeatils.Columns.Add("Patent of Addition to Application Filing Date");
                //casedeatils.Columns.Add("Divisional to Application Number");
                //casedeatils.Columns.Add("Divisional to Application Filing Date");
                //casedeatils.Columns.Add("Name of Inventor");
                //casedeatils.Columns.Add("Abstract");
                //casedeatils.Columns.Add("No. of pages");
                //casedeatils.Columns.Add("No. of claims");
                //casedeatils.Columns.Add("The Patent Office Journal");

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Publication Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of filing of Application</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title of the Invention</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>International Classification</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Document No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name of Priority Country</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>International Application No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>International Application Filing Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>International Publication No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent of Addition to Application Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent of Addition to Application Filing Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Divisional to Application Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Divisional to Application Filing Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name of Inventor</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Abstract</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>No. of pages</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>No. of claims</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>The Patent Office Journal</th>";
                strtemplate += "</tr></thead><tbody>";

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    //var ApplicantName = casedeatils.Rows[i].ItemArray[1];
                    //var ApplicationNo = casedeatils.Rows[i].ItemArray[2];
                    //var PublicationDate = casedeatils.Rows[i].ItemArray[3];
                    //var FilingDate = casedeatils.Rows[i].ItemArray[4];
                    //var TitleOfInvention = casedeatils.Rows[i].ItemArray[5];
                    //var InternationalClassification = casedeatils.Rows[i].ItemArray[6];
                    //var PriorityDocumentNo = casedeatils.Rows[i].ItemArray[7];
                    //var PriorityDate = casedeatils.Rows[i].ItemArray[8];
                    //var PriorityCountry = casedeatils.Rows[i].ItemArray[9];
                    //var InternationalApplicationNo = casedeatils.Rows[i].ItemArray[10];
                    //var InternationalFilingDate = casedeatils.Rows[i].ItemArray[11];
                    //var InternationalPublicationNo = casedeatils.Rows[i].ItemArray[12];
                    //var PatentAdditionNo = casedeatils.Rows[i].ItemArray[13];
                    //var FilingDatePatentAddition = casedeatils.Rows[i].ItemArray[14];
                    //var DivisionalNo = casedeatils.Rows[i].ItemArray[15];
                    //var FilingDateInventor = casedeatils.Rows[i].ItemArray[16];
                    //var InventorName = casedeatils.Rows[i].ItemArray[17];
                    //var Abstract = casedeatils.Rows[i].ItemArray[18];
                    //var NoOfPages = casedeatils.Rows[i].ItemArray[19];
                    //var NoOfClaims = casedeatils.Rows[i].ItemArray[20];
                    //var PatentOfficeJournal = casedeatils.Rows[i].ItemArray[21];

                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantName"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicationNo"].ToString()) + "  </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PublicationDate"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["FilingDate"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["TitleOfInvention"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["InternationalClassification"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityDocumentNo"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityDate"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityCountry"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["InternationalApplicationNo"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["InternationalFilingDate"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["InternationalPublicationNo"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PatentAdditionNo"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["FilingDatePatentAddition"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["DivisionalNo"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["FilingDateInventor"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["InventorName"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Abstract"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["NoOfPages"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["NoOfClaims"].ToString()) + " </td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PatentOfficeJournal"].ToString()) + " </td>";
                    var closesate = "";
                    strtemplate += "</tr>";

                }
                strtemplate += "</tbody></table>";
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Patent Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Patent PDF",
                    null, null);

            }
            catch (Exception ex)
            {
                //return ex.Message;
            }

        }

        /// <summary>
        /// This method is for Exporting the list to Excel for Patent My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelPatentMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            //var iptypeid = 2;
            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRPatentReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRPatentCaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.sp_GetIPRPatentCaseList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Application No");
                casedeatils.Columns.Add("Publication Date");
                casedeatils.Columns.Add("Date of filing of Application");
                casedeatils.Columns.Add("Title of the Invention");
                casedeatils.Columns.Add("International Classification");
                casedeatils.Columns.Add("Priority Document No");
                casedeatils.Columns.Add("Priority Date");
                casedeatils.Columns.Add("Name of Priority Country");
                casedeatils.Columns.Add("International Application No");
                casedeatils.Columns.Add("International Application Filing Date");
                casedeatils.Columns.Add("International Publication No");
                casedeatils.Columns.Add("Patent of Addition to Application Number");
                casedeatils.Columns.Add("Patent of Addition to Application Filing Date");
                casedeatils.Columns.Add("Divisional to Application Number");
                casedeatils.Columns.Add("Divisional to Application Filing Date");
                casedeatils.Columns.Add("Name of Inventor");
                casedeatils.Columns.Add("Abstract");
                casedeatils.Columns.Add("No. of pages");
                casedeatils.Columns.Add("No. of claims");
                casedeatils.Columns.Add("The Patent Office Journal");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["ApplicantName"].ToString()), checkformatvalue(list.Rows[i]["ApplicationNo"].ToString()), checkformatvalue(list.Rows[i]["PublicationDate"].ToString()), checkformatvalue(list.Rows[i]["FilingDate"].ToString()),
                        checkformatvalue(list.Rows[i]["TitleOfInvention"].ToString()), checkformatvalue(list.Rows[i]["InternationalClassification"].ToString()), checkformatvalue(list.Rows[i]["PriorityDocumentNo"].ToString()), checkformatvalue(list.Rows[i]["PriorityDate"].ToString()),
                        checkformatvalue(list.Rows[i]["PriorityCountry"].ToString()), checkformatvalue(list.Rows[i]["InternationalApplicationNo"].ToString()), checkformatvalue(list.Rows[i]["InternationalFilingDate"].ToString()),
                        checkformatvalue(list.Rows[i]["InternationalPublicationNo"].ToString()), checkformatvalue(list.Rows[i]["PatentAdditionNo"].ToString()), checkformatvalue(list.Rows[i]["FilingDatePatentAddition"].ToString()),
                        checkformatvalue(list.Rows[i]["DivisionalNo"].ToString()), checkformatvalue(list.Rows[i]["FilingDateInventor"].ToString()), checkformatvalue(list.Rows[i]["InventorName"].ToString()), checkformatvalue(list.Rows[i]["Abstract"].ToString()), checkformatvalue(list.Rows[i]["NoOfPages"].ToString()),
                        checkformatvalue(list.Rows[i]["NoOfClaims"].ToString()), checkformatvalue(list.Rows[i]["PatentOfficeJournal"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to pdf for GI My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFGIMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "GIData_" + DateTime.Now.ToString("dd MM yyyy").Replace(" ", "_");

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRGIReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRGICaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.usp_GetGIIPRList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                //casedeatils.Columns.Add("RowId");
                //casedeatils.Columns.Add("Applicant Name");
                //casedeatils.Columns.Add("Address");
                //casedeatils.Columns.Add("Application Number");
                //casedeatils.Columns.Add("Name of the GI");
                //casedeatils.Columns.Add("Date");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Goods");
                //casedeatils.Columns.Add("Specification");


                //for (int i = 0; i < data1.Count; i++)
                //{
                //    casedeatils.Rows.Add(
                //        data1[i]["RowId"],
                //        data1[i]["ApplicantName"], data1[i]["ApplicantAddress"], data1[i]["ApplicationNo"],
                //        data1[i]["GIName"], data1[i]["GIDate"], data1[i]["Class"], data1[i]["Goods"], data1[i]["Specifications"]);
                //}

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";

                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Application Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name of the GI</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Goods</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Specifications</th>";
                strtemplate += "</tr></thead><tbody>";

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    //var ApplicantName = casedeatils.Rows[i].ItemArray[1];
                    //var ApplicantAddress = casedeatils.Rows[i].ItemArray[2];
                    //var ApplicationNo = casedeatils.Rows[i].ItemArray[3];
                    //var GIName = casedeatils.Rows[i].ItemArray[4];
                    //var GIDate = casedeatils.Rows[i].ItemArray[5];
                    //var Class = casedeatils.Rows[i].ItemArray[6];
                    //var Goods = casedeatils.Rows[i].ItemArray[7];
                    //var Specifications = casedeatils.Rows[i].ItemArray[8];

                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantName"].ToString()) + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantAddress"].ToString()) + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicationNo"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["GIName"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["GIDate"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Class"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Goods"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Specifications"].ToString()) + " </td>";
                    var closesate = "";
                    strtemplate += "</tr>";
                }
                strtemplate += "</tbody></table>";
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded GI Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search GI PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to Excel for GI My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelGIMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRGIReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRGICaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.usp_GetGIIPRList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                // casedeatils.Columns.Add("RowId");
                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Address");
                casedeatils.Columns.Add("Application Number");
                casedeatils.Columns.Add("Name of the GI");
                casedeatils.Columns.Add("Date");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Goods");
                casedeatils.Columns.Add("Specification");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["ApplicantName"].ToString()), checkformatvalue(list.Rows[i]["ApplicantAddress"].ToString()), checkformatvalue(list.Rows[i]["ApplicationNo"].ToString()),
                        checkformatvalue(list.Rows[i]["GIName"].ToString()), checkformatvalue(list.Rows[i]["GIDate"].ToString()), checkformatvalue(list.Rows[i]["Class"].ToString()), checkformatvalue(list.Rows[i]["Goods"].ToString()), checkformatvalue(list.Rows[i]["Specifications"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to pdf for Design My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFDesignMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "DesignData_" + DateTime.Now.ToString("dd MM yyyy").Replace(" ", "_");
            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRDesignReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRDesignCaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.usp_GetDesignIPRList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                //casedeatils.Columns.Add("RowId");
                //casedeatils.Columns.Add("Applicant Name");
                //casedeatils.Columns.Add("Address");
                //casedeatils.Columns.Add("Title");
                //casedeatils.Columns.Add("Design Number");
                //casedeatils.Columns.Add("Class");
                //casedeatils.Columns.Add("Date");
                //casedeatils.Columns.Add("Journal No");
                //casedeatils.Columns.Add("Priority Number");
                //casedeatils.Columns.Add("Priority Date");
                //casedeatils.Columns.Add("Priority Country");


                //for (int i = 0; i < data1.Count; i++)
                //{
                //    casedeatils.Rows.Add(
                //        data1[i]["RowId"],
                //        data1[i]["ApplicantName"], data1[i]["ApplicantAddress"], data1[i]["Title"], data1[i]["DesignNumber"],
                //        data1[i]["Class"], data1[i]["dDate"], data1[i]["JournalNumber"], data1[i]["PriorityNumber"], data1[i]["PriorityDate"], data1[i]["PriorityCountry"]);
                //}

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Design Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Journal No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority Country</th>";
                strtemplate += "</tr></thead><tbody>";

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    //var ApplicantName = casedeatils.Rows[i].ItemArray[1];
                    //var ApplicantAddress = casedeatils.Rows[i].ItemArray[2];
                    //var Title = casedeatils.Rows[i].ItemArray[3];
                    //var DesignNumber = casedeatils.Rows[i].ItemArray[4];
                    //var Class = casedeatils.Rows[i].ItemArray[5];
                    //var dDate = casedeatils.Rows[i].ItemArray[6];
                    //var JournalNumber = casedeatils.Rows[i].ItemArray[7];
                    //var PriorityNumber = casedeatils.Rows[i].ItemArray[8];
                    //var PriorityDate = casedeatils.Rows[i].ItemArray[9];
                    //var PriorityCountry = casedeatils.Rows[i].ItemArray[10];
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantName"].ToString()) + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["ApplicantAddress"].ToString()) + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Title"].ToString()) + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["DesignNumber"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Class"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dDate"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["JournalNumber"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityNumber"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityDate"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["PriorityCountry"].ToString()) + " </td>";
                    var closesate = "";
                    strtemplate += "</tr>";
                }

                strtemplate += "</tbody></table>";
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Design Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Design PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to Excel for Design My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelDesignMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRDesignReport_" + DateTime.Now;
                string userId1 = userId;
                var list = DataAccessIPRADO.ViewIPRDesignCaseList(firmid, userId, pagenum, pagesize);

                //LawPracticeEntities lpe = new LawPracticeEntities();
                //var list = lpe.usp_GetDesignIPRList(firmid, userId, pagenum, pagesize).ToList();
                //string resid = JsonConvert.SerializeObject(list);

                ////dynamic jObject =  Json.Parse(resid);
                //var JObject = new JObject();
                //JObject["data"] = JToken.FromObject(list);
                //dynamic data1 = JObject["data"];
                //int pageid = 0;

                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Address");
                casedeatils.Columns.Add("Title");
                casedeatils.Columns.Add("Design Number");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Date");
                casedeatils.Columns.Add("Journal No");
                casedeatils.Columns.Add("Priority Number");
                casedeatils.Columns.Add("Priority Date");
                casedeatils.Columns.Add("Priority Country");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["ApplicantName"].ToString()), checkformatvalue(list.Rows[i]["ApplicantAddress"].ToString()), checkformatvalue(list.Rows[i]["Title"].ToString()), checkformatvalue(list.Rows[i]["DesignNumber"].ToString()),
                        checkformatvalue(list.Rows[i]["Class"].ToString()), checkformatvalue(list.Rows[i]["dDate"].ToString()), checkformatvalue(list.Rows[i]["JournalNumber"].ToString()), checkformatvalue(list.Rows[i]["PriorityNumber"].ToString()), checkformatvalue(list.Rows[i]["PriorityDate"].ToString()), checkformatvalue(list.Rows[i]["PriorityCountry"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

        /// <summary>
        /// This method is for Exporting the list to pdf for Trademark My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoPDFTrademarkMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();
            string pdffileName = "TrademarkData_" + DateTime.Now.ToString("dd MM yyyy").Replace(" ", "_");

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "IPRTrademarkReport_" + DateTime.Now;
                string userId1 = userId;

                var list = DataAccessIPRADO.ViewIPRTrademarkCaseList(userId, firmid, pagenum, pagesize);

                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Country</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant State</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant District</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Emailid</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Phone Number</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Legal Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Use Of Mark</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category Of Mark</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Trade Mark</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Priority</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Conditions</th>";
                strtemplate += "</tr></thead><tbody>";
                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_Type"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_Name"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_Address"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_Country"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_State"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_District"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_EmailId"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Applicant_PhoneNo"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Legal_Status"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + (list.Rows[i]["Use_Of_Mark"].ToString() == "User Detail" ? checkformatvalue(list.Rows[i]["vUsedSince"].ToString()) : checkformatvalue(list.Rows[i]["Use_Of_Mark"].ToString())) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Category_of_Mark"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Mark_of_Title"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Class"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Priority"].ToString()) + "</td>";
                    strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["Conditions"].ToString()) + "</td>";
                    strtemplate += "</tr>";
                }
                strtemplate += "</tbody></table>";

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userId + "/");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + pdffileName + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + pdffileName + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded Trademark Data in PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Search Trademark PDF",
                    null, null);
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// This method is for Exporting the list to Excel for Trademark My List Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportoExcelTrademarkMyList()
        {
            int pagesize = 10, pagenum = 1;
            pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum1"]));
            pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize1"]));
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();

            try
            {

                DataTable casedeatils = new DataTable();
                string exlfilename = "Mykase_Trademark_MyList_Details_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                var list = DataAccessIPRADO.ViewIPRTrademarkCaseList(userId, firmid, pagenum, pagesize);

                casedeatils.Columns.Add("Applicant Type");
                casedeatils.Columns.Add("Applicant Name");
                casedeatils.Columns.Add("Applicant Address");
                casedeatils.Columns.Add("Applicant Country");
                casedeatils.Columns.Add("Applicant State");
                casedeatils.Columns.Add("Applicant District");
                casedeatils.Columns.Add("Applicant Emailid");
                casedeatils.Columns.Add("Applicant Phone Number");
                casedeatils.Columns.Add("Legal Status");
                casedeatils.Columns.Add("Use Of Mark");
                casedeatils.Columns.Add("Category Of Mark");
                casedeatils.Columns.Add("Trade Mark");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Priority");
                casedeatils.Columns.Add("Conditions");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["Applicant_Type"].ToString()), checkformatvalue(list.Rows[i]["Applicant_Name"].ToString()), checkformatvalue(list.Rows[i]["Applicant_Address"].ToString()), checkformatvalue(list.Rows[i]["Applicant_Country"].ToString()),
                        checkformatvalue(list.Rows[i]["Applicant_State"].ToString()), checkformatvalue(list.Rows[i]["Applicant_District"].ToString()), checkformatvalue(list.Rows[i]["Applicant_EmailId"].ToString()), checkformatvalue(list.Rows[i]["Applicant_PhoneNo"].ToString()), checkformatvalue(list.Rows[i]["Legal_Status"].ToString()),
                        (list.Rows[i]["Use_Of_Mark"].ToString() == "User Detail" ? checkformatvalue(list.Rows[i]["vUsedSince"].ToString()) : checkformatvalue(list.Rows[i]["Use_Of_Mark"].ToString())), checkformatvalue(list.Rows[i]["Category_of_Mark"].ToString()), checkformatvalue(list.Rows[i]["Mark_of_Title"].ToString()), checkformatvalue(list.Rows[i]["Class"].ToString()), checkformatvalue(list.Rows[i]["Priority"].ToString()), checkformatvalue(list.Rows[i]["Conditions"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
            }
        }

        public string RemoveSpecialCharacter(string InputString)
        {
            string ReplacedValue = "";

            if (Regex.IsMatch(InputString, "\r\n", RegexOptions.IgnoreCase))
            {
                ReplacedValue = Regex.Replace(InputString, "\r\n", "");
            }

            if (Regex.IsMatch(InputString, "\t", RegexOptions.IgnoreCase))
            {
                ReplacedValue = Regex.Replace(InputString, "\t", "");
            }
            //string MatchValue = Regex.Replace()
            if (string.IsNullOrEmpty(ReplacedValue))
            {
                return InputString;
            }
            return ReplacedValue;
        }
        /// <summary>
        /// Download proprietor and applicant detail
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void DownloadIPRProprietorAndApplicant()
        {
            DataTable dt = new DataTable();
            var dtt = DateTime.Now.ToString("dd-MMMM-yyyy");

            DateTime dtt1 = new DateTime();

            string markName = "";
            string exlfilename = "";

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            int PageNum = 1;
            int PageSize = 50;

            //int IprTypeId = Convert.ToInt32(HttpContext.Request.Form["iprid"]);

            //string PropName = HttpContext.Request.Form["propname"];
            //string PropAddress = HttpContext.Request.Form["propadd"];

            var IprTypeId = Convert.ToInt32(QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["iprid"])));
            var PropName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["propname"]));
            var PropAddress = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["propadd"]));

            if (String.IsNullOrEmpty(PropName))
            {
                PropName = "";
            }

            if (String.IsNullOrEmpty(PropAddress))
            {
                PropAddress = "";
            }

            try
            {
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();
                object rawfile = new
                {
                    IprTypeId = IprTypeId,
                    pageNumber = PageNum,
                    pageSize = PageSize,
                    vProprietorSearch = PropName,
                    vProprietorAddressSearch = PropAddress
                };

                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                switch (IprTypeId)
                {
                    case 1:
                        exlfilename = "TrademarkProprietorReport_" + dtt;
                        markName = "Trade mark Proprietor";

                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Mark");
                        dt.Columns.Add("Application Number");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Application Date");
                        dt.Columns.Add("Status");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vWordMark"], data.data[i]["vApplNo"], data.data[i]["vClass"], data.data[i]["vApplDate"], data.data[i]["vStatus"]);
                        }
                        break;

                    case 2:

                        exlfilename = "CopyrightApplicantReport_" + dtt;
                        markName = "Copyright Applicant";

                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Category");
                        dt.Columns.Add("Status");
                        dt.Columns.Add("Application Date");
                        dt.Columns.Add("ROC Number");
                        dt.Columns.Add("Title Of Work");
                        dt.Columns.Add("Diary Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplicantName"], data.data[i]["vCategory"], data.data[i]["vStatus"],
                                data.data[i]["dApplDate"], data.data[i]["vROCNumber"], data.data[i]["vTitleofWork"], data.data[i]["vDiaryNo"]);
                        }

                        break;

                    case 3:
                        exlfilename = "PatentApplicantReport_" + dtt;
                        markName = "Patent Applicant";
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Application Number");
                        dt.Columns.Add("Title Of The Invention");
                        dt.Columns.Add("Status");
                        dt.Columns.Add("Date Of Filing Of Application ");
                        dt.Columns.Add("Applicant Name");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vApplNo"], data.data[i]["vInventionTitle"], data.data[i]["vStatus"],
                                data.data[i]["dDateOffiling"], data.data[i]["vApplicantName"]);
                        }


                        break;

                    case 4:
                        exlfilename = "GIApplicantReport_" + dtt;
                        markName = "Geographical Indication Applicant";
                        dt.Columns.Add("S.No");
                        dt.Columns.Add("Geographical Indication");
                        dt.Columns.Add("Applicant Name");
                        dt.Columns.Add("Status");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Date Of Filing");
                        dt.Columns.Add("Availability Date");
                        dt.Columns.Add("Journal Number");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            //string status = data.Status;
                            dt.Rows.Add(data.data[i]["RowId"], data.data[i]["vGeoIndication"], data.data[i]["vApplicantName"], data.data[i]["vStatus"],
                                data.data[i]["vClass"], data.data[i]["dDateofFiling"], data.data[i]["vRegistrationValidUpto"], data.data[i]["vJournalNo"]);
                        }

                        break;

                    case 5:
                        exlfilename = "DesignApplicantReport_" + dtt;
                        markName = "Design Applicant";

                        dt.Columns.Add("Design Number.");
                        dt.Columns.Add("Class");
                        dt.Columns.Add("Applicant Details");
                        dt.Columns.Add("Address");
                        dt.Columns.Add("Registration Date");
                        dt.Columns.Add("Title");
                        dt.Columns.Add("Priority Number");
                        dt.Columns.Add("Priority Status");
                        dt.Columns.Add("Priority Date");
                        dt.Columns.Add("Priority Country");
                        dt.Columns.Add("Design Image");

                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            dt.Rows.Add(data.data[i]["vDesignNo"], data.data[i]["vClass"], data.data[i]["vApplDetails"],
                                data.data[i]["vAddress"], data.data[i]["dDateOfRegistration"], data.data[i]["vTitle"], data.data[i]["vPriorityNo"], data.data[i]["vPriorityStatus"], data.data[i]["dPriorityDate"], data.data[i]["vPriorityCountry"], data.data[i]["vImgPath"]);
                        }

                        break;
                }
                DateTime date = DateTime.Now;
                //string exlfilename = "IPR_" + markName + "_DetailsReport_" + date.Hour + date.Minute + date.Second + date.Millisecond;
                var gv = new GridView();
                gv.DataSource = dt;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                //gv.AlternatingRowStyle.BackColor = Color.Salmon;
                //gv.AlternatingRowStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Trademark delete view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult ViewDeletedTrademarks()
        {
            ViewBag.RoleId = LoggedInUser.RoleId.ToString();
            return View();
        }

        /// <summary>
        /// Copyright pdf added pdf download
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]

        public void ViewAddedCopyrightExportoPdfNewCases()
        {
            try
            {
                int pageNum = 1;
                int pageSize = 10;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                string vStatus = HttpContext.Request.QueryString["statusforcopyright"];
                pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);
                var searchtext = HttpContext.Request.QueryString["filtertradmark"];
                var diaryno = HttpContext.Request.QueryString["txtdiaryno"];
                var categoryno = HttpContext.Request.QueryString["ctgry1"];
                var datefrom = HttpContext.Request.QueryString["txtdatefrom"];
                var dateto = HttpContext.Request.QueryString["txtdateto"];
                var applicant = HttpContext.Request.QueryString["txtApplicant"];
                var rocno = HttpContext.Request.QueryString["txtroc"];
                var iprcounter = HttpContext.Request.QueryString["hdncounter"];
                var sort = Convert.ToInt32(HttpContext.Request.QueryString["vsort"]);
                var colname = HttpContext.Request.QueryString["colname"];

                diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
                categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                applicant = (applicant == null || applicant == "null") ? "" : applicant;
                rocno = (rocno == null || rocno == "null") ? "" : rocno;
                iprcounter = (iprcounter == null || iprcounter == "null") ? "" : iprcounter;
                colname = (colname == null || colname == "null") ? "" : colname;
                vStatus = (vStatus == "null" || string.IsNullOrEmpty(vStatus)) ? "" : vStatus;

                var vStatuslist = "";
                if (vStatus != "")
                {
                    foreach (var item in vStatus.Split(','))
                    {
                        vStatuslist += "'" + item + "',";
                    }
                    vStatuslist = vStatuslist.TrimStart('\'');
                    vStatuslist = vStatuslist.TrimEnd('\'', ',');
                }

                var list = DataAccessIPRADO.GetIPRCopyrightList(userId, firmId, pageNum, pageSize, searchtext, diaryno, categoryno, datefrom, dateto, vStatuslist, applicant, rocno, sort, colname);

                try
                {
                    string exlfilename = "Mykase_Copyright_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");

                    string strtemplate = "";
                    strtemplate += "<style> table { overflow: visible !important; }";
                    strtemplate += " thead { display:table-header-group }";
                    strtemplate += " tfoot { display: table-row-group }";
                    strtemplate += " tr { page-break-inside:avoid }</style>";
                    strtemplate += "<div style='width:100%'>";
                    strtemplate += "<div style='float:left;width:25%'>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:left;width:50%'>";
                    strtemplate += "<center><p>&nbsp;</p></center>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:right;'>";
                    strtemplate += "</div>";
                    strtemplate += "</div>";
                    strtemplate += "<br><br><br>";
                    strtemplate += "<center>";
                    strtemplate += "<hr style='clear:both;'>";
                    strtemplate += " <p></p>";
                    strtemplate += " <p></p>";
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant Name </th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title of Work</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary No</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Application</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category </th>";
                    strtemplate += "</tr></thead><tbody>";

                    for (int i = 0; i < list.Rows.Count; i++)
                    {
                        strtemplate += "<tr>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["vApplicantName"].ToString()) + "</td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["vTitleofWork"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["vDiaryNo"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["StatusName"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dApplDate"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["vCategoryName"].ToString()) + " </td>";
                        strtemplate += "</tr>";
                    }
                    strtemplate += "</tbody></table>";
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                    htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                    var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                    htmlToPdf.Margins = pageMargins;
                    htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                        "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                    var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                    var pffth = folderPath + exlfilename + ".pdf";
                    System.IO.File.WriteAllBytes(pffth, pdfBytes);
                    Response.Clear();
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + exlfilename + ".pdf");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
                catch (Exception ex)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// Added Patent pdf download
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]

        public void ViewAddedPatentExportoPdf()
        {
            try
            {
                int pageNum = 1, pageSize = 10;
                string vStatus = "";
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var searchtext = HttpContext.Request.QueryString["filtertradmark"];
                var applicationno = HttpContext.Request.QueryString["applicationno"];
                vStatus = HttpContext.Request.QueryString["status"];
                var applicantName = HttpContext.Request.QueryString["applicant"];
                var patentno = HttpContext.Request.QueryString["patentno"];
                var datefrom = HttpContext.Request.QueryString["datefrom"];
                var dateto = HttpContext.Request.QueryString["dateto"];
                var priorityDateFrom = HttpContext.Request.QueryString["pdatefrom"];
                var priorityDateTo = HttpContext.Request.QueryString["pdateto"];
                var publishDateFrom = HttpContext.Request.QueryString["pubDateFrom"];
                var publishDateTo = HttpContext.Request.QueryString["pubDateTo"];
                pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);

                searchtext = (searchtext == null || searchtext == "null") ? "" : searchtext;
                applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
                vStatus = (vStatus == null || vStatus == "null") ? "" : vStatus;
                applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
                patentno = (patentno == null || patentno == "null") ? "" : patentno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                priorityDateFrom = (priorityDateFrom == null || priorityDateFrom == "null") ? "" : priorityDateFrom;
                priorityDateTo = (priorityDateTo == null || priorityDateTo == "null") ? "" : priorityDateTo;
                publishDateFrom = (publishDateFrom == null || publishDateFrom == "null") ? "" : publishDateFrom;
                publishDateTo = (publishDateTo == null || publishDateTo == "null") ? "" : publishDateTo;

                var list = DataAccessIPRADO.GetAddedPatentDetails(userId, firmId, pageNum, pageSize, searchtext, datefrom, dateto, vStatus, applicantName, priorityDateFrom, priorityDateTo, publishDateFrom, publishDateTo, patentno, applicationno);
                try
                {
                    string exlfilename = "Mykase_Patent_search_results_" + DateTime.Now.ToString("dd-MMMM-yyyy");

                    string strtemplate = "";
                    strtemplate += "<style> table { overflow: visible !important; }";
                    strtemplate += " thead { display:table-header-group }";
                    strtemplate += " tfoot { display: table-row-group }";
                    strtemplate += " tr { page-break-inside:avoid }</style>";
                    strtemplate += "<div style='width:100%'>";
                    strtemplate += "<div style='float:left;width:25%'>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:left;width:50%'>";
                    strtemplate += "<center><p>&nbsp;</p></center>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:right;'>";
                    strtemplate += "</div>";
                    strtemplate += "</div>";
                    strtemplate += "<br><br><br>";
                    strtemplate += "<center>";
                    strtemplate += "<hr style='clear:both;'>";
                    strtemplate += " <p></p>";
                    strtemplate += " <p></p>";
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Filing</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name Of Applicant</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent No.</th>";
                    strtemplate += "</tr></thead><tbody>";

                    for (int i = 0; i < list.Rows.Count; i++)
                    {
                        strtemplate += "<tr>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vApplNo"].ToString() + "</td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vInventionTitle"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["StatusName"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dDateOffiling"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vApplicantName"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vPatentNum"].ToString() + " </td>";
                        strtemplate += "</tr>";
                    }
                    strtemplate += "</tbody></table>";
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                    htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                    var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                    htmlToPdf.Margins = pageMargins;
                    htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                        "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                    var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                    var pffth = folderPath + exlfilename + ".pdf";
                    System.IO.File.WriteAllBytes(pffth, pdfBytes);
                    Response.Clear();
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + exlfilename + ".pdf");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
                catch (Exception ex)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// GI TRacker export to excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void GITrackerExportoExcelList()
        {
            int pageNum = 1;
            int pageSize = 10;
            string searchstatus = "";
            searchstatus = HttpContext.Request.QueryString["vstatus"];
            pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
            pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);

            var searchtext = HttpContext.Request.QueryString["filtertradmark"];
            var applicationname = HttpContext.Request.QueryString["applicationname"];
            var applicationno = HttpContext.Request.QueryString["txtapplicationno"];
            var vclass = HttpContext.Request.QueryString["vclass"];
            var journalno = HttpContext.Request.QueryString["journalno"];
            var fromDate = HttpContext.Request.QueryString["txtdatefilingfrom"];
            var toDate = HttpContext.Request.QueryString["txtdatefilingto"];
            var registdate = HttpContext.Request.QueryString["validupto"];
            var sort = Convert.ToInt32(HttpContext.Request.QueryString["sort"]);

            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            vclass = (vclass == null || vclass == "null") ? "" : vclass;
            journalno = (journalno == null || journalno == "null") ? "" : journalno;
            fromDate = (fromDate == null || fromDate == "null") ? "" : fromDate;
            toDate = (toDate == null || toDate == "null") ? "" : toDate;
            registdate = (registdate == null || registdate == "null") ? "" : registdate;

            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "GITracker_Details_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                var list = DataAccessIPRADO.BindAddedIPRGI(userId, firmId, searchtext, applicationno, searchstatus, applicationname, vclass, journalno, fromDate, toDate, registdate, pageNum, pageSize, sort, "");

                casedeatils.Columns.Add("Sr. No.");
                casedeatils.Columns.Add("Name Of GI");
                casedeatils.Columns.Add("Applicant");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Date Of Filing");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Journal No.");
                casedeatils.Columns.Add("Applicant No.");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    casedeatils.Rows.Add(
                        checkformatvalue(list.Rows[i]["RowId"].ToString()), checkformatvalue(list.Rows[i]["vGeoIndication"].ToString()),
                        checkformatvalue(list.Rows[i]["vApplicantName"].ToString()), checkformatvalue(list.Rows[i]["vStatus"].ToString()),
                        checkformatvalue(list.Rows[i]["dDateofFiling"].ToString()), checkformatvalue(list.Rows[i]["vClass"].ToString()),
                        checkformatvalue(list.Rows[i]["vJournalNo"].ToString()), checkformatvalue(list.Rows[i]["vApplicationNo"].ToString()));
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// GI Tracker export to pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportAddedGIInPdf()
        {
            int pageNum = 1;
            int pageSize = 10;
            string searchstatus = "";
            searchstatus = HttpContext.Request.QueryString["vstatus"];
            pageNum = Convert.ToInt16(HttpContext.Request.QueryString["pagenum"]);
            pageSize = Convert.ToInt16(HttpContext.Request.QueryString["pagesize"]);

            var searchtext = HttpContext.Request.QueryString["filtertradmark"];
            var applicationname = HttpContext.Request.QueryString["applicationname"];
            var applicationno = HttpContext.Request.QueryString["txtapplicationno"];
            var vclass = HttpContext.Request.QueryString["vclass"];
            var journalno = HttpContext.Request.QueryString["journalno"];
            var fromDate = HttpContext.Request.QueryString["txtdatefilingfrom"];
            var toDate = HttpContext.Request.QueryString["txtdatefilingto"];
            var registdate = HttpContext.Request.QueryString["validupto"];
            var sort = Convert.ToInt32(HttpContext.Request.QueryString["sort"]);

            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            vclass = (vclass == null || vclass == "null") ? "" : vclass;
            journalno = (journalno == null || journalno == "null") ? "" : journalno;
            fromDate = (fromDate == null || fromDate == "null") ? "" : fromDate;
            toDate = (toDate == null || toDate == "null") ? "" : toDate;
            registdate = (registdate == null || registdate == "null") ? "" : registdate;

            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "GIPdfTracker_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                var list = DataAccessIPRADO.BindAddedIPRGI(userId, firmId, searchtext, applicationno, searchstatus, applicationname, vclass, journalno, fromDate, toDate, registdate, pageNum, pageSize, sort, "");
                try
                {
                    string strtemplate = "";
                    strtemplate += "<style> table { overflow: visible !important; }";
                    strtemplate += " thead { display:table-header-group }";
                    strtemplate += " tfoot { display: table-row-group }";
                    strtemplate += " tr { page-break-inside:avoid }</style>";
                    strtemplate += "<div style='width:100%'>";
                    strtemplate += "<div style='float:left;width:25%'>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:left;width:50%'>";
                    strtemplate += "<center><p>&nbsp;</p></center>";
                    strtemplate += "</div>";
                    strtemplate += "<div style='float:right;'>";
                    strtemplate += "</div>";
                    strtemplate += "</div>";
                    strtemplate += "<br><br><br>";
                    strtemplate += "<center>";
                    strtemplate += "<hr style='clear:both;'>";
                    strtemplate += " <p></p>";
                    strtemplate += " <p></p>";
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Sr. No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Name Of GI</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date Of Filing</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Applicant No.</th>";
                    strtemplate += "</tr></thead><tbody>";

                    for (int i = 0; i < list.Rows.Count; i++)
                    {
                        strtemplate += "<tr>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["RowId"].ToString() + "</td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vGeoIndication"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vApplicantName"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vStatus"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dDateofFiling"].ToString()) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vClass"].ToString() + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vApplicationNo"].ToString() + " </td>";
                        strtemplate += "</tr>";
                    }
                    strtemplate += "</tbody></table>";
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                    htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                    var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                    htmlToPdf.Margins = pageMargins;
                    htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                        "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                    var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                    var pffth = folderPath + exlfilename + ".pdf";
                    System.IO.File.WriteAllBytes(pffth, pdfBytes);
                    Response.Clear();
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + exlfilename + ".pdf");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
                catch (Exception ex)
                {

                }
            }
            catch (Exception ex)
            {

            }
        }
        /// <summary>
        /// Design TRacker export to excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void BindAddedDesignDetail()
        {
            int pagenum = 1;
            int pagesize = 10;
            string status = "";
            status = HttpContext.Request.QueryString["searchstatusfordesign"];
            var filtertrademark = HttpContext.Request.QueryString["filtertradmark"];
            var designno = HttpContext.Request.QueryString["designno"];
            var iplist = "5";
            var appDetails = HttpContext.Request.QueryString["appdetails"];
            var dateofregisterfrom = HttpContext.Request.QueryString["regfrom"];
            var dateofregisterto = HttpContext.Request.QueryString["regto"];
            var title = HttpContext.Request.QueryString["title"];
            var pcountry = HttpContext.Request.QueryString["prioritycountry"];
            var vClass = HttpContext.Request.QueryString["vclass"];
            pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);

            designno = (designno == null || designno == "null") ? "" : designno;
            iplist = (iplist == null || iplist == "null") ? "5" : iplist;
            appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
            status = (status == null || status == "null") ? "" : status;
            dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null") ? "" : dateofregisterfrom;
            dateofregisterto = (dateofregisterto == null || dateofregisterto == "null") ? "" : dateofregisterto;
            title = (title == null || title == "null" || title == "undefined") ? "" : title;
            pcountry = (pcountry == null || pcountry == "null" || pcountry == "undefined") ? "" : pcountry;
            vClass = (vClass == null || vClass == "null" || vClass == "undefined") ? "" : vClass;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "DesignTracker_Details_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;

                var list = DataAccessIPRADO.GetAddedIPRDesign(userId, firmId, filtertrademark, designno, vClass, appDetails, status, title, pagenum, pagesize, 0, "", dateofregisterfrom, dateofregisterto);

                //var jsonString = JsonConvert.SerializeObject(list);
                //dynamic jObject = JObject.Parse(jsonString);
                //dynamic data1 = jObject["data"];

                casedeatils.Columns.Add("Sr. No.");
                casedeatils.Columns.Add("Design No.");
                casedeatils.Columns.Add("Class Detail", typeof(string));
                casedeatils.Columns.Add("Address");
                casedeatils.Columns.Add("Date of Registration");
                casedeatils.Columns.Add("Title");
                casedeatils.Columns.Add("Patent Office Journal No.");

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    string classValue = "=\"" + list.Rows[i]["vClass"] + "\"";//Convert.ToString(list.Rows[i]["vClass"]);
                    casedeatils.Rows.Add(
                        list.Rows[i]["RowId"].ToString(), list.Rows[i]["vDesignNo"].ToString(), classValue,
                        list.Rows[i]["vAddress"].ToString(), list.Rows[i]["dDateOfRegistration"].ToString(),
                        list.Rows[i]["vTitle"].ToString(), list.Rows[i]["vPatentOffJournalNo"].ToString());
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
            }
        }
        /// <summary>
        /// Design TRacker export to excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportDesignInPdf()
        {
            int pagenum = 1;
            int pagesize = 10;
            string status = "";
            status = HttpContext.Request.QueryString["searchstatusfordesign"];
            var filtertrademark = HttpContext.Request.QueryString["filtertradmark"];
            var designno = HttpContext.Request.QueryString["designno"];
            var iplist = "5";
            var appDetails = HttpContext.Request.QueryString["appdetails"];
            var dateofregisterfrom = HttpContext.Request.QueryString["regfrom"];
            var dateofregisterto = HttpContext.Request.QueryString["regto"];
            var title = HttpContext.Request.QueryString["title"];
            var pcountry = HttpContext.Request.QueryString["prioritycountry"];
            var vClass = HttpContext.Request.QueryString["vclass"];
            pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
            pagenum = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);

            designno = (designno == null || designno == "null") ? "" : designno;
            iplist = (iplist == null || iplist == "null") ? "5" : iplist;
            appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
            status = (status == null || status == "null") ? "" : status;
            dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null") ? "" : dateofregisterfrom;
            dateofregisterto = (dateofregisterto == null || dateofregisterto == "null") ? "" : dateofregisterto;
            title = (title == null || title == "null" || title == "undefined") ? "" : title;
            pcountry = (pcountry == null || pcountry == "null" || pcountry == "undefined") ? "" : pcountry;
            vClass = (vClass == null || vClass == "null" || vClass == "undefined") ? "" : vClass;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "DesignTracker_Details_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                string userId1 = userId;
                var list = DataAccessIPRADO.GetAddedIPRDesign(userId, firmId, filtertrademark, designno, vClass, appDetails, status, title, pagenum, pagesize, 0, "", dateofregisterfrom, dateofregisterto);

                string strtemplate = "";
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Sr. No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Design No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Class</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date of Registration</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Title</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Patent Office Journal No.</th>";
                strtemplate += "</tr></thead><tbody>";

                for (int i = 0; i < list.Rows.Count; i++)
                {
                    strtemplate += "<tr>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["RowId"].ToString() + "</td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vDesignNo"].ToString() + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vClass"].ToString() + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vAddress"].ToString() + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + checkformatvalue(list.Rows[i]["dDateOfRegistration"].ToString()) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vTitle"].ToString() + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + list.Rows[i]["vPatentOffJournalNo"].ToString() + " </td>";
                    strtemplate += "</tr>";
                }
                strtemplate += "</tbody></table>";
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/ExportData/Pdf/" + firmId + "/" + userId + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = folderPath + exlfilename + ".pdf";
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + exlfilename + ".pdf");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

            }
            catch
            {

            }

        }


        /// <summary>
        /// Sending excel from IPR Correspondance.
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendCorrNoticeMail()
        {
            try
            {
                string markName = "Correspondence & Notices";
                string Username = LoggedInUser.UserFullName;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationno = Request.Form["applNo"];
                var PageSize = "500";
                var PageNum = "1";

                string To = Request.Form["To"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                byte[] conVal2 = Convert.FromBase64String(To);
                string decodeRecName = Encoding.UTF8.GetString(conVal2);
                try
                {
                    DataTable casedeatils = new DataTable();
                    string userId1 = userId;
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        vApplNo = applicationno,
                        PageNum = PageNum,
                        PageSize = PageSize
                    };

                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindCorrespondenceReport"), "POST", builders);

                    dynamic jObject = JObject.Parse(res);
                    dynamic data1 = jObject["data"];

                    casedeatils.Columns.Add("Corres. No.");
                    casedeatils.Columns.Add("Corres Date");
                    casedeatils.Columns.Add("Subject");
                    casedeatils.Columns.Add("Despatch No.");
                    casedeatils.Columns.Add("Despatch Date");
                    casedeatils.Columns.Add("Hearing Date");
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(res);
                        //string status = data.Status;
                        casedeatils.Rows.Add(data.data[i]["CorresNo"], data.data[i]["CorresDate"],
                            data.data[i]["CorresSubject"], data.data[i]["DispatchNo"], data.data[i]["DispatchDate"], data.data[i]["HearingDate"]);
                    }


                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_Correspondance" + date.Hour + date.Minute + date.Second + date.Millisecond;
                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    string msgbody = "";
                    string strsubject = "", strbody = "";
                    strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                    string userName = FindUserNameFromEmail(decodeRecName);
                    strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                    strbody = strbody.Replace("#User#", userName);
                    strbody = strbody.Replace("#Mark#", markName);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, decodeRecName, "", "", strsubject, strbody, fullpath);
                    }
                    catch (Exception ex)
                    {
                    }
                }
                catch (Exception er)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// Sending excel from IPR Examination.
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendDocumentListMail()
        {
            try
            {
                string markName = "Document List";
                string Username = LoggedInUser.UserFullName;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationno = Request.Form["applNo"];
                var PageSize = "500";
                var PageNum = "1";

                string To = Request.Form["To"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                byte[] conVal2 = Convert.FromBase64String(To);
                string decodeRecName = Encoding.UTF8.GetString(conVal2);
                try
                {
                    DataTable casedeatils = new DataTable();
                    string userId1 = userId;
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        vApplNo = applicationno,
                        Pagenum = PageNum,
                        Pagesize = PageSize
                    };

                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRUploadedDocs"), "POST", builders);

                    dynamic jObject = JObject.Parse(res);
                    dynamic data1 = jObject["data"];

                    casedeatils.Columns.Add("Document Name");
                   
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(res);
                        //string status = data.Status;
                        casedeatils.Rows.Add(data.data[i]["vDescription"]);
                    }


                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_DocList" + date.Hour + date.Minute + date.Second + date.Millisecond;
                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    string msgbody = "";
                    string strsubject = "", strbody = "";
                    strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                    string userName = FindUserNameFromEmail(decodeRecName);
                    strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                    strbody = strbody.Replace("#User#", userName);
                    strbody = strbody.Replace("#Mark#", markName);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, decodeRecName, "", "", strsubject, strbody, fullpath);
                    }
                    catch (Exception ex)
                    {
                    }
                }
                catch (Exception er)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// Sending excel from IPR Opposition Document.
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendOppDocumentListMail()
        {
            try
            {
                string markName = "Opposition Document List";
                string Username = LoggedInUser.UserFullName;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationno = Request.Form["applNo"];
                var PageSize = "500";
                var PageNum = "1";

                string To = Request.Form["To"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                byte[] conVal2 = Convert.FromBase64String(To);
                string decodeRecName = Encoding.UTF8.GetString(conVal2);
                try
                {
                    DataTable casedeatils = new DataTable();
                    string userId1 = userId;
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        vApplNo = applicationno,
                        Pagenum = PageNum,
                        Pagesize = PageSize
                    };

                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRUploadedDocsForOpposition"), "POST", builders);

                    dynamic jObject = JObject.Parse(res);
                    dynamic data1 = jObject["data"];

                    casedeatils.Columns.Add("Document Name");

                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(res);
                        //string status = data.Status;
                        casedeatils.Rows.Add(data.data[i]["vDescription"]);
                    }


                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_OppDocList" + date.Hour + date.Minute + date.Second + date.Millisecond;
                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    string msgbody = "";
                    string strsubject = "", strbody = "";
                    strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                    string userName = FindUserNameFromEmail(decodeRecName);
                    strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                    strbody = strbody.Replace("#User#", userName);
                    strbody = strbody.Replace("#Mark#", markName);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, decodeRecName, "", "", strsubject, strbody, fullpath);
                    }
                    catch (Exception ex)
                    {
                    }
                }
                catch (Exception er)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// Sending excel from IPR Opposition Detail.
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public void SendOppDetailListMail()
        {
            try
            {
                string markName = "Opposition Detail List";
                string Username = LoggedInUser.UserFullName;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationno = Request.Form["applNo"];
                var PageSize = "500";
                var PageNum = "1";

                string To = Request.Form["To"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                byte[] conVal2 = Convert.FromBase64String(To);
                string decodeRecName = Encoding.UTF8.GetString(conVal2);
                try
                {
                    DataTable casedeatils = new DataTable();
                    string userId1 = userId;
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId1;
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        vApplNo = applicationno,
                        PageNum = PageNum,
                        Pagesize = PageSize
                    };

                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPROppositionDetails"), "POST", builders);

                    dynamic jObject = JObject.Parse(res);
                    dynamic data1 = jObject["data"];

                    casedeatils.Columns.Add("Application No.");
                    casedeatils.Columns.Add("Opponent Name");
                    casedeatils.Columns.Add("Opponent Address");
                    casedeatils.Columns.Add("Opposition No.");
                    casedeatils.Columns.Add("Opponent Code");
                    casedeatils.Columns.Add("Opposition Date");
                    casedeatils.Columns.Add("Attorney Name");
                    casedeatils.Columns.Add("Attorney Address");
                    casedeatils.Columns.Add("Status");
                    casedeatils.Columns.Add("Decision");

                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(res);
                        casedeatils.Rows.Add(data.data[i]["vApplNo"], data.data[i]["vOpponentName"], data.data[i]["vOpponentAddress"], data.data[i]["vOppositionNo"], data.data[i]["vOpponentCode"],
                            data.data[i]["vOppositionDate"], data.data[i]["vAttorneyName"], data.data[i]["vAttorneyAddress"], data.data[i]["vStatus"], data.data[i]["vDecision"]);
                    }


                    DateTime date = DateTime.Now;
                    string exlfilename = "IPR_OppDocList" + date.Hour + date.Minute + date.Second + date.Millisecond;
                    var gv = new GridView();
                    gv.DataSource = casedeatils;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = Color.Gray;
                    gv.HeaderStyle.ForeColor = Color.White;
                    Response.ClearContent();
                    Response.Buffer = true;
                    Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                    Response.ContentType = "application/ms-excel";
                    Response.Charset = "";
                    StringWriter objStringWriter = new StringWriter();
                    HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                    gv.RenderControl(objHtmlTextWriter);
                    //Response.Output.Write(objStringWriter.ToString());

                    var path = Server.MapPath("~/Documents/IPRDetailsDocs/" + firmId + "/" + userId + "/");
                    var filename = exlfilename + ".xls";
                    var fullpath = path + filename;

                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    System.IO.File.WriteAllText(fullpath, objStringWriter.ToString());
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();

                    string msgbody = "";
                    string strsubject = "", strbody = "";
                    strsubject = "Regarding" + " " + markName + " " + "Details from Mykase.";
                    string userName = FindUserNameFromEmail(decodeRecName);
                    strbody = ConfigurationManager.AppSettings["EmailIPRPropDetails"];
                    strbody = strbody.Replace("#User#", userName);
                    strbody = strbody.Replace("#Mark#", markName);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, decodeRecName, "", "", strsubject, strbody, fullpath);
                    }
                    catch (Exception ex)
                    {
                    }
                }
                catch (Exception er)
                {
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// Export to Excel for View shared Trademark Page
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void DownloadPhoneticAlertDetail()
        {

            string imagePath = ConfigurationManager.AppSettings["tradeImagePath"];
            var applicationno = QueryAES.UrlDecode(HttpContext.Request.QueryString["phVapplNo"]);
            string pagesize1 = HttpContext.Request.QueryString["pagesize1"];
            string pagenum = HttpContext.Request.QueryString["pagenum"];
            applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            DataTable dt = new DataTable();
            var ds1 = DataAccessIPRADO.ExportPhoneticallySimilarTrademark(firmId, userId, applicationno, pagenum, pagesize1);

            try
            {
                DataTable casedeatils = new DataTable();
                string exlfilename = "Similartrademark_" + DateTime.Now.ToString("dd-MMMM-yyyy");
                int pageid = 0;
                casedeatils.Columns.Add("Mark");
                casedeatils.Columns.Add("SimilarMark");
                casedeatils.Columns.Add("ApplicationNo");
                casedeatils.Columns.Add("Class");
                casedeatils.Columns.Add("Proprietor name");
                casedeatils.Columns.Add("Journal number");
                casedeatils.Columns.Add("Status");
                casedeatils.Columns.Add("Image");

                for (int i = 0; i < ds1.Rows.Count; i++)
                {
                    var trdImage = "";
                    if (!String.IsNullOrEmpty((ds1.Rows[i].ItemArray[7]).ToString()))
                    {
                        trdImage = $"<img src='{imagePath}{ds1.Rows[i].ItemArray[6]}/{ds1.Rows[i].ItemArray[7]}' width='80' height='60' />";
                    }
                    else
                    {
                        trdImage = "";
                    }

                    casedeatils.Rows.Add(
                        ds1.Rows[i].ItemArray[3], ds1.Rows[i].ItemArray[4], ds1.Rows[i].ItemArray[5], ds1.Rows[i].ItemArray[6], ds1.Rows[i].ItemArray[8], ds1.Rows[i].ItemArray[9], ds1.Rows[i].ItemArray[10], trdImage
                        );
                }

                var gv = new GridView();
                gv.DataSource = casedeatils;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;

                foreach (GridViewRow row in gv.Rows)
                {
                    //gv.Attributes.Add("style", "border-collapse:collapse;");
                    //gv.RowStyle.Height = Unit.Pixel(65);
                    //row.Cells[4].Text = Server.HtmlDecode(row.Cells[4].Text); // 9 = Image column index
                    gv.Attributes.Add("style", "border-collapse:collapse;");
                    gv.RowStyle.Height = Unit.Pixel(65);

                    if (string.IsNullOrWhiteSpace(row.Cells[7].Text) || row.Cells[7].Text == "&nbsp;")
                    {
                        row.Cells[7].Text = "";
                    }
                    else
                    {
                        row.Cells[7].Text = Server.HtmlDecode(row.Cells[7].Text);
                    }
                }
                
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
        }

    }
}

