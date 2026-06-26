using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Migrations;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using DataAccess.Modals;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LawApiPractice.Controllers
{
    public class MakeFileController : ApiController
    {
        protected bool SaveData(byte[] Data)
        {
            BinaryWriter Writer = null;
            //string Name = @"~/Documents/Calldocuments/sd.docx";
            //string Name = HttpContext.Current.Server.MapPath("~/Documents/Calldocuments/sd1.docx");
            string Name = "D:\\Project\\LawPractice\\LawApiPractice\\Documents\\Calldocuments\\sd3.docx";

            try
            {
                // Create a new stream to write to the file
                Writer = new BinaryWriter(File.OpenWrite(Name));

                // Writer raw data                
                Writer.Write(Data);
                Writer.Flush();
                Writer.Close();
            }
            catch (Exception ex)
            {

                return false;
            }

            return true;
        }



        public class Filename
        {
           public dynamic filename { get; set; }
        }


        [BasicAuthentication]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult makefile([FromBody]JObject paramJObject)
        {

            var request = paramJObject.ToObject<Filename>();
          
            dynamic filename = request.filename;

            var db = new LawPracticeEntities();
            var fname1 = Request.Headers.GetValues("fname").FirstOrDefault();
            byte[] fnames = System.Convert.FromBase64String(fname1);
            var fnamedata = AES.DecryptAes(fnames);
           

            var ftype1 = Request.Headers.GetValues("ftype").FirstOrDefault();
            byte[] ftypes = System.Convert.FromBase64String(ftype1);
            var ftypes1 = AES.DecryptAes(ftypes);
            var ftypedata = Convert.ToInt32(ftypes1);

            var pfile1 = Request.Headers.GetValues("pfile").FirstOrDefault();
            byte[] pfiles = System.Convert.FromBase64String(pfile1);
            var pfiles1 = AES.DecryptAes(pfiles);
            var pfiledata = Convert.ToInt32(pfiles1);

            var firmid = Request.Headers.GetValues("firmid").FirstOrDefault();
            byte[] firmids = System.Convert.FromBase64String(firmid);
            var firmids1 = AES.DecryptAes(firmids);
            var firmiddata = Convert.ToInt32(firmids1);

            var firmuser1 = Request.Headers.GetValues("firmuser").FirstOrDefault();
            byte[] firmusers = System.Convert.FromBase64String(firmuser1);
            var firmusers1 = AES.DecryptAes(firmusers);
            var firmuserdata = Convert.ToInt32(firmusers1);


            var fdetails1 = Request.Headers.GetValues("fdetails").FirstOrDefault();
            byte[] fdetailss = System.Convert.FromBase64String(fdetails1);
            var fdetailsdata = AES.DecryptAes(fdetailss);


            var datetime1 = Request.Headers.GetValues("datetime").FirstOrDefault();
            byte[] datetimes = System.Convert.FromBase64String(datetime1);
            var datetimedata = AES.DecryptAes(datetimes);


            var fileext = Request.Headers.GetValues("fileext").FirstOrDefault();
            byte[] fileexts = System.Convert.FromBase64String(fileext);
            var fileextdata = AES.DecryptAes(fileexts);


            var fpermissison = Request.Headers.GetValues("fpermissison").FirstOrDefault();
            byte[] fpermissisons = System.Convert.FromBase64String(fpermissison);
            var fpermissisondata = AES.DecryptAes(fpermissisons);
            //var fpathdata = "docs\\12";
            //var fpath = HttpContext.Current.Server.MapPath("~/WorkSpace/" + LoggedInUser.FirmId + "/" + dname);
            //string Name = "D:\\Project\\LawPractice\\LawApiPractice\\Documents\\Calldocuments\\sd3.docx";

            var fpath = "";
            string folderdirectid = "";
            string fid = "";
            string uid = "";
            string dirpathname = "";
            var fpathfile = "";
            if (ftypedata.ToString() == "0") // for directory
            {
                if (pfiledata == 0) //create  directory for root
                {
                    fpath = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata + "\\" + fnamedata;
                }
                else // create diretory for non root
                {
                    folderdirectid = pfiledata.ToString();
                    fid = firmiddata.ToString();
                    uid = firmuserdata.ToString();
                    dirpathname = "";
                    var dirfullpath = db.sp_Getfilepaths(Guid.Parse(fid), Guid.Parse(uid), Guid.Parse(folderdirectid)).FirstOrDefault();
                    if (dirfullpath != null)
                    {
                        dirpathname = dirfullpath.ToString();
                        dirfullpath = dirfullpath.Replace("/", "\\");
                        fpath = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata + "\\" + dirfullpath + "\\" + fnamedata;
                    }
                    else
                    {
                        fpath = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata + "\\" + fnamedata;

                    }

                }
            }
            if (ftypedata.ToString() == "1")// for files
            {
                if (pfiledata == 0) //create  file for root
                {
                    fpathfile = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata;
                }
                else // create files for non root
                {
                    folderdirectid = pfiledata.ToString();
                    fid = firmiddata.ToString();
                    uid = firmuserdata.ToString();
                    dirpathname = "";
                    var dirfullpath = db.sp_Getfilepaths(Guid.Parse(fid),Guid.Parse(uid),Guid.Parse(folderdirectid)).FirstOrDefault();
                    if (dirfullpath != null)
                    {
                        dirpathname = dirfullpath.ToString();
                        dirfullpath = dirfullpath.Replace("/", "\\");
                        fpathfile = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata + "\\" + dirfullpath;
                    }
                    else
                    {
                        fpathfile = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata;

                    }

                }
            }
            //var filedatapath = db.ViewFiles.Where(a=>a.Id== pfiledata).Select(s=>new {afname=s.fname}).FirstOrDefault();

          
           
            //// var fpath=  "D:\\ASPLivesites\\LawPracticeNew\\" + fnamedata;
            // fpath = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\"+ firmiddata+"\\"+firmuserdata+"\\"+fnamedata;
            
            //if (filedatapath!=null)
            //{
            //    //fpathfile = "D:\\ASPLivesites\\LawPracticeNew\\" + filedatapath.afname;
            //    //var dirfullpath = 0;
            //    fpathfile = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + firmiddata + "\\" + firmuserdata + "\\" + filedatapath.afname;
            //}
            

            if (ftypedata.ToString() == "1")
            {
               
                    if (!(Directory.Exists(fpathfile)))

                    {

                        Directory.CreateDirectory(fpathfile);



                    }

               

                byte[] rebyte = Convert.FromBase64String(filename);
                    BinaryWriter Writer = null;
                    //string Name = @"~/Documents/Calldocuments/sd.docx";
                    //string Name = HttpContext.Current.Server.MapPath("~/Documents/Calldocuments/sd1.docx");
                    string Name = fpathfile + "\\" + fnamedata;

                    try
                    {
                        // Create a new stream to write to the file
                        Writer = new BinaryWriter(File.OpenWrite(Name));

                        // Writer raw data                
                        Writer.Write(rebyte);
                        Writer.Flush();
                        Writer.Close();
                    }
                    catch (Exception ex)
                    {


                    }
                
            }

            if(ftypedata.ToString() == "0")
            {
                if (!(Directory.Exists(fpath)))

                {

                    Directory.CreateDirectory(fpath);

                    

                }
            }

            if (ftypedata.ToString() == "0")
            {
                var fname = fnamedata;
                var ftype = ftypedata;
                var pfile = pfiledata;
                var firmId = firmiddata;
                var firmuser = firmuserdata;
                var fdetails = fdetailsdata;
                var filetype = fileextdata;
                var fpermission = fpermissisondata;
                DateTime datetime = System.DateTime.Now;
                int id = 0;
                ObjectParameter IDParameter;
                IDParameter = new ObjectParameter("id", id);

                var insertdata = db.MakeFilesApi(fname, ftype, pfile.ToString(), firmId.ToString(), firmuser.ToString(), fdetails, filetype, fpermission, datetime, IDParameter);
                id = Convert.ToInt32(IDParameter.Value);
                return Ok(id);
            }
            else
            {
               
              var  fname = fnamedata;
                var ftype = ftypedata;
                var pfile = pfiledata;
                var firmId = firmiddata;
                var firmuser = firmuserdata;
                var fdetails = fdetailsdata;
                var filetype = fileextdata;
                var fpermission = fpermissisondata;
                 DateTime datetime = System.DateTime.Now;
                int id=0;
                ObjectParameter IDParameter;
                IDParameter = new ObjectParameter("id", id);
                
                var insertdata = db.MakeFilesApi(fname,ftype,pfile.ToString(), firmId.ToString(), firmuser.ToString(),fdetails,filetype,fpermission,datetime, IDParameter);
                id = Convert.ToInt32(IDParameter.Value);
                return Ok(id);
            }

            
        }

        }
    }
