using BussinessLogic.BusinessEntity;
using System.Collections.Generic;

namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmTaskBusinessRepository
    {
        bool AddTask(List<FirmData> data, string firmId, string userId, long parentTaskId = 0);
        bool DeleteTask(string caseid);
    }
}
