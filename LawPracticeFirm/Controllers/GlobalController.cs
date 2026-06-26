using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using QueryStringEDAES;
using System;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class GlobalController : BaseFirmController
    {
        /// <summary>
        /// Global Search
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Search()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            try
            {
                var db = new LawPracticeEntities();
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                ViewBag.userId = LoggedInUser.UserId;
                ViewBag.firmid = LoggedInUser.FirmId;
                var fid = LoggedInUser.FirmId;
                var uid = LoggedInUser.UserId;
                var Srchvalues = QueryAES.UrlDecode(Request.Form["SeachValues"]);
                ViewBag.GlobalSearchValues = Srchvalues;
                var id = Request.Url.Segments[4];
                string tflag = "";
                var tempid = QueryAES.UrlDecode(Request.Form["token"]);
             
                
                try
                {
                    tempid = tempid.Replace(" ", "+");
                    tempid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(tempid));
                }
                catch (Exception ex)
                {
                }
                tflag = QueryAES.UrlDecode(Request.Form["tflag"]);
                if (tempid == null)
                {
                    if (id != "0")
                    {
                        ViewBag.directoryid = "";
                        return View();
                    }
                    else
                    {
                        //id = id;
                    }
                }
                else
                {
                    if (tempid == "0")
                    {
                        id = "0";
                    }
                    else
                    {
                        id = tempid;
                    }
                }
                string ids = id;
                string folderdirectid = id;
                ViewBag.directoryid = ids;
                ViewBag.DIRECTORYLINK = db.usp_GetKnowledgeDirectoryLink(Guid.Parse(id)).ToList();
            }
            catch (Exception ex)
            {
            }
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = checkroles();
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Check role
        /// </summary>
        /// <returns></returns>
        public string checkroles()
        {
            var urlsegment = Request.Url.Segments[3];
            urlsegment = urlsegment.Replace("/", "");
            var db = new LawPracticeEntities();
            var foutput = true;
            var frmids = Session["sessionfirmid"].ToString();
            var usrids = Session["sessionuserid"].ToString();
            int rlid = Convert.ToInt32(Session["sessionroleid"].ToString());
            var finalresult = "";
            int pageid = 0;
            var sflag = true;
            if (LoggedInUser.RoleId == 2)
            {
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString(urlsegment)).ToList();
                if (pagelist.Count > 0)
                {
                    foreach (var data in pagelist)
                    {
                        int pwrite = 0, pview = 0, pedit = 0, pdel = 0, pviewall = 0, peditall = 0;
                        pageid = Convert.ToInt32(data.ParentPage);
                        pwrite = Convert.ToInt32(data.Write);
                        pview = Convert.ToInt32(data.View);
                        pedit = Convert.ToInt32(data.Edit);
                        pdel = Convert.ToInt32(data.Delete);
                        pviewall = Convert.ToInt32(data.ViewAll);
                        peditall = Convert.ToInt32(data.EditAll);
                        dynamic pageaccesslist;
                        if (urlsegment == "caselist" || urlsegment == "NewCaseDashboard" || urlsegment == "Casedetails" || urlsegment == "EditCase" || urlsegment == "CreateCase")
                        {
                            pageaccesslist = db.usp_GetUserCaseModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        else
                        {
                            pageaccesslist = db.usp_GetUserModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        int write = 0, view = 0, edit = 0, del = 0, viewall = 0, editall = 0, share = 0, enable = 0, export = 0;
                        foreach (var access in pageaccesslist)
                        {
                            write = Convert.ToInt32(access.Write);
                            view = Convert.ToInt32(access.View);
                            edit = Convert.ToInt32(access.Edit);
                            del = Convert.ToInt32(access.Delete);
                            viewall = Convert.ToInt32(access.ViewAll);
                            editall = Convert.ToInt32(access.EditAll);
                            ViewBag.IsViewAll = viewall;
                            ViewBag.share = 0;
                            ViewBag.enable = 0;
                            ViewBag.export = 0;
                            try
                            {
                                ViewBag.share = access.Share;
                                ViewBag.enable = access.Enable;
                                ViewBag.export = access.Export;
                                ViewBag.Create = access.Share;
                            }
                            catch
                            {
                            }
                            if (viewall > 0 || editall > 0)
                            {
                                foutput = false;
                                ViewBag.IsDelete = del;
                                ViewBag.IsCreate = write;
                                ViewBag.IsEdit = edit;
                                if (write == 1)
                                {
                                    foutput = false;
                                }
                                if (pedit == 1)
                                {
                                    if (edit == 1 || editall == 1)
                                    {
                                        foutput = false;
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                            }
                            else
                            {
                                if (sflag == true)
                                {
                                    if (write > 0)
                                    {
                                        ViewBag.IsCreate = write;
                                        if (pwrite == write)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        ViewBag.IsCreate = 0;
                                        foutput = true;
                                    }
                                }
                                if (sflag == true)
                                {
                                    if (view > 0)
                                    {
                                        if (pview == view)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                if (sflag == true)
                                {
                                    if (edit > 0)
                                    {
                                        if (pedit == edit)
                                        {
                                            foutput = false;
                                            sflag = false;
                                            ViewBag.IsEdit = edit;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                ViewBag.IsDelete = 0;
                                if (del > 0)
                                {
                                    ViewBag.IsDelete = 1;
                                }
                                else
                                {
                                    ViewBag.IsDeletes = 0;
                                }
                            }
                        }
                    }
                }
                finalresult = ViewBag.IsCreate + "," + ViewBag.IsEdit + "," + ViewBag.IsDelete + "," + ViewBag.export + "," + ViewBag.share + "," + ViewBag.enable;
            }
            return finalresult.ToString();
        }
    }
}