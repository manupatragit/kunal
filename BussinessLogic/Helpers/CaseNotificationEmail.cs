using DataAccess.Modals;
using LawPracticeFirm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic
{
    class CaseNotificationEmail
    {
        /// <summary>
        /// Send email notification for assign user
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="assignto"></param>
        /// <param name="creatorroleid"></param>
        /// <param name="casename"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static string AssignUserSendNotificationEmail(string firmid, string userid, string assignto, string creatorroleid, string casename, string caseid)
        {
            var id = caseid;
            var db = new LawPracticeEntities();
            if (!String.IsNullOrEmpty(assignto))
            {
                string[] values = assignto.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    if (creatorroleid == "1")
                    {

                        var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);

                    }
                    else
                    {
                        var checkroles1 = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                        if (checkroles1 != null)
                        {
                            if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                            {


                                var parentpartner = checkroles1.PartnerId;

                                //send request to partner for this user

                                var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);
                                //send notification
                                var dataac1e = Notification.SaveNotifications("AssignTeamMemberTaskCase", null, firmid, userid, parentpartner, casename, id);
                                //send email
                                var dataac2 = Notification.SendEmailFromDBContent("AssignTeamMemberTaskCase", null, firmid, userid, parentpartner, id, casename);

                            }
                            else
                            {

                                var dataac1 = Notification.SaveNotifications("AddTeamMember", null, firmid, userid, values[i], casename, id);
                            }
                        }
                    }


                }
            }
            return "success";

        }
    }
}
