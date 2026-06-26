using BussinessLogic;
using BussinessLogic.BusinessEntity;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class AccountApiController : BaseFirmApiController
    {
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "AccountApiController";

        // GET: api/AddContactsList
        [System.Web.Mvc.AllowAnonymous]
        [System.Web.Mvc.HttpGet]
        public IQueryable<AddContactsList> GetAccountApi()
        {
            return db.AddContactsLists;
        }
        /// <summary>
        /// Login with admin, user and partner
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpGet]
        public string Login([FromBody] JObject paramJObject)
        {
            var key = "";
            //Decrypt Password
            var Areas = Area;
            var modulename = "";
            var twofactorvalue = "";
            var twofactorfirmidvalue = "";
            var twofactoruseridvalue = "";
            var UserGUID = "";
            var GetSessionID = HttpContext.Current.Session.SessionID;
            var AbandonSessionId = System.Web.HttpContext.Current.Application["SessionAbandonFlags"];
            HttpContext.Current.Session["tempUserGrid"] = "";
            HttpContext.Current.Session["loginCurrentSessionId"] = System.Web.HttpContext.Current.Session.SessionID.ToString();
            HttpContext.Current.Session["IsExpireSoonDays"] = "NoExpire";
            try
            {
                var request = paramJObject.ToObject<FirmEmployee>();
                var headers = Request.Headers;
                var password = QueryAES.GetHashedCode(headers.GetValues("Password").First());
                password = password.Replace("\n", "");
                //Change Password session logout
                if (System.Web.HttpContext.Current.Application["SessionAbandonFlags"] == null)
                    System.Web.HttpContext.Current.Application["SessionAbandonFlags"] = new List<string>();
                if (AbandonSessionId != null)
                {
                    System.Web.HttpContext.Current.Application["SessionAbandonFlags"] = null;
                }
                //get logincount foir users
                //var getusercount = db.Usp_GetUserActiveLoginLimit(Guid.Empty.ToString(), request.UserName.ToString()).FirstOrDefault();
                //if (getusercount != null && getusercount.LoginLimit != 0)
                //{
                //    var getcurrentotalLoginSession = db.Usp_GetUserActiveStatus(Guid.Empty.ToString(), request.UserName.ToString()).Count();
                //    if (getcurrentotalLoginSession >= getusercount.LoginLimit)
                //    {
                //        return "alreadyloggedin";
                //    }
                //}
                //else
                //{
                //    var chkexstlogin = db.Usp_ChekAlreadyloginUser(request.UserName.ToString()).FirstOrDefault();
                //    if (Convert.ToInt32(chkexstlogin.Value) > 0)
                //    {
                //        return "alreadyloggedin";
                //    }
                //}

                //check for two authentication
                var checktwofactor = db.usp_GetFirmUsers_api(request.UserName, password, 1).FirstOrDefault();
                if (checktwofactor != null)
                {

                    twofactorvalue = checktwofactor.IsTwoFactorAuth.ToString();
                    twofactorfirmidvalue = checktwofactor.Firmid.ToString();
                    twofactoruseridvalue = checktwofactor.Id.ToString();
                }
                //if two auth true
                if (twofactorvalue.ToString() == "1")
                {
                    int otpValue = new Random().Next(100000, 999999);
                    var getmobiletwofactor = db.usp_GetRegUsers_api(twofactoruseridvalue, twofactorfirmidvalue).FirstOrDefault();

                    //Send otp
                    if (getmobiletwofactor.cmobile.ToString() != "")
                    {
                        var decmobile = getmobiletwofactor.cmobile.ToString();
                        var check = db.TblRegOtps.Where(x => x.Mobile == decmobile && x.isLogin == 1).FirstOrDefault();
                        if (check != null)
                        {
                            int scussess = db.usp_UpdateTblRegOtps_api(check.Id.ToString(), otpValue.ToString(), DateTime.Now.ToString(), 0, 1);
                            string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                            strURL = strURL.Replace("#cmobile", decmobile.ToString()).Replace("#otpvalue", otpValue.ToString());
                            String strResult;
                            WebResponse objResponse;
                            WebRequest objRequest = HttpWebRequest.Create(strURL);
                            objResponse = objRequest.GetResponse();
                            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                            {
                                strResult = sr.ReadToEnd();
                                sr.Close();
                            }
                        }
                        else
                        {
                            int scussess = db.usp_AddTblRegOtps_api(decmobile, otpValue.ToString(), DateTime.Now.ToString(), 0, 1);

                            string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                            strURL = strURL.Replace("#cmobile", decmobile).Replace("#otpvalue", otpValue.ToString());
                            String strResult;
                            WebResponse objResponse;
                            WebRequest objRequest = HttpWebRequest.Create(strURL);
                            objResponse = objRequest.GetResponse();
                            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                            {
                                strResult = sr.ReadToEnd();
                                sr.Close();
                            }
                        }
                    }
                    HttpContext.Current.Session["authsessionfirmid"] = Convert.ToBase64String(QueryAES.EncryptAes(twofactorfirmidvalue));
                    HttpContext.Current.Session["authsessionuserid"] = Convert.ToBase64String(QueryAES.EncryptAes(twofactoruseridvalue));
                    HttpContext.Current.Session["authsessionusername"] = Convert.ToBase64String(QueryAES.EncryptAes(request.UserName.ToString()));
                    HttpContext.Current.Session["authsessionpassword"] = password.ToString();
                    HttpContext.Current.Session["authsessionmobile"] = getmobiletwofactor.cmobile;
                    HttpContext.Current.Session["authsessionotp"] = Convert.ToBase64String(QueryAES.EncryptAes(otpValue.ToString()));
                    HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                    db.saveuseractivity(twofactorfirmidvalue.ToString(), twofactoruseridvalue.ToString(), twofactoruseridvalue.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return ("Authenticate");
                }
                else
                {
                    UserGUID = db.usp_GetUserIdByusername(request.UserName).Select(x => x.ToString()).FirstOrDefault();
                    var firmids1 = db.FirmUsers.Where(x => x.UserName == request.UserName && x.Password == password).FirstOrDefault();
                    if (firmids1 != null)
                    {
                        var firmcodes = db.Firms.Where(x => x.Id.ToString() == firmids1.Firmid.ToString()).FirstOrDefault();
                        Areas = firmcodes.FirmCode;
                        //Added for Account Expiry Pop-up
                        int DateDifference = (Convert.ToDateTime(firmcodes.ExpiryDate) - DateTime.Now.Date).Days;
                        if (DateDifference <= 15)
                        {
                            HttpContext.Current.Session["IsExpireSoonDays"] = Convert.ToDateTime(firmcodes.ExpiryDate).ToString("dd/MM/yyyy").Replace("-","/");
                        }
                    }
                    if (Areas == "home")
                    {
                        var user = Repository.FirmUser.Login(request.UserName, password, key, Areas);
                        HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                        var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                        var param = controllername + ">Login>Firmuser>param=" + request.UserName + "@" + password + "@" + key + "@" + Areas;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                        new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                        HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                        HttpContext.Current.Session["sessionuserid"] = user.UserId;
                        HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                        HttpContext.Current.Session["IsCaseWatchUser"] = user.IsCaseWatchUser;

                        CreateSession(HttpContext.Current, user);
                        var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
                        var ctd = db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                        try
                        {
                            db.usp_saveloginlog(user.FirmId.ToString(), request.UserName.ToString());

                        }
                        catch (Exception er)
                        {

                        }
                        try
                        {
                            db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), request.UserName.ToString(), GetSessionID);

                        }
                        catch (Exception er)
                        {

                        }
                        try
                        {
                            //save in userspy
                            db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                        }
                        catch (Exception er)
                        {

                        }
                        return (Areas + y);
                    }

                    //default url
                    if (!String.IsNullOrEmpty(Areas))
                    {
                        //check frimocde validate
                        var checkfirmcode = db.usp_GetFirmsbyCode_api(Areas).FirstOrDefault();
                        if (checkfirmcode == null)
                        {
                            Areas = "";
                        }
                    }

                    //wihtout two auth
                    if (Areas != "")
                    {
                        var user = Repository.FirmUser.Login(request.UserName, password, key, Areas);
                        HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                        var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                        var param = controllername + ">Login>Firmuser>param=" + request.UserName + "@" + password + "@" + key + "@" + Areas;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                        new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                        HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                        HttpContext.Current.Session["sessionuserid"] = user.UserId;
                        HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                        HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                        HttpContext.Current.Session["IsCaseWatchUser"] = user.IsCaseWatchUser;
                        CreateSession(HttpContext.Current, user);

                        var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));

                        db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                        try
                        {
                            db.usp_saveloginlog(twofactorfirmidvalue.ToString(), request.UserName.ToString());
                        }
                        catch (Exception er)
                        {

                        }
                        try
                        {
                            db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), request.UserName.ToString(), GetSessionID);
                        }
                        catch (Exception er)
                        {

                        }
                        try
                        {
                            //save in userspy
                            db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                        }
                        catch (Exception er)
                        {

                        }
                        return (Areas + y);
                    }
                    else
                    {
                        var firmids = db.usp_GetFirmUsers_api(request.UserName, password, null).FirstOrDefault();
                        if (firmids != null)
                        {
                            var firmcodes = db.usp_GetFirms_api(firmids.Firmid.ToString()).FirstOrDefault();
                            Areas = firmcodes.FirmCode;
                            //Added for Account Expiry Pop-up
                            int DateDifference = (Convert.ToDateTime(firmcodes.ExpiryDate) - DateTime.Now.Date).Days;
                            if (DateDifference <= 15)
                            {
                                HttpContext.Current.Session["IsExpireSoonDays"] = Convert.ToDateTime(firmcodes.ExpiryDate).ToString("dd/MM/yyyy").Replace("-", "/"); ;
                            }
                        }
                        var user = Repository.FirmUser.Login(request.UserName, password, key, Areas);
                        HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                        var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                        var param = controllername + ">Login>Firmuser>param=" + request.UserName + "@" + password + "@" + key + "@" + Areas;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                        new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);

                        HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                        HttpContext.Current.Session["sessionuserid"] = user.UserId;
                        HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                        HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                        HttpContext.Current.Session["IsCaseWatchUser"] = user.IsCaseWatchUser;
                        CreateSession(HttpContext.Current, user);

                        var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));

                        var ctd = db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                        try
                        {
                            db.usp_saveloginlog(user.FirmId.ToString(), request.UserName.ToString());
                        }
                        catch (Exception er)
                        {
                        }
                        try
                        {
                            db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), request.UserName.ToString(), GetSessionID);
                        }
                        catch (Exception er)
                        {
                        }
                        try
                        {
                            //save in userspy
                            db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                        }
                        catch (Exception er)
                        {
                        }
                        return (Areas + y);
                    }
                }
            }
            catch (Exception ex)
            {
                //try
                //{
                //    //save in userspy
                //    db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsError, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                //}
                //catch (Exception er)
                //{
                //}
                //save in userspy
                db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsError, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                db.usp_AddAuditError(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }
        /// <summary>
        /// Login api
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        public string Loginapi([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<FirmEmployee>();
            var headers = Request.Headers;
            var password = Convert.ToString(headers.GetValues("Password").First());
            var firm = Convert.ToString(headers.GetValues("firm").First());
            var key = Convert.ToString(headers.GetValues("Key").First());
            //Decrypt Password
            var user = Repository.FirmUser.Login(request.UserName, password, key, firm);
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            CreateSession(HttpContext.Current, user);
            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
            return (Area + y);
        }

        /// <summary>
        /// Common From Mykase Login
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpGet]
        public string CommonFromMykaseLogin([FromBody] JObject paramJObject)
        {

            var Username = Request.Headers.GetValues("UserName").FirstOrDefault();
            var Password = Request.Headers.GetValues("Password").FirstOrDefault();
            var Timestamp = Request.Headers.GetValues("Timestamp").FirstOrDefault();

            Username = HttpUtility.UrlDecode(Username);
            Password = HttpUtility.UrlDecode(Password);
            Username = Username.Replace(" ", "+");
            Password = Password.Replace(" ", "+");
            Timestamp = Timestamp.Replace(" ", "+");
            var UserNames = "";
            var hashpassword = "";
            var LoginTimestamp = "";
            try
            {
                UserNames = QueryAES.DecryptStringAESSSO(Username);
            }
            catch
            {
                UserNames = QueryAES.DecryptStringAESSSO("+" + Username);
            }
            try
            {
                hashpassword = QueryAES.DecryptStringAESSSO(Password);
            }
            catch
            {
                hashpassword = QueryAES.DecryptStringAESSSO("+" + Password);
            }
            try
            {
                LoginTimestamp = QueryAES.DecryptStringAESSSO(Timestamp);
            }
            catch
            {
                LoginTimestamp = QueryAES.DecryptStringAESSSO("+" + Timestamp);
            }
            var UserName = UserNames;
            var passwords = hashpassword;
            var password = QueryAES.GetHashedCode(passwords);
            password = password.Replace("\n", "");
            //var currentdatetime = DateTime.Now.AddMinutes(-1).Second;
            // var receiveddatetime = Convert.ToDateTime(LoginTimestamp).Second;
            var totalseconds = (DateTime.Now - Convert.ToDateTime(LoginTimestamp)).TotalSeconds;
            var key = "";
            //Decrypt Password
            var Areas = Area;
            var modulename = "";
            var twofactorvalue = "";
            var twofactorfirmidvalue = "";
            var twofactoruseridvalue = "";
            var UserGUID = "";
            var GetSessionID = HttpContext.Current.Session.SessionID;
            var AbandonSessionId = System.Web.HttpContext.Current.Application["SessionAbandonFlags"];
            HttpContext.Current.Session["tempUserGrid"] = "";
            HttpContext.Current.Session["loginCurrentSessionId"] = System.Web.HttpContext.Current.Session.SessionID.ToString();
            HttpContext.Current.Session["IsExpireSoonDays"] = "NoExpire";
            if (totalseconds <= 60)
            {
                try
                {
                    //Change Password session logout
                    if (System.Web.HttpContext.Current.Application["SessionAbandonFlags"] == null)
                        System.Web.HttpContext.Current.Application["SessionAbandonFlags"] = new List<string>();
                    if (AbandonSessionId != null)
                    {
                        System.Web.HttpContext.Current.Application["SessionAbandonFlags"] = null;
                    }
                    //if (UserNames.ToLower().ToString() == "manishv" || UserNames.ToLower().ToString() == "priyanka")
                    //{

                    //}
                    //else
                    //{
                    //    //get logincount foir users
                    //    var getusercount = db.Usp_GetUserActiveLoginLimit(Guid.Empty.ToString(), UserNames.ToString()).FirstOrDefault();
                    //    if (getusercount != null && getusercount.LoginLimit != 0)
                    //    {
                    //        var getcurrentotalLoginSession = db.Usp_GetUserActiveStatus(Guid.Empty.ToString(), UserNames.ToString()).Count();
                    //        if (getcurrentotalLoginSession >= getusercount.LoginLimit)
                    //        {
                    //            return "alreadyloggedin";
                    //        }
                    //    }
                    //    else
                    //    {
                    //        var chkexstlogin = db.Usp_ChekAlreadyloginUser(UserNames.ToString()).FirstOrDefault();
                    //        if (Convert.ToInt32(chkexstlogin.Value) > 0)
                    //        {
                    //            return "alreadyloggedin";
                    //        }
                    //    }
                    //}
                    //check for two authentication
                    var checktwofactor = db.usp_GetFirmUsers_api(UserNames, password, 1).FirstOrDefault();
                    if (checktwofactor != null)
                    {

                        twofactorvalue = checktwofactor.IsTwoFactorAuth.ToString();
                        twofactorfirmidvalue = checktwofactor.Firmid.ToString();
                        twofactoruseridvalue = checktwofactor.Id.ToString();
                    }
                    //if two auth true
                    if (twofactorvalue.ToString() == "1")
                    {
                        int otpValue = new Random().Next(100000, 999999);
                        var getmobiletwofactor = db.usp_GetRegUsers_api(twofactoruseridvalue, twofactorfirmidvalue).FirstOrDefault();
                        //Send otp
                        if (getmobiletwofactor.cmobile.ToString() != "")
                        {
                            var decmobile = getmobiletwofactor.cmobile.ToString();
                            var check = db.TblRegOtps.Where(x => x.Mobile == decmobile && x.isLogin == 1).FirstOrDefault();
                            if (check != null)
                            {
                                int scussess = db.usp_UpdateTblRegOtps_api(check.Id.ToString(), otpValue.ToString(), DateTime.Now.ToString(), 0, 1);
                                string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                                strURL = strURL.Replace("#cmobile", decmobile.ToString()).Replace("#otpvalue", otpValue.ToString());
                                String strResult;
                                WebResponse objResponse;
                                WebRequest objRequest = HttpWebRequest.Create(strURL);
                                objResponse = objRequest.GetResponse();
                                using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                                {
                                    strResult = sr.ReadToEnd();
                                    sr.Close();
                                }
                            }
                            else
                            {
                                int scussess = db.usp_AddTblRegOtps_api(decmobile, otpValue.ToString(), DateTime.Now.ToString(), 0, 1);
                                //  string strURL = "http://bulksms.mysmsmantra.com:8080/WebSMS/SMSAPI.jsp?username=MANUPATRA1&password=1305335516&sendername=MANUPR&mobileno=91" + getmobiletwofactor.cmobile.ToString() + "&message=Your MyKase Verification Code is " + otpValue + " Please enter the same to complete verification. Thank you ";
                                string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                                strURL = strURL.Replace("#cmobile", decmobile).Replace("#otpvalue", otpValue.ToString());
                                String strResult;
                                WebResponse objResponse;
                                WebRequest objRequest = HttpWebRequest.Create(strURL);
                                objResponse = objRequest.GetResponse();
                                using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                                {
                                    strResult = sr.ReadToEnd();
                                    sr.Close();

                                }
                            }
                        }
                        HttpContext.Current.Session["authsessionfirmid"] = Convert.ToBase64String(QueryAES.EncryptAes(twofactorfirmidvalue));
                        HttpContext.Current.Session["authsessionuserid"] = Convert.ToBase64String(QueryAES.EncryptAes(twofactoruseridvalue));
                        HttpContext.Current.Session["authsessionusername"] = Convert.ToBase64String(QueryAES.EncryptAes(UserNames.ToString()));
                        HttpContext.Current.Session["authsessionpassword"] = password.ToString();
                        HttpContext.Current.Session["authsessionmobile"] = getmobiletwofactor.cmobile;
                        HttpContext.Current.Session["authsessionotp"] = Convert.ToBase64String(QueryAES.EncryptAes(otpValue.ToString()));
                        HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                        db.saveuseractivity(twofactorfirmidvalue.ToString(), twofactoruseridvalue.ToString(), twofactoruseridvalue.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                        return ("Authenticate");
                    }
                    else
                    {
                        //var UserGUID = db.FirmUsers.Where(x => x.UserName == request.UserName).FirstOrDefault();

                        UserGUID = db.usp_GetUserIdByusername(UserNames).Select(x => x.ToString()).FirstOrDefault();
                        var firmids1 = db.FirmUsers.Where(x => x.UserName == UserNames && x.Password == password).FirstOrDefault();
                        if (firmids1 != null)
                        {

                            var firmcodes = db.Firms.Where(x => x.Id.ToString() == firmids1.Firmid.ToString()).FirstOrDefault();
                            Areas = firmcodes.FirmCode;
                            //Added for Account Expiry Pop-up
                            int DateDifference = (Convert.ToDateTime(firmcodes.ExpiryDate) - DateTime.Now.Date).Days;
                            if (DateDifference <= 15)
                            {
                                HttpContext.Current.Session["IsExpireSoonDays"] = Convert.ToDateTime(firmcodes.ExpiryDate).ToString("dd/MM/yyyy").Replace("-", "/"); ;
                            }
                        }
                        if (Areas == "home")
                        {


                            var user = Repository.FirmUser.Login(UserNames, password, key, Areas);

                            HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                            //var user = db.usp_LoginDetails(request.UserName, password, key, Area).FirstOrDefault();
                            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                            //user.Cases = Repository.Firm.GetSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), pname, Convert.ToString(user.UserId));
                            //user.Events = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Event), Convert.ToString(user.UserId));
                            //user.Tasks = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), Convert.ToString(user.UserId));

                            var param = controllername + ">Login>Firmuser>param=" + UserNames + "@" + password + "@" + key + "@" + Areas;



                            db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                            new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                            HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                            HttpContext.Current.Session["sessionuserid"] = user.UserId;
                            HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                            CreateSession(HttpContext.Current, user);

                            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
                            var ctd = db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                            try
                            {
                                db.usp_saveloginlog(user.FirmId.ToString(), UserNames.ToString());
                            }
                            catch (Exception er)
                            {
                            }
                            try
                            {
                                db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), UserNames.ToString(), GetSessionID);
                            }
                            catch (Exception er)
                            {
                            }
                            try
                            {
                                //save in userspy
                                db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                            }
                            catch (Exception er)
                            {
                            }
                            return (Areas + y);
                        }

                        //default url
                        if (!String.IsNullOrEmpty(Areas))
                        {
                            //check frimocde validate
                            var checkfirmcode = db.usp_GetFirmsbyCode_api(Areas).FirstOrDefault();
                            if (checkfirmcode == null)
                            {
                                Areas = "";
                            }
                        }


                        //wihtout two auth
                        if (Areas != "")
                        {
                            var user = Repository.FirmUser.Login(UserNames, password, key, Areas);

                            HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                            //user.Cases = Repository.Firm.GetSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), pname, Convert.ToString(user.UserId));
                            //user.Events = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Event), Convert.ToString(user.UserId));
                            //user.Tasks = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), Convert.ToString(user.UserId));

                            var param = controllername + ">Login>Firmuser>param=" + UserNames + "@" + password + "@" + key + "@" + Areas;
                            db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                            new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                            HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                            HttpContext.Current.Session["sessionuserid"] = user.UserId;
                            HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                            HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                            CreateSession(HttpContext.Current, user);
                            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
                            db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                            try
                            {
                                db.usp_saveloginlog(twofactorfirmidvalue.ToString(), UserNames.ToString());
                            }
                            catch (Exception er)
                            {

                            }
                            try
                            {
                                db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), UserNames.ToString(), GetSessionID);

                            }
                            catch (Exception er)
                            {

                            }
                            try
                            {
                                //save in userspy
                                db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                            }
                            catch (Exception er)
                            {

                            }
                            return (Areas + y);
                        }
                        else
                        {
                            var firmids = db.usp_GetFirmUsers_api(UserNames, password, null).FirstOrDefault();
                            if (firmids != null)
                            {
                                var firmcodes = db.usp_GetFirms_api(firmids.Firmid.ToString()).FirstOrDefault();
                                Areas = firmcodes.FirmCode;
                                //Added for Account Expiry Pop-up
                                int DateDifference = (Convert.ToDateTime(firmcodes.ExpiryDate) - DateTime.Now.Date).Days;
                                if (DateDifference <= 15)
                                {
                                    HttpContext.Current.Session["IsExpireSoonDays"] = Convert.ToDateTime(firmcodes.ExpiryDate).ToString("dd/MM/yyyy").Replace("-", "/"); ;
                                }
                            }
                            var user = Repository.FirmUser.Login(UserNames, password, key, Areas);
                            HttpContext.Current.Session["sessionpackmodule"] = user.Packmodule.ToString();
                            //var user = db.usp_LoginDetails(request.UserName, password, key, Area).FirstOrDefault();
                            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                            //user.Cases = Repository.Firm.GetSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), pname, Convert.ToString(user.UserId));
                            //user.Events = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Event), Convert.ToString(user.UserId));
                            //user.Tasks = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), Convert.ToString(user.UserId));
                            var param = controllername + ">Login>Firmuser>param=" + UserNames + "@" + password + "@" + key + "@" + Areas;
                            db.usp_AddAudit(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(user.UserId.ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                            new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                            HttpContext.Current.Session["sessionfirmid"] = user.FirmId;
                            HttpContext.Current.Session["sessionuserid"] = user.UserId;
                            HttpContext.Current.Session["sessionroleid"] = user.RoleId;
                            HttpContext.Current.Session["GetSessionID"] = GetSessionID;
                            CreateSession(HttpContext.Current, user);
                            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(HttpContext.Current));
                            var ctd = db.saveuseractivity(user.FirmId.ToString(), user.UserId.ToString(), user.UserId.ToString(), 1, DateTime.Now.ToString(), "Login", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                            try
                            {
                                db.usp_saveloginlog(user.FirmId.ToString(), UserNames.ToString());
                            }
                            catch (Exception er)
                            {
                            }
                            try
                            {
                                db.Usp_SaveUserActiveStatus(user.FirmId.ToString(), UserNames.ToString(), GetSessionID);
                            }
                            catch (Exception er)
                            {
                            }
                            try
                            {
                                //save in userspy
                                db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsSuccess, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                            }
                            catch (Exception er)
                            {
                            }
                            return (Areas + y);
                        }
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        //save in userspy
                        db.usp_esp_InsertUserSpyLog(UserGUID.ToString(), "", "", GetUsrMachineInfoDetailsRemoteAdder.stReferer, GetUsrMachineInfoDetailsRemoteAdder.stUserIp, GetUsrMachineInfoDetailsRemoteAdder.stForwardFor, GetUsrMachineInfoDetailsRemoteAdder.IsError, GetUsrMachineInfoDetailsRemoteAdder.stScriptName, GetUsrMachineInfoDetailsRemoteAdder.stServerPort, GetUsrMachineInfoDetailsRemoteAdder.stUserAgent.ToString());
                    }
                    catch (Exception er)
                    {
                    }
                    db.usp_AddAuditError(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                    throw ex;
                }
            }
            else
            {
                var y = "";
                db.usp_AddAuditError(Convert.ToInt32(EventType.Login), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Login), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=Invalid request request time is not valid", myIP(), GetMacAddress().ToString(), 1, "");
                return (Areas + y);
            }
        }

        /// <summary>
        /// Notice pack
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IsNoticePack()
        {
            dynamic rasult = "";
            try
            {
                var db = new LawPracticeEntities();
                var firmpackmodulelist = db.Usp_CheckNoticePackByFirmId(LoggedInUser.FirmId.ToString()).ToList();
                if (firmpackmodulelist.Count > 0)
                {
                    var Islitigationpack = firmpackmodulelist
                    .Where(x => x.FullModulename == "Matter Management" || x.FullModulename == "Dashboard Fixed")
                    .Select(x => x.FullModulename).ToList();
                    //For Individual IPR Login
                    var IsIPR1 = firmpackmodulelist
                    .Where(x => x.FullModulename == "IPR Management")
                    .Select(x => x.FullModulename).ToList();
                    if (Islitigationpack.Count > 0)
                    {
                        rasult = "All";
                    }
                    else
                    {
                        if (IsIPR1.Count > 0)
                        {
                            rasult = "IPR";
                        }
                        else
                        {
                            rasult = "MkLitigation";
                        }
                    }
                    //rasult = "All";
                }
                else
                {
                    rasult = "Notice";
                }
            }
            catch (Exception) { }
            return Ok(rasult);
        }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ForgotPassword([FromBody] JObject paramJObject) { return false; }

        [System.Web.Mvc.AllowAnonymous]
        [ValidateAntiForgeryToken()]
        [System.Web.Mvc.HttpPost]
        public bool ValidateEmail([FromBody] JObject paramJObject) { return false; }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public ApplicationUser UserProfile() { return null; }

        [System.Web.Mvc.HttpPost]
        public bool ChangePassword([FromBody] JObject paramJObject) { return false; }
    }


}