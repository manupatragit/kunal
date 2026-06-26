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
    public class FirmClientBusinessRepository : IFirmClientBusinessRepository
    {
        /// <summary>
        /// Add cleint detail
        /// </summary>
        /// <param name="client"></param>
        /// <param name="data"></param>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public bool AddClient(FirmClientUser client, List<FirmData> data, string firmId)
        {
            var result = true;
            var u = new FirmUserPocoRepository();
            var exist = u.All().FirstOrDefault(w => w.UserName.ToUpper() == client.UserName.ToUpper() && w.Firmid.ToString() == firmId.ToString());
            if (exist != null)
            {
                result = false;
            }
            else
            {
                using (var context = u.Context)
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            var user = context.Set<FirmUser>().Add(new FirmUser
                            {
                                UserName = client.UserName,
                                Password = client.Password,
                                Firmid = Guid.Parse(firmId.ToString()),
                                IsActive = true,
                                IsFirmClient=true,
                                IsFirmAdmin=false,
                                DefaultAction=client.DefaultAction,
                                DefaultController=client.DefaultController
                            });
                            context.SaveChanges();

                            foreach (var item in data)
                            {
                                context.Set<FirmInformationDetail>().Add(new FirmInformationDetail
                                {
                                    CreatedOn = DateTime.Now,
                                    CustomFieldId = item.CustomFieldId,
                                    UpdatedOn = DateTime.Now,
                                    RefId = Convert.ToInt32(user.Id),
                                    ConfType = Convert.ToInt32(Common.ModuleType.User),
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
            }
            return result;
        }

        public bool DeleteClient(string clientid)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Get information
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public Tuple<string, string> GetInformation(string firmId, string userid)
        {
            var userpoco = new FirmUserPocoRepository();
            var client = userpoco.All().FirstOrDefault(c => c.Id.ToString() == userid.ToString() && c.IsActive && c.IsFirmClient && c.Firmid.ToString() == firmId.ToString());
            if (client == null)
            {
                return new Tuple<string, string>(string.Empty, string.Empty);
            }


            var u = new FirmUserPocoRepository();
            var d = u.ExecuteCustomProcedure("GetInformationDetails", new Dictionary<object, object> { { "uid", client.Id }, { "fid", firmId }, { "confType", Convert.ToInt32(ModuleType.Client) }, { "orderBy", string.Empty } });
            var a = JsonConvert.SerializeObject(userid != "0" ? d.FirstOrDefault() : d);


            return new Tuple<string, string>(client.UserName, a);
        }
    }
}
