using DataAccess.Modals;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.SessionState;

namespace LawPracticeFirm
{
    /// <summary>
    /// Summary description for DownloadFile
    /// </summary>
    public class DownloadFile : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string firmid = "";
            string userid = "";
            string filepath = "";
            string moduletype = "";
            string file_name = "";
            string ocrdocname = "";
            string ftoken = "";
            string title = "";
            string ftype = "";
            string fid = "";
            string atoken = "";
            string workingfolder = "WorkSpace";
          
            firmid = Convert.ToString(context.Session["sessionfirmid"]);
            userid = Convert.ToString(context.Session["sessionuserid"]);
            // get the file name from the querystring
            //if (context.Request.QueryString["firmid"] != null)
            //{
            //    firmid = context.Request.QueryString["firmid"].ToString();
            //}
            //if (context.Request.QueryString["userid"] != null)
            //{
            //    userid = context.Request.QueryString["userid"].ToString();
            //}


            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["fld"])))
            {
                workingfolder = Convert.ToString(QueryAES.UrlDecode(context.Request.QueryString["fld"])) == "m" ? "LawPractice_ds" : "WorkSpace";
            }

            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["filepath"])))
            {
                filepath = QueryAES.UrlDecode(context.Request.QueryString["filepath"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["filename"])))
            {
                file_name = QueryAES.UrlDecode(context.Request.QueryString["filename"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["ocrdocname"])))
            {
                ocrdocname = QueryAES.UrlDecode(context.Request.QueryString["ocrdocname"]).ToString();
            }

            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["ftoken"])))
            {
                ftoken = QueryAES.UrlDecode(context.Request.QueryString["ftoken"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["module"])))
            {
                moduletype = QueryAES.UrlDecode(context.Request.QueryString["module"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["title"])))
            {
                title = QueryAES.UrlDecode(context.Request.QueryString["title"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["ftype"])))
            {
                ftype = QueryAES.UrlDecode(context.Request.QueryString["ftype"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["fid"])))
            {
                fid = QueryAES.UrlDecode(context.Request.QueryString["fid"]).ToString();
            }
            if (!string.IsNullOrEmpty(QueryAES.UrlDecode(context.Request.QueryString["atoken"])))
            {
                atoken = QueryAES.UrlDecode(context.Request.QueryString["atoken"]).ToString();
            }

            string crtid = "";
            var db = new LawPracticeEntities();
            //string caseyr = db.sp_GetCourtYearlawPractice(crtid).FirstOrDefault().ToString();
            //var clist = (from ob in caseyr select new { caseyear = caseyr }).Distinct().OrderBy(x => x.caseyear).ToList();


            if (firmid != "" && userid != "" && file_name != "" && ftoken != "")
            {
                var downloadpath1 = "";
                var downloadpath2 = "";


                var userids = db.ViewFiles.Where(x => x.Id.ToString() == ftoken.ToString()).FirstOrDefault();
                if(userids!=null)
                {
                    userid = userids.Firmuser.ToString();
                }

                
          
                downloadpath1 = "/LawPractice_ds/" + firmid + "/" + userid + "/" + filepath + "/" + file_name;
                downloadpath2 = "/LawPractice_ds/" + firmid + "/" + userid + "/" + filepath + "/";



                string filenametemp = context.Server.MapPath(downloadpath1);

                var checkfileexist =System.IO.File.Exists(filenametemp);
                if(checkfileexist==true)
                {
                    downloadpath1 = "/LawPractice_ds/" + firmid + "/" + userid + "/" + filepath + "/" + file_name;
                    downloadpath2 = "/LawPractice_ds/" + firmid + "/" + userid + "/" + filepath + "/";
                }
                else
                {
                    downloadpath1 = "/WorkSpace/" + firmid + "/" + userid + "/" + filepath + "/" + file_name;
                    downloadpath2 = "/WorkSpace/" + firmid + "/" + userid + "/" + filepath + "/";
                }

                string tempflname = file_name; //filename
                //tempflname = "E2bdADS_" + ftoken;
                // tempflname = tempflname.Remove(0, 8);
                tempflname = "_D2bdADS__" + file_name;

                string input = context.Server.MapPath(downloadpath1);
                string output = context.Server.MapPath(downloadpath2 + tempflname);
                try
                {
                    QueryAES.FileDecrypt(input, output);
                    
                }
                catch (Exception err)
                {
                    
                }


                
                //string filename = context.Server.MapPath(output);
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
                string   dfilename = fileInfo.Name.ToString().Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {//delete file
                    System.IO.File.Delete(output);
                    context.Response.End();
                }
            }


            if (moduletype == "module") //single file
            {
                var downloadpath1 = "";
                ftoken = ftoken.ToString().Replace(" ", "+");
                downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                string filename = context.Server.MapPath(downloadpath1);
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);

                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileInfo.Name + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    context.Response.End();
                }
            }

            if (moduletype == "caseorder") //single file
            {
                var downloadpath1 = "";
                ftoken = ftoken.ToString().Replace(" ", "+");
                downloadpath1 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ftoken));
                //var path = System.Configuration.ConfigurationManager.AppSettings["Casedetailspath"];
                //downloadpath1 = path + downloadpath1;
                //string somestring;
                //try
                //{
                //    WebClient wc = new WebClient();
                //    somestring = wc.DownloadString("https://codeproject.global.ssl.fastly.net/App_Themes/CodeProject/Img/logo250x135.gif");
                //}
                //catch (WebException we)
                //{
                //    // add some kind of error processing
                //    //MessageBox.Show(we.ToString());
                //}
                try
                {
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    string url = downloadpath1;
                    byte[] bytes = webClient.DownloadData(url);
                    string fileName = url.Split('/').Last();
                    // string fileName = (url.Split('/')[url.Split('/').Length - 1]).Split('.')[0];
                    context.Response.ContentType = "application/octet-stream";
                    context.Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                    context.Response.BinaryWrite(bytes);
                    context.Response.End();
                }
                catch { }
                //Console.WriteLine("\nDownloaded file saved in the following file system folder:\n\t" + Application.StartupPath);
                //string filename = context.Server.MapPath(downloadpath1);
                //System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);

                //try
                //{
                //    if (fileInfo.Exists)
                //    {
                //        context.Response.Clear();
                //        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileInfo.Name + "\"");
                //        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                //        context.Response.ContentType = "application/octet-stream";
                //        context.Response.TransmitFile(fileInfo.FullName);
                //        context.Response.Flush();
                //    }
                //    else
                //    {
                //        throw new Exception("File not found");
                //    }
                //}
                //catch (Exception ex)
                //{
                //    context.Response.ContentType = "text/plain";
                //    context.Response.Write(ex.Message);
                //}
                //finally
                //{
                //    context.Response.End();
                //}
            }
            if (moduletype == "caseorderunlink") //single file unlnink
            {
                var downloadpath1 = "";
                ftoken = ftoken.ToString().Replace(" ", "+");
                ftoken = ftoken.ToString().Replace(" ", "+");
                downloadpath1 = QueryAES.DecryptStringAES(ftoken);

                var path = System.Configuration.ConfigurationManager.AppSettings["Casedetailspath"];
                downloadpath1 = path + downloadpath1;
                //string somestring;
                //try
                //{
                //    WebClient wc = new WebClient();
                //    somestring = wc.DownloadString("https://codeproject.global.ssl.fastly.net/App_Themes/CodeProject/Img/logo250x135.gif");
                //}
                //catch (WebException we)
                //{
                //    // add some kind of error processing
                //    //MessageBox.Show(we.ToString());
                //}
                try
                {
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    string url = downloadpath1;
                    byte[] bytes = webClient.DownloadData(url);
                    string fileName = url.Split('/').Last();
                    // string fileName = (url.Split('/')[url.Split('/').Length - 1]).Split('.')[0];
                    context.Response.ContentType = "application/octet-stream";
                    context.Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                    context.Response.BinaryWrite(bytes);
                    context.Response.End();
                }
                catch { }
                //Console.WriteLine("\nDownloaded file saved in the following file system folder:\n\t" + Application.StartupPath);
                //string filename = context.Server.MapPath(downloadpath1);
                //System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);

                //try
                //{
                //    if (fileInfo.Exists)
                //    {
                //        context.Response.Clear();
                //        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileInfo.Name + "\"");
                //        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                //        context.Response.ContentType = "application/octet-stream";
                //        context.Response.TransmitFile(fileInfo.FullName);
                //        context.Response.Flush();
                //    }
                //    else
                //    {
                //        throw new Exception("File not found");
                //    }
                //}
                //catch (Exception ex)
                //{
                //    context.Response.ContentType = "text/plain";
                //    context.Response.Write(ex.Message);
                //}
                //finally
                //{
                //    context.Response.End();
                //}
            }

            if (moduletype == "module1")  //multile upload files encryptedname message module
            {
                var downloadpath1 = "";
                ftoken = ftoken.ToString().Replace(" ", "+");
                downloadpath1 = QueryAES.DecryptStringAES(ftoken);

                string filename = context.Server.MapPath(downloadpath1);
                string input = filename;
                string dir = System.IO.Path.GetDirectoryName(downloadpath1);
                string fname = System.IO.Path.GetFileName(downloadpath1);
                fname = "_D2bdADS__" + fname;
              //  string sownloadpath2= downloadpath1.Split('\\').Last();
                string output = context.Server.MapPath(dir +'\\'+ fname);
                try
                {
                    QueryAES.FileDecrypt(input, output);
                    
                }
                catch(Exception es)
                {

                }
                var downloadpathnew = downloadpath1.Remove(downloadpath1.LastIndexOf('/') + 1);
                downloadpathnew = downloadpathnew.TrimStart('/').TrimEnd('/');
                var newfilename = downloadpath1.Split('/').Last();

               // string filename = context.Server.MapPath(downloadpath1);
                string tempfilename = System.IO.Path.GetFileName(filename);

               string  downloadpath2 = System.IO.Path.GetDirectoryName(filename);
                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + downloadpathnew);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + downloadpathnew);


                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }

                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, newfilename, fakepathin, fakepathout, firmid, userid);




                System.IO.FileInfo fileInfo = new System.IO.FileInfo(outputs);
                var dfilename = fileInfo.Name;
                //var filepathnew = "Documents/Messagedocuments";
                //var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                //if (userids != null)
                //{
                //    userid = userids.userid.ToString();
                //}
                //downloadpath1 = "/" + filepathnew + "/" + firmid + "/" + userid + "/" + ftoken;
                //string   string1 = dfilename.ToString().Split('.')[0];
                //string   string2 =dfilename.ToString().Split('.')[1];

                // string1 = string1.Substring(0, string1.Length - 10);
                //dfilename = string1 + "." + string2;

                int idx = dfilename.LastIndexOf('.');



                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;
                //dfilename = dfilename.Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(output);
                    context.Response.End();
                }
            }
            if (moduletype == "modulereplynotice")  
            {
                var downloadpath1 = "";

                //ftoken = ftoken.ToString().Replace(" ", "+");
                // downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                downloadpath1 = ftoken;
                string tempfilename = "_D2bdADS__" + downloadpath1;
                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
               // atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getnoticedata = db.Usp_getReplyNoticeFileDetails(firmid,userid,ftoken,fid.ToString()).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + getnoticedata.UserId);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + getnoticedata.UserId);

                    downloadpathnew = "Documents/Noticedocuments" + "/" + firmid + "/" + getnoticedata.UserId;
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                }





                var filename = downloadpath1;

                // string filename = context.Server.MapPath(downloadpath1);
                tempfilename = System.IO.Path.GetFileName(filename);

                string downloadpath2 = System.IO.Path.GetFileName(filename);


                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, downloadpath2, fullpath, fullpath2, firmid, userid);





                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;


                int idx = dfilename.LastIndexOf('.');



                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;
                //dfilename = dfilename.Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }
            if (moduletype == "modulenotice")  //multile upload files encryptedname
            {
                var downloadpath1 = "";

                //ftoken = ftoken.ToString().Replace(" ", "+");
                // downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                downloadpath1 = ftoken;
                string tempfilename = "_D2bdADS__" + downloadpath1;
                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                // atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getnoticedata = db.Usp_getNoticeFileDetails(firmid, userid, ftoken, fid.ToString()).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + getnoticedata.UserId);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + getnoticedata.UserId);

                    downloadpathnew = "Documents/Noticedocuments" + "/" + firmid + "/" + getnoticedata.UserId;
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                }





                var filename = downloadpath1;

                // string filename = context.Server.MapPath(downloadpath1);
                tempfilename = System.IO.Path.GetFileName(filename);

                string downloadpath2 = System.IO.Path.GetFileName(filename);


                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, downloadpath2, fullpath, fullpath2, firmid, userid);





                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;


                int idx = dfilename.LastIndexOf('.');



                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;
                //dfilename = dfilename.Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }
            if (moduletype == "modulecasealert")  //multile upload files encryptedname
            {
                var downloadpath1 = "";
               
                ftoken = ftoken.ToString().Replace(" ", "+");
                downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                string tempfilename = "_D2bdADS__" + downloadpath1;
                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getfirmidalert = db.Tbl_CaseAlertSetting.Where(x => x.Firmid.ToString() == firmid.ToString() && x.Id.ToString() == atoken.ToString()).FirstOrDefault();
                if (getfirmidalert != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/Documents/CaseEventAlert/" + firmid+ "/" + getfirmidalert.Userid+ "/"+ downloadpath1);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/Documents/CaseEventAlert/" + firmid + "/" + getfirmidalert.Userid + "/" + tempfilename);
                   
                          downloadpathnew = "Documents/CaseEventAlert" + "/" + firmid + "/" + getfirmidalert.Userid;
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                }





                var filename = downloadpath1;

                // string filename = context.Server.MapPath(downloadpath1);
                 tempfilename = System.IO.Path.GetFileName(filename);

                string downloadpath2 = System.IO.Path.GetFileName(filename);


                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, downloadpath2, fullpath, fullpath2, firmid, userid);





                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;
               

                int idx = dfilename.LastIndexOf('.');



                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;
                //dfilename = dfilename.Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }


            if (moduletype == "modulek")  //knowledge
            {
                var fstatusk = true;
                var downloadpath1 = "";
                var downloadpath2 = "";
              
                var downloadpathnew = "";
                downloadpath1 = ftoken;

                if (!String.IsNullOrEmpty(downloadpath1))
                {



                    var getknowdetails = db.usp_CheckfolderKnowledge(firmid, downloadpath1).FirstOrDefault();
                    if(getknowdetails.pfile.ToString()==Guid.Empty.ToString())
                    {
                        downloadpathnew = "Documents/Knowledge/" + getknowdetails.Firmid + "/" + getknowdetails.firmuser;
                    }
                    else
                    {
                        var dirfullpath = db.sp_Getknowfilepaths(Guid.Parse(getknowdetails.Firmid.ToString()), Guid.Parse(getknowdetails.firmuser.ToString()), Guid.Parse(getknowdetails.pfile.ToString())).FirstOrDefault();
                        string dirpathname = dirfullpath.ToString();


                        downloadpathnew = "Documents/Knowledge/" + getknowdetails.Firmid + "/" + getknowdetails.firmuser + "/" + dirpathname;
                    }
                   


                }
                

              


                
                downloadpathnew = downloadpathnew.TrimStart('/').TrimEnd('/');

                
                

                string filename = context.Server.MapPath(downloadpath1);
                string tempfilename = System.IO.Path.GetFileName(filename);

                downloadpath2=System.IO.Path.GetDirectoryName(filename);

               // tempfilename = "_D2bdADS__" + tempfilename;
                //string input = context.Server.MapPath(downloadpathnew);
                //string output = downloadpath2;
                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + downloadpathnew);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + downloadpathnew);
               

                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }

                var outputs =AzureDocumentself.Dirfilepath(downloadpathnew, title, fakepathin, fakepathout, firmid,userid);
                //try
                //{
                //    QueryAES.FileDecrypt(input, output);
                //    fstatusk = true;
                //}
                //catch(Exception er)
                //{
                //    fstatusk = false;
                //}


                if (fstatusk == true)
                {

                    System.IO.FileInfo fileInfo = new System.IO.FileInfo(outputs);
                    var dfilename = fileInfo.Name;

                    int idx = dfilename.LastIndexOf('.');

                    string string1 = dfilename.Substring(0, idx);
                    string string2 = dfilename.Substring(idx + 1);

                    string1 = string1.Substring(0, string1.Length - 10);
                    dfilename = string1 + "." + string2;
                    //dfilename = dfilename.Remove(0, 10);


                    try
                    {
                        string notification = "You have Downloaded the Document ("+ dfilename + ") in knowledge";
                        db.usp_AddActivity(firmid, userid, notification, "Download Document", null, Guid.Empty.ToString());

                    }
                    catch
                    {

                    }
                    try
                    {
                        if (fileInfo.Exists)
                        {
                            context.Response.Clear();
                            context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                            context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                            context.Response.ContentType = "application/octet-stream";
                            context.Response.TransmitFile(fileInfo.FullName);
                            context.Response.Flush();
                        }
                        else
                        {
                            throw new Exception("File not found");
                        }
                    }
                    catch (Exception ex)
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write(ex.Message);
                    }
                    finally
                    {
                        System.IO.File.Delete(outputs);
                        context.Response.End();
                    }
                }
                else
                {
                    System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                    var dfilename = fileInfo.Name;

                    //int idx = dfilename.LastIndexOf('.');

                    //string string1 = dfilename.Substring(0, idx);
                    //string string2 = dfilename.Substring(idx + 1);

                    //string1 = string1.Substring(0, string1.Length - 10);
                    //dfilename = string1 + "." + string2;

                    // dfilename = dfilename.Remove(0, 10);
                    try
                    {
                        if (fileInfo.Exists)
                        {
                            context.Response.Clear();
                            context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                            context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                            context.Response.ContentType = "application/octet-stream";
                            context.Response.TransmitFile(fileInfo.FullName);
                            context.Response.Flush();
                        }
                        else
                        {
                            throw new Exception("File not found");
                        }
                    }
                    catch (Exception ex)
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write(ex.Message);
                    }
                    finally
                    {

                        context.Response.End();
                    }
                }
            }


            if (moduletype == "multiple")  //multile upload files 
            {
                var downloadpath1 = "";
                var downloadpath2 = "";
                fid = fid.ToString().Replace(" ", "+");
                //fid = QueryAES.DecryptStringAES(fid);

                if (ftype == "event")
                {
                    var eventpath = "Documents/Eventdocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }

                if (ftype == "note")
                {
                    var eventpath = "Documents/Notedocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }

 
                


                if (ftype == "call")
                {
                    var eventpath = "Documents/Calldocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }

                if (ftype == "Lead")
                {
                    var eventpath = "Documents/Leaddocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }

                if (ftype == "customform")
                {
                    var eventpath = "Documents/CustomFormdocuments";
                    var userids = db.SaveCustomFieldDatas.Where(x => x.cid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.Userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }
                if (ftype == "customactivity")
                {
                    var eventpath = "Documents/CustomActivitydocuments";
                    var userids = db.SaveCustomActivityDatas.Where(x => x.Userid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.Userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;
                }
                if (ftype == "case")
                {
                    var eventpath = "Documents/MatterDocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }
                if (ftype == "communique")
                {
                    var eventpath = "Documents/CaseCommunique";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }

                if (ftype == "replycommunique")
                {
                    var eventpath = "Documents/CaseCommunique";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }
                if (ftype == "Expense")
                {
                    var eventpath = "Documents/Expensedocuments";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }
                if (ftype == "TimeEntry")
                {
                    var eventpath = "Documents/TimeEntry";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }
                if (ftype == "task")
                {
                    var eventpath = "Documents/CaseTask";


                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString() && x.filedocs.ToString() == ftoken.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;

                }
                if (ftype == "completetask")
                {
                    var eventpath = "Documents/CaseTask";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString() && x.filedocs.ToString()==ftoken.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }
                if (ftype == "overduecompletetask")
                {
                    var eventpath = "Documents/CaseTask";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString() && x.filedocs.ToString() == ftoken.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }


                if (ftype == "BulkNoticeExcelDocument")
                {
                    var eventpath = "Documents/BulkNoticeExcelDocument";
                    var userids = db.MultipleFileMaps.Where(x => x.rowid.ToString() == fid.ToString() && x.filedocs.ToString() == ftoken.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                    downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                    downloadpath2 = ftoken;



                }





                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + downloadpath1);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + downloadpath1);


                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }

                var outputs = AzureDocumentself.Dirfilepath(downloadpath1, downloadpath2, fakepathin, fakepathout, firmid, userid);





                System.IO.FileInfo fileInfo = new System.IO.FileInfo(outputs);
                var dfilename = fileInfo.Name;

                int idx = dfilename.LastIndexOf('.');

                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;
                //dfilename = dfilename.Remove(0, 10);

                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }




            }

            if (moduletype == "ocr")  //multile upload files 
            {
                var downloadpath1 = "";
                var downloadpath2 = "";

                ftoken = ftoken.ToString().Replace(" ", "+");
              
                ftoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ftoken.ToString()));
                ocrdocname = ocrdocname.ToString().Replace(" ", "+");
                ocrdocname = QueryAES.DecryptStringAES(ocrdocname);

              
                    var eventpath = "Documents/OcrDocuments";
                    var userids = db.Tbl_OcrFile.Where(x => x.Id.ToString() == ftoken.ToString()).FirstOrDefault();
                    if (userids != null)
                    {
                        userid = userids.userid.ToString();
                    }
                downloadpath1 = eventpath + "/" + firmid + "/" + userid;
                downloadpath2 = ocrdocname;

                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + downloadpath1);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + downloadpath1);


                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }

                var outputs = AzureDocumentself.Dirfilepath(downloadpath1, downloadpath2, fakepathin, fakepathout, firmid, userid);





                string filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;

               // dfilename = dfilename.Remove(0, 10);
                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }

            if (moduletype == "chat")  //multile upload files 
            {

                if (!string.IsNullOrEmpty(context.Request.QueryString["userid"]))
                {
                    userid = context.Request.QueryString["userid"].ToString();
                }
                if (!string.IsNullOrEmpty(context.Request.QueryString["firmid"]))
                {
                    firmid = context.Request.QueryString["firmid"].ToString();
                }


              
                if (!string.IsNullOrEmpty(context.Request.QueryString["fnm"]))
                {
                    file_name = context.Request.QueryString["fnm"].ToString();
                }

                firmid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(firmid.Replace(" ", "+")));
                userid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userid.Replace(" ", "+")));


                string fakepathin = WebConfigurationManager.AppSettings["chatfilepath"] + firmid + "\\" + userid;
                // string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + downloadpath1);
                // string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + downloadpath1);

                //  var outputs = AzureDocument.Dirfilepath(downloadpath2, filename, fakepathin, "", firmid, userid);
                // var outputs = fakepathin + "/temp/" + file_name;

                // System.IO.File.Copy(fakepathin + "/"+ file_name, outputs);

                var outputs = fakepathin + "\\" + file_name;

                System.IO.FileInfo fileInfo = new System.IO.FileInfo(outputs);
                var dfilename = fileInfo.Name;


                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    // System.IO.File.Delete(outputs);
                    context.Response.End();
                }




            }
            if (moduletype == "EsignDocument")  //multile upload files 
            {
                string unique_id = "";


                if (!string.IsNullOrEmpty(context.Request.QueryString["id"]))
                {
                    unique_id = context.Request.QueryString["id"].ToString();
                }
                if (!string.IsNullOrEmpty(context.Request.QueryString["userid"]))
                {
                    userid = context.Request.QueryString["userid"].ToString();
                }
                if (!string.IsNullOrEmpty(context.Request.QueryString["firmid"]))
                {
                    firmid = context.Request.QueryString["firmid"].ToString();
                }


                var documentid = "";
                if (!string.IsNullOrEmpty(context.Request.QueryString["docid"]))
                {
                    documentid = context.Request.QueryString["docid"].ToString();
                }
                List<get_digital_signature_value_Result> list_data = new List<get_digital_signature_value_Result>();

                list_data = db.get_digital_signature_value(unique_id, "", "", firmid).ToList();

                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + userid);
                var azurepath = list_data[0].FilePath;
                var filename = list_data[0].FileName;
                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                var outputs1 = AzureDocumentself.Dirfilepathwithoutdecrypt(azurepath, filename, fakepathin, firmid, userid);





                System.IO.FileInfo fileInfo = new System.IO.FileInfo(outputs1);
                var dfilename = fileInfo.Name;

                int idx = dfilename.LastIndexOf('.');

                string string1 = dfilename.Substring(0, idx);
                string string2 = dfilename.Substring(idx + 1);

                string1 = string1.Substring(0, string1.Length - 10);
                dfilename = string1 + "." + string2;


                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    // System.IO.File.Delete(outputs);
                    context.Response.End();
                }




            }

            if (moduletype == "NoticeManagement")  //multile upload files encryptedname
            {
                var downloadpath1 = "";

                //ftoken = ftoken.ToString().Replace(" ", "+");
                // downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                downloadpath1 = ftoken;
              
                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                var filename = "";
                // atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getnoticedata = db.usp_GetNoticeFileDetailsById(firmid, userid, ftype, fid.ToString()).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + userid);

                   
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                    downloadpathnew = getnoticedata.AZureFileId;
                    filename = getnoticedata.fname;
                }

                

                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, filename, fullpath, fullpath2, firmid, userid);

                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;


                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }
            if (moduletype == "BulkDraftNotice")  //multile upload files encryptedname
            {
                var downloadpath1 = "";

                //ftoken = ftoken.ToString().Replace(" ", "+");
                // downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                downloadpath1 = ftoken;

                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                var filename = "";
                // atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getnoticedata = db.sp_checknoticepathexist(downloadpath1,null).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + userid);


                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                
                    downloadpathnew = getnoticedata.TrimEnd('/').Remove(getnoticedata.LastIndexOf('/') + 1).TrimEnd('/').TrimStart('/');
                    filename = getnoticedata.TrimEnd('/').Substring(getnoticedata.LastIndexOf('/') + 1);
                }



                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, filename, fullpath, fullpath2, firmid, userid);

                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;


                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }
            if (moduletype == "DraftNotice")  //multile upload files encryptedname
            {
                var downloadpath1 = "";

                //ftoken = ftoken.ToString().Replace(" ", "+");
                // downloadpath1 = QueryAES.DecryptStringAES(ftoken);
                downloadpath1 = ftoken;

                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                var filename = "";
                //atoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(atoken.ToString().Replace(" ", "+")));
                var getnoticedata = db.usp_GetDraftNoticeById(firmid,userid, downloadpath1).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/azuredirout/" + firmid + "/" + userid);


                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }

                    downloadpathnew = getnoticedata.Filepath.TrimEnd('/').Remove(getnoticedata.Filepath.LastIndexOf('/') + 1).TrimEnd('/').TrimStart('/');
                    filename = getnoticedata.Filepath.TrimEnd('/').Substring(getnoticedata.Filepath.LastIndexOf('/') + 1);
                }



                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, filename, fullpath, fullpath2, firmid, userid);

                filename = outputs;
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(filename);
                var dfilename = fileInfo.Name;


                try
                {
                    if (fileInfo.Exists)
                    {
                        context.Response.Clear();
                        context.Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.Charset = Encoding.UTF8.WebName;
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                    else
                    {
                        throw new Exception("File not found");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(ex.Message);
                }
                finally
                {
                    System.IO.File.Delete(outputs);
                    context.Response.End();
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}