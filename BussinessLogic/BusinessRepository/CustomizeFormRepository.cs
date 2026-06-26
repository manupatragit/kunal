using BussinessLogic.BusinessEntity;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomField = DataAccess.Modals.CustomField;

namespace BussinessLogic.BusinessRepository
{
    public class CustomizeFormRepository : ICustomizeForm
    {
        private LawPracticeEntities db;
        public CustomizeFormRepository(LawPracticeEntities noticeEntity)
        {
            this.db = noticeEntity;
        }

        public bool matterremovefield(string uid, string ctype, string cid)
        {
            FirmCustomField ft = new FirmCustomField();
#pragma warning disable CS0219 // The variable 'tq' is assigned but its value is never used
            var tq = "";
#pragma warning restore CS0219 // The variable 'tq' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'cname' is assigned but its value is never used
            string cname = "1";
#pragma warning restore CS0219 // The variable 'cname' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'idt' is assigned but its value is never used
            var idt = 0;
#pragma warning restore CS0219 // The variable 'idt' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'cdt' is assigned but its value is never used
            var cdt = 0;
#pragma warning restore CS0219 // The variable 'cdt' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'rs' is assigned but its value is never used
            string rs = "0";
#pragma warning restore CS0219 // The variable 'rs' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'rs2' is assigned but its value is never used
            string rs2 = "0";
#pragma warning restore CS0219 // The variable 'rs2' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'colname' is assigned but its value is never used
            var colname = "";
#pragma warning restore CS0219 // The variable 'colname' is assigned but its value is never used

            var result = db.usp_RemoveFirmConfiguredCustomFields_api(cid.ToString());
            var rwsult1 = db.insertdeleteentrytable(Guid.Parse(cid), "FirmConfiguredCustomFields", Guid.Parse(uid));

            return true;
        }

        /// <summary>
        /// Get cusom field list
        /// </summary>
        /// <returns></returns>
        public List<CustomField> CustomFieldList()
        {
            return db.CustomFields.Where(w => w.IsActive == true).OrderBy(o => o.Text).ToList().ConvertAll(c => new CustomField
            {
                Id = c.Id,
                DefaultValues = string.IsNullOrEmpty(c.DefaultValues) ? string.Empty : c.DefaultValues.Trim(),
                Formatter = c.Formatter,
                Text = c.Text,
                Url = c.Url
            });
        }

        public bool publish(string uid, int ctype)
        {
            bool output = false;
            try
            {
                var result = db.usp_SaveFirmConfiguredCustomFields(uid.ToString(), ctype.ToString(), 1, 1);
                output = true;
            }
            catch
            {
            }

            return output;
        }

        /// <summary>
        /// Get custom field count
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public string customfieldcount(string firmid, string ctype)
        {
            FirmCustomField ft = new FirmCustomField();
            var data = db.usp_GetNotActiveFirmConfiguredCustomFields(firmid, ctype);
            var a = JsonConvert.SerializeObject(data);
            return a;
        }
        /// <summary>
        /// Get firm custom field details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="rty"></param>
        /// <param name="noticeid"></param>
        /// <returns></returns>
        public string FirmGetCustomField(string firmid, string rty, string noticeid)
        {
            var datas = db.usp_GetFirmConfiguredCustomFieldsNotice(firmid, rty, noticeid).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Reset custom field
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public string ResetCF(string firmid, string userid, int ctype)
        {
            var datas = db.Usp_ResetCustomFieldData(firmid, userid, ctype);
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Save custom feild firm
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        public void savefirmcustom(FirmConfiguredCustomField fm, string firmid)
        {
            FirmConfiguredCustomField cf = new FirmConfiguredCustomField();
            var chsqeq = db.usp_GetFirmConfiguredCustomFieldsNotice(firmid, fm.ConfigurationType.ToString(), "").OrderByDescending(z => z.Sequence).FirstOrDefault();
            if (chsqeq != null)
            {
                cf.Sequence = chsqeq.Sequence + 1;
            }
            else
            {
                cf.Sequence = 1;
            }
            cf.Firmid = Guid.Parse(firmid);

            cf.ConfigurationType = fm.ConfigurationType;
            cf.SubConfigurationType = fm.SubConfigurationType;
            cf.FieldType = fm.FieldType;
            cf.FieldName = fm.FieldName;
            cf.FieldValues = fm.FieldValues;
            cf.IsRequired = fm.IsRequired;
            cf.MinLength = fm.MinLength;
            cf.MaxLength = fm.MaxLength;
            cf.IsDefault = fm.IsDefault;
            cf.IsPositionChangable = fm.IsPositionChangable;
            cf.IsActive = fm.IsActive;

            db.FirmConfiguredCustomFields.Add(cf);
            try
            {
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
        }
        /// <summary>
        /// Save customize field column map
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="column_no"></param>
        /// <param name="column_name"></param>
        /// <param name="pid"></param>
        /// <param name="ftype"></param>
        public void SaveCustomizeFieldColMap(string firmid, string userid, string column_no, string column_name, string pid, int? ftype)
        {

            try
            {
                var inserrcol = db.Usp_SaveCaseColumnMapNotice(firmid, userid, column_no, column_name, pid, ftype);
            }
            catch (Exception ex)
            {
                var excep = ex.Message;
            }
        }
        /// <summary>
        /// Get customize header name detail
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="rty"></param>
        /// <returns></returns>
        public string GetHeaderNameCustomizeCol(string firmid, string rty)
        {
            var datas = db.usp_GetFirmConfiguredCustomFieldsNotice(firmid, rty, "").Where(x => x.IsActive == true).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;

        }
        /// <summary>
        /// Mapping column
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string spcolmap1(string uid, string id)
        {
            var sp = db.GetColMaps(Guid.Parse(uid), Convert.ToInt32(id)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Get custom field version
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ModuleType"></param>
        /// <returns></returns>
        public string CustomFieldVersion(string firmid, string userid, string ModuleType)
        {
            var list = db.usp_GetCustomFieldHistory(firmid, userid, ModuleType).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get custom field header history details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ModuleType"></param>
        /// <param name="vdate"></param>
        /// <returns></returns>
        public string CustomFieldHistoryHeader(string firmid, string userid, string ModuleType, string vdate)
        {

            var list = db.usp_GetCustomFieldColumnHistory(firmid, userid, ModuleType, vdate).ToList();

            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Customm field history
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="vdate"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="ModuleType"></param>
        /// <returns></returns>
        public string CustomFieldHistory(string firmid, string userid, string vdate, int pagenum, int pagesize, string ModuleType)
        {
            var list = db.usp_GetCustomFieldDataHistory(firmid, userid, ModuleType, vdate, pagenum, pagesize).ToList();

            var a = JsonConvert.SerializeObject(list);
            return a;
        }


    }

}
