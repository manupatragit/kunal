using System;
using System.IO;
using System.Net.Mail;
using System.Web.Configuration;

namespace BussinessLogic.Common
{
    public class CommomUtility
    {
        /// <summary>
        /// Send mail
        /// </summary>
        /// <param name="frmEmailId"></param>
        /// <param name="To"></param>
        /// <param name="CC"></param>
        /// <param name="Subject"></param>
        /// <param name="Body"></param>
        /// <param name="attached"></param>
        public void SendEmail(string frmEmailId, string To, string CC, string Subject, string Body, string attached = null)
        {
            string server = null;
            string port = null;
            server = WebConfigurationManager.AppSettings["EmailSMTP"];
            port = WebConfigurationManager.AppSettings["EmailPort"];

            try
            {
                if (To.ToString().Trim() != "")
                {
                    string mailFrom = frmEmailId;
                    string mailFromName = frmEmailId;
                    string mailHost = server;
                    bool isSSLMail = false;
                    bool useDefaultMailCredentials = Convert.ToBoolean(false);
                    int smtpPort = Convert.ToInt32(port);
                    string regMailFromUserName = frmEmailId;
                    string regMailFromPassword = "";
                    MailMessage mm = new MailMessage();
                    System.Net.Mail.MailAddress mailFromAddress = new System.Net.Mail.MailAddress(mailFrom, mailFromName);
                    string[] ToMuliId = To.Split(',');
                    foreach (string ToEMailId in ToMuliId)
                    {
                        mm.To.Add(new MailAddress(ToEMailId)); //adding multiple TO Email Id
                    }
                    mm.From = new MailAddress(mailFromName);
                    mm.Subject = Subject;// Subject;
                    string strbody = Body;
                    mm.Body = strbody;
                    mm.IsBodyHtml = true;
                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                    if (CC.ToString().Trim() != "")
                    {
                        string[] CCId = CC.Split(',');
                        foreach (string CCEmail in CCId)
                        {
                            mm.CC.Add(new MailAddress(CCEmail)); //Adding Multiple CC email Id
                        }
                    }
                    try
                    {
                        if (attached.ToString().Trim() != "")
                        {
                            string[] CCattach = attached.Split(',');
                            foreach (string ccattached in CCattach)
                            {


                                if (!string.IsNullOrEmpty(ccattached))
                                {
                                    if (File.Exists(ccattached))
                                    {
                                        mm.Attachments.Add(new System.Net.Mail.Attachment(ccattached));
                                    }
                                    else
                                    {
                                        attached = "";
                                    }
                                }
                            }
                        }
                    }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                    catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                    {

                    }
                    smtp.Host = mailHost;
                    smtp.EnableSsl = isSSLMail;
                    System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential(regMailFromUserName, regMailFromPassword);
                    smtp.UseDefaultCredentials = useDefaultMailCredentials;
                    smtp.Credentials = NetworkCred;
                    smtp.Port = smtpPort;
                    smtp.Send(mm);
                }
                else
                {
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {


            }
        }
        /// <summary>
        /// Send mail for enquiry
        /// </summary>
        /// <param name="frmEmailId"></param>
        /// <param name="To"></param>
        /// <param name="CC"></param>
        /// <param name="BCC"></param>
        /// <param name="Subject"></param>
        /// <param name="Body"></param>
        /// <param name="attached"></param>
        public void SendEmail(string frmEmailId, string To, string CC, string BCC, string Subject, string Body, string attached = null)
        {
            string server = null;
            string port = null;
            server = WebConfigurationManager.AppSettings["EmailSMTP"];
            port = WebConfigurationManager.AppSettings["EmailPort"];

            try
            {
                if (To.ToString().Trim() != "")
                {
                    using (System.Net.Mail.MailMessage mm = new System.Net.Mail.MailMessage())
                    {
                        string mailFrom = frmEmailId;
                        string mailFromName = frmEmailId;
                        string mailHost = server;
                        bool isSSLMail = false;
                        bool useDefaultMailCredentials = Convert.ToBoolean(false);
                        int smtpPort = Convert.ToInt32(port);
                        string regMailFromUserName = frmEmailId;
                        string regMailFromPassword = "";
                        //string adminEmail = "";
                        System.Net.Mail.MailAddress mailFromAddress = new System.Net.Mail.MailAddress(mailFrom, mailFromName);

                        string[] ToMuliId = To.Split(',');
                        foreach (string ToEMailId in ToMuliId)
                        {
                            mm.To.Add(new MailAddress(ToEMailId)); //adding multiple TO Email Id
                        }

                        mm.From = new MailAddress(mailFromName);
                        mm.Subject = Subject;// Subject;
                        string strbody = Body;
                        mm.Body = strbody;
                        mm.IsBodyHtml = true;
                        //System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                        using (System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient())
                        {
                            if (CC.ToString().Trim() != "")
                            {
                                string[] CCId = CC.Split(',');
                                foreach (string CCEmail in CCId)
                                {
                                    mm.CC.Add(new MailAddress(CCEmail)); //Adding Multiple CC email Id
                                }
                            }
                            if (BCC.ToString().Trim() != "")
                            {
                                string[] BCCid = BCC.Split(',');
                                foreach (string BCCEmail in BCCid)
                                {
                                    mm.Bcc.Add(new MailAddress(BCCEmail)); //Adding MultipleB CC email Id
                                }
                            }
                            //attachment

                            try
                            {
                                if (attached.ToString().Trim() != "")
                                {
                                    string[] CCattach = attached.Split(',');
                                    foreach (string ccattached in CCattach)
                                    {


                                        if (!string.IsNullOrEmpty(ccattached))
                                        {
                                            if (File.Exists(ccattached))
                                            {
                                                // AttachmentPath1 = attached;
                                                mm.Attachments.Add(new System.Net.Mail.Attachment(ccattached));
                                            }
                                            else
                                            {
                                                attached = "";
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
                            smtp.Host = mailHost;
                            smtp.EnableSsl = isSSLMail;
                            System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential(regMailFromUserName, regMailFromPassword);
                            smtp.UseDefaultCredentials = useDefaultMailCredentials;
                            smtp.Credentials = NetworkCred;
                            smtp.Port = smtpPort;
                            smtp.Send(mm);
                        }
                    }

                }
                else
                {
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {


            }
        }

    }
}
