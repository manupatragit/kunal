using System;
using System.Collections.Generic;
using BussinessLogic.BusinessEntity;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;

namespace BussinessLogic.BusinessRepository
{
    public class FirmCaseBusinessRepository : IFirmCaseBusinessRepository
    {
        /// <summary>
        /// Add new case
        /// </summary>
        /// <param name="data"></param>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public bool AddCase(List<FirmData> data, string firmId)
        {
            var result = true;
            var u = new FirmCasePocoRepository();
            using (var context = u.Context)
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        var c = context.Set<FirmCas>().Add(new FirmCas
                        {
                            FirmId = firmId,
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
                                ConfType = Convert.ToInt32(Common.ModuleType.Case),
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

        public bool DeleteCase(string caseid)
        {
            throw new NotImplementedException();
        }
    }
}
