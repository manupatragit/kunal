using System;
using System.Collections.Generic;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using Newtonsoft.Json;

namespace BussinessLogic.BusinessRepository
{
    public class FirmEventBusinessRepository : IFirmEventBusinessRepository
    {
        public bool AddEvent(List<FirmData> data, string firmId, string userId)
        {
            throw new NotImplementedException();
        }

        public bool DeleteEvent(string caseid)
        {
            throw new NotImplementedException();
        }
    }
}
