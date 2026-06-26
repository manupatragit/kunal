using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Web.Configuration;
using QueryStringEDAES;
using DataAccess.Models;
using System.Data.Entity.Core.Objects;
using System.Text;
using System.Net;
using Newtonsoft.Json.Linq;
using LawPracticeFirm.Models;
using System.IO;
using NJDGDetail.Models;
using LawPracticeFirm;
using System.Web;
using System.Collections;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;
using BussinessLogic.Models;

namespace BussinessLogic.BusinessRepository
{
    public class MatterRepository : IMatterRepository
    {
        public List<AddContactsList> contactlist(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var contact = db.AddContactsLists.Where(x => x.Firmid.ToString() == uid.ToString()).ToList();
            // return new List<AddContactsList>();
            return contact;
        }
        /// <summary>
        /// Get matter list details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string matterlist(string firmid, string userid, int pagenum, int pagesize)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetMattersDetailByRowId_Result> list = new List<GetMattersDetailByRowId_Result>();
            list = db.GetMattersDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetMattersDetailByRowId_Result newItem = new GetMattersDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get matter
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string findmatterlist(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            //  var matter1 =db.AddLawMatterLists.Where(x => x.firmId == uids).ToList();
            List<GetSearchMattersDetailByRowId_Result> list = new List<GetSearchMattersDetailByRowId_Result>();
            list = db.GetSearchMattersDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetSearchMattersDetailByRowId_Result newItem = new GetSearchMattersDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get matter by matter id
        /// </summary>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string matterlistdata(string firmid)
        {
            var db = new LawPracticeEntities();
            List<GetMattersDetail_Result2> list = new List<GetMattersDetail_Result2>();
            list = db.GetMattersDetail(Guid.Parse(firmid)).ToList();
            foreach (var data in list.ToList())
            {
                GetMattersDetail_Result2 newItem = new GetMattersDetail_Result2();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get matter detail for client
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="clientid"></param>
        /// <param name="companyid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string matterlistforclient(string uid, string clientid, string companyid, string userid)
        {
            if (clientid == "" || clientid == null)
            {
                clientid = "00000000-0000-0000-0000-000000000000";
            }
            if (uid == "" || uid == null)
            {
                uid = "00000000-0000-0000-0000-000000000000";
            }
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetCaselistforclient(Guid.Parse(uid.ToString()), Guid.Parse(clientid), companyid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get matter list for client by id
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="clientid"></param>
        /// <param name="matterType"></param>
        /// <returns></returns>
        public string matterlistforclientbymtype(string uid, string clientid, string matterType)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_GetActiveOrArchiveCaselistforclient(Guid.Parse(uid.ToString()), Guid.Parse(clientid), matterType).ToList();
            var matterList = JsonConvert.SerializeObject(matter);
            return matterList;
        }
        /// <summary>
        /// Load call list detail
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="lid"></param>
        /// <returns></returns>
        public string leadcalllist(string firmid, string userid, string lid)
        {
            var db = new LawPracticeEntities();
            List<GetleadCalls_Result> list = new List<GetleadCalls_Result>();
            list = db.GetleadCalls(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(lid)).ToList();
            foreach (var data in list.ToList())
            {
                GetleadCalls_Result newItem = new GetleadCalls_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case time detail
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string timebycaselist(string firmid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCaseWiseTimeEntry_Result> list = new List<GetCaseWiseTimeEntry_Result>();
            list = db.GetCaseWiseTimeEntry(Guid.Parse(firmid), Guid.Parse(caseid)).ToList();
            foreach (var data in list.ToList())
            {
                GetCaseWiseTimeEntry_Result newItem = new GetCaseWiseTimeEntry_Result();
                newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                list[list.IndexOf(data)].tmatter = newItem.tmatter;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get time by case call list details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string timebycasecalllist(string firmid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCaseWiseCallTimeEntry_Result> list = new List<GetCaseWiseCallTimeEntry_Result>();
            list = db.GetCaseWiseCallTimeEntry(Guid.Parse(firmid), Guid.Parse(caseid)).ToList();
            foreach (var data in list.ToList())
            {
                GetCaseWiseCallTimeEntry_Result newItem = new GetCaseWiseCallTimeEntry_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load case notes
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string LoadCasenotes(string firmid, string userid, string caseid, int roleid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            //  var matter1 =db.AddLawMatterLists.Where(x => x.firmId == uids).ToList();
            List<sp_getcasenote_Result> list = new List<sp_getcasenote_Result>();
            list = db.sp_getcasenote(firmid, userid, caseid, roleid).ToList();
            foreach (var data in list.ToList())
            {
                sp_getcasenote_Result newItem = new sp_getcasenote_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.caseid != null)
                {
                    newItem.caseid = Convert.ToBase64String(QueryAES.EncryptAes(data.caseid.ToString()));
                    list[list.IndexOf(data)].caseid = newItem.caseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove case notes
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noteid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string removecasenotes(string firmid, string userid, string noteid, int roleid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var at = db.removecasenote(firmid, userid, noteid, roleid);
            var a = JsonConvert.SerializeObject(at);
            db.insertdeleteentrytable(Guid.Parse(noteid), "Tbl_CaseNote", Guid.Parse(firmid));
            return a.ToString();
        }
        /// <summary>
        /// Remove case list details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string casefilelist(string firmid, string userid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetDocsForCasefilelist_Result> list = new List<GetDocsForCasefilelist_Result>();
            list = db.GetDocsForCasefilelist(firmid, userid, caseid).ToList();
            foreach (var data in list.ToList())
            {
                GetDocsForCasefilelist_Result newItem = new GetDocsForCasefilelist_Result();
                if (!string.IsNullOrEmpty(data.AzureFIleId))
                {
                    newItem.AzureFIleId = Convert.ToBase64String(QueryAES.EncryptAes(data.AzureFIleId.ToString()));
                    list[list.IndexOf(data)].AzureFIleId = newItem.AzureFIleId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get OCR file list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="searchlist"></param>
        /// <returns></returns>
        public string ocrfilelist(string firmid, string userid, string searchlist = null)
        {
            var db = new LawPracticeEntities();
            if (searchlist == "")
            {
                var matter = db.GetOcrfilelist(firmid, userid, searchlist).ToList();
                var a = JsonConvert.SerializeObject(matter);
                return a;
            }
            else
            {
                searchlist = "N'%" + searchlist + "%'";
                var matter = db.GetOcrfilelist(firmid, userid, searchlist).ToList();
                var a = JsonConvert.SerializeObject(matter);
                return a;
            }
        }
        /// <summary>
        /// Get OCR file list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="searchlist"></param>
        /// <returns></returns>
        public string ocrfilelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string searchlist = null)
        {
            var db = new LawPracticeEntities();
            ObjectParameter returnId = new ObjectParameter("RecordCount", typeof(int));
            if (searchlist == "")
            {
                List<GetOcrfilelistByRowId_Result> list = new List<GetOcrfilelistByRowId_Result>();
                list = db.GetOcrfilelistByRowId(firmid, userid, searchlist, pagenum, pagesize, returnId).ToList();
                foreach (var data in list.ToList())
                {
                    GetOcrfilelistByRowId_Result newItem = new GetOcrfilelistByRowId_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                }
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
            else
            {
                List<GetOcrfilelistByRowId_Result> list = new List<GetOcrfilelistByRowId_Result>();
                searchlist = "N'%" + searchlist + "%'";
                list = db.GetOcrfilelistByRowId(firmid, userid, searchlist, pagenum, pagesize, returnId).ToList();
                foreach (var data in list.ToList())
                {
                    GetOcrfilelistByRowId_Result newItem = new GetOcrfilelistByRowId_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                }
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
        }
        /// <summary>
        /// Load case subject
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadcasesubject(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.getcasesubjectlist(firmid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load contact type details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadcontacttype(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.getcontacttypelist(firmid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load custom activity detail by firm id and user id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadcustomactivity(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            List<getcustomactivitylist_Result> list = new List<getcustomactivitylist_Result>();
            list = db.getcustomactivitylist(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            foreach (var data in list.ToList())
            {
                getcustomactivitylist_Result newItem = new getcustomactivitylist_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Save access details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuser"></param>
        /// <param name="pageid"></param>
        /// <returns></returns>
        public string SaveAccesspage(string firmid, string userid, string assignuser, string pageid)
        {
            var db = new LawPracticeEntities();
            var a = "";
            var matter = db.sp_SavePageAccessRight(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(assignuser), pageid);
            a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get datewise activity report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="sdate"></param>
        /// <param name="edate"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string ActivityReportDatewise(string firmid, string userid, string sdate, string edate, int pagenum, int pagesize, string search)
        {
            var db = new LawPracticeEntities();
            if (String.IsNullOrEmpty(search))
            {
                List<GetRecentActivityDatewise_Result> list = new List<GetRecentActivityDatewise_Result>();
                list = db.GetRecentActivityDatewise(Guid.Parse(firmid), Guid.Parse(userid), Convert.ToDateTime(sdate), Convert.ToDateTime(edate), pagenum, pagesize, 0).ToList();
                GetRecentActivityDatewise_Result newItem = new GetRecentActivityDatewise_Result();
                foreach (var data in list.ToList())
                {
                    if (!string.IsNullOrEmpty(data.notification))
                    {
                        try
                        {
                            newItem.notification = String.Format("{0:dd MMM yyyy hh:mm:ss}", Convert.ToDateTime(data.notification.ToString())).ToString();
                            list[list.IndexOf(data)].notification = newItem.notification;
                        }
                        catch
                        {
                        }
                    }
                }
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
            else
            {
                List<GetSearchRecentActivityDatewise_Result> list = new List<GetSearchRecentActivityDatewise_Result>();
                list = db.GetSearchRecentActivityDatewise(Guid.Parse(firmid), Guid.Parse(userid), Convert.ToDateTime(sdate), Convert.ToDateTime(edate), pagenum, pagesize, 0, search).ToList();
                GetSearchRecentActivityDatewise_Result newItem = new GetSearchRecentActivityDatewise_Result();
                foreach (var data in list.ToList())
                {
                    if (!string.IsNullOrEmpty(data.notification))
                    {
                        try
                        {
                            newItem.notification = String.Format("{0:dd MMM yyyy}", Convert.ToDateTime(data.notification.ToString())).ToString();
                            list[list.IndexOf(data)].notification = newItem.notification;
                        }
                        catch
                        {
                        }
                    }
                }
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
        }
        /// <summary>
        /// Get activity report by given details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string ActivityReport(string firmid, string userid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetRecentActivityAllByRowId_Result> list = new List<GetRecentActivityAllByRowId_Result>();
            list = db.GetRecentActivityAllByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize).ToList();
            GetRecentActivityAllByRowId_Result newItem = new GetRecentActivityAllByRowId_Result();
            foreach (var data in list.ToList())
            {
                if (data.typeid.ToString() != Guid.Empty.ToString())
                {
                    newItem.typeid = Convert.ToBase64String(QueryAES.EncryptAes(data.typeid.ToString()));
                    list[list.IndexOf(data)].typeid = newItem.typeid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Bind case event detail by firm id and user id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string bindcaseevent(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var list = db.sp_bindcaseventlist(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case event alert details by given details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string caseeventalertlist(string firmid, string userid, int roleid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCaseEventAlertList_Result> list = new List<GetCaseEventAlertList_Result>();
            list = db.GetCaseEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(caseid)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetCaseEventAlertList_Result newItem = new GetCaseEventAlertList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                sb.Clear();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        ///Get activity event alert details by given id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="evid"></param>
        /// <returns></returns>
        public string activityeventalertlist(string firmid, string userid, int roleid, string evid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetActivityEventAlertList_Result> list = new List<GetActivityEventAlertList_Result>();
            list = db.GetActivityEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(evid)).ToList();
            foreach (var data in list.ToList())
            {
                GetActivityEventAlertList_Result newItem = new GetActivityEventAlertList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single case event details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="alertid"></param>
        /// <returns></returns>
        public string singlecaseeventalertlist(string firmid, string userid, int roleid, string alertid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetSingleCaseEventAlertList_Result> list = new List<GetSingleCaseEventAlertList_Result>();
            list = db.GetSingleCaseEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(alertid)).ToList();
            foreach (var data in list.ToList())
            {
                GetSingleCaseEventAlertList_Result newItem = new GetSingleCaseEventAlertList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single case activity event details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="alertid"></param>
        /// <returns></returns>
        public string singleactivityeventalertlist(string firmid, string userid, int roleid, string alertid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetSingleActivityEventAlertList_Result> list = new List<GetSingleActivityEventAlertList_Result>();
            list = db.GetSingleActivityEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(alertid)).ToList();
            foreach (var data in list.ToList())
            {
                GetSingleActivityEventAlertList_Result newItem = new GetSingleActivityEventAlertList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove case event details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="alertid"></param>
        /// <returns></returns>
        public string removecaseeventalert(string firmid, string userid, int roleid, string alertid)
        {
            var db = new LawPracticeEntities();
            var list = db.RemoveCaseEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(alertid));
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove activity event
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="alertid"></param>
        /// <returns></returns>
        public string removeactivityeventalert(string firmid, string userid, int roleid, string alertid)
        {
            var db = new LawPracticeEntities();
            var list = db.RemoveActivityEventAlertList(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), roleid, Guid.Parse(alertid));
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get OCR file contennt
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string ocrfilecontent(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetOcrfilecontent(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get OCR file by Id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string ocrfileById(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetOcrfileById(firmid, userid, fid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load tax data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadtaxdata(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_invoicetaxlist_Result> list = new List<usp_invoicetaxlist_Result>();
            list = db.usp_invoicetaxlist(firmid.ToString(), userid.ToString()).ToList();
            foreach (var data in list.ToList())
            {
                usp_invoicetaxlist_Result newItem = new usp_invoicetaxlist_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load search invoice data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="cname"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="amount"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="filterinvoietype"></param>
        /// <param name="invoicestatus"></param>
        /// <returns></returns>
        
        public List<InvoiceSearchListModel> LoadInvoicedataSearch(string firmid, string userid, int roleid, string cname, string from, string to, string amount, int pagenum, int pagesize, string filterinvoietype, string invoicestatus)
        {
            List<InvoiceSearchListModel> lstInvoiceSearch = new List<InvoiceSearchListModel>();
            var detail = DataAccessIPRADO.InvoicelistNewSearch(firmid.ToString(), userid.ToString(), roleid, cname, from, to, amount, pagenum, pagesize, filterinvoietype, invoicestatus);

            var result = JsonConvert.SerializeObject(detail);
            lstInvoiceSearch = JsonConvert.DeserializeObject<List<InvoiceSearchListModel>>(result);
            foreach (var item in lstInvoiceSearch)
            {
                item.id = Convert.ToBase64String(QueryAES.EncryptAes(item.id.ToString()));
            }

            return lstInvoiceSearch;
        }
        /// <summary>
        /// Load invoice data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string LoadInvoicedata(string firmid, string userid, int roleid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_Invoicelist_Result> list = new List<usp_Invoicelist_Result>();
            list = db.usp_Invoicelist(firmid.ToString(), userid.ToString(), roleid).ToList();
            foreach (var data in list.ToList())
            {
                usp_Invoicelist_Result newItem = new usp_Invoicelist_Result();
                newItem.id = Convert.ToBase64String(QueryAES.EncryptAes(data.id.ToString()));
                list[list.IndexOf(data)].id = newItem.id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load invoice series details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadInvoiceseries(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var list = db.usp_invoiceseries(firmid.ToString(), userid.ToString()).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load mail box server details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadmailboxserver(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_mailboxserverlist_Result> list = new List<usp_mailboxserverlist_Result>();
            list = db.usp_mailboxserverlist(firmid.ToString(), userid.ToString()).ToList();
            foreach (var data in list.ToList())
            {
                usp_mailboxserverlist_Result newItem = new usp_mailboxserverlist_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load invoice address
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string Loadinvaddress(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.usp_invoiceaddress(firmid.ToString(), userid.ToString()).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load edit invoice details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="invoiceid"></param>
        /// <returns></returns>
        public string LoadEditInvEntry(string firmid, string userid, string invoiceid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetEditInvEntry(firmid.ToString(), userid.ToString(), invoiceid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load edit invoice payment
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="invoiceid"></param>
        /// <returns></returns>
        public string LoadEditInvPayment(string firmid, string userid, string invoiceid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetEditInvPayment(firmid.ToString(), userid.ToString(), invoiceid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load tax data by date
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public string Loadtaxdatabydate(string firmid, string userid, string date)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.usp_invoicetaxbydate(firmid.ToString(), userid.ToString(), date).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove tax data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string removetaxdata(string firmid, string userid, string id)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.usp_removeinvoicetax(firmid.ToString(), userid.ToString(), id.ToString());
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(id), "Tblinvoicetax", Guid.Parse(firmid));
            db.SaveChanges();
            return a;
        }
        /// <summary>
        /// Remove mail box server
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string RemoveMailBoxServer(string firmid, string userid, string id)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.usp_removemailboxserver(firmid.ToString(), userid.ToString(), id.ToString());
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(id), "Tbl_mailboxServer", Guid.Parse(firmid));
            db.SaveChanges();
            return a;
        }
        /// <summary>
        /// Remove mail box account
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string RemoveMailBoxAccount(string firmid, string userid, string id)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var getid = db.Tbl_MailCredential.Where(x => x.Firmid.ToString() == firmid.ToString() && x.userid.ToString() == userid.ToString() && x.MailServerId.ToString() == id.ToString()).FirstOrDefault();
            if (getid != null)
            {
                db.insertdeleteentrytable(Guid.Parse(getid.Id.ToString()), "Tbl_MailCredential", Guid.Parse(firmid));
                db.SaveChanges();
            }
            var matter = db.usp_removemailboxaccount(firmid.ToString(), userid.ToString(), id.ToString());
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Save invoice tax
        /// </summary>
        /// <param name="tx"></param>
        /// <returns></returns>
        public string saveinvoicetax(TblInvoiceTax tx)
        {
            var db = new LawPracticeEntities();
            var taxreturn = db.usp_insertinvoicetax(tx.Firmid.ToString(), tx.userid.ToString(), tx.taxtype, tx.tax, tx.FromDate, tx.EndDate);
            var a = JsonConvert.SerializeObject(taxreturn);
            return a;
        }
        /// <summary>
        /// Save invoice series
        /// </summary>
        /// <param name="tx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string saveinvoiceseries(TblInvoiceSery tx, string id = null)
        {
            var db = new LawPracticeEntities();
            var taxreturn = db.saveinvoiceseries(tx.Firmid.ToString(), tx.userid.ToString(), tx.SeriesCode, tx.Serierno, tx.FormatMonth, tx.FormatFYCY, tx.FormatOperator, tx.FormatSequence, tx.FormatPreview, tx.FormatSeriesArray, id);
            var a = JsonConvert.SerializeObject(taxreturn);
            return a;
        }
        /// <summary>
        /// Save mailbox setting
        /// </summary>
        /// <param name="tx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string SaveMailBoxSettings(Tbl_mailboxServer tx, string id = null)
        {
            var db = new LawPracticeEntities();
            var taxreturn = db.savemailboxsetting(tx.Firmid.ToString(), tx.Userid.ToString(), tx.MailServerName, tx.SmtpAddress, tx.SmtpPort, tx.ImapAddress, tx.ImapPort, tx.PopAddress, tx.PopPort, id);
            var a = JsonConvert.SerializeObject(taxreturn);
            return a;
        }
        /// <summary>
        /// Save mailbox login data
        /// </summary>
        /// <param name="tx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string Savemaillogindata(Tbl_MailCredential tx, string id = null)
        {
            var db = new LawPracticeEntities();
            var taxreturn = db.savemailcredential(tx.Firmid.ToString(), tx.userid.ToString(), tx.MailServerId.ToString(), tx.Username, tx.Password, id);
            var a = JsonConvert.SerializeObject(taxreturn);
            return a;
        }
        /// <summary>
        /// Remove OCR file
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string removeocrfile(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.RemoveOcrfile(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "Tbl_OcrFile", Guid.Parse(firmid));
            db.SaveChanges();
            return a;
        }
        /// <summary>
        /// Save invoice setting
        /// </summary>
        /// <param name="inv"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string saveinvoicesettings(TblinvoiceSetting inv, string id = null)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var data = db.usp_InsertInvoiceSettingsData(inv.Firmid.ToString(), inv.userid.ToString(), inv.Incompanyname, inv.inemail, inv.inlogo, inv.inphone, inv.website, inv.inaddress, inv.innotes, inv.intermscondtion, inv.inpan, inv.ingstregno, inv.saccode, inv.intemplate, inv.state, inv.isdefault, inv.InSignature);
            var a = JsonConvert.SerializeObject(data);
            return a;
        }
        /// <summary>
        /// Save invoice address
        /// </summary>
        /// <param name="inv"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string SaveInvoiceAddress(TblAnotherAddressInvoice inv, string id = null)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var data = db.saveinvoiceaddress(inv.Firmid.ToString(), inv.userid.ToString(), inv.Address, inv.State, inv.Phoneno, inv.Email, inv.website, inv.GSTNo, inv.Pan, inv.Sac, inv.Isactive, inv.isdefault, id);
            var a = JsonConvert.SerializeObject(data);
            return a;
        }
        /// <summary>
        /// Remove draft
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string removedraft(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.RemoveDraft(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "MessageDraftList", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Remove contact type
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string removeContactType(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Removecontacttype(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "TblContactType", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Remove custom ctivity
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string removeCustomActivity(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Removecustomactivity(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "TblCustomActivity", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Remove case subject
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string removeCaseSubject(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Removecasesubject(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "TblCaseSubject", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Insert case subject
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="subjectname"></param>
        /// <returns></returns>
        public string InsertCaseSubject(string firmid, string userid, string subjectname)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecasesubject(firmid, userid, subjectname, null);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }

        /// <summary>
        /// Update case subject
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="subjectname"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string UpdateCaseSubject(string firmid, string userid, string subjectname, string id = null)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecasesubject(firmid, userid, subjectname, id);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Update contact type
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="subjectname"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string UpdateContactType(string firmid, string userid, string subjectname, string id = null)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecontacttype(firmid, userid, subjectname, id);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Update custom activity
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="activityname"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string UpdateCustomActivity(string firmid, string userid, string activityname, string id = null)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecustomactivity(firmid, userid, activityname, id);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Update contact type
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="contacttype"></param>
        /// <returns></returns>
        public string InsertContactType(string firmid, string userid, string contacttype)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecontacttype(firmid, userid, contacttype, null);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Insert custom activity
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="activityname"></param>
        /// <returns></returns>
        public string InsertCustomActivity(string firmid, string userid, string activityname)
        {
            var db = new LawPracticeEntities();
            var matter = db.savecustomactivity(firmid, userid, activityname, null);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Lead user call list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="lid"></param>
        /// <returns></returns>
        public string leadusercalllist(string firmid, string userid, string lid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetUserleadCalls(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(lid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Search matter by detail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string searchmatterlist(string uid, string search)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetSearchMattersDetails(Guid.Parse(uid), search).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// View contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string viewcontactlist(string firmid, string userid, int pagenum, int pagesize)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetContactDetailsByRowId_Result> list = new List<GetContactDetailsByRowId_Result>();
            list = db.GetContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetContactDetailsByRowId_Result newItem = new GetContactDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// View fav contact
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string viewfavcontactlist(string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetFavContactDetailsByRowId_Result> list = new List<GetFavContactDetailsByRowId_Result>();
            list = db.GetFavContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetFavContactDetailsByRowId_Result newItem = new GetFavContactDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
                newItem.FavId = Convert.ToBase64String(QueryAES.EncryptAes(data.FavId.ToString()));
                list[list.IndexOf(data)].FavId = newItem.FavId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <param name="iscomorindv"></param>
        /// <returns></returns>
        public string contactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<GetNewContactsDetailsByRowId_Result> list = new List<GetNewContactsDetailsByRowId_Result>();
            list = db.GetNewContactsDetailsByRowId(firmid, userid, pagenum, pagesize, 0, search, type, pageid, iscomorindv).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNewContactsDetailsByRowId_Result newItem = new GetNewContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Search contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string searchcontactlist(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSearchContactDetailsByRowId_Result> list = new List<GetSearchContactDetailsByRowId_Result>();
            list = db.GetSearchContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, null, null).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSearchContactDetailsByRowId_Result newItem = new GetSearchContactDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Search fav contact
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string searchfavcontactlist(string firmid, string userid, int pagenum, int pagesize, string search, int roleid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSearchFavContactDetailsByRowId_Result> list = new List<GetSearchFavContactDetailsByRowId_Result>();
            list = db.GetSearchFavContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSearchFavContactDetailsByRowId_Result newItem = new GetSearchFavContactDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
                newItem.FavId = Convert.ToBase64String(QueryAES.EncryptAes(data.FavId.ToString()));
                list[list.IndexOf(data)].FavId = newItem.FavId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Search user contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string searchusercontactlist(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetSearchUserContactDetailsByRowId_Result> list = new List<GetSearchUserContactDetailsByRowId_Result>();
            list = db.GetSearchUserContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            foreach (var data in list.ToList())
            {
                GetSearchUserContactDetailsByRowId_Result newItem = new GetSearchUserContactDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Matter list bound
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<AddLawMatterList> Matterlistbound(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter1 = db.AddLawMatterLists.Where(x => x.Firmid.ToString() == uid.ToString()).ToList();
            return matter1;
        }
        /// <summary>
        /// Save firm other custom details
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        public void savefirmcustomother(FirmConfiguredCustomField fm, string firmid)
        {
            var db = new LawPracticeEntities();
            FirmConfiguredCustomField cf = new FirmConfiguredCustomField();
            string sctype = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fm.SubConfigurationType));
            cf.Firmid = Guid.Parse(firmid);
            cf.Sequence = fm.Sequence;
            cf.ConfigurationType = fm.ConfigurationType;
            cf.SubConfigurationType = sctype;
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
            var data = db.SaveChanges();
        }
        /// <summary>
        /// Save firm custom
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        public void savefirmcustom(FirmConfiguredCustomField fm, string firmid)
        {
            var db = new LawPracticeEntities();
            FirmConfiguredCustomField cf = new FirmConfiguredCustomField();
            //check sequence
            var chsqeq = db.usp_GetFirmConfiguredCustomFields(firmid, fm.ConfigurationType.ToString()).OrderByDescending(z => z.Sequence).FirstOrDefault();
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
            db.SaveChanges();
        }
        /// <summary>
        /// Create firm employee
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="rty"></param>
        /// <returns></returns>
        public string FirmEmployeescreate1(string firmid, string rty)
        {
            var db = new LawPracticeEntities();
            var datas = db.usp_GetFirmConfiguredCustomFields(firmid, rty).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Firm employee
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="rty"></param>
        /// <returns></returns>
        public string FirmEmployees1(string firmid, string rty)
        {
            var db = new LawPracticeEntities();
            var datas = db.usp_GetFirmConfiguredCustomFields(firmid, rty).Where(x => x.IsActive == true).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Save contact details
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="tempassign"></param>
        /// <param name="firmid"></param>
        /// <param name="ftype"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>
        public void savecontact(AddContactsList fm, string tempassign, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            var db = new LawPracticeEntities();
            AddContactsList cf = new AddContactsList();
            ColMap cm = new ColMap();
            if (fm.cphoto != null)
            {
                cf.cphoto = fm.cphoto;
            }
            cf.Firmid = Guid.Parse(firmid.ToString());
            cf.cnotes = fm.cnotes;
            cf.firmuser = fm.firmuser;
            cf.lname = fm.lname;
            cf.cadd1 = fm.cadd1;
            cf.cassign = fm.cassign;
            cf.cemail = fm.cemail;
            cf.fname = fm.fname;
            cf.cnumber = fm.cnumber;
            cf.ctags = fm.ctags;
            cf.cwebsite = fm.cwebsite;
            cf.cport = fm.cport;
            cf.fax = fm.fax;
            cf.fname = fm.fname;
            cf.homeno = fm.homeno;
            cf.mname = fm.mname;
            cf.mobno = fm.mobno;
            cf.offno = fm.offno;
            cf.ContactType = fm.ContactType;
            cf.date_time = DateTime.Now;
            cf.col1 = fm.col1;
            cf.col2 = fm.col2;
            cf.col3 = fm.col3;
            cf.col4 = fm.col4;
            cf.col5 = fm.col5;
            cf.col6 = fm.col6;
            cf.col7 = fm.col7;
            cf.col8 = fm.col8;
            cf.col9 = fm.col9;
            cf.col10 = fm.col10;
            cf.col11 = fm.col11;
            cf.col12 = fm.col12;
            cf.col13 = fm.col13;
            cf.col14 = fm.col14;
            cf.col15 = fm.col15;
            db.AddContactsLists.Add(cf);
            db.SaveChanges();
            //save in maptable
            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.cid;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                }
                //cm.txt2 = ctxt2;
                //cm.ftype = ftype;
                cm.Firmid = Guid.Parse(firmid);
                cm.formid = Convert.ToInt32(ftype);
                db.ColMaps.Add(cm);
                db.SaveChanges();
            }
            if (tempassign != null)
            {
                //users
                var assigneachId = tempassign.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item in assigneachId)
                {
                    var chkinsert = db.usp_mapcontactuser(cf.Firmid.ToString(), cf.firmuser.ToString(), cf.cid.ToString(), item);
                    //save in notification table
                    //users
                    if (chkinsert > 0)
                    {
                        tbl_notification tn = new tbl_notification();
                        tn.date_time = cf.date_time;
                        tn.Firmid = cf.Firmid;
                        tn.userid = cf.firmuser;
                        tn.auser = Guid.Parse(fm.cassign);
                        tn.ntype = "Contact";
                        tn.status = 0;
                        if (fm.firmuser.ToString() == fm.cassign)
                        {
                            tn.urllink = "/Firm/ContactSingleView/" + cf.cid;
                        }
                        else
                        {
                            tn.urllink = "/Employee/ContactSingleView/" + cf.cid;
                        }
                        tn.notification = "You have new Contact";
                        tn.typeid = cf.cid;
                        db.tbl_notification.Add(tn);
                        db.SaveChanges();
                    }
                }
            }
        }

        /// <summary>
        /// Edit Contact
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="tempassign"></param>
        /// <param name="firmid"></param>
        /// <param name="ftype"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>
        public void editcontact(AddContactsList fm, string tempassign, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            var db = new LawPracticeEntities();
            ColMap cm = new ColMap();
            var cf = db.AddContactsLists.Where(x => x.cid == fm.cid && x.Firmid.ToString() == firmid.ToString()).FirstOrDefault();
            if (fm.cphoto != null)
            {
                cf.cphoto = fm.cphoto;
            }
            cf.Firmid = Guid.Parse(firmid.ToString());
            cf.firmuser = fm.firmuser;
            cf.cnotes = fm.cnotes;
            cf.lname = fm.lname;
            cf.cadd1 = fm.cadd1;
            cf.cassign = fm.cassign;
            cf.cemail = fm.cemail;
            cf.fname = fm.fname;
            cf.cnumber = fm.cnumber;
            cf.ctags = fm.ctags;
            cf.cwebsite = fm.cwebsite;
            cf.cport = fm.cport;
            cf.fax = fm.fax;
            cf.fname = fm.fname;
            cf.homeno = fm.homeno;
            cf.mname = fm.mname;
            cf.mobno = fm.mobno;
            cf.offno = fm.offno;
            cf.ContactType = fm.ContactType;
            cf.date_time = DateTime.Now;
            cf.col1 = fm.col1;
            cf.col2 = fm.col2;
            cf.col3 = fm.col3;
            cf.col4 = fm.col4;
            cf.col5 = fm.col5;
            cf.col6 = fm.col6;
            cf.col7 = fm.col7;
            cf.col8 = fm.col8;
            cf.col9 = fm.col9;
            cf.col10 = fm.col10;
            cf.col11 = fm.col11;
            cf.col12 = fm.col12;
            cf.col13 = fm.col13;
            cf.col14 = fm.col14;
            cf.col15 = fm.col15;
            cf.iupdate = 1;
            db.Entry(cf).State = EntityState.Modified;
            db.SaveChanges();
            //save in maptable
            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.cid;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                }
                cm.Firmid = Guid.Parse(firmid);
                cm.formid = Convert.ToInt32(ftype);
                var mt = db.ColMaps.Where(x => x.Firmid.ToString() == firmid && x.formid == cm.formid && x.pid == cm.pid && x.column_name == cm.column_name && x.column_no == cm.column_no).FirstOrDefault();
                if (mt == null)
                {
                    db.ColMaps.Add(cm);
                    db.SaveChanges();
                }
                else
                {
                    mt.iupdate = 1;
                    db.Entry(mt).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            if (tempassign != null)
            {
                //users
                var assigneachId = tempassign.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item in assigneachId)
                {
                    var chkinsert = db.usp_mapcontactuser(cf.Firmid.ToString(), cf.firmuser.ToString(), cf.cid.ToString(), item);
                    //save in notification table
                    //users
                    if (chkinsert > 0)
                    {
                        try
                        {
                            //check exist notification
                            var chknoti = db.tbl_notification.Where(x => x.Firmid.ToString() == cf.Firmid.ToString() && x.ntype == "contact" && x.auser.ToString() == fm.cassign.ToString() && x.typeid.ToString() == fm.cid.ToString() && x.nmode == null).FirstOrDefault();
                            if (chknoti == null)
                            {
                                tbl_notification tn2 = new tbl_notification();
                                tn2.date_time = cf.date_time;
                                tn2.Firmid = cf.Firmid;
                                tn2.userid = cf.firmuser;
                                tn2.auser = Guid.Parse(fm.cassign);
                                tn2.ntype = "Contact";
                                tn2.status = 0;
                                if (fm.firmuser.ToString() == fm.cassign)
                                {
                                    tn2.urllink = "/Firm/ContactSingleView/" + cf.cid;
                                }
                                else
                                {
                                    tn2.urllink = "/Employee/ContactSingleView/" + cf.cid;
                                }
                                tn2.notification = "You have new Contact";
                                tn2.typeid = cf.cid;
                                db.tbl_notification.Add(tn2);
                                db.SaveChanges();
                            }
                        }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                        catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                        {
                        }
                    }
                }
            }
            //update notification
            tbl_notification tn = new tbl_notification();
            tn.date_time = cf.date_time;
            tn.Firmid = cf.Firmid;
            tn.userid = cf.firmuser;
            tn.auser = Guid.Parse(fm.cassign);
            tn.ntype = "Contact";
            tn.status = 1;
            tn.nmode = "edit";
            if (fm.firmuser.ToString() == fm.cassign)
            {
                tn.urllink = "/Firm/ContactSingleView/" + cf.cid;
            }
            else
            {
                tn.urllink = "/Employee/ContactSingleView/" + cf.cid;
            }
            tn.notification = "You have edit contact";
            tn.typeid = cf.cid;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
        }
        /// <summary>
        /// Save notes
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool savenote(AddNoteList ml)
        {
            var db = new LawPracticeEntities();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.nfiles;
            if (ml.nfiles != "")
            {
                ml.nfiles = "1";
            }
            db.AddNoteLists.Add(ml);
            db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "note";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.firmuser;
            tn.auser = ml.firmuser;
            tn.ntype = "Note";
            tn.status = 1;
            tn.urllink = "/Firm/NoteSingleView/" + ml.Id;
            tn.notification = "You have New Note";
            tn.typeid = ml.Id;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Edit note
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool editnote(AddNoteList ml)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.nfiles;
            var db = new LawPracticeEntities();
            var data = db.AddNoteLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.nsubject = ml.nsubject;
            data.ndatetime = ml.ndatetime;
            if (ml.nfiles != "")
            {
                data.nfiles = "1";
            }
            data.nmatter = ml.nmatter;
            data.nnote = ml.nnote;
            data.tstatus = ml.tstatus;
            data.ncontact = ml.ncontact;
            data.ntags = ml.ntags;
            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "note";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.firmuser;
            tn.auser = ml.firmuser;
            tn.ntype = "Note";
            tn.status = 1;
            tn.nmode = "edit";
            tn.urllink = "/Firm/NoteSingleView/" + ml.Id;
            tn.notification = "You have edit Note";
            tn.typeid = ml.Id;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Save lead detail
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool saveleadcall(Tbl_leadCall ml)
        {
            var db = new LawPracticeEntities();
            db.Tbl_leadCall.Add(ml);
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Save call
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool savecall(AddCallList ml)
        {
            var db = new LawPracticeEntities();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.cfiles;
            string userlist = ml.cpuser;
            ml.cpuser = new Guid().ToString();
            if (ml.cfiles != "")
            {
                ml.cfiles = "1";
            }
            db.AddCallLists.Add(ml);
            db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "call";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    um.auserid = Guid.Parse(item1);
                    um.EventType = "Call";
                    um.rowid = ml.Id;
                    um.Firmid = ml.Firmid;
                    um.date_time = DateTime.Now;
                    um.userid = ml.firmuser;
                    db.ActivityUserMaps.Add(um);
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        tbl_notification tn = new tbl_notification();
                        tn.date_time = ml.date_time;
                        tn.Firmid = ml.Firmid;
                        tn.userid = ml.firmuser;
                        tn.auser = Guid.Parse(item1);
                        tn.ntype = "Call";
                        tn.status = 0;
                        if (usertype.RoleId.ToString() == "1")
                        {
                            tn.urllink = "/Firm/CallSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "2")
                        {
                            tn.urllink = "/Employee/CallSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "3")
                        {
                            tn.urllink = "/Firm/CallSingleView/" + ml.Id;
                        }
                        tn.notification = "You have  new Call";
                        tn.typeid = ml.Id;
                        db.tbl_notification.Add(tn);
                    }
                    db.SaveChanges();
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return true;
        }
        /// <summary>
        /// Edit call
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool editcall(AddCallList ml)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.cfiles;
            string userlist = ml.cpuser;
            var db = new LawPracticeEntities();
            var data = db.AddCallLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.ccontact = ml.ccontact;
            data.csubject = ml.csubject;
            if (ml.cfiles != "")
            {
                data.cfiles = "1";
            }
            data.ctags = ml.ctags;
            data.tstatus = ml.tstatus;
            data.cpcontact = ml.cpcontact;
            data.cmatter = ml.cmatter;
            data.ctype = ml.ctype;
            data.cdatetime = ml.cdatetime;
            data.cdura = ml.cdura;
            data.cdetails = ml.cdetails;
            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            var count = db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "call";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    var chkuser = db.ActivityUserMaps.Where(x => x.rowid == data.Id && x.EventType.ToString() == "Call" && x.Firmid == ml.Firmid && x.auserid.ToString() == item1.ToString()).FirstOrDefault();
                    if (chkuser == null)
                    {
                        um.auserid = Guid.Parse(item1);
                        um.EventType = "Call";
                        um.rowid = data.Id;
                        um.Firmid = ml.Firmid;
                        um.date_time = DateTime.Now;
                        um.userid = ml.firmuser;
                        db.ActivityUserMaps.Add(um);
                        db.SaveChanges();
                    }
                }
                //delete not in rows
                var entryuser = db.GetDeleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist.ToString(), "Call").ToList();
                if (entryuser.Count > 0)
                {
                    foreach (var itemp in entryuser)
                    {
                        db.insertdeleteentrytable(Guid.Parse(itemp.id.ToString()), "ActivityUserMap", ml.Firmid);
                    }
                    var counts = db.deleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist, "Call");
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        var checkexist = db.tbl_notification.Where(c => c.auser.ToString() == item1.ToString() && c.Firmid == data.Firmid && c.typeid.ToString() == ml.Id.ToString() && c.ntype.ToString() == "Call").FirstOrDefault();
                        if (checkexist == null)
                        {
                            tbl_notification tn = new tbl_notification();
                            tn.date_time = ml.date_time;
                            tn.Firmid = ml.Firmid;
                            tn.userid = ml.firmuser;
                            tn.auser = Guid.Parse(item1);
                            tn.ntype = "Call";
                            tn.status = 1;
                            tn.nmode = "edit";
                            if (usertype.RoleId.ToString() == "1")
                            {
                                tn.urllink = "/Firm/CallSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "2")
                            {
                                tn.urllink = "/Employee/CallSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "3")
                            {
                                tn.urllink = "/Firm/CallSingleView/" + ml.Id;
                            }
                            tn.notification = "You have edit Call";
                            tn.typeid = ml.Id;
                            db.tbl_notification.Add(tn);
                            db.SaveChanges();
                        }
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Save task
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="userlist"></param>
        /// <param name="sum"></param>
        /// <param name="x1"></param>
        /// <param name="x2"></param>
        /// <param name="x3"></param>
        /// <param name="x4"></param>
        /// <param name="x5"></param>
        /// <param name="nx1"></param>
        /// <param name="nx2"></param>
        /// <param name="nx3"></param>
        /// <param name="nx4"></param>
        /// <param name="nx5"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <returns></returns>
        public bool savetask(AddTaskList ml, string userlist, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5)
        {
            var db = new LawPracticeEntities();
            var rm = new AddRemindList();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;
            ml.tauser = new Guid();
            if (ml.tfile != "")
            {
                ml.tfile = "1";
            }
            db.AddTaskLists.Add(ml);
            db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "task";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    um.auserid = Guid.Parse(item1);
                    um.EventType = "Task";
                    um.rowid = ml.Id;
                    um.Firmid = ml.Firmid;
                    um.date_time = DateTime.Now;
                    um.userid = ml.firmuser;
                    db.ActivityUserMaps.Add(um);
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        tbl_notification tn = new tbl_notification();
                        tn.date_time = ml.date_time;
                        tn.Firmid = ml.Firmid;
                        tn.userid = ml.firmuser;
                        tn.auser = Guid.Parse(item1);
                        tn.ntype = "Task";
                        tn.status = 0;
                        if (usertype.RoleId.ToString() == "1")
                        {
                            tn.urllink = "/Firm/TaskSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "2")
                        {
                            tn.urllink = "/Employee/TaskSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "3")
                        {
                            tn.urllink = "/Firm/TaskSingleView/" + ml.Id;
                        }
                        tn.notification = "You have new Task";
                        tn.typeid = ml.Id;
                        db.tbl_notification.Add(tn);
                        db.SaveChanges();
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            for (int i = 1; i <= sum; i++)
            {
                rm.rpid = ml.Id;
                if (i == 1)
                {
                    rm.rtype = x1;
                    rm.rnum = nx1;
                    rm.rtime = ctxt1;
                }
                else if (i == 2)
                {
                    rm.rtype = x2;
                    rm.rnum = nx2;
                    rm.rtime = ctxt2;
                }
                else if (i == 3)
                {
                    rm.rtype = x3;
                    rm.rnum = nx3;
                    rm.rtime = ctxt3;
                }
                else if (i == 4)
                {
                    rm.rtype = x4;
                    rm.rnum = nx4;
                    rm.rtime = ctxt4;
                }
                else if (i == 5)
                {
                    rm.rtype = x5;
                    rm.rnum = nx5;
                    rm.rtime = ctxt5;
                }
                //cm.txt2 = ctxt2;
                //cm.ftype = ftype;
                rm.Firmid = ml.Firmid;
                /// rm.formid = 3;
                rm.date_time = DateTime.Now;
                db.AddRemindLists.Add(rm);
                db.SaveChanges();
            }
            return true;
        }
        /// <summary>
        /// Edit task
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="userlist"></param>
        /// <returns></returns>
        public bool edittask(AddTaskList ml, string userlist)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;
            var db = new LawPracticeEntities();
            var data = db.AddTaskLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.tsubject = ml.tsubject;
            data.duedate = ml.duedate;
            if (ml.tfile != "")
            {
                data.tfile = "1";
            }
            data.teassign = ml.teassign;
            data.tmatter = ml.tmatter;
            data.tauser = ml.tauser;
            data.tacontact = ml.tacontact;
            data.tstatus = ml.tstatus;
            data.tcontact = ml.tcontact;
            data.ttags = ml.ttags;
            data.trepeat = ml.trepeat;
            data.tpriority = ml.tpriority;
            data.tdetails = ml.tdetails;
            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            var count = db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "task";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    var chkuser = db.ActivityUserMaps.Where(x => x.rowid == data.Id && x.EventType.ToString() == "Task" && x.Firmid == ml.Firmid && x.auserid.ToString() == item1.ToString()).FirstOrDefault();
                    if (chkuser == null)
                    {
                        um.auserid = Guid.Parse(item1);
                        um.EventType = "Task";
                        um.rowid = data.Id;
                        um.Firmid = ml.Firmid;
                        um.date_time = DateTime.Now;
                        um.userid = ml.firmuser;
                        db.ActivityUserMaps.Add(um);
                        db.SaveChanges();
                    }
                }
                //delete not in rows
                var entryuser = db.GetDeleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist.ToString(), "Task").ToList();
                if (entryuser.Count > 0)
                {
                    foreach (var itemp in entryuser)
                    {
                        db.insertdeleteentrytable(Guid.Parse(itemp.id.ToString()), "ActivityUserMap", ml.Firmid);
                    }
                    var counts = db.deleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist, "Task");
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        var checkexist = db.tbl_notification.Where(c => c.auser.ToString() == item1.ToString() && c.Firmid == data.Firmid && c.typeid.ToString() == ml.Id.ToString() && c.ntype.ToString() == "Task").FirstOrDefault();
                        if (checkexist == null)
                        {
                            tbl_notification tn = new tbl_notification();
                            tn.date_time = ml.date_time;
                            tn.Firmid = ml.Firmid;
                            tn.userid = ml.firmuser;
                            tn.auser = ml.tauser;
                            tn.ntype = "Task";
                            tn.status = 1;
                            tn.nmode = "edit";
                            if (usertype.RoleId.ToString() == "1")
                            {
                                tn.urllink = "/Firm/TaskSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "2")
                            {
                                tn.urllink = "/Employee/TaskSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "3")
                            {
                                tn.urllink = "/Firm/TaskSingleView/" + ml.Id;
                            }
                            tn.notification = "You have edit Task";
                            tn.typeid = ml.Id;
                            db.tbl_notification.Add(tn);
                            db.SaveChanges();
                        }
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Save event
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="userlist"></param>
        /// <param name="sum"></param>
        /// <param name="x1"></param>
        /// <param name="x2"></param>
        /// <param name="x3"></param>
        /// <param name="x4"></param>
        /// <param name="x5"></param>
        /// <param name="nx1"></param>
        /// <param name="nx2"></param>
        /// <param name="nx3"></param>
        /// <param name="nx4"></param>
        /// <param name="nx5"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <returns></returns>
        public bool saveevent(AddEventList ml, string userlist, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5)
        {
            var db = new LawPracticeEntities();
            var rm = new AddRemindList();
            string s = ml.tfile;
            ml.tauser = new Guid();
            MultipleFileMap mf = new MultipleFileMap();
            if (ml.tfile != "")
            {
                ml.tfile = "1";
            }
            db.AddEventLists.Add(ml);
            db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "event";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    um.auserid = Guid.Parse(item1);
                    um.EventType = "Event";
                    um.rowid = ml.Id;
                    um.Firmid = ml.Firmid;
                    um.date_time = DateTime.Now;
                    um.userid = ml.firmuser;
                    db.ActivityUserMaps.Add(um);
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        tbl_notification tn = new tbl_notification();
                        tn.date_time = ml.date_time;
                        tn.Firmid = ml.Firmid;
                        tn.userid = ml.firmuser;
                        tn.auser = Guid.Parse(item1);
                        tn.ntype = "Event";
                        tn.status = 0;
                        if (usertype.RoleId.ToString() == "1")
                        {
                            tn.urllink = "/Firm/EventSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "2")
                        {
                            tn.urllink = "/Employee/EventSingleView/" + ml.Id;
                        }
                        else if (usertype.RoleId.ToString() == "3")
                        {
                            tn.urllink = "/Firm/EventSingleView/" + ml.Id;
                        }
                        tn.notification = "You have new Event";
                        tn.typeid = ml.Id;
                        db.tbl_notification.Add(tn);
                        db.SaveChanges();
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            for (int i = 1; i <= sum; i++)
            {
                rm.rpid = ml.Id;
                if (i == 1)
                {
                    rm.rtype = x1;
                    rm.rnum = nx1;
                    rm.rtime = ctxt1;
                }
                else if (i == 2)
                {
                    rm.rtype = x2;
                    rm.rnum = nx2;
                    rm.rtime = ctxt2;
                }
                else if (i == 3)
                {
                    rm.rtype = x3;
                    rm.rnum = nx3;
                    rm.rtime = ctxt3;
                }
                else if (i == 4)
                {
                    rm.rtype = x4;
                    rm.rnum = nx4;
                    rm.rtime = ctxt4;
                }
                else if (i == 5)
                {
                    rm.rtype = x5;
                    rm.rnum = nx5;
                    rm.rtime = ctxt5;
                }
                //cm.txt2 = ctxt2;
                //cm.ftype = ftype;
                rm.Firmid = ml.Firmid;
                ///rm.formid = 4;
                rm.date_time = DateTime.Now;
                db.AddRemindLists.Add(rm);
                db.SaveChanges();
            }
            return true;
        }

        /// <summary>
        /// Edit event
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="userlist"></param>
        /// <returns></returns>
        public bool editevent(AddEventList ml, string userlist)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;
            var db = new LawPracticeEntities();
            var data = db.AddEventLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.tsubject = ml.tsubject;
            data.tcontact = ml.tcontact;
            if (ml.tfile != "")
            {
                data.tfile = "1";
            }
            data.tacontact = ml.tacontact;
            data.tstatus = ml.tstatus;
            // data.tauser = ml.tauser;
            data.teassign = ml.teassign;
            data.tmatter = ml.tmatter;
            data.sdate = ml.sdate;
            data.edate = ml.edate;
            data.ttags = ml.ttags;
            data.trepeat = ml.trepeat;
            data.tpriority = ml.tpriority;
            data.tdetails = ml.tdetails;
            data.eallday = ml.eallday;
            data.elocation = ml.elocation;
            data.stime = ml.stime;
            data.etime = ml.etime;
            data.ecolor = ml.ecolor;
            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            var count = db.SaveChanges();
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "event";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            if (userlist != "")
            {
                var um = new ActivityUserMap();
                var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                foreach (var item1 in eachId1)
                {
                    var chkuser = db.ActivityUserMaps.Where(x => x.rowid == data.Id && x.EventType.ToString() == "Event" && x.Firmid == ml.Firmid && x.auserid.ToString() == item1.ToString()).FirstOrDefault();
                    if (chkuser == null)
                    {
                        um.auserid = Guid.Parse(item1);
                        um.EventType = "Event";
                        um.rowid = data.Id;
                        um.Firmid = ml.Firmid;
                        um.date_time = DateTime.Now;
                        um.userid = ml.firmuser;
                        db.ActivityUserMaps.Add(um);
                        db.SaveChanges();
                    }
                }
                //delete not in rows
                var entryuser = db.GetDeleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist.ToString(), "Event").ToList();
                if (entryuser.Count > 0)
                {
                    foreach (var itemp in entryuser)
                    {
                        db.insertdeleteentrytable(Guid.Parse(itemp.id.ToString()), "ActivityUserMap", ml.Firmid);
                    }
                    var counts = db.deleteActivityUser(ml.Firmid.ToString(), ml.Id.ToString(), userlist, "Event");
                    db.SaveChanges();
                }
            }
            try
            {
                if (userlist != "")
                {
                    var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        //check user type
                        var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                        //users
                        var checkexist = db.tbl_notification.Where(c => c.auser.ToString() == item1.ToString() && c.Firmid == data.Firmid && c.typeid.ToString() == ml.Id.ToString() && c.ntype.ToString() == "Event").FirstOrDefault();
                        if (checkexist == null)
                        {
                            tbl_notification tn = new tbl_notification();
                            tn.date_time = ml.date_time;
                            tn.Firmid = ml.Firmid;
                            tn.userid = ml.firmuser;
                            tn.auser = Guid.Parse(ml.tauser.ToString());
                            tn.ntype = "Event";
                            tn.status = 1;
                            tn.nmode = "edit";
                            if (usertype.RoleId.ToString() == "1")
                            {
                                tn.urllink = "/Firm/EventSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "2")
                            {
                                tn.urllink = "/Employee/EventSingleView/" + ml.Id;
                            }
                            else if (usertype.RoleId.ToString() == "3")
                            {
                                tn.urllink = "/Firm/EventSingleView/" + ml.Id;
                            }
                            tn.notification = "You have edit Event";
                            tn.typeid = ml.Id;
                            db.tbl_notification.Add(tn);
                            db.SaveChanges();
                        }
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Get event list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string eventlist(Guid uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCalendareventDetails_Result> list = new List<GetCalendareventDetails_Result>();
            list = db.GetCalendareventDetails(uid).ToList();
            foreach (var data in list.ToList())
            {
                GetCalendareventDetails_Result newItem = new GetCalendareventDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get task details
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string tasklist(Guid uid)
        {
            var db = new LawPracticeEntities();
            List<GetCalendartaskDetails_Result> list = new List<GetCalendartaskDetails_Result>();
            list = db.GetCalendartaskDetails(uid).ToList();
            foreach (var data in list.ToList())
            {
                GetCalendartaskDetails_Result newItem = new GetCalendartaskDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Note list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string notelist(string uid)
        {
            var db = new LawPracticeEntities();
            List<GetNoteDetails1_Result> list = new List<GetNoteDetails1_Result>();
            list = db.GetNoteDetails1(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetNoteDetails1_Result newItem = new GetNoteDetails1_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get custom activity detail list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string customactivitydatalist(string firmid, string userid, int roleid)
        {
            var db = new LawPracticeEntities();
            List<CustomActivitylist_Result> list = new List<CustomActivitylist_Result>();
            list = db.CustomActivitylist(Guid.Parse(firmid), Guid.Parse(userid), roleid).ToList();
            foreach (var data in list.ToList())
            {
                CustomActivitylist_Result newItem = new CustomActivitylist_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get activity data by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string AllActivityDatabyrowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string type)
        {
            var db = new LawPracticeEntities();
            var a = "";
            if (roleid == 1)
            {
                StringBuilder sb = new StringBuilder();
                List<GetAllActivityDetailsbyrowid_Result> list = new List<GetAllActivityDetailsbyrowid_Result>();
                list = db.GetAllActivityDetailsbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, type).ToList();
                foreach (var data in list.ToList())
                {
                    sb.Clear();
                    GetAllActivityDetailsbyrowid_Result newItem = new GetAllActivityDetailsbyrowid_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                }
                a = JsonConvert.SerializeObject(list);
            }
            if (roleid == 2)
            {
                StringBuilder sb = new StringBuilder();
                List<GetAllUserActivityDetailsbyrowid_Result> list = new List<GetAllUserActivityDetailsbyrowid_Result>();
                list = db.GetAllUserActivityDetailsbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, type).ToList();
                foreach (var data in list.ToList())
                {
                    sb.Clear();
                    GetAllUserActivityDetailsbyrowid_Result newItem = new GetAllUserActivityDetailsbyrowid_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                }
                a = JsonConvert.SerializeObject(list);
            }
            return a;
        }
        /// <summary>
        /// Save event
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string eventlist(string uid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetEventDetails(Guid.Parse(uid)).ToList();
            List<GetEventDetails_Result2> list = new List<GetEventDetails_Result2>();
            list = db.GetEventDetails(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetEventDetails_Result2 newItem = new GetEventDetails_Result2();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Calling list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string calllist(string uid)
        {
            var db = new LawPracticeEntities();
            List<GetCallDetails_Result> list = new List<GetCallDetails_Result>();
            list = db.GetCallDetails(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetCallDetails1_Result newItem = new GetCallDetails1_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get task list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string tasklist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            List<GetTaskDetails1_Result> list = new List<GetTaskDetails1_Result>();
            list = db.GetTaskDetails1(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            foreach (var data in list.ToList())
            {
                GetTaskDetails1_Result newItem = new GetTaskDetails1_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove calling list details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removecalllist(String[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddCallList call = (from c in db.AddCallLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                    select c).FirstOrDefault();
                db.AddCallLists.Remove(call);
                db.insertdeleteentrytable(Guid.Parse(did), "AddCallList", Guid.Parse(uid));
            }
            var countcall = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {
                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.moduletype.ToString() == "call" && c.rowid.ToString() == dids31.ToString() select c).ToList();
                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {
                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.EventType.ToString() == "Call" && c.rowid.ToString() == dids21.ToString() select c).ToList();
                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Remove time entry detail
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removetimeentry(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                TimerList timer = (from c in db.TimerLists
                                   where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                   select c).FirstOrDefault();
                db.TimerLists.Remove(timer);
                db.insertdeleteentrytable(Guid.Parse(did), "TimerList", Guid.Parse(uid));
            }
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Remove new time entry
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removenewtimeentry(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                Tbl_TimeEntry timer = (from c in db.Tbl_TimeEntry
                                       where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                       select c).FirstOrDefault();
                db.Tbl_TimeEntry.Remove(timer);
                db.insertdeleteentrytable(Guid.Parse(did), "Tbl_TimeEntry", Guid.Parse(uid));
            }
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }

        /// <summary>
        /// Remove user tyme entry
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removeusertimeentry(string[] typeIds, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                TimerList timer = (from c in db.TimerLists
                                   where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == userid.ToString()
                                   select c).FirstOrDefault();
                db.TimerLists.Remove(timer);
                db.insertdeleteentrytable(Guid.Parse(did), "TimerList", Guid.Parse(uid));
            }
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Remove task list details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removetasklist(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddTaskList task = (from c in db.AddTaskLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                    select c).FirstOrDefault();
                db.AddTaskLists.Remove(task);
                db.insertdeleteentrytable(Guid.Parse(did), "AddTaskList", Guid.Parse(uid));
            }
            var counttask = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {
                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.moduletype.ToString() == "task" && c.rowid.ToString() == dids31.ToString() select c).ToList();
                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {
                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.EventType.ToString() == "Task" && c.rowid.ToString() == dids21.ToString() select c).ToList();
                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            var a = JsonConvert.SerializeObject(counttask);
            return a;
        }
        /// <summary>
        /// Remove single task list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removesingletasklist(string typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            AddTaskList task = (from c in db.AddTaskLists
                                where c.Id.ToString() == typeIds.ToString() && c.Firmid.ToString() == uid.ToString()
                                select c).FirstOrDefault();
            db.AddTaskLists.Remove(task);
            db.insertdeleteentrytable(Guid.Parse(typeIds), "AddTaskList", Guid.Parse(uid));
            var counttask = db.SaveChanges();
            var a = JsonConvert.SerializeObject(counttask);
            return a;
        }
        /// <summary>
        /// Remove event list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removeeventlist(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddEventList aevent = (from c in db.AddEventLists
                                       where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                       select c).FirstOrDefault();
                db.AddEventLists.Remove(aevent);
                db.insertdeleteentrytable(Guid.Parse(did), "AddEventList", Guid.Parse(uid));
            }
            var countevent = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {
                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.moduletype.ToString() == "event" && c.rowid.ToString() == dids31.ToString() select c).ToList();
                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {
                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.EventType.ToString() == "Event" && c.rowid.ToString() == dids21.ToString() select c).ToList();
                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            var a = JsonConvert.SerializeObject(countevent);
            return a;
        }
        /// <summary>
        /// Remove singleevent list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removesingleeventlist(string typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            AddEventList aevent = (from c in db.AddEventLists
                                   where c.Id.ToString() == typeIds.ToString() && c.Firmid.ToString() == uid.ToString()
                                   select c).FirstOrDefault();
            db.AddEventLists.Remove(aevent);
            db.insertdeleteentrytable(Guid.Parse(typeIds), "AddEventList", Guid.Parse(uid));
            var countevent = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countevent);
            return a;
        }
        /// <summary>
        /// Remove noe list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removenotelist(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddNoteList note = (from c in db.AddNoteLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                    select c).FirstOrDefault();
                db.AddNoteLists.Remove(note);
                db.insertdeleteentrytable(Guid.Parse(did), "AddNoteList", Guid.Parse(uid));
            }
            var countnote = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {
                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.moduletype.ToString() == "note" && c.rowid.ToString() == dids31.ToString() select c).ToList();
                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            var a = JsonConvert.SerializeObject(countnote);
            return a;
        }
        /// <summary>
        /// Remove custom activity details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string RemoveCustomActivities(string[] typeIds, string firmid, string userid, string roleid)
        {
            var db = new LawPracticeEntities();
            // delete from SaveCustomActivityData
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                SaveCustomActivityData contact = (from c in db.SaveCustomActivityDatas
                                                  where c.cid.ToString() == did.ToString() && c.Firmid.ToString() == firmid.ToString()
                                                  select c).FirstOrDefault();
                db.SaveCustomActivityDatas.Remove(contact);
                db.insertdeleteentrytable(Guid.Parse(did), "SaveCustomActivityData", Guid.Parse(firmid));
            }
            var countcontact = db.SaveChanges();
            // delete from CustomActivityColMap
            foreach (string dids1 in typeIds)
            {
                string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1));
                IEnumerable<CustomActivityColMap> ct1 = (from c in db.CustomActivityColMaps where c.Firmid.ToString() == firmid.ToString() && c.pid.ToString() == dids.ToString() select c).ToList();
                db.CustomActivityColMaps.RemoveRange(ct1);
                //db.insertdeleteentrytable(Guid.Parse(dids), "CustomActivityColMap", Guid.Parse(firmid));
                db.SaveChanges();
            }
            // delete from CustomActivityFileMap
            foreach (string dids13 in typeIds)
            {
                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<CustomActivityFileMap> ct2 = (from c in db.CustomActivityFileMaps where c.Firmid.ToString() == firmid.ToString() && c.Fileid.ToString() == dids31.ToString() select c).ToList();
                db.CustomActivityFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "CustomActivityFileMap", Guid.Parse(firmid));
                db.SaveChanges();
            }
            // delete from CustomActivityUserMap
            foreach (string dids2 in typeIds)
            {
                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<CustomActivityUserMap> ct3 = (from c in db.CustomActivityUserMaps where c.Firmid.ToString() == firmid.ToString() && c.rowid.ToString() == dids21.ToString() select c).ToList();
                db.CustomActivityUserMaps.RemoveRange(ct3);
                //db.insertdeleteentrytable(Guid.Parse(dids21), "CustomActivityUserMap", Guid.Parse(firmid));
                db.SaveChanges();
            }
            var countcontactmap = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcontact);
            return a;
        }
        public string removematterlist(string[] typeIds, string firmid, string uid, string dburl, string apiurl)
        {
#pragma warning disable CS0168 // The variable 'result' is declared but never used
            dynamic result;
#pragma warning restore CS0168 // The variable 'result' is declared but never used
            var db = new LawPracticeEntities();
#pragma warning disable CS0219 // The variable 'fsts' is assigned but its value is never used
            var fsts = false;
#pragma warning restore CS0219 // The variable 'fsts' is assigned but its value is never used
            var ctd = 0;
#pragma warning disable CS0219 // The variable 'con' is assigned but its value is never used
            SqlConnection con = null;
#pragma warning restore CS0219 // The variable 'con' is assigned but its value is never used
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    foreach (string did1 in typeIds)
                    {
                        string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                        ctd = db.usp_removecase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                        if (ctd > 0)
                        {
                            db.insertdeleteentrytable(Guid.Parse(did), "AddLawMatterList", Guid.Parse(firmid));
                        }
                        var datamap = db.usp_getmapcaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                        if (datamap != null)
                        {
                            try
                            {
                                var chkdlt = db.usp_RemoveMapCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                var addfClientd = new WebClient();
                                object rawfiled = new
                                {
                                    Accesstoken = "mykase123456789abcdef",
                                    id = datamap,
                                };
                                addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                string buildersd = JsonConvert.SerializeObject(rawfiled);
                                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/RemoveCasebyAdminUser"), "POST", buildersd);
                                dynamic data = JObject.Parse(residd);
                                string status = data.Status;
                                string Message = data.Message;
                                string dataval = data.data;
                                if (dataval == "Deleted Successfully")
                                {
                                    fsts = true;
                                }
                                else
                                {
                                    return "0";
                                }
                            }
                            catch
                            {
                            }
                            finally
                            {
                            }
                        }
                        //remove assign user
                        var removecaseuser = db.removecaseassignuser(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did.ToString()));
                        db.insertdeleteentrytable(Guid.Parse(did), "tbl_caseusermap", Guid.Parse(firmid));
                        //remove assign external user
                        var removecaseuser1 = db.removecaseexternalassignuser(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did.ToString()));
                        db.insertdeleteentrytable(Guid.Parse(did), "tbl_caseexternalusermap", Guid.Parse(firmid));
                    }
                    foreach (string dids1 in typeIds)
                    {
                        string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1));
                        int ctd1 = db.usp_removecontactscolumn(firmid, uid, dids, 8);
                        if (ctd1 > 0)
                        {
                            db.insertdeleteentrytable(Guid.Parse(dids), "ColMap", Guid.Parse(uid));
                        }
                    }
                    transaction.Commit();
                    var a = JsonConvert.SerializeObject("");
                    return a;
                }
                catch (Exception er)
                {
                    transaction.Rollback();
                    return er.Message.ToString();
                }
            }
        }

        /// <summary>
        /// Unlink casewatch case
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <param name="dburl"></param>
        /// <param name="apiurl"></param>
        /// <returns></returns>
        public string unlinkcasewatchcase(string caseid, string firmid, string uid, string dburl, string apiurl)
        {
            var db = new LawPracticeEntities();
            var result = false;
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var did1 = caseid;
                    string did = "";
                    try
                    {
                        did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                    }
                    catch
                    {
                        did = caseid;
                    }
                    //Check IsRevenue Case or NOt
                    dynamic IsRev = 0;
                    dynamic Isrera = 0;
                    var IsRevenueCheck = db.usp_CaseBasicDetails(firmid, uid, did).FirstOrDefault();
                    if (IsRevenueCheck != null)
                    {
                        IsRev = IsRevenueCheck.IsRevenueCourt;
                        Isrera = IsRevenueCheck.IsReraCourt;
                    }
                    if (IsRev == 1)
                    {
                        var datamap = db.usp_getmapRevenuecaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                        if (datamap != null)
                        {
                            try
                            {
                                var chkdlt = db.usp_RemoveMapRevenueCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                var residd = AddCaseCaseWatch.RemoveRevenueCasebyUserCaseId(uid, datamap.ToString(), apiurl);
                                dynamic data = JObject.Parse(residd);
                                string status = data.Status;
                                string Message = data.Message;
                                string dataval = data.data;
                                if (dataval == "Deleted Successfully")
                                {
                                    result = true;
                                    transaction.Commit();
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return "0";
                                }
                            }
                            catch
                            {
                                transaction.Rollback();
                            }
                            finally
                            {
                                // transaction.Rollback();
                            }
                        }
                        return result.ToString();
                    }
                    else if (Isrera == 1)
                    {
                        var datamap = db.usp_getmapcaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                        if (datamap != null)
                        {
                            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
                            try
                            {
                                var chkdlt = db.usp_RemoveMapCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                var cnt1 = db.usp_RemoveSearchbyPartyNameCase(Guid.Parse(firmid), Guid.Parse(uid), datamap.ToString());
                                var addfClientd = new WebClient();
                                object rawfiled = new
                                {
                                    Accesstoken = "mykase123456789abcdef",
                                    Userid = matteridname + uid,
                                    Id = datamap,
                                };
                                addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                string buildersd = JsonConvert.SerializeObject(rawfiled);
                                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/RemoveReraCasebyUserCaseId"), "POST", buildersd);
                                dynamic data = JObject.Parse(residd);
                                string status = data.Status;
                                string Message = data.Message;
                                string dataval = data.data[0].vTaggedName.Value;
                                if (dataval == "Case Deleted Successfully")
                                {
                                    result = true;
                                    transaction.Commit();
                                }
                                else if (dataval == "Case already Deleted")
                                {
                                    result = true;
                                    transaction.Commit();
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return "0";
                                }
                            }
                            catch
                            {
                                transaction.Rollback();
                            }
                        }
                        return result.ToString();
                    }
                    else
                    {
                        var datamap = db.usp_getmapcaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                        if (datamap != null)
                        {
                            try
                            {
                                var chkdlt = db.usp_RemoveMapCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                var cnt1 = db.usp_RemoveSearchbyPartyNameCase(Guid.Parse(firmid), Guid.Parse(uid), datamap.ToString());
                                var addfClientd = new WebClient();
                                object rawfiled = new
                                {
                                    Accesstoken = "mykase123456789abcdef",
                                    id = datamap,
                                };
                                addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                string buildersd = JsonConvert.SerializeObject(rawfiled);
                                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/RemoveCasebyAdminUser"), "POST", buildersd);
                                dynamic data = JObject.Parse(residd);
                                string status = data.Status;
                                string Message = data.Message;
                                string dataval = data.data;
                                if (dataval == "Deleted Successfully")
                                {
                                    result = true;
                                    transaction.Commit();
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return "0";
                                }
                            }
                            catch
                            {
                                transaction.Rollback();
                            }
                            finally
                            {
                            }
                        }
                        return result.ToString();
                    }
                }
                catch (Exception er)
                {
                    transaction.Rollback();
                    return er.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Remove contact list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string removecontactslist(string[] typeIds, string uid, string type)
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    foreach (string did1 in typeIds)
                    {
                        string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                        int ctd = db.usp_removecontacts(uid, null, did, type);
                        if (ctd > 0)
                        {
                            db.insertdeleteentrytable(Guid.Parse(did), "AddContactsList", Guid.Parse(uid));
                        }
                    }
                    foreach (string dids1 in typeIds)
                    {
                        string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1));
                        int ctd1 = db.usp_removecontactscolumn(uid, null, dids, 11);
                        if (ctd1 > 0)
                        {
                            db.insertdeleteentrytable(Guid.Parse(dids), "ColMap", Guid.Parse(uid));
                        }
                    }
                    var countcontactmap = db.SaveChanges();
                    var a = JsonConvert.SerializeObject(1);
                    transaction.Commit();
                    return a;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Remove contact list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removecontactlist(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddContactsList contact = (from c in db.AddContactsLists
                                           where c.cid.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                                           select c).FirstOrDefault();
                db.AddContactsLists.Remove(contact);
                db.insertdeleteentrytable(Guid.Parse(did), "AddContactsList", Guid.Parse(uid));
            }
            var countcontact = db.SaveChanges();
            foreach (string dids1 in typeIds)
            {
                string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1));
                IEnumerable<ColMap> ct1 = (from c in db.ColMaps where c.formid.ToString() == "7" && c.Firmid.ToString() == uid.ToString() && c.pid.ToString() == dids.ToString() select c).ToList();
                db.ColMaps.RemoveRange(ct1);
                db.insertdeleteentrytable(Guid.Parse(dids), "ColMap", Guid.Parse(uid));
                db.SaveChanges();
            }
            var countcontactmap = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcontact);
            return a;
        }
        /// <summary>
        /// Addd fav contact
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string Addtofavcontactlist(string[] typeIds, string firmid, string userid, int roleid)
        {
            int countcontact = 0;
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                var data = db.Sp_AddtoFavContact(firmid, userid, did, roleid);
                countcontact = data;
            }
            return countcontact.ToString();
        }
        /// <summary>
        /// Remove fav contact by given detail
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string Removetofavcontactlist(string[] typeIds, string firmid, string userid, int roleid)
        {
            var countcontact = 0;
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                var data = db.Sp_RemovetoFavContact(firmid, userid, did, roleid);
                countcontact = data;
                if (countcontact > 0)
                {
                    db.insertdeleteentrytable(Guid.Parse(did), "Tbl_FavContact", Guid.Parse(firmid));
                }
            }
            return countcontact.ToString();
        }
        /// <summary>
        /// Verify data list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string verifydatalist(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptStringAES(did1);
                var cf = (from c in db.SaveCustomFieldDatas
                          where c.cid.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString()
                          select c).FirstOrDefault();
                cf.Status = 1;
                cf.iupdate = 1;
                db.Entry(cf).State = EntityState.Modified;
            }
            var countcontact = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcontact);
            return a;
        }
        /// <summary>
        /// Get single calling list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singlecalllist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSingleCallDetails_Result> list = new List<GetSingleCallDetails_Result>();
            list = db.GetSingleCallDetails(Guid.Parse(uid), Guid.Parse(id)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSingleCallDetails_Result newItem = new GetSingleCallDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (!string.IsNullOrEmpty(data.AssignUserName))
                {
                    string[] words = data.AssignUserName.ToString().Split(',');
                    foreach (string word in words)
                    {
                        string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                        sb.Append(tempuser);
                        sb.Append(",");
                    }
                    newItem.AssignUserName = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].AssignUserName = newItem.AssignUserName;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single time entry
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singletimeentrylist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            var timer = db.Gettimeentry(Guid.Parse(uid), Guid.Parse(id)).ToList();
            var a = JsonConvert.SerializeObject(timer);
            return a;
        }
        /// <summary>
        /// New single time entry
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string Newsingletimeentrylist(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var timer = db.SingleNewTimeEntry(firmid, userid, id).ToList();
            var a = JsonConvert.SerializeObject(timer);
            return a;
        }
        /// <summary>
        /// Get single note list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singlenotelist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSingleNoteDetails_Result> list = new List<GetSingleNoteDetails_Result>();
            list = db.GetSingleNoteDetails(Guid.Parse(uid), Guid.Parse(id)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSingleNoteDetails_Result newItem = new GetSingleNoteDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single event list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singleeventlist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            List<GetSnigleEventDetails_Result> list = new List<GetSnigleEventDetails_Result>();
            list = db.GetSnigleEventDetails(Guid.Parse(uid), Guid.Parse(id)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetSnigleEventDetails_Result newItem = new GetSnigleEventDetails_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }

        /// <summary>
        /// Single task list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singletasklist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSingleTaskDetails_Result> list = new List<GetSingleTaskDetails_Result>();
            list = db.GetSingleTaskDetails(Guid.Parse(uid), Guid.Parse(id)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSingleTaskDetails_Result newItem = new GetSingleTaskDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }

        /// <summary>
        /// Single reminder list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singlereminderlist(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<usp_SingleEventReminderList_Result> list = new List<usp_SingleEventReminderList_Result>();
            list = db.usp_SingleEventReminderList(firmid, userid, id).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                usp_SingleEventReminderList_Result newItem = new usp_SingleEventReminderList_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single note list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singlenoticelist(string uid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetNoticeById_Result> list = new List<GetNoticeById_Result>();
            list = db.GetNoticeById(Guid.Parse(uid), Guid.Parse(userid), id).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNoticeById_Result newItem = new GetNoticeById_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Publish
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public bool publish(string uid, int ctype)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var result = db.usp_SaveFirmConfiguredCustomFields(uid.ToString(), ctype.ToString(), 1, 1);
            return true;
        }
        /// <summary>
        /// Get custom field count
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public string customfieldcount(string firmid, string ctype)
        {
            var db = new LawPracticeEntities();
            FirmCustomField ft = new FirmCustomField();
            var data = db.usp_GetNotActiveFirmConfiguredCustomFields(firmid, ctype);
            var a = JsonConvert.SerializeObject(data);
            return a;
        }
        /// <summary>
        /// Sp col map
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string spcolmap1(string uid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetColMaps(Guid.Parse(uid), Convert.ToInt32(id)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// ca sp col map
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string caspcolmap1(string uid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetCustomActivityColMaps(Guid.Parse(uid), id).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Remove file notification content
        /// </summary>
        /// <param name="dfilename"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string GetRemoveFileNotificationContent(string dfilename, string type)
        {
            var content = "";
            if (type == "Expense")
            {
                content = "You have Deleted Document (" + dfilename + ") from Expense";
            }
            else if (type == "replycommunique" || type == "communique")
            {
                content = "You have Deleted Document (" + dfilename + ") from Communication";
            }
            else if (type == "TimeEntry")
            {
                content = "You have Deleted Document (" + dfilename + ") from Time Entry";
            }
            else if (type == "Lead")
            {
                content = "You have Deleted Document (" + dfilename + ") from contact";
            }
            else if (type == "task" || type == "completetask" || type == "overduecompletetask")
            {
                content = "You have Deleted Document (" + dfilename + ") from task";
            }
            return content;
        }
        /// <summary>
        /// Remove multiple new file
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="dataid"></param>
        /// <param name="type"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool RemoveMultipleFileNew(string uid, string dataid, string type, string userid)
        {
            try
            {
                var db = new LawPracticeEntities();
                MultipleFileMap ft = new MultipleFileMap();
                Guid rowid = Guid.Empty;
                var getfiledetails = db.usp_GetMultipleFileMapById(dataid, type.ToString(), uid).FirstOrDefault();
                if (getfiledetails != null)
                {
                    try
                    {
                        var dfilename = getfiledetails.filedocs;
                        int idx = dfilename.LastIndexOf('.');
                        string string1 = dfilename.Substring(0, idx);
                        string string2 = dfilename.Substring(idx + 1);
                        string1 = string1.Substring(0, string1.Length - 10);
                        dfilename = string1 + "." + string2;
                        string notification = GetRemoveFileNotificationContent(dfilename, type);
                        db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                    }
                    catch
                    {
                    }
                    var cnt = db.usp_RemoveMultipleFileMaps_api(dataid, uid, type);
                    if (cnt > 0)
                    {
                        var cnt1 = db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                        try
                        {
                            if (getfiledetails != null)
                            {
                                string folderpathazure = SaveCommonModulesDocument.FindAzureDocuementPath(type, uid, userid);
                                AzureDocumentself.DeleteFile(folderpathazure, getfiledetails.filedocs, getfiledetails.Firmid.ToString(), getfiledetails.userid.ToString());
                            }
                        }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                        catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                        {
                        }
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return true;
        }
        /// <summary>
        /// Remove multiple file
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="dataid"></param>
        /// <param name="type"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool RemoveMultipleFile(string uid, string dataid, string type, string userid)
        {
            try
            {
                var db = new LawPracticeEntities();
                MultipleFileMap ft = new MultipleFileMap();
                Guid rowid = Guid.Empty;
                if (type != "")
                {
                    if (type == "Expense") //for lead
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "Expense").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from Expense";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            try
                            {
                                if (de1 != null)
                                {
                                    string folderpathazure = "Documents/Expensedocuments/" + de1.Firmid.ToString() + "/" + de1.userid.ToString();
                                    AzureDocumentself.DeleteFile(folderpathazure, de1.filedocs, de1.Firmid.ToString(), de1.userid.ToString());
                                }
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                    if (type == "replycommunique") //for lead
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "replycommunique").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from Communication";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            try
                            {
                                if (de1 != null)
                                {
                                    string folderpathazure = "Documents/CaseCommunique/" + de1.Firmid.ToString() + "/" + de1.userid.ToString();
                                    AzureDocumentself.DeleteFile(folderpathazure, de1.filedocs, de1.Firmid.ToString(), de1.userid.ToString());
                                }
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                    if (type == "TimeEntry") //for lead
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "TimeEntry").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from Time Entry";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            try
                            {
                                if (de1 != null)
                                {
                                    string folderpathazure = "Documents/TimeEntry/" + de1.Firmid.ToString() + "/" + de1.userid.ToString();
                                    AzureDocumentself.DeleteFile(folderpathazure, de1.filedocs, de1.Firmid.ToString(), de1.userid.ToString());
                                }
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                    if (type == "communique") //for lead
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "Communique").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from Communication";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            try
                            {
                                if (de1 != null)
                                {
                                    string folderpathazure = "Documents/CaseCommunique/" + de1.Firmid.ToString() + "/" + de1.userid.ToString();
                                    AzureDocumentself.DeleteFile(folderpathazure, de1.filedocs, de1.Firmid.ToString(), de1.userid.ToString());
                                }
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                    if (type == "Lead") //for lead
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "Lead").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from contact";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "Lead").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.LeadLists.Where(x => x.lid == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.lddocs = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                        }
                    }
                    if (type == "event") //for event
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "event").FirstOrDefault();
                        if (de1 != null)
                        {
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "event").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.AddEventLists.Where(x => x.Id == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.tfile = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                        }
                    }
                    if (type == "note") //for note
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "note").FirstOrDefault();
                        if (de1 != null)
                        {
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "note").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.AddNoteLists.Where(x => x.Id == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.nfiles = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                        }
                    }
                    if (type == "task") //for task
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "task").FirstOrDefault();
                        if (de1 != null)
                        {
                            try
                            {
                                var dfilename = de1.filedocs;
                                int idx = dfilename.LastIndexOf('.');
                                string string1 = dfilename.Substring(0, idx);
                                string string2 = dfilename.Substring(idx + 1);
                                string1 = string1.Substring(0, string1.Length - 10);
                                dfilename = string1 + "." + string2;
                                string notification = "You have Deleted Document (" + dfilename + ") from task";
                                db.usp_AddActivity(uid.ToString(), userid, notification, "Delete Document", null, null);
                            }
                            catch
                            {
                            }
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "task").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.AddTaskLists.Where(x => x.Id == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.tfile = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                        }
                    }
                    if (type == "call") //for call
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "call").FirstOrDefault();
                        if (de1 != null)
                        {
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "call").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.AddCallLists.Where(x => x.Id == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.cfiles = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                        }
                    }
                    if (type == "case") //for case
                    {
                        MultipleFileMap de1 = db.MultipleFileMaps.Where(x => x.fid.ToString() == dataid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "case").FirstOrDefault();
                        if (de1 != null)
                        {
                            rowid = Guid.Parse(de1.rowid.ToString());
                            db.MultipleFileMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(dataid), "MultipleFileMap", Guid.Parse(uid));
                            db.SaveChanges();
                            MultipleFileMap de2 = db.MultipleFileMaps.Where(x => x.rowid.ToString() == rowid.ToString() && x.Firmid.ToString() == uid.ToString() && x.moduletype == "case").FirstOrDefault();
                            if (de2 == null)
                            {
                                var cf = db.AddLawMatterLists.Where(x => x.Id == rowid && x.Firmid.ToString() == uid.ToString()).FirstOrDefault();
                                cf.cfile = null;
                                cf.iupdate = 1;
                                db.Entry(cf).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                            try
                            {
                                if (de1 != null)
                                {
                                    string folderpathazure = "Documents/Matterdocuments/" + de1.Firmid.ToString() + "/" + de1.userid.ToString();
                                    AzureDocumentself.DeleteFile(folderpathazure, de1.filedocs, de1.Firmid.ToString(), de1.userid.ToString());
                                }
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                // handle exception
            }
            return true;
        }
        /// <summary>
        /// Remove field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <param name="cid"></param>
        /// <returns></returns>
        public bool removefield(string uid, string ctype, string cid)
        {
            try
            {
                var db = new LawPracticeEntities();
                FirmCustomField ft = new FirmCustomField();
#pragma warning disable CS0219 // The variable 'tq' is assigned but its value is never used
                var tq = "";
#pragma warning restore CS0219 // The variable 'tq' is assigned but its value is never used
                string cname = "1";
#pragma warning disable CS0219 // The variable 'idt' is assigned but its value is never used
                var idt = 0;
#pragma warning restore CS0219 // The variable 'idt' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'cdt' is assigned but its value is never used
                var cdt = 0;
#pragma warning restore CS0219 // The variable 'cdt' is assigned but its value is never used
                string rs = "0";
                string rs2 = "0";
#pragma warning disable CS0219 // The variable 'colname' is assigned but its value is never used
                var colname = "";
#pragma warning restore CS0219 // The variable 'colname' is assigned but its value is never used
                var result = (from c in db.FirmConfiguredCustomFields
                              join ct in db.CustomFields on c.FieldType equals ct.Id
                              where c.Firmid.ToString() == uid && c.ConfigurationType.ToString() == ctype && c.Id.ToString() == cid
                              select new
                              {
                                  tq = c.FieldName
                              });
                foreach (var item in result)
                {
                    cname = item.tq;
                    // etc..
                }
                var remove = from d in db.ColMaps
                             where d.column_name == cname && d.id.ToString() == cid && d.formid.ToString() == ctype
                             select new
                             {
                                 idt = d.pid,
                                 cdt = d.id,
                                 colname = d.column_no
                             };
                //Movie movie = db.Movies.Find(id);
                foreach (var item1 in remove)
                {
                    rs = item1.idt.ToString();
                    rs2 = item1.cdt.ToString();
                    if (rs != "0")
                    {
                        AddContactsList de = db.AddContactsLists.Find(rs);
                        if (de != null)
                        {
                            de.iupdate = 1;
                            if (item1.colname == "col1")
                            {
                                de.col1 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col2")
                            {
                                de.col2 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col3")
                            {
                                de.col3 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col4")
                            {
                                de.col4 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col5")
                            {
                                de.col5 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col6")
                            {
                                de.col6 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col7")
                            {
                                de.col7 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col8")
                            {
                                de.col8 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col9")
                            {
                                de.col9 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col10")
                            {
                                de.col10 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col11")
                            {
                                de.col11 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col12")
                            {
                                de.col12 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col13")
                            {
                                de.col13 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col14")
                            {
                                de.col14 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                            if (item1.colname == "col15")
                            {
                                de.col15 = null;
                                db.Entry(de).State = EntityState.Modified;
                            }
                        }
                    }
                    if (rs2 != "0")
                    {
                        ColMap de1 = db.ColMaps.Where(x => x.id.ToString() == rs2.ToString()).FirstOrDefault();
                        if (de1 != null)
                        {
                            db.ColMaps.Remove(de1);
                            db.insertdeleteentrytable(Guid.Parse(rs2), "ColMap", Guid.Parse(uid));
                        }
                    }
                    // etc..
                }
                //delete data from firmconfirmed field
                FirmConfiguredCustomField de2 = db.FirmConfiguredCustomFields.Where(x => x.Id.ToString() == cid.ToString()).FirstOrDefault();
                if (de2 != null)
                {
                    db.FirmConfiguredCustomFields.Remove(de2);
                    db.insertdeleteentrytable(Guid.Parse(cid), "FirmConfiguredCustomFields", Guid.Parse(uid));
                }
                db.SaveChanges();
                db.SaveChanges();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                // handle exception
            }
            return true;
        }
        /// <summary>
        /// Get permission list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string permissionlist(string uid)
        {
            var db = new LawPracticeEntities();
            var plist = db.usp_docsharepermission().ToList();
            var a = JsonConvert.SerializeObject(plist);
            return a;
        }
        /// <summary>
        /// Create directory
        /// </summary>
        /// <param name="dname"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <returns></returns>
        public bool Createdir(string dname, string firmid, string userid, string pfile)
        {
            var db = new LawPracticeEntities();
            ViewFile vf = new ViewFile();
            vf.fname = dname;
            vf.ftype = 0;
            vf.pfile = Guid.Parse(pfile);
            vf.Firmid = Guid.Parse(firmid);
            vf.Firmuser = Guid.Parse(userid);
            vf.date_time = System.DateTime.Now;
            db.ViewFiles.Add(vf);
            db.SaveChanges();
            tbl_notification tn1 = new tbl_notification();
            tn1.date_time = DateTime.Now;
            tn1.Firmid = Guid.Parse(firmid);
            tn1.userid = Guid.Parse(userid);
            tn1.auser = Guid.Parse(userid);
            tn1.ntype = "Createdir";
            tn1.status = 1;
            tn1.urllink = "";
            tn1.notification = "You have Create New Directory";
            tn1.typeid = vf.Id;
            db.tbl_notification.Add(tn1);
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Load user directory
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string UserLoadDirectory(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetUserFile(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load assign user directory
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string AssignUserLoadDirectory(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetAssignUserDirList(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load shaare user directory
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string ShareUserLoadDirectory(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetShareUserDirList(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Get firm file list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string FirmFileList(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetFirmFile(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(id)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Assign file per user list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string AssignFilePerUserList(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            List<GetAssignFileUserList_Result> list = new List<GetAssignFileUserList_Result>();
            list = db.GetAssignFileUserList(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(id)).ToList();
            foreach (var data in list.ToList())
            {
                GetAssignFileUserList_Result newItem = new GetAssignFileUserList_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Assign cloud file per user list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string AssignFilePerUserListCloud(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            List<GetAssignFileUserListCloud_Result> list = new List<GetAssignFileUserListCloud_Result>();
            list = db.GetAssignFileUserListCloud(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(id)).ToList();
            foreach (var data in list.ToList())
            {
                GetAssignFileUserListCloud_Result newItem = new GetAssignFileUserListCloud_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Share file user list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string ShareFileUserList(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetShareFileUserList(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Share file user list by rowid
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string ShareFileUserListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetShareFileUserListbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Assign user file list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string AssignUserFileList(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetAssignUserFile(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Get assign azure user file list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string AzureAssignUserFileListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize, string search)
        {
            var db = new LawPracticeEntities();
            List<AzureAssignUserFilebyrowid_Result> list = new List<AzureAssignUserFilebyrowid_Result>();
            list = db.AzureAssignUserFilebyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                AzureAssignUserFilebyrowid_Result newItem = new AzureAssignUserFilebyrowid_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get assign user file list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string AssignUserFileListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetAssignUserFilebyrowid_Result> list = new List<GetAssignUserFilebyrowid_Result>();
            list = db.GetAssignUserFilebyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize).ToList();
            foreach (var data in list.ToList())
            {
                GetAssignUserFilebyrowid_Result newItem = new GetAssignUserFilebyrowid_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get assign user file list by row id cloud
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="pfile"></param>
        /// <param name="pfilemain"></param>
        /// <returns></returns>
        public string AssignUserFileListbyrowidCloud(string firmid, string userid, string id, int pagenum, int pagesize, string search, string pfile, string pfilemain)
        {
            var db = new LawPracticeEntities();
            List<GetAssignUserFilebyrowidCloudCheckINOut_Result> list = new List<GetAssignUserFilebyrowidCloudCheckINOut_Result>();
            list = db.GetAssignUserFilebyrowidCloudCheckINOut(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search, pfile, pfilemain).ToList();
            foreach (var data in list.ToList())
            {
                GetAssignUserFilebyrowidCloudCheckINOut_Result newItem = new GetAssignUserFilebyrowidCloudCheckINOut_Result();
                if (!string.IsNullOrEmpty(data.AZureFIleId))
                {
                    newItem.AZureFIleId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFIleId));
                    list[list.IndexOf(data)].AZureFIleId = newItem.AZureFIleId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Assign User File List by rowid Cloud Content Search
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="pfile"></param>
        /// <param name="pfilemain"></param>
        /// <returns></returns>
        public string AssignUserFileListbyrowidCloudContentSearch(string firmid, string userid, string id, int pagenum, int pagesize, string search, string pfile, string pfilemain)
        {
            var db = new LawPracticeEntities();
            List<GetAssignUserFilebyrowidCloudCheckINOut_DocIndex2_Result> list = new List<GetAssignUserFilebyrowidCloudCheckINOut_DocIndex2_Result>();
            list = db.GetAssignUserFilebyrowidCloudCheckINOut_DocIndex2(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                GetAssignUserFilebyrowidCloudCheckINOut_DocIndex2_Result newItem = new GetAssignUserFilebyrowidCloudCheckINOut_DocIndex2_Result();
                if (!string.IsNullOrEmpty(data.AZureFIleId))
                {
                    newItem.AZureFIleId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFIleId));
                    list[list.IndexOf(data)].AZureFIleId = newItem.AZureFIleId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Share user file list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string ShareUserFileList(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var sp = db.SharedFileUserList(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(id)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Create new file
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="fpermissions"></param>
        /// <param name="filedetail"></param>
        /// <param name="directname"></param>
        /// <param name="fileext"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public bool Createfile(string fileName, string fpermissions, string filedetail, string directname, string fileext, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            if (directname != "")
            {
                string directname1 = directname;
                ViewFile vf = new ViewFile();
                vf.fname = fileName;
                vf.ftype = 1;
                vf.pfile = Guid.Parse(directname1.ToString());
                vf.Firmid = Guid.Parse(FirmId);
                vf.Firmuser = Guid.Parse(UserId);
                vf.fdetails = filedetail;
                vf.filetype = fileext;
                vf.fpermission = fpermissions;
                vf.date_time = System.DateTime.Now;
                db.ViewFiles.Add(vf);
                db.SaveChanges();
                tbl_notification tn1 = new tbl_notification();
                tn1.date_time = DateTime.Now;
                tn1.Firmid = Guid.Parse(FirmId);
                tn1.userid = Guid.Parse(UserId);
                tn1.auser = Guid.Parse(UserId);
                tn1.ntype = "CreateFile";
                tn1.status = 0;
                tn1.urllink = "";
                tn1.notification = "You have Create New File";
                tn1.typeid = vf.Id;
                db.tbl_notification.Add(tn1);
                db.SaveChanges();
            }
            else
            {
                ViewFile vf = new ViewFile();
                vf.fname = fileName;
                vf.ftype = 1;
                vf.pfile = Guid.Parse("00000000-0000-0000-0000-000000000000");
                vf.Firmid = Guid.Parse(FirmId);
                vf.Firmuser = Guid.Parse(UserId);
                vf.fdetails = filedetail;
                vf.filetype = fileext;
                vf.fpermission = fpermissions;
                vf.date_time = System.DateTime.Now;
                db.ViewFiles.Add(vf);
                db.SaveChanges();
                tbl_notification tn1 = new tbl_notification();
                tn1.date_time = DateTime.Now;
                tn1.Firmid = Guid.Parse(FirmId);
                tn1.userid = Guid.Parse(UserId);
                tn1.auser = Guid.Parse(UserId);
                tn1.ntype = "CreateFile";
                tn1.status = 0;
                tn1.urllink = "";
                tn1.notification = "You have Create New File";
                tn1.typeid = vf.Id;
                db.tbl_notification.Add(tn1);
                db.SaveChanges();
            }
            return true;
        }
        /// <summary>
        /// Save case file details
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="filesize"></param>
        /// <param name="caseid"></param>
        /// <param name="userid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string savecasefile(string fileName, float filesize, string caseid, string userid, string firmid)
        {
            var db = new LawPracticeEntities();
            var date_time = System.DateTime.Now.ToString();
            int caseids = Convert.ToInt32(caseid);
            var saveresult = db.usp_savecasefile(fileName, filesize, caseids, Guid.Parse(firmid), Guid.Parse(userid), date_time);
            return saveresult.ToString();
        }
        /// <summary>
        /// Save OCR file
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="ocrcontent"></param>
        /// <param name="details"></param>
        /// <param name="userid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string saveocrfile(string fileName, string ocrcontent, string details, string userid, string firmid)
        {
            var db = new LawPracticeEntities();
            var date_time = System.DateTime.Now.ToString();
            var saveresult = db.usp_saveocrfile(fileName, details, ocrcontent, Guid.Parse(firmid), Guid.Parse(userid), date_time);
            return saveresult.ToString();
        }
        /// <summary>
        /// Load directory file
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public List<ViewFile> LoadDirectoryFile(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var listdir = db.ViewFiles.Where(x => x.Firmid.ToString() == firmid && x.Firmuser.ToString() == userid && x.ftype == 1).ToList();
            return listdir;
        }
        /// <summary>
        /// Load file
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string loadFiles(string firmId, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetDirectoryFile(Guid.Parse(firmId), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove directory file
        /// </summary>
        /// <param name="did"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removedirectory(string did, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var getuser = db.ViewFiles.Where(x => x.Id.ToString() == did.ToString() && x.Firmid.ToString() == firmid).FirstOrDefault();
            if (getuser != null)
            {
                ViewFile countdir = (from c in db.ViewFiles
                                     where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == firmid && c.Firmuser.ToString() == getuser.Firmuser.ToString() && c.ftype == 0
                                     select c).FirstOrDefault();
                db.ViewFiles.Remove(countdir);
            }
            db.insertdeleteentrytable(Guid.Parse(did), "ViewFiles", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Remove cloud directory
        /// </summary>
        /// <param name="did"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removedirectoryCloud(string did, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var getuser = db.usp_CheckFilefolderCloud(firmid.ToString(), did.ToString()).FirstOrDefault();
            if (getuser != null)
            {
                ViewFilesCloud countdir = (from c in db.ViewFilesClouds
                                           where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == firmid && c.Firmuser.ToString() == getuser.Firmuser.ToString() && c.ftype == 0
                                           select c).FirstOrDefault();
                db.ViewFilesClouds.Remove(countdir);
            }
            db.insertdeleteentrytable(Guid.Parse(did), "ViewFilesCloud", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Remove directory file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removedirectoryfile(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            ViewFile countfile = (from c in db.ViewFiles
                                  where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.Firmuser.ToString() == userid && c.ftype == 1
                                  select c).FirstOrDefault();
            db.ViewFiles.Remove(countfile);
            db.insertdeleteentrytable(Guid.Parse(ffid), "ViewFiles", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Remove directory cloud file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removedirectoryfileCloud(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            try
            {
                var getfilename = db.usp_CheckFilefolderCloud(firmid.ToString(), ffid).FirstOrDefault();
                string notification = "You have Deleted file (" + getfilename.fname + ")";
                db.usp_AddActivity(firmid.ToString(), userid.ToString(), notification, "Delete File", null, Guid.Empty.ToString());
            }
            catch
            {
            }
            var count = db.Usp_Removefileversion(firmid, userid, ffid);
            db.insertdeleteentrytable(Guid.Parse(ffid), "ViewFilesCloud", Guid.Parse(firmid));
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Remove directory file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removeasdirectoryfile(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            UserFilePermission countfile = (from c in db.UserFilePermissions
                                            where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.pcontact.ToString() == userid
                                            select c).FirstOrDefault();
            db.UserFilePermissions.Remove(countfile);
            db.insertdeleteentrytable(Guid.Parse(ffid), "UserFilePermission", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Remove user directory file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removeuserdirectoryfile(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            FirmFilePermission dp1 = (from c in db.FirmFilePermissions
                                      where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.pcontact.ToString() == userid
                                      select c).FirstOrDefault();
            if (dp1 != null)
            {
                dp1.IsArchive = 1;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else
            {
                var a = "0";
                return a;
            }
        }
        /// <summary>
        /// Remove cloud file directory user
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removeuserdirectoryfileCloud(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            FirmFilePermissionCloud dp1 = (from c in db.FirmFilePermissionClouds
                                           where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.pcontact.ToString() == userid
                                           select c).FirstOrDefault();
            if (dp1 != null)
            {
                dp1.IsArchive = 1;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else
            {
                var a = "0";
                return a;
            }
        }
        /// <summary>
        /// Revert share file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string revertsharefile(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            UserFilePermission countfile = (from c in db.UserFilePermissions
                                            where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.Userid.ToString() == userid
                                            select c).FirstOrDefault();
            db.UserFilePermissions.Remove(countfile);
            db.insertdeleteentrytable(Guid.Parse(ffid), "UserFilePermission", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Revert assign file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string revertassignfile(string ffid, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            FirmFilePermission countfile = (from c in db.FirmFilePermissions
                                            where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.Userid.ToString() == userid
                                            select c).FirstOrDefault();
            db.FirmFilePermissions.Remove(countfile);
            db.insertdeleteentrytable(Guid.Parse(ffid), "FirmFilePermission", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Revert assign cloud file
        /// </summary>
        /// <param name="ffid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string revertassignfileCloud(string ffid, string firmid, string userid, int roleid)
        {
            var db = new LawPracticeEntities();
            FirmFilePermissionCloud countfile = new FirmFilePermissionCloud();
            if (roleid == 1)
            {
                countfile = (from c in db.FirmFilePermissionClouds
                             where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid
                             select c).FirstOrDefault();
            }
            else
            {
                countfile = (from c in db.FirmFilePermissionClouds
                             where c.Id.ToString() == ffid.ToString() && c.Firmid.ToString() == firmid && c.Userid.ToString() == userid
                             select c).FirstOrDefault();
            }
            try
            {
                var getfilename = db.usp_CheckFilefolderCloud(firmid.ToString(), countfile.FileId.ToString()).FirstOrDefault();
                string notification = "You have reset rights of file (" + getfilename.fname + ")";
                db.usp_AddActivity(firmid.ToString(), userid.ToString(), notification, "Reset File Rights", null, Guid.Empty.ToString());
            }
            catch
            {
            }
            db.FirmFilePermissionClouds.Remove(countfile);
            db.insertdeleteentrytable(Guid.Parse(ffid), "FirmFilePermissionCloud", Guid.Parse(firmid));
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// User directory permission
        /// </summary>
        /// <param name="did"></param>
        /// <param name="ptype"></param>
        /// <param name="user"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string userdirpermission(string did, string ptype, string user, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var previoususer = db.UserDirPermissions.Where(x => x.DirId.ToString() == did.ToString() && x.acontact.ToString() == user.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).Count();
            if (previoususer == 0)
            {
                UserDirPermission dp = new UserDirPermission();
                dp.apermission = ptype;
                dp.DirId = Guid.Parse(did.ToString());
                dp.date_time = System.DateTime.Now;
                dp.status = true;
                dp.Firmid = Guid.Parse(FirmId.ToString());
                dp.Userid = Guid.Parse(UserId.ToString());
                if (user != "")
                {
                    var puser = Convert.ToInt32(user);
                    dp.acontact = Guid.Parse(puser.ToString());
                }
                else
                {
                    dp.acontact = null;
                }
                db.UserDirPermissions.Add(dp);
                var count = db.SaveChanges();
                if (user != null)
                {
                    //client
                    tbl_notification tn1 = new tbl_notification();
                    tn1.date_time = dp.date_time;
                    tn1.Firmid = dp.Firmid;
                    tn1.userid = dp.Userid;
                    tn1.auser = Guid.Parse(user);
                    tn1.ntype = "File";
                    tn1.status = 0;
                    tn1.urllink = "/Employee/AssignUserDirectoryList";
                    tn1.notification = "You have  New File";
                    tn1.typeid = dp.Id;
                    db.tbl_notification.Add(tn1);
                    db.SaveChanges();
                }
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else if (previoususer == 1)
            {
                UserDirPermission dp1 = db.UserDirPermissions.Where(d => d.DirId.ToString() == did.ToString()).FirstOrDefault();
                dp1.apermission = ptype;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            return "1";
        }
        /// <summary>
        /// User file permission
        /// </summary>
        /// <param name="did"></param>
        /// <param name="ptype"></param>
        /// <param name="user"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string userfilepermission(string did, string ptype, string user, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var previoususer = db.FirmFilePermissions.Where(x => x.FileId.ToString() == did.ToString() && x.pcontact.ToString() == user.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).Count();
            if (previoususer == 0)
            {
                FirmFilePermission dp = new FirmFilePermission();
                dp.ppermission = ptype;
                dp.FileId = Guid.Parse(did.ToString());
                dp.date_time = System.DateTime.Now;
                dp.IsArchive = 0;
                dp.Firmid = Guid.Parse(FirmId.ToString());
                dp.Userid = Guid.Parse(UserId);
                if (user != "")
                {
                    var puser = user;
                    dp.pcontact = Guid.Parse(puser.ToString());
                }
                else
                {
                    dp.pcontact = null;
                }
                db.FirmFilePermissions.Add(dp);
                var count = db.SaveChanges();
                if (user != null)
                {
                    //client
                    tbl_notification tn1 = new tbl_notification();
                    tn1.date_time = dp.date_time;
                    tn1.Firmid = dp.Firmid;
                    tn1.userid = dp.Userid;
                    tn1.auser = Guid.Parse(user);
                    tn1.ntype = "File";
                    tn1.status = 1;
                    tn1.urllink = "/Employee/AssignUserDirectoryList";
                    tn1.notification = "You have  New File";
                    tn1.typeid = dp.Id;
                    db.tbl_notification.Add(tn1);
                    db.SaveChanges();
                }
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else if (previoususer == 1)
            {
                // MatterDirPermission dp1 = new MatterDirPermission();
                FirmFilePermission dp1 = db.FirmFilePermissions.Where(d => d.FileId.ToString() == did.ToString() && d.pcontact.ToString() == user.ToString()).FirstOrDefault();
                dp1.ppermission = ptype;
                dp1.IsArchive = 0;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            return "1";
        }
        /// <summary>
        /// User cloud file permission
        /// </summary>
        /// <param name="did"></param>
        /// <param name="ptype"></param>
        /// <param name="user"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string userfilepermissionCloud(string did, string ptype, string user, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var previoususer = db.FirmFilePermissionClouds.Where(x => x.FileId.ToString() == did.ToString() && x.pcontact.ToString() == user.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).Count();
            if (previoususer == 0)
            {
                FirmFilePermissionCloud dp = new FirmFilePermissionCloud();
                dp.ppermission = ptype;
                dp.FileId = Guid.Parse(did.ToString());
                dp.date_time = System.DateTime.Now;
                dp.IsArchive = 0;
                dp.Firmid = Guid.Parse(FirmId.ToString());
                dp.Userid = Guid.Parse(UserId);
                if (user != "")
                {
                    var puser = user;
                    dp.pcontact = Guid.Parse(puser.ToString());
                }
                else
                {
                    dp.pcontact = null;
                }
                db.FirmFilePermissionClouds.Add(dp);
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else if (previoususer == 1)
            {
                FirmFilePermissionCloud dp1 = db.FirmFilePermissionClouds.Where(d => d.FileId.ToString() == did.ToString() && d.pcontact.ToString() == user.ToString()).FirstOrDefault();
                dp1.ppermission = ptype;
                dp1.IsArchive = 0;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            return "1";
        }
        /// <summary>
        /// User share file
        /// </summary>
        /// <param name="did"></param>
        /// <param name="user"></param>
        /// <param name="ptype"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string UserShareFile(string did, string user, string ptype, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var previoususer = db.UserFilePermissions.Where(x => x.Id.ToString() == did.ToString() && x.pcontact.ToString() == user.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).Count();
            if (previoususer == 0)
            {
                UserFilePermission dp = new UserFilePermission();
                dp.ppermission = ptype;
                dp.FileId = Guid.Parse(did.ToString());
                dp.date_time = System.DateTime.Now;
                dp.Firmid = Guid.Parse(FirmId.ToString());
                dp.Userid = Guid.Parse(UserId.ToString());
                dp.IsArchive = 0;
                if (user != "")
                {
                    dp.pcontact = Guid.Parse(user.ToString());
                }
                else
                {
                    dp.pcontact = null;
                }
                db.UserFilePermissions.Add(dp);
                var count = db.SaveChanges();
                if (user != null)
                {
                    //client
                    tbl_notification tn1 = new tbl_notification();
                    tn1.date_time = dp.date_time;
                    tn1.Firmid = dp.Firmid;
                    tn1.userid = dp.Userid;
                    tn1.auser = Guid.Parse(user.ToString());
                    tn1.ntype = "File";
                    tn1.status = 0;
                    tn1.urllink = "/Employee/ShareUserDirectoryList";
                    tn1.notification = "You have Share New File";
                    tn1.typeid = dp.Id;
                    db.tbl_notification.Add(tn1);
                    db.SaveChanges();
                }
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else if (previoususer == 1)
            {
                // MatterDirPermission dp1 = new MatterDirPermission();
                UserFilePermission dp1 = db.UserFilePermissions.Where(d => d.Id.ToString() == did.ToString()).FirstOrDefault();
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            return "1";
        }
        /// <summary>
        /// Matter directory permission
        /// </summary>
        /// <param name="did"></param>
        /// <param name="matter"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string matterdirpermission(string did, string ptype, string matter, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var previousmatter = db.MatterDirPermissions.Where(x => x.DirId.ToString() == did.ToString() && x.amatter.ToString() == matter.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).Count();
            if (previousmatter == 0)
            {
                MatterDirPermission dp = new MatterDirPermission();
                dp.apermission = ptype;
                dp.DirId = Guid.Parse(did.ToString());
                dp.date_time = System.DateTime.Now;
                dp.status = true;
                dp.Firmid = Guid.Parse(FirmId.ToString());
                dp.Userid = Guid.Parse(UserId.ToString());
                if (matter != "")
                {
                    var pmatter = Convert.ToInt32(matter);
                    dp.amatter = Guid.Parse(pmatter.ToString());
                }
                else
                {
                    dp.amatter = null;
                }
                db.MatterDirPermissions.Add(dp);
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            else if (previousmatter == 1)
            {
                MatterDirPermission dp1 = db.MatterDirPermissions.Where(d => d.DirId.ToString() == did.ToString()).FirstOrDefault();
                dp1.apermission = ptype;
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                return a;
            }
            return "1";
        }
        /// <summary>
        /// Single file permission
        /// </summary>
        /// <param name="contactid"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public List<UserDirPermission> singleuserpermission(string contactid, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var data = db.UserDirPermissions.Where(x => x.acontact.ToString() == contactid.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).ToList();
            return data;
        }
        /// <summary>
        /// Single firm directory permission
        /// </summary>
        /// <param name="contactid"></param>
        /// <param name="did"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public List<UserDirPermission> FirmSingleDirPermission(string contactid, string did, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var cid = contactid;
            var dids = did;
            var data = db.UserDirPermissions.Where(x => x.acontact.ToString() == cid.ToString() && x.DirId.ToString() == dids.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).ToList();
            return data;
        }
        /// <summary>
        /// single matter permission
        /// </summary>
        /// <param name="contactid"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public List<MatterDirPermission> singlematterpermission(string contactid, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var cid = contactid;
            var data = db.MatterDirPermissions.Where(x => x.amatter.ToString() == cid.ToString() && x.Firmid.ToString() == FirmId && x.Userid.ToString() == UserId).ToList();
            return data;
        }
        /// <summary>
        /// Get single matter details
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public string singlematterdetails(string mid, string FirmId)
        {
            var db = new LawPracticeEntities();
            List<sp_MatterSingleDetail_Result> list = new List<sp_MatterSingleDetail_Result>();
            list = db.sp_MatterSingleDetail(Guid.Parse(FirmId.ToString()), Guid.Parse(mid.ToString())).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                sp_MatterSingleDetail_Result newItem = new sp_MatterSingleDetail_Result();

            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single contact details
        /// </summary>
        /// <param name="Firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string singlecontactsdetails(string Firmid, string userid, string id, string type)
        {
            var db = new LawPracticeEntities();
            List<usp_SingleContactsDetails_Result> list = new List<usp_SingleContactsDetails_Result>();
            list = db.usp_SingleContactsDetails(Firmid, userid, null, id).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                usp_SingleContactsDetails_Result newItem = new usp_SingleContactsDetails_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load company contact details
        /// </summary>
        /// <param name="Firmid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string loadcompanycontacts(string Firmid, string id)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_loadcompanycontacts(Firmid, id).ToList();
            var trialList = (from ob in list
                             select new
                             {
                                 label = ob.fname + " " + ob.mname + " " + ob.lname + "-(" + ob.ProfileType + ")",
                                 val = ob.cid,
                                 utype = ob.ProfileType,
                             }).ToList();
            var a = JsonConvert.SerializeObject(trialList);
            return a;
        }
        /// <summary>
        /// Single contact details
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public string singlecontactdetails(string mid, string FirmId)
        {
            var db = new LawPracticeEntities();
            List<GetContactSingleDetails_Result> list = new List<GetContactSingleDetails_Result>();
            list = db.GetContactSingleDetails(Guid.Parse(FirmId.ToString()), Guid.Parse(mid)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetContactSingleDetails_Result newItem = new GetContactSingleDetails_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single custom activity details
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public string singlecustomactivitydetails(string mid, string FirmId)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetCustomActivitySingleDetails_Result> list = new List<GetCustomActivitySingleDetails_Result>();
            list = db.GetCustomActivitySingleDetails(Guid.Parse(FirmId.ToString()), Guid.Parse(mid)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetCustomActivitySingleDetails_Result newItem = new GetCustomActivitySingleDetails_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Create form
        /// </summary>
        /// <param name="formname"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool CreateForm(string formname, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            FirmCustomForm vf = new FirmCustomForm();
            vf.Firmid = Guid.Parse(firmid.ToString());
            vf.FormName = formname;
            vf.IsActive = true;
            vf.IsPublished = false;
            vf.userid = Guid.Parse(userid.ToString());
            db.FirmCustomForms.Add(vf);
            db.SaveChanges();
            tbl_notification tn = new tbl_notification();
            tn.date_time = DateTime.Now;
            tn.Firmid = vf.Firmid;
            tn.userid = vf.userid;
            tn.auser = Guid.Parse(vf.userid.ToString());
            tn.ntype = "CustomForm";
            tn.status = 1;
            tn.urllink = "";
            tn.notification = "You have new CustomForm";
            tn.typeid = vf.Id;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Custom form list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string cformlist(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCustomFormList_Result> list = new List<GetCustomFormList_Result>();
            list = db.GetCustomFormList(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetCustomFormList_Result newItem = new GetCustomFormList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get Archieved Custom Form List
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string acformlist(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetArchievedCustomFormList_Result> list = new List<GetArchievedCustomFormList_Result>();
            list = db.GetArchievedCustomFormList(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetArchievedCustomFormList_Result newItem = new GetArchievedCustomFormList_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Save notice details
        /// </summary>
        /// <param name="invclient"></param>
        /// <param name="invstate"></param>
        /// <param name="invinvoicedate"></param>
        /// <param name="invduedate"></param>
        /// <param name="invmob"></param>
        /// <param name="invaddress"></param>
        /// <param name="invigstper"></param>
        /// <param name="invcgstper"></param>
        /// <param name="invsgstper"></param>
        /// <param name="invigsttempval"></param>
        /// <param name="invcgsttempval"></param>
        /// <param name="invsgsttempval"></param>
        /// <param name="invsubtotaltemp"></param>
        /// <param name="finaltotaltemp"></param>
        /// <param name="desObj"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="firmcode"></param>
        /// <param name="addressid"></param>
        /// <param name="payobj"></param>
        /// <param name="invsstate"></param>
        /// <param name="invsaddress"></param>
        /// <param name="istaxinvoice"></param>
        /// <param name="usernamefreetext"></param>
        /// <param name="emailid"></param>
        /// <param name="matterid"></param>
        /// <param name="clientpan"></param>
        /// <param name="clientgst"></param>
        /// <param name="invsubject"></param>
        /// <param name="invReference"></param>
        /// <returns></returns>
        public string saveinvoice(string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference)
        {
            using (var db = new LawPracticeEntities())
            {
                string InvoiceNos = "";
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        DateTime dt = Convert.ToDateTime(invinvoicedate);
                        var year = dt.Year;
                        var invcodes = db.usp_InvoiceSeriesByFirmId(firmid.ToString(), "").FirstOrDefault();
                        if (invcodes == null)
                        {
                            return "Invoice Series not found";
                        }
                        else
                        {
                            var NewInv = db.Sp_CreateInvoiceNo(firmid.ToString()).FirstOrDefault();
                            InvoiceNos = NewInv.InvoiceNo;
                            string id = "";
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("id", id);
                            if (invigstper.ToLower() == "nan")
                            {
                                invigstper = "0";
                            }
                            if (invcgstper.ToLower() == "nan")
                            {
                                invcgstper = "0";
                            }
                            if (invigstper.ToLower() == "nan")
                            {
                                invigstper = "0";
                            }
                            if (invsgstper.ToLower() == "nan")
                            {
                                invsgstper = "0";
                            }
                            if (invigsttempval.ToLower() == "nan")
                            {
                                invigsttempval = "0";
                            }
                            if (invcgsttempval.ToLower() == "nan")
                            {
                                invcgsttempval = "0";
                            }
                            if (invsgsttempval.ToLower() == "nan")
                            {
                                invsgsttempval = "0";
                            }
                            if (invsubtotaltemp.ToLower() == "nan")
                            {
                                invsubtotaltemp = "0";
                            }
                            if (finaltotaltemp.ToLower() == "nan")
                            {
                                finaltotaltemp = "0";
                            }
                            //insert in Invoice   
                            var insertdata = db.SaveInvoice(invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, Convert.ToDouble(invigstper), Convert.ToDouble(invcgstper), Convert.ToDouble(invsgstper), Convert.ToDouble(invigsttempval), Convert.ToDouble(invcgsttempval), Convert.ToDouble(invsgsttempval), Convert.ToDouble(invsubtotaltemp), Convert.ToDouble(finaltotaltemp), InvoiceNos, firmid, userid, addressid, invsstate, invsaddress, istaxinvoice, IDParameter, usernamefreetext, emailid, matterid, clientgst, clientpan, invsubject, invReference);
                            id = Convert.ToString(IDParameter.Value);
                            //insert invoice entry item
                            List<InvoiceList> farmobj = JsonConvert.DeserializeObject<List<InvoiceList>>(desObj);
                            if (farmobj.Count > 0)
                            {
                                for (var i = 0; i < farmobj.Count; i++)
                                {
                                    var type = farmobj[i].Quantity;
                                    //insert in a list code
                                    db.SaveInvoiceEntry(InvoiceNos, id, firmid, userid, farmobj[i].Type, farmobj[i].ItemName, matterid, farmobj[i].UserName.ToString(), Convert.ToDouble(farmobj[i].Price), Convert.ToDouble(farmobj[i].Quantity), istaxinvoice);
                                }
                            }
                            //insert payment entry 
                            if (payobj != "[]")
                            {
                                List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(payobj);
                                if (payobj1.Count > 0)
                                {
                                    for (var i = 0; i < payobj1.Count; i++)
                                    {
                                        var paymenttype = payobj1[i].PaymentType;
                                        //insert in a list code
                                        if (paymenttype.ToString() == "Cheque" || paymenttype.ToString() == "Demand Draft")
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 0);
                                        }
                                        else
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                        }
                                    }
                                }
                            }

                            //increase series of invoice
                            long seriesnos = Convert.ToInt64(invcodes.Serierno) + 1;
                            DateTime dt1 = Convert.ToDateTime(invinvoicedate);
                            string[] leadzeroarr = { "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D2", "D13", "D14", "D15" };
                            var length = invcodes.Serierno.ToString().Length;
                            var newseriesno = seriesnos.ToString(leadzeroarr[length - 1]);
                            //update series
                            db.sp_UpdateInvoiceSeriesIncrementNo(firmid.ToString(), userid.ToString(), invcodes.Id.ToString(), newseriesno);
                            transaction.Commit();
                        }
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Get Amend Invoice Series
        /// </summary>
        /// <param name="invids"></param>
        /// <param name="invclient"></param>
        /// <param name="invstate"></param>
        /// <param name="invinvoicedate"></param>
        /// <param name="invduedate"></param>
        /// <param name="invmob"></param>
        /// <param name="invaddress"></param>
        /// <param name="invigstper"></param>
        /// <param name="invcgstper"></param>
        /// <param name="invsgstper"></param>
        /// <param name="invigsttempval"></param>
        /// <param name="invcgsttempval"></param>
        /// <param name="invsgsttempval"></param>
        /// <param name="invsubtotaltemp"></param>
        /// <param name="finaltotaltemp"></param>
        /// <param name="desObj"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="firmcode"></param>
        /// <param name="addressid"></param>
        /// <param name="payobj"></param>
        /// <param name="invsstate"></param>
        /// <param name="invsaddress"></param>
        /// <param name="istaxinvoice"></param>
        /// <param name="usernamefreetext"></param>
        /// <param name="emailid"></param>
        /// <param name="matterid"></param>
        /// <param name="clientpan"></param>
        /// <param name="clientgst"></param>
        /// <param name="invsubject"></param>
        /// <param name="invReference"></param>
        /// <returns></returns>
        public string amendinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference)
        {
            using (var db = new LawPracticeEntities())
            {
                string InvoiceNos = "";
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        DateTime dt = Convert.ToDateTime(invinvoicedate);
                        var year = dt.Year;
                        var invcodes = db.Usp_GetAmendInvoiceSeries(firmid.ToString(), userid.ToString(), invids).FirstOrDefault();
                        if (invcodes == null)
                        {
                            return "Invoice Series not found";
                        }
                        else
                        {
                            var limitamend = Convert.ToInt32(WebConfigurationManager.AppSettings["InvoiceAmendLimit"]);
                            if (invcodes.Value > (limitamend - 1))
                            {
                                return "LimitExceed";
                            }
                            //get invoice no
                            var getinvnos = db.Usp_GetInvoiceDetailsByID(firmid, userid, invids).FirstOrDefault();
                            if (invcodes == null)
                            {
                                return "Invoice Number not found";
                            }
                            else
                            {
                                InvoiceNos = getinvnos.ParentInvoiceNo + WebConfigurationManager.AppSettings["InvoiceAmendPrefix"] + (invcodes.Value + 1);
                            }
                            string id = "";
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("id", id);
                            if (invigstper.ToLower() == "nan" || String.IsNullOrEmpty(invigstper))
                            {
                                invigstper = "0";
                            }
                            if (invcgstper.ToLower() == "nan" || String.IsNullOrEmpty(invcgstper))
                            {
                                invcgstper = "0";
                            }
                            if (invigstper.ToLower() == "nan" || String.IsNullOrEmpty(invigstper))
                            {
                                invigstper = "0";
                            }
                            if (invsgstper.ToLower() == "nan" || String.IsNullOrEmpty(invsgstper))
                            {
                                invsgstper = "0";
                            }
                            if (invigsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invigsttempval))
                            {
                                invigsttempval = "0";
                            }
                            if (invcgsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invcgsttempval))
                            {
                                invcgsttempval = "0";
                            }
                            if (invsgsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invsgsttempval))
                            {
                                invsgsttempval = "0";
                            }
                            if (invsubtotaltemp.ToLower() == "nan" || String.IsNullOrEmpty(invsubtotaltemp))
                            {
                                invsubtotaltemp = "0";
                            }
                            if (finaltotaltemp.ToLower() == "nan" || String.IsNullOrEmpty(finaltotaltemp))
                            {
                                finaltotaltemp = "0";
                            }
                            //insert in Invoice   
                            var insertdata = db.Usp_SaveAmendInvoice(invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, Convert.ToDouble(invigstper), Convert.ToDouble(invcgstper), Convert.ToDouble(invsgstper), Convert.ToDouble(invigsttempval), Convert.ToDouble(invcgsttempval), Convert.ToDouble(invsgsttempval), Convert.ToDouble(invsubtotaltemp), Convert.ToDouble(finaltotaltemp), InvoiceNos, firmid, userid, addressid, invsstate, invsaddress, istaxinvoice, IDParameter, usernamefreetext, emailid, matterid, getinvnos.OriginalInvoiceNo, invids, clientgst, clientpan, invsubject, invReference);
                            id = Convert.ToString(IDParameter.Value);
                            //insert invoice entry item
                            List<InvoiceEntryAmend> farmobj = JsonConvert.DeserializeObject<List<InvoiceEntryAmend>>(desObj);
                            if (farmobj.Count > 0)
                            {
                                for (var i = 0; i < farmobj.Count; i++)
                                {
                                    var username = Guid.Empty.ToString();
                                    var type = farmobj[i].Quantity;
                                    if (!String.IsNullOrEmpty(farmobj[i].billyby))
                                    {
                                        username = farmobj[i].billyby;
                                    }
                                    //insert in a list code
                                    db.SaveInvoiceEntry(InvoiceNos, id, firmid, userid, farmobj[i].Type, farmobj[i].ItemName, matterid, username.ToString(), Convert.ToDouble(farmobj[i].Price), Convert.ToDouble(farmobj[i].Quantity), istaxinvoice);
                                }
                            }
                            //insert payment entry 
                            if (payobj != "[]")
                            {
                                List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(payobj);
                                if (payobj1.Count > 0)
                                {
                                    for (var i = 0; i < payobj1.Count; i++)
                                    {
                                        var paymenttype = payobj1[i].PaymentType;
                                        //insert in a list code
                                        if (paymenttype.ToString() == "Cheque" || paymenttype.ToString() == "Demand Draft")
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 0);
                                        }
                                        else
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                        }
                                    }
                                }
                            }

                            //increase series of invoice
                            long seriesnos = Convert.ToInt64(22) + 1;
                            transaction.Commit();
                        }
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Get invoice series by firm id
        /// </summary>
        /// <param name="invids"></param>
        /// <param name="invclient"></param>
        /// <param name="invstate"></param>
        /// <param name="invinvoicedate"></param>
        /// <param name="invduedate"></param>
        /// <param name="invmob"></param>
        /// <param name="invaddress"></param>
        /// <param name="invigstper"></param>
        /// <param name="invcgstper"></param>
        /// <param name="invsgstper"></param>
        /// <param name="invigsttempval"></param>
        /// <param name="invcgsttempval"></param>
        /// <param name="invsgsttempval"></param>
        /// <param name="invsubtotaltemp"></param>
        /// <param name="finaltotaltemp"></param>
        /// <param name="desObj"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="firmcode"></param>
        /// <param name="addressid"></param>
        /// <param name="payobj"></param>
        /// <param name="invsstate"></param>
        /// <param name="invsaddress"></param>
        /// <param name="istaxinvoice"></param>
        /// <param name="usernamefreetext"></param>
        /// <param name="emailid"></param>
        /// <param name="matterid"></param>
        /// <param name="clientpan"></param>
        /// <param name="clientgst"></param>
        /// <param name="invsubject"></param>
        /// <param name="invReference"></param>
        /// <returns></returns>
        public string Recurrenceinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference)
        {
            using (var db = new LawPracticeEntities())
            {
                string InvoiceNos = "";
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        DateTime dt = Convert.ToDateTime(invinvoicedate);
                        var year = dt.Year;
                        var invcodes = db.usp_InvoiceSeriesByFirmId(firmid.ToString(), "").FirstOrDefault();
                        if (invcodes == null)
                        {
                            return "Invoice Series not found";
                        }
                        else
                        {
                            var NewInv = db.Sp_CreateInvoiceNo(firmid.ToString()).FirstOrDefault();
                            InvoiceNos = NewInv.InvoiceNo;
                            string id = "";
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("id", id);
                            if (invigstper.ToLower() == "nan" || String.IsNullOrEmpty(invigstper))
                            {
                                invigstper = "0";
                            }
                            if (invcgstper.ToLower() == "nan" || String.IsNullOrEmpty(invcgstper))
                            {
                                invcgstper = "0";
                            }
                            if (invigstper.ToLower() == "nan" || String.IsNullOrEmpty(invigstper))
                            {
                                invigstper = "0";
                            }
                            if (invsgstper.ToLower() == "nan" || String.IsNullOrEmpty(invsgstper))
                            {
                                invsgstper = "0";
                            }
                            if (invigsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invigsttempval))
                            {
                                invigsttempval = "0";
                            }
                            if (invcgsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invcgsttempval))
                            {
                                invcgsttempval = "0";
                            }
                            if (invsgsttempval.ToLower() == "nan" || String.IsNullOrEmpty(invsgsttempval))
                            {
                                invsgsttempval = "0";
                            }
                            if (invsubtotaltemp.ToLower() == "nan" || String.IsNullOrEmpty(invsubtotaltemp))
                            {
                                invsubtotaltemp = "0";
                            }
                            if (finaltotaltemp.ToLower() == "nan" || String.IsNullOrEmpty(finaltotaltemp))
                            {
                                finaltotaltemp = "0";
                            }
                            //insert in Invoice   
                            var insertdata = db.SaveInvoice(invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, Convert.ToDouble(invigstper), Convert.ToDouble(invcgstper), Convert.ToDouble(invsgstper), Convert.ToDouble(invigsttempval), Convert.ToDouble(invcgsttempval), Convert.ToDouble(invsgsttempval), Convert.ToDouble(invsubtotaltemp), Convert.ToDouble(finaltotaltemp), InvoiceNos, firmid, userid, addressid, invsstate, invsaddress, istaxinvoice, IDParameter, usernamefreetext, emailid, matterid, clientgst, clientpan, invsubject, invReference);
                            id = Convert.ToString(IDParameter.Value);
                            //insert invoice entry item
                            List<InvoiceEntryAmend> farmobj = JsonConvert.DeserializeObject<List<InvoiceEntryAmend>>(desObj);
                            if (farmobj.Count > 0)
                            {
                                for (var i = 0; i < farmobj.Count; i++)
                                {
                                    var username = Guid.Empty.ToString();
                                    var type = farmobj[i].Quantity;
                                    if (!String.IsNullOrEmpty(farmobj[i].UserName))
                                    {
                                        username = farmobj[i].UserName;
                                    }
                                    //insert in a list code
                                    db.SaveInvoiceEntry(InvoiceNos, id, firmid, userid, farmobj[i].Type, farmobj[i].ItemName, matterid, username.ToString(), Convert.ToDouble(farmobj[i].Price), Convert.ToDouble(farmobj[i].Quantity), istaxinvoice);
                                }
                            }
                            //insert payment entry 
                            if (payobj != "[]")
                            {
                                List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(payobj);
                                if (payobj1.Count > 0)
                                {
                                    for (var i = 0; i < payobj1.Count; i++)
                                    {
                                        var paymenttype = payobj1[i].PaymentType;
                                        //insert in a list code
                                        if (paymenttype.ToString() == "Cheque" || paymenttype.ToString() == "Demand Draft")
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 0);
                                        }
                                        else
                                        {
                                            db.SaveInvoicePayment(firmid, userid, id, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                        }
                                    }
                                }
                            }
                            //increase series of invoice
                            long seriesnos = Convert.ToInt64(invcodes.Serierno) + 1;
                            DateTime dt1 = Convert.ToDateTime(invinvoicedate);
                            string[] leadzeroarr = { "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D2", "D13", "D14", "D15" };
                            var length = invcodes.Serierno.ToString().Length;
                            var newseriesno = seriesnos.ToString(leadzeroarr[length - 1]);
                            //update series
                            db.sp_UpdateInvoiceSeriesIncrementNo(firmid.ToString(), userid.ToString(), invcodes.Id.ToString(), newseriesno);
                            transaction.Commit();
                        }
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Update invoice
        /// </summary>
        /// <param name="invids"></param>
        /// <param name="invclient"></param>
        /// <param name="invstate"></param>
        /// <param name="invinvoicedate"></param>
        /// <param name="invduedate"></param>
        /// <param name="invmob"></param>
        /// <param name="invaddress"></param>
        /// <param name="invigstper"></param>
        /// <param name="invcgstper"></param>
        /// <param name="invsgstper"></param>
        /// <param name="invigsttempval"></param>
        /// <param name="invcgsttempval"></param>
        /// <param name="invsgsttempval"></param>
        /// <param name="invsubtotaltemp"></param>
        /// <param name="finaltotaltemp"></param>
        /// <param name="desObj"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="firmcode"></param>
        /// <param name="addressid"></param>
        /// <param name="payobj"></param>
        /// <param name="invsstate"></param>
        /// <param name="invsaddress"></param>
        /// <param name="istaxinvoice"></param>
        /// <param name="usernamefreetext"></param>
        /// <param name="emailid"></param>
        /// <param name="matterid"></param>
        /// <returns></returns>
        public string updateinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid)
        {
            using (var db = new LawPracticeEntities())
            {
                string InvoiceNos = "";
                StringBuilder strentry = new StringBuilder();
                StringBuilder strpay = new StringBuilder();
                strentry.Clear();
                strpay.Clear();
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var chkinvno = db.TblInvoices.Where(x => x.id.ToString() == invids && x.Firmid.ToString() == firmid).FirstOrDefault();
                        if (chkinvno != null)
                        {
                            InvoiceNos = chkinvno.InvoiceNo;
                        }
                        //update tblinvoice
                        var insertdata = db.EditInvoice(invids, invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, Convert.ToDouble(invigstper), Convert.ToDouble(invcgstper), Convert.ToDouble(invsgstper), Convert.ToDouble(invigsttempval), Convert.ToDouble(invcgsttempval), Convert.ToDouble(invsgsttempval), Convert.ToDouble(invsubtotaltemp), Convert.ToDouble(finaltotaltemp), InvoiceNos, firmid, userid, addressid, invsstate, invsaddress, istaxinvoice, usernamefreetext, emailid, matterid);
                        //delete invoice entry item
                        List<InvoiceEditList> farmobj11 = JsonConvert.DeserializeObject<List<InvoiceEditList>>(desObj);
                        if (farmobj11.Count > 0)
                        {
                            for (var i = 0; i < farmobj11.Count; i++)
                            {
                                if (farmobj11[i].Iid == "")
                                {
                                }
                                else
                                {
                                    strentry.Append('"');
                                    strentry.Append(farmobj11[i].Iid + '"');
                                    strentry.Append(',');
                                }
                            }
                        }
                        //delete payment entry 
                        if (payobj != "[]")
                        {
                            List<InvoiceEditPayment> payobj111 = JsonConvert.DeserializeObject<List<InvoiceEditPayment>>(payobj);
                            if (payobj111.Count > 0)
                            {
                                for (var i = 0; i < payobj111.Count; i++)
                                {
                                    if (payobj111[i].Id == "")
                                    {
                                    }
                                    else
                                    {
                                        strpay.Append('"');
                                        strpay.Append(payobj111[i].Id + '"');
                                        strpay.Append(',');
                                    }
                                }
                            }
                        }
                        //delete entry from tblinvoiceentry
                        var entrydelete = db.GetDeleteEntryInvoice(firmid, invids, strentry.ToString()).ToList();
                        if (entrydelete.Count > 0)
                        {
                            foreach (var itemd in entrydelete)
                            {
                                db.insertdeleteentrytable(Guid.Parse(itemd.Value.ToString()), "TblInvoiceEntry", Guid.Parse(firmid));
                            }
                            db.DeleteEntryInvoice(firmid, invids, strentry.ToString());
                        }
                        // delete payment invoice
                        var entrypay = db.GetDeletePaymentInvoice(firmid, invids, strpay.ToString()).ToList();
                        if (entrypay.Count > 0)
                        {
                            foreach (var itemp in entrypay)
                            {
                                db.insertdeleteentrytable(Guid.Parse(itemp.Value.ToString()), "TblInvoicePayment", Guid.Parse(firmid));
                            }
                            db.DeletePaymentInvoice(firmid, invids, strpay.ToString());
                        }
                        //insert invoice entry item
                        List<InvoiceEditList> farmobj = JsonConvert.DeserializeObject<List<InvoiceEditList>>(desObj);
                        if (farmobj.Count > 0)
                        {
                            for (var i = 0; i < farmobj.Count; i++)
                            {
                                if (farmobj[i].Iid == "")
                                {
                                    //insert in a list code
                                    var countntry = db.SaveInvoiceEntry(InvoiceNos, invids, firmid, userid, farmobj[i].type, farmobj[i].itemname, matterid, farmobj[i].UserName.ToString(), Convert.ToDouble(farmobj[i].Price), Convert.ToDouble(farmobj[i].QtyORHour), istaxinvoice);
                                }
                                else
                                {
                                    //update in a list code
                                    db.EditInvoiceEntry(farmobj[i].Iid, InvoiceNos, invids, firmid, userid, farmobj[i].type, farmobj[i].itemname, matterid, farmobj[i].billyby.ToString(), Convert.ToDouble(farmobj[i].price), Convert.ToDouble(farmobj[i].QtyORHour), istaxinvoice);
                                }
                            }
                        }
                        //insert payment entry 
                        if (payobj != "[]")
                        {
                            List<InvoiceEditPayment> payobj1 = JsonConvert.DeserializeObject<List<InvoiceEditPayment>>(payobj);
                            if (payobj1.Count > 0)
                            {
                                for (var i = 0; i < payobj1.Count; i++)
                                {
                                    if (payobj1[i].Id == "")
                                    {
                                        if (payobj1[i].PaymentType == "Cheque" || payobj1[i].PaymentType == "Demand Draft")
                                        {
                                            //insert in a list code
                                            var countpay = db.SaveInvoicePayment(firmid, userid, invids, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 0);
                                        }
                                        else
                                        {
                                            var countpay = db.SaveInvoicePayment(firmid, userid, invids, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                        }
                                    }
                                    else
                                    {
                                        //update in a list code
                                        db.EditInvoicePayment(payobj1[i].Id, firmid, userid, invids, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails);
                                    }
                                }
                            }
                        }
                        transaction.Commit();
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Save payment details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="invoiceid"></param>
        /// <param name="payobj"></param>
        /// <returns></returns>
        public string SavePayment(string firmid, string userid, string invoiceid, string payobj)
        {
            using (var db = new LawPracticeEntities())
            {
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //insert payment entry 
                        if (payobj != "[]")
                        {
                            List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(payobj);
                            if (payobj1.Count > 0)
                            {
                                for (var i = 0; i < payobj1.Count; i++)
                                {
                                    var paymenttype = payobj1[i].PaymentType;
                                    if (paymenttype.ToString() == "Cheque" || paymenttype.ToString() == "Demand Draft")
                                    {
                                        //insert in a list code
                                        db.SaveInvoicePayment(firmid, userid, invoiceid, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 0);
                                    }
                                    else
                                    {
                                        db.SaveInvoicePayment(firmid, userid, invoiceid, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                    }
                                }
                            }
                        }

                        transaction.Commit();
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Get Publish Custom Form List
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string cpubformlist(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetPublishCustomFormList(Guid.Parse(uid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Save custom form
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        public void saveformcustom(FirmConfiguredCustomField fm, string firmid)
        {
            var db = new LawPracticeEntities();
            FirmConfiguredCustomField cf = new FirmConfiguredCustomField();
            cf.Firmid = Guid.Parse(firmid.ToString());
            cf.Sequence = fm.Sequence;
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
            db.SaveChanges();
        }
        /// <summary>
        /// Get custom firm field
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="cont"></param>
        /// <param name="scont"></param>
        /// <returns></returns>
        public string getcfirmfield(string firmid, string cont, string scont)
        {
            var db = new LawPracticeEntities();
            var datas = (from c in db.FirmConfiguredCustomFields
                         join ct in db.CustomFields on c.FieldType equals ct.Id
                         where c.Firmid.ToString() == firmid && c.ConfigurationType.ToString() == cont && c.SubConfigurationType == scont
                         orderby (c.Sequence)
                         select new
                         {
                             Id = c.Id,
                             ConfigurationType = c.ConfigurationType,
                             FieldName = c.FieldName,
                             FieldType = c.FieldType,
                             Formatter = string.IsNullOrEmpty(ct.Formatter) ? "" : ct.Formatter.Trim(),
                             IsRequired = c.IsRequired,
                             MaxLength = c.MaxLength,
                             MinLength = c.MinLength,
                             Sequence = c.Sequence,
                             FieldValues = string.IsNullOrEmpty(ct.DefaultValues) ? c.FieldValues : ct.DefaultValues.Trim(),
                             IsDefault = c.IsDefault,
                             SubConfigurationType = c.SubConfigurationType,
                             IsSortable = c.IsPositionChangable,
                             Url = string.IsNullOrEmpty(ct.Url) ? "" : ct.Url.Trim()
                         }).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Public custom form field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <param name="sctype"></param>
        /// <returns></returns>
        public bool publishcformfield(string uid, int ctype, int sctype)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            FirmConfiguredCustomField cf = new FirmConfiguredCustomField();
            cf.IsActive = true;
            db.FirmConfiguredCustomFields.Where(x => x.Firmid.ToString() == uid.ToString() && x.ConfigurationType == ctype && x.SubConfigurationType == sctype.ToString()).ToList().ForEach(x =>
            {
                x.IsActive = true;
                x.iupdate = 1;
            });
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Public custom form
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="cformid"></param>
        /// <returns></returns>
        public string PublishCustomform(string uid, string cformid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            FirmConfiguredCustomField cf1 = new FirmConfiguredCustomField();
            FirmCustomForm cf = new FirmCustomForm();
            var pdata = db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).FirstOrDefault();
            if (pdata.IsPublished == false)
            {
                db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).ToList().ForEach(x =>
                {
                    x.IsPublished = true;
                    x.iupdate = 1;
                });
                var count = db.SaveChanges();
                var a = JsonConvert.SerializeObject(count);
                cf1.IsActive = true;
                db.FirmConfiguredCustomFields.Where(x => x.Firmid.ToString() == uid.ToString() && x.SubConfigurationType.ToString() == cformid.ToString()).ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.iupdate = 1;
                });
                db.SaveChanges();
                return a;
            }
            else
            {
                return "0";
            }
        }
        /// <summary>
        /// Get archive custom form field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="cformid"></param>
        /// <returns></returns>
        public string ArchieveCustomform(string uid, string cformid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            FirmCustomForm cf = new FirmCustomForm();
            var pdata = db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).FirstOrDefault();
            db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).ToList().ForEach(x =>
            {
                x.IsArchieved = true;
                x.iupdate = 1;
            });
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Unarchive custom form field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="cformid"></param>
        /// <returns></returns>
        public string UnArchieveCustomform(string uid, string cformid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            FirmCustomForm cf = new FirmCustomForm();
            var pdata = db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).FirstOrDefault();
            db.FirmCustomForms.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == cformid.ToString()).ToList().ForEach(x =>
            {
                x.IsArchieved = false;
                x.iupdate = 1;
            });
            var count = db.SaveChanges();
            var a = JsonConvert.SerializeObject(count);
            return a;
        }
        /// <summary>
        /// Custom form single
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="formid"></param>
        /// <returns></returns>
        public string cformsingle(string uid, string formid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.GetCustomFormSingle(Guid.Parse(uid), Guid.Parse(formid.ToString())).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        //public void savecustomformdata(SaveCustomFieldData fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string wid, string wtid, string Filenames, string userid)
        //{
        //    var db = new LawPracticeEntities();
        //    var taskbyusername = db.RegUsers.Where(x => x.LoginId.ToString() == userid.ToString()).Select(z => new { z.cfname }).FirstOrDefault();
        //    SaveCustomFieldData cf = new SaveCustomFieldData();
        //    CustomFormColMap cm = new CustomFormColMap();
        //    //var dt = System.DateTime.Now.ToShortDateString();
        //    cf.Userid = fm.Userid;
        //    cf.date_time = DateTime.Now;
        //    cf.col1 = fm.col1;
        //    cf.col2 = fm.col2;
        //    cf.col3 = fm.col3;
        //    cf.col4 = fm.col4;
        //    cf.col5 = fm.col5;
        //    cf.col6 = fm.col6;
        //    cf.col7 = fm.col7;
        //    cf.col8 = fm.col8;
        //    cf.col9 = fm.col9;
        //    cf.col10 = fm.col10;
        //    cf.col11 = fm.col11;
        //    cf.col12 = fm.col12;
        //    cf.col13 = fm.col13;
        //    cf.col14 = fm.col14;
        //    cf.col15 = fm.col15;
        //    cf.Firmid = Guid.Parse(firmid.ToString());
        //    cf.wfid = fm.wfid;
        //    cf.formId = Guid.Parse(ftype.ToString());
        //    db.SaveCustomFieldDatas.Add(cf);
        //    db.SaveChanges();
        //    var fileid = cf.cid;
        //    var fl = new CustomformFileMap();
        //    fl.Fileid = fileid;
        //    fl.Filenames = Filenames;
        //    fl.Firmid = fm.Firmid;
        //    ///  fl.formid = 6;
        //    fl.fdatetime = DateTime.Now;
        //    fl.userid = fm.Userid;
        //    db.CustomformFileMaps.Add(fl);
        //    db.SaveChanges();
        //    //save in maptable
        //    for (int i = 1; i <= sum; i++)
        //    {
        //        cm.pid = cf.cid;
        //        cm.column_no = "col" + i;
        //        //var st="ccol" + i;
        //        if (i == 1)
        //        {
        //            var ctxt = ctxt1;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 1;
        //        }
        //        else if (i == 2)
        //        {
        //            var ctxt = ctxt2;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 2;
        //        }
        //        else if (i == 3)
        //        {
        //            var ctxt = ctxt3;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 3;
        //        }
        //        else if (i == 4)
        //        {
        //            var ctxt = ctxt4;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 4;
        //        }
        //        else if (i == 5)
        //        {
        //            var ctxt = ctxt5;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 5;
        //        }
        //        else if (i == 6)
        //        {
        //            var ctxt = ctxt6;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 6;
        //        }
        //        else if (i == 7)
        //        {
        //            var ctxt = ctxt7;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 7;
        //        }
        //        else if (i == 8)
        //        {
        //            var ctxt = ctxt8;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 8;
        //        }
        //        else if (i == 9)
        //        {
        //            var ctxt = ctxt9;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 9;
        //        }
        //        else if (i == 10)
        //        {
        //            var ctxt = ctxt10;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 10;
        //        }
        //        else if (i == 11)
        //        {
        //            var ctxt = ctxt11;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 11;
        //        }
        //        else if (i == 12)
        //        {
        //            var ctxt = ctxt12;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 12;
        //        }
        //        else if (i == 13)
        //        {
        //            var ctxt = ctxt13;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 13;
        //        }
        //        else if (i == 14)
        //        {
        //            var ctxt = ctxt14;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 14;
        //        }
        //        else if (i == 15)
        //        {
        //            var ctxt = ctxt15;
        //            cm.column_name = ctxt;
        //            cm.Sequence = 15;
        //        }
        //        //cm.txt2 = ctxt2;
        //        //cm.ftype = ftype;
        //        cm.Firmid = Guid.Parse(firmid);
        //        cm.formid = Guid.Parse(ftype);
        //        db.CustomFormColMaps.Add(cm);
        //        db.SaveChanges();
        //    }
        //    var wkid = wid;
        //    var wktid = wtid;
        //    // get assign email
        //    if (wkid != null && wktid != null)
        //    {
        //        var tname = db.tblWFTasks.Where(x => x.id.ToString() == wktid).Select(x => new { x.TaskName }).FirstOrDefault();
        //        var upd = db.tblWorkflowTaskStages.Where(x => x.id.ToString() == wkid && x.Firmid.ToString() == firmid && x.TaskId.ToString() == wktid).FirstOrDefault();
        //        upd.Status = "3";
        //        upd.UpdatedOn = DateTime.Now;
        //        upd.iupdate = 1;
        //        db.Entry(upd).State = EntityState.Modified;
        //        db.SaveChanges();
        //        //update task
        //        var upd1 = db.AddTaskLists.Where(x => x.tdetails.ToString() == wktid && x.tauser.ToString() == fm.Userid.ToString() && x.Firmid.ToString() == firmid).FirstOrDefault();
        //        if (upd1 != null)
        //        {
        //            upd1.tstatus = "Completed";
        //            upd1.iupdate = 1;
        //            db.Entry(upd1).State = EntityState.Modified;
        //            db.SaveChanges();
        //        }
        //        var stage = db.Getwrkflwstage(Guid.Parse(firmid), Guid.Parse(wkid), Guid.Parse(wktid)).ToList();
        //        var datasstage = stage[0].ToString();
        //        var totstage = db.tblWFTasks.Where(y => y.id.ToString() == wktid).Select(y => new { y.totstage }).ToList();
        //        string totstages = totstage[0].ToString();
        //        //string phrase = "The quick brown fox jumps over the lazy dog.";
        //        string[] wstage = totstages.Split(',');
        //        var countstages = wstage.Length;
        //        if (datasstage != null)
        //        {
        //            List<string> list = new List<string>();
        //            long dstage = Convert.ToInt32(datasstage) + 1;
        //            if (dstage > countstages)
        //            {
        //                var allstage = db.GetAllEmailtaskworkflow(Guid.Parse(firmid), Guid.Parse(wktid)).ToList();
        //                //  string alldatasstage = allstage[1].ToString();
        //                foreach (var m in allstage)
        //                {
        //                    string asid = m.Assignto.ToString();
        //                    var datas1 = db.GetEmailtaskworkflow(Guid.Parse(firmid), Guid.Parse(asid)).ToList();
        //                    if (datas1[0] != null && datas1 != null)
        //                    {
        //                        string datasemail1 = datas1[0].ToString();
        //                        if (datasemail1 != null)
        //                        {
        //                            var sub1 = tname + "Task";
        //                            var body1 = datasemail1 + " Task has been completed ";
        //                            string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
        //                            string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["WorkflowMailToAdminSubject"].ToString();
        //                            string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["WorkflowMailToAdminBody"].ToString();
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#Stage#", datasstage);
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#TaskName#", tname.TaskName.ToString());
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#User#", taskbyusername.cfname);
        //                            try
        //                            {
        //                                CommomUtility obj1 = new CommomUtility();
        //                                obj1.SendEmail(fromemail, datasemail1, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
        //                            }
        //                            catch (Exception ex)
        //                            {
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                var assigndata = db.tblWorkflowTaskStages.Where(y => y.Firmid.ToString() == firmid && y.TaskId.ToString() == wktid && y.Stage == dstage.ToString()).Select(y => new { y.Assignto }).ToList();
        //                string assignuserdata = assigndata[0].ToString();
        //                //string phrase = "The quick brown fox jumps over the lazy dog.";
        //                string[] words = assignuserdata.Split(',');
        //                foreach (var word in words)
        //                {
        //                    string spassigndata = word;
        //                    //  var worddata = Regex.Replace(spassigndata, @"[^\d]", String.Empty);
        //                    string output = spassigndata.Substring(spassigndata.IndexOf('=') + 1);
        //                    string assignudata = output.ToString().Replace(" ", string.Empty).Replace("}", string.Empty);
        //                    var datas = db.GetEmailtaskworkflow(Guid.Parse(firmid), Guid.Parse(assignudata)).ToList();
        //                    if (datas[0] != null && datas != null)
        //                    {
        //                        string datasemail1 = datas[0].ToString();
        //                        if (datasemail1 != null)
        //                        {
        //                            var sub2 = tname + "Task";
        //                            var body2 = " Stage " + datasstage + " of this " + tname + " has been completed by this " + datasemail1;
        //                            string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
        //                            string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["WorkflowMailToAdminSubject"].ToString();
        //                            string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["WorkflowMailToAdminBody"].ToString();
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#Stage#", datasstage);
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#TaskName#", tname.TaskName.ToString());
        //                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#User#", taskbyusername.cfname);
        //                            try
        //                            {
        //                                CommomUtility obj1 = new CommomUtility();
        //                                obj1.SendEmail(fromemail, datasemail1, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
        //                            }
        //                            catch (Exception ex)
        //                            {
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //        //var data = db.gete//var email = db.tblWorkflowTaskStages.Where(x => x.id == wkid && x.TaskId == wktid).Select(x=>new { })FirstOrDefault();
        //    }
        //}
        /// <summary>
        /// Remove custom form field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <param name="cid"></param>
        /// <returns></returns>
        public bool customformremovefield(string uid, string ctype, string cid)
        {
            var db = new LawPracticeEntities();
            FirmCustomField ft = new FirmCustomField();
#pragma warning disable CS0219 // The variable 'tq' is assigned but its value is never used
            var tq = "";
#pragma warning restore CS0219 // The variable 'tq' is assigned but its value is never used
            string cname = "1";
#pragma warning disable CS0219 // The variable 'idt' is assigned but its value is never used
            var idt = 0;
#pragma warning restore CS0219 // The variable 'idt' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'cdt' is assigned but its value is never used
            var cdt = 0;
#pragma warning restore CS0219 // The variable 'cdt' is assigned but its value is never used
            string rs = "0";
            string rs2 = "0";
#pragma warning disable CS0219 // The variable 'colname' is assigned but its value is never used
            var colname = "";
#pragma warning restore CS0219 // The variable 'colname' is assigned but its value is never used
            var result = (from c in db.FirmConfiguredCustomFields
                          join ct in db.CustomFields on c.FieldType equals ct.Id
                          where c.Firmid.ToString() == uid && c.SubConfigurationType == ctype.ToString() && c.Id.ToString() == cid
                          select new
                          {
                              tq = c.FieldName
                          });
            foreach (var item in result)
            {
                cname = item.tq;
                // etc..
            }
            var remove = from d in db.CustomFormColMaps
                         where d.column_name == cname
                         select new
                         {
                             idt = d.pid,
                             cdt = d.id,
                             colname = d.column_no
                         };
            //Movie movie = db.Movies.Find(id);
            foreach (var item1 in remove)
            {
                rs = item1.idt.ToString();
                rs2 = item1.cdt.ToString();
                if (rs != "0")
                {
                    SaveCustomFieldData de = db.SaveCustomFieldDatas.Find(rs);
                    if (de != null)
                    {
                        de.iupdate = 1;
                        if (item1.colname == "col1")
                        {
                            de.col1 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col2")
                        {
                            de.col2 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col3")
                        {
                            de.col3 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col4")
                        {
                            de.col4 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col5")
                        {
                            de.col5 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col6")
                        {
                            de.col6 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col7")
                        {
                            de.col7 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col8")
                        {
                            de.col8 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col9")
                        {
                            de.col9 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col10")
                        {
                            de.col10 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col11")
                        {
                            de.col11 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col12")
                        {
                            de.col12 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col13")
                        {
                            de.col13 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col14")
                        {
                            de.col14 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col15")
                        {
                            de.col15 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                    }
                }
                if (rs != "0")
                {
                    CustomFormColMap de1 = db.CustomFormColMaps.Where(x => x.id.ToString() == rs2.ToString()).FirstOrDefault();
                    if (de1 != null)
                    {
                        db.CustomFormColMaps.Remove(de1);
                        db.insertdeleteentrytable(Guid.Parse(rs2), "ColMap", Guid.Parse(uid));
                    }
                }
                // etc..
            }

            //delete data from firmconfirmed field
            FirmConfiguredCustomField de2 = db.FirmConfiguredCustomFields.Where(x => x.Id.ToString() == cid.ToString()).FirstOrDefault();
            if (de2 != null)
            {
                db.FirmConfiguredCustomFields.Remove(de2);
                db.insertdeleteentrytable(Guid.Parse(cid), "FirmConfiguredCustomFields", Guid.Parse(uid));
            }
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Remove matter field
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <param name="cid"></param>
        /// <returns></returns>
        public bool matterremovefield(string uid, string ctype, string cid)
        {
            var db = new LawPracticeEntities();
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
        /// Sp col maps custom form
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="formid"></param>
        /// <returns></returns>
        public string SpColMapscustomform(string firmid, string formid)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetCustomFormColMap(Guid.Parse(firmid.ToString()), Guid.Parse(formid.ToString())).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Get Custom Form Data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="formid"></param>
        /// <param name="wfid"></param>
        /// <returns></returns>
        public string SpContactCustomformdata(string firmid, string formid, string wfid)
        {
            var db = new LawPracticeEntities();
            List<GetCustomFormData_Result> list = new List<GetCustomFormData_Result>();
            list = db.GetCustomFormData(Guid.Parse(firmid.ToString()), Guid.Parse(formid.ToString()), Guid.Parse(wfid.ToString())).ToList();
            foreach (var data in list.ToList())
            {
                GetCustomFormData_Result newItem = new GetCustomFormData_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Contact custom form data download
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="formid"></param>
        /// <param name="wfid"></param>
        /// <returns></returns>
        public string SpContactCustomFormDatadownload(string firmid, string formid, string wfid)
        {
            var db = new LawPracticeEntities();
            // var spdata = 
            List<GetCustomFormDownloadData_Result> list = new List<GetCustomFormDownloadData_Result>();
            list = db.GetCustomFormDownloadData(Guid.Parse(firmid.ToString()), Guid.Parse(formid.ToString()), Guid.Parse(wfid.ToString())).ToList();
            foreach (var data in list.ToList())
            {
                GetCustomFormDownloadData_Result newItem = new GetCustomFormDownloadData_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Verify custom contact form data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="formid"></param>
        /// <returns></returns>
        public string SpContactverifyCustomformdata(string firmid, string formid)
        {
            var db = new LawPracticeEntities();
            var spdata1 = db.GetVerifyCustomFormData(Guid.Parse(firmid), Guid.Parse(formid)).ToList();
            var a = JsonConvert.SerializeObject(spdata1);
            return a;
        }
        /// <summary>
        /// Get single custom form details
        /// </summary>
        /// <param name="FirmId"></param>
        /// <param name="formid"></param>
        /// <param name="cid"></param>
        /// <returns></returns>
        public string singlecustomformdetails(string FirmId, string formid, string cid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetCustomFormSingleDetails(Guid.Parse(FirmId), Guid.Parse(formid), Guid.Parse(cid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Save matter
        /// </summary>
        /// <param name="clientid"></param>
        /// <param name="ml"></param>
        /// <param name="ml1"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public string savematteremp(string clientid, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.cfile;
            var db = new LawPracticeEntities();
            Guid topclientid = Guid.Parse("00000000-0000-0000-0000-000000000000");
            Guid regclientid = Guid.Parse("00000000-0000-0000-0000-000000000000");
            string firmid1 = ml1.Firmid.ToString();
            if (clientid.ToString() == null || clientid.ToString() == "")
            {
                var lg = new FirmUser();
                lg.DefaultController = "Client";
                lg.IsActive = false;
                lg.IsFirmAdmin = false;
                lg.IsFirmClient = true;
                lg.Password = cpassword;
                lg.UserName = username;
                lg.DefaultAction = "dashboard";
                //lg.EmailId = ml1.cemail;
                lg.Firmid = Guid.Parse(firmid1);
                lg.RoleId = 3;
                db.FirmUsers.Add(lg);
                db.SaveChanges();
                var newId = lg.Id;
                // save client
                var rm = new RegUser();
                var ldid = ml1.leadid;
                rm.LoginId = newId;
                rm.Firmid = Guid.Parse(ml1.Firmid.ToString());
                rm.firmuser = Guid.Parse(ml1.firmuser.ToString());
                rm.cfname = ml1.cfname;
                rm.cmobile = ml1.cmobile;
                rm.caddress = ml1.caddress;
                rm.country = ml1.country;
                rm.cstate = ml1.cstate;
                rm.ccity = ml1.ccity;
                rm.leadid = ldid;
                rm.IsAdmin = "3";
                rm.clandline = ml1.clandline;
                if (ml1.cphoto != null)
                {
                    rm.cphoto = ml1.cphoto;
                }
                rm.date_time = DateTime.Now;
                db.RegUsers.Add(rm);
                db.SaveChanges();
                topclientid = lg.Id;
                regclientid = rm.Id;
                if (cemail != null)
                {
                    var body1 = "Dear user You have registered Successfully<br> Your User Id: " + username + " <br>Password: " + cpassword;
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                    string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["RegistrationToAdminSubject"].ToString();
                    string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["RegistrationMailToAdminBody"].ToString();
                    string subscribername = Convert.ToString(HttpContext.Current.Session["fullusername"]);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#USERID#", username);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#PASSWORD#", cpassword);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#NAME#", "");
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#SubscriberName#", subscribername);
                    try
                    {
                        CommomUtility obj1 = new CommomUtility();
                        obj1.SendEmail(fromemail, cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                    }
                }
                //update client id
                var upclientd = db.FirmUsers.Where(x => x.Id == newId).FirstOrDefault();
                if (upclientd != null)
                {
                    upclientd.clientId = regclientid;
                    upclientd.iupdate = 1;
                    db.Entry(upclientd).State = EntityState.Modified;
                    db.SaveChanges();
                }
                var upleadid = db.LeadLists.Where(x => x.lid.ToString() == ldid.ToString()).FirstOrDefault();
                if (upleadid != null)
                {
                    upclientd.iupdate = 1;
                    upleadid.lstatus = "1";
                    db.Entry(upleadid).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            else
            {
                topclientid = Guid.Parse(clientid);
            }
            AddLawMatterList cf = new AddLawMatterList();
            ColMap cm = new ColMap();
            tbl_caseusermap cmp = new tbl_caseusermap();
            if (ml.cfile != "")
            {
                cf.cfile = "1";
            }
            cf.firmuser = ml.firmuser;
            cf.cnrno = ml.cnrno;
            cf.Firmid = ml.Firmid;
            cf.CaseSubject = ml.CaseSubject;
            cf.mnotes = ml.mnotes;
            cf.msol = ml.msol;
            cf.mtrno = ml.mtrno;
            cf.odate = ml.odate;
            cf.orgaty = ml.orgaty;
            cf.tags = ml.tags;
            cf.cdate = ml.cdate;
            cf.matterclientid = topclientid;
            cf.assignto = ml.assignto;
            cf.cstatus = ml.cstatus;
            cf.mname = ml.mname;
            cf.date_time = DateTime.Now;
            cf.col1 = ml.col1;
            cf.col2 = ml.col2;
            cf.col3 = ml.col3;
            cf.col4 = ml.col4;
            cf.col5 = ml.col5;
            cf.col6 = ml.col6;
            cf.col7 = ml.col7;
            cf.col8 = ml.col8;
            cf.col9 = ml.col9;
            cf.col10 = ml.col10;
            cf.col11 = ml.col11;
            cf.col12 = ml.col12;
            cf.col13 = ml.col13;
            cf.col14 = ml.col14;
            cf.col15 = ml.col15;
            db.AddLawMatterLists.Add(cf);
            db.SaveChanges();
            var topmid = cf.Id;
            //save in filemap table
            if (s != "")
            {
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = cf.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "case";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            //save in maptable
            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.Id;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                }
                cm.Firmid = Guid.Parse(firmid);
                cm.formid = Convert.ToInt32(ftype);
                db.ColMaps.Add(cm);
                db.SaveChanges();
            }
            //save in maptable
            cmp.auser = Guid.Parse(ml.firmuser.ToString());
            cmp.cstatus = 0;
            cmp.caseid = topmid;
            cmp.Firmid = ml.Firmid;
            cmp.firmuser = ml.firmuser;
            cmp.date_time = cf.date_time;
            db.tbl_caseusermap.Add(cmp);
            db.SaveChanges();
            //save in notification table
            if (ml.assignto != null)
            {
                //users
                tbl_notification tn = new tbl_notification();
                tn.date_time = cf.date_time;
                tn.Firmid = ml.Firmid;
                tn.userid = ml.firmuser;
                tn.auser = ml.assignto;
                tn.ntype = "Matter";
                tn.status = 0;
                if (ml.firmuser == ml.assignto)
                {
                    tn.urllink = "/Firm/MatterSingleView/" + topmid;
                }
                else
                {
                    tn.urllink = "/Employee/MatterSingleView/" + topmid;
                }
                tn.notification = "You have new Case";
                tn.typeid = topmid;
                db.tbl_notification.Add(tn);
                db.SaveChanges();
            }
            if (topclientid != null)
            {
                //client
                tbl_notification tn1 = new tbl_notification();
                tn1.date_time = cf.date_time;
                tn1.Firmid = ml.Firmid;
                tn1.userid = ml.firmuser;
                tn1.auser = topclientid;
                tn1.ntype = "Matter";
                tn1.status = 0;
                tn1.urllink = "/Client/MatterSingleView/" + topmid;
                tn1.notification = "You have New Case";
                tn1.typeid = topmid;
                db.tbl_notification.Add(tn1);
                db.SaveChanges();
            }
            return topmid.ToString();
        }
        /// <summary>
        /// Assign user list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string assignuserlist(string uid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.usp_GetFirmsUsers(Guid.Parse(uid), 1, 5000).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get all assign user list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="usertype"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string allassignuserlist(string uid, string usertype = null, string userid = null)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_GetAllFirmsUsers_Result> list = new List<usp_GetAllFirmsUsers_Result>();
            if (usertype == "Client")
            {
                list = db.usp_GetAllFirmsUsers(Guid.Parse(uid)).Where(x => x.RoleId == 3).ToList();
            }
            else if (usertype == "User")
            {
                list = db.usp_GetAllFirmsUsers(Guid.Parse(uid)).Where(x => x.RoleId != 3).ToList();
            }
            else
            {
                list = db.usp_GetAllFirmsUsers(Guid.Parse(uid)).ToList();
            }
            if (userid == "null" || userid == null || userid == "")
            {
                userid = "";
            }
            if (!String.IsNullOrEmpty(userid))
            {
                list = list.Where(x => x.Id.ToString() == userid).ToList();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get sen message list details
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string sentmessagelist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetSentMesageDetails(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get sent message details by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string sentmessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetSentMesageDetailsbyrowid_Result> list = new List<GetSentMesageDetailsbyrowid_Result>();
            list = db.GetSentMesageDetailsbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetSentMesageDetailsbyrowid_Result newItem = new GetSentMesageDetailsbyrowid_Result();
                if (!string.IsNullOrEmpty(data.UserName))
                {
                    string[] words = data.UserName.ToString().Split(',');
                    foreach (string word in words)
                    {
                        try
                        {
                            string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                        catch
                        {
                            string tempuser = word.ToString();
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                    }
                    newItem.UserName = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].UserName = newItem.UserName;
                }
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                    list[list.IndexOf(data)].mfile = newItem.mfile;
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.msubject = data.msubject.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get draft message list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string draftmessagelist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetdraftMessageList(uid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Reply message list details
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="msgid"></param>
        /// <returns></returns>
        public string replymessagelist(string uid, string userid, string msgid)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetReplyMesageDetails_Result1> list = new List<GetReplyMesageDetails_Result1>();
            list = db.GetReplyMesageDetails(Guid.Parse(uid), Guid.Parse(userid), Guid.Parse(msgid)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetReplyMesageDetails_Result1 newItem = new GetReplyMesageDetails_Result1();
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    try
                    {
                        newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                        list[list.IndexOf(data)].mfile = newItem.mfile;
                    }
                    catch
                    {
                    }
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get  Message Sent User List
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="msgid"></param>
        /// <returns></returns>
        public string tousermessagelist(string uid, string userid, string msgid)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetMessageSentUserList_Result> list = new List<GetMessageSentUserList_Result>();
            list = db.GetMessageSentUserList(Guid.Parse(uid), Guid.Parse(userid), Guid.Parse(msgid)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetMessageSentUserList_Result newItem = new GetMessageSentUserList_Result();
                if (!string.IsNullOrEmpty(data.shareby))
                {
                    string[] words = data.shareby.ToString().Split(',');
                    foreach (string word in words)
                    {
                        try
                        {
                            string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                        catch
                        {
                            string tempuser = word.ToString();
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                    }
                    newItem.shareby = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].shareby = newItem.shareby;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get Reply Message Sent User List
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="msgid"></param>
        /// <param name="datetime"></param>
        /// <returns></returns>
        public string replytousermessagelist(string uid, string userid, string msgid, string datetime)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetReplyMessageSentUserList_Result1> list = new List<GetReplyMessageSentUserList_Result1>();
            list = db.GetReplyMessageSentUserList(Guid.Parse(uid), Guid.Parse(userid), Guid.Parse(msgid), datetime).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetReplyMessageSentUserList_Result1 newItem = new GetReplyMessageSentUserList_Result1();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get status message list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="msgid"></param>
        /// <returns></returns>
        public string statusmessagelist(string uid, string userid, string msgid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetMessageStatus(Guid.Parse(uid), Guid.Parse(userid), Guid.Parse(msgid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Get receive message list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string receivemessagelist(string uid, string userid)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetReceiveMesageDetails_Result> list = new List<GetReceiveMesageDetails_Result>();
            list = db.GetReceiveMesageDetails(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetReceiveMesageDetails_Result newItem = new GetReceiveMesageDetails_Result();
                if (!string.IsNullOrEmpty(data.UserName))
                {
                    newItem.UserName = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.UserName.ToString()));
                    list[list.IndexOf(data)].UserName = newItem.UserName;
                }
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                    list[list.IndexOf(data)].mfile = newItem.mfile;
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.msubject = data.msubject.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case receive message list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string casereceivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string caseid)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetReceiveMesageDetailsBycaseid_Result> list = new List<GetReceiveMesageDetailsBycaseid_Result>();
            list = db.GetReceiveMesageDetailsBycaseid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, caseid).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetReceiveMesageDetailsBycaseid_Result newItem = new GetReceiveMesageDetailsBycaseid_Result();
                if (!string.IsNullOrEmpty(data.UserName))
                {
                    newItem.UserName = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.UserName.ToString()));
                    list[list.IndexOf(data)].UserName = newItem.UserName;
                }
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                    list[list.IndexOf(data)].mfile = newItem.mfile;
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.msubject = data.msubject.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get Receive Message Details By rowid
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string receivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetReceiveMesageDetailsByrowid_Result> list = new List<GetReceiveMesageDetailsByrowid_Result>();
            list = db.GetReceiveMesageDetailsByrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetReceiveMesageDetailsByrowid_Result newItem = new GetReceiveMesageDetailsByrowid_Result();
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    try
                    {
                        newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                        list[list.IndexOf(data)].mfile = newItem.mfile;
                    }
                    catch
                    {
                    }
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.msubject = data.msubject.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load reminder by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string LoadReminderByRowid(string firmid, string userid, int roleid, int pagenum, int pagesize)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<usp_EventReminderList_Result> list = new List<usp_EventReminderList_Result>();
            list = db.usp_EventReminderList(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Assign notice list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string Assignnoticelistbyrowid(string firmid, string userid, int pagenum, int pagesize)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetAssignNoticeListByrowid_Result> list = new List<GetAssignNoticeListByrowid_Result>();
            list = db.GetAssignNoticeListByrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNoticeListByrowid_Result newItem = new GetNoticeListByrowid_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get notice list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string noticelistbyrowid(string firmid, string userid, int pagenum, int pagesize)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetNoticeListByrowid_Result> list = new List<GetNoticeListByrowid_Result>();
            list = db.GetNoticeListByrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNoticeListByrowid_Result newItem = new GetNoticeListByrowid_Result();
                if (!string.IsNullOrEmpty(data.AssignUsers))
                {
                    string[] words = data.AssignUsers.ToString().Split(',');
                    foreach (string word in words)
                    {
                        string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                        sb.Append(tempuser);
                        sb.Append(",");
                    }
                    newItem.AssignUsers = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].AssignUsers = newItem.AssignUsers;
                }
                if (!string.IsNullOrEmpty(data.CreatedBy))
                {
                    newItem.CreatedBy = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.CreatedBy.ToString()));
                    list[list.IndexOf(data)].CreatedBy = newItem.CreatedBy;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Archive message list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string archivemessagelist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetArchiveReceiveMesageDetails(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Archive message list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string archivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();
            List<GetArchiveReceiveMesageDetailsbyrowid_Result> list = new List<GetArchiveReceiveMesageDetailsbyrowid_Result>();
            list = db.GetArchiveReceiveMesageDetailsbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetArchiveReceiveMesageDetailsbyrowid_Result newItem = new GetArchiveReceiveMesageDetailsbyrowid_Result();
                if (!string.IsNullOrEmpty(data.mfile))
                {
                    try
                    {
                        newItem.mfile = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mfile.ToString()));
                        list[list.IndexOf(data)].mfile = newItem.mfile;
                    }
                    catch
                    {
                    }
                }
                if (!string.IsNullOrEmpty(data.mbody))
                {
                    try
                    {
                        newItem.mbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.mbody.ToString()));
                        list[list.IndexOf(data)].mbody = newItem.mbody;
                    }
                    catch
                    {
                        newItem.mbody = data.mbody.ToString();
                    }
                }
                if (!string.IsNullOrEmpty(data.msubject))
                {
                    try
                    {
                        newItem.msubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.msubject.ToString()));
                        list[list.IndexOf(data)].msubject = newItem.msubject;
                    }
                    catch
                    {
                        newItem.msubject = data.msubject.ToString();
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get draft message list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string draftmessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<GetdraftMessageListbyrowid_Result> list = new List<GetdraftMessageListbyrowid_Result>();
            list = db.GetdraftMessageListbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, search).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetdraftMessageListbyrowid_Result newItem = new GetdraftMessageListbyrowid_Result();
                if (!string.IsNullOrEmpty(data.auser))
                {
                    string[] words = data.auser.ToString().Split(',');
                    foreach (string word in words)
                    {
                        try
                        {
                            string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                        catch
                        {
                            string tempuser = word.ToString();
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                    }
                    newItem.auser = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].auser = newItem.auser;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load client bound details
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string LoadClientbound(string uid)
        {
            var db = new LawPracticeEntities();
            var matter = db.sp_GetfirmClientList(Guid.Parse(uid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load user bound
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string LoadUserbound(string uid)
        {
            var db = new LawPracticeEntities();
            var matter = db.sp_GetfirmUserList(Guid.Parse(uid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load timer list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string timerlist(string uid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetTimerDetails(Guid.Parse(uid)).ToList();
            List<GetTimerDetails_Result> list = new List<GetTimerDetails_Result>();
            list = db.GetTimerDetails(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetTimerDetails_Result newItem = new GetTimerDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get timer list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string timerlistbyrowid(string firmid, string userid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetTimerDetailsByRowId_Result> list = new List<GetTimerDetailsByRowId_Result>();
            list = db.GetTimerDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, "").ToList();
            foreach (var data in list.ToList())
            {
                GetTimerDetailsByRowId_Result newItem = new GetTimerDetailsByRowId_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
                if (!string.IsNullOrEmpty(data.client))
                {
                    newItem.client = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.client.ToString()));
                    list[list.IndexOf(data)].client = newItem.client;
                }
                if (!string.IsNullOrEmpty(data.createdby))
                {
                    newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                    list[list.IndexOf(data)].createdby = newItem.createdby;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get new time entry by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string newtimeentrybyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {
            var db = new LawPracticeEntities();
            if (String.IsNullOrEmpty(userid))
            {
                if (String.IsNullOrEmpty(search))
                {
                    List<GetNewTimeEntryByRowId_Result> list = new List<GetNewTimeEntryByRowId_Result>();
                    list = db.GetNewTimeEntryByRowId(Guid.Parse(firmid), Guid.Empty, pagenum, pagesize, 0, search).ToList();
                    foreach (var data in list.ToList())
                    {
                        GetNewTimeEntryByRowId_Result newItem = new GetNewTimeEntryByRowId_Result();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        list[list.IndexOf(data)].Id = newItem.Id;
                        if (data.tmatter != null)
                        {
                            newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                            list[list.IndexOf(data)].tmatter = newItem.tmatter;
                        }
                        if (!string.IsNullOrEmpty(data.createdby))
                        {
                            newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                            list[list.IndexOf(data)].createdby = newItem.createdby;
                        }
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
                else
                {
                    List<GetSearchNewTimeEntryByRowId_Result> list = new List<GetSearchNewTimeEntryByRowId_Result>();
                    list = db.GetSearchNewTimeEntryByRowId(Guid.Parse(firmid), Guid.Empty, pagenum, pagesize, 0, search).ToList();
                    foreach (var data in list.ToList())
                    {
                        GetSearchNewTimeEntryByRowId_Result newItem = new GetSearchNewTimeEntryByRowId_Result();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        list[list.IndexOf(data)].Id = newItem.Id;
                        if (data.tmatter != null)
                        {
                            newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                            list[list.IndexOf(data)].tmatter = newItem.tmatter;
                        }
                        if (!string.IsNullOrEmpty(data.createdby))
                        {
                            newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                            list[list.IndexOf(data)].createdby = newItem.createdby;
                        }
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
            }
            else
            {
                if (String.IsNullOrEmpty(search))
                {
                    List<GetUserNewTimeEntryByRowId_Result> list = new List<GetUserNewTimeEntryByRowId_Result>();
                    list = db.GetUserNewTimeEntryByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
                    foreach (var data in list.ToList())
                    {
                        GetSearchTimerDetailsByRowId_Result newItem = new GetSearchTimerDetailsByRowId_Result();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        list[list.IndexOf(data)].Id = newItem.Id;
                        if (data.tmatter != null)
                        {
                            newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                            list[list.IndexOf(data)].tmatter = newItem.tmatter;
                        }
                        if (!string.IsNullOrEmpty(data.createdby))
                        {
                            newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                            list[list.IndexOf(data)].createdby = newItem.createdby;
                        }
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
                else
                {
                    List<GetSearchUserNewTimeEntryByRowId_Result> list = new List<GetSearchUserNewTimeEntryByRowId_Result>();
                    list = db.GetSearchUserNewTimeEntryByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
                    foreach (var data in list.ToList())
                    {
                        GetSearchUserNewTimeEntryByRowId_Result newItem = new GetSearchUserNewTimeEntryByRowId_Result();
                        newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                        list[list.IndexOf(data)].Id = newItem.Id;
                        if (data.tmatter != null)
                        {
                            newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                            list[list.IndexOf(data)].tmatter = newItem.tmatter;
                        }
                        if (!string.IsNullOrEmpty(data.createdby))
                        {
                            newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                            list[list.IndexOf(data)].createdby = newItem.createdby;
                        }
                    }
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
            }
        }
        /// <summary>
        /// Timer list search by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="frmdate"></param>
        /// <param name="todate"></param>
        /// <param name="Createdby"></param>
        /// <param name="timeentryfilter"></param>
        /// <param name="Isdaterangefilter"></param>
        /// <returns></returns>
        public string timerlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize, string search,
            string frmdate, string todate, string Createdby, string timeentryfilter, string Isdaterangefilter)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<GetTimerDetailsByRowIdNew_Result> list = new List<GetTimerDetailsByRowIdNew_Result>();
            list = db.GetTimerDetailsByRowIdNew(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, pageid,
                frmdate, todate, Createdby, timeentryfilter, Isdaterangefilter).ToList();
            foreach (var data in list.ToList())
            {
                GetTimerDetailsByRowIdNew_Result newItem = new GetTimerDetailsByRowIdNew_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get timer list by client id
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="clientid"></param>
        /// <param name="userid"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public string timerlistbyclientid(string uid, string clientid, string userid, string role)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetTimerDetailsByclientid(Guid.Parse(uid), clientid, Guid.Parse(userid), Convert.ToInt16(role)).ToList();
            List<GetTimerDetailsByclientid_Result> list = new List<GetTimerDetailsByclientid_Result>();
            list = db.GetTimerDetailsByclientid(Guid.Parse(uid), clientid, Guid.Parse(userid), Convert.ToInt16(role)).ToList();
            foreach (var data in list.ToList())
            {
                GetTimerDetailsByclientid_Result newItem = new GetTimerDetailsByclientid_Result();
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }
                if (!string.IsNullOrEmpty(data.client))
                {
                    newItem.client = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.client.ToString()));
                    list[list.IndexOf(data)].client = newItem.client;
                }
                if (!string.IsNullOrEmpty(data.createdby))
                {
                    newItem.createdby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.createdby.ToString()));
                    list[list.IndexOf(data)].createdby = newItem.createdby;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get template list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string templatelist(string uid)
        {
            var db = new LawPracticeEntities();
            var matter = db.GetTemplateDetails(Guid.Parse(uid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove messge list details
        /// </summary>
        /// <param name="sid"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string removemessagelist(string sid, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            MessageMap msg = (from c in db.MessageMaps
                              where c.MessageId.ToString() == sid && c.Firmid.ToString() == uid.ToString() && c.auserid.ToString() == userid
                              select c).FirstOrDefault();
            msg.mstatus = 1;
            msg.iupdate = 1;
            db.Entry(msg).State = EntityState.Modified;
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Remove reminder list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        public string RemoveReminderlist(string firmid, string userid, string[] typeIds)
        {
            var db = new LawPracticeEntities();
            int cnt = 0;
            foreach (string id in typeIds)
            {
                var rdatas = db.usp_RemoveEventReminder(firmid, userid, id);
                if (rdatas > 0)
                {
                    cnt = cnt + 1;
                    db.insertdeleteentrytable(Guid.Parse(id), "Tbl_EventReminder", Guid.Parse(firmid));
                }
            }
            var a = JsonConvert.SerializeObject(cnt);
            return a;
        }
        /// <summary>
        /// Remove notice list details
        /// </summary>
        /// <param name="sid"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string RemoveNoticelist(string sid, string uid, string userid, int roleid)
        {
            var db = new LawPracticeEntities();
            var rdatas = db.Usp_RemoveNotice(uid, userid, sid, roleid);
            if (rdatas > 0)
            {
                db.insertdeleteentrytable(Guid.Parse(sid), "Tbl_Notice", Guid.Parse(uid));
                //remove notice file
                var fcount = db.Usp_getNoticeFileForDelete(uid, userid, sid).ToList();
                if (fcount != null)
                {
                    foreach (var datas in fcount)
                    {
                        var fdelete = db.Usp_RemoveNoticeFile(uid, userid, datas.Id.ToString(), roleid);
                        if (fdelete > 0)
                        {
                            db.insertdeleteentrytable(Guid.Parse(datas.Id.ToString()), "Tbl_NoticeFile", Guid.Parse(uid));
                            string folderpathazure = "Documents/Noticedocuments/" + datas.FirmId.ToString() + "/" + datas.UserId.ToString();
                            try
                            {
                                AzureDocumentself.DeleteFile(folderpathazure, datas.FileName, datas.FirmId.ToString(), datas.UserId.ToString());
                            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                            {
                            }
                        }
                    }
                }
            }
            var a = JsonConvert.SerializeObject(rdatas);
            return a;
        }
        /// <summary>
        /// Sent remove message list
        /// </summary>
        /// <param name="sid"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string sentremovemessagelist(string sid, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            MessageList msg = (from c in db.MessageLists
                               where c.mid.ToString() == sid.ToString() && c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == userid
                               select c).FirstOrDefault();
            msg.status = 1;
            msg.iupdate = 1;
            db.Entry(msg).State = EntityState.Modified;
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Update status message 
        /// </summary>
        /// <param name="sid"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string statusmessageupdate(string sid, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            MessageStatu msg = (from c in db.MessageStatus
                                orderby c.id descending
                                where c.MessageId.ToString() == sid && c.Firmid.ToString() == uid.ToString() && c.mto.ToString() == userid
                                select c).FirstOrDefault();
            if (msg != null)
            {
                msg.readstatus = 1;
                msg.iupdate = 1;
                db.Entry(msg).State = EntityState.Modified;
            }
            var countcall = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcall);
            var noti = (from c in db.tbl_notification
                        orderby c.Nid descending
                        where c.typeid.ToString() == sid && c.Firmid.ToString() == uid.ToString() && c.ntype == "Messages" && c.auser.ToString() == userid
                        select c).ToList();
            foreach (var item3 in noti)
            {
                if (item3 != null)
                {
                    item3.status = 1;
                    item3.iupdate = 1;
                    db.Entry(item3).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            return a;
        }
        /// <summary>
        /// Get archive message details
        /// </summary>
        /// <param name="msgid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool archivemessage(string msgid, string firmid, string userid)
        {
            using (var db = new LawPracticeEntities())
            {
                Guid Msgid = Guid.Parse(msgid);
                Guid Userid = Guid.Parse(userid);
                MessageMap msg = db.MessageMaps.Where(x => x.MessageId == Msgid && x.auserid == Userid && x.Firmid.ToString() == firmid.ToString()).FirstOrDefault();
                if (msg != null)
                {
                    msg.isarchive = 1;
                    msg.iupdate = 1;
                    db.Entry(msg).State = EntityState.Modified;
                    db.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        /// <summary>
        /// Get unarchive message list
        /// </summary>
        /// <param name="msgid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool unarchivemessage(string msgid, string firmid, string userid)
        {
            using (var db = new LawPracticeEntities())
            {
                Guid Msgid = Guid.Parse(msgid);
                Guid Userid = Guid.Parse(userid);
                MessageMap msg = db.MessageMaps.Where(x => x.MessageId == Msgid && x.auserid == Userid && x.Firmid.ToString() == firmid.ToString()).FirstOrDefault();
                if (msg != null)
                {
                    msg.isarchive = null;
                    msg.iupdate = 1;
                    db.Entry(msg).State = EntityState.Modified;
                    db.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        /// <summary>
        /// Save message details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="user"></param>
        /// <param name="did"></param>
        /// <param name="sendemailpostedFiledata"></param>
        /// <param name="client"></param>
        /// <returns></returns>
        public bool savemessage(MessageList ml, string user, string did = null, string sendemailpostedFiledata = null, string client = null)
        {
            var db = new LawPracticeEntities();
            var rm = new MessageList();
            var rm1 = new MessageMap();
            var rm2 = new MessageStatu();
            var rm3 = new ReplyMessageList();
            var eachId = user.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
            //Save or do your action  
            rm.Firmid = ml.Firmid;
            rm.userid = ml.userid;
            rm.mmatter = ml.mmatter;
            rm.msubject = ml.msubject;
            rm.mbody = ml.mbody;
            rm.status = 0;
            rm.Repstatus = 0;
            if (ml.mfile != null)
            {
                rm.mfile = ml.mfile;
            }
            string id = "";
            ObjectParameter IDParameter1;
            IDParameter1 = new ObjectParameter("id", id);
            db.usp_SaveMessalgeList(rm.Firmid, rm.userid, rm.mmatter, rm.msubject, rm.mbody,
                Convert.ToInt32(rm.status), rm.Repstatus, rm.mfile, IDParameter1);
            id = Convert.ToString(IDParameter1.Value);
            rm.mid = Guid.Parse(id);
            rm3.Firmid = Guid.Parse(ml.Firmid.ToString());
            rm3.userid = ml.userid;
            rm3.mbody = ml.mbody;
            rm3.status = 2;
            rm3.mid = rm.mid;
            rm3.auser = ml.userid;
            if (ml.mfile != null)
            {
                rm.mfile = ml.mfile;
            }
            rm3.date_time = DateTime.Now;
            db.usp_SaveReplyMessageList(Convert.ToString(rm3.Firmid), Convert.ToString(rm3.userid), rm3.mbody, Convert.ToInt32(rm3.status),
                Convert.ToString(rm3.auser), rm3.mfile, Convert.ToString(rm3.mid), Guid.NewGuid().ToString());
            foreach (var item in eachId)
            {
                var checkgroup = db.usp_GetMessageGroup(Convert.ToString(ml.Firmid), Convert.ToString(item)).FirstOrDefault();
                if (checkgroup != null)
                {
                    var eachId1 = checkgroup.GroupUser.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                    foreach (var item1 in eachId1)
                    {
                        var chkentry = db.usp_GetMessageMap(Convert.ToString(ml.Firmid), Convert.ToString(item1), Convert.ToString(rm.mid)).FirstOrDefault();
                        if (chkentry == null)
                        {
                            rm1.auserid = Guid.Parse(item1);
                            //  rm1.id = createid;
                            rm1.Firmid = ml.Firmid;
                            rm1.userid = ml.userid;
                            rm1.MessageId = rm.mid;
                            rm1.mstatus = 0;
                            rm1.readstatus = 0;
                            rm1.date_time = rm.date_time;
                            db.usp_SaveMessageMap(Convert.ToString(rm1.Firmid), Convert.ToString(rm1.userid), Convert.ToString(rm1.auserid), Convert.ToString(rm.mid),
                                Convert.ToInt32(rm1.mstatus), Convert.ToInt32(rm1.readstatus), Convert.ToString(Guid.NewGuid()));
                            rm2.mto = Guid.Parse(item1);
                            rm2.Firmid = ml.Firmid;
                            rm2.mfrom = ml.userid;
                            rm2.MessageId = rm.mid;
                            rm2.readstatus = 0;
                            rm2.date_time = rm.date_time;
                            db.usp_SaveMessageStatus(Convert.ToString(rm2.Firmid), Convert.ToString(rm2.mfrom), Convert.ToString(rm2.mto),
                                Convert.ToString(rm.mid), Convert.ToInt32(rm2.readstatus), Convert.ToString(Guid.NewGuid()));
                            if (rm1.auserid != null)
                            {
                                //send email to user
                                //send email to user
                                try
                                {
                                    var getemail = db.usp_GetEmailByUserId(rm1.Firmid.ToString(), rm1.auserid.ToString()).FirstOrDefault();
                                    if (getemail != null)
                                    {
                                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                        //send email to user
                                        string msgbody = ml.mbody.ToString();
                                        string msgsubject = ml.msubject.ToString();
                                        string strsubject = "", strbody = "";
                                        strsubject = "Message from myKase Internal Messaging";
                                        strbody += "Subject: " + msgsubject + "<br><br>";
                                        if (!String.IsNullOrEmpty(client))
                                        {
                                            var getuser = db.usp_wf_GetUserDetails(rm1.Firmid, Guid.Parse(client)).FirstOrDefault();
                                            if (getuser != null)
                                            {
                                                string clientname = getuser.cfname;
                                                strbody += "Client Name: " + clientname + "<br><br>";
                                            }
                                        }
                                        if (rm.mmatter != null)
                                        {
                                            var getcase = db.usp_GetCaseNameById(rm1.Firmid.ToString(), rm.mmatter.ToString()).FirstOrDefault();
                                            if (getcase != null)
                                            {
                                                string msgcase = getcase;
                                                strbody += "Matter Name :" + msgcase + "<br><br>";
                                            }
                                        }
                                        strbody += "Message :" + msgbody + "<br><br>";
                                        if (sendemailpostedFiledata == null || sendemailpostedFiledata == "null" || sendemailpostedFiledata == "")
                                        {
                                            strbody += "Attachment :No<br><br>";
                                        }
                                        else
                                        {
                                            strbody += "Attachment :Yes<br><br>";
                                        }
                                        if (rm.userid != null)
                                        {
                                            var getusername = db.usp_GetUserNameById(rm1.Firmid.ToString(), rm.userid.ToString()).FirstOrDefault();
                                            if (getusername != null)
                                            {
                                                string msgusername = getusername.ToString();
                                                strbody += "From :" + msgusername + "<br><br>";
                                            }
                                        }
                                        strbody += "Date/Time :" + DateTime.Now.ToString("dd-MMM-yyyy hh:mm:ss") + "<br><br>";
                                        try
                                        {
                                            string attchment = sendemailpostedFiledata;
                                            if (attchment != null)
                                            {
                                                attchment = attchment.Replace("|", ",");
                                            }
                                            string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                            CommomUtility objmail = new CommomUtility();
                                            objmail.SendEmail(fromemail, getemail.EmailId, "", strsubject, AssignmentSubmittedMailBody, attchment);
                                        }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                                        catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                                        {
                                        }
                                    }
                                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                                {
                                }
                                //end email to user
                                //check user type
                                var firmlist = db.usp_GetFirmUsersbyId_api(Convert.ToString(rm1.auserid)).FirstOrDefault();
                                var usertype = Convert.ToString(firmlist.RoleId);
                                tbl_notification tn = new tbl_notification();
                                tn.date_time = rm.date_time;
                                tn.Firmid = rm.Firmid;
                                tn.userid = rm.userid;
                                tn.auser = Guid.Parse(rm1.auserid.ToString());
                                tn.ntype = "Messages";
                                tn.status = 0;
                                if (usertype == "1")
                                {
                                    tn.urllink = "/Firm/ReceiveMessageList/" + rm.mid;
                                }
                                else if (usertype == "2")
                                {
                                    tn.urllink = "/Employee/ReceiveMessageList/" + rm.mid;
                                }
                                else if (usertype == "3")
                                {
                                    tn.urllink = "/Client/ReceiveMessageList/" + rm.mid;
                                }
                                tn.notification = "You have  new Message";
                                tn.typeid = rm.mid;
                                db.usp_AddNotification_api(tn.date_time, Convert.ToString(tn.Firmid), Convert.ToString(tn.userid), Convert.ToString(tn.auser),
                                    tn.ntype, null, Convert.ToInt32(tn.status), tn.urllink, tn.notification, Convert.ToString(tn.typeid));
                            }
                        }
                    }
                }
                else
                {
                    var chkentry = db.usp_GetMessageMap(Convert.ToString(ml.Firmid), Convert.ToString(item), Convert.ToString(rm.mid)).FirstOrDefault();
                    if (chkentry == null)
                    {
                        rm1.auserid = Guid.Parse(item);
                        rm1.Firmid = ml.Firmid;
                        rm1.userid = ml.userid;
                        rm1.MessageId = rm.mid;
                        rm1.mstatus = 0;
                        rm1.readstatus = 0;
                        rm1.date_time = rm.date_time;
                        db.usp_SaveMessageMap(Convert.ToString(rm1.Firmid), Convert.ToString(rm1.userid), Convert.ToString(rm1.auserid), Convert.ToString(rm.mid),
                                Convert.ToInt32(rm1.mstatus), Convert.ToInt32(rm1.readstatus), Convert.ToString(Guid.NewGuid()));
                        rm2.mto = Guid.Parse(item);
                        rm2.Firmid = ml.Firmid;
                        rm2.mfrom = ml.userid;
                        rm2.MessageId = rm.mid;
                        rm2.readstatus = 0;
                        rm2.date_time = rm.date_time;
                        db.usp_SaveMessageStatus(Convert.ToString(rm2.Firmid), Convert.ToString(rm2.mfrom), Convert.ToString(rm2.mto),
                                Convert.ToString(rm.mid), Convert.ToInt32(rm2.readstatus), Convert.ToString(Guid.NewGuid()));
                        if (rm1.auserid != null)
                        {
                            //send email to user
                            try
                            {
                                var getemail = db.usp_GetEmailByUserId(rm1.Firmid.ToString(), rm1.auserid.ToString()).FirstOrDefault();
                                if (getemail != null)
                                {
                                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                    //send email to user
                                    string msgbody = "", msgsubject = "";
                                    try
                                    {
                                        msgbody = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ml.mbody.ToString()));
                                    }
                                    catch
                                    {
                                        msgbody = ml.mbody.ToString();
                                    }
                                    try
                                    {
                                        msgsubject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ml.msubject.ToString()));
                                    }
                                    catch
                                    {
                                        msgsubject = ml.msubject.ToString();
                                    }
                                    string strsubject = "", strbody = "";
                                    strsubject = "Message from myKase Internal Messaging";
                                    strbody += "Subject: " + msgsubject + "<br><br>";
                                    if (!String.IsNullOrEmpty(client))
                                    {
                                        var getuser = db.usp_wf_GetUserDetails(rm1.Firmid, Guid.Parse(client)).FirstOrDefault();
                                        if (getuser != null)
                                        {
                                            string clientname = getuser.cfname;
                                            strbody += "Client Name: " + clientname + "<br><br>";
                                        }
                                    }
                                    if (rm.mmatter != null)
                                    {
                                        var getcase = db.usp_GetCaseNameById(rm1.Firmid.ToString(), rm.mmatter.ToString()).FirstOrDefault();
                                        if (getcase != null)
                                        {
                                            string msgcase = getcase;
                                            strbody += "Matter Name:" + msgcase + "<br><br>";
                                        }
                                    }
                                    strbody += "Message :" + msgbody + "<br><br>";
                                    if (sendemailpostedFiledata == null || sendemailpostedFiledata == "null" || sendemailpostedFiledata == "")
                                    {
                                        strbody += "Attachment :No<br><br>";
                                    }
                                    else
                                    {
                                        strbody += "Attachment :Yes<br><br>";
                                    }
                                    if (rm.userid != null)
                                    {
                                        var getusername = db.usp_GetUserNameById(rm1.Firmid.ToString(), rm.userid.ToString()).FirstOrDefault();
                                        if (getusername != null)
                                        {
                                            try
                                            {
                                                string msgusername = getusername.ToString();
                                                strbody += "From :" + msgusername + "<br><br>";
                                            }
                                            catch
                                            {
                                                string msgusername = getusername.ToString();
                                                strbody += "From :" + msgusername + "<br><br>";
                                            }
                                        }
                                    }
                                    strbody += "Date/Time :" + DateTime.Now.ToString("dd-MMM-yyyy hh:mm:ss") + "<br><br>";
                                    try
                                    {
                                        string attchment = sendemailpostedFiledata;
                                        if (attchment != null)
                                        {
                                            attchment = attchment.Replace("|", ",");
                                        }
                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                        CommomUtility objmail = new CommomUtility();
                                        objmail.SendEmail(fromemail, getemail.EmailId, "", strsubject, AssignmentSubmittedMailBody, attchment);
                                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                                    {
                                    }
                                }
                            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                            {
                            }
                            //check user type
                            var firmlist = db.usp_GetFirmUsersbyId_api(Convert.ToString(rm1.auserid)).FirstOrDefault();
                            var usertype = Convert.ToString(firmlist.RoleId);
                            //users
                            tbl_notification tn = new tbl_notification();
                            tn.date_time = rm.date_time;
                            tn.Firmid = rm.Firmid;
                            tn.userid = rm.userid;
                            tn.auser = Guid.Parse(rm1.auserid.ToString());
                            tn.ntype = "Messages";
                            tn.status = 0;
                            if (usertype == "1")
                            {
                                tn.urllink = "/Firm/ReceiveMessageList/" + rm.mid;
                            }
                            else if (usertype == "2")
                            {
                                tn.urllink = "/Employee/ReceiveMessageList/" + rm.mid;
                            }
                            else if (usertype == "3")
                            {
                                tn.urllink = "/Client/ReceiveMessageList/" + rm.mid;
                            }
                            tn.notification = "You have  new Message";
                            tn.typeid = rm.mid;
                            db.usp_AddNotification_api(tn.date_time, Convert.ToString(tn.Firmid), Convert.ToString(tn.userid), Convert.ToString(tn.auser),
                                    tn.ntype, null, Convert.ToInt32(tn.status), tn.urllink, tn.notification, Convert.ToString(tn.typeid));
                        }
                    }
                }
            }
            try
            {
                var attchment = sendemailpostedFiledata;
                if (attchment.ToString().Trim() != "")
                {
                    string[] CCattach = attchment.Split(',');
                    foreach (string ccattached in CCattach)
                    {
                        if (!string.IsNullOrEmpty(ccattached))
                        {
                            if (File.Exists(ccattached))
                            {
                                // AttachmentPath1 = attached;
                                System.IO.File.Delete(ccattached);
                            }
                            else
                            {
                                attchment = "";
                            }
                        }
                    }
                    //mm.CC.Add(new MailAddress(CC));
                }
            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
            {
            }
            //var checkdid = db.MessageDraftLists.Where(x => x.did.ToString() == did.ToString() && x.Firmid.ToString() == ml.Firmid.ToString()).FirstOrDefault();
            try
            {
                var checkdid = db.usp_GetMessageDraftList(Convert.ToString(ml.Firmid), Convert.ToString(did)).FirstOrDefault();
                if (checkdid != null)
                {
                    db.DeletedraftMessageList(ml.Firmid.ToString(), ml.userid.ToString(), checkdid.did.ToString());
                    db.insertdeleteentrytable(checkdid.did, "MessageDraftList", ml.Firmid);
                    db.SaveChanges();
                }
            }
            catch
            { }
            return true;
        }
        /// <summary>
        /// Save reply message
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="auser"></param>
        /// <param name="newdetails"></param>
        /// <returns></returns>
        public bool replymessage(ReplyMessageList ml, string auser, string newdetails)
        {
            var db = new LawPracticeEntities();
            var rm = new ReplyMessageList();
            var rm3 = new MessageList();
            var rm1 = new MessageMap();
            var rm4 = new MessageMap();
            var rm2 = new MessageStatu();
            dynamic datetime = DateTime.Now;
            dynamic notauser = "";
            var orgmsgdata = db.usp_GetMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
            if (orgmsgdata != null)
            {
                rm3.Firmid = ml.Firmid;
                rm3.userid = ml.userid;
                rm3.mmatter = orgmsgdata.mmatter;
                rm3.msubject = "Re:" + orgmsgdata.msubject;
                rm3.mbody = newdetails;
                rm3.status = 0;
                rm3.Repstatus = 1;
                if (ml.mfile != null)
                {
                    rm3.mfile = ml.mfile;
                }
                rm3.date_time = DateTime.Now;
                string id = "";
                ObjectParameter IDParameter1;
                IDParameter1 = new ObjectParameter("id", id);
                db.usp_SaveMessalgeList(rm3.Firmid, rm3.userid, rm3.mmatter, rm3.msubject, rm3.mbody,
                    Convert.ToInt32(rm3.status), rm3.Repstatus, rm3.mfile, IDParameter1);
                id = Convert.ToString(IDParameter1.Value);
                rm3.mid = Guid.Parse(id);
                var prevmsguser = db.usp_GetReplyMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
                if (prevmsguser != null)
                {
                    rm4.auserid = prevmsguser.userid;
                    rm4.Firmid = ml.Firmid;
                    rm4.userid = ml.userid;
                    rm4.MessageId = rm3.mid;
                    rm4.mstatus = 0;
                    rm4.readstatus = 2;
                    rm4.date_time = rm3.date_time;
                    db.usp_SaveMessageMap(Convert.ToString(rm4.Firmid), Convert.ToString(rm4.userid), Convert.ToString(rm4.auserid), Convert.ToString(rm4.MessageId),
                                Convert.ToInt32(rm4.mstatus), Convert.ToInt32(rm4.readstatus), Convert.ToString(Guid.NewGuid()));
                }
            }
            var replyuser = db.usp_GetReplyMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
            if (replyuser != null)
            {
                rm.Firmid = ml.Firmid;
                rm.userid = ml.userid;
                rm.mbody = ml.mbody;
                rm.status = 0;
                rm.mid = ml.mid;
                rm.auser = replyuser.userid;
                if (ml.mfile != null)
                {
                    rm.mfile = ml.mfile;
                }
                rm.date_time = datetime;
                db.usp_SaveReplyMessageList(Convert.ToString(rm.Firmid), Convert.ToString(rm.userid), Convert.ToString(rm.mbody), Convert.ToInt32(rm.status),
                    Convert.ToString(rm.auser), Convert.ToString(rm.mfile), Convert.ToString(rm.mid), Convert.ToString(Guid.NewGuid()));
                var getmsgdata = db.usp_GetMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
                notauser = getmsgdata.userid;
                if (getmsgdata != null)
                {
                    var getuserexsidt = db.usp_GetMessageMap(Convert.ToString(ml.Firmid), Convert.ToString(ml.mid), Convert.ToString(getmsgdata.userid));
                    if (getuserexsidt == null)
                    {
                        rm1.auserid = getmsgdata.userid;
                        rm1.Firmid = ml.Firmid;
                        rm1.userid = getmsgdata.userid;
                        rm1.MessageId = rm.mid;
                        rm1.mstatus = 0;
                        rm1.readstatus = 0;
                        rm1.date_time = datetime;
                        db.usp_SaveMessageMap(Convert.ToString(rm1.Firmid), Convert.ToString(rm1.userid), Convert.ToString(rm1.auserid), Convert.ToString(rm.mid),
                                Convert.ToInt32(rm1.mstatus), Convert.ToInt32(rm1.readstatus), Convert.ToString(Guid.NewGuid()));
                    }
                    else
                    {
                        var msg = db.usp_GetMessageMapByMessageId_firmId(Convert.ToString(ml.Firmid), Convert.ToString(ml.mid));
                        foreach (var itemw in msg)
                        {
                            try
                            {
                                if (itemw != null)
                                {
                                    itemw.mstatus = 0;
                                    itemw.iupdate = 1;
                                    db.usp_UpdateMessageMap(Convert.ToString(itemw.id), Convert.ToInt32(itemw.mstatus), Convert.ToInt32(itemw.iupdate));
                                }
                            }
                            catch { }
                        }
                    }
                }
                if (replyuser != null)
                {
                    //check user type
                    var firmlist = db.usp_GetFirmUsersbyId_api(Convert.ToString(replyuser.userid)).FirstOrDefault();
                    var usertype = Convert.ToString(firmlist.RoleId);
                    //users
                    tbl_notification tn = new tbl_notification();
                    tn.date_time = datetime;
                    tn.Firmid = rm.Firmid;
                    tn.userid = rm.userid;
                    tn.auser = notauser;
                    tn.ntype = "Messages";
                    tn.status = 0;
                    if (usertype == "1")
                    {
                        tn.urllink = "/Firm/ReceiveMessageList/" + rm.mid;
                    }
                    else if (usertype == "2")
                    {
                        tn.urllink = "/Employee/ReceiveMessageList/" + rm.mid;
                    }
                    else if (usertype == "3")
                    {
                        tn.urllink = "/Client/ReceiveMessageList/" + rm.mid;
                    }
                    tn.notification = "You have  new Message";
                    tn.typeid = rm.mid;
                    db.usp_AddNotification_api(tn.date_time, Convert.ToString(tn.Firmid), Convert.ToString(tn.userid), Convert.ToString(tn.auser),
                                    tn.ntype, null, Convert.ToInt32(tn.status), tn.urllink, tn.notification, Convert.ToString(tn.typeid));
                }
            }
            else
            {
                var fromuser = db.usp_GetMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
                if (fromuser != null)
                {
                    rm.Firmid = ml.Firmid;
                    rm.userid = ml.userid;
                    rm.mbody = ml.mbody;
                    rm.status = 0;
                    rm.mid = ml.mid;
                    rm.auser = fromuser.userid;
                    if (ml.mfile != null)
                    {
                        rm.mfile = ml.mfile;
                    }
                    rm.date_time = datetime;
                    db.usp_SaveReplyMessageList(Convert.ToString(rm.Firmid), Convert.ToString(rm.userid), Convert.ToString(rm.mbody), Convert.ToInt32(rm.status),
                    Convert.ToString(rm.auser), Convert.ToString(rm.mfile), Convert.ToString(rm.mid), Convert.ToString(Guid.NewGuid()));
                    var getmsgdata = db.usp_GetMessageList(Convert.ToString(ml.mid), Convert.ToString(ml.Firmid)).FirstOrDefault();
                    notauser = getmsgdata.userid;
                    if (getmsgdata != null)
                    {
                        var getuserexsidt = db.usp_GetMessageMap(Convert.ToString(ml.Firmid), Convert.ToString(getmsgdata.userid),
                            Convert.ToString(ml.mid)).FirstOrDefault();
                        if (getuserexsidt == null)
                        {
                            rm1.auserid = getmsgdata.userid;
                            rm1.Firmid = ml.Firmid;
                            rm1.userid = getmsgdata.userid;
                            rm1.MessageId = rm.mid;
                            rm1.mstatus = 0;
                            rm1.readstatus = 0;
                            rm1.date_time = datetime;
                            db.usp_SaveMessageMap(Convert.ToString(rm1.Firmid), Convert.ToString(rm1.userid), Convert.ToString(rm1.auserid), Convert.ToString(rm.mid),
                                Convert.ToInt32(rm1.mstatus), Convert.ToInt32(rm1.readstatus), Convert.ToString(Guid.NewGuid()));
                        }
                        else
                        {
                            var msg = db.usp_GetMessageMapByMessageId_firmId(Convert.ToString(ml.Firmid), Convert.ToString(ml.mid));
                            foreach (var itemw in msg)
                            {
                                try
                                {
                                    if (itemw != null)
                                    {
                                        itemw.iupdate = 1;
                                        itemw.mstatus = 0;
                                        db.usp_UpdateMessageMap(Convert.ToString(itemw.id), Convert.ToInt32(itemw.mstatus), Convert.ToInt32(itemw.iupdate));
                                    }
                                }
                                catch
                                { }
                            }
                        }
                    }
                }
                var getsentuser = db.usp_GetMessageMap(Convert.ToString(ml.Firmid), Convert.ToString(fromuser.userid),
                           Convert.ToString(ml.mid)).ToList();
                if (getsentuser != null)
                {
                    foreach (var itemdata in getsentuser)
                    {
                        if (itemdata.auserid != ml.userid)
                        {
                            rm2.mto = itemdata.auserid;
                            rm2.Firmid = ml.Firmid;
                            rm2.mfrom = ml.userid;
                            rm2.MessageId = rm.mid;
                            rm2.readstatus = 0;
                            rm2.date_time = datetime;
                            db.usp_SaveMessageStatus(Convert.ToString(rm2.Firmid), Convert.ToString(rm2.mfrom), Convert.ToString(rm2.mto),
                                Convert.ToString(rm.mid), Convert.ToInt32(rm2.readstatus), Convert.ToString(Guid.NewGuid()));
                        }
                    }
                }
                long rauser = Convert.ToInt32(auser);
                if (fromuser != null)
                {
                    //check user type
                    var firmlist = db.usp_GetFirmUsersbyId_api(Convert.ToString(fromuser.userid)).FirstOrDefault();
                    var usertype = Convert.ToString(firmlist.RoleId);
                    //users
                    tbl_notification tn = new tbl_notification();
                    tn.date_time = datetime;
                    tn.Firmid = rm.Firmid;
                    tn.userid = rm.userid;
                    tn.auser = notauser;
                    tn.ntype = "Messages";
                    tn.status = 0;
                    if (usertype == "1")
                    {
                        tn.urllink = "/Firm/ReceiveMessageList/" + rm.mid;
                    }
                    else if (usertype == "2")
                    {
                        tn.urllink = "/Employee/ReceiveMessageList/" + rm.mid;
                    }
                    else if (usertype == "3")
                    {
                        tn.urllink = "/Client/ReceiveMessageList/" + rm.mid;
                    }
                    tn.notification = "You have  new Message";
                    tn.typeid = rm.mid;
                    db.usp_AddNotification_api(tn.date_time, Convert.ToString(tn.Firmid), Convert.ToString(tn.userid), Convert.ToString(tn.auser),
                                    tn.ntype, null, Convert.ToInt32(tn.status), tn.urllink, tn.notification, Convert.ToString(tn.typeid));
                }
            }
            return true;
        }
        /// <summary>
        /// Reply all message
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="auser"></param>
        /// <param name="newdetails"></param>
        /// <returns></returns>
        public bool Allreplymessage(ReplyMessageList ml, string auser, string newdetails)
        {
            var db = new LawPracticeEntities();
            var rm = new ReplyMessageList();
            var rm1 = new MessageMap();
            var rm4 = new MessageMap();
            var rm3 = new MessageList();
            var rm2 = new MessageStatu();
            //Save or do your action  
            dynamic datetime = DateTime.Now;
            dynamic msgfromuser = "";
            var orgmsgdata = db.MessageLists.Where(x => x.mid == ml.mid).FirstOrDefault();
            if (orgmsgdata != null)
            {
                rm3.Firmid = ml.Firmid;
                rm3.userid = ml.userid;
                rm3.mmatter = orgmsgdata.mmatter;
                rm3.msubject = "Re:" + orgmsgdata.msubject;
                rm3.mbody = newdetails;
                rm3.status = 0;
                rm3.Repstatus = 1;
                // rm.auser = Convert.ToInt32(item);
                if (ml.mfile != null)
                {
                    rm3.mfile = ml.mfile;
                }
                rm3.date_time = DateTime.Now;
                db.MessageLists.Add(rm3);
                db.SaveChanges();
                var prevmsguser = db.ReplyMessageLists.Where(x => x.mid == ml.mid && x.Firmid == ml.Firmid).ToList();
                if (prevmsguser != null)
                {
                    foreach (var prvuser in prevmsguser)
                    {
                        rm4.auserid = prvuser.auser;
                        rm4.Firmid = ml.Firmid;
                        rm4.userid = ml.userid;
                        rm4.MessageId = rm3.mid;
                        rm4.mstatus = 0;
                        rm4.readstatus = 2;
                        rm4.date_time = rm3.date_time;
                        db.MessageMaps.Add(rm4);
                        db.SaveChanges();
                    }
                }
            }
            var getmsgdatauser = db.MessageLists.Where(q => q.mid == ml.mid).FirstOrDefault();
            if (getmsgdatauser != null)
            {
                msgfromuser = getmsgdatauser.userid;
            }
            var fromuser = db.MessageMaps.Where(x => x.MessageId == ml.mid && x.Firmid == ml.Firmid).Select(x => new { x.auserid }).ToList();
            foreach (var fromusers in fromuser)
            {
                if (fromusers != null)
                {
                    rm.Firmid = ml.Firmid;
                    rm.userid = ml.userid;
                    rm.mbody = ml.mbody;
                    rm.status = 0;
                    rm.mid = ml.mid;
                    rm.auser = fromusers.auserid;
                    if (ml.mfile != null)
                    {
                        rm.mfile = ml.mfile;
                    }
                    rm.date_time = datetime;
                    db.ReplyMessageLists.Add(rm);
                    db.SaveChanges();
                }
            }
            foreach (var fromusers1 in fromuser)
            {
                if (fromusers1 != null)
                {
                    if (fromusers1.auserid != msgfromuser)
                    {
                        rm.Firmid = ml.Firmid;
                        rm.userid = ml.userid;
                        rm.mbody = ml.mbody;
                        rm.status = 0;
                        rm.mid = ml.mid;
                        rm.auser = msgfromuser;
                        if (ml.mfile != null)
                        {
                            rm.mfile = ml.mfile;
                        }
                        rm.date_time = datetime;
                        db.ReplyMessageLists.Add(rm);
                        db.SaveChanges();
                        break;
                    }
                }
            }
            var getmsgdata = db.MessageLists.Where(q => q.mid == ml.mid).FirstOrDefault();
            if (getmsgdata != null)
            {
                var getuserexsidt = db.MessageMaps.Where(x => x.MessageId == ml.mid && x.auserid == getmsgdata.userid).FirstOrDefault();
                if (getuserexsidt == null)
                {
                    rm1.auserid = getmsgdata.userid;
                    rm1.Firmid = ml.Firmid;
                    rm1.userid = getmsgdata.userid;
                    rm1.MessageId = rm.mid;
                    rm1.mstatus = 0;
                    rm1.readstatus = 0;
                    rm1.date_time = datetime;
                    db.MessageMaps.Add(rm1);
                    db.SaveChanges();
                }
                else
                {
                    var msg = (from c in db.MessageMaps
                               orderby c.id descending
                               where c.MessageId == ml.mid && c.Firmid == ml.Firmid
                               select c).ToList();
                    foreach (var itemw in msg)
                    {
                        if (itemw != null)
                        {
                            itemw.iupdate = 1;
                            itemw.mstatus = 0;
                            db.Entry(itemw).State = EntityState.Modified;
                        }
                    }
                }
            }
            var getsentuser = db.MessageMaps.Where(x => x.MessageId == ml.mid).ToList();
            if (getsentuser != null)
            {
                foreach (var itemdata in getsentuser)
                {
                    if (itemdata.auserid != ml.userid)
                    {
                        rm2.mto = itemdata.auserid;
                        rm2.Firmid = ml.Firmid;
                        rm2.mfrom = ml.userid;
                        rm2.MessageId = rm.mid;
                        rm2.readstatus = 0;
                        rm2.date_time = datetime;
                        db.MessageStatus.Add(rm2);
                        db.SaveChanges();
                        long rauser = Convert.ToInt32(auser);
                        if (auser != null)
                        {
                            //check user type
                            var usertype = db.FirmUsers.Where(x => x.Id.ToString() == rauser.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                            //users
                            tbl_notification tn = new tbl_notification();
                            tn.date_time = datetime;
                            tn.Firmid = rm.Firmid;
                            tn.userid = rm.userid;
                            tn.auser = Guid.Parse(itemdata.auserid.ToString());
                            tn.ntype = "Messages";
                            tn.status = 0;
                            if (usertype.RoleId.ToString() == "1")
                            {
                                tn.urllink = "/Firm/ReceiveMessageList/" + rm.mid;
                            }
                            else if (usertype.RoleId.ToString() == "2")
                            {
                                tn.urllink = "/Employee/ReceiveMessageList/" + rm.mid;
                            }
                            else if (usertype.RoleId.ToString() == "3")
                            {
                                tn.urllink = "/Client/ReceiveMessageList/" + rm.mid;
                            }
                            tn.notification = "You have new Message";
                            tn.typeid = rm.mid;
                            db.tbl_notification.Add(tn);
                            db.SaveChanges();
                        }
                    }
                }
            }
            return true;
        }
        public bool editmessage(MessageList ml)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Single message list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string singlemessagelist(string uid, string id)
        {
            var db = new LawPracticeEntities();
            var task = db.GetSingleMessageDetails(Guid.Parse(uid), Guid.Parse(id)).ToList();
            var a = JsonConvert.SerializeObject(task);
            return a;
        }
        /// <summary>
        /// Save client
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="username"></param>
        /// <param name="cpassword"></param>
        /// <param name="uemail"></param>
        /// <returns></returns>
        public bool saveclient(RegUser ml, string username, string cpassword, string uemail)
        {
            var db = new LawPracticeEntities();
            dynamic firmid = ml.Firmid;
            // save userlogin data
            var lg = new FirmUser();
            lg.DefaultController = "Client";
            lg.IsActive = false;
            lg.IsFirmAdmin = false;
            lg.IsFirmClient = false;
            lg.Password = cpassword;
            lg.UserName = username;
            lg.RoleId = 3;
            lg.DefaultAction = "dashboard";
            lg.EmailId = uemail;
            lg.Firmid = firmid;
            db.FirmUsers.Add(lg);
            db.SaveChanges();
            var newId = lg.Id;
            // save client
            var rm = new RegUser();
            rm.LoginId = newId;
            rm.Firmid = ml.Firmid;
            rm.firmuser = ml.firmuser;
            rm.cfname = ml.cfname;
            // rm.cemail = ml.cemail;
            rm.cmobile = ml.cmobile;
            rm.caddress = ml.caddress;
            rm.country = ml.country;
            rm.cstate = ml.cstate;
            rm.BARNo = ml.BARNo;
            rm.ccity = ml.ccity;
            rm.Designation = ml.Designation;
            rm.IsAdmin = "3";
            rm.leadid = null;
            rm.clandline = ml.clandline;
            if (ml.cphoto != null)
            {
                rm.cphoto = ml.cphoto;
            }
            rm.date_time = DateTime.Now;
            db.RegUsers.Add(rm);
            db.SaveChanges();
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = Guid.Parse(rm.Firmid.ToString());
            tn.userid = Guid.Parse(ml.firmuser.ToString());
            tn.auser = Guid.Parse(ml.firmuser.ToString());
            tn.ntype = "Client";
            tn.status = 1;
            tn.urllink = "/Firm/ClientList";
            tn.notification = "You have new User";
            tn.typeid = Guid.Parse(rm.LoginId.ToString());
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            if (lg.EmailId != null)
            {
                var body1 = "Dear user You have registered Successfully <br> Your User Id: " + username + " <br>Password: " + cpassword;
                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["RegistrationToAdminSubject"].ToString();
                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["RegistrationMailToAdminBody"].ToString();
                string subscribername = Convert.ToString(HttpContext.Current.Session["fullusername"]);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#USERID#", username);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#PASSWORD#", cpassword);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#NAME#", "");
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#SubscriberName#", subscribername);
                try
                {
                    CommomUtility obj1 = new CommomUtility();
                    obj1.SendEmail(fromemail, lg.EmailId, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                {
                }
            }
            return true;
        }
        /// <summary>
        /// Get client etail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string clientlist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            List<GetclientDetails_Result> list = new List<GetclientDetails_Result>();
            list = db.GetclientDetails(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetclientDetails_Result newItem = new GetclientDetails_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client summary Details
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string clientsummarylist(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            List<GetclientsummaryDetails_Result> list = new List<GetclientsummaryDetails_Result>();
            list = db.GetclientsummaryDetails(Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetclientsummaryDetails_Result newItem = new GetclientsummaryDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Client List By Row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string ClientListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            var db = new LawPracticeEntities();
            List<ClientListByRowid_Result> list = new List<ClientListByRowid_Result>();
            list = db.ClientListByRowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            foreach (var data in list.ToList())
            {
                GetclientsummaryDetails_Result newItem = new GetclientsummaryDetails_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Search user list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <param name="UserNameSrh"></param>
        /// <returns></returns>
        public string UserSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string UserNameSrh)
        {
            var db = new LawPracticeEntities();
            List<GetSearchuserDetailsbyrowid_Result> list = new List<GetSearchuserDetailsbyrowid_Result>();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("userlist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            list = db.GetSearchuserDetailsbyrowid(Guid.Parse(firmid), userid, pagenum, pagesize, 0, search, pageid, UserNameSrh).ToList();
            foreach (var data in list.ToList())
            {
                GetSearchuserDetailsbyrowid_Result newItem = new GetSearchuserDetailsbyrowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client contact list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string ContactsClientListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<usp_ContactsClientListByRowid_Result> list = new List<usp_ContactsClientListByRowid_Result>();
            list = db.usp_ContactsClientListByRowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, pageid).ToList();
            foreach (var data in list.ToList())
            {
                usp_ContactsClientListByRowid_Result newItem = new usp_ContactsClientListByRowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get search client list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string ClientSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<ClientSearchListByRowid_Result> list = new List<ClientSearchListByRowid_Result>();
            list = db.ClientSearchListByRowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            foreach (var data in list.ToList())
            {
                ClientSearchListByRowid_Result newItem = new ClientSearchListByRowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get user client list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string ClientListUserByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            var db = new LawPracticeEntities();
            List<ClientListUserByRowid_Result> list = new List<ClientListUserByRowid_Result>();
            list = db.ClientListUserByRowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            foreach (var data in list.ToList())
            {
                ClientListUserByRowid_Result newItem = new ClientListUserByRowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Search client by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string ClientSearchListUserByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<ClientSearchListUserByRowid_Result> list = new List<ClientSearchListUserByRowid_Result>();
            list = db.ClientSearchListUserByRowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            foreach (var data in list.ToList())
            {
                ClientSearchListUserByRowid_Result newItem = new ClientSearchListUserByRowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client list by user
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string clientlistbyuser(string uid, string userid)
        {
            var db = new LawPracticeEntities();
            var client = db.GetclientDetailsbyuser(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            List<GetclientDetailsbyuser_Result> list = new List<GetclientDetailsbyuser_Result>();
            list = db.GetclientDetailsbyuser(Guid.Parse(uid), Guid.Parse(userid)).ToList();
            foreach (var data in list.ToList())
            {
                GetclientDetailsbyuser_Result newItem = new GetclientDetailsbyuser_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.leadid != null)
                {
                    newItem.leadid = Convert.ToBase64String(QueryAES.EncryptAes(data.leadid.ToString()));
                    list[list.IndexOf(data)].leadid = newItem.leadid;
                }
                if (data.LoginId != null)
                {
                    newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                    list[list.IndexOf(data)].LoginId = newItem.LoginId;
                }

            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Directory full path
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string directoryfullpath(string firmid, string userid, string uid)
        {
            var db = new LawPracticeEntities();
            var client = db.sp_Getfilepaths(Guid.Parse(firmid.ToString()), Guid.Parse(userid.ToString()), Guid.Parse(uid.ToString())).ToList();
            var a = JsonConvert.SerializeObject(client);
            return a;
        }
        /// <summary>
        /// Enable client
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string enableclient(string[] typeIds, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            string did = "";
            FirmUser cf = new FirmUser();
            foreach (string did1 in typeIds)
            {
                try
                {
                    did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                }
                catch
                {
                    did = did1;
                }
                var pdata = db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(pdata.UserName))
                {
                    if (pdata.IsActive == false)
                    {
                        db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).ToList().ForEach(x =>
                        {
                            x.iupdate = 1;
                            x.IsActive = true;
                        });
                        var count = db.SaveChanges();
                        if (count > 0)
                        {
                            var getFirmDetail = db.Firms.Where(p => p.Id.ToString() == pdata.Firmid.ToString()).FirstOrDefault();
                            var result = AddCaseCaseWatch.EnableDisableUserToCW(uid.ToString(), did.ToString(), 1, getFirmDetail.ExpiryDate);
                        }
                    }
                    try
                    {
                        //get alluser relate to client
                        var data = db.usp_getAllUserrelatedtoClient(uid, userid, did).ToList();
                        if (data != null)
                        {
                            foreach (var item in data)
                            {
                                var dataac2 = Notification.SaveNotifications("MKEnabled", null, uid, userid, item.Value.ToString(), null);
                            }
                        }
                    }
                    catch
                    {
                    }
                    string notification = "You have Enabled a Contact -";
                    db.usp_AddActivity(uid, userid, notification, "Enable Client",
                        did, null);
                }
            }
            return "ok";
        }
        /// <summary>
        /// Disable client
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string disableclient(string[] typeIds, string uid, string userid)
        {
            var db = new LawPracticeEntities();
            string did = "";
            FirmUser cf = new FirmUser();
            foreach (string did1 in typeIds)
            {
                try
                {
                    did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                }
                catch
                {
                    did = did1;
                }
                var pdata = db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(pdata.UserName))
                {
                    if (pdata.IsActive == true)
                    {
                        db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).ToList().ForEach(x =>
                        {
                            x.iupdate = 1;
                            x.IsActive = false;
                        });
                        var count = db.SaveChanges();
                        if (count > 0)
                        {
                            var getFirmDetail = db.Firms.Where(p => p.Id.ToString() == pdata.Firmid.ToString()).FirstOrDefault();
                            var result = AddCaseCaseWatch.EnableDisableUserToCW(uid.ToString(), did.ToString(), 0, getFirmDetail.ExpiryDate);
                        }
                    }
                    try
                    {
                        //get alluser relate to client
                        var data = db.usp_getAllUserrelatedtoClient(uid, userid, did).ToList();
                        if (data != null)
                        {
                            foreach (var item in data)
                            {
                                var dataac2 = Notification.SaveNotifications("MKDisabled", null, uid, userid, item.Value.ToString(), null);
                            }
                        }
                    }
                    catch
                    {
                    }
                    string notification = "You have Disabled a Contact -";
                    db.usp_AddActivity(uid, userid, notification, "Disable Client",
                        did, null);
                }
            }
            return "ok";
        }
        /// <summary>
        /// Save user details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="username"></param>
        /// <param name="cpassword"></param>
        /// <param name="uemail"></param>
        /// <returns></returns>
        public bool saveuser(RegUser ml, string username, string cpassword, string uemail)
        {
            var db = new LawPracticeEntities();
            dynamic firmid = ml.Firmid;
            // save userlogin data
            var lg = new FirmUser();
            lg.DefaultController = "Employee";
            lg.IsActive = false;
            lg.IsFirmAdmin = false;
            lg.IsFirmClient = false;
            lg.Password = cpassword;
            lg.UserName = username;
            lg.RoleId = 2;
            lg.DefaultAction = "dashboard";
            lg.EmailId = uemail;
            lg.Firmid = firmid;
            db.FirmUsers.Add(lg);
            db.SaveChanges();
            var newId = lg.Id;
            // save client
            var rm = new RegUser();
            rm.LoginId = newId;
            rm.Firmid = ml.Firmid;
            rm.firmuser = ml.firmuser;
            rm.cfname = ml.cfname;
            // rm.cemail = ml.cemail;
            rm.cmobile = ml.cmobile;
            rm.caddress = ml.caddress;
            rm.country = ml.country;
            rm.cstate = ml.cstate;
            rm.BARNo = ml.BARNo;
            rm.ccity = ml.ccity;
            rm.Designation = ml.Designation;
            rm.Department = ml.Department;
            rm.IsAdmin = "2";
            rm.leadid = null;
            rm.clandline = ml.clandline;
            if (ml.cphoto != null)
            {
                rm.cphoto = ml.cphoto;
            }
            rm.date_time = DateTime.Now;
            db.RegUsers.Add(rm);
            db.SaveChanges();
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = Guid.Parse(rm.Firmid.ToString());
            tn.userid = Guid.Parse(ml.firmuser.ToString());
            tn.auser = Guid.Parse(ml.firmuser.ToString());
            tn.ntype = "User";
            tn.status = 1;
            tn.urllink = "/Firm/UserList";
            tn.notification = "You have new User";
            tn.typeid = Guid.Parse(rm.LoginId.ToString());
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            if (lg.EmailId != null)
            {
                var body1 = "Dear user You have registered Successfully <br> Your User Id: " + username + " <br>Password: " + cpassword;
                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["RegistrationToAdminSubject"].ToString();
                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["RegistrationMailToAdminBody"].ToString();
                string subscribername = Convert.ToString(HttpContext.Current.Session["fullusername"]);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#USERID#", username);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#PASSWORD#", cpassword);
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#NAME#", "");
                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#SubscriberName#", subscribername);
                try
                {
                    CommomUtility obj1 = new CommomUtility();
                    obj1.SendEmail(fromemail, lg.EmailId, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                {
                }
            }
            return true;
        }
        /// <summary>
        /// User list
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string userlist(string uid)
        {
            var db = new LawPracticeEntities();
            var client = db.GetuserDetails(Guid.Parse(uid)).ToList();
            var a = JsonConvert.SerializeObject(client);
            return a;
        }
        /// <summary>
        /// Get user list by row id
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string userlistbyrowid(string uid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetuserDetailsbyrowid_Result> list = new List<GetuserDetailsbyrowid_Result>();
            list = db.GetuserDetailsbyrowid(Guid.Parse(uid), pagenum, pagesize, null, 0).ToList();
            foreach (var data in list.ToList())
            {
                GetuserDetailsbyrowid_Result newItem = new GetuserDetailsbyrowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Enable user
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string enableuser(string[] typeIds, string uid)
        {
            var db = new LawPracticeEntities();
            FirmUser cf = new FirmUser();
            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                var pdata = db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).FirstOrDefault();
                if (pdata.IsActive == false)
                {
                    db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == did.ToString()).ToList().ForEach(x =>
                    {
                        x.IsActive = true;
                        x.iupdate = 1;
                    });
                    var count = db.SaveChanges();
                    if (count > 0)
                    {
                        var getFirmDetail = db.Firms.Where(p => p.Id.ToString() == pdata.Firmid.ToString()).FirstOrDefault();
                        var result = AddCaseCaseWatch.EnableDisableUserToCW(uid.ToString(), did.ToString(), 1, getFirmDetail.ExpiryDate);
                    }
                }
            }
            return "ok";
        }
        /// <summary>
        /// Disable user
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="loginuserid"></param>
        /// <returns></returns>
        public string disableuser(string[] typeIds, string uid, string loginuserid)
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                    FirmUser cf = new FirmUser();
                    foreach (string did1 in typeIds)
                    {
                        string userid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                        var pdata = db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == userid.ToString()).FirstOrDefault();
                        if (pdata.IsActive == true)
                        {
                            db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString() && x.Id.ToString() == userid.ToString()).ToList().ForEach(x =>
                            {
                                x.IsActive = false;
                                x.iupdate = 1;
                            });
                            var count = db.SaveChanges();
                            if (count > 0)
                            {
                                var getfirmadminid = db.usp_FirmAdminDetails(uid).Select(x => x.Id.ToString()).FirstOrDefault();
                                var getFirmDetails = db.Firms.Where(x => x.Id.ToString() == pdata.Firmid.ToString()).FirstOrDefault();
                                var result = AddCaseCaseWatch.EnableDisableUserToCW(uid.ToString(), userid.ToString(), 0, getFirmDetails.ExpiryDate);
                                //get caseid of assigned case CW
                                var assignedCWId = db.usp_GetCWAssignedCaseId(uid, userid).FirstOrDefault();
                                var matteridname = WebConfigurationManager.AppSettings["matteridname"];
                                if (!String.IsNullOrEmpty(assignedCWId))
                                {
                                    var results1 = AddCaseCaseWatch.RemoveCaseWatchAlertUser(matteridname + userid, getfirmadminid, uid, apiUrl, assignedCWId.ToString(),0,"");
                                }
                                //get caseid of created case CW
                                var createdCWId = db.usp_GetCWCreatorCaseId(uid, userid).FirstOrDefault();
                                //save log from db
                                var result1 = db.usp_SaveUserForDisabledUserLogData(uid, loginuserid, userid, getfirmadminid);
                                //get dadmin id 
                                var result2 = db.usp_UpdateUserForDisabledUser(uid, loginuserid, userid, getfirmadminid);
                                //update user from db
                                if (!String.IsNullOrEmpty(createdCWId))
                                {
                                    var results2 = AddCaseCaseWatch.MyUserIDUpdateforACase(userid, getfirmadminid, apiUrl, createdCWId.ToString());
                                    if (results2 == "Updated Successfully.")
                                    {
                                        transaction.Commit();
                                        return "true";
                                    }
                                }
                                else
                                {
                                    transaction.Commit();
                                    return "true";
                                }
                            }
                            else
                            {
                                transaction.Rollback();
                                return "false";
                            }
                        }
                    }
                    return "false";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message;
                }
            }
        }
        /// <summary>
        /// Save timer
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public string savetimer(TimerList ml)
        {
            var db = new LawPracticeEntities();
            db.TimerLists.Add(ml);
            var count = db.SaveChanges();
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.userid;
            tn.auser = Guid.Parse(ml.userid.ToString());
            tn.ntype = "TimeEntry";
            tn.status = 1;
            tn.urllink = "";
            tn.notification = "You have new TimeEntry";
            tn.typeid = ml.Id;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
            return count.ToString();
        }
        /// <summary>
        /// Edit timer
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string edittimer(TimerList ml, string type)
        {
            var db = new LawPracticeEntities();
            var data = new TimerList();
            data.callDura = ml.callDura;
            data.Firmid = ml.Firmid;
            data.tcontact = ml.tcontact;
            data.tmatter = ml.tmatter;
            data.total = ml.total;
            data.tprivnotes = ml.tprivnotes;
            data.tdate = ml.tdate;
            data.tdetails = ml.tdetails;
            data.tbillby = ml.tbillby;
            data.tbill = ml.tbill;
            data.titem = ml.titem;
            data.hrrate = ml.hrrate;
            data.iupdate = 1;
            var count = db.usp_UpdateTimerList(ml.Id, data.tcontact, data.tmatter, data.titem, data.tdate, data.callDura, data.tdetails, data.tbill, data.tbillby
                , data.hrrate, data.total, data.tprivnotes, data.Firmid, data.userid, data.date_time, data.stime, data.etime, type.ToString());
            tbl_notification tn = new tbl_notification();
            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.userid;
            tn.auser = Guid.Parse(ml.userid.ToString());
            tn.ntype = "TimeEntry";
            tn.status = 1;
            tn.nmode = "edit";
            tn.urllink = "";
            tn.notification = "You have edit TimeEntry";
            tn.typeid = ml.Id;
            var rtn = db.saveuseractivity(tn.Firmid.ToString(), tn.userid.ToString(), tn.auser.ToString(), Convert.ToInt16(tn.status), tn.notification, tn.ntype.ToString(), tn.typeid.ToString(), tn.urllink.ToString(), tn.nmode, DateTime.Now.ToString());
            return count.ToString();
        }
        /// <summary>
        /// Get single file permission
        /// </summary>
        /// <param name="contactid"></param>
        /// <param name="fileid"></param>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public string singlefilepermission(string contactid, string fileid, string FirmId, string UserId)
        {
            var db = new LawPracticeEntities();
            var cid = contactid;
            var fileids = fileid;
            var datas = db.usp_getuserdocsharepermission(FirmId, UserId, fileid, contactid).ToList();
            var a = JsonConvert.SerializeObject(datas);
            return a;
        }
        /// <summary>
        /// Load directory
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadDirectory(string pfile, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.sp_GetFilesAndDirectory(Guid.Parse(pfile), Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load cloud directory
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string LoadDirectoryCloud(string pfile, string firmid, string userid, string caseid)
        {
            var db = new LawPracticeEntities();
            var sp = db.sp_GetFilesAndDirectoryCloud(Guid.Parse(pfile), Guid.Parse(firmid), Guid.Parse(userid), caseid).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load  Knowledge Directory
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadKnowDirectory(string pfile, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.sp_GetKnowledgeDirectory(Guid.Parse(pfile), Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load Directory by row id
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string LoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            return "a";
        }
        /// <summary>
        /// Load user directory
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string UserLoadDirectory(string pfile, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var sp = db.sp_GetUserFilesAndDirectory(Guid.Parse(pfile), Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Load user directory by row id
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string UserLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            var db = new LawPracticeEntities();
            List<sp_GetFilesAndDirectorybyrowid_Result> list = new List<sp_GetFilesAndDirectorybyrowid_Result>();
            list = db.sp_GetFilesAndDirectorybyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetFilesAndDirectorybyrowid_Result newItem = new sp_GetFilesAndDirectorybyrowid_Result();
                if (!string.IsNullOrEmpty(data.CreatedBy))
                {
                    newItem.CreatedBy = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.CreatedBy));
                    list[list.IndexOf(data)].CreatedBy = newItem.CreatedBy;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load cloud user directory by row id
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string UserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<sp_GetFilesAndDirectorybyrowidCloudCheckInOut_Result> list = new List<sp_GetFilesAndDirectorybyrowidCloudCheckInOut_Result>();
            list = db.sp_GetFilesAndDirectorybyrowidCloudCheckInOut(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, pageid, "").ToList();
            foreach (var data in list.ToList())
            {
                sp_GetFilesAndDirectorybyrowidCloudCheckInOut_Result newItem = new sp_GetFilesAndDirectorybyrowidCloudCheckInOut_Result();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get file version list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fileid"></param>
        /// <returns></returns>
        public string FileVersionList(string firmid, string userid, string fileid)
        {
            var db = new LawPracticeEntities();
            List<usp_FIleVersionlist_Result> list = new List<usp_FIleVersionlist_Result>();
            list = db.usp_FIleVersionlist(firmid, userid, fileid).ToList();
            foreach (var data in list.ToList())
            {
                usp_FIleVersionlist_Result newItem = new usp_FIleVersionlist_Result();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load search user directory by row id
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string SearchUserLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<sp_GetSearchFilesAndDirectorybyrowid_Result> list = new List<sp_GetSearchFilesAndDirectorybyrowid_Result>();
            list = db.sp_GetSearchFilesAndDirectorybyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, search).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetSearchFilesAndDirectorybyrowid_Result newItem = new sp_GetSearchFilesAndDirectorybyrowid_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load cloud search user directory by row id
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string SearchUserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<sp_GetSearchFilesAndDirectorybyrowidCloudInOut_Result1> list = new List<sp_GetSearchFilesAndDirectorybyrowidCloudInOut_Result1>();
            list = db.sp_GetSearchFilesAndDirectorybyrowidCloudInOut(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, search, pageid).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetSearchFilesAndDirectorybyrowidCloudInOut_Result1 newItem = new sp_GetSearchFilesAndDirectorybyrowidCloudInOut_Result1();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Content Search User Load Directory by rowid Cloud
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        public string ContentSearchUserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string ids)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<sp_GetContentSearchFilesAndDirectorybyrowidCloudInOut_Result> list = new List<sp_GetContentSearchFilesAndDirectorybyrowidCloudInOut_Result>();
            list = db.sp_GetContentSearchFilesAndDirectorybyrowidCloudInOut(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, search, pageid, ids).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetContentSearchFilesAndDirectorybyrowidCloudInOut_Result newItem = new sp_GetContentSearchFilesAndDirectorybyrowidCloudInOut_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove User File Request List by rowid
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string RemoveUserFileRequestListbyrowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<sp_GetRemoveFilesRequestbyrowid_Result> list = new List<sp_GetRemoveFilesRequestbyrowid_Result>();
            list = db.sp_GetRemoveFilesRequestbyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, roleid, search).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetRemoveFilesRequestbyrowid_Result newItem = new sp_GetRemoveFilesRequestbyrowid_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove User File Request List by rowid Cloud
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string RemoveUserFileRequestListbyrowidCloud(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<sp_GetRemoveFilesRequestbyrowidCloud_Result> list = new List<sp_GetRemoveFilesRequestbyrowidCloud_Result>();
            list = db.sp_GetRemoveFilesRequestbyrowidCloud(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, roleid, search).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetRemoveFilesRequestbyrowidCloud_Result newItem = new sp_GetRemoveFilesRequestbyrowidCloud_Result();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Move load directory
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string LoadDirForMove(string firmid, string userid, string pfile, string search)
        {
            var db = new LawPracticeEntities();
            var sp = db.usp_GetFileDirPathForMove(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(pfile), search).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Browse load directory
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string LoadDirForBrowse(string firmid, string userid, string pfile, string search)
        {
            var db = new LawPracticeEntities();
            var sp = db.usp_GetFileDirPathForBrowse(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(pfile), search, 1, 1).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Single draft message
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <returns></returns>
        public string singledraftmessage(string firmid, string userid, string pfile)
        {
            var db = new LawPracticeEntities();
            var sp = db.GetSingledraftMessageList(firmid, userid, pfile).ToList();
            var a = JsonConvert.SerializeObject(sp);
            return a;
        }
        /// <summary>
        /// Save draft message
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public bool savedraftmessage(MessageDraftList ml, string user)
        {
            var db = new LawPracticeEntities();
            var rm = new MessageDraftList();
            //Save or do your action  
            rm.Firmid = ml.Firmid;
            rm.userid = ml.userid;
            rm.mmatter = ml.mmatter;
            if (rm.mmatter == null)
            {
                rm.mmatter = Guid.Parse("00000000-0000-0000-0000-000000000000");
            }
            rm.msubject = ml.msubject;
            rm.mbody = ml.mbody;
            rm.date_time = DateTime.Now;
            if (user == "null")
            {
                db.usp_savedraftmessage(ml.did.ToString(), rm.Firmid.ToString(), rm.userid.ToString(), rm.mmatter.ToString(), null, rm.mbody.ToString(), rm.date_time.ToString(), rm.msubject.ToString());
            }
            else
            {
                rm.auser = user;
                db.usp_savedraftmessage(ml.did.ToString(), rm.Firmid.ToString(), rm.userid.ToString(), rm.mmatter.ToString(), rm.auser.ToString(), rm.mbody.ToString(), rm.date_time.ToString(), rm.msubject.ToString());
            }
            db.SaveChanges();
            return true;
        }
        /// <summary>
        /// Save group details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="user"></param>
        /// <param name="did"></param>
        /// <returns></returns>
        public bool savegroup(MessageGroup ml, string user, string did = null)
        {
            var db = new LawPracticeEntities();
            if (did == null)
            {
                var count = db.SaveMessageGroup(ml.Firmid, ml.userid, ml.Groupname, user);
            }
            else
            {
                var count = db.EditMessageGroup(ml.Firmid, ml.userid, ml.Groupname, user, did);
            }
            return true;
        }
        /// <summary>
        /// Save message group list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string messageGrouplist(Guid firmid, Guid userid, int roleid)
        {
            StringBuilder sb = new StringBuilder();
            var db = new LawPracticeEntities();
            List<Messagegrouplist_Result> list = new List<Messagegrouplist_Result>();
            list = db.Messagegrouplist(firmid, userid, roleid).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                Messagegrouplist_Result newItem = new Messagegrouplist_Result();
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case dashboard list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="param"></param>
        /// <param name="role"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string CaseListcasedashboard(Guid firmid, string param, string role, string userid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetMattersDetailscasedashboard_Result> list = new List<GetMattersDetailscasedashboard_Result>();
            list = db.GetMattersDetailscasedashboard(firmid, param, Guid.Parse(userid.ToString()), Convert.ToInt16(role), pagenum, pagesize).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetMattersDetailscasedashboard_Result newItem = new GetMattersDetailscasedashboard_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client case list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="clientid"></param>
        /// <param name="role"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string CaseListbyClientRowId(Guid firmid, string clientid, string role, string userid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetMattersDetailbyClientrowid_Result> list = new List<GetMattersDetailbyClientrowid_Result>();
            list = db.GetMattersDetailbyClientrowid(firmid, clientid, Guid.Parse(userid.ToString()), Convert.ToInt16(role), pagenum, pagesize).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetMattersDetailbyClientrowid_Result newItem = new GetMattersDetailbyClientrowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }

            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client case list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="clientid"></param>
        /// <param name="role"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string CaseListbyClientId(Guid firmid, string clientid, string role, string userid)
        {
            var db = new LawPracticeEntities();
            List<GetMattersDetailbyClientid_Result> list = new List<GetMattersDetailbyClientid_Result>();
            list = db.GetMattersDetailbyClientid(firmid, clientid, Guid.Parse(userid.ToString()), Convert.ToInt16(role)).ToList();
            foreach (var data in list.ToList())
            {
                GetMattersDetailbyClientid_Result newItem = new GetMattersDetailbyClientid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get single message group
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="groupid"></param>
        /// <returns></returns>
        public string SingleMessageGroup(Guid firmid, Guid userid, string groupid)
        {
            var db = new LawPracticeEntities();
            var countlist = db.SingleMessageGroup(firmid, userid, groupid);
            var a = JsonConvert.SerializeObject(countlist);
            return a;
        }
        /// <summary>
        /// Remove message group
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string removemessagegroup(string firmid, string userid, string id)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Deletemessagegroup(firmid.ToString(), userid.ToString(), id.ToString());
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(id), "MessageGroup", Guid.Parse(firmid));
            db.SaveChanges();
            return a;
        }
        /// <summary>
        /// Save custom activity details
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        /// <param name="userlist"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>
        /// <param name="Filenames"></param>
        /// <param name="userid"></param>
        public void savecustomactivitydata(SaveCustomActivityData fm, string firmid, string userlist, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string Filenames, string userid)
        {
            var db = new LawPracticeEntities();
            var taskbyusername = db.RegUsers.Where(x => x.LoginId.ToString() == userid.ToString()).Select(z => new { z.cfname }).FirstOrDefault();
            SaveCustomActivityData cf = new SaveCustomActivityData();
            CustomActivityColMap cm = new CustomActivityColMap();
            cf.Userid = fm.Userid;
            cf.date_time = DateTime.Now;
            cf.col1 = fm.col1;
            cf.col2 = fm.col2;
            cf.col3 = fm.col3;
            cf.col4 = fm.col4;
            cf.col5 = fm.col5;
            cf.col6 = fm.col6;
            cf.col7 = fm.col7;
            cf.col8 = fm.col8;
            cf.col9 = fm.col9;
            cf.col10 = fm.col10;
            cf.col11 = fm.col11;
            cf.col12 = fm.col12;
            cf.col13 = fm.col13;
            cf.col14 = fm.col14;
            cf.col15 = fm.col15;
            cf.Firmid = Guid.Parse(firmid.ToString());
            cf.formId = fm.formId;
            cf.subject = fm.subject;
            cf.caseid = fm.caseid;
            db.SaveCustomActivityDatas.Add(cf);
            db.SaveChanges();
            var fileid = cf.cid;
            var fl = new CustomActivityFileMap();
            if (Filenames != null)
            {
                fl.Fileid = fileid;
                fl.Filenames = Filenames;
                fl.Firmid = fm.Firmid;
                ///  fl.formid = 6;
                fl.fdatetime = DateTime.Now;
                fl.userid = fm.Userid;
                db.CustomActivityFileMaps.Add(fl);
                db.SaveChanges();
            }
            //save in maptable
            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.cid;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                    cm.Sequence = 1;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                    cm.Sequence = 2;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                    cm.Sequence = 3;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                    cm.Sequence = 4;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                    cm.Sequence = 5;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                    cm.Sequence = 6;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                    cm.Sequence = 7;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                    cm.Sequence = 8;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                    cm.Sequence = 9;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                    cm.Sequence = 10;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                    cm.Sequence = 11;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                    cm.Sequence = 12;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                    cm.Sequence = 13;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                    cm.Sequence = 14;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                    cm.Sequence = 15;
                }
                cm.Firmid = Guid.Parse(firmid);
                cm.formid = fm.formId;
                db.CustomActivityColMaps.Add(cm);
                db.SaveChanges();
            }
            var um = new CustomActivityUserMap();
            var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
            foreach (var item1 in eachId1)
            {
                um.auserid = Guid.Parse(item1);
                um.rowid = fileid;
                um.Firmid = fm.Firmid;
                um.date_time = DateTime.Now;
                um.userid = fm.Userid;
                db.CustomActivityUserMaps.Add(um);
                db.SaveChanges();
            }
            try
            {
                foreach (var item1 in eachId1)
                {
                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == item1.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users
                    tbl_notification tn = new tbl_notification();
                    tn.date_time = fm.date_time;
                    tn.Firmid = fm.Firmid;
                    tn.userid = fm.Userid;
                    tn.auser = Guid.Parse(item1);
                    tn.ntype = "cactivity";
                    tn.status = 0;
                    if (usertype.RoleId.ToString() == "1")
                    {
                        tn.urllink = "/Firm/EventSingleView/" + fileid;
                    }
                    else if (usertype.RoleId.ToString() == "2")
                    {
                        tn.urllink = "/Employee/EventSingleView/" + fileid;
                    }
                    else if (usertype.RoleId.ToString() == "3")
                    {
                        tn.urllink = "/Firm/EventSingleView/" + fileid;
                    }
                    tn.notification = "You have new custom activity";
                    tn.typeid = fileid;
                    db.tbl_notification.Add(tn);
                    db.SaveChanges();
                }
            }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
            catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
            {
            }
        }
        /// <summary>
        /// Edit custom activity details
        /// </summary>
        /// <param name="fm"></param>
        /// <param name="firmid"></param>
        /// <param name="userlist"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>
        /// <param name="Filenames"></param>
        /// <param name="userid"></param>
        public void editcustomactivitydata(SaveCustomActivityData fm, string firmid, string userlist, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string Filenames, string userid)
        {
            var db = new LawPracticeEntities();
            var taskbyusername = db.RegUsers.Where(x => x.LoginId.ToString() == userid.ToString()).Select(z => new { z.cfname }).FirstOrDefault();
            CustomActivityColMap cm = new CustomActivityColMap();
            SaveCustomActivityData cf = db.SaveCustomActivityDatas.Where(x => x.cid == fm.cid && x.formId == fm.formId && x.Firmid == fm.Firmid).FirstOrDefault();
            // SaveCustomActivityData cf = new SaveCustomActivityData();
            if (cf != null)
            {
                cf.Userid = fm.Userid;
                cf.date_time = DateTime.Now;
                cf.col1 = fm.col1;
                cf.col2 = fm.col2;
                cf.col3 = fm.col3;
                cf.col4 = fm.col4;
                cf.col5 = fm.col5;
                cf.col6 = fm.col6;
                cf.col7 = fm.col7;
                cf.col8 = fm.col8;
                cf.col9 = fm.col9;
                cf.col10 = fm.col10;
                cf.col11 = fm.col11;
                cf.col12 = fm.col12;
                cf.col13 = fm.col13;
                cf.col14 = fm.col14;
                cf.col15 = fm.col15;
                cf.Firmid = Guid.Parse(firmid.ToString());
                cf.formId = fm.formId;
                cf.subject = fm.subject;
                cf.caseid = fm.caseid;
                cf.iupdate = 1;
                db.Entry(cf).State = EntityState.Modified;
                db.SaveChanges();
            }
            if (Filenames != null)
            {
                var chkfile = db.CustomActivityFileMaps.Where(x => x.Fileid == cf.cid && x.Firmid == cf.Firmid).FirstOrDefault();
                if (chkfile == null)
                {
                    var fileid = cf.cid;
                    var fl = new CustomActivityFileMap();
                    fl.Fileid = fileid;
                    fl.Filenames = Filenames;
                    fl.Firmid = fm.Firmid;
                    ///  fl.formid = 6;
                    fl.fdatetime = DateTime.Now;
                    fl.userid = fm.Userid;
                    db.CustomActivityFileMaps.Add(fl);
                    db.SaveChanges();
                }
                else
                {
                    CustomActivityFileMap cf1 = db.CustomActivityFileMaps.Where(x => x.Fileid == fm.cid && x.Firmid == fm.Firmid).FirstOrDefault();
                    if (cf1 != null)
                    {
                        cf1.Fileid = fm.cid;
                        cf1.Filenames = Filenames;
                        cf1.Firmid = fm.Firmid;
                        ///  fl.formid = 6;
                        cf1.fdatetime = DateTime.Now;
                        cf1.userid = fm.Userid;
                        cf1.iupdate = 1;
                        db.Entry(cf1).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
            }
            var um = new CustomActivityUserMap();
            var eachId1 = userlist.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
            foreach (var item1 in eachId1)
            {
                var chkuser = db.CustomActivityUserMaps.Where(x => x.rowid == cf.cid && x.Firmid == cf.Firmid && x.auserid.ToString() == item1.ToString()).FirstOrDefault();
                if (chkuser == null)
                {
                    um.auserid = Guid.Parse(item1);
                    um.rowid = cf.cid;
                    um.Firmid = fm.Firmid;
                    um.date_time = DateTime.Now;
                    um.userid = fm.Userid;
                    db.CustomActivityUserMaps.Add(um);
                    db.SaveChanges();
                }
            }
            //delete not in rows
            var entryuser = db.GetDeleteCustomActivityUser(firmid, cf.cid.ToString(), userlist.ToString()).ToList();
            if (entryuser.Count > 0)
            {
                foreach (var itemp in entryuser)
                {
                    db.insertdeleteentrytable(Guid.Parse(itemp.Value.ToString()), "CustomActivityUserMap", Guid.Parse(firmid));
                }
                db.deleteCustomActivityUser(cf.Firmid.ToString(), cf.cid.ToString(), userlist);
            }
        }
        /// <summary>
        /// Save case notes
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="notes"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string Savecasenotes(string firmid, string userid, string notes, string caseid)
        {
            var db = new LawPracticeEntities();
            var count = db.savecasenote(firmid, userid, caseid, notes);
            return count.ToString();
        }
        /// <summary>
        /// File sync request
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="syncflag"></param>
        /// <returns></returns>
        public string filesyncRequest(string typeIds, string firmid, string userid, string roleid, string syncflag)
        {
            var db = new LawPracticeEntities();
            var count = db.SavefilesyncRequest(firmid, userid, Convert.ToInt32(roleid), typeIds);
            return count.ToString();
        }
        /// <summary>
        /// Cloud file sync request
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="syncflag"></param>
        /// <returns></returns>
        public string filesyncRequestCloud(string typeIds, string firmid, string userid, string roleid, string syncflag)
        {
            var db = new LawPracticeEntities();
            var count = db.SavefilesyncRequestCloud(firmid, userid, Convert.ToInt32(roleid), typeIds);
            try
            {
                string s = typeIds;
                string[] values = s.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    var valuesdata = values[i].Remove(values[i].Length - 2);
                    //get file details
                    var filedetails = db.usp_GetViewFilesCloudById(Guid.Parse(firmid), valuesdata).FirstOrDefault();
                    if (filedetails != null)
                    {
                        if (filedetails.IsSync != 1)
                        {
                            string notification = "You have Marked a file for Sync(" + filedetails.fname + ")";
                            db.usp_AddActivity(firmid, userid, notification, "Share File", null, valuesdata);
                        }
                    }
                }
            }
            catch
            {
            }
            return count.ToString();
        }
        /// <summary>
        /// Save short note
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="usertypes"></param>
        /// <param name="clientid"></param>
        /// <param name="casename"></param>
        /// <param name="caseno"></param>
        /// <param name="clientcontact"></param>
        /// <param name="casetype"></param>
        /// <param name="auserid"></param>
        /// <param name="details"></param>
        /// <param name="username"></param>
        /// <param name="confirmPassword"></param>
        /// <param name="checkclient"></param>
        /// <param name="files"></param>
        /// <param name="odates"></param>
        /// <param name="creatorroleid"></param>
        /// <param name="companyId"></param>
        /// <param name="assignuser"></param>
        /// <returns></returns>
        public string SaveShortCase(string firmid, string userid, string usertypes, string clientid, string casename, string caseno, string clientcontact, string casetype, string auserid, string details, string username, string confirmPassword, string checkclient, string files, string odates, string creatorroleid, string companyId, string assignuser, string courtname, string othercourtname)
        {
            var returncaseid = "";
            var db = new LawPracticeEntities();
            if (checkclient.ToString() == "1")
            {
                //if already exist client
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //insert into add case
                        string id = "";
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var cnt = db.Usp_SaveShortcase(firmid, userid, casename, caseno, auserid, details, clientid, casetype, odates, IDParameter1, companyId, usertypes, courtname, othercourtname);
                        id = Convert.ToString(IDParameter1.Value);
                        returncaseid = id;
                        if (!String.IsNullOrEmpty(assignuser))
                        {
                            string[] values = assignuser.Split(',');
                            for (int i = 0; i < values.Length; i++)
                            {
                                values[i] = values[i].Trim();
                                string strusername = ConfigurationManager.AppSettings["matteridname"];
                                //add in casewatch
                                var auser = values[i];
                                if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                }
                                else
                                {
                                    //For Assigning Case To selef
                                    if (creatorroleid == "2")
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, userid, 0);
                                    }
                                    var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                    if (checkroles1 != null)
                                    {
                                        if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                            var parentpartner = checkroles1.PartnerId;
                                            //send request to partner for this user
                                            var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                        }
                                        else
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                        }
                                    }
                                }
                                //}
                            }
                        }
                        if (cnt > 0)
                        {
                            //map  users
                            if (!String.IsNullOrEmpty(auserid))
                            {
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    if (creatorroleid == "1" || auserid.ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, id, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (usertypes == "company")
                        {
                            //map external users
                            if (!String.IsNullOrEmpty(clientcontact))
                            {
                                var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, clientcontact);
                            }
                        }
                        transaction.Commit();
                        try
                        {
                            var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, auserid, creatorroleid, casename, id);
                        }
                        catch
                        {
                        }
                        return returncaseid.ToString();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString();
                    }
                }
            }
            else
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var caseclientid = "";
                        var newclientid = "";
#pragma warning disable CS0219 // The variable 'caseclientcontact' is assigned but its value is never used
                        var caseclientcontact = "";
#pragma warning restore CS0219 // The variable 'caseclientcontact' is assigned but its value is never used
                        //convert to client
                        var cpassword = QueryAES.GetHashedCode(confirmPassword);
                        cpassword = cpassword.Replace("\n", "");
                        var cDefaultController = "Client";
                        var DefaultAction = "dashboard";
                        //check company or users
                        if (newclientid == "")
                        {
                            newclientid = "00000000-0000-0000-0000-000000000000";
                        }
                        if (usertypes == "company")
                        {
                            if (companyId == "")
                            {
                                companyId = "00000000-0000-0000-0000-000000000000";
                            }
                            if (clientid != "00000000-0000-0000-0000-000000000000")
                            {
                                // get teamlead data for create client
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientcontact).FirstOrDefault();
                                //convert all contacts to client
                                if (getusersdata != null)
                                {
                                    var listofcompanyuser = db.usp_loadcompanycontacts(firmid, getusersdata.CompanyId).ToList();
                                    if (listofcompanyuser != null)
                                    {
                                        foreach (var data in listofcompanyuser)
                                        {
                                            if (String.IsNullOrEmpty(data.LoginId))
                                            {
                                                var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, data.cid.ToString()).FirstOrDefault();
                                                var cfname = getusersdata1.fname + " " + getusersdata1.mname + " " + getusersdata1.lname;
                                                string uemail = getusersdata1.cemail;
                                                string mobile = getusersdata1.mobno;
                                                string Designation = getusersdata1.Designation;
                                                string landline = getusersdata1.offno;
                                                string address = getusersdata1.cadd1;
                                                ObjectParameter IDParameter2;
                                                IDParameter2 = new ObjectParameter("id", newclientid);
                                                var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata1.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, clientid);
                                                newclientid = Convert.ToString(IDParameter2.Value);
                                                if (clientcontact.ToLower().ToString() == data.cid.ToString())
                                                {
                                                    caseclientid = newclientid;
                                                }
                                                if (rs2 > 0)
                                                {
                                                    //insert in regusers
                                                    var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata1.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, data.cid.ToString(), getusersdata1.fname, getusersdata1.mname, getusersdata1.lname, getusersdata1.Pin, null);
                                                    //update type in contact
                                                    var chkt = db.usp_updateContactsProfiletypeToClient(firmid, getusersdata1.loguser.ToString(), data.cid.ToString());
                                                }
                                            }
                                            else
                                            {
                                                //check if already client
                                                if (clientcontact.ToLower().ToString() == data.cid.ToString())
                                                {
                                                    caseclientid = data.LoginId;
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                }
                            }
                            if (caseclientid == "" || caseclientid == null)
                            {
                                caseclientid = "00000000-0000-0000-0000-000000000000";
                            }
                            //insert into add case
                            string id = "";
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var cnt = db.Usp_SaveShortcase(firmid, userid, casename, caseno, auserid, details, caseclientid, casetype, odates, IDParameter1, companyId, usertypes, courtname, othercourtname);
                            id = Convert.ToString(IDParameter1.Value);
                            returncaseid = id;
                            ////assign user
                            if (!String.IsNullOrEmpty(assignuser))
                            {
                                string[] values = assignuser.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                                    //add in casewatch
                                    var auser = values[i];
                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                    //}
                                }
                            }
                            if (cnt > 0)
                            {
                                //map  users
                                //checkroleid 
                                //map external users
                                if (!String.IsNullOrEmpty(clientcontact))
                                {
                                    var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, clientcontact);
                                }
                            }
                            if (!String.IsNullOrEmpty(auserid))
                            {
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    if (creatorroleid == "1" || auserid.ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, id, "12", null, null, null);
                                            }
                                            else
                                            {
                                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                                {
                                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            transaction.Commit();
                            if (cnt > 0)
                            {
                                try
                                {
                                    var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, auserid, creatorroleid, casename, id);
                                }
                                catch
                                {
                                }
                            }
                            return returncaseid.ToString();
                        }
                        else
                        {
                            //get userdata data for create client 
                            string uemail = "";
                            string mobile = "";
                            string Designation = "";
                            string landline = "";
                            string address = "";
                            if (clientid != "00000000-0000-0000-0000-000000000000")
                            {
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientid).FirstOrDefault();
                                if (getusersdata != null)
                                {
                                    var cfname = getusersdata.fname + " " + getusersdata.mname + " " + getusersdata.lname;
                                    uemail = getusersdata.cemail;
                                    mobile = getusersdata.mobno;
                                    Designation = getusersdata.Designation;
                                    landline = getusersdata.offno;
                                    address = getusersdata.cadd1;
                                    //save into firmusers
                                    ObjectParameter IDParameter2;
                                    IDParameter2 = new ObjectParameter("id", newclientid);
                                    var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, Guid.Empty.ToString());
                                    newclientid = Convert.ToString(IDParameter2.Value);
                                    if (rs2 > 0)
                                    {
                                        //insert in regusers
                                        var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, getusersdata.cid, getusersdata.fname, getusersdata.mname, getusersdata.lname, getusersdata.Pin, null);
                                    }
                                }
                            }
                            //insert into add case
                            string id = "";
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var cnt = db.Usp_SaveShortcase(firmid, userid, casename, caseno, auserid, details, newclientid, casetype, odates, IDParameter1, companyId, usertypes, courtname, othercourtname);
                            id = Convert.ToString(IDParameter1.Value);
                            returncaseid = id;
                            ////assign user
                            if (!String.IsNullOrEmpty(assignuser))
                            {
                                string[] values = assignuser.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                                    //add in casewatch
                                    var auser = values[i];
                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                    //}
                                }
                            }
                            //save notoficateion
                            try
                            {
                                //team lead
                                var dataac = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, auserid, casename);
                                //rm of user
                                var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                                if (getcaseuser != null)
                                {
                                    if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                    {
                                        var dataacq = Notification.SaveNotifications("AddTeamLead", null, firmid, userid, getcaseuser.ReportManager.ToString(), casename);
                                    }
                                }
                                //client contact
                                if (!String.IsNullOrEmpty(clientcontact))
                                {
                                    var dataac1 = Notification.SaveNotifications("AddClientContact", null, firmid, userid, auserid, id);
                                }
                            }
                            catch
                            {
                            }
                            if (cnt > 0)
                            {
                                //map  users
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                }
                                //update status of contacts profiletype
                                var chkt = db.usp_updateContactsProfiletypeToClient(firmid, userid, clientid);
                            }
                            transaction.Commit();
                            return returncaseid.ToString();
                        }
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString();
                    }
                }
            }
        }
        /// <summary>
        /// Add direct case in casewatch
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="divSCHCDistrict"></param>
        /// <param name="drpcourtname"></param>
        /// <param name="drpdistrictcourtname"></param>
        /// <param name="drpdistrictcourtfullname"></param>
        /// <param name="drpdcourtcnr"></param>
        /// <param name="obj"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="apiurl"></param>
        /// <param name="caseinfo"></param>
        /// <param name="matterid"></param>
        /// <returns></returns>
        public string DirectAddCaseToCW(string firmid, string userid, string divSCHCDistrict, string drpcourtname, 
            string drpdistrictcourtname, string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, 
            string useremail, string usermobile, string apiurl, string caseinfo, string matterid, int CWUser, string CWUserId)
        {
            var db = new LawPracticeEntities();
            var caseid = "";
            // if already exist client
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    if (matterid == "")
                    {
                        matterid = "00000000-0000-0000-0000-000000000000";
                    }
                    var ds = "false";
                    var datastatus = "";
                    //save to casewatch
                    if (drpcourtname.ToString() == "" || drpcourtname.ToString() == null || drpcourtname.ToString() == "null")
                    {
                        transaction.Commit();
                        return caseid.ToString();
                    }
                    else
                    {
                        if (String.IsNullOrEmpty(drpdcourtcnr))
                        {
                            if (divSCHCDistrict.ToString() == "5")// for append court
                            {
                                ds = AddCaseCaseWatch.InsertCaseDetailNewAppendCourt_1(obj, 0, useremail, usermobile, firmid, userid, apiurl, matterid, CWUser, CWUserId);
                            }
                            else if (divSCHCDistrict.ToString() == "6")// for Revenue court
                            {
                                ds = RevenueCase.AddRevenueCase_1(firmid, userid, useremail, usermobile, obj.Username, obj.Casetype, obj.Caseno, obj.Caseyear, obj.RevenueCourt, 
                                    obj.RevenueMandal, obj.RevenueJanpad, obj.RevenueTahsil, obj.RevenueCourtName, obj.RefNo, matterid, CWUser, CWUserId);
                            }
                            else if (divSCHCDistrict.ToString() == "7")// for Rera court
                            {
                                ds = AddCaseCaseWatch.AddReraCase_1(firmid, userid, useremail, usermobile, obj.Username, obj.ReraCourt, obj.Reracasetype, 
                                    obj.Reracasno, obj.Reracaseyear, obj.ReraRefNo, apiurl, matterid, CWUser, CWUserId);
                            }
                            else
                            {
                                if (divSCHCDistrict.ToString() != "3")
                                {
                                    if (drpcourtname.ToString() != "0")//For highCourt,Supreme court,Tribunals Addition
                                    {
                                        ds = AddCaseCaseWatch.InsertCaseDetailNew_1(obj, 0, useremail, usermobile, firmid, userid, apiurl, matterid, CWUser, CWUserId);
                                    }
                                }
                                else//For District court Addition
                                {
                                    if (divSCHCDistrict.ToString() == "3")
                                    {
                                        ds = AddCaseCaseWatch.InsertCaseDetailNew_1(obj, 1, useremail, usermobile, firmid, userid, apiurl, matterid, CWUser, CWUserId);
                                    }
                                }
                            }
                            if (ds == "false")
                            {
                                datastatus = "emailexist";
                            }
                            else
                            {
                                if (divSCHCDistrict.ToString() == "6")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string Newcaseid = data1.usercaseid;
                                    string dbmessage = data1.data;
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed"; 
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 1, 0);
                                        //try
                                        //{
                                        //    if (divSCHCDistrict.ToString() != "6")// for Revenue court
                                        //    {
                                        //        var result = AddCaseCaseWatch.UploadNotesByCaseId(Newcaseid.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl, CWUser, CWUserId);
                                        //    }
                                        //}

                                        //catch (Exception e)
                                        //{
                                        //}
                                        datastatus = "true";
                                    }
                                }
                                //for Rera court
                                else if (divSCHCDistrict.ToString() == "7")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string Newcaseid = data1.usercaseid;
                                    string dbmessage = data1.data;
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed"; 
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        // var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 0, 0);
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 0, 1);
                                        datastatus = "true";
                                        //try
                                        //{
                                        //    if (divSCHCDistrict.ToString() == "7")// for Rera court
                                        //    {
                                        //        var result = AddCaseCaseWatch.ReraUploadNotesByCaseId(Newcaseid.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl);
                                        //    }
                                        //}
                                        //catch (Exception e)
                                        //{
                                        //}
                                    }
                                }
                                else if (divSCHCDistrict.ToString() == "5")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string dbstatus = "";
                                    string dbmessage = "";
                                    if (Message1.ToString() == "Sorry! Unable to Add now.")
                                    {
                                        datastatus = Message1.ToString();
                                        transaction.Rollback();
                                        return "datastatus";
                                    }
                                    else
                                    {
                                        //dbstatus = data1.Status;
                                        //dbmessage = data1.data;
                                        try
                                        {
                                            dbstatus = data1.data[0].dbStatus;
                                            dbmessage = data1.data[0].dbMessage;
                                        }
                                        catch
                                        {
                                            dbstatus = data1.caseid;
                                            dbmessage = data1.data;
                                        }
                                    }
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        var ctss = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 0, 0);
                                        //save search by party name cass in db
                                        var ctt1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, caseinfo, obj.Caseno, obj.Casetype, obj.Caseyear, obj.Court);

                                        //for Adding the Notes Details
                                       // var result = AddCaseCaseWatch.UploadNotesByCaseId(dbstatus.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl, CWUser, CWUserId);
                                        datastatus = "true";
                                    }
                                }
                                else
                                {
                                    // add district cnr
                                    if (divSCHCDistrict.ToString() == "3" || divSCHCDistrict.ToString() == "2")
                                    {
                                        dynamic data2 = JObject.Parse(ds);
                                        string dbcaseid = data2.caseid;
                                        var usernameids = userid;
                                        if (!String.IsNullOrEmpty(drpdcourtcnr))
                                        {
                                            // ds = AddCaseCaseWatch.InsertDistrictCNR(firmid, usernameids, dbcaseid, drpdcourtcnr, apiurl, useremail, usermobile, obj.Username);
                                            ds = AddCaseCaseWatch.InsertDistrictCNR_1(firmid, usernameids, dbcaseid, drpdcourtcnr, apiurl, useremail, 
                                                usermobile, obj.Username, matterid, CWUser, CWUserId);
                                        }
                                    }
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string dbstatus = "";
                                    string dbmessage = "";
                                    if (Message1.ToString() == "Sorry! Unable to Add now.")
                                    {
                                        datastatus = Message1.ToString();
                                        transaction.Rollback();
                                        return "datastatus";
                                    }
                                    else
                                    {
                                        try
                                        {
                                            dbstatus = data1.data[0].dbStatus;
                                            dbmessage = data1.data[0].dbMessage;
                                        }
                                        catch
                                        {
                                            dbstatus = data1.caseid;
                                            dbmessage = data1.data;
                                        }
                                    }
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 0, 0);
                                        //save search by party name cass in db
                                        var ct1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, caseinfo, obj.Caseno, obj.Casetype, obj.Caseyear, obj.Court);

                                        //for Adding the Notes Details
                                        //var result = AddCaseCaseWatch.UploadNotesByCaseId(dbstatus.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl, CWUser, CWUserId);
                                        datastatus = "true";
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "livecaselimitexceed";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (divSCHCDistrict.ToString() == "3" || divSCHCDistrict.ToString() == "2")
                            {
                                var usernameids = userid;
                                if (!String.IsNullOrEmpty(drpdcourtcnr))
                                {
                                    ds = AddCaseCaseWatch.InsertDistrictCNR_1(firmid, usernameids, matterid, drpdcourtcnr, apiurl, useremail, usermobile, 
                                        obj.Username, matterid, CWUser, CWUserId);
                                }
                            }
                            if (ds == "false")
                            {
                                datastatus = "emailexist";
                            }
                            else
                            {
                                dynamic data1 = JObject.Parse(ds);
                                string status1 = data1.Status;
                                string Message1 = data1.Message;
                                string dbmessage = "";
                                if (Message1.ToString() == "Sorry! Unable to Add now.")
                                {
                                    datastatus = Message1.ToString();
                                    transaction.Rollback();
                                    return "datastatus";
                                }
                                else
                                {
                                    try
                                    {
                                        //dbstatus = data1.data[0].dbStatus;
                                        datastatus = data1.data[0].dbStatus.ToString();
                                        dbmessage = data1.data[0].dbMessage;
                                    }
                                    catch
                                    {
                                        datastatus = data1.caseid;
                                        dbmessage = data1.data;
                                    }
                                }
                                if (dbmessage.ToString() == "Exist")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = "false";
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = "livecaselimitexceed";
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = dbmessage.ToString();
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                {
                                    var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(datastatus), matterid, userid, 0, 0);
                                    //insert cnr in mykase map table
                                    var insertusermap = db.usp_savecaselinkentry(firmid, matterid, drpdcourtcnr, userid);
                                    try
                                    {
                                        if (drpdistrictcourtname == "null")
                                        {
                                            drpdistrictcourtname = "";
                                        }
                                        if (!String.IsNullOrEmpty(drpdistrictcourtname))
                                        {
                                            Tbl_CaseDistrict tbl1 = new Tbl_CaseDistrict();
                                            tbl1.caseId = Guid.Parse(matterid);
                                            tbl1.Firmid = Guid.Parse(firmid);
                                            tbl1.Userid = Guid.Parse(userid);
                                            tbl1.districtid = drpdistrictcourtname.ToString();
                                            tbl1.districtname = drpdistrictcourtfullname.ToString();
                                            tbl1.date_time = DateTime.Now;
                                            var rslt = db.usp_savecasedistrict(tbl1.Firmid.ToString(), tbl1.Userid.ToString(), tbl1.caseId.ToString(), tbl1.districtid.ToString(), tbl1.districtname.ToString());
                                        }
                                    }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                                    catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                                    {
                                    }
                                    datastatus = "true";
                                }
                            }
                        }
                        transaction.Commit();
                        return "success";
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Save full screan matter details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="usertypes"></param>
        /// <param name="clientid"></param>
        /// <param name="casename"></param>
        /// <param name="casetype"></param>
        /// <param name="caseclientcontact"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
           public string SaveFullScreenCase(string firmid, string userid, string usertypes, string clientid, string casename, string casetype, string caseclientcontact, 
            string casedetails, string casenotes, string court, string othercourt, string casestatus, string caseodate, string casenumber, string casecdate, 
            string caseteamlead, string casecnr, string username, string casesidepassword, string clientto, string assignto, string sollist, string checkclient, 
            string files, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, 
            string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string mcol1, string mcol2, string mcol3, string mcol4, 
            string mcol5, string mcol6, string mcol7, string mcol8, string mcol9, string mcol10, string mcol11, string mcol12, string mcol13, string mcol14, 
            string mcol15, string ftype, AddCaseObject1 obj, int flag, string useremail, string usermobile, string apiurl, string clientno,
            string MatterType, string PoliceStation, string Firno, string CertifiedCopyAppliedon, string CertifiedCopyReceivedon, string ValuationofSuit,
            string Courtfee, string OppositePartyCounselname, string OppositePartyCounselemail, string OppositePartyCounselphone, string CasenumberInternal,
            string IsCourtFeePaid, string SubjectType,DateTime casefilingcdate, DateTime submitDate, DateTime returnDate, string ePartyName,
            string ePartyFatherName, string ePartyAddress, string ePartyAdharCardNo, string ePartyGender,
           string ePartyDateOfBirth, string ePartyNationality, string ePartyMobileNo, string ePartyEmail, string creatorroleid,
           string fmatterType, string txtMatterOther, string DisputeMatterType, string fcompanystructure, string DisposeOption,
           string NotesCasedetail, string otherpartyFname, string otherpartyEMail, string otherpartyPhone, string otherpartyType)
           {
            if(caseclientcontact =="")
            {
                caseclientcontact = null;
            }
            if(fcompanystructure=="")
            {
                fcompanystructure = null;

            }

            var db = new LawPracticeEntities();
            var caseid = "";
            if (checkclient.ToString() == "1")
            {

                // if already exist client

                using (var transaction = db.Database.BeginTransaction())
                {

                    try
                    {
                        var companyIds = "";
                        //insert into add case
                        string id = "";
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var cnt = db.Usp_SaveFullCase(firmid, userid, casename, casenumber, caseteamlead, casedetails, court, othercourt, casestatus, casecnr, caseodate, casecdate, casenotes, clientid, casetype, IDParameter1, mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, mcol12, mcol13, mcol14, mcol15, clientno,
                            MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit, Courtfee,
                            OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                            IsCourtFeePaid, SubjectType, fmatterType, fcompanystructure, companyIds, DisposeOption,usertypes);
                        id = Convert.ToString(IDParameter1.Value);
                        caseid = id;
                        if (cnt > 0)
                        {

                            // save case filling date/ extra party info
                            if (casefilingcdate.Year != 1900)
                            {
                                var casefilingcdatersult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, casefilingcdate, null);
                            }

                            List<sp_GetCaseFilingDateTemp_Result> list = new List<sp_GetCaseFilingDateTemp_Result>();
                            list = db.sp_GetCaseFilingDateTemp(firmid, userid).ToList();

                            if (list.Count > 0)
                            {
                                for (int i = 0; i < list.Count; i++)
                                {
                                    DateTime esubmitDate = Convert.ToDateTime(list[i].SubmitDate);
                                    DateTime ereturnDate = Convert.ToDateTime(list[i].ReturnDate);
                                    if (esubmitDate.Year != 1900)
                                    {
                                        var caserefillingrsult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, esubmitDate, ereturnDate);
                                    }
                                }
                                db.sp_DeleteCaseFilingDateTemp(null, firmid, userid, 1);
                            }
                            //List<sp_GetMatterTypeTemp_Result> list1 = new List<sp_GetMatterTypeTemp_Result>();
                            //list1 = db.sp_GetMatterTypeTemp(firmid, userid).ToList();

                            //if (list1.Count > 0)
                            //{
                            //    for (int i = 0; i < list1.Count; i++)
                            //    {
                            //        var name = list1[i].Name;
                            //        var Email = list1[i].Email;
                            //        var phone = list1[i].Phone;
                            //        var type = list1[i].Type;


                            //        var caserefillingrsult = db.sp_SaveMatterTypeDetails(null, firmid, userid, caseid, name, Email, phone, type, null);

                            //    }
                            //    db.sp_DeleteMatterTypeDetailsTemp(null, firmid, userid, 1);
                            //}
                            //For Other Party Deatils
                            if (!String.IsNullOrEmpty(otherpartyFname))
                            {
                                var caserefillingrsult = db.sp_SaveMatterTypeDetails(null, firmid, userid, caseid, otherpartyFname, otherpartyEMail, otherpartyPhone, otherpartyType, null);
                            }
                            if (!string.IsNullOrEmpty(ePartyName))
                            {
                                var extrapartyresult = db.sp_SaveCaseExternalParty(null, firmid, userid, caseid, ePartyName, ePartyFatherName, ePartyAddress, ePartyAdharCardNo, ePartyGender,
                                   ePartyDateOfBirth, ePartyNationality, ePartyMobileNo, ePartyEmail, null, null, null);
                            }

                            //sagar
                            if (MatterType == "46")
                            {
                                var Matterotherresult = db.sp_MatterTypeOther(null, MatterType, txtMatterOther, firmid, userid, caseid, DateTime.Now);
                            }
                            // map column
                            for (int i = 1; i <= sum; i++)
                            {

                                var pid = id;
                                var column_no = "col" + i;
                                var column_name = "";
                                //var st="ccol" + i;
                                if (i == 1)
                                {
                                    var ctxt = ctxt1;
                                    column_name = ctxt;
                                }
                                else if (i == 2)
                                {
                                    var ctxt = ctxt2;
                                    column_name = ctxt;
                                }
                                else if (i == 3)
                                {
                                    var ctxt = ctxt3;
                                    column_name = ctxt;
                                }
                                else if (i == 4)
                                {
                                    var ctxt = ctxt4;
                                    column_name = ctxt;
                                }
                                else if (i == 5)
                                {
                                    var ctxt = ctxt5;
                                    column_name = ctxt;
                                }
                                else if (i == 6)
                                {
                                    var ctxt = ctxt6;
                                    column_name = ctxt;
                                }
                                else if (i == 7)
                                {
                                    var ctxt = ctxt7;
                                    column_name = ctxt;
                                }
                                else if (i == 8)
                                {
                                    var ctxt = ctxt8;
                                    column_name = ctxt;
                                }
                                else if (i == 9)
                                {
                                    var ctxt = ctxt9;
                                    column_name = ctxt;
                                }
                                else if (i == 10)
                                {
                                    var ctxt = ctxt10;
                                    column_name = ctxt;
                                }
                                else if (i == 11)
                                {
                                    var ctxt = ctxt11;
                                    column_name = ctxt;
                                }
                                else if (i == 12)
                                {
                                    var ctxt = ctxt12;
                                    column_name = ctxt;
                                }
                                else if (i == 13)
                                {
                                    var ctxt = ctxt13;
                                    column_name = ctxt;
                                }
                                else if (i == 14)
                                {
                                    var ctxt = ctxt14;
                                    column_name = ctxt;
                                }
                                else if (i == 15)
                                {
                                    var ctxt = ctxt15;
                                    column_name = ctxt;
                                }
                                var formid = Convert.ToInt32(ftype);
                                var inserrcol = db.Usp_SaveCaseColumnMap(firmid, userid, column_no, column_name, pid);
                            }
                            //map  users
                          
                            //map external users
                            if (usertypes == "company")
                            {
                                if (!String.IsNullOrEmpty(caseclientcontact))
                                {
                                    var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, caseclientcontact);

                                }
                                //map multiple users
                                if (!String.IsNullOrEmpty(clientto))
                                {
                                    string[] values1 = clientto.Split(',');
                                    for (int i = 0; i < values1.Length; i++)
                                    {
                                        values1[i] = values1[i].Trim();
                                        if (!String.IsNullOrEmpty(values1[i]))
                                        {
                                            var cnt4 = db.Usp_SaveCaseExternalUser(firmid, userid, id, values1[i]);
                                        }
                                    }
                                }
                            }
                            List<CaseStatute> farmobj = JsonConvert.DeserializeObject<List<CaseStatute>>(sollist);
                            if (farmobj != null)
                            {
                                if (farmobj.Count > 0)
                                {
                                    for (var i = 0; i < farmobj.Count; i++)
                                    {
                                        //insert in a list code
                                        var cnt3 = db.Usp_SaveStatuteofCase(firmid, userid, id, farmobj[i].UserID.ToString(), farmobj[i].StatuteName.ToString(), farmobj[i].LimitDate.ToString(), Convert.ToInt32(farmobj[i].SDay), Convert.ToInt32(farmobj[i].DateSatisfy));
                                    }
                                }
                            }

                        }
                          if (!String.IsNullOrEmpty(assignto))
                          {
                                string[] values = assignto.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                    //For Assigning Case To selef
                                    if (creatorroleid == "2")
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, userid, 0);
                                    }
                                    var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                }
                          }
                            //assign case to team lead
                            if (!String.IsNullOrEmpty(caseteamlead))
                            {
                                if (creatorroleid == "1" || caseteamlead.ToString().ToLower() == userid)
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                    var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                }
                                else
                                {
                                    var checkroles1 = db.usp_GetUserbyId(firmid, caseteamlead).FirstOrDefault();
                                    if (checkroles1 != null)
                                    {
                                        if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 1);
                                            var parentpartner = checkroles1.PartnerId;
                                            //send request to partner for this user
                                            var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                            var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);

                                        }
                                        else
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                            var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);

                                        }
                                    }
                                }

                            }
                            transaction.Commit();
                            try
                            {
                                var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, assignto, creatorroleid, casename, caseid);
                            }
                            catch
                            {

                            }
                           return caseid.ToString();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString();
                    }
                }
            }
            else
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        string id = "";
                        var cnt = 0;
                        var newclientid = "";
                        //convert to client
                        var cpassword = QueryAES.GetHashedCode(casesidepassword);
                        cpassword = cpassword.Replace("\n", "");
                        var cDefaultController = "Client";
                        var DefaultAction = "dashboard";
                        //check company or users
                        if (usertypes == "company")
                        {
                            var caseclientid = "";
                            var companyIds = "";
                           if(companyIds =="")
                            {
                                companyIds = "00000000-0000-0000-0000-000000000000";
                            }
                            // get teamlead data for create client
                            var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, caseclientcontact).FirstOrDefault();
                            if (getusersdata != null)
                            {
                                companyIds = getusersdata.CompanyId;
                                //convert all contacts to client
                                var listofcompanyuser = db.usp_loadcompanycontacts(firmid, getusersdata.CompanyId).ToList();
                                if (listofcompanyuser != null)
                                {
                                    foreach (var data in listofcompanyuser)
                                    {
                                        if (String.IsNullOrEmpty(data.LoginId))
                                        {
                                            var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, data.cid.ToString()).FirstOrDefault();
                                            var cfname = getusersdata1.fname + " " + getusersdata1.mname + " " + getusersdata1.lname;
                                            string uemail = getusersdata1.cemail;
                                            string mobile = getusersdata1.mobno;
                                            string Designation = getusersdata1.Designation;
                                            string landline = getusersdata1.offno;
                                            string address = getusersdata1.cadd1;
                                            ObjectParameter IDParameter2;
                                            IDParameter2 = new ObjectParameter("id", newclientid);
                                            var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata1.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, clientid);
                                            newclientid = Convert.ToString(IDParameter2.Value);
                                            if (caseclientcontact.ToLower().ToString() == data.cid.ToString())
                                            {
                                                caseclientid = newclientid;
                                            }
                                            if (rs2 > 0)
                                            {
                                                //insert in regusers
                                                var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata1.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, data.cid.ToString(), getusersdata1.fname, getusersdata1.mname, getusersdata1.lname, getusersdata1.Pin, null);
                                                //update type in contact
                                                var chkt = db.usp_updateContactsProfiletypeToClient(firmid, getusersdata1.loguser.ToString(), data.cid.ToString());
                                            }
                                        }
                                        else
                                        {
                                            //check if already client
                                            if (caseclientcontact.ToLower().ToString() == data.cid.ToString())
                                            {
                                                caseclientid = data.LoginId;
                                            }
                                        }
                                    }
                                }
                            }

                            if (caseclientid == "" || caseclientid ==null)
                            {
                                caseclientid = "00000000-0000-0000-0000-000000000000";
                            }
                            //insert into add case

                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            cnt = db.Usp_SaveFullCase(firmid, userid, casename, casenumber, caseteamlead, casedetails, court, othercourt, casestatus, casecnr, caseodate, casecdate, casenotes, caseclientid, casetype, IDParameter1, mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, mcol12, mcol13, mcol14, mcol15, clientno,
                                MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit, Courtfee,
                           OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                           IsCourtFeePaid, SubjectType, fmatterType, fcompanystructure, companyIds, DisposeOption,usertypes);
                            id = Convert.ToString(IDParameter1.Value);
                            caseid = id;

                            //sagar
                            if (MatterType == "46")
                            {
                                var Matterotherresult = db.sp_MatterTypeOther(null, MatterType, txtMatterOther, firmid, userid, caseid, DateTime.Now);
                            }


                            if (cnt > 0)
                            {
                                // save case filling date/ extra party info
                                if (casefilingcdate.Year != 1900)
                                {
                                    var casefilingcdatersult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, casefilingcdate, null);
                                }
                                List<sp_GetCaseFilingDateTemp_Result> list = new List<sp_GetCaseFilingDateTemp_Result>();
                                list = db.sp_GetCaseFilingDateTemp(firmid, userid).ToList();

                                if (list.Count > 0)
                                {
                                    for (int i = 0; i < list.Count; i++)
                                    {
                                        DateTime esubmitDate = Convert.ToDateTime(list[i].SubmitDate);
                                        DateTime ereturnDate = Convert.ToDateTime(list[i].ReturnDate);
                                        if (esubmitDate.Year != 1900)
                                        {
                                            var caserefillingrsult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, esubmitDate, ereturnDate);
                                        }
                                    }
                                    db.sp_DeleteCaseFilingDateTemp(null, firmid, userid, 1);
                                }


                                List<sp_GetMatterTypeTemp_Result> list1 = new List<sp_GetMatterTypeTemp_Result>();
                                list1 = db.sp_GetMatterTypeTemp(firmid, userid).ToList();

                                if (list1.Count > 0)
                                {
                                    for (int i = 0; i < list1.Count; i++)
                                    {
                                        var name = list1[i].Name;
                                        var Email = list1[i].Email;
                                        var phone = list1[i].Phone;
                                        var type = list1[i].Type;
                                        var caserefillingrsult = db.sp_SaveMatterTypeDetails(null, firmid, userid, caseid, name, Email, phone, type, null);
                                    }
                                    db.sp_DeleteMatterTypeDetailsTemp(null, firmid, userid, 1);
                                }
                                if (!string.IsNullOrEmpty(ePartyName))
                                {
                                    var extrapartyresult = db.sp_SaveCaseExternalParty(null, firmid, userid, caseid, ePartyName, ePartyFatherName, ePartyAddress, ePartyAdharCardNo, ePartyGender,
                                       ePartyDateOfBirth, ePartyNationality, ePartyMobileNo, ePartyEmail, null, null, null);
                                }
                                //
                                // map column
                                for (int i = 1; i <= sum; i++)
                                {
                                    var pid = id;
                                    var column_no = "col" + i;
                                    var column_name = "";
                                    //var st="ccol" + i;
                                    if (i == 1)
                                    {
                                        var ctxt = ctxt1;
                                        column_name = ctxt;
                                    }
                                    else if (i == 2)
                                    {
                                        var ctxt = ctxt2;
                                        column_name = ctxt;
                                    }
                                    else if (i == 3)
                                    {
                                        var ctxt = ctxt3;
                                        column_name = ctxt;
                                    }
                                    else if (i == 4)
                                    {
                                        var ctxt = ctxt4;
                                        column_name = ctxt;
                                    }
                                    else if (i == 5)
                                    {
                                        var ctxt = ctxt5;
                                        column_name = ctxt;
                                    }
                                    else if (i == 6)
                                    {
                                        var ctxt = ctxt6;
                                        column_name = ctxt;
                                    }
                                    else if (i == 7)
                                    {
                                        var ctxt = ctxt7;
                                        column_name = ctxt;
                                    }
                                    else if (i == 8)
                                    {
                                        var ctxt = ctxt8;
                                        column_name = ctxt;
                                    }
                                    else if (i == 9)
                                    {
                                        var ctxt = ctxt9;
                                        column_name = ctxt;
                                    }
                                    else if (i == 10)
                                    {
                                        var ctxt = ctxt10;
                                        column_name = ctxt;
                                    }
                                    else if (i == 11)
                                    {
                                        var ctxt = ctxt11;
                                        column_name = ctxt;
                                    }
                                    else if (i == 12)
                                    {
                                        var ctxt = ctxt12;
                                        column_name = ctxt;
                                    }
                                    else if (i == 13)
                                    {
                                        var ctxt = ctxt13;
                                        column_name = ctxt;
                                    }
                                    else if (i == 14)
                                    {
                                        var ctxt = ctxt14;
                                        column_name = ctxt;
                                    }
                                    else if (i == 15)
                                    {
                                        var ctxt = ctxt15;
                                        column_name = ctxt;
                                    }
                                    var formid = Convert.ToInt32(ftype);
                                    var inserrcol = db.Usp_SaveCaseColumnMap(firmid, userid, column_no, column_name, pid);
                                }
                                //map external users
                                if (usertypes == "company")
                                {
                                    if (!String.IsNullOrEmpty(caseclientcontact))
                                    {
                                        var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, caseclientcontact);
                                    }
                                    //map multiple users
                                    if (!String.IsNullOrEmpty(clientto))
                                    {
                                        string[] values1 = clientto.Split(',');
                                        for (int i = 0; i < values1.Length; i++)
                                        {
                                            values1[i] = values1[i].Trim();
                                            if (!String.IsNullOrEmpty(values1[i]))
                                            {
                                                var cnt4 = db.Usp_SaveCaseExternalUser(firmid, userid, id, values1[i]);
                                            }
                                        }
                                    }
                                }
                                //map sol
                                List<CaseStatute> farmobj = JsonConvert.DeserializeObject<List<CaseStatute>>(sollist);
                                if (farmobj != null)
                                {
                                    if (farmobj.Count > 0)
                                    {
                                        for (var i = 0; i < farmobj.Count; i++)
                                        {
                                            //insert in a list code
                                            var cnt3 = db.Usp_SaveStatuteofCase(firmid, userid, id, farmobj[i].UserID.ToString(), farmobj[i].StatuteName.ToString(), farmobj[i].LimitDate.ToString(), Convert.ToInt32(farmobj[i].SDay), Convert.ToInt32(farmobj[i].DateSatisfy));
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            //get userdata data for create client 
                            string uemail = string.Empty;
                            string mobile = string.Empty;
                            string Designation = string.Empty;
                            string landline = string.Empty;
                            string address = string.Empty;
                            var companyIds = "";
                            if (clientid != "")
                            {
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientid).FirstOrDefault();
                                var cfname = getusersdata.fname + " " + getusersdata.mname + " " + getusersdata.lname;

                                uemail = getusersdata.cemail;
                                mobile = getusersdata.mobno;
                                Designation = getusersdata.Designation;
                                landline = getusersdata.offno;
                                address = getusersdata.cadd1;
                                //save into firmusers
                                ObjectParameter IDParameter2;
                                IDParameter2 = new ObjectParameter("id", newclientid);
                                var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, Guid.Empty.ToString());
                                newclientid = Convert.ToString(IDParameter2.Value);
                                if (rs2 > 0)
                                {
                                    //insert in regusers

                                    var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, getusersdata.cid, getusersdata.fname, getusersdata.mname, getusersdata.lname, getusersdata.Pin, null);

                                }
                                //insert into add case

                                // get teamlead data for create client
                                //var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, caseclientcontact).FirstOrDefault();

                                companyIds = getusersdata.CompanyId;

                            }
                         
                            //convert all contacts to client

                            if (newclientid == "")
                            {
                                newclientid = "00000000-0000-0000-0000-000000000000";
                            }

                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            cnt = db.Usp_SaveFullCase(firmid, userid, casename, casenumber, caseteamlead, casedetails, court, othercourt, casestatus, casecnr, caseodate, casecdate, casenotes, newclientid, casetype, IDParameter1, mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, mcol12, mcol13, mcol14, mcol15, clientno,
                                MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit, Courtfee,
                           OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                           IsCourtFeePaid, SubjectType, fmatterType, fcompanystructure, companyIds, DisposeOption,usertypes);
                            id = Convert.ToString(IDParameter1.Value);



                            caseid = id;
                            //sagar
                            //sagar
                            if (MatterType == "46")
                            {
                                var Matterotherresult = db.sp_MatterTypeOther(null, MatterType, txtMatterOther, firmid, userid, caseid, DateTime.Now);
                            }


                            if (cnt > 0)
                            {
                                // save case filling date/ extra party info
                                if (casefilingcdate.Year != 1900)
                                {
                                    var casefilingcdatersult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, casefilingcdate, null);
                                }
                                List<sp_GetCaseFilingDateTemp_Result> list = new List<sp_GetCaseFilingDateTemp_Result>();
                                list = db.sp_GetCaseFilingDateTemp(firmid, userid).ToList();

                                if (list.Count > 0)
                                {
                                    for (int i = 0; i < list.Count; i++)
                                    {
                                        DateTime esubmitDate = Convert.ToDateTime(list[i].SubmitDate);
                                        DateTime ereturnDate = Convert.ToDateTime(list[i].ReturnDate);
                                        if (esubmitDate.Year != 1900)
                                        {
                                            var caserefillingrsult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, esubmitDate, ereturnDate);
                                        }
                                    }
                                    db.sp_DeleteCaseFilingDateTemp(null, firmid, userid, 1);
                                }
                                List<sp_GetMatterTypeTemp_Result> list1 = new List<sp_GetMatterTypeTemp_Result>();
                                list1 = db.sp_GetMatterTypeTemp(firmid, userid).ToList();

                                if (list1.Count > 0)
                                {
                                    for (int i = 0; i < list1.Count; i++)
                                    {
                                        var name = list1[i].Name;
                                        var Email = list1[i].Email;
                                        var phone = list1[i].Phone;
                                        var type = list1[i].Type;


                                        var caserefillingrsult = db.sp_SaveMatterTypeDetails(null, firmid, userid, caseid, name, Email, phone, type, null);

                                    }
                                    db.sp_DeleteMatterTypeDetailsTemp(null, firmid, userid, 1);
                                }

                                if (!string.IsNullOrEmpty(ePartyName))
                                {
                                    var extrapartyresult = db.sp_SaveCaseExternalParty(null, firmid, userid, caseid, ePartyName, ePartyFatherName, ePartyAddress, ePartyAdharCardNo, ePartyGender,
                                       ePartyDateOfBirth, ePartyNationality, ePartyMobileNo, ePartyEmail, null, null, null);
                                }
                                //
                                // map column
                                for (int i = 1; i <= sum; i++)
                                {

                                    var pid = id;
                                    var column_no = "col" + i;
                                    var column_name = "";
                                    //var st="ccol" + i;
                                    if (i == 1)
                                    {
                                        var ctxt = ctxt1;
                                        column_name = ctxt;
                                    }
                                    else if (i == 2)
                                    {
                                        var ctxt = ctxt2;
                                        column_name = ctxt;
                                    }
                                    else if (i == 3)
                                    {
                                        var ctxt = ctxt3;
                                        column_name = ctxt;
                                    }
                                    else if (i == 4)
                                    {
                                        var ctxt = ctxt4;
                                        column_name = ctxt;
                                    }
                                    else if (i == 5)
                                    {
                                        var ctxt = ctxt5;
                                        column_name = ctxt;
                                    }
                                    else if (i == 6)
                                    {
                                        var ctxt = ctxt6;
                                        column_name = ctxt;
                                    }
                                    else if (i == 7)
                                    {
                                        var ctxt = ctxt7;
                                        column_name = ctxt;
                                    }
                                    else if (i == 8)
                                    {
                                        var ctxt = ctxt8;
                                        column_name = ctxt;
                                    }
                                    else if (i == 9)
                                    {
                                        var ctxt = ctxt9;
                                        column_name = ctxt;
                                    }
                                    else if (i == 10)
                                    {
                                        var ctxt = ctxt10;
                                        column_name = ctxt;
                                    }
                                    else if (i == 11)
                                    {
                                        var ctxt = ctxt11;
                                        column_name = ctxt;
                                    }
                                    else if (i == 12)
                                    {
                                        var ctxt = ctxt12;
                                        column_name = ctxt;
                                    }
                                    else if (i == 13)
                                    {
                                        var ctxt = ctxt13;
                                        column_name = ctxt;
                                    }
                                    else if (i == 14)
                                    {
                                        var ctxt = ctxt14;
                                        column_name = ctxt;
                                    }
                                    else if (i == 15)
                                    {
                                        var ctxt = ctxt15;
                                        column_name = ctxt;
                                    }
                                    var formid = Convert.ToInt32(ftype);
                                    var inserrcol = db.Usp_SaveCaseColumnMap(firmid, userid, column_no, column_name, pid);
                                }
                      
                                List<CaseStatute> farmobj = JsonConvert.DeserializeObject<List<CaseStatute>>(sollist);
                                if (farmobj != null)
                                {
                                    if (farmobj.Count > 0)
                                    {
                                        for (var i = 0; i < farmobj.Count; i++)
                                        {
                                            //insert in a list code
                                            var cnt3 = db.Usp_SaveStatuteofCase(firmid, userid, id, farmobj[i].UserID.ToString(), farmobj[i].StatuteName.ToString(), farmobj[i].LimitDate.ToString(), Convert.ToInt32(farmobj[i].SDay), Convert.ToInt32(farmobj[i].DateSatisfy));
                                        }
                                    }
                                }
                                //update status of contacts profiletype
                                if (clientid == "")
                                {
                                    clientid = "00000000-0000-0000-0000-000000000000";
                                }
                                var chkt = db.usp_updateContactsProfiletypeToClient(firmid, userid, clientid);
                            }
                        }
                            if (!String.IsNullOrEmpty(assignto))
                            {
                                string[] values = assignto.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();

                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                    //For Assigning Case To selef
                                    if (creatorroleid == "2")
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, userid, 0);
                                    }
                                    var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                }
                            }
                            //assign case to team lead
                            if (!String.IsNullOrEmpty(caseteamlead))
                            {
                                if (creatorroleid == "1" || caseteamlead.ToString().ToLower() == userid)
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                    var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                }
                                else
                                {
                                    var checkroles1 = db.usp_GetUserbyId(firmid, caseteamlead).FirstOrDefault();
                                    if (checkroles1 != null)
                                    {
                                        if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 1);
                                            var parentpartner = checkroles1.PartnerId;
                                            //send request to partner for this user
                                            var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                            var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                        }
                                        else
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                            var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);

                                        }
                                    }
                                }
                            }
                            transaction.Commit();

                            try
                            {
                                var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, assignto, creatorroleid, casename, caseid);
                            }
                            catch
                            {
                            }
                            return caseid.ToString();

                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString()+"@"+ex.InnerException+"@"+ex.StackTrace;
                    }
                }
            }


        }
        /// <summary>
        /// Load new client case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="clientid"></param>
        /// <returns></returns>
        public string loadclientnewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string clientid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetClientNewCaseDetailByRowId_Result> list = new List<GetClientNewCaseDetailByRowId_Result>();
            list = db.GetClientNewCaseDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, clientid).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetClientNewCaseDetailByRowId_Result newItem = new GetClientNewCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load new archive matter list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loadnewarchivematterlist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            if (createdby == null)
            {
                createdby = "";
            }
            var list = db.GetNewArchiveCaseDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, filtervalue, companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetNewArchiveCaseDetailByRowId_Result newItem = new GetNewArchiveCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    list[list.IndexOf(data)].CaseNextHearing = data.UserCaseid;
                }
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// load user new archive matter list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="roletype"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loadusernewarchivematterlist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            if (createdby == "null")
            {
                createdby = "";
            }
            var list = db.GetArchiveUserNewCaseDetailByRowIdNEW(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue), companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetArchiveUserNewCaseDetailByRowIdNEW_Result newItem = new GetArchiveUserNewCaseDetailByRowIdNEW_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    list[list.IndexOf(data)].CaseNextHearing = data.UserCaseid;
                }
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// load new case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="hearingsort"></param>
        /// <param name="courtstatus"></param>
        /// <param name="hearingsortfilter"></param>
        /// <param name="petionerfilter"></param>
        /// <param name="respondentrfilter"></param>
        /// <returns></returns>
        public string loadnewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
            string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname,
            string mattertype, string subjectype, string casefilternotes, string casefiltercourtname, string odateto,
            string fillingdate, string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval,
            string disposeoption, string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno,
            string casefiltercnrno, string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, 
            string courtstatusfilter, string hearingsort, string courtstatus, string hearingsortfilter, string petionerfilter,
            string respondentrfilter)
        {

            //get caseuserid
            var db = new LawPracticeEntities();
            if (createdby == null)
            {
                createdby = "";
            }
            var list = db.GetNewCaseDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                court, cstatus, createdby, filtervalue, companyname, mattertype, subjectype, casefilternotes, casefiltercourtname, odateto,
                fillingdate, fillingdateto, IsCaseArchived, srchcustcolname, srchcustcolval, disposeoption,
                casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter,
                nexthearingdatefrom, nexthearingdateto, courtstatusfilter, courtstatus,hearingsortfilter,petionerfilter,respondentrfilter).ToList();

            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetNewCaseDetailByRowId_Result newItem = new GetNewCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (!string.IsNullOrEmpty(data.UserCaseid))
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));

                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);



            return a;
        }
        /// <summary>
        /// load new Archive case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <returns></returns>
        public string loadnewcaselistArchive(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            if (createdby == null)
            {
                createdby = "";
            }
            var list = db.usp_GetNewCaseDetailByRowIdArchive(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, filtervalue).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetNewCaseDetailByRowId_Result newItem = new GetNewCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load new user case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="roletype"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <param name="casefiltercourtname"></param>
        /// <param name="odateto"></param>
        /// <param name="fillingdate"></param>
        /// <param name="fillingdateto"></param>
        /// <param name="IsCaseArchived"></param>
        /// <param name="srchcustcolname"></param>
        /// <param name="srchcustcolval"></param>
        /// <param name="disposeoption"></param>
        /// <param name="casefilterCaseDetails"></param>
        /// <param name="casefiltermtrno"></param>
        /// <param name="casefilterInternalno"></param>
        /// <param name="casefiltercnrno"></param>
        /// <param name="caseredirectfilter"></param>
        /// <param name="hearingsort"></param>
        /// <param name="courtstatus"></param>
        /// <param name="hearingsortfilter"></param>
        /// <param name="petionerfilter"></param>
        /// <param name="respondentrfilter"></param>
        /// <returns></returns>
        public string loadusernewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname,
            string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype,
            string casefilternotes, string casefiltercourtname, string odateto, string fillingdate,
            string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval, string disposeoption,
            string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
            string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter,
            string hearingsort, string courtstatus, string hearingsortfilter, string petionerfilter,
            string respondentrfilter)
        {

            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();

            int pageid = 0;


            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            //  var matter1 =db.AddLawMatterLists.Where(x => x.firmId == uids).ToList();

            if (createdby == "null")
            {
                createdby = "";
            }
            // List<GetUserNewCaseDetailByRowIdNEW_Result> list = new List<GetUserNewCaseDetailByRowIdNEW_Result>();
            var list = db.GetUserNewCaseDetailByRowIdNEW(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename,
                clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue), companyname,
                mattertype, subjectype, casefilternotes, casefiltercourtname,
                odateto, fillingdate, fillingdateto, IsCaseArchived, srchcustcolname, srchcustcolval, disposeoption,
                casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter,
                nexthearingdatefrom, nexthearingdateto, courtstatusfilter, courtstatus, hearingsortfilter, petionerfilter, respondentrfilter).ToList();

            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {

                GetUserNewCaseDetailByRowIdNEW_Result newItem = new GetUserNewCaseDetailByRowIdNEW_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (!string.IsNullOrEmpty(data.UserCaseid))
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));

                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }

            }
            var a = JsonConvert.SerializeObject(list);



            return a;
        }
        /// <summary>
        /// Case Dashboard 
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string CaseDashboardCasedocs(string firmid, string userid, string caseid, int pagenum, int pagesize)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetCloudDcoumentByCaseId_Result> list = new List<GetCloudDcoumentByCaseId_Result>();
            list = db.GetCloudDcoumentByCaseId(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetCloudDcoumentByCaseId_Result newItem = new GetCloudDcoumentByCaseId_Result();
                sb.Clear();
                if (!string.IsNullOrEmpty(data.AZureFIleId))
                {
                    newItem.AZureFIleId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFIleId.ToString()));
                    list[list.IndexOf(data)].AZureFIleId = newItem.AZureFIleId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Case dashboard task list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="datefilter"></param>
        /// <param name="filtertask"></param>
        /// <param name="filterclient"></param>
        /// <param name="filteruser"></param>
        /// <param name="assignby"></param>
        /// <param name="assignto"></param>
        /// <param name="status"></param>
        /// <param name="duedate"></param>
        /// <returns></returns>
        public string CaseDashboardTaskList(string firmid, string userid, string caseid, int pagenum, int pagesize, string datefilter, string filtertask, string filterclient, string filteruser, string assignby, string assignto, string status, string duedate)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_CaseDashboardTaskList_Result> list = new List<usp_CaseDashboardTaskList_Result>();
            list = db.usp_CaseDashboardTaskList(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), datefilter, filtertask, filterclient, filteruser, assignby, assignto, status, duedate).ToList();
            foreach (var datas in list.ToList())
            {
                usp_CaseDashboardTaskList_Result newItem = new usp_CaseDashboardTaskList_Result();
                newItem.Tid = Convert.ToBase64String(QueryAES.EncryptAes(datas.Tid.ToString()));
                list[list.IndexOf(datas)].Tid = newItem.Tid;
                if (!string.IsNullOrEmpty(datas.AssignUser.ToString()))
                {
                    if (datas.AssignUser.ToString().ToLower() == userid.ToString().ToLower())
                    {
                        list[list.IndexOf(datas)].AssignTo = "ME";
                    }
                }
                if (!string.IsNullOrEmpty(datas.UserId.ToString()))
                {
                    if (datas.UserId.ToString().ToLower() == userid.ToString().ToLower())
                    {
                        list[list.IndexOf(datas)].AssignBy = "ME";
                    }
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Create user by case id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string CreateUserByCaseId(string firmid, string userid, string caseid)
        {
            var db = new LawPracticeEntities();
            var getcaseid = db.usp_EditCaseBasicDetails(firmid, userid, caseid).FirstOrDefault();
            var casecreatorid = "";
            if (getcaseid != null)
            {
                casecreatorid = getcaseid.firmuser.ToString();
            }
            List<usp_GetUserDetailByUserID_Result> list = new List<usp_GetUserDetailByUserID_Result>();
            list = db.usp_GetUserDetailByUserID(firmid, casecreatorid).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get user by case id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string usersbycaseid(string firmid, string userid, string caseid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<usp_UserlistbycaseId_Result> list = new List<usp_UserlistbycaseId_Result>();
            list = db.usp_UserlistbycaseId(firmid, userid, caseid, pagenum, pagesize).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get users by caseid for alerts
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string usersbycaseidforalerts(string firmid, string userid, string caseid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
#pragma warning disable CS0219 // The variable 'pageid' is assigned but its value is never used
            int pageid = 0;
#pragma warning restore CS0219 // The variable 'pageid' is assigned but its value is never used
            List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
            list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, caseid).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get basic case details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string CaseBasicDetails(string firmid, string userid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_CaseBasicDetails_Result> list = new List<usp_CaseBasicDetails_Result>();
            list = db.usp_CaseBasicDetails(firmid, userid, caseid).ToList();
            //StringBuilder sb = new StringBuilder();
            //foreach (var data in list.ToList())
            //{
            //    usp_CaseBasicDetails_Result newItem = new usp_CaseBasicDetails_Result();
            //    sb.Clear();
            //}
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get external contact details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string CaseExternalContact(string firmid, string userid, string caseid, int pagenum, int pagesize)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_CaseExternalContactslist_Result> list = new List<usp_CaseExternalContactslist_Result>();
            list = db.usp_CaseExternalContactslist(firmid, userid, caseid, pagenum, pagesize).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get OCR file list for dropdown list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string OcrfilelistForDDl(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            List<GetOcrfilelistForDDl_Result> list = new List<GetOcrfilelistForDDl_Result>();
            list = db.GetOcrfilelistForDDl(firmid, userid).ToList();
            foreach (var data in list.ToList())
            {
                GetOcrfilelistForDDl_Result newItem = new GetOcrfilelistForDDl_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Update matter full screan details
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="usertypes"></param>
        /// <param name="clientid"></param>
        /// <param name="casename"></param>
        /// <param name="casetype"></param>
        /// <param name="caseclientcontact"></param>
        /// <param name="casedetails"></param>
        /// <param name="casenotes"></param>
        /// <param name="court"></param>
        /// <param name="othercourt"></param>
        /// <param name="casestatus"></param>
        /// <param name="caseodate"></param>
        /// <param name="casenumber"></param>
        /// <param name="casecdate"></param>
        /// <param name="caseteamlead"></param>
        /// <param name="casecnr"></param>
        /// <param name="username"></param>
        /// <param name="casesidepassword"></param>
        /// <param name="clientto"></param>
        /// <param name="DisputeMatterType"></param>
        /// <param name="DisposeOption"></param>
        /// <param name="NotesCasedetail"></param>
        /// <returns></returns>
            public string UpdateFullScreenCase(string caseid, string firmid, string userid, string usertypes, string clientid, string casename, string casetype, string caseclientcontact, string casedetails, string casenotes, string court, string othercourt, string casestatus, string caseodate, string casenumber, string casecdate, string caseteamlead, string casecnr, string username, string casesidepassword, string clientto, string assignto, string sollist, string checkclient, string files, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string mcol1, string mcol2, string mcol3, string mcol4, string mcol5, string mcol6, string mcol7, string mcol8, string mcol9, string mcol10, string mcol11, string mcol12, string mcol13, string mcol14, string mcol15, string ftype, string divSCHCDistrict, string drpcourtname, string drpdistrictcourtname, string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, int flag, string useremail, string usermobile, string apiurl, string clientno,
            string MatterType, string PoliceStation, string Firno, string CertifiedCopyAppliedon, string CertifiedCopyReceivedon, string ValuationofSuit,
            string Courtfee, string OppositePartyCounselname, string OppositePartyCounselemail, string OppositePartyCounselphone, string CasenumberInternal,
            string IsCourtFeePaid, string SubjectType,
            DateTime casefilingcdate, DateTime submitDate, DateTime returnDate, string ePartyName,
            string ePartyFatherName, string ePartyAddress, string ePartyAdharCardNo, string ePartyGender,
                   string ePartyDateOfBirth, string ePartyNationality, string ePartyMobileNo, string ePartyEmail,
                   string creatorroleid, string fmatterType, string txtMatterOther, string DisputeMatterType,
                   string DisposeOption,string NotesCasedetail, string otherpartyFname, string otherpartyEMail, string otherpartyPhone,
                   string otherpartyType, string otherpartyId)

        {
            var db = new LawPracticeEntities();
            // if already exist client
            string id = "";
            var cnt = 0;
            var newclientid = "";
            //convert to client
            var cpassword = QueryAES.GetHashedCode(casesidepassword);
            cpassword = cpassword.Replace("\n", "");
            var cDefaultController = "Client";
            var DefaultAction = "dashboard";

            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    //insert into add case
                    if (caseteamlead=="")
                    {
                        caseteamlead = null;
                    }
                    if (clientid == "")
                    {
                        clientid = "00000000-0000-0000-0000-000000000000";
                    }
                    if(caseclientcontact=="")
                    {
                        caseclientcontact = "00000000-0000-0000-0000-000000000000";
                    }
                    var companyIds = "";
                    var caseclientid = "";
                    if (usertypes == "company")
                    {
                        if (companyIds == "")
                        {
                            companyIds = "00000000-0000-0000-0000-000000000000";
                        }
                        // get teamlead data for create client
                        var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, caseclientcontact).FirstOrDefault();
                        if (getusersdata != null)
                        {
                            companyIds = getusersdata.CompanyId;
                            //convert all contacts to client
                            var listofcompanyuser = db.usp_loadcompanycontacts(firmid, getusersdata.CompanyId).ToList();
                            if (listofcompanyuser != null)
                            {
                                foreach (var data in listofcompanyuser)
                                {
                                    if (String.IsNullOrEmpty(data.LoginId))
                                    {
                                        var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, data.cid.ToString()).FirstOrDefault();
                                        var cfname = getusersdata1.fname + " " + getusersdata1.mname + " " + getusersdata1.lname;
                                        string uemail = getusersdata1.cemail;
                                        string mobile = getusersdata1.mobno;
                                        string Designation = getusersdata1.Designation;
                                        string landline = getusersdata1.offno;
                                        string address = getusersdata1.cadd1;
                                        ObjectParameter IDParameter2;
                                        IDParameter2 = new ObjectParameter("id", newclientid);
                                        var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata1.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, clientid);
                                        newclientid = Convert.ToString(IDParameter2.Value);
                                        if (caseclientcontact.ToLower().ToString() == data.cid.ToString())
                                        {
                                            caseclientid = newclientid;
                                        }
                                        if (rs2 > 0)
                                        {
                                            //insert in regusers
                                            var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata1.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, data.cid.ToString(), getusersdata1.fname, getusersdata1.mname, getusersdata1.lname, getusersdata1.Pin, null);
                                            //update type in contact
                                            var chkt = db.usp_updateContactsProfiletypeToClient(firmid, getusersdata1.loguser.ToString(), data.cid.ToString());
                                        }
                                    }
                                    else
                                    {
                                        //check if already client
                                        if (caseclientcontact.ToLower().ToString() == data.cid.ToString())
                                        {
                                            caseclientid = data.LoginId;
                                        }
                                    }
                                }
                            }
                        }

                        if (caseclientid == "" || caseclientid == null)
                        {
                            caseclientid = "00000000-0000-0000-0000-000000000000";
                        }
                    }
                    //convert all contacts to client
                    if (newclientid == "")
                    {
                        newclientid = "00000000-0000-0000-0000-000000000000";
                    }
                    string newcaseclient = "00000000-0000-0000-0000-000000000000";
                    if (usertypes == "user")
                    {
                        newcaseclient = clientid;
                    }
                    else
                    {
                        newcaseclient = caseclientid;
                    }

                    cnt = db.Usp_UpdateFullCase(caseid, firmid, userid, casename, casenumber, caseteamlead, casedetails, court, othercourt, casestatus, casecnr, 
                        caseodate, casecdate, casenotes, newcaseclient, casetype, mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, 
                        mcol12, mcol13, mcol14, mcol15, clientno,fmatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit,
                        Courtfee,OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                        IsCourtFeePaid, SubjectType, DisputeMatterType, DisputeMatterType, DisposeOption, companyIds,usertypes);
                    id = caseid;// Convert.ToString(IDParameter1.Value);

                    var olduserlist = db.usp_GetAssignUserForEdit(firmid, userid, caseid).ToList();
                    int oldusercount = olduserlist.Count();
                    StringBuilder newuserslist = new StringBuilder();
                    newuserslist.Clear();
                    if (cnt > 0)
                    {

                        if (casefilingcdate.Year != 1900)
                        {
                            ///get current casefiling date
                            var currentfilingdate = db.sp_GetCaseFilingDate(firmid, userid, caseid).FirstOrDefault();
                            if(currentfilingdate==null)
                            {
                                var casefilingcdatersult = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, casefilingcdate, null);
                            }
                            else
                            {
                                var casefilingcdatersult = db.sp_SaveUpdateCaseFilingDate(currentfilingdate.Id.ToString(), firmid, userid, caseid, casefilingcdate, null);
                            }
                        }
                        //For Other Party Deatils
                        if (!String.IsNullOrEmpty(otherpartyId))
                        {
                            var caserefillingrsult = db.sp_SaveMatterTypeDetails(otherpartyId, firmid, userid, caseid, otherpartyFname, otherpartyEMail, otherpartyPhone, otherpartyType, null);
                        }
                        if (fmatterType == "46")
                        {
                            var Matterotherresult = db.sp_MatterTypeOther(caseid, fmatterType, txtMatterOther, firmid, userid, caseid, DateTime.Now);
                        }
                      
                        // map column
                        for (int i = 1; i <= sum; i++)
                        {

                            var pid = id;
                            var column_no = "col" + i;
                            var column_name = "";
                            //var st="ccol" + i;
                            if (i == 1)
                            {
                                var ctxt = ctxt1;
                                column_name = ctxt;
                            }
                            else if (i == 2)
                            {
                                var ctxt = ctxt2;
                                column_name = ctxt;
                            }
                            else if (i == 3)
                            {
                                var ctxt = ctxt3;
                                column_name = ctxt;
                            }
                            else if (i == 4)
                            {
                                var ctxt = ctxt4;
                                column_name = ctxt;
                            }
                            else if (i == 5)
                            {
                                var ctxt = ctxt5;
                                column_name = ctxt;
                            }
                            else if (i == 6)
                            {
                                var ctxt = ctxt6;
                                column_name = ctxt;
                            }
                            else if (i == 7)
                            {
                                var ctxt = ctxt7;
                                column_name = ctxt;
                            }
                            else if (i == 8)
                            {
                                var ctxt = ctxt8;
                                column_name = ctxt;
                            }
                            else if (i == 9)
                            {
                                var ctxt = ctxt9;
                                column_name = ctxt;
                            }
                            else if (i == 10)
                            {
                                var ctxt = ctxt10;
                                column_name = ctxt;
                            }
                            else if (i == 11)
                            {
                                var ctxt = ctxt11;
                                column_name = ctxt;
                            }
                            else if (i == 12)
                            {
                                var ctxt = ctxt12;
                                column_name = ctxt;
                            }
                            else if (i == 13)
                            {
                                var ctxt = ctxt13;
                                column_name = ctxt;
                            }
                            else if (i == 14)
                            {
                                var ctxt = ctxt14;
                                column_name = ctxt;
                            }
                            else if (i == 15)
                            {
                                var ctxt = ctxt15;
                                column_name = ctxt;
                            }
                            try
                            {
                                var formid = Convert.ToInt32(ftype);
                                var inserrcol = db.Usp_UpdateCaseColumnMap(firmid, "8", column_no, column_name, pid);
                                if (inserrcol == 0)
                                {
                                    inserrcol = db.Usp_SaveCaseColumnMap(firmid, "8", column_no, column_name, pid);
                                }
                            }
                            catch { }
                        }
                        var getcasecreator = db.usp_EditCaseBasicDetails(firmid, userid, caseid).Select(x => new { firmuser = x.firmuser, UserCaseid = x.UserCaseid }).FirstOrDefault(); 
                        var destinationlist = String.Join(",", olduserlist.Select(x=>x.id.ToString()));
                        //map  users
                        if (!String.IsNullOrEmpty(assignto))
                        {
                           
                            var results = AddCaseCaseWatch.FindUserForMatter(assignto, destinationlist, firmid);
                            if (!String.IsNullOrEmpty(results))
                            {
                                string[] values1 = results.Split(',');
                                for (int i = 0; i < values1.Length; i++)
                                {
                                    values1[i] = values1[i].Trim();

                                    string strusername1 = ConfigurationManager.AppSettings["matteridname"];
                                    //add in casewatch
                                    var auser = values1[i];
                                    if (creatorroleid == "1" || getcasecreator.firmuser.ToString().ToLower() == userid)
                                    {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values1[i], 0);
                                    }
                                    else
                                    {
                                            var checkroles1 = db.usp_GetUserbyId(firmid, values1[i]).FirstOrDefault();
                                            if (checkroles1 != null)
                                            {
                                                if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                                {
                                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values1[i], 1);
                                                    var parentpartner = checkroles1.PartnerId;
                                                    //send request to partner for this user
                                                    var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                                }
                                                else
                                                {
                                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values1[i], 0);
                                                }
                                            }
                                        }
                                   // }
                                }
                            }
                        }
                        string strusername = ConfigurationManager.AppSettings["matteridname"];
                        //remove from casewatchalert userlist
                         
                         if (creatorroleid == "1" || getcasecreator.firmuser.ToString().ToLower() == userid)
                         {
                            //check new user or not
                            if (!String.IsNullOrEmpty(assignto.ToString()))
                            {
                                var results = AddCaseCaseWatch.FindUserForMatter(destinationlist, assignto, firmid);
                                if (!String.IsNullOrEmpty(results))
                                {
                                    //REMOVE USER FROM MYKASE
                                    string[] valuesRemove = results.Split(',');
                                    for (int j = 0; j < valuesRemove.Length; j++)
                                    {
                                            var auser = strusername + valuesRemove[j].Trim();
                                            var casestatusdetails = db.usp_UserCasesMapCaseStatusMaster(caseid).FirstOrDefault();
                                            var getfirmadminid = db.usp_FirmAdminDetails(firmid).FirstOrDefault();
                                            //check creator or not
                                            if (casestatusdetails != null && (valuesRemove[j].Trim().ToLower().ToString() == Convert.ToString(caseteamlead))) //in case user is teamlead
                                            {
                                            }
                                            else if (casestatusdetails != null && (valuesRemove[j].Trim().ToLower().ToString() == getfirmadminid.Id.ToString())) //in case user is admin
                                            {
                                            }
                                            else if (casestatusdetails != null)
                                            {
                                                //remove user alert from casewatch
                                                var result = AddCaseCaseWatch.RemoveCaseWatchAlertUser(auser, casestatusdetails.UserId.ToString(), firmid, apiurl, getcasecreator.UserCaseid,0,"");
                                                var retruncnt = db.Usp_RemoveMultipleCaseUserMap(firmid, userid, valuesRemove[j].Trim(), caseid);   
                                            }
                                            else
                                            {
                                            var retruncnt = db.Usp_RemoveMultipleCaseUserMap(firmid, userid, valuesRemove[j].Trim(), caseid);
                                        }
                                    }
                                }
                            }
                         }
                        
                        if (!String.IsNullOrEmpty(caseteamlead))
                        {
                            if (creatorroleid == "1" || getcasecreator.firmuser.ToString().ToLower() == userid)
                            {
                                 var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                        newuserslist.Clear();
                                        foreach (var data in olduserlist)
                                        {
                                            newuserslist = newuserslist.Append(data.id + ",");

                                        }
                                        //check new user or not
                                        if (!String.IsNullOrEmpty(newuserslist.ToString()))
                                        {
                                            var newuserflagcompare = newuserslist.ToString().Contains(caseteamlead);
                                            if (newuserflagcompare == false)
                                            {
                                                var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                            }
                                        }
                            }
                            else
                            {
                                var checkroles1 = db.usp_GetUserbyId(firmid, caseteamlead).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 1);

                                        var parentpartner = checkroles1.PartnerId;

                                        //send request to partner for this user
                                        var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                        if (!String.IsNullOrEmpty(newuserslist.ToString()))
                                        {
                                            var newuserflagcompare = newuserslist.ToString().Contains(caseteamlead);
                                            if (newuserflagcompare == false)
                                            {
                                                var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                            }

                                        }
                                    }
                                    else
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, caseteamlead, 0);
                                        newuserslist.Clear();
                                        foreach (var data in olduserlist)
                                        {
                                            newuserslist = newuserslist.Append(data.id + ",");
                                        }
                                        //check new user or not
                                        if (!String.IsNullOrEmpty(newuserslist.ToString()))
                                        {
                                            var newuserflagcompare = newuserslist.ToString().Contains(caseteamlead);
                                            if (newuserflagcompare == false)
                                            {
                                                var dataac1 = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, caseteamlead, casename, id);
                                            }

                                        }
                                    }
                                }
                            }
                        }
                        //map external users
                        if (usertypes == "company")
                        {
                            if (clientto == "null")
                            {
                                 clientto = null;
                            }
                            if (caseclientcontact != "00000000-0000-0000-0000-000000000000")
                            {
                                var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, caseclientcontact);
                            }
                            //map multiple users
                            if (!String.IsNullOrEmpty(clientto))
                            {
                                //Reset  client from case
                                var res = db.Usp_ResetCaseExternalUser(firmid, userid, id);
                                string[] values1 = clientto.Split(',');
                                for (int i = 0; i < values1.Length; i++)
                                {
                                    values1[i] = values1[i].Trim();
                                    try
                                    {
                                        if (values1[i] != "null")
                                        {
                                            var cnt4 = db.Usp_UpdateCaseExternalUser(firmid, userid, id, values1[i]);
                                        }
                                    }
                                    catch { }
                                }
                            }
                        }
//New code added on 14 may 2026
                        else
                        {
                            var res = db.Usp_ResetCaseExternalUser(firmid, userid, id);
                        }                        //}
                        //User auto assign to CW start
                        if (getcasecreator.UserCaseid != "")
                        {
                            try
                            {
                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, caseid).ToList();
                                if (list.Count > 0)
                                {
                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, getcasecreator.UserCaseid, 0, "");

                                    
                                    //Start Code 03March2026
                                    var firmUserResult=DataAccessIPRADO.GetClientDetailByClientId(firmid,Convert.ToString(newcaseclient));
                                    if (firmUserResult != null && firmUserResult.Rows.Count > 0)
                                    {
                                        DateTime? expiryDate = null;
                                        int IsApprove = 0;
                                        if (firmUserResult.Rows[0]["ExpiryDate"] != DBNull.Value)
                                        {
                                            expiryDate = Convert.ToDateTime(firmUserResult.Rows[0]["ExpiryDate"]);
                                        }
                                        if(Convert.ToString(firmUserResult.Rows[0]["UserName"]) =="" || Convert.ToBoolean(firmUserResult.Rows[0]["IsActive"])==false)
                                        {
                                            IsApprove = 0;
                                        }
                                        else
                                        {
                                            IsApprove = 1;
                                        }
                                        var result = AddCaseCaseWatch.EnableDisableUserToCW(firmid.ToString(), Convert.ToString(firmUserResult.Rows[0]["Id"]), IsApprove, expiryDate);
                                        //End Code 03March2026
                                    }

                                }
                            }
                            catch
                            {
                            }

                        }

                        //End
                    }
                    newuserslist.Clear();
                        if (!String.IsNullOrEmpty(assignto))
                        {
                            foreach (var data in olduserlist)
                            {
                                newuserslist = newuserslist.Append(data.id + ",");

                            }
                            string[] values = assignto.Split(',');
                        transaction.Commit();
                        if (Convert.ToInt32(oldusercount) == Convert.ToInt32(values.Length))
                            {
                                //execute 2
                                var dataac13 = Notification.SaveNotifications("EditMatterCreator", null, firmid, userid, userid, casename, caseid);
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    var dataac134 = Notification.SaveNotifications("EditMatterAssignee", null, firmid, userid, values[i], casename, caseid);
                                }
                            }
                            else
                            {
                                var dataac13 = Notification.SaveNotifications("EditMatterCreator", null, firmid, userid, userid, casename, caseid);
                                //execute 1,2
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    //check new user or not
                                    if (!String.IsNullOrEmpty(newuserslist.ToString()))
                                    {
                                        var newuserflagcompare = newuserslist.ToString().Contains(values[i]);
                                        if (newuserflagcompare == false)
                                        {
                                            var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                            if (checkroles1 != null)
                                            {
                                                if (creatorroleid == "1")
                                                {
                                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                                    var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);

                                                }
                                                else
                                                {
                                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                                    {
                                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);

                                                        var parentpartner = checkroles1.PartnerId;

                                                        //send request to partner for this user
                                                        var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, caseid, "12", null, null, null);
                                                        var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);
                                                        //send notification
                                                        var dataac1e = Notification.SaveNotifications("AssignTeamMemberTaskCase", null, firmid, userid, parentpartner, casename, id);
                                                        //send email
                                                        var dataac2 = Notification.SendEmailFromDBContent("AssignTeamMemberTaskCase", null, firmid, userid, parentpartner, id, casename);

                                                    }
                                                    else
                                                    {
                                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                                        var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            var dataac133 = Notification.SaveNotifications("AddNewTeamMember", null, firmid, userid, values[i], casename, caseid);
                                            var dataac134 = Notification.SaveNotifications("EditMatterAssignee", null, firmid, userid, values[i], casename, caseid); 
                                        }
                                    }
                                }
                            }
                    }
                        var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                        if (getcaseuser != null)
                          {
                                if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                {
                                    var dataacq = Notification.SaveNotifications("CaseEdit", null, firmid, userid, getcaseuser.ReportManager.ToString(), casename, caseid);
                                }
                          }
                    //transaction.Commit();
                    return cnt.ToString(); 
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Edit basic case details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string EditCaseBasicDetails(string firmid, string userid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_EditCaseBasicDetails_Result> list = new List<usp_EditCaseBasicDetails_Result>();
            list = db.usp_EditCaseBasicDetails(firmid, userid, caseid).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get recent activity report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="datefrom"></param>
        /// <param name="dateto"></param>
        /// <returns></returns>
        public string RecentActivityReport(string firmid, string userid, int pagenum, int pagesize, string datefrom, string dateto)
        {
            var db = new LawPracticeEntities();
            List<usp_GetRecentActivity_New_Result> list = new List<usp_GetRecentActivity_New_Result>();
            list = db.usp_GetRecentActivity_New(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, datefrom, dateto).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get document activity report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="datefrom"></param>
        /// <param name="dateto"></param>
        /// <param name="docid"></param>
        /// <returns></returns>
        public string DocumentActivityReport(string firmid, string userid, int pagenum, int pagesize, string datefrom, string dateto, string docid)
        {
            var db = new LawPracticeEntities();
            List<usp_GetDocumentActivity_New_Result> list = new List<usp_GetDocumentActivity_New_Result>();
            list = db.usp_GetDocumentActivity_New(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, datefrom, dateto, docid).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Sp client date new 
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string SpClientDataNew(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_GetClientFilterList_Result> trialList_1 = new List<usp_GetClientFilterList_Result>();
            trialList_1 = db.usp_GetClientFilterList(firmid.ToString(), "", userid.ToString()).ToList();
            var trialList = (from ob in trialList_1
                             select new
                             {
                                 label = ob.fname + " " + ob.mname + " " + ob.lname + "-(" + ob.CType + ")",
                                 val = ob.ID,
                                 utype = ob.CType,
                                 isclient = ob.IsClient,
                                 CompanyID = ob.CompanyID,
                                 ProfileType = ob.ProfileType,
                                 LabelName = ob.fname + " " + ob.mname + " " + ob.lname
                             }).ToList();
            var a = JsonConvert.SerializeObject(trialList);
            return a;
        }
        /// <summary>
        /// Get all contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <param name="iscomorindv"></param>
        /// <returns></returns>
        public string allcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var profiletype = "";
            if (type.ToLower() == "all")
            {
                profiletype = "";
            }
            else
            {
                var clientprofiletype = db.usp_getcontacttypebyname().FirstOrDefault();
                profiletype = clientprofiletype.ToString();
            }
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<GetAllContactsDetailsByRowId_Result> list = new List<GetAllContactsDetailsByRowId_Result>();
            list = db.GetAllContactsDetailsByRowId(firmid, userid, pagenum, pagesize, 0, search, profiletype, pageid, iscomorindv).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetAllContactsDetailsByRowId_Result newItem = new GetAllContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get timer list search by rowid and caseid
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string timerlistsearchbyrowidbycaseid(string firmid, string userid, int pagenum, int pagesize, string search, string caseid)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewTimer")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<GetTimerDetailsByRowIdNewbycaseId_Result> list = new List<GetTimerDetailsByRowIdNewbycaseId_Result>();
            list = db.GetTimerDetailsByRowIdNewbycaseId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search, pageid, caseid).ToList();
            foreach (var data in list.ToList())
            {
                GetTimerDetailsByRowIdNewbycaseId_Result newItem = new GetTimerDetailsByRowIdNewbycaseId_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.tmatter != null)
                {
                    newItem.tmatter = Convert.ToBase64String(QueryAES.EncryptAes(data.tmatter.ToString()));
                    list[list.IndexOf(data)].tmatter = newItem.tmatter;
                }

            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case dashboard case communique list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="filtertype"></param>
        /// <param name="filtercreatedby"></param>
        /// <param name="brieffilter"></param>
        /// <param name="searchfrom"></param>
        /// <param name="searchto"></param>
        /// <param name="filteralertto"></param>
        /// <returns></returns>
        public string CaseDashboardCaseCommuniqueList(string firmid, string userid, string caseid, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter, string searchfrom, string searchto, string filteralertto)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_CaseCommuniquelist_Result> list = new List<usp_CaseCommuniquelist_Result>();
            list = db.usp_CaseCommuniquelist(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, brieffilter, searchfrom, searchto, filteralertto).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get client communique list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="filtertype"></param>
        /// <param name="filtercreatedby"></param>
        /// <param name="brieffilter"></param>
        /// <returns></returns>
        public string ClientCommuniqueList(string firmid, string userid, string caseid, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_ClientCommuniquelist_Result> list = new List<usp_ClientCommuniquelist_Result>();
            list = db.usp_ClientCommuniquelist(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, brieffilter).ToList();
            StringBuilder sb = new StringBuilder();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        public void verifydownloaddata(string wid, string wtid, string firmid, string emailto, string emailcc, string emailsub, string emailbody, string userid)
        {
            throw new NotImplementedException();
        }
        public void savecustomformdata(SaveCustomFieldData fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string wid, string wtid, string Filenames, string userid)
        {
            throw new NotImplementedException();
        }
        public void editcustomformdata(SaveCustomFieldData fm, string firmid, string ftype, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string wid, string wtid, string fstatus, string fcomment, string Filenames, string userid)
        {
            throw new NotImplementedException();
        }
        public string savematter(string clientid, string tempassign, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            throw new NotImplementedException();
        }
        public bool editmatter(string clientid, string tempassign, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Load user new case Achive list 
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="roletype"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <returns></returns>
        public string loadusernewcaselistAchive(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            if (createdby == "null")
            {
                createdby = "";
            }
            var list = db.usp_GetUserNewCaseDetailByRowIdNEWArchive(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetUserNewCaseDetailByRowIdNEW_Result newItem = new GetUserNewCaseDetailByRowIdNEW_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load invoice data by case id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <param name="caseid"></param>
        /// <param name="filterinvoietype"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="InvoiceStatus"></param>
        /// <returns></returns>
        public string LoadInvoicedataByCaseId(string firmid, string userid, int roleid, string caseid, string filterinvoietype, int pagenum, int pagesize, string InvoiceStatus)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            //check user type
            if (roleid == 3)
            {
                //check user is company or individual
                var companyid = db.usp_wf_GetClientDetails(Guid.Parse(firmid), Guid.Parse(userid)).FirstOrDefault();
                if (companyid != null)
                {
                    if (companyid.CompanyId.ToString() != "00000000-0000-0000-0000-000000000000")
                    {
                        if (companyid.IsCompanyAdmin != 1)
                        {
                            //get parentclienid
                            var getcompanycontact = db.Usp_CompanyClintContactList(firmid, userid, companyid.CompanyId.ToString()).Where(x => x.IsCompanyAdmin == 1).FirstOrDefault();
                            if (getcompanycontact != null)
                            {
                                userid = getcompanycontact.Loginid.ToString();
                            }
                        }
                    }
                }
            }
            List<usp_InvoicelistByCaseId_Result> list = new List<usp_InvoicelistByCaseId_Result>();
            list = db.usp_InvoicelistByCaseId(firmid.ToString(), userid.ToString(), roleid, caseid, pagenum, pagesize, filterinvoietype, InvoiceStatus).ToList();
            foreach (var data in list.ToList())
            {
                usp_InvoicelistByCaseId_Result newItem = new usp_InvoicelistByCaseId_Result();
                newItem.id = Convert.ToBase64String(QueryAES.EncryptAes(data.id.ToString()));
                list[list.IndexOf(data)].id = newItem.id;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get payment detail by invoice id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="invoiceid"></param>
        /// <param name="filterpaymenttype"></param>
        /// <returns></returns>
        public string InvoicePaymentbyInvoiceID(string firmid, string userid, string invoiceid, string filterpaymenttype)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<Usp_PaymentDetailsByInvoiceId_Result> list = new List<Usp_PaymentDetailsByInvoiceId_Result>();
            list = db.Usp_PaymentDetailsByInvoiceId(firmid.ToString(), userid.ToString(), invoiceid, filterpaymenttype).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load expense category
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadExpenseCategory(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_ExpenseCategoryList(firmid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Insert expense category
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string InsertExpenseCategory(string firmid, string userid, string type)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_SaveExpenseCategory(firmid, userid, type, null);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove expense category
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string RemoveExpenseCategory(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Usp_RemoveExpenseCategory(Guid.Parse(firmid), Guid.Parse(userid), Guid.Parse(fid));
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "Tbl_CustomCaseDefaultTaskList", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Load custom case task details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadCustomCaseTask(string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_CustomCaseDefaultTaskList(firmid, userid).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Insert custom case task details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string InsertCustomCaseTask(string firmid, string userid, string type)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_SaveCustomCaseDefaultTask(firmid, userid, type, null);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove default custom case task
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string RemoveCustomCaseTask(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Usp_RemoveCustomCaseDefaultTask(firmid, userid, fid);
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "Tbl_CustomCaseDefaultTaskList", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Get search user list by username
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="Username"></param>
        /// <returns></returns>
        public string UserSearchListByUsername(string firmid, string userid, int pagenum, int pagesize, int roleid, string Username)
        {
            var db = new LawPracticeEntities();
            List<usp_GetSearchuserDetailsByUserName_Result> list = new List<usp_GetSearchuserDetailsByUserName_Result>();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("userlist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            list = db.usp_GetSearchuserDetailsByUserName(Guid.Parse(firmid), userid, pagenum, pagesize, 0, Username, pageid).ToList();
            foreach (var data in list.ToList())
            {
                GetSearchuserDetailsbyrowid_Result newItem = new GetSearchuserDetailsbyrowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Communication unqiue list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="casename"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="filtertype"></param>
        /// <param name="filtercreatedby"></param>
        /// <param name="brieffilter"></param>
        /// <param name="searchfrom"></param>
        /// <param name="searchto"></param>
        /// <param name="filteralertto"></param>
        /// <param name="isadmin"></param>
        /// <returns></returns>
        public string CommuniqueList(string firmid, string userid, string casename, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter, string searchfrom, string searchto, string filteralertto, string isadmin)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_Communiquelist_Result> list = new List<usp_Communiquelist_Result>();
            list = db.usp_Communiquelist(firmid, userid, casename, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, brieffilter, searchfrom, searchto, filteralertto, isadmin).ToList();
            StringBuilder sb = new StringBuilder();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove default custom task
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string RemoveCustomTask(string firmid, string userid, string fid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.Usp_RemoveCustomTaskDefault(firmid, userid, fid);
            var a = JsonConvert.SerializeObject(matter);
            db.insertdeleteentrytable(Guid.Parse(fid), "Tbl_CustomTaskDefaultList", Guid.Parse(firmid));
            return a;
        }
        /// <summary>
        /// Get all contact list for company
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string allcontactslistforcompany(string firmid, string userid, int pagenum, int pagesize, string search, string type)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var profiletype = "";
            if (type.ToLower() == "all")
            {
                profiletype = "";
            }
            else
            {
                var clientprofiletype = db.usp_getcontacttypebyname().FirstOrDefault();
                profiletype = clientprofiletype.ToString();
            }
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<Usp_GetAllContactsDetailsByRowIdForCompany_Result> list = new List<Usp_GetAllContactsDetailsByRowIdForCompany_Result>();
            list = db.Usp_GetAllContactsDetailsByRowIdForCompany(firmid, userid, pagenum, pagesize, 0, search, profiletype, pageid).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetAllContactsDetailsByRowId_Result newItem = new GetAllContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// All contact list for company
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string contactslistForComapny(string firmid, string userid, int pagenum, int pagesize, string search, string type)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<Usp__GetNewContactsDetailsByRowIdForCompany_Result> list = new List<Usp__GetNewContactsDetailsByRowIdForCompany_Result>();
            list = db.Usp__GetNewContactsDetailsByRowIdForCompany(firmid, userid, pagenum, pagesize, 0, search, type, pageid).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNewContactsDetailsByRowId_Result newItem = new GetNewContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Cancel invoice details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="invoiceid"></param>
        /// <returns></returns>
        public string CancelInvoice(string firmid, string userid, string invoiceid)
        {
            var db = new LawPracticeEntities();
            var result = db.usp_CancelInvoice(firmid, userid, invoiceid);
            var a = JsonConvert.SerializeObject(result);
            return a;
        }
        /// <summary>
        /// Get all standard contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <param name="iscomorindv"></param>
        /// <returns></returns>
        public string allstandardcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var profiletype = "";
            if (type.ToLower() == "all")
            {
                profiletype = "";
            }
            else
            {
                var clientprofiletype = db.usp_getcontacttypebyname().FirstOrDefault();
                profiletype = clientprofiletype.ToString();
            }
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<GetAllStandardContactsDetailsByRowId_Result> list = new List<GetAllStandardContactsDetailsByRowId_Result>();
            list = db.GetAllStandardContactsDetailsByRowId(firmid, userid, pagenum, pagesize, 0, search, profiletype, pageid, iscomorindv).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetAllContactsDetailsByRowId_Result newItem = new GetAllContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get all standard contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <param name="type"></param>
        /// <param name="iscomorindv"></param>
        /// <returns></returns>
        public string standardcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ContactsList")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            StringBuilder sb = new StringBuilder();
            List<GetNewStandardContactsDetailsByRowId_Result> list = new List<GetNewStandardContactsDetailsByRowId_Result>();
            list = db.GetNewStandardContactsDetailsByRowId(firmid, userid, pagenum, pagesize, 0, search, type, pageid, iscomorindv).ToList();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetNewContactsDetailsByRowId_Result newItem = new GetNewContactsDetailsByRowId_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Apply digital signature
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="signtype"></param>
        /// <param name="UserId"></param>
        /// <param name="DocNumber"></param>
        /// <param name="DocName"></param>
        /// <param name="username"></param>
        /// <param name="pageselect"></param>
        /// <param name="firmid"></param>
        /// <param name="digitalSingusername"></param>
        /// <returns></returns>
        public dynamic ApplyDigitalSign(string filename, string signtype, string UserId, string DocNumber, string DocName, string username, string pageselect, string firmid, string digitalSingusername)
        {
            dynamic output = null;
#pragma warning disable CS0219 // The variable 'fullpath' is assigned but its value is never used
            var fullpath = "";
#pragma warning restore CS0219 // The variable 'fullpath' is assigned but its value is never used
            try
            {
                Random ra = new Random();
                var ranew = ra.Next(1, 1000);
                var datetime = DateTime.Now.Date.Ticks;
                var refnum = "REFDB" + ranew + datetime;
                var pdffile = "";
                if (DocName.ToString() == "MykaseDrive")
                {
                    string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + UserId);
                    string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + UserId);
                    if (!Directory.Exists(fakepathin))
                    {
                        Directory.CreateDirectory(fakepathin);
                    }
                    if (!Directory.Exists(fakepathout))
                    {
                        Directory.CreateDirectory(fakepathout);
                    }
                    //get doc data
                    var db = new LawPracticeEntities();
                    var result = db.usp_GetViewFilesCloudById(Guid.Parse(firmid), DocNumber).FirstOrDefault();
                    if (result != null)
                    {
                        pdffile = AzureDocumentself.Dirfilepath(result.AZureFileId, result.fname, fakepathin, fakepathout, firmid, UserId);
                    }
                }
                else
                {
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Esign/" + firmid + "/" + UserId + "/" + filename);
                    FileInfo file = new FileInfo(folderPath);
                    if (file.Exists)
                    {
                        pdffile = file.FullName;
                        DocName = "Drive";
                    }
                }
                Byte[] bytes1 = File.ReadAllBytes(pdffile);
                String files = Convert.ToBase64String(bytes1);
                var sessionkey = DigitalSignature.GetNewSessionKey();
                DigitalSignatureModal digisign = new DigitalSignatureModal();
                digisign.AuthToken = WebConfigurationManager.AppSettings["DigiSignAuthtoke"].ToString();
                digisign.CUrl = WebConfigurationManager.AppSettings["Cancelurl"].ToString();
                digisign.CustomizeCoordinates = null;
                digisign.EnableDrawSignature = true;
                digisign.EnableeSignaturePad = true;
                digisign.Enablefontsignature = true;
                digisign.Enableuploadsignature = true;
                digisign.EnableViewDocumentLink = true;
                digisign.File = files;
                digisign.FileType = "PDF";
                digisign.FUrl = WebConfigurationManager.AppSettings["Errorurl"].ToString();
                digisign.IsCompressed = false;
                digisign.IsCosign = true;
                digisign.IsGSTN = true;
                digisign.IsGSTN3B = false;
                digisign.Name = digitalSingusername;
                digisign.PagelevelCoordinates = null;
                digisign.PageNumber = 0;
                digisign.PreviewRequired = true;
                digisign.ReferenceNumber = refnum;
                digisign.SelectPage = "First";
                digisign.SignaturePosition = "Top-Left";
                digisign.IsCustomized = true;
                digisign.SignatureType = signtype;
                digisign.Storetodb = true;
                digisign.SUrl = WebConfigurationManager.AppSettings["Successurl"].ToString() + Convert.ToBase64String(sessionkey) + "&userid=" + UserId + "&docname=" + filename + "&docnum=" + DocNumber + "&signtype=" + signtype + "&ftoken=" + firmid + "";
                string jsonresult = JsonConvert.SerializeObject(digisign);
                var hasdata = DigitalSignature.Generatehash256(jsonresult);
                var bytes = Encoding.UTF8.GetBytes(jsonresult);
                var step2 = DigitalSignature.EncryptDataAES(bytes, sessionkey);
                var step4 = DigitalSignature.EncryptDataAES(hasdata, sessionkey);
                string step5 = DigitalSignature.EncryptWithPublicKey(sessionkey);
                var arlist = new ArrayList();
                arlist.Add(step2);
                arlist.Add(step4);
                arlist.Add(step5);
                try
                {
                    // System.IO.File.Delete(pdffile);
                }
                catch
                {
                }
                return arlist;
            }
            catch (Exception ex)
            {
                LogService22(ex.Message + "@" + ex.StackTrace + "@" + ex.InnerException);
            }
            return output;
        }
        /// <summary>
        /// Apply cloud digital sign
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="signtype"></param>
        /// <param name="UserId"></param>
        /// <param name="DocNumber"></param>
        /// <param name="DocName"></param>
        /// <param name="username"></param>
        /// <param name="pageselect"></param>
        /// <param name="firmid"></param>
        /// <param name="digitalSingusername"></param>
        /// <param name="Filetype"></param>
        /// <param name="Uid"></param>
        /// <param name="Cordinatetype"></param>
        /// <returns></returns>
        public dynamic ApplyDigitalSignCloud(string filename, string signtype, string UserId, string DocNumber, string DocName, string username, string pageselect, string firmid, string digitalSingusername, string Filetype, string Uid, string Cordinatetype)
        {
            dynamic output = null;
            try
            {
                var db = new LawPracticeEntities();
                Random ra = new Random();
                var ranew = ra.Next(1, 1000);
                var refnum = "REFDB" + ranew;
                var pdffile = "";
                if (DocName == "PO")
                {
                    string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + UserId);
                    string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + UserId);
                    if (!Directory.Exists(fakepathin))
                    {
                        Directory.CreateDirectory(fakepathin);
                    }
                    if (!Directory.Exists(fakepathout))
                    {
                        Directory.CreateDirectory(fakepathout);
                    }
                    if (Filetype == "Signed")
                    {
                        List<get_digital_signature_value_Result> list_data = new List<get_digital_signature_value_Result>();
                        list_data = db.get_digital_signature_value(Uid, "", "", firmid).ToList();
                        string fakepathn = HttpContext.Current.Server.MapPath("~/azuredirout/" + list_data[0].FirmId + "/" + list_data[0].UserId);
                        var azurepath = list_data[0].FilePath;
                        var filename1 = list_data[0].FileName;
                        if (!Directory.Exists(fakepathn))
                        {
                            Directory.CreateDirectory(fakepathn);
                        }
                        pdffile = AzureDocumentself.Dirfilepathwithoutdecrypt(azurepath, filename1, fakepathn, list_data[0].FirmId, list_data[0].UserId);
                    }
                    //get doc data
                    else
                    {
                        var result = db.usp_GetViewFilesCloudById(Guid.Parse(firmid), DocNumber).FirstOrDefault();
                        if (result != null)
                        {
                            pdffile = AzureDocumentself.Dirfilepath(result.AZureFileId, result.fname, fakepathin, fakepathout, firmid, UserId);
                        }
                    }
                }
                else if (DocName == "Invoice")
                {
                    pdffile = System.Web.Hosting.HostingEnvironment.MapPath("~\\InvoicePdf\\" + filename + ".pdf");
                }
                else if (DocName == "PI")
                {
                    pdffile = System.Web.Hosting.HostingEnvironment.MapPath("~\\ProInvoicePdf\\" + filename + ".pdf");
                }
                FileInfo info = new FileInfo(pdffile);
                long length = info.Length;
                //Convert to KB
                var finalfilelengthKb = length / 1024;
                if (finalfilelengthKb > 10240) // 10MB
                {
                    try
                    {
                        File.Delete(pdffile);
                    }
                    catch
                    {
                    }
                    return "FileSizeExceed";
                }
                List<Sp_Get_Sign_Cordinate_Result> list_data1 = new List<Sp_Get_Sign_Cordinate_Result>();
                list_data1 = db.Sp_Get_Sign_Cordinate(Cordinatetype).ToList();
                string Cordinate_value = list_data1[0].cordinate;
                Byte[] bytes1 = File.ReadAllBytes(pdffile);
                String files = Convert.ToBase64String(bytes1);
                var sessionkey = DigitalSignature.GetNewSessionKey();
                DigitalSignatureModal digisign = new DigitalSignatureModal();
                digisign.AuthToken = WebConfigurationManager.AppSettings["DigiSignAuthtoke"].ToString();
                digisign.CUrl = WebConfigurationManager.AppSettings["Cancelurl"].ToString();
                digisign.CustomizeCoordinates = null;
                digisign.EnableDrawSignature = true;
                digisign.EnableeSignaturePad = true;
                digisign.Enablefontsignature = true;
                digisign.Enableuploadsignature = true;
                digisign.EnableViewDocumentLink = true;
                digisign.File = files;
                digisign.FileType = "PDF";
                digisign.FUrl = WebConfigurationManager.AppSettings["Errorurl"].ToString();
                digisign.IsCompressed = false;
                digisign.IsCosign = true;
                digisign.IsGSTN = true;
                digisign.IsGSTN3B = false;
                digisign.Name = digitalSingusername;
                digisign.PagelevelCoordinates = null;
                digisign.PageNumber = 0;
                digisign.PreviewRequired = true;
                digisign.ReferenceNumber = refnum;
                digisign.SelectPage = "First";
                digisign.SignaturePosition = "Top-Left";
                digisign.IsCustomized = true;
                digisign.SignatureType = signtype;
                digisign.Storetodb = true;
                digisign.SUrl = WebConfigurationManager.AppSettings["Successurlcloud"].ToString() + Convert.ToBase64String(sessionkey) + "&userid=" + UserId + "&docname=" + DocName + "&docnum=" + DocNumber + "&signtype=" + signtype + "&Username=" + digitalSingusername + "&Filetype=" + Filetype + "&Cordinatetype=" + Cordinatetype + "&Uid=" + Uid + "";
                string jsonresult = JsonConvert.SerializeObject(digisign);
                var hasdata = DigitalSignature.Generatehash256(jsonresult);
                var bytes = Encoding.UTF8.GetBytes(jsonresult);
                var step2 = DigitalSignature.EncryptDataAES(bytes, sessionkey);
                var step4 = DigitalSignature.EncryptDataAES(hasdata, sessionkey);
                string step5 = DigitalSignature.EncryptWithPublicKey(sessionkey);
                var arlist = new ArrayList();
                arlist.Add(step2);
                arlist.Add(step4);
                arlist.Add(step5);
                return arlist;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        private static void LogService22(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKasesign.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Digital signature
        /// </summary>
        /// <param name="step2"></param>
        /// <param name="step4"></param>
        /// <param name="step5"></param>
        /// <returns></returns>
        public static dynamic Digitalsign(dynamic step2, dynamic step4, dynamic step5)
        {
            string url = WebConfigurationManager.AppSettings["DigitalSignUrl"].ToString();
            var addfClient = new WebClient();
            object rawfile = new
            {
                Parameter1 = step5,
                Parameter2 = Convert.ToBase64String(step2),
                Parameter3 = Convert.ToBase64String(step4),
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            dynamic resid = addfClient.UploadString(url, "POST", builders);
            return resid;
        }
        /// <summary>
        /// Load user checkout directory by rowid
        /// </summary>
        /// <param name="pfile"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string UserCheckoutLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<sp_GetCheckOutFilesAndDirectorybyrowid_Result> list = new List<sp_GetCheckOutFilesAndDirectorybyrowid_Result>();
            list = db.sp_GetCheckOutFilesAndDirectorybyrowid(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, pageid).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetCheckOutFilesAndDirectorybyrowid_Result newItem = new sp_GetCheckOutFilesAndDirectorybyrowid_Result();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Cas eDashboard Reply Case Comm unique List
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="commuid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="brieffilter"></param>
        /// <param name="subjectfilter"></param>
        /// <returns></returns>
        public string CaseDashboardReplyCaseCommuniqueList(string firmid, string userid, string commuid, int pagenum, int pagesize, string brieffilter, string subjectfilter)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<usp_ReplyCaseCommuniquelist_Result> list = new List<usp_ReplyCaseCommuniquelist_Result>();
            list = db.usp_ReplyCaseCommuniquelist(firmid, userid, commuid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), "", "").ToList();
            StringBuilder sb = new StringBuilder();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Link new case with casewatch
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string BindCaseForCWMAP(string firmid, string userid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var list = db.GetNewCaseForLinkedCaseToCW(Guid.Parse(firmid), Guid.Parse(userid), 1, 1).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Direct save case with casewatch
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="matterid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string SaveCaseForCWMAP(string firmid, string userid, string matterid, string caseid)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var list = db.usp_SaveDirectCasetoCWMap(firmid, userid, matterid, caseid);
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Link case with notice for mapping
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="matterid"></param>
        /// <param name="noticeid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string SaveCaseForNoticeMAP(string firmid, string userid, string matterid, string noticeid, string type)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var list = db.usp_SaveLinkNoticetoMatter(firmid, userid, noticeid, matterid, type);
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// User Load Directory by rowid  Cloud for caseid
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string UserLoadDirectorybyrowidCloudforcaseid(string caseid, string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            List<sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_Result> list = new List<sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_Result>();
            list = db.sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, caseid, roleid, search, pageid).ToList();
            foreach (var data in list.ToList())
            {
                sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_Result newItem = new sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_Result();
                if (!string.IsNullOrEmpty(data.AZureFileId))
                {
                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get custom field history
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
            var db = new LawPracticeEntities();
            var list = db.usp_GetCustomFieldDataHistory(firmid, userid, ModuleType, vdate, pagenum, pagesize).ToList();
            var a = JsonConvert.SerializeObject(list);
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
            var db = new LawPracticeEntities();
            var list = db.usp_GetCustomFieldHistory(firmid, userid, ModuleType).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get header custom field history
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ModuleType"></param>
        /// <param name="vdate"></param>
        /// <returns></returns>
        public string CustomFieldHistoryHeader(string firmid, string userid, string ModuleType, string vdate)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_GetCustomFieldColumnHistory(firmid, userid, ModuleType, vdate).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load notice link to new case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loadNoticelinknewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            if (createdby == null)
            {
                createdby = "";
            }
            var list = db.GetNoticeLinkNewCaseDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, filtervalue, companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetNoticeLinkNewCaseDetailByRowId_Result newItem = new GetNoticeLinkNewCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get User Notice Link New Case Detail By Row Id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="roletype"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loaduserNoticelinknewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            if (createdby == "null")
            {
                createdby = "";
            }
            var list = db.GetUserNoticeLinkNewCaseDetailByRowIdNEW(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue), companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetUserNoticeLinkNewCaseDetailByRowIdNEW_Result newItem = new GetUserNoticeLinkNewCaseDetailByRowIdNEW_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load standard case list details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loadstandardcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            if (createdby == null)
            {
                createdby = "";
            }
            var list = db.GetNewStandardCaseDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, filtervalue, companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetNewCaseDetailByRowId_Result newItem = new GetNewCaseDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load user new standard case list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="odate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="court"></param>
        /// <param name="cstatus"></param>
        /// <param name="roletype"></param>
        /// <param name="createdby"></param>
        /// <param name="filtervalue"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjectype"></param>
        /// <param name="casefilternotes"></param>
        /// <returns></returns>
        public string loadusernewstandardcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes)
        {
            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            if (createdby == "null")
            {
                createdby = "";
            }
            var list = db.GetUserNewStandardCaseDetailByRowIdNEW(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue), companyname, mattertype, subjectype, casefilternotes).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetUserNewStandardCaseDetailByRowIdNEW_Result newItem = new GetUserNewStandardCaseDetailByRowIdNEW_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Standard User Search List By Row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="roleid"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string StandardUserSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search)
        {
            var db = new LawPracticeEntities();
            List<GetStandardSearchuserDetailsbyrowid_Result> list = new List<GetStandardSearchuserDetailsbyrowid_Result>();
            int pageid = 0;
            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("userlist")).FirstOrDefault();
            if (pagelist != null)
            {
                pageid = Convert.ToInt32(pagelist.ParentPage);
            }
            list = db.GetStandardSearchuserDetailsbyrowid(Guid.Parse(firmid), userid, pagenum, pagesize, 0, search, pageid).ToList();
            foreach (var data in list.ToList())
            {
                GetStandardSearchuserDetailsbyrowid_Result newItem = new GetStandardSearchuserDetailsbyrowid_Result();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                newItem.LoginId = Convert.ToBase64String(QueryAES.EncryptAes(data.LoginId.ToString()));
                list[list.IndexOf(data)].Id = newItem.Id;
                list[list.IndexOf(data)].LoginId = newItem.LoginId;
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Save trasfer work
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fromuser"></param>
        /// <param name="touser"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string SaveWorkTransfer(string firmid, string userid, string fromuser, string touser, string caseid)
        {
            var db = new LawPracticeEntities();
            dynamic list = 0;
            string[] values = caseid.Split(',');
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    //check case  count
                    var counttotalcase = db.Usp_GetMatterListByCreatorId(firmid, fromuser, 1).ToList();
                    for (int i = 0; i < values.Length; i++)
                    {
                        try
                        {
                            Guid.Parse(values[i]);
                            //update user from db
                            var result2 = db.usp_UpdateUserWorkTransfer(firmid, userid, fromuser, touser, values[i]);
                            if (result2 > 0)
                            {
                                list = db.usp_SaveSwitchWorkUserMap(firmid, userid, fromuser, touser, values[i]);
                                //save log from db
                                var result1 = db.usp_SaveUserWorkTransferLogData(firmid, userid, fromuser, touser, values[i]);
                            }
                        }
                        catch
                        {
                            list = -1;
                            transaction.Rollback();
                        }
                    }
                    var startdate = "";
                    var enddate = "";
                    var obj = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(fromuser)).FirstOrDefault();
                    var newobj = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(touser)).FirstOrDefault();
                    var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(firmid)).FirstOrDefault();
                    if (firmdates != null)
                    {
                        startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                        enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();
                    }
                    var addcaseUsername = WebConfigurationManager.AppSettings["matteridname"] + touser;
                    //update CW email mobile
                    var apiurl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                    string status = "";
                    if (obj != null)
                    {
                        if (!String.IsNullOrEmpty(apiurl))
                        {
                            var apiUrl = apiurl;
                            try
                            {
                                var addfClient = new WebClient();
                                object rawfile = new
                                {
                                    Accesstoken = "mykase123456789abcdef",
                                    Email = newobj.cemail,
                                    Memberuserid = addcaseUsername,
                                    Password = "MykaSe_PasSsword",
                                    Mobile = newobj.cmobile,
                                    Dispname = newobj.cfname,
                                    Countryname = newobj.country,
                                    StateName = newobj.cstate,
                                    Subscriptionstart = startdate,
                                    Subscriptionend = enddate
                                };
                                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                string builders = JsonConvert.SerializeObject(rawfile);
                                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);
                                dynamic data = JObject.Parse(resid);
                                status = data.Status;
                                string Message = data.Message;
                                string dataval = data.data;
                            }
                            catch
                            {
                                transaction.Rollback();
                            }
                            if (status == "True")
                            {
                                //map user table data
                                var insertusermap = db.sp_AddUserNeWCashwatch(firmid, touser, addcaseUsername);
                                //for all cases
                                if (counttotalcase.Count == values.Length)
                                {
                                    try
                                    {
#pragma warning disable CS0219 // The variable 'ds' is assigned but its value is never used
                                        string ds = "";
#pragma warning restore CS0219 // The variable 'ds' is assigned but its value is never used
                                        dynamic aff1 = 0;
                                        dynamic aff = 0;
                                        var fullname = obj.cfname;
                                        if (!String.IsNullOrEmpty(obj.cmname))
                                        {
                                            fullname = fullname + " " + obj.cmname;
                                        }
                                        if (!String.IsNullOrEmpty(obj.clname))
                                        {
                                            fullname = fullname + " " + obj.clname;
                                        }
                                        //add login data
                                        var addfClient = new WebClient();
                                        object rawfile = new
                                        {
                                            accesstoken = "mykase123456789abcdef",
                                            email = newobj.cemail,
                                            userid = "MyKase_" + fromuser,
                                            mobile = newobj.cmobile,
                                            Dispname = fullname,
                                            Countryname = obj.country,
                                            StateName = obj.cstate,
                                        };
                                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                        string builders = JsonConvert.SerializeObject(rawfile);
                                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                        string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateMyKaseProfile"), "POST", builders);
                                        dynamic data = JObject.Parse(resid);
                                        status = data.Status;
                                        string Message = data.Message;
                                        string dataval = data.data;
                                    }
                                    catch
                                    {
                                        transaction.Rollback();
                                    }
                                }
                                else
                                {
                                    //update userid
                                    //get caseid 
#pragma warning disable CS0219 // The variable 'joined' is assigned but its value is never used
                                    string joined = "";
#pragma warning restore CS0219 // The variable 'joined' is assigned but its value is never used
                                    for (int i = 0; i < values.Length; i++)
                                    {
                                        var caseids = db.usp_UserCasesMapCaseStatusMaster(values[i].ToString()).FirstOrDefault();
                                        if (caseids != null)
                                        {
                                            if (!String.IsNullOrEmpty(caseids.UserId))
                                            {
                                                if (caseids.UserId.ToString().ToLower() == touser.ToString().ToLower())
                                                {
                                                }
                                                else
                                                {
                                                    try
                                                    {
                                                        dynamic aff1 = 0;
                                                        dynamic aff = 0;
                                                        //add login data
                                                        var addfClient = new WebClient();
                                                        object rawfile = new
                                                        {
                                                            accesstoken = "mykase123456789abcdef",
                                                            UserId = "MyKase_" + caseids.UserId,
                                                            NewUserId = "MyKase_" + touser,
                                                            UserCaseId = caseids.UserCaseId.ToString(),
                                                        };
                                                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                                        string builders = JsonConvert.SerializeObject(rawfile);
                                                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                                        string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyUserIDUpdateforACase"), "POST", builders);
                                                        dynamic data = JObject.Parse(resid);
                                                        status = data.Status;
                                                        string Message = data.Message;
                                                        string dataval = data.data;
                                                        if (dataval != "Updated Successfully.")
                                                        {
                                                            transaction.Rollback();
                                                        }
                                                        else
                                                        {
                                                            var result = db.usp_SaveUserIDReplaceCWCasesWorkTransferLogData(firmid, userid, fromuser, touser, values[i]);
                                                        }
                                                    }
                                                    catch
                                                    {
                                                        transaction.Rollback();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    transaction.Commit();
                }
                catch
                {
                    list = -1;
                    transaction.Rollback();
                }
            }
            return list.ToString();
        }
        /// <summary>
        /// Remove work transfer
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public string RemoveWorkTransfer(string firmid, string userid, string id)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_RemoveSwitchWorkUserMap(firmid, userid, id);
            return list.ToString();
        }
        /// <summary>
        /// Get work transfer list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="PageNumber"></param>
        /// <param name="Pagesize"></param>
        /// <param name="fromuser"></param>
        /// <param name="touser"></param>
        /// <param name="casename"></param>
        /// <returns></returns>
        public string WorkTransferList(string firmid, string userid, int PageNumber, int Pagesize, string fromuser, string touser, string casename)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_SwitchWorkUserMapList(firmid, userid, PageNumber, Pagesize, fromuser, touser, casename).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get case list by creator
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="PageNumber"></param>
        /// <returns></returns>
        public string CaseListByCreator(string firmid, string userid, int PageNumber)
        {
            var db = new LawPracticeEntities();
            var list = db.Usp_GetMatterListByCreatorId(firmid, userid, PageNumber).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load column master choice
        /// </summary>
        /// <param name="modulename"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string LoadColumnMasterChoice(string modulename, string firmid)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_GetColumnMasterChoice(modulename, firmid).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Load column master choice by firm id
        /// </summary>
        /// <param name="modulename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string LoadColumnMasterChoiceByFirmId(string modulename, string firmid, string userid)
        {
            var db = new LawPracticeEntities();
            var list = db.usp_GetColumnMasterFirm(firmid, userid, modulename).ToList();
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Save column master choice
        /// </summary>
        /// <param name="modulename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ModuleIds"></param>
        /// <returns></returns>
        public string SaveColumnMasterChoice(string modulename, string firmid, string userid, string ModuleIds)
        {
            var db = new LawPracticeEntities();
            var cnt = 0;
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var cnts = db.usp_RemoveColumnMasterFirm(firmid, userid);
                    string[] values = ModuleIds.Split(',');
                    for (int i = 0; i < values.Length; i++)
                    {
                        if (!String.IsNullOrEmpty(values[i]))
                        {
                            var list = db.usp_SaveColumnMasterFirm(firmid, userid, values[i], modulename);
                            cnt = cnt + 1;
                        }
                    }
                    transaction.Commit();
                    return cnt.ToString();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Load common custom dropdown
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string LoadCustomCommonDropdown(string firmid, string userid, string type)
        {
            var db = new LawPracticeEntities();
            var matter = db.sp_CustomCommonDropdownList(firmid, userid, type).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Insert common dropdown
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="typename"></param>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public string InsertCommonDropdown(string firmid, string userid, string typename, string id, string type)
        {
            var db = new LawPracticeEntities();
            var matter = db.Usp_SaveCustomCommonDropdown(firmid, userid, typename, id, type);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Remove common dropdown
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fid"></param>
        /// <returns></returns>
        public string RemoveCommonDropdown(string firmid, string userid, string fid)
        {
            var db = new LawPracticeEntities();
            var matter = db.sp_RemoveCustomCommonDropdown(firmid, userid, fid);
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }
        /// <summary>
        /// Load case list by assign user and all
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="optype"></param>
        /// <param name="pageno"></param>
        /// <param name="SelectConType"></param>
        /// <param name="SelectContacts"></param>
        /// <returns></returns>
        public string LoadCaseListByAssignUserandAll(string firmid, string userid, string optype, string pageno, string SelectConType, string SelectContacts)
        {
            var db = new LawPracticeEntities();
            if (SelectConType == "0")
            {
                if (optype == "1")
                {
                    var list = db.Usp_GetAssignMatterListByUserId(firmid, userid, Convert.ToInt32(pageno));
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
                else
                {
                    var list = db.Usp_GetMatterListByFirmId(firmid, userid, Convert.ToInt32(pageno));
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
            }
            else
            {
                if (optype == "1")
                {
                    var list = db.Usp_GetAssignMatterListByUserId(firmid, SelectContacts, Convert.ToInt32(pageno));
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
                else
                {
                    var list = db.Usp_GetMatterListByFirmId(firmid, SelectContacts, Convert.ToInt32(pageno));
                    var a = JsonConvert.SerializeObject(list);
                    return a;
                }
            }
        }
        /// <summary>
        /// Save assign bulk case
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fromuser"></param>
        /// <param name="optype"></param>
        /// <param name="caseid"></param>
        /// <param name="SelectConType"></param>
        /// <param name="SelectContacts"></param>
        /// <returns></returns>
        public string SaveBulkCaseAssign(string firmid, string userid, string fromuser, string optype, string caseid, string SelectConType, string SelectContacts)
        {
            var db = new LawPracticeEntities();
            dynamic list = 0;
            var cnt1 = 0;
            if (SelectConType == "0")
            {
                try
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        if (optype == "0")
                        {
                            if (!String.IsNullOrEmpty(caseid))
                            {
                                try
                                {
                                    caseid = caseid.TrimEnd(',').TrimStart(',');
                                    cnt1 = db.Usp_SaveMultipleAssignCaseUser(firmid, userid, caseid, fromuser, 0);
                                    transaction.Commit();
                                }
                                catch
                                {
                                    transaction.Rollback();
                                }
                            }
                        }
                        else if (optype == "1")
                        {
                            var obj = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(fromuser)).FirstOrDefault();
                            var caseidtoken = db.usp_GetCWIdByMatterId(firmid, userid, caseid).FirstOrDefault();
                            var apiurl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                            if (!String.IsNullOrEmpty(caseidtoken))
                            {
                                var resid = AddCaseCaseWatch.SaveCaseAlertUser(fromuser, userid, firmid, apiurl, caseidtoken,0,"");
                                if (resid == "True")
                                {
                                    cnt1 = 1;
                                    transaction.Commit();
                                }
                            }
                            else
                            {
                                transaction.Commit();
                            }
                        }
                    }
                    return cnt1.ToString();
                }
                catch (Exception ex)
                {
                    return ex.Message.ToString();
                }
            }
            else if (SelectConType == "1")
            {
                try
                {
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        if (optype == "0")
                        {
                            if (!String.IsNullOrEmpty(caseid))
                            {
                                try
                                {
                                    caseid = caseid.TrimEnd(',').TrimStart(',');
                                    //external usermap
                                    cnt1 = db.Usp_SaveMultipleAssignCaseUser(firmid, userid, caseid, SelectContacts, 5);
                                    var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, SelectContacts.ToString()).FirstOrDefault();
                                    if (String.IsNullOrEmpty(getusersdata1.LoginId))
                                    {
                                        var cfname = getusersdata1.fname + " " + getusersdata1.mname + " " + getusersdata1.lname;
                                        string uemail = getusersdata1.cemail;
                                        string mobile = getusersdata1.mobno;
                                        string Designation = getusersdata1.Designation;
                                        string landline = getusersdata1.offno;
                                        string address = getusersdata1.cadd1;
                                        var newclientid = "";
                                        ObjectParameter IDParameter2;
                                        IDParameter2 = new ObjectParameter("id", newclientid);
                                        var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata1.loguser.ToString(), "Client", false, false, false, null, null, 3, "dashboard", getusersdata1.cemail, IDParameter2, getusersdata1.CompanyId);
                                        newclientid = Convert.ToString(IDParameter2.Value);
                                        if (rs2 > 0)
                                        {
                                            //insert in regusers
                                            var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata1.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata1.Country, getusersdata1.State, getusersdata1.City, "3", landline, getusersdata1.CompanyId.ToString(), Designation, SelectContacts.ToString(), getusersdata1.fname, getusersdata1.mname, getusersdata1.lname, getusersdata1.Pin, null);
                                            //update type in contact
                                            var chkt = db.usp_updateContactsProfiletypeToClient(firmid, getusersdata1.loguser.ToString(), SelectContacts.ToString());
                                        }
                                    }
                                    transaction.Commit();
                                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                                {
                                    transaction.Rollback();
                                }
                            }
                        }
                        else if (optype == "1")
                        {
                            var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, SelectContacts.ToString()).FirstOrDefault();
                            if (!String.IsNullOrEmpty(getusersdata1.LoginId))
                            {
                                var caseidtoken = db.usp_GetCWIdByMatterId(firmid, userid, caseid).FirstOrDefault();
                                var apiurl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                                if (!String.IsNullOrEmpty(caseidtoken))
                                {
                                    var resid = AddCaseCaseWatch.SaveCaseAlertUser(getusersdata1.LoginId, userid, firmid, apiurl, caseidtoken,0,"");
                                    if (resid == "True")
                                    {
                                        cnt1 = 1;
                                        transaction.Commit();
                                    }
                                }
                                else
                                {
                                    transaction.Commit();
                                }
                            }
                        }
                    }
                    return cnt1.ToString();
                }
                catch (Exception ex)
                {
                    return ex.Message.ToString();
                }
            }
            else
            {
                return "Invalid Type";
            }
        }
        /// <summary>
        /// Save expense status
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="expenseids"></param>
        /// <returns></returns>
        public string SaveExpenseStatus(string firmid, string userid, string expenseids)
        {
            var db = new LawPracticeEntities();
            try
            {
                var cnt = db.sp_updateExpenseStatus(firmid, userid, expenseids);
                var a = JsonConvert.SerializeObject(cnt);
                return a;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Save expense payment
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="expenseid"></param>
        /// <param name="payobj"></param>
        /// <returns></returns>
        public string SaveExpensePayment(string firmid, string userid, string expenseid, string payobj)
        {
            using (var db = new LawPracticeEntities())
            {
                using (DbContextTransaction transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //insert payment entry 
                        if (payobj != "[]")
                        {
                            List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(payobj);
                            if (payobj1.Count > 0)
                            {
                                for (var i = 0; i < payobj1.Count; i++)
                                {
                                    var paymenttype = payobj1[i].PaymentType;
                                    db.SaveExpensePayment(firmid, userid, expenseid, payobj1[i].PaymentType, payobj1[i].PaymentMode, Convert.ToInt32(payobj1[i].Amount), payobj1[i].PDate, payobj1[i].BankName, payobj1[i].DdNo, payobj1[i].Ddidate, payobj1[i].ChequeNo, payobj1[i].RefNo, payobj1[i].Chqidate, payobj1[i].OtherDetails, 1);
                                }
                            }
                        }
                        transaction.Commit();
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                        transaction.Rollback();
                    }
                }
            }
            return "a";
        }
        /// <summary>
        /// Unlink casewatch case For Live cases
        /// </summary>
        /// <param name="usercaseid"></param>
        /// <param name="caseid"></param>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <param name="dburl"></param>
        /// <param name="apiurl"></param>
        /// <returns></returns>
        public string unlinkcasewatchcaseForLivecase(string usercaseid, string caseid, string firmid, string uid,
            string dburl, string apiurl, int IsCWUser)
        {
            var db = new LawPracticeEntities();
            var result = false;
            string did = "";
            string AccessTokenDetail = string.Empty;
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    if (usercaseid != null && caseid == "")
                    {
                        try
                        {
                            //var cnt1 = db.usp_RemoveSearchbyPartyNameCase(Guid.Parse(firmid), Guid.Parse(uid), usercaseid.ToString());
                            var addfClientd = new WebClient();
                            if (IsCWUser == 1)
                            {
                                AccessTokenDetail = "internal";
                            }
                            else
                            {
                                AccessTokenDetail = "mykase123456789abcdef";
                            }

                            object rawfiled = new
                            {
                                Accesstoken = AccessTokenDetail,
                                UserCaseId = usercaseid,
                                istatus = "1"
                            };
                            addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                            string buildersd = JsonConvert.SerializeObject(rawfiled);
                            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                            string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/UpdateIsDeleteLiveTrack"), "POST", buildersd);
                            dynamic data = JObject.Parse(residd);
                            string status = data.Status;
                            string Message = data.Message;
                            string dataval = data.data;
                            if (dataval == "Done Successfully")
                            {
                                result = true;
                                transaction.Commit();
                            }
                            else
                            {
                                transaction.Rollback();
                                return "0";
                            }
                        }
                        catch
                        {
                            transaction.Rollback();
                        }
                        finally
                        {
                        }
                        return result.ToString();
                    }
                    else
                    {
                        var did1 = caseid;
                        if (usercaseid != null)
                        {
                            did = did1;
                        }
                        else
                        {
                            did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                        }
                        //Check IsRevenue Case or NOt
                        dynamic IsRev = 0;
                        var IsRevenueCheck = db.usp_CaseBasicDetails(firmid, uid, did).FirstOrDefault();
                        if (IsRevenueCheck != null)
                        {
                            IsRev = IsRevenueCheck.IsRevenueCourt;
                        }
                        if (IsRev == 1)
                        {
                            var datamap = db.usp_getmapRevenuecaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                            if (datamap != null)
                            {
                                try
                                {
                                    var chkdlt = db.usp_RemoveMapRevenueCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                    db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                    var residd = AddCaseCaseWatch.RemoveRevenueCasebyUserCaseId(uid, datamap.ToString(), apiurl);
                                    dynamic data = JObject.Parse(residd);
                                    string status = data.Status;
                                    string Message = data.Message;
                                    string dataval = data.data;
                                    if (dataval == "Deleted Successfully")
                                    {
                                        result = true;
                                        transaction.Commit();
                                    }
                                    else
                                    {
                                        transaction.Rollback();
                                        return "0";
                                    }
                                }
                                catch
                                {
                                    transaction.Rollback();
                                }
                                finally
                                {
                                    // transaction.Rollback();
                                }
                            }
                            return result.ToString();
                        }
                        else
                        {
                            var datamap = db.usp_getmapcaseid(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did)).FirstOrDefault();
                            if (datamap != null)
                            {
                                try
                                {
                                    var chkdlt = db.usp_RemoveMapCase(Guid.Parse(firmid), Guid.Parse(uid), Guid.Parse(did));
                                    db.insertdeleteentrytable(Guid.Parse(did), "tblUserCasesMapCaseStatusMaster", Guid.Parse(firmid));
                                    var cnt1 = db.usp_RemoveSearchbyPartyNameCase(Guid.Parse(firmid), Guid.Parse(uid), datamap.ToString());
                                    var addfClientd = new WebClient();
                                    object rawfiled = new
                                    {
                                        Accesstoken = "mykase123456789abcdef",
                                        id = datamap,
                                    };
                                    addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                    string buildersd = JsonConvert.SerializeObject(rawfiled);
                                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                    string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/RemoveCasebyAdminUser"), "POST", buildersd);
                                    dynamic data = JObject.Parse(residd);
                                    string status = data.Status;
                                    string Message = data.Message;
                                    string dataval = data.data;
                                    if (dataval == "Deleted Successfully")
                                    {
                                        result = true;
                                        transaction.Commit();
                                    }
                                    else
                                    {
                                        transaction.Rollback();
                                        return "0";
                                    }
                                }
                                catch
                                {
                                    transaction.Rollback();
                                }
                                finally
                                {
                                }
                            }
                            return result.ToString();
                        }
                    }
                }
                catch (Exception er)
                {
                    transaction.Rollback();
                    return er.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Remove contact list
        /// </summary>
        /// <param name="companyids"></param>
        /// <param name="cids"></param>
        /// <param name="firmids"></param>
        /// <returns></returns>
        public string Removecontactslist(string companyids, string cids, string firmids)
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    int ctd = db.usp_Removecompanycontacts(firmids, companyids, cids);
                    var a = JsonConvert.SerializeObject(ctd);
                    transaction.Commit();
                    return a;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Update time entry status
        /// </summary>
        /// <param name="tids"></param>
        /// <param name="statusval"></param>
        /// <param name="firmids"></param>
        /// <returns></returns>
        public string Updatetimeentrystatus(string tids, string statusval, string firmids)
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    int ctd = db.usp_UpdateTimeEntryStatus(tids, statusval, firmids);
                    var a = JsonConvert.SerializeObject(ctd);
                    transaction.Commit();
                    return a;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Change time entry status
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string ChangeTimeEntryStatus(string[] typeIds, string firmid)
        {
            dynamic result = null;
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    foreach (string did1 in typeIds)
                    {
                        string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                        int ctd = db.usp_ChangeTimeEntryStatus(did, firmid);
                        result = JsonConvert.SerializeObject(ctd);
                    }
                    transaction.Commit();
                    var a = JsonConvert.SerializeObject(result);
                    return a;
                }
                catch (Exception er)
                {
                    transaction.Rollback();
                    return er.Message.ToString();
                }
            }
        }
        //For Litigation case Add Live update 
        public string LitigationAddCaseToCW(string firmid, string userid, string divSCHCDistrict, string drpcourtname, string drpdistrictcourtname,
            string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, string useremail, string usermobile, string apiurl,
            string caseinfo, string usertypes, string clientid, string casename, string caseno, string clientcontact, string casetype, string auserid,
            string details, string username, string confirmPassword, string checkclient, string files, string odate, string RoleId,
            string companyIds, string assignuser, string Courtname, string OtherCourtName, string drpdcourtcnr1,int IsCWUser, string CWUserId)
        {
            var db = new LawPracticeEntities();
            var caseid = "";
            // if already exist client
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var ds = "false";
                    var datastatus = "";
                    //save to casewatch
                    if (drpcourtname.ToString() == "" || drpcourtname.ToString() == null || drpcourtname.ToString() == "null")
                    {
                        transaction.Commit();
                        return caseid.ToString();
                    }
                    else
                    {
                        if (String.IsNullOrEmpty(drpdcourtcnr))
                        {
                            if (divSCHCDistrict.ToString() == "5")// for append court
                            {
                                ds = AddCaseCaseWatch.InsertCaseDetailNewAppendCourt_1(obj, 0, useremail, usermobile, firmid, userid, apiurl, "", IsCWUser, CWUserId);
                            }
                            else if (divSCHCDistrict.ToString() == "6")// for Revenue court
                            {
                                ds = RevenueCase.AddRevenueCase_1(firmid, userid, useremail, usermobile, obj.Username, obj.Casetype, obj.Caseno, 
                                    obj.Caseyear, obj.RevenueCourt, obj.RevenueMandal, obj.RevenueJanpad, obj.RevenueTahsil, 
                                    obj.RevenueCourtName, obj.RefNo, "", IsCWUser, CWUserId);
                            }
                            else if (divSCHCDistrict.ToString() == "7")// for Rera court
                            {
                                ds = AddCaseCaseWatch.AddReraCase_1(firmid, userid, useremail, usermobile, obj.Username, obj.ReraCourt, 
                                    obj.Reracasetype,obj.Reracasno, obj.Reracaseyear, obj.ReraRefNo, apiurl, "", IsCWUser, CWUserId);
                            }
                            else
                            {
                                if (divSCHCDistrict.ToString() != "3")
                                {
                                    if (drpcourtname.ToString() != "0")//For highCourt,Supreme court,Tribunals Addition
                                    {
                                        ds = AddCaseCaseWatch.InsertCaseDetailNew_1(obj, 0, useremail, usermobile, firmid, userid, apiurl, "", IsCWUser, CWUserId);
                                    }
                                }
                                else//For District court Addition
                                {
                                    if (divSCHCDistrict.ToString() == "3")
                                    {
                                        ds = AddCaseCaseWatch.InsertCaseDetailNew_1(obj, 1, useremail, usermobile, firmid, userid, apiurl, "", IsCWUser, CWUserId);
                                    }
                                }
                            }
                            if (ds == "false")
                            {
                                datastatus = "emailexist";
                            }
                            else
                            {
                                if (divSCHCDistrict.ToString() == "6")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string Newcaseid = data1.usercaseid;
                                    string dbmessage = data1.data;
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        //var matterid = SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details,
                                        //    username, confirmPassword, checkclient, files, odate, RoleId, companyIds, assignuser);
                                        string matterid = "";
                                        matterid = SaveCommonMatter(firmid, userid, usertypes, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                                        //from Auto Assigned case to mykase 
                                        try
                                        {
                                            if (matterid != "")
                                            {
                                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                                if (list.Count > 0)
                                                {
                                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                                    // AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, Newcaseid.ToString(), IsCWUser,CWUserId);
                                                    AddCaseCaseWatch.SaveCaseAlertUserRevenue(auserids, userid, firmid, apiurl, Newcaseid.ToString(), IsCWUser, CWUserId);
                                                }
                                            }
                                        }
                                        catch { }
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 1, 0);
                                        //try
                                        //{
                                        //    if (divSCHCDistrict.ToString() != "6")// for Revenue court
                                        //    {
                                         //       var result = AddCaseCaseWatch.UploadNotesByCaseId(Newcaseid.ToString(), obj.Username.ToString(), "", apiurl);
                                        //    }
                                        //}
                                        //catch (Exception)
                                        //{
                                        //}
                                        datastatus = matterid;
                                    }
                                }
                                //for Rera court
                                else if (divSCHCDistrict.ToString() == "7")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string Newcaseid = data1.usercaseid;
                                    string dbmessage = data1.data;
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        //var matterid = SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details,
                                        //  username, confirmPassword, checkclient, files, odate, RoleId, companyIds, assignuser);
                                        string matterid = "";
                                        matterid = SaveCommonMatter(firmid, userid, usertypes, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                                        //from Auto Assigned case to mykase 
                                        try
                                        {
                                            if (matterid != "")
                                            {
                                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                                if (list.Count > 0)
                                                {
                                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                                    // AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, Newcaseid.ToString(), IsCWUser, CWUserId);
                                                    AddCaseCaseWatch.SaveCaseAlertUserForRera(auserids, userid, firmid, apiurl, Newcaseid.ToString(), IsCWUser, CWUserId);
                                                }
                                            }
                                        }
                                        catch { }
                                        // var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 0, 0);
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(Newcaseid.ToString()), matterid.ToString(), userid, 0, 1);
                                        datastatus = matterid;
                                        //try
                                        //{
                                        //    if (divSCHCDistrict.ToString() == "7")// for Rera court
                                        //    {
                                        //        var result = AddCaseCaseWatch.ReraUploadNotesByCaseId(Newcaseid.ToString(), obj.Username.ToString(), "", apiurl);
                                        //    }
                                        //}
                                        //catch (Exception) { }
                                    }
                                }
                                else if (divSCHCDistrict.ToString() == "5")
                                {
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string dbstatus = "";
                                    string dbmessage = "";
                                    if (Message1.ToString() == "Sorry! Unable to Add now.")
                                    {
                                        datastatus = Message1.ToString();
                                        transaction.Rollback();
                                        return datastatus;
                                    }
                                    else
                                    {
                                        //dbstatus = data1.Status;
                                        //dbmessage = data1.data;
                                        try
                                        {
                                            dbstatus = data1.data[0].dbStatus;
                                            dbmessage = data1.data[0].dbMessage;
                                        }
                                        catch
                                        {
                                            dbstatus = data1.caseid;
                                            dbmessage = data1.data;
                                        }
                                    }
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        //var matterid = SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details,
                                        //username, confirmPassword, checkclient, files, odate, RoleId, companyIds, assignuser);
                                        string matterid = "";
                                        matterid = SaveCommonMatter(firmid, userid, usertypes, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                                        var ctss = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 0, 0);
                                        //from Auto Assigned case to mykase 
                                        try
                                        {
                                            if (matterid != "")
                                            {
                                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                                if (list.Count > 0)
                                                {
                                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, dbstatus.ToString(), IsCWUser, CWUserId);
                                                }
                                            }
                                        }
                                        catch { }
                                        //save search by party name cass in db
                                        var ctt1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, caseinfo, obj.Caseno, obj.Casetype, obj.Caseyear, obj.Court);
                                        datastatus = matterid;
                                        //for Adding the Notes Details
                                       // var result = AddCaseCaseWatch.UploadNotesByCaseId(dbstatus.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl);
                                    }
                                }
                                else
                                {
                                    // add district cnr
                                    if (divSCHCDistrict.ToString() == "3" || divSCHCDistrict.ToString() == "2")
                                    {
                                        dynamic data2 = JObject.Parse(ds);
                                        string dbcaseid = data2.caseid;
                                        var usernameids = userid;
                                        if (!String.IsNullOrEmpty(drpdcourtcnr))
                                        {
                                            //  ds = AddCaseCaseWatch.InsertDistrictCNR(firmid, usernameids, dbcaseid, drpdcourtcnr, apiurl, useremail, usermobile, obj.Username);
                                            ds = AddCaseCaseWatch.InsertDistrictCNR_1(firmid, usernameids, dbcaseid, drpdcourtcnr, apiurl, 
                                                useremail, usermobile, obj.Username, "", IsCWUser, CWUserId);
                                        }
                                    }
                                    dynamic data1 = JObject.Parse(ds);
                                    string status1 = data1.Status;
                                    string Message1 = data1.Message;
                                    string dbstatus = "";
                                    string dbmessage = "";
                                    if (Message1.ToString() == "Sorry! Unable to Add now.")
                                    {
                                        datastatus = Message1.ToString();
                                        transaction.Rollback();
                                        return "datastatus";
                                    }
                                    else
                                    {
                                        try
                                        {
                                            dbstatus = data1.data[0].dbStatus;
                                            dbmessage = data1.data[0].dbMessage;
                                        }
                                        catch
                                        {
                                            dbstatus = data1.caseid;
                                            dbmessage = data1.data;
                                        }
                                    }
                                    if (dbmessage.ToString() == "Exist")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = "false";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = dbmessage.ToString();
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                    {
                                        // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                        datastatus = datastatus = "livecaselimitexceed";
                                        transaction.Rollback();
                                        return datastatus.ToString();
                                    }
                                    else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                    {
                                        //var matterid = SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details,
                                        //username, confirmPassword, checkclient, files, odate, RoleId, companyIds, assignuser);
                                        string matterid = "";
                                        matterid = SaveCommonMatter(firmid, userid, usertypes, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 0, 0);
                                        //from Auto Assigned case to mykase 
                                        try
                                        {
                                            if (matterid != "")
                                            {
                                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                                if (list.Count > 0)
                                                {
                                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, dbstatus.ToString(), IsCWUser, CWUserId);
                                                }
                                            }
                                        }
                                        catch { }
                                        //save search by party name cass in db
                                        var ct1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, caseinfo, obj.Caseno, obj.Casetype, obj.Caseyear, obj.Court);
                                        datastatus = matterid;

                                        //for Adding the Notes Details
                                       // var result = AddCaseCaseWatch.UploadNotesByCaseId(dbstatus.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl);
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (divSCHCDistrict.ToString() == "3" || divSCHCDistrict.ToString() == "2")
                            {
                                var usernameids = userid;
                                if (!String.IsNullOrEmpty(drpdcourtcnr))
                                {
                                    ds = AddCaseCaseWatch.InsertDistrictCNR_1(firmid, usernameids, "", drpdcourtcnr, apiurl, useremail, usermobile, obj.Username, "", IsCWUser, CWUserId);
                                }
                            }
                            if (ds == "false")
                            {
                                datastatus = "emailexist";
                            }
                            else
                            {
                                dynamic data1 = JObject.Parse(ds);
                                string status1 = data1.Status;
                                string Message1 = data1.Message;
                                string dbmessage = "";
                                if (Message1.ToString() == "Sorry! Unable to Add now.")
                                {
                                    datastatus = Message1.ToString();
                                    transaction.Rollback();
                                    datastatus = "false";
                                    return datastatus.ToString();
                                }
                                else
                                {
                                    try
                                    {
                                        //dbstatus = data1.data[0].dbStatus;
                                        datastatus = data1.data[0].dbStatus.ToString();
                                        dbmessage = data1.data[0].dbMessage;
                                    }
                                    catch
                                    {
                                        datastatus = data1.caseid;
                                        dbmessage = data1.data;
                                    }
                                }
                                if (dbmessage.ToString() == "Exist")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = "false";
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = "livecaselimitexceed";
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                                {
                                    // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                                    datastatus = dbmessage.ToString();
                                    transaction.Rollback();
                                    return datastatus.ToString();
                                }
                                else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                                {
                                    // var matterid = SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details,
                                    //username, confirmPassword, checkclient, files, odate, RoleId, companyIds, assignuser);

                                    string matterid = "";
                                    matterid = SaveCommonMatter(firmid, userid, usertypes, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                                    var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(datastatus), matterid, userid, 0, 0);
                                    //from Auto Assigned case to mykase 
                                    try
                                    {
                                        if (matterid != "")
                                        {
                                            List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                            list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                            if (list.Count > 0)
                                            {
                                                string auserids = string.Join(",", list.Select(x => x.auser));
                                                AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, datastatus, IsCWUser, CWUserId);
                                            }
                                        }
                                    }
                                    catch { }
                                    //insert cnr in mykase map table
                                    var insertusermap = db.usp_savecaselinkentry(firmid, matterid, drpdcourtcnr, userid);
                                    try
                                    {
                                        if (drpdistrictcourtname == "null")
                                        {
                                            drpdistrictcourtname = "";
                                        }
                                        if (!String.IsNullOrEmpty(drpdistrictcourtname))
                                        {
                                            Tbl_CaseDistrict tbl1 = new Tbl_CaseDistrict();
                                            tbl1.caseId = Guid.Parse(matterid);
                                            tbl1.Firmid = Guid.Parse(firmid);
                                            tbl1.Userid = Guid.Parse(userid);
                                            tbl1.districtid = drpdistrictcourtname.ToString();
                                            tbl1.districtname = drpdistrictcourtfullname.ToString();
                                            tbl1.date_time = DateTime.Now;
                                            var rslt = db.usp_savecasedistrict(tbl1.Firmid.ToString(), tbl1.Userid.ToString(), tbl1.caseId.ToString(), tbl1.districtid.ToString(), tbl1.districtname.ToString());
                                        }
                                    }
                                    catch (Exception) { }
                                    datastatus = matterid;

                                    //for Adding the Notes Details
                                  //  var result = AddCaseCaseWatch.UploadNotesByCaseId(datastatus.ToString(), obj.Username.ToString(), obj.Casedetail, apiurl);
                                }
                            }
                        }
                        transaction.Commit();
                        return datastatus;
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Litigation search case Add to Live Tracking
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="apiurl"></param>
        /// <param name="RoleId"></param>
        /// <param name="Cnrnos"></param>
        /// <param name="Casetypes"></param>
        /// <param name="Casenos"></param>
        /// <param name="Caseyears"></param>
        /// <param name="DiaryNos"></param>
        /// <param name="Courts"></param>
        /// <param name="BenchIDs"></param>
        /// <param name="StateIds"></param>
        /// <param name="Districtids"></param>
        /// <param name="Courttypes"></param>
        /// <param name="casenames"></param>
        /// <param name="mhearingdates"></param>
        /// <param name="madvocatenames"></param>
        /// <param name="Courtcompestbtypes"></param>
        /// <param name="Courtcompestbcourts"></param>
        /// <param name="suffix"></param>
        /// <param name="mkcasenames"></param>
        /// <param name="teammemberlist"></param>
        /// <param name="Username"></param>
        /// <returns></returns>
        public string SearchAddCaseToLiveupdate(string firmid, string userid, string useremail, string usermobile, string apiurl,
            string RoleId, string Cnrnos, string Casetypes, string Casenos, string Caseyears, string AppealNo, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames, string mhearingdates,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, string mkcasenames,
            string teammemberlist, string Username, string caseExternalNo, string courtName, string OtherCourtName, int IsCWUser, string CWUserId, string stampReg, string sideId, string matterid)
        {
            var db = new LawPracticeEntities();
            var caseid = "";
            // if already exist client
            try
            {
                var ds = "false";
                var datastatus = "";
                string clientid = "00000000-0000-0000-0000-000000000000";
                string casetype = "42";
                string auserid = "00000000-0000-0000-0000-000000000000";
                string odates = DateTime.Now.Date.ToString();
                //save to casewatch
                if (Courts.ToString() == "" || Courts.ToString() == null || Courts.ToString() == "null")
                {
                    return caseid.ToString();
                }
                else
                {
                    if (String.IsNullOrEmpty(Cnrnos))
                    {
                        if (Courts == "CF")
                        {
                            Casenos = AppealNo;
                            Casetypes = "";
                        }
                        ds = AddCaseCaseWatch.SearchAddCaseToTracking(Cnrnos, Casetypes, Casenos, Caseyears, Courts,
                         BenchIDs, StateIds, Districtids, Courttypes, casenames, madvocatenames, Courtcompestbtypes,
                         Courtcompestbcourts, suffix, 0, useremail, usermobile, firmid, userid, apiurl, Username, stampReg, sideId, IsCWUser, CWUserId);
                        dynamic data1 = JObject.Parse(ds);
                        string status1 = data1.Status;
                        string Message1 = data1.Message;
                        string dbstatus = "";
                        string dbmessage = "";
                        if (Message1.ToString() == "Sorry! Unable to Add now.")
                        {
                            datastatus = Message1.ToString();
                            return "datastatus";
                        }

						else if (Message1.ToString() == "Invalid email")
                        {
                            datastatus = Message1.ToString();
                            return datastatus.ToString();
                        }
                        else if (Message1.ToString() == "Invalid member mobile")
                        {
                            datastatus = Message1.ToString();
                            return datastatus.ToString();
                        }                        
						else
                        {
                            try
                            {
                                dbstatus = data1.data[0].dbStatus;
                                dbmessage = data1.data[0].dbMessage;
                            }
                            catch
                            {
                                dbstatus = data1.caseid;
                                dbmessage = data1.data;
                            }
                        }
                        if (dbmessage.ToString() == "Exist")
                        {
                            datastatus = "false";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                        {
                            datastatus = dbmessage.ToString();
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                        {
                            // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                            datastatus = "livecaselimitexceed";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                        {
                            try
                            {
                                //var matterid = "";
                                //Add case to mykase DB
                                //var matterid = SaveShortCase(firmid, userid, null, clientid, mkcasenames, null, null, casetype, auserid, null,
                                //  null, "", "", "", odates, RoleId, "", teammemberlist);
                                if (string.IsNullOrEmpty(matterid))
                                {
                                    matterid = SaveCommonMatter(firmid, userid, null, mkcasenames, caseExternalNo, "42", auserid, RoleId, teammemberlist, courtName, OtherCourtName, Cnrnos);

                                }
                                //Map Mk case to CW Case
                                var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 0, 0);
                                //Case Assign to MK and CW.
                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                if (list.Count > 0)
                                {
                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, dbstatus,IsCWUser, CWUserId);
                                }
                                //save search by party name cass in db
                                var ct1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, null, Casenos, Casetypes, Caseyears, Courts);
                                datastatus = matterid;
                            }
                            catch { }
                        }
                    }
                    else
                    {
                        var usernameids = userid;
                        if (!String.IsNullOrEmpty(Cnrnos))
                        {
                            ds = AddCaseCaseWatch.SearchAddCaseToTrackingWithCNR(Cnrnos, Casetypes, Casenos, Caseyears, AppealNo, Courts,
                            BenchIDs, StateIds, Districtids, Courttypes, casenames, madvocatenames, Courtcompestbtypes,
                            Courtcompestbcourts, suffix, 0, useremail, usermobile, firmid, userid, apiurl, Username, IsCWUser, CWUserId);
                        }
                        dynamic data1 = JObject.Parse(ds);
                        string status1 = data1.Status;
                        string Message1 = data1.Message;
                        string dbmessage = "";
                        if (Message1.ToString() == "Sorry! Unable to Add now.")
                        {
                            datastatus = Message1.ToString();
                            datastatus = "false";
                            return datastatus.ToString();
                        }
                        else
                        {
                            try
                            {
                                datastatus = data1.data[0].dbStatus.ToString();
                                dbmessage = data1.data[0].dbMessage;
                            }
                            catch
                            {
                                datastatus = data1.caseid;
                                dbmessage = data1.data;
                            }
                        }
                        if (dbmessage.ToString() == "Exist")
                        {
                            datastatus = "false";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                        {
                            // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                            datastatus = "livecaselimitexceed";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                        {
                            datastatus = dbmessage.ToString();
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                        {
                            //Assign case to user
                            try
                            {
                                //Add case to mykase DB
                                //var matterid = SaveShortCase(firmid, userid, null, clientid, mkcasenames, null, null, casetype, auserid, null,
                                //null, "", "", "", odates, RoleId, "", teammemberlist);
                                if (string.IsNullOrEmpty(matterid))
                                {
                                    matterid = SaveCommonMatter(firmid, userid, null, mkcasenames, caseExternalNo, "42", auserid, RoleId, teammemberlist, courtName, OtherCourtName, Cnrnos);

                                }
                                //Map Mk case to CW Case
              
                                var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(datastatus), matterid, userid, 0, 0);
                                //Case Assign to MK and CW.
                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                if (list.Count > 0)
                                {
                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, datastatus, IsCWUser, CWUserId);
                                }
                                //insert cnr in mykase map table
                                var insertusermap = db.usp_savecaselinkentry(firmid, matterid, Cnrnos, userid);
                                datastatus = matterid;
                            }
                            catch { }
                        }
                    }
                    return datastatus;
                }
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        public string SearchAddCaseToLiveupdateRERH(string firmid, string userid, string useremail, string usermobile, string apiurl,
            string RoleId, string Cnrnos, string Casetypes, string Casenos, string Caseyears, string AppealNo, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames, string mhearingdates,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, string mkcasenames,
            string teammemberlist, string Username, string caseExternalNo, string courtName, string OtherCourtName, int IsCWUser, string CWUserId, string stampReg, string sideId, string matterid, string Appres, string appealNo,
                         string District, string CourtType, string courtNameR, string Status)
        {
            var db = new LawPracticeEntities();
            var caseid = "";
            // if already exist client
            try
            {
                var ds = "false";
                var datastatus = "";
                string clientid = "00000000-0000-0000-0000-000000000000";
                string casetype = "42";
                string auserid = "00000000-0000-0000-0000-000000000000";
                string odates = DateTime.Now.Date.ToString();
                //save to casewatch
                if (Courts.ToString() == "" || Courts.ToString() == null || Courts.ToString() == "null")
                {
                    return caseid.ToString();
                }
                else
                {
                    if (String.IsNullOrEmpty(Cnrnos))
                    {
                        if (Courts == "CF")
                        {
                            Casenos = AppealNo;
                            Casetypes = "";
                        }
                        ds = AddCaseCaseWatch.SearchAddCaseToTrackingRERH(Cnrnos, Casetypes, Casenos, Caseyears, Courts,
                         BenchIDs, StateIds, Districtids, Courttypes, casenames, madvocatenames, Courtcompestbtypes,
                         Courtcompestbcourts, suffix, 0, useremail, usermobile, firmid, userid, apiurl, Username, stampReg, sideId, IsCWUser, CWUserId, Appres, appealNo,
                            District, CourtType, courtNameR, Status);
                        dynamic data1 = JObject.Parse(ds);
                        string status1 = data1.Status;
                        string Message1 = data1.Message;
                        string dbstatus = "";
                        string dbmessage = "";
                        if (Message1.ToString() == "Sorry! Unable to Add now.")
                        {
                            datastatus = Message1.ToString();
                            return "datastatus";
                        }
                        else
                        {
                            try
                            {
                                dbstatus = data1.data[0].dbStatus;
                                dbmessage = data1.data[0].dbMessage;
                            }
                            catch
                            {
                                dbstatus = data1.caseid;
                                dbmessage = data1.data;
                            }
                        }
                        if (dbmessage.ToString() == "Exist")
                        {
                            datastatus = "false";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                        {
                            datastatus = dbmessage.ToString();
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                        {
                            // TempData["SUCCESS"] = "Case Detail Already Exist!!";
                            datastatus = "livecaselimitexceed";
                            return datastatus.ToString();
                        }
                        else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                        {
                            try
                            {
                                //var matterid = "";
                                //Add case to mykase DB
                                //var matterid = SaveShortCase(firmid, userid, null, clientid, mkcasenames, null, null, casetype, auserid, null,
                                //  null, "", "", "", odates, RoleId, "", teammemberlist);
                                if (string.IsNullOrEmpty(matterid))
                                {
                                    matterid = SaveCommonMatter(firmid, userid, null, mkcasenames, caseExternalNo, "42", auserid, RoleId, teammemberlist, courtName, OtherCourtName, Cnrnos);

                                }
                                //Map Mk case to CW Case
                                var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(dbstatus.ToString()), matterid, userid, 1, 0);
                                //Case Assign to MK and CW.
                                List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                                list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                                if (list.Count > 0)
                                {
                                    string auserids = string.Join(",", list.Select(x => x.auser));
                                    AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiurl, dbstatus, IsCWUser, CWUserId);
                                }
                                //save search by party name cass in db
                                var ct1 = db.sp_saveCaseSearchByPartyName(firmid, userid, dbstatus, null, Casenos, Casetypes, Caseyears, Courts);
                                datastatus = matterid;
                            }
                            catch { }
                        }
                    }
                    
                    return datastatus;
                }
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Send Notifiction of Individual case assign user
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignto"></param>
        /// <param name="creatorroleid"></param>
        /// <param name="casename"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public string SearchAssignUserSendNotificationEmail(string firmid, string userid, string assignto, string creatorroleid, string casename, string caseid)
        {
            string resultnitfications = "";
            try
            {
                resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, userid, creatorroleid, casename, caseid);
            }
            catch
            {
            }
            return resultnitfications;
        }
        /// <summary>
        /// For Inserting JSON string data into 
        /// </summary>
        /// <param name="jsonstring">json object contains the next hearing date obj</param>
        public async Task<string> SaveNextHearingJSONdata(string firmid, string userids, string hearingjson)
        {
            int result = 0;
            var db = new LawPracticeEntities();
            try
            {
               // result = db.Usp_SaveNextHearingDateJson(firmid, userids, hearingjson);


            }
            catch (Exception ex)
            {

            }
            return result.ToString();
        }
        /// <summary>
        /// Insert To Do List Data
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="status"></param>
        /// <param name="scheduleDate"></param>
        /// <param name="vToDostext"></param>
        /// <returns></returns>
        public string InsertToDoListData(string firmid, string userid, string status, string scheduleDate, string vToDostext)
        {
            var db = new LawPracticeEntities();
            dynamic result;
            try
            {
                result = db.Usp_SaveMKToDoData(vToDostext, userid, firmid, userid, status, scheduleDate);
            }
            catch(Exception e)
            {
                return e.Message.ToString();
            }
            return result;
        }
        /// <summary>
        /// Get To Do List Data
        /// </summary>
        /// <param name="iId"></param>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="PageNumber"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string GetToDoListData(long iId, string firmId, string userId,int PageNumber,int pagesize)
        {
            var db = new LawPracticeEntities();
            try
            {
               var result = db.Usp_GetMKToDoData(iId, firmId, userId, PageNumber, pagesize).ToList();
                var a = JsonConvert.SerializeObject(result);
                return a;
            }
            catch(Exception ex)
            {
                return ex.Message.ToString();
              
            }
        }
        /// <summary>
        /// Delete ToDo List Data
        /// </summary>
        /// <param name="iId"></param>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string RemoveToDO(int iId, string Firmids,string userIds)
        {
            var db = new LawPracticeEntities();
            int result = 0;
            try
            {
                result = db.Usp_DeleteMKToDoData(iId, Firmids, userIds);
            }
            catch(Exception ex)
            {
                return ex.Message.ToString();
            }
            return result.ToString();
        }
        /// <summary>
        /// Update ToDo List Data
        /// </summary>
        /// <param name="iId"></param>
        /// <param name="vStatus"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string UpdateToDoStatus(int iId, string vStatus,string firmid)
        {
            try
            {
                var db = new LawPracticeEntities();
                if (vStatus == "01")
                {
                    vStatus = "Pending";
                }
                if (vStatus == "02")
                {
                    vStatus = "Done";
                }
                if (vStatus == "03")
                {
                    vStatus = "Pending from Client";
                }
                if (vStatus == "04")
                {
                    vStatus = "To be filed in Court";
                }
                var result = db.Usp_UpdateMKToDoData(iId, vStatus, firmid);
                var results = result.ToString();

                return results;

            }
            catch (Exception ex)
            {
                return "An error occurred: " + ex.Message;
            }
        }
        /// <summary>
        /// Save  short note
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="usertypes"></param>
        /// <param name="clientid"></param>
        /// <param name="casename"></param>
        /// <param name="caseno"></param>
        /// <param name="clientcontact"></param>
        /// <param name="casetype"></param>
        /// <param name="auserid"></param>
        /// <param name="details"></param>
        /// <param name="username"></param>
        /// <param name="confirmPassword"></param>
        /// <param name="checkclient"></param>
        /// <param name="files"></param>
        /// <param name="odates"></param>
        /// <param name="creatorroleid"></param>
        /// <param name="companyId"></param>
        /// <param name="assignuser"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string SaveShortCaseForLitigation(string firmid, string userid, string usertypes, string clientid,
            string casename, string caseno, string clientcontact, string casetype, string auserid, string details,
            string username, string confirmPassword, string checkclient, string files, string odates, string creatorroleid,
            string companyId, string assignuser, string mattertypetext, AddCaseObject1 obj, string mkcourtids, string othercourttext,
            string districtcourttxt, string statename, string districtname,string addedcnrno)
        {
            var returncaseid = "";
            var Courtname = "";
            var OtherCourtName = "";
            var CaseExternalNo = "";
            if (mkcourtids == "1")
            {
                if (obj.Diaryno != "")
                {
                    CaseExternalNo = "Diary No-" + "" + obj.Diaryno + "/" + obj.Caseyear;
                }
                else
                {
                    CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                }

                Courtname = "Supreme Court";
                OtherCourtName= "Supreme Court";
            }
            else if (mkcourtids == "2")
            {
                CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                Courtname = "High Court";
                OtherCourtName = othercourttext;
            }
            else if (mkcourtids == "3")
            {
                if (!String.IsNullOrEmpty(addedcnrno))
                {
                    CaseExternalNo = "(CNR-No." + addedcnrno + ")";
                    Courtname = "District Court";
                }
                else
                {
                    CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                    Courtname = "District Court";
                    OtherCourtName = statename + "/" + districtname + "/" + districtcourttxt;
                }

            }
            else  if(mkcourtids == "4")
            {
                CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                Courtname = "Tribunals";
                OtherCourtName = othercourttext;
            }
            else if (mkcourtids == "5")
            {
                CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                Courtname = "Add a Court";
                OtherCourtName = othercourttext;
            }
            else if (mkcourtids == "6")
            {
                CaseExternalNo = mattertypetext + " " + obj.Caseno + "/" + obj.Caseyear;
                Courtname = "Revenue Court";
                OtherCourtName = "Revenue Court";
            }
            else if (mkcourtids == "7")
            {
                CaseExternalNo = obj.Reracasetype + " " + obj.Reracasno + "/" + obj.Reracaseyear;
                Courtname = "RERA Court";
                OtherCourtName = "RERA Court";
            }
            else { }
            var db = new LawPracticeEntities();
            if (checkclient.ToString() == "1")
            {
                //if already exist client
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //insert into add case
                        string id = "";
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var cnt = db.Usp_SaveShortcase(firmid, userid, casename, caseno, auserid, details, clientid, casetype, odates, IDParameter1, companyId, usertypes, Courtname, OtherCourtName);
                        id = Convert.ToString(IDParameter1.Value);
                        returncaseid = id;
                        if (!String.IsNullOrEmpty(assignuser))
                        {
                            string[] values = assignuser.Split(',');
                            for (int i = 0; i < values.Length; i++)
                            {
                                values[i] = values[i].Trim();
                                string strusername = ConfigurationManager.AppSettings["matteridname"];
                                //add in casewatch
                                var auser = values[i];
                                if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                }
                                else
                                {
                                    var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                    if (checkroles1 != null)
                                    {
                                        if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                            var parentpartner = checkroles1.PartnerId;
                                            //send request to partner for this user
                                            var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                        }
                                        else
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                        }
                                    }
                                }
                                //}
                            }
                        }
                        if (cnt > 0)
                        {
                            //map  users
                            if (!String.IsNullOrEmpty(auserid))
                            {
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    if (creatorroleid == "1" || auserid.ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, id, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (usertypes == "company")
                        {
                            //map external users
                            if (!String.IsNullOrEmpty(clientcontact))
                            {
                                var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, clientcontact);
                            }
                        }
                        transaction.Commit();
                        try
                        {
                            var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, auserid, creatorroleid, casename, id);
                        }
                        catch
                        {
                        }
                        return returncaseid.ToString();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString();
                    }
                }
            }
            else
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var caseclientid = "";
                        var newclientid = "";
#pragma warning disable CS0219 // The variable 'caseclientcontact' is assigned but its value is never used
                        var caseclientcontact = "";
#pragma warning restore CS0219 // The variable 'caseclientcontact' is assigned but its value is never used
                        //convert to client
                        var cpassword = QueryAES.GetHashedCode(confirmPassword);
                        cpassword = cpassword.Replace("\n", "");
                        var cDefaultController = "Client";
                        var DefaultAction = "dashboard";
                        //check company or users
                        if (newclientid == "")
                        {
                            newclientid = "00000000-0000-0000-0000-000000000000";
                        }
                        if (usertypes == "company")
                        {
                            if (companyId == "")
                            {
                                companyId = "00000000-0000-0000-0000-000000000000";
                            }
                            if (clientid != "00000000-0000-0000-0000-000000000000")
                            {
                                // get teamlead data for create client
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientcontact).FirstOrDefault();
                                //convert all contacts to client
                                if (getusersdata != null)
                                {
                                    var listofcompanyuser = db.usp_loadcompanycontacts(firmid, getusersdata.CompanyId).ToList();
                                    if (listofcompanyuser != null)
                                    {
                                        foreach (var data in listofcompanyuser)
                                        {
                                            if (String.IsNullOrEmpty(data.LoginId))
                                            {
                                                var getusersdata1 = db.usp_SingleContactsDetails(firmid, userid, null, data.cid.ToString()).FirstOrDefault();
                                                var cfname = getusersdata1.fname + " " + getusersdata1.mname + " " + getusersdata1.lname;
                                                string uemail = getusersdata1.cemail;
                                                string mobile = getusersdata1.mobno;
                                                string Designation = getusersdata1.Designation;
                                                string landline = getusersdata1.offno;
                                                string address = getusersdata1.cadd1;
                                                ObjectParameter IDParameter2;
                                                IDParameter2 = new ObjectParameter("id", newclientid);
                                                var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata1.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, clientid);
                                                newclientid = Convert.ToString(IDParameter2.Value);
                                                if (clientcontact.ToLower().ToString() == data.cid.ToString())
                                                {
                                                    caseclientid = newclientid;
                                                }
                                                if (rs2 > 0)
                                                {
                                                    //insert in regusers
                                                    var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata1.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, data.cid.ToString(), getusersdata1.fname, getusersdata1.mname, getusersdata1.lname, getusersdata1.Pin, null);
                                                    //update type in contact
                                                    var chkt = db.usp_updateContactsProfiletypeToClient(firmid, getusersdata1.loguser.ToString(), data.cid.ToString());
                                                }
                                            }
                                            else
                                            {
                                                //check if already client
                                                if (clientcontact.ToLower().ToString() == data.cid.ToString())
                                                {
                                                    caseclientid = data.LoginId;
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                }
                            }
                            if (caseclientid == "" || caseclientid == null)
                            {
                                caseclientid = "00000000-0000-0000-0000-000000000000";
                            }
                            //insert into add case
                            string id = "";
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var cnt = db.Usp_SaveShortcaseForBulk(firmid, userid, casename, CaseExternalNo, auserid, details,"42", companyId, usertypes, Courtname, OtherCourtName, IDParameter1, addedcnrno);
                            id = Convert.ToString(IDParameter1.Value);
                            returncaseid = id;
                            ////assign user
                            if (!String.IsNullOrEmpty(assignuser))
                            {
                                string[] values = assignuser.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                                    //add in casewatch
                                    var auser = values[i];
                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                    //}
                                }
                            }
                            if (cnt > 0)
                            {
                                //map  users
                                //checkroleid 
                                //map external users
                                if (!String.IsNullOrEmpty(clientcontact))
                                {
                                    var cnt3 = db.Usp_SaveCaseExternalUser(firmid, userid, id, clientcontact);
                                }
                            }
                            if (!String.IsNullOrEmpty(auserid))
                            {
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    if (creatorroleid == "1" || auserid.ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, id, "12", null, null, null);
                                            }
                                            else
                                            {
                                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                                {
                                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            transaction.Commit();
                            if (cnt > 0)
                            {
                                try
                                {
                                    var resultnitfications = CaseNotificationEmail.AssignUserSendNotificationEmail(firmid, userid, auserid, creatorroleid, casename, id);
                                }
                                catch
                                {
                                }
                            }
                            return returncaseid.ToString();
                        }
                        else
                        {
                            //get userdata data for create client 
                            string uemail = "";
                            string mobile = "";
                            string Designation = "";
                            string landline = "";
                            string address = "";
                            if (clientid != "00000000-0000-0000-0000-000000000000")
                            {
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientid).FirstOrDefault();
                                if (getusersdata != null)
                                {
                                    var cfname = getusersdata.fname + " " + getusersdata.mname + " " + getusersdata.lname;
                                    uemail = getusersdata.cemail;
                                    mobile = getusersdata.mobno;
                                    Designation = getusersdata.Designation;
                                    landline = getusersdata.offno;
                                    address = getusersdata.cadd1;
                                    //save into firmusers
                                    ObjectParameter IDParameter2;
                                    IDParameter2 = new ObjectParameter("id", newclientid);
                                    var rs2 = db.Usp_SaveFirmUserData(firmid, getusersdata.loguser.ToString(), cDefaultController, false, false, false, cpassword, username, 3, DefaultAction, getusersdata.cemail, IDParameter2, Guid.Empty.ToString());
                                    newclientid = Convert.ToString(IDParameter2.Value);
                                    if (rs2 > 0)
                                    {
                                        //insert in regusers
                                        var rs3 = db.Usp_SaveRegUserClientData(firmid, getusersdata.loguser.ToString(), newclientid, cfname, mobile, address, getusersdata.Country, getusersdata.State, getusersdata.City, "3", landline, getusersdata.CompanyId.ToString(), Designation, getusersdata.cid, getusersdata.fname, getusersdata.mname, getusersdata.lname, getusersdata.Pin, null);
                                    }
                                }
                            }
                            //insert into add case
                            string id = "";
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var cnt = db.Usp_SaveShortcaseForBulk(firmid, userid, casename, CaseExternalNo, auserid, details, "42", companyId, usertypes, Courtname, OtherCourtName, IDParameter1, addedcnrno);
                            id = Convert.ToString(IDParameter1.Value);
                            returncaseid = id;
                            ////assign user
                            if (!String.IsNullOrEmpty(assignuser))
                            {
                                string[] values = assignuser.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                                    //add in casewatch
                                    var auser = values[i];
                                    if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                    else
                                    {
                                        var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                        if (checkroles1 != null)
                                        {
                                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                                var parentpartner = checkroles1.PartnerId;
                                                //send request to partner for this user
                                                var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                            }
                                            else
                                            {
                                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                            }
                                        }
                                    }
                                    //}
                                }
                            }
                            //save notoficateion
                            try
                            {
                                //team lead
                                var dataac = Notification.SaveNotifications("UserTeamLead", null, firmid, userid, auserid, casename);
                                //rm of user
                                var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                                if (getcaseuser != null)
                                {
                                    if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                    {
                                        var dataacq = Notification.SaveNotifications("AddTeamLead", null, firmid, userid, getcaseuser.ReportManager.ToString(), casename);
                                    }
                                }
                                //client contact
                                if (!String.IsNullOrEmpty(clientcontact))
                                {
                                    var dataac1 = Notification.SaveNotifications("AddClientContact", null, firmid, userid, auserid, id);
                                }
                            }
                            catch
                            {
                            }
                            if (cnt > 0)
                            {
                                //map  users
                                if (auserid != "00000000-0000-0000-0000-000000000000")
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, auserid, 0);
                                }
                                //update status of contacts profiletype
                                var chkt = db.usp_updateContactsProfiletypeToClient(firmid, userid, clientid);
                            }
                            transaction.Commit();
                            return returncaseid.ToString();
                        }
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message.ToString();
                    }
                }
            }
        }
        public string SaveCommonMatter(string firmid, string userid, string usertypes, string casename, string CaseExternalNo, string casetype, string auserid,
            string creatorroleid, string assignuser, string Courtname, string OtherCourtName, string addedcnrno)
        {
            var returncaseid = "";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    //insert into add case
                    string id = "";
                    ObjectParameter IDParameter1;
                    IDParameter1 = new ObjectParameter("id", id);
                    var cnt = db.Usp_SaveShortcaseForBulk(firmid, userid, casename, CaseExternalNo, auserid, "00000000-0000-0000-0000-000000000000", "42", null, usertypes, Courtname, OtherCourtName, IDParameter1, addedcnrno);
                    id = Convert.ToString(IDParameter1.Value);
                    returncaseid = id;
                    //assign user
                    if (!String.IsNullOrEmpty(assignuser))
                    {
                        string[] values = assignuser.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            string strusername = ConfigurationManager.AppSettings["matteridname"];
                            //add in casewatch
                            var auser = values[i];
                            if (creatorroleid == "1" || values[i].ToString().ToLower() == userid)
                            {
                                var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                            }
                            else
                            {
                                //For Assigning Case To selef
                                if (creatorroleid == "2")
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, userid, 0);
                                }
                                var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 1);
                                        var parentpartner = checkroles1.PartnerId;
                                        //send request to partner for this user
                                        var data = db.Usp_SaveFirmCaseTask(firmid, userid, parentpartner, returncaseid, "12", null, null, null);
                                    }
                                    else
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, values[i], 0);
                                    }
                                }
                            }
                            //}
                        }
                    }
                    else
                    {
                        //For Assign Self Case
                        if (creatorroleid == "2")
                        {
                            var cnt1 = db.Usp_SaveCaseUser(firmid, userid, id, userid, 0);
                        }
                    }
                    transaction.Commit();
                    //This block is using to save bridgestone custom case id into db 
                    try
                    {
                        string BridgeStoneModulePermission = WebConfigurationManager.AppSettings["BridgeStoneModulePermission"].ToString();
                        if (string.Equals(firmid, BridgeStoneModulePermission, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(returncaseid.ToString()))
                        {
                            var status = DataAccessIPRADO.SaveBridgeStoneOtherMatterDetails(Convert.ToString(returncaseid));
                        }
                    }
                    catch (Exception ex) {}
                    return returncaseid.ToString();

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message.ToString();
                }
            }
        }
        /// <summary>
        /// Save data model for calculator
        /// </summary>
        /// <param name="Savedata obj"></param>
        /// <returns></returns>
        public string SaveCalculator(Savedatamodelforcalculator obj)
        {
            var db = new LawPracticeEntities();
            try
            {
                var list = db.Usp_SaveCalCulator(obj.FirmId, obj.UserId, obj.MatterId, obj.Natureofclm, obj.LWDOfWorkman, obj.Valuationdate,
                obj.Claimdate, obj.Numberofmonth, obj.LastCTCPermonth, obj.Backwagespayable, obj.AdditionalValuation, obj.AgeofClm, obj.PrincipalCLMAmt,
                 obj.IntrCLMPerAnnum, obj.TotalInterPayble, obj.TotalValuation);
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Get data  for calculator
        /// </summary>
        /// <param name="FirmId"></param>
        /// <param name="UserId"></param>
        /// <param name="CaseId"></param>
        /// <returns></returns>
        public string GetCalCulatorValues(string firmid, string userid, string caseid)
        {
            var db = new LawPracticeEntities();
            try
            {
                var list = db.Usp_GetCaseCalculator(firmid, userid, caseid).FirstOrDefault();
                var a = JsonConvert.SerializeObject(list);
                return a;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Relink casewatch case For Live cases
        /// </summary>
        /// <param name="usercaseid"></param>
        /// <param name="caseid"></param>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <param name="dburl"></param>
        /// <param name="apiurl"></param>
        /// <returns></returns>
        public string RelinkcasewatchcaseForLivecase(string usercaseid, string caseid, string firmid, string uid,
            string dburl, string apiurl, int IsCWUser)
        {
            var db = new LawPracticeEntities();
            var result = false;
            string did = "";
            string AccessTokenDetail = string.Empty;
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    if (usercaseid != null && caseid == "")
                    {
                        try
                        {
                            //var cnt1 = db.usp_RemoveSearchbyPartyNameCase(Guid.Parse(firmid), Guid.Parse(uid), usercaseid.ToString());
                            var addfClientd = new WebClient();
                            if (IsCWUser == 1)
                            {
                                AccessTokenDetail = "internal";
                            }
                            else
                            {
                                AccessTokenDetail = "mykase123456789abcdef";
                            }

                            object rawfiled = new
                            {
                                Accesstoken = AccessTokenDetail,
                                UserCaseId = usercaseid,
                                istatus = "0"
                            };
                            addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                            string buildersd = JsonConvert.SerializeObject(rawfiled);
                            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                            string residd = addfClientd.UploadString(new Uri(apiurl + "/API/Search/UpdateIsDeleteLiveTrack"), "POST", buildersd);
                            dynamic data = JObject.Parse(residd);
                            string status = data.Status;
                            string Message = data.Message;
                            string dataval = data.data;
                            if (dataval == "Done Successfully")
                            {
                                result = true;
                                transaction.Commit();
                            }
                            else
                            {
                                transaction.Rollback();
                                return "0";
                            }
                        }
                        catch
                        {
                            transaction.Rollback();
                        }
                        finally
                        {
                        }
                        //return result.ToString();
                    }
                    return result.ToString();
                }
                catch (Exception er)
                {
                    transaction.Rollback();
                    return er.Message.ToString();
                }
            }
        }

        /// <summary>
        /// Update CW Matter 
        /// </summary>
        /// <param name="usercaseid"></param>
        /// <param name="matterids"></param>
        /// <param name="firmid"></param>
        /// <param name="userids"></param>
        /// <returns></returns>
        public string EditCWMatter(string mattername, string matterids, string firmid,string userids)
        {
            var db = new LawPracticeEntities();
            var result=0;
                try
                {
                    if (!String.IsNullOrEmpty(matterids))
                    {
                        result = db.Usp_UpdateCWMatter(firmid,userids, matterids, mattername);
                    }
                    return result.ToString();
                }
                catch (Exception er)
                {
                    return er.Message.ToString();
                } 
        }

        /// <summary>
        /// Save CW Matter
        /// </summary>
        /// <param name="usercaseid"></param>
        /// <param name="firmid"></param>
        /// <param name="userids"></param>
       /// <param name="usercaseid"></param>
        /// <returns></returns>
        public string SaveCWMatter(string mattername, string firmid, string userids,string CaseExternalNo,
            string Courtname,string OtherCourtName,string usercaseid,string assigntemmember,string creatorroleid)
        {
            var db = new LawPracticeEntities();
            string matterid = "";
            try
            {
                if (!String.IsNullOrEmpty(mattername))
                {
                    var teamlead = "00000000-0000-0000-0000-000000000000";
                    var addedcnrno = "";
                    string id = "";
                    ObjectParameter IDParameter1;
                    IDParameter1 = new ObjectParameter("id", id);
                    var cnt = db.Usp_SaveShortcaseForBulk(firmid, userids, mattername, CaseExternalNo, teamlead, "00000000-0000-0000-0000-000000000000", "42", null, null, Courtname, OtherCourtName, IDParameter1, addedcnrno);
                    id = Convert.ToString(IDParameter1.Value);
                    matterid = id;

                    //For Assign Temamember
                    ////assign user
                    if (!String.IsNullOrEmpty(assigntemmember))
                    {
                        string[] values = assigntemmember.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            string strusername = ConfigurationManager.AppSettings["matteridname"];
                            //add in casewatch
                            var auser = values[i];
                            if (creatorroleid == "1" || values[i].ToString().ToLower() == userids)
                            {
                                var cnt1 = db.Usp_SaveCaseUser(firmid, userids, id, values[i], 0);
                            }
                            else
                            {
                                var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userids, id, values[i], 1);
                                        var parentpartner = checkroles1.PartnerId;
                                        //send request to partner for this user
                                        var data = db.Usp_SaveFirmCaseTask(firmid, userids, parentpartner, usercaseid, "12", null, null, null);
                                    }
                                    else
                                    {
                                        var cnt1 = db.Usp_SaveCaseUser(firmid, userids, id, values[i], 0);
                                    }
                                }
                            }
                            //}
                        }
                    }
                    if (!String.IsNullOrEmpty(matterid))
                    {
                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(usercaseid.ToString()), matterid.ToString(), userids, 0, 1);
                    }

                   // matterid = SaveCommonMatter(firmid, userids, null, casename, caseno, "42", auserid, RoleId, assignuser, Courtname, OtherCourtName, drpdcourtcnr1);
                }
                return matterid.ToString();
            }
            catch (Exception er)
            {
                return er.Message.ToString();
            }
        }
        /// <summary>
        /// Linked Case to Add Live Update
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="LinkedCaseUserName"></param>
        /// <param name="MasterCaseIds"></param>
        /// <param name="LinkedCaseNo"></param>
        /// <param name="Cnrnos"></param>
        /// <param name="AppealNo"></param>
        /// <param name="Courts"></param>
        /// <param name="mkcasenames"></param>
        /// <param name="teammemberlist"></param>
        /// <param name="Username"></param>
        /// <param name="caseExternalNo"></param>
        /// <param name="courtName"></param>
        /// <param name="OtherCourtName"></param>
        /// <param name="apiUrl"></param>
        /// <param name="RoleId"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <param name="Casetypes"></param>
        /// <param name="Casenos"></param>
        /// <param name="Caseyears"></param>
        /// <param name="ParentUserCaseIds"></param>
        /// <param name="Scasetype"></param>
        /// <param name="slinkedcasetype"></param>
        /// <returns></returns>
        public string LinkedCaseAddCaseToLiveupdate(string firmid, string userid, string LinkedCaseUserName, string MasterCaseIds,
            string LinkedCaseNo,string Cnrnos, string AppealNo, string Courts, string mkcasenames, string teammemberlist,
            string Username, string caseExternalNo, string courtName, string OtherCourtName, string apiUrl,string RoleId,
            int IsCWUser, string CWUserId, string Casetypes, string Casenos, string Caseyears, string ParentUserCaseIds,
            string Scasetype, string slinkedcasetype)
        {
            var db = new LawPracticeEntities();
            // if already exist client
            try
            {
                var ds = "false";
                var datastatus = "";
                string casetype = "42";
                string auserid = "00000000-0000-0000-0000-000000000000";
                string odates = DateTime.Now.Date.ToString();
                var usernameids = userid;
                ds = AddCaseCaseWatch.LinkedCaseAddCaseToLiveTrack(firmid,userid,LinkedCaseUserName,MasterCaseIds,LinkedCaseNo,
                    Username,apiUrl,Casetypes, Casenos, Caseyears, ParentUserCaseIds, Scasetype, slinkedcasetype);

                dynamic data1 = JObject.Parse(ds);
                string status1 = data1.Status;
                string Message1 = data1.Message;
                string dbmessage = "";
                if (Message1.ToString() == "Sorry! Unable to Add now.")
                {
                    datastatus = Message1.ToString();
                    datastatus = "false";
                    return datastatus.ToString();
                }
                else
                {
                    try
                    {
                       datastatus = data1.data[0].dbStatus.ToString();
                       dbmessage = data1.data[0].dbMessage;
                    }
                    catch
                    {
                       datastatus = data1.caseid;
                       dbmessage = data1.data;
                    }
                }
                if (dbmessage.ToString() == "Exist")
                {
                    datastatus = "false";
                    return datastatus.ToString();
                }
                else if (dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan." || dbmessage.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                {
                   datastatus = "livecaselimitexceed";
                   return datastatus.ToString();
                }
                else if (dbmessage.ToString() == "Case Detail Already Exists!!" || dbmessage.ToString() == "Case Detail Already Exist!!")
                {
                   datastatus = dbmessage.ToString();
                   return datastatus.ToString();
                }
                else if (dbmessage.ToString() == "Case Detail Added Successfully!!" || dbmessage.ToString() == "Case Detail Added Successfully !!")
                {
                   //Assign case to user
                   try
                   {
                      //Add case to mykase DB
                       var matterid = "";
                       matterid = SaveCommonMatter(firmid, userid, null, mkcasenames, caseExternalNo, casetype, auserid, RoleId, teammemberlist, courtName, OtherCourtName, Cnrnos);
                       //Map Mk case to CW Case
                       var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmid, Convert.ToInt32(datastatus), matterid, userid, 0, 0);
                       //Case Assign to MK and CW.
                       List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                       list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, matterid).ToList();
                       if (list.Count > 0)
                       {
                           string auserids = string.Join(",", list.Select(x => x.auser));
                           AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userid, firmid, apiUrl, datastatus, IsCWUser, CWUserId);
                       }
                        datastatus = matterid;
                    }
                    catch { }
                }
               return datastatus;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Restore bulk matter list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="apiurl"></param>
        /// <param name="remarks"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string Restorematterlist(string[] typeIds, string firmid, string userid, string apiurl, string remarks, string roleid)
        {
            int result = 0;
            var db = new LawPracticeEntities();
          //  var typeIds1 = typeIds.Split(',');
            string did = "";
            foreach (string did1 in typeIds)
            {
                try
                {
                    did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                }
                catch
                {
                    did = did1;
                }
                //send notification
                try
                {
                    var getafirmadminid = db.usp_FirmAdminDetails(firmid).FirstOrDefault();
                    if (getafirmadminid != null)
                    {
                        var chkisdelete = db.usp_EditCaseBasicDetails(firmid, userid, did).FirstOrDefault();
                        if (chkisdelete.IsDelete != 1)
                        {
                            var dataac1 = Notification.SaveNotifications("MatterDelete", null, firmid, userid, getafirmadminid.Id.ToString(), did.ToString(), did.ToString());
                            if (roleid == "2")
                            {
                                CommomUtility objmail = new CommomUtility();
                                string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                var stringcontent = "";
                                var stringsubject = "";
                                var res = db.usp_GetEmailTemplate("MarkDeletionMatter").FirstOrDefault();
                                stringcontent = res.EmailContent;
                                stringsubject = res.EmailSubject;

                                stringsubject = stringsubject.Replace("#MatterName#", chkisdelete.mname);
                                stringcontent = stringcontent.Replace("#AdminName#", getafirmadminid.UserName);

                                stringcontent = stringcontent.Replace("#MatterName#", chkisdelete.mname);
                                stringcontent = stringcontent.Replace("#DeletionDate#", DateTime.Today.Date.ToString("dd/MM/yyyy"));
                                stringcontent = stringcontent.Replace("#Remarks#", remarks);
                                var getuserdetails = db.usp_GetUserDetailByUserID(firmid, userid).FirstOrDefault();
                                if (getuserdetails != null)
                                {
                                    stringcontent = stringcontent.Replace("#UserName#", getuserdetails.Name);
                                }
                                var getuserdetails1 = db.usp_GetUserDetailByUserID(firmid, chkisdelete.firmuser.ToString()).FirstOrDefault();
                                if (getuserdetails1 != null)
                                {
                                    stringcontent = stringcontent.Replace("#CreatedBy#", getuserdetails1.Name);
                                }
                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                objmail.SendEmail(fromemail, getafirmadminid.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                            }
                        }
                    }
                }
                catch{}
                try
                {
                    result = db.sp_DeleteMatterList(firmid.ToString(), userid.ToString(), did.ToString());
                    var data1 = db.usp_SaveMarkContentModuleWise(firmid.ToString(), userid.ToString(), remarks, "MarkMatterDeletion", did.ToString());
                }
                catch (Exception ed)
                {
                    return ed.ToString();
                }
            }
            return result.ToString();
        }

        ///// <summary>
        ///// load new sebi client customize matter list
        ///// </summary>
        ///// <param name="firmid"></param>
        ///// <param name="userid"></param>
        ///// <param name="pagenum"></param>
        ///// <param name="pagesize"></param>
        ///// <returns></returns>
        //public string loadnewcaselistSebi(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
        //    string clientname,string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype,
        //    string subjectype, string casefilternotes, string casefiltercourtname, string odateto, string fillingdate,
        //    string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval, string disposeoption,
        //    string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
        //    string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter,
        //    string hearingsort, string courtstatus, string FiledByAgainstfilter, string FavourAgainstfilter, string IsCaseWatchUser)
        //    {
        //    // Initialize the database context
        //    var db = new LawPracticeEntities();


        //    // Ensure createdby is not null
        //    createdby = createdby ?? string.Empty;

        //    // Retrieve the list of case details
        //    var list = db.GetNewCaseDetailByRowId_SEBI(
        //        Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname, court, cstatus,
        //        createdby, filtervalue, companyname, mattertype, subjectype, casefilternotes, casefiltercourtname, odateto,
        //        fillingdate, fillingdateto, IsCaseArchived, srchcustcolname, srchcustcolval, disposeoption,
        //        casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter,
        //        nexthearingdatefrom, nexthearingdateto, courtstatusfilter, FiledByAgainstfilter, FavourAgainstfilter, courtstatus).ToList();
        //    return JsonConvert.SerializeObject(list);
        //}
        ///// <summary>
        ///// load new sebi client customize matter list for user
        ///// </summary>
        ///// <param name="firmid"></param>
        ///// <param name="userid"></param>
        ///// <param name="pagenum"></param>
        ///// <param name="pagesize"></param>
        ///// <returns></returns>
        //public string loadSebiusernewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname,
        //       string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype,
        //       string casefilternotes, string casefiltercourtname, string odateto, string fillingdate,
        //       string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval, string disposeoption,
        //       string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
        //       string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter, string hearingsort, string courtstatus,
        //       string FiledByAgainstfilter, string FavourAgainstfilter)
        //{
        //    //hrow new NotImplementedException();
        //    var db = new LawPracticeEntities();
        //    int pageid = 0;
        //    try
        //    {
        //        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
        //        if (pagelist != null)
        //        {
        //            pageid = Convert.ToInt32(pagelist.ParentPage);
        //        }
        //        //  var matter1 =db.AddLawMatterLists.Where(x => x.firmId == uids).ToList();
        //        if (createdby == "null")
        //        {
        //            createdby = "";
        //        }
        //        // List<GetUserNewCaseDetailByRowIdNEW_Result> list = new List<GetUserNewCaseDetailByRowIdNEW_Result>();
        //        var list = db.GetUserSebiNewCaseDetailByRowIdNEW(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename,
        //            clientname, court, cstatus, pageid, roletype, createdby, Convert.ToInt32(filtervalue), companyname,
        //            mattertype, subjectype, casefilternotes, casefiltercourtname,
        //            odateto, fillingdate, fillingdateto, IsCaseArchived, srchcustcolname, srchcustcolval, disposeoption,
        //            casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter,
        //            nexthearingdatefrom, nexthearingdateto, courtstatusfilter, FiledByAgainstfilter, FavourAgainstfilter, courtstatus).ToList();
        //        return JsonConvert.SerializeObject(list);
        //    }
        //    catch (Exception ex)
        //    {
        //        return "";
        //    }
        //}
        //public string SaveCWMatterOtherDetails(string ULN, string NatureOfCase, string MatterType, string MatterOf, string BriefOfMatter, string Relevance, string IssuesInvolved, string NatureOfViolation, string Casecategory
        //                                 , string DateOfImpugned, string IssuingAuthority, string DirectionUnderTheOrder, string ReplyField, string MatterStage, string StayOrder, string DateOfStayOrder, string NameOfParty,
        // string DateTill, string ExtendedTill, string StayVacatedOn, string DirectionOfCourt, string ExpactedDateOfCompliance, string OprationDepartmentInchargeOFCompliance,
        // string DateOfCompliance, string DisposalInFavour, string NatureOfDisposal, string OperationDepartmentForThePurposeOfSeeking, string NameOfTheDealingOfficer, string NameOfOfficer, string ProformaParty,
        // string MarketActivity, string GovernmentAuthorityParty, string Remarks, string MatterId)
        //{
        //    var db = new LawPracticeEntities();
        //    try
        //    {
        //        DateTime? DateOfImpugnedtemp = !string.IsNullOrEmpty(DateOfImpugned) ? (DateTime?)DateTime.Parse(DateOfImpugned) : null;
        //        DateTime? DateTilltemp = !string.IsNullOrEmpty(DateTill) ? (DateTime?)DateTime.Parse(DateTill) : null;
        //        DateTime? DateOfStayOrdertemp = !string.IsNullOrEmpty(DateOfStayOrder) ? (DateTime?)DateTime.Parse(DateOfStayOrder) : null;
        //        DateTime? ExpactedDateOfCompliancetemp = !string.IsNullOrEmpty(ExpactedDateOfCompliance) ? (DateTime?)DateTime.Parse(ExpactedDateOfCompliance) : null;
        //        DateTime? DateOfCompliancetemp = !string.IsNullOrEmpty(DateOfCompliance) ? (DateTime?)DateTime.Parse(DateOfCompliance) : null;

        //        var result = db.sp_InsertSebiMetterOtherDetails(
        //            ULN, NatureOfCase, MatterType, MatterOf, BriefOfMatter, Relevance, IssuesInvolved, NatureOfViolation, Casecategory,
        //            DateOfImpugnedtemp, IssuingAuthority, DirectionUnderTheOrder, ReplyField, MatterStage, StayOrder, DateOfStayOrdertemp, NameOfParty,
        //            DateTilltemp, ExtendedTill, StayVacatedOn, DirectionOfCourt, ExpactedDateOfCompliancetemp, OprationDepartmentInchargeOFCompliance,
        //            DateOfCompliancetemp, DisposalInFavour, NatureOfDisposal, OperationDepartmentForThePurposeOfSeeking, NameOfTheDealingOfficer, NameOfOfficer, ProformaParty,
        //            MarketActivity, GovernmentAuthorityParty, Remarks, MatterId);
        //        return Convert.ToString(result);
        //    }
        //    catch (Exception er)
        //    {
        //        return er.Message.ToString();
        //    }
        //}

    }
}