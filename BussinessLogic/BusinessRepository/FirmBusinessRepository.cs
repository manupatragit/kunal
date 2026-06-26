using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using Newtonsoft.Json;

namespace BussinessLogic.BusinessRepository
{
    public class FirmBusinessRepository : Adddata
    {
        /// <summary>
        /// Get firm name list details
        /// </summary>
        /// <returns></returns>
        public List<string> FirmNamesList()
        {
            var company = new FirmPocoRepository();
            var firm = company.All().Where(w => w.IsActive).Select(s => s.FirmCode).ToList();
            return firm;
        }
        /// <summary>
        /// Add firm detail
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        public bool AddFirm(FirmDetail info)
        {
            var result = true;
            var company = new FirmPocoRepository();
            using (var context = company.Context)
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        var firm = context.Set<Firm>().Add(new Firm
                        {
                            FirmCode = info.FirmCode.ToUpper(),
                            FirmTitle = info.FirmLabel.ToUpper(),
                            FirmName = info.FirmName.ToUpper(),
                            IsActive = true
                        });
                        context.SaveChanges();

                        SetCompanyDefaultConfiguration(context, firm.Id.ToString());
                        context.SaveChanges();

                        var user = context.Set<FirmUser>().Add(new FirmUser
                        {
                            UserName = info.AdminUser.UserName,
                            Password = info.AdminUser.Password,
                            DefaultController = info.AdminUser.DefaultController,
                            DefaultAction = info.AdminUser.DefaultAction,
                            Firmid = Guid.Parse(firm.Id.ToString()),
                            IsFirmAdmin = true,
                            IsActive = true
                        });
                        context.SaveChanges();

                        setadminUserDetails(context, firm, user, info.AdminUser);


                        context.SaveChanges();

                        transaction.Commit();

                        firm = company.All().FirstOrDefault(c => c.Id == firm.Id);
                        firm.AdminUser = Convert.ToInt32(user.Id);
                        company.Update(firm);
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
        /// <summary>
        /// Get firm detail by name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public FirmDetail FirmDetails(string name)
        {
            var company = new FirmPocoRepository();
            var firm = company.All().FirstOrDefault(f => f.FirmCode.ToUpper() == name.ToUpper());
            if (firm == null)
            {
                return null;
            }
            return new FirmDetail
            {

                FirmCode = firm.FirmCode,
                FirmLabel = firm.FirmTitle,
                FirmName = firm.FirmName,
                FirmBriefDetails = "Facilis ipsum reprehenderit nemo molestias. Aut cum mollitia reprehenderit. Eos cumque dicta adipisci architecto culpa amet.",
                FirmDetails = "",
                FirmContactInformation = "b-37, Sector 1,Noida, UP, India",
                FirmContactEmail = string.Concat("info@", firm.FirmCode, ".com"),
            };

        }

        public bool UpdateFirm(FirmDetail info)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Update firm input data
        /// </summary>
        /// <param name="data"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool UpdateFirmInputData(FirmInputData data, long userId = 0)
        {
            var repo = new FirmInformationDetailPocoRepository();
            foreach (var item in data.Data)
            {
                var t = Convert.ToInt32(item.ConfigurationType);
                var d = repo.All().FirstOrDefault(w => w.RefId == item.RefId && w.CustomFieldId == item.CustomFieldId && w.ConfType == t);
                if (d == null)
                {
                    repo.Create(new FirmInformationDetail
                    {
                        ConfType = t,
                        CreatedOn = DateTime.Now,
                        CustomFieldId = item.CustomFieldId,
                        RefId = item.RefId,
                        UpdatedOn = DateTime.Now,
                        Value = item.DataValue
                    });
                }
                else
                {
                    if (!string.Equals(d.Value.Trim(), item.DataValue.Trim()))
                    {
                        d.Value = item.DataValue;
                        d.UpdatedOn = DateTime.Now;
                        repo.Update(d);
                    }
                }
            }
            return true;
        }
        /// <summary>
        /// Get firm input data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="confId"></param>
        /// <param name="uid"></param>
        /// <param name="isPublished"></param>
        /// <returns></returns>
        public string GetFirmInputData(string firmId, long confId, long uid = 0, bool isPublished = false)
        {
            if (confId == 6)
            {
                var u = new FirmCustomFormPocoRepository();
                var d = isPublished ? u.All().Where(w => w.IsActive && w.Firmid.ToString() == firmId.ToString() && w.IsPublished).ToList() : u.All().Where(w => w.IsActive && w.Firmid.ToString() == firmId.ToString()).ToList();

                var a = JsonConvert.SerializeObject(d);
                return a;
            }
            else
            {
                var u = new FirmPocoRepository();
                var d = u.ExecuteCustomProcedure("GetInformationDetails", new Dictionary<object, object> { { "uid", uid }, { "fid", firmId }, { "confType", confId }, { "orderBy", string.Empty } });
                var a = JsonConvert.SerializeObject(uid > 0 ? d.FirstOrDefault() : d);
                return a;
            }
        }
        /// <summary>
        /// Get specific firm input data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="confId"></param>
        /// <param name="scId"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string GetSpecificFirmInputData(string firmId, long confId, string scId, string uid = "")
        {
            if (!string.IsNullOrEmpty(uid))
            {
                uid = string.Concat("'", uid.Replace(",", "','"), "'");
            }

            var u = new FirmPocoRepository();
            var d = u.ExecuteCustomProcedure("GetInformationDetailsBySubConfiguration", new Dictionary<object, object> { { "uid", (string.IsNullOrEmpty(uid) ? string.Empty : uid) }, { "scid", scId }, { "fid", firmId }, { "confType", confId }, { "orderBy", string.Empty } });
            var a = JsonConvert.SerializeObject(d);
            return a;
        }
        /// <summary>
        /// Get user specific firm input
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="confId"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string GetUserSpecificFirmInputData(string firmId, long confId, string uid)
        {
            if (confId == 6)
            {
                var u = new FirmCustomFormPocoRepository();
                var d = u.All().Where(w => w.IsActive && w.Firmid.ToString() == firmId.ToString()).ToList();
                var a = JsonConvert.SerializeObject(d);
                return a;
            }
            else
            {
                var u = new FirmPocoRepository();
                var d = u.ExecuteCustomProcedure("GetUserSpecificInformationDetails", new Dictionary<object, object> { { "uid", (string.IsNullOrEmpty(uid) ? "0" : uid) }, { "fid", firmId }, { "confType", confId } });
                var a = JsonConvert.SerializeObject(d);
                return a;
            }

        }


        //mine api test

        public IEnumerable<AddContactsList> SelectAll1()
        {
            var db = new LawPracticeEntities();
            var d = db.AddContactsLists.ToList();
            return d;
        }

        public string SelectAll(string t)
        {
            var db = new LawPracticeEntities();
            ColMap dc = new ColMap();
            dc.column_no = t.ToString();
            db.ColMaps.Add(dc);
            db.SaveChanges();
            return "success";
        }

        public string GetDetails(string firmId, long id, int confType)
        {
            var d = GetFirmInputData(firmId, confType, id);
            return d;
        }
        /// <summary>
        /// Set default company configuration
        /// </summary>
        /// <param name="context"></param>
        /// <param name="firmid"></param>
        private void SetCompanyDefaultConfiguration(DbContext context, string firmid)
        {
            setworkinghours(context, firmid);
            new FirmDefaultCustomFieldPocorepository().All().OrderBy(o => o.ConfigurationType).ToList().ForEach(n => context.Set<FirmConfiguredCustomField>().Add(new FirmConfiguredCustomField
            {
                ConfigurationType = n.ConfigurationType,
                FieldName = n.FieldName,
                FieldType = n.FieldType,
                Firmid = Guid.Parse(firmid.ToString()),
                IsRequired = n.IsRequired,
                MaxLength = n.MaxLength,
                MinLength = n.MinLength,
                Sequence = n.Sequence,
                FieldValues = n.DefaultValues,
                SubConfigurationType = n.SubConfigurationType,
                IsPositionChangable = n.IsPositionChangable,
                IsActive = true,
                IsDefault = true
            }));
        }

        private void setworkinghours(DbContext context, string firmid)
        {
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Monday),
                StartTime = "09:00 AM",
                EndTime = "06:00 PM",
                FirmId = firmid,
            });
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Tuesday),
                StartTime = "09:00 AM",
                EndTime = "06:00 PM",
                FirmId = firmid,
            });
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Wednesday),
                StartTime = "09:00 AM",
                EndTime = "06:00 PM",
                FirmId = firmid,
            });
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Thursday),
                StartTime = "09:00 AM",
                EndTime = "06:00 PM",
                FirmId = firmid,
            });
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Friday),
                StartTime = "09:00 AM",
                EndTime = "06:00 PM",
                FirmId = firmid,
            });
            context.Set<FirmWorkingHour>().Add(new FirmWorkingHour
            {
                Day = Convert.ToInt32(DayOfWeek.Saturday),
                StartTime = "09:00 AM",
                EndTime = "01:00 PM",
                FirmId = firmid,
            });
        }

        private void setadminUserDetails(DbContext context, Firm firm, FirmUser user, FirmEmployee adminuser)
        {
            //foreach (var item in firm.FirmConfiguredCustomFields)
            //{
            //    item.FieldType
            //    if (item.ConfigurationType == Convert.ToInt32(Common.ModuleType.User) && item.FieldType == 15)
            //    {
            //        var n1 = context.Set<FirmInformationDetail>().Add(new FirmInformationDetail
            //        {
            //            CreatedOn = DateTime.Now,
            //            CustomFieldId = item.Id,
            //            UpdatedOn = DateTime.Now,
            //            RefId = user.Id,
            //            ConfType = Convert.ToInt32(Common.ModuleType.User),
            //            Value = string.Concat(adminuser.FirstName, "|", adminuser.MiddleName, "|", adminuser.LastName)
            //        });

            //    }

            //    if (item.ConfigurationType == Convert.ToInt32(Common.ModuleType.User) && item.FieldType == 14)
            //    {
            //        var e = context.Set<FirmInformationDetail>().Add(new FirmInformationDetail
            //        {
            //            CreatedOn = DateTime.Now,
            //            CustomFieldId = item.Id,
            //            UpdatedOn = DateTime.Now,
            //            RefId = user.Id,
            //            ConfType = Convert.ToInt32(Common.ModuleType.User),
            //            Value = adminuser.Email
            //        });

            //    }
            //}
        }
        /// <summary>
        /// Working hours
        /// </summary>
        /// <param name="firmWorkingHours"></param>
        /// <returns></returns>
        private List<WorkingHour> workingHour(ICollection<FirmWorkingHour> firmWorkingHours)
        {
            return firmWorkingHours.ToList().ConvertAll(w => new WorkingHour
            {
                Day = Enum.GetName(typeof(DayOfWeek), w.Day),
                StartTime = w.StartTime,
                EndTime = w.EndTime
            });
        }
    }
}
