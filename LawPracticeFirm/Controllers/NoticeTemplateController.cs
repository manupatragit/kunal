using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Helpers;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using NoticeManagement.BusinessLayer.BusinessEntity;
using QueryStringEDAES;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace NoticeManagement.Controllers
{
    public class NoticeTemplateController : BaseFirmController
    {
        private static readonly object pdfLock = new object();
        /// <summary>
        /// Get bulk notice list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult BulkNotice()
        {
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Get notice shared to me
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult NoticeSharedToMe()
        {
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Get notice list shared to me
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult NoticeListSharedToMe()
        {
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Get bulk notice shared to me
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult NoticeBulkSharedToMe()
        {
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Get temp bulk list shared to me
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult BulkTempListSharedToMe()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var searchvalue = QueryAES.UrlDecode(Request.Form["SearchValue"]);
            var pagenumber = QueryAES.UrlDecode(Request.Form["PageNumber"]);
            var pagesize = QueryAES.UrlDecode(Request.Form["PageSize"]);
            var NoticeId = QueryAES.UrlDecode(Request.Form["NoticeId"]);
            LawPracticeEntities db = new LawPracticeEntities();
            dynamic result = null;
            try
            {
                 result = db.sp_ExceTemplateListByUserId(loginuserid, firmid, searchvalue,Convert.ToInt16(pagenumber), Convert.ToInt16(pagesize), NoticeId);
            }
            catch
            {
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Remove bulk record from excel
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult RemoveExcelBulkRecord()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var excelfileid = QueryAES.UrlDecode(Request.Form["excelfileid"]);
            LawPracticeEntities db = new LawPracticeEntities();
            var output = new Message();
            try
            {
                var result = db.sp_RemoveNoticeRecordsUploadByExcel(excelfileid, firmid, loginuserid);
                if (result>0)
                {
                    output.status = true;
                    output.message = "Record removed successfully.";
                }
            }
            catch
            {
                output.status = false;
                output.message = "Something went wrong.";
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Send mail in bulk
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult sendmailInBulk()
        {
            var excelfileid = QueryAES.UrlDecode(Request.Form["excelfileid"]);
            var loginId = LoggedInUser.UserId.ToString();
            var db = new LawPracticeEntities();
            var output = new Message();
            try
            {
                var result = db.sp_saveRecordIntbl_MailForBulk(excelfileid, loginId);
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Request generated successfully,it will take maximum 30 minutes to complete.";
                }
            }
            catch
            {
                output.status = false;
                output.message = "Something went wrong.";
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get template list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult TemplateList()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var pagenumber = QueryAES.UrlDecode(Request.Form["pageindex"]);
            var pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
            LawPracticeEntities db = new LawPracticeEntities();
            var list = db.sp_GetTemplateList(Convert.ToInt32(pagenumber), Convert.ToInt32(pagesize), Convert.ToInt32(roleid), firmid, loginuserid);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Create new template
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CreateTemplate()
        {
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        public class TranslationResponse
        {
            public string translated_content { get; set; }
            public string target_language { get; set; }
        }
        /// <summary>
        /// Add/Update template
        /// </summary>
        /// <returns></returns>
        [HttpPost, ValidateInput(false)]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddUpdateTemplate()
        {
            var output = new Message();
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var CreateNotice = QueryAES.UrlDecodeEditor(Request.Form["CreateNotice"]);
            var target_Language = QueryAES.UrlDecode(Request.Form["target_Language"]);
            DataTable dt = new DataTable();
            //Calling for translator
            //var addfClient = new WebClientConnection();
            //addfClient.Encoding = Encoding.UTF8;

            //var apiUrl = "http://10.60.9.161:8080/translate";
            //var requestBody = new
            //{
            //    text = CreateNotice,
            //    language = target_Language
            //};
            //addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            //string builders = JsonConvert.SerializeObject(requestBody);
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            //string resid = addfClient.UploadString(new Uri(apiUrl), "POST", builders);
            //var responseObj = JsonConvert.DeserializeObject<TranslationResponse>(resid);
            //string finalText = responseObj.translated_content;

            var txttemplatename = QueryAES.UrlDecode(Request.Form["txttemplatename"]);


            var hidden = QueryAES.UrlDecode(Request.Form["hidden"]);
            LawPracticeEntities db = new LawPracticeEntities();
            //var result = db.sp_AddTemplate(loginuserid, firmid, CreateNotice, txttemplatename, hidden);
            //var result = db.sp_AddTemplate(loginuserid, firmid, finalText, txttemplatename, hidden, target_Language);
            dt = DataAccessIPRADO.sp_AddTemplate(loginuserid, firmid, CreateNotice, txttemplatename, hidden, target_Language);
            //if (result > 0)
            //{
                output.status = true;
                output.message = "Record saved successfully.";
            //}
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Remove template from list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult RemoveTemplate()
        {
            var output = new Message();
            var templateid = QueryAES.UrlDecode(Request.Form["templateid"]);
            LawPracticeEntities db = new LawPracticeEntities();
            var result = db.sp_RemoveTemplate(templateid);
            if (result > 0)
            {
                output.status = true;
                output.message = "Record removed successfully.";
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get template details by Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult TemplateDataById()
        {
            dynamic result = null;
            var templateid = QueryAES.UrlDecode(Request.Form["templateid"]);
            LawPracticeEntities db = new LawPracticeEntities();
            try {
                //result = db.sp_GetTemplatedataById(templateid);
                var result1 = DataAccessIPRADO.sp_GetTemplatedataById(templateid);
                var convertedD = JsonConvert.SerializeObject(result1);
                result = JsonConvert.DeserializeObject<List<GetTemplatedataById_Result>>(convertedD);
            }
            catch(Exception ex)
            {
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get template list for dropdown
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult GetTemplateForddl()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var result = db.sp_GetTemplate(firmid);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Post bulk notice
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PostBulkNotice()
        {
            var output = new Message();
            var SelfCreateTempLateId = QueryAES.UrlDecode(Request.Form["selfcreatednoticeid"]);
            var noticetype = QueryAES.UrlDecode(Request.Form["noticetype"]);
            var noticetitle = QueryAES.UrlDecode(Request.Form["noticetitle"]);
            //var TemplateLanguage= QueryAES.UrlDecode(Request.Form["TempLanguage"]);

            var VarthanaCustomizationFirmId = ConfigurationManager.AppSettings["VarthanaBulkUploadCustomization"];
            var db = new LawPracticeEntities();
            var chknotice1 = db.usp_CheckNoticeTitleExist(LoggedInUser.FirmId.ToString(), noticetitle.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString(), "BulkNotice","","").FirstOrDefault();
            if (chknotice1 == 1)
            {
                output.message = "Already exist title name. please try another title name";
                output.status = true;
                return Json(output, JsonRequestBehavior.AllowGet);
            }
            HttpFileCollectionBase postedFile1 =Request.Files;
            if (postedFile1 != null)
            {
                string FileName = "";
                string filePath = string.Empty;
                string extension = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFileBase file = files[i];
                    string fname;
                    // Checking for Internet Explorer    
                    if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                    {
                        string[] testfiles = file.FileName.Split(new char[] { '\\' });
                        fname = testfiles[testfiles.Length - 1];
                    }
                    else
                    {
                        fname = file.FileName;
                        FileName = file.FileName;
                    }
                    extension = Path.GetExtension(FileName);
                    string path1 = Server.MapPath("~/Upload12s/");
                    if (!Directory.Exists(path1))
                    {
                        Directory.CreateDirectory(path1);
                    }
                    filePath = path1 + Path.GetFileNameWithoutExtension(fname);
                    // Get the complete folder path and store the file inside it.    
                    file.SaveAs(filePath);
                    string conString = string.Empty;
                    switch (extension)
                    {
                        case ".xls": //Excel 97-03.
                            conString = ConfigurationManager.ConnectionStrings["Excel03ConString"].ConnectionString;
                            break;
                        case ".xlsx": //Excel 07 and above.
                                      // conString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath + ";Extended Properties=Excel 12.0;'";
                            conString = ConfigurationManager.ConnectionStrings["Excel07ConString"].ConnectionString;
                            break;
                    }
                    DataTable dt = new DataTable();
                    conString = string.Format(conString, filePath);
                    using (OleDbConnection connExcel = new OleDbConnection(conString))
                    {
                        using (OleDbCommand cmdExcel = new OleDbCommand())
                        {
                            using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                            {
                                cmdExcel.Connection = connExcel;
                                //Get the name of First Sheet.
                                connExcel.Open();
                                DataTable dtExcelSchema;
                                dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                                string sheetName = dtExcelSchema.AsEnumerable()
                                .Select(r => r.Field<string>("TABLE_NAME"))
                                .Where(name => name.EndsWith("$") || name.EndsWith("$'"))
                                .FirstOrDefault();
                                //dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                                connExcel.Close();
                                //Read Data from First Sheet.
                                connExcel.Open();
                                cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                                odaExcel.SelectCommand = cmdExcel;
                                odaExcel.Fill(dt);
                                if ((dt.Rows.Count >= 1 || dt.Columns.Count >= 1) && !dt.Columns.Contains("F1"))                                
                                {
                                }
                                else
                                {
                                    output.message = "File can't be empty.";
                                    output.message = "File can't be empty.";
                                    output.status = false;
                                    return Json(output, JsonRequestBehavior.AllowGet);
                                }
                                if (dt.Rows.Count > 5000)
                                {
                                    output.message = "File can't contains more than 5k records.";
                                    output.status = false;
                                    return Json(output, JsonRequestBehavior.AllowGet);
                                }
                                connExcel.Close();
                                string JSONresult;
                                var filteredRows = dt.Rows.Cast<DataRow>().Where(row => !row.ItemArray.All(field =>field == null || string.IsNullOrWhiteSpace(field.ToString()))).ToList();
                                dt = filteredRows.CopyToDataTable();

                                if (!dt.Columns.Contains("ReceiverEmail"))
                                {
                                    output.message = "Please upload the Excel file in the correct format.";
                                    output.status = false;
                                    return Json(output, JsonRequestBehavior.AllowGet);
                                }

                                JSONresult = JsonConvert.SerializeObject(dt);
                                try
                                {
                                    var firmid = LoggedInUser.FirmId.ToString();
                                    var loginuserid = LoggedInUser.UserId.ToString();
                                    var roleid = LoggedInUser.RoleId.ToString();
                                    string id = "";
                                    ObjectParameter RetunVal;
                                    RetunVal = new ObjectParameter("resultid", id);
                                    var outputforsavebulknotice = db.usp_AddBulkNotices("", fname, JSONresult, firmid, loginuserid, RetunVal, noticetitle);
                                    id = Convert.ToString(RetunVal.Value);
                                    if (outputforsavebulknotice > 0)
                                    {
                                        foreach (DataColumn item in dt.Columns)
                                        {
                                            try
                                            {
                                                string id1 = "";
                                                ObjectParameter RetunVal1;
                                                RetunVal1 = new ObjectParameter("resultid", id1);
                                                if (item.ColumnName != "ReceiverEmail" && item.ColumnName!= "MobileNo")
                                                {
                                                    db.usp_AddBulkNoticesHeader("", item.ColumnName, id, firmid, loginuserid, RetunVal1);
                                                }
                                            }
                                            catch
                                            {
                                                continue;
                                            }
                                        }
                                        JavaScriptSerializer serializer = new JavaScriptSerializer();
                                        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                                        Dictionary<string, object> row;
                                        var receiverEmail = "";
                                        var LoanId = "";
                                        var receiverMob = "";
                                        foreach (DataRow dr in dt.Rows)
                                        {
                                            row = new Dictionary<string, object>();
                                            foreach (DataColumn col in dt.Columns)
                                            {
                                                var f = col.DataType;
                                                if (col.ColumnName != "ReceiverEmail" && col.ColumnName!="MobileNo")
                                                {
                                                    row.Add(col.ColumnName, dr[col].ToString());
                                                }
                                                if (col.ColumnName == "ReceiverEmail")
                                                {
                                                    receiverEmail = dr[col].ToString();
                                                }
                                                if (col.ColumnName == "MobileNo")
                                                {
                                                    receiverMob = dr[col].ToString();
                                                }
                                                if(firmid.ToLower() == VarthanaCustomizationFirmId.ToLower())
                                                {
                                                    if (col.ColumnName.ToLower() == "loan id" || col.ColumnName.ToLower() == "loanid")
                                                    {
                                                        LoanId = dr[col].ToString();
                                                    }
                                                }
                                            }
                                            var rowval = serializer.Serialize(row);
                                            try
                                            {
                                                string id1 = "";
                                                ObjectParameter RetunVal1;
                                                RetunVal1 = new ObjectParameter("resultid", id1);
                                                string returnId;
                                                //var saveindraftnoticetable = db.usp_AddBulkNoticesByExcelUpload("", "[" + rowval + "]", firmid, loginuserid,
                                                //                                            "", id, SelfCreateTempLateId, RetunVal, noticetype, receiverEmail);

                                                var saveindraftnoticetable1 = DataAccessIPRADO.AddBulkNoticesByExcelUpload("", "[" + rowval + "]", firmid, loginuserid,
                                                                                            "", id, SelfCreateTempLateId, out returnId, noticetype, receiverEmail, receiverMob, LoanId);
                                            }
                                            catch
                                            {
                                                continue;
                                            }
                                        }
                                        //save on map file
                                        dynamic postedFiledata = "";
                                        var myList = new List<string>();
                                        var httpRequest = Request.Files;
                                        string _FileName = "";
                                        string uniqfile = "";
                                        string _path1 = "";
                                        long DocSize = 0;
                                        if (httpRequest.Count > 0)
                                        {
                                            var docfiles = new List<string>();
                                            string folderPath = HttpContext.Server.MapPath("~/Documents/BulkNoticeExcelDocument/" + firmid + "/" + loginuserid + "/");
                                            string folderpathazure = "Documents/BulkNoticeExcelDocument/" + firmid + "/" + loginuserid;
                                            //Check whether Directory (Folder) exists.
                                            if (!Directory.Exists(folderPath))
                                            {
                                                //If Directory (Folder) does not exists. Create it.
                                                Directory.CreateDirectory(folderPath);
                                            }
                                            for (int j = 0; j < httpRequest.Count; j++)
                                            {
                                                _FileName = Path.GetFileName(HttpContext.Request.Files[j].FileName);
                                                {
                                                    var postedFile = httpRequest[j];
                                                    var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                                    var fileext = Path.GetExtension(postedFile.FileName);
                                                    var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
                                                    var filePathExcelTemplate = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                                    var fileextchk = Path.GetExtension(postedFile.FileName);
                                                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                                    postedFile.SaveAs(filePathExcelTemplate);
                                                    FileInfo fi = new FileInfo(filePathExcelTemplate);
                                                    DocSize = fi.Length;
                                                    docfiles.Add(filePathExcelTemplate);
                                                    string input = filePathExcelTemplate;
                                                    string tempflname = fileName1;
                                                    tempflname = tempflname.Remove(0, 10);
                                                    myList.Add(tempflname);
                                                    string outputexcelsave = folderPath + Path.GetFileName(tempflname);
                                                    QueryAES.FileEncrypt(input, outputexcelsave);
                                                    //delete file
                                                    try
                                                    {
                                                        var status = AzureDocumentself.filecreateafteredit(outputexcelsave, folderpathazure, Path.GetFileName(tempflname), null, null);
                                                        var kk = Path.GetFileName(tempflname);
                                                    }
                                                    catch (Exception er)
                                                    {
                                                        AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                                        var status = AzureDocumentself.filecreateafteredit(outputexcelsave, folderpathazure, Path.GetFileName(tempflname), null, null);
                                                    }
                                                    try
                                                    {
                                                        System.IO.File.Delete(input);
                                                    }
                                                    catch (Exception ex)
                                                    {
                                                        //  throw ex;
                                                    }
                                                    try
                                                    {
                                                        System.IO.File.Delete(outputexcelsave);
                                                    }
                                                    catch (Exception ex)
                                                    {
                                                        // throw ex;
                                                    }
                                                }
                                            }
                                        }
                                        var filearray = myList.ToArray();
                                        postedFiledata = string.Join("/", filearray);
                                        if (postedFiledata != "")
                                        {
                                            string[] values1 = postedFiledata.Split('/');
                                            for (int j = 0; j < values1.Length; j++)
                                            {
                                                values1[j] = values1[j].Trim();
                                                var chkout = db.Usp_SaveMultipleFileMap(firmid, loginuserid, id.ToString(), values1[j], "BulkNoticeExcelDocument", DocSize.ToString());
                                            }
                                        }
                                        //map to document mgmt create folder
                                        if (!string.IsNullOrEmpty(id))
                                        {
                                            //save to document management    
                                            var dataresult = CommonDocIntegration.DocUploadBulkNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, "Bulk Notice", noticetitle, "","","","");
                                        }
                                        output.message = id;
                                        output.status = true;
                                    }
                                }
                                catch(Exception ex)
                                {
                                    output.message = ex.Message;
                                    output.status = false;
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                output.message = "Please choose a file";
                output.status = false;
            }
            return Json(output,JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Remove records from notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult RemoveRecordFromExcelNotice()
        {
            var output = new Message();
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var noticeid = QueryAES.UrlDecode(Request.Form["noticeid"]).ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            try
            {
                var result = db.sp_removenoticefromexcel(noticeid, loginuserid);
                if (result > 0)
                {
                    output.message = "Record removed successfully.";
                }
            }
            catch (Exception ex)
            {
                output.message = ex.Message;
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get bulk temp list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult BulkTempList()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var searchvalue = QueryAES.UrlDecode(Request.Form["SearchValue"]);
            var Searchtitle = QueryAES.UrlDecode(Request.Form["Searchtitle"]);
            var pagenumber = QueryAES.UrlDecode(Request.Form["PageNumber"]);
            var pagesize = QueryAES.UrlDecode(Request.Form["PageSize"]);
            LawPracticeEntities db = new LawPracticeEntities();
            //var list = db.usp_GetBulkTemplateList(loginuserid, searchvalue, Convert.ToInt32(pagenumber), Convert.ToInt32(pagesize), Convert.ToInt32(roleid), firmid, Searchtitle);
            var list = DataAccessADO.usp_GetBulkTemplateList(loginuserid, searchvalue, Convert.ToInt32(pagenumber), Convert.ToInt32(pagesize), Convert.ToInt32(roleid), firmid, Searchtitle);
            var listDetails = JsonConvert.DeserializeObject<List<GetBulkNoticeListModal>>(list);

            return Json(listDetails, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ShowAttachedTemplate()
        {
            var selfTemplateId = QueryAES.UrlDecode(Request.Form["SelfTemplateId"]);
            var tempContent = DataAccessADO.GetAttachedTemplate(selfTemplateId);
            var listDetails = JsonConvert.DeserializeObject<List<dynamic>>(tempContent);
            //var data = listDetails[0].TemplateContent;
            //return Json(new { content = data }, JsonRequestBehavior.AllowGet);

            tempContent = tempContent.Trim('{', '}');
            return Json(new { html = tempContent }, JsonRequestBehavior.AllowGet);
        }

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult BulkNoticeList()
        {
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            return View();
        }
        /// <summary>
        /// Get bulk notice details by template id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult BulkNoticeListByTemplateId()
        {
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var roleid = LoggedInUser.RoleId.ToString();
            var searchvalue = QueryAES.UrlDecode(Request.Form["SearchValue"]);
            var pagenumber = QueryAES.UrlDecode(Request.Form["PageNumber"]);
            var pagesize = QueryAES.UrlDecode(Request.Form["PageSize"]);
            var maintemplateid = QueryAES.UrlDecode(Request.Form["maintemplateid"]);
            var notistatus = QueryAES.UrlDecode(Request.Form["notistatus"]);
            var NoticeId = QueryAES.UrlDecode(Request.Form["NoticeId"]);
            LawPracticeEntities db = new LawPracticeEntities();
            if(!String.IsNullOrEmpty(NoticeId))
            {
                maintemplateid = db.usp_GetBulkNoticeById(LoggedInUser.FirmId.ToString(),LoggedInUser.UserId.ToString(),NoticeId).Select(x=>x.MainTemplateId).FirstOrDefault();
            }
            var list1 = db.usp_GetNoticeHeaderList(maintemplateid);
            var list2 = db.usp_GetBulkNoticeList(loginuserid, searchvalue, Convert.ToInt32(pagenumber), Convert.ToInt32(pagesize), 
                                                Convert.ToInt32(roleid), firmid, maintemplateid, notistatus, NoticeId);
            ArrayList output = new ArrayList();
            output.Add(list1);
            output.Add(list2);
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get template header details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult GetTemplateHeader()
        {
            var maintemplateid = QueryAES.UrlDecode(Request.Form["maintemplateid"]);
            LawPracticeEntities db = new LawPracticeEntities();
            var list1 = db.usp_GetNoticeHeaderList(maintemplateid);
            return Json(list1, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Generate random number details
        /// </summary>
        /// <returns></returns>
        public string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }
        /// <summary>
        /// Print bulk notice
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PrintNotice()
        {
            var maintemplateid = QueryAES.UrlDecode(Request.Form["MainTemplateId"]);
            var currentnoticeid = QueryAES.UrlDecode(Request.Form["noticeid"]);
            var selftemplateid = QueryAES.UrlDecode(Request.Form["selftemplateid"]);
            var templatecontent = QueryAES.UrlDecode(Request.Form["templatecontent"]);
            var Filextension = QueryAES.UrlDecode(Request.Form["Filextension"]);
            var loggedInUserId= LoggedInUser.FirmId.ToString();
            var VarthanaCustomizationFirmId = ConfigurationManager.AppSettings["VarthanaNoticeDocByLoanIdFirmId"];

            LawPracticeEntities db = new LawPracticeEntities();
            var isnoticeexist = db.sp_checknoticepathexist(currentnoticeid, Filextension).FirstOrDefault();
            if (string.IsNullOrEmpty(isnoticeexist))
            {
                var templdatecontent = db.sp_GetTemplatedataById(selftemplateid).FirstOrDefault();
                var myDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(templatecontent);
                var templatehtml = "";
                var pffth = "";
                var returnpath = "";
                //templatehtml = "<!DOCTYPE html>";
                //templatehtml += "<html>";
                //templatehtml += "<head>";
                //templatehtml += "<meta charset='UTF-8' />";   // important for Unicode
                //templatehtml += "<style>";
                //templatehtml += "@font-face { font-family: 'NotoSans'; src: url('C:/Windows/Fonts/NotoSansDevanagari-Regular.ttf') format('truetype'); }";
                //templatehtml += "body { font-family: 'NotoSans', sans-serif; }";
                //templatehtml += "</style>";
                //templatehtml += "</head>";
                //templatehtml += "<body>";
                //templatehtml += "<p>Dated: " + DateTime.Now.ToString("dd-MM-yyyy") + "</p>";

                //// Append your template content
                //templatehtml += templdatecontent.TemplateContent;

                //templatehtml += "</body></html>";

                string header1 = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                "xmlns:w='urn:schemas-microsoft-com:office:word' " +
               "xmlns='https://www.w3.org/TR/REC-html40'>" +
               "<head><meta charset='utf-8'><title>pdf</title></head><body>";
                string footer1 = "</body></html>";


                templatehtml += "<p>" + "Dated:" + DateTime.Now + "</p>";
                templatehtml = templdatecontent.TemplateContent;
                templatehtml = header1 + templdatecontent.TemplateContent + footer1;

                foreach (var key in myDictionary.Keys)
                {
                    var resultdata = myDictionary[key];
                    try
                    {
                        DateTime.Parse(myDictionary[key]);
                        if (myDictionary[key].Contains("12:00:00 AM"))
                        {
                            resultdata= Convert.ToDateTime(myDictionary[key]).ToString("dd-MMM-yyyy");
                        }
                    }
                    catch
                    {
                    }
                    templatehtml = templatehtml.Replace("#" + key + "#", resultdata);
                }
                string filename = string.Empty;
                if (loggedInUserId.ToLower() == VarthanaCustomizationFirmId.ToLower())
                {
                    var docFileName= DataAccessIPRADO.GetLoanIdBasedOnFirmIdAndNoticeId(loggedInUserId, currentnoticeid);
                    var docName = docFileName.Rows[0][0];
                    filename = docName + "_" + randomno();
                }
                else
                {
                    filename = "DraftCopy_" + randomno();
                }
               
                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/BulkNoticeDraft/DraftNotice/" + LoggedInUser.FirmId.ToString() + "/"+LoggedInUser.UserId.ToString()+"/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.CustomWkHtmlArgs = "--encoding utf-8 --enable-local-file-access";
                //NReco.PdfGenerator.HtmlToPdfConverter htmlToPdf = null;
                //lock (pdfLock)
                //{
                //    htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                //    htmlToPdf.CustomWkHtmlArgs = "--encoding utf-8";
                //}

                //Added by umesh on 6 may 22 
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                if (Filextension == "doc")
                {
                    string header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                 "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                "xmlns='https://www.w3.org/TR/REC-html40'>" +
                "<head><meta charset='utf-8'><title>OCR DOCS</title></head><body>";
                    string footer = "</body></html>";
                    templatehtml = header + templatehtml + footer;
                    string content = templatehtml;
                     pffth = folderPath + filename + ".doc";
                    System.IO.File.WriteAllText(pffth, content, Encoding.UTF8);
                }
                else
                {
                     var pdfBytes = htmlToPdf.GeneratePdf(templatehtml);
                      pffth = folderPath + filename + ".pdf";
                     System.IO.File.WriteAllBytes(pffth, pdfBytes);
                }
                var folderpathazure = "";
                try
                {
                    folderpathazure = "Documents/BulkNoticeDraft/DraftNotice/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString();
                    folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                    string fakepathout = "azuredirout/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString();
                    if (!(Directory.Exists(Server.MapPath("~/" + fakepathout))))
                    {
                        Directory.CreateDirectory(Server.MapPath("~/" + fakepathout));
                    }
                    var input = pffth;
                    FileInfo fi = new FileInfo(input);
                    string outputs = Server.MapPath("~/" + fakepathout + "/" + fi.Name);
                    QueryAES.FileEncrypt(input, outputs);
                    try
                    {
                        var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                    }
                    catch (Exception er)
                    {
                        AzureDocumentself.CreateNestedDirectory(folderpathazure);
                        var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                    }
                }
                catch (Exception er)
                {
                }
                if (Filextension == "doc")
                {
                     returnpath = folderpathazure + "/" + filename + ".doc";
                }
                else
                {
                     returnpath = folderpathazure+"/" + filename + ".pdf";
                }
                try
                {
                    db.sp_updatenoticepath(currentnoticeid, returnpath);
                }
                catch
                {
                }
                return Json(currentnoticeid, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(currentnoticeid, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get string based on position
        /// </summary>
        /// <param name="Text"></param>
        /// <param name="FirstString"></param>
        /// <param name="LastString"></param>
        /// <returns></returns>
        public string Between(string Text, string FirstString, string LastString)
        {
            string STR = Text;
            string STRFirst = FirstString;
            string STRLast = LastString;
            string FinalString;
            string TempString;
            int Pos1 = STR.IndexOf(FirstString) + FirstString.Length;
            int Pos2 = STR.IndexOf(LastString);
            FinalString = STR.Substring(Pos1, Pos2 - Pos1);
            return FinalString;
        }
        /// <summary>
        /// Download notice in bulk
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public async Task<string> downloadNoticesInBulk()
        {
            var maintemplateid = QueryAES.UrlDecode(Request.Form["MainTemplateId"]);
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var bulkDraftCompressedCls = new BulkDraftCompressed();
            var data = "Processing..,please wait it will take some time.......";
            await bulkDraftCompressedCls.downloadNoticesInBulk(maintemplateid, firmid, loginuserid);
            return data;
        }
        #region send draft on mail
        /// <summary>
        /// Send draft through mail
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult sendDraftOnMail()
        {
            Message output = new Message();
            var noticeId = QueryAES.UrlDecode(Request.Form["Id"]);
            var receiverEmaill = QueryAES.UrlDecode(Request.Form["receiverEmaill"]);
            var loggedInUserName = LoggedInUser.UserName.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var list1 = db.sp_getDataByBulkNoticeId(noticeId, receiverEmaill).ToList();
            if (list1.Count > 0)
            {
                foreach (var item in list1)
                {
                    var receiveremailval = item.ReceiverEmail;
                    var draftpath = item.DraftNoticePath;
                    var firmid = item.FirmId;
                    var userid = item.CreatedBy;
                    var Noticetitle = item.Noticetitle;
                    var firmContactEmail = item.firmContactEmail;
                    var FirmName = item.FirmName;
                    var FirmAddress1 = item.FirmAddress1;
                    var Id = item.Id;
                    if (String.IsNullOrEmpty(receiveremailval))
                    {
                        output.message = "EmptyEmail";
                        output.status = true;
                        return Json(output, JsonRequestBehavior.AllowGet);
                    }
                    var receiveremailsplit = receiveremailval.Split(',');
                    if (string.IsNullOrEmpty(draftpath))
                    { 
                        var isnoticeexist = db.sp_checknoticepathexist(noticeId,"").FirstOrDefault();
                        if (string.IsNullOrEmpty(isnoticeexist))
                        {
                            draftpath= CommanNotice.DownloadBulkDraftFile(firmid, userid, noticeId);
                        }
                    }
                    var filefromazure = draftHardCopy(draftpath, firmid, userid);
                    try
                    {
                       var firmContactEmail1 = db.GetFirmAdminCommunicationEMail(firmid, userid).Select(x => x.Email).FirstOrDefault();
                        if (!String.IsNullOrEmpty(firmContactEmail1))
                        {
                            firmContactEmail = firmContactEmail1;
                        }
                    }
                    catch
                    {
                    }
                    foreach (var item1 in receiveremailsplit)
                    {
                        try
                        {
                            var mail = mailForBulkNotice(item1, Noticetitle, firmContactEmail, FirmName, FirmAddress1, filefromazure, Id.ToString(), "FromNotice", "","", loggedInUserName);
                            if (mail == "Sent")
                            {
                                db.sp_UpdateMailSentStatusByNoticeId(Id);
                                output.message = "mail sent successfully.";
                                output.status = true;
                            }
                        }
                        catch (Exception ex)
                        {
                            output.message = ex.Message;
                            output.status = false;
                            continue;
                        }
                    }
                }
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        #endregion
        /// <summary>
        /// Draft hard copy
        /// </summary>
        /// <param name="noticedraftpath"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string draftHardCopy(string noticedraftpath, string firmid, string userid)
        {
            string downloadpathnew = "";
            var fullpath = "";
            var fullpath2 = "";
            var filename = "";
            if (noticedraftpath != null)
            {
                var azuredirinpath = "~/azuredirin/" + firmid + "/" + userid;
                var azuredirout = "~/azuredirout/" + firmid + "/" + userid;
                fullpath = AppDomain.CurrentDomain.BaseDirectory + azuredirinpath;
                fullpath2 = AppDomain.CurrentDomain.BaseDirectory + azuredirout;
                if (!Directory.Exists(fullpath))
                {
                    Directory.CreateDirectory(fullpath);
                }
                if (!Directory.Exists(fullpath2))
                {
                    Directory.CreateDirectory(fullpath2);
                }
                downloadpathnew = noticedraftpath.TrimEnd('/').Remove(noticedraftpath.LastIndexOf('/') + 1).TrimEnd('/').TrimStart('/');
                filename = noticedraftpath.TrimEnd('/').Substring(noticedraftpath.LastIndexOf('/') + 1);
            }
            var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, filename, fullpath, fullpath2, firmid, userid);
            return outputs;
        }
        /// <summary>
        /// Send bulk notice mail
        /// </summary>
        /// <param name="email"></param>
        /// <param name="Noticetitle"></param>
        /// <param name="firmContactEmail"></param>
        /// <param name="FirmName"></param>
        /// <param name="FirmAddress1"></param>
        /// <param name="noticedraft"></param>
        /// <param name="Noticeid"></param>
        /// <param name="NoticeSource"></param>
        /// <param name="displayfilename"></param>
        /// <param name="contactNo"></param>
        /// <param name="loggedInUserName"></param>
        /// <returns></returns>
        public string mailForBulkNotice(string email, string Noticetitle, string firmContactEmail, string FirmName, string FirmAddress1, string noticedraft, string Noticeid, string NoticeSource, string displayfilename,string contactNo,string loggedInUserName)
        {
            var db = new LawPracticeEntities();
            string message = "";
            string fulladdress = FirmName + "<br/>" + FirmAddress1 +"<br/>"+contactNo+"<br/>"+firmContactEmail;
            string subjectline = "Notice Title: "+Noticetitle;
            message = WebConfigurationManager.AppSettings["NotificationEmailTemplate"].ToString();
            message = message.Replace("#CONTENT#", "Dear Sir/Madam <br/><br/>Please find attached the notice on behalf of "+ loggedInUserName+".");
            message = message.Replace("#SenderAddress#", fulladdress);
            string mail = "failed";
            string server = null;
            string port = null;
            server = WebConfigurationManager.AppSettings["EmailSMTP"].ToString();
            port = WebConfigurationManager.AppSettings["EmailPort"].ToString();
            string To = email;
            string EmailId = firmContactEmail;
            try
            {
                if (email.ToString().Trim() != "")
                {
                    string mailFrom = EmailId;
                    string mailFromName = EmailId;
                    string mailHost = server;
                    bool isSSLMail = false;
                    bool useDefaultMailCredentials = Convert.ToBoolean(false);
                    int smtpPort = Convert.ToInt32(port);
                    string regMailFromUserName = EmailId;
                    string regMailFromPassword = "";
                    System.Net.Mail.MailMessage mm = new System.Net.Mail.MailMessage();
                    System.Net.Mail.MailAddress mailFromAddress = new System.Net.Mail.MailAddress(mailFrom, mailFromName);
                    mm.To.Add(new System.Net.Mail.MailAddress(email));
                    mm.From = new System.Net.Mail.MailAddress(mailFromName);
                    mm.Subject = subjectline;// Subject;
                    string strbody = message;
                    mm.Body = strbody;
                    mm.IsBodyHtml = true;
                    System.Net.Mail.Attachment attachment;
                    attachment = new System.Net.Mail.Attachment(noticedraft);
                    mm.Attachments.Add(attachment);
                    attachment.Name = Noticetitle + ".doc";
                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                    smtp.Host = mailHost;
                    smtp.EnableSsl = isSSLMail;
                    System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential(regMailFromUserName, regMailFromPassword);
                    smtp.UseDefaultCredentials = useDefaultMailCredentials;
                    smtp.Credentials = NetworkCred;
                    smtp.Port = smtpPort;
                    smtp.Send(mm);
                    mail = "Sent";
                    db.sp_SaveMailAudit(Noticeid, mailFromName, email, mail, DateTime.Now, NoticeSource, displayfilename);
                }
            }
            catch
            {
                db.sp_SaveMailAudit(Noticeid, EmailId, email, "OnFailure", DateTime.Now, NoticeSource, displayfilename);
            }
            return mail;
        }
        #region check zip folder status
        /// <summary>
        /// Check zip file status
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult checkZipStatus()
        {
            var output = new Message();
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var noticeid = QueryAES.UrlDecode(Request.Form["maintemplateid"]).ToString();
            var db = new LawPracticeEntities();
            try
            {
                var result = db.sp_getZipPathVal(noticeid, firmid).FirstOrDefault();
                output.message = result;
            }
            catch (Exception ex)
            {
                output.message = ex.Message;
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        #endregion
        /// <summary>
        /// Remove Zip folder from location
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult removeZipFolder()
        {
            Message output = new Message();
            var maintemplateid = QueryAES.UrlDecode(Request.Form["maintemplateId"]);
            var firmid = LoggedInUser.FirmId.ToString();
            var loginuserid = LoggedInUser.UserId.ToString();
            var db = new LawPracticeEntities();
            var result = db.sp_getZipPathVal(maintemplateid, firmid).FirstOrDefault();
            try
            {
                db.sp_updateZipPathVal(maintemplateid, null);
                output.message = "Action performed successfully";
            }
            catch (Exception ex)
            {
                output.message = "Something went wrong";
            }
            if (!string.IsNullOrEmpty(result))
            {
                string startPath = HttpContext.Server.MapPath("~/ZipOut/" + firmid + "/" + maintemplateid);
                if (System.IO.File.Exists(startPath + ".zip"))
                {
                    try
                    {
                        System.IO.File.Delete(startPath + ".zip");
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }
        #region Save Notice Post Detail for bulk notice
        /// <summary>
        /// Post bulk notice details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult NoticePostDetail()
        {
            var paramnoticepostdate = QueryAES.UrlDecode(Request.Form["paramnoticepostdate"]);
            var paramtrakingId = QueryAES.UrlDecode(Request.Form["paramtrakingId"]);
            var paramnoticeid = QueryAES.UrlDecode(Request.Form["paramnoticeid"]);
            var consignmentnum = QueryAES.UrlDecode(Request.Form["consignmentnum"]);
            DateTime? noticeSendDate = null;
            if (!String.IsNullOrEmpty(paramnoticepostdate))
            {
                noticeSendDate = Convert.ToDateTime(paramnoticepostdate);
            }
            var db = new LawPracticeEntities();
            Message result = new Message();
            result.status = false;
            result.message = "";
            try
            {
                var output = db.sp_SaveNoticeSentDetailForBulk(paramnoticeid, noticeSendDate, consignmentnum, paramtrakingId).FirstOrDefault();
                if (output == 1)
                {
                    result.status = false;
                    result.message = "Tracking Id already exist.";
                }
                else if (output == 2)
                {
                    result.status = true;
                    result.message = "Record saved successfully.";
                }
                else if (output == 3)
                {
                    result.status = false;
                    result.message = "Something went wrong.";
                }
            }
            catch (Exception ex)
            {
                result.status = false;
                result.message = "Something went wrong.";
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion
        /// <summary>
        /// Set whatsup alert
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult SendWhatsUpInBulk()
        {
            var excelfileid = QueryAES.UrlDecode(Request.Form["excelfileid"]);
            var loginId = LoggedInUser.UserId.ToString();
            var db = new LawPracticeEntities();
            var output = new Message();

            try
            {
                //var result = db.sp_saveRecordIntbl_MailForBulk(excelfileid, loginId);
                var ds1 = DataAccessIPRADO.SaveForBulkWhatsUp(excelfileid, loginId);
                //if (ds1 > 0)
                //{
                output.status = true;
                output.message = "Request generated successfully,it will take maximum 30 minutes to complete.";
                //}
            }
            catch
            {
                output.status = false;
                output.message = "Something went wrong.";
            }
            return Json(output, JsonRequestBehavior.AllowGet);
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult BulNoticeWhatsAppSentDetail()
        {
            return View();
        }
        /// <summary>
        /// Show send whatsApp alert log
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewWhatsAppSendAlertHistory()
        {
            DataTable dt = new DataTable();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userID = LoggedInUser.UserId.ToString();
                var MobileNo = QueryAES.UrlDecode(Request.Form["MobileNo"]);
                var pagenumber = QueryAES.UrlDecode(Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
                dt = DataAccessIPRADO.ShowWhatsAppAlertLog(firmid, userID, MobileNo, pagenumber, pagesize);

            }
            catch (Exception ex)
            {
            }
            var list = (from DataRow row in dt.Rows
                        select new WhatsAppAlertLog
                        {
                            RowId = Convert.ToInt32(row["RowId"]),
                            mobileno = row["mobileno"].ToString(),
                            NoticeTitle = row["NoticeTitle"].ToString(),
                            SendOn = row["sendon"].ToString(),
                            AlertStatus = row["AlertStatus"].ToString(),
                            TotalRecord = Convert.ToInt32(row["TotalRecord"])
                        }).ToList();

            return Json(new { Data = list }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult BindDetailsAfterTranslate()
        {
            var output = new Message();
            var CreateNotice = QueryAES.UrlDecodeEditor(Request.Form["CreateNotice"]);
            var target_Language = QueryAES.UrlDecode(Request.Form["target_Language"]);
            var addfClient = new WebClientConnection();
            addfClient.Encoding = Encoding.UTF8;

            var apiUrl = ConfigurationManager.AppSettings["NoticeTranslatorUrl"];
            //"http://10.60.9.161:8080/translate";
            var requestBody = new
            {
                text = CreateNotice,
                language = target_Language
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(requestBody);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl), "POST", builders);
            var responseObj = JsonConvert.DeserializeObject<TranslationResponse>(resid);
            string finalText = responseObj.translated_content;
            return Json(new { Data = finalText }, JsonRequestBehavior.AllowGet);
            //return Json(finalText, JsonRequestBehavior.AllowGet);

        }

        public class WhatsAppAlertLog
        {
            public int RowId { get; set; }
            public int Id { get; set; }
            public string mobileno { get; set; }
            public string NoticeTitle { get; set; }
            public string SendOn { get; set; }
            public string AlertStatus { get; set; }
            public int TotalRecord { get; set; }
        }
    }
}
