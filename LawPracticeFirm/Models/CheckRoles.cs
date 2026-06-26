using DataAccess.Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace LawPracticeFirm.Models
{
    public class CheckRoles
    {
        /// <summary>
        /// Find module rights
        /// </summary>
        /// <param name="urlstring"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public static string FindModuleRights(string urlstring, string firmid, string userid, int roleid)
        {
            var ViewBagIsViewAll = 0;
            var ViewBagshare = 0;
            var ViewBagenable = 0;
            var ViewBagexport = 0;
            var ViewBagIsDeletes = 0;
            var ViewBagCreate = 0;
            var ViewBagIsDelete = 0;
            var ViewBagIsCreate = 0;
            var ViewBagIsEdit = 0;
            var urlsegment = urlstring;
            urlsegment = urlsegment.Replace("/", "");
            var db = new LawPracticeEntities();
            var foutput = true;
            var frmids = firmid;
            var usrids = userid;
            int rlid = roleid;
            var finalresult = "";
            int pageid = 0;
            var sflag = true;
            if (roleid == 2)
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
                            ViewBagIsViewAll = viewall;
                            ViewBagshare = 0;
                            ViewBagenable = 0;
                            ViewBagexport = 0;
                            try
                            {
                                ViewBagshare = access.Share;
                                ViewBagenable = access.Enable;
                                ViewBagexport = access.Export;
                                ViewBagCreate = access.Share;
                            }
                            catch
                            {
                            }
                            if (viewall > 0 || editall > 0)
                            {
                                foutput = false;
                                ViewBagIsDelete = del;
                                ViewBagIsCreate = write;
                                ViewBagIsEdit = edit;
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
                                // logic for write(create)
                                if (sflag == true)
                                {
                                    if (write > 0)
                                    {
                                        ViewBagIsCreate = write;
                                        if (pwrite == write)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        ViewBagIsCreate = 0;
                                        foutput = true;
                                    }
                                }
                                //logic for view
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
                                //logic for edit(
                                if (sflag == true)
                                {
                                    if (edit > 0)
                                    {
                                        if (pedit == edit)
                                        {
                                            foutput = false;
                                            sflag = false;
                                            ViewBagIsEdit = edit;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                //logic for delete
                                ViewBagIsDelete = 0;
                                if (del > 0)
                                {
                                    ViewBagIsDelete = 1;
                                }
                                else
                                {
                                    ViewBagIsDeletes = 0;
                                }
                            }
                        }
                    }
                }
                finalresult = ViewBagIsCreate + "," + ViewBagIsEdit + "," + ViewBagIsDelete + "," + ViewBagexport + "," + ViewBagshare + "," + ViewBagenable;
            }
            return finalresult.ToString();
        }
    }
}