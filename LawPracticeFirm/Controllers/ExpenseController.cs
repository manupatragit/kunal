using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;
namespace LawPracticeFirm.Controllers
{
    public class ExpenseController : BaseFirmController
    {
        LawPracticeEntities context;
        public string checkroles()
        {
            var urlsegment = Request.Url.Segments[3];
            urlsegment = urlsegment.Replace("/", "");
            var db = new LawPracticeEntities();
            var foutput = true;
            var frmids = Session["sessionfirmid"].ToString();
            var usrids = Session["sessionuserid"].ToString();
            int rlid = Convert.ToInt32(Session["sessionroleid"].ToString());
            var finalresult = "";
            int pageid = 0;
            var sflag = true;
            if (LoggedInUser.RoleId == 2)
            {
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString(urlsegment)).ToList();
                if (pagelist.Count > 0)
                {
                    foreach (var data in pagelist)
                    {
                        int pwrite = 0, pview = 0, pedit = 0, pdel = 0, pviewall = 0, peditall = 0;
                        pageid = Convert.ToInt32(data.ParentPage);
                        pwrite = Convert.ToInt32(data.Write);
                        pview = Convert.ToInt32(data.View);
                        pedit = Convert.ToInt32(data.Edit);
                        pdel = Convert.ToInt32(data.Delete);
                        pviewall = Convert.ToInt32(data.ViewAll);
                        peditall = Convert.ToInt32(data.EditAll);
                        dynamic pageaccesslist;
                        if (urlsegment == "caselist" || urlsegment == "NewCaseDashboard" || urlsegment == "Casedetails" || urlsegment == "EditCase" || urlsegment == "CreateCase")
                        {
                            pageaccesslist = db.usp_GetUserCaseModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        else
                        {
                            pageaccesslist = db.usp_GetUserModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        int write = 0, view = 0, edit = 0, del = 0, viewall = 0, editall = 0, share = 0, enable = 0, export = 0, expensespecialright = 0;
                        foreach (var access in pageaccesslist)
                        {
                            write = Convert.ToInt32(access.Write);
                            view = Convert.ToInt32(access.View);
                            edit = Convert.ToInt32(access.Edit);
                            del = Convert.ToInt32(access.Delete);
                            viewall = Convert.ToInt32(access.ViewAll);
                            editall = Convert.ToInt32(access.EditAll);
                            expensespecialright = Convert.ToInt32(access.ExpenseSpecialRights);
                            ViewBag.IsViewAll = viewall;
                            ViewBag.share = 0;
                            ViewBag.enable = 0;
                            ViewBag.export = 0;
                            try
                            {
                                ViewBag.share = access.Share;
                                ViewBag.enable = access.Enable;
                                ViewBag.export = access.Export;
                                ViewBag.Create = access.Share;
                                ViewBag.ExpeseRights = access.ExpenseSpecialRights;
                            }
                            catch
                            {
                            }
                            if (viewall > 0 || editall > 0)
                            {
                                foutput = false;
                                ViewBag.IsDelete = del;
                                ViewBag.IsCreate = write;
                                ViewBag.IsEdit = edit;
                                if (write == 1)
                                {
                                    foutput = false;
                                }
                                if (pedit == 1)
                                {
                                    if (edit == 1 || editall == 1)
                                    {
                                        foutput = false;
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                            }
                            else
                            {
                                // logic for write(create)
                                if (sflag == true)
                                {
                                    if (write > 0)
                                    {
                                        ViewBag.IsCreate = write;
                                        if (pwrite == write)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        ViewBag.IsCreate = 0;
                                        foutput = true;
                                    }
                                }
                                //logic for view
                                if (sflag == true)
                                {
                                    if (view > 0)
                                    {
                                        if (pview == view)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                //logic for edit(
                                if (sflag == true)
                                {
                                    if (edit > 0)
                                    {
                                        if (pedit == edit)
                                        {
                                            foutput = false;
                                            sflag = false;
                                            ViewBag.IsEdit = edit;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                //logic for delete
                                ViewBag.IsDelete = 0;
                                if (del > 0)
                                {
                                    ViewBag.IsDelete = 1;
                                }
                                else
                                {
                                    ViewBag.IsDeletes = 0;
                                }
                                if (expensespecialright > 0)
                                {
                                    ViewBag.ExpeseRights = 1;
                                }
                                else
                                {
                                    ViewBag.ExpeseRights = 0;
                                }
                            }
                        }
                    }
                }
                finalresult = ViewBag.IsCreate + "," + ViewBag.IsEdit + "," + ViewBag.IsDelete + "," + ViewBag.export + "," + ViewBag.share + "," + ViewBag.enable + "," + ViewBag.ExpeseRights;
            }
            return finalresult.ToString();
        }

        /// <summary>
        /// Get expense report
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ExpenseReport()
        {
            ViewBag.LoggeduserId = LoggedInUser.UserId.ToString();
            ViewBag.filesize = System.Configuration.ConfigurationManager.AppSettings["filesize"];
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                ViewBag.ExpeseRights = 0;
                var data = checkroles();
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
                    if (i == 7)
                    {
                        ViewBag.ExpeseRights = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Export expense report in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoExcelExpenseReport()
        {
            try
            {
                int pagenumber = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagenum"]));
                int pagesize = int.MaxValue;//Convert.ToInt32(Request.QueryString["pagesize"]);
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", caseid = "", datefrom = "", dateto = "";
                datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                string loginid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["loginid"]));
                caseid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                clientid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["client"]));
                string categoryfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["categoryfilter"]));
                string etypefilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["etypefilter"]));
                string currencyfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["currencyfilter"]));
                string ExpenseStatusFilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ExpenseStatusFilter"]));
                string Retainername = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Retainername"]));
                string decriptionfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["decriptionfilter"]));
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
                List<usp_ViewExpenseReport_Result> trialList_1 = new List<usp_ViewExpenseReport_Result>();
                trialList_1 = db.usp_ViewExpenseReport(clientid, caseid, datefrom, dateto, firmid, userid, pagenumber, pagesize, loginid, pageid.ToString(), etypefilter, categoryfilter, currencyfilter, ExpenseStatusFilter, Retainername, decriptionfilter).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    usp_ViewExpenseReport_Result newItem = new usp_ViewExpenseReport_Result();
                    if (!string.IsNullOrEmpty(data.cfname))
                    {
                        string cfname = data.cfname.ToString();
                        string cmobile = Convert.ToString(data.cmobile);
                        trialList_1[trialList_1.IndexOf(data)].cfname = cfname;
                        trialList_1[trialList_1.IndexOf(data)].cmobile = cmobile;
                    }
                    if (!string.IsNullOrEmpty(data.CreatedBy))
                    {
                        newItem.CreatedBy = data.CreatedBy.ToString();
                        trialList_1[trialList_1.IndexOf(data)].CreatedBy = newItem.CreatedBy;
                    }
                    if (!string.IsNullOrEmpty(data.MemberName))
                    {
                        newItem.MemberName = data.MemberName.ToString();
                        trialList_1[trialList_1.IndexOf(data)].MemberName = newItem.MemberName;
                    }
                }
                var actionmode = "";
                var recentlabel = "";
                usp_ViewExpenseReport_Result Item = new usp_ViewExpenseReport_Result();
                int count = trialList_1.Count;
                var trialList = (from data in trialList_1
                                 select new
                                 {
                                     SlNo = data.rownum,
                                     Date = String.Format("{0:dd MMM yyyy}", data.dExpensedate),
                                     Matters = data.Casename,
                                     ClientName = data.cfname,
                                     Expensetype = data.ExpenseType,
                                     Category = data.ExpenseCategory,
                                     Description = data.Descriptions,
                                     Amount = data.Total,
                                     PaymentMade = data.PaidAmt,
                                     BalanceAmount = (data.Total - data.PaidAmt),
                                     CreatedBy = data.CreatedBy,
                                     CreateFor = data.MemberName,
                                     Currency = data.CurrencyName,
                                     ExpenseStatus = data.ExpenseStatus,
                                     Duedate = String.Format("{0:dd MMM yyyy}", data.duedate),
                                     ReceiptDate = String.Format("{0:dd MMM yyyy}", data.ReceiptDate),
                                     RetainerName = data.Retainername
                                 }).ToList();
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
                string notification = "You have Downloaded the Excel of Expense";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Download Expense Excel",
                    null, null);
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export expense report in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportoPdfExpenseReport()
        {
            try
            {
                int pagenumber = Convert.ToInt32(QueryAES.UrlDecode(Request.QueryString["pagenum"]));
                int pagesize = int.MaxValue;
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", caseid = "", datefrom = "", dateto = "";
                datefrom = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["datefrom"]));
                dateto = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["dateto"]));
                string loginid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["loginid"]));
                caseid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["casename"]));
                clientid = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["client"]));
                string categoryfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["categoryfilter"]));
                string etypefilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["etypefilter"])); //
                string currencyfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["currencyfilter"]));
                string ExpenseStatusFilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ExpenseStatusFilter"]));
                string Retainername = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Retainername"]));
                string decriptionfilter = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["decriptionfilter"]));
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
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Matters</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Client Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Expense Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Category</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Description</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Total</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Created By</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Created For</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Due Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Expense Status</th>";
                strtemplate += "</tr></thead><tbody>";
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_ViewExpenseReport_Result> trialList_1 = new List<usp_ViewExpenseReport_Result>();
                trialList_1 = db.usp_ViewExpenseReport(clientid, caseid, datefrom, dateto, firmid, userid, pagenumber, pagesize, loginid, pageid.ToString(), etypefilter, categoryfilter, currencyfilter, ExpenseStatusFilter, Retainername, decriptionfilter).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    usp_ViewExpenseReport_Result newItem = new usp_ViewExpenseReport_Result();
                    string cfname = "", cmobile = "";
                    if (!string.IsNullOrEmpty(data.cfname))
                    {
                        cfname = data.cfname.ToString();
                        cmobile = data.cmobile.ToString();
                    }
                    if (!string.IsNullOrEmpty(data.CreatedBy))
                    {
                        newItem.CreatedBy = data.CreatedBy.ToString();
                        trialList_1[trialList_1.IndexOf(data)].CreatedBy = newItem.CreatedBy;
                    }
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'style='padding:0 5px;' >" + data.rownum + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + String.Format("{0:dd MMM yyyy}", data.dExpensedate) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + data.Casename + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + cfname + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.ExpenseType + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.ExpenseCategory + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Descriptions + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.Total + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.CreatedBy + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + data.MemberName + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + String.Format("{0:dd MMM yyyy}", data.duedate) + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + String.Format("{0:dd MMM yyyy}", data.ExpenseStatus) + " </td></tr>";
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
                string notification = "You have Downloaded the PDF of Expense";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Download Expense PDF",
                    null, null);
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get expense payment list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PaymentExpense()
        {
            var db = new LawPracticeEntities();
            try
            {
                var expenseid = QueryAES.UrlDecode(Request.QueryString["token"]);
                ViewBag.invid = expenseid;
                decimal paidamttemp = 0;
                decimal totamttemp = 0;
                var data = db.sp_GetExpenseDetailsForPaymentById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid).FirstOrDefault();
                if (data != null)
                {
                    ViewBag.dExpensedate = String.Format("{0:dd MMM yyyy}", data.dExpensedate);
                    ViewBag.totamt = data.Total;
                    totamttemp = Convert.ToDecimal(data.Total);
                }
                var payhistory = db.sp_GetExpensePaymentListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid).ToList();
                var datapay = db.sp_GetExpensePaymentListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), expenseid).Where(z => z.Cleared == 1).Sum(z => z.Amount);
                if (payhistory != null)
                {
                    paidamttemp = Convert.ToDecimal(datapay);
                    ViewBag.paymentlist = payhistory;
                    ViewBag.dueamt = Convert.ToDouble(totamttemp) - Convert.ToDouble(paidamttemp);
                }
                else
                {
                    ViewBag.dueamt = totamttemp;
                }
                ViewBag.firmid = LoggedInUser.FirmId;
                ViewBag.userid = LoggedInUser.UserId;
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = checkroles();
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
    }
}