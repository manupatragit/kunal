using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.ModelBinding;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using Newtonsoft.Json;
using CustomField = BussinessLogic.BusinessEntity.CustomField;
#pragma warning disable CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
using DataAccess.PocoRepositories;
#pragma warning restore CS0105 // The using directive for 'DataAccess.PocoRepositories' appeared previously in this namespace
#pragma warning disable CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
using System.Data.Entity;
#pragma warning restore CS0105 // The using directive for 'System.Data.Entity' appeared previously in this namespace
using QueryStringEDAES;

namespace BussinessLogic.BusinessRepository
{
    public class LeadBusinessRepository : ILeadBusinessRepository
    {
        /// <summary>
        /// Create lead by details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="ftype"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>
        public void createlead(LeadList ml, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            var db = new LawPracticeEntities();
            LeadList cf = new LeadList();
            ColMap cm = new ColMap();
            MultipleFileMap mf = new MultipleFileMap();
           
            cf.Firmid = ml.Firmid;
            cf.firmuser = ml.firmuser;
            if(ml.lddocs!="")
            {
                cf.lddocs = "1";
            }
         

            cf.ldname = ml.ldname;
            cf.ldcperson = ml.ldcperson;
            cf.ldorg = ml.ldorg;
            cf.lddesign = ml.lddesign;
            cf.ldadd = ml.ldadd;
            cf.ldcountry = ml.ldcountry;
            cf.ldstate = ml.ldstate;
            cf.ldcity = ml.ldcity;
            cf.ldfax = ml.ldfax;
            cf.ldemail = ml.ldemail;
            cf.ldpin = ml.ldpin;
            cf.ldphn = ml.ldphn;
            cf.ldmob = ml.ldmob;
            cf.ldctype = ml.ldctype;
            cf.ldcategory = ml.ldcategory;
            cf.ldsource = ml.ldsource;
            cf.ldltype = ml.ldltype;
            cf.ldplan = ml.ldplan;
            cf.ldec = ml.ldec;
            cf.ldinfo = ml.ldinfo;

           


            cf.date_time = DateTime.Now;
            cf.col1 = ml.col1;
            cf.col2 = ml.col2;
            cf.col3 = ml.col3;
            cf.col4 = ml.col4;
            cf.col5 = ml.col5;
            cf.col6 = ml.col6;
            cf.col7 = ml.col7;
            cf.col8 = ml.col8;
            cf.col9 = ml.col9;
            cf.col10 = ml.col10;
            cf.col11 = ml.col11;
            cf.col12 = ml.col12;
            cf.col13 = ml.col13;
            cf.col14 = ml.col14;
            cf.col15 = ml.col15;
            db.LeadLists.Add(cf);
            db.SaveChanges();
            //save in filemap table
            if (ml.lddocs != "")
            {
                string s = ml.lddocs;
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();

                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = cf.lid;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "Lead";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }
           
            
            //save in maptable

            for (int i = 1; i <= sum; i++)
            {

                cm.pid = cf.lid;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                }



                //cm.txt2 = ctxt2;
                //cm.ftype = ftype;
                cm.Firmid = ml.Firmid;
                cm.formid = Convert.ToInt32(ftype);
               
                db.ColMaps.Add(cm);
                db.SaveChanges();
            }


            tbl_notification tn = new tbl_notification();
        
            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.firmuser;
            tn.auser = Guid.Parse(ml.firmuser.ToString());
            tn.ntype = "Lead";
            tn.status = 1;

         
            tn.urllink = "/Firm/LeadSingleView/" + cf.lid;
          

            

            tn.notification = "You have new Lead";
            tn.typeid = cf.lid;
            db.tbl_notification.Add(tn);
            db.SaveChanges();

        }

        /// <summary>
        /// Update lead details
        /// </summary>
        /// <param name="ml"></param>
        /// <param name="firmid"></param>
        /// <param name="ftype"></param>
        /// <param name="sum"></param>
        /// <param name="ctxt1"></param>
        /// <param name="ctxt2"></param>
        /// <param name="ctxt3"></param>
        /// <param name="ctxt4"></param>
        /// <param name="ctxt5"></param>
        /// <param name="ctxt6"></param>
        /// <param name="ctxt7"></param>
        /// <param name="ctxt8"></param>
        /// <param name="ctxt9"></param>
        /// <param name="ctxt10"></param>
        /// <param name="ctxt11"></param>
        /// <param name="ctxt12"></param>
        /// <param name="ctxt13"></param>
        /// <param name="ctxt14"></param>
        /// <param name="ctxt15"></param>

        public void updatelead(LeadList ml, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15)
        {
            var db = new LawPracticeEntities();
          
            ColMap cm = new ColMap();
            MultipleFileMap mf = new MultipleFileMap();
            var cf = db.LeadLists.Where(x => x.lid == ml.lid && x.Firmid.ToString() == firmid).FirstOrDefault();
            if (ml.lddocs != "")
            {
                cf.lddocs = "1";
            }
            cf.Firmid = ml.Firmid;
            cf.firmuser = ml.firmuser;
            cf.ldname = ml.ldname;
            cf.ldcperson = ml.ldcperson;
            cf.ldorg = ml.ldorg;
            cf.lddesign = ml.lddesign;
            cf.ldadd = ml.ldadd;
            cf.ldcountry = ml.ldcountry;
            cf.ldstate = ml.ldstate;
            cf.ldcity = ml.ldcity;
            cf.ldfax = ml.ldfax;
            cf.ldemail = ml.ldemail;
            cf.ldpin = ml.ldpin;
            cf.ldphn = ml.ldphn;
            cf.ldmob = ml.ldmob;
            cf.ldctype = ml.ldctype;
            cf.ldcategory = ml.ldcategory;
            cf.ldsource = ml.ldsource;
            cf.ldltype = ml.ldltype;
            cf.ldplan = ml.ldplan;
            cf.ldec = ml.ldec;
            cf.ldinfo = ml.ldinfo;




            cf.date_time = DateTime.Now;
            cf.col1 = ml.col1;
            cf.col2 = ml.col2;
            cf.col3 = ml.col3;
            cf.col4 = ml.col4;
            cf.col5 = ml.col5;
            cf.col6 = ml.col6;
            cf.col7 = ml.col7;
            cf.col8 = ml.col8;
            cf.col9 = ml.col9;
            cf.col10 = ml.col10;
            cf.col11 = ml.col11;
            cf.col12 = ml.col12;
            cf.col13 = ml.col13;
            cf.col14 = ml.col14;
            cf.col15 = ml.col15;
            cf.iupdate = 1;
            db.Entry(cf).State = EntityState.Modified;
            db.SaveChanges();


            //save in filemap table
            if (ml.lddocs != "")
            {
                string s = ml.lddocs;
                string[] values = s.Split('/');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();

                    mf.filedocs = values[i];
                    mf.Firmid = ml.Firmid;
                    mf.userid = ml.firmuser;
                    mf.rowid = ml.lid;
                    mf.date_time = DateTime.Now;
                    mf.moduletype = "Lead";
                    db.MultipleFileMaps.Add(mf);
                    db.SaveChanges();
                }
            }

            //save in maptable

            for (int i = 1; i <= sum; i++)
            {

                cm.pid = cf.lid;
                cm.column_no = "col" + i;
                //var st="ccol" + i;
                if (i == 1)
                {
                    var ctxt = ctxt1;
                    cm.column_name = ctxt;
                }
                else if (i == 2)
                {
                    var ctxt = ctxt2;
                    cm.column_name = ctxt;
                }
                else if (i == 3)
                {
                    var ctxt = ctxt3;
                    cm.column_name = ctxt;
                }
                else if (i == 4)
                {
                    var ctxt = ctxt4;
                    cm.column_name = ctxt;
                }
                else if (i == 5)
                {
                    var ctxt = ctxt5;
                    cm.column_name = ctxt;
                }
                else if (i == 6)
                {
                    var ctxt = ctxt6;
                    cm.column_name = ctxt;
                }
                else if (i == 7)
                {
                    var ctxt = ctxt7;
                    cm.column_name = ctxt;
                }
                else if (i == 8)
                {
                    var ctxt = ctxt8;
                    cm.column_name = ctxt;
                }
                else if (i == 9)
                {
                    var ctxt = ctxt9;
                    cm.column_name = ctxt;
                }
                else if (i == 10)
                {
                    var ctxt = ctxt10;
                    cm.column_name = ctxt;
                }
                else if (i == 11)
                {
                    var ctxt = ctxt11;
                    cm.column_name = ctxt;
                }
                else if (i == 12)
                {
                    var ctxt = ctxt12;
                    cm.column_name = ctxt;
                }
                else if (i == 13)
                {
                    var ctxt = ctxt13;
                    cm.column_name = ctxt;
                }
                else if (i == 14)
                {
                    var ctxt = ctxt14;
                    cm.column_name = ctxt;
                }
                else if (i == 15)
                {
                    var ctxt = ctxt15;
                    cm.column_name = ctxt;
                }



                //cm.txt2 = ctxt2;
                //cm.ftype = ftype;
                cm.Firmid = ml.Firmid;
                cm.formid = Convert.ToInt32(ftype);

                var mt = db.ColMaps.Where(x => x.Firmid.ToString() == firmid && x.formid == cm.formid && x.pid == cm.pid && x.column_name == cm.column_name && x.column_no == cm.column_no).FirstOrDefault();
                if (mt == null)
                {

                    db.ColMaps.Add(cm);
                    db.SaveChanges();
                }
                else
                {
                    mt.iupdate = 1;
                    db.Entry(mt).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            tbl_notification tn = new tbl_notification();

            tn.date_time = ml.date_time;
            tn.Firmid = ml.Firmid;
            tn.userid = ml.firmuser;
            tn.auser = Guid.Parse(ml.firmuser.ToString());
            tn.ntype = "Lead";
            tn.status = 1;
            tn.nmode = "edit";


            tn.urllink = "/Firm/LeadSingleView/" + cf.lid;




            tn.notification = "You have edit Lead";
            tn.typeid = cf.lid;
            db.tbl_notification.Add(tn);
            db.SaveChanges();
        }
        /// <summary>
        /// Remove lead detail
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="ctype"></param>
        /// <param name="cid"></param>
        /// <returns></returns>
        public bool leadremovefield(string uid, string ctype, string cid)
        {
            var db = new LawPracticeEntities();
            FirmCustomField ft = new FirmCustomField();
#pragma warning disable CS0219 // The variable 'tq' is assigned but its value is never used
            var tq = "";
#pragma warning restore CS0219 // The variable 'tq' is assigned but its value is never used
            string cname = "1";
#pragma warning disable CS0219 // The variable 'idt' is assigned but its value is never used
            var idt = 0;
#pragma warning restore CS0219 // The variable 'idt' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'cdt' is assigned but its value is never used
            var cdt = 0;
#pragma warning restore CS0219 // The variable 'cdt' is assigned but its value is never used
            string rs = "0";
            string rs2 = "0";
#pragma warning disable CS0219 // The variable 'colname' is assigned but its value is never used
            var colname = "";
#pragma warning restore CS0219 // The variable 'colname' is assigned but its value is never used
            var result = (from c in db.FirmConfiguredCustomFields

                          join ct in db.CustomFields on c.FieldType equals ct.Id
                          where c.Firmid.ToString() == uid && c.ConfigurationType.ToString() == ctype && c.Id.ToString() == cid
                          select new

                          {
                              tq = c.FieldName

                          });

            foreach (var item in result)
            {
                cname = item.tq;

                // etc..
            }
            var formid = Convert.ToInt32(ctype);
            var remove = from d in db.ColMaps
                         where d.column_name == cname && d.Firmid.ToString() == uid && d.formid.ToString() == formid.ToString()
                         select new
                         {

                             idt = d.pid,
                             cdt = d.id,
                             colname = d.column_no
                         };

            //Movie movie = db.Movies.Find(id);
            foreach (var item1 in remove)
            {
                rs = item1.idt.ToString();
                rs2 = item1.cdt.ToString();
                if (rs != "0")
                {
                    LeadList de = db.LeadLists.Find(rs);
                    if (de != null)
                    {
                        de.iupdate = 1;
                        if (item1.colname == "col1")
                        {
                            de.col1 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col2")
                        {
                            de.col2 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col3")
                        {
                            de.col3 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col4")
                        {
                            de.col4 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col5")
                        {
                            de.col5 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col6")
                        {
                            de.col6 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col7")
                        {
                            de.col7 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col8")
                        {
                            de.col8 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col9")
                        {
                            de.col9 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col10")
                        {
                            de.col10 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col11")
                        {
                            de.col11 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col12")
                        {
                            de.col12 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col13")
                        {
                            de.col13 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col14")
                        {
                            de.col14 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                        if (item1.colname == "col15")
                        {
                            de.col15 = null;
                            db.Entry(de).State = EntityState.Modified;
                        }
                    }
                }

                if (rs != "0")
                {

                    ColMap de1 = db.ColMaps.Where(x => x.id.ToString() == rs2.ToString()).FirstOrDefault();
                    if (de1 != null)
                    {
                        db.ColMaps.Remove(de1);
                        db.insertdeleteentrytable(Guid.Parse(rs2), "ColMap", Guid.Parse(uid));
                    }
                }


                // etc..
            }

            //delete data from firmconfirmed field
            FirmConfiguredCustomField de2 = db.FirmConfiguredCustomFields.Where(x => x.Id.ToString() == cid.ToString()).FirstOrDefault();
            if (de2 != null)
            {
                db.FirmConfiguredCustomFields.Remove(de2);
                db.insertdeleteentrytable(Guid.Parse(cid), "FirmConfiguredCustomFields", Guid.Parse(uid));
            }
            db.SaveChanges();
            db.SaveChanges();
            return true;
        }

        public string spcolmap1(string uid, string id)
        {
           
                var db = new LawPracticeEntities();
                var sp = db.GetColMaps(Guid.Parse(uid), Convert.ToInt32(id)).ToList();
                var a = JsonConvert.SerializeObject(sp);
                return a;
            
        }
        /// <summary>
        /// View lead detail
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string viewleadlist(string uid)
        {
         
            var db = new LawPracticeEntities();
            
            List<GetLeadDetails_Result> list = new List<GetLeadDetails_Result>();
            list = db.GetLeadDetails(Guid.Parse(uid)).ToList();



            foreach (var data in list.ToList())
            {
                GetLeadDetails_Result newItem = new GetLeadDetails_Result();

                newItem.lid = Convert.ToBase64String(QueryAES.EncryptAes(data.lid.ToString()));

                list[list.IndexOf(data)].lid = newItem.lid;

            }
            var a = JsonConvert.SerializeObject(list);
           
            return a;
        }
        /// <summary>
        /// View lead by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public string viewleadlistbyrowid(string firmid,string userid,int pagenum, int pagesize)
        {

            var db = new LawPracticeEntities();

            List<GetLeadDetailsByRowId_Result> list = new List<GetLeadDetailsByRowId_Result>();
            list = db.GetLeadDetailsByRowId(Guid.Parse(firmid),Guid.Parse(userid),pagenum,pagesize,0).ToList();



            foreach (var data in list.ToList())
            {
                GetLeadDetailsByRowId_Result newItem = new GetLeadDetailsByRowId_Result();

                newItem.lid = Convert.ToBase64String(QueryAES.EncryptAes(data.lid.ToString()));

                list[list.IndexOf(data)].lid = newItem.lid;

            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }
        /// <summary>
        /// Search lead by row id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public string viewleadlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize,string search)
        {

            var db = new LawPracticeEntities();

            List<GetSearchLeadDetailsByRowId_Result> list = new List<GetSearchLeadDetailsByRowId_Result>();
            list = db.GetSearchLeadDetailsByRowId(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, 0,search).ToList();



            foreach (var data in list.ToList())
            {
                GetSearchLeadDetailsByRowId_Result newItem = new GetSearchLeadDetailsByRowId_Result();

                newItem.lid = Convert.ToBase64String(QueryAES.EncryptAes(data.lid.ToString()));

                list[list.IndexOf(data)].lid = newItem.lid;

            }
            var a = JsonConvert.SerializeObject(list);

            return a;
        }
        /// <summary>
        /// Remove lead by id
        /// </summary>
        /// <param name="typeIds"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string removeleadlist(string[] typeIds, string uid)
        {
            
            var db = new LawPracticeEntities();
            string uids =uid;
            foreach (string did1 in typeIds)
            {
                string did =QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did1));
                LeadList lead = (from c in db.LeadLists
                                           where c.lid.ToString() == did && c.Firmid.ToString() == uids
                                           select c).FirstOrDefault();
                db.LeadLists.Remove(lead);
                db.insertdeleteentrytable(Guid.Parse(did), "LeadList", Guid.Parse(uid));
            }

            foreach (string dids1 in typeIds)
            {

                string dids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dids1));
                IEnumerable<ColMap> ct1 = (from c in db.ColMaps where c.formid.ToString() == "9" && c.Firmid.ToString() == uids && c.pid.ToString() == dids select c).ToList();

                db.ColMaps.RemoveRange(ct1);
                db.insertdeleteentrytable(Guid.Parse(dids), "ColMap", Guid.Parse(uids));
                db.SaveChanges();

            }
            var countcontact = db.SaveChanges();
            var a = JsonConvert.SerializeObject(countcontact);
            return a;
        }

        /// <summary>
        /// Get single lead details
        /// </summary>
        /// <param name="mid"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public string singleleaddetails(string mid, string FirmId)
        {
            var db = new LawPracticeEntities();
           
            var lead = db.GetLeadSingleDetails(Guid.Parse(FirmId), Guid.Parse(mid)).ToList();
            var a = JsonConvert.SerializeObject(lead);
            return a;


        }

       
    }
}
