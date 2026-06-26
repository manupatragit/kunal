using BussinessLogic.BusinessEntity;
using System.Collections.Generic;

namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmEventBusinessRepository
    {
        bool AddEvent(List<FirmData> data, string firmId, string     userId);
        bool DeleteEvent(string caseid);
    }
}
