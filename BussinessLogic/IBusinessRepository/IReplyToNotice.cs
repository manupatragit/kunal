using LawPracticeFirm.BusinessEntity;
using NoticeManagement.BusinessLayer.BusinessEntity;

namespace NoticeManagement.BusinessLayer.IBusinessRepository
{
    public interface IReplyToNotice
    {
        Message SaveReplyToNotice(ReplyToNotice replytonotice, string replySubjectText);
        dynamic GetReplyToNoticeDraftList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId);
        dynamic GetReplyToNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string mainnoticeid);
        dynamic GetReplyToNoticeListByNoticeId(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string parentId);
    }
}
