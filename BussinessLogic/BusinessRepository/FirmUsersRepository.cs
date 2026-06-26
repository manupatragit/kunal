using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using Newtonsoft.Json;
#pragma warning disable CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
#pragma warning restore CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
#pragma warning disable CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
#pragma warning restore CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
using System.Data;
using QueryStringEDAES;
using System.Net;
using System.Text;
using LawPracticeFirm;
using Newtonsoft.Json.Linq;
using System.Web.Configuration;

namespace BussinessLogic.BusinessRepository
{
    public class FirmUsersRepository : IFirmUsersRepository
    {
        public string ClientDetail(string uid, string firmid)
        {
            var db = new LawPracticeEntities();


            List<usp_wf_GetUserDetails_Result> list = new List<usp_wf_GetUserDetails_Result>();
            list = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse((uid))).ToList();



            foreach (var data in list.ToList())
            {
                usp_wf_GetUserDetails_Result newItem = new usp_wf_GetUserDetails_Result();

                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));


                list[list.IndexOf(data)].Id = newItem.Id;
                try
                {
                    if (!string.IsNullOrEmpty(data.cphoto))
                    {
                        newItem.cphoto = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.cphoto.ToString()));
                        list[list.IndexOf(data)].cphoto = newItem.cphoto;
                    }

                }
                catch
                {

                }
            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }
        /// <summary>
        /// Save contact details
        /// </summary>
        /// <param name="fm"></param>
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

        public void savecontact(AddContactsList fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
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
            cf.ContactType = fm.ContactType;
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
            var chkinsert = db.usp_mapcontactuser(cf.Firmid.ToString(), cf.firmuser.ToString(), cf.cid.ToString(), cf.firmuser.ToString());
            if (chkinsert > 0)
            {
                tbl_notification tn = new tbl_notification();

                tn.date_time = cf.date_time;
                tn.Firmid = Guid.Parse(cf.Firmid.ToString());
                tn.userid = cf.firmuser;
                tn.auser = Guid.Parse(cf.firmuser.ToString());
                tn.ntype = "Contact";
                tn.status = 1;


                tn.urllink = "/Employee/ContactSingleView/" + cf.cid;


                tn.notification = "You have new Contact";
                tn.typeid = cf.cid;
                db.tbl_notification.Add(tn);
                db.SaveChanges();
            }
        }

        /// <summary>
        /// Save user profile details
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="email"></param>
        /// <param name="aadhar"></param>
        /// <param name="gst"></param>
        /// <param name="pan"></param>
        /// <param name="apiurl"></param>
        /// <param name="commuemail"></param>
        /// <returns></returns>
        public string SaveProfile(RegUserTable obj, string email, string aadhar, string gst, string pan, string apiurl, string commuemail)
        {
            var db = new LawPracticeEntities();
            var leadid = db.sp_getLeadIdbyId(obj.Id).FirstOrDefault();
            if (String.IsNullOrEmpty(leadid.ToString()))
            {
                leadid = Guid.Empty;
            }
            var result = db.sp_updateProfile(obj.Id, Guid.Parse(leadid.ToString()), obj.cfname, obj.cmname, obj.clname, obj.Designation, obj.cmobile, email, obj.clandline, aadhar, obj.caddress, obj.Pin, gst, pan, obj.country, obj.cstate, obj.ccity, obj.Firmid.ToString(), obj.cphoto);
            var result1 = db.sp_SaveUserProfileCommunicationMail(obj.Firmid.ToString(), obj.firmuser.ToString(), commuemail, obj.firmuser.ToString());

            if (!String.IsNullOrEmpty(apiurl))
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
                    var apiUrl = apiurl;
                    //add login data
                    var addfClient = new WebClient();
                    //For Handling CW Migrated Users
                    var vdisplayname = "";
                    string status2 = "";
                    var countryname = "";
                    var statename = "";
                    string memberuserids = string.Empty;
                    string Loginuserids = string.Empty;
                    string AccessTokenDetail = string.Empty;
                    var getuseremailmobile = db.usp_GetUserDetailByUserID(obj.Firmid.ToString(), obj.firmuser.ToString()).FirstOrDefault();
                    if (getuseremailmobile != null)
                    {
                        vdisplayname = getuseremailmobile.Name;
                        countryname = getuseremailmobile.country;
                        statename = getuseremailmobile.cstate;
                    }
                    //check member userid is CW User
                    if (getuseremailmobile.IsCaseWatch == 1)
                    {
                        memberuserids = getuseremailmobile.UserName;
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        memberuserids = "MyKase_" + obj.firmuser;
                        AccessTokenDetail = "mykase123456789abcdef";
                    }
                    object rawfile = new
                    {

                        accesstoken = AccessTokenDetail,
                        email = email,
                        userid = memberuserids,
                        mobile = obj.cmobile,
                        Dispname = fullname,
                        Countryname = obj.country,
                        StateName = obj.cstate,

                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateMyKaseProfile"), "POST", builders);
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string dataval = data.data;

                }
                catch
                {

                }
            }
            return "";

        }
        /// <summary>
        /// Remove contact list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removecontactlist(string[] typeIds, string firmid, string uid)
        {
            var db = new LawPracticeEntities();


            foreach (string did1 in typeIds)
            {

                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                AddContactsList contact = (from c in db.AddContactsLists
                                           where c.cid.ToString() == did.ToString() && c.Firmid.ToString() == firmid.ToString() && c.firmuser.ToString() == uid.ToString()
                                           select c).FirstOrDefault();
                db.AddContactsLists.Remove(contact);

                db.insertdeleteentrytable(Guid.Parse(did), "AddContactsList", Guid.Parse(firmid));
            }
            var countcontact = db.SaveChanges();

            foreach (string dids1 in typeIds)
            {

                string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1.Replace(" ", "+")));
                IEnumerable<ColMap> ct1 = (from c in db.ColMaps where c.formid.ToString() == "7" && c.Firmid.ToString() == firmid.ToString() && c.pid.ToString() == dids.ToString() select c).ToList();

                db.ColMaps.RemoveRange(ct1);

                db.insertdeleteentrytable(Guid.Parse(dids), "ColMap", Guid.Parse(firmid));

                db.SaveChanges();

            }

            var a = JsonConvert.SerializeObject(countcontact);
            return a;
        }
        /// <summary>
        /// View contact list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string viewcontactlist(string firmid, string uid)
        {


            var db = new LawPracticeEntities();

            List<GetUserContactDetails_Result> list = new List<GetUserContactDetails_Result>();
            list = db.GetUserContactDetails(Guid.Parse(firmid), Guid.Parse(uid)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserContactDetails_Result newItem = new GetUserContactDetails_Result();

                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));

                list[list.IndexOf(data)].cid = newItem.cid;

                if (!string.IsNullOrEmpty(data.assignuserby))
                {
                    newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                    list[list.IndexOf(data)].assignuserby = newItem.assignuserby;
                }

            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }

        /// <summary>
        /// View contact list by row Id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="uid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string viewcontactlistbyrowid(string firmid, string uid, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            List<GetUserContactDetailsByRowId_Result> list = new List<GetUserContactDetailsByRowId_Result>();
            list = db.GetUserContactDetailsByRowId(Guid.Parse(firmid), Guid.Parse(uid), pagenum, pagesize, 0).ToList();
            foreach (var data in list.ToList())
            {
                GetUserContactDetailsByRowId_Result newItem = new GetUserContactDetailsByRowId_Result();

                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString().Replace(" ", "+")));

                list[list.IndexOf(data)].cid = newItem.cid;

                if (!string.IsNullOrEmpty(data.assignuserby))
                {
                    newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString().Replace(" ", "+")));
                    list[list.IndexOf(data)].assignuserby = newItem.assignuserby;
                }

            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }

        /// <summary>
        /// View single contact detail
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string singlecontactdetails(string mid, string FirmId, string uid)
        {
            var db = new LawPracticeEntities();
            List<GetUserContactSingleDetails_Result> list = new List<GetUserContactSingleDetails_Result>();
            list = db.GetUserContactSingleDetails(Guid.Parse(mid), Guid.Parse(FirmId.ToString()), Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                GetUserContactSingleDetails_Result newItem = new GetUserContactSingleDetails_Result();
                newItem.cid = Convert.ToBase64String(QueryAES.EncryptAes(data.cid.ToString()));
                list[list.IndexOf(data)].cid = newItem.cid;
            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }

        /// <summary>
        /// Edit Contact
        /// </summary>
        /// <param name="fm"></param>
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
        public void editcontact(AddContactsList fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)

        {
            var db = new LawPracticeEntities();
            ColMap cm = new ColMap();

            var cf = db.AddContactsLists.Where(x => x.cid == fm.cid && x.Firmid.ToString() == firmid.ToString() && (x.firmuser == fm.firmuser || x.cassign == fm.firmuser.ToString())).FirstOrDefault();
            if (fm.cphoto != null)
            {
                cf.cphoto = fm.cphoto;
            }
            cf.Firmid = Guid.Parse(firmid.ToString());
            cf.firmuser = fm.firmuser;
            cf.cnotes = fm.cnotes;
            cf.lname = fm.lname;
            cf.cadd1 = fm.cadd1;
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
            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.cid;
                cm.column_no = "col" + i;
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
                cm.Firmid = Guid.Parse(firmid.ToString());
                cm.formid = Convert.ToInt32(ftype);

                var mt = db.ColMaps.Where(x => x.Firmid.ToString() == firmid.ToString() && x.formid == cm.formid && x.pid == cm.pid && x.column_name == cm.column_name && x.column_no == cm.column_no).FirstOrDefault();
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


            tbl_notification tn = new tbl_notification();

            tn.date_time = cf.date_time;
            tn.Firmid = Guid.Parse(cf.Firmid.ToString());
            tn.userid = cf.firmuser;
            tn.auser = Guid.Parse(cf.firmuser.ToString());
            tn.ntype = "Contact";
            tn.status = 1;
            tn.nmode = "edit";


            tn.urllink = "/Employee/ContactSingleView/" + cf.cid;


            tn.notification = "You have edit Contact";
            tn.typeid = cf.cid;
            db.tbl_notification.Add(tn);
            db.SaveChanges();

        }

        /// <summary>
        /// Save matter details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="ml1"></param>
        /// <param name="cemail"></param>
        /// <param name="username"></param>
        /// <param name="cpassword"></param>
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
        /// <returns></returns>
        public string savematter(AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {

            var db = new LawPracticeEntities();
            dynamic topclientid = 0;
            dynamic firmid1 = ml1.Firmid;

            // chek user 
            var chkuser = db.FirmUsers.Where(d => d.UserName == username).FirstOrDefault();
            // save userlogin data
            if (chkuser != null)
            {
                topclientid = chkuser.Id;
            }
            else
            {

                var lg = new FirmUser();

                lg.DefaultController = "Client";
                lg.IsActive = false;
                lg.IsFirmAdmin = false;
                lg.IsFirmClient = true;
                lg.Password = cpassword;
                lg.UserName = username;
                lg.DefaultAction = "dashboard";
                lg.Firmid = firmid1;
                db.FirmUsers.Add(lg);
                db.SaveChanges();
                var newId = lg.Id;
                if (cemail != null)
                {
                    var body1 = "Dear user You have registered Successfully<br> Your User Id: " + username + " <br>Password: " + cpassword;
                    try
                    {
                        CommomUtility obj1 = new CommomUtility();
                        obj1.SendEmail("nshrivastava@manupatra.com", cemail, "", "Registration Details", body1);
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {

                    }

                }
                var upclientd = db.FirmUsers.Where(x => x.Id == newId).FirstOrDefault();
                if (upclientd != null)
                {
                    upclientd.clientId = topclientid;
                    upclientd.iupdate = 1;
                    db.Entry(upclientd).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            AddLawMatterList cf = new AddLawMatterList();
            ColMap cm = new ColMap();

            cf.cfile = ml.cfile;
            cf.firmuser = ml.firmuser;
            cf.cnrno = ml.cnrno;
            cf.Firmid = ml.Firmid;
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
            //save in maptable

            for (int i = 1; i <= sum; i++)
            {
                cm.pid = cf.Id;
                cm.column_no = "col" + i;
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
                cm.Firmid = Guid.Parse(firmid.ToString());
                cm.formid = Convert.ToInt32(ftype);

                db.ColMaps.Add(cm);
                db.SaveChanges();

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
                        tn.urllink = "/Employee/MatterSingleView/" + topmid;
                    }
                    else
                    {
                        tn.urllink = "/Firm/MatterSingleView/" + topmid;
                    }

                    tn.notification = "You have Assigned new Matter(Case)";
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
                    tn1.notification = "You have New Matter(Case)";
                    tn1.typeid = topmid;
                    db.tbl_notification.Add(tn1);
                    db.SaveChanges();
                }
            }
            return topmid.ToString();
        }
        /// <summary>
        /// Get assign user list detail
        /// </summary>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string assignuserlist(string firmid)
        {

            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            var matter = db.sp_GetfirmUserList(Guid.Parse(firmid)).ToList();
            var a = JsonConvert.SerializeObject(matter);
            return a;
        }

        /// <summary>
        /// Get matter list
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string matterlist(string firmid, string userid)
        {

            //hrow new NotImplementedException();
            var db = new LawPracticeEntities();
            List<GetUserMattersDetail_Result> list = new List<GetUserMattersDetail_Result>();
            list = db.GetUserMattersDetail(Guid.Parse(firmid), Guid.Parse(userid)).ToList();
            foreach (var data in list.ToList())
            {
                GetUserMattersDetail_Result newItem = new GetUserMattersDetail_Result();

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
        /// Get matter list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string matterlistbyrowid(string firmid, string userid, int pagenum, int pagesize)
        {

            var db = new LawPracticeEntities();
            List<GetUserMattersDetailByRowId_Result> list = new List<GetUserMattersDetailByRowId_Result>();
            list = db.GetUserMattersDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetUserMattersDetailByRowId_Result newItem = new GetUserMattersDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));

                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));

                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;

                }
                if (!string.IsNullOrEmpty(data.assignuserto))
                {
                    string[] words = data.assignuserto.ToString().Split(',');
                    foreach (string word in words)
                    {
                        string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                        sb.Append(tempuser);
                        sb.Append(",");
                    }
                    newItem.assignuserto = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].assignuserto = newItem.assignuserto;
                }

                if (!string.IsNullOrEmpty(data.assignuserby))
                {
                    newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString().Replace(" ", "+")));
                    list[list.IndexOf(data)].assignuserby = newItem.assignuserby;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Find matter list by firm id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string findmatterlistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {

            var db = new LawPracticeEntities();
            List<GetSearchUserMattersDetailByRowId_Result> list = new List<GetSearchUserMattersDetailByRowId_Result>();
            list = db.GetSearchUserMattersDetailByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                GetSearchUserMattersDetailByRowId_Result newItem = new GetSearchUserMattersDetailByRowId_Result();
                sb.Clear();
                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));

                list[list.IndexOf(data)].Id = newItem.Id;
                if (data.UserCaseid != null)
                {
                    newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));

                    list[list.IndexOf(data)].UserCaseid = newItem.UserCaseid;

                }
                if (!string.IsNullOrEmpty(data.assignuserto))
                {
                    string[] words = data.assignuserto.ToString().Split(',');
                    foreach (string word in words)
                    {
                        string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                        sb.Append(tempuser);
                        sb.Append(",");
                    }
                    newItem.assignuserto = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].assignuserto = newItem.assignuserto;
                }

                if (!string.IsNullOrEmpty(data.assignuserby))
                {
                    newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                    list[list.IndexOf(data)].assignuserby = newItem.assignuserby;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Remove matter list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="apiurl"></param>
        /// <param name="remarks"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public string removematterlist(string typeIds, string firmid, string userid, string apiurl, string remarks, string roleid)
        {
            int result = 0;
            var db = new LawPracticeEntities();
            var typeIds1 = typeIds.Split(',');
            string did = "";
            foreach (string did1 in typeIds1)
            {
                try
                {
                     did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                }
                catch {
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
                catch
                {

                }
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
        /// <summary>
        /// Get archive matter list details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="apiurl"></param>
        /// <returns></returns>
        public string archivematterlist(string[] typeIds, string firmid, string userid, string apiurl)
        {
            var isarchived = 0;
            int resultdata = 0;
            var db = new LawPracticeEntities();

            foreach (string did1 in typeIds)
            {
                //string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                string did = "";
                try
                {
                    did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                }
                catch
                {
                    did = did1;
                }
                try
                {
                    var checkbasicdetails = db.usp_CaseBasicDetails(firmid, userid, did).FirstOrDefault();
                    if (checkbasicdetails != null)
                    {
                        if (checkbasicdetails.IsCaseArchive == 1)
                        {
                            isarchived = 1;
                        }

                        resultdata = db.sp_ArchiveMatter(firmid.ToString(), userid.ToString(), did.ToString());
                        var checkadminexist = false;
                        if (resultdata > 0)
                        {
                            var caseuser = checkbasicdetails.firmuser.ToString();
                            //checkrole of user create case
                            var getroles = db.usp_GetUserDetailByUserID(checkbasicdetails.Firmid.ToString(), checkbasicdetails.firmuser.ToString()).FirstOrDefault();
                            if (getroles != null)
                            {
                                var assignto = db.usp_GetAssignUserForEdit(firmid, userid, did).ToList();
                                if (assignto.Count > 0)
                                {
                                    if (isarchived == 1)
                                    {
                                        foreach (var data in assignto)
                                        {
                                            //for Creator not send the alerts
                                            if (data.id.ToString() != userid.ToString())
                                            {
                                                if (data.roleid == 1)
                                                {
                                                    checkadminexist = true;
                                                }
                                                //send notification 
                                                var sendnotification = Notification.SaveNotifications("UnArchiveMatter", null, firmid, userid, data.id.ToString(), checkbasicdetails.mname, did);
                                                //send mail
                                                var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid.ToString(), firmid.ToString()).FirstOrDefault();
                                                //get AssigneesName
                                                var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(data.id.ToString().ToString(), firmid.ToString()).FirstOrDefault();

                                                //get mykaselink
                                                string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                                CommomUtility objmail = new CommomUtility();
                                                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                                var stringcontent = "";
                                                var stringsubject = "";
                                                var result = db.usp_GetEmailTemplate("UnArchiveMatter").FirstOrDefault();
                                                stringcontent = result.EmailContent;
                                                stringsubject = result.EmailSubject;
                                                stringsubject = stringsubject.Replace("#MatterName#", checkbasicdetails.mname);
                                                stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                                                stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                                                if (!String.IsNullOrEmpty(checkbasicdetails.mname.ToString()))
                                                {
                                                    stringcontent = stringcontent.Replace("#MatterName#", checkbasicdetails.mname);
                                                }
                                                else
                                                {
                                                    stringcontent = stringcontent.Replace("#MatterName#", "");
                                                }
                                                stringcontent = stringcontent.Replace("#Date#", @String.Format("{0:dd MMM yyyy}", DateTime.Now));
                                                stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);
                                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                                objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                                            }
                                        }
                                        //send for admin if admin not creator of admin
                                        if (checkadminexist == false)
                                        {
                                            if (getroles.RoleId != 1)
                                            {
                                                var getadminoffirm = db.usp_GetAllFirmsUsers(Guid.Parse(firmid)).Where(x => x.RoleId == 1).FirstOrDefault();
                                                if (getadminoffirm != null)
                                                {
                                                    //for Creator not send the alerts
                                                    if (getadminoffirm.Id.ToString() != userid.ToString())
                                                    {
                                                        var sendnotification = Notification.SaveNotifications("UnArchiveMatter", null, firmid, userid, getadminoffirm.Id.ToString(), checkbasicdetails.mname, did);
                                                        //send mail
                                                        var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid.ToString(), firmid.ToString()).FirstOrDefault();
                                                        //get AssigneesName
                                                        var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(getadminoffirm.Id.ToString().ToString(), firmid.ToString()).FirstOrDefault();

                                                        //get mykaselink
                                                        string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();

                                                        CommomUtility objmail = new CommomUtility();
                                                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();


                                                        var stringcontent = "";
                                                        var stringsubject = "";
                                                        var result = db.usp_GetEmailTemplate("UnArchiveMatter").FirstOrDefault();
                                                        stringcontent = result.EmailContent;
                                                        stringsubject = result.EmailSubject;
                                                        stringsubject = stringsubject.Replace("#MatterName#", checkbasicdetails.mname);
                                                        stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                                                        stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                                                        if (!String.IsNullOrEmpty(checkbasicdetails.mname.ToString()))
                                                        {
                                                            stringcontent = stringcontent.Replace("#MatterName#", checkbasicdetails.mname);
                                                        }
                                                        else
                                                        {
                                                            stringcontent = stringcontent.Replace("#MatterName#", "");
                                                        }
                                                        stringcontent = stringcontent.Replace("#Date#", @String.Format("{0:dd MMM yyyy}", DateTime.Now));
                                                        stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);
                                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                                        objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        foreach (var data in assignto)
                                        {

                                            if (data.roleid == 1)
                                            {
                                                checkadminexist = true;
                                            }
                                            //for Creator not send the alerts
                                            if (data.id.ToString() != userid.ToString())
                                            {
                                                //send notification 
                                                var sendnotification = Notification.SaveNotifications("ArchiveMatter", null, firmid, userid, data.id.ToString(), checkbasicdetails.mname, did);

                                                //send mail
                                                var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid.ToString(), firmid.ToString()).FirstOrDefault();
                                                //get AssigneesName
                                                var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(data.id.ToString().ToString(), firmid.ToString()).FirstOrDefault();

                                                //get mykaselink
                                                string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();

                                                CommomUtility objmail = new CommomUtility();
                                                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();


                                                var stringcontent = "";
                                                var stringsubject = "";
                                                var result = db.usp_GetEmailTemplate("ArchiveMatter").FirstOrDefault();
                                                stringcontent = result.EmailContent;
                                                stringsubject = result.EmailSubject;
                                                stringsubject = stringsubject.Replace("#MatterName#", checkbasicdetails.mname);
                                                stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                                                stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                                                if (!String.IsNullOrEmpty(checkbasicdetails.mname.ToString()))
                                                {
                                                    stringcontent = stringcontent.Replace("#MatterName#", checkbasicdetails.mname);
                                                }
                                                else
                                                {
                                                    stringcontent = stringcontent.Replace("#MatterName#", "");
                                                }
                                                stringcontent = stringcontent.Replace("#Date#", @String.Format("{0:dd MMM yyyy}", DateTime.Now));



                                                stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);


                                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                                objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");

                                            }
                                        }

                                        //send for admin if admin not creator of admin
                                        if (checkadminexist == false)
                                        {
                                            if (getroles.RoleId != 1)
                                            {
                                                var getadminoffirm = db.usp_GetAllFirmsUsers(Guid.Parse(firmid)).Where(x => x.RoleId == 1).FirstOrDefault();
                                                if (getadminoffirm != null)
                                                {
                                                    //for Creator not send the alerts
                                                    if (getadminoffirm.Id.ToString() != userid.ToString())
                                                    {
                                                        var sendnotification = Notification.SaveNotifications("ArchiveMatter", null, firmid, userid, getadminoffirm.Id.ToString(), checkbasicdetails.mname, did);
                                                        //send mail
                                                        var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid.ToString(), firmid.ToString()).FirstOrDefault();
                                                        //get AssigneesName
                                                        var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(getadminoffirm.Id.ToString().ToString(), firmid.ToString()).FirstOrDefault();

                                                        //get mykaselink
                                                        string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();

                                                        CommomUtility objmail = new CommomUtility();
                                                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();


                                                        var stringcontent = "";
                                                        var stringsubject = "";
                                                        var result = db.usp_GetEmailTemplate("ArchiveMatter").FirstOrDefault();
                                                        stringcontent = result.EmailContent;
                                                        stringsubject = result.EmailSubject;
                                                        stringsubject = stringsubject.Replace("#MatterName#", checkbasicdetails.mname);
                                                        stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                                                        stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                                                        if (!String.IsNullOrEmpty(checkbasicdetails.mname.ToString()))
                                                        {
                                                            stringcontent = stringcontent.Replace("#MatterName#", checkbasicdetails.mname);
                                                        }
                                                        else
                                                        {
                                                            stringcontent = stringcontent.Replace("#MatterName#", "");
                                                        }
                                                        stringcontent = stringcontent.Replace("#Date#", @String.Format("{0:dd MMM yyyy}", DateTime.Now));



                                                        stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);


                                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                                        objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }



                            }
                        }
                    }

                }
                catch (Exception ed)
                {
                    return ed.ToString();
                }

            }
            return resultdata.ToString();
        }
        /// <summary>
        /// Get single matter details
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string singlematterdetails(string mid, string FirmId, string userid)
        {
            var db = new LawPracticeEntities();


            List<sp_UserMatterSingleDetail_Result> list = new List<sp_UserMatterSingleDetail_Result>();

            list = db.sp_UserMatterSingleDetail(Guid.Parse(FirmId), Guid.Parse(mid), Guid.Parse(userid)).ToList();
            StringBuilder sb = new StringBuilder();
            foreach (var data in list.ToList())
            {
                sb.Clear();
                sp_UserMatterSingleDetail_Result newItem = new sp_UserMatterSingleDetail_Result();
                if (!string.IsNullOrEmpty(data.assignuser))
                {
                    string[] words = data.assignuser.ToString().Split(',');
                    foreach (string word in words)
                    {
                        string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                        sb.Append(tempuser);
                        sb.Append(",");
                    }
                    newItem.assignuser = sb.ToString().TrimEnd(',');
                    list[list.IndexOf(data)].assignuser = newItem.assignuser;
                }

                if (!string.IsNullOrEmpty(data.ClientName))
                {
                    newItem.ClientName = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.ClientName.ToString()));
                    list[list.IndexOf(data)].ClientName = newItem.ClientName;
                }
            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Edit matter details
        /// </summary>
        /// <param name="ml"></param>
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
        public void editmatter(AddLawMatterList ml, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.cfile;
            var db = new LawPracticeEntities();
            ColMap cm = new ColMap();

            var cf = db.AddLawMatterLists.Where(x => x.Id == ml.Id && x.Firmid.ToString() == firmid.ToString() && (x.firmuser == ml.firmuser || x.assignto == ml.assignto)).FirstOrDefault();
            if (ml.cfile != "")
            {
                cf.cfile = "1";
            }
            cf.cnrno = ml.cnrno;
            cf.Firmid = ml.Firmid;
            cf.mnotes = ml.mnotes;
            cf.msol = ml.msol;
            cf.mtrno = ml.mtrno;
            cf.odate = ml.odate;
            cf.orgaty = ml.orgaty;
            cf.tags = ml.tags;
            cf.cdate = ml.cdate;
            cf.assignto = ml.assignto;
            cf.cstatus = ml.cstatus;
            cf.mname = ml.mname;
            cf.CaseSubject = ml.CaseSubject;
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
            cf.iupdate = 1;
            db.Entry(cf).State = EntityState.Modified;
            db.SaveChanges();

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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "case";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
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
                cm.Firmid = Guid.Parse(firmid.ToString());
                cm.formid = Convert.ToInt32(ftype);

                var mt = db.ColMaps.Where(x => x.Firmid.ToString() == firmid.ToString() && x.formid == cm.formid && x.pid == cm.pid && x.column_name == cm.column_name && x.column_no == cm.column_no).FirstOrDefault();
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

            tbl_notification tn1 = new tbl_notification();

            tn1.date_time = cf.date_time;
            tn1.Firmid = ml.Firmid;
            tn1.userid = ml.firmuser;
            tn1.auser = ml.firmuser;
            tn1.ntype = "Matter";
            tn1.status = 1;
            tn1.nmode = "edit";
            tn1.urllink = "/Client/MatterSingleView/" + ml.Id;
            tn1.notification = "You have New Matter(Case)";
            tn1.typeid = ml.Id;
            db.tbl_notification.Add(tn1);
            db.SaveChanges();

        }

        /// <summary>
        /// Save notes
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool savenote(AddNoteList ml)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.nfiles;
            if (ml.nfiles != "")
            {
                ml.nfiles = "1";
            }
            var db = new LawPracticeEntities();

            db.AddNoteLists.Add(ml);
            db.SaveChanges();

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


            tn.urllink = "/Employee/NoteSingleView/" + ml.Id;


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
            data.ncontact = ml.ncontact;
            data.ntags = ml.ntags;
            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            db.SaveChanges();
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "note";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            return true;
        }
        /// <summary>
        /// Save call details
        /// </summary>
        /// <param name="ml"></param>
        /// <returns></returns>
        public bool savecall(AddCallList ml)
        {
            var db = new LawPracticeEntities();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.cfiles;
            if (ml.cfiles != "")
            {
                ml.cfiles = "1";
            }
            db.AddCallLists.Add(ml);
            db.SaveChanges();
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "call";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }

            try
            {
                if (ml.cpuser != "")
                {
                    var asid = Convert.ToInt32(ml.cpuser);
                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users
                    tbl_notification tn = new tbl_notification();
                    tn.date_time = ml.date_time;
                    tn.Firmid = ml.Firmid;
                    tn.userid = ml.firmuser;
                    tn.auser = Guid.Parse(ml.cpuser);
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

                    tn.notification = "You have Assign new Call";
                    tn.typeid = ml.Id;
                    db.tbl_notification.Add(tn);
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
            var db = new LawPracticeEntities();
            var data = db.AddCallLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.ccontact = ml.ccontact;
            data.csubject = ml.csubject;
            if (ml.cfiles != "")
            {
                data.cfiles = "1";
            }
            data.ctags = ml.ctags;
            data.cpuser = ml.cpuser;
            data.cpcontact = ml.cpcontact;
            data.cmatter = ml.cmatter;
            data.ctype = ml.ctype;
            data.cdatetime = ml.cdatetime;
            data.cdura = ml.cdura;
            data.cdetails = ml.cdetails;

            data.iupdate = 1;
            db.Entry(data).State = EntityState.Modified;
            var count = db.SaveChanges();
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "call";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            try
            {


                if (ml.cpuser != "")
                {
                    var asid = Convert.ToInt32(ml.cpuser);

                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users


                    tbl_notification tn = new tbl_notification();

                    tn.date_time = ml.date_time;
                    tn.Firmid = ml.Firmid;
                    tn.userid = ml.firmuser;
                    tn.auser = Guid.Parse(ml.cpuser);
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
        /// Save task detail
        /// </summary>
        /// <param name="ml"></param>
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
        public bool savetask(AddTaskList ml, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5)
        {
            var db = new LawPracticeEntities();
            var rm = new AddRemindList();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;
            if (ml.tfile != "")
            {
                ml.tfile = "1";
            }
            db.AddTaskLists.Add(ml);
            db.SaveChanges();
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "task";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            try
            {


                if (ml.tauser.ToString() != "")
                {
                    var asid = Convert.ToInt32(ml.tauser);

                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users


                    tbl_notification tn = new tbl_notification();

                    tn.date_time = ml.date_time;
                    tn.Firmid = ml.Firmid;
                    tn.userid = ml.firmuser;
                    tn.auser = Guid.Parse(ml.tauser.ToString());
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

                    tn.notification = "You have Assign new Task";
                    tn.typeid = ml.Id;
                    db.tbl_notification.Add(tn);
                    db.SaveChanges();

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
                rm.Firmid = ml.Firmid;
                ///  rm.formid = 3;
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
        /// <returns></returns>
        public bool edittask(AddTaskList ml)
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "task";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }

            try
            {


                if (ml.tauser.ToString() != "")
                {
                    var asid = Convert.ToInt32(ml.tauser);

                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users


                    tbl_notification tn = new tbl_notification();

                    tn.date_time = ml.date_time;
                    tn.Firmid = ml.Firmid;
                    tn.userid = ml.firmuser;
                    tn.auser = Guid.Parse(ml.tauser.ToString());
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
        public bool saveevent(AddEventList ml, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5)
        {
            var db = new LawPracticeEntities();
            var rm = new AddRemindList();
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;

            if (ml.tfile != "")
            {
                ml.tfile = "1";
            }

            db.AddEventLists.Add(ml);
            db.SaveChanges();
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "event";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }

            try
            {


                if (ml.tauser.ToString() != "")
                {
                    var asid = ml.tauser;

                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users


                    tbl_notification tn = new tbl_notification();

                    tn.date_time = ml.date_time;
                    tn.Firmid = ml.Firmid;
                    tn.userid = ml.firmuser;
                    tn.auser = Guid.Parse(ml.tauser.ToString());
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

                    tn.notification = "You have Assign new Event";
                    tn.typeid = ml.Id;
                    db.tbl_notification.Add(tn);
                    db.SaveChanges();

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
                // rm.formid = "4";
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
        /// <returns></returns>
        public bool editevent(AddEventList ml)
        {
            MultipleFileMap mf = new MultipleFileMap();
            string s = ml.tfile;
            var db = new LawPracticeEntities();
            var data = db.AddEventLists.Where(x => x.Id == ml.Id && x.Firmid == ml.Firmid).FirstOrDefault();
            data.tsubject = ml.tsubject;
            data.tcontact = ml.tcontact;
            if (s != null)
            {
                data.tfile = "1";
            }
            data.tacontact = ml.tacontact;
            data.tauser = ml.tauser;
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
                    mf.rowid = ml.Id;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "event";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
            try
            {


                if (ml.tauser.ToString() != "")
                {
                    var asid = ml.tauser;

                    //check user type
                    var usertype = db.FirmUsers.Where(x => x.Id.ToString() == asid.ToString()).Select(x => new { x.RoleId }).FirstOrDefault();
                    //users


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
        /// Get note list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string notelist(string uid, string firmuser)
        {

            var db = new LawPracticeEntities();
            var matter = db.GetUserNoteDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();
            List<GetUserNoteDetails_Result> list = new List<GetUserNoteDetails_Result>();
            list = db.GetUserNoteDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserNoteDetails_Result newItem = new GetUserNoteDetails_Result();

                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));

                list[list.IndexOf(data)].Id = newItem.Id;

            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get event detail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string eventlist(string uid, string firmuser)
        {

            var db = new LawPracticeEntities();

            List<GetUserEventDetails_Result> list = new List<GetUserEventDetails_Result>();
            list = db.GetUserEventDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserEventDetails_Result newItem = new GetUserEventDetails_Result();

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
        /// Get call detail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string calllist(string uid, string firmuser)
        {

            var db = new LawPracticeEntities();

            List<GetUserCallDetails_Result> list = new List<GetUserCallDetails_Result>();
            list = db.GetUserCallDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserCallDetails_Result newItem = new GetUserCallDetails_Result();

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
        /// <param name="firmuser"></param>
        /// <returns></returns>

        public string tasklist(string uid, string firmuser)
        {

            var db = new LawPracticeEntities();

            List<GetUserTaskDetails_Result> list = new List<GetUserTaskDetails_Result>();
            list = db.GetUserTaskDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserTaskDetails_Result newItem = new GetUserTaskDetails_Result();

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
        /// Remove task list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string removecalllist(string[] typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();

            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                AddCallList call = (from c in db.AddCallLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                    select c).FirstOrDefault();
                db.AddCallLists.Remove(call);
                db.insertdeleteentrytable(Guid.Parse(did), "AddCallList", Guid.Parse(uid));
            }
            var countcall = db.SaveChanges();

            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {

                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13.Replace(" ", "+")));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.moduletype.ToString() == "call" && c.rowid.ToString() == dids31.ToString() select c).ToList();

                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();

            }

            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {

                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2.Replace(" ", "+")));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.EventType.ToString() == "Call" && c.rowid.ToString() == dids21.ToString() select c).ToList();

                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();

            }

            var a = JsonConvert.SerializeObject(countcall);
            return a;
        }
        /// <summary>
        /// Remove task list details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>

        public string removetasklist(string[] typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();

            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1.Replace(" ", "+")));
                AddTaskList task = (from c in db.AddTaskLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                    select c).FirstOrDefault();
                db.AddTaskLists.Remove(task);
                db.insertdeleteentrytable(Guid.Parse(did), "AddTaskList", Guid.Parse(uid));
            }
            var counttask = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {

                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.moduletype.ToString() == "task" && c.rowid.ToString() == dids31.ToString() select c).ToList();

                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();

            }

            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {

                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.EventType.ToString() == "Task" && c.rowid.ToString() == dids21.ToString() select c).ToList();

                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();

            }
            var a = JsonConvert.SerializeObject(counttask);
            return a;
        }

        /// <summary>
        /// Remove event detail
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string removeeventlist(string[] typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();

            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddEventList aevent = (from c in db.AddEventLists
                                       where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                       select c).FirstOrDefault();
                db.AddEventLists.Remove(aevent);
                db.insertdeleteentrytable(Guid.Parse(did), "AddEventList", Guid.Parse(uid));
            }
            var countevent = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {

                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.moduletype.ToString() == "event" && c.rowid.ToString() == dids31.ToString() select c).ToList();

                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();

            }

            // delete from ActivityUserMap
            foreach (string dids2 in typeIds)
            {

                string dids21 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids2));
                IEnumerable<ActivityUserMap> ct3 = (from c in db.ActivityUserMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.EventType.ToString() == "Event" && c.rowid.ToString() == dids21.ToString() select c).ToList();

                db.ActivityUserMaps.RemoveRange(ct3);
                db.insertdeleteentrytable(Guid.Parse(dids21), "ActivityUserMap", Guid.Parse(uid));
                db.SaveChanges();

            }
            var a = JsonConvert.SerializeObject(countevent);
            return a;
        }

        /// <summary>
        /// Remove note list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string removenotelist(string[] typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();

            foreach (string did1 in typeIds)
            {
                string did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                AddNoteList note = (from c in db.AddNoteLists
                                    where c.Id.ToString() == did.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                    select c).FirstOrDefault();
                db.AddNoteLists.Remove(note);
                db.insertdeleteentrytable(Guid.Parse(did), "AddNoteList", Guid.Parse(uid));
            }
            var countnote = db.SaveChanges();
            // delete from ActivityFileMap
            foreach (string dids13 in typeIds)
            {

                string dids31 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids13));
                IEnumerable<MultipleFileMap> ct2 = (from c in db.MultipleFileMaps where c.Firmid.ToString() == uid.ToString() && c.userid.ToString() == firmuser.ToString() && c.moduletype.ToString() == "note" && c.rowid.ToString() == dids31.ToString() select c).ToList();

                db.MultipleFileMaps.RemoveRange(ct2);
                db.insertdeleteentrytable(Guid.Parse(dids31), "MultipleFileMap", Guid.Parse(uid));
                db.SaveChanges();

            }


            var a = JsonConvert.SerializeObject(countnote);
            return a;
        }
        /// <summary>
        /// Get single calling list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string singlecalllist(string uid, string id, string firmuser)
        {

            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();

            List<GetUserSingleCallDetails_Result> list = new List<GetUserSingleCallDetails_Result>();
            list = db.GetUserSingleCallDetails(Guid.Parse(uid), Guid.Parse(id), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetUserSingleCallDetails_Result newItem = new GetUserSingleCallDetails_Result();

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
        /// Get single note detail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string singlenotelist(string uid, string id, string firmuser)
        {
            var db = new LawPracticeEntities();

            StringBuilder sb = new StringBuilder();

            List<GetUserSingleNoteDetails_Result> list = new List<GetUserSingleNoteDetails_Result>();
            list = db.GetUserSingleNoteDetails(Guid.Parse(uid), Guid.Parse(id), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetUserSingleNoteDetails_Result newItem = new GetUserSingleNoteDetails_Result();

                newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));

                list[list.IndexOf(data)].Id = newItem.Id;


            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Single event list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string singleeventlist(string uid, string id, string firmuser)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();

            List<GetUserSingleEventDetails_Result> list = new List<GetUserSingleEventDetails_Result>();
            list = db.GetUserSingleEventDetails(Guid.Parse(uid), Guid.Parse(id), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetUserSingleEventDetails_Result newItem = new GetUserSingleEventDetails_Result();

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
        /// Get single task list
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="id"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string singletasklist(string uid, string id, string firmuser)
        {
            var db = new LawPracticeEntities();
            StringBuilder sb = new StringBuilder();

            var task = db.GetUserSingleTaskDetails(Guid.Parse(uid), Guid.Parse(id), Guid.Parse(firmuser)).ToList();
            List<GetUserSingleTaskDetails_Result> list = new List<GetUserSingleTaskDetails_Result>();
            list = db.GetUserSingleTaskDetails(Guid.Parse(uid), Guid.Parse(id), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                sb.Clear();
                GetUserSingleTaskDetails_Result newItem = new GetUserSingleTaskDetails_Result();

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
        /// Remove single task list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string removesingletasklist(string typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();


            AddTaskList task = (from c in db.AddTaskLists
                                where c.Id.ToString() == typeIds.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                select c).FirstOrDefault();
            db.AddTaskLists.Remove(task);

            db.insertdeleteentrytable(Guid.Parse(typeIds), "AddTaskList", Guid.Parse(uid));

            var counttask = db.SaveChanges();
            var a = JsonConvert.SerializeObject(counttask);
            return a;
        }

        /// <summary>
        /// Remove single event list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string removesingleeventlist(string typeIds, string uid, string firmuser)
        {
            var db = new LawPracticeEntities();

            AddEventList aevent = (from c in db.AddEventLists
                                   where c.Id.ToString() == typeIds.ToString() && c.Firmid.ToString() == uid.ToString() && c.firmuser.ToString() == firmuser.ToString()
                                   select c).FirstOrDefault();
            db.AddEventLists.Remove(aevent);
            db.insertdeleteentrytable(Guid.Parse(typeIds), "AddEventList", Guid.Parse(uid));
            var countevent = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countevent);
            return a;
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
        /// Timer list details
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="firmuser"></param>
        /// <returns></returns>
        public string timerlist(string uid, string firmuser)
        {

            var db = new LawPracticeEntities();

            List<GetUserTimerDetails_Result> list = new List<GetUserTimerDetails_Result>();
            list = db.GetUserTimerDetails(Guid.Parse(uid), Guid.Parse(firmuser)).ToList();



            foreach (var data in list.ToList())
            {
                GetUserTimerDetails_Result newItem = new GetUserTimerDetails_Result();

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

            List<GetUserTimerDetailsByRowId_Result> list = new List<GetUserTimerDetailsByRowId_Result>();
            list = db.GetUserTimerDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0).ToList();



            foreach (var data in list.ToList())
            {
                GetUserTimerDetailsByRowId_Result newItem = new GetUserTimerDetailsByRowId_Result();

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
        /// Search timer list by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string timerlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize, string search)
        {

            var db = new LawPracticeEntities();

            List<GetSearchUserTimerDetailsByRowId_Result> list = new List<GetSearchUserTimerDetailsByRowId_Result>();
            list = db.GetSearchUserTimerDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0, search).ToList();



            foreach (var data in list.ToList())
            {
                GetSearchUserTimerDetailsByRowId_Result newItem = new GetSearchUserTimerDetailsByRowId_Result();

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
    }
}
