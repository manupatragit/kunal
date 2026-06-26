using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using NoticeManagement.BusinessLayer.BusinessEntity;
using System.Collections.Generic;

namespace NoticeManagement.BusinessLayer.IBusinessRepository
{
    public interface IRejoinderNotice
    {
        Message SaveRejoinderNotice(RejoinderNotice notice, string NoticeThroughId, string rejoinderSubjectName);
        List<usp_GetRejoinderNoticeListByNoticeId_Result> GetRejoinderNoticeListByNoticeId(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string noticeid, string firmid);
        dynamic GetRejoinderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
            string RoleId, string noticeid, string RejoinderInitiateBy, string notistatus, string firmid, string sendernamesrh, string subjecttypesrch, string noticetypesrch);
        dynamic GetDraftRejoinderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string RejoinderInitiateBy, string firmid);
    }
}
