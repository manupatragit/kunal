using DataAccess.Modals;
using NoticeManagement.BusinessLayer.BusinessEntity;
using System;
using System.Collections.Generic;
using System.Data;
namespace NoticeManagement.BusinessLayer.IBusinessRepository
{
    public interface INotice
    {
        List<sp_getPartnerList_Result> GetPartnerList(string firmid, string userid);
        List<sp_getnoticedraft_Result> Getdraftednoticeitem(string noticeid);
        List<sp_getNoticeSubjectList_Result> Getnoticesubjectforddl();
        bool Savedatafornotification(string notificationfor, string txtnoticeids, string txtalrtbefore, string txtduedate, string txlalertcondition, DataTable DeserializeAlertObj);
        List<sp_Getnoticelistforddl_Result> Getnoticelistforddl(string firmid, string userid);
        List<sp_GetnoticelistforReminderddl_Result> NoticeListForReminderddl(string firmid, string userid, string TypeOfNotice);
        sp_Getdateforalertbynoticeid_Result Dateforalertbynoticeid(string noticeid, string firmid);
        bool Updatecheckout(string docid);
        dynamic ApplyDigitalSign(string filename, string signtype, string UserId, string DocNumber, string DocName,
                                 string username, string pageselect, string signatory, string signfor, string loginuserid, string firmid);
        bool Documentshare(string docid, string receiverid, string senderid);
        Message RemoveDocfromDocModule(string docid, string CreatedByUserId);
        List<sp_getdocversionbymaindocid_Result> GetDocumentVersionList(string docid, string firmid);
        usp_getdocdescriptionbyId_Result GetDocDescriptionbyId(string docid, string firmid);
        bool updateDocfromDocModule(string description, string docid, string loginid);
        List<sp_getDocumentList_Result> GetDocumentList(string loginid, int roleid, int pagenum, int pagesize, string Doctype, string firmid);
        Message AddDocument(string hiddenid, string firmid, string loginid, string postedFiledata, string description);
        List<sp_getIncomingReply_Result> GetIncominReply(string noticeid, string incomingreplyid, string firmid);
        bool IncomingNoticeDelete(string IncomingNoticeID);
        bool ArchiveNotice(string ArchiveNoticeID, string IsArchive);
        bool RemoveFileById(string fid);
        Message savenotice(Notice notice);
        Message saveincomingnotice(ReceivedReply notice, bool IsFileAvail);
        Message viewnotice(string id, string param, string firmid);
        bool DeleteNotice(string NoticeID, string deleteflag);
        bool RemoveReminder(string NoticeID);
        bool SaveFinalStatus(string postedFiledata, string dateofddel, string txtdateofreceipt, string currentstatus, string LoginUserId, string NoticeId, string FirmIdd);
        usp_GetNoticeByID_Result GetNoticeDetailByID(string noticeID, string firmid);
        List<usp_GetNoticeByID_Result> GetNoticeDetailListByID(string noticeID, string LoginUserId, string firmid);
        dynamic GetNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                    string RoleId, string NoticeStatus, string fromdaterange, string startdate, string enddate, string fromreminder,
                    string noticeid, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch, string CaseNoticeStatus, string IsArchived);
        dynamic GetReminderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber,
                          int PageSize, string RoleId, string firmid);
        dynamic GetNoticeListFilter(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                                 string RoleId, string param, string paramid, string firmid, string NoticeStatus, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch);
        dynamic GetArchiveNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
            string RoleId, string notistatus, string firmid);
        bool NoticeAssign(string senderid, string receiverid, string firmid, string approvarType, string noticeid, string multipleNoticeArray);
        sp_getNoticeLog_Result viewnoticelog(string id, string Usertype, string firmid);
        List<sp_getNoticeLogNew_Result> viewnoticelogNew(string id, string firmid, string Usertype);
        bool SaveNoticeFeedback(string noticeId, string feedback, string status, string UserId, string RoleId, string firmid);
        dynamic GetDraftNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                               string RoleId, string notistatus, string firmid, string NoticeId, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch); bool NoticeClosure(string UserId, string NoticeId, DateTime closuredate, string ddlnoticestatus, string frombulkupload);
        dynamic ConvertToCaseNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
           string RoleId, string notistatus);
        dynamic SettledNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
            string RoleId, string notistatus);
        List<sp_Getrcvnoticelistforddl_Result> Getrcvnoticelistforddl();
        List<sp_GetStatusCountForGraph_Result> GetStatusCountForGraph(string LoginUserId, string RoleId);
        sp_getDashboardNoticeCountforblock_Result GetDashboardNoticeCountforblock(string LoginUserId, string RoleId);
        List<sp_GetNoticeTypeCountForGraph_Result> GetNoticeTypeCountForGraph(string LoginUserId, string RoleId);
        dynamic GetNoticeSentToMangerandClientCount(string LoginUserId, string RoleId);
        dynamic GetNotifyhighlighteddate();
        //dynamic GetNotifyhighlighteddateForReceived();
        //dynamic GetNotifyhighlighteddateForReply();
        List<usp_GetNoticeListByNotifyDate_Result> GetNoticeListByNotifyDate(string NotifyDate);
        bool RemoveSubjectType(string hiddensubjectid, string firmid, string userid);
        bool SaveSubjectType(string SubjectName, string firmid, string userid, string id);
        Message updateDateOfDeliveryForNotice(string dateOfDel, string ModuleType, string noticeId, string firmid, string userid);
        Message NoticePostDetail(string NoticeId, DateTime? paramnoticepostdate, string consignmentnum, string paramtrakingId, DateTime? dateofdelivery);
        dynamic ViewNoticePostDetail(string paramtrakingId);
        List<sp_GetNoticeSubjectCountForGraph_Result> GetNoticeSubjectForGraph(string LoginUserId, string RoleId);
        List<sp_GetNoticeStatusList_Result> GetnoticestatusByFirmId(string firmid);
        //Added new interface below by Abhishek on 13/12/22
        List<sp_GetNoticeStatusDetailList_Result> GetnoticestatusDetailByFirmId(string firmid);
        Message savenoticestatus(string subjectname);
        Message deleteNoticeStatus(string id);
        sp_GetSenderDetailsBySenderId_Result GetSenderDetailBySenderId(string senderId);
        List<usp_GetNoticeReceiverDetailsById_Result> GetNoticeReceiverDetailListByID(string noticeID);
        Message SavenoticeDetils(Notice notice, string Noticeids, string moduletype);
        Message SavenoticeDetilsForModeOfDelevery(Notice notice, string Noticeids, string moduletype, DateTime? dateofdispatch, DateTime? noticepostdate);
        Message SaveOtherDetailsOfReceiver(string NoticeId, string LoginNoticeId, string ReceiverEmails, string ReceiverPhone, string SecondAddress);
        List<sp_Getmailaudit_Result> Getmailaudit(string noticeid);
        List<sp_GetReceiverEmailsByNoticeId_Result> GetReceiverEmailsByNoticeId(string noticeid);
        dynamic ViewDeleiveryModeByNoticeId(string Noticeids);
        sp_GetDocumentDetailsByNoticeId_Result GetDocumentDetailByNoticeId(string NoticeId);
        dynamic GetDeleteNotice(string UserId, int PageNumber, int PageSize, string RoleId, string NoticeStatus, string fromreminder, string noticeid, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch);
        bool FinalDeleteNotice(string NoticeID);
        dynamic ViewPostDetilsByNoticeId(string Noticeids);
        dynamic GetReceivedDraftNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                      string RoleId, string notistatus, string firmid, string NoticeId, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch);
        Message DeleteDispatchDetail(string NoticeId, string FirmId);
        Message ViewMoreSetAlert(string id, string param, string firmid);
        dynamic GetSetAlertDetails(string NoticeId, string TypeofNotices, string FirmId);
    }
}
