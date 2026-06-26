using System.Collections.Generic;
using BussinessLogic.BusinessEntity;
namespace BussinessLogic.IBusinessRepository
{
    public interface IConfigurationBusinessRepository
    {
        List<CustomField> CustomFieldList();
        List<CustomField> CustomformCustomFieldList();
        List<CustomField> CustomCaseList();
        List<FirmCustomField> FirmCustomFieldList(string firmId, long configurationtype, string formId = "");
        bool AddFirmCustomFieldList(FirmCustomFieldList obj, long configurationtype, string firmId);
        bool UpdateFirmCustomFieldList(FirmInputData data, FirmEmployee user, int configurationtype, long id = 0);
        void GetCustomFormName(string firmId, string formId, FirmCustomFieldList obj);
    }
}
