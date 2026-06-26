using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Helpers;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using NoticeManagement.BusinessLayer.BusinessEntity;
using NoticeManagement.BusinessLayer.BusinessRepository;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using NoticeManagement.Controllers;
using QueryStringEDAES;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace NoticeManagement.Api
{
    public class NoticeNewController : BaseFirmApiController
    {
        private INotice noticerepo;
        public NoticeNewController()
        {
            this.noticerepo = new NoticeRepository(new LawPracticeEntities());
        }
        /// <summary>
        /// Generate service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//CloudMyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Get notice status by firm id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public List<sp_GetNoticeStatusList_Result> NoticeStatusList()
        {
            List<sp_GetNoticeStatusList_Result> result = noticerepo.GetnoticestatusByFirmId(LoggedInUser.FirmId.ToString());
            return result;
        }
        /// <summary>
        /// Get notice status detail by firm id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public List<sp_GetNoticeStatusDetailList_Result> NoticeStatusDetailList()
        {
            List<sp_GetNoticeStatusDetailList_Result> result = noticerepo.GetnoticestatusDetailByFirmId(LoggedInUser.FirmId.ToString());
            return result;
        }
        /// <summary>
        /// Get Settled notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult SettledNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var noticeList = noticerepo.SettledNoticeList(UserId, SearchValue, ColumName, SortedOrder,
                PageNumber, PageSize, RoleId, notistatus);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Convert to case notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ConvertToCaseNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var noticeList = noticerepo.ConvertToCaseNoticeList(UserId, SearchValue, ColumName, SortedOrder,
                PageNumber, PageSize, RoleId, notistatus);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Add document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddDocument()
        {
            var result = new Message();
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hiddendocid"]);
                string LoginUserId = LoggedInUser.UserId.ToString();
                var FirmIdd = LoggedInUser.FirmId.ToString();
                var description = QueryAES.UrlDecode(HttpContext.Current.Request.Form["description"]);
                dynamic postedFiledata = "";
                var myList = new List<string>();
                var httpRequest = HttpContext.Current.Request;
                string _FileName = "";
                string uniqfile = "";
                string _path1 = "";
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/DocManagement/" + FirmIdd + "/" + LoginUserId + "/");
                    string folderpathazure = "Documents/DocManagement/" + FirmIdd + "/" + LoginUserId;
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        Random random = new Random();
                        var randomout = random.Next(1000, 9999);
                        var postedFile = httpRequest.Files[i];
                        var filePath = folderPath + randomout + postedFile.FileName;
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        myList.Add(randomout + postedFile.FileName);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                try
                {
                    result = noticerepo.AddDocument(hidden, FirmIdd, LoginUserId, postedFiledata, description);
                }
                catch (Exception ex)
                {
                    LogService(ex.Message);
                    result.status = false;
                    result.message = ex.Message;
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogService(ex.Message);
                result.status = false;
                result.message = ex.Message;
            }
            LogService("test 11");
            return Ok(result);
        }

        /// <summary>
        /// Add new notice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddNotice()
        {
            var result = new Message();
            var receiversemails = "";
            var receiversmobile = "";
            var secondaddress = "";
            var renameFolderName = "";
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                var noticeSubjectName = HttpContext.Current.Request.Form["ddlsubjectName"];
                string LoginUserId = LoggedInUser.UserId.ToString();
                string loggedInUserName= LoggedInUser.UserFullName.ToString();
                var FirmIdd = LoggedInUser.FirmId.ToString();
                var NoticeCreateddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeCreateddate"]);
                var txtsendername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsendername"]);
                var CreateNotice = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["CreateNotice"]);
                var noticetitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticetitle"]);
                var txtnoticesub = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticesub"]);
                var curstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["curstatus"]);
                var dateofddel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofddel"]);
                var txtotherdetailsofsender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsofsender"]);
                var txtotherdetailsofaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtotherdetailsofaddress"]);
                var txtdateofreceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceipt"]);
                var txtsenderaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderaddress"]);
                var txtaddressto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressto"]);
                var txtaddressee = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressee"]);
                var txtdateofnotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofnotice"]);
                var tatdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tatdate"]);
                var ddlnoticetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticetype"]);
                var casestatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casestatus"]);
                var FileUpload = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FileUpload"]);
                var txtCriticality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtCriticality"]);
                var txtamountclaimed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtamountclaimed"]);
                var textsonof = QueryAES.UrlDecode(HttpContext.Current.Request.Form["textsonof"]);
                var textroof = QueryAES.UrlDecode(HttpContext.Current.Request.Form["textroof"]);
                var txttag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txttag"]);
                var NoticeThroughId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeThroughId"]);
                var txtreasonforhighpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreasonforhighpriority"]);
                var txtsenderothervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderothervalue"]);
                var sendernameId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendernameId"]);
                //otherdetils of senders
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiveremailsarray"])))
                {
                    receiversemails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiveremailsarray"]);
                    receiversemails = receiversemails.Trim(',');
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiverphonesarray"])))
                {
                    receiversmobile = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiverphonesarray"]);
                    receiversmobile = receiversmobile.Trim(',');
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["SecondAddressarray"])))
                {
                    secondaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SecondAddressarray"]);
                    secondaddress = secondaddress.Trim(',');
                }
                var Receiverrowcountdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiverrowcountdata"]);
                var receiversemails1 = receiversemails.Split(',');
                var receiversmobile1 = receiversmobile.Split(',');
                var secondaddress1 = secondaddress.Split(',');
                var useremailss = "";
                var usesmobile = "";
                var usersecondaddress = "";
                if (txtamountclaimed == "")
                {
                    txtamountclaimed = "0";
                }
                var NoticeThroughIdArray = "";
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
                var SubectId = "";
                var Duedateofnotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Duedateofnotice"]);
                var Referncenumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Referncenumber"]);
                var IntReferncenuber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IntReferncenuber"]);
                int ftype = Convert.ToInt32(Request.Headers.GetValues("ftype").FirstOrDefault());
                int sum = Convert.ToInt32(Request.Headers.GetValues("sum").FirstOrDefault());
                var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1").FirstOrDefault());
                var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2").FirstOrDefault());
                var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3").FirstOrDefault());
                var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4").FirstOrDefault());
                var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5").FirstOrDefault());
                var ctxt6 = Convert.ToString(Request.Headers.GetValues("ctxt6").FirstOrDefault());
                var ctxt7 = Convert.ToString(Request.Headers.GetValues("ctxt7").FirstOrDefault());
                var ctxt8 = Convert.ToString(Request.Headers.GetValues("ctxt8").FirstOrDefault());
                var ctxt9 = Convert.ToString(Request.Headers.GetValues("ctxt9").FirstOrDefault());
                var ctxt10 = Convert.ToString(Request.Headers.GetValues("ctxt10").FirstOrDefault());
                var ctxt11 = Convert.ToString(Request.Headers.GetValues("ctxt11").FirstOrDefault());
                var ctxt12 = Convert.ToString(Request.Headers.GetValues("ctxt12").FirstOrDefault());
                var ctxt13 = Convert.ToString(Request.Headers.GetValues("ctxt13").FirstOrDefault());
                var ctxt14 = Convert.ToString(Request.Headers.GetValues("ctxt14").FirstOrDefault());
                var ctxt15 = Convert.ToString(Request.Headers.GetValues("ctxt15").FirstOrDefault());
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
                bool IsFileAvail = false;
                if (FileUpload != null)
                {
                    IsFileAvail = true;
                }
                var db = new LawPracticeEntities();
                var chknotice = db.usp_CheckNoticeTitleExist(LoggedInUser.FirmId.ToString(), noticetitle.TrimEnd().TrimStart(), hidden, LoggedInUser.UserId.ToString(), "Notice", sendernameId, txtsenderothervalue.Trim()).FirstOrDefault();
                if (chknotice == 1)
                {
                    return Ok("Already exist title name. please try another title name");
                }
                var chknotice1 = db.usp_CheckNoticeTitleExist(LoggedInUser.FirmId.ToString(), noticetitle.TrimEnd().TrimStart(), hidden, LoggedInUser.UserId.ToString(), "BulkNotice", sendernameId, "").FirstOrDefault();
                if (chknotice1 == 1)
                {
                    return Ok("Already exist title name. please try another title name");
                }
                dynamic postedFiledata = "";
                dynamic postedFiledata1 = "";
                var myList = new List<string>();
                var myList1 = new List<string>();
                var httpRequest = HttpContext.Current.Request;
                var noti = new Notice();
                var usermodeofservice = "";
                if (txtnoticethroughArray == "null")
                {
                    txtnoticethroughArray = "";
                }
                string[] txtnoticethroughArray1 = null;
                if (!String.IsNullOrEmpty(txtnoticethroughArray))
                {
                    txtnoticethroughArray1 = txtnoticethroughArray.Split(',');
                }
                if (NoticeModeofdelevery == "null")
                {
                    NoticeModeofdelevery = "";
                }
                string[] modeofserviceArray1 = null;
                if (!String.IsNullOrEmpty(NoticeModeofdelevery))
                {
                    modeofserviceArray1 = NoticeModeofdelevery.Split(',');
                }
                var Moduletype = "CreateNotice";
                noti.NoticeThroughId = NoticeThroughId;
                noti.Criticality = txtCriticality;
                noti.Amountclaimed = txtamountclaimed;
                noti.postedFiledata = postedFiledata;
                noti.PostedFiledocmodule = postedFiledata1;
                noti.AddressedTo = txtaddressto;
                noti.AddresseeAddress = txtaddressee;
                noti.CaseStatus = casestatus;
                noti.CreateNotice = CreateNotice;
                noti.CurrentStatus = curstatus;
                noti.SonOf = textsonof;
                noti.RoOf = textroof;
                noti.Tag = txttag;
                noti.NoticeThroughId = "";
                noti.SubectId = SubectId;
                noti.col1 = col1;
                noti.col2 = col2;
                noti.col3 = col3;
                noti.col4 = col4;
                noti.col5 = col5;
                noti.col6 = col6;
                noti.col7 = col8;
                noti.col9 = col9;
                noti.col10 = col10;
                noti.col11 = col11;
                noti.col12 = col12;
                noti.col13 = col13;
                noti.col14 = col14;
                noti.col15 = col15;
                noti.formtype = formtype;
                noti.ctxt1 = ctxt1;
                noti.ctxt2 = ctxt2;
                noti.ctxt3 = ctxt3;
                noti.ctxt4 = ctxt4;
                noti.ctxt5 = ctxt5;
                noti.ctxt6 = ctxt6;
                noti.ctxt7 = ctxt7;
                noti.ctxt8 = ctxt8;
                noti.ctxt9 = ctxt9;
                noti.ctxt10 = ctxt10;
                noti.ctxt11 = ctxt11;
                noti.ctxt12 = ctxt12;
                noti.ctxt13 = ctxt13;
                noti.ctxt14 = ctxt14;
                noti.ctxt15 = ctxt15;
                noti.ftype = ftype;
                noti.sum = sum;
                noti.ReferenceNumber = Referncenumber;
                noti.IntReferenceNumber = IntReferncenuber;
                if (!string.IsNullOrEmpty(dateofddel) && dateofddel != "undefined")
                {
                    noti.DateofDelivery = Convert.ToDateTime(dateofddel);
                }
                else { noti.DateofDelivery = null; }
                if (!string.IsNullOrEmpty(txtdateofnotice) && txtdateofnotice != "undefined")
                {
                    noti.DateofNotice = Convert.ToDateTime(txtdateofnotice);
                }
                else { noti.DateofNotice = null; }
                if (!string.IsNullOrEmpty(txtdateofreceipt) && txtdateofreceipt != "undefined")
                {
                    noti.DateofReceipt = Convert.ToDateTime(txtdateofreceipt);
                }
                else { noti.DateofReceipt = null; }
                noti.FirmId = FirmIdd;
                if (!string.IsNullOrEmpty(tatdate) && tatdate != "undefined")
                {
                    noti.GenerationofAlerts = Convert.ToDateTime(tatdate);
                }
                else { noti.GenerationofAlerts = null; }
                if (!string.IsNullOrEmpty(Duedateofnotice) && Duedateofnotice != "undefined")
                {
                    noti.DueDateOfNotice = Convert.ToDateTime(Duedateofnotice);
                }
                else { noti.DueDateOfNotice = null; }
                noti.IsFileAvailable = IsFileAvail;
                noti.ModeofServiceorDelivery = "";
                noti.NoticeID = hidden;
                noti.NoticeSubject = txtnoticesub;
                noti.NoticeThrough = "";
                noti.NoticeThroughId = "";
                noti.NoticeTitle = noticetitle;
                noti.NoticeType = ddlnoticetype;
                noti.OtherDetailsofAddressee = txtotherdetailsofaddress;
                noti.OtherDetailsofSender = txtotherdetailsofsender;
                noti.SendersAddress = txtsenderaddress;
                noti.SendersName = txtsendername;
                noti.UserId = LoginUserId;
                noti.ResonForHighPriority = txtreasonforhighpriority;
                noti.NoticeCreatedOn = DateTime.Now;
                noti.Senderothertxt = txtsenderothervalue;
                noti.SenderNameId = sendernameId;
                //================Code Added by Chandani
                noti.NoticeThrough = txtnoticethroughArray;
                try
                {
                    result = noticerepo.savenotice(noti);
                    // save Mode of delevery on multiple row
                    if (modeofserviceArray1 != null)
                    {
                        if (modeofserviceArray1.Length > 0)
                        {
                            if (noti.NoticeID != "")
                            {
                                var DispatchDetail = noticerepo.DeleteDispatchDetail(noti.NoticeID, LoggedInUser.FirmId.ToString());
                            }
                            for (int m = 0; m < modeofserviceArray1.Length; m++)
                            {
                                usermodeofservice = modeofserviceArray1[m];
                                noti.ModeofServiceorDelivery = usermodeofservice;
                                var detilsmodeofdelevery = noticerepo.SavenoticeDetilsForModeOfDelevery(noti, result.output.ToString(), Moduletype, null, null);
                            }
                        }
                    }
                    //Add multiple recivers informations
                    if (String.IsNullOrEmpty(Receiverrowcountdata))
                    {
                        Receiverrowcountdata = "0";
                    }
                    int receivercount = Convert.ToInt32(Receiverrowcountdata) + 1;
                    var finalreceivercount = receivercount;
                    for (int i = 0; i < finalreceivercount; i++)
                    {
                        useremailss = "";
                        usesmobile = "";
                        usersecondaddress = "";
                        if (receiversemails != "")
                        {
                            useremailss = receiversemails1[i];
                        }
                        if (receiversmobile != "")
                        {
                            usesmobile = receiversmobile1[i];
                        }
                        if (secondaddress != "")
                        {
                            usersecondaddress = secondaddress1[i];
                        }
                        //start logic to save receiver informations
                        var receiveddetails = noticerepo.SaveOtherDetailsOfReceiver(result.output.ToString(), hidden, useremailss, usesmobile, usersecondaddress);
                        //End
                    }
                    try
                    {
                        if (result.status)
                        {
                            if (!string.IsNullOrEmpty(noti.NoticeID))
                            {
                                renameFolderName = noticetitle;
                                //save to document management    
                                var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), noti.NoticeID, "CreateNotice", null, null, sendernameId, "Sent", renameFolderName);
                            }
                            else if (!string.IsNullOrEmpty(result.output.ToString()))
                            {
                                //save to document management    
                                var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.output.ToString(), "CreateNotice", noticetitle, null, sendernameId, "Sent", "");
                            }
                        }
                    }
                    catch { }

                    //Send mail
                    try
                    {
                        var response = DataAccessADO.Usp_GetFirmAdminDetail(FirmIdd);
                        var firmAdminName = response.Rows[0].ItemArray[0].ToString();
                        var firmAdminEmail = response.Rows[0].ItemArray[1].ToString();
                        if (!string.IsNullOrEmpty(firmAdminEmail))
                        {
                            if (noti.NoticeID == "")
                            {
                                ReceivedNoticeSendMail(firmAdminName, firmAdminEmail, loggedInUserName, noti.SendersName, noti.AddressedTo,
                                                       noti.DateofNotice, noti.NoticeTitle, noticeSubjectName, noti.DueDateOfNotice,
                                                       FirmIdd, LoginUserId, "Added new Notice from Sent");
                            }
                        }
                    }
                    catch { }

                }
                catch (Exception ex)
                {
                    LogService(ex.Message);
                    result.status = false;
                    result.message = ex.Message;
                }
                //  }
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogService(ex.Message);
                result.status = false;
                result.message = ex.Message;
            }
            LogService("test 11");
            return Ok(result);
        }

        /// <summary>
        /// Send received notice added alert
        /// </summary>
        /// <param name="firmAdminName"></param>
        /// <param name="email"></param>
        /// <param name="loggedInUserName"></param>
        /// <param name="sendername"></param>
        /// <param name="receiverName"></param>
        /// <param name="DateOfNotice"></param>
        /// <param name="noticeTitle"></param>
        /// <param name="noticeSubject"></param>
        /// <param name="NoticeDueDate"></param>
        /// <returns></returns>
        public string ReceivedNoticeSendMail(string firmAdminName, string email, string loggedInUserName, string sendername, string receiverName, DateTime? DateOfNotice, string noticeTitle, string noticeSubject, DateTime? NoticeDueDate, string firmid, string IdloginUser, string NoticeFrom)
        {
            var db = new LawPracticeEntities();
            string message = "";
            string subjectline = "New Notice Added";
            string DateOfNotice1 = DateOfNotice?.ToString("dd-MMM-yyyy") ?? "";
            string NoticeDueDate1 = NoticeDueDate?.ToString("dd-MMM-yyyy") ?? "";

            message = WebConfigurationManager.AppSettings["SendReceivedNoticeTemplate"].ToString();
            message = message.Replace("#UserName#", firmAdminName);
            message = message.Replace("#CreatedUserName#", loggedInUserName);
            message = message.Replace("#SenderName#", sendername);
            message = message.Replace("#ReceiverName#", receiverName);
            message = message.Replace("#DateOfNotice#", DateOfNotice1);
            message = message.Replace("#TitleOfNotice#", noticeTitle);
            message = message.Replace("#SubjectOfNotice#", noticeSubject);
            message = message.Replace("#DueDateOfNotice#", NoticeDueDate1);

            string mailStatus = "failed";
            string server = null;
            string port = null;
            server = WebConfigurationManager.AppSettings["EmailSMTP"].ToString();
            port = WebConfigurationManager.AppSettings["EmailPort"].ToString();
            string To = email;
            string EmailId = WebConfigurationManager.AppSettings["SendMailFrom"].ToString(); ;
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
                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                    smtp.Host = mailHost;
                    smtp.EnableSsl = isSSLMail;
                    System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential(regMailFromUserName, regMailFromPassword);
                    smtp.UseDefaultCredentials = useDefaultMailCredentials;
                    smtp.Credentials = NetworkCred;
                    smtp.Port = smtpPort;
                    smtp.Send(mm);
                    mailStatus = "Sent";
                    DataAccessADO.Usp_SaveNewNoticeLogDetail(firmid, IdloginUser, noticeTitle, noticeSubject, email, mailStatus, NoticeFrom);

                }
            }
            catch
            {
                mailStatus = "OnFailure";
                DataAccessADO.Usp_SaveNewNoticeLogDetail(firmid, IdloginUser, noticeTitle, noticeSubject, email, mailStatus, NoticeFrom);
            }
            return mailStatus;
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
        /// View more details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public Message ViewMore()
        {
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var param = QueryAES.UrlDecode(HttpContext.Current.Request.Form["param"]);
            var result = noticerepo.viewnotice(Id, param, LoggedInUser.FirmId.ToString());
            return result;
        }

        /// <summary>
        /// View More Set Alert
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public Message ViewMoreSetAlert()
        {
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var param = QueryAES.UrlDecode(HttpContext.Current.Request.Form["param"]);
            var result = noticerepo.ViewMoreSetAlert(Id, param, LoggedInUser.FirmId.ToString());
            return result;
        }

        /// <summary>
        /// View notice log
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult ViewNoticeLog()
        {
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var Usertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Usertype"]);
            //var result = noticerepo.viewnoticelog(Id, Usertype);
            var result = noticerepo.viewnoticelogNew(Id, LoggedInUser.FirmId.ToString(), Usertype);
            return Ok(result);
        }

        /// <summary>
        /// Delete notice
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public bool NoticeDelete()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var deleteflag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["deleteflag"]);
            bool result = noticerepo.DeleteNotice(NoticeID, deleteflag);
            return result;
        }

        /// <summary>
        /// Notice subject list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public List<sp_getNoticeSubjectList_Result> NoticeSubjectList()
        {
            List<sp_getNoticeSubjectList_Result> result = noticerepo.Getnoticesubjectforddl();
            return result;
        }

        /// <summary>
        /// Get notice detail by notice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeById()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeID"]);
            var result = noticerepo.GetNoticeDetailByID(NoticeID, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(result);
            return Ok(a);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public List<usp_GetNoticeByID_Result> NoticeByIdList()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeID"]);
            var LoginUserId = LoggedInUser.UserId.ToString();
            List<usp_GetNoticeByID_Result> result = noticerepo.GetNoticeDetailListByID(NoticeID, LoginUserId, LoggedInUser.FirmId.ToString());
            return result;
        }

        /// <summary>
        /// Get notice list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var firmid = LoggedInUser.FirmId.ToString();
            var NoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var NoitceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
            var sendernamesrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendername"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetitlesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetitlesrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);
            var CaseNoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNoticeStatus"]);
            var IsArchived = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsArchived"]);
            //var noticeList = noticerepo.GetNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
            //                                        RoleId, NoticeStatus, fromdaterange, startdate, enddate, fromreminder, NoitceId, sendernamesrh, Noticesubjectsrc, Noticetitlesrc, Noticetypesrc, CaseNoticeStatus, IsArchived);
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            var trialList_1 = DataAccessADO.GetNoticeSentListRecord(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,RoleId, NoticeStatus, fromdaterange, startdate, 
                enddate, fromreminder, NoitceId, sendernamesrh, Noticesubjectsrc, Noticetitlesrc, Noticetypesrc, CaseNoticeStatus, IsArchived,firmid);

            var a = JsonConvert.SerializeObject(trialList_1);
            return Ok(a);
        }

        /// <summary>
        /// Get draft notice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DraftList()
        {
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var arraylist = new ArrayList();
            var noticeList = noticerepo.Getdraftednoticeitem(NoticeId);
            var auditmail = noticerepo.Getmailaudit(NoticeId);
            var receiveremaillist = noticerepo.GetReceiverEmailsByNoticeId(NoticeId);
            arraylist.Add(noticeList);
            arraylist.Add(auditmail);
            arraylist.Add(receiveremaillist);
            return Ok(arraylist);
        }

        /// <summary>
        /// Reminder notice list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ReminderNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var sortvalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sortvalue"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.FirmId.ToString();
            List<usp_GetReminderNoticeList_Result> noticeList = new List<usp_GetReminderNoticeList_Result>();
            noticeList = noticerepo.GetReminderNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
                                                  RoleId, LoggedInUser.FirmId.ToString());
            try
            {
                if (!String.IsNullOrEmpty(sortvalue))
                {
                    if (sortvalue == "asc")
                    {
                        noticeList = noticeList.OrderBy(x => x.ReminderDate).ToList();
                    }
                    else if (sortvalue == "desc")
                    {
                        noticeList = noticeList.OrderByDescending(x => x.ReminderDate).ToList();
                    }
                }
            }
            catch
            {
            }
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Remove reminder details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool RemoveReminder()
        {
            var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            bool output = noticerepo.RemoveReminder(noticeid);
            return output;
        }

        /// <summary>
        /// Notice filter list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeListFilter()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString(); ;
            var param = QueryAES.UrlDecode(HttpContext.Current.Request.Form["param"]);
            var paramid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramid"]);
            var NoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var sendernamesrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendername"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetitlesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetitlesrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);
            var noticeList = noticerepo.GetNoticeListFilter(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
                                                  RoleId, param, paramid, LoggedInUser.FirmId.ToString(), NoticeStatus, sendernamesrh, Noticesubjectsrc, Noticetitlesrc, Noticetypesrc);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get archive notice list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ArchiveNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var noticeList = noticerepo.GetArchiveNotice(UserId, SearchValue, ColumName, SortedOrder,
                PageNumber, PageSize, RoleId, notistatus, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get notice closure details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool NoticeClosure()
        {
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["closurenoticeid"]);
            var UserId = LoggedInUser.UserId.ToString();
            DateTime closuredate;
            if (HttpContext.Current.Request.Form["closuredate"] != "")
            {
                closuredate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["closuredate"]));
            }
            else
            {
                closuredate = Convert.ToDateTime("01-01-1900");
            }
            var ddlnoticestatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticestatus"]);
            var frombulkupload = QueryAES.UrlDecode(HttpContext.Current.Request.Form["frombulkupload"]);
            var noticeList = noticerepo.NoticeClosure(UserId, NoticeId, closuredate, ddlnoticestatus, frombulkupload);
            return noticeList;
        }

        /// <summary>
        /// Draft Notice List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DraftNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var sendernamesrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendername"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetitlesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetitlesrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);

     

            var noticeList = noticerepo.GetDraftNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, notistatus, LoggedInUser.FirmId.ToString(), NoticeId, sendernamesrh,Noticesubjectsrc, Noticetitlesrc, Noticetypesrc);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Assign notice to user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeAssign()
        {
            var senderid = LoggedInUser.UserId.ToString();
            var receiverid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["receiverid"]);
            var firmid = LoggedInUser.FirmId.ToString();
            var approvarType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["approvarType"]);
            var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
            var multipleNoticeArray = QueryAES.UrlDecode(HttpContext.Current.Request.Form["multipleNoticeArray"]);
            var noticeList = noticerepo.NoticeAssign(senderid, receiverid, firmid, approvarType, noticeid, multipleNoticeArray);
            return Ok(noticeList);
        }

        /// <summary>
        /// Update notice feedback by notice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeFeedback()
        {
            var noticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeId"]);
            var feedback = QueryAES.UrlDecode(HttpContext.Current.Request.Form["feedback"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var firmid = LoggedInUser.FirmId.ToString();
            var noticeList = noticerepo.SaveNoticeFeedback(noticeId, feedback, status, UserId, RoleId, firmid);
            return Json(noticeList);
        }

        /// <summary>
        /// Update notice final status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool SaveFinalStatus()
        {
            var dateofddel = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofddel"]);
            var txtdateofreceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceipt"]);
            var currentstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["currentstatus"]);
            var LoginUserId = LoggedInUser.UserId.ToString();
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var FirmIdd = LoggedInUser.FirmId.ToString();
            dynamic postedFiledata = "";
            var myList = new List<string>();
            var httpRequest = HttpContext.Current.Request;
            string _FileName = "";
            string uniqfile = "";
            string _path1 = "";
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                string folderPath = HttpContext.Current.Server.MapPath("~/Documents/NewNoticeDocument/" + FirmIdd + "/" + LoginUserId + "/");
                string folderpathazure = "Documents/NewNoticeDocument/" + FirmIdd + "/" + LoginUserId;
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                for (int i = 0; i < httpRequest.Files.Count; i++)
                {
                    var postedFile = httpRequest.Files[i];
                    var filePath = folderPath + postedFile.FileName;
                    var fileextchk = Path.GetExtension(postedFile.FileName);
                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                    postedFile.SaveAs(filePath);
                    myList.Add(postedFile.FileName);
                }
            }
            var filearray = myList.ToArray();
            postedFiledata = string.Join("/", filearray);
            bool result = noticerepo.SaveFinalStatus(postedFiledata, dateofddel, txtdateofreceipt, currentstatus, LoginUserId, NoticeId, FirmIdd);
            return result;
        }

        /// <summary>
        /// Add notice reply details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddIncomingNotice()
        {
            var result = new Message();
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hiddenreplynoticeid"]);
                string LoginUserId = LoggedInUser.UserId.ToString();
                var FirmIdd = LoggedInUser.FirmId.ToString();
                var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
                var txtreplyreciveddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplyreciveddate"]);
                var txtsetreplydate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsetreplydate"]);
                var DateOfReplytxt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DateOfReplytxt"]);
                var FileUpload = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FileUpload"]);
                bool IsFileAvail = false;
                if (FileUpload != null && FileUpload != "undefined")
                {
                    IsFileAvail = true;
                }
                var txtnoticethroughArray = "";
                var NoticeModeofdelevery = "";
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplyrecivedthrough"])))
                {
                    txtnoticethroughArray = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreplyrecivedthrough"]);
                    txtnoticethroughArray = txtnoticethroughArray.Trim(',');
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["replymodeofdelvivery"])))
                {
                    NoticeModeofdelevery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["replymodeofdelvivery"]);
                    NoticeModeofdelevery = NoticeModeofdelevery.Trim(',');
                }
                var userNoticeThrough = "";
                var usermodeofservice = "";
                var NoticeThroughArray1 = txtnoticethroughArray.Split(',');
                var modeofserviceArray1 = "";
                if (modeofserviceArray1 != null && modeofserviceArray1 != "")
                {
                    modeofserviceArray1 = Convert.ToString(NoticeModeofdelevery.Split(','));
                }
                dynamic postedFiledata = "";
                dynamic postedFiledata1 = "";
                var myList = new List<string>();
                var myList1 = new List<string>();
                var httpRequest = HttpContext.Current.Request;
                string _FileName = "";
                string uniqfile = "";
                string _path1 = "";
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                var filearray1 = myList1.ToArray();
                postedFiledata1 = string.Join("/", filearray1);
                var noti = new ReceivedReply();
                var notinew = new Notice();
                noti.postedfile = postedFiledata;
                noti.PostedFiledocmodule = postedFiledata1;
                noti.CreatedBy = LoginUserId;
                noti.FirmId = FirmIdd;
                noti.Id = hidden;
                noti.NoticeId = noticeid;
                noti.ReceivedThrogh = txtnoticethroughArray;
                noti.setdateofreply = txtsetreplydate;
                noti.ModeofService = NoticeModeofdelevery;
                if (!string.IsNullOrEmpty(txtreplyreciveddate))
                {
                    noti.ReceivedDate = Convert.ToDateTime(txtreplyreciveddate);
                }
                else { noti.ReceivedDate = null; }
                if (!string.IsNullOrEmpty(DateOfReplytxt))
                {
                    noti.DateOfReply = Convert.ToDateTime(DateOfReplytxt);
                }
                else { noti.DateOfReply = null; }
                try
                {
                    result = noticerepo.saveincomingnotice(noti, IsFileAvail);
                    try
                    {
                        var Moduletype = "AddReply";
                        var noticeids = "";
                        var db = new LawPracticeEntities();
                        if (NoticeThroughArray1.Length > 0)
                        {
                            for (int j = 0; j < NoticeThroughArray1.Length; j++)
                            {
                                userNoticeThrough = "";
                                userNoticeThrough = NoticeThroughArray1[j];
                                notinew.NoticeID = "";
                                notinew.FirmId = FirmIdd;
                                notinew.UserId = LoginUserId;
                                notinew.NoticeThrough = userNoticeThrough;
                                var detilsrepo = noticerepo.SavenoticeDetils(notinew, noticeid, Moduletype);
                            }
                        }
                        // save Mode of delevery on multiple row
                        if (modeofserviceArray1.Length > 0)
                        {
                            for (int m = 0; m < modeofserviceArray1.Length; m++)
                            {
                                usermodeofservice = Convert.ToString(modeofserviceArray1[m]);
                                notinew.NoticeID = "";
                                notinew.FirmId = FirmIdd;
                                notinew.UserId = LoginUserId;
                                notinew.ModeofServiceorDelivery = usermodeofservice;
                                var detilsmodeofdelevery = noticerepo.SavenoticeDetilsForModeOfDelevery(notinew, noticeid, Moduletype, null, null);
                            }
                        }
                        try
                        {
                            if (result.status)
                            {
                                var getoriginalnmoticeID = db.usp_GetNoticeByID(noticeid.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                if (getoriginalnmoticeID != null)
                                {
                                    noticeids = getoriginalnmoticeID.ParentNoticeId;
                                }
                                else
                                {
                                    var getoriginalnmoticeID1 = db.usp_GetNoticeReceiveReplyById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), noticeid).FirstOrDefault();
                                    if (getoriginalnmoticeID1 != null)
                                    {
                                        noticeids = getoriginalnmoticeID1.parentnoticeid;
                                    }
                                }
                                if (String.IsNullOrEmpty(noticeids))
                                {
                                    try
                                    {
                                        //bulk notice
                                        var getoriginalnmoticeID12 = db.usp_GetBulkNoticeById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), noticeid).FirstOrDefault();
                                        if (getoriginalnmoticeID12 != null)
                                        {
                                            noticeids = getoriginalnmoticeID12.MainTemplateId.ToString();
                                        }
                                    }
                                    catch
                                    {
                                    }
                                }
                                if (!string.IsNullOrEmpty(noticeid) && !string.IsNullOrEmpty(result.output.ToString()))
                                {
                                    //save to document management    
                                    var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), noticeids, "ReplyToNotice", null, result.output.ToString(), "", "Sent", "");
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                    catch { }
                }
                catch (Exception ex)
                {
                    LogService(ex.Message);
                    result.status = false;
                    result.message = ex.Message;
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogService(ex.Message);
                result.status = false;
                result.message = ex.Message;
            }
            return Ok(result);
        }

        /// <summary>
        /// Get reply notice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult IncomingNotice()
        {
            dynamic result = null;
            try
            {
                string noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
                string incomingreplyid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["incomingreplyid"]);
                try
                {
                    result = noticerepo.GetIncominReply(noticeid, incomingreplyid, LoggedInUser.FirmId.ToString());
                }
                catch (Exception ex)
                {
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return Ok(result);
        }

        /// <summary>
        /// Delete reply notice by reply notice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool IncomingNoticeDelete()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["incomingreplyid"]);
            bool result = noticerepo.IncomingNoticeDelete(NoticeID);
            return result;
        }

        /// <summary>
        /// Get archive notice list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool ArchiveNotice()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["archivenoticeid"]);
            var IsArchive = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsArchive"]);
            bool result = noticerepo.ArchiveNotice(NoticeID, IsArchive);
            return result;
        }

        /// <summary>
        /// Remove file by file id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public bool RemoveFileById()
        {
            var fileId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fid"]);
            bool result = noticerepo.RemoveFileById(fileId);
            return result;
        }

        /// <summary>
        /// Get document list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult Documentlisting()
        {
            var Id = LoggedInUser.UserId.ToString(); ;
            var RoleId = LoggedInUser.RoleId.ToString();
            var pageindex = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageindex"]);
            var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
            var Doctype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Doctype"]);
            var result = noticerepo.GetDocumentList(Id, Convert.ToInt16(RoleId), Convert.ToInt16(pageindex), Convert.ToInt16(pagesize), Doctype, LoggedInUser.FirmId.ToString());
            return Ok(result);
        }

        /// <summary>
        /// Update checkout flag
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult UpdateCheckoutFlag()
        {
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docid"]);
            var result = noticerepo.Updatecheckout(Id);
            return Ok(result);
        }

        /// <summary>
        /// Remove document from list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult RemoveDocumentfromlisting()
        {
            var docId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docId"]);
            var CreatedByUserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CreatedByUserId"]);
            var result = noticerepo.RemoveDocfromDocModule(docId, CreatedByUserId);
            return Ok(result);
        }

        /// <summary>
        /// Update doc from doc module
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult updateDocfromDocModule()
        {
            var docId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docId"]);
            var description = QueryAES.UrlDecode(HttpContext.Current.Request.Form["description"]);
            var loginid = LoggedInUser.UserId.ToString();
            var result = noticerepo.updateDocfromDocModule(description, docId, loginid);
            return Ok(result);
        }

        /// <summary>
        /// Share document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DocumentShare()
        {
            var senderid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["senderid"]);
            var receiverid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["receiverid"]);
            var firmid = LoggedInUser.FirmId.ToString();
            var docshareid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docshareid"]);
            var noticeList = noticerepo.Documentshare(docshareid, receiverid, senderid);
            return Json(noticeList);
        }

        /// <summary>
        /// Get sign copy
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetSigncopy()
        {
            var filename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filename"]);
            var signtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["signtype"]);
            var UserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
            var DocNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docid"]);
            var DocName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docname"]);
            var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]);
            var pageselect = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageselect"]);
            var signatory = QueryAES.UrlDecode(HttpContext.Current.Request.Form["signatory"]);
            var signfor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["signfor"]);
            var loginuserid = LoggedInUser.UserId.ToString();
            var firmid = LoggedInUser.FirmId.ToString();
            try
            {
                var result = noticerepo.ApplyDigitalSign(filename, signtype, UserId, DocNumber, DocName, username,
                    pageselect, signatory, signfor, loginuserid, firmid);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get notice list for ddl
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeListForddl()
        {
            var noticeList = noticerepo.Getnoticelistforddl(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get notice list for reminder ddl
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult NoticeListForReminderddl()
        {
            var TypeOfNotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeofnotices"]);
            var noticeList = noticerepo.NoticeListForReminderddl(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), TypeOfNotice);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Date for alert by notice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult Dateforalertbynoticeid()
        {
            var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
            var noticeList = noticerepo.Dateforalertbynoticeid(noticeid, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Save data for notification
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult Savedatafornotification()
        {
            var notificationfor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notificationfor"]);
            var txtnoticeids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticeids"]);
            var txtalrtbefore = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtalrtbefore"]);
            var txtduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtduedate"]);
            var txlalertcondition = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txlalertcondition"]);
            var txtCustomDueDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtCustomDueDate"]);
            var reminderRemark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reminderRemark"]);
            var alertDataSet = QueryAES.UrlDecode(HttpContext.Current.Request.Form["alertData"]);
            System.Data.DataTable DeserializeAlertObj = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Data.DataTable>(alertDataSet);
            var noticeList = noticerepo.Savedatafornotification(notificationfor, txtnoticeids, txtalrtbefore, txtduedate, txlalertcondition, DeserializeAlertObj);
            return Json(noticeList);
        }

        /// <summary>
        /// Get set alert details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetSetAlertDetails()
        {
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var TypeofNotices = QueryAES.UrlDecode(HttpContext.Current.Request.Form["TypeofNotices"]);
            var GetAlertDetails = noticerepo.GetSetAlertDetails(NoticeId, TypeofNotices, LoggedInUser.FirmId.ToString());
            var a = JsonConvert.SerializeObject(GetAlertDetails);
            return Ok(GetAlertDetails);
        }

        /// <summary>
        /// Get Partner list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PartnerList()
        {
            try
            {
                var result = noticerepo.GetPartnerList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
            }
            return Ok();
        }

        /// <summary>
        /// Get Notice Receive List For ddl
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeRcvListForddl()
        {
            var noticeList = noticerepo.Getrcvnoticelistforddl();
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get notice status count details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeStatusCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            try
            {
                var result = noticerepo.GetStatusCountForGraph(LoginUserId, RoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        /// <summary>
        /// Get notice count details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeDataCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            try
            {
                var result = noticerepo.GetDashboardNoticeCountforblock(LoginUserId, RoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        /// <summary>
        /// Get notice type count
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeTypeCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            try
            {
                var result = noticerepo.GetNoticeTypeCountForGraph(LoginUserId, RoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        /// <summary>
        /// Get notice subject count details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeSubjectCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            try
            {
                var result = noticerepo.GetNoticeSubjectForGraph(LoginUserId, RoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        /// <summary>
        /// Get notice sent count details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeSentCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            try
            {
                var result = noticerepo.GetNoticeSentToMangerandClientCount(LoginUserId, RoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        /// <summary>
        /// Get Notify high lighted date
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult GetNotifyhighlighteddate()
        {
            try
            {
                var result = noticerepo.GetNotifyhighlighteddate();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Notice List By Notify Date
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult GetNoticeListByNotifyDate()
        {
            var Notifydate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notifydate"]);
            try
            {
                var result = noticerepo.GetNoticeListByNotifyDate(Notifydate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save Notice Subject
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult SaveNoticeSubject()
        {
            var SubjectName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubjectName"]);
            var subjectid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
            bool output = noticerepo.SaveSubjectType(SubjectName, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), subjectid);
            return Ok(output);
        }

        /// <summary>
        /// Remove subject type
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult RemoveSubjectType()
        {
            var SubjectId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubjectId"]);
            bool output = noticerepo.RemoveSubjectType(SubjectId, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            return Ok(output);
        }

        /// <summary>
        /// Update Date Of Delivery For Notice
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult updateDateOfDeliveryForNotice()
        {
            var result = new Message();
            var dateOfDelivery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateOfDelivery"]);
            var moduleType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["moduleType"]);
            var noticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeId"]);
            if (!String.IsNullOrEmpty(dateOfDelivery) && !String.IsNullOrEmpty(moduleType) && !String.IsNullOrEmpty(noticeId))
            {
                var output = noticerepo.updateDateOfDeliveryForNotice(dateOfDelivery, moduleType, noticeId, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                result.message = output.message;
                result.status = true;
            }
            else
            {
                result.message = "Something went wrong , pleasr try again.";
                result.status = false;
            }
            return Ok(result);
        }

        /// <summary>
        /// Notice Post Detail
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public Message NoticePostDetail()
        {
            var output = new Message();
            var consignmentnum = "";
            var paramtrakingId = "";
            var paramnoticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramnoticeid"]);
            var rowcounterdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["rowcounterdata"]);
            var noticepostdate = "";
            var consignmentnums = "";
            var dateofdeliverys = "";
            var trackingidss = "";
            //otherdetils of senders
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramnoticepostdate"])))
            {
                noticepostdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramnoticepostdate"]);
                noticepostdate = noticepostdate.Trim(',');
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["consignmentnum"])))
            {
                consignmentnums = QueryAES.UrlDecode(HttpContext.Current.Request.Form["consignmentnum"]);
                consignmentnums = consignmentnums.Trim(',');
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofdelivery"])))
            {
                dateofdeliverys = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofdelivery"]);
                dateofdeliverys = dateofdeliverys.Trim(',');
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramtrakingId"])))
            {
                trackingidss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramtrakingId"]);
                trackingidss = trackingidss.Trim(',');
            }
            var Receiverrowcountdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Receiverrowcountdata"]);
            var noticepostdate1 = noticepostdate.Split(',');
            var consignmentnums1 = consignmentnums.Split(',');
            var dateofdeliverys1 = dateofdeliverys.Split(',');
            var trackingidss1 = trackingidss.Split(',');
            var NoticeModeofdelevery = "";
            var NoticeModedelivery = "";
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Modeofdelevery"])))
            {
                NoticeModeofdelevery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Modeofdelevery"]);
                NoticeModeofdelevery = NoticeModeofdelevery.Trim(',');
            }
            var modeofserviceArray1 = NoticeModeofdelevery.Split(',');
            var Moduletype = "CreateNotice";
            var noti = new Notice();
            DateTime? noticeSendDate = null;
            DateTime? noticedeleveryDate = null;
            if (String.IsNullOrEmpty(rowcounterdata))
            {
                rowcounterdata = "0";
            }
            int receivercount = Convert.ToInt32(rowcounterdata) + 1;
            var finalreceivercount = receivercount;
            for (int i = 0; i < finalreceivercount; i++)
            {
                if (noticepostdate != "")
                {
                    if (!String.IsNullOrEmpty(noticepostdate1[i]))
                    {
                        noticeSendDate = Convert.ToDateTime(noticepostdate1[i]);
                    }
                }
                if (consignmentnums != "")
                {
                    consignmentnum = consignmentnums1[i];
                }
                if (dateofdeliverys != "")
                {
                    if (!String.IsNullOrEmpty(dateofdeliverys1[i]))
                    {
                        noticedeleveryDate = Convert.ToDateTime(dateofdeliverys1[i]);
                    }
                }
                if (trackingidss != "")
                {
                    paramtrakingId = trackingidss1[i];
                }
                output = noticerepo.NoticePostDetail(paramnoticeid, noticeSendDate, consignmentnum, paramtrakingId, noticedeleveryDate);
                if (output.message == "Record saved successfully.")
                {
                    if (noticepostdate1.Length > 0)
                    {
                        var DispatchDetail = noticerepo.DeleteDispatchDetail(paramnoticeid, LoggedInUser.FirmId.ToString());
                        for (int j = 0; j < noticepostdate1.Length; j++)
                        {
                            DateTime? dateofdispatch = null;
                            if (dateofdeliverys1.Length > 0 && dateofdeliverys1.Length != j && dateofdeliverys1[j] != "")
                            {
                                dateofdispatch = Convert.ToDateTime(dateofdeliverys1[j]);
                            }
                            DateTime? postDate = null;
                            if (noticepostdate1[j] != "")
                            {
                                postDate = Convert.ToDateTime(noticepostdate1[j]);
                            }
                            for (int k = 0; k < modeofserviceArray1.Length; k++)
                            {
                                NoticeModedelivery = modeofserviceArray1[k];
                                noti.ModeofServiceorDelivery = NoticeModedelivery;
                                noti.NoticeID = paramnoticeid;
                                var detilsmodeofdelevery = noticerepo.SavenoticeDetilsForModeOfDelevery(noti, paramnoticeid, Moduletype, dateofdispatch, postDate);
                            }
                        }
                        output.message = "Record saved successfully.";
                        output.status = true;
                    }
                }
                //End
            }
            if (output.status == true)
            {
                if (noticepostdate1.Length > 0)
                {
                    var DispatchDetail = noticerepo.DeleteDispatchDetail(paramnoticeid, LoggedInUser.FirmId.ToString());
                    for (int j = 0; j < noticepostdate1.Length; j++)
                    {
                        DateTime? dateofdispatch = null;
                        if (dateofdeliverys1.Length > 0 && dateofdeliverys1.Length != j && dateofdeliverys1[j] != "")
                        {
                            dateofdispatch = Convert.ToDateTime(dateofdeliverys1[j]);
                        }
                        DateTime? postDate = null;
                        if (noticepostdate1[j] != "")
                        {
                            postDate = Convert.ToDateTime(noticepostdate1[j]);
                        }
                        for (int k = 0; k < modeofserviceArray1.Length; k++)
                        {
                            NoticeModedelivery = modeofserviceArray1[k];
                            noti.ModeofServiceorDelivery = NoticeModedelivery;
                            noti.NoticeID = paramnoticeid;
                            var detilsmodeofdelevery = noticerepo.SavenoticeDetilsForModeOfDelevery(noti, paramnoticeid, Moduletype, dateofdispatch, postDate);
                        }
                    }
                    output.message = "Record saved successfully.";
                    output.status = true;
                }
            }
            return output;
        }

        /// <summary>
        /// View notice post details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public dynamic ViewNoticePostDetail()
        {
            var paramtrakingId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramtrakingId"]);
            var output = noticerepo.ViewNoticePostDetail(paramtrakingId);
            return output;
        }

        /// <summary>
        /// Send Notice Draft On Mail
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult sendNoticeDraftOnMail()
        {
            Message output = new Message();
            var noticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var receiverEmaill = QueryAES.UrlDecode(HttpContext.Current.Request.Form["receiverEmaill"]);
            var path = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filename"]);
            var displayfilename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["displayfilename"]);
            LawPracticeEntities db = new LawPracticeEntities();
            var loggedInUserName = LoggedInUser.UserName.ToString();
            var list1 = db.sp_getDataByNoticeIdForEmailDraft(noticeId).ToList();
            if (list1.Count > 0)
            {
                foreach (var item in list1)
                {
                    var receiveremailval = receiverEmaill;
                    var draftpath = path + ".doc";
                    var firmid = item.FirmId;
                    var userid = item.UserId;
                    var Noticetitle = item.NoticeTitle;
                    var firmContactEmail = item.firmContactEmail;
                    var FirmName = item.FirmName;
                    var FirmAddress1 = item.FirmAddress1;
                    var contactNo = item.FirmContactno;
                    var Id = item.NoticeId;
                    if (String.IsNullOrEmpty(receiveremailval))
                    {
                        output.message = "EmptyEmail";
                        output.status = true;
                        return Ok(output);
                    }
                    var receiveremailsplit = receiveremailval.Split(',');
                    //get file from azure
                    var fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                    var fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + userid);
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }
                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                    var folderpathazure = "Documents/NoticeDraftDocuments/DraftNotice/" + firmid + "/" + userid;
                    var filename = draftpath;
                    var filefrmpath = AzureDocumentself.Dirfilepath(folderpathazure, filename, fullpath, fullpath2, firmid, userid);
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
                            var ntc = new NoticeTemplateController();
                            var mail = ntc.mailForBulkNotice(item1, Noticetitle, firmContactEmail, FirmName, FirmAddress1, filefrmpath, Id.ToString(), "FromNotice", displayfilename, contactNo, loggedInUserName);
                            if (mail == "Sent")
                            {
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
            return Ok(output);
        }

        /// <summary>
        /// Save Custom Notice Status
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult SaveCustomNoticeStatus()
        {
            var StatusName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["StatusName"]);
            var result = noticerepo.savenoticestatus(StatusName);
            return Ok(result);
        }

        /// <summary>
        /// Remove Notice Custom Status
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult RemoveNoticeCustomStatus()
        {
            var StatusId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["StatusId"]);
            var result = noticerepo.deleteNoticeStatus(StatusId);
            return Ok(result);
        }

        /// <summary>
        /// Get Sender Details By Sender Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public sp_GetSenderDetailsBySenderId_Result GetSenderDetailsBySenderId()
        {
            var senderIdss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SenderId"]);
            sp_GetSenderDetailsBySenderId_Result result = noticerepo.GetSenderDetailBySenderId(senderIdss);
            return result;
        }

        /// <summary>
        /// Notice Recived Details List By Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult NoticeRecivedDetailsListById()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeID"]);
            List<usp_GetNoticeReceiverDetailsById_Result> result = noticerepo.GetNoticeReceiverDetailListByID(NoticeID);
            var a = JsonConvert.SerializeObject(result);
            return Ok(a);
        }

        /// <summary>
        /// View Mode Of Delivery By Notice Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public dynamic ViewModeOfDeliveryByNoticeId()
        {
            var paramnoticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramnoticeid"]);
            //Get modeofdeleivery list
            var output = noticerepo.ViewDeleiveryModeByNoticeId(paramnoticeid);
            //Get post details
            return output;
        }

        /// <summary>
        /// View Speed Post Detail By Notice Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public dynamic ViewSpeedPostDetailByNoticeId()
        {
            var paramnoticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["paramNoticeId"]);
            //Get post details
            var output = noticerepo.ViewPostDetilsByNoticeId(paramnoticeid);
            return output;
        }

        /// <summary>
        /// Get Documnet Details By Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public sp_GetDocumentDetailsByNoticeId_Result GetDocumnetDetailsById()
        {
            var NoticeIdss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docnoticeid"]);
            sp_GetDocumentDetailsByNoticeId_Result result = noticerepo.GetDocumentDetailByNoticeId(NoticeIdss);
            return result;
        }

        /// <summary>
        /// Get Notice Reciver By Id
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public List<sp_GetReceiverEmailsByNoticeId_Result> NoticeReciverById()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeID"]);
            List<sp_GetReceiverEmailsByNoticeId_Result> result = noticerepo.GetReceiverEmailsByNoticeId(NoticeID);
            return result;
        }

        /// <summary>
        /// Get Delete Notice List
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult GetDeleteNoticeList()
        {
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var NoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
            var sendernamesrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendername"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetitlesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetitlesrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);
            var noticeList = noticerepo.GetDeleteNotice(UserId, PageNumber, PageSize, RoleId, NoticeStatus, fromreminder, noticeid, sendernamesrh, Noticesubjectsrc, Noticetitlesrc, Noticetypesrc);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Final delete notice
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public bool FinalNoticeDelete()
        {
            var NoticeID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            bool result = noticerepo.FinalDeleteNotice(NoticeID);
            return result;
        }

        /// <summary>
        /// Get Receive Draft Notice List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ReceiveDraftNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var notistatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["notistatus"]);
            var NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
            var sendernamesrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendername"]);
            var Noticesubjectsrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticesubjectsrc"]);
            var Noticetitlesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetitlesrc"]);
            var Noticetypesrc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Noticetypesrc"]);
            var noticeList = noticerepo.GetReceivedDraftNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, notistatus, LoggedInUser.FirmId.ToString(), NoticeId, sendernamesrh,
                Noticesubjectsrc, Noticetitlesrc, Noticetypesrc);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }


        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult UpdateVerthnaNotice()
        {
            var loantype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loantype"]);
            var loanId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loanId"]);
            var clientId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientId"]);
            var schoolStudentName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["schoolStudentName"]);
            var branch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["branch"]);
            var state = QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]);
            var branchaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["branchaddress"]);
            var productname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["productname"]);
            var loanamount = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loanamount"]);
            var disbursementdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["disbursementdate"]);
            var emiAmount = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emiAmount"]);
            var emiduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emiduedate"]);
            var currentDPD = QueryAES.UrlDecode(HttpContext.Current.Request.Form["currentDPD"]);
            var borrowerschoolname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["borrowerschoolname"]);
            var borrowerschooladdress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["borrowerschooladdress"]);
            var borrowerschoolphone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["borrowerschoolphone"]);
            var borrowerschoolemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["borrowerschoolemail"]);
            var trustname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trustname"]);
            var trustnameaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trustnameaddress"]);
            var trustnamephoneno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trustnamephoneno"]);
            var trustemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trustemail"]);
            var coapplicantname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantname"]);
            var coapplicantaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantaddress"]);
            var coapplicantphone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantphone"]);
            var coapplicantemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantemail"]);
            var coapplicantname2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantname2"]);
            var coapplicantaddress2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantaddress2"]);
            var coapplicantphone2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantphone2"]);
            var coapplicantemailid2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantemailid2"]);
            var coapplicantdunningref = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantdunningref"]);
            var coapplicantdunningnoticedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["coapplicantdunningnoticedate"]);
            var branchcollectionmanagername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["branchcollectionmanagername"]);
            var branchcollectionmanagerno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["branchcollectionmanagerno"]);
            var txtnoticetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticetype"]);
            var noticeIdD = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeId"]);

            DataAccessIPRADO.UpdateVerthnaNoticeDetails(loantype, loanId, clientId, schoolStudentName, branch, state, branchaddress, productname, loanamount,
                disbursementdate, emiAmount, emiduedate, currentDPD, borrowerschoolname, borrowerschooladdress, borrowerschoolphone,
                borrowerschoolemail, trustname, trustnameaddress, trustnamephoneno, trustemail, coapplicantname, coapplicantaddress,
                coapplicantphone, coapplicantemail, coapplicantname2, coapplicantaddress2, coapplicantphone2, coapplicantemailid2, coapplicantdunningref,
                coapplicantdunningnoticedate, branchcollectionmanagername, branchcollectionmanagerno, txtnoticetype, noticeIdD);

            return Ok("");

        }

        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DeleteNoticeByNoticeId()
        {
            var noticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dNoticeId"]);
            var result = DataAccessIPRADO.DeleteVerthnaNoticeDetails(noticeId);
            return Ok("Deleted Successfully");
        }
    }
}
