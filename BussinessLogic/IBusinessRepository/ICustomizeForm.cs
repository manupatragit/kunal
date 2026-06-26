
using DataAccess.Modals;
using System.Collections.Generic;

namespace BussinessLogic.IBusinessRepository
{
    public interface ICustomizeForm
    {
        string FirmGetCustomField(string firmid, string rty, string noticeid);
        void savefirmcustom(FirmConfiguredCustomField fm, string firmid);
        string customfieldcount(string firmid, string ctype);
        string ResetCF(string firmid, string userid, int ctype);
        bool publish(string uid, int ctype);
        List<CustomField> CustomFieldList();
        bool matterremovefield(string uid, string ctype, string cid);
        void SaveCustomizeFieldColMap(string firmid, string userid, string column_no, string column_name, string pid, int? ftype);
        string GetHeaderNameCustomizeCol(string firmid, string rty);
        string spcolmap1(string uid, string id);
        string CustomFieldVersion(string firmid, string userid, string ModuleType);
        string CustomFieldHistoryHeader(string firmid, string userid, string ModuleType, string vdate);
        string CustomFieldHistory(string firmid, string userid, string vdate, int pagenum, int pagesize, string ModuleType);
    }
}
