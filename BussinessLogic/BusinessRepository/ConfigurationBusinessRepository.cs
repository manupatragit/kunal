using System;
using System.Collections.Generic;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using CustomField = BussinessLogic.BusinessEntity.CustomField;

namespace BussinessLogic.BusinessRepository
{
    public class ConfigurationBusinessRepository : IConfigurationBusinessRepository
    {
        public List<CustomField> CustomFieldList()
        {
            var repository = new CustomFieldPocoRepository();
            return repository.All().Where(w => w.IsActive == true).OrderBy(o => o.Text).ToList().ConvertAll(c => new CustomField
            {
                Id = c.Id,
                DefaultValues = string.IsNullOrEmpty(c.DefaultValues) ? string.Empty : c.DefaultValues.Trim(),
                Formatter = c.Formatter,
                Text = c.Text,
                Url = c.Url
            });
        }
        /// <summary>
        /// Add firm custom field details
        /// </summary>
        /// <param name="reqobj"></param>
        /// <param name="configurationtype"></param>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public bool AddFirmCustomFieldList(FirmCustomFieldList reqobj, long configurationtype, string firmId)
        {
            var repository = new FirmConfiguredCustomFieldPocoRepository();
            var list = reqobj.CustomFieldList;
            var formId = Convert.ToString(reqobj.FormId);
            long[] elist = null;
            if (configurationtype != 6)
            {
                // elist = repository.All().Where(w => w.IsActive && w.FirmId == firmId && w.ConfigurationType == configurationtype).Select(s => s.Id).ToArray();
            }
            else
            {

                // elist = repository.All().Where(w => w.IsActive && w.FirmId == firmId && w.ConfigurationType == configurationtype && w.SubConfigurationType== formId).Select(s => s.Id).ToArray();
            }


            var nlist = list.Select(s => s.Id).ToArray();
            var intersect = elist.Except(nlist);

            using (var transaction = repository.Context.Database.BeginTransaction())
            {
                try
                {
                    if (configurationtype == 6)
                    {
                        var customForm = new FirmCustomFormPocoRepository();
                        var f = customForm.All().FirstOrDefault(w => w.Firmid.ToString() == firmId.ToString() && w.Id.ToString() == reqobj.FormId.ToString());
                        if (f == null)
                        {
                            var form = repository.Context.Set<FirmCustomForm>().Add(new FirmCustomForm
                            {
                                Firmid = Guid.Parse(firmId.ToString()),
                                FormName = reqobj.FormName,
                                IsActive = true
                            });
                            repository.Context.SaveChanges();

                        }
                        else
                        {
                            var nf = customForm.All().FirstOrDefault(w => w.Firmid.ToString() == firmId.ToString() && w.Id.ToString() != reqobj.FormId.ToString() && w.FormName.Trim().ToUpper() == reqobj.FormName.ToUpper());
                            if (nf == null)
                            {
                                f.FormName = reqobj.FormName.Trim();
                                f.IsPublished = reqobj.IsPublished;
                                customForm.Update(f);
                            }
                        }
                    }

                    foreach (var item in list)
                    {
                        if (item.Id < 0)
                        {
                            var obj = new FirmConfiguredCustomField
                            {
                                ConfigurationType = configurationtype,
                                FieldName = item.FieldName,
                                FieldType = item.FieldType,
                                Firmid = Guid.Parse(firmId.ToString()),
                                IsRequired = item.IsRequired,
                                MaxLength = item.MaxLength,
                                MinLength = item.MinLength,
                                Sequence = item.Sequence,
                                IsActive = true,
                                SubConfigurationType = (configurationtype == 6 ? formId : null),
                                IsDefault = false
                            };
                            if (string.IsNullOrEmpty(item.FieldValues))
                            {
                                obj.FieldValues = item.FieldValues.Trim();
                            }
                            repository.Context.Set<FirmConfiguredCustomField>().Add(obj);
                        }
                        else
                        {
                            var d = repository.All().FirstOrDefault(w => w.IsActive && w.Id.ToString() == item.Id.ToString());
                            if (d != null)
                            {
                                if (d.Sequence != item.Sequence)
                                {
                                    d.Sequence = item.Sequence;
                                    repository.Update(d);
                                }
                            }
                        }
                    }

                    foreach (var i in intersect)
                    {
                        var d = repository.All().FirstOrDefault(w => w.IsActive && w.Id.ToString() == i.ToString());
                        if (d != null)
                        {
                            d.IsActive = false;
                            repository.Update(d);
                        }
                    }

                    repository.Context.SaveChanges();

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    return false;
                }
            }
            return true;


        }
        /// <summary>
        /// Update firm custom field detail
        /// </summary>
        /// <param name="data"></param>
        /// <param name="user"></param>
        /// <param name="configurationtype"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool UpdateFirmCustomFieldList(FirmInputData data, FirmEmployee user, int configurationtype, long id = 0)
        {
            var repo = new FirmInformationDetailPocoRepository();
            foreach (var item in data.Data)
            {
                var t = Convert.ToInt32(item.ConfigurationType);
                var d = repo.All().FirstOrDefault(w => w.RefId == item.RefId && w.CustomFieldId == item.CustomFieldId && w.ConfType == t);
            }
            return true;
        }
        /// <summary>
        /// Firm Custom Field List
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="configurationtype"></param>
        /// <param name="formId"></param>
        /// <returns></returns>
        public List<FirmCustomField> FirmCustomFieldList(string firmId, long configurationtype, string formId = "")
        {
            var repository = new ModuleFieldInformationPocoRepository();
            var data = new List<ModuleFieldInformation>();
            if (configurationtype == 6)
            {
                //  data = repository.All().Where(w => w.Firmid.ToString() == firmId && w.ConfigurationType == configurationtype && w.SubConfigurationType==formId).OrderBy(o => o.Sequence).ToList();
            }
            else
            {
                // data = repository.All().Where(w => w.Firmid.ToString() == firmId && w.ConfigurationType == configurationtype).OrderBy(o => o.Sequence).ToList();
            }

            var d = data.ConvertAll(c => new FirmCustomField
            {
                Id = c.Id,
                ConfigurationType = c.ConfigurationType,
                FieldName = c.FieldName,
                FieldType = c.FieldType,
                Formatter = string.IsNullOrEmpty(c.Formatter) ? "" : c.Formatter.Trim(),
                IsRequired = c.IsRequired,
                MaxLength = c.MaxLength,
                MinLength = c.MinLength,
                Sequence = c.Sequence,
                FieldValues = string.IsNullOrEmpty(c.DefaultValues) ? "" : c.DefaultValues.Trim(),
                IsDefault = c.IsDefault,
                SubConfigurationType = c.SubConfigurationType,
                IsSortable = c.IsPositionChangable,
                Url = string.IsNullOrEmpty(c.Url) ? "" : c.Url.Trim()
            });
            return d;

        }
        /// <summary>
        /// Get custom form name
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="formId"></param>
        /// <param name="obj"></param>
        public void GetCustomFormName(string firmId, string formId, FirmCustomFieldList obj)
        {
            var customForm = new FirmCustomFormPocoRepository();
            var f = customForm.All().FirstOrDefault(w => w.Firmid.ToString() == firmId.ToString() && w.Id.ToString() == formId.ToString() && w.IsActive);
            if (f != null)
            {
                obj.FormName = f.FormName;
                obj.FormId = firmId.ToString();
                obj.IsPublished = f.IsPublished;
            }
        }

        public List<CustomField> CustomCaseList()
        {

            throw new NotImplementedException();
        }
        /// <summary>
        /// Custom form Custom Field List
        /// </summary>
        /// <returns></returns>
        public List<CustomField> CustomformCustomFieldList()
        {
            var repository = new CustomFieldPocoRepository();
            return repository.All().Where(w => w.AvailableInWorkflow == true).OrderBy(o => o.Text).ToList().ConvertAll(c => new CustomField
            {
                Id = c.Id,
                DefaultValues = string.IsNullOrEmpty(c.DefaultValues) ? string.Empty : c.DefaultValues.Trim(),
                Formatter = c.Formatter,
                Text = c.Text,
                Url = c.Url
            });
        }
    }
}
