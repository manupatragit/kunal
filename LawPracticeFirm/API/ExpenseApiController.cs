using BussinessLogic;
using DataAccess.Modals;
using DataAccess.Models;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class ExpenseApiController : BaseFirmApiController
    {
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "ExpenseApiController";

        /// <summary>
        /// Get Expense details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindExpenseType()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetExpenseType_Result> list = new List<usp_GetExpenseType_Result>();
                list = db.usp_GetExpenseType(0).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Expense category
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindExpenseCategory()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetExpenseCategory_Result> list = new List<usp_GetExpenseCategory_Result>();
                list = db.usp_GetExpenseCategory(0, firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Add expense details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddExpenseData()
        {
            string id = "", message = "";
            var InfectedFilesResult = "";
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var db = new LawPracticeEntities();
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var datefrom = Convert.ToDateTime(DateTime.Now);
                    var dateto = Convert.ToDateTime(DateTime.Now);
                    var ddlClient = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlClient"]));
                    var ddlCase = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCase"]));
                    try
                    {
                        ddlCase = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ddlCase));
                    }
                    catch
                    {

                        ddlCase = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCase"]));
                    }
                    if (ddlClient == "null" || ddlClient == "" || ddlClient == null)
                    {
                        ddlClient = Guid.Empty.ToString();
                    }
                    if (ddlCase == "null" || ddlCase == "" || ddlCase == null)
                    {
                        ddlCase = Guid.Empty.ToString();
                    }
                    var ddlTeamMember = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlTeamMember"]));
                    if (ddlTeamMember == "null" || ddlTeamMember == "" || ddlTeamMember == null)
                    {
                        ddlTeamMember = Guid.Empty.ToString();
                    }
                    int ddlExpenseType = 0;
                    var ddlExpenseTypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenseType"]);
                    if (ddlExpenseTypes != "")
                    {
                        ddlExpenseType = Convert.ToInt32(ddlExpenseTypes);
                    }
                    else
                    {
                        ddlExpenseType = 0;
                    }
                    var ddlCategory = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCategory"]);
                    var ddlCurrency = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCurrency"]));
                    var txtprice = Convert.ToDecimal(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtprice"]));
                    var txtUnits = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtUnits"]));
                    var txtTotal = Convert.ToDecimal(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtTotal"]));
                    var txtdate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdate"]));
                    var txtDescription = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDescription"]));
                    var expenseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["expenseid"]));
                    var txtduedate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtduedate"]));
                    var txtReceiptDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtReceiptDate"]);
                    var txtretainername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtretainername"]);
                    var includingtax = 0;
                    var myList = new List<string>();
                    var docsize = new List<string>();
                    var docfiles = new List<string>();
                    dynamic postedFiledata = "";
                    dynamic postedFiledata1 = "";
                    var httpRequest = HttpContext.Current.Request;
                    var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                    if (savemykasefileid.ToString() == "undefined")
                    {
                        savemykasefileid = "";
                    }
                    //check size of storage
                    if (httpRequest.Files.Count > 0 || (!String.IsNullOrEmpty(savemykasefileid)))
                    {
                        var doclimit = DocumentQuota.CheckDocumentmanagementFileSize(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                        if (doclimit.ToString() != "Available")
                        {
                            return Ok(new { Result = doclimit, InfectFiles = InfectedFilesResult });
                        }
                    }
                    if (httpRequest.Files.Count > 0)
                    {
                        for (int i = 0; i < httpRequest.Files.Count; i++)
                        {
                            var postedFile = httpRequest.Files[i];
                            DocUploadResult DUResult = new DocUploadResult();
                            DUResult = SaveCommonModulesDocument.UploadDocument(postedFile, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "Expense", true);
                            myList.Add(DUResult.FileName);
                            docsize.Add(DUResult.FileSize);
                            docfiles.Add(DUResult.EmailFilePath);
                            if (!String.IsNullOrEmpty(DUResult.InfectedFile))
                            {
                                InfectedFilesResult += DUResult.InfectedFile.ToString() + ",";
                            }
                        }
                    }
                    InfectedFilesResult = InfectedFilesResult.TrimEnd(',');
                    var filearray = myList.ToArray();
                    postedFiledata = string.Join("/", filearray);
                    if (string.IsNullOrEmpty(ddlClient))
                    {
                        ddlClient = Guid.Empty.ToString();
                    }
                    if (string.IsNullOrEmpty(ddlCase))
                    {
                        ddlCase = Guid.Empty.ToString();
                    }
                    if (!string.IsNullOrEmpty(expenseid))
                    {
                        var roweffected = db.usp_UpdateExpenseData(expenseid, firmid, userid, datefrom, dateto, ddlClient, ddlCase, ddlExpenseType, ddlCategory, txtprice, includingtax, txtUnits,
                        txtTotal, null, txtDescription, txtdate, ddlTeamMember, ddlCurrency, txtduedate, txtretainername, txtReceiptDate);
                        id = expenseid;
                    }
                    else
                    {
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("ExpenseId", id);
                        var roweffected = db.usp_AddExpenseData(IDParameter, firmid, userid, datefrom, dateto, ddlClient, ddlCase, ddlExpenseType, ddlCategory, txtprice, includingtax, txtUnits,
                            txtTotal, null, txtDescription, txtdate, ddlTeamMember, ddlCurrency, txtduedate, txtretainername, txtReceiptDate);
                        id = Convert.ToString(IDParameter.Value);
                    }
                    //upload documents

                    if (postedFiledata != "")
                    {
                        string s = postedFiledata;
                        string[] values = s.Split('/');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            var chkout = db.Usp_SaveMultipleFileMap(firmid, userid, id.ToString(), values[i], "Expense", docsize[i]);
                        }
                    }
                    if (!String.IsNullOrEmpty(savemykasefileid))
                    {
                        try
                        {
                            var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "Expense", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                            if (!String.IsNullOrEmpty(filelist))
                            {
                                string[] values2 = filelist.Split('|');
                                for (int j = 0; j < values2.Length; j++)
                                {
                                    values2[j] = values2[j].Trim();
                                    var Docsizes = "0";
                                    try
                                    {
                                        string[] valuessize = savemykasefileid.Split(',');
                                        {
                                            var documentdetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), valuessize[j]).FirstOrDefault();
                                            if (documentdetails != null)
                                            {
                                                Docsizes = Convert.ToString(documentdetails.DocSize);
                                            }
                                        }
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                    var chkout = db.Usp_SaveMultipleFileMap(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString(), values2[j], "Expense", Docsizes);
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                    if (id != "")
                    {
                        transaction.Commit();
                        transaction.Dispose();
                        message = "Success";
                    }
                    else
                    {
                        transaction.Rollback();
                        transaction.Dispose();
                        message = "error";
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(new { Result = message, InfectFiles = InfectedFilesResult });
        }

        /// <summary>
        /// Update expense detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateExpenseData()
        {
            string id = "", message = "";
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var db = new LawPracticeEntities();
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var datefrom = Convert.ToDateTime(DateTime.Now);
                    var dateto = Convert.ToDateTime(DateTime.Now);
                    var expenseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["expenseid"]));
                    var ddlClient = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlClient"]));
                    var ddlCase = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCase"]));
                    var ddlTeamMember = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlTeamMember"]));
                    var ddlExpenseType = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenseType"]));
                    var ddlCategory = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlCategory"]);
                    var txtprice = Convert.ToDecimal(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtprice"]));
                    var txtUnits = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtUnits"]));
                    var txtTotal = Convert.ToDecimal(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtTotal"]));
                    var txtdate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdate"]));
                    var txtDescription = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDescription"]));
                    var includingtax = 0;
                    var myList = new List<string>();
                    dynamic postedFiledata = "";
                    var httpRequest = HttpContext.Current.Request;
                    if (httpRequest.Files.Count > 0)
                    {
                        var docfiles = new List<string>();
                        string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Expensedocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                        string folderpathazure = "Documents/Expensedocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        //Check whether Directory (Folder) exists.
                        if (!Directory.Exists(folderPath))
                        {
                            //If Directory (Folder) does not exists. Create it.
                            Directory.CreateDirectory(folderPath);
                        }
                        for (int i = 0; i < httpRequest.Files.Count; i++)
                        {
                            var postedFile = httpRequest.Files[i];
                            var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                            var fileext = Path.GetExtension(postedFile.FileName);
                            var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
                            var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                            var fileextchk = Path.GetExtension(postedFile.FileName);
                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                            postedFile.SaveAs(filePath);
                            docfiles.Add(filePath);
                            string input = filePath;
                            string tempflname = fileName1;
                            tempflname = tempflname.Remove(0, 10);
                            myList.Add(tempflname);
                            string output = folderPath + Path.GetFileName(tempflname);
                            QueryAES.FileEncrypt(input, output);
                            //delete file
                            try
                            {
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                            }
                            catch (Exception er)
                            {
                                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                            }

                            System.IO.File.Delete(input);
                        }
                    }

                    var filearray = myList.ToArray();
                    postedFiledata = string.Join("/", filearray);
                    if (string.IsNullOrEmpty(ddlClient))
                    {
                        ddlClient = Guid.Empty.ToString();
                    }
                    if (string.IsNullOrEmpty(ddlCase))
                    {
                        ddlCase = Guid.Empty.ToString();
                    }
                    var roweffected = db.usp_UpdateExpenseData(expenseid, firmid, userid, datefrom, dateto, ddlClient, ddlCase, ddlExpenseType, ddlCategory, txtprice, includingtax, txtUnits,
                        txtTotal, null, txtDescription, txtdate, ddlTeamMember, null, null, null, null);
                    id = expenseid;

                    //upload documents
                    if (postedFiledata != "")
                    {
                        string s = postedFiledata;
                        string[] values = s.Split('/');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            var chkout = db.Usp_SaveMultipleFileMap(firmid, userid, id.ToString(), values[i], "Expense", null);
                        }
                    }
                    if (id != "")
                    {
                        transaction.Commit();
                        transaction.Dispose();
                        message = "Success";
                    }
                    else
                    {
                        transaction.Rollback();
                        transaction.Dispose();
                        message = "error";
                    }

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// Generate random number
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
        /// View Expense Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewExpenseReport()
        {
            int pagenumber = 1, pagesize = 10;
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", caseid = "", datefrom = "", dateto = "", loginid = "";
                datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                pagenumber = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                loginid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]));
                caseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]));
                clientid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["client"]));
                string categoryfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["categoryfilter"]));
                string currencyfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["currencyfilter"]));
                string etypefilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["etypefilter"]));
                string ExpenseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ExpenseStatus"]));
                var txtRetainername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtRetainername"]);
                var txtdescriptionfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdescriptionfilter"]); ;
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                if (String.IsNullOrEmpty(loginid) || loginid == "null")
                {
                    loginid = Guid.Empty.ToString();
                }
                List<usp_ViewExpenseReport_Result> list = new List<usp_ViewExpenseReport_Result>();
                list = db.usp_ViewExpenseReport(clientid, caseid, datefrom, dateto, firmid, userid, pagenumber, pagesize,
                    loginid, pageid.ToString(), etypefilter, categoryfilter, currencyfilter, ExpenseStatus, txtRetainername, txtdescriptionfilter).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Expense data by Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ExpenseDatabyId()
        {
            int pagenumber = 1, pagesize = 10;
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string expenseid = "";
                expenseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["expenseid"]));
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_GetExpenseDatabyId_Result> list = new List<usp_GetExpenseDatabyId_Result>();
                list = db.usp_GetExpenseDatabyId(expenseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Remove expense data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemovExpenseData()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var expenseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["expenseid"]);
                    var deletegrouproweffected = db.usp_RemovExpenseData(firmid, userid, expenseid);
                    if (deletegrouproweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Get user by firm id and role id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UsersbyFirmid_Userid_Roleid()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId.ToString());
                List<usp_GetUsersbyFirmid_UserId_Roleid_Result> list = new List<usp_GetUsersbyFirmid_UserId_Roleid_Result>();
                list = db.usp_GetUsersbyFirmid_UserId_Roleid(firmid, roleid, userid).ToList();
                foreach (var datas in list.ToList())
                {
                    string name = datas.cfname;
                    list[list.IndexOf(datas)].cfname = name;
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load expense category
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadExpenseCategory()
        {
            try
            {
                var param = controllername + ">LoadExpenseCategory>LoadExpenseCategory>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadExpenseCategory(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Insert expense category
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertExpenseCategory()
        {
            try
            {
                string Category = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubjectName"]);
                var param = controllername + ">InsertExpenseCategory>InsertExpenseCategory>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + Category;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.InsertExpenseCategory(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Category);
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "actype", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(cmatter);

            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove expense category
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveExpenseCategory()
        {
            try
            {
                string id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                var param = controllername + ">RemoveExpenseCategory>RemoveExpenseCategory>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + id;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.RemoveExpenseCategory(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id);
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "dctype", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save expense status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveExpenseStatus()
        {
            try
            {
                string expenseids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var outputinvoice = Repository.Matter.SaveExpenseStatus(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseids);
                return Ok(outputinvoice);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save expense payment
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveExpensePayment()
        {
            try
            {
                string expenseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var paidamttemp = "";
                var totamttemp = "";
                decimal dueamttemp = 0;
                var data = db.sp_GetExpenseDetailsForPaymentById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid).FirstOrDefault();
                if (data != null)
                {
                    totamttemp = data.Total.ToString();
                }
                var datapay = db.sp_GetExpensePaymentListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid).Where(z => z.Cleared == 1).Sum(z => z.Amount);
                if (datapay != null)
                {
                    paidamttemp = datapay.ToString();
                    dueamttemp = Convert.ToDecimal(totamttemp) - Convert.ToDecimal(paidamttemp);
                }
                else
                {
                    dueamttemp = Convert.ToInt32(totamttemp);
                }
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                if (payObj == "[]")
                {
                    return Ok("can not blank");
                }
                int sum = 0;
                List<ExpensePayment> payobj1 = JsonConvert.DeserializeObject<List<ExpensePayment>>(QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]));
                if (payobj1.Count > 0)
                {
                    for (var i = 0; i < payobj1.Count; i++)
                    {
                        int amount = Convert.ToInt32(payobj1[i].Amount);
                        sum = sum + amount;
                    }
                }
                var param = controllername + ">PostSaveExpensePayment>SaveExpensePayment>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + expenseid + "@" + payObj;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.SaveExpensePayment(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid, payObj);
                if (sum > dueamttemp)
                {
                    return Ok("Invalid amount");
                }
                return Ok(outputinvoice);

            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// View Expense Report For Matter dashboard
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewExpenseReportForMatterdashboard()
        {
            int pagenumber = 1, pagesize = 10;
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", loginid = "";
                pagenumber = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var caseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenceCase"]));
                //caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                try
                {
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                clientid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["client"]));
                string categoryfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["categoryfilter"]));
                string currencyfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["currencyfilter"]));
                string etypefilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["etypefilter"]));
                string ExpenseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ExpenseStatus"]));
                var txtRetainername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtRetainername"]);
                var txtdescriptionfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdescriptionfilter"]); ;
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                if (String.IsNullOrEmpty(loginid) || loginid == "null")
                {
                    loginid = Guid.Empty.ToString();
                }
                List<usp_ViewExpenseReportForDashboard_Result> list = new List<usp_ViewExpenseReportForDashboard_Result>();
                list = db.usp_ViewExpenseReportForDashboard(clientid, caseid, firmid, userid, pagenumber, pagesize,
                    loginid, pageid.ToString(), etypefilter, categoryfilter, currencyfilter, ExpenseStatus, txtRetainername, txtdescriptionfilter).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}