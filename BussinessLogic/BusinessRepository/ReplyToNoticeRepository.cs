using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Models;
using NoticeManagement.BusinessLayer.BusinessEntity;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using QueryStringEDAES;
using System;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
namespace NoticeManagement.BusinessLayer.BusinessRepository
{
    public class ReplyToNoticeRepository : IReplyToNotice
    {
        private LawPracticeEntities db;
        public ReplyToNoticeRepository(LawPracticeEntities _NoticeEntities)
        {
            this.db = _NoticeEntities;
        }

        /// <summary>
        /// Get reply notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="mainnoticeid"></param>
        /// <returns></returns>
        public dynamic GetReplyToNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string mainnoticeid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.sp_ReplyToNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), mainnoticeid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get reply draft notice detail
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public dynamic GetReplyToNoticeDraftList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.sp_ReplyToNoticeListDraft(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId)).ToList();
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
        /// Save reply notice
        /// </summary>
        /// <param name="replyToNotice"></param>
        /// <param name="replySubjectText"></param>
        /// <returns></returns>
        public Message SaveReplyToNotice(ReplyToNotice replyToNotice, string replySubjectText)
        {
            if (replyToNotice.NoticeID == null)
                replyToNotice.NoticeID = "";
            LawPracticeEntities db = new LawPracticeEntities();
            string id = "";
            ObjectParameter ReturnVal;
            ReturnVal = new ObjectParameter("resultid", id);
            var output = new Message();
            try
            {
                var result = db.usp_AddUpdateReplyToNotice(replyToNotice.NoticeID, replyToNotice.FirmId, replyToNotice.UserId, replyToNotice.AssignmentofTask,
                     replyToNotice.GenerationofAlerts, replyToNotice.CaseStatus, replyToNotice.NoticeType, replyToNotice.NoticeReceivedbyClient,
                     replyToNotice.NoticeBroughtbyClientforReply, replyToNotice.DateofReply, replyToNotice.ModeofServiceorDelivery,
                     replyToNotice.ReplyAddressedto, replyToNotice.AddresseeAddress, replyToNotice.OtherDetailsofAddressee, replyToNotice.RespondentsName,
                     replyToNotice.RespondentsAddress, replyToNotice.NoticeTitle, replyToNotice.OtherDetailsofRespondent, replyToNotice.NoticeReference,
                     replyToNotice.ReplySubject, replyToNotice.CreateReply, replyToNotice.ReplyThrough, replyToNotice.DateofDelivery, replyToNotice.DateofReceipt,
                     replyToNotice.CurrentStatus, null, null, ReturnVal, replyToNotice.ReplytoNoticeCreatedOn,
                     replyToNotice.parentId, replyToNotice.rootNoticeId,
                     replyToNotice.col1, replyToNotice.col2,
                     replyToNotice.col3, replyToNotice.col4, replyToNotice.col5,
                     replyToNotice.col6, replyToNotice.col7, replyToNotice.col8,
                     replyToNotice.col9, replyToNotice.col10, replyToNotice.col11,
                     replyToNotice.col12, replyToNotice.col13, replyToNotice.col14,
                     replyToNotice.col15, Convert.ToInt16(replyToNotice.formtype),
                     replyToNotice.SenderName, replyToNotice.SenderNameId, replyToNotice.Senderothertxt,
                     replyToNotice.SenderAddress, replyToNotice.Criticality,
                     replyToNotice.ResonForHighPriority,
                     replyToNotice.Amountclaimed, replyToNotice.RoOf, replyToNotice.Tag, replyToNotice.DueDateOfNotice);
                id = Convert.ToString(ReturnVal.Value);
                if (result > 0)
                {
                    if (replyToNotice.NoticeID == "")
                    {
                        db.sp_SaveNotification(id, replyToNotice.ReplySubject, replyToNotice.FirmId, replyToNotice.CaseStatus, "You have added a notice", replyToNotice.GenerationofAlerts, replyToNotice.UserId, "Reply To Notice", null);
                    }
                    else
                    {
                        db.sp_SaveNotification(replyToNotice.NoticeID, replyToNotice.ReplySubject, replyToNotice.FirmId, replyToNotice.CaseStatus, "You have modified a notice", replyToNotice.GenerationofAlerts, replyToNotice.UserId, "Reply To Notice", null);
                    }
                }
                if (replyToNotice.NoticeID == "")
                {
                    output.output = id.ToString();
                }
                else
                {
                    output.output = replyToNotice.NoticeID.ToString();
                }
                var getLogo = "";
                var firmlogo = db.usp_GetNoticeLogoData(replyToNotice.FirmId.ToString()).FirstOrDefault();
                if (firmlogo != null)
                {
                    getLogo = firmlogo.LogoPath.ToString();
                }
                var getLogoposition = db.sp_GetLogoPosition(replyToNotice.FirmId).FirstOrDefault();
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
                string logo = "";
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
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                    string strHTMLpath = "";
                    strHTMLpath = System.Web.Hosting.HostingEnvironment.MapPath("~\\Documents\\NoticeTemplate\\NoticeTemplate.html");
                    StreamReader reader = new StreamReader(strHTMLpath, Encoding.Default);
                    string strinvoicetemplate = reader.ReadToEnd().Replace('\r', ' ').Replace('\n', ' ').Replace("  ", " ");
                    strinvoicetemplate = strinvoicetemplate.Replace("@noticecontent", replyToNotice.CreateReply);
                    strinvoicetemplate = strinvoicetemplate.Replace("@logo", logo);
                    string header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
       "xmlns:w='urn:schemas-microsoft-com:office:word' " +
       "xmlns='https://www.w3.org/TR/REC-html40'>" +
       "<head><meta charset='utf-8'><title>OCR DOCS</title></head><body>";
                    string footer = "</body></html>";
                    strinvoicetemplate = header + strinvoicetemplate + footer;
                    int? draftCount = 0;
                    if (replyToNotice.NoticeID != "")
                    {
                        draftCount = db.usp_GetSaveNoticeDraftCount(replyToNotice.NoticeID, replyToNotice.FirmId).FirstOrDefault();
                        draftCount = draftCount + 1;
                    }
                    else
                    {
                        draftCount = draftCount + 1;
                    }
                    string filename = "Version - " + draftCount + "_" + replyToNotice.NoticeTitle;
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~//Documents/NoticeDraftDocuments/DraftNotice/");
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
                        folderpathazure = "Documents/NoticeDraftDocuments/DraftNotice/" + replyToNotice.FirmId.ToString() + "/" + replyToNotice.UserId.ToString();
                        folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                        string fakepathout = "azuredirout/" + replyToNotice.FirmId.ToString() + "/" + replyToNotice.UserId.ToString();
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
                    if (replyToNotice.NoticeID == "")
                    {
                        db.sp_savenoticedraft(id, filename, folderpathazure + "/" + fi.Name, replyToNotice.UserId, replyToNotice.FirmId);
                    }
                    else
                    {
                        db.sp_savenoticedraft(replyToNotice.NoticeID, filename, folderpathazure + "/" + fi.Name, replyToNotice.UserId, replyToNotice.FirmId);
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
        /// <summary>
        /// Get reply notice list by notice id
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public dynamic GetReplyToNoticeListByNoticeId(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string parentId)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.sp_ReplyToNoticeListByNoticeId(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), parentId).ToList();
            return Noticelist;
        }
    }
}
