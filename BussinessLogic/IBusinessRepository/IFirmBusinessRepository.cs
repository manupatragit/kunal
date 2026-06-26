using System.Collections.Generic;
using BussinessLogic.BusinessEntity;
using DataAccess.Modals;
namespace BussinessLogic.IBusinessRepository
{
    public interface Adddata
    {
        FirmDetail FirmDetails(string name);
        List<string> FirmNamesList();
        bool AddFirm(FirmDetail info);
        bool UpdateFirm(FirmDetail info);
        bool UpdateFirmInputData(FirmInputData data, long userId = 0);
        string GetFirmInputData(string firmId, long confId, long uid = 0, bool isPublished = false);
        string GetSpecificFirmInputData(string firmId, long confId, string scId, string uid = "");
        string GetUserSpecificFirmInputData(string firmId, long confId, string uid);
        string GetDetails(string firmId, long id, int confType);
        IEnumerable<AddContactsList> SelectAll1();
        string SelectAll(string t);
    }
}
