using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class ChatApiController : BaseFirmApiController
    {
        /// <summary>
        /// Insert Channel chat details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertChatChannel()
        {
            try
            {
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                var straff = db.InsertChatChannel(firmid, ChannelName, UserId);
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get Chat Channel list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChatChannellist()
        {
            try
            {
                List<GetChatChannellist_Result> list = new List<GetChatChannellist_Result>();
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.GetChatChannellist(firmid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Insert Invite Chat
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertInviteChat()
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var ChannelGuid = guid.ToString();
                var UserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserId"]);
                var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var SenderUserId = LoggedInUser.UserId.ToString();
                var chattype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chattype"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var straff = db.InsertChatChannelInvite(firmid, ChannelGuid, UserId, activedate, SenderUserId, Convert.ToInt32(chattype));
                var straff1 = db.InsertChatChannelInvite(firmid, ChannelGuid, SenderUserId, activedate, SenderUserId, Convert.ToInt32(chattype));
                //send email to user
                try
                {
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                    CommomUtility objmail = new CommomUtility();
                    //get user email
                    var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(UserId)).FirstOrDefault();
                    if (useremail != null)
                    {
                        string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                        var strbody = "";
                        strbody += "Dear User,<br><br>";
                        var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(SenderUserId)).FirstOrDefault();
                        if (senderuser != null)
                        {
                            string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                            strbody += "You have a new chat from " + senderuser.cfname;
                            strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                        }
                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                        objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                    }
                }
                catch
                {
                }
                ChannelGuid = Convert.ToBase64String(QueryAES.EncryptAes(ChannelGuid));
                return Ok(ChannelGuid);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Insert Invite Chat Team User
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertInviteChatTeamUser()
        {
            var straff = 0;
            try
            {
                string strid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"]);
                var ChannelGuid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"])));
                var UserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserId"]);

                string[] str = UserId.Split('^');
                foreach (var data in str)
                {
                    if (data.Trim() != "")
                    {
                        var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
                        var firmid = LoggedInUser.FirmId.ToString();
                        var SenderUserId = LoggedInUser.UserId.ToString();
                        var chattype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chattype"]);
                        LawPracticeEntities db = new LawPracticeEntities();
                        straff = db.InsertChatChannelInvite(firmid, ChannelGuid, data.ToString(), activedate, SenderUserId, Convert.ToInt32(chattype));
                        //send email to user
                        try
                        {
                            string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                            CommomUtility objmail = new CommomUtility();
                            if (data.ToString().ToLower().Trim() != SenderUserId.ToLower().Trim())
                            {
                                //get user email
                                var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(data.ToString())).FirstOrDefault();
                                if (useremail != null)
                                {
                                    string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                                    var strbody = "";
                                    strbody += "Dear User,<br><br>";
                                    var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(SenderUserId)).FirstOrDefault();
                                    if (senderuser != null)
                                    {
                                        string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                        strbody += "You have a new chat from " + senderuser.cfname;
                                        strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                                    }
                                    string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                    objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                }
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Insert Chat Channel User
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertChatChannelUser()
        {
            try
            {
                var ChannelGuid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"]);
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var UserName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]);// LoggedInUser.UserName.ToString();
                var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var creatorid = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                var straff = db.InsertChatChannelUser(firmid, ChannelGuid, UserName, userid, creatorid);
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Team List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult TeamList()
        {
            try
            {
                List<GetChatTeams_Result> list = new List<GetChatTeams_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var strteamname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamname"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.GetChatTeams(UserId, firmid, strteamname, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].id = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.id.ToString().Trim()));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get Chat Teams Users
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChatTeamsUsers()
        {
            try
            {
                List<GetChatTeamsUsers_Result> list = new List<GetChatTeamsUsers_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var TeamGuid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["TeamGuid"].ToString())));
                LawPracticeEntities db = new LawPracticeEntities();
                var lists = db.GetChatTeamsUsers(TeamGuid, firmid);
                return Ok(lists);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get Team chat user list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult TeamChatUserList()
        {
            try
            {
                List<GetChatChannelUser_Result> list = new List<GetChatChannelUser_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var TeamGuid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["TeamGuid"]);
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.GetChatChannelUser(firmid, TeamGuid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get invited chat list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InvitedChatList()
        {
            try
            {
                List<sp_GetInvitedChatListNew_Result> list = new List<sp_GetInvitedChatListNew_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.sp_GetInvitedChatListNew(firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString().Replace("_", " ")));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Save chat list details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChatSaveList()
        {
            try
            {
                List<sp_GetChatArchive_Result> list = new List<sp_GetChatArchive_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var strname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"]);
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.sp_GetChatArchive(firmid, UserId, strname, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get chat message by id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChatView()
        {
            try
            {
                List<sp_GetChatMessageByid_Result> list = new List<sp_GetChatMessageByid_Result>();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.sp_GetChatMessageByid(Convert.ToInt32(id)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Check Chat Joined
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckChatJoined()
        {
            try
            {
                var firmid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["firmid"]); ;
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var list = db.sp_CheckChatJoined(firmid, userid).Count();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Create new chat channel
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateChatChannel()
        {
            try
            {
                var straff = 0;
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var teamid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamid"]);
                teamid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(teamid));
                Guid guid = Guid.NewGuid();
                var channelguid = guid.ToString();
                var firmid = LoggedInUser.FirmId.ToString();
                var createdby = LoggedInUser.UserId.ToString();
                string activedate = Convert.ToDateTime(DateTime.Now).ToString("dd-MMM-yyyy");
                LawPracticeEntities db = new LawPracticeEntities();
                string[] srtuseridarr = userid.Split(',');
                foreach (var item in srtuseridarr)
                {
                    if (!string.IsNullOrEmpty(item.ToString()))
                    {
                        straff = db.usp_CreateChatChannel(channelguid.ToString(), ChannelName, item.ToString(), firmid, createdby, teamid);
                        var strinvitedaff = db.InsertPrivateChatChannelInviteUser(firmid, channelguid, item.ToString(), activedate, createdby, 1);
                        if (strinvitedaff > 0)
                        {
                            try
                            {
                                string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                CommomUtility objmail = new CommomUtility();
                                //get user email
                                var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(item.ToString())).FirstOrDefault();
                                if (useremail != null)
                                {
                                    var strbody = "";
                                    strbody += "Dear User,<br><br>";
                                    var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(createdby)).FirstOrDefault();
                                    if (senderuser != null)
                                    {
                                        string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                        strbody += "You have a new chat from " + senderuser.cfname;
                                        strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                                    }
                                    string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);

                                    objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                }
                            }
                            catch
                            {

                            }
                        }
                    }
                }
                if (straff > 0)
                {
                    var Encryptedchannelguid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(channelguid.ToString()));
                    return Ok(Encryptedchannelguid);
                }
                else
                {
                    return Ok(straff);
                }

            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Created Chat Channel List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreatedChatChannelList()
        {
            try
            {
                List<usp_GetCreatedChatChannel_Result> list = new List<usp_GetCreatedChatChannel_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var strchannelname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelname"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.usp_GetCreatedChatChannel(firmid, UserId, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), strchannelname).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString().Trim()));
                    list[list.IndexOf(data)].teamid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.teamid.ToString().Trim()));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Created chat channel user list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreatedChatChannelUserList()
        {
            try
            {
                List<usp_GetCreatedChatChannelUserList_Result> list = new List<usp_GetCreatedChatChannelUserList_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var channelguid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelguid"]);
                LawPracticeEntities db = new LawPracticeEntities();
                channelguid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(channelguid));
                list = db.usp_GetCreatedChatChannelUserList(firmid, UserId, channelguid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Channel member list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChannelMemberList()
        {
            try
            {
                List<usp_ChatChannelMemberList_Result> list = new List<usp_ChatChannelMemberList_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var ChannelGuid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"].ToString())));
                var teamid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamid"].ToString())));
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.usp_ChatChannelMemberList(firmid, UserId, ChannelGuid, teamid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Update chat channel user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateChatChannelUser()
        {
            try
            {
                var straff = 0;
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var teamid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamid"]);
                teamid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(teamid));
                Guid guid = Guid.NewGuid();
                var channelguid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelguid"])));
                var firmid = LoggedInUser.FirmId.ToString();
                var createdby = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string[] srtuseridarr = userid.Split(',');
                if (srtuseridarr.Length > 0)
                {
                    var RecentActivityaff = db.usp_RecentActivityUpdatedUserInChatChannel(channelguid.ToString(), ChannelName, createdby, firmid);
                    var straffdel = db.usp_DeleteChatChannelUser(channelguid.ToString(), firmid, createdby);
                    if (straffdel > 0)
                    {
                        foreach (var item in srtuseridarr)
                        {
                            if (!string.IsNullOrEmpty(item.ToString()))
                                straff = db.usp_CreateChatChannel(channelguid.ToString(), ChannelName, item.ToString(), firmid, createdby, teamid);
                        }
                    }
                }

                //Update record in tblChatChannelUserInvite table
                string[] str = userid.Split(',');
                if (str.Length > 0)
                {
                    var straffdelUserInvite = db.usp_DeleteChatChannelUserInvite(firmid, channelguid.ToString(), createdby);
                    foreach (var data in str)
                    {
                        if (data.Trim() != "")
                        {
                            var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
                            var SenderUserId = LoggedInUser.UserId.ToString();
                            var chattype = 1;
                            straff = db.InsertChatChannelInviteFromChannelMemberPage(firmid, channelguid, data.ToString(), activedate, SenderUserId, Convert.ToInt32(chattype));
                            //send email to user
                            if (straff > 0)
                            {
                                try
                                {
                                    string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                    CommomUtility objmail = new CommomUtility();
                                    //get user email
                                    var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(data.ToString())).FirstOrDefault();
                                    if (useremail != null)
                                    {
                                        var strbody = "";
                                        strbody += "Dear User,<br><br>";
                                        var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(SenderUserId)).FirstOrDefault();
                                        if (senderuser != null)
                                        {
                                            string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                            strbody += "You have a new chat from " + senderuser.cfname;
                                            strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                                        }
                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                        objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                    }
                                }
                                catch
                                {

                                }
                            }
                        }
                    }
                }
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Delete channel
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChannelDel()
        {
            try
            {
                var Channelguid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Channelguid"])));
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                var straff = db.usp_DeleteChannel(Channelguid, UserId, firmid);
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Chat channel list for matter dashboard
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChatChannelListForMatterDashboard()
        {
            try
            {
                List<usp_ChatChannelListForMatterDashboard_Result> list = new List<usp_ChatChannelListForMatterDashboard_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var strchannelname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelname"]);
                var strmattername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattername"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.usp_ChatChannelListForMatterDashboard(firmid, UserId, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), strchannelname, strmattername).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString().Trim()));
                    list[list.IndexOf(data)].teamid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.teamid.ToString().Trim()));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Create Private Chat Channel
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreatePrivateChatChannel()
        {
            try
            {
                var straff = 0;
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var teamid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamid"]);
                if (teamid == "")
                {
                    teamid = "";
                }
                else
                {
                    teamid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(teamid));
                }
                Guid guid = Guid.NewGuid();
                var channelguid = guid.ToString();
                var firmid = LoggedInUser.FirmId.ToString();
                var createdby = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string activedate = Convert.ToDateTime(DateTime.Now).ToString("dd-MMM-yyyy");
                string[] srtuseridarr = userid.Split(',');
                //self insert
                straff = db.usp_CreatePrivateChatChannel(channelguid.ToString(), ChannelName, createdby, firmid, createdby, teamid);
                if (straff > 0)
                {
                    db.InsertPrivateChatChannelInviteUser(firmid, channelguid, createdby, activedate, createdby, 2);
                    foreach (var item in srtuseridarr)
                    {
                        if (!string.IsNullOrEmpty(item.ToString()))
                        {
                            straff = db.usp_CreatePrivateChatChannel(channelguid.ToString(), ChannelName, item.ToString(), firmid, createdby, teamid);
                            var strinvitedaff = db.InsertPrivateChatChannelInviteUser(firmid, channelguid, item.ToString(), activedate, createdby, 2);
                            if (strinvitedaff > 0)
                            {
                                try
                                {
                                    string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                    CommomUtility objmail = new CommomUtility();
                                    //get user email
                                    var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(item.ToString())).FirstOrDefault();
                                    if (useremail != null)
                                    {
                                        var strbody = "";
                                        strbody += "Dear User,<br><br>";
                                        var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(createdby)).FirstOrDefault();
                                        if (senderuser != null)
                                        {
                                            string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                            strbody += "You have a new chat from " + senderuser.cfname;
                                            strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                                        }
                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);

                                        objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                    }
                                }
                                catch
                                {
                                }
                            }
                        }
                    }
                }
                if (straff > 0)
                {
                    var Encryptedchannelguid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(channelguid.ToString()));
                    return Ok(Encryptedchannelguid);
                }
                else
                {
                    return Ok(straff);
                }
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get private chat channel list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PrivateChatChannelList()
        {
            try
            {
                List<usp_GetPrivateChatChannel_Result> list = new List<usp_GetPrivateChatChannel_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var strchannelname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelname"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.usp_GetPrivateChatChannel(firmid, UserId, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), strchannelname).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString().Trim()));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Update private chat channel user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdatePrivateChatChannelUser()
        {
            try
            {
                var straff = 0;
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var ChannelName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelName"]);
                var channelguid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelguid"])));
                var firmid = LoggedInUser.FirmId.ToString();
                var createdby = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();

                string[] srtuseridarr = userid.Split(',');
                if (srtuseridarr.Length > 0)
                {
                    var RecentActivityaff = db.usp_RecentActivityUpdatedUserInChatChannel(channelguid.ToString(), ChannelName, createdby, firmid);
                    foreach (var item in srtuseridarr)
                    {
                        if (!string.IsNullOrEmpty(item.ToString()))
                        {
                            string[] arr = item.ToString().Split('$');
                            if (arr.Length > 1)
                            {
                                if (arr[1].ToString() == "false")
                                {
                                    straff = db.usp_DeletePrivateChatChannelUser(channelguid.ToString(), firmid, createdby, arr[0].ToString(), 0, 2);
                                }
                                else
                                {
                                    straff = db.usp_DeletePrivateChatChannelUser(channelguid.ToString(), firmid, createdby, arr[0].ToString(), 1, 2);
                                }
                            }
                        }
                    }
                }

                string[] str = userid.Split(',');
                if (str.Length > 0)
                {
                    var straffdelUserInvite = db.usp_DeleteChatChannelUserInvite(firmid, channelguid.ToString(), createdby);
                    foreach (var data in str)
                    {
                        if (data.Trim() != "")
                        {
                            var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
                            var SenderUserId = LoggedInUser.UserId.ToString();
                            var chattype = 2;

                            string[] arruserid = data.ToString().Split('$');
                            if (arruserid.Length > 1)
                            {
                                if (arruserid[1].ToString() == "true")
                                {
                                    straff = db.InsertPrivateChatChannelInviteUser(firmid, channelguid, arruserid[0].ToString(), activedate, SenderUserId, Convert.ToInt32(chattype));
                                    //send email to user
                                    if (straff > 0)
                                    {
                                        try
                                        {
                                            string AssignmentSubmittedMailSubject = "Chat notification from mykase";
                                            string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                            CommomUtility objmail = new CommomUtility();
                                            //get user email
                                            var useremail = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(data.ToString())).FirstOrDefault();
                                            if (useremail != null)
                                            {
                                                var strbody = "";
                                                strbody += "Dear User,<br><br>";
                                                var senderuser = db.usp_wf_GetUserDetails(Guid.Parse(firmid), Guid.Parse(SenderUserId)).FirstOrDefault();
                                                if (senderuser != null)
                                                {
                                                    string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                                    strbody += "You have a new chat from " + senderuser.cfname;
                                                    strbody += "<br><br>Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">mykase</a>.";
                                                }
                                                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                                objmail.SendEmail(fromemail, useremail.cemail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                            }
                                        }
                                        catch
                                        {

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return Ok(straff);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Private channel member list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PrivateChannelMemberList()
        {
            try
            {
                List<usp_ChatChannelPrivateMemberList_Result> list = new List<usp_ChatChannelPrivateMemberList_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var ChannelGuid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"].ToString())));
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.usp_ChatChannelPrivateMemberList(firmid, UserId, ChannelGuid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Check chat joined by user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckChatJoinedByUser()
        {
            try
            {
                List<usp_CheckChatJoined_Result> list = new List<usp_CheckChatJoined_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                list = db.usp_CheckChatJoined(firmid, UserId).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Insert invite chat channel details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertInvitationPrivateChannelMember()
        {
            var straff = 0;
            var firmid = LoggedInUser.FirmId.ToString();
            var UserId = LoggedInUser.UserId.ToString();
            var ChannelGuid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ChannelGuid"].ToString())));
            var strchannelname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["channelname"]);
            var chattype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chattype"]);
            var activedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["activedate"]);
            LawPracticeEntities db = new LawPracticeEntities();
            List<usp_ChatChannelPrivateMemberList_Result> list = new List<usp_ChatChannelPrivateMemberList_Result>();
            list = db.usp_ChatChannelPrivateMemberList(firmid, UserId, ChannelGuid).ToList();
            foreach (var data in list.ToList())
            {
                straff = db.InsertChatChannelInvite(firmid, ChannelGuid, data.UserID.ToString(), activedate, UserId, Convert.ToInt32(chattype));
            }
            return Ok(straff);
        }

        /// <summary>
        ///  Get chat list for Quick Tab
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChannelListQT()
        {
            try
            {
                List<usp_GetChatListForQuickTab_Result> list = new List<usp_GetChatListForQuickTab_Result>();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var chattype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chattype"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                list = db.usp_GetChatListForQuickTab(firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), chattype).ToList();
                foreach (var data in list.ToList())
                {
                    list[list.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString().Replace("_", " ")));
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }
    }
}