using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Search;
using MailKit.Security;
using MimeKit;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class MailBoxApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = " MailBoxApiController";
        public MailBoxApiController()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }

        /// <summary>
        /// Load Inbox Details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInbox()
        {
            try
            {
                var db = new LawPracticeEntities();
                string length = QueryAES.UrlDecode(HttpContext.Current.Request.Form["length"]);
                string lastlength = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lastlength"]);
                string mailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["serverdata"]);
                mailserver = mailserver.ToString().Replace(" ", "+");
                mailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mailserver));
                string servereamil_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emaildata"]);
                string serverpassword_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["passworddata"]);
                string issaved = QueryAES.UrlDecode(HttpContext.Current.Request.Form["saved"]);
                string targetfolder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["folder"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                string table = "";
                var param = controllername + ">MailBox>MailBox>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                StringBuilder sc = new StringBuilder();
                StringBuilder sc1 = new StringBuilder();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == mailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    var client = new ImapClient();
                    client.Connect(getserverdata.ImapAddress, 993, SecureSocketOptions.SslOnConnect);
                    if (servereamil_value.ToString() == "" && serverpassword_value.ToString() == "")
                    {
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == mailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                        }
                    }
                    else
                    {
                        client.Authenticate(servereamil_value, serverpassword_value);
                    }
                    if (targetfolder == "Inbox")
                    {
                        var folder = client?.Inbox.Open(FolderAccess.ReadOnly);
                        int count = Convert.ToInt32(client?.Inbox.Count) - 1;
                        int slength = Convert.ToInt32(length);
                        int elength = Convert.ToInt32(lastlength);
                        count = count - slength;
                        for (int i = slength; i < elength; i++)
                        {
                            MimeMessage message = client.Inbox.GetMessage(count);
                            count = count - 1;
                            if (count < -1)
                            {
                                break;
                            }
                            var path = HttpContext.Current.Server.MapPath("~/Inbox/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                            var path2 = "";
                            int fcount = 0;
                            if (message.Attachments != null)
                            {
                                foreach (MimeEntity att in message.Attachments)
                                {
                                    if (att.IsAttachment)
                                    {
                                        fcount = fcount + 1;
                                        if (!Directory.Exists(path))
                                            Directory.CreateDirectory(path);
                                        try
                                        {
                                            if (!String.IsNullOrEmpty(att.ContentType.Name))
                                            {
                                                var STRINGNAMEFILE = att.ContentType.Name.ToString();
                                                String lastEXTENTION = STRINGNAMEFILE.Substring(STRINGNAMEFILE.LastIndexOf('.') + 1);
                                                string newfilename = "File(" + fcount + ")." + lastEXTENTION;
                                                string fn = Path.Combine(path,
                                                    newfilename);
                                                if (System.IO.File.Exists(fn))
                                                    System.IO.File.Delete(fn);
                                                using (var stream = System.IO.File.Create(fn))
                                                {
                                                    var mp = ((MimePart)att);
                                                    mp.ContentObject.DecodeTo(stream);
                                                }
                                                string attachmentName = string.Format("{0}/{1}", "/inbox/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/", newfilename);
                                                sc.Append(string.Format("<br> <a style='padding-top:3px; font-size:14px;' href=\"{0}\" download=\"{1}\"><i class='fa fa-paperclip'></i> " + fcount + ". {1} Attached.</a> ",
                                                                                        attachmentName, att.ContentType.Name));
                                            }
                                        }
                                        catch (Exception er)
                                        {
                                        }
                                    }
                                }
                            }
                            table += "<tr style='clear:both !Important'><td> <div style='background-color:white; padding:8px;' class='collapsible1'><table width='100%'><tr><td width='50%'><p><i class='glyphicon glyphicon-envelope' style='color: orange'></i>&nbsp;&nbsp;" + message.Subject + "</p></td><td width='30%'><p>" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "</p></td><td width='18%'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</td></tr></table></div>";
                            table += "<div class='content1'  style='clear:both;margin-bottom:10px;'>";
                            table += "<div style='margin-top:5px;'>";
                            if (message.Cc.ToString() != "")
                            {
                                table += "<button type='button' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "'  subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' id='replyAll' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i>Reply All</button>";
                                table += "<button style='margin-left:5px;' type='button' id='reply' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i> Reply</button> ";
                                table += "<button type='button' id='forword' subval='" + message.Subject + "' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Forward</button> ";
                                table += "<button type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button></div>";
                            }
                            else
                            {
                                table += "<button type='button' ccval='" + message.Cc.ToString() + "'  subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' id='replyAll' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i>Reply All</button>";
                                table += "<button style='margin-left:5px;' type='button' id='reply' ccval='" + message.Cc.ToString() + "' subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i> Reply</button> ";
                                table += "<button type='button' id='forword' subval='" + message.Subject + "' ccval='" + message.Cc.ToString() + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Forward</button> ";
                                table += "<button type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button></div>";
                            }
                            table += "<div  id='content" + Regex.Replace(message.MessageId.ToString(), @"[^0-9a-zA-Z]+", "") + "' style='clear:both;margin-bottom:10px;'>";
                            table += "<p class='MsoNormal'  style='padding-top:5px;'><span style='margin-top:5px;'><b><span style='font-size:10.0pt;font-family:sans-serif'>From:</span></b>";
                            table += "<span style='font-size:10.0pt;font-family:sans-serif'>" + message.From.ToString().Replace("<", "").Replace(">", "") + "</br></span>";
                            table += "<b>Sent:</b> " + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</br>";
                            table += "<b>To:</b>" + message.To.ToString() + "</br>";
                            if (message.Cc.ToString() != "")
                            {
                                table += "<b>Cc:</b>" + message.Cc.ToString() + "</br>";
                            }
                            if (message.HtmlBody != null)
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr><p> " + message.HtmlBody + "</p> ";
                            }
                            else
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr>";
                            }
                            if (message.TextBody != null)
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr><p> " + message.TextBody + "</p>";
                            }
                            else
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr> ";
                            }
                            table += "<br><br>" + sc + "<br></div></div>";
                            table += "</td></tr>";
                            sc.Clear();
                            var str = "-1";
                            if (count.ToString() == str.ToString())
                            {
                                break;
                            }
                            table = Regex.Replace(table, "(<style.+?</style>)|(<script.+?</script>)", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                        }
                        return Ok(table);
                    }
                    else
                    {
                        // mails from another folder
                        var inbox = client.Inbox;
                        inbox.Open(FolderAccess.ReadOnly);
                        var newFolder = client.GetFolder(targetfolder);
                        newFolder.Open(FolderAccess.ReadOnly);
                        int count = Convert.ToInt32(newFolder.Count) - 1;
                        int slength = Convert.ToInt32(length);
                        int elength = Convert.ToInt32(lastlength);
                        count = count - slength;
                        for (int i = slength; i < elength; i++)
                        {
                            MimeMessage message = newFolder.GetMessage(count);
                            count = count - 1;
                            if (count < -1)
                            {
                                break;
                            }
                            var path = HttpContext.Current.Server.MapPath("~/Inbox/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                            var path2 = "";
                            int fcount = 0;
                            if (message.Attachments != null)
                            {
                                foreach (MimeEntity att in message.Attachments)
                                {
                                    if (att.IsAttachment)
                                    {
                                        fcount = fcount + 1;
                                        if (!Directory.Exists(path))
                                            Directory.CreateDirectory(path);
                                        try
                                        {
                                            if (!String.IsNullOrEmpty(att.ContentType.Name))
                                            {
                                                var STRINGNAMEFILE = att.ContentType.Name.ToString();
                                                String lastEXTENTION = STRINGNAMEFILE.Substring(STRINGNAMEFILE.LastIndexOf('.') + 1);
                                                string newfilename = "File3(" + fcount + ")." + lastEXTENTION;
                                                string fn = Path.Combine(path,
                                                    newfilename);
                                                if (System.IO.File.Exists(fn))
                                                    System.IO.File.Delete(fn);
                                                using (var stream = System.IO.File.Create(fn))
                                                {
                                                    var mp = ((MimePart)att);
                                                    mp.ContentObject.DecodeTo(stream);
                                                }
                                                string attachmentName = string.Format("{0}/{1}", "/inbox/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/", newfilename);
                                                sc.Append(string.Format("<br> <a style='padding-top:3px; font-size:14px;' href=\"{0}\" download=\"{1}\"><i class='fa fa-paperclip'></i> " + fcount + ". {1} Attached.</a> ",
                                                                                           attachmentName, att.ContentType.Name));
                                            }
                                        }
                                        catch (Exception rr)
                                        {
                                        }
                                    }
                                }
                            }
                            int chkd = targetfolder.ToString().IndexOf("Draft");
                            if (chkd >= 0)
                            {
                                if (message.Cc.ToString() != "")
                                {
                                    table += "<tr id='tr" + Regex.Replace(message.MessageId.ToString(), @"[^0-9a-zA-Z]+", "") + "'><td> <div style='background-color:white; padding:8px;' class='collapsible3'><table width='100%'><tr><td width='50%'><p><i class='glyphicon glyphicon-envelope' style='color: orange'></i>&nbsp;&nbsp;" + message.Subject + "</p></td><td width='30%'><p>" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "</p></td><td width='18%'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</td></tr></table></div>";
                                    table += "<div class='content1'  style='clear:both;margin-bottom:10px;'>";
                                    table += "<div style='margin-top:5px;'>";
                                    table += "<button type='button' id='composed' subval='" + message.Subject + "' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Compose</button>";
                                    table += "<button style='margin-left:5px;' type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button></div>";
                                }
                                else
                                {
                                    table += "<tr id='tr" + Regex.Replace(message.MessageId.ToString(), @"[^0-9a-zA-Z]+", "") + "'><td> <div style='background-color:white; padding:8px;' class='collapsible3'><table width='100%'><tr><td width='50%'><p><i class='glyphicon glyphicon-envelope' style='color: orange'></i>&nbsp;&nbsp;" + message.Subject + "</p></td><td width='30%'><p>" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "</p></td><td width='18%'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</td></tr></table></div>";
                                    table += "<div class='content1'  style='clear:both;margin-bottom:10px;'>";
                                    table += "<div style='margin-top:5px;'>";
                                    table += "<button type='button' id='composed' subval='" + message.Subject + "' ccval='" + message.Cc.ToString() + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Compose</button>";
                                    table += "<button style='margin-left:5px;' type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button> </div>";
                                }
                            }
                            else
                            {
                                if (message.Cc.ToString() != "")
                                {
                                    table += "<tr><td> <div style='background-color:white; padding:8px;' class='collapsible2'><table width='100%'><tr><td width='50%'><p><i class='glyphicon glyphicon-envelope' style='color: orange'></i>&nbsp;&nbsp;" + message.Subject + "</p></td><td width='30%'><p>" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "</p></td><td width='18%'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</td></tr></table></div>";
                                    table += "<div class='content1'  style='clear:both;margin-bottom:10px;'>";
                                    table += "<div style='margin-top:5px;'>";
                                    table += "<button type='button' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "'  subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' id='replyAll' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i>Reply All</button>";
                                    table += "<button style='margin-left:5px;' type='button' id='reply' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i> Reply</button> ";
                                    table += "<button type='button' id='forword' subval='" + message.Subject + "' ccval='" + message.Cc.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Forward</button>";
                                    table += "<button style='margin-left:5px;' type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button></div>";
                                }
                                else
                                {
                                    table += "<tr><td> <div style='background-color:white; padding:8px;' class='collapsible2'><table width='100%'><tr><td width='50%'><p><i class='glyphicon glyphicon-envelope' style='color: orange'></i>&nbsp;&nbsp;" + message.Subject + "</p></td><td width='30%'><p>" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "</p></td><td width='18%'><p>&nbsp;&nbsp;&nbsp;&nbsp;" + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</td></tr></table></div>";
                                    table += "<div class='content1'  style='clear:both;margin-bottom:10px;'>";
                                    table += "<div style='margin-top:5px;'>";
                                    table += "<button type='button' ccval='" + message.Cc.ToString() + "'  subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' id='replyAll' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i>Reply All</button>";
                                    table += "<button style='margin-left:5px;' type='button' id='reply' ccval='" + message.Cc.ToString() + "' subval='" + message.Subject + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-success btn-mail'><i class='fa fa-reply'></i> Reply</button> ";
                                    table += "<button type='button' id='forword' subval='" + message.Subject + "' ccval='" + message.Cc.ToString() + "' toval='" + message.To.ToString().Substring(message.To.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' fromval='" + message.From.ToString().Substring(message.From.ToString().IndexOf('<') + 1).Replace("<", "").Replace(">", "") + "' idval='" + message.MessageId + "' class='btn btn-info btn-mail'><i class='glyphicon glyphicon-share-alt'></i> Forward</button>";
                                    table += "<button style='margin-left:5px;' type ='button' class='btn btn-warning btn-mail' id='print1' data-toggle='tooltip' title='Print' idval='" + message.MessageId + "'><i class='glyphicon glyphicon-print'></i>&nbsp;</button></div>";
                                }
                            }
                            table += "<div  id='content" + Regex.Replace(message.MessageId.ToString(), @"[^0-9a-zA-Z]+", "") + "' style='clear:both;margin-bottom:10px;'>";
                            table += "<p class='MsoNormal'  style='padding-top:5px;'><span style='margin-top:5px;'><b><span style='font-size:10.0pt;font-family:sans-serif'>From:</span></b>";
                            table += "<span style='font-size:10.0pt;font-family:sans-serif'>" + message.From.ToString().Replace("<", "").Replace(">", "") + "</br></span>";
                            table += "<b>Sent:</b> " + String.Format("{0:dd MMM yyyy}", message.Date) + "&nbsp;" + message.Date.DateTime.ToString().Substring(11) + "</br>";
                            table += "<b>To:</b>" + message.To.ToString() + "</br>";
                            if (message.Cc.ToString() != "")
                            {
                                table += "<b>Cc:</b>" + message.Cc.ToString() + "</br>";
                            }
                            if (message.HtmlBody != null)
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr><p> " + message.HtmlBody + "</p></div><br><br>" + sc + "<br></div> </td></tr>";
                            }
                            else
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr></div><br><br>" + sc + "<br></div> </td></tr>";
                            }
                            if (message.TextBody != null)
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr><p> " + message.TextBody + "</p></div><br><br>" + sc + "<br></div> </td></tr>";
                            }
                            else
                            {
                                table += "<b>Subject:</b>" + message.Subject + "</span></p><hr></div><br><br>" + sc + "<br></div> </td></tr>";
                            }
                            sc.Clear();
                            foreach (MimeEntity att1 in message.BodyParts)
                            {
                                if (att1.ContentType.MimeType.ToString() == "image/jpeg" || att1.ContentType.MimeType.ToString() == "image/png")
                                {
                                    path2 = HttpContext.Current.Server.MapPath("~/Inbox2/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + att1.ContentId + "/");
                                    if (!Directory.Exists(path2))
                                        Directory.CreateDirectory(path2);
                                    fcount = fcount + 1;
                                    if (!Directory.Exists(path))
                                        Directory.CreateDirectory(path);
                                    try
                                    {
                                        if (!String.IsNullOrEmpty(att1.ContentType.Name))
                                        {
                                            var STRINGNAMEFILE = att1.ContentType.Name.ToString();
                                            String lastEXTENTION = STRINGNAMEFILE.Substring(STRINGNAMEFILE.LastIndexOf('.') + 1);
                                            string newfilename = "File4(" + fcount + ")." + lastEXTENTION;
                                            string fn1 = Path.Combine(path2,
                                               newfilename);
                                            if (System.IO.File.Exists(fn1))
                                                System.IO.File.Delete(fn1);
                                            using (var stream1 = System.IO.File.Create(fn1))
                                            {
                                                var mp1 = ((MimePart)att1);
                                                mp1.ContentObject.DecodeTo(stream1);
                                            }
                                            string attachmentName1 = "/inbox2/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + att1.ContentId + "/" + newfilename;
                                            table = Convert.ToString(table).Replace("cid:" + att1.ContentId, attachmentName1);
                                        }
                                    }
                                    catch (Exception er)
                                    {
                                    }
                                }
                            }
                            var str = "-1";
                            if (count.ToString() == str.ToString())
                            {
                                break;
                            }
                            table = Regex.Replace(table, "(<style.+?</style>)|(<script.+?</script>)", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                        }
                        return Ok(table);
                    }
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }

        /// <summary>
        /// Save Mail Box Settings
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveMailBoxSettings()
        {
            try
            {
                var db = new LawPracticeEntities();
                Tbl_mailboxServer tx = new Tbl_mailboxServer();
                string mservername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mservername"]);
                string smtpserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["smtpserver"]);
                string smtpport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["smtpport"]);
                string imapserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["imapserver"]);
                string imapport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["imapport"]);
                string popserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["popserver"]);
                string popport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["popport"]);
                tx.MailServerName = mservername;
                tx.SmtpAddress = smtpserver;
                tx.SmtpPort = smtpport;
                tx.ImapAddress = imapserver;
                tx.ImapPort = imapport;
                tx.PopAddress = popserver;
                tx.PopPort = popport;
                tx.Firmid = LoggedInUser.FirmId;
                tx.Userid = LoggedInUser.UserId;
                var chksdate1 = db.Tbl_mailboxServer.Where(x => x.MailServerName.ToLower() == tx.MailServerName.ToLower() && x.Firmid == tx.Firmid && x.Userid == tx.Userid).FirstOrDefault();
                if (chksdate1 != null)
                {
                    return Ok("alreadyexist");
                }
                var param = controllername + ">SaveMailBoxSettings>SaveMailBoxSettings>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var series = Repository.Matter.SaveMailBoxSettings(tx);
                return Ok(series);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load mailbox server
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadmailboxserver()
        {
            try
            {
                var param = controllername + ">Loadmailboxserver>Loadmailboxserver>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.Loadmailboxserver(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Edit mailbox server
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult EditMailBoxSettings()
        {
            try
            {
                string id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                id = id.ToString().Replace(" ", "+");
                id = QueryAES.DecryptStringAES(id);
                var db = new LawPracticeEntities();
                Tbl_mailboxServer tx = new Tbl_mailboxServer();
                string mservername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mservername"]);
                string smtpserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["smtpserver"]);
                string smtpport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["smtpport"]);
                string imapserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["imapserver"]);
                string imapport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["imapport"]);
                string popserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["popserver"]);
                string popport = QueryAES.UrlDecode(HttpContext.Current.Request.Form["popport"]);
                tx.MailServerName = mservername;
                tx.SmtpAddress = smtpserver;
                tx.SmtpPort = smtpport;
                tx.ImapAddress = imapserver;
                tx.ImapPort = imapport;
                tx.PopAddress = popserver;
                tx.PopPort = popport;
                tx.Firmid = LoggedInUser.FirmId;
                tx.Userid = LoggedInUser.UserId;
                var chksdate = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == id.ToString() && x.Firmid == tx.Firmid && x.Userid == LoggedInUser.UserId).FirstOrDefault();
                if (chksdate != null)
                {
                    if (chksdate.MailServerName == mservername)
                    {
                    }
                    else
                    {
                        var chksdate1 = db.Tbl_mailboxServer.Where(x => x.MailServerName.ToString() == mservername.ToString() && x.Firmid == tx.Firmid && x.Userid == LoggedInUser.UserId).FirstOrDefault();
                        if (chksdate1 != null)
                        {
                            if (chksdate1.MailServerName == mservername)
                            {
                                return Ok("alreadyexist");
                            }
                        }
                    }
                }
                var param = controllername + ">EditMailBoxSettings>SaveMailBoxSettings>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var series = Repository.Matter.SaveMailBoxSettings(tx, id);
                return Ok(series);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove mailbox server
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveMailBoxServer()
        {
            try
            {
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid));
                var param = controllername + ">RemoveMailBoxServer>RemoveMailBoxServer>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.RemoveMailBoxServer(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove mail box account
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveMailBoxAccount()
        {
            try
            {
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid));
                var param = controllername + ">RemoveMailBoxAccount>RemoveMailBoxAccount>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.RemoveMailBoxAccount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Check  login data from  mailbox server
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult checklogindata()
        {
            try
            {
                bool stflag = false;
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mailserver"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid));
                var getmailser = db1.Tbl_mailboxServer.Where(x => x.Id.ToString() == fid.ToString()).FirstOrDefault();
                if (getmailser != null)
                {
                    var chkdata = db1.Tbl_MailCredential.Where(x => x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId && x.MailServerId.ToString() == fid.ToString()).FirstOrDefault();
                    if (chkdata != null)
                    {
                        var getmailser1 = db1.Tbl_mailboxServer.Where(x => x.Id.ToString() == fid.ToString()).FirstOrDefault();
                        if (getmailser1 != null)
                        {
                            try
                            {
                                var client = new ImapClient();
                                client.Connect(getmailser1.ImapAddress, 993, SecureSocketOptions.SslOnConnect);
                                client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(chkdata.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(chkdata.Password)));
                                stflag = true;
                                return Ok(stflag);
                            }
                            catch (Exception ex)
                            {
                                return Ok("no");
                            }
                        }
                    }
                    else
                    {
                        try
                        {
                            var client = new ImapClient();
                            client.Connect(getmailser.ImapAddress, 993, SecureSocketOptions.SslOnConnect);
                            stflag = true;
                            return Ok("truewithoutc");
                        }
                        catch (Exception ex)
                        {
                            return Ok("no");
                        }
                    }
                }
                return Ok(stflag);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save mail login data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Savemaillogindata()
        {
            try
            {
                bool stflag = false;
                var db = new LawPracticeEntities();
                Tbl_MailCredential tx = new Tbl_MailCredential();
                string mailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mailserver"]);
                mailserver = mailserver.ToString().Replace(" ", "+");
                mailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mailserver));
                string servereamil_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["servereamil_value"]);
                string serverpassword_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["serverpassword_value"]);
                string savedornot = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savedornot"]);
                //get  server data
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == mailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    var client = new ImapClient();
                    client.Connect(getserverdata.ImapAddress, 993, true);
                    client.Authenticate(servereamil_value, serverpassword_value);
                    stflag = true;
                }
                if (stflag == true)
                {
                    if (savedornot.ToString() == "1")
                    {
                        tx.MailServerId = Guid.Parse(mailserver);
                        tx.Username = Convert.ToBase64String(QueryAES.EncryptAes(servereamil_value));
                        tx.Password = Convert.ToBase64String(QueryAES.EncryptAes(serverpassword_value));
                        tx.Firmid = LoggedInUser.FirmId;
                        tx.userid = LoggedInUser.UserId;
                        //check mail server exist or not
                        var chkmailserver = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == tx.MailServerId.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (chkmailserver != null)
                        {
                            //check user id and password exist or not on behalf of mail server
                            var chksdate1 = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == tx.MailServerId.ToString() && x.Username == tx.Username && x.Password == tx.Password && x.Firmid == tx.Firmid && x.userid.ToString() == tx.userid.ToString()).FirstOrDefault();
                            if (chksdate1 != null)
                            {
                                return Ok(true);
                            }
                            else
                            {
                                //update crediantials
                                var series = Repository.Matter.Savemaillogindata(tx, chkmailserver.Id.ToString());
                            }
                        }
                        else
                        {
                            //insert crediantials
                            var series = Repository.Matter.Savemaillogindata(tx);
                        }
                        var param = controllername + ">Savemaillogindata>Savemaillogindata>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(true);
                    }
                    else
                    {
                        return Ok();
                    }
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Send Email
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SendEmail()
        {
            try
            {
                bool stflag = false;
                var db = new LawPracticeEntities();
                string sendmailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendmailservername"]);
                sendmailserver = sendmailserver.ToString().Replace(" ", "+");
                sendmailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(sendmailserver));
                string sendservereamil = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendservereamil"]);
                string sendserverpassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendserverpassword"]);
                var client = new MailKit.Net.Smtp.SmtpClient();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == sendmailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    client.Connect(getserverdata.SmtpAddress, Convert.ToInt32(getserverdata.SmtpPort));
                    if (sendservereamil.ToString() == "" && sendserverpassword.ToString() == "")
                    {
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == sendmailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            stflag = true;
                        }
                    }
                    else
                    {
                        client.Authenticate(sendservereamil, sendserverpassword);
                        stflag = true;
                    }
                }
                string emailto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailto"]);
                string emailcc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailcc"]);
                string emailsub = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailsub"]);
                string emailbody = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailbody"]);
                var message = new MimeMessage();
                var bodyBuilder = new BodyBuilder();
                message.From.Add(new MailboxAddress(sendservereamil));
                if (emailto != "")
                {
                    string[] Multipleto = emailto.Split(',');
                    foreach (string multiple_email in Multipleto)
                    {
                        message.To.Add(new MailboxAddress(multiple_email));
                    }
                }
                if (emailcc != "")
                {
                    string[] Multiplecc = emailcc.Split(',');
                    foreach (string multiple_emailcc in Multiplecc)
                    {
                        message.Cc.Add(new MailboxAddress(multiple_emailcc));
                    }
                }
                message.Subject = emailsub;
                bodyBuilder.HtmlBody = emailbody;
                string newfilename = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        newfilename = postedFile.FileName;
                        string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename));
                        string FileName = Path.GetFileName(postedFile.FileName);
                        bodyBuilder.Attachments.Add(FileName, postedFile.InputStream);
                    }
                }
                //from drive
                string newfilename1 = "";
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "EmailSync", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                    if (!String.IsNullOrEmpty(filelist))
                    {
                        string[] values2 = filelist.Split('|');
                        for (int j = 0; j < values2.Length; j++)
                        {
                            //get file physical path
                            values2[j] = values2[j].Trim();
                            string extension = Path.GetExtension(values2[j]);
                            string pathName = Path.GetDirectoryName(values2[j]);
                            newfilename1 = Path.GetFileName(values2[j]);
                            string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename1));
                            string FileName = Path.GetFileName(newfilename1);
                            using (FileStream outputFileStream = new FileStream(values2[j], FileMode.OpenOrCreate))
                            {
                                bodyBuilder.Attachments.Add(FileName, outputFileStream);
                                outputFileStream.Flush();
                                outputFileStream.Dispose();
                                outputFileStream.Close();
                            }
                        }
                    }
                }
                message.Body = bodyBuilder.ToMessageBody();
                if (stflag == true)
                {
                    client.Send(message);
                    client.Disconnect(true);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Reply Send Email
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ReplySendEmail()
        {
            try
            {
                bool stflag = false;
                var db = new LawPracticeEntities();
                string frommail = "";
                string sendmailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendmailservername"]);
                sendmailserver = sendmailserver.ToString().Replace(" ", "+");
                sendmailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(sendmailserver));
                string sendservereamil = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendservereamil"]);
                string sendserverpassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendserverpassword"]);
                string msgid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["msgid"]);
                var client = new MailKit.Net.Smtp.SmtpClient();
                var clientimap = new ImapClient();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == sendmailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    client.Connect(getserverdata.SmtpAddress, Convert.ToInt32(getserverdata.SmtpPort));
                    clientimap.Connect(getserverdata.ImapAddress, 993, true);
                    if (sendservereamil.ToString() == "" && sendserverpassword.ToString() == "")
                    {
                        //get id and password from db
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == sendmailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            clientimap.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            stflag = true;
                            frommail = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username));
                        }
                    }
                    else
                    {
                        client.Authenticate(sendservereamil, sendserverpassword);
                        clientimap.Authenticate(sendservereamil, sendserverpassword);
                        stflag = true;
                        frommail = sendservereamil;
                    }
                }
                string emailto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailto"]);
                string emailcc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailcc"]);
                string emailsub = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailsub"]);
                string emailbody = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailbody"]);
                var message = new MimeMessage();
                var bodyBuilder = new BodyBuilder();
                message.Headers.Add(
            new Header(HeaderId.InReplyTo, msgid));
                message.Headers.Add(
                    new Header(HeaderId.References, msgid));
                message.Subject = emailsub;
                message.From.Add(new MailboxAddress(frommail));
                if (emailto != "")
                {
                    string[] Multipleto = emailto.Split(',');
                    foreach (string multiple_email in Multipleto)
                    {
                        message.To.Add(new MailboxAddress(multiple_email));
                    }
                }
                if (emailcc != "")
                {
                    string[] Multiplecc = emailcc.Split(',');
                    foreach (string multiple_emailcc in Multiplecc)
                    {
                        message.Cc.Add(new MailboxAddress(multiple_emailcc));
                    }
                }
                MimeMessage originammessage = new MimeMessage();
                var folder = clientimap?.Inbox.Open(FolderAccess.ReadOnly);
                var uids = clientimap.Inbox.Search(SearchQuery.HeaderContains("Message-Id", "<" + msgid + ">"));
                foreach (var uid in uids)
                {
                    originammessage = clientimap.Inbox.GetMessage(uid);
                    foreach (MimeEntity att in originammessage.BodyParts)
                    {
                        if (att.ContentType.Name != null)
                        {
                            string attachmentName1 = "/inbox2/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + att.ContentId + "/" + att.ContentType.Name;
                            emailbody = Convert.ToString(emailbody).Replace(attachmentName1, "cid:" + att.ContentId);
                        }
                    }
                }
                bodyBuilder.HtmlBody = emailbody;
                foreach (MimeEntity att in originammessage.BodyParts)
                {
                    if (att.ContentType.Name != null)
                    {
                        var mp1 = ((MimePart)att);
                        using (var memory = new MemoryStream())
                        {
                            mp1.ContentObject.DecodeTo(memory);
                            var buffer = memory.GetBuffer();
                            var length = (int)memory.Length;
                            var base64 = Convert.ToBase64String(buffer, 0, length);
                            var ad = string.Format("base64Content-ID:<{0}>{1}", mp1.ContentId, base64);
                            byte[] result = Convert.FromBase64String(base64);
                            var logo = bodyBuilder.LinkedResources.Add(att.ContentType.Name, result);
                            logo.ContentId = att.ContentId;
                        }
                    }
                }
                string newfilename = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        newfilename = postedFile.FileName;
                        string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename));
                        string FileName = Path.GetFileName(postedFile.FileName);
                        bodyBuilder.Attachments.Add(FileName, postedFile.InputStream);
                    }
                }
                //from drive
                string newfilename1 = "";
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "EmailSync", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                    if (!String.IsNullOrEmpty(filelist))
                    {
                        string[] values2 = filelist.Split('|');
                        for (int j = 0; j < values2.Length; j++)
                        {
                            //get file physical path
                            values2[j] = values2[j].Trim();
                            string extension = Path.GetExtension(values2[j]);
                            string pathName = Path.GetDirectoryName(values2[j]);
                            newfilename1 = Path.GetFileName(values2[j]);
                            string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename1));
                            string FileName = Path.GetFileName(newfilename1);
                            using (FileStream outputFileStream = new FileStream(values2[j], FileMode.OpenOrCreate))
                            {
                                bodyBuilder.Attachments.Add(FileName, outputFileStream);
                                outputFileStream.Flush();
                                outputFileStream.Dispose();
                                outputFileStream.Close();
                            }
                        }
                    }
                }
                message.Body = bodyBuilder.ToMessageBody();
                if (stflag == true)
                {
                    client.Send(message);
                    client.Disconnect(true);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Forward Email
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ForwardSendEmail()
        {
            try
            {
                bool stflag = false;
                var db = new LawPracticeEntities();
                string frommail = "";
                string sendmailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendmailservername"]);
                sendmailserver = sendmailserver.ToString().Replace(" ", "+");
                sendmailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(sendmailserver));
                string sendservereamil = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendservereamil"]);
                string sendserverpassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendserverpassword"]);
                string msgid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["msgid"]);
                string msgtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["msgtype"]);
                string foldername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["folder"]);
                var client = new MailKit.Net.Smtp.SmtpClient();
                var clientimap = new ImapClient();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == sendmailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    client.Connect(getserverdata.SmtpAddress, Convert.ToInt32(getserverdata.SmtpPort));
                    clientimap.Connect(getserverdata.ImapAddress, 993, true);
                    if (sendservereamil.ToString() == "" && sendserverpassword.ToString() == "")
                    {
                        //get id and password from db
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == sendmailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            clientimap.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            stflag = true;
                            frommail = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username));
                        }
                    }
                    else
                    {
                        client.Authenticate(sendservereamil, sendserverpassword);
                        clientimap.Authenticate(sendservereamil, sendserverpassword);
                        stflag = true;
                        frommail = sendservereamil;
                    }
                }
                string emailto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailto"]);
                string emailcc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailcc"]);
                string emailsub = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailsub"]);
                string emailbody = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailbody"]);
                var message = new MimeMessage();
                var bodyBuilder = new BodyBuilder();
                message.Subject = emailsub;
                message.From.Add(new MailboxAddress(frommail));
                if (emailto != "")
                {
                    string[] Multipleto = emailto.Split(',');
                    foreach (string multiple_email in Multipleto)
                    {
                        message.To.Add(new MailboxAddress(multiple_email));
                    }
                }
                if (emailcc != "")
                {
                    string[] Multiplecc = emailcc.Split(',');
                    foreach (string multiple_emailcc in Multiplecc)
                    {
                        message.Cc.Add(new MailboxAddress(multiple_emailcc));
                    }
                }
                MimeMessage originammessage = new MimeMessage();
                if (msgtype.ToString() != "draft")
                {
                    var folder = clientimap?.Inbox.Open(FolderAccess.ReadOnly);
                    var uids = clientimap.Inbox.Search(SearchQuery.HeaderContains("Message-Id", "<" + msgid + ">"));
                    foreach (var uid in uids)
                    {
                        originammessage = clientimap.Inbox.GetMessage(uid);
                        foreach (MimeEntity att in originammessage.BodyParts)
                        {
                            if (att.ContentType.Name != null)
                            {
                                string attachmentName1 = "/inbox2/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + att.ContentId + "/" + att.ContentType.Name;
                                //table.ToString().Replace("cid:"+att1.ContentId, attachmentName1);
                                emailbody = Convert.ToString(emailbody).Replace(attachmentName1, "cid:" + att.ContentId);
                            }
                        }
                    }
                    bodyBuilder.HtmlBody = emailbody;
                    foreach (MimeEntity att in originammessage.BodyParts)
                    {
                        if (att.ContentType.Name != null)
                        {
                            var mp1 = ((MimePart)att);
                            using (var memory = new MemoryStream())
                            {
                                mp1.ContentObject.DecodeTo(memory);
                                var buffer = memory.GetBuffer();
                                var length = (int)memory.Length;
                                var base64 = Convert.ToBase64String(buffer, 0, length);
                                var ad = string.Format("base64Content-ID:<{0}>{1}", mp1.ContentId, base64);
                                byte[] result = Convert.FromBase64String(base64);
                                var logo = bodyBuilder.LinkedResources.Add(att.ContentType.Name, result);
                                logo.ContentId = att.ContentId;
                            }
                        }
                    }
                    foreach (MimeEntity att1 in originammessage.Attachments)
                    {
                        if (att1.IsAttachment)
                        {
                            var mp1 = ((MimePart)att1);
                            using (var memory = new MemoryStream())
                            {
                                mp1.ContentObject.DecodeTo(memory);
                                var buffer = memory.GetBuffer();
                                var length = (int)memory.Length;
                                var base64 = Convert.ToBase64String(buffer, 0, length);
                                var ad = string.Format("base64{0}", base64);
                                byte[] result = Convert.FromBase64String(base64);
                                bodyBuilder.Attachments.Add(att1.ContentType.Name, result);
                            }
                        }
                    }
                }
                else
                {
                    //for drafts
                    var newFolder = clientimap.GetFolder(foldername);
                    newFolder.Open(FolderAccess.ReadWrite);
                    var uids = newFolder.Search(SearchQuery.HeaderContains("Message-Id", "<" + msgid + ">"));
                    foreach (var uid in uids)
                    {
                        originammessage = newFolder.GetMessage(uid);
                        foreach (MimeEntity att in originammessage.BodyParts)
                        {
                            if (att.ContentType.Name != null)
                            {
                                string attachmentName1 = "/inbox2/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + att.ContentId + "/" + att.ContentType.Name;
                                emailbody = Convert.ToString(emailbody).Replace(attachmentName1, "cid:" + att.ContentId);
                            }
                        }
                    }
                    bodyBuilder.HtmlBody = emailbody;
                    foreach (MimeEntity att in originammessage.BodyParts)
                    {
                        if (att.ContentType.Name != null)
                        {
                            var mp1 = ((MimePart)att);
                            using (var memory = new MemoryStream())
                            {
                                mp1.ContentObject.DecodeTo(memory);
                                var buffer = memory.GetBuffer();
                                var length = (int)memory.Length;
                                var base64 = Convert.ToBase64String(buffer, 0, length);
                                var ad = string.Format("base64Content-ID:<{0}>{1}", mp1.ContentId, base64);
                                byte[] result = Convert.FromBase64String(base64);
                                var logo = bodyBuilder.LinkedResources.Add(att.ContentType.Name, result);
                                logo.ContentId = att.ContentId;
                            }
                        }
                    }
                    foreach (MimeEntity att1 in originammessage.Attachments)
                    {
                        if (att1.IsAttachment)
                        {
                            var mp1 = ((MimePart)att1);
                            using (var memory = new MemoryStream())
                            {
                                mp1.ContentObject.DecodeTo(memory);
                                var buffer = memory.GetBuffer();
                                var length = (int)memory.Length;
                                var base64 = Convert.ToBase64String(buffer, 0, length);
                                var ad = string.Format("base64{0}", base64);
                                byte[] result = Convert.FromBase64String(base64);
                                bodyBuilder.Attachments.Add(att1.ContentType.Name, result);
                            }
                        }
                    }
                }
                string newfilename = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        newfilename = postedFile.FileName;
                        string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename));
                        string FileName = Path.GetFileName(postedFile.FileName);
                        bodyBuilder.Attachments.Add(FileName, postedFile.InputStream);
                    }
                }
                //from drive
                string newfilename1 = "";
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "EmailSync", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                    if (!String.IsNullOrEmpty(filelist))
                    {
                        string[] values2 = filelist.Split('|');
                        for (int j = 0; j < values2.Length; j++)
                        {
                            //get file physical path
                            values2[j] = values2[j].Trim();
                            string extension = Path.GetExtension(values2[j]);
                            string pathName = Path.GetDirectoryName(values2[j]);
                            newfilename1 = Path.GetFileName(values2[j]);
                            string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename1));
                            string FileName = Path.GetFileName(newfilename1);
                            using (FileStream outputFileStream = new FileStream(values2[j], FileMode.OpenOrCreate))
                            {
                                bodyBuilder.Attachments.Add(FileName, outputFileStream);
                                outputFileStream.Flush();
                                outputFileStream.Dispose();
                                outputFileStream.Close();
                            }
                        }
                    }
                }
                message.Body = bodyBuilder.ToMessageBody();
                var IsEmailSent = false;
                if (stflag == true)
                {
                    client.Send(message);
                    client.Disconnect(true);
                    IsEmailSent = true;
                }
                //delete from draft
                if (IsEmailSent == true)
                {
                    if (msgtype.ToString() == "draft")
                    {
                        var inbox = clientimap.Inbox;
                        inbox.Open(FolderAccess.ReadWrite);
                        var newFolder = clientimap.GetFolder(foldername);
                        newFolder.Open(FolderAccess.ReadWrite);
                        var uids1 = newFolder.Search(SearchQuery.HeaderContains("Message-Id", "<" + msgid + ">"));
                        foreach (var uid in uids1)
                        {
                            newFolder.AddFlags(new UniqueId[] { uid }, MessageFlags.Deleted, true);
                            newFolder.AddFlags(uid, MessageFlags.Deleted, true);
                            newFolder.Expunge(new UniqueId[] { uid });
                        }
                    }
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load folder Inbox
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadfolderInbox()
        {
            try
            {
                var db = new LawPracticeEntities();
                List<string> my_list = new List<string>();
                string mailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["serverdata"]);
                mailserver = mailserver.ToString().Replace(" ", "+");
                mailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mailserver));
                string servereamil_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emaildata"]);
                string serverpassword_value = QueryAES.UrlDecode(HttpContext.Current.Request.Form["passworddata"]);
                string issaved = QueryAES.UrlDecode(HttpContext.Current.Request.Form["saved"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var param = controllername + ">MailBox>MailBox>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                StringBuilder sc = new StringBuilder();
                StringBuilder sc1 = new StringBuilder();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == mailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    var client = new ImapClient();
                    client.Connect(getserverdata.ImapAddress, 993, true);
                    if (issaved.ToString() == "1")
                    {
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == mailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            client.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                        }
                    }
                    else
                    {
                        client.Authenticate(servereamil_value, serverpassword_value);
                    }
                    var inbox = client.Inbox;
                    inbox.Open(FolderAccess.ReadOnly);
                    // get a folder and append the message into the folder
                    var folders = client.GetFolders(client.PersonalNamespaces[0]);
                    foreach (var data in folders)
                    {
                        int holdfoldersent = data.FullName.ToString().IndexOf("Sent");
                        if (holdfoldersent >= 0)
                        {
                            my_list.Add(data.FullName);
                        }
                        int holdfolderdraft = data.FullName.ToString().IndexOf("Draft");
                        if (holdfolderdraft >= 0)
                        {
                            my_list.Add(data.FullName);
                        }
                    }
                }
                return Ok(my_list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save mail in draft
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveDraft()
        {
            try
            {
                bool stflag = false;
                var db = new LawPracticeEntities();
                string sendmailserver = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendmailservername"]);
                sendmailserver = sendmailserver.ToString().Replace(" ", "+");
                sendmailserver = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(sendmailserver));
                string sendservereamil = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendservereamil"]);
                string sendserverpassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sendserverpassword"]);
                var clientmap = new ImapClient();
                var getserverdata = db.Tbl_mailboxServer.Where(x => x.Id.ToString() == sendmailserver.ToString()).FirstOrDefault();
                if (getserverdata != null)
                {
                    clientmap.Connect(getserverdata.ImapAddress, 993, true);
                    if (sendservereamil.ToString() == "" && sendserverpassword.ToString() == "")
                    {
                        var getidpassfromdb = db.Tbl_MailCredential.Where(x => x.MailServerId.ToString() == sendmailserver.ToString() && x.Firmid == LoggedInUser.FirmId && x.userid == LoggedInUser.UserId).FirstOrDefault();
                        if (getidpassfromdb != null)
                        {
                            clientmap.Authenticate(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Username)), QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getidpassfromdb.Password)));
                            stflag = true;
                        }
                    }
                    else
                    {
                        clientmap.Authenticate(sendservereamil, sendserverpassword);
                        stflag = true;
                    }
                }
                string foldername = "";
                var inbox = clientmap.Inbox;
                inbox.Open(FolderAccess.ReadOnly);
                // get a folder and append the message into the folder
                var folders = clientmap.GetFolders(clientmap.PersonalNamespaces[0]);
                foreach (var data in folders)
                {
                    int holdfolderdraft = data.FullName.ToString().IndexOf("Draft");
                    if (holdfolderdraft >= 0)
                    {
                        foldername = data.FullName;
                        break;
                    }
                }
                string strto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailto"]);
                string strcc = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailcc"]);
                string emailsub = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailsub"]);
                string emailbody = QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailbody"]);
                var list = new InternetAddressList();
                var message = new MimeMessage();
                var bodyBuilder = new BodyBuilder();
                if (strto != "")
                {
                    string[] strArrayto = strto.Split(';');
                    if (strArrayto != null)
                    {
                        list = new InternetAddressList();
                        foreach (string _strTo in strArrayto)
                            list.Add(new MailboxAddress(_strTo));
                        message.To.AddRange(list);
                    }
                }
                if (strcc != "")
                {
                    string[] strArraycc = strcc.Split(';');
                    if (strArraycc != null)
                    {
                        list = new InternetAddressList();
                        foreach (string _strcc in strArraycc)
                            list.Add(new MailboxAddress(_strcc));
                        message.Cc.AddRange(list);
                    }
                }
                message.Subject = emailsub;
                bodyBuilder.HtmlBody = emailbody;
                string newfilename = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        newfilename = postedFile.FileName;
                        string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename));
                        string FileName = Path.GetFileName(postedFile.FileName);
                        bodyBuilder.Attachments.Add(FileName, postedFile.InputStream);
                    }
                }
                //from drive
                string newfilename1 = "";
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "EmailSync", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                    if (!String.IsNullOrEmpty(filelist))
                    {
                        string[] values2 = filelist.Split('|');
                        for (int j = 0; j < values2.Length; j++)
                        {
                            //get file physical path
                            values2[j] = values2[j].Trim();
                            string extension = Path.GetExtension(values2[j]);
                            string pathName = Path.GetDirectoryName(values2[j]);
                            newfilename1 = Path.GetFileName(values2[j]);
                            string fileNameOnly = Path.Combine(pathName, Path.GetFileNameWithoutExtension(newfilename1));
                            string FileName = Path.GetFileName(newfilename1);
                            using (FileStream outputFileStream = new FileStream(values2[j], FileMode.OpenOrCreate))
                            {
                                bodyBuilder.Attachments.Add(FileName, outputFileStream);
                                outputFileStream.Flush();
                                outputFileStream.Dispose();
                                outputFileStream.Close();
                            }
                        }
                    }
                }
                message.Body = bodyBuilder.ToMessageBody();
                if (stflag == true)
                {
                    var draftFolder = clientmap.GetFolder(foldername);
                    if (draftFolder != null)
                    {
                        draftFolder.Open(FolderAccess.ReadWrite);
                        draftFolder.Append(message, MessageFlags.Draft);
                        draftFolder.Expunge();
                    }
                    clientmap.Disconnect(true);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
    }
}