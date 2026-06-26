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
    public class FirmTaskBusinessRepository : IFirmTaskBusinessRepository
    {
        /// <summary>
        /// Add task
        /// </summary>
        /// <param name="data"></param>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="parentTaskId"></param>
        /// <returns></returns>
        public bool AddTask(List<FirmData> data, string firmId,string userId,long parentTaskId=0)
        {
            var result = true;
            var u = new FirmTaskPocoRepository();
            using (var context = u.Context)
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        var c = context.Set<FirmTask>().Add(new FirmTask
                        {
                            FirmId = firmId,
                            UserId= userId,
                            ParentTaskId=parentTaskId,
                            IsActive = true
                        });
                        context.SaveChanges();

                        foreach (var item in data)
                        {
                            context.Set<FirmInformationDetail>().Add(new FirmInformationDetail
                            {
                                CreatedOn = DateTime.Now,
                                CustomFieldId = item.CustomFieldId,
                                UpdatedOn = DateTime.Now,
                                RefId = c.Id,
                                ConfType = Convert.ToInt32(ModuleType.Task),
                                Value = item.DataValue
                            });
                        }
                        context.SaveChanges();
                        transaction.Commit();
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        result = false;
                    }
                }
            }

            return result;
        }

        public bool DeleteTask(string caseid)
        {
            throw new NotImplementedException();
        }
    }
}
