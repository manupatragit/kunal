using DataAccess.Modals;
using LawPracticeFirm.BusinessEntity;
using IPRManagement.BusinessLayer.BusinessRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IPRManagement.BusinessLayer.BusinessEntity;
using DataAccess.IPRModel;

namespace IPRManagement.BusinessLayer.IBusinessRepository
//namespace IPRManagement.BussinessLogic.IBusinessRepository
{
    public interface Iipr
    {
        //Message saveipr(IPR iprlist);
        bool SaveAssignUser(string tradeMarkId, string applicationNo, string assignedUser, string firmId, string loggedInUserId, string tradeMarkIP);
        int RemoveUserAddedTradeMarkDetails(int iid, string userId, string firmId, string Ip);
        //List<usp_GetSharedIPRTrademark_Result> GetSharedIPRTrademark(string Userid, string firmid, string @class, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname);
        List<GetIPRShareTrademarkResponseModel> GetSharedIPRTrademark(string Userid, string firmid, string @class, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname, string dHearingDatefrom, string dHearingDateto);
        int RemoveShareTradeMarkDetails(int iid, string userId, string firmId, string Ip);
        List<GetSavedEmailModel> GetSavedEmail(string userId, string firmId, string tradeId);
    }

}
