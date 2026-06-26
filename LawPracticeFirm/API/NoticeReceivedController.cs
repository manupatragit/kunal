using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Helpers;
using Newtonsoft.Json;
using NoticeManagement.BusinessLayer.BusinessRepository;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace NoticeManagement.Api
{
    public class NoticeReceivedController : BaseFirmApiController
    {
        private INoticeReceived noticerepo;
        private INotice noticecreaterepo;
        public NoticeReceivedController()
        {
            this.noticerepo = new NoticeReceivedRepository(new LawPracticeEntities());
            this.noticecreaterepo = new NoticeRepository(new LawPracticeEntities());
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
        /// Add new received notice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult AddReceivedNotice()
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
            var loggedInUserName= LoggedInUser.UserFullName.ToString();
            var filearray = myList.ToArray();
            postedFiledata = string.Join("/", filearray);
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                var noticeTitle= QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoindertitle"]);
                var noticeSubjectName= HttpContext.Current.Request.Form["ddlsubjectName"];
                var RejoinderNoti = new RejoinderNotice();
                RejoinderNoti.postedFiledata = postedFiledata;
                RejoinderNoti.AddresseeAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtaddressto"]);
                RejoinderNoti.CaseStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casestatus"]);
                RejoinderNoti.CreateRejoinder = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["CreateNotice"]);
                RejoinderNoti.CurrentStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcurrentstatus"]);
                RejoinderNoti.DateofCreatingRejoinder = DateTime.Now;
                RejoinderNoti.NoticeThroughId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeThroughId"]);
                RejoinderNoti.SubectId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubectId"]);
                var txtduedatenotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtduedatenotice"]);
                var txtnoticetreceivedhrough = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticetreceivedhrough"]);
                var txtsendernameother = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsendernameother"]);
                var txtsenderaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsenderaddress"]);
                var txtsentthrough = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsentthrough"]);
                var txtnoticereceivedthroughArray = "";
                var NoticeModeofdelevery = "";
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticetreceivedhrough"])))
                {
                    txtnoticereceivedthroughArray = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtnoticetreceivedhrough"]);
                    txtnoticereceivedthroughArray = txtnoticereceivedthroughArray.Trim(',');
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtmodeofReceipt"])))
                {
                    NoticeModeofdelevery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtmodeofReceipt"]);
                    NoticeModeofdelevery = NoticeModeofdelevery.Trim(',');
                }
                var txtnoticethroughArray1 = txtnoticereceivedthroughArray.Split(',');
                var modeofserviceArray1 = NoticeModeofdelevery.Split(',');
                var Moduletype = "AddReceived";
                if (string.IsNullOrEmpty(txtduedatenotice) || txtduedatenotice == "undefined")
                {
                    RejoinderNoti.duedatenotice = null;
                }
                else
                {
                    RejoinderNoti.duedatenotice = DateTime.Parse(txtduedatenotice);
                }
                var dateofdelivery = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDateofDelivery"]);
                if (string.IsNullOrEmpty(dateofdelivery) || dateofdelivery == "undefined")
                {
                    RejoinderNoti.DateofDelivery = null;
                }
                else
                {
                    RejoinderNoti.DateofDelivery = DateTime.Parse(dateofdelivery);
                }
                var dateofreceipt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceipt"]);
                if (string.IsNullOrEmpty(dateofreceipt) || dateofreceipt == "undefined")
                {
                    RejoinderNoti.DateofReceipt = null;
                }
                else
                {
                    RejoinderNoti.DateofReceipt = Convert.ToDateTime(dateofreceipt);
                }
                var dateofrejoinder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofrejoinder"]);
                if (string.IsNullOrEmpty(dateofrejoinder) || dateofrejoinder == "undefined")
                {
                    RejoinderNoti.DateofRejoinder = null;
                }
                else
                {
                    RejoinderNoti.DateofRejoinder = Convert.ToDateTime(dateofrejoinder);
                }
                var dateofreceivingreply = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofreceivingreply"]);
                if (string.IsNullOrEmpty(dateofreceivingreply) || dateofreceivingreply == "undefined")
                {
                    RejoinderNoti.DateofReceivingReply = null;
                }
                else
                {
                    RejoinderNoti.DateofReceivingReply = Convert.ToDateTime(dateofreceivingreply);
                }
                RejoinderNoti.FirmId = LoggedInUser.FirmId.ToString();
                var tatdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tatdate"]);
                if (string.IsNullOrEmpty(tatdate) || tatdate == "undefined")
                {
                    RejoinderNoti.GenerationofAlerts = null;
                }
                else
                {
                    RejoinderNoti.GenerationofAlerts = Convert.ToDateTime(tatdate);
                }
                var dateofnotice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofnotice"]);
                if (string.IsNullOrEmpty(dateofnotice) || dateofnotice == "undefined")
                {
                    RejoinderNoti.DateofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofNotice = Convert.ToDateTime(dateofnotice);
                }
                var dateofdispatch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateofdispatch"]);
                if (string.IsNullOrEmpty(dateofdispatch) || dateofdispatch == "undefined")
                {
                    RejoinderNoti.DateofDispatchofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofDispatchofNotice = Convert.ToDateTime(dateofdispatch);
                }
                var dateofservice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofServiceofNotice"]);
                if (string.IsNullOrEmpty(dateofservice) || dateofservice == "undefined")
                {
                    RejoinderNoti.DateofServiceofNotice = null;
                }
                else
                {
                    RejoinderNoti.DateofServiceofNotice = Convert.ToDateTime(dateofservice);
                }
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
                var db = new LawPracticeEntities();
                var chknotice = db.usp_CheckNoticeTitleExist(LoggedInUser.FirmId.ToString(), noticeTitle.TrimEnd().TrimStart(), hidden, LoggedInUser.UserId.ToString(), "ReceivedNotice", RejoinderNoti.NoticeThroughId, txtsendernameother.Trim()).FirstOrDefault();
                if (chknotice == 1)
                {
                    return Ok("Already exist title name. please try another title name");
                }
                RejoinderNoti.ModeofReceipt = NoticeModeofdelevery;
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
                RejoinderNoti.RejoinderSubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoindersub"]);
                RejoinderNoti.RejoinderThrough = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtrejoinderthrough"]);
                RejoinderNoti.txtsenderaddress = txtsenderaddress;
                RejoinderNoti.txtsentthrough = txtnoticereceivedthroughArray;
                RejoinderNoti.sendernameother = txtsendernameother;
                var amountclaimed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtamountclaimed"]);
                if (amountclaimed == "")
                {
                    amountclaimed = "0";
                }
                RejoinderNoti.ResonForHighPriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtreasonforhighpriority"]);
                RejoinderNoti.RoOf = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DosoReceiver"]);
                RejoinderNoti.Criticality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Criticality"]);
                RejoinderNoti.OtherDetailsofSender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OtherdetailsofSender"]);
                RejoinderNoti.Amountclaimed = amountclaimed;
                RejoinderNoti.Tag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txttag"]);
                var Referncenumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Referncenumber"]);
                var IntReferncenuber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IntReferncenuber"]);
                RejoinderNoti.ReferenceNumber = Referncenumber;
                RejoinderNoti.IntReferenceNumber = IntReferncenuber;
                RejoinderNoti.col1 = col1;
                RejoinderNoti.col2 = col2;
                RejoinderNoti.col3 = col3;
                RejoinderNoti.col4 = col4;
                RejoinderNoti.col5 = col5;
                RejoinderNoti.col6 = col6;
                RejoinderNoti.col7 = col7;
                RejoinderNoti.col8 = col8;
                RejoinderNoti.col9 = col9;
                RejoinderNoti.col10 = col10;
                RejoinderNoti.col11 = col11;
                RejoinderNoti.col12 = col12;
                RejoinderNoti.col13 = col13;
                RejoinderNoti.col14 = col14;
                RejoinderNoti.col15 = col15;
                RejoinderNoti.formtype = formtype;
                RejoinderNoti.ctxt1 = ctxt1;
                RejoinderNoti.ctxt2 = ctxt2;
                RejoinderNoti.ctxt3 = ctxt3;
                RejoinderNoti.ctxt4 = ctxt4;
                RejoinderNoti.ctxt5 = ctxt5;
                RejoinderNoti.ctxt6 = ctxt6;
                RejoinderNoti.ctxt7 = ctxt7;
                RejoinderNoti.ctxt8 = ctxt8;
                RejoinderNoti.ctxt9 = ctxt9;
                RejoinderNoti.ctxt10 = ctxt10;
                RejoinderNoti.ctxt11 = ctxt11;
                RejoinderNoti.ctxt12 = ctxt12;
                RejoinderNoti.ctxt13 = ctxt13;
                RejoinderNoti.ctxt14 = ctxt14;
                RejoinderNoti.ctxt15 = ctxt15;
                RejoinderNoti.ftype = ftype;
                RejoinderNoti.sum = sum;
                result = noticerepo.SaveReceivedNotice(RejoinderNoti);
                try
                {
                    var response = DataAccessADO.Usp_GetFirmAdminDetail(firmid);
                    var firmAdminName = response.Rows[0].ItemArray[0].ToString();
                    var firmAdminEmail = response.Rows[0].ItemArray[1].ToString();
                    if(!string.IsNullOrEmpty(firmAdminEmail))
                    {
                        if(RejoinderNoti.NoticeID=="")
                        {
                            ReceivedNoticeSendMail(firmAdminName, firmAdminEmail, loggedInUserName, RejoinderNoti.RejoinderAddressedto, RejoinderNoti.RejoinderThrough, RejoinderNoti.DateofNotice, RejoinderNoti.NoticeTitle, noticeSubjectName, RejoinderNoti.duedatenotice, firmid, IdloginUser, "Received Notice Added");
                        }
                    }
                }
                catch { }
                try
                {
                    if (result.status)
                    {
                        //create notice folder
                        if (!string.IsNullOrEmpty(RejoinderNoti.NoticeID))// FOR EDIT
                        {
                            //save to document management    
                            var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), RejoinderNoti.NoticeID, "ReceivedNotice", null, null, RejoinderNoti.NoticeThroughId,"Received", RejoinderNoti.NoticeTitle);
                        }
                        else if (!string.IsNullOrEmpty(result.output.ToString())) //FOR CREATE
                        {
                            //save to document management    
                            var dataresult = CommonDocIntegration.CommonDocUploadNotice(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.output.ToString(), "ReceivedNotice", RejoinderNoti.NoticeTitle, null, RejoinderNoti.NoticeThroughId,"Received", "");
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
        public string ReceivedNoticeSendMail(string firmAdminName,string email, string loggedInUserName,string sendername, string receiverName,DateTime? DateOfNotice,string noticeTitle,string noticeSubject,DateTime? NoticeDueDate, string firmid, string IdloginUser, string NoticeFrom)
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
                    DataAccessADO.Usp_SaveNewNoticeLogDetail(firmid, IdloginUser,noticeTitle,noticeSubject, email, mailStatus, NoticeFrom);
                    
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
        /// Get received notice list details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ReceivedNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var NoitceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoitceId"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var NoticeSubjectsrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeSubjectsrh"]);
            var ddlnoticetypess = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticetypess"]);
            var ddlnoticestatusss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticestatusss"]);
            var SenderNameSrch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SenderNameSrch"]);
            var CaseNoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNoticeStatus"]);
            var IsArchived = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsArchived"]);
            //var noticeList = noticerepo.GetReceivedNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, 
            //    RoleId,LoggedInUser.FirmId.ToString(), NoitceId,fromdaterange, startdate,enddate,fromreminder,
            //     NoticeSubjectsrh,ddlnoticetypess, ddlnoticestatusss, SenderNameSrch, CaseNoticeStatus, IsArchived);
     
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            var trialList_1 = DataAccessADO.GetNoticeRecievedListRecord(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
                RoleId, LoggedInUser.FirmId.ToString(), NoitceId, fromdaterange, startdate, enddate, fromreminder,
                 NoticeSubjectsrh, ddlnoticetypess, ddlnoticestatusss, SenderNameSrch, CaseNoticeStatus, IsArchived);
            var a = JsonConvert.SerializeObject(trialList_1);
            return Ok(a);
        }

        /// <summary>
        /// Get received notice list convert to case
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ReceivedNoticeListConvertToCase()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var NoitceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoitceId"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var noticeList = noticerepo.GetReceivedNoticeConvertToCase(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, LoggedInUser.FirmId.ToString(), NoitceId, fromdaterange, startdate, enddate, fromreminder);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Delete received notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult DeleteReceivedNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var NoitceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoitceId"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var NoticeSubjectsrh = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeSubjectsrh"]);
            var ddlnoticetypess = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticetypess"]);
            var ddlnoticestatusss = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlnoticestatusss"]);
            var SenderNameSrch = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SenderNameSrch"]);
            var CaseNoticeStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseNoticeStatus"]);
            var noticeList = noticerepo.GetDeleteReceivedNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize,
                RoleId, LoggedInUser.FirmId.ToString(), NoitceId, fromdaterange, startdate, enddate, fromreminder,
                 NoticeSubjectsrh, ddlnoticetypess, ddlnoticestatusss, SenderNameSrch, CaseNoticeStatus);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }

        /// <summary>
        /// Get settled receive notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ReceivedNoticeListSettled()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var NoitceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoitceId"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var noticeList = noticerepo.GetReceivedNoticeSettled(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, LoggedInUser.FirmId.ToString(), NoitceId, fromdaterange, startdate, enddate, fromreminder);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }
        
        /// <summary>
        /// Get client notice list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [FirmApiAuthorization()]
        public IHttpActionResult ClientNoticeList()
        {
            var SearchValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SearchValue"]);
            var ColumName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ColumName"]);
            var SortedOrder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SortedOrder"]);
            int PageNumber = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageNumber"]));
            int PageSize = Convert.ToInt16(QueryAES.UrlDecode(HttpContext.Current.Request.Form["PageSize"]));
            var ClientId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClientId"]);
            var UserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var fromdaterange = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdaterange"]);
            var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
            var enddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["enddate"]);
            var fromreminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromreminder"]);
            var noticeList = noticerepo.GetClientNotice(UserId, SearchValue, ColumName, SortedOrder, PageNumber, PageSize, RoleId, LoggedInUser.FirmId.ToString(), null, fromdaterange, startdate, enddate, fromreminder, ClientId);
            var a = JsonConvert.SerializeObject(noticeList);
            return Ok(a);
        }
    }
}
