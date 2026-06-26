using System.Collections.Generic;
using BussinessLogic.BusinessEntity;

namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmCaseBusinessRepository
    {
        bool AddCase(List<FirmData> data, string firmId);
        bool DeleteCase(string caseid);
    }
}
