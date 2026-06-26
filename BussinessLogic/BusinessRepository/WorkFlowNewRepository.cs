using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using Newtonsoft.Json;
#pragma warning disable CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
#pragma warning restore CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
#pragma warning disable CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
#pragma warning restore CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
using QueryStringEDAES;


namespace BussinessLogic.BusinessRepository
{
    public class WorkFlowNewRepository : IWorkFlowNewRepository
    {
        /// <summary>
        /// Get work flow firm user by firm id
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<FirmUser> FirmUser(string uid)
        {
            var db = new LawPracticeEntities();
            var contact = db.FirmUsers.Where(x => x.Firmid.ToString() == uid.ToString()).ToList();
            return contact;
        }
        /// <summary>
        /// Get firm user list for work flow by firm id
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string FirmUserList(string uid)
        {
            var db = new LawPracticeEntities();
            var user = db.usp_GetFirmUser(Guid.Parse(uid.ToString())).ToList();
            var a = JsonConvert.SerializeObject(user);
            return a;
        }
        /// <summary>
        /// Task stage
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<tblStage> TaskStage(tblStage obj)
        {
            var db = new LawPracticeEntities();
            var strdetail = db.tblStages.Where(x => x.TaskItemId == obj.TaskItemId & x.Active == 1).ToList();
            //var data = JsonConvert.SerializeObject(strdetail);
            return strdetail;
        }
        /// <summary>
        /// Matter hearing details
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<tblMatterHearing> MatterHearing(tblMatterHearing obj)
        {
            var db = new LawPracticeEntities();
            var strdetail = db.tblMatterHearings.Where(x => x.MatterId == obj.MatterId).ToList();
            //var data = JsonConvert.SerializeObject(strdetail);
            return strdetail;
        }
        /// <summary>
        /// Matter list details
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string MatterListDetail(AddLawMatterList obj)
        {

            var db = new LawPracticeEntities();
            var strdetail = db.usp_wf_GetMatterListDetail(obj.cstatus, Guid.Parse(obj.assignto.ToString()));
            var data = JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }
        /// <summary>
        /// Matter list details by client id
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="role"></param>
        /// <param name="userid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string MatterListDetailbyclientid(AddLawMatterList obj, string role, string userid, string firmid)
        {

            var db = new LawPracticeEntities();
            var strdetail = db.usp_wf_GetMatterListDetailbyclientid(obj.cstatus, Guid.Parse(obj.assignto.ToString()), Guid.Parse(userid.ToString()), Guid.Parse(firmid.ToString()), Convert.ToInt16(role));
            var data = JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }
        /// <summary>
        /// Get client details
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public string ClientDetail(string uid, string firmid)
        {
            var db = new LawPracticeEntities();
            List<usp_wf_GetClientDetails_Result> list = new List<usp_wf_GetClientDetails_Result>();

            list = db.usp_wf_GetClientDetails(Guid.Parse(firmid), Guid.Parse(uid)).ToList();
            foreach (var data in list.ToList())
            {
                usp_wf_GetClientDetails_Result newItem = new usp_wf_GetClientDetails_Result();


                if (!string.IsNullOrEmpty(data.cphoto))
                {
                    newItem.cphoto = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.cphoto.ToString()));
                    list[list.IndexOf(data)].cphoto = newItem.cphoto;
                }


            }
            var a = JsonConvert.SerializeObject(list);
            return a;
        }
        /// <summary>
        /// Get matter list by user
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string MatterListByUser(AddLawMatterList obj, int pagenum, int pagesize)
        {
            var db = new LawPracticeEntities();
            // var strdetail = db.AddLawMatterLists.Where(x => x.assignto == obj.assignto & x.firmId==obj.firmId & x.cstatus==obj.cstatus).ToList();
            //var strdetail = db.usp_wf_GetMatterDetailByUser(Guid.Parse(obj.assignto.ToString()), Guid.Parse(obj.Firmid.ToString()), obj.cstatus, obj.CourtName, pagenum, pagesize,obj.mname);
            List<usp_wf_GetMatterDetailByUser_Result> list = new List<usp_wf_GetMatterDetailByUser_Result>();
            list = db.usp_wf_GetMatterDetailByUser(Guid.Parse(obj.assignto.ToString()), Guid.Parse(obj.Firmid.ToString()), obj.cstatus, obj.CourtName, pagenum, pagesize, obj.mname).ToList();



            foreach (var data in list.ToList())
            {
                usp_wf_GetMatterDetailByUser_Result newItem = new usp_wf_GetMatterDetailByUser_Result();

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
        /// Change password
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string ChangePassword(FirmUser obj)
        {
            var db = new LawPracticeEntities();
            var aff = db.usp_UpdateUserPassword(obj.Firmid.ToString(), obj.Id.ToString(), obj.Password);
            return aff.ToString();
        }
        /// <summary>
        /// Matter list by client id
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string MatterListByClient(AddLawMatterList obj)
        {
            var db = new LawPracticeEntities();
            var strdetail = db.usp_wf_GetCaseUserId(Guid.Parse(obj.matterclientid.ToString()), Guid.Parse(obj.Firmid.ToString())).ToList();
            var data = JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }
        /// <summary>
        /// Get calender view data
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string CalendarViewdata(CommomUtility obj)
        {
            //var db = new LawPracticeEntities();
            //// var strdetail = db.AddLawMatterLists.Where(x => x.matterclientid == obj.matterclientid & x.firmId==obj.firmId).ToList();
            //var strdetail = db.usp_wf_GetCaseUserId(Convert.ToInt32(obj.matterclientid), Convert.ToInt32(obj.firmId)).ToList();
            var data = "";// JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }

        public string CalendarViewdata(CommonUtility obj)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Get calender view data
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string CalendarViewdata(AddLawMatterList obj)
        {
            var db = new LawPracticeEntities();
            var strdetail = db.usp_wf_GetCaseUserId(Guid.Parse(obj.matterclientid.ToString()), Guid.Parse(obj.Firmid.ToString())).ToList();
            var data = JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }
        /// <summary>
        /// Calendar View data firm user id
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string CalendarViewdatafirmuserid(AddLawMatterList obj)
        {
            var db = new LawPracticeEntities();
            // var strdetail = db.AddLawMatterLists.Where(x => x.matterclientid == obj.matterclientid & x.firmId==obj.firmId).ToList();
            var strdetail = db.usp_wf_GetCaseByFirmUserId(Guid.Parse(obj.matterclientid.ToString()), Guid.Parse(obj.Firmid.ToString())).ToList();
            var data = JsonConvert.SerializeObject(strdetail);
            return data.ToString();
        }
        /// <summary>
        /// Firm registration details
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="obju"></param>
        /// <param name="adminusername"></param>
        /// <param name="originalpass"></param>
        /// <param name="designation"></param>
        /// <param name="fname"></param>
        /// <param name="mname"></param>
        /// <param name="lname"></param>
        /// <param name="orgnisationsize"></param>
        /// <param name="orgnisationtype"></param>
        /// <param name="adminmobile"></param>
        /// <returns></returns>
        public string FirmRegistration(Firm obj, FirmUser obju, string adminusername, string originalpass, string designation, string fname, string mname, string lname, string orgnisationsize, string orgnisationtype, string adminmobile)
        {
            var successcount = 0;
            RegUser ru = new RegUser();
            dynamic aff1 = "0";
            var FirmUserId = "";
#pragma warning disable CS0219 // The variable 'aloginid' is assigned but its value is never used
            dynamic aloginid = null;
#pragma warning restore CS0219 // The variable 'aloginid' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'afirmid' is assigned but its value is never used
            dynamic afirmid = null;
#pragma warning restore CS0219 // The variable 'afirmid' is assigned but its value is never used
            var db = new LawPracticeEntities();
            var struser = obju.UserName;
            var stremail = obj.FirmContactEmail;
            var strdetail = db.Usp_GetFirmuserDetailsbyUserName(struser).ToList();
            //var strdetail = db.FirmUsers.Where(x => x.UserName == struser).ToList();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            if (strdetail.Count == 0)
            {
                var aff = db.Firms.Add(obj);
                db.SaveChanges();
                var id = obj.Id;
                if (id != null)
                {
                    obju.Firmid = id;
                    obju.OrganisationSize = orgnisationsize;
                    obju.OrganisationType = orgnisationtype;
                    aff1 = db.FirmUsers.Add(obju);
                    aff1 = db.SaveChanges();
                    FirmUserId = Convert.ToString(obju.Id);
                    var ct = db.Usp_SaveRegUserMemberData(id.ToString(), null, obju.Id.ToString(), adminusername, fname, mname, lname, designation, null, null, adminmobile, obj.FirmAddress1, obj.Country, obj.State, obj.City, "1", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
                    successcount = ct;

                    //var addfClient = new WebClient();
                    //object rawfile = new
                    //{
                    //    Accesstoken = AccessTokenDetail,
                    //    User_Id = adminusername,
                    //    vDispName = cname,
                    //    email_id = cemail,
                    //    mobile_No = cmobile,
                    //    Address = obj.FirmAddress1,
                    //    CountryId = obj.Country,
                    //    CountryName = obj.Country,
                    //    StateId = obj.State,
                    //    StateName = obj.State,
                    //    CityId = obj.,
                    //    CityName = courtflags,
                    //    Zipcode = LoggedInUser.FirmId.ToString(),
                    //    vpassword = AccessTokenDetail
                    //};
                    //addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    //string builders = JsonConvert.SerializeObject(rawfile);
                    //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    //string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/InsertToCaseWatchNewUser"), "POST", builders);

                }
                if (obj.iTrail > 0)
                {
                    FirmRegistrationTrialMail("contact@mykase.in", obj.FirmContactEmail, "", fname.Trim(), obju.UserName, originalpass);
                }
                else
                {
                    var fullName = fname.Trim() + " " + mname + " " + lname;
                    //originalpass = "As entered by you during registration";
                    RegistrationMail("contact@mykase.in", obju.EmailId, "", fullName.Trim(), obju.UserName, originalpass);
                }

                //send mail to mykase admin
                try
                {
                    string adminemail = System.Web.Configuration.WebConfigurationManager.AppSettings["FirmRegistrationMailAdmin"].ToString();
                    string fromemail = System.Web.Configuration.WebConfigurationManager.AppSettings["fromemail"].ToString();

                    CommomUtility objmail = new CommomUtility();
                    string strsubject = "", strbody = "";
                    strsubject = "mykase New Firm Registration Detail";

                    strbody += "New Firm Registration details given below:<br><br>";

                    strbody += "Name : " + fname + " " + mname + " " + lname + "<br>";
                    strbody += "Organization Name : " + obj.FirmName + "<br>";

                    strbody += "Organization Size : " + orgnisationsize + "<br>";
                    strbody += "Date Time : " + DateTime.Now.ToString() + "<br>";
                    strbody += "Firm Code : " + obj.FirmCode + "<br>";
                    strbody += "Firm Email : " + obj.FirmContactEmail + "<br>";
                    strbody += "Firm Mobile : " + obj.FirmContactno + "<br>";
                    strbody += "Address : " + obj.FirmAddress1 + "<br>";
                    strbody += "Admin Name : " + adminusername + "<br>";
                    strbody += "Admin Mobile : " + adminmobile + "<br>";
                    strbody += "Admin Email : " + obju.EmailId + "<br>";
                    strbody += "Admin UserId : " + obju.UserName + "<br>";
                    if (!String.IsNullOrEmpty(obj.Country))
                    {
                        strbody += "Country: " + obj.Country + "<br>";
                    }
                    if (!String.IsNullOrEmpty(obj.State))
                    {
                        strbody += "State: " + obj.State + "<br>";
                    }
                    if (!String.IsNullOrEmpty(obj.City))
                    {
                        strbody += "City : " + obj.City + "<br>";
                    }
                    strbody += "<br>";
                    strbody += "Thanks & Regards,<br>Mykase<br><br>";

                    objmail.SendEmail(fromemail, adminemail, "", strsubject, strbody);
                }
                catch
                {

                }
            }
            // var a = JsonConvert.SerializeObject(client);
            //return successcount.ToString();
            var successResult = successcount.ToString() + "_" + FirmUserId;
            return successResult.ToString();

        }

        //public class FirmRegistrationResult
        //{
        //    public int SuccessCount { get; set; }
        //    public string FirmUserId { get; set; }
        //}
        /// <summary>
        /// Firm registration trial mail
        /// </summary>
        /// <param name="strfrom"></param>
        /// <param name="strto"></param>
        /// <param name="strcc"></param>
        /// <param name="strname"></param>
        /// <param name="struserid"></param>
        /// <param name="strpass"></param>
        private void FirmRegistrationTrialMail(string strfrom, string strto, string strcc, string strname, string struserid, string strpass)
        {
            string trialdays = System.Web.Configuration.WebConfigurationManager.AppSettings["trialdays"].ToString();
            string TrialRegistrationSubject = System.Web.Configuration.WebConfigurationManager.AppSettings["TrialRegistrationSubject"].ToString();
            string TrialRegistrationBody = System.Web.Configuration.WebConfigurationManager.AppSettings["TrialRegistrationBody"].ToString();

            CommomUtility objmail = new CommomUtility();
#pragma warning disable CS0219 // The variable 'strbody' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'strsubject' is assigned but its value is never used
            string strsubject = "", strbody = "";
#pragma warning restore CS0219 // The variable 'strsubject' is assigned but its value is never used
#pragma warning restore CS0219 // The variable 'strbody' is assigned but its value is never used
            TrialRegistrationBody = TrialRegistrationBody.Replace("#NAME#", strname);
            TrialRegistrationBody = TrialRegistrationBody.Replace("#Username#", struserid);
            TrialRegistrationBody = TrialRegistrationBody.Replace("#Password#", strpass);

            objmail.SendEmail(strfrom, strto, strcc, TrialRegistrationSubject, TrialRegistrationBody);
        }
        private void RegistrationMail(string strfrom, string strto, string strcc, string strname, string struserid, string strpass)
        {
            //string trialdays = System.Web.Configuration.WebConfigurationManager.AppSettings["trialdays"].ToString();
            string RegistrationSubject = System.Web.Configuration.WebConfigurationManager.AppSettings["RegistrationSubject"].ToString();
            string RegistrationBody = System.Web.Configuration.WebConfigurationManager.AppSettings["RegistrationBody"].ToString();

            CommomUtility objmail = new CommomUtility();
            RegistrationBody = RegistrationBody.Replace("#NAME#", strname);
            RegistrationBody = RegistrationBody.Replace("#Username#", struserid);
            RegistrationBody = RegistrationBody.Replace("#Password#", strpass);

            objmail.SendEmail(strfrom, strto, strcc, RegistrationSubject, RegistrationBody);
        }
        /// <summary>
        /// Firm registration mail
        /// </summary>
        /// <param name="strfrom"></param>
        /// <param name="strto"></param>
        /// <param name="strcc"></param>
        /// <param name="strname"></param>
        /// <param name="struserid"></param>
        /// <param name="strpass"></param>
        private void FirmRegistrationMail(string strfrom, string strto, string strcc, string strname, string struserid, string strpass)
        {
            string trialdays = System.Web.Configuration.WebConfigurationManager.AppSettings["trialdays"].ToString();

            CommomUtility objmail = new CommomUtility();
            string strsubject = "", strbody = "";
            strsubject = "Mykase Firm Registration Detail";
            strbody += "Dear " + strname + ",<br><br>";
            strbody += "Your Trial Firm Registraion details has been registered successfully. it is valid for " + trialdays + " days.<br><br>";
            strbody += "Please find the below detail of Mykase Firm admin login.<br><br>";
            strbody += "Login Id : " + struserid + "<br>";
            strbody += "Password : " + strpass + "<br><br>";

            strbody += "After approval you can use your id and password to login to MyKase<br><br><br><br>";
            strbody += "Thanks & Regards,<br>Mykase<br><br>";
            objmail.SendEmail(strfrom, strto, strcc, strsubject, strbody);
        }


        public string SaveProfile(RegUserTable obj, string email)
        {
            throw new NotImplementedException();
        }

    }
}
