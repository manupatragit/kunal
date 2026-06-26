using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using LawPracticeFirm.Models;
using static LawPracticeFirm.Models.AuditData;
using com.sun.corba.se.spi.ior;
using static Dropbox.Api.TeamLog.SharingMemberPolicy;
using System.Threading.Tasks;
using static Google.Apis.Requests.BatchRequest;
using System.Text.Json;
using Cloudmersive.APIClient.NET.VirusScan.Client;
using static LawPracticeFirm.Controllers.ReportController;
using System.Web;
using System.Net.Http;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Bibliography;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System.Web.UI.HtmlControls;
using static Dropbox.Api.TeamLog.TimeUnit;
using DocumentFormat.OpenXml.Spreadsheet;
using RestSharp.Extensions;
using System.Globalization;
using System.Data.SqlClient;
using NJDGDetail.DAL;
using LawPracticeFirm.DAL;

namespace LawPracticeFirm.Controllers
{
    public class ReportController : BaseFirmController
    {
        /// <summary>
        /// Contact reports view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ContactsReport()
        {
            return View();
        }
        /// <summary>
        /// User report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult UsersReport()
        {
            return View();
        }
        /// <summary>
        /// Task report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult TaskReport()
        {
            return View();
        }
        /// <summary>
        /// Activity report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ActivityReport()
        {
            return View();
        }
        /// <summary>
        /// Invoice report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult InvoiceReport()
        {
            return View();
        }
        /// <summary>
        /// Time entry report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult TimeEntryReport()
        {
            return View();
        }
        /// <summary>
        /// Matter report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult MatterReport()
        {
            return View();
        }
        /// <summary>
        /// Conflict search report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ConflictSearch()
        {
            return View();
        }
        /// <summary>
        /// Get all report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AllReports()
        {
            return View();
        }
        /// <summary>
        /// Expense report view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ExpenseCreated()
        {
            return View();
        }
        /// <summary>
        /// Export expense report in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoExcelExpenseReport()
        {
            int pagenumber = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagenum"]));
            int pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagesize"]));
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string clientid = "", caseid = "", datefrom = "", dateto = "";
            datefrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["datefrom"]));
            dateto = Convert.ToString(QueryAES.UrlDecode(Request.Form["dateto"]));
            string loginid = Convert.ToString(QueryAES.UrlDecode(Request.Form["loginid"]));
            string expensetye = "", category = "", createdby = "";
            clientid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ddlExpenceClient"]));
            caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ddlExpenceCase"]));
            expensetye = Convert.ToString(QueryAES.UrlDecode(Request.Form["expensetype"]));
            category = Convert.ToString(QueryAES.UrlDecode(Request.Form["category"]));
            createdby = Convert.ToString(QueryAES.UrlDecode(Request.Form["createdfor"]));
            var txtRetainername = Convert.ToString(QueryAES.UrlDecode(Request.Form["txtRetainername"]));
            var txtdescriptionfilter = Convert.ToString(QueryAES.UrlDecode(Request.Form["txtdescriptionfilter"]));
            string currencyfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["currencyfilter"]));
            if (String.IsNullOrEmpty(loginid) || loginid == "null")
            {
                loginid = Guid.Empty.ToString();
            }
            string exlfilename = "ExpenseReport_" + DateTime.Now;
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<usp_GetExpenseReport_Result> trialList_1 = new List<usp_GetExpenseReport_Result>();
            trialList_1 = db.usp_GetExpenseReport(clientid, expensetye, category, caseid, datefrom, dateto, firmid, userid,
                createdby, pagenumber, pagesize, loginid, pageid.ToString(), txtRetainername, txtdescriptionfilter, currencyfilter).ToList();
            var actionmode = "";
            var recentlabel = "";
            usp_GetExpenseReportExcel_Result Item = new usp_GetExpenseReportExcel_Result();
            int count = trialList_1.Count;
            var trialList = (from data in trialList_1
                             select new
                             {
                                 SlNo = data.rownum,
                                 Date = String.Format("{0:dd MMM yyyy}", data.dExpensedate),
                                 MattersName = data.Casename,
                                 ClientName = data.cfname,
                                 Mobile = data.cmobile,
                                 Expensetype = data.ExpenseType,
                                 Category = data.ExpenseCategory,
                                 Description = data.Descriptions,
                                 Price = data.Price_Rate,
                                 Unit = data.Units,
                                 Total = data.Total,
                                 CreatedBy = data.CreatedBy,
                                 CreateFor = data.MemberName,
                                 Currency = data.CurrencyName
                             }).ToList();
            var gv = new GridView();
            gv.DataSource = trialList;
            gv.DataBind();
            //gv.HeaderStyle.BackColor = System.Web.UI.WebContr.Gray;
            //gv.HeaderStyle.ForeColor = System.Web.UI.WebControls.Color.White;
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
        /// <summary>
        /// Export expense report in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoPdfExpenseReport()
        {
            int pagenumber = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagenum"]));
            int pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagesize"]));
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string clientid = "", caseid = "", datefrom = "", dateto = "";
            datefrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["datefrom"]));
            dateto = Convert.ToString(QueryAES.UrlDecode(Request.Form["dateto"]));
            string loginid = Convert.ToString(QueryAES.UrlDecode(Request.Form["loginid"]));
            string expensetye = "", category = "", createdby = "";
            clientid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ddlExpenceClient"]));
            caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ddlExpenceCase"]));
            expensetye = Convert.ToString(QueryAES.UrlDecode(Request.Form["expensetype"]));
            category = Convert.ToString(QueryAES.UrlDecode(Request.Form["category"]));
            createdby = Convert.ToString(QueryAES.UrlDecode(Request.Form["createdfor"]));
            if (String.IsNullOrEmpty(loginid) || loginid == "null")
            {
                loginid = Guid.Empty.ToString();
            }
            string filename = "ExpenseReport.pdf";
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
            strtemplate += "<center><p><strong>Mykase-Expense List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
            strtemplate += " <p></p>";
            strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
            strtemplate += "  <thead><tr> ";
            strtemplate += "<th height='20' width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Matters Name</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Client Name</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mobile</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Expense Type</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Description</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Price/Rate</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Unit</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Total</th>";
            strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Created By</th>";
            strtemplate += "</tr></thead><tbody>";
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<usp_GetExpenseReportExcel_Result> trialList_1 = new List<usp_GetExpenseReportExcel_Result>();
            trialList_1 = db.usp_GetExpenseReportExcel(clientid, expensetye, category, caseid, datefrom, dateto, firmid, userid,
                createdby, pagenumber, pagesize, loginid, pageid.ToString()).ToList();
            foreach (var data in trialList_1.ToList())
            {
                strtemplate += "<tr><td height = '20' align = 'left' valign ='top'style='padding:0 5px;' >" + data.rownum + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + String.Format("{0:dd MMM yyyy}", data.dExpensedate) + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + data.Casename + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.cfname + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.cmobile + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.ExpenseType + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.ExpenseCategory + "  </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Descriptions + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Price_Rate + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Units + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Total + " </td>";
                strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.CreatedBy + " </td></tr>";
            }
            strtemplate += "</tbody></table>";
            string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
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
            var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
            System.IO.File.WriteAllBytes(pffth, pdfBytes);
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();
        }
        /// <summary>
        /// Export matter report in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoExcelMatterReport()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var odate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["odate"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                var clientname = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["clientname"]));
                var court = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["court"]));
                var cstatus = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["cstatus"]));
                var searchuser = Convert.ToString(Request.QueryString["users"]);
                int pagenum = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenum"])));
                int pagesize = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"])));
                var mattertype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["mattertype"]));
                var casetype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casetype"]));
                var subjecttype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["subjecttype"]));
                var datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                var IsAdded = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["IsAdded"]));
                int pageid = 0;
                int roleid = Convert.ToInt32(LoggedInUser.RoleId);
                if (searchuser == "null" || searchuser == null || searchuser == "undefined")
                { searchuser = Guid.Empty.ToString(); }
                if (odate == "null" || odate == null || odate == "undefined")
                { odate = ""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                if (clientname == "null" || clientname == null || clientname == "undefined")
                { clientname = ""; }
                if (court == "null" || court == null || court == "undefined")
                { court = ""; }
                if (cstatus == "null" || cstatus == null || cstatus == "undefined")
                { cstatus = ""; }
                if (mattertype == "null" || mattertype == null || mattertype == "undefined")
                { mattertype = ""; }
                if (casetype == "null" || casetype == null || casetype == "undefined")
                { casetype = ""; }
                if (subjecttype == "null" || subjecttype == null || subjecttype == "undefined")
                { subjecttype = ""; }
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string exlfilename = "MatterReport_" + DateTime.Now;
                List<usp_GetUserNewCaseDetailAddedForReport_Result> trialList_1 = new List<usp_GetUserNewCaseDetailAddedForReport_Result>();
                List<usp_GetUserNewCaseDetailAssignedForReport_Result> trialList_2 = new List<usp_GetUserNewCaseDetailAssignedForReport_Result>();
                StringBuilder sb = new StringBuilder();
                if (IsAdded == "1")
                {
                    exlfilename = "MatterAddedReport_" + DateTime.Now;
                    trialList_1 = db.usp_GetUserNewCaseDetailAddedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    foreach (var data in trialList_1.ToList())
                    {
                        usp_GetUserNewCaseDetailAddedForReport_Result newItem = new usp_GetUserNewCaseDetailAddedForReport_Result();
                        sb.Clear();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                        if (data.UserCaseid != null)
                        {
                            newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                        }
                    }
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         StartDate = String.Format("{0:dd MMM yyyy}", ob.odate),
                                         MatterName = ob.mname,
                                         ClientName = ((ob.ClientName == "" || ob.ClientName == "null") ? "" : ob.ClientName),
                                         CourtName = ob.CourtName,
                                         ClientContact = ob.PrimaryContactName,
                                         TeamMembers = ob.assignuserto,
                                         Status = ob.cstatus,
                                         CloseDate = String.Format("{0:dd MMM yyyy}", ob.cdate),
                                     }).ToList();
                    var gv = new GridView();
                    gv.DataSource = trialList;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = System.Drawing.Color.Gray;
                    gv.HeaderStyle.ForeColor = System.Drawing.Color.White;
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
                if (IsAdded == "0")  //ie: assigned matters
                {
                    exlfilename = "MatterAssignedReport_" + DateTime.Now;
                    trialList_2 = db.usp_GetUserNewCaseDetailAssignedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    foreach (var data in trialList_2.ToList())
                    {
                        usp_GetUserNewCaseDetailAssignedForReport_Result newItem = new usp_GetUserNewCaseDetailAssignedForReport_Result();
                        sb.Clear();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        trialList_2[trialList_2.IndexOf(data)].Id = newItem.Id;
                        if (data.UserCaseid != null)
                        {
                            newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                            trialList_2[trialList_2.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                        }
                    }
                    var trialList = (from ob in trialList_2
                                     select new
                                     {
                                         StartDate = String.Format("{0:dd MMM yyyy}", ob.odate),
                                         MatterName = ob.mname,
                                         ClientName = ((ob.ClientName == "" || ob.ClientName == "null") ? "" : ob.ClientName),
                                         CourtName = ob.CourtName,
                                         ClientContact = ob.PrimaryContactName,
                                         TeamMembers = ob.assignuserto,
                                         Status = ob.cstatus,
                                         CloseDate = String.Format("{0:dd MMM yyyy}", ob.cdate),
                                     }).ToList();
                    var gv = new GridView();
                    gv.DataSource = trialList;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = System.Drawing.Color.Gray;
                    gv.HeaderStyle.ForeColor = System.Drawing.Color.White;
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
                //return "success";
            }
            catch (Exception ex)
            {
                //return "Oops! Something went wrong..";
            }
        }
        /// <summary>
        /// Export matter report in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoPDFmatterReport()
        {
            try
            {
                string filename = "MatterReport.pdf";
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var odate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["odate"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                var clientname = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["clientname"]));
                var court = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["court"]));
                var cstatus = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["cstatus"]));
                var searchuser = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["users"]));
                int pagenum = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenum"])));
                int pagesize = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"])));
                var mattertype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["mattertype"]));
                var casetype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casetype"]));
                var subjecttype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["subjecttype"]));
                var datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                var IsAdded = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["IsAdded"]));
                int pageid = 0;
                int roleid = Convert.ToInt32(LoggedInUser.RoleId);
                if (searchuser == "null" || searchuser == null || searchuser == "undefined")
                { searchuser = Guid.Empty.ToString(); }
                if (odate == "null" || odate == null || odate == "undefined")
                { odate = ""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                if (clientname == "null" || clientname == null || clientname == "undefined")
                { clientname = ""; }
                if (court == "null" || court == null || court == "undefined")
                { court = ""; }
                if (cstatus == "null" || cstatus == null || cstatus == "undefined")
                { cstatus = ""; }
                if (mattertype == "null" || mattertype == null || mattertype == "undefined")
                { mattertype = ""; }
                if (casetype == "null" || casetype == null || casetype == "undefined")
                { casetype = ""; }
                if (subjecttype == "null" || subjecttype == null || subjecttype == "undefined")
                { subjecttype = ""; }
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string pdfnamelabel = "Matter Added Report";
                if (IsAdded == "1")
                {
                    pdfnamelabel = "Matter Added Report";
                }
                if (IsAdded == "0")
                {
                    pdfnamelabel = "Matter Assigned Report";
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
                strtemplate += "<center><p><strong>Mykase-" + pdfnamelabel + "</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>StartDate </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>MatterName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ClientName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ClientContact </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>TeamMembers </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
                strtemplate += "</tr></thead><tbody>";
                List<usp_GetUserNewCaseDetailAddedForReport_Result> trialList_1 = new List<usp_GetUserNewCaseDetailAddedForReport_Result>();
                List<usp_GetUserNewCaseDetailAssignedForReport_Result> trialList_2 = new List<usp_GetUserNewCaseDetailAssignedForReport_Result>();
                StringBuilder sb = new StringBuilder();
                if (IsAdded == "1")
                {
                    filename = "MatterAddedReport.pdf";
                    trialList_1 = db.usp_GetUserNewCaseDetailAddedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    foreach (var data in trialList_1.ToList())
                    {
                        usp_GetUserNewCaseDetailAddedForReport_Result newItem = new usp_GetUserNewCaseDetailAddedForReport_Result();
                        sb.Clear();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                        if (data.UserCaseid != null)
                        {
                            newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                        }
                    }
                    if (trialList_1 != null)
                    {
                        foreach (usp_GetUserNewCaseDetailAddedForReport_Result idata in trialList_1)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ((idata.ClientName == "" || idata.ClientName == "null") ? "" : idata.ClientName) + "</td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.CourtName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.PrimaryContactName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.assignuserto + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.cstatus + " </td>";
                            var closesate = idata.cdate.ToString();
                            if (String.IsNullOrEmpty(closesate) || closesate.ToString() == "01-01-1900 00:00:00" || closesate.ToString() == "01/01/1900 00:00:00")
                            {
                                closesate = "";
                                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + closesate + " </td>";
                            }
                            else
                            {
                                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", Convert.ToDateTime(closesate)) + " </td>";
                            }
                            strtemplate += "</tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                if (IsAdded == "0")
                {
                    filename = "MatterAssignedReport.pdf";
                    trialList_2 = db.usp_GetUserNewCaseDetailAssignedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                       court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    foreach (var data in trialList_2.ToList())
                    {
                        usp_GetUserNewCaseDetailAssignedForReport_Result newItem = new usp_GetUserNewCaseDetailAssignedForReport_Result();
                        sb.Clear();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        trialList_2[trialList_2.IndexOf(data)].Id = newItem.Id;
                        if (data.UserCaseid != null)
                        {
                            newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                            trialList_2[trialList_2.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                        }
                    }
                    if (trialList_2 != null)
                    {
                        foreach (usp_GetUserNewCaseDetailAssignedForReport_Result idata in trialList_2)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ((idata.ClientName == "" || idata.ClientName == "null") ? "" : idata.ClientName) + "</td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.CourtName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.PrimaryContactName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.assignuserto + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.cstatus + " </td>";
                            var closesate = idata.cdate.ToString();
                            if (String.IsNullOrEmpty(closesate) || closesate.ToString() == "01-01-1900 00:00:00" || closesate.ToString() == "01/01/1900 00:00:00")
                            {
                                closesate = "";
                                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + closesate + " </td>";
                            }
                            else
                            {
                                strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", Convert.ToDateTime(closesate)) + " </td>";
                            }
                            strtemplate += "</tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
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
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
            }
            catch (Exception ex)
            {
                //return "Oops! Something went wrong.";
            }
        }
        /// <summary>
        /// Export time entry report in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoExcelTimeEntryReport()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["search"]));
                int pagenum = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenum"])));
                int pagesize = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"])));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                var client = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["client"]));
                var tasktype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["tasktype"]));
                var islog = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["islog"]));
                var datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                var user = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["user"]));
                if (search == "null" || search == null || search == "undefined")
                { search = ""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                if (client == "null" || client == null || client == "undefined")
                { client = ""; }
                if (tasktype == "null" || tasktype == null || tasktype == "undefined")
                { tasktype = ""; }
                if (islog == "null" || islog == null || islog == "undefined")
                { islog = "1"; }
                if (dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = ""; }
                if (datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = ""; }
                if (user == "null" || user == null || user == "undefined")
                { user = ""; }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string exlfilename = "MatterReport_" + DateTime.Now;
                List<usp_GetTimeEntryReport_Result> trialList_1 = new List<usp_GetTimeEntryReport_Result>();
                StringBuilder sb = new StringBuilder();
                if (islog == "1")
                {
                    exlfilename = "TimeEntryReport_" + DateTime.Now;
                    trialList_1 = db.usp_GetTimeEntryReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0,
                        pageid, search, client, tasktype, islog, user, datefrom, dateto).ToList();
                    foreach (var data in trialList_1.ToList())
                    {
                        usp_GetTimeEntryReport_Result newItem = new usp_GetTimeEntryReport_Result();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                        if (data.tmatter != null)
                        {
                            newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].tmatter = newItem.tmatter;
                        }
                    }
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         Date = String.Format("{0:dd MMM yyyy}", ob.tdate),
                                         MatterName = ob.mattername,
                                         ClientName = ((ob.client == "" || ob.client == "null") ? "" : ob.client),
                                         Duration = ob.callDura,
                                         Createdby = ob.createdby,
                                         TaskType = ob.titem,
                                     }).ToList();
                    var gv = new GridView();
                    gv.DataSource = trialList;
                    gv.DataBind();
                    gv.HeaderStyle.BackColor = System.Drawing.Color.Gray;
                    gv.HeaderStyle.ForeColor = System.Drawing.Color.White;
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
            }
            catch (Exception ex)
            {
            }
        }
        /// <summary>
        /// Export time entry report in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoPDFTimeEntryReport()
        {
            try
            {
                string filename = "TimeEntryReport.pdf";
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["search"]));
                int pagenum = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenum"])));
                int pagesize = Convert.ToInt32(Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"])));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                var client = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["client"]));
                var tasktype = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["tasktype"]));
                var islog = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["islog"]));
                var datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                var user = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["user"]));
                if (search == "null" || search == null || search == "undefined")
                { search = ""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                if (client == "null" || client == null || client == "undefined")
                { client = ""; }
                if (tasktype == "null" || tasktype == null || tasktype == "undefined")
                { tasktype = ""; }
                if (islog == "null" || islog == null || islog == "undefined")
                { islog = "1"; }
                if (dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = ""; }
                if (datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = ""; }
                if (user == "null" || user == null || user == "undefined")
                { user = ""; }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string pdfnamelabel = "Time Entry Report";
                if (islog == "1")
                {
                    pdfnamelabel = "Time Entry Logged Report";
                }
                if (islog == "0")
                {
                    pdfnamelabel = "Time Entry Modified Report";
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
                strtemplate += "<center><p><strong>Mykase-" + pdfnamelabel + "</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Date </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>MatterName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ClientName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Duration </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Createdby </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Tasktype </th>";
                strtemplate += "</tr></thead><tbody>";
                List<usp_GetTimeEntryReport_Result> trialList_1 = new List<usp_GetTimeEntryReport_Result>();
                StringBuilder sb = new StringBuilder();
                filename = "MatterAddedReport.pdf";
                trialList_1 = db.usp_GetTimeEntryReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0,
                   pageid, search, client, tasktype, islog, user, datefrom, dateto).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    usp_GetTimeEntryReport_Result newItem = new usp_GetTimeEntryReport_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                    if (data.tmatter != null)
                    {
                        newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].tmatter = newItem.tmatter;
                    }
                }
                if (trialList_1 != null)
                {
                    foreach (usp_GetTimeEntryReport_Result idata in trialList_1)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.tdate) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mattername + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + ((idata.client == "" || idata.client == "null") ? "" : idata.client) + "</td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.callDura + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.createdby + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.titem + " </td>";
                        strtemplate += "</tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else
                {
                }
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
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
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
            }
            catch (Exception ex)
            {
            }
        }


        ////======================================Start==> IOCL Report============
        [FirmControllerAuthorization]
        public ActionResult IOCLReport()
        {
            string IOCLPermission = System.Configuration.ConfigurationManager.AppSettings["IOCLCustomization"].ToString();
            string frmidsIOCL = Session["sessionfirmid"].ToString();
            if (frmidsIOCL.ToLower() != IOCLPermission.ToLower())
            {
                return RedirectToAction("UnauthoriseAdmin", "Home");
            }
            //Execute SyncSebiReportData asynchronously without waiting
            if (string.IsNullOrEmpty(Convert.ToString(Session["IsReportSync"])))
            {
                Task.Run(() => SyncSebiReportData());
                Session["IsReportSync"] = "1";
            }

            return View();

        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AgewiseShortPendingReportIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult FavourAgainstDisposedReportIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult AgewiseDetailsPendingReportIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult PendingCaseReportForAllCourtIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult CategorisationofLitigationcasesIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult StatewiseBreakUpCaseReportsIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult CaseReportForAllCourtIOCL()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult IOCLSuccessRateReport()
        {
            return View();
        }

        ////======================================End==> IOCL Report============

        #region SEBI REPORTS Amit Kumar- 24 May 2024


        ////======================================Start==> Sebi Report============
        [FirmControllerAuthorization]
        public ActionResult SebiReport()
        {
            string SebiPermission = System.Configuration.ConfigurationManager.AppSettings["SebiModulePermission"].ToString();
            string frmids = Session["sessionfirmid"].ToString();
            if (frmids.ToLower() != SebiPermission.ToLower())
            {
                return RedirectToAction("UnauthoriseAdmin", "Home");
            }
            //Execute SyncSebiReportData asynchronously without waiting
            if (string.IsNullOrEmpty(Convert.ToString(Session["IsReportSync"])))
            {
                Task.Run(() => SyncSebiReportData());
                Session["IsReportSync"] = "1";
            }

            return View();

        }
        [FirmControllerAuthorization]
        public async Task<string> SyncSebiReportData()
        {
            try
            {

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                var getuserdetails = DataAccessADO.SyncSebiReportData(LoggedInUser.FirmId.ToString());
                //  var getuserdetails = db.usp_wf_GetUserNameforAPI(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                string vusernam = getuserdetails.Rows[0]["UserName"].ToString();
                if (getuserdetails.Rows[0]["UserName"].ToString().StartsWith("MyKase_"))
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                }
                else
                {
                    AccessTokenDetail = "internal";
                }
                //userIdDetail = getuserdetails.ToString();
                userIdDetail = vusernam;
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/BindAllcaseforMyKaseAdditionalSebiSync"), "POST", builders);
                var param = apiUrl + "ReportController=>BindAllcaseforMyKaseAdditionalSebiSync=>/API/Search/BindAllcaseforMyKaseAdditionalSebiSync" + "@" + builders;
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    string status = jObject.Status;
                    string message = jObject.Message;
                    Int64 mastercaseid = data1[i].mastercaseid;
                    Int64 usercaseid = data1[i].usercaseid;
                    string vCourtName = data1[i].vCourtName;
                    string vState = data1[i].vState;
                    string city = data1[i].City;
                    string benchName = data1[i].BenchName;
                    string applicant = data1[i].applicant;
                    string respondent = data1[i].respondent;
                    string scasetype = data1[i].scasetype;
                    string filingDateString = data1[i].FilingDate?.ToString();
                    DateTime? filingDate = string.IsNullOrEmpty(filingDateString) ? (DateTime?)null : DateTime.Parse(filingDateString);
                    string vusername = data1[i].vusername;
                    string filedby = data1[i].filedby;

                    //int result=LawPracticeFirm.DAL.DataAccessADO.UpdateSebiOtherDetailsbyCWSync(LoggedInUser.FirmId.ToString(), 
                    //    LoggedInUser.UserId.ToString(), mastercaseid, usercaseid, vCourtName, vState, city, benchName, applicant,
                    //    respondent, scasetype, filingDate, filedby);

                    string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                    using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                    {
                        conn.Open();
                        using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("sp_UpdateSebiOtherDetailsbyCWSync", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                            cmd.Parameters.AddWithValue("@userid", LoggedInUser.UserId.ToString());
                            cmd.Parameters.AddWithValue("@mastercaseid", mastercaseid);
                            cmd.Parameters.AddWithValue("@usercaseid", usercaseid);
                            cmd.Parameters.AddWithValue("@vCourtName", vCourtName);
                            cmd.Parameters.AddWithValue("@vState", vState);
                            cmd.Parameters.AddWithValue("@city", city);
                            cmd.Parameters.AddWithValue("@benchName", benchName);
                            cmd.Parameters.AddWithValue("@applicant", applicant);
                            cmd.Parameters.AddWithValue("@respondent", respondent);
                            cmd.Parameters.AddWithValue("@scasetype", scasetype);
                            cmd.Parameters.AddWithValue("@filingDate", filingDate);
                            cmd.Parameters.AddWithValue("@filedby", filedby);
                            int result = cmd.ExecuteNonQuery();
                            conn.Close();
                            if (result > 0)
                            {
                            }
                            else
                            {
                            }
                        }
                    }
                    // Process the fetched data as needed
                }
                return "Ok";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AgewiseShortPendingReport()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public async Task<JsonResult> GetAgewiseShortPendingReport(string month = "", string year = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //apiUrl = "http://10.60.1.42:8113";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                // var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReport"), "POST", builders);
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReportTest"), "POST", builders);
                var param = apiUrl + "ReportController=>GetAgewiseShortPendingReport=>/API/Search/AgewiseShortPendingReport" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                return Json(JsonConvert.SerializeObject(data1));
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [FirmControllerAuthorization]
        public async void ExportoAgeWiseData(string Month, string Year)
        {
            // htmlData = HttpUtility.UrlDecode(htmlData);
            string firmid = LoggedInUser.FirmId.ToString();
            string userid = LoggedInUser.UserId.ToString();

            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //apiUrl = "http://10.60.1.42:8113";
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();

            string AccessTokenDetail = "internal";
            string userIdDetail = userId;


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                monthid = Month,
                year = Year
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReport"), "POST", builders);
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var dataAsDict = data1.ToObject<Dictionary<string, JToken>>();
            List<AgeWiseShortReport> AgeWiseShortList = new List<AgeWiseShortReport>();
            List<AgeWiseSortReportSc> AgeWiseShortListsc = new List<AgeWiseSortReportSc>();
            StringBuilder sb = new StringBuilder();

            string reportdata = "SEBI- Age wise analysis of pending cases";
            if (Month != "" && Year != "")
            {
                string monthName = new DateTime(Convert.ToInt16(Year), Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                reportdata = "SEBI- Age wise analysis of pending cases  - " + monthName + " " + Year + "";
            }
            var strhtml = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>";
            foreach (var key in dataAsDict.Keys)
            {
                if (dataAsDict.ContainsKey(key))
                {
                    var tableData = dataAsDict[key];
                    int totalCaseCount = 0;
                    var tableDataList = tableData.ToObject<List<Dictionary<string, object>>>();
                    switch (key)
                    {
                        case "Table":
                            {
                                var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                var zones = new List<string> { "_15Z", "Non_15Z" }; // Match the exact format of ZoneName
                                var summaryData = new Dictionary<string, Dictionary<string, int>>();

                                foreach (var yearD in years)
                                {
                                    summaryData[yearD] = new Dictionary<string, int>();
                                    foreach (var zone in zones)
                                    {
                                        summaryData[yearD][zone] = 0;
                                    }
                                }

                                foreach (var row in tableData)
                                {
                                    var zoneName = row.ZoneName?.ToString()?.Trim();
                                    var caseCount = row.CaseCount ?? 0;
                                    var caseYear = row.year?.ToString()?.Trim();

                                    // Normalize ZoneName
                                    if (!string.IsNullOrEmpty(zoneName))
                                    {
                                        // Replace spaces with underscores
                                        if (zoneName == "15Z")
                                        {
                                            zoneName = "_15Z";
                                        }
                                        else
                                        {
                                            zoneName = zoneName.Replace(" ", "_");

                                        }
                                    }

                                    if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA" && years.Contains(caseYear))
                                    {
                                        if (summaryData[caseYear].ContainsKey(zoneName))
                                        {
                                            summaryData[caseYear][zoneName] += Convert.ToInt32(caseCount);
                                        }
                                    }
                                }

                                // Generate the report
                                foreach (var yearData in summaryData)
                                {
                                    var yearD = yearData.Key;
                                    var zoneData = yearData.Value;

                                    var non15ZCount = zoneData.ContainsKey("Non_15Z") ? zoneData["Non_15Z"] : 0;
                                    var fifteenZCount = zoneData.ContainsKey("_15Z") ? zoneData["_15Z"] : 0;

                                    AgeWiseSortReportSc model = new AgeWiseSortReportSc
                                    {
                                        Court = "Supreme Court",
                                        Rowlevel = yearD,
                                        Non_15Z = non15ZCount,
                                        _15Z = fifteenZCount,
                                        TotalCase = non15ZCount + fifteenZCount
                                    };

                                    AgeWiseShortListsc.Add(model);
                                }

                                break;
                            }
                        case "Table1":
                            {

                                var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                var zones = new List<string> { "HO", "ERO", "NRO", "WRO", "SRO" };
                                var summaryData = new Dictionary<string, Dictionary<string, int>>();
                                foreach (var yearD in years)
                                {
                                    summaryData[yearD] = new Dictionary<string, int>();
                                    foreach (var zone in zones)
                                    {
                                        summaryData[yearD][zone] = 0;
                                    }
                                }
                                var summaryDataKeys = summaryData.Keys.ToList();
                                for (int i = 0; i < summaryDataKeys.Count; i++)
                                {
                                    var yearD = summaryDataKeys[i]; // Access the year key based on index

                                    foreach (var row in tableData)
                                    {
                                        // Extract row data
                                        var zoneName = row.ZoneName?.ToString();
                                        var caseCount = row.CaseCount;
                                        var caseyear = row.year?.ToString();

                                        if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA")
                                        {
                                            // Check if the zone key exists before updating
                                            if (summaryData[yearD].ContainsKey(zoneName))
                                            {
                                                if (summaryData[yearD][zoneName] == summaryData[caseyear][zoneName] && yearD == caseyear)
                                                {
                                                    summaryData[yearD][zoneName] += Convert.ToInt32(caseCount) ?? 0;
                                                }
                                            }
                                        }
                                    }
                                }
                                foreach (var bn in summaryData)
                                {
                                    var yearD = bn.Key;
                                    var zoneN = bn.Value;

                                    var HO = zoneN.ContainsKey("HO") ? zoneN["HO"] : 0;
                                    var ERO = zoneN.ContainsKey("ERO") ? zoneN["ERO"] : 0;
                                    var NRO = zoneN.ContainsKey("NRO") ? zoneN["NRO"] : 0;
                                    var WRO = zoneN.ContainsKey("WRO") ? zoneN["WRO"] : 0;
                                    var SRO = zoneN.ContainsKey("SRO") ? zoneN["SRO"] : 0;


                                    AgeWiseShortReport model = new AgeWiseShortReport
                                    {
                                        Court = "High Court",
                                        Rowlevel = yearD,
                                        HO = Convert.ToInt32(HO),
                                        ERO = Convert.ToInt32(ERO),
                                        NRO = Convert.ToInt32(NRO),
                                        WRO = Convert.ToInt32(WRO),
                                        SRO = Convert.ToInt32(SRO)
                                    };
                                    AgeWiseShortList.Add(model);
                                }

                                break;
                            }
                        case "Table2":
                            {
                                var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                var zones = new List<string> { "HO", "ERO", "NRO", "WRO", "SRO" };
                                var summaryData = new Dictionary<string, Dictionary<string, int>>();
                                foreach (var yearD in years)
                                {
                                    summaryData[yearD] = new Dictionary<string, int>();
                                    foreach (var zone in zones)
                                    {
                                        summaryData[yearD][zone] = 0;
                                    }
                                }

                                var summaryDataKeys = summaryData.Keys.ToList();

                                for (int i = 0; i < summaryDataKeys.Count; i++)
                                {
                                    var yearD = summaryDataKeys[i]; // Access the year key based on index

                                    foreach (var row in tableData)
                                    {
                                        // Extract row data
                                        var zoneName = row.ZoneName?.ToString();
                                        var caseCount = row.CaseCount;
                                        var caseyear = row.year?.ToString();

                                        if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA")
                                        {
                                            // Check if the zone key exists before updating
                                            if (summaryData[yearD].ContainsKey(zoneName))
                                            {
                                                if (summaryData[yearD][zoneName] == summaryData[caseyear][zoneName] && yearD == caseyear)
                                                {
                                                    summaryData[yearD][zoneName] += Convert.ToInt32(caseCount) ?? 0;

                                                }
                                            }
                                        }
                                    }
                                }
                                foreach (var bn in summaryData)
                                {
                                    var yearD = bn.Key;
                                    var zoneN = bn.Value;

                                    var HO = zoneN.ContainsKey("HO") ? zoneN["HO"] : 0;
                                    var ERO = zoneN.ContainsKey("ERO") ? zoneN["ERO"] : 0;
                                    var NRO = zoneN.ContainsKey("NRO") ? zoneN["NRO"] : 0;
                                    var WRO = zoneN.ContainsKey("WRO") ? zoneN["WRO"] : 0;
                                    var SRO = zoneN.ContainsKey("SRO") ? zoneN["SRO"] : 0;


                                    AgeWiseShortReport model = new AgeWiseShortReport
                                    {
                                        Court = "Tribunals-NCLT/NCLAT",
                                        Rowlevel = yearD,
                                        HO = Convert.ToInt32(HO),
                                        ERO = Convert.ToInt32(ERO),
                                        NRO = Convert.ToInt32(NRO),
                                        WRO = Convert.ToInt32(WRO),
                                        SRO = Convert.ToInt32(SRO)
                                    };
                                    AgeWiseShortList.Add(model);
                                }
                                break;
                            }
                        case "Table3":
                            {
                                for (var i = 0; i < tableDataList.Count; i++)
                                {
                                    var row = tableDataList[i];
                                    var court = "Other Court";
                                    var rowlevel = row["year"];
                                    var countofYearofFiling = row["CaseCount"];
                                    totalCaseCount += countofYearofFiling;
                                    AgeWiseShortList.Add(new AgeWiseShortReport { Court = court, Rowlevel = rowlevel, CountofYearofFiling = countofYearofFiling, TotalCase = totalCaseCount });
                                }

                                break;
                            }
                    }
                }
            }

            // Add a title for the report
            sb.Append("<table border='1'>");
            sb.Append("<tr><td colspan='7' style='text-align:center; font-weight:bold;'>SEBI - Age wise analysis of pending cases </td></tr>");

            // Generate data for Supreme Court
            var supremeCourtData = AgeWiseShortListsc.Where(row => row.Court == "Supreme Court").ToList();
            if (supremeCourtData.Any())
            {
                sb.Append("<tr><td colspan='7'></td></tr>");
                sb.Append("<tr>");
                sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>15Z</th><th style='font-weight:bold; background-color:gray; color:white;'>Non 15Z</th>");
                sb.Append("</tr>");
                int total15Z = 0, totalNon15Z = 0;
                foreach (var row in supremeCourtData)
                {
                    sb.Append("<tr>");
                    sb.Append($"<td>{row.Court}</td>");
                    sb.Append($"<td>{row.Rowlevel}</td>");
                    sb.Append($"<td>{row._15Z}</td>");
                    sb.Append($"<td>{row.Non_15Z}</td>");
                    sb.Append("</tr>");
                    total15Z += row._15Z;
                    totalNon15Z += row.Non_15Z;


                }
                sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                sb.Append($"<td>{total15Z}</td>");
                sb.Append($"<td>{totalNon15Z}</td>");
                sb.Append("</tr>");
            }


            // Generate data for High Court
            var highCourtData = AgeWiseShortList.Where(row => row.Court == "High Court").ToList();
            if (highCourtData.Any())
            {
                sb.Append("<tr><td colspan='7'></td></tr>");
                sb.Append("<tr>");
                sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;width:30px'>HO</th><th style='font-weight:bold; background-color:gray; color:white;width:30px'>ERO</th><th style='font-weight:bold; background-color:gray; color:white;width:30px'>NRO</th><th style='font-weight:bold; background-color:gray; color:white;width:30px'>WRO</th><th style='font-weight:bold; background-color:gray; color:white;width:30px'>SRO</th>");
                sb.Append("</tr>");
                int totalHO = 0, totalERO = 0, totalNRO = 0, totalWRO = 0, totalSRO = 0;
                foreach (var row in highCourtData)
                {
                    sb.Append("<tr>");
                    sb.Append($"<td>{row.Court}</td>");
                    sb.Append($"<td>{row.Rowlevel}</td>");
                    sb.Append($"<td>{row.HO}</td>");
                    sb.Append($"<td>{row.ERO}</td>");
                    sb.Append($"<td>{row.NRO}</td>");
                    sb.Append($"<td>{row.WRO}</td>");
                    sb.Append($"<td>{row.SRO}</td>");
                    sb.Append("</tr>");

                    totalHO += row.HO;
                    totalERO += row.ERO;
                    totalNRO += row.NRO;
                    totalWRO += row.WRO;
                    totalSRO += row.SRO;
                }
                sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                sb.Append($"<td>{totalHO}</td>");
                sb.Append($"<td>{totalERO}</td>");
                sb.Append($"<td>{totalNRO}</td>");
                sb.Append($"<td>{totalWRO}</td>");
                sb.Append($"<td>{totalSRO}</td>");
                sb.Append("</tr>");
            }

            var tribunalCourtData = AgeWiseShortList.Where(row => row.Court == "Tribunals-NCLT/NCLAT").ToList();
            if (tribunalCourtData.Any())
            {
                sb.Append("<tr><td colspan='7'></td></tr>");
                sb.Append("<tr>");
                sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>HO</th><th style='font-weight:bold; background-color:gray; color:white;'>ERO</th><th style='font-weight:bold; background-color:gray; color:white;'>NRO</th><th style='font-weight:bold; background-color:gray; color:white;'>WRO</th><th style='font-weight:bold; background-color:gray; color:white;'>SRO</th>");
                sb.Append("</tr>");

                int totalHO = 0, totalERO = 0, totalNRO = 0, totalWRO = 0, totalSRO = 0;
                foreach (var row in tribunalCourtData)
                {
                    sb.Append("<tr>");
                    sb.Append($"<td>{row.Court}</td>");
                    sb.Append($"<td>{row.Rowlevel}</td>");
                    sb.Append($"<td>{row.HO}</td>");
                    sb.Append($"<td>{row.ERO}</td>");
                    sb.Append($"<td>{row.NRO}</td>");
                    sb.Append($"<td>{row.WRO}</td>");
                    sb.Append($"<td>{row.SRO}</td>");
                    sb.Append("</tr>");

                    totalHO += row.HO;
                    totalERO += row.ERO;
                    totalNRO += row.NRO;
                    totalWRO += row.WRO;
                    totalSRO += row.SRO;
                }
                sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                sb.Append($"<td>{totalHO}</td>");
                sb.Append($"<td>{totalERO}</td>");
                sb.Append($"<td>{totalNRO}</td>");
                sb.Append($"<td>{totalWRO}</td>");
                sb.Append($"<td>{totalSRO}</td>");
                sb.Append("</tr>");

            }

            var otherCourtData = AgeWiseShortList.Where(row => row.Court == "Other Court").ToList();
            if (otherCourtData.Any())
            {
                sb.Append("<tr><td colspan='7'></td></tr>");
                sb.Append("<tr>");
                sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th colspan='5' style='font-weight:bold; background-color:gray; color:white;width:150px''>Count of Year of Filing</th>");
                sb.Append("</tr>");
                int totC = 0;
                foreach (var row in otherCourtData)
                {
                    sb.Append("<tr>");
                    sb.Append($"<td>{row.Court}</td>");
                    sb.Append($"<td>{row.Rowlevel}</td>");
                    sb.Append($"<td colspan='5' style='width:150px'>{row.CountofYearofFiling}</td>");
                    sb.Append("</tr>");
                    totC += Convert.ToInt32(row.CountofYearofFiling);
                }
                sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                sb.Append($"<td colspan='5' style='width:150px'>{totC}</td>");
                sb.Append("</tr>");
            }

            sb.Append("</table>");


            string filename = "Age Wise Short Pending Report " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var db = new LawPracticeEntities();
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            string strtemplate = "";
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
            strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
            strtemplate += "<p></p>";
            strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";


            strtemplate += sb;
            var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
            htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;

            var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
            htmlToPdf.Margins = pageMargins;
            htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";

            var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
            var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
            System.IO.File.WriteAllBytes(pffth, pdfBytes);
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Matter list PDF";

        }


        //Export Excel sebi report
        [FirmControllerAuthorization]
        public void ExportToExcelAgewiseShort(string month = "", string year = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReport"), "POST", builders);
                var param = apiUrl + "ReportController=>GetAgewiseShortPendingReport=>/API/Search/AgewiseShortPendingReport" + "@" + builders;

                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                var dataAsDict = data1.ToObject<Dictionary<string, JToken>>();
                List<AgeWiseShortReport> AgeWiseShortList = new List<AgeWiseShortReport>();
                List<AgeWiseSortReportSc> AgeWiseShortListsc = new List<AgeWiseSortReportSc>();
                var gv = new GridView();
                foreach (var key in dataAsDict.Keys)
                {
                    if (dataAsDict.ContainsKey(key))
                    {
                        var tableData = dataAsDict[key];
                        int totalCaseCount = 0;
                        var tableDataList = tableData.ToObject<List<Dictionary<string, object>>>();
                        switch (key)
                        {
                            case "Table":
                                {
                                    var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                    var zones = new List<string> { "_15Z", "Non_15Z" }; // Match the exact format of ZoneName
                                    var summaryData = new Dictionary<string, Dictionary<string, int>>();

                                    foreach (var yearD in years)
                                    {
                                        summaryData[yearD] = new Dictionary<string, int>();
                                        foreach (var zone in zones)
                                        {
                                            summaryData[yearD][zone] = 0;
                                        }
                                    }

                                    foreach (var row in tableData)
                                    {
                                        var zoneName = row.ZoneName?.ToString()?.Trim();
                                        var caseCount = row.CaseCount ?? 0;
                                        var caseYear = row.year?.ToString()?.Trim();

                                        // Normalize ZoneName
                                        if (!string.IsNullOrEmpty(zoneName))
                                        {
                                            // Replace spaces with underscores
                                            if (zoneName == "15Z")
                                            {
                                                zoneName = "_15Z";
                                            }
                                            else
                                            {
                                                zoneName = zoneName.Replace(" ", "_");

                                            }
                                        }

                                        if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA" && years.Contains(caseYear))
                                        {
                                            if (summaryData[caseYear].ContainsKey(zoneName))
                                            {
                                                summaryData[caseYear][zoneName] += Convert.ToInt32(caseCount);
                                            }
                                        }
                                    }

                                    // Generate the report
                                    foreach (var yearData in summaryData)
                                    {
                                        var yearD = yearData.Key;
                                        var zoneData = yearData.Value;

                                        var non15ZCount = zoneData.ContainsKey("Non_15Z") ? zoneData["Non_15Z"] : 0;
                                        var fifteenZCount = zoneData.ContainsKey("_15Z") ? zoneData["_15Z"] : 0;

                                        AgeWiseSortReportSc model = new AgeWiseSortReportSc
                                        {
                                            Court = "Supreme Court",
                                            Rowlevel = yearD,
                                            Non_15Z = non15ZCount,
                                            _15Z = fifteenZCount,
                                            TotalCase = non15ZCount + fifteenZCount
                                        };

                                        AgeWiseShortListsc.Add(model);
                                    }

                                    break;
                                }


                            case "Table1":
                                {

                                    var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                    var zones = new List<string> { "HO", "ERO", "NRO", "WRO", "SRO" };
                                    var summaryData = new Dictionary<string, Dictionary<string, int>>();
                                    foreach (var yearD in years)
                                    {
                                        summaryData[yearD] = new Dictionary<string, int>();
                                        foreach (var zone in zones)
                                        {
                                            summaryData[yearD][zone] = 0;
                                        }
                                    }
                                    var summaryDataKeys = summaryData.Keys.ToList();
                                    for (int i = 0; i < summaryDataKeys.Count; i++)
                                    {
                                        var yearD = summaryDataKeys[i]; // Access the year key based on index

                                        foreach (var row in tableData)
                                        {
                                            // Extract row data
                                            var zoneName = row.ZoneName?.ToString();
                                            var caseCount = row.CaseCount;
                                            var caseyear = row.year?.ToString();

                                            if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA")
                                            {
                                                // Check if the zone key exists before updating
                                                if (summaryData[yearD].ContainsKey(zoneName))
                                                {
                                                    if (summaryData[yearD][zoneName] == summaryData[caseyear][zoneName] && yearD == caseyear)
                                                    {
                                                        summaryData[yearD][zoneName] += Convert.ToInt32(caseCount) ?? 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    foreach (var bn in summaryData)
                                    {
                                        var yearD = bn.Key;
                                        var zoneN = bn.Value;

                                        var HO = zoneN.ContainsKey("HO") ? zoneN["HO"] : 0;
                                        var ERO = zoneN.ContainsKey("ERO") ? zoneN["ERO"] : 0;
                                        var NRO = zoneN.ContainsKey("NRO") ? zoneN["NRO"] : 0;
                                        var WRO = zoneN.ContainsKey("WRO") ? zoneN["WRO"] : 0;
                                        var SRO = zoneN.ContainsKey("SRO") ? zoneN["SRO"] : 0;


                                        AgeWiseShortReport model = new AgeWiseShortReport
                                        {
                                            Court = "High Court",
                                            Rowlevel = yearD,
                                            HO = Convert.ToInt32(HO),
                                            ERO = Convert.ToInt32(ERO),
                                            NRO = Convert.ToInt32(NRO),
                                            WRO = Convert.ToInt32(WRO),
                                            SRO = Convert.ToInt32(SRO)
                                        };
                                        AgeWiseShortList.Add(model);
                                    }

                                    break;
                                }
                            case "Table2":
                                {
                                    var years = new List<string> { "0-2 Years", "2-5 Years", "> 5 Years", "> 10 Years" };
                                    var zones = new List<string> { "HO", "ERO", "NRO", "WRO", "SRO" };
                                    var summaryData = new Dictionary<string, Dictionary<string, int>>();
                                    foreach (var yearD in years)
                                    {
                                        summaryData[yearD] = new Dictionary<string, int>();
                                        foreach (var zone in zones)
                                        {
                                            summaryData[yearD][zone] = 0;
                                        }
                                    }

                                    var summaryDataKeys = summaryData.Keys.ToList();

                                    for (int i = 0; i < summaryDataKeys.Count; i++)
                                    {
                                        var yearD = summaryDataKeys[i]; // Access the year key based on index

                                        foreach (var row in tableData)
                                        {
                                            // Extract row data
                                            var zoneName = row.ZoneName?.ToString();
                                            var caseCount = row.CaseCount;
                                            var caseyear = row.year?.ToString();

                                            if (!string.IsNullOrEmpty(zoneName) && zoneName != "NA")
                                            {
                                                // Check if the zone key exists before updating
                                                if (summaryData[yearD].ContainsKey(zoneName))
                                                {
                                                    if (summaryData[yearD][zoneName] == summaryData[caseyear][zoneName] && yearD == caseyear)
                                                    {
                                                        summaryData[yearD][zoneName] += Convert.ToInt32(caseCount) ?? 0;

                                                    }
                                                }
                                            }
                                        }
                                    }
                                    foreach (var bn in summaryData)
                                    {
                                        var yearD = bn.Key;
                                        var zoneN = bn.Value;

                                        var HO = zoneN.ContainsKey("HO") ? zoneN["HO"] : 0;
                                        var ERO = zoneN.ContainsKey("ERO") ? zoneN["ERO"] : 0;
                                        var NRO = zoneN.ContainsKey("NRO") ? zoneN["NRO"] : 0;
                                        var WRO = zoneN.ContainsKey("WRO") ? zoneN["WRO"] : 0;
                                        var SRO = zoneN.ContainsKey("SRO") ? zoneN["SRO"] : 0;


                                        AgeWiseShortReport model = new AgeWiseShortReport
                                        {
                                            Court = "Tribunals-NCLT/NCLAT",
                                            Rowlevel = yearD,
                                            HO = Convert.ToInt32(HO),
                                            ERO = Convert.ToInt32(ERO),
                                            NRO = Convert.ToInt32(NRO),
                                            WRO = Convert.ToInt32(WRO),
                                            SRO = Convert.ToInt32(SRO)
                                        };
                                        AgeWiseShortList.Add(model);
                                    }
                                    break;
                                }
                            case "Table3":
                                {
                                    for (var i = 0; i < tableDataList.Count; i++)
                                    {
                                        var row = tableDataList[i];
                                        var court = "Other Court";
                                        var rowlevel = row["year"];
                                        var countofYearofFiling = row["CaseCount"];
                                        totalCaseCount += countofYearofFiling;
                                        AgeWiseShortList.Add(new AgeWiseShortReport { Court = court, Rowlevel = rowlevel, CountofYearofFiling = countofYearofFiling, TotalCase = totalCaseCount });
                                    }
                                    break;
                                }
                        }

                    }
                }

                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename=SEBI_AgeWiseShortPendingReport_{DateTime.Now:ddMMyyyyhhmmss}.xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Use StringBuilder to construct custom HTML content
                StringBuilder sb = new StringBuilder();

                // Add a title for the report
                sb.Append("<table border='1'>");
                sb.Append("<tr><td colspan='7' style='text-align:center; font-weight:bold;'>SEBI - Age wise analysis of pending cases </td></tr>");
                if (!string.IsNullOrEmpty(month) && !string.IsNullOrEmpty(year))
                {
                    string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                    sb.Append($"<tr><td colspan='7' style='text-align:center; font-weight:bold;'>Month: {monthName} Year: {year}</td></tr>");
                }

                // Generate data for Supreme Court
                var supremeCourtData = AgeWiseShortListsc.Where(row => row.Court == "Supreme Court").ToList();
                if (supremeCourtData.Any())
                {
                    sb.Append("<tr><td colspan='7'></td></tr>");
                    sb.Append("<tr>");
                    sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>15Z</th><th style='font-weight:bold; background-color:gray; color:white;'>Non 15Z</th>");
                    sb.Append("</tr>");
                    int total15Z = 0, totalNon15Z = 0;
                    foreach (var row in supremeCourtData)
                    {
                        sb.Append("<tr>");
                        sb.Append($"<td>{row.Court}</td>");
                        sb.Append($"<td>{row.Rowlevel}</td>");
                        sb.Append($"<td>{row._15Z}</td>");
                        sb.Append($"<td>{row.Non_15Z}</td>");
                        sb.Append("</tr>");
                        total15Z += row._15Z;
                        totalNon15Z += row.Non_15Z;


                    }
                    sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                    sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                    sb.Append($"<td>{total15Z}</td>");
                    sb.Append($"<td>{totalNon15Z}</td>");
                    sb.Append("</tr>");
                }

                // Generate data for High Court
                var highCourtData = AgeWiseShortList.Where(row => row.Court == "High Court").ToList();
                if (highCourtData.Any())
                {
                    sb.Append("<tr><td colspan='7'></td></tr>");
                    sb.Append("<tr>");
                    sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>HO</th><th style='font-weight:bold; background-color:gray; color:white;'>ERO</th><th style='font-weight:bold; background-color:gray; color:white;'>NRO</th><th style='font-weight:bold; background-color:gray; color:white;'>WRO</th><th style='font-weight:bold; background-color:gray; color:white;'>SRO</th>");
                    sb.Append("</tr>");
                    int totalHO = 0, totalERO = 0, totalNRO = 0, totalWRO = 0, totalSRO = 0;
                    foreach (var row in highCourtData)
                    {
                        sb.Append("<tr>");
                        sb.Append($"<td>{row.Court}</td>");
                        sb.Append($"<td>{row.Rowlevel}</td>");
                        sb.Append($"<td>{row.HO}</td>");
                        sb.Append($"<td>{row.ERO}</td>");
                        sb.Append($"<td>{row.NRO}</td>");
                        sb.Append($"<td>{row.WRO}</td>");
                        sb.Append($"<td>{row.SRO}</td>");
                        sb.Append("</tr>");

                        totalHO += row.HO;
                        totalERO += row.ERO;
                        totalNRO += row.NRO;
                        totalWRO += row.WRO;
                        totalSRO += row.SRO;
                    }
                    sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                    sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                    sb.Append($"<td>{totalHO}</td>");
                    sb.Append($"<td>{totalERO}</td>");
                    sb.Append($"<td>{totalNRO}</td>");
                    sb.Append($"<td>{totalWRO}</td>");
                    sb.Append($"<td>{totalSRO}</td>");
                    sb.Append("</tr>");
                }

                var tribunalCourtData = AgeWiseShortList.Where(row => row.Court == "Tribunals-NCLT/NCLAT").ToList();
                if (tribunalCourtData.Any())
                {
                    sb.Append("<tr><td colspan='7'></td></tr>");
                    sb.Append("<tr>");
                    sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>HO</th><th style='font-weight:bold; background-color:gray; color:white;'>ERO</th><th style='font-weight:bold; background-color:gray; color:white;'>NRO</th><th style='font-weight:bold; background-color:gray; color:white;'>WRO</th><th style='font-weight:bold; background-color:gray; color:white;'>SRO</th>");
                    sb.Append("</tr>");

                    int totalHO = 0, totalERO = 0, totalNRO = 0, totalWRO = 0, totalSRO = 0;
                    foreach (var row in tribunalCourtData)
                    {
                        sb.Append("<tr>");
                        sb.Append($"<td>{row.Court}</td>");
                        sb.Append($"<td>{row.Rowlevel}</td>");
                        sb.Append($"<td>{row.HO}</td>");
                        sb.Append($"<td>{row.ERO}</td>");
                        sb.Append($"<td>{row.NRO}</td>");
                        sb.Append($"<td>{row.WRO}</td>");
                        sb.Append($"<td>{row.SRO}</td>");
                        sb.Append("</tr>");

                        totalHO += row.HO;
                        totalERO += row.ERO;
                        totalNRO += row.NRO;
                        totalWRO += row.WRO;
                        totalSRO += row.SRO;
                    }
                    sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                    sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                    sb.Append($"<td>{totalHO}</td>");
                    sb.Append($"<td>{totalERO}</td>");
                    sb.Append($"<td>{totalNRO}</td>");
                    sb.Append($"<td>{totalWRO}</td>");
                    sb.Append($"<td>{totalSRO}</td>");
                    sb.Append("</tr>");

                }

                var otherCourtData = AgeWiseShortList.Where(row => row.Court == "Other Court").ToList();
                if (otherCourtData.Any())
                {
                    sb.Append("<tr><td colspan='7'></td></tr>");
                    sb.Append("<tr>");
                    sb.Append("<th style='font-weight:bold; background-color:gray; color:white;'>Court</th><th style='font-weight:bold; background-color:gray; color:white;'>Row Labels</th><th style='font-weight:bold; background-color:gray; color:white;'>Count of Year of Filing</th>");
                    sb.Append("</tr>");
                    int totC = 0;
                    foreach (var row in otherCourtData)
                    {
                        sb.Append("<tr>");
                        sb.Append($"<td>{row.Court}</td>");
                        sb.Append($"<td>{row.Rowlevel}</td>");
                        sb.Append($"<td>{row.CountofYearofFiling}</td>");
                        sb.Append("</tr>");
                        totC += Convert.ToInt32(row.CountofYearofFiling);
                    }
                    sb.Append("<tr style='font-weight:bold; background-color:lightgray;'>");
                    sb.Append("<td colspan='2' style='text-align:right;'>Total:</td>");
                    sb.Append($"<td>{totC}</td>");
                    sb.Append("</tr>");
                }

                sb.Append("</table>");
                Response.Output.Write(sb.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");

            }
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult AgewiseDetailsPendingReport()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public async Task<JsonResult> GetAgewiseDetailPendingReport(string month = "", string year = "", string Court = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //apiUrl = "http://10.60.1.42:8113";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year,
                    partyname = "SECURITIES AND EXCHANGE BOARD OF INDIA"
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                string Method = "";
                if (Court == "SC")
                    Method = "AgewiseSCDetailsPendingReport";
                else if (Court == "HC")
                    Method = "AgewiseHCDetailsPendingReport";
                else if (Court == "Others")
                    Method = "AgewiseOtherForumDetailsPendingReport";

                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/" + Method), "POST", builders);
                var param = apiUrl + "ReportController=>GetAgewiseDetailPendingReport=>/API/Search/AgewiseShortPendingReport" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                return Json(JsonConvert.SerializeObject(data1));
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [FirmControllerAuthorization]

        public async void ExportoAgeWiseDetailData(string Month, string Year, string Court)
        {
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //apiUrl = "http://10.60.1.42:8113";
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();

            string AccessTokenDetail = "internal";
            string userIdDetail = userId;


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                monthid = Month,
                year = Year,
                partyname = "SECURITIES AND EXCHANGE BOARD OF INDIA"
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            string Method = "";
            if (Court == "SC")
                Method = "AgewiseSCDetailsPendingReport";
            else if (Court == "HC")
                Method = "AgewiseHCDetailsPendingReport";
            else if (Court == "Others")
                Method = "AgewiseOtherForumDetailsPendingReport";

            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/" + Method), "POST", builders);
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            string CurrentCourtName = "";
            var strhtml = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>";
            string reportdata = "Age-wise analysis of pending cases</br>";
            if (Month != "" && Year != "")
            {
                string monthName = new DateTime(2010, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                reportdata = "Age-wise analysis of pending cases  - " + monthName + " " + Year + "</br>";
            }
            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(resid);
                string CurrentCourt = data.data[0].Court;
                if (i == 0)
                    CurrentCourtName = CurrentCourt;
                string Rowlevel = data.data[i].Rowlevel;
                string FiledbySEBICount = data.data[i].FiledbySEBICount;
                string FiledAgainstSEBICount = data.data[i].FiledAgainstSEBICount;


                if (i == 0)
                {
                    strhtml += "<div style='width: 100%;font-family:Bookman Old Style'>" + reportdata + "<p style='width: 100%;text-align: center;margin-bottom: 0;'><span style='font-size: 1.5em;font-weight: 900;'>" + CurrentCourt + "</span></p> <table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'><tr><tr><th  style='text-align:center' rowspan='2'>Row Labels</th><th style='text-align:center' colspan='2'>Count of Year of Filing</th></tr></th><th>Filed By SEBI</th><th>Filed Against SEBI</th></tr>";
                    strhtml += "<tr><td>" + Rowlevel + "</td><td>" + FiledbySEBICount + "</td><td>" + FiledAgainstSEBICount + "</td></tr>";
                }
                else if (i != data1.Count - 1)
                    strhtml += "<tr><td>" + Rowlevel + "</td><td>" + FiledbySEBICount + "</td><td>" + FiledAgainstSEBICount + "</td></tr>";

                if (i == data1.Count - 1)
                {
                    strhtml += "<tr><td>" + Rowlevel + "</td><td>" + FiledbySEBICount + "</td><td>" + FiledAgainstSEBICount + "</td></tr>";
                    strhtml += "</table></div>";
                }

            }

            string firmid = LoggedInUser.FirmId.ToString();
            string userid = LoggedInUser.UserId.ToString();
            string filename = "Age Wise Detail Pending Report " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var db = new LawPracticeEntities();
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            //var reportshtml=await GetAgewiseShortPendingReport(Month, Year);
            string strtemplate = "";
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
            strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
            strtemplate += "<p></p>";
            strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";


            strtemplate += strhtml;
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
            var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
            System.IO.File.WriteAllBytes(pffth, pdfBytes);

            //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Matter list PDF";
            //db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Matter List PDF",
            //    null, null);
        }
        [FirmControllerAuthorization]
        public void ExportToExcelAgeWiseDetail(string month = "", string year = "", string Court = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //apiUrl = "http://10.60.1.42:8113";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year,
                    partyname = "SECURITIES AND EXCHANGE BOARD OF INDIA"
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                string Method = "";
                if (Court == "SC")
                    Method = "AgewiseSCDetailsPendingReport";
                else if (Court == "HC")
                    Method = "AgewiseHCDetailsPendingReport";
                else if (Court == "Others")
                    Method = "AgewiseOtherForumDetailsPendingReport";

                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/" + Method), "POST", builders);
                var param = apiUrl + "ReportController=>GetAgewiseDetailPendingReport=>/API/Search/AgewiseShortPendingReport" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                string CurrentCourtName = "";
                List<AgeWiseDetailReport> AgeWiseDetailList = new List<AgeWiseDetailReport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string CurrentCourt = data.data[0].Court;
                    if (i == 0)
                        CurrentCourtName = CurrentCourt;
                    string Rowlevel = data.data[i].Rowlevel;
                    string FiledbySEBICount = data.data[i].FiledbySEBICount;
                    string FiledAgainstSEBICount = data.data[i].FiledAgainstSEBICount;
                    AgeWiseDetailList.Add(new AgeWiseDetailReport { Court = CurrentCourt, Rowlevel = Rowlevel, FiledbySEBICount = FiledbySEBICount, FiledAgainstSEBICount = FiledAgainstSEBICount });
                }

                var gv = new GridView();
                gv.DataSource = AgeWiseDetailList;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "Row Labels", DataField = "Rowlevel", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Filed By SEBI", DataField = "FiledbySEBICount", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Filed Against SEBI", DataField = "FiledAgainstSEBICount", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });


                gv.DataBind();

                // Add a row with no text in the first column and text in the second column with colspan
                GridViewRow customRow = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);

                // First cell: empty
                TableCell emptyCell = new TableCell();
                customRow.Cells.Add(emptyCell);
                // Second cell: with text and colspan
                TableCell textCell = new TableCell
                {
                    ColumnSpan = gv.Columns.Count - 1,
                    Text = "Count of Year of Filing",
                    HorizontalAlign = HorizontalAlign.Center,
                    BackColor = System.Drawing.Color.Gray,
                    ForeColor = System.Drawing.Color.White
                };
                customRow.Cells.Add(textCell);
                emptyCell.ForeColor = System.Drawing.Color.White;
                emptyCell.BackColor = System.Drawing.Color.Gray;
                gv.Controls[0].Controls.AddAt(0, customRow);


                var reportdata = "Age-wise analysis of pending cases</br>";
                if (month != "" && year != "")
                {
                    string monthName = new DateTime(2010, Convert.ToInt16(month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                    reportdata = "Age-wise analysis of pending cases  - " + monthName + " " + year + "</br>";
                }

                GridViewRow blankRow = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell.Controls.Add(new LiteralControl(reportdata + "- (" + CurrentCourtName + ")"));
                blankRow.Cells.Add(blankCell);
                gv.Controls[0].Controls.AddAt(0, blankRow);





                // Add a blank row and an image before the column headers
                //string Path = Server.MapPath("~\\Manupanel\\img\\Sebi.png"); // Replace with the actual path to your image
                //byte[] imageArray = System.IO.File.ReadAllBytes(Path);
                //string base64Image= Convert.ToBase64String(imageArray);
                //GridViewRow imageRow = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                //TableCell imageCell = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                //string imgHtml = $"<img src='data:image/jpeg;base64,{base64Image}' width='100' height='100' />";
                //imageCell.Text = imgHtml;
                //imageRow.Cells.Add(imageCell);

                //// Insert the image row into the GridView
                //gv.Controls[0].Controls.AddAt(0, imageRow);

                // Set response properties for Excel file download
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- Age Wise Detail Pending Report " + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);

                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex) { }
        }

        public ActionResult FavourAgainstDisposedReport()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public async Task<JsonResult> GetFavourAgainstDisposedReport(string month = "", string year = "")
        {
            DataSet dt = new DataSet();
            //   dt = LawPracticeFirm.DAL.DataAccessADO.GetSebifavourAgainstReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), month, year);

            string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
            try
            {
                using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                {
                    conn.Open();
                    using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("sp_SebifavourAgainstReport", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                        cmd.Parameters.AddWithValue("@vusername", LoggedInUser.UserId.ToString());
                        cmd.Parameters.AddWithValue("@monthid", month);
                        cmd.Parameters.AddWithValue("@year", year);
                        using (SqlDataAdapter sqlDA = new SqlDataAdapter(cmd))
                        {
                            sqlDA.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
            var result = new
            {
                data = dt,
                Status = true,
                Message = ""
            };
            return Json(JsonConvert.SerializeObject(result));

        }

        [FirmControllerAuthorization]
        public async void ExportFavourAgainstDisposedReport(string Month, string Year)
        {
            DataSet dt = new DataSet();
            // dt = LawPracticeFirm.DAL.DataAccessADO.GetSebifavourAgainstReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Month, Year);
            string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
            try
            {
                using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                {
                    conn.Open();
                    using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("sp_SebifavourAgainstReport", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                        cmd.Parameters.AddWithValue("@vusername", LoggedInUser.UserId.ToString());
                        cmd.Parameters.AddWithValue("@monthid", Month);
                        cmd.Parameters.AddWithValue("@year", Year);
                        using (SqlDataAdapter sqlDA = new SqlDataAdapter(cmd))
                        {
                            sqlDA.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
            DataTable SupremeCourt = dt.Tables[0];
            DataTable HighCourt = dt.Tables[1];
            DataTable Other = dt.Tables[2];
            string htmlData = "";
            var reportdata = "Overview of disposed cases of litigation related matters";
            if (Month != "" && Year != "")
            {
                string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                reportdata = "Overview of disposed cases of litigation related matters for the  - " + monthName + " " + Year + "";
            }
            htmlData += "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><div style='width: 100%;font-family:Bookman Old Style'><table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'><thead><tr><th colspan='5'>" + reportdata + "</th></tr>";
            htmlData += "<tr><th>Year Pendency</th><th></th><th>Supreme Court (SC)</th><th>High Court (HC)</th><th>Other Fora (OF)</th></tr></thead><tbody>";
            int SC = 0;
            int HC = 0;
            int Oth = 0;
            for (int i = 0; i < SupremeCourt.Rows.Count; i++)
            {
                htmlData += "<tr><td rowspan='2'>" + SupremeCourt.Rows[i]["YearPendecy"] + "</td><td>Favour</td><td>" + SupremeCourt.Rows[i]["Favour"] + "</td><td>" + HighCourt.Rows[i]["Favour"] + "</td><td>" + Other.Rows[i]["Favour"] + "</td></tr>";
                htmlData += "<tr><td>Against</td><td>" + SupremeCourt.Rows[i]["Against"] + "</td><td>" + HighCourt.Rows[i]["Against"] + "</td><td>" + Other.Rows[i]["Against"] + "</td></tr>";
                if (i == SupremeCourt.Rows.Count - 1)
                {
                    SC = SC + Convert.ToInt32(SupremeCourt.Rows[i]["Favour"]) + Convert.ToInt32(SupremeCourt.Rows[i]["Against"]);
                    HC = HC + Convert.ToInt32(HighCourt.Rows[i]["Favour"]) + Convert.ToInt32(HighCourt.Rows[i]["Against"]);
                    Oth = Oth + Convert.ToInt32(Other.Rows[i]["Favour"]) + Convert.ToInt32(Other.Rows[i]["Against"]);
                }
            }
            htmlData += "<tr><td colspan='2'>Total Disposal</td><td>" + SC + "</td><td>" + HC + "</td><td>" + Oth + "</td></tr>";
            htmlData += "</tbody></table></div>";
            string firmid = LoggedInUser.FirmId.ToString();
            string userid = LoggedInUser.UserId.ToString();
            string filename = "Favour Against Disposed Report " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var db = new LawPracticeEntities();
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            //var reportshtml=await GetAgewiseShortPendingReport(Month, Year);
            string strtemplate = "";
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
            strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
            strtemplate += "<p></p>";
            strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";


            strtemplate += htmlData;
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
            var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
            System.IO.File.WriteAllBytes(pffth, pdfBytes);

            //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded Matter list PDF";
            //db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Matter List PDF",
            //    null, null);
        }

        [FirmControllerAuthorization]
        public void ExportExcelFavourAgainstDisposedReport(string month = "", string year = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                DataSet dt = new DataSet();
                //dt = LawPracticeFirm.DAL.DataAccessADO.GetSebifavourAgainstReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), month, year);
                string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                try
                {
                    using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                    {
                        conn.Open();
                        using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("sp_SebifavourAgainstReport", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                            cmd.Parameters.AddWithValue("@vusername", LoggedInUser.UserId.ToString());
                            cmd.Parameters.AddWithValue("@monthid", month);
                            cmd.Parameters.AddWithValue("@year", year);
                            using (SqlDataAdapter sqlDA = new SqlDataAdapter(cmd))
                            {
                                sqlDA.Fill(dt);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("An error occurred: " + ex.Message);
                }
                List<FavourAgainstDisposed> FavourAgainstDisposedList = new List<FavourAgainstDisposed>();
                foreach (DataTable table in dt.Tables)
                {
                    DataTable dtnew = new DataTable();
                    dtnew = table;
                    foreach (DataRow dr in dtnew.Rows)
                    {

                        string court = Convert.ToString(dr["Court"]);
                        Int32 Against = Convert.ToInt32(dr["Against"]);
                        string YearPendecy = Convert.ToString(dr["YearPendecy"]);
                        Int32 Favour = Convert.ToInt32(dr["Favour"]);
                        FavourAgainstDisposedList.Add(new FavourAgainstDisposed { Court = court, YearPendecy = YearPendecy, Favour = Favour, Against = Against });

                    }
                }
                List<FinalFavourAgainstDisposed> FinalFavourAgainstDisposedList = new List<FinalFavourAgainstDisposed>();
                var sclist = FavourAgainstDisposedList.Where(x => x.Court == "Supereme Court").ToList();
                var hclist = FavourAgainstDisposedList.Where(x => x.Court == "High Court").ToList();
                var othlist = FavourAgainstDisposedList.Where(x => x.Court == "Other Fora").ToList();
                for (var i = 0; i < sclist.Count; i++)
                {

                    FinalFavourAgainstDisposedList.Add(new FinalFavourAgainstDisposed
                    {
                        YearPendency = sclist[i].YearPendecy,
                        FaAg = "Favour",
                        SC = sclist[i].Favour,
                        HC = hclist[i].Favour,
                        OF = othlist[i].Favour,
                    });
                    FinalFavourAgainstDisposedList.Add(new FinalFavourAgainstDisposed
                    {
                        YearPendency = sclist[i].YearPendecy,
                        FaAg = "Against",
                        SC = sclist[i].Against,
                        HC = hclist[i].Against,
                        OF = othlist[i].Against
                    });
                }
                var gv = new GridView();
                gv.DataSource = FinalFavourAgainstDisposedList;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "Year Pendency", DataField = "YearPendency", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = " ", DataField = "FaAg", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Supreme Court (SC)", DataField = "SC", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "High Court (HC)", DataField = "HC", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Other Fora (OF)", DataField = "OF", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });

                gv.DataBind();
                Int64 SumSC = 0;
                Int64 SumHC = 0;
                Int64 SumOth = 0;
                for (int i = 1; i < gv.Rows.Count; i += 2)
                {

                    GridViewRow currentRow = gv.Rows[i];
                    GridViewRow previousRow = gv.Rows[i - 1];

                    string currentRowValue = currentRow.Cells[0].Text;
                    if (currentRowValue.ToLower() == "total")
                    {
                        SumSC = Convert.ToInt64(gv.Rows[i].Cells[2].Text) + Convert.ToInt64(gv.Rows[i - 1].Cells[2].Text);
                        SumHC = Convert.ToInt64(gv.Rows[i].Cells[3].Text) + Convert.ToInt64(gv.Rows[i - 1].Cells[3].Text);
                        SumOth = Convert.ToInt64(gv.Rows[i].Cells[4].Text) + Convert.ToInt64(gv.Rows[i - 1].Cells[4].Text);
                        GridViewRow blankRow = new GridViewRow(0, 0, DataControlRowType.DataRow, DataControlRowState.Normal);
                        TableCell blankCell = new TableCell
                        {
                            ColumnSpan = gv.Columns.Count,
                            Text = "&nbsp;" // Adding a non-breaking space to ensure the row is rendered
                        };
                        blankRow.Cells.Add(blankCell);
                        gv.Controls[0].Controls.AddAt(i, blankRow);

                        GridViewRow currentRow1 = gv.Rows[i];
                        GridViewRow previousRow1 = gv.Rows[i - 1];
                        previousRow1.Cells[0].RowSpan = 2;
                        previousRow1.Cells[0].VerticalAlign = VerticalAlign.Middle;
                        currentRow1.Cells.RemoveAt(0);
                    }
                    else
                    {

                        previousRow.Cells[0].RowSpan = 2;
                        previousRow.Cells[0].VerticalAlign = VerticalAlign.Middle;
                        currentRow.Cells.RemoveAt(0);
                    }

                }
                for (var i = 0; i <= 1; i++)
                {
                    GridViewRow newRow = new GridViewRow(gv.Rows.Count, -1, DataControlRowType.DataRow, DataControlRowState.Normal);

                    // Create and add TableCells to the new row
                    if (i == 0)
                    {
                        TableCell yearPendencyCell = new TableCell { Text = "Total Disposal", ColumnSpan = 2, HorizontalAlign = HorizontalAlign.Left };
                        TableCell scCell = new TableCell { Text = SumSC.ToString(), HorizontalAlign = HorizontalAlign.Left };
                        TableCell hcCell = new TableCell { Text = SumHC.ToString(), HorizontalAlign = HorizontalAlign.Left };
                        TableCell ofCell = new TableCell { Text = SumOth.ToString(), HorizontalAlign = HorizontalAlign.Left };

                        newRow.Cells.Add(yearPendencyCell);
                        newRow.Cells.Add(scCell);
                        newRow.Cells.Add(hcCell);
                        newRow.Cells.Add(ofCell);

                        // Add the new row to the GridView
                        gv.Controls[0].Controls.Add(newRow);
                    }
                }

                var reportdata = "Overview of disposed cases of litigation related matters";
                if (month != "" && year != "")
                {
                    string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                    reportdata = "Overview of disposed cases of litigation related matters for the  - " + monthName + " " + year + "";
                }

                GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell1.Controls.Add(new LiteralControl(reportdata));
                blankRow1.Cells.Add(blankCell1);
                gv.Controls[0].Controls.AddAt(0, blankRow1);


                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- Favour Against Disposed Report " + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);

                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult PendingCaseReportForAllCourt()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public async Task<JsonResult> GetPendingCaseReportForAllCourt(string month = "", string year = "")
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/PendingCaseReportForAllCourt"), "POST", builders);
                var param = apiUrl + "ReportController=>GetPendingCaseReportForAllCourt=>/API/Search/PendingCaseReportForAllCourt" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                var result = new
                {
                    data = data1,
                    Status = jObject["Status"],
                    Message = jObject["Message"]
                };
                return Json(JsonConvert.SerializeObject(result));
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [FirmControllerAuthorization]
        public async void ExportPDFPendingCaseReportForAllCourt(string Month, string Year)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/PendingCaseReportForAllCourt"), "POST", builders);
                var param = apiUrl + "ReportController=>GetPendingCaseReportForAllCourt=>/API/Search/PendingCaseReportForAllCourt" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                var result = new
                {
                    data = data1,
                    Status = jObject["Status"],
                    Message = jObject["Message"]
                };

                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string filename = "PendingCaseReportForAllCourt " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                //var reportshtml=await GetAgewiseShortPendingReport(Month, Year);
                string strtemplate = "";
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
                strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += "<p></p>";
                strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";


                string reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style>Consolidated Fora wise status of cases";
                string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);

                string htmlData = "";
                htmlData += "<div style='width: 100%;font-family:Bookman Old Style'><table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'>";
                htmlData += "<thead><tr><th colspan='2' style='text-align:center'>" + reportdata + "</th></tr> <tr><th>Particulars</th><th>Pending as on " + monthName + ", " + Year + "</th></tr></thead><tbody>";
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    htmlData += "<tr><td>" + data.data[i].Court + "</td><td>" + data.data[i].CountofYearofFiling + "</td></tr>";
                }
                htmlData += "</tbody></table></div>";
                strtemplate += htmlData;
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
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);

                //string strfilename = "CaseDetail " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded PDF";
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [FirmControllerAuthorization]
        public async void ExportExcelPendingCaseReportForAllCourt(string Month, string Year)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/PendingCaseReportForAllCourt"), "POST", builders);
                var param = apiUrl + "ReportController=>GetPendingCaseReportForAllCourt=>/API/Search/PendingCaseReportForAllCourt" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<AgeWiseShortReport> AgeWiseShortList = new List<AgeWiseShortReport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    var court = data.data[i].Court;
                    var countofYearofFiling = data.data[i].CountofYearofFiling;
                    AgeWiseShortList.Add(new AgeWiseShortReport { Court = court, CountofYearofFiling = countofYearofFiling });
                }
                string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);

                var gv = new GridView();
                gv.DataSource = AgeWiseShortList;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "Particulars", DataField = "Court", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Pending as on " + monthName + ", " + Year + "", DataField = "CountofYearofFiling", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });


                gv.DataBind();

                GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell1.Controls.Add(new LiteralControl("Consolidated fora wise status of cases"));
                blankRow1.Cells.Add(blankCell1);
                gv.Controls[0].Controls.AddAt(0, blankRow1);

                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- Pending Case Report For All Court " + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);

                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();

            }
            catch (Exception ex) { }
        }

        [FirmControllerAuthorization]
        public ActionResult CategorisationofLitigationcases()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public async Task<JsonResult> BindSebiRegion()
        {
            var db1 = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();

            string AccessTokenDetail = "internal";
            string userIdDetail = userId;


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SebiRegion"), "POST", builders);
            var param = apiUrl + "ReportController=>BindSebiRegion=>/API/Search/SebiRegion" + "@" + builders;
            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var result = new
            {
                data = data1,
                Status = jObject["Status"],
                Message = jObject["Message"]
            };
            return Json(JsonConvert.SerializeObject(result));
        }
        [FirmControllerAuthorization]
        public async Task<JsonResult> GetCategorisationofLitigationcases(string month, string year, string Region)
        {
            var db1 = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();

            string AccessTokenDetail = "internal";
            string userIdDetail = userId;


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                monthid = month,
                year = year,
                sebiregion = Region
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CategorisedRegionWiseReports"), "POST", builders);
            var param = apiUrl + "ReportController=>GetCategorisationofLitigationcases=>/API/Search/CategorisedRegionWiseReports" + "@" + builders;
            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var result = new
            {
                data = data1,
                Status = jObject["Status"],
                Message = jObject["Message"]
            };
            return Json(JsonConvert.SerializeObject(result));
        }

        [FirmControllerAuthorization]
        public async void ExportCategorisationofLitigationcases(string month, string year, string Region)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year,
                    sebiregion = Region
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CategorisedRegionWiseReports"), "POST", builders);
                var param = apiUrl + "ReportController=>CategorisedRegionWiseReports=>/API/Search/CategorisedRegionWiseReports" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                List<CategorisationReport> CategorisationReport = new List<CategorisationReport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string CaseCriteria = data.data[i].CaseCriteria;
                    string SC = data.data[i].SC;
                    string HC = data.data[i].HC;
                    string OTF = data.data[i].OTF;
                    string Total = data.data[i].Total;
                    CategorisationReport.Add(new CategorisationReport { CaseCriteria = CaseCriteria, SC = SC, HC = HC, OTF = OTF, Total = Total });
                }
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string filename = " Categorisation of Litigation cases " + Region + " " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                //var reportshtml=await GetAgewiseShortPendingReport(Month, Year);
                string strtemplate = "";
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
                strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += "<p></p>";
                strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";


                string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                string reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h2 style='text-align:center'>Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs</h2>";
                if (month != "" && year != "")
                {
                    var selectedMonthText = monthName;
                    var selectedYear = year;
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h2 style='text-align:center'>Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs - " + selectedMonthText + " " + selectedYear + "</h2>";
                }

                string strSTring = "";
                string Thead = "<tr><th></th><th>HC</th><th>OTF</th><th>Total</th></tr>";

                if (Region == "Tribunals" || Region == "Add Court")
                {
                    Thead = "<tr><th></th><th>Total</th></tr>";
                }
                if (Region == "NRO")
                {
                    strSTring = "NRO - States/UT - Delhi, Himachal Pradesh, Jammu and Kashmir, Punjab, Haryana and Chandigarh, Uttar Pradesh and Uttarakhand";
                    Thead = "<tr><th></th><th>SC</th><th>HC</th><th>OTF</th><th>Total</th></tr>";
                }
                else if (Region == "ERO")
                {
                    strSTring = "ERO - States/UT - Arunachal Pradesh, Assam, Bihar, Jharkhand, Manipur, Meghalaya, Mizoram, nageland, Odisha, Sikkim, Tripura, West Bengal";
                }
                else if (Region == "SRO")
                {
                    strSTring = "SRO - States/UT - Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telengana";
                }
                else if (Region == "WRO")
                {
                    strSTring = "WRO - States/UT - Chhattisgarh, Goa, Gujarat, Madhya Pradesh and Rajasthan";
                }
                else if (Region == "HO")
                {
                    strSTring = "HO - State - Maharashtra";
                }


                var strhtml = "<div style='width: 100%;font-family:Bookman Old Style'>" + reportdata + "<p style='width: 100%;text-align: center;margin-bottom: 0;'><span style='font-size: 1.5em;font-weight: 900;'></span></p> <table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'>";
                var columnsIn = data1[0];
                if (strSTring != "")
                {
                    strhtml += "<tr><th style='white-space: break-spaces;text-align:center;' colspan='5'>" + strSTring + "</th></tr>";
                }
                strhtml += Thead;
                foreach (var item in CategorisationReport)
                {
                    strhtml += "<tr>";
                    strhtml += "<td>" + item.CaseCriteria + "</td>";
                    if (Region == "NRO")
                    {
                        strhtml += "<td>" + item.SC + "</td>";
                    }
                    if (Region != "Tribunals" && Region != "Add Court")
                    {
                        strhtml += "<td>" + item.HC + "</td>";
                        strhtml += "<td>" + item.OTF + "</td>";
                    }
                    strhtml += "<td>" + item.Total + "</td>";
                    strhtml += "</tr>";
                }
                strhtml += "</table><div style='width:60%;margin:30px auto;'>";
                strhtml += "<strong>The Criteria for Super Active, Active and Dormant/Active Cases is as follows: </strong>";
                strhtml += "<ul style='list-style:decimal;text-align: left;'><li><strong>Super Active Cases : </strong>Cases listed or action taken by SEBI since in the past 12 months.</li>";
                strhtml += "<li><strong>Active Cases : </strong>Cases listed or action taken by SEBI in more than 12 but less than 24 months.</li>";
                strhtml += "<li><strong>Dormant/Static. Cases : </strong>Other than 1 and 2</li>";
                strhtml += "</ul>";
                strhtml += "</div></div>";
                strtemplate += strhtml;
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded PDF";
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [FirmControllerAuthorization]
        public async void ExportExcelCategorisationofLitigationcases(string month, string year, string Region)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "internal";
                string userIdDetail = userId;


                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = month,
                    year = year,
                    sebiregion = Region
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CategorisedRegionWiseReports"), "POST", builders);
                var param = apiUrl + "ReportController=>GetCategorisedRegionWiseReports=>/API/Search/CategorisedRegionWiseReports" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                List<CategorisationReport> CategorisationReport = new List<CategorisationReport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string CaseCriteria = data.data[i].CaseCriteria;
                    string SC = data.data[i].SC;
                    string HC = data.data[i].HC;
                    string OTF = data.data[i].OTF;
                    string Total = data.data[i].Total;
                    CategorisationReport.Add(new CategorisationReport { CaseCriteria = CaseCriteria, SC = SC, HC = HC, OTF = OTF, Total = Total });
                }
                var gv = new GridView();
                gv.DataSource = CategorisationReport;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "", DataField = "CaseCriteria", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                if (Region == "NRO")
                {
                    gv.Columns.Add(new BoundField { HeaderText = "SC", DataField = "SC", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                }
                if (Region != "Tribunals" && Region != "Add Court")
                {
                    gv.Columns.Add(new BoundField { HeaderText = "HC", DataField = "HC", HeaderStyle = { HorizontalAlign = System.Web.UI.WebControls.HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = System.Web.UI.WebControls.HorizontalAlign.Left } });
                    gv.Columns.Add(new BoundField { HeaderText = "OTF", DataField = "OTF", HeaderStyle = { HorizontalAlign = System.Web.UI.WebControls.HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = System.Web.UI.WebControls.HorizontalAlign.Left } });

                }
                gv.Columns.Add(new BoundField { HeaderText = "Total", DataField = "Total", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });


                gv.DataBind();

                string monthName = new DateTime(DateTime.Now.Year, Convert.ToInt16(month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture);
                string reportdata = "Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs";
                if (month != "" && year != "")
                {
                    var selectedMonthText = monthName;
                    var selectedYear = year;
                    reportdata = "Categorisation of Litigation cases as per Super Active, Active and Dormant of HO and ROs - " + selectedMonthText + " " + selectedYear + "";
                }
                GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell1.Controls.Add(new LiteralControl(reportdata));
                blankRow1.Cells.Add(blankCell1);
                gv.Controls[0].Controls.AddAt(0, blankRow1);

                string strSTring = "";
                if (Region == "NRO")
                {
                    strSTring = "NRO - States/UT - Delhi, Himachal Pradesh, Jammu and Kashmir, Punjab, Haryana and Chandigarh, Uttar Pradesh and Uttarakhand";
                }
                else if (Region == "ERO")
                {
                    strSTring = "ERO - States/UT - Arunachal Pradesh, Assam, Bihar, Jharkhand, Manipur, Meghalaya, Mizoram, nageland, Odisha, Sikkim, Tripura, West Bengal";
                }
                else if (Region == "SRO")
                {
                    strSTring = "SRO - States/UT - Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telengana";
                }
                else if (Region == "WRO")
                {
                    strSTring = "WRO - States/UT - Chhattisgarh, Goa, Gujarat, Madhya Pradesh and Rajasthan";
                }
                else if (Region == "HO")
                {
                    strSTring = "HO - State - Maharashtra";
                }
                if (strSTring != "")
                {
                    GridViewRow blankRow12 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                    TableCell blankCell2 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                    blankCell2.Controls.Add(new LiteralControl(strSTring));
                    blankRow12.Cells.Add(blankCell2);
                    gv.Controls[0].Controls.AddAt(0, blankRow12);
                }


                // Create a new GridViewRow
                string strhtml = "<div style='width:60%;margin:30px auto;'>";
                strhtml += "<strong>The Criteria for Super Active, Active and Dormant/Active Cases is as follows: </strong>";
                strhtml += "<ul style='list-style:decimal;text-align: left;'><li><strong>1.Super Active Cases : </strong>Cases listed or action taken by SEBI since in the past 12 months.</li>";
                strhtml += "<li><strong>2.Active Cases : </strong>Cases listed or action taken by SEBI in more than 12 but less than 24 months.</li>";
                strhtml += "<li><strong>3.Dormant/Static. Cases : </strong>Other than 1 and 2</li>";
                strhtml += "</ul>";
                strhtml += "</div></div>";
                GridViewRow blankRowLast = new GridViewRow(0, 0, DataControlRowType.Footer, DataControlRowState.Normal);
                TableCell blankCellLast = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCellLast.Controls.Add(new LiteralControl(strhtml));
                blankRowLast.Cells.Add(blankCellLast);
                gv.Controls[0].Controls.AddAt(gv.Controls[0].Controls.Count, blankRowLast);

                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- Categorisation of Litigation cases  " + Region + " " + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                objHtmlTextWriter.Write("<style> body, table { font-family: 'Bookman Old Style'; } </style>");

                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToStri
            }
        }

        [FirmControllerAuthorization]
        public ActionResult StatewiseBreakUpCaseReports()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult GetStatewiseBreakUpCaseReports(string Month, string Year, string Courttype, string Status)
        {
            var db1 = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();
            string AccessTokenDetail = "internal";
            string userIdDetail = userId;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                monthid = Month,
                year = Year,
                Courttype = Courttype,
                Status = Status
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/StatewiseBreakUpCaseReports"), "POST", builders);
            var param = apiUrl + "ReportController=>GetStatewiseBreakUpCaseReports=>/API/Search/StatewiseBreakUpCaseReports" + "@" + builders;
            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var result = new
            {
                data = data1,
                Status = jObject["Status"],
                Message = jObject["Message"]
            };
            return Json(JsonConvert.SerializeObject(result));
        }

        [FirmControllerAuthorization]
        public async void ExportPDFStatewiseBreakUpCaseReports(string Month, string Year, string Courttype, string Status)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = "internal";
                string userIdDetail = userId;
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year,
                    Courttype = Courttype,
                    Status = Status
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/StatewiseBreakUpCaseReports"), "POST", builders);
                var param = apiUrl + "ReportController=>GetStatewiseBreakUpCaseReports=>/API/Search/StatewiseBreakUpCaseReports" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                var selectedYear = Year;
                var selectedMonthText = "";
                if (Month != "")
                {
                    selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
                }
                string reportdata = "";
                if (Status == "disposed")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases disposed during " + selectedMonthText + " " + selectedYear + " </h3>";
                else if (Status == "pending")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases pending at the end of the " + selectedMonthText + " " + selectedYear + " </h3>";

                string strhtml = "<div style='width: 100%;font-family:Bookman Old Style'>" + reportdata + "<table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'><tr><th>State</th><th>No.of cases filed by SEBI</th><th>No. of cases filed against SEBI</th></tr>";
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string vState = data.data[i].vState;
                    string FiledbySEBICount = data.data[i].FiledbySEBICount;
                    string FiledAgainstSEBICount = data.data[i].FiledAgainstSEBICount;
                    strhtml += "<tr><td>" + vState + "</td><td>" + FiledbySEBICount + "</td><td>" + FiledAgainstSEBICount + "</td></tr>";
                }
                strhtml += "</table></div>";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string filename = " State wise Break Up Case Reports " + System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Status) + "" + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string strtemplate = "";
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
                strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += "<p></p>";
                strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";

                strtemplate += strhtml;
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded PDF";
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [FirmControllerAuthorization]
        public async void ExportExcelStatewiseBreakUpCaseReports(string Month, string Year, string Courttype, string Status)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = "internal";
                string userIdDetail = userId;
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year,
                    Courttype = Courttype,
                    Status = Status
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/StatewiseBreakUpCaseReports"), "POST", builders);
                var param = apiUrl + "ReportController=>GetStatewiseBreakUpCaseReports=>/API/Search/StatewiseBreakUpCaseReports" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                List<StatewiseBreakUpCase> StatewiseBreakUpCaseList = new List<StatewiseBreakUpCase>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string vState = data.data[i].vState;
                    string FiledbySEBICount = data.data[i].FiledbySEBICount;
                    string FiledAgainstSEBICount = data.data[i].FiledAgainstSEBICount;
                    StatewiseBreakUpCaseList.Add(new StatewiseBreakUpCase { vState = vState, FiledbySEBICount = FiledbySEBICount, FiledAgainstSEBICount = FiledAgainstSEBICount });
                }
                var gv = new GridView();
                gv.DataSource = StatewiseBreakUpCaseList;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "State", DataField = "vState", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "No.of cases filed by SEBI", DataField = "FiledbySEBICount", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "No. of cases filed against SEBI", DataField = "FiledAgainstSEBICount", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });


                gv.DataBind();

                var selectedYear = Year;
                var selectedMonthText = "";
                if (Month != "")
                {
                    selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
                }
                string reportdata = "";
                if (Status == "disposed")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases disposed during " + selectedMonthText + " " + selectedYear + " </h3>";
                else if (Status == "pending")
                    reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>State-wise break-up of cases pending at the end of the " + selectedMonthText + " " + selectedYear + " </h3>";

                GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell1.Controls.Add(new LiteralControl(reportdata));
                blankRow1.Cells.Add(blankCell1);
                gv.Controls[0].Controls.AddAt(0, blankRow1);

                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- State wise Break Up Case Reports " + System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Status) + "" + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToStri
            }
        }


        [FirmControllerAuthorization]
        public ActionResult CaseReportForAllCourt()
        {
            return View();
        }
        [FirmControllerAuthorization]
        public ActionResult GetCaseReportForAllCourt(string Month, string Year)
        {
            var db1 = new LawPracticeEntities();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            string strusername = ConfigurationManager.AppSettings["matteridname"];
            string userId = "", firmId = "";
            userId = strusername + LoggedInUser.UserId.ToString();
            firmId = LoggedInUser.FirmId.ToString();
            string AccessTokenDetail = "internal";
            string userIdDetail = userId;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                monthid = Month,
                year = Year
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ConsolidatedCaseReportForAllCourt"), "POST", builders);
            var param = apiUrl + "ReportController=>ConsolidatedCaseReportForAllCourt=>/API/Search/ConsolidatedCaseReportForAllCourt" + "@" + builders;
            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
            dynamic jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var result = new
            {
                data = data1,
                Status = jObject["Status"],
                Message = jObject["Message"]
            };
            return Json(JsonConvert.SerializeObject(result));
        }

        [FirmControllerAuthorization]
        public async void ExportPDFCaseReportForAllCourt(string Month, string Year)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = "internal";
                string userIdDetail = userId;
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ConsolidatedCaseReportForAllCourt"), "POST", builders);
                var param = apiUrl + "ReportController=>GetStatewiseBreakUpCaseReports=>/API/Search/ConsolidatedCaseReportForAllCourt" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                var selectedYear = Year;
                var selectedMonthText = "";
                if (Month != "")
                {
                    selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
                }
                string reportdata = "";
                reportdata = "<style>.totaltd td{ font-weight:600!important} .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Break up of cases pending across the country (state/union territories) as on   " + selectedMonthText + " " + selectedYear + " </h3>";

                string strhtml = "<div style='width: 100%;font-family:Bookman Old Style'>" + reportdata + "<table style='margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'>" +

                    "<tr><th>State</th><th>High Court</th><th>City Civil Court</th><th>Consumer Forum/Commission</th><th>NCLT / NCLAT</th><th>Labour Commissioner / Labour Court</th><th>Commissioner of Income Tax</th><th>Debt Recovery Tribunal</th><th>SAT, Mumbai</th><th>Total</th></tr>";
                Int32 totalHighCOURT = 0;
                Int32 totalCityCivilCourt = 0;
                Int32 totalCONSUMERFORUMS = 0;
                Int32 totalNCLT_NCLAT = 0;
                Int32 totalLabourCourt = 0;
                Int32 totalCommissionerOfIncomeTax = 0;
                Int32 totalDebtRecoveryTribunal = 0;
                Int32 totalSAT_Mumbai = 0;
                Int32 total = 0;
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string vState = data.data[i].vState;
                    string HighCOURT = data.data[i].HighCOURT;
                    string CityCivilCourt = data.data[i].CityCivilCourt;
                    string CONSUMERFORUMS = data.data[i].CONSUMERFORUMS;
                    string NCLT_NCLAT = data.data[i].NCLT_NCLAT;
                    string LabourCourt = data.data[i].LabourCourt;
                    string CommissionerOfIncomeTax = data.data[i].CommissionerOfIncomeTax;
                    string DebtRecoveryTribunal = data.data[i].DebtRecoveryTribunal;
                    string SAT_Mumbai = data.data[i].SAT_Mumbai;

                    Int32 StateTotal = 0;

                    totalHighCOURT = totalHighCOURT + Convert.ToInt32(HighCOURT);
                    totalCityCivilCourt = totalCityCivilCourt + Convert.ToInt32(CityCivilCourt);
                    totalCONSUMERFORUMS = totalCONSUMERFORUMS + Convert.ToInt32(CONSUMERFORUMS);
                    totalNCLT_NCLAT = totalNCLT_NCLAT + Convert.ToInt32(NCLT_NCLAT);
                    totalLabourCourt = totalLabourCourt + Convert.ToInt32(LabourCourt);
                    totalCommissionerOfIncomeTax = totalCommissionerOfIncomeTax + Convert.ToInt32(CommissionerOfIncomeTax);
                    totalDebtRecoveryTribunal = totalDebtRecoveryTribunal + Convert.ToInt32(DebtRecoveryTribunal);
                    totalSAT_Mumbai = totalSAT_Mumbai + Convert.ToInt32(SAT_Mumbai);

                    StateTotal = Convert.ToInt32(HighCOURT)
                        + Convert.ToInt32(CityCivilCourt)
                        + Convert.ToInt32(CONSUMERFORUMS)
                        + Convert.ToInt32(NCLT_NCLAT)
                        + Convert.ToInt32(LabourCourt)
                        + Convert.ToInt32(CommissionerOfIncomeTax)
                        + Convert.ToInt32(DebtRecoveryTribunal)
                        + Convert.ToInt32(SAT_Mumbai);
                    total += StateTotal;
                    strhtml += "<tr>";
                    strhtml += "<td>" + vState + "</td>";
                    strhtml += "<td>" + HighCOURT + "</td>";
                    strhtml += "<td>" + CityCivilCourt + "</td>";
                    strhtml += "<td>" + CONSUMERFORUMS + "</td>";
                    strhtml += "<td>" + NCLT_NCLAT + "</td>";
                    strhtml += "<td>" + LabourCourt + "</td>";
                    strhtml += "<td>" + CommissionerOfIncomeTax + "</td>";
                    strhtml += "<td>" + DebtRecoveryTribunal + "</td>";
                    strhtml += "<td>" + SAT_Mumbai + "</td>";
                    strhtml += "<td>" + StateTotal + "</td>";
                    strhtml += "</tr>";
                }
                strhtml += "<tr class='totaltd'><td>Total</td><td>" + totalHighCOURT + "</td><td>" + totalCityCivilCourt + "</td><td>" + totalCONSUMERFORUMS + "</td><td>" + totalNCLT_NCLAT + "</td><td>" + totalLabourCourt + "</td><td>" + totalCommissionerOfIncomeTax + "</td><td>" + totalDebtRecoveryTribunal + "</td><td>" + totalSAT_Mumbai + "</td><td>" + total + "</td></tr>";
                strhtml += "</div>";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string filename = " Case Report For All Court " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string strtemplate = "";
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
                strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += "<p></p>";
                strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";

                strtemplate += strhtml;
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=SEBI-" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();

                string notification = "You have Downloaded PDF";
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [FirmControllerAuthorization]
        public async void ExportExcelCaseReportForAllCourt(string Month, string Year)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = "internal";
                string userIdDetail = userId;
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Month,
                    year = Year
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ConsolidatedCaseReportForAllCourt"), "POST", builders);
                var param = apiUrl + "ReportController=>ConsolidatedCaseReportForAllCourt=>/API/Search/ConsolidatedCaseReportForAllCourt" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];

                List<CaseReportForCourt> CaseReportForCourtList = new List<CaseReportForCourt>();
                Int32 totalHighCOURT = 0;
                Int32 totalCityCivilCourt = 0;
                Int32 totalCONSUMERFORUMS = 0;
                Int32 totalNCLT_NCLAT = 0;
                Int32 totalLabourCourt = 0;
                Int32 totalCommissionerOfIncomeTax = 0;
                Int32 totalDebtRecoveryTribunal = 0;
                Int32 totalSAT_Mumbai = 0;
                Int32 total = 0;
                for (int i = 0; i < data1.Count; i++)
                {
                    Int32 StateTotal = 0;
                    dynamic data = JObject.Parse(resid);
                    string vState = data.data[i].vState;
                    string HighCOURT = data.data[i].HighCOURT;
                    string CityCivilCourt = data.data[i].CityCivilCourt;
                    string CONSUMERFORUMS = data.data[i].CONSUMERFORUMS;
                    string NCLT_NCLAT = data.data[i].NCLT_NCLAT;
                    string LabourCourt = data.data[i].LabourCourt;
                    string CommissionerOfIncomeTax = data.data[i].CommissionerOfIncomeTax;
                    string DebtRecoveryTribunal = data.data[i].DebtRecoveryTribunal;
                    string SAT_Mumbai = data.data[i].SAT_Mumbai;

                    StateTotal = Convert.ToInt32(HighCOURT)
                        + Convert.ToInt32(CityCivilCourt)
                        + Convert.ToInt32(CONSUMERFORUMS)
                        + Convert.ToInt32(NCLT_NCLAT)
                        + Convert.ToInt32(LabourCourt)
                        + Convert.ToInt32(CommissionerOfIncomeTax)
                        + Convert.ToInt32(DebtRecoveryTribunal)
                        + Convert.ToInt32(SAT_Mumbai);
                    total += StateTotal;

                    totalHighCOURT = totalHighCOURT + Convert.ToInt32(HighCOURT);
                    totalCityCivilCourt = totalCityCivilCourt + Convert.ToInt32(CityCivilCourt);
                    totalCONSUMERFORUMS = totalCONSUMERFORUMS + Convert.ToInt32(CONSUMERFORUMS);
                    totalNCLT_NCLAT = totalNCLT_NCLAT + Convert.ToInt32(NCLT_NCLAT);
                    totalLabourCourt = totalLabourCourt + Convert.ToInt32(LabourCourt);
                    totalCommissionerOfIncomeTax = totalCommissionerOfIncomeTax + Convert.ToInt32(CommissionerOfIncomeTax);
                    totalDebtRecoveryTribunal = totalDebtRecoveryTribunal + Convert.ToInt32(DebtRecoveryTribunal);
                    totalSAT_Mumbai = totalSAT_Mumbai + Convert.ToInt32(SAT_Mumbai);

                    CaseReportForCourtList.Add(new CaseReportForCourt
                    {
                        vState = vState,
                        HighCOURT = Convert.ToInt32(HighCOURT),
                        CityCivilCourt = Convert.ToInt32(CityCivilCourt),
                        CONSUMERFORUMS = Convert.ToInt32(CONSUMERFORUMS),
                        NCLT_NCLAT = Convert.ToInt32(NCLT_NCLAT),
                        LabourCourt = Convert.ToInt32(LabourCourt),
                        CommissionerOfIncomeTax = Convert.ToInt32(CommissionerOfIncomeTax),
                        DebtRecoveryTribunal = Convert.ToInt32(DebtRecoveryTribunal),
                        SAT_Mumbai = Convert.ToInt32(SAT_Mumbai),
                        Total = Convert.ToInt32(StateTotal),

                    });
                }
                CaseReportForCourtList.Add(new CaseReportForCourt
                {
                    vState = "Total",
                    HighCOURT = Convert.ToInt32(totalHighCOURT),
                    CityCivilCourt = Convert.ToInt32(totalCityCivilCourt),
                    CONSUMERFORUMS = Convert.ToInt32(totalCONSUMERFORUMS),
                    NCLT_NCLAT = Convert.ToInt32(totalNCLT_NCLAT),
                    LabourCourt = Convert.ToInt32(totalLabourCourt),
                    CommissionerOfIncomeTax = Convert.ToInt32(totalCommissionerOfIncomeTax),
                    DebtRecoveryTribunal = Convert.ToInt32(totalDebtRecoveryTribunal),
                    SAT_Mumbai = Convert.ToInt32(totalSAT_Mumbai),
                    Total = Convert.ToInt32(total),

                });
                var gv = new GridView();
                gv.DataSource = CaseReportForCourtList;
                gv.AutoGenerateColumns = false;
                gv.Columns.Add(new BoundField { HeaderText = "State", DataField = "vState", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "High Court", DataField = "HighCOURT", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "City Civil Court", DataField = "CityCivilCourt", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Consumer Forum/Commission", DataField = "CONSUMERFORUMS", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "NCLT / NCLAT", DataField = "NCLT_NCLAT", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Labour Commissioner / Labour Court", DataField = "LabourCourt", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Commissioner of Income Tax", DataField = "CommissionerOfIncomeTax", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Debt Recovery Tribunal", DataField = "DebtRecoveryTribunal", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "SAT, Mumbai", DataField = "SAT_Mumbai", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
                gv.Columns.Add(new BoundField { HeaderText = "Total", DataField = "Total", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White, Font = { Bold = true } }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left, Font = { Bold = true } } });
                gv.DataBind();

                var selectedYear = Year;
                var selectedMonthText = "";
                if (Month != "")
                {
                    selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
                }
                string reportdata = "";
                reportdata = "<style>.totaltd td{ font-weight:600!important} .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Break up of cases pending across the country (state/union territories) as on  " + selectedMonthText + " " + selectedYear + " </h3>";

                GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
                TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
                blankCell1.Controls.Add(new LiteralControl(reportdata));
                blankRow1.Cells.Add(blankCell1);
                gv.Controls[0].Controls.AddAt(0, blankRow1);

                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=SEBI- Case Report For All Court " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // Render the GridView to a StringWriter
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                // Write the rendered content to the response
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToStri
            }
        }

        [FirmControllerAuthorization]
        public ActionResult SebiSuccessRateReport()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult GetSebiSuccessRateReport(string Month, string Year)
        {
            try
            {


                DataTable dt = new DataTable();
                //dt = LawPracticeFirm.DAL.DataAccessADO.GetSebiSuccessRateReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Month, Year);
                string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                try
                {
                    using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                    {
                        conn.Open();
                        using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("[sp_SebiSuccessRateReport]", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                            cmd.Parameters.AddWithValue("@vusername", LoggedInUser.UserId.ToString());
                            cmd.Parameters.AddWithValue("@monthid", Month);
                            cmd.Parameters.AddWithValue("@year", Year);
                            using (SqlDataAdapter sqlDA = new SqlDataAdapter(cmd))
                            {
                                sqlDA.Fill(dt);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("An error occurred: " + ex.Message);
                }
                var result = new
                {
                    data = dt,
                    Status = true,
                    Message = ""
                };
                return Json(JsonConvert.SerializeObject(result));
            }
            catch (Exception)
            {

                throw;
            }
        }

        [FirmControllerAuthorization]
        public async void ExportPDFSebiSuccessRateReport(string Month, string Year)
        {
            DataTable dt = new DataTable();
            //dt = LawPracticeFirm.DAL.DataAccessADO.GetSebiSuccessRateReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Month, Year);
            string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
            try
            {
                using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                {
                    conn.Open();
                    using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("[sp_SebiSuccessRateReport]", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Firmid", LoggedInUser.FirmId.ToString());
                        cmd.Parameters.AddWithValue("@vusername", LoggedInUser.UserId.ToString());
                        cmd.Parameters.AddWithValue("@monthid", Month);
                        cmd.Parameters.AddWithValue("@year", Year);
                        using (SqlDataAdapter sqlDA = new SqlDataAdapter(cmd))
                        {
                            sqlDA.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
            var selectedYear = Year;
            var selectedMonthText = "";
            if (Month != "")
            {
                selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
            }
            string reportdata = "";

            reportdata = "<style> .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Success Rate before Supreme Court as on " + selectedMonthText + " " + selectedYear + " </h3>";

            string strhtml = "<div style='width: 100%;font-family:Bookman Old Style'>" + reportdata + "<table style='width:60%;margin:auto;border-collapse: separate;border-spacing: 0;' class='printtbl'><thead>";
            strhtml += "<tr><th colspan='3'>Supreme Court (SC)/High Court(HC)/Other Fora(OF)</th></tr></thead><tbody>";
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                strhtml += "<tr>";
                if (i == 0 || i % 2 == 0)
                {
                    strhtml += "<td rowspan='2'>" + dt.Rows[i]["vStatus"] + "</td >";
                }
                strhtml += "<td>" + dt.Rows[i]["vAction"] + " </td><td> " + dt.Rows[i]["SubTotal"] + "</td></tr>";
            }
            strhtml += "</tbody></table></div>";
            string firmid = LoggedInUser.FirmId.ToString();
            string userid = LoggedInUser.UserId.ToString();
            string filename = " Success Rate Reports " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".pdf";
            string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var db = new LawPracticeEntities();
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            string strtemplate = "";
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
            strtemplate += "<center><p><strong></strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
            strtemplate += "<p></p>";
            strtemplate += "<p><img src='" + Server.MapPath("~\\Manupanel\\img\\Sebi.png") + "'></img></p>";

            strtemplate += strhtml;
            var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
            htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
            var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
            htmlToPdf.Margins = pageMargins;
            htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
            var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
            var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
            System.IO.File.WriteAllBytes(pffth, pdfBytes);
            Response.Clear();
            System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
            Response.ContentType = "application/pdf";
            Response.AddHeader("content-disposition", "attachment;filename=SEBI- " + filename + "");
            Response.Buffer = true;
            ms.WriteTo(Response.OutputStream);
            Response.End();

            string notification = "You have Downloaded PDF";
        }

        [FirmControllerAuthorization]
        public async void ExportExcelSebiSuccessRateReport(string Month, string Year)
        {
            DataTable dt = new DataTable();
            dt = LawPracticeFirm.DAL.DataAccessADO.GetSebiSuccessRateReport(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Month, Year);
            var gv = new GridView();
            gv.DataSource = dt;
            gv.AutoGenerateColumns = false;
            gv.Columns.Add(new BoundField { HeaderText = "Status", DataField = "vStatus", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
            gv.Columns.Add(new BoundField { HeaderText = "Action - SEBI", DataField = "vAction", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
            gv.Columns.Add(new BoundField { HeaderText = "Total", DataField = "SubTotal", HeaderStyle = { HorizontalAlign = HorizontalAlign.Center, BackColor = System.Drawing.Color.Gray, ForeColor = System.Drawing.Color.White }, ItemStyle = { HorizontalAlign = HorizontalAlign.Left } });
            gv.DataBind();

            for (int i = 1; i < gv.Rows.Count; i += 2)
            {
                GridViewRow currentRow = gv.Rows[i];
                GridViewRow previousRow = gv.Rows[i - 1];
                string currentRowValue = currentRow.Cells[0].Text;
                previousRow.Cells[0].RowSpan = 2;
                previousRow.Cells[0].VerticalAlign = VerticalAlign.Middle;
                currentRow.Cells.RemoveAt(0);
            }

            var selectedYear = Year;
            var selectedMonthText = "";
            if (Month != "")
            {
                selectedMonthText = new DateTime(DateTime.Now.Year, Convert.ToInt16(Month), 1).ToString("MMM", System.Globalization.CultureInfo.InvariantCulture) + ",";
            }

            GridViewRow blankRow = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
            TableCell blankCell = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
            blankCell.Controls.Add(new LiteralControl("Supreme Court (SC)/ High Court(HC)/ Other Fora(OF)"));
            blankRow.Cells.Add(blankCell);
            gv.Controls[0].Controls.AddAt(0, blankRow);


            string reportdata = "";
            reportdata = "<style>.totaltd td{ font-weight:600!important} .printtbl td,.printtbl th{border:1px solid #000;}</style><h3 style='text-align:center'>Success Rate before Supreme Court as on  " + selectedMonthText + " " + selectedYear + " </h3>";

            GridViewRow blankRow1 = new GridViewRow(0, 0, DataControlRowType.Header, DataControlRowState.Normal);
            TableCell blankCell1 = new TableCell { ColumnSpan = gv.Columns.Count, HorizontalAlign = HorizontalAlign.Center };
            blankCell1.Controls.Add(new LiteralControl(reportdata));
            blankRow1.Cells.Add(blankCell1);
            gv.Controls[0].Controls.AddAt(0, blankRow1);



            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=SEBI- Success Rate Reports " + DateTime.Now.ToString("ddMMyyHHmmssffff") + ".xls");
            Response.ContentType = "application/ms-excel";
            Response.Charset = "";

            // Render the GridView to a StringWriter
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
            gv.RenderControl(objHtmlTextWriter);
            // Write the rendered content to the response
            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();
        }
        #endregion
    }
}