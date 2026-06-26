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
    public class FirmUserBusinessRepository : IFirmUserBusinessRepository
    {
        public bool ForgotPassword(string emailAddress, string firmCode)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// User login details
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="key"></param>
        /// <param name="firmCode"></param>
        /// <returns></returns>
        public FirmEmployee Login(string userid, string password, string key, string firmCode)
        {
            var db = new LawPracticeEntities();

            var userpoco = new FirmUserPocoRepository();
            var user = db.usp_LoginDetails(userid, password, key, firmCode).FirstOrDefault();
            if (user == null)
            {

                //check userid
                var chkuseractive = db.FirmUsers.Where(x => x.UserName == userid && x.Password == password).FirstOrDefault();
                if (chkuseractive != null)
                {
                    bool statusactive = chkuseractive.IsActive;
                    if (statusactive == false)
                    {
                        throw new ValidationException("User id is not Activated.");
                    }
                }
                else
                {
                    throw new ValidationException("Login Id or Password Mismatch!!");
                }
            }
            else
            {
                if (user.Password != password)
                {
                    throw new ValidationException("Password not matched!!");
                }
            }

            var rolesname = db.Roles.Where(x => x.ID == user.RoleId).FirstOrDefault();

            // Hierarchy: load UserLevel (usp_LoginDetails_Result already has this column)
            int userLevel = user.UserLevel ?? 1;

            return new FirmEmployee
            {
                UserId = user.UserId,
                FirmCode = user.FirmCode,
                UserPhoto = user.cphoto,
                UserFullName = user.cfname,
                RoleId = Convert.ToInt32(user.RoleId),
                RoleName = rolesname.RoleName,
                IsAdmin = Convert.ToBoolean(user.IsAdmin),
                IsClient = Convert.ToBoolean(user.IsClient),
                UserName = user.UserName,
                FirmId = Guid.Parse(user.Firmid.ToString()),
                DefaultController = user.DefaultController,
                DefaultAction = user.DefaultAction,
                Packmodule = user.PackModule.ToString(),
                Details = UserProfile(user.Firmid.ToString(), user.UserId.ToString(), ModuleType.User.ToString()),
                FirstName = user.FirstName,
                IsCaseWatchUser=user.IsCaseWatchUser,
                UserLevel = userLevel,   // Hierarchy: load user's hierarchy level via raw SQL
            };

        }

        public bool Registration(string userid, string password, string emailAddress, string firmCode)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// User case
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="confId"></param>
        /// <returns></returns>
        public List<Case> UserCases(long userid, long confId)
        {
            //var casepoco = new FirmDetailedInformationPocoRepository();

            //var x = casepoco.All().Where(u => u.RefId == userid).ToList();
            //if (x.Count != 0)
            //{
            //    var b = x.GroupBy(g => new {g.CustomFieldId, g.FieldType, g.FieldName }).ToList().ConvertAll(s => new Case
            //    {
            //        CaseId=s.Select(w=>w.Id).FirstOrDefault(),
            //        FieldDetails = new FieldDetails
            //        {
            //            CustomFieldId = s.Key.CustomFieldId,
            //            FieldType = s.Key.FieldType,
            //            FieldName = s.Key.FieldName,
            //            IsRequired = s.Select(w => w.IsRequired).FirstOrDefault(),
            //            Formatter = s.Select(w => w.Formatter).FirstOrDefault(),
            //            DefaultValues = s.Select(w => w.DefaultValues).FirstOrDefault(),
            //            MaxLength = s.Select(w => w.MaxLength).FirstOrDefault(),
            //            MinLength = s.Select(w => w.MinLength).FirstOrDefault(),
            //            Info = s.Where(w => w.CustomFieldId == s.Key.CustomFieldId).ToList().ConvertAll(i => new InformationDetails
            //            {
            //                DetailId = i.CaseDetailId,
            //                Values = new Tuple<int, string>(i.CustomFieldSubId, i.Value)
            //            }).ToList()
            //        }
            //    }).ToList();
            //    return b;
            //}
            //else
            //{
            //    return new List<Case>();
            //}
            return new List<Case>();
        }

        public Tuple<string, string> GetUser(string firmId, string userid)
        {
            var userpoco = new FirmUserPocoRepository();
            var user = userpoco.All().FirstOrDefault(u => u.Id.ToString() == userid.ToString() && u.IsActive && u.Firmid.ToString() == firmId.ToString());
            if (user == null)
            {
                return new Tuple<string, string>(string.Empty, string.Empty);
            }

            var d = UserProfile(firmId.ToString(), user.Id.ToString(), ModuleType.User.ToString());
            return new Tuple<string, string>(user.UserName, d);
        }
        /// <summary>
        /// User profile
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="confId"></param>
        /// <returns></returns>
        public string UserProfile(string firmId, string userid, string confId)
        {
            var u = new FirmUserPocoRepository();
            var d = u.ExecuteCustomProcedure("GetInformationDetails", new Dictionary<object, object> { { "uid", userid }, { "fid", firmId }, { "confType", confId }, { "orderBy", string.Empty } });
            var a = JsonConvert.SerializeObject(userid.ToString() != "0" ? d.FirstOrDefault() : d);
            return a;
        }

        public bool ChangePassword(string userid, string currentpassword, string updatedpassword, string firmCode)
        {
            throw new NotImplementedException();
        }

        public bool ValidateEmail(string userid, string firmCode)
        {
            throw new NotImplementedException();
        }

        public List<Event> UserEvents(string userid, string confId)
        {
            throw new NotImplementedException();
        }

        public List<Task> UseTasks(string userid, string confId)
        {
            throw new NotImplementedException();
        }

        public List<Case> Clients(long confId)
        {
            throw new NotImplementedException();
        }

        /*Add new user*/
        public bool AddNewUser(FirmEmployee employee, List<FirmData> data, string firmId)
        {
            var result = true;
            var u = new FirmUserPocoRepository();
            var exist = u.All().FirstOrDefault(w => w.UserName.ToUpper() == employee.UserName.ToUpper() && w.Firmid.ToString() == firmId.ToString());
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
                                UserName = employee.UserName,
                                Password = employee.Password,
                                DefaultController = employee.DefaultController,
                                DefaultAction = employee.DefaultAction,
                                Firmid = Guid.Parse(firmId.ToString()),
                                IsActive = true,
                                IsFirmClient = false,
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



        public bool UpdateUser(FirmEmployee user, List<FirmData> data, string firmId, string userId)
        {
            throw new NotImplementedException();
        }

        public List<Case> UserCases(string userid, string confId)
        {
            throw new NotImplementedException();
        }

        public List<Case> Clients(string confId)
        {
            throw new NotImplementedException();
        }


    }
}
