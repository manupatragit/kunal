
using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace BussinessLogic.BusinessRepository
{
    public class DBHandle
    {
#pragma warning disable CS0649 // Field 'DBHandle.con' is never assigned to, and will always have its default value null
        private SqlConnection con;
#pragma warning restore CS0649 // Field 'DBHandle.con' is never assigned to, and will always have its default value null
        private void connection()
        {
            //string constring = ConfigurationManager.ConnectionStrings["NoticeEntities"].ToString();
            //con = new SqlConnection(constring);
        }

        #region Notice
        //public dynamic GetNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, 
        //    int PageSize,int roleid,string sendername,string addressedto,string noticethrough)
        //{
        //    if (SearchValue == null)
        //    {
        //        SearchValue = "";
        //    }

        //    NoticeEntities db = new NoticeEntities();
            
        //    dynamic Noticelist = null;
        //    Noticelist = db.usp_GetNotice(UserId, SearchValue, PageNumber, PageSize, ColumName, 
        //                                 SortedOrder, roleid, sendername, addressedto, noticethrough).ToList();
        //    return Noticelist;

        //}
        //public object AddNotice(Notice notice, int iApproverType, string ReceiverID)
        //{
        //    try
        //    {
        //        if (notice.NoticeID == null)
        //            notice.NoticeID = "";
               
        //        NoticeEntities db = new NoticeEntities();
        //        string id = "";
        //        ObjectParameter ReturnVal;
        //        ReturnVal = new ObjectParameter("resultid", id);
                
        //        var result = db.usp_AddUpdateNotices(notice.NoticeID, notice.FirmId, notice.UserId, notice.CaseStatus, notice.NoticeType,
        //            notice.AssignmentofTask, notice.GenerationofAlerts, notice.DateofNotice, notice.ModeofServiceorDelivery, notice.AddressedTo,
        //            notice.AddresseeAddress,
        //            notice.OtherDetailsofAddressee, notice.SendersName, notice.SendersAddress, notice.OtherDetailsofSender, notice.NoticeSubject,
        //            notice.NoticeTitle,
        //            notice.CreateNotice, notice.NoticeThrough, notice.DateofDelivery, notice.DateofReceipt, notice.CurrentStatus,
        //            Convert.ToByte(iApproverType), ReceiverID, notice.NoticeCreatedOn,
        //           ReturnVal);

        //        id = Convert.ToString(ReturnVal.Value);

        //        return id;

        //    }
        //    catch (SqlException sqlEx)
        //    {

        //    }
        //    return "";
        //}




        public dynamic GetNoticeDetailByID(string noticeID,string firmid)
        {
            LawPracticeEntities db = new LawPracticeEntities();
            var Noticelist = db.usp_GetNoticeByID(noticeID,firmid).FirstOrDefault();
            return Noticelist;
        }

        

        #endregion

        #region Rejoinder Notice

        public dynamic GetRejoinderNoticeDetails(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize)
        {

            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;

            LawPracticeEntities db = new LawPracticeEntities();
            Noticelist = db.usp_GetRejoinderNotices1(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder).ToList();
            return Noticelist;

        }

        //public object AddRejoinderNotice(RejoinderNotice rejoinderNotice, int iApproverType, string ReceiverID)
        //{
        //    try
        //    {
        //        NoticeEntities db = new NoticeEntities();
        //        if (rejoinderNotice.NoticeID == null)
        //            rejoinderNotice.NoticeID = "";

        //        string id = "";
        //        ObjectParameter ReturnVal;
        //        ReturnVal = new ObjectParameter("resultid", id);
        //        var result = db.usp_AddUpdateRejoinderNotice(rejoinderNotice.NoticeID, rejoinderNotice.FirmId, rejoinderNotice.UserId, rejoinderNotice.CaseStatus, rejoinderNotice.NoticeType,
        //           rejoinderNotice.DateofNotice, rejoinderNotice.AddresseeAddress, rejoinderNotice.OtherDetailsofAddressee, rejoinderNotice.Rejoinder, rejoinderNotice.DateofRejoinder, rejoinderNotice.DateofReceivingReply,
        //          rejoinderNotice.ModeofDeliveryofRejoinder, rejoinderNotice.NoticeTitle, rejoinderNotice.ModeofReceipt, rejoinderNotice.NoticeandReplyReference, rejoinderNotice.RejoinderAddressedto, rejoinderNotice.DateofDispatchofNotice,
        //          rejoinderNotice.DateofServiceofNotice, rejoinderNotice.DateofReplytoNotice, rejoinderNotice.CreateRejoinder, rejoinderNotice.RejoinderThrough,
        //          rejoinderNotice.RejoinderSubject, rejoinderNotice.DateofDelivery, rejoinderNotice.DateofReceipt, Convert.ToByte(iApproverType), ReceiverID, rejoinderNotice.AssignmentofTask,
        //          rejoinderNotice.GenerationofAlerts, rejoinderNotice.CurrentStatus, rejoinderNotice.DateofCreatingRejoinder, ReturnVal, rejoinderNotice.parentId);

               
        //        if (result >= 1)
        //            return result;
        //    }
        //    catch (SqlException ex)
        //    {
        //        return false;
        //    }

        //    return false;


        //}
        public dynamic GetRejoinderNoticeDetailByID(string rejoindernoticeID,string firmid)
        {
           
            dynamic Noticelist = null;
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                Noticelist = db.usp_GetRejoinderNoticeDetailByID(rejoindernoticeID,firmid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {

            }
            return Noticelist;

        }

        public bool DeleteRejoinderNotice(int RejoinderNoticeID)
        {

            LawPracticeEntities db = new LawPracticeEntities();
            int i = db.usp_DeleteRejoinderNotice(RejoinderNoticeID);
            if (i >= 1)
                return true;
            else
                return false;
        }

        #endregion

        #region Reply To Notice

        public dynamic GetReplyToNoticeDetails(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,string firmid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = new List<TblReplyToNotice>();
            LawPracticeEntities db = new LawPracticeEntities();

            Noticelist = db.usp_GetReplyToNoticeDetails1(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,firmid).ToList();
            return Noticelist;

        }

        public object AddReplyToNotice(ReplyToNotice replyToNotice, int iApproverType, string ReceiverID)
        {
        
            if (replyToNotice.NoticeID == null)
                replyToNotice.NoticeID = "";
            LawPracticeEntities db = new LawPracticeEntities();
            string id = "";



            ObjectParameter ReturnVal;
            ReturnVal = new ObjectParameter("resultid", id);

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

            return id;


        }
        public dynamic GetReplyToNoticeDetailByID(string replynoticeID, string firmid)
        {
            dynamic Noticelist = null;
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();

                Noticelist = db.usp_GetReplyToNoticeDetailByID(replynoticeID,firmid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {

            }
            return Noticelist;
        }

        public bool DeleteReplyToNotice(string ReplyNoticeID)
        {
            LawPracticeEntities db = new LawPracticeEntities();
            var i = db.usp_DeleteReplyToNotice(ReplyNoticeID);
            if (i >= 1)
                return true;
            else
                return false;
        }

        #endregion
        public dynamic GetClientNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;

            LawPracticeEntities db = new LawPracticeEntities();
            Noticelist = db.usp_GetNoticeDetailsClientEnd1(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder).ToList();
            return Noticelist;

        }
        public dynamic GetClientReplyNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            LawPracticeEntities db = new LawPracticeEntities();
            Noticelist = db.usp_GetReplyNoticeDetailsClientEnd1(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder).ToList();
            return Noticelist;

        }
        public dynamic GetClientRejoinderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            LawPracticeEntities db = new LawPracticeEntities();
            Noticelist = db.usp_GetRejoinderNoticeDetailsClientEnd1(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder).ToList();
            return Noticelist;

        }
        public bool AddFile(string NoticeId, string FileName)
        {
            LawPracticeEntities db = new LawPracticeEntities();
            int i = db.usp_AddFiles(NoticeId, FileName);

            if (i >= 1)
                return true;
            else
                return false;
        }
        public DataTable GetFileDetails(string NoticeID)
        {
            DataTable dtData = new DataTable();

            connection();
            if (con.State == ConnectionState.Closed)
                con.Open();
            SqlCommand command = new SqlCommand("Select * From FileSave where NoticeId='" + NoticeID + "'", con);
            SqlDataAdapter da = new SqlDataAdapter(command);
            da.Fill(dtData);
            con.Close();
            return dtData;
        }
        public bool AddFeedback(string NoticeId, string FeedBack, string UserId, string FirmId)
        {
            LawPracticeEntities db = new LawPracticeEntities();
            var i = db.usp_AddFeedBackToNotice(NoticeId, UserId, FeedBack, FirmId);
            if (i >= 1)
                return true;
            else
                return false;
        }
    }
}
