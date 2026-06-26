using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class RoleApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "RoleApiController";

        /// <summary>
        /// View user groups details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewUserGroupsData()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var groupfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["groupfilter"]);
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("UserGroup")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_ViewUserGroups_Result> list = new List<usp_ViewUserGroups_Result>();
                list = db.usp_ViewUserGroups(groupfilter, firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), pageid.ToString()).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get user by form id and role id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UsersbyFirmid_Roleid()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var roleid = 2;
                var groupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]); ;
                List<usp_GetUsersbyFirmid_Roleid_Result> list = new List<usp_GetUsersbyFirmid_Roleid_Result>();
                list = db.usp_GetUsersbyFirmid_Roleid(firmid, roleid, groupid, LoggedInUser.UserId.ToString()).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get User detail by group id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserDetailsbyiGroupId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var roleid = 2;
                var groupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                var flag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]);
                if (Convert.ToInt32(flag) == 1)
                {
                    groupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(groupid));
                }
                List<usp_GetUserDetailsbyiGroupId_Result> list = new List<usp_GetUserDetailsbyiGroupId_Result>();
                list = db.usp_GetUserDetailsbyiGroupId(groupid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Add new user detail by group
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddNewUserGroupData()
        {
            string message = "error";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                    var newgroupname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["newgroupname"]);
                    var igroupId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupId"]);
                    var isclone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["isClone"]);
                    if (isclone == "1") { igroupId = ""; }
                    string id = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iGroupId", id);
                    var groupnameExists = db.usp_CheckExistanceUserGroup(firmid, userid, newgroupname).FirstOrDefault();
                    string existgroupname = "";
                    if (igroupId == "" && (isclone == "0" || isclone == "1"))
                    {
                        existgroupname = Convert.ToString(groupnameExists);
                    }
                    if (!string.IsNullOrEmpty(igroupId))
                    {
                        if (existgroupname.Trim() != newgroupname.Trim())
                        {
                            var roweffected = db.UpdateRightsGroup(Guid.Parse(igroupId), newgroupname, Guid.Parse(firmid), Guid.Parse(userid));
                            var deleteroweffected = db.DeleteRightsGroupMembers(Guid.Parse(igroupId), Guid.Parse(firmid), Guid.Parse(userid));
                            id = Convert.ToString(IDParameter.Value);
                            if (userloginids != "")
                            {
                                string s = userloginids.TrimEnd(',');
                                string[] values = s.Split(',');
                                for (int i = 0; i < values.Length; i++)
                                {
                                    values[i] = values[i].Trim();
                                    var chkout = db.AddRightsGroupMembers(igroupId, values[i], firmid, userid);
                                    //save notification
                                    try
                                    {
                                        var dataac = Notification.SaveNotifications("CreateTeam", newgroupname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), values[i].ToString(), LoggedInUser.UserName);
                                        var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(values[i], LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                        if (getcaseuser != null)
                                        {
                                            if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                            {
                                                var dataacq = Notification.SaveNotifications("CreateTeam", newgroupname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                                            }
                                        }
                                    }
                                    catch
                                    {
                                    }
                                }
                                message = "Success";
                                transaction.Commit();
                            }
                        }
                        else
                        {
                            message = "error";
                        }
                    }
                    else
                    {
                        if (existgroupname == "")
                        {
                            var roweffected = db.AddRightsGroup(IDParameter, newgroupname, firmid, userid);
                            id = Convert.ToString(IDParameter.Value);
                            if (!string.IsNullOrEmpty(id))
                            {
                                if (userloginids != "")
                                {
                                    string s = userloginids.TrimEnd(',');
                                    string[] values = s.Split(',');
                                    for (int i = 0; i < values.Length; i++)
                                    {
                                        values[i] = values[i].Trim();
                                        var chkout = db.AddRightsGroupMembers(id.ToString(), values[i], firmid, userid);
                                    }
                                    message = "Success";
                                    transaction.Commit();
                                }
                            }
                        }
                        else
                        {
                            message = "Exist";
                        }
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// User group by group id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserGroupbyiGroupId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var igroupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                //var a = JsonConvert.SerializeObject(data);
                List<usp_GetUserGroupbyiGroupId_Result> list = new List<usp_GetUserGroupbyiGroupId_Result>();
                list = db.usp_GetUserGroupbyiGroupId(igroupid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Call User Group by GroupId
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CallUserGroupbyiGroupId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var igroupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                try
                {
                    igroupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(igroupid));
                }
                catch
                {
                }
                List<usp_GetUserGroupbyiGroupId_Result> list = new List<usp_GetUserGroupbyiGroupId_Result>();
                list = db.usp_GetUserGroupbyiGroupId(igroupid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Call User profile by Login Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CallUserprofilebyLoginId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var assignuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignuser"]);
                try
                {
                    assignuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignuser));
                }
                catch
                {
                }
                List<usp_wf_GetUserDetails_Result> list = new List<usp_wf_GetUserDetails_Result>();
                list = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse((assignuser))).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Remove User Group by GroupId
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveUserGroupbyiGroupId()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var igroupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                    var flag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]);
                    try
                    {
                        igroupid = igroupid.Replace(" ", "+");
                        igroupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(igroupid));
                    }
                    catch (Exception er)
                    {
                    }
                    int deletegrouproweffected = 0;
                    if (Convert.ToInt32(flag) == 0)
                    {
                        deletegrouproweffected = db.DeleteRightsGroup(Guid.Parse(igroupid), Guid.Parse(firmid), Guid.Parse(userid));
                        if (deletegrouproweffected > 0)
                        {
                            var deletememberroweffected = db.DeleteRightsGroupMembers(Guid.Parse(igroupid), Guid.Parse(firmid), Guid.Parse(userid));
                            if (deletememberroweffected > 0)
                            {
                                transaction.Commit();
                                return Ok("Success");
                            }
                            else
                            {
                                transaction.Commit();
                                return Ok("Success");
                            }
                        }
                        else
                        {
                            transaction.Rollback();
                            return Ok("error");
                        }
                    }
                    else
                    {
                        var deletememberroweffected = db.DeleteRightsGroupMembers(Guid.Parse(igroupid), Guid.Parse(firmid), Guid.Parse(userid));
                        if (deletememberroweffected > 0)
                        {
                            transaction.Commit();
                            return Ok("Success");
                        }
                        else
                        {
                            transaction.Rollback();
                            return Ok("error");
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Get page access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadPageAccesslevel()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                int levelid = 0;
                try
                {
                    levelid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["levelid"]));
                }
                catch { levelid = 0; }
                List<usp_GetPageAccesslevel_Result> list = new List<usp_GetPageAccesslevel_Result>();
                list = db.usp_GetPageAccesslevel(levelid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load sub module page details
        /// </summary>
        /// <param name="parentpage"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadSubModulePage(string parentpage)
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetSubModuleByParentPage_Result> list = new List<usp_GetSubModuleByParentPage_Result>();
                list = db.usp_GetSubModuleByParentPage(parentpage).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Add role access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddRoleAccessLevelData()
        {
            string message = "error";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var addrawdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["addrawdata"]);
                    var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                    var igroupId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                    var hdngroupaccessval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hdngroupaccessval"]);
                    var rightlevel = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["rightlevel"]));
                    var assignuser = Convert.ToString(Guid.Empty);
                    int write = 0, view = 0, edit = 0, delete = 0, export = 0, share = 0, enabledisable = 0, viewall = 0, editall = 0, pageid = 0;
                    int contactcredential = 0, documentconfidential = 0;
                    if (hdngroupaccessval == "1")
                    {
                        userloginids = "";
                    }
                    if (hdngroupaccessval == "2")
                    {
                        igroupId = Guid.Empty.ToString();
                    }
                    if (string.IsNullOrEmpty(Convert.ToString(igroupId)))
                    {
                        igroupId = Guid.Empty.ToString();
                    }
                    string id = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    if (hdngroupaccessval == "1")
                    {
                        var existgrouplist = db.usp_CheckRoleAssignedUser(igroupId, "", firmid, userid).ToList();
                        int isexist = existgrouplist[0].Value;
                        if (isexist > 0)
                        {
                            transaction.Rollback();
                            transaction.Dispose();
                            return Ok("exists");
                        }
                        List<usp_GetUserGroupbyiGroupId_Result> list = new List<usp_GetUserGroupbyiGroupId_Result>();
                        list = db.usp_GetUserGroupbyiGroupId(igroupId).ToList();
                        if (list.Count > 0)
                        {
                            for (int i = 0; i < list.Count; i++)
                            {
                                assignuser = Convert.ToString(list[i].AssignUser);
                                if (addrawdata != "")
                                {
                                    string strrow = addrawdata.TrimEnd('~');
                                    string[] strrowArr = strrow.Split('~');
                                    for (int r = 0; r < strrowArr.Length; r++)
                                    {
                                        string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                        if (splitunderline[1].TrimEnd(',').ToString() != "0,0,0,0,0,0,0,0,0,0,0,".TrimEnd(','))
                                        {
                                            if (splitunderline.Length > 0)
                                            {
                                                pageid = Convert.ToInt32(splitunderline[0]);
                                                string[] splitcomma = splitunderline[1].TrimEnd(',').ToString().Split(',');
                                                for (int s = 0; s < splitcomma.Length; s++)
                                                {
                                                    if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 6) { enabledisable = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 9) { contactcredential = Convert.ToInt32(splitcomma[s]); }
                                                    if (s == 10) { documentconfidential = Convert.ToInt32(splitcomma[s]); }
                                                }
                                                var roweffected = db.usp_AddRoleAssignedUsers(IDParameter, firmid, userid, assignuser, igroupId, pageid, write, view, edit, delete, export, share, enabledisable, viewall, editall, contactcredential, documentconfidential, rightlevel);
                                                id = Convert.ToString(IDParameter.Value);
                                            }
                                        }
                                    }
                                }
                            }
                            try
                            {
                                var data = db.usp_GetUserDetailByUserID(firmid, assignuser).FirstOrDefault();
                                string notification = "You have Assigned the Rights to User (" + data.Name + ")";
                                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Assign Rights", null, null);
                            }
                            catch
                            {
                            }
                            if (id != "")
                            {
                                transaction.Commit();
                                transaction.Dispose();
                                message = "Success";
                            }
                            else
                            {
                                transaction.Rollback();
                                transaction.Dispose();
                                message = "error";
                            }
                        }
                    }
                    if (hdngroupaccessval == "2")
                    {
                        string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                        for (int i = 0; i < struserloginids.Length; i++)
                        {
                            assignuser = Convert.ToString(struserloginids[i]);
                            if (addrawdata != "")
                            {
                                string strrow = addrawdata.TrimEnd('~');
                                string[] strrowArr = strrow.Split('~');
                                for (int r = 0; r < strrowArr.Length; r++)
                                {
                                    string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                    if (splitunderline[1].TrimEnd(',').ToString() != "0,0,0,0,0,0,0,0,0,0,0,".TrimEnd(','))
                                    {
                                        if (splitunderline.Length > 0)
                                        {
                                            pageid = Convert.ToInt32(splitunderline[0]);
                                            string[] splitcomma = splitunderline[1].Trim(',').ToString().Split(',');
                                            for (int s = 0; s < splitcomma.Length; s++)
                                            {
                                                if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 6) { enabledisable = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 9) { contactcredential = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 10) { documentconfidential = Convert.ToInt32(splitcomma[s]); }
                                            }
                                            var deletegrouproweffected = db.usp_DeleteRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, rightlevel);
                                            var roweffected = db.usp_AddRoleAssignedUsers(IDParameter, firmid, userid, assignuser, igroupId, pageid, write, view, edit, delete, export, share, enabledisable, viewall, editall, contactcredential, documentconfidential, rightlevel);
                                            id = Convert.ToString(IDParameter.Value);
                                        }
                                    }
                                }
                            }
                        }
                        try
                        {
                            var data = db.usp_GetUserDetailByUserID(firmid, assignuser).FirstOrDefault();
                            string notification = "You have Assigned the Rights to User (" + data.Name + ")";
                            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Assign Rights", null, null);
                        }
                        catch
                        {
                        }
                        if (id != "")
                        {
                            transaction.Commit();
                            transaction.Dispose();
                            message = "Success";
                        }
                        else
                        {
                            transaction.Rollback();
                            transaction.Dispose();
                            message = "error";
                        }
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// Get group users details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadUserGroups()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetUserGroups_Result> list = new List<usp_GetUserGroups_Result>();
                list = db.usp_GetUserGroups(firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// View role access groups details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewRoleAccessGroups()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var groupfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["groupfilter"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchuser"]);
                if (searchuser == "null" || searchuser == "" || searchuser == null || searchuser == "undefined")
                { searchuser = ""; }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("RoleAccess")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_ViewRoleAccessGroups_Result> list = new List<usp_ViewRoleAccessGroups_Result>();
                list = db.usp_ViewRoleAccessGroups("1", firmid, userid, "", Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), pageid.ToString()).ToList();
                foreach (var datas in list.ToList())
                {
                    string groupId = Convert.ToBase64String(QueryAES.EncryptAes(datas.iGroupId.ToString()));
                    list[list.IndexOf(datas)].iGroupId = groupId;
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// View role access user details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewRoleAccessUsers()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchuser"]);
                if (searchuser == "null" || searchuser == "" || searchuser == null || searchuser == "undefined")
                { searchuser = ""; }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("RoleAccess")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_ViewRoleAccessUsers_Result> list = new List<usp_ViewRoleAccessUsers_Result>();
                list = db.usp_ViewRoleAccessUsers("", firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), pageid.ToString(), searchuser).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Remove role access by group id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveRoleAccessbyGroupId()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var igroupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                    try
                    {
                        igroupid = igroupid.Replace(" ", "+");
                        igroupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(igroupid));
                    }
                    catch (Exception er)
                    {
                    }
                    var deletegrouproweffected = db.usp_DeleteRoleAccessbyGroupId(igroupid, firmid, userid, 1);
                    if (deletegrouproweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Remove role access by assign user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveRoleAccessbyAssignUser()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var loginid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]);
                    try
                    {
                        loginid = loginid.Replace(" ", "+");
                        loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                    }
                    catch (Exception er)
                    {
                    }
                    try
                    {
                        var data = db.usp_GetUserDetailByUserID(firmid, loginid).FirstOrDefault();
                        string notification = "You have Deleted the Rights of User (" + data.Name + ")";
                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Delete Assign Rights ", null, null);
                    }
                    catch
                    {
                    }
                    var deletegrouproweffected = db.usp_DeleteRoleAccessbyAssignUser(loginid, firmid, userid, 0, null);
                    if (deletegrouproweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Get Role Access By GroupId
        /// </summary>
        /// <param name="groupid"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RoleAccessByGroupId(string groupid)
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                groupid = groupid.Replace(" ", "+");
                try
                {
                    groupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(groupid));
                }
                catch
                {
                }
                List<usp_GetRoleAccessByGroupId_Result> list = new List<usp_GetRoleAccessByGroupId_Result>();
                list = db.usp_GetRoleAccessByGroupId(groupid, firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Role Access By Assign User
        /// </summary>
        /// <param name="assignuser"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RoleAccessByAssignUser(string assignuser)
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                try
                {
                    assignuser = assignuser.Replace(" ", "+");
                    assignuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignuser));
                }
                catch
                {
                }
                List<usp_GetRoleAccessByAssignUser_Result> list = new List<usp_GetRoleAccessByAssignUser_Result>();
                list = db.usp_GetRoleAccessByAssignUser(assignuser, firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Update role access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateRoleAccessLevelData()
        {
            string message = "error";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var addrawdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["addrawdata"]);
                    var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                    var igroupId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                    var hdngroupaccessval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hdngroupaccessval"]);
                    var rightlevel = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["rightlevel"]));
                    var assignuser = Convert.ToString(Guid.Empty);
                    try
                    {
                        igroupId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(igroupId));
                    }
                    catch
                    {
                    }
                    int write = 0, view = 0, edit = 0, delete = 0, export = 0, share = 0, enabledisable = 0, viewall = 0, editall = 0, pageid = 0;
                    int contactcredential = 0, documentconfidential = 0;
                    if (hdngroupaccessval == "1")
                    {
                        userloginids = "";
                    }
                    if (hdngroupaccessval == "2")
                    {
                        igroupId = Guid.Empty.ToString();
                    }
                    if (string.IsNullOrEmpty(Convert.ToString(igroupId)))
                    {
                        igroupId = Guid.Empty.ToString();
                    }
                    string id = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    if (hdngroupaccessval == "1")
                    {
                        var deletegrouproweffected = db.usp_DeleteRoleAccessbyGroupId(igroupId, firmid, userid, 0);
                        List<usp_GetUserGroupbyiGroupId_Result> list = new List<usp_GetUserGroupbyiGroupId_Result>();
                        list = db.usp_GetUserGroupbyiGroupId(igroupId).ToList();
                        if (list.Count > 0)
                        {
                            for (int i = 0; i < list.Count; i++)
                            {
                                assignuser = Convert.ToString(list[i].AssignUser);
                                if (addrawdata != "")
                                {
                                    string strrow = addrawdata.TrimEnd('~');
                                    string[] strrowArr = strrow.Split('~');
                                    for (int r = 0; r < strrowArr.Length; r++)
                                    {
                                        string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                        if (splitunderline.Length > 0)
                                        {
                                            pageid = Convert.ToInt32(splitunderline[0]);
                                            string[] splitcomma = splitunderline[1].TrimEnd(',').ToString().Split(',');
                                            for (int s = 0; s < splitcomma.Length; s++)
                                            {
                                                if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 6) { enabledisable = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 9) { contactcredential = Convert.ToInt32(splitcomma[s]); }
                                                if (s == 10) { documentconfidential = Convert.ToInt32(splitcomma[s]); }
                                            }
                                            var roweffected = db.usp_AddRoleAssignedUsers(IDParameter, firmid, userid, assignuser, igroupId, pageid, write, view, edit, delete, export, share, enabledisable, viewall, editall, contactcredential, documentconfidential, rightlevel);
                                            id = Convert.ToString(IDParameter.Value);
                                        }
                                    }
                                    try
                                    {
                                        var data = db.usp_GetUserDetailByUserID(firmid, assignuser).FirstOrDefault();
                                        string notification = "You have Edited the Rights of User (" + data.Name + ")";
                                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Edit Rights", null, null);
                                    }
                                    catch
                                    {
                                    }
                                }
                                //save notification
                                try
                                {
                                    var dataac = Notification.SaveNotifications("RightsEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), assignuser.ToString(), LoggedInUser.UserName);
                                    var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(assignuser, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                    if (getcaseuser != null)
                                    {
                                        if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                        {
                                            var dataacq = Notification.SaveNotifications("RightsEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                                        }
                                    }
                                }
                                catch
                                {
                                }
                            }
                            if (id != "")
                            {
                                transaction.Commit();
                                transaction.Dispose();
                                message = "Success";
                            }
                            else
                            {
                                transaction.Rollback();
                                transaction.Dispose();
                                message = "error";
                            }
                        }
                    }
                    if (hdngroupaccessval == "2")
                    {
                        string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                        for (int i = 0; i < struserloginids.Length; i++)
                        {
                            assignuser = Convert.ToString(struserloginids[i]);
                            try
                            {
                                assignuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignuser));
                            }
                            catch
                            {
                            }
                            if (addrawdata != "")
                            {
                                string strrow = addrawdata.TrimEnd('~');
                                string[] strrowArr = strrow.Split('~');
                                for (int r = 0; r < strrowArr.Length; r++)
                                {
                                    string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                    if (splitunderline.Length > 0)
                                    {
                                        pageid = Convert.ToInt32(splitunderline[0]);
                                        string[] splitcomma = splitunderline[1].Trim(',').ToString().Split(',');
                                        for (int s = 0; s < splitcomma.Length; s++)
                                        {
                                            if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 6) { enabledisable = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 9) { contactcredential = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 10) { documentconfidential = Convert.ToInt32(splitcomma[s]); }
                                        }
                                        var deletegrouproweffected = db.usp_DeleteRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, rightlevel);
                                        var roweffected = db.usp_AddRoleAssignedUsers(IDParameter, firmid, userid, assignuser, igroupId, pageid, write, view, edit, delete, export, share, enabledisable, viewall, editall, contactcredential, documentconfidential, rightlevel);
                                        id = Convert.ToString(IDParameter.Value);
                                    }
                                }
                            }
                            try
                            {
                                var data = db.usp_GetUserDetailByUserID(firmid, assignuser).FirstOrDefault();
                                string notification = "You have Edited the Rights of User (" + data.Name + ")";
                                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Edit Rights", null, null);
                            }
                            catch
                            {
                            }
                            //save notification
                            try
                            {
                                var dataac = Notification.SaveNotifications("RightsEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), assignuser.ToString(), LoggedInUser.UserName);
                                var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(assignuser, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                if (getcaseuser != null)
                                {
                                    if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                    {
                                        var dataacq = Notification.SaveNotifications("RightsEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                                    }
                                }
                            }
                            catch
                            {
                            }
                        }
                        if (id != "")
                        {
                            transaction.Commit();
                            transaction.Dispose();
                            message = "Success";
                        }
                        else
                        {
                            transaction.Rollback();
                            transaction.Dispose();
                            message = "error";
                        }
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// Remove user from group
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveUserFromGroup()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var igroupid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["igroupid"]);
                    var assignuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignuser"]);
                    var flag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]);
                    if (Convert.ToInt32(flag) > 0)
                    {
                        igroupid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(igroupid));
                    }
                    var deletegrouproweffected = db.usp_RemoveUserFromGroup(igroupid, assignuser);
                    if (deletegrouproweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Get case mapped user details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseMappedUser()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetCaseMappedUser_Result> list = new List<usp_GetCaseMappedUser_Result>();
                list = db.usp_GetCaseMappedUser(firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get case page access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadCasePageAccesslevel()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var auser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["auser"]);
                var op = QueryAES.UrlDecode(HttpContext.Current.Request.Form["op"]);
                var editcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["editcaseid"]);
                int pageid = 0;
                try
                {
                    pageid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageid"]));
                }
                catch
                {
                    pageid = 0;
                }
                try
                {
                    auser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(auser));
                }
                catch { }
                List<usp_GetCasePageAccesslevel_Result> list = new List<usp_GetCasePageAccesslevel_Result>();
                list = db.usp_GetCasePageAccesslevel(firmid, userid, auser, editcaseid, pageid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get case page access level profile details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadCasePageAccesslevelForProfile()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var auser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["auser"]);
                var op = QueryAES.UrlDecode(HttpContext.Current.Request.Form["op"]);
                var editcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["editcaseid"]);
                int pageid = 0;
                try
                {
                    pageid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageid"]));
                }
                catch
                {
                    pageid = 0;
                }
                try
                {
                    auser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(auser));
                }
                catch { }
                List<usp_GetCasePageAccesslevelForProfile_Result> list = new List<usp_GetCasePageAccesslevelForProfile_Result>();
                list = db.usp_GetCasePageAccesslevelForProfile(firmid, userid, auser, editcaseid, pageid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get user group details by team id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadUserGroup_TeambyId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                List<usp_GetUserGroup_TeambyId_Result> list = new List<usp_GetUserGroup_TeambyId_Result>();
                list = db.usp_GetUserGroup_TeambyId(firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Add case role access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddCaseRoleAccessLevelData()
        {
            string message = "error";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var addrawdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["addrawdata"]);
                    var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                    var selectedcases = QueryAES.UrlDecode(HttpContext.Current.Request.Form["selectedcases"]);
                    var CaseOption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseOption"]);
                    selectedcases = selectedcases.TrimEnd(',');
                    var assignuser = Convert.ToString(Guid.Empty);
                    int write = 0, view = 0, edit = 0, delete = 0, export = 0, share = 0, enable = 0, viewall = 0, editall = 0, pageid = 0;
                    string id = "", caseid = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                    for (int i = 0; i < struserloginids.Length; i++)
                    {
                        assignuser = Convert.ToString(struserloginids[i]);
                        if (addrawdata != "")
                        {
                            string strrow = addrawdata.TrimEnd('~');
                            string[] strrowArr = strrow.Split('~');
                            for (int r = 0; r < strrowArr.Length; r++)
                            {
                                string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                if (splitunderline[1].TrimEnd(',').ToString() != "0,0,0,0,0,0,0,0,0,".TrimEnd(','))
                                {
                                    if (splitunderline.Length > 0)
                                    {
                                        pageid = Convert.ToInt32(splitunderline[0]);
                                        string[] splitcomma = splitunderline[1].Trim(',').ToString().Split(',');
                                        for (int s = 0; s < splitcomma.Length; s++)
                                        {
                                            if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 6) { enable = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                            if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                        }
                                        //split selected cases
                                        string[] arrCases = selectedcases.Split(',');
                                        if (CaseOption == "1")
                                        {
                                            selectedcases = "";
                                            userloginids = userloginids.TrimEnd(',');
                                            List<usp_GetCasesByAuser_Result> list = new List<usp_GetCasesByAuser_Result>();
                                            list = db.usp_GetCasesByAuser(firmid, userloginids, "").ToList();
                                            foreach (var datas in list.ToList())
                                            {
                                                caseid = Convert.ToString(datas.caseid);
                                                if (!string.IsNullOrEmpty(caseid))
                                                {
                                                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                    var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                    id = Convert.ToString(IDParameter.Value);
                                                }
                                            }
                                        }
                                        else if (CaseOption == "3")
                                        {
                                            caseid = Guid.Empty.ToString();
                                            if (!string.IsNullOrEmpty(caseid))
                                            {
                                                var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                id = Convert.ToString(IDParameter.Value);
                                            }
                                        }
                                        else
                                        {
                                            for (int c = 0; c < arrCases.Length; c++)
                                            {
                                                caseid = Convert.ToString(arrCases[c]);
                                                if (!string.IsNullOrEmpty(caseid))
                                                {
                                                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                    var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                    id = Convert.ToString(IDParameter.Value);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //save notification
                        try
                        {
                            var dataac = Notification.SaveNotifications("NewCaseRights", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), assignuser.ToString(), LoggedInUser.UserName);
                            var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(assignuser, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                            if (getcaseuser != null)
                            {
                                if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                {
                                    var dataacq = Notification.SaveNotifications("NewCaseRights", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                    if (id != "")
                    {
                        transaction.Commit();
                        transaction.Dispose();
                        message = "Success";
                    }
                    else
                    {
                        transaction.Rollback();
                        transaction.Dispose();
                        message = "error";
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// View case role access users
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewCaseRoleAccessUsers()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchuser"]);
                var searchcase = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcase"]);
                if (searchuser == "null" || searchuser == "" || searchuser == null || searchuser == "undefined")
                { searchuser = ""; }
                if (searchcase == "null" || searchcase == "" || searchcase == null || searchcase == "undefined")
                { searchcase = ""; }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("CaseRoleAccess")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_ViewCaseRoleAccessUsers_Result> list = new List<usp_ViewCaseRoleAccessUsers_Result>();
                list = db.usp_ViewCaseRoleAccessUsers("", firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), pageid.ToString(), searchuser, searchcase).ToList();
                foreach (var datas in list.ToList())
                {
                    string rightslebel = datas.rightslebel;
                    list[list.IndexOf(datas)].rightslebel = rightslebel.TrimStart(',').TrimEnd(',');
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Remove case role access by assign user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveCaseRoleAccessbyAssignUser()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var loginid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]);
                    var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                    int pageid = 0;
                    try
                    {
                        pageid = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageid"]));
                    }
                    catch
                    {
                        pageid = 0;
                    }
                    try
                    {
                        loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                    }
                    catch
                    {
                    }
                    string notification = "You have Deleted Matter Rights of User - ";
                    db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Delete Matter Rights", loginid, null);
                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(loginid, firmid, userid, pageid, caseid);
                    if (deletegrouproweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }

        /// <summary>
        /// Get cases by user details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CasesByAuser()
        {
            try
            {
                string editcaseid = "";
                var flag = 0;
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var loginid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]);
                flag = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]));
                editcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["editcaseid"]);
                if (flag == 1)
                {
                    try
                    {
                        loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                    }
                    catch
                    {
                    }
                }
                List<usp_GetCasesByAuser_Result> list = new List<usp_GetCasesByAuser_Result>();
                list = db.usp_GetCasesByAuser(firmid, loginid, editcaseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Update case role access level details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateCaseRoleAccessLevelData()
        {
            string message = "error";
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var addrawdata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["addrawdata"]);
                    var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                    var selectedcases = QueryAES.UrlDecode(HttpContext.Current.Request.Form["selectedcases"]);
                    var CaseOption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CaseOption"]);
                    var Editcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ecaseid"]);
                    try
                    {
                        userloginids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userloginids));
                    }
                    catch { }
                    selectedcases = selectedcases.TrimEnd(',');
                    var assignuser = Convert.ToString(Guid.Empty);
                    int write = 0, view = 0, edit = 0, delete = 0, export = 0, share = 0, enable = 0, viewall = 0, editall = 0, pageid = 0;
                    string id = "", caseid = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                    for (int i = 0; i < struserloginids.Length; i++)
                    {
                        assignuser = Convert.ToString(struserloginids[i]);
                        if (addrawdata != "")
                        {
                            string strrow = addrawdata.TrimEnd('~');
                            string[] strrowArr = strrow.Split('~');
                            for (int r = 0; r < strrowArr.Length; r++)
                            {
                                string[] splitunderline = strrowArr[r].Trim().ToString().Split('_');
                                if (splitunderline.Length > 0)
                                {
                                    pageid = Convert.ToInt32(splitunderline[0]);
                                    string[] splitcomma = splitunderline[1].Trim(',').ToString().Split(',');
                                    for (int s = 0; s < splitcomma.Length; s++)
                                    {
                                        if (s == 0) { write = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 1) { view = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 2) { edit = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 3) { delete = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 4) { export = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 5) { share = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 6) { enable = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 7) { viewall = Convert.ToInt32(splitcomma[s]); }
                                        if (s == 8) { editall = Convert.ToInt32(splitcomma[s]); }
                                    }
                                    if (Editcaseid != "")
                                    {
                                        try
                                        {
                                            caseid = Editcaseid;
                                            var roweffected = db.usp_UpdateCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                            id = Convert.ToString(IDParameter.Value);
                                        }
                                        catch { }
                                    }
                                    else
                                    {
                                        string[] arrCases = selectedcases.Split(',');
                                        if (CaseOption == "1")
                                        {
                                            selectedcases = "";
                                            userloginids = userloginids.TrimEnd(',');
                                            List<usp_GetCasesByAuser_Result> list = new List<usp_GetCasesByAuser_Result>();
                                            list = db.usp_GetCasesByAuser(firmid, userloginids, "").ToList();
                                            foreach (var datas in list.ToList())
                                            {
                                                caseid = Convert.ToString(datas.caseid);
                                                if (!string.IsNullOrEmpty(caseid))
                                                {
                                                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                    var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                    id = Convert.ToString(IDParameter.Value);
                                                }
                                            }
                                        }
                                        else if (CaseOption == "2")
                                        {
                                            for (int c = 0; c < arrCases.Length; c++)
                                            {
                                                caseid = Convert.ToString(arrCases[c]);
                                                if (!string.IsNullOrEmpty(caseid))
                                                {
                                                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                    var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                    id = Convert.ToString(IDParameter.Value);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            for (int c = 0; c < arrCases.Length; c++)
                                            {
                                                caseid = Convert.ToString("00000000-0000-0000-0000-000000000000");
                                                if (!string.IsNullOrEmpty(caseid))
                                                {
                                                    var deletegrouproweffected = db.usp_DeleteCaseRoleAccessbyAssignUser(assignuser, firmid, userid, pageid, caseid);
                                                    var roweffected = db.usp_AddCaseRoleAssignedUsers(IDParameter, firmid, userid, assignuser, pageid, write, view, edit, delete, export, share, enable, viewall, editall, caseid, Convert.ToInt32(CaseOption));
                                                    id = Convert.ToString(IDParameter.Value);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //save notification
                        try
                        {
                            var dataac = Notification.SaveNotifications("Caserightsedit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), assignuser.ToString(), LoggedInUser.UserName);
                            var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(assignuser, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                            if (getcaseuser != null)
                            {
                                if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                                {
                                    var dataacq = Notification.SaveNotifications("Caserightsedit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                    if (id != "")
                    {
                        transaction.Commit();
                        transaction.Dispose();
                        message = "Success";
                    }
                    else
                    {
                        transaction.Rollback();
                        transaction.Dispose();
                        message = "error";
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    message = "error";
                }
            }
            return Ok(message);
        }

        /// <summary>
        /// View user rights details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewUserRights()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                List<usp_GetRoleAccessByAssignUser_Result> list = new List<usp_GetRoleAccessByAssignUser_Result>();
                list = db.usp_GetRoleAccessByAssignUser(userid, firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get matter report details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadMatterReport()
        {
            var db = new LawPracticeEntities();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var mattertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertype"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casetype"]);
                var subjecttype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttype"]);
                var datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                var dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                var IsAdded = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsAdded"]));
                int pageid = 0;
                int roleid = Convert.ToInt32(LoggedInUser.RoleId);
                if (searchuser == "null" || searchuser == null || searchuser == "undefined")
                { searchuser = Guid.Empty.ToString(); }
                if (odate == "null" || odate == null || odate == "undefined")
                { odate = ""; }
                if (casename == "null" || casename == null || casename == "undefined")
                { casename = ""; }
                if (clientname == "null" || clientname == null || clientname == "undefined")
                { clientname = ""; }
                if (court == "null" || court == null || court == "undefined")
                { court = ""; }
                if (cstatus == "null" || cstatus == null || cstatus == "undefined")
                { cstatus = ""; }
                if (mattertype == "null" || mattertype == null || mattertype == "undefined")
                { mattertype = ""; }
                if (casetype == "null" || casetype == null || casetype == "undefined")
                { casetype = ""; }
                if (subjecttype == "null" || subjecttype == null || subjecttype == "undefined")
                { subjecttype = ""; }
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                string a = "";
                if (IsAdded == "1")
                {
                    List<usp_GetUserNewCaseDetailAddedForReport_Result> list = new List<usp_GetUserNewCaseDetailAddedForReport_Result>();
                    list = db.usp_GetUserNewCaseDetailAddedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    a = JsonConvert.SerializeObject(list);
                }
                if (IsAdded == "0")  //ie: assigned matters
                {
                    List<usp_GetUserNewCaseDetailAssignedForReport_Result> list = new List<usp_GetUserNewCaseDetailAssignedForReport_Result>();
                    list = db.usp_GetUserNewCaseDetailAssignedForReport(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, odate, casename, clientname,
                        court, cstatus, pageid, roleid, mattertype, casetype, subjecttype, datefrom, dateto, Guid.Parse(searchuser)).ToList();
                    a = JsonConvert.SerializeObject(list);
                }
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get expense reports
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ExpenseCreatedReport()
        {
            int pagenumber = 1, pagesize = 10;
            try
            {
                string expensetye = "", category = "", createdby = "";
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string clientid = "", caseid = "", datefrom = "", dateto = "", loginid = "";
                clientid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenceClient"]));
                caseid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddlExpenceCase"]));
                datefrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefrom"]));
                dateto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateto"]));
                pagenumber = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                loginid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]));
                expensetye = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["expensetype"]));
                category = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["category"]));
                createdby = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdfor"]));
                string txtRetainername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtRetainername"]);
                string txtdescriptionfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdescriptionfilter"]);
                string currencyfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["currencyfilter"]);
                if (caseid == "null" || caseid == null)
                    caseid = "";
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ExpenseReport")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                if (String.IsNullOrEmpty(loginid) || loginid == "null")
                {
                    loginid = Guid.Empty.ToString();
                }
                List<usp_GetExpenseReport_Result> list = new List<usp_GetExpenseReport_Result>();
                list = db.usp_GetExpenseReport(clientid, expensetye, category, caseid, datefrom, dateto, firmid, userid,
                    createdby, pagenumber, pagesize, loginid, pageid.ToString(), txtRetainername, txtdescriptionfilter, currencyfilter).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Case list by assign users
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseListByAssignUser()
        {
            try
            {
                string editcaseid = "";
                var flag = 0;
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var loginid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]);
                flag = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]));
                editcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["editcaseid"]);
                if (flag == 1)
                {
                    try
                    {
                        loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                    }
                    catch
                    {
                    }
                }
                List<usp_GetCasesListByAssignUser2_Result> list = new List<usp_GetCasesListByAssignUser2_Result>();
                list = db.usp_GetCasesListByAssignUser2(firmid, loginid, editcaseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}