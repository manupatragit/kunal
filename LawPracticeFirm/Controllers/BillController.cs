using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Configuration;
using System.Web.Mvc;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class BillController : BaseFirmController
    {
        // GET: Bill
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "EmployeeController";

        /// <summary>
        /// Get firm invoice setting datails
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult InvoiceSetting()
        {
            var datas = db.firminvoicesettingdata(LoggedInUser.FirmId.ToString()).FirstOrDefault();
            if (datas != null)
            {
                ViewBag.cname = datas.Incompanyname;
                ViewBag.address = datas.inaddress;
                ViewBag.email = datas.inemail;
                ViewBag.gstno = datas.ingstregno;
                ViewBag.logo = datas.inlogo;
                ViewBag.notes = datas.innotes;
                ViewBag.pan = datas.inpan;
                ViewBag.phone = datas.inphone;
                ViewBag.template = datas.intemplate;
                ViewBag.terms = datas.intermscondtion;
                ViewBag.sac = datas.saccode;
                ViewBag.website = datas.website;
                ViewBag.state = datas.state;
                ViewBag.isdefault = datas.isdefault;
                ViewBag.InSignature = datas.InSignature;
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

        /// <summary>
        /// View invoice template
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult viewinvoicetemplate()
        {
            var invoiceid = QueryAES.UrlDecode(Request.QueryString["data"]);
            ViewBag.inid = invoiceid;
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
        /// <summary>
        /// Get new invoice setting details by firm id 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CreateInvoice()
        {
            var datas = db.usp_linvoiceSettingsByFirmId(LoggedInUser.FirmId.ToString()).FirstOrDefault();
            var clientid = QueryAES.UrlDecode(Request.Form["mtrclientid"]);
            var matterids = QueryAES.UrlDecode(Request.Form["matterids"]);
            if (clientid == null)
            {
                clientid = "";
            }
            if (matterids == null)
            {
                matterids = "";
            }
            // var datas = db.TblinvoiceSettings.Where(x => x.Firmid == LoggedInUser.FirmId).FirstOrDefault();
            if (datas != null)
            {
                ViewBag.address = datas.inaddress;
                ViewBag.state = datas.state;
                ViewBag.isdefault = datas.isdefault;
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
            //for auto populate value on invoice section
            ViewBag.invclientid = clientid;
            ViewBag.matterids = matterids;
            return View();
        }
        /// <summary>
        /// Check logged in user roles
        /// </summary>
        /// <returns></returns>
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
                        int write = 0, view = 0, edit = 0, del = 0, viewall = 0, editall = 0, share = 0, enable = 0, export = 0;
                        foreach (var access in pageaccesslist)
                        {
                            write = Convert.ToInt32(access.Write);
                            view = Convert.ToInt32(access.View);
                            edit = Convert.ToInt32(access.Edit);
                            del = Convert.ToInt32(access.Delete);
                            viewall = Convert.ToInt32(access.ViewAll);
                            editall = Convert.ToInt32(access.EditAll);
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
                            }
                        }
                    }
                }
                finalresult = ViewBag.IsCreate + "," + ViewBag.IsEdit + "," + ViewBag.IsDelete + "," + ViewBag.export + "," + ViewBag.share + "," + ViewBag.enable;
            }
            return finalresult.ToString();
        }

        /// <summary>
        /// Create New tax by firm
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult CreateTax()
        {
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
        /// <summary>
        /// Get payment clearance
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PaymentClearance()
        {
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
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ViewInvoice()
        {
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
        /// <summary>
        /// Search invoice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ViewInvoiceSearch()
        {
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
        /// <summary>
        /// Create new invoice series
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult CreateInvoiceSeries()
        {
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
        /// <summary>
        /// Edit invoice by token id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult EditInvoiceSeries()
        {
            try
            {
                var token = QueryAES.UrlDecode(Request.Form["token"]);
                if (token != "")
                {
                    ViewBag.token = token;
                    var data = db.usp_InvoiceSeriesById(LoggedInUser.FirmId.ToString(), token).FirstOrDefault();
                    if (data != null)
                    {
                        ViewBag.year = data.Year;
                        ViewBag.seriescode = data.SeriesCode;
                        ViewBag.seriesno = data.StartSeries;
                        ViewBag.fromdate = data.fromdate;
                        ViewBag.todate = data.todate;
                    }
                }
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get other invoice address role
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult InvoiceOtherAddress()
        {
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
        /// <summary>
        /// Create new invoice address
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult CreateInvAddress()
        {
            try
            {
                var token = QueryAES.UrlDecode(Request.Form["token"]);
                if (token != "")
                {
                    try
                    {
                        token = token.ToString().Replace(" ", "+");
                        token = QueryAES.DecryptStringAES(token);
                    }
                    catch
                    {
                    }
                    ViewBag.token = token;
                    var data = db.usp_TblAnotherAddressInvoicesById(LoggedInUser.FirmId.ToString(), token).FirstOrDefault();
                    if (data != null)
                    {
                        ViewBag.address = data.Address;
                        ViewBag.state = data.State;
                        ViewBag.phone = data.Phoneno;
                        ViewBag.email = data.Email;
                        ViewBag.website = data.website;
                        ViewBag.gstno = data.GSTNo;
                        ViewBag.pan = data.Pan;
                        ViewBag.sac = data.Sac;
                        ViewBag.Isactive = data.Isactive;
                        ViewBag.isdefult = data.isdefault;
                    }
                }
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Send invoice details in mail
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string SendInvoice()
        {
            try
            {
                var emailmatterrname = "";
                var email = QueryAES.UrlDecode(Request.Form["email"]);
                var invoiceid = QueryAES.UrlDecode(Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var db = new LawPracticeEntities();
                var invversion = QueryAES.UrlDecode(Request.Form["invversion"]);
                if (invversion == "o")
                {
                    var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(invoiceid), invversion).Select(x => x.id).FirstOrDefault();
                    if (versioninvid != null)
                    {
                        invoiceid = versioninvid.ToString();
                    }
                }
                else
                {
                    var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(invoiceid), invversion).Where(x => x.RowNum == Convert.ToInt32(invversion)).Select(x => x.id).FirstOrDefault();
                    if (versioninvid != null)
                    {
                        invoiceid = versioninvid.ToString();
                    }
                }
                var remarksemail = QueryAES.UrlDecode(Request.Form["remarksemail"]);
                var invoicetype = QueryAES.UrlDecode(Request.Form["invtype"]);
                invoicetype = "Original for Recipient";
                string strHTMLpath = "";
                strHTMLpath = Server.MapPath("~\\Manupanel\\Invoice\\invoice2.html");
                var firmid = LoggedInUser.FirmId.ToString();
                var footerhtml = "";
                var userid = LoggedInUser.UserId.ToString();
                var invtemplate = db.invoiceadmindata(Convert.ToString(firmid), Convert.ToString(userid), Convert.ToString(invoiceid));
                var chckintemplate = 1;
                if (invtemplate != null)
                {
                    foreach (invoiceadmindata_Result invtemp in invtemplate)
                    {
                        if (invtemp.intemplate.ToString() == "1")
                        {
                            chckintemplate = 1;
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice.html");
                        }
                        else if (invtemp.intemplate.ToString() == "2")
                        {
                            chckintemplate = 2;
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice2.html");
                        }
                        else if (invtemp.intemplate.ToString() == "3")
                        {
                            chckintemplate = 3;
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice3.html");
                        }
                        else if (invtemp.intemplate.ToString() == "4")
                        {
                            chckintemplate = 4;
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice4.html");
                        }
                        else if (invtemp.intemplate.ToString() == "5")
                        {
                            chckintemplate = 5;
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice5.html");
                        }
                        else
                        {
                            strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoice.html");
                        }
                    }
                }
                var iuserid = "";
                string iinoiceid = Convert.ToString(invoiceid);
                var userids = db.usp_TblInvoicesById(LoggedInUser.FirmId.ToString(), iinoiceid.ToString()).FirstOrDefault();
                if (userid != null)
                {
                    iuserid = userids.userid.ToString();
                }
                //check if invoice has no taxx
                var isinvoicetax = "";
                var ClientGSTNo = "";
                var invdatacheckdata = db.invoicedata(Convert.ToString(firmid), Convert.ToString(iuserid), Convert.ToString(invoiceid));
                if (invdatacheckdata != null)
                {
                    foreach (invoicedata_Result invdetaildata in invdatacheckdata)
                    {
                        isinvoicetax = invdetaildata.isinvoicetax.ToString();
                        ClientGSTNo = invdetaildata.ClientGSTNo;
                    }
                }
                if (isinvoicetax == "1")
                {
                    if (chckintemplate == 1)
                    {
                        strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\invoicewithouttax.html");
                    }
                    else if (chckintemplate == 2)
                    {
                        strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\Invoice2withouttax.html");
                    }
                    else if (chckintemplate == 4)
                    {
                        strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\Invoice4withouttax.html");
                    }
                    else if (chckintemplate == 5)
                    {
                        strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\Invoice5withouttax.html");
                    }
                    else
                    {
                        strHTMLpath = Server.MapPath("~\\Documents\\InvoiceTemplate\\Invoice3withouttax.html");
                    }
                }
                System.IO.StreamReader reader = new System.IO.StreamReader(strHTMLpath, System.Text.Encoding.Default);
                string strinvoicetemplate = reader.ReadToEnd().Replace('\r', ' ').Replace('\n', ' ').Replace("  ", " ");
                string strinvoicetemplate1 = strinvoicetemplate;
                strinvoicetemplate = strinvoicetemplate.Replace("@invtype", "Invoice");
                strinvoicetemplate = strinvoicetemplate.Replace("@invoicetype", invoicetype);
                string startupPath = AppDomain.CurrentDomain.BaseDirectory + "\\Manupanel\\Invoice\\images\\Rupees-symbol-black.gif";
                strinvoicetemplate = strinvoicetemplate.Replace("#balimg", "<img src='" + startupPath + "'></img>");
                //set admin data
                var invadmindata1 = db.invoiceadmindata(Convert.ToString(firmid), Convert.ToString(userid), Convert.ToString(invoiceid));
                if (invadmindata1 != null)
                {
                    foreach (invoiceadmindata_Result invadmindata in invadmindata1)
                    {
                        footerhtml += "<hr><div style='width:100%;float:left;text-align:center;font-weight:bold;'>";
                        if (!String.IsNullOrEmpty(invadmindata.inaddress))
                        {
                            footerhtml += invadmindata.inaddress;
                            footerhtml += "&nbsp;&nbsp;&nbsp;";
                        }
                        if (!String.IsNullOrEmpty(invadmindata.inphone))
                        {
                            footerhtml += "O: " + invadmindata.inphone;
                            footerhtml += "&nbsp;&nbsp;&nbsp;";
                        }
                        if (!String.IsNullOrEmpty(invadmindata.inemail))
                        {
                            footerhtml += "E: " + invadmindata.inemail;
                            footerhtml += "&nbsp;&nbsp;&nbsp;";
                        }
                        if (!String.IsNullOrEmpty(invadmindata.website))
                        {
                            footerhtml += invadmindata.website;
                        }
                        footerhtml += "</div>";
                        strinvoicetemplate = strinvoicetemplate.Replace("@cmpname", invadmindata.Incompanyname);
                        strinvoicetemplate = strinvoicetemplate.Replace("@cmpaddress", invadmindata.inaddress);
                        strinvoicetemplate = strinvoicetemplate.Replace("@cmpemail", invadmindata.inemail);
                        strinvoicetemplate = strinvoicetemplate.Replace("@cmpphoneno", invadmindata.inphone);
                        strinvoicetemplate = strinvoicetemplate.Replace("@cmppan", invadmindata.inpan);
                        if (chckintemplate == 4)
                        {
                            if (ClientGSTNo != "")
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@gstdetails", "GSTIN: " + ClientGSTNo + "<br />");
                            }
                            else
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@gstdetails", "");
                            }
                        }
                        else if (chckintemplate == 5)
                        {
                            if (ClientGSTNo != "")
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@GST", ClientGSTNo);
                            }
                            else
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@GST", "");
                            }
                            strinvoicetemplate = strinvoicetemplate.Replace("@cmpname", invadmindata.Incompanyname);
                            strinvoicetemplate = strinvoicetemplate.Replace("@cmpaddress", invadmindata.inaddress);
                            strinvoicetemplate = strinvoicetemplate.Replace("@cmpphoneno", invadmindata.inphone);
                            strinvoicetemplate = strinvoicetemplate.Replace("@Pan", invadmindata.inpan);
                        }
                        else
                        {
                            if (invadmindata.ingstregno != "")
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@cmpgstregno", "GST Reg. No.: " + invadmindata.ingstregno + "<br />");
                                strinvoicetemplate = strinvoicetemplate.Replace("@gstdetails", "GSTIN: " + invadmindata.ingstregno + "<br />");
                            }
                            else
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@cmpgstregno", invadmindata.ingstregno);
                                strinvoicetemplate = strinvoicetemplate.Replace("@gstdetails", invadmindata.ingstregno);
                            }
                        }
                        if (invadmindata.saccode != "")
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@cmpsac", "SAC Code: " + invadmindata.saccode + "<br/>");
                        }
                        else
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@cmpsac", invadmindata.saccode);
                        }
                        strinvoicetemplate = strinvoicetemplate.Replace("@note", "<div style='word-break:break-all'>" + invadmindata.innotes + "</div>");
                        strinvoicetemplate = strinvoicetemplate.Replace("@terms", invadmindata.intermscondtion);
                        string relative_path = invadmindata.inlogo;
                        string absolute_path = Server.MapPath(relative_path);
                        string relative_pathsign = invadmindata.InSignature;
                        string absolute_pathsign = Server.MapPath(relative_pathsign);
                        if (chckintemplate == 3)
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@logo", "<img src='" + absolute_path + "' style='height: 150px; width: 500px; overflow: hidden;'></img>");
                            if (!String.IsNullOrEmpty(invadmindata.InSignature))
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@sign", "<img src='" + absolute_pathsign + "' style='height: 50px; width: 200px; overflow: hidden;'></img>");
                            }
                        }
                        if (chckintemplate == 4)
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@logo", "<img src='" + absolute_path + "' style='height: 100px; width: 100px; overflow: hidden;'></img>");
                            if (!String.IsNullOrEmpty(invadmindata.InSignature))
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@sign", "<img src='" + absolute_pathsign + "' style='height: 87px; width: 70px; overflow: hidden;'></img>");
                            }
                        }
                        if (chckintemplate == 5)
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@logo", "<img src='" + absolute_path + "' style='height: 131; width: 434;'></img>");
                            if (!String.IsNullOrEmpty(invadmindata.InSignature))
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@signature", "<img src='" + absolute_pathsign + "' style='height: 87px; width: 70px; overflow: hidden;'></img>");
                            }
                        }
                        else
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@logo", "<img src='" + absolute_path + "' style='height: 100px; width: 200px; overflow: hidden;'></img>");
                            if (!String.IsNullOrEmpty(invadmindata.InSignature))
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@sign", "<img src='" + absolute_pathsign + "' style='height: 50px; width: 200px; overflow: hidden;'></img>");
                            }
                        }
                    }
                }
                var filename = "";
                var totalamount = "";
                //set client data
                var Isubject = "";
                var IRef = "";
                var invdata2 = db.invoicedata(Convert.ToString(firmid), Convert.ToString(iuserid), Convert.ToString(invoiceid));
                if (invdata2 != null)
                {
                    foreach (invoicedata_Result invdata in invdata2)
                    {
                        Isubject = invdata.ISubject;
                        IRef = invdata.IReference;
                        emailmatterrname = invdata.MatterName;
                    }
                }
                //subjref
                string subjrefdata = "";
                //flatfee entry
                if (!String.IsNullOrEmpty(Isubject) || !String.IsNullOrEmpty(IRef))
                {
                    if (chckintemplate == 4)
                    {
                        if (!String.IsNullOrEmpty(Isubject))
                        {
                            subjrefdata += "<p><b>Subject:</b> " + Isubject + "</p>";
                        }
                        if (!String.IsNullOrEmpty(IRef))
                        {
                            subjrefdata += "<p><b>Reference:</b> " + IRef + "<p/>";
                        }
                    }
                    else
                    {
                        subjrefdata += "<table style='border-collapse:collapse;' cellspacing='0 > ";
                        if (!String.IsNullOrEmpty(Isubject))
                        {
                            subjrefdata += "<tr style='height:17pt'>";
                            subjrefdata += "<td style='width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += "<p class='s3' style ='padding-left: 5pt;text-indent: 0pt;line-height: 14pt;text-align: left; ' > Subject</p>";
                            subjrefdata += "</td>";
                            subjrefdata += " <td style='width:14pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += " <p class='s4' style ='text-indent: 0pt;line-height: 14pt;text-align: center; ' >:</p>";
                            subjrefdata += "</td>";
                            subjrefdata += " <td style='width:359pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += "<p class='s4' style ='padding-left: 5pt;text-indent: 0pt;line-height: 14pt;text-align: left;font-size:18px;' > " + Isubject + "</p>";
                            subjrefdata += "</td>";
                            subjrefdata += "</tr>";
                        }
                        if (!String.IsNullOrEmpty(IRef))
                        {
                            subjrefdata += "<tr style='height:33pt' > ";
                            subjrefdata += "<td style='width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += "<p class='s3' style ='padding-left: 5pt;text-indent: 0pt;line-height: 14pt;text-align: left; ' > Reference</p>";
                            subjrefdata += "</td>";
                            subjrefdata += "<td style='width:14pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += "<p class='s4' style ='text -indent: 0pt;line-height: 14pt;text-align: center; ' >:</p>";
                            subjrefdata += "</td>";
                            subjrefdata += "<td style='width:359pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt' > ";
                            subjrefdata += "<p class='s4' style ='padding-left: 5pt;text-indent: 0pt;line-height: 14pt;text-align: left;font-size:18px; ' > " + IRef + "</p>";
                            subjrefdata += "</td>";
                            subjrefdata += "</tr>";
                        }
                        subjrefdata += "</table>";
                    }
                }
                string flatfeedata = "";
                string timeentrydata1 = "";
                flatfeedata += " <p></p>";
                flatfeedata += " <p></p>";
                flatfeedata += " <table id='table1' border='1' width='900' cellspacing='0' cellpadding='0' align='center'>";
                flatfeedata += "  <thead><tr> ";
                flatfeedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Item Name</th>";
                flatfeedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                flatfeedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Billed By</th>";
                flatfeedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Unit Price</th>";
                flatfeedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Total</th>";
                flatfeedata += "</tr></thead><tbody>";
                var flagfee = 0;
                var flagtime = 0;
                var flagexpense = 0;
                string timeentrydata = "";
                if (chckintemplate == 3)
                {
                    timeentrydata += " <p></p>";
                    timeentrydata += " <p></p>";
                    timeentrydata += " <table id='table1' border='1' width='900' cellspacing='0' cellpadding='0' align='center'>";
                    timeentrydata += "  <thead><tr> ";
                    timeentrydata += "<th height='20' width='120px' align='center' valign='top' style='padding:0 5px;'>Sr No.</th>";
                    timeentrydata += "<th height='20' align='center' valign='top' style='padding:0 5px;'>Particulars</th>";
                    timeentrydata += "<th height='20' align='center' valign='top' style='padding:0 5px;'>Amount(INR)</th>";
                    timeentrydata += "<th height='20' align='center' valign='top' style='padding:0 5px;'>Sub Total(INR)</th>";
                    timeentrydata += "</tr></thead><tbody>";
                }
                else if (chckintemplate == 4)
                {
                    timeentrydata += " <p></p>";
                    timeentrydata += " <p></p>";
                    timeentrydata += " <table id='table1' border='1' width='900' cellspacing='0' cellpadding='0' align='center'>";
                    timeentrydata += "  <thead><tr> ";
                    timeentrydata += "<th  style='padding:0 5px;width:8%'>S. No.</th>";
                    timeentrydata += "<th  style='padding:0 5px;width:74%;text-align:left;' >Particulars</th>";
                    timeentrydata += "<th  style='padding:0 5px;width:8%;text-align:left;'>Amount(INR)</th>";
                    timeentrydata += "</tr></thead><tbody>";
                }
                else
                {
                    timeentrydata += " <p></p>";
                    timeentrydata += " <p></p>";
                    timeentrydata += " <table id='table1' border='1' width='900' cellspacing='0' cellpadding='0' align='center'>";
                    timeentrydata += "  <thead><tr> ";
                    timeentrydata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Particular Name</th>";
                    timeentrydata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                    timeentrydata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Billed By</th>";
                    timeentrydata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Amount</th>";
                    timeentrydata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Total</th>";
                    timeentrydata += "</tr></thead><tbody>";
                }
                string expensedata = "";
                expensedata += " <p></p>";
                expensedata += "<p><strong>Expenses</strong></p>";
                expensedata += " <p></p>";
                expensedata += " <table id='table1' border='1' width='900' cellspacing='0' cellpadding='0' align='center'>";
                expensedata += "  <thead><tr> ";
                expensedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Item Name</th>";
                expensedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                expensedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Billed By</th>";
                expensedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Amount</th>";
                expensedata += "<th height='20' align='left' valign='top' style='padding:0 5px;'>Total</th>";
                expensedata += "</tr></thead><tbody>";
                var billbyname = "";
                var inventry = db.invoiceentry(Convert.ToString(firmid), Convert.ToString(userid), Convert.ToString(invoiceid));
                int sum = 0;
                if (inventry != null)
                {
                    foreach (invoiceentry_Result invent in inventry)
                    {
                        billbyname = "";
                        sum = sum + 1;
                        if (!string.IsNullOrEmpty(invent.billuser))
                        {
                            billbyname = invent.billuser.ToString();
                        }
                        if (invent.type == "FlatFees")
                        {
                            flagfee = 1;
                            flatfeedata += "<tr><td height = '20' align = 'left' valign ='top' width='20%' style='padding:0 5px;' >" + invent.itemname + " </ td >";
                            flatfeedata += "<td height = '20' align = 'left' valign ='top'  width='30%' style='padding:0 5px;' > " + invent.casename + " </ td >";
                            flatfeedata += "<td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;'> " + billbyname + "  </ td >";
                            flatfeedata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;'> " + invent.price + "  </ td >";
                            flatfeedata += "<td height = '20' align = 'left' valign ='top'   width='10%' style='padding:0 5px;'> " + (string.Format(String.Format("{0:N2}", (invent.price)))).ToString() + " </ td ></tr>";
                        }
                        else if (invent.type == "TimeEntries")
                        {
                            if (chckintemplate == 3)
                            {
                                flagtime = 1;
                                timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> " + sum + "  </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;'>" + invent.itemname + " </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;' > " + invent.price + "  </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;'> " + (string.Format(String.Format("{0:N2}", (invent.price)))).ToString() + " </ td ></tr>";
                            }
                            else if (chckintemplate == 4)
                            {
                                flagtime = 1;
                                timeentrydata += "<tr><td  style='padding:0 5px;font-size:17px !Important;text-align:center'> " + sum + "  </ td >";
                                timeentrydata += "<td  style='padding:0 5px;font-size:17px !Important;'>" + invent.itemname + " </ td >";
                                timeentrydata += "<td  style='padding:0 5px;font-size:17px !Important;text-align:right;'  ><b> " + (string.Format(String.Format("{0:N2}", (invent.price)))).ToString() + "  </b></ td >";
                                timeentrydata += "</tr>";
                            }
                            else if (chckintemplate == 5)
                            {
                                timeentrydata1 += "<tr><td align='left' valign='top' width='53' style='padding: 2px 3px;'> " + sum + "  </ td >";
                                timeentrydata1 += "<td align='left' valign='top' style='padding: 2px 3px;'>" + invent.itemname + " </ td >";
                                timeentrydata1 += "<td align='right' valign='top' width='275' style='padding: 2px 3px;'> " + (string.Format(String.Format("{0:N2}", (invent.price)))).ToString() + " </ td ></tr>";
                            }
                            else
                            {
                                flagtime = 1;
                                timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;'>" + invent.itemname + " </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='30%' style='padding:0 5px;'> " + invent.casename + "  </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;' > " + billbyname + "  </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;' > " + invent.price + "  </ td >";
                                timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;'> " + (string.Format(String.Format("{0:N2}", (invent.price)))).ToString() + " </ td ></tr>";
                            }
                        }
                        else if (invent.type == "Expense")
                        {
                            flagexpense = 1;
                            expensedata += "<tr><td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;' > " + invent.itemname + "</ td >";
                            expensedata += "<td height = '20' align = 'left' valign ='top'  width='30%' style='padding:0 5px;'> " + invent.casename + "  </ td >";
                            expensedata += "<td height = '20' align = 'left' valign ='top'   width='20%' style='padding:0 5px;'> " + billbyname + "  </ td >";
                            expensedata += "<td height = '20' align = 'left' valign ='top'  width='10%' style='padding:0 5px;' > " + invent.price + "  </ td >";
                            expensedata += "<td height = '20' align = 'left' valign ='top'  width='10%'style='padding:0 5px;' > " + (string.Format(String.Format("{0:N2}", (invent.price * invent.QtyORHour)))).ToString() + " </ td ></tr>";
                        }
                    }
                }
                if (chckintemplate == 3 || chckintemplate == 4)
                {
                    if (isinvoicetax == "1")
                    {
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'left' valign ='top'  width='20%' style='padding:0 5px;'><b>Total in Words ( @word )</b>  </ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;font-size:19px !Important;text-align:right;' ><b> @Invtotal</b>  </ td ></tr>";
                    }
                    else
                    {
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'center' valign ='top'  width='20%' style='padding:0 5px;'>IGST @iper%: </ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;' > @igst  </ td ></tr>";
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'center' valign ='top'  width='20%' style='padding:0 5px;'>CGST @cper%:	 </ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;' > @cgst  </ td ></tr>";
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'center' valign ='top'  width='20%' style='padding:0 5px;'>SGST @sper%:	 </ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;' > @sgst  </ td ></tr>";
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'center' valign ='top'  width='20%' style='padding:0 5px;'>Round Off:</ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;' > @roundoff  </ td ></tr>";
                        timeentrydata += "<tr><td height = '20' align = 'left' valign ='top'  width='5%' style='padding:0 5px;'> </ td >";
                        timeentrydata += "<td height = '20' align = 'center' valign ='top'  width='20%' style='padding:0 5px;'><b>Total in Words ( @word ) </b></ td >";
                        timeentrydata += "<td height = '20' align = 'right' colspan='2' valign ='top'  width='10%' style='padding:0 5px;text-align:right;' ><b> @Invtotal </b> </ td ></tr>";
                    }
                }
                flatfeedata += "<tr>";
                timeentrydata += "<tr>";
                expensedata += "<tr>";
                flatfeedata += "</tbody></table>";
                timeentrydata += "</tbody></table>";
                expensedata += "</tbody></table>";
                if (flagfee == 1)
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@flatfeedata", flatfeedata);
                }
                else
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@flatfeedata", "");
                }
                if (flagtime == 1)
                {
                    if (chckintemplate == 3 || chckintemplate == 4)
                    {
                        strinvoicetemplate = strinvoicetemplate.Replace("@paymentdetails", timeentrydata);
                    }
                    else
                    {
                        strinvoicetemplate = strinvoicetemplate.Replace("@timeenrydata", timeentrydata);
                    }
                }
                else
                {
                    if (chckintemplate == 5)
                    {
                        strinvoicetemplate = strinvoicetemplate.Replace("@paymentdetailsfor5", timeentrydata1);
                    }
                    else
                    {
                        strinvoicetemplate = strinvoicetemplate.Replace("@timeenrydata", "");
                    }
                }
                if (flagexpense == 1)
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@expensedata", expensedata);
                }
                else
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@expensedata", "");
                }
                strinvoicetemplate = strinvoicetemplate.Replace("@subjectref", subjrefdata);
                //set payment data
                string paymentdata = "";
                var payflag = 0;
                double tempbalance = 0;
                var invpaydata1 = db.invoicepayment(Convert.ToString(firmid), Convert.ToString(userid), Convert.ToString(invoiceid));
                if (invpaydata1 != null)
                {
                    foreach (invoicepayment_Result invpay in invpaydata1)
                    {
                        payflag = 1;
                        if (invpay.PaymentType == "Cheque")
                        {
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Date:</strong> " + @String.Format("{0:dd MMM yyyy}", invpay.PDate) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Amount:</strong>" + (string.Format(String.Format("{0:N2}", invpay.Amount))) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Type</strong>: " + invpay.PaymentType + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'></td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr  colspan='2'>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Bank Name</strong> </td>";
                            paymentdata += "<td height='20' align='left' valign='top'>" + invpay.BankName + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Cheque/DD:</strong>: </td>";
                            paymentdata += "<td height='20' align='left' valign='top'>" + invpay.ChequeNo + invpay.DdNo + "</td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "</tr>";
                        }
                        else if (invpay.PaymentType == "Demand Draft")
                        {
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Date:</strong> " + @String.Format("{0:dd MMM yyyy}", invpay.PDate) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Amount:</strong>" + (string.Format(String.Format("{0:N2}", invpay.Amount))) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Type</strong>: " + invpay.PaymentType + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'></td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr  colspan='2'>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Bank Name</strong> </td>";
                            paymentdata += "<td height='20' align='left' valign='top'>" + invpay.BankName + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Cheque/DD:</strong>: </td>";
                            paymentdata += "<td height='20' align='left' valign='top'>" + invpay.ChequeNo + invpay.DdNo + "</td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "</tr>";
                        }
                        else if (invpay.PaymentType == "Cash")
                        {
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Date:</strong> " + @String.Format("{0:dd MMM yyyy}", invpay.PDate) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Amount:</strong>" + (string.Format(String.Format("{0:N2}", invpay.Amount))) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Type</strong>: " + invpay.PaymentType + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'></td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "</tr>";
                        }
                        else if (invpay.PaymentType == "Online")
                        {
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Date:</strong> " + @String.Format("{0:dd MMM yyyy}", invpay.PDate) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Amount:</strong>" + (string.Format(String.Format("{0:N2}", invpay.Amount))) + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Type</strong>: " + invpay.PaymentType + "</td>";
                            paymentdata += "<td height='20' align='left' valign='top'><strong>Mode</strong>: " + invpay.PaymentMode + "</td>";
                            paymentdata += "</tr>";
                            paymentdata += "<tr>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "<td height='20' align='left' valign='top'><hr></td>";
                            paymentdata += "</tr>";
                        }
                        tempbalance = Convert.ToDouble(tempbalance) + Convert.ToDouble(invpay.Amount);
                    }
                }
                var invdata21 = db.invoicedata(Convert.ToString(firmid), Convert.ToString(iuserid), Convert.ToString(invoiceid));
                if (invdata21 != null)
                {
                    foreach (invoicedata_Result invdata in invdata21)
                    {
                        var rtotvalue = invdata.SubTotal + invdata.IGST + invdata.CGST + invdata.SGST;
                        var rtotamt = invdata.TotAmt;
                        var rdiff = invdata.TotAmt - rtotvalue;
                        var sign = "";
                        if (rdiff > 0)
                        {
                            sign = "+";
                        }
                        else
                        {
                        }
                        var clientnames = "";
                        if (!string.IsNullOrEmpty(invdata.UserNameInvoice))
                        {
                            clientnames = invdata.UserNameInvoice.ToString();
                        }
                        //for template5 data
                        if (chckintemplate == 5)
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@Name", clientnames);
                            strinvoicetemplate = strinvoicetemplate.Replace("@Address", invdata.address);
                            strinvoicetemplate = strinvoicetemplate.Replace("@Mobile", invdata.mobile);
                            strinvoicetemplate = strinvoicetemplate.Replace("@Price", (string.Format(String.Format("{0:0,0.00}", invdata.SubTotal))).ToString());
                            strinvoicetemplate = strinvoicetemplate.Replace("@TotalPrice", (string.Format(String.Format("{0:0,0.00}", invdata.TotAmt))).ToString());
                            strinvoicetemplate = strinvoicetemplate.Replace("@InvDate", @String.Format("{0:dd MMM yyyy}", invdata.invdate));
                            strinvoicetemplate = strinvoicetemplate.Replace("@Invoice", invdata.InvoiceNo);
                            if (!String.IsNullOrEmpty(invdata.ClientPanNo))
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@cPan", invdata.ClientPanNo);
                            }
                            else
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@cPan", "");
                            }
                            if (chckintemplate == 5)
                            {
                                strinvoicetemplate = strinvoicetemplate.Replace("@Rupees", Convert.ToString(NumWords.ConvertNumbertoWordsTitleCase(Convert.ToInt32(invdata.TotAmt))) + " Only");
                            }
                        }
                        Isubject = invdata.ISubject;
                        IRef = invdata.IReference;
                        strinvoicetemplate = strinvoicetemplate.Replace("@roundoff", sign + " " + (string.Format(String.Format("{0:N2}", rdiff))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@Name", clientnames);
                        strinvoicetemplate = strinvoicetemplate.Replace("@address", invdata.address);
                        strinvoicetemplate = strinvoicetemplate.Replace("#trstt", invdata.state);
                        strinvoicetemplate = strinvoicetemplate.Replace("@saddress", invdata.shipaddress);
                        strinvoicetemplate = strinvoicetemplate.Replace("#strstt", invdata.shipstate);
                        strinvoicetemplate = strinvoicetemplate.Replace("@Mobile", invdata.mobile);
                        strinvoicetemplate = strinvoicetemplate.Replace("@subtot", (string.Format(String.Format("{0:0,0.00}", invdata.SubTotal))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@igst", (string.Format(String.Format("{0:N2}", invdata.IGST))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@cgst", (string.Format(String.Format("{0:N2}", invdata.CGST))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@sgst", (string.Format(String.Format("{0:N2}", invdata.SGST))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@iper", invdata.IGSTPer.ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@cper", invdata.CGSTPer.ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@sper", invdata.SGSTPer.ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@Invtotal", (string.Format(String.Format("{0:0,0.00}", invdata.TotAmt))).ToString());
                        strinvoicetemplate = strinvoicetemplate.Replace("@InvDate", @String.Format("{0:dd MMM yyyy}", invdata.invdate));
                        strinvoicetemplate = strinvoicetemplate.Replace("@duedate", @String.Format("{0:dd MMM yyyy}", invdata.duedate));
                        strinvoicetemplate = strinvoicetemplate.Replace("@Invoice", invdata.InvoiceNo);
                        if (chckintemplate == 3)
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@word", Convert.ToString(NumWords.ConvertNumbertoWordsTitleCase(Convert.ToInt32(invdata.TotAmt))) + " Only");
                        }
                        else
                        {
                            strinvoicetemplate = strinvoicetemplate.Replace("@word", Convert.ToString(NumWords.ConvertNumbertoWords(Convert.ToInt32(invdata.TotAmt))) + " ONLY");
                        }
                        var ClientData = "</br>";
                        if (!String.IsNullOrEmpty(invdata.ClientPanNo))
                        {
                            ClientData += "<strong>Client PAN No :</strong>" + invdata.ClientPanNo + "</br>";
                        }
                        if (!String.IsNullOrEmpty(invdata.ClientGSTNo))
                        {
                            ClientData += "<strong>Client GST No :</strong>" + invdata.ClientGSTNo + "</br>";
                        }
                        strinvoicetemplate = strinvoicetemplate.Replace("@ClientData", ClientData);
                        if (invoicetype == "Original for Recipient")
                        {
                            filename = invdata.InvoiceNo.ToUpper() + "_Original.pdf";
                        }
                        else if (invoicetype == "Duplicate for Recipient")
                        {
                            filename = invdata.InvoiceNo.ToUpper() + "_Duplicate.pdf";
                        }
                        totalamount = invdata.TotAmt.ToString();
                    }
                }
                if (payflag == 1)
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@paymentdetails", paymentdata);
                    strinvoicetemplate = strinvoicetemplate.Replace("@bal", (string.Format(String.Format("{0:N2}", (Convert.ToInt32(totalamount) - tempbalance)))).ToString());
                }
                else
                {
                    strinvoicetemplate = strinvoicetemplate.Replace("@paymentdetails", "");
                    strinvoicetemplate = strinvoicetemplate.Replace("@bal", (string.Format(String.Format("{0:N2}", (Convert.ToInt32(totalamount) - tempbalance)))).ToString());
                }
                string filepath = filename;
                string folderPath = Server.MapPath("~/Documents/Invoice/html/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = footerhtml;
                var pdfBytes = htmlToPdf.GeneratePdf(strinvoicetemplate);
                filename = filename.Replace("/", "_");
                var pffth = Server.MapPath("~\\Documents\\Invoice\\html\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                CommomUtility obj1 = new CommomUtility();
                var list = db.usp_GetClinetDetail(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                string emailsubject = "myKase Notification-Invoice Shared by" + list.cfname;
                string emailbody = "";
                emailbody += "Dear Sir/Madam,<br/><br/>";
                emailbody += "Greetings from myKase!<br/><br/>";
                emailbody += "Please find attached the Invoice for below mentioned matter on behalf of " + list.cfname;
                emailbody += "<br/>Following are the details on the same:<br/><br/>";
                emailbody += "<strong>Matter Name:</strong> " + emailmatterrname;
                if (!String.IsNullOrEmpty(remarksemail))
                {
                    emailbody += "<br><br><strong>Remarks:</strong>&nbsp; " + remarksemail;
                }
                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", emailbody.ToString());
                obj1.SendEmail(fromemail, email, "", emailsubject, AssignmentSubmittedMailBody, pffth);
                try
                {
                    System.IO.File.Delete(pffth);
                }
                catch (Exception er)
                {
                }
                return "true";
            }
            catch (Exception er)
            {
                return er.Message.ToString();
            }
        }

        /// <summary>
        /// Print invoice list details based on invoice id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PrintInvoiceDetail()
        {
            var invoiceid = QueryAES.UrlDecode(Request.QueryString["token"]);
            if (invoiceid != "")
            {
                try
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                catch
                {
                }
            }
            ViewBag.firmid = LoggedInUser.FirmId;
            ViewBag.userid = LoggedInUser.UserId;
            var db = new LawPracticeEntities();
            var invoicetype = QueryAES.UrlDecode(Request.QueryString["invtype"]);
            ViewBag.invtype = "Original for Recipient";
            ViewBag.invoicetype = invoicetype;
            if (invoicetype == "o")
            {
                var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(invoiceid), invoicetype).Select(x => x.id).FirstOrDefault();
                if (versioninvid != null)
                {
                    invoiceid = versioninvid.ToString();
                }
            }
            else
            {
                var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(invoiceid), invoicetype).Where(x => x.RowNum == Convert.ToInt32(invoicetype)).Select(x => x.id).FirstOrDefault();
                if (versioninvid != null)
                {
                    invoiceid = versioninvid.ToString();
                }
            }
            ViewBag.invid = invoiceid;
            return View();
        }

        /// <summary>
        /// Get invoice details based on invoice id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult PaymentInvoice()
        {
            try
            {
                var invoiceid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.invid = invoiceid;
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                decimal paidamttemp = 0;
                decimal totamttemp = 0;
                var data = db.usp_TblInvoicesById(LoggedInUser.FirmId.ToString(), invoiceid).FirstOrDefault();
                if (data != null)
                {
                    ViewBag.invno = data.InvoiceNo;
                    ViewBag.totamt = data.TotAmt;
                    totamttemp = Convert.ToDecimal(data.TotAmt);
                }
                var payhistory = db.usp_TblInvoicePaymentsById(LoggedInUser.FirmId.ToString(), invoiceid).ToList();
                var datapay = db.usp_TblInvoiceClearedPaymentsById(LoggedInUser.FirmId.ToString(), invoiceid).Sum(z => z.Amount);
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
        /// <summary>
        /// Update invoice details based on invoice id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult EditInvoice()
        {
            try
            {
                var data = db.usp_linvoiceSettingsByFirmId(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    ViewBag.billaddress = data.inaddress;
                    ViewBag.state = data.state;
                    ViewBag.isdefault = data.isdefault;
                }
                var invoiceid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.invid = invoiceid;
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var paidamttemp = "";
                var totamttemp = "";
                var data1 = db.usp_TblInvoicesById(LoggedInUser.FirmId.ToString(), invoiceid).FirstOrDefault();
                if (data1 != null)
                {
                    ViewBag.invno = data1.InvoiceNo;
                    ViewBag.invdate = data1.invdate;
                    ViewBag.duedate = data1.duedate;
                    ViewBag.mobile = data1.mobile;
                    ViewBag.client = data1.clientid;
                    ViewBag.clientstate = data1.state;
                    ViewBag.address = data1.address;
                    ViewBag.sclientstate = data1.shipstate;
                    ViewBag.saddress = data1.shipaddress;
                    ViewBag.billeraddress = data1.addressid;
                    ViewBag.igst = data1.IGST;
                    ViewBag.cgst = data1.CGST;
                    ViewBag.sgst = data1.SGST;
                    ViewBag.igstper = data1.IGSTPer;
                    ViewBag.sgstper = data1.SGSTPer;
                    ViewBag.cgstper = data1.CGSTPer;
                    ViewBag.subtotal = data1.SubTotal;
                    ViewBag.totamt = data1.TotAmt;
                    ViewBag.istax = data1.isinvoicetax;
                    ViewBag.UserNameInvoice = data1.UserNameInvoice;
                    ViewBag.InvoiceEmail = data1.InvoiceEmail;
                    ViewBag.matterid = data1.matterid;
                }
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

        /// <summary>
        /// Ammend invoice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AmendInvoice()
        {
            try
            {
                var data = db.usp_linvoiceSettingsByFirmId(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    ViewBag.billaddress = data.inaddress;
                    ViewBag.state = data.state;
                    ViewBag.isdefault = data.isdefault;
                }
                var invoiceid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.invid = invoiceid;
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var paidamttemp = "";
                var totamttemp = "";
                var data1 = db.usp_TblInvoicesById(LoggedInUser.FirmId.ToString(), invoiceid).FirstOrDefault();
                if (data1 != null)
                {
                    ViewBag.invno = data1.InvoiceNo;
                    ViewBag.invdate = data1.invdate;
                    ViewBag.duedate = data1.duedate;
                    ViewBag.mobile = data1.mobile;
                    ViewBag.client = data1.clientid;
                    ViewBag.clientstate = data1.state;
                    ViewBag.address = data1.address;
                    ViewBag.sclientstate = data1.shipstate;
                    ViewBag.saddress = data1.shipaddress;
                    ViewBag.billeraddress = data1.addressid;
                    ViewBag.igst = data1.IGST;
                    ViewBag.cgst = data1.CGST;
                    ViewBag.sgst = data1.SGST;
                    ViewBag.igstper = data1.IGSTPer;
                    ViewBag.sgstper = data1.SGSTPer;
                    ViewBag.cgstper = data1.CGSTPer;
                    ViewBag.subtotal = data1.SubTotal;
                    ViewBag.totamt = data1.TotAmt;
                    ViewBag.istax = data1.isinvoicetax;
                    ViewBag.UserNameInvoice = data1.UserNameInvoice;
                    ViewBag.InvoiceEmail = data1.InvoiceEmail;
                    ViewBag.matterid = data1.matterid;
                    ViewBag.ClientGSTNo = data1.ClientGSTNo;
                    ViewBag.ClientPanNo = data1.ClientPanNo;
                    ViewBag.subject = data1.ISubject;
                    ViewBag.Reference = data1.IReference;
                }
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
        /// <summary>
        /// Create new invoice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult NewInvoice()
        {
            try
            {
                var data = db.usp_linvoiceSettingsByFirmId(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    ViewBag.billaddress = data.inaddress;
                    ViewBag.state = data.state;
                    ViewBag.isdefault = data.isdefault;
                }
                var invoiceid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.invid = invoiceid;
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var paidamttemp = "";
                var totamttemp = "";
                var data1 = db.usp_TblInvoicesById(LoggedInUser.FirmId.ToString(), invoiceid).FirstOrDefault();
                if (data1 != null)
                {
                    ViewBag.invno = data1.InvoiceNo;
                    ViewBag.invdate = data1.invdate;
                    ViewBag.duedate = data1.duedate;
                    ViewBag.mobile = data1.mobile;
                    ViewBag.client = data1.clientid;
                    ViewBag.clientstate = data1.state;
                    ViewBag.address = data1.address;
                    ViewBag.sclientstate = data1.shipstate;
                    ViewBag.saddress = data1.shipaddress;
                    ViewBag.billeraddress = data1.addressid;
                    ViewBag.igst = data1.IGST;
                    ViewBag.cgst = data1.CGST;
                    ViewBag.sgst = data1.SGST;
                    ViewBag.igstper = data1.IGSTPer;
                    ViewBag.sgstper = data1.SGSTPer;
                    ViewBag.cgstper = data1.CGSTPer;
                    ViewBag.subtotal = data1.SubTotal;
                    ViewBag.totamt = data1.TotAmt;
                    ViewBag.istax = data1.isinvoicetax;
                    ViewBag.UserNameInvoice = data1.UserNameInvoice;
                    ViewBag.InvoiceEmail = data1.InvoiceEmail;
                    ViewBag.matterid = data1.matterid;
                    ViewBag.ClientGSTNo = data1.ClientGSTNo;
                    ViewBag.ClientPanNo = data1.ClientPanNo;
                    ViewBag.subject = data1.ISubject;
                    ViewBag.Reference = data1.IReference;
                }
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