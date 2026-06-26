using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataAccess.Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using Newtonsoft.Json;

namespace LawApiPractice
{
    public class EmployeeSecurity
    {

      
            public static bool Login(string username, string password)
            {
                using (LawPracticeEntities entities = new LawPracticeEntities())
                {
                    return entities.FirmUsers.Any(user =>
                           user.UserName.Equals(username, StringComparison.OrdinalIgnoreCase)
                                              && user.Password == password);
                }
            }


        
    }
}