using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Common;
using LawPracticeFirm.Helpers;
using Newtonsoft.Json;
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
    public class ReplyToNoticeController : BaseFirmApiController
    {
        private IReplyToNotice noticerepo;
        public ReplyToNoticeController()
        {
            this.noticerepo = new ReplyToNoticeRepository(new LawPracticeEntities());
        }

        /// <summary>
        /// Add/Update reply to notice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddReplyToNotice()
        {
            string IdLoginUser = LoggedInUser.UserId.ToString();
            var IdFirm = LoggedInUser.FirmId.ToString();
            var parentId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
            dynamic postedFiledata = "";
            var myList = new List<string>();
            var httpRequest = HttpContext.Current.Request;
            string _FileName = "";
            string uniqfile = "";
            string _path1 = "";
            var filearray = myList.ToArray();
            postedFiledata = string.Join("/", filearray);
            try
            {
                var rootNoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["rootId"]);
                if (rootNoticeId != "" && rootNoticeId != null && rootNoticeId != "null")
                {
                    rootNoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["rootId"]);
                }
                else
                {
                    rootNoticeId = parentId;
                }
                var txtnoticethroughArray = "";
                var NoticeModeofdelevery = "";
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticethrough"])))
                {
                    txtnoticethroughArray = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticethrough"]);
                    txtnoticethroughArray = txtnoticethroughArray.Trim(',');
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtmodeofservice"])))
                {
                    NoticeModeofdelevery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtmodeofservice"]);
                    NoticeModeofdelevery = NoticeModeofdelevery.Trim(',');
                }
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
                var reptonotice = new ReplyToNotice();
                reptonotice.postedFiledata = postedFiledata;
                reptonotice.CreateReply = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["CreateNotice"]);
                reptonotice.AddresseeAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressaddress"]);
                reptonotice.CaseStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casestatus"]);
                reptonotice.CurrentStatus = "";
                var dateofdelivery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDateofDelivery"]);
                if (string.IsNullOrEmpty(dateofdelivery))
                {
                    reptonotice.DateofDelivery = null;
                }
                else
                {
                    reptonotice.DateofDelivery = Convert.ToDateTime(dateofdelivery);
                }
                var DateofReceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceipt"]);
                if (string.IsNullOrEmpty(DateofReceipt))
                {
                    reptonotice.DateofReceipt = null;
                }
                else
                {
                    reptonotice.DateofReceipt = Convert.ToDateTime(DateofReceipt);
                }
                var DateofReply = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreply"]);
                if (string.IsNullOrEmpty(DateofReply))
                {
                    reptonotice.DateofReply = null;
                }
                else
                {
                    reptonotice.DateofReply = Convert.ToDateTime(DateofReply);
                }
                var GenerationofAlerts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tatdate"]);
                if (string.IsNullOrEmpty(GenerationofAlerts))
                {
                    reptonotice.GenerationofAlerts = null;
                }
                else
                {
                    reptonotice.GenerationofAlerts = Convert.ToDateTime(GenerationofAlerts);
                }
                var sendernameId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendernameId"]);
                var txtsendername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsendername"]);
                var txtsenderaddresss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderaddresss"]);
                var txtCriticality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtCriticality"]);
                var txtreasonforhighpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreasonforhighpriority"]);
                var Duedateofnotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Duedateofnotice"]);
                var txtsenderothervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderothervalue"]);
                var txtamountclaimed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtamountclaimed"]);
                var txtotherdetailsofaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsofaddress"]);
                var replySubjectText=QueryAES.UrlDecode(HttpContext.Current.Request.Form["replySubjct"]);
                var txtrespondentname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrespondentname"]);
                var txtrespondentaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrespondentaddress"]);
                if (txtamountclaimed == "")
                {
                    txtamountclaimed = "0";
                }
                var txttag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txttag"]);
                var textroof = QueryAES.UrlDecode(HttpContext.Current.Request.Form["textroof"]);
                if (string.IsNullOrEmpty(Duedateofnotice))
                {
                    reptonotice.DueDateOfNotice = null;
                }
                else
                {
                    reptonotice.DueDateOfNotice = Convert.ToDateTime(Duedateofnotice);
                }
                reptonotice.SenderNameId = sendernameId;
                reptonotice.SenderName = txtsendername;
                reptonotice.Senderothertxt = txtsendername;
                reptonotice.SenderAddress = txtsenderaddresss;
                reptonotice.Criticality = txtCriticality;
                reptonotice.ResonForHighPriority = txtreasonforhighpriority;
                reptonotice.Senderothertxt = txtsenderothervalue;
                reptonotice.Amountclaimed = txtamountclaimed;
                reptonotice.RoOf = textroof;
                reptonotice.Tag = txttag;
                reptonotice.OtherDetailsofRespondent = txtotherdetailsofaddress;
                var txtnoticethroughArray1 = txtnoticethroughArray.Split(',');
                var modeofserviceArray1 = NoticeModeofdelevery.Split(',');
                reptonotice.IsFileAvailable = Convert.ToBoolean(QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsFileAvailable"]));
                reptonotice.ModeofServiceorDelivery = NoticeModeofdelevery;
                reptonotice.NoticeBroughtbyClientforReply = "";
                reptonotice.NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                reptonotice.NoticeReceivedbyClient = "";
                reptonotice.NoticeReference = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsrespondent"]);
                reptonotice.NoticeTitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticetitle"]);
                reptonotice.NoticeType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticetype"]);
                reptonotice.OtherDetailsofAddressee = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrespondentaddress"]);
                reptonotice.OtherDetailsofsender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsrespondent"]);
                reptonotice.ReplyAddressedto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplyaddress"]);
                reptonotice.ReplySubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplysubject"]);
                reptonotice.ReplyThrough = txtnoticethroughArray;
                 var ReplytoNoticeCreatedOn = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplytonoticecreatedon"]);
                if (string.IsNullOrEmpty(ReplytoNoticeCreatedOn))
                {
                    reptonotice.ReplytoNoticeCreatedOn = null;
                }
                else
                {
                    reptonotice.ReplytoNoticeCreatedOn = DateTime.Parse(ReplytoNoticeCreatedOn);
                }
                reptonotice.RespondentsAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrespondentaddress"]);
                reptonotice.RespondentsName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrespondentname"]);
                reptonotice.UserId = LoggedInUser.UserId.ToString();
                reptonotice.FirmId = LoggedInUser.FirmId.ToString();
                reptonotice.parentId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
                reptonotice.rootNoticeId = rootNoticeId;
                reptonotice.col1 = col1;
                reptonotice.col2 = col2;
                reptonotice.col3 = col3;
                reptonotice.col4 = col4;
                reptonotice.col5 = col5;
                reptonotice.col6 = col6;
                reptonotice.col7 = col8;
                reptonotice.col9 = col9;
                reptonotice.col10 = col10;
                reptonotice.col11 = col11;
                reptonotice.col12 = col12;
                reptonotice.col13 = col13;
                reptonotice.col14 = col14;
                reptonotice.col15 = col15;
                reptonotice.formtype = formtype;
                var result = noticerepo.SaveReplyToNotice(reptonotice, replySubjectText);
                //get main notice id
                var noticeid = "";
                var db = new LawPracticeEntities();
                if (!String.IsNullOrEmpty(reptonotice.parentId)) //for create rejoinder
                {
                    var getoriginalnmoticeID = db.usp_GetNoticeByID(reptonotice.parentId.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (getoriginalnmoticeID != null)
                    {
                        noticeid = getoriginalnmoticeID.ParentNoticeId;
                    }
                    else
                    {
                        var getoriginalnmoticeID1 = db.usp_GetNoticeReceiveReplyById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), reptonotice.parentId).FirstOrDefault();
                        noticeid = getoriginalnmoticeID1.parentnoticeid;
                    }
                }
                else if (!String.IsNullOrEmpty(reptonotice.NoticeID)) // for edit rejoinder
                {
                    var getreplyidforrejoind = db.usp_GetNoticeByID(reptonotice.NoticeID.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (getreplyidforrejoind != null)
                    {
                        noticeid = getreplyidforrejoind.ParentNoticeId;
                    }
                }
                try
                {
                    if (result.status)
                    {
                        if (!string.IsNullOrEmpty(result.output.ToString()))
                        {
                            //save to document management    
                            var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.output.ToString(), "ReplyToNotice", reptonotice.NoticeTitle, result.output.ToString(), reptonotice.SenderNameId, "Received", reptonotice.NoticeTitle);
                        }
                    }
                }
                catch { }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get reply to notice list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ReplyToNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var mainnoticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mainnoticeid"]);
            var noticeList = noticerepo.GetReplyToNoticeList(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, mainnoticeid);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get reply to notice list by notice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ReplyToNoticeListByNoticeId()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var parentId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["parentId"]);
            var noticeList = noticerepo.GetReplyToNoticeListByNoticeId(UserId, SearchValue, ColumName, SortedOrder, PageNumber,
                PageSize, RoleId, parentId);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get reply to notice list draft
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ReplyToNoticeDraftList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var noticeList = noticerepo.GetReplyToNoticeDraftList(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }
    }
}
