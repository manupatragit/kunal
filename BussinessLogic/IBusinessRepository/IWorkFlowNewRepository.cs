using DataAccess.Modals;
using System.Collections.Generic;

namespace BussinessLogic.IBusinessRepository
{
    public interface IWorkFlowNewRepository
    {
        List<FirmUser> FirmUser(string uid);
        string FirmUserList(string uid);
        List<tblMatterHearing> MatterHearing(tblMatterHearing obj);
        string MatterListDetail(AddLawMatterList obj);
        string MatterListDetailbyclientid(AddLawMatterList obj, string role, string userid, string firmid);
        string ClientDetail(string uid, string firmid);
        string SaveProfile(RegUserTable obj, string email);
        string MatterListByUser(AddLawMatterList obj, int pagenum, int pagesize);
        string ChangePassword(FirmUser obj);
        string MatterListByClient(AddLawMatterList obj);
        string CalendarViewdata(AddLawMatterList obj);
        string CalendarViewdatafirmuserid(AddLawMatterList obj);
        string FirmRegistration(Firm obj, FirmUser obj1, string adminusername, string originalpass, string designation, string fname, string mname, string lname, string orgnisationsize, string orgnisationtype, string adminmobile);
    }
}