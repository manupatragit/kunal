using BussinessLogic.Common;
using DataAccess.Modals;
using QueryStringEDAES;
using System;
using System.Linq;
using System.Web.Configuration;

namespace LawPracticeFirm
{
    public class Notification
    {
        /// <summary>
        /// Save notification details
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="content"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuserid"></param>
        /// <param name="caseid"></param>
        /// <param name="typeid"></param>
        /// <returns></returns>
        public static string SaveNotifications(string Type, string content, string firmid, string userid, string assignuserid, string caseid, string typeid = null)
        {
            var db = new LawPracticeEntities();
            var notidata = db.usp_getnotificationcontent(Type).FirstOrDefault();
            if (notidata != null)
            {
                var contents = notidata.NDetails;
                contents = contents.Replace("#TASK", content);
                //getusername
                var assignusername = db.usp_GetUserNameById(firmid, userid).FirstOrDefault();
                try
                {
                    if (!string.IsNullOrEmpty(assignusername))
                    {
                        assignusername = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignusername));
                    }
                }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                {
                }
                //getusername
                try
                {
                    if (!String.IsNullOrEmpty(caseid))
                    {
                        caseid = caseid.ToLower();
                        caseid = db.usp_GetCaseNameById(firmid, caseid).FirstOrDefault();
                    }
                }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                {
                }
                contents = contents.Replace("#USER", assignusername);
                contents = contents.Replace("#CREATOR", assignusername);
                contents = contents.Replace("#CASE", caseid);
                var typeids = Guid.Empty.ToString();
                try
                {
                    Guid.Parse(typeid);
                    typeids = typeid;
                }
                catch
                {
                    typeids = Guid.Empty.ToString();
                }
                //insert into notifications
                var dt = db.saveuseractivity(firmid.ToString(), userid.ToString(), assignuserid, 0, contents, notidata.NTypeName, typeids.ToString(), null, null, DateTime.Now.ToString());
            }
            return "1";
        }
        /// <summary>
        /// Send notification email
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="content"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuserid"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public static string SendEmail(string Type, string content, string firmid, string userid, string assignuserid, string username)
        {
            var db = new LawPracticeEntities();
            var notidata = db.usp_getnotificationcontent(Type).FirstOrDefault();
            if (notidata != null)
            {
                var assignusername = db.usp_GetUserNameById(firmid, userid).FirstOrDefault();
                try
                {
                    if (!string.IsNullOrEmpty(assignusername))
                    {
                        assignusername = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignusername));
                    }
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex) { }
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                var contents = notidata.NDetails;
                //for sending the email of passward change
                if (Type == "PasswordChange")
                {
                    contents = contents.Replace("#USERName", assignusername);
                    //contents = contents.Replace("#UserIds", content);
                }
                contents = contents.Replace("#TASK", content);
                contents = contents.Replace("#USER", assignusername);
                //insert into notifications
                try
                {
                    CommomUtility objmail = new CommomUtility();
                    //get user email
                    var useremail = db.usp_GetEmailByUserId(firmid, userid).FirstOrDefault();
                    if (useremail.EmailId != null)
                    {
                        string AssignmentSubmittedMailSubject = "Notification from mykase";
                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", contents);
                        objmail.SendEmail("contact@mykase.in", useremail.EmailId, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                    }
                }
                catch
                {
                }
            }
            return "1";
        }
        /// <summary>
        /// Send profile updation notification on email
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="content"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuserid"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public static string SendEmailOnProfileUpdate(string Type, string content, string firmid, string userid, string assignuserid, string username)
        {
            var db = new LawPracticeEntities();
            var notidata = db.usp_getnotificationcontent(Type).FirstOrDefault();
            if (notidata != null)
            {
                var assignusername = db.usp_GetUserNameById(firmid, userid).FirstOrDefault();
                try
                {
                    if (!string.IsNullOrEmpty(assignusername))
                    {
                        assignusername = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignusername));
                    }
                }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                {
                }
                assignusername = assignusername.ToUpper();
                var contents = notidata.NDetails;
                contents = contents.Replace("#TASK", content);
                contents = contents.Replace("#USER", assignusername);
                //insert into notifications
                if (!string.IsNullOrEmpty(content))
                {
                    contents = contents + "<br><br>" + content;
                }
                try
                {
                    CommomUtility objmail = new CommomUtility();
                    //get user email
                    var useremail = db.usp_GetEmailByUserId(firmid, assignuserid).FirstOrDefault();
                    if (useremail.EmailId != null)
                    {
                        string AssignmentSubmittedMailSubject = "Notification from myKase-Profile Edited";
                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", contents);
                        objmail.SendEmail("contact@mykase.in", useremail.EmailId, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                    }
                }
                catch
                {
                }
            }
            return "1";
        }
        /// <summary>
        /// Send Email On ReAssign Matter Team Lead
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="typeid"></param>
        /// <param name="taskname"></param>
        /// <param name="mattername"></param>
        /// <param name="partnername"></param>
        /// <param name="creatoremail"></param>
        /// <param name="teamleadname"></param>
        /// <param name="creatorId"></param>
        /// <param name="creatorfirmId"></param>
        /// <param name="Iscasemap"></param>
        /// <returns></returns>
        public static string SendEmailOnReAssignMatterTeamLead(string Type, string firmid, string userid, string typeid, string taskname,
            string mattername, string partnername, string creatoremail, string teamleadname, string creatorId, string creatorfirmId,
            int Iscasemap = 0)
        {
            try
            {
                CommomUtility objmail = new CommomUtility();
                //get user email
                if (!string.IsNullOrEmpty(creatoremail))
                {
                    string ReAssignMatterTeamLeadSubject = WebConfigurationManager.AppSettings["ReAssignMatterTeamLeadSubject"].ToString();
                    string ReAssignMatterTeamLeadBody = WebConfigurationManager.AppSettings["ReAssignMatterTeamLeadBody"].ToString();
                    ReAssignMatterTeamLeadBody = ReAssignMatterTeamLeadBody.Replace("#UserName#", teamleadname.ToUpper());
                    ReAssignMatterTeamLeadBody = ReAssignMatterTeamLeadBody.Replace("#MatterName#", mattername.ToUpper());
                    ReAssignMatterTeamLeadBody = ReAssignMatterTeamLeadBody.Replace("#PartnerName#", partnername.ToUpper());
                    objmail.SendEmail("contact@mykase.in", creatoremail, "", ReAssignMatterTeamLeadSubject, ReAssignMatterTeamLeadBody);
                }
            }
            catch
            {
            }
            var db = new LawPracticeEntities();
            var notidata = db.usp_getnotificationcontent(Type).FirstOrDefault();
            if (notidata != null)
            {
                var contents = notidata.NDetails;
                contents = contents.Replace("#UserName", teamleadname.ToUpper());
                contents = contents.Replace("#MatterName", mattername.ToUpper());
                //insert into notifications
                var typeids = Guid.Empty.ToString();
                try
                {
                    Guid.Parse(typeid);
                    typeids = typeid;
                }
                catch
                {
                    typeids = Guid.Empty.ToString();
                }
                //insert into notifications
                var dt = db.saveuseractivity(creatorfirmId, creatorId, creatorId, 0, contents, notidata.NTypeName, typeids.ToString(), null, null, DateTime.Now.ToString());
            }
            if (Iscasemap > 0)
            {
                var TaskContentByInternalTeamPartner = db.usp_getnotificationcontent("RejectTaskByInternalTeamPartner").FirstOrDefault();
                if (TaskContentByInternalTeamPartner != null)
                {
                    var contents = TaskContentByInternalTeamPartner.NDetails;
                    contents = contents.Replace("#UserName", teamleadname.ToUpper());
                    contents = contents.Replace("#MatterName", mattername.ToUpper());
                    //insert into notifications
                    var typeids = Guid.Empty.ToString();
                    try
                    {
                        Guid.Parse(typeid);
                        typeids = typeid;
                    }
                    catch
                    {
                        typeids = Guid.Empty.ToString();
                    }
                    //insert into notifications
                    var dt = db.saveuseractivity(creatorfirmId, creatorId, creatorId, 0, contents, TaskContentByInternalTeamPartner.NTypeName, typeids.ToString(), null, null, DateTime.Now.ToString());
                }
            }
            return "1";
        }
        /// <summary>
        /// Send email upload document
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="content"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuserid"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static string SendEmailUploadDocument(string Type, string content, string firmid, string userid, string assignuserid, string caseid)
        {
            var db = new LawPracticeEntities();
            var notidata = db.usp_getnotificationcontent(Type).FirstOrDefault();
            if (notidata != null)
            {
                var assignusername = db.usp_GetUserNameById(firmid, userid).FirstOrDefault();
                try
                {
                    if (!string.IsNullOrEmpty(assignusername))
                    {
                        assignusername = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(assignusername));
                    }
                }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                {
                }
                assignusername = assignusername.ToUpper();
                var contents = notidata.NDetails;
                contents = contents.Replace("#TASK", content);
                contents = contents.Replace("#USER", assignusername);
                try
                {
                    if (!String.IsNullOrEmpty(caseid))
                    {
                        caseid = caseid.ToLower();
                        caseid = db.usp_GetCaseNameById(firmid, caseid).FirstOrDefault();
                    }
                }
#pragma warning disable CS0168 // The variable 'es' is declared but never used
                catch (Exception es)
#pragma warning restore CS0168 // The variable 'es' is declared but never used
                {
                    caseid = "";
                }
                contents = contents.Replace("#USER", assignusername);
                contents = contents.Replace("#CASE", caseid);
                //insert into notifications
                if (!string.IsNullOrEmpty(content))
                {
                    contents = contents + "<br><br>" + content;
                }
                try
                {
                    CommomUtility objmail = new CommomUtility();
                    //get user email
                    var useremail = db.usp_GetEmailByUserId(firmid, assignuserid).FirstOrDefault();
                    if (useremail.EmailId != null)
                    {
                        string AssignmentSubmittedMailSubject = "Notification from myKase-Upload Document";
                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", contents);
                        objmail.SendEmail("contact@mykase.in", useremail.EmailId, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                    }
                }
                catch
                {
                }
            }
            return "1";
        }
        /// <summary>
        /// Send email from DB content
        /// </summary>
        /// <param name="Type"></param>
        /// <param name="moduleId"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignuserid"></param>
        /// <param name="caseid"></param>
        /// <param name="contentname"></param>
        /// <param name="parentfoldername"></param>
        /// <returns></returns>
        public static string SendEmailFromDBContent(string Type, string moduleId, string firmid, string userid, string assignuserid, string caseid, string contentname, string parentfoldername = null)
        {
            try
            {
                var db = new LawPracticeEntities();
                var stringcontent = "";
                var stringsubject = "";
                //get AssignorName
                //get mykaselink
                string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                CommomUtility objmail = new CommomUtility();
                string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                if (Type.ToString() == "UploadDoc" || Type.ToString() == "DocCheckin" || Type.ToString() == "DocCheckout" || Type.ToString() == "CreateOnlineDoc")
                {
                    var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(assignuserid.ToString(), firmid).FirstOrDefault();
                    //get AssigneesName
                    var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                    var mattername = db.usp_getcasename(firmid, caseid).FirstOrDefault();
                    var result = db.usp_GetEmailTemplate(Type).FirstOrDefault();
                    stringcontent = result.EmailContent;
                    stringsubject = result.EmailSubject;
                    stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                    stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                    if (!String.IsNullOrEmpty(mattername.ToString()))
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", mattername + "<br/><br/>");
                    }
                    else
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", "");
                    }
                    stringcontent = stringcontent.Replace("#DocumentName#", contentname);
                    stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                    objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                }
                else if (Type.ToString() == "CreateFolderUnderSubFolder" || Type.ToString() == "UploadDocUnderSubFolder" || Type.ToString() == "CreateOnlineDocUnderSubFolder")
                {
                    var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(assignuserid.ToString(), firmid).FirstOrDefault();
                    //get AssigneesName
                    var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                    var mattername = db.usp_getcasename(firmid, caseid).FirstOrDefault();
                    var result = db.usp_GetEmailTemplate(Type).FirstOrDefault();
                    stringcontent = result.EmailContent;
                    stringsubject = result.EmailSubject;
                    stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                    stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                    if (!String.IsNullOrEmpty(mattername.ToString()))
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", mattername);
                    }
                    else
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", "");
                    }
                    if (Type.ToString() == "CreateFolderUnderSubFolder")
                    {
                        stringcontent = stringcontent.Replace("#FolderName#", contentname);
                    }
                    else
                    {
                        stringcontent = stringcontent.Replace("#DocumentName#", contentname);
                    }
                    stringcontent = stringcontent.Replace("#FolderName#", parentfoldername);
                    stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                    objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                }
                else if (Type.ToString() == "AssignTeamMemberTaskCase")
                {
                    var AssignorName = db.usp_GetFirmUsers_RegUser_by_Id(assignuserid.ToString(), firmid).FirstOrDefault();
                    //get AssigneesName
                    var AssigneesName = db.usp_GetFirmUsers_RegUser_by_Id(userid, firmid).FirstOrDefault();
                    var mattername = db.usp_CaseBasicDetails(firmid, userid, caseid).FirstOrDefault();
                    var result = db.usp_GetEmailTemplate(Type).FirstOrDefault();
                    stringcontent = result.EmailContent;
                    stringsubject = result.EmailSubject;
                    stringcontent = stringcontent.Replace("#AssignorName#", AssignorName.cfname);
                    stringcontent = stringcontent.Replace("#AssigneesName#", AssigneesName.cfname);
                    if (!String.IsNullOrEmpty(mattername.ToString()))
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", mattername.mname);
                    }
                    else
                    {
                        stringcontent = stringcontent.Replace("#MatterName#", "");
                    }
                    stringcontent = stringcontent.Replace("#MatterType#", mattername.MatterTypeName);
                    stringcontent = stringcontent.Replace("#AcceptRejectDate#", @String.Format("{0:dd MMM yyyy}", DateTime.Now));
                    stringcontent = stringcontent.Replace("#mykaselink#", mykaselink);
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                    objmail.SendEmail(fromemail, AssignorName.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return "true";
        }
    }
}
