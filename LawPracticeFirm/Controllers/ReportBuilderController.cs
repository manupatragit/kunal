using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.DAL;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace LawPracticeFirm.Controllers
{
    public class ReportBuilderController : BaseFirmController
    {
        private LawPracticeEntities db= new LawPracticeEntities();
        public string controllername = "ReportBuilderController";
        /// <summary>
        /// Report builder view
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Create report builder view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CreateBuildReport()
        {
            return View();
        }
        /// <summary>
        /// Report builder list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ReportBuilderList()
        {
            return View();
        }
        /// <summary>
        /// Export report builder in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelReportBuilder()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var Id = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Id"]));
                var moduleid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["moduleid"]));
                var pagenumber = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenumber"]));
                var pagesize = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"]));
                string exlfilename = "ReportbuilderReport_" + DateTime.Now;
                List<usp_UserMatterReport_Added_Result> trialList_1 = new List<usp_UserMatterReport_Added_Result>();
                StringBuilder sb = new StringBuilder();
               var trialList = DataAccessADO.GetBindCustomReportFinal(firmid, userid, Id, pagenumber, int.MaxValue.ToString(), userid, LoggedInUser.RoleId.ToString(), moduleid);
                if (trialList.Rows.Count > 0)
                {
                    trialList.Columns.RemoveAt(0);
                    trialList.Columns.RemoveAt(0);
                    foreach (DataColumn column in trialList.Columns)
                    {
                        column.ColumnName=column.ColumnName.Replace("_", " ");
                    }
                }
                var gv = new GridView();
                gv.DataSource = trialList;
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
        /// <summary>
        /// Export report builder in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToPDFReportBuilder()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var Id = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Id"]));
                var moduleid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["moduleid"]));
                var pagenumber = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagenumber"]));
                var pagesize = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["pagesize"]));
                string filename = "ReportbuilderReport_" + DateTime.Now.Millisecond.ToString()+".pdf";
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string pdfnamelabel = "Report Details";
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
                var trialList = DataAccessADO.GetBindCustomReportFinal(firmid, userid, Id, pagenumber, int.MaxValue.ToString(), userid, LoggedInUser.RoleId.ToString(), moduleid);
                if (trialList.Rows.Count > 0)
                {
                    trialList.Columns.RemoveAt(0);
                    trialList.Columns.RemoveAt(0);
                    foreach (DataColumn column in trialList.Columns)
                    {
                        column.ColumnName = column.ColumnName.Replace("_", " ");
                        // column Unable to get or set value
                    }
                }
                foreach (DataColumn column in trialList.Columns)
                {
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>"+column.ColumnName +"</th>";
                }
                strtemplate += "</tr></thead><tbody>";
                foreach (DataRow data in trialList.Rows)
                {
                    strtemplate += "<tr>";
                    for (var i=0; i< data.ItemArray.Length;i++)
                    {
                        strtemplate += "<td height = '20' align = 'left' valign ='top'style='padding:0 5px;' >" + data[i] + " </td>";
                    }
                    strtemplate += "</tr>";
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
                string notification = "You have Downloaded Issue Report PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Issue Report PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export report builder preview in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public void ExportToExcelReportBuilderPreview()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var Id = Convert.ToString(QueryAES.UrlDecode(Request.Form["Id"]));
                var moduleid = Convert.ToString(QueryAES.UrlDecode(Request.Form["moduleid"]));
                var pagenumber = Convert.ToString(QueryAES.UrlDecode(Request.Form["pagenumber"]));
                var pagesize = Convert.ToString(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var TempTablecolumnnameforcustomRpt = QueryAES.UrlDecode(Request.Form["TempTablecolumnnameforcustomRpt"]);
                var columnnameforcustomRpt = QueryAES.UrlDecode(Request.Form["columnnameforcustomRpt"]);
                var filternameforcustomRpt = QueryAES.UrlDecode(Request.Form["filternameforcustomRpt"]);
                var groupcolcollectionforcustomRpt = QueryAES.UrlDecode(Request.Form["groupcolcollectionforcustomRpt"]);
                var ordercolcollecionforcustomRpt = QueryAES.UrlDecode(Request.Form["ordercolcollecionforcustomRpt"]);
                var reportnameforcustomRpt = QueryAES.UrlDecode(Request.Form["reportnameforcustomRpt"]);
                var reporttypeforcustomRpt = QueryAES.UrlDecode(Request.Form["reporttypeforcustomRpt"]);
                var groupBycolumn = QueryAES.UrlDecode(Request.Form["groupBycolumn"]);
                var createdBy = LoggedInUser.UserId.ToString();
                var FilterArray = QueryAES.UrlDecode(Request.Form["FilterArray"]);
                var FilterValueArray = QueryAES.UrlDecode(Request.Form["FilterValueArray"]);
                var ColumnArray = QueryAES.UrlDecode(Request.Form["ColumnArray"]);
                var GroupByArray = QueryAES.UrlDecode(Request.Form["GroupByArray"]);
                var OrderByArray = QueryAES.UrlDecode(Request.Form["OrderByArray"]);
                var OrderByValueArray = QueryAES.UrlDecode(Request.Form["OrderByValueArray"]);
                var loginuser = LoggedInUser.UserId.ToString();
                var userRole = LoggedInUser.RoleId.ToString();
                var tempfilternameforcustomRpt = filternameforcustomRpt.Replace(",", " and ");
                string exlfilename = "ReportbuilderReportPreview_" + DateTime.Now;
                var trialList = DataAccessADO.GetReportBuilderQueryPreview(columnnameforcustomRpt, firmid, tempfilternameforcustomRpt,
                       ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt, reporttypeforcustomRpt, 1,int.MaxValue, "", groupBycolumn, loginuser, userRole, moduleid);
                if (trialList.Rows.Count > 0)
                {
                    trialList.Columns.RemoveAt(0);
                    trialList.Columns.RemoveAt(0);
                    foreach (DataColumn column in trialList.Columns)
                    {
                        column.ColumnName = column.ColumnName.Replace("_", " ");
                        // column Unable to get or set value
                    }
                }
                var gv = new GridView();
                gv.DataSource = trialList;
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
        /// <summary>
        /// Export report bulder preview in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public void ExportToPDFReportBuilderPreview()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var Id = Convert.ToString(QueryAES.UrlDecode(Request.Form["Id"]));
                var moduleid = Convert.ToString(QueryAES.UrlDecode(Request.Form["moduleid"]));
                var pagenumber = Convert.ToString(QueryAES.UrlDecode(Request.Form["pagenumber"]));
                var pagesize = Convert.ToString(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var TempTablecolumnnameforcustomRpt = QueryAES.UrlDecode(Request.Form["TempTablecolumnnameforcustomRpt"]);
                var columnnameforcustomRpt = QueryAES.UrlDecode(Request.Form["columnnameforcustomRpt"]);
                var filternameforcustomRpt = QueryAES.UrlDecode(Request.Form["filternameforcustomRpt"]);
                var groupcolcollectionforcustomRpt = QueryAES.UrlDecode(Request.Form["groupcolcollectionforcustomRpt"]);
                var ordercolcollecionforcustomRpt = QueryAES.UrlDecode(Request.Form["ordercolcollecionforcustomRpt"]);
                var reportnameforcustomRpt = QueryAES.UrlDecode(Request.Form["reportnameforcustomRpt"]);
                var reporttypeforcustomRpt = QueryAES.UrlDecode(Request.Form["reporttypeforcustomRpt"]);
                var groupBycolumn = QueryAES.UrlDecode(Request.Form["groupBycolumn"]);
                var createdBy = LoggedInUser.UserId.ToString();
                var FilterArray = QueryAES.UrlDecode(Request.Form["FilterArray"]);
                var FilterValueArray = QueryAES.UrlDecode(Request.Form["FilterValueArray"]);
                var ColumnArray = QueryAES.UrlDecode(Request.Form["ColumnArray"]);
                var GroupByArray = QueryAES.UrlDecode(Request.Form["GroupByArray"]);
                var OrderByArray = QueryAES.UrlDecode(Request.Form["OrderByArray"]);
                var OrderByValueArray = QueryAES.UrlDecode(Request.Form["OrderByValueArray"]);
                var loginuser = LoggedInUser.UserId.ToString();
                var userRole = LoggedInUser.RoleId.ToString();
              string filename = "ReportbuilderReport_" + DateTime.Now.Millisecond.ToString() + ".pdf";
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                string pdfnamelabel = "Report Details";
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
                var tempfilternameforcustomRpt = filternameforcustomRpt.Replace(",", " and ");
                var trialList = DataAccessADO.GetReportBuilderQueryPreview(columnnameforcustomRpt, firmid, tempfilternameforcustomRpt,
                       ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt, reporttypeforcustomRpt, 1, int.MaxValue, "", groupBycolumn, loginuser, userRole, moduleid);
                if (trialList.Rows.Count > 0)
                {
                    trialList.Columns.RemoveAt(0);
                    trialList.Columns.RemoveAt(0);
                    foreach (DataColumn column in trialList.Columns)
                    {
                        column.ColumnName = column.ColumnName.Replace("_", " ");
                        // column Unable to get or set value
                    }
                }
                foreach (DataColumn column in trialList.Columns)
                {
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>" + column.ColumnName + "</th>";
                }
                strtemplate += "</tr></thead><tbody>";
                foreach (DataRow data in trialList.Rows)
                {
                    strtemplate += "<tr>";
                    for (var i = 0; i < data.ItemArray.Length; i++)
                    {
                        strtemplate += "<td height = '20' align = 'left' valign ='top'style='padding:0 5px;' >" + data[i] + " </td>";
                    }
                    strtemplate += "</tr>";
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
                string notification = "You have Downloaded Issue Report PDF";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Issue Report PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }
    }
}