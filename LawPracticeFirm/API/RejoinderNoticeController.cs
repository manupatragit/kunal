using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Common;
using LawPracticeFirm.Helpers;
using Newtonsoft.Json;
using NoticeManagement.Api;
using NoticeManagement.BusinessLayer.BusinessRepository;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class RejoinderNoticeController : BaseFirmApiController
    {
        private IRejoinderNotice noticerepo;
        public RejoinderNoticeController()
        {
            this.noticerepo = new RejoinderNoticeRepository(new LawPracticeEntities());
        }

        /// <summary>
        /// Add Rejoinder Notice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddRejoinderNotice()
        {
            dynamic result = null;
            dynamic postedFiledata = "";
            var myList = new List<string>();
            var httpRequest = HttpContext.Current.Request;
            string _FileName = "";
            string uniqfile = "";
            string _path1 = "";
            var firmid = LoggedInUser.FirmId.ToString();
            var IdloginUser = LoggedInUser.UserId.ToString();
            var parentId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
            var col1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col1"]);
            try { if (String.IsNullOrEmpty(col1) || col1 == "undefined" || col1 == "null") { col1 = ""; } } catch { }
            var col2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col2"]);
            try { if (String.IsNullOrEmpty(col2) || col2 == "undefined" || col2 == "null") { col2 = ""; } } catch { }
            var col3 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col3"]);
            try { if (String.IsNullOrEmpty(col3) || col3 == "undefined" || col3 == "null") { col3 = ""; } } catch { }
            var col4 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col4"]);
            try { if (String.IsNullOrEmpty(col4) || col4 == "undefined" || col4 == "null") { col4 = ""; } } catch { }
            var col5 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col5"]);
            try { if (String.IsNullOrEmpty(col5) || col5 == "undefined" || col5 == "null") { col5 = ""; } } catch { }
            var col6 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col6"]);
            try { if (String.IsNullOrEmpty(col6) || col6 == "undefined" || col6 == "null") { col6 = ""; } } catch { }
            var col7 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col7"]);
            try { if (String.IsNullOrEmpty(col7) || col7 == "undefined" || col7 == "null") { col7 = ""; } } catch { }
            var col8 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col8"]);
            try { if (String.IsNullOrEmpty(col8) || col8 == "undefined" || col8 == "null") { col8 = ""; } } catch { }
            var col9 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col9"]);
            try { if (String.IsNullOrEmpty(col9) || col9 == "undefined" || col9 == "null") { col9 = ""; } } catch { }
            var col10 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col10"]);
            try { if (String.IsNullOrEmpty(col10) || col10 == "undefined" || col10 == "null") { col10 = ""; } } catch { }
            var col11 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col11"]);
            try { if (String.IsNullOrEmpty(col11) || col11 == "undefined" || col11 == "null") { col11 = ""; } } catch { }
            var col12 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col12"]);
            try { if (String.IsNullOrEmpty(col12) || col12 == "undefined" || col12 == "null") { col12 = ""; } } catch { }
            var col13 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col13"]);
            try { if (String.IsNullOrEmpty(col13) || col13 == "undefined" || col13 == "null") { col13 = ""; } } catch { }
            var col14 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col14"]);
            try { if (String.IsNullOrEmpty(col14) || col14 == "undefined" || col14 == "null") { col14 = ""; } } catch { }
            var col15 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col15"]);
            try { if (String.IsNullOrEmpty(col15) || col15 == "undefined" || col15 == "null") { col15 = ""; } } catch { }
            var formtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["formtype"]);
            var filearray = myList.ToArray();
            postedFiledata = string.Join("/", filearray);
            try
            {
                var RejoinderNoti = new RejoinderNotice();
                RejoinderNoti.Noticeinitiatedby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["initiatedby"]);
                RejoinderNoti.postedFiledata = postedFiledata;
                RejoinderNoti.AddresseeAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressto"]);
                RejoinderNoti.CaseStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casestatus"]);
                RejoinderNoti.CreateRejoinder = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["CreateNotice"]);
                RejoinderNoti.CurrentStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcurrentstatus"]);
                var sendernameid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendernameid"]);
                var txtsendername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsendername"]);
                var txtsenderothervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderothervalue"]);
                var txtsenderaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderaddress"]);
                var txtotherdetailsrespondent = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsrespondent"]);
                var txttag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txttag"]);
                var txtCriticality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtCriticality"]);
                var txtreasonforhighpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreasonforhighpriority"]);
                var txtamountclaimed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtamountclaimed"]);
                var duedateofnoticed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["duedateofnoticed"]);
                if (txtamountclaimed == "")
                {
                    txtamountclaimed = "0";
                }
                RejoinderNoti.sendernameother = txtsenderothervalue;
                RejoinderNoti.SenderNameId = sendernameid;
                RejoinderNoti.SenderNametxt = txtsendername;
                RejoinderNoti.SenderAddress = txtsenderaddress;
                var createdateofrejoinder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofcreaterejoinder"]);
                var rejoinderSubjectName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtSubjectName"]);
                var Ntype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Ntype"]);
                if (string.IsNullOrEmpty(createdateofrejoinder))
                {
                    RejoinderNoti.DateofCreatingRejoinder = null;
                }
                else
                {
                    RejoinderNoti.DateofCreatingRejoinder = Convert.ToDateTime(createdateofrejoinder);
                }
                RejoinderNoti.OtherDetailsofSender = txtotherdetailsrespondent;
                RejoinderNoti.Tag = txttag;
                RejoinderNoti.Criticality = txtCriticality;
                RejoinderNoti.ResonForHighPriority = txtreasonforhighpriority;
                RejoinderNoti.Amountclaimed = txtamountclaimed;
                if (string.IsNullOrEmpty(duedateofnoticed))
                {
                    RejoinderNoti.duedatenotice = null;
                }
                else
                {
                    RejoinderNoti.duedatenotice = DateTime.Parse(duedateofnoticed);
                }
                var dateofdelivery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDateofDelivery"]);
                if (string.IsNullOrEmpty(dateofdelivery))
                {
                    RejoinderNoti.DateofDelivery = null;
                }
                else
                {
                    RejoinderNoti.DateofDelivery = DateTime.Parse(dateofdelivery);
                }
                var dateofreceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceipt"]);
                if (string.IsNullOrEmpty(dateofreceipt))
                {
                    RejoinderNoti.DateofReceipt = null;
                }
                else
                {
                    RejoinderNoti.DateofReceipt = Convert.ToDateTime(dateofreceipt);
                }
                var dateofrejoinder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofrejoinder"]);
                if (string.IsNullOrEmpty(dateofrejoinder))
                {
                    RejoinderNoti.DateofRejoinder = null;
                }
                else
                {
                    RejoinderNoti.DateofRejoinder = Convert.ToDateTime(dateofrejoinder);
                }
                var dateofreceivingreply = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceivingreply"]);
                if (string.IsNullOrEmpty(dateofreceivingreply))
                {
                    RejoinderNoti.DateofReceivingReply = null;
                }
                else
                {
                    RejoinderNoti.DateofReceivingReply = Convert.ToDateTime(dateofreceivingreply);
                }
                RejoinderNoti.FirmId = LoggedInUser.FirmId.ToString();
                var tatdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tatdate"]);
                if (string.IsNullOrEmpty(tatdate))
                {
                    RejoinderNoti.GenerationofAlerts = null;
                }
                else
                {
                    RejoinderNoti.GenerationofAlerts = Convert.ToDateTime(tatdate);
                }
                var dateofnotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofnotice"]);
                if (string.IsNullOrEmpty(dateofnotice))
                {
                    RejoinderNoti.DateofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofNotice = Convert.ToDateTime(dateofnotice);
                }
                var dateofdispatch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofdispatch"]);
                if (string.IsNullOrEmpty(dateofdispatch))
                {
                    RejoinderNoti.DateofDispatchofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofDispatchofNotice = Convert.ToDateTime(dateofdispatch);
                }
                var dateofservice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofServiceofNotice"]);
                if (string.IsNullOrEmpty(dateofservice))
                {
                    RejoinderNoti.DateofServiceofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofServiceofNotice = Convert.ToDateTime(dateofservice);
                }
                RejoinderNoti.ModeofReceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtmodeofReceipt"]);
                RejoinderNoti.NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                RejoinderNoti.UserId = LoggedInUser.UserId.ToString();
                RejoinderNoti.ModeofDeliveryofRejoinder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtModeofdeliveryrejoinder"]);
                RejoinderNoti.NoticeType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticetype"]);
                RejoinderNoti.Rejoinder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlrejoinder"]);
                RejoinderNoti.IsFileAvailable = Convert.ToBoolean(QueryAES.UrlDecode(HttpContext.Current.Request.Form["FileAvailable"]));
                RejoinderNoti.NoticeandReplyReference = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticereplyreference"]);
                RejoinderNoti.NoticeTitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoindertitle"]);
                RejoinderNoti.OtherDetailsofAddressee = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsofaddress"]);
                RejoinderNoti.RejoinderAddressedto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoindernoticeto"]);
                RejoinderNoti.AddresseeAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressto"]);
                RejoinderNoti.RejoinderSubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoindersub"]);
                RejoinderNoti.RejoinderThrough = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoinderthrough"]);
                RejoinderNoti.parentId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
                RejoinderNoti.rootNoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["rootNoticeId"]);
                RejoinderNoti.col1 = col1;
                RejoinderNoti.col2 = col2;
                RejoinderNoti.col3 = col3;
                RejoinderNoti.col4 = col4;
                RejoinderNoti.col5 = col5;
                RejoinderNoti.col6 = col6;
                RejoinderNoti.col7 = col8;
                RejoinderNoti.col9 = col9;
                RejoinderNoti.col10 = col10;
                RejoinderNoti.col11 = col11;
                RejoinderNoti.col12 = col12;
                RejoinderNoti.col13 = col13;
                RejoinderNoti.col14 = col14;
                RejoinderNoti.col15 = col15;
                RejoinderNoti.formtype = formtype;
                var NoticeThroughId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeThroughId"]);
                result = noticerepo.SaveRejoinderNotice(RejoinderNoti, NoticeThroughId, rejoinderSubjectName);
                //get main notice id
                var noticeid = "";
                var db = new LawPracticeEntities();
                if (!String.IsNullOrEmpty(RejoinderNoti.parentId)) //for create rejoinder
                {
                    var getoriginalnmoticeID = db.usp_GetNoticeByID(RejoinderNoti.parentId.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (getoriginalnmoticeID != null)
                    {
                        noticeid = getoriginalnmoticeID.ParentNoticeId;
                    }
                    else
                    {
                        var getoriginalnmoticeID1 = db.usp_GetNoticeReceiveReplyById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), RejoinderNoti.parentId).FirstOrDefault();
                        noticeid = getoriginalnmoticeID1.parentnoticeid;
                    }
                }
                else if (!String.IsNullOrEmpty(RejoinderNoti.NoticeID)) // for edit rejoinder
                {
                    var getreplyidforrejoind = db.usp_GetNoticeByID(RejoinderNoti.NoticeID.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (getreplyidforrejoind != null)
                    {
                        noticeid = getreplyidforrejoind.ParentNoticeId;
                    }
                }
                try
                {
                    if (result.status)
                    {
                        var noticedetails = db.usp_GetNoticeByID(RejoinderNoti.rootNoticeId, RejoinderNoti.FirmId.ToString()).FirstOrDefault();
                        if (!string.IsNullOrEmpty(result.output.ToString()))
                        {
                            if (Ntype == "UpdateReceived" || Ntype == "CreateReceived")
                            {
                                Ntype = "Received";
                            }
                            else
                            {
                                Ntype = "Sent";
                            }
                            //save to document management    
                            var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.output.ToString(), "RejoinderNotice", RejoinderNoti.NoticeTitle, result.output.ToString(), RejoinderNoti.SenderNameId, Ntype, "");
                        }
                        try
                        {
                            CustomizeFormApiController cutsomizeapi = new CustomizeFormApiController();
                            cutsomizeapi.fnSaveCustomizeFieldColMap(result.output.ToString(), RejoinderNoti.FirmId.ToString(), RejoinderNoti.UserId.ToString());
                        }
                        catch (Exception ex)
                        {
                            var exec = ex.Message;
                        }
                    }
                }
                catch { }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(result);
            }
        }


        /// <summary>
        /// Get Rejoinder notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult RejoinderNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
            var RejoinderInitiateBy = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RejoinderInitiateBy"]);
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var SenderNamesrch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SenderNamesrch"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);
            var noticeList = noticerepo.GetRejoinderNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
                                                                         RoleId, noticeid, RejoinderInitiateBy, notistatus, LoggedInUser.FirmId.ToString(), SenderNamesrch, Noticesubjectsrc, Noticetypesrc);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get rejoinder notice list by noticeid
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult RejoinderNoticeListbyNoticeId()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
            var noticeList = noticerepo.GetRejoinderNoticeListByNoticeId(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, NoticeId, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get rejoinder notice list for draft
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult DraftRejoinderNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var RejoinderInitiateBy = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RejoinderInitiateBy"]);
            var noticeList = noticerepo.GetDraftRejoinderNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, RejoinderInitiateBy, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
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
    }
}
