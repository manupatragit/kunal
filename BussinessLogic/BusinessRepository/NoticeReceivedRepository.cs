using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using NoticeManagement.BusinessLayer.BusinessEntity;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using System;
using System.Data.Entity.Core.Objects;
using System.Linq;
namespace NoticeManagement.BusinessLayer.BusinessRepository
{
    public class NoticeReceivedRepository : INoticeReceived
    {
        private LawPracticeEntities db;
        public NoticeReceivedRepository(LawPracticeEntities _NoticeEntities)
        {
            this.db = _NoticeEntities;
        }
        /// <summary>
        /// Get client notice list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeId"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <param name="clientid"></param>
        /// <returns></returns>
        public dynamic GetClientNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder, string clientid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetNoticeListByClientId(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), firmid, Convert.ToBoolean(fromdaterange), startdate, enddate, Convert.ToBoolean(fromreminder), clientid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get received notice list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <param name="noticeid"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <param name="noticesubjectsrch"></param>
        /// <param name="noticetpesrch"></param>
        /// <param name="noticestatussrch"></param>
        /// <param name="notisendernamesrch"></param>
        /// <param name="IsArchived"></param>
        /// <returns></returns>
        public dynamic GetReceivedNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                        string RoleId, string firmid, string noticeid, string fromdaterange, string startdate, string enddate, string fromreminder,
                                        string noticesubjectsrch, string noticetpesrch, string noticestatussrch, string notisendernamesrch, string casestatusfilter, string IsArchived)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            try
            {
                Noticelist = db.usp_GetReceivedNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                    Convert.ToInt16(RoleId), firmid, Convert.ToBoolean(fromdaterange), startdate, enddate,
                    Convert.ToBoolean(fromreminder), noticeid, noticesubjectsrch, noticetpesrch, noticestatussrch, notisendernamesrch, casestatusfilter, IsArchived).ToList();
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            return Noticelist;
        }
        /// <summary>
        /// Get settled received notice list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeId"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <returns></returns>
        public dynamic GetReceivedNoticeSettled(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetReceivedNoticeListSettled(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), firmid, NoticeId, Convert.ToBoolean(fromdaterange), startdate, enddate, Convert.ToBoolean(fromreminder)).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get received notice convert to case
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeId"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <returns></returns>
        public dynamic GetReceivedNoticeConvertToCase(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetReceivedNoticeListConvertToCase(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), firmid, NoticeId, Convert.ToBoolean(fromdaterange), startdate, enddate, Convert.ToBoolean(fromreminder)).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get delete received notice
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <param name="noticeid"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <param name="noticesubjectsrch"></param>
        /// <param name="noticetpesrch"></param>
        /// <param name="noticestatussrch"></param>
        /// <param name="notisendernamesrch"></param>
        /// <param name="casestatusfilter"></param>
        /// <returns></returns>
        public dynamic GetDeleteReceivedNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                        string RoleId, string firmid, string noticeid, string fromdaterange, string startdate, string enddate, string fromreminder,
                                        string noticesubjectsrch, string noticetpesrch, string noticestatussrch, string notisendernamesrch, string casestatusfilter)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            try
            {
                Noticelist = db.usp_GetReceivedNoticeDeleteList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                    Convert.ToInt16(RoleId), firmid, Convert.ToBoolean(fromdaterange), startdate, enddate,
                    Convert.ToBoolean(fromreminder), noticeid, noticesubjectsrch, noticetpesrch, noticestatussrch, notisendernamesrch, casestatusfilter).ToList();
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
            return Noticelist;
        }
        /// <summary>
        /// Save received notice
        /// </summary>
        /// <param name="rejoinderNotice"></param>
        /// <returns></returns>
        public Message SaveReceivedNotice(RejoinderNotice rejoinderNotice)
        {
            var output = new Message();
            try
            {
                if (rejoinderNotice.NoticeID == null)
                    rejoinderNotice.NoticeID = "";
                string id = "";
                ObjectParameter ReturnVal1;
                ReturnVal1 = new ObjectParameter("ReturnVal", id);
                var result = db.usp_AddUpdateReceivedNotice(rejoinderNotice.NoticeID, rejoinderNotice.FirmId, rejoinderNotice.UserId, rejoinderNotice.CaseStatus, rejoinderNotice.NoticeType,
                                 rejoinderNotice.DateofNotice, rejoinderNotice.AddresseeAddress, rejoinderNotice.OtherDetailsofAddressee, rejoinderNotice.Rejoinder, rejoinderNotice.DateofRejoinder, rejoinderNotice.DateofReceivingReply,
                                 rejoinderNotice.ModeofDeliveryofRejoinder, rejoinderNotice.NoticeTitle, rejoinderNotice.ModeofReceipt, rejoinderNotice.NoticeandReplyReference, rejoinderNotice.RejoinderAddressedto, rejoinderNotice.DateofDispatchofNotice,
                                 rejoinderNotice.DateofServiceofNotice, rejoinderNotice.DateofReplytoNotice, rejoinderNotice.CreateRejoinder, rejoinderNotice.RejoinderThrough,
                                 rejoinderNotice.RejoinderSubject, rejoinderNotice.DateofDelivery, rejoinderNotice.DateofReceipt, null, null, rejoinderNotice.AssignmentofTask,
                                 rejoinderNotice.GenerationofAlerts, rejoinderNotice.CurrentStatus, rejoinderNotice.DateofCreatingRejoinder,
                                 ReturnVal1, rejoinderNotice.NoticeThroughId, rejoinderNotice.SubectId,
                                 rejoinderNotice.col1, rejoinderNotice.col2,
                                 rejoinderNotice.col3, rejoinderNotice.col4, rejoinderNotice.col5,
                                 rejoinderNotice.col6, rejoinderNotice.col7, rejoinderNotice.col8,
                                 rejoinderNotice.col9, rejoinderNotice.col10, rejoinderNotice.col11,
                                 rejoinderNotice.col12, rejoinderNotice.col13, rejoinderNotice.col14,
                                 rejoinderNotice.col15, Convert.ToInt16(rejoinderNotice.formtype),
                                 rejoinderNotice.txtsenderaddress, rejoinderNotice.txtsentthrough, rejoinderNotice.duedatenotice,
                                 rejoinderNotice.sendernameother, rejoinderNotice.OtherDetailsofSender, rejoinderNotice.Criticality,
                                 rejoinderNotice.ResonForHighPriority, rejoinderNotice.RoOf, rejoinderNotice.Amountclaimed, rejoinderNotice.Tag,
                                 rejoinderNotice.ReferenceNumber, rejoinderNotice.IntReferenceNumber);
                id = Convert.ToString(ReturnVal1.Value);
                // map column
                if (rejoinderNotice.NoticeID == "")
                {
                    for (int i = 1; i <= rejoinderNotice.sum; i++)
                    {
                        var pid = id;
                        var column_no = "col" + i;
                        var column_name = "";
                        //var st="ccol" + i;
                        if (i == 1)
                        {
                            var ctxt = rejoinderNotice.ctxt1;
                            column_name = ctxt;
                        }
                        else if (i == 2)
                        {
                            var ctxt = rejoinderNotice.ctxt2;
                            column_name = ctxt;
                        }
                        else if (i == 3)
                        {
                            var ctxt = rejoinderNotice.ctxt3;
                            column_name = ctxt;
                        }
                        else if (i == 4)
                        {
                            var ctxt = rejoinderNotice.ctxt4;
                            column_name = ctxt;
                        }
                        else if (i == 5)
                        {
                            var ctxt = rejoinderNotice.ctxt5;
                            column_name = ctxt;
                        }
                        else if (i == 6)
                        {
                            var ctxt = rejoinderNotice.ctxt6;
                            column_name = ctxt;
                        }
                        else if (i == 7)
                        {
                            var ctxt = rejoinderNotice.ctxt7;
                            column_name = ctxt;
                        }
                        else if (i == 8)
                        {
                            var ctxt = rejoinderNotice.ctxt8;
                            column_name = ctxt;
                        }
                        else if (i == 9)
                        {
                            var ctxt = rejoinderNotice.ctxt9;
                            column_name = ctxt;
                        }
                        else if (i == 10)
                        {
                            var ctxt = rejoinderNotice.ctxt10;
                            column_name = ctxt;
                        }
                        else if (i == 11)
                        {
                            var ctxt = rejoinderNotice.ctxt11;
                            column_name = ctxt;
                        }
                        else if (i == 12)
                        {
                            var ctxt = rejoinderNotice.ctxt12;
                            column_name = ctxt;
                        }
                        else if (i == 13)
                        {
                            var ctxt = rejoinderNotice.ctxt13;
                            column_name = ctxt;
                        }
                        else if (i == 14)
                        {
                            var ctxt = rejoinderNotice.ctxt14;
                            column_name = ctxt;
                        }
                        else if (i == 15)
                        {
                            var ctxt = rejoinderNotice.ctxt15;
                            column_name = ctxt;
                        }
                        var formid = Convert.ToInt32(rejoinderNotice.ftype);
                        var inserrcol = db.Usp_SaveCaseColumnMapNotice(rejoinderNotice.FirmId, rejoinderNotice.UserId, column_no, column_name, pid, rejoinderNotice.ftype);
                    }
                }
                if (result > 0)
                {
                    if (rejoinderNotice.NoticeID == "")
                    {
                        db.sp_SaveNotification(id, rejoinderNotice.RejoinderSubject, rejoinderNotice.FirmId, rejoinderNotice.CaseStatus, "You have added a rejoinder notice", rejoinderNotice.GenerationofAlerts, rejoinderNotice.UserId, "Rejoinder Notice", null);
                    }
                    else
                    {
                        db.sp_SaveNotification(rejoinderNotice.NoticeID, rejoinderNotice.RejoinderSubject, rejoinderNotice.FirmId, rejoinderNotice.CaseStatus, "You have modified a rejoinder notice", rejoinderNotice.GenerationofAlerts, rejoinderNotice.UserId, "Rejoinder Notice", null);
                    }
                }
                if (rejoinderNotice.NoticeID == "")
                {
                    output.output = id.ToString();
                }
                else
                {
                    output.output = rejoinderNotice.NoticeID.ToString();
                }
                if (result >= 1)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
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
