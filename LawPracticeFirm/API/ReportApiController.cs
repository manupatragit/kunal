using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class ReportApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "ReportApiController";
        
        /// <summary>
        /// Search case details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchCaseDetail()
        {
            try
            {
                List<usp_SearchConflictDetail_Result> list = new List<usp_SearchConflictDetail_Result>();
                var searchtext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchdata"]);
                var ClientName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientName"]);
                var CaseName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseName"]);
              //  var CaseNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNumber"]);
                var Plaintiff = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Plaintiff"]);
                var Defendant = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Defendant"]);
                //   var OppositePartyCounsel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounsel"]);
                //   var OtherCoparties = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherCoparties"]);
                //  var Partners = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Partners"]);
                var Comapany = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companysrch"]);
                var otherpartysrch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartysrch"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var pno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var psize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);

                if (CaseName == "undefined" || CaseName == null || CaseName == "null")
                {
                    CaseName = "";
                }
                if (ClientName == "undefined" || ClientName == null || ClientName == "null")
                {
                    ClientName = "";
                }
                if (Plaintiff == "undefined" || Plaintiff == null || Plaintiff == "null")
                {
                    Plaintiff = "";
                }
                if (Defendant == "undefined" || Defendant == null || Defendant == "null")
                {
                    Defendant = "";
                }
                if (Comapany == "undefined" || Comapany == null || Comapany == "null")
                {
                    Comapany = "";
                }
                if (otherpartysrch == "undefined" || otherpartysrch == null || otherpartysrch == "null")
                {
                    otherpartysrch = "";
                }
                LawPracticeEntities db = new LawPracticeEntities();
               // var searchtype = ClientName + ","+CaseName + "," + CaseNumber + "," + OppositePartyCounsel+","+ Plaintiff+","+ Defendant;
                var searchtype = ClientName + "," + CaseName + "," + Comapany + "," + otherpartysrch + "," + Plaintiff + "," + Defendant;
                if (searchtype.IndexOf('2') > -1 || searchtype.IndexOf('4') > -1  || searchtype.IndexOf('6') > -1 || searchtype.IndexOf('5') > -1 || searchtype.IndexOf('9') > -1 || searchtype.IndexOf('1') > -1)
                {
                    list = db.usp_SearchConflictDetail(searchtext, searchtype, firmid, Convert.ToInt32(pno), Convert.ToInt32(psize)).ToList();
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Search Conflict Detail Plaintiff
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchConflictDetailPlaintiff()
        {
            try
            {
                List<usp_SearchConflictDetailPlaintiff_Result> list = new List<usp_SearchConflictDetailPlaintiff_Result>();
                // dynamic list = (dynamic)null;
                var searchtext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchdata"]);
                var ClientName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientName"]);
                var CaseName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseName"]);
                var CaseNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNumber"]);
                var Plaintiff = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Plaintiff"]);
                var Defendant = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Defendant"]);
                var OppositePartyCounsel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounsel"]);
                var OtherCoparties = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherCoparties"]);
                var Partners = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Partners"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var pno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var psize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                LawPracticeEntities db = new LawPracticeEntities();
                if (Plaintiff == "4")
                    list = db.usp_SearchConflictDetailPlaintiff(searchtext, Plaintiff, firmid, Convert.ToInt32(pno), Convert.ToInt32(psize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Search Conflict Detail Defendant
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchConflictDetailDefendant()
        {
            try
            {
                List<usp_SearchConflictDetailDefendant_Result> list = new List<usp_SearchConflictDetailDefendant_Result>();
                var searchtext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchdata"]);
                var ClientName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientName"]);
                var CaseName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseName"]);
                var CaseNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNumber"]);
                var Plaintiff = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Plaintiff"]);
                var Defendant = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Defendant"]);
                var OppositePartyCounsel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounsel"]);
                var OtherCoparties = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherCoparties"]);
                var Partners = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Partners"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var pno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var psize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                LawPracticeEntities db = new LawPracticeEntities();
                if (Defendant == "5")
                    list = db.usp_SearchConflictDetailDefendant(searchtext, Defendant, firmid, Convert.ToInt32(pno), Convert.ToInt32(psize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Search Conflict Detail Coparties
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchConflictDetailCoparties()
        {
            try
            {
                List<usp_SearchConflictDetailCoparties_Result> list = new List<usp_SearchConflictDetailCoparties_Result>();
                var searchtext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchdata"]);
                var ClientName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientName"]);
                var CaseName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseName"]);
                var CaseNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNumber"]);
                var Plaintiff = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Plaintiff"]);
                var Defendant = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Defendant"]);
                var OppositePartyCounsel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounsel"]);
                var OtherCoparties = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherCoparties"]);
                var Partners = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Partners"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var pno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var psize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                LawPracticeEntities db = new LawPracticeEntities();
                if (OtherCoparties == "7")
                    list = db.usp_SearchConflictDetailCoparties(searchtext, OtherCoparties, firmid, Convert.ToInt32(pno), Convert.ToInt32(psize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Search Conflict Detail By Client Partner
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchConflictDetailByClientPartner()
        {
            try
            {
                List<usp_SearchConflictDetailByClientPartner_Result> list = new List<usp_SearchConflictDetailByClientPartner_Result>();
                var searchtext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchdata"]);
                var ClientName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientName"]);
                var CaseName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseName"]);
                var CaseNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNumber"]);
                var Plaintiff = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Plaintiff"]);
                var Defendant = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Defendant"]);
                var OppositePartyCounsel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounsel"]);
                var OtherCoparties = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherCoparties"]);
                var Partners = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Partners"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var pno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var psize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                if (ClientName == "undefined" || ClientName == null || ClientName == "null")
                {
                    ClientName = "";
                }
                if (Partners == "undefined" || Partners == null || Partners == "null")
                {
                    Partners = "";
                }
                LawPracticeEntities db = new LawPracticeEntities();
                if (ClientName == "1" || Partners == "8")
                {
                    string searchtype = ClientName + "," + Partners;
                    list = db.usp_SearchConflictDetailByClientPartner(searchtext, searchtype, firmid, Convert.ToInt32(pno), Convert.ToInt32(psize)).ToList();
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Expense Created Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ExpenseCreatedReport()
        {
            int pagenumber = 1, pagesize = 10;
            try
            {
                string expensetye = "", category = "", createdby = "";
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", caseid = "", datefrom = "", dateto = "", loginid = "";
                clientid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenceClient"]));
                caseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenceCase"]));
                datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                pagenumber = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                loginid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]));
                expensetye = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["expensetype"]));
                category = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["category"]));
                createdby = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdfor"]));
                string txtRetainername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtRetainername"]));
                string txtdescriptionfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdescriptionfilter"]));
                string currencyfilter = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["currencyfilter"]));
                if (clientid == "null" || clientid == null || clientid == "undefined")
                { clientid = ""; }
                if (caseid == "null" || caseid == null || caseid == "undefined")
                { caseid = ""; }
                if (datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = ""; }
                if (dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = ""; }
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
                List<usp_GetExpenseReport_Result> list = new List<usp_GetExpenseReport_Result>();
                list = db.usp_GetExpenseReport(clientid, expensetye, category, caseid, datefrom, dateto, firmid, userid,
                    createdby, pagenumber, pagesize, loginid, pageid.ToString(), txtRetainername, txtdescriptionfilter, currencyfilter).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load Matter Report1
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadMatterReport1()
        {
            var db = new LawPracticeEntities();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var mattertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertype"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casetype"]);
                var subjecttype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttype"]);
                var datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                var IsAdded = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsAdded"]));
                int pageid = 0;
                int roleid = Convert.ToInt32(LoggedInUser.RoleId);
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = "01-01-1900"; }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = DateTime.Now.ToString(); }
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
                string a = "";
                if (IsAdded == "1")
                {
                    List<usp_GetUserNewCaseDetailAddedForReport_Result> list = new List<usp_GetUserNewCaseDetailAddedForReport_Result>();
                    list = db.usp_GetUserNewCaseDetailAddedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    a = JsonConvert.SerializeObject(list);
                }
                if (IsAdded == "0")  //ie: assigned matters
                {
                    List<usp_GetUserNewCaseDetailAssignedForReport_Result> list = new List<usp_GetUserNewCaseDetailAssignedForReport_Result>();
                    list = db.usp_GetUserNewCaseDetailAssignedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    a = JsonConvert.SerializeObject(list);
                }
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load Matter Report details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadMatterReport()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();             
                var mattertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertype"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casetype"]);
                var subjecttype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttype"]);
                var datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                var IsAdded = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsAdded"]));
                int roleid = Convert.ToInt32(LoggedInUser.RoleId);
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                {
                    datefrom = "01-01-1900";
                    datefrom = Convert.ToDateTime(datefrom).ToString("dd MMM yyyy");
                }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                {
                    dateto = DateTime.Now.ToString("dd MMM yyyy");
                }
                if (searchuser == "" || searchuser == "null" || searchuser == null || searchuser == "undefined")
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
                int pageid = 0;
                LawPracticeEntities db = new LawPracticeEntities();
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string a = "";
                if (LoggedInUser.RoleId == 1)
                {
                    if (IsAdded == "1")
                    {
                        if (searchuser == Guid.Empty.ToString())
                        {
                            var list = db.usp_GetMatterReport_Added(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                           casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                           datefrom, dateto, Guid.Parse(searchuser)).ToList();
                            a = JsonConvert.SerializeObject(list);
                        }
                        else
                        {
                            var list = db.usp_UserMatterReport_Added(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                           casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                           datefrom, dateto, Guid.Parse(searchuser)).ToList();
                            a = JsonConvert.SerializeObject(list);
                        }
                    }
                    else
                    {
                        if (searchuser == Guid.Empty.ToString())
                        {
                            var list = db.usp_GetMatterReport_Assigned(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                           casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                           datefrom, dateto, Guid.Parse(searchuser)).ToList();
                            a = JsonConvert.SerializeObject(list);
                        }
                        else
                        {
                            var list = db.usp_GetMatterReport_Assigned(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                           casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                           datefrom, dateto, Guid.Parse(searchuser)).ToList();
                            a = JsonConvert.SerializeObject(list);
                        }
                    }
                }
                else if (LoggedInUser.RoleId == 2)
                {
                    if (IsAdded == "1")
                    {
                        var list = db.usp_UserMatterReport_Added(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                             casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                             datefrom, dateto, Guid.Parse(searchuser)).ToList();
                        a = JsonConvert.SerializeObject(list);
                    }
                    else
                    {
                        var list = db.usp_GetMatterReport_Assigned(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate,
                          casename, clientname, court, cstatus, pageid, roleid, mattertype, casetype, subjecttype,
                          datefrom, dateto, Guid.Parse(searchuser)).ToList();
                        a = JsonConvert.SerializeObject(list);
                    }
                }
                else
                {
                    return Ok("");
                }
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Timer Entry Report details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadTimerEntryReport()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["case"]);
                var client = QueryAES.UrlDecode(HttpContext.Current.Request.Form["client"]);
                var tasktype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tasktype"]);
                var islog = QueryAES.UrlDecode(HttpContext.Current.Request.Form["islog"]);
                var datefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]);
                var dateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]);
                var user = QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]);
                var Type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Type"]);
                if (search == "null" || search == null || search == "undefined")
                { search =""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                else { search = casename; }
                if (client == "null" || client == null || client == "undefined")
                { client = ""; }
                if (tasktype == "null" || tasktype == null || tasktype == "undefined")
                { tasktype = ""; }
                if (islog == "null" || islog == null || islog == "undefined")
                { islog = "1"; }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = DateTime.Now.ToString("dd MMM yyyy"); }
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                {
                    datefrom = "01-01-1900";
                    datefrom= Convert.ToDateTime(datefrom).ToString("dd MMM yyyy");
                }
                if (user == "null" || user == null || user == "undefined")
                { user = ""; }
                if (Type == "null" || Type == null || Type == "undefined")
                { Type = ""; }
                LawPracticeEntities db = new LawPracticeEntities();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_GetTimeEntryReport_Loged_Result> list = new List<usp_GetTimeEntryReport_Loged_Result>();
                list = db.usp_GetTimeEntryReport_Loged(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0,
                    pageid,search,client,tasktype,islog,user,datefrom,dateto, Type).ToList();
                foreach (var data in list.ToList())
                {
                    usp_GetTimeEntryReport_Loged_Result newItem = new usp_GetTimeEntryReport_Loged_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                    if (data.tmatter != null)
                    {
                        newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                        list[list.IndexOf(data)].tmatter = newItem.tmatter;
                    }                    
                }
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Invoice Report details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoiceReport()
        {
            LawPracticeEntities db = new LawPracticeEntities();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var cnamefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnamefilter"]);
                var fromfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromfilter"]);
                var tofilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tofilter"]);
                var filterinvoietype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterinvoietype"]);
                var FilterInvoiceStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilterInvoiceStatus"]);
                //add for matterfield
                var materfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"].ToString());
                if (cnamefilter == "null" || cnamefilter == null || cnamefilter == "undefined")
                { cnamefilter = ""; }
                var amountfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["amountfilter"]);
                var filter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchflag"]);
                if (amountfilter == "null" || amountfilter == null || amountfilter == "undefined")
                { amountfilter = ""; }
                if (fromfilter == "" || fromfilter == "null" || fromfilter == null || fromfilter == "undefined")
                { fromfilter = Convert.ToDateTime("1900-01-01").ToString("dd MMM yyyy"); }
                if (tofilter == "" || tofilter == "null" || tofilter == null || tofilter == "undefined")
                { tofilter = DateTime.MaxValue.ToString("dd MMM yyyy"); }
                if (filter == "null" || filter == null || filter == "undefined")
                { filter = ""; }
                var list = db.usp_InvoiceReport(firmid.ToString(), userid.ToString(), Convert.ToInt32(LoggedInUser.RoleId),
                     cnamefilter, fromfilter, tofilter, amountfilter, pagenum, pagesize, materfilter, filterinvoietype, FilterInvoiceStatus).ToList();
                foreach (var data in list.ToList())
                {
                    usp_InvoiceReport_Result newItem = new usp_InvoiceReport_Result();
                    newItem.id = Convert.ToBase64String(QueryAES.EncryptAes(data.id.ToString()));
                    list[list.IndexOf(data)].id = newItem.id;
                }
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Personal Dashboard Case Task List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PersonalDashboardCaseTaskList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var datefilterfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefilterfrom"]);
                var datefilterto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefilterto"]);
                var filtertask = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertask"]);
                var filterclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterclient"]);
                var filteruser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteruser"]);
                var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
                var filteruserby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteruserby"]);
                var filteruserto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteruserto"]);
                var filterduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterduedate"]);
                var filtercasescheduler = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtercasescheduler"]);
                var filterscttime = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterscttime"]);
                var filterAcceptRejectBy = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAcceptRejectBy"]);
                if (datefilterfrom == "" || datefilterfrom == "null" || datefilterfrom == null || datefilterfrom == "undefined")
                { datefilterfrom = Convert.ToDateTime("1900-01-01").ToString("dd MMM yyyy"); }
                if (datefilterto == "" || datefilterto == "null" || datefilterto == null || datefilterto == "undefined")
                { datefilterto = DateTime.Now.AddYears(10).ToString("dd MMM yyyy"); }
                if (filtertask == "null" || filtertask == null || filtertask == "undefined")
                { filtertask = ""; }
                if (filterclient == "null" || filterclient == null || filterclient == "undefined")
                { filterclient = ""; }
                if (filteruser == "null" || filteruser == null || filteruser == "undefined")
                { filteruser = ""; }
                if (filterStatus == "null" || filterStatus == null || filterStatus == "undefined")
                { filterStatus = ""; }
                if (filteruserby == "null" || filteruserby == null || filteruserby == "undefined")
                { filteruserby = ""; }
                if (filteruserto == "null" || filteruserto == null || filteruserto == "undefined")
                { filteruserto = ""; }
                if (filterduedate == "null" || filterduedate == null || filterduedate == "undefined")
                { filterduedate = ""; }
                if (filtercasescheduler == "null" || filtercasescheduler == null || filtercasescheduler == "undefined")
                { filtercasescheduler = ""; }
                if (filterscttime == "null" || filterscttime == null || filterscttime == "undefined")
                { filterscttime = ""; }
                if (filterAcceptRejectBy == "null" || filterAcceptRejectBy == null || filterAcceptRejectBy == "undefined")
                { filterAcceptRejectBy = ""; }
                List<usp_PersonalDashboardTaskList_Result> list = new List<usp_PersonalDashboardTaskList_Result>();
                list = db.usp_PersonalDashboardTaskList(firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), datefilterfrom, datefilterto, filtertask, filterclient, filteruser, filteruserby, filteruserto, filterduedate, filterStatus, filtercasescheduler, filterscttime, filterAcceptRejectBy).ToList();
                foreach (var datas in list.ToList())
                {
                    usp_PersonalDashboardTaskList_Result newItem = new usp_PersonalDashboardTaskList_Result();
                    newItem.Tid = Convert.ToBase64String(QueryAES.EncryptAes(datas.Tid.ToString()));
                    list[list.IndexOf(datas)].Tid = newItem.Tid;
                    if (!string.IsNullOrEmpty(datas.AssignUser.ToString()))
                    {
                        if (datas.AssignUser.ToString().ToLower() == userid.ToString().ToLower())
                        {
                            list[list.IndexOf(datas)].AssignTo = "Me";
                        }
                    }
                    if (!string.IsNullOrEmpty(datas.UserId.ToString()))
                    {
                        if (datas.UserId.ToString().ToLower() == userid.ToString().ToLower())
                        {
                            list[list.IndexOf(datas)].AssignBy = "Me";
                        }
                    }
                    try
                    {
                        if (!string.IsNullOrEmpty(datas.ClientId.ToString()))
                        {
                            newItem.ClientId = Convert.ToBase64String(QueryAES.EncryptAes(datas.ClientId.ToString()));
                            list[list.IndexOf(datas)].ClientId = newItem.ClientId;
                        }
                    }
                    catch
                    {
                    }
                    try
                    {
                        if (!string.IsNullOrEmpty(datas.CaseId.ToString()))
                        {
                            newItem.CaseId = Convert.ToBase64String(QueryAES.EncryptAes(datas.CaseId.ToString()));
                            list[list.IndexOf(datas)].CaseId = newItem.CaseId;
                        }
                    }
                    catch
                    {
                    }
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// User Reports
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserReports()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var usertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertype"]);
                var designation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["designation"]);
                var branch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["branch"]);
                var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
                var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                var datefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]);
                var dateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]);
                if (search == "null" || search == null || search == "undefined")
                { search = ""; }
                if (usertype == "null" || usertype == null || usertype == "undefined")
                { usertype = ""; }
                if (designation == "null" || designation == null || designation == "undefined")
                { designation = ""; }
                if (branch == "null" || branch == null || branch == "undefined")
                { branch = ""; }
                if (department == "null" || department == null || department == "undefined")
                { department = ""; }
                if (status == "null" || status == null || status == "undefined")
                { status = ""; }
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = "01-01-1900"; }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = DateTime.Now.ToString(); }
                LawPracticeEntities db = new LawPracticeEntities();
                List<usp_GetUserReports_Result> list = new List<usp_GetUserReports_Result>();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("userlist")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                list = db.usp_GetUserReports(Guid.Parse(firmid), userid, pagenum, pagesize, 0, search, pageid,usertype,designation,branch,
                    department,status,datefrom,dateto).ToList();
                foreach (var data in list.ToList())
                {
                    GetSearchuserDetailsbyrowid_Result newItem = new GetSearchuserDetailsbyrowid_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                    list[list.IndexOf(data)].LoginId = newItem.LoginId;
                }
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Contacts Reports11
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ContactsReports11()
        {
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                var company = QueryAES.UrlDecode(HttpContext.Current.Request.Form["company"]);
                var datefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]);
                var dateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]);
                if (search == "null" || search == null || search == "undefined")
                { search = ""; }
                if (type == "null" || type == null || type == "undefined")
                { type = ""; }
                if (company == "null" || company == null || company == "undefined")
                { company = ""; }               
                if (status == "null" || status == null || status == "undefined")
                { status = ""; }
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = "01-01-1900"; }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = DateTime.Now.ToString(); }
                LawPracticeEntities db = new LawPracticeEntities();
                List<usp_ContactsReport_Result> list = new List<usp_ContactsReport_Result>();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                list = db.usp_ContactsReport(firmid, userid, pagenum, pagesize, 0, search, type,pageid, status,company,datefrom, dateto).ToList();
                foreach (var data in list.ToList())
                {
                    usp_ContactsReport_Result newItem = new usp_ContactsReport_Result();
                    newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                    list[list.IndexOf(data)].cid = newItem.cid;
                }
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get All Contacts Details Report1
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ContactsReports()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString(); 
                var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                var company = QueryAES.UrlDecode(HttpContext.Current.Request.Form["company"]);
                var datefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]);
                var dateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]);
                if (search == "null" || search == null || search == "undefined")
                { search = ""; }
                if (type == "null" || type == null || type == "undefined")
                { type = ""; }
                if (company == "null" || company == null || company == "undefined")
                { company = ""; }
                if (status == "null" || status == null || status == "undefined")
                { status = ""; }
                if (datefrom == "" || datefrom == "null" || datefrom == null || datefrom == "undefined")
                { datefrom = Convert.ToDateTime("01-01-1900").ToString("dd MMM yyyy"); }
                if (dateto == "" || dateto == "null" || dateto == null || dateto == "undefined")
                { dateto = DateTime.Now.ToString("dd MMM yyyy"); }
                LawPracticeEntities db = new LawPracticeEntities();
                var profiletype = "";
                var clientprofiletype = db.usp_getcontacttypebyname().FirstOrDefault();
                profiletype = clientprofiletype.ToString();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                if (type.ToString().ToUpper() == "ALL" || type.ToString().ToUpper() == "CLIENT")
                {
                    var list = db.usp_GetAllContactsDetailsReport1(firmid, userid, pagenum, pagesize, 0, search, profiletype, pageid, status, company, datefrom, dateto).ToList();
                    foreach (var data in list.ToList())
                    {
                        usp_GetAllContactsDetailsReport1_Result newItem = new usp_GetAllContactsDetailsReport1_Result();
                        newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                        list[list.IndexOf(data)].cid = newItem.cid;
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return Ok(a);
                }
                else
                {
                    var list = db.usp_GetNewContactsDetailsReport(firmid, userid, pagenum, pagesize, 0, search, type, pageid, status, company, datefrom, dateto).ToList();
                    foreach (var data in list.ToList())
                    {
                        usp_GetNewContactsDetailsReport_Result newItem = new usp_GetNewContactsDetailsReport_Result();
                        newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                        list[list.IndexOf(data)].cid = newItem.cid;
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return Ok(a);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
    }
}