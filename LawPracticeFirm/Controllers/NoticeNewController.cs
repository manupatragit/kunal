using BussinessLogic.BusinessRepository;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using NoticeManagement.BusinessLayer.BusinessEntity;
using FileUpload = LawPracticeFirm.Models.FileUpload;
using System.Data.SqlClient;
using System.Web;
using System.Configuration;
using System.Data.OleDb;

namespace NoticeManagement.Controllers
{
    public class NoticeNewController : BaseFirmController
    {
        DBHandle dBHandle = new DBHandle();
        /// <summary>
        /// Get settled notice details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult Settled()
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
        /// Convert to case
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ConvertToCase()
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
        /// New notice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Get new notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult NewNoticeList()
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
        /// Schedule activity
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ScheduleActivity()
        {
            return View();
        }
        /// <summary>
        /// Get archive notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ArchiveNoticeList()
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
        /// User filter details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Filter()
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
        /// Create new notice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CreateNewNotice()
        {
            return View();
        }
        /// <summary>
        /// Get draft notice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult DraftNotice()
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
        /// Notice reminder view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult NoticeReminder()
        {
            return View();
        }
        /// <summary>
        /// Delete notice list view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult NoticeDeleteList()
        {
            return View();
        }
        /// <summary>
        /// Edit notice by notice id
        /// </summary>
        /// <param name="NoticeID"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Edit(string NoticeID)
        {
            dynamic list = dBHandle.GetNoticeDetailByID(NoticeID, LoggedInUser.FirmId.ToString());
            FileUpload model = new FileUpload();
            List<FileUpload> lists = new List<FileUpload>();
            DataTable dtFiles = dBHandle.GetFileDetails(NoticeID);
            foreach (DataRow dr in dtFiles.Rows)
            {
                lists.Add(new FileUpload
                {
                    FileName = @dr["FileName"].ToString(),
                });
            }
            for (int i = 0; i < lists.Count; i++)
            {
                lists[i].FileUrl = Url.Content(Path.Combine("~/Content/UploadedFile/", NoticeID, lists[i].FileName));
            }
            ViewData["Files"] = lists;
            ViewBag.MyList = lists;
            return View("Edit", list);
        }
        /// <summary>
        /// Remove special character from string
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string removeSpecialCharacter(string str)
        {
            string noHTML = Regex.Replace(str, @"<[^>]+>|&nbsp;", "").Trim();
            string noHTMLNormalised = Regex.Replace(noHTML, @"\s{2,}", " ");
            return noHTMLNormalised;
        }
        /// <summary>
        /// Export firm custom field configuration in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcel()
        {
            try
            {
                var db = new LawPracticeEntities();
                var SearchValue = QueryAES.UrlDecode(Request.QueryString["SearchValue"]);
                var ColumName = QueryAES.UrlDecode(Request.QueryString["ColumName"]);
                var SortedOrder = QueryAES.UrlDecode(Request.QueryString["SortedOrder"]);
                int PageNumber = 1;
                int PageSize = 10000;
                var NoticeStatus = QueryAES.UrlDecode(Request.QueryString["notistatus"]);
                var fromdaterange = QueryAES.UrlDecode(Request.QueryString["fromdaterange"]);
                var startdate = QueryAES.UrlDecode(Request.QueryString["startdate"]);
                var enddate = QueryAES.UrlDecode(Request.QueryString["enddate"]);
                var fromreminder = QueryAES.UrlDecode(Request.QueryString["fromreminder"]);
                var noticeid = QueryAES.UrlDecode(Request.QueryString["noticeid"]);
                var noticecomefrom = QueryAES.UrlDecode(Request.QueryString["noticecomefrom"]);
                var notitypess = QueryAES.UrlDecode(Request.QueryString["notitypes"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var RoleId = LoggedInUser.RoleId.ToString();
                var IsArchived = QueryAES.UrlDecode(Request.QueryString["IsArchived"]);
                var sendernamesrch = QueryAES.UrlDecode(Request.QueryString["sendernamesearch"]);
                var srchnoticesubject = QueryAES.UrlDecode(Request.QueryString["Noticesubjectsrc"]);
                var srhnoticetitle = QueryAES.UrlDecode(Request.QueryString["Noticetitlesrc"]);
                var noticetypesrch = QueryAES.UrlDecode(Request.QueryString["Noticetypesrc"]);
                var CaseNoticeStatus = QueryAES.UrlDecode(Request.QueryString["txtStatusOfNotice"]);
                var CFieldtype = QueryAES.UrlDecode(Request.QueryString["CFieldtype"]);
                var GetCustomFieldHeaderList = db.usp_GetFirmConfiguredCustomFields(LoggedInUser.FirmId.ToString(), CFieldtype).ToList();
                var exlfilename = "Excel report for " + noticecomefrom;
                dynamic trialList = null;
                if (SearchValue == null)
                {
                    SearchValue = "";
                }
                int CFieldsstartinxdex = 0;
                if (noticecomefrom == "NewNotice")
                {
                    List<usp_GetNotice_Result> Noticelist = null;
                    Noticelist = db.usp_GetNotice(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                                                  Convert.ToInt16(RoleId), NoticeStatus, firmid, Convert.ToBoolean(fromdaterange), startdate, enddate, Convert.ToBoolean(fromreminder), noticeid, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch, CaseNoticeStatus, IsArchived).ToList();
                    trialList = (from data in Noticelist
                                 select new
                                 {
                                     SendersName = data.SendersName,
                                     ReceiversName = data.AddressedTo,
                                     Subject = data.NoticeSubject,
                                     Title = data.NoticeTitle,
                                     Priority = data.Criticality,
                                     ReasonForHighPriority = data.Resonforhighpriority,
                                     Type = data.NoticeType,
                                     DateOfNotice = String.Format("{0:dd MMM yyyy}", data.DateofNotice),
                                     NoticeText = removeSpecialCharacter(data.CreateNotice),
                                     Status = data.CaseStatus,
                                     DateOfDelivery = String.Format("{0:dd MMM yyyy}", data.DateofDelivery),
                                     AmountClaimed = data.AmountClaimed,
                                     ModeofDelivery = data.ModeofServiceorDelivery,
                                     ReceiversAddress = data.AddresseeAddress,
                                     OtherDetailsofReceiver = data.OtherDetailsofAddressee,
                                     SendersAddress = data.SendersAddress,
                                     OtherDetailsofSender = data.OtherDetailsofSender,
                                     NoticeThroughTo = data.NoticeThrough,
                                     DueDate = String.Format("{0:dd MMM yyyy}", data.DueDateOfNotice),
                                     Tags = data.Tag,
                                     ReferenceNumber = data.NoticeReference,
                                     InternalNumber = data.IntNoticeReference,
                                     DateOfDispatch = data.Dateofdispatch,
                                     StatusChangedDate = data.ActualDateOfClosure,
                                     ConsignmentNo = data.ConsignmentNum,
                                     CreatedBy = data.CreatedByName,
                                     ReceiverDetails = data.IsOtherDetailsOfReceiver
                                 }).ToList();
                    CFieldsstartinxdex = 29;
                }
                else if (noticecomefrom == "NoticeReceived")
                {
                    List<usp_GetReceivedNoticeList_Result> Noticelist = null;
                    Noticelist = db.usp_GetReceivedNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                        Convert.ToInt16(RoleId), firmid, Convert.ToBoolean(fromdaterange), startdate, enddate,
                        Convert.ToBoolean(fromreminder), noticeid, null, null, null, null, notitypess, null).ToList();
                    trialList = (from data in Noticelist
                                 select new
                                 {
                                     SendersName = data.SendersName,
                                     AddressedToReceiversName = data.RejoinderAddressedto,
                                     Type = data.NoticeType,
                                     Subject = data.RejoinderSubject,
                                     Title = data.NoticeTitle,
                                     AddReceivedNotice = removeSpecialCharacter(data.CreateRejoinder),
                                     CreatedDate = String.Format("{0:dd MMM yyyy}", data.DateofCreatingRejoinder),
                                     CreatedBy = data.CreatedByName,
                                     DateOfNotice = String.Format("{0:dd MMM yyyy}", data.DateofNotice),
                                     DateOfReceipt = String.Format("{0:dd MMM yyyy}", data.DateofServiceofNotice),
                                     DueDate = String.Format("{0:dd MMM yyyy}", data.DueDateOfNotice),
                                     ModeofReceipt = data.ModeofReceipt,
                                     NoticeThroughTo = data.NoticeThrough,
                                     Priority = data.Criticality,
                                     ReasonForHighPriority = data.Resonforhighpriority,
                                     AmountClaimed = data.AmountClaimed,
                                     SendersAddress = data.AddresseeAddress,
                                     OtherDetailsofReceiver = data.OtherDetailsofAddressee,
                                     OtherDetailofSender = data.OtherDetailsofSender,
                                     NoticeStatus = data.CaseStatus,
                                     Tags = data.Tag,
                                     ReferenceNumber = data.NoticeReference,
                                     InternalNumber = data.IntNoticeReference
                                 }).ToList();
                    CFieldsstartinxdex = 24;
                }
                var gv = new GridView();
                gv.DataSource = trialList;
                gv.DataBind();
                try
                {
                    //start change header text
                    //int CFieldsstartinxdex = 29;
                    foreach (var data in GetCustomFieldHeaderList)
                    {
                        gv.HeaderRow.Cells[CFieldsstartinxdex].Text = data.FieldName;
                        CFieldsstartinxdex = CFieldsstartinxdex + 1;
                    }
                    //end change header text
                }
                catch (Exception ex)
                {
                }

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
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Return download file path
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DownloadFile(string filePath)
        {
            string fullName = Server.MapPath("~" + filePath);
            byte[] fileBytes = GetFile(fullName);
            return File(
                fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, filePath);
        }
        /// <summary>
        /// View mode of delivery by notice id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ViewModeOfDeliveryByNoticeId()
        {
            var paramnoticeid = QueryAES.UrlDecode(Request.Form["paramnoticeid"]);
            List<usp_GetPstdetailsByNoticeId_Result> postdetails = new List<usp_GetPstdetailsByNoticeId_Result>();
            try
            {
                var db = new LawPracticeEntities();
                if (paramnoticeid != "")
                {
                    var result = db.usp_GetModeofDeliveryByNoticeId(paramnoticeid).ToList();
                    postdetails = db.usp_GetPstdetailsByNoticeId(paramnoticeid).ToList();
                    var rawfile1 = new
                    {
                        Deleverylist = result,
                        speddpostdetails = postdetails
                    };
                    var a = JsonConvert.SerializeObject(rawfile1);
                    return Json(a);
                }
                else
                {
                    var rawfile1 = new
                    {
                        Deleverylist = "",
                        speddpostdetails = ""
                    };
                    var a = JsonConvert.SerializeObject(rawfile1);
                    return Json(a);
                }
            }
            catch (Exception)
            {
                var rawfile1 = new
                {
                    Deleverylist = "",
                    speddpostdetails = ""
                };
                var a = JsonConvert.SerializeObject(rawfile1);
                return Json(a);
            }
        }
        byte[] GetFile(string s)
        {
            System.IO.FileStream fs = System.IO.File.OpenRead(s);
            byte[] data = new byte[fs.Length];
            int br = fs.Read(data, 0, data.Length);
            if (br != fs.Length)
                throw new System.IO.IOException(s);
            return data;
        }


        /// <summary>
        /// Upload bulk data view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult UploadBulkData()
        {
            return View();
        }


        /// <summary>
        /// Upload bulk notice through excel file
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PostBulkNoticeDetail()
        {
            var output = new Message();
            var db = new LawPracticeEntities();

            HttpFileCollectionBase postedFile1 = Request.Files;
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
                                connExcel.Open();
                                DataTable dtExcelSchema;
                                dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                                string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                                connExcel.Close();
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
                                try
                                {
                                    if (dt == null || dt.Rows.Count == 0)
                                    {
                                        output.message = "Excel has no data.";
                                        output.status = false;
                                        return Json(output, JsonRequestBehavior.AllowGet);
                                    }
                                    var columnMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                                    {
                                     {"LoanType","LoanType"},
                                     {"Loan ID","LoanId"},
                                     {"Client ID","ClientId"},
                                     {"School/Student Name","SchoolStudentName"},
                                     {"Branch","Branch"},
                                     {"State","State"},
                                     {"Branch Address","BranchAddress"},
                                     {"Product Name","ProductName"},
                                     {"Loan Amount","LoanAmount"},
                                     {"Disbursement Date","DisbursementDate"},
                                     {"EMI Amount","EMIAmount"},
                                     {"EMI Due Date","EMIDueDate"},
                                     {"Current DPD","CurrentDPD"},
                                     {"Borrower Details - School Name - 1","BorrowerDetailsSchoolName1"},
                                     {"Borrower Details - School address 1 - 1","BorrowerDetailsSchooladdress11"},
                                     {"Borrower Details - School phone number - 1","BorrowerDetailsSchoolphonenumber1"},
                                     {"Borrower Details - School email id - 1","BorrowerDetailsSchoolemailid1"},
                                     {"Trust Details - Trust name - 1","TrustDetailsTrustname1"},
                                     {"Trust Details - Trust address - 1","TrustDetailsTrustaddress1"},
                                     {"Trust Details - Trust phone number - 1","TrustDetailsTrustphonenumber1"},
                                     {"Trust Details - Trust email id - 1","TrustDetailsTrustemailid1"},
                                     {"Co-Applicant Name1","CoApplicantName1"},
                                     {"Co-Applicant1 Address","CoApplicant1Address"},
                                     {"Co-Applicant1 Phone Number","CoApplicant1PhoneNumber"},
                                     {"Co-Applicant1 Email ID","CoApplicant1EmailID"},
                                     {"Co-Applicant Name2","CoApplicantName2"},
                                     {"Co-Applicant2 Address","CoApplicant2Address"},
                                     {"Co-Applicant2 Phone Number","CoApplicant2PhoneNumber"},
                                     {"Co-Applicant2 Email ID","CoApplicant2EmailID"},
                                     {"Dunning Reference number","DunningReferencenumber"},
                                     {"Dunning letter Notice Date","DunningletterNoticeDate"},
                                     {"Branch/Collection Manager Name","BranchCollectionManagerName"},
                                     {"Branch/Collection Manager No","BranchCollectionManagerNo"},
                                     {"Type of Notice","TypeofNotice"}
                                    };

                                    foreach (DataColumn col in dt.Columns)
                                    {
                                        string clean = col.ColumnName?.Trim();
                                        col.ColumnName = clean;
                                    }

                                    var normalizedExcelCols = dt.Columns.Cast<DataColumn>()
                                        .ToDictionary(c => c.ColumnName.Trim().ToLowerInvariant(), c => c.ColumnName);

                                    var missing = columnMap.Keys
                                        .Where(k => !normalizedExcelCols.ContainsKey(k.Trim().ToLowerInvariant()))
                                        .ToList();

                                    var rowsToDelete = new List<DataRow>();
                                    foreach (DataRow row in dt.Rows)
                                    {
                                        bool isEntireRowEmpty = true;
                                        foreach (DataColumn col in dt.Columns)
                                        {
                                            if (row[col] == DBNull.Value) continue;
                                            if (col.DataType == typeof(string))
                                            {
                                                var s = row[col].ToString();
                                                s = s?.Trim();
                                                row[col] = s;
                                                if (!string.IsNullOrWhiteSpace(s)) isEntireRowEmpty = false;
                                            }
                                            else
                                            {
                                                if (row[col] != DBNull.Value) isEntireRowEmpty = false;
                                            }
                                        }
                                        if (isEntireRowEmpty) rowsToDelete.Add(row);
                                    }
                                    foreach (var dr in rowsToDelete) dt.Rows.Remove(dr);

                                    if (dt.Rows.Count == 0)
                                    {
                                        output.message = "No valid rows after cleanup.";
                                        output.status = false;
                                        return Json(output, JsonRequestBehavior.AllowGet);
                                    }

                                    string currentUser = LoggedInUser.UserId.ToString();
                                    string FirmId = LoggedInUser.FirmId.ToString();
                                    if (!dt.Columns.Contains("CreatedBy")) dt.Columns.Add("CreatedBy", typeof(string));
                                    if (!dt.Columns.Contains("CreateDate")) dt.Columns.Add("CreateDate", typeof(DateTime));
                                    if (!dt.Columns.Contains("FirmId")) dt.Columns.Add("FirmId", typeof(string));
                                    foreach (DataRow row in dt.Rows)
                                    {
                                        row["CreatedBy"] = currentUser;
                                        row["CreateDate"] = DateTime.UtcNow;
                                        row["FirmId"] = FirmId;
                                    }

                                    DataTable dtForBulk = new DataTable();
                                    dtForBulk.Columns.Add("LoanType", typeof(string));
                                    dtForBulk.Columns.Add("LoanID", typeof(string));
                                    dtForBulk.Columns.Add("ClientID", typeof(string));
                                    dtForBulk.Columns.Add("SchoolStudentName", typeof(string));
                                    dtForBulk.Columns.Add("Branch", typeof(string));
                                    dtForBulk.Columns.Add("State", typeof(string));
                                    dtForBulk.Columns.Add("BranchAddress", typeof(string));
                                    dtForBulk.Columns.Add("ProductName", typeof(string));
                                    dtForBulk.Columns.Add("LoanAmount", typeof(string));
                                    dtForBulk.Columns.Add("DisbursementDate", typeof(string));
                                    dtForBulk.Columns.Add("EMIAmount", typeof(string));
                                    dtForBulk.Columns.Add("EMIDueDate", typeof(string));
                                    dtForBulk.Columns.Add("CurrentDPD", typeof(string));
                                    dtForBulk.Columns.Add("BorrowerDetailsSchoolName1", typeof(string));
                                    dtForBulk.Columns.Add("BorrowerDetailsSchooladdress11", typeof(string));
                                    dtForBulk.Columns.Add("BorrowerDetailsSchoolphonenumber1", typeof(string));
                                    dtForBulk.Columns.Add("BorrowerDetailsSchoolemailid1", typeof(string));
                                    dtForBulk.Columns.Add("TrustDetailsTrustname1", typeof(string));
                                    dtForBulk.Columns.Add("TrustDetailsTrustaddress1", typeof(string));
                                    dtForBulk.Columns.Add("TrustDetailsTrustphonenumber1", typeof(string));
                                    dtForBulk.Columns.Add("TrustDetailsTrustemailid1", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicantName1", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant1Address", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant1PhoneNumber", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant1EmailID", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicantName2", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant2Address", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant2PhoneNumber", typeof(string));
                                    dtForBulk.Columns.Add("CoApplicant2EmailID", typeof(string));
                                    dtForBulk.Columns.Add("DunningReferencenumber", typeof(string));
                                    dtForBulk.Columns.Add("DunningletterNoticeDate", typeof(string));
                                    dtForBulk.Columns.Add("BranchCollectionManagerName", typeof(string));
                                    dtForBulk.Columns.Add("BranchCollectionManagerNo", typeof(string));
                                    dtForBulk.Columns.Add("TypeofNotice", typeof(string));
                                    dtForBulk.Columns.Add("CreateDate", typeof(string));
                                    dtForBulk.Columns.Add("CreatedBy", typeof(string));
                                    dtForBulk.Columns.Add("FirmId", typeof(string));

                                    foreach (DataRow src in dt.Rows)
                                    {
                                        var nr = dtForBulk.NewRow();
                                        nr["LoanType"] = src[columnMap.First(kv => kv.Value == "LoanType").Key] ?? DBNull.Value;
                                        nr["LoanID"] = src[columnMap.First(kv => kv.Value == "LoanId").Key] ?? DBNull.Value;
                                        nr["ClientID"] = src[columnMap.First(kv => kv.Value == "ClientId").Key] ?? DBNull.Value;
                                        nr["SchoolStudentName"] = src[columnMap.First(kv => kv.Value == "SchoolStudentName").Key] ?? DBNull.Value;
                                        nr["Branch"] = src[columnMap.First(kv => kv.Value == "Branch").Key] ?? DBNull.Value;
                                        nr["State"] = src[columnMap.First(kv => kv.Value == "State").Key] ?? DBNull.Value;
                                        nr["BranchAddress"] = src[columnMap.First(kv => kv.Value == "BranchAddress").Key] ?? DBNull.Value;
                                        nr["ProductName"] = src[columnMap.First(kv => kv.Value == "ProductName").Key] ?? DBNull.Value;
                                        nr["LoanAmount"] = src[columnMap.First(kv => kv.Value == "LoanAmount").Key] ?? DBNull.Value;
                                        nr["DisbursementDate"] = src[columnMap.First(kv => kv.Value == "DisbursementDate").Key] ?? DBNull.Value;
                                        nr["EMIAmount"] = src[columnMap.First(kv => kv.Value == "EMIAmount").Key] ?? DBNull.Value;
                                        nr["EMIDueDate"] = src[columnMap.First(kv => kv.Value == "EMIDueDate").Key] ?? DBNull.Value;
                                        nr["CurrentDPD"] = src[columnMap.First(kv => kv.Value == "CurrentDPD").Key] ?? DBNull.Value;
                                        nr["BorrowerDetailsSchoolName1"] = src[columnMap.First(kv => kv.Value == "BorrowerDetailsSchoolName1").Key] ?? DBNull.Value;
                                        nr["BorrowerDetailsSchooladdress11"] = src[columnMap.First(kv => kv.Value == "BorrowerDetailsSchooladdress11").Key] ?? DBNull.Value;
                                        nr["BorrowerDetailsSchoolphonenumber1"] = src[columnMap.First(kv => kv.Value == "BorrowerDetailsSchoolphonenumber1").Key] ?? DBNull.Value;
                                        nr["BorrowerDetailsSchoolemailid1"] = src[columnMap.First(kv => kv.Value == "BorrowerDetailsSchoolemailid1").Key] ?? DBNull.Value;
                                        nr["TrustDetailsTrustname1"] = src[columnMap.First(kv => kv.Value == "TrustDetailsTrustname1").Key] ?? DBNull.Value;
                                        nr["TrustDetailsTrustaddress1"] = src[columnMap.First(kv => kv.Value == "TrustDetailsTrustaddress1").Key] ?? DBNull.Value;
                                        nr["TrustDetailsTrustphonenumber1"] = src[columnMap.First(kv => kv.Value == "TrustDetailsTrustphonenumber1").Key] ?? DBNull.Value;
                                        nr["TrustDetailsTrustemailid1"] = src[columnMap.First(kv => kv.Value == "TrustDetailsTrustemailid1").Key] ?? DBNull.Value;
                                        nr["CoApplicantName1"] = src[columnMap.First(kv => kv.Value == "CoApplicantName1").Key] ?? DBNull.Value;
                                        nr["CoApplicant1Address"] = src[columnMap.First(kv => kv.Value == "CoApplicant1Address").Key] ?? DBNull.Value;
                                        nr["CoApplicant1PhoneNumber"] = src[columnMap.First(kv => kv.Value == "CoApplicant1PhoneNumber").Key] ?? DBNull.Value;
                                        nr["CoApplicant1EmailID"] = src[columnMap.First(kv => kv.Value == "CoApplicant1EmailID").Key] ?? DBNull.Value;
                                        nr["CoApplicantName2"] = src[columnMap.First(kv => kv.Value == "CoApplicantName2").Key] ?? DBNull.Value;
                                        nr["CoApplicant2Address"] = src[columnMap.First(kv => kv.Value == "CoApplicant2Address").Key] ?? DBNull.Value;
                                        nr["CoApplicant2PhoneNumber"] = src[columnMap.First(kv => kv.Value == "CoApplicant2PhoneNumber").Key] ?? DBNull.Value;
                                        nr["CoApplicant2EmailID"] = src[columnMap.First(kv => kv.Value == "CoApplicant2EmailID").Key] ?? DBNull.Value;
                                        nr["DunningReferencenumber"] = src[columnMap.First(kv => kv.Value == "DunningReferencenumber").Key] ?? DBNull.Value;
                                        nr["DunningletterNoticeDate"] = src[columnMap.First(kv => kv.Value == "DunningletterNoticeDate").Key] ?? DBNull.Value;
                                        nr["BranchCollectionManagerName"] = src[columnMap.First(kv => kv.Value == "BranchCollectionManagerName").Key] ?? DBNull.Value;
                                        nr["BranchCollectionManagerNo"] = src[columnMap.First(kv => kv.Value == "BranchCollectionManagerNo").Key] ?? DBNull.Value;
                                        nr["TypeofNotice"] = src[columnMap.First(kv => kv.Value == "TypeofNotice").Key] ?? DBNull.Value;
                                        nr["CreatedBy"] = src["CreatedBy"];
                                        nr["CreateDate"] = src["CreateDate"];
                                        nr["FirmId"] = src["FirmId"];
                                        dtForBulk.Rows.Add(nr);
                                    }

                                    var sqlConn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                                    using (var conn = new SqlConnection(sqlConn))
                                    {
                                        conn.Open();

                                        using (var cmd = new SqlCommand("DELETE FROM dbo.tblTempUploadExcelDetailsVerthana WHERE CreatedBy = @CreatedBy", conn))
                                        {
                                            cmd.Parameters.AddWithValue("@CreatedBy", currentUser);
                                            cmd.ExecuteNonQuery();
                                        }

                                        using (var bulk = new SqlBulkCopy(conn, SqlBulkCopyOptions.TableLock, null))
                                        {
                                            bulk.DestinationTableName = "dbo.tblTempUploadExcelDetailsVerthana";
                                            bulk.BatchSize = 2000;
                                            bulk.BulkCopyTimeout = 0;
                                            bulk.ColumnMappings.Add("LoanType", "LoanType");
                                            bulk.ColumnMappings.Add("LoanID", "LoanId");
                                            bulk.ColumnMappings.Add("ClientID", "ClientId");
                                            bulk.ColumnMappings.Add("SchoolStudentName", "SchoolStudentName");
                                            bulk.ColumnMappings.Add("Branch", "Branch");
                                            bulk.ColumnMappings.Add("State", "State");
                                            bulk.ColumnMappings.Add("BranchAddress", "BranchAddress");
                                            bulk.ColumnMappings.Add("ProductName", "ProductName");
                                            bulk.ColumnMappings.Add("LoanAmount", "LoanAmount");
                                            bulk.ColumnMappings.Add("DisbursementDate", "DisbursementDate");
                                            bulk.ColumnMappings.Add("EMIAmount", "EMIAmount");
                                            bulk.ColumnMappings.Add("EMIDueDate", "EMIDueDate");
                                            bulk.ColumnMappings.Add("CurrentDPD", "CurrentDPD");
                                            bulk.ColumnMappings.Add("BorrowerDetailsSchoolName1", "BorrowerDetailsSchoolName1");
                                            bulk.ColumnMappings.Add("BorrowerDetailsSchooladdress11", "BorrowerDetailsSchooladdress11");
                                            bulk.ColumnMappings.Add("BorrowerDetailsSchoolphonenumber1", "BorrowerDetailsSchoolphonenumber1");
                                            bulk.ColumnMappings.Add("BorrowerDetailsSchoolemailid1", "BorrowerDetailsSchoolemailid1");
                                            bulk.ColumnMappings.Add("TrustDetailsTrustname1", "TrustDetailsTrustname1");
                                            bulk.ColumnMappings.Add("TrustDetailsTrustaddress1", "TrustDetailsTrustaddress1");
                                            bulk.ColumnMappings.Add("TrustDetailsTrustphonenumber1", "TrustDetailsTrustphonenumber1");
                                            bulk.ColumnMappings.Add("TrustDetailsTrustemailid1", "TrustDetailsTrustemailid1");
                                            bulk.ColumnMappings.Add("CoApplicantName1", "CoApplicantName1");
                                            bulk.ColumnMappings.Add("CoApplicant1Address", "CoApplicant1Address");
                                            bulk.ColumnMappings.Add("CoApplicant1PhoneNumber", "CoApplicant1PhoneNumber");
                                            bulk.ColumnMappings.Add("CoApplicant1EmailID", "CoApplicant1EmailID");
                                            bulk.ColumnMappings.Add("CoApplicantName2", "CoApplicantName2");
                                            bulk.ColumnMappings.Add("CoApplicant2Address", "CoApplicant2Address");
                                            bulk.ColumnMappings.Add("CoApplicant2PhoneNumber", "CoApplicant2PhoneNumber");
                                            bulk.ColumnMappings.Add("CoApplicant2EmailID", "CoApplicant2EmailID");
                                            bulk.ColumnMappings.Add("DunningReferencenumber", "DunningReferencenumber");
                                            bulk.ColumnMappings.Add("DunningletterNoticeDate", "DunningletterNoticeDate");
                                            bulk.ColumnMappings.Add("BranchCollectionManagerName", "BranchCollectionManagerName");
                                            bulk.ColumnMappings.Add("BranchCollectionManagerNo", "BranchCollectionManagerNo");
                                            bulk.ColumnMappings.Add("TypeofNotice", "TypeofNotice");
                                            bulk.ColumnMappings.Add("CreatedBy", "CreatedBy");
                                            bulk.ColumnMappings.Add("CreateDate", "CreateDate");
                                            bulk.ColumnMappings.Add("FirmId", "FirmId");
                                            bulk.NotifyAfter = 1000;
                                            bulk.SqlRowsCopied += (s, e) =>
                                            {
                                                System.Diagnostics.Debug.WriteLine($"{e.RowsCopied} rows copied to staging");
                                            };

                                            bulk.WriteToServer(dtForBulk);
                                        }

                                        using (var cmd = new SqlCommand("usp_VarthanaValidateAndMergeNoticesDataEntry", conn))
                                        {
                                            cmd.CommandType = CommandType.StoredProcedure;
                                            cmd.Parameters.AddWithValue("@CreatedBy", currentUser);
                                            cmd.CommandTimeout = 0;
                                            var outParam = new SqlParameter("@ResultMessage", SqlDbType.NVarChar, 4000) { Direction = ParameterDirection.Output };
                                            cmd.Parameters.Add(outParam);
                                            cmd.ExecuteNonQuery();
                                            var resultMsg = outParam.Value?.ToString();
                                            output.message = resultMsg ?? "Upload completed successfully.";
                                            output.status = true;
                                        }
                                    }
                                    return Json(output, JsonRequestBehavior.AllowGet);
                                }
                                catch (Exception ex)
                                {
                                    output.message = "Error while importing file: " + ex.Message;
                                    output.status = false;
                                    return Json(output, JsonRequestBehavior.AllowGet);
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
            return Json(output, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult BindBulkNoticeDetail()
        {
            DataTable dt = new DataTable();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var pagenumber = QueryAES.UrlDecode(Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
                dt = DataAccessIPRADO.GetExcelUploadDetails(firmid, pagenumber, pagesize);

            }
            catch (Exception ex)
            {
            }
            var list = (from DataRow row in dt.Rows
                        select new VerthanaBulkUploadModel
                        {
                            RowId = Convert.ToInt32(row["RowId"]),
                            TotalRecord = Convert.ToInt32(row["TotalRecord"]),
                            Id = row["Id"].ToString(),
                            LoanType = row["LoanType"].ToString(),
                            LoanID = row["LoanId"].ToString(),
                            ClientID = row["ClientId"].ToString(),
                            SchoolStudentName = row["SchoolStudentName"].ToString(),
                            Branch = row["Branch"].ToString(),
                            State = row["State"].ToString(),
                            BranchAddress = row["BranchAddress"].ToString(),
                            ProductName = row["ProductName"].ToString(),
                            LoanAmount = row["LoanAmount"].ToString(),
                            DisbursementDate = row["DisbursementDate"].ToString(),
                            EMIAmount = row["EMIAmount"].ToString(),
                            EMIDueDate = row["EMIDueDate"].ToString(),
                            CurrentDPD = row["CurrentDPD"].ToString(),
                            BorrowerDetailsSchoolName1 = row["BorrowerDetailsSchoolName1"].ToString(),
                            BorrowerDetailsSchooladdress11 = row["BorrowerDetailsSchooladdress11"].ToString(),
                            BorrowerDetailsSchoolphonenumber1 = row["BorrowerDetailsSchoolphonenumber1"].ToString(),
                            BorrowerDetailsSchoolemailid1 = row["BorrowerDetailsSchoolemailid1"].ToString(),
                            TrustDetailsTrustname1 = row["TrustDetailsTrustname1"].ToString(),
                            TrustDetailsTrustaddress1 = row["TrustDetailsTrustaddress1"].ToString(),
                            TrustDetailsTrustphonenumber1 = row["TrustDetailsTrustphonenumber1"].ToString(),
                            TrustDetailsTrustemailid1 = row["TrustDetailsTrustemailid1"].ToString(),
                            CoApplicantName1 = row["CoApplicantName1"].ToString(),
                            CoApplicant1Address = row["CoApplicant1Address"].ToString(),
                            CoApplicant1PhoneNumber = row["CoApplicant1PhoneNumber"].ToString(),
                            CoApplicant1EmailID = row["CoApplicant1EmailID"].ToString(),
                            CoApplicantName2 = row["CoApplicantName2"].ToString(),
                            CoApplicant2Address = row["CoApplicant2Address"].ToString(),
                            CoApplicant2PhoneNumber = row["CoApplicant2PhoneNumber"].ToString(),
                            CoApplicant2EmailID = row["CoApplicant2EmailID"].ToString(),
                            DunningReferencenumber = row["DunningReferencenumber"].ToString(),
                            DunningletterNoticeDate = row["DunningletterNoticeDate"].ToString(),
                            BranchCollectionManagerName = row["BranchCollectionManagerName"].ToString(),
                            BranchCollectionManagerNo = row["BranchCollectionManagerNo"].ToString(),
                            TypeofNotice = row["TypeofNotice"].ToString(),
                            CreatedDate = row["CreateDate"].ToString(),
                            UploadedBy = row["UploadedBy"].ToString(),
                        }).ToList();
            return Json(new { Data = list }, JsonRequestBehavior.AllowGet);
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult UpdateBulkNotice()
        {
            return View();
        }
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public ActionResult BulkNoticeDetailById()
        {
            var NoticeID = QueryAES.UrlDecode(Request.Form["NoticeID"]);
            DataTable dt = new DataTable();
            try
            {
                dt = DataAccessIPRADO.GetNoticeDetailsById(NoticeID);
            }
            catch (Exception ex)
            {
            }
            var list = (from DataRow row in dt.Rows
                        select new VerthanaBulkUploadModel
                        {
                            Id = row["Id"].ToString(),
                            LoanType = row["LoanType"].ToString(),
                            LoanID = row["LoanId"].ToString(),
                            ClientID = row["ClientId"].ToString(),
                            SchoolStudentName = row["SchoolStudentName"].ToString(),
                            Branch = row["Branch"].ToString(),
                            State = row["State"].ToString(),
                            BranchAddress = row["BranchAddress"].ToString(),
                            ProductName = row["ProductName"].ToString(),
                            LoanAmount = row["LoanAmount"].ToString(),
                            DisbursementDate = row["DisbursementDate"].ToString(),
                            EMIAmount = row["EMIAmount"].ToString(),
                            EMIDueDate = row["EMIDueDate"].ToString(),
                            CurrentDPD = row["CurrentDPD"].ToString(),
                            BorrowerDetailsSchoolName1 = row["BorrowerDetailsSchoolName1"].ToString(),
                            BorrowerDetailsSchooladdress11 = row["BorrowerDetailsSchooladdress11"].ToString(),
                            BorrowerDetailsSchoolphonenumber1 = row["BorrowerDetailsSchoolphonenumber1"].ToString(),
                            BorrowerDetailsSchoolemailid1 = row["BorrowerDetailsSchoolemailid1"].ToString(),
                            TrustDetailsTrustname1 = row["TrustDetailsTrustname1"].ToString(),
                            TrustDetailsTrustaddress1 = row["TrustDetailsTrustaddress1"].ToString(),
                            TrustDetailsTrustphonenumber1 = row["TrustDetailsTrustphonenumber1"].ToString(),
                            TrustDetailsTrustemailid1 = row["TrustDetailsTrustemailid1"].ToString(),
                            CoApplicantName1 = row["CoApplicantName1"].ToString(),
                            CoApplicant1Address = row["CoApplicant1Address"].ToString(),
                            CoApplicant1PhoneNumber = row["CoApplicant1PhoneNumber"].ToString(),
                            CoApplicant1EmailID = row["CoApplicant1EmailID"].ToString(),
                            CoApplicantName2 = row["CoApplicantName2"].ToString(),
                            CoApplicant2Address = row["CoApplicant2Address"].ToString(),
                            CoApplicant2PhoneNumber = row["CoApplicant2PhoneNumber"].ToString(),
                            CoApplicant2EmailID = row["CoApplicant2EmailID"].ToString(),
                            DunningReferencenumber = row["DunningReferencenumber"].ToString(),
                            DunningletterNoticeDate = row["DunningletterNoticeDate"].ToString(),
                            BranchCollectionManagerName = row["BranchCollectionManagerName"].ToString(),
                            BranchCollectionManagerNo = row["BranchCollectionManagerNo"].ToString(),
                            TypeofNotice = row["TypeofNotice"].ToString(),
                            CreatedDate = row["CreateDate"].ToString(),
                        }).ToList();
            return Json(new { Data = list }, JsonRequestBehavior.AllowGet);
        }

        [AuthLog(Roles = "Firm,User")]
        public void DownloadExcelFileDetails()
        {
            try
            {
                var pagenum = QueryAES.UrlDecode(Request.QueryString["pagenum"]);
                var pagesize1 = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                var exlfilename = "Excel report for Notice";
                DataTable dt = new DataTable();
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    dt = DataAccessIPRADO.GetExcelUploadDetails(firmid, pagenum, pagesize1);

                }
                catch (Exception ex)
                {
                }
                var noticeList = (from DataRow row in dt.Rows
                            select new VerthanaBulkExportExcelModel
                            {
                                LoanType = row["LoanType"].ToString(),
                                LoanID = row["LoanId"].ToString(),
                                ClientID = row["ClientId"].ToString(),
                                SchoolStudentName = row["SchoolStudentName"].ToString(),
                                Branch = row["Branch"].ToString(),
                                State = row["State"].ToString(),
                                BranchAddress = row["BranchAddress"].ToString(),
                                ProductName = row["ProductName"].ToString(),
                                LoanAmount = row["LoanAmount"].ToString(),
                                DisbursementDate = row["DisbursementDate"].ToString(),
                                EMIAmount = row["EMIAmount"].ToString(),
                                EMIDueDate = row["EMIDueDate"].ToString(),
                                CurrentDPD = row["CurrentDPD"].ToString(),
                                BorrowerDetailsSchoolName1 = row["BorrowerDetailsSchoolName1"].ToString(),
                                BorrowerDetailsSchooladdress11 = row["BorrowerDetailsSchooladdress11"].ToString(),
                                BorrowerDetailsSchoolphonenumber1 = row["BorrowerDetailsSchoolphonenumber1"].ToString(),
                                BorrowerDetailsSchoolemailid1 = row["BorrowerDetailsSchoolemailid1"].ToString(),
                                TrustDetailsTrustname1 = row["TrustDetailsTrustname1"].ToString(),
                                TrustDetailsTrustaddress1 = row["TrustDetailsTrustaddress1"].ToString(),
                                TrustDetailsTrustphonenumber1 = row["TrustDetailsTrustphonenumber1"].ToString(),
                                TrustDetailsTrustemailid1 = row["TrustDetailsTrustemailid1"].ToString(),
                                CoApplicantName1 = row["CoApplicantName1"].ToString(),
                                CoApplicant1Address = row["CoApplicant1Address"].ToString(),
                                CoApplicant1PhoneNumber = row["CoApplicant1PhoneNumber"].ToString(),
                                CoApplicant1EmailID = row["CoApplicant1EmailID"].ToString(),
                                CoApplicantName2 = row["CoApplicantName2"].ToString(),
                                CoApplicant2Address = row["CoApplicant2Address"].ToString(),
                                CoApplicant2PhoneNumber = row["CoApplicant2PhoneNumber"].ToString(),
                                CoApplicant2EmailID = row["CoApplicant2EmailID"].ToString(),
                                DunningReferencenumber = row["DunningReferencenumber"].ToString(),
                                DunningletterNoticeDate = row["DunningletterNoticeDate"].ToString(),
                                BranchCollectionManagerName = row["BranchCollectionManagerName"].ToString(),
                                BranchCollectionManagerNo = row["BranchCollectionManagerNo"].ToString(),
                                TypeofNotice = row["TypeofNotice"].ToString(),
                                //CreatedDate = row["CreateDate"].ToString(),
                                //UploadedBy = row["UploadedBy"].ToString(),
                            }).ToList();

                var gv = new GridView();
                gv.DataSource = noticeList;
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
                Response.Redirect("/home/Error");
            }
        }


    }
}
