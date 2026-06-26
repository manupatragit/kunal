using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Models;
using NoticeManagement.BusinessLayer.BusinessEntity;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
namespace NoticeManagement.BusinessLayer.BusinessRepository
{
    public class RejoinderNoticeRepository : IRejoinderNotice
    {
        private LawPracticeEntities db;
        public RejoinderNoticeRepository(LawPracticeEntities _NoticeEntities)
        {
            this.db = _NoticeEntities;
        }
        /// <summary>
        /// Get rejoinder draft notice details 
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="RejoinderInitiateBy"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public dynamic GetDraftRejoinderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string RejoinderInitiateBy, string firmid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetRejoinderNoticeListDraft(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), RejoinderInitiateBy, firmid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get rejoinder notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="noticeid"></param>
        /// <param name="RejoinderInitiateBy"></param>
        /// <param name="notistatus"></param>
        /// <param name="firmid"></param>
        /// <param name="sendernamesrh"></param>
        /// <param name="subjecttypesrch"></param>
        /// <param name="noticetypesrch"></param>
        /// <returns></returns>
        public dynamic GetRejoinderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
            string RoleId, string noticeid, string RejoinderInitiateBy, string notistatus, string firmid, string sendernamesrh, string subjecttypesrch, string noticetypesrch)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            if (!string.IsNullOrEmpty(noticeid) && noticeid != "undefined" && noticeid != "null")
            {
                Noticelist = db.usp_GetRejoinderListByNoticeId(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                    Convert.ToInt16(RoleId), noticeid, firmid, sendernamesrh, subjecttypesrch, noticetypesrch).ToList();
            }
            else
            {
                Noticelist = db.usp_GetRejoinderNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                                                         Convert.ToInt16(RoleId), RejoinderInitiateBy, notistatus, firmid,
                                                         sendernamesrh, subjecttypesrch, noticetypesrch).ToList();
            }
            return Noticelist;
        }
        /// <summary>
        /// Get rejoinder notice list by notice id
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="noticeid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<usp_GetRejoinderNoticeListByNoticeId_Result> GetRejoinderNoticeListByNoticeId(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string noticeid, string firmid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            List<usp_GetRejoinderNoticeListByNoticeId_Result> Noticelist = null;
            Noticelist = db.usp_GetRejoinderNoticeListByNoticeId(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), noticeid, firmid).ToList();
            return Noticelist;
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
        /// Save rejoinder notice list detail
        /// </summary>
        /// <param name="rejoinderNotice"></param>
        /// <param name="NoticeThroughId"></param>
        /// <param name="rejoinderSubjectName"></param>
        /// <returns></returns>
        public Message SaveRejoinderNotice(RejoinderNotice rejoinderNotice, string NoticeThroughId, string rejoinderSubjectName)
        {
            var output = new Message();
            try
            {
                if (rejoinderNotice.NoticeID == null)
                    rejoinderNotice.NoticeID = "";
                string id = "";
                ObjectParameter ReturnVal1;
                ReturnVal1 = new ObjectParameter("ReturnVal", id);
                var result = db.usp_AddUpdateRejoinderNotice(rejoinderNotice.NoticeID, rejoinderNotice.FirmId, rejoinderNotice.UserId, rejoinderNotice.CaseStatus, rejoinderNotice.NoticeType,
                 rejoinderNotice.DateofNotice, rejoinderNotice.AddresseeAddress, rejoinderNotice.OtherDetailsofAddressee, rejoinderNotice.Rejoinder, rejoinderNotice.DateofRejoinder, rejoinderNotice.DateofReceivingReply,
                 rejoinderNotice.ModeofDeliveryofRejoinder, rejoinderNotice.NoticeTitle, rejoinderNotice.ModeofReceipt, rejoinderNotice.NoticeandReplyReference, rejoinderNotice.RejoinderAddressedto, rejoinderNotice.DateofDispatchofNotice,
                 rejoinderNotice.DateofServiceofNotice, rejoinderNotice.DateofReplytoNotice, rejoinderNotice.CreateRejoinder, rejoinderNotice.RejoinderThrough,
                 rejoinderNotice.RejoinderSubject, rejoinderNotice.DateofDelivery, rejoinderNotice.DateofReceipt, null, null, rejoinderNotice.AssignmentofTask,
                 rejoinderNotice.GenerationofAlerts, rejoinderNotice.CurrentStatus, rejoinderNotice.DateofCreatingRejoinder, ReturnVal1,
                 rejoinderNotice.parentId, rejoinderNotice.Noticeinitiatedby, rejoinderNotice.rootNoticeId,
                 rejoinderNotice.col1, rejoinderNotice.col2,
                 rejoinderNotice.col3, rejoinderNotice.col4, rejoinderNotice.col5,
                 rejoinderNotice.col6, rejoinderNotice.col7, rejoinderNotice.col8,
                 rejoinderNotice.col9, rejoinderNotice.col10, rejoinderNotice.col11,
                 rejoinderNotice.col12, rejoinderNotice.col13, rejoinderNotice.col14,
                 rejoinderNotice.col15, Convert.ToInt16(rejoinderNotice.formtype), rejoinderNotice.SenderNameId,
                 rejoinderNotice.SenderNametxt, rejoinderNotice.sendernameother, rejoinderNotice.SenderAddress,
                 rejoinderNotice.OtherDetailsofSender, rejoinderNotice.Tag, rejoinderNotice.Criticality,
                 rejoinderNotice.ResonForHighPriority, rejoinderNotice.Amountclaimed, rejoinderNotice.duedatenotice);
                id = Convert.ToString(ReturnVal1.Value);
                if (result > 0)
                {
                    if (rejoinderNotice.NoticeID == "")
                    {
                        db.sp_SaveNotification(id, rejoinderNotice.RejoinderSubject, rejoinderNotice.FirmId, rejoinderNotice.CaseStatus, "You have added a rejoinder notice", rejoinderNotice.GenerationofAlerts, rejoinderNotice.UserId, "Rejoinder Notice", null);
                        output.output = id.ToString();
                    }
                    else
                    {
                        db.sp_SaveNotification(rejoinderNotice.NoticeID, rejoinderNotice.RejoinderSubject, rejoinderNotice.FirmId, rejoinderNotice.CaseStatus, "You have modified a rejoinder notice", rejoinderNotice.GenerationofAlerts, rejoinderNotice.UserId, "Rejoinder Notice", null);
                        output.output = rejoinderNotice.NoticeID.ToString();
                    }
                }
                if (result >= 1)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                    string logo = "";
                    try
                    {
                        var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
                        try
                        {
                            var getLogo = "";
                            var firmlogo = db.usp_GetNoticeLogoData(firmid.ToString()).FirstOrDefault();
                            if (firmlogo != null)
                            {
                                getLogo = firmlogo.LogoPath.ToString();
                            }
                            var getLogoposition = db.sp_GetLogoPosition(firmid).FirstOrDefault();
                            dynamic logoposition = "";
                            if (getLogoposition != null)
                            {
                                if (getLogoposition.LogoPosition == "Middle")
                                {
                                    logoposition = "center";
                                }
                                else
                                {
                                    logoposition = getLogoposition.LogoPosition;
                                }
                            }
                            else
                            {
                                logoposition = "right";
                            }
                            if (!string.IsNullOrEmpty(getLogo))
                            {
                                try
                                {
                                    string siteurl = System.Web.Configuration.WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                    logo = System.Web.Hosting.HostingEnvironment.MapPath(getLogo);
                                    logo = "<div style='text-align:" + logoposition + "'><img src='" + siteurl + getLogo + "' alt='logo'></div>";
                                }
                                catch
                                {
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                    catch
                    {
                    }
                    string strHTMLpath = "";
                    strHTMLpath = System.Web.Hosting.HostingEnvironment.MapPath("~\\Documents\\NoticeTemplate\\NoticeTemplate.html");
                    StreamReader reader = new StreamReader(strHTMLpath, Encoding.Default);
                    string strinvoicetemplate = reader.ReadToEnd().Replace('\r', ' ').Replace('\n', ' ').Replace("  ", " ");
                    strinvoicetemplate = strinvoicetemplate.Replace("@noticecontent", rejoinderNotice.CreateRejoinder);
                    strinvoicetemplate = strinvoicetemplate.Replace("@logo", logo);
                    int? draftCount = 0;
                    if (rejoinderNotice.NoticeID != "")
                    {
                        draftCount = db.usp_GetSaveNoticeDraftCount(rejoinderNotice.NoticeID, rejoinderNotice.FirmId).FirstOrDefault();
                        draftCount = draftCount + 1;
                    }
                    else
                    {
                        draftCount = draftCount + 1;
                    }
                    string filename = "Version - " + draftCount + "_" + rejoinderNotice.NoticeTitle;
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/NoticeDraftDocuments/DraftNotice/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string content = strinvoicetemplate;
                    var htmfth = folderPath + filename + ".doc";
                    var pffth = folderPath + filename + ".pdf";
                    File.WriteAllText(htmfth, content, Encoding.UTF8);
                    var folderpathazure = "";
                    var input = htmfth;
                    FileInfo fi = new FileInfo(input);
                    try
                    {
                        folderpathazure = "Documents/NoticeDraftDocuments/DraftNotice/" + rejoinderNotice.FirmId.ToString() + "/" + rejoinderNotice.UserId.ToString();
                        folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                        string fakepathout = "azuredirout/" + rejoinderNotice.FirmId.ToString() + "/" + rejoinderNotice.UserId.ToString();
                        if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                        {
                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                        }
                        string outputs = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + fi.Name);
                        QueryAES.FileEncrypt(input, outputs);
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                        catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
                    }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                    catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                    {
                    }
                    if (rejoinderNotice.NoticeID == "")
                    {
                        db.sp_savenoticedraft(id, filename, folderpathazure + "/" + fi.Name, rejoinderNotice.UserId, rejoinderNotice.FirmId);
                    }
                    else
                    {
                        db.sp_savenoticedraft(rejoinderNotice.NoticeID, filename, folderpathazure + "/" + fi.Name, rejoinderNotice.UserId, rejoinderNotice.FirmId);
                    }
                    return output;
                }
                else
                {
                    output.status = false;
                    output.message = "Alert ! something went wrong.";
                    return output;
                }
            }
            catch (Exception ex)
            {
                output.status = false;
                output.message = ex.Message;
                return output;
            }
        }
    }
}
