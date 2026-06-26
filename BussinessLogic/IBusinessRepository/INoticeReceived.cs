using LawPracticeFirm.BusinessEntity;
using NoticeManagement.BusinessLayer.BusinessEntity;
namespace NoticeManagement.BusinessLayer.IBusinessRepository
{
    public interface INoticeReceived
    {
        Message SaveReceivedNotice(RejoinderNotice rejoinderNotice);
        dynamic GetClientNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder, string clientid);
        dynamic GetReceivedNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
          string RoleId, string firmid, string noticeid, string fromdaterange, string startdate, string enddate, string fromreminder,
          string noticesubjectsrch, string noticetpesrch, string noticestatussrch, string notisendernamesrch, string casestatusfilter, string IsArchived);
        dynamic GetReceivedNoticeSettled(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder);
        dynamic GetReceivedNoticeConvertToCase(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize, string RoleId, string firmid, string NoticeId, string fromdaterange, string startdate, string enddate, string fromreminder);
        dynamic GetDeleteReceivedNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
           string RoleId, string firmid, string noticeid, string fromdaterange, string startdate, string enddate, string fromreminder,
           string noticesubjectsrch, string noticetpesrch, string noticestatussrch, string notisendernamesrch, string casestatusfilter);
    }
}
