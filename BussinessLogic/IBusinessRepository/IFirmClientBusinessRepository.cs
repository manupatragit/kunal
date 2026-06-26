using System;
using System.Collections.Generic;
using BussinessLogic.BusinessEntity;

namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmClientBusinessRepository
    {
        bool AddClient(FirmClientUser client, List<FirmData> data, string firmId);
        bool DeleteClient(string clientid);
        Tuple<string, string> GetInformation(string firmId, string userid);
    }
}
