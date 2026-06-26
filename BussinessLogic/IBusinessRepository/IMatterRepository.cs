using DataAccess.Modals;
using LawPracticeFirm.Models;
using NJDGDetail.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BussinessLogic.IBusinessRepository
{
    public interface IMatterRepository
    {
        List<AddContactsList> contactlist(string uid);
        string assignuserlist(string uid);
        string allassignuserlist(string uid, string usertype = null, string userid = null);
        string matterlistdata(string firmid);
        string matterlist(string firmid, string userid, int pagenum, int pagesize);
        string findmatterlist(string firmid, string userid, int pagenum, int pagesize, string search);
        string matterlistforclient(string uid, string clientid, string companyid, string userid);
        string matterlistforclientbymtype(string uid, string clientid, string matterType);
        string leadcalllist(string firmid, string userid, string lid);
        string timebycaselist(string firmid, string caseid);
        string timebycasecalllist(string firmid, string caseid);
        string LoadCasenotes(string firmid, string userid, string caseid, int roleid);
        string removecasenotes(string firmid, string userid, string noteid, int roleid);
        string casefilelist(string firmid, string userid, string caseid);
        string ocrfilelist(string firmid, string userid, string search = null);
        string ocrfilelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search = null);
        string Loadcasesubject(string firmid, string userid);
        string Loadcontacttype(string firmid, string userid);
        string Loadcustomactivity(string firmid, string userid);
        string ocrfilecontent(string firmid, string userid, string fid);
        string ocrfileById(string firmid, string userid, string fid);
        string Loadtaxdata(string firmid, string userid);
        string LoadInvoicedata(string firmid, string userid, int roleid);
        //string LoadInvoicedataSearch(string firmid, string userid, int roleid, string cname, string from, string to, string amount, int pagenum, int pagesize, string filterinvoietype, string invoicestatus);
        List<InvoiceSearchListModel> LoadInvoicedataSearch(string firmid, string userid, int roleid, string cname, string from, string to, string amount, int pagenum, int pagesize, string filterinvoietype, string invoicestatus);
        string LoadInvoiceseries(string firmid, string userid);
        string Loadmailboxserver(string firmid, string userid);
        string Loadinvaddress(string firmid, string userid);
        string LoadEditInvPayment(string firmid, string userid, string invoiceid);
        string LoadEditInvEntry(string firmid, string userid, string invoiceid);
        string SavePayment(string firmid, string userid, string invoiceid, string payobj);
        string Loadtaxdatabydate(string firmid, string userid, string date);
        string removetaxdata(string firmid, string userid, string id);
        string RemoveMailBoxServer(string firmid, string userid, string id);
        string RemoveMailBoxAccount(string firmid, string userid, string id);
        string removemessagegroup(string firmid, string userid, string id);
        string saveinvoicetax(TblInvoiceTax tx);
        string saveinvoiceseries(TblInvoiceSery tx, string id = null);
        string SaveMailBoxSettings(Tbl_mailboxServer tx, string id = null);
        string Savemaillogindata(Tbl_MailCredential tx, string id = null);
        string removeocrfile(string firmid, string userid, string fid);
        string saveinvoicesettings(TblinvoiceSetting inv, string id = null);
        string SaveInvoiceAddress(TblAnotherAddressInvoice inv, string id = null);
        string removedraft(string firmid, string userid, string fid);
        string InsertCaseSubject(string firmid, string userid, string subjectname);
        string InsertContactType(string firmid, string userid, string contacttype);
        string InsertCustomActivity(string firmid, string userid, string activityname);
        string UpdateCustomActivity(string firmid, string userid, string activityname, string id = null);
        string UpdateCaseSubject(string firmid, string userid, string subjectname, string id = null);
        string UpdateContactType(string firmid, string userid, string contacttype, string id = null);
        string removeCaseSubject(string firmid, string userid, string fid);
        string removeContactType(string firmid, string userid, string fid);
        string removeCustomActivity(string firmid, string userid, string fid);
        string leadusercalllist(string firmid, string userid, string lid);
        string notelist(string uid);
        string customactivitydatalist(string firmid, string userid, int roleid);
        string clientlist(string uid, string userid);
        string clientsummarylist(string uid, string userid);
        string ClientListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid);
        string ClientSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string ContactsClientListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string UserSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string UserNameSrh);
        string StandardUserSearchListByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string ClientListUserByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid);
        string ClientSearchListUserByRowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string clientlistbyuser(string uid, string userid);
        string directoryfullpath(string firmid, string userid, string uid);
        string userlist(string uid);
        string userlistbyrowid(string uid, int pagenum, int pagesize);
        string eventlist(string uid);
        string sentmessagelist(string uid, string userid);
        string draftmessagelist(string uid, string userid);
        string replymessagelist(string uid, string userid, string msgid);
        string tousermessagelist(string uid, string userid, string msgid);
        string replytousermessagelist(string uid, string userid, string msgid, string datetime);
        string statusmessagelist(string uid, string userid, string msgid);
        string receivemessagelist(string uid, string userid);
        string archivemessagelist(string uid, string userid);
        string LoadClientbound(string uid);
        string LoadUserbound(string uid);
        string calllist(string uid);
        string cformlist(string uid);
        string acformlist(string uid);
        string saveinvoice(string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference);
        string updateinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid);
        string amendinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference);
        string Recurrenceinvoice(string invids, string invclient, string invstate, string invinvoicedate, string invduedate, string invmob, string invaddress, string invigstper, string invcgstper, string invsgstper, string invigsttempval, string invcgsttempval, string invsgsttempval, string invsubtotaltemp, string finaltotaltemp, string desObj, string firmid, string userid, string firmcode, string addressid, string payobj, string invsstate, string invsaddress, int istaxinvoice, string usernamefreetext, string emailid, string matterid, string clientpan, string clientgst, string invsubject, string invReference);
        string cpubformlist(string uid);
        string cformsingle(string uid, string formid);
        string tasklist(string uid, string userid);
        string permissionlist(string uid);
        string singlecalllist(string uid, string id);
        string singletimeentrylist(string uid, string id);
        string Newsingletimeentrylist(string firmid, string userid, string id);
        string singlemessagelist(string uid, string id);
        string singlenotelist(string uid, string id);
        string singleeventlist(string uid, string id);
        string singletasklist(string uid, string id);
        string singlenoticelist(string uid, string userid, string id);
        string singlereminderlist(string firmid, string userid, string id);
        string spcolmap1(string uid, string id);
        string caspcolmap1(string uid, string id);
        bool removefield(string uid, string ctype, string cid);
        bool RemoveMultipleFile(string uid, string dataid, string type, string userid);
        bool RemoveMultipleFileNew(string uid, string dataid, string type, string userid);
        bool matterremovefield(string uid, string ctype, string cid);
        bool customformremovefield(string uid, string ctype, string cid);
        string enableclient(string[] typeIds, string uid, string userid);
        string disableclient(string[] typeIds, string uid, string userid);
        string enableuser(string[] typeIds, string uid);
        string disableuser(string[] typeIds, string uid, string loginuserid);
        string removecalllist(string[] typeIds, string uid);
        string removetimeentry(string[] typeIds, string uid);
        string removenewtimeentry(string[] typeIds, string uid);
        string removeusertimeentry(string[] typeIds, string uid, string userid);
        string removetasklist(string[] typeIds, string uid);
        string removesingletasklist(string typeIds, string uid);
        string removeeventlist(string[] typeIds, string uid);
        string removesingleeventlist(string typeIds, string uid);
        string removenotelist(string[] typeIds, string uid);
        string RemoveCustomActivities(string[] typeIds, string firmid, string userid, string roleid);
        string removemessagelist(string sid, string uid, string userid);
        string RemoveNoticelist(string sid, string uid, string userid, int roleid);
        string RemoveReminderlist(string firmid, string userid, string[] typeIds);
        string sentremovemessagelist(string sid, string uid, string userid);
        string statusmessageupdate(string sid, string uid, string userid);
        string removematterlist(string[] typeIds, string firmid, string uid, string dburl, string apiurl);
        string removecontactlist(string[] typeIds, string uid);
        string removecontactslist(string[] typeIds, string uid, string type);
        string verifydatalist(string[] typeIds, string uid);
        void verifydownloaddata(string wid, string wtid, string firmid, string emailto, string emailcc, string emailsub, string emailbody, string userid);
        string viewcontactlist(string firmid, string userid, int pagenum, int pagesize);
        string eventlist(Guid uid);
        string tasklist(Guid uid);
        string timerlist(string uid);
        string timerlistbyclientid(string uid, string clientid, string userid, string role);
        string templatelist(string uid);
        string searchmatterlist(string uid, string search);
        string searchcontactlist(string firmid, string userid, int pagenum, int pagesize, string search);
        string contactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv);
        string searchusercontactlist(string firmid, string userid, int pagenum, int pagesize, string search);
        bool publish(string uid, int ctype);
        bool publishcformfield(string uid, int ctype, int sctype);
        string PublishCustomform(string uid, string cformid);
        string ArchieveCustomform(string uid, string cformid);
        string UnArchieveCustomform(string uid, string cformid);
        string customfieldcount(string firmid, string ctype);
        List<AddLawMatterList> Matterlistbound(string uid);
        void savefirmcustom(FirmConfiguredCustomField fm, string firmid);
        void savefirmcustomother(FirmConfiguredCustomField fm, string firmid);
        void saveformcustom(FirmConfiguredCustomField fm, string firmid);
        string SpColMapscustomform(string firmid, string formid);
        string SpContactCustomformdata(string firmid, string formid, string wfid);
        string SpContactCustomFormDatadownload(string firmid, string formid, string wfid);
        string SpContactverifyCustomformdata(string firmid, string formid);
        void savecustomformdata(SaveCustomFieldData fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string wid, string wtid, string Filenames, string userid);
        void editcustomformdata(SaveCustomFieldData fm, string firmid, string ftype, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string wid, string wtid, string fstatus, string fcomment, string Filenames, string userid);
        void savecustomactivitydata(SaveCustomActivityData fm, string firmid, string userlist, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string Filenames, string userid);
        void editcustomactivitydata(SaveCustomActivityData fm, string firmid, string userlist, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string Filenames, string userid);
        string FirmEmployees1(string firmid, string rty);
        string FirmEmployeescreate1(string firmid, string rty);
        string getcfirmfield(string firmid, string cont, string scont);
        bool savenote(AddNoteList ml);
        bool editnote(AddNoteList ml);
        bool savecall(AddCallList ml);
        bool saveleadcall(Tbl_leadCall ml);
        string savetimer(TimerList ml);
        string edittimer(TimerList ml, string type);
        bool saveclient(RegUser ml, string username, string cpassword, string uemail);
        bool saveuser(RegUser ml, string username, string cpassword, string uemail);
        bool editcall(AddCallList ml);
        bool savemessage(MessageList ml, string user, string did = null, string sendemailpostedFiledata = null, string clientid = null);
        bool savegroup(MessageGroup ml, string user, string did = null);
        string messageGrouplist(Guid firmid, Guid userid, int roleid);
        string CaseListbyClientRowId(Guid firmid, string clientid, string role, string userid, int pagenum, int pagesize);
        string CaseListcasedashboard(Guid firmid, string param, string role, string userid, int pagenum, int pagesize);
        string CaseListbyClientId(Guid firmid, string clientid, string role, string userid);
        string SingleMessageGroup(Guid firmid, Guid userid, string groupid);
        bool savedraftmessage(MessageDraftList ml, string user);
        string singledraftmessage(string firmid, string userid, string pfile);
        bool archivemessage(string msgid, string firmid, string userid);
        bool unarchivemessage(string msgid, string firmid, string userid);
        bool Allreplymessage(ReplyMessageList ml, string auser, string newdetails);
        bool replymessage(ReplyMessageList ml, string auser, string newdetails);
        bool editmessage(MessageList ml);
        bool saveevent(AddEventList ml, string userlist, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5);
        bool editevent(AddEventList ml, string userlist);
        bool savetask(AddTaskList ml, string userlist, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5);
        bool edittask(AddTaskList ml, string userlist);
        string savematter(string clientid, string tempassign, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        string savematteremp(string clientid, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        bool editmatter(string clientid, string tempassign, AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        void savecontact(AddContactsList fm, string tempassign, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        void editcontact(AddContactsList fm, string tempassign, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        bool Createdir(string dname, string firmid, string userid, string pfile);
        bool CreateForm(string formname, string firmid, string userid);
        string RemoveCustomTask(string firmid, string userid, string fid);
        string LoadDirectory(string pfile, string firmid, string userid);
        string LoadDirectoryCloud(string pfile, string firmid, string userid, string caseid);
        string LoadKnowDirectory(string pfile, string firmid, string userid);
        string UserLoadDirectory(string pfile, string firmid, string userid);
        string LoadDirForMove(string firmid, string userid, string pfile, string search);
        string LoadDirForBrowse(string firmid, string userid, string pfile, string search);
        string UserLoadDirectory(string firmid, string userid);
        string AssignUserLoadDirectory(string firmid, string userid);
        string ShareUserLoadDirectory(string firmid, string userid);
        string FirmFileList(string firmid, string userid, string id);
        string AssignFilePerUserList(string firmid, string userid, string id);
        string AssignFilePerUserListCloud(string firmid, string userid, string id);
        string ShareFileUserList(string firmid, string userid, string id);
        string AssignUserFileList(string firmid, string userid, string id);
        string ShareUserFileList(string firmid, string userid, string id);
        List<ViewFile> LoadDirectoryFile(string firmid, string userid);
        bool Createfile(string fileName, string fpermissions, string filedetail, string directname, string fileext, string FirmId, string UserId);
        string savecasefile(string fileName, float filesize, string caseid, string userid, string firmid);
        string saveocrfile(string fileName, string ocrcontent, string details, string userid, string firmid);
        string loadFiles(string firmId, string userid);
        string removedirectory(string did, string firmid, string userid);
        string removedirectoryCloud(string did, string firmid, string userid);
        string removedirectoryfile(string ffid, string firmid, string userid);
        string removedirectoryfileCloud(string ffid, string firmid, string userid);
        string removeasdirectoryfile(string ffid, string firmid, string userid);
        string removeuserdirectoryfile(string ffid, string firmid, string userid);
        string removeuserdirectoryfileCloud(string ffid, string firmid, string userid);
        string revertsharefile(string ffid, string firmid, string userid);
        string revertassignfile(string ffid, string firmid, string userid);
        string revertassignfileCloud(string ffid, string firmid, string userid, int roleid);
        string userdirpermission(string did, string ptype, string user, string FirmId, string UserId);
        string userfilepermission(string did, string ptype, string user, string FirmId, string UserId);
        string userfilepermissionCloud(string did, string ptype, string user, string FirmId, string UserId);
        string UserShareFile(string did, string user, string ptype, string FirmId, string UserId);
        string matterdirpermission(string did, string ptype, string matter, string FirmId, string UserId);
        List<UserDirPermission> FirmSingleDirPermission(string contactid, string did, string FirmId, string UserId);
        List<UserDirPermission> singleuserpermission(string contactid, string FirmId, string UserId);
        string singlefilepermission(string contactid, string fileid, string FirmId, string UserId);
        List<MatterDirPermission> singlematterpermission(string contactid, string FirmId, string UserId);
        string singlematterdetails(string mid, string FirmId);
        string singlecontactdetails(string mid, string FirmId);
        string singlecontactsdetails(string Firmid, string userid, string id, string type);
        string loadcompanycontacts(string Firmid, string id);
        string singlecustomactivitydetails(string mid, string FirmId);
        string singlecustomformdetails(string FirmId, string formid, string cid);
        string SaveAccesspage(string firmid, string userid, string assignuser, string pageid);
        string ActivityReportDatewise(string firmid, string userid, string sdate, string edate, int pagenum, int pagesize, string search);
        string Savecasenotes(string firmid, string userid, string notes, string caseid);
        string ActivityReport(string firmid, string userid, int pagenum, int pagesize);
        string timerlistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string timerlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize, string search, string frmdate,
            string todate, string Createdby, string timeentryfilter, string Isdaterangefilter);
        string newtimeentrybyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        string receivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        string noticelistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string Assignnoticelistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string LoadReminderByRowid(string firmid, string userid, int roleid, int pagenum, int pagesize);
        string casereceivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string caseid);
        string archivemessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        string sentmessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        string draftmessagelistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        string AssignUserFileListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize);
        string AssignUserFileListbyrowidCloud(string firmid, string userid, string id, int pagenum, int pagesize, string search, string pfile, string pfilemain);
        string AssignUserFileListbyrowidCloudContentSearch(string firmid, string userid, string id, int pagenum, int pagesize, string search, string pfile, string pfilemain);
        string AzureAssignUserFileListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize, string search);
        string ShareFileUserListbyrowid(string firmid, string userid, string id, int pagenum, int pagesize);
        string LoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize);
        string UserLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid);
        string UserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid);
        string SearchUserLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string SearchUserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string ContentSearchUserLoadDirectorybyrowidCloud(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string ids);
        string AllActivityDatabyrowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search, string type);
        string bindcaseevent(string firmid, string userid);
        string caseeventalertlist(string firmid, string userid, int roleid, string caseid);
        string removecaseeventalert(string firmid, string userid, int roleid, string alertid);
        string singlecaseeventalertlist(string firmid, string userid, int roleid, string alertid);
        string Addtofavcontactlist(string[] typeIds, string firmid, string userid, int roleid);
        string Removetofavcontactlist(string[] typeIds, string firmid, string userid, int roleid);
        string viewfavcontactlist(string firmid, string userid, int pagenum, int pagesize, int roleid);
        string searchfavcontactlist(string firmid, string userid, int pagenum, int pagesize, string search, int roleid);
        string RemoveUserFileRequestListbyrowid(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string RemoveUserFileRequestListbyrowidCloud(string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string activityeventalertlist(string firmid, string userid, int roleid, string evid);
        string removeactivityeventalert(string firmid, string userid, int roleid, string alertid);
        string singleactivityeventalertlist(string firmid, string userid, int roleid, string alertid);
        string filesyncRequest(string typeIds, string firmid, string userid, string roleid, string syncflag);
        string filesyncRequestCloud(string typeIds, string firmid, string userid, string roleid, string syncflag);
        string SaveShortCase(string firmid, string userid, string usertypes, string clientid, string casename, string caseno, string clientcontact, string casetype, string auserid, string details, string username, string confirmPassword, string checkclient, string files, string odates, string creatorroleid, string companyId, string assignuser, string courtname, string othercourtname);
        string SaveFullScreenCase(string firmid, string userid, string usertypes, string clientid, string casename, string casetype, string caseclientcontact,
            string casedetails, string casenotes, string court, string othercourt, string casestatus, string caseodate, string casenumber, string casecdate,
            string caseteamlead, string casecnr, string username, string casesidepassword, string clientto, string assignto, string sollist, string checkclient,
            string files, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9,
            string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string mcol1, string mcol2, string mcol3, string mcol4,
            string mcol5, string mcol6, string mcol7, string mcol8, string mcol9, string mcol10, string mcol11, string mcol12, string mcol13, string mcol14,
            string mcol15, string ftype, AddCaseObject1 obj, int flag, string useremail, string usermobile, string apiurl, string clientno,
            string MatterType, string PoliceStation, string Firno, string CertifiedCopyAppliedon, string CertifiedCopyReceivedon, string ValuationofSuit,
            string Courtfee, string OppositePartyCounselname, string OppositePartyCounselemail, string OppositePartyCounselphone, string CasenumberInternal,
            string IsCourtFeePaid, string SubjectType, DateTime casefilingcdate, DateTime submitDate, DateTime returnDate, string ePartyName,
            string ePartyFatherName, string ePartyAddress, string ePartyAdharCardNo, string ePartyGender,
            string ePartyDateOfBirth, string ePartyNationality, string ePartyMobileNo, string ePartyEmail,
            string creatorroleid, string fmatterType, string txtMatterOther, string DisputeMatterType,
            string fcompanystructure, string DisposeOption, string NotesCasedetail,
            string otherpartyFname, string otherpartyEMail, string otherpartyPhone, string otherpartyType);
        string loadnewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
            string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname,
            string mattertype, string subjectype, string casefilternotes, string casefiltercourtname, string odateto,
            string fillingdate, string fillingdateto, string IsCaseArchived,
            string srchcustcolname, string srchcustcolval, string disposeoption, string casefilterCaseDetails,
            string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseredirectfilter,
            string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter,string hearingsort,string courtstatus,
            string hearingsortfilter, string petionerfilter, string respondentrfilter);
        string loadstandardcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string loadusernewstandardcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string loadusernewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
            string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname,
            string mattertype, string subjectype, string casefilternotes, string casefiltercourtname, string odateto,
            string fillingdate, string fillingdateto, string IsCaseArchived,
            string srchcustcolname, string srchcustcolval, string disposeoption,
            string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
            string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter,
            string hearingsort, string courtstatus, string hearingsortfilter, string petionerfilter, string respondentrfilter);
        string CaseDashboardCaseCommuniqueList(string firmid, string userid, string caseid, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter, string searchfrom, string searchto, string filteralertto);
        string CaseDashboardTaskList(string firmid, string userid, string caseid, int pagenum, int pagesize, string datefilter, string filtertask, string filterclient, string filteruser, string assignby, string assignto, string status, string duedate);
        string CaseBasicDetails(string firmid, string userid, string caseid);
        string CaseExternalContact(string firmid, string userid, string caseid, int pagenum, int pagesize);
        string OcrfilelistForDDl(string firmid, string userid);
        string FileVersionList(string firmid, string userid, string fileid);
        string UpdateFullScreenCase(string caseid, string firmid, string userid, string usertypes, string clientid, string casename, string casetype, string caseclientcontact, string casedetails, string casenotes, string court, string othercourt, string casestatus, string caseodate, string casenumber, string casecdate, string caseteamlead, string casecnr, string username, string casesidepassword, string clientto, string assignto, string sollist, string checkclient, string files, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15, string mcol1, string mcol2, string mcol3, string mcol4, string mcol5, string mcol6, string mcol7, string mcol8, string mcol9, string mcol10, string mcol11, string mcol12, string mcol13, string mcol14, string mcol15, string ftype, string divSCHCDistrict, string drpcourtname, string drpdistrictcourtname, string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, int flag, string useremail, string usermobile, string apiurl, string clientno,
            string MatterType, string PoliceStation, string Firno, string CertifiedCopyAppliedon, string CertifiedCopyReceivedon, string ValuationofSuit,
            string Courtfee, string OppositePartyCounselname, string OppositePartyCounselemail, string OppositePartyCounselphone, string CasenumberInternal,
            string IsCourtFeePaid, string SubjectType,
            DateTime casefilingcdate, DateTime submitDate, DateTime returnDate, string ePartyName,
            string ePartyFatherName, string ePartyAddress, string ePartyAdharCardNo, string ePartyGender,
                   string ePartyDateOfBirth, string ePartyNationality, string ePartyMobileNo, string ePartyEmail,
                   string creatorroleid, string fmatterType, string txtMatterOther, string DisputeMatterType,
                   string DisposeOption, string NotesCasedetail,
                   string otherpartyFname, string otherpartyEMail, string otherpartyPhone, string otherpartyType,string otherpartyId);

        string CaseDashboardCasedocs(string firmid, string userid, string caseid, int pagenum, int pagesize);
        string EditCaseBasicDetails(string firmid, string userid, string caseid);
        string allcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv);
        string usersbycaseid(string firmid, string userid, string caseid, int pagenum, int pagesize);
        string CreateUserByCaseId(string firmid, string userid, string caseid);
        string usersbycaseidforalerts(string firmid, string userid, string caseid, int pagenum, int pagesize);
        string timerlistsearchbyrowidbycaseid(string firmid, string userid, int pagenum, int pagesize, string search, string caseid);
        string loadclientnewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string clientid);
        string ClientCommuniqueList(string firmid, string userid, string caseid, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter);
        string RecentActivityReport(string firmid, string userid, int pagenum, int pagesize, string datefrom, string dateto);
        string DocumentActivityReport(string firmid, string userid, int pagenum, int pagesize, string datefrom, string dateto, string docid);
        string loadusernewcaselistAchive(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue);
        string loadnewcaselistArchive(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue);
        string SpClientDataNew(string firmid, string userid);
        string LoadInvoicedataByCaseId(string firmid, string userid, int roleid, string caseid, string filterinvoietype, int pagenum, int pagesize, string InvoiceStatus);
        string LoadExpenseCategory(string firmid, string userid);
        string InsertExpenseCategory(string firmid, string userid, string type);
        string RemoveExpenseCategory(string firmid, string userid, string fid);
        string LoadCustomCaseTask(string firmid, string userid);
        string InsertCustomCaseTask(string firmid, string userid, string type);
        string RemoveCustomCaseTask(string firmid, string userid, string fid);
        string UserSearchListByUsername(string firmid, string userid, int pagenum, int pagesize, int roleid, string Username);
        string CommuniqueList(string firmid, string userid, string casename, int pagenum, int pagesize, string filtertype, string filtercreatedby, string brieffilter, string searchfrom, string searchto, string filteralertto, string isdadmin);
        string contactslistForComapny(string firmid, string userid, int pagenum, int pagesize, string search, string type);
        string allcontactslistforcompany(string firmid, string userid, int pagenum, int pagesize, string search, string type);
        string InvoicePaymentbyInvoiceID(string firmid, string userid, string invoiceid, string filterpaymenttype);
        string CancelInvoice(string firmid, string userid, string invoiceid);
        string unlinkcasewatchcase(string caseid, string firmid, string uid, string dburl, string apiurl);
        string standardcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv);
        string allstandardcontactslist(string firmid, string userid, int pagenum, int pagesize, string search, string type, string iscomorindv);
        dynamic ApplyDigitalSign(string filename, string signtype, string UserId, string DocNumber, string DocName, string username, string pageselect, string firmid, string digitalSingusername);
        dynamic ApplyDigitalSignCloud(string filename, string signtype, string UserId, string DocNumber, string DocName, string username, string pageselect, string firmid, string digitalSingusername, string Filetype, string Uid, string Cordinatetype);
        string UserCheckoutLoadDirectorybyrowid(string pfile, string firmid, string userid, int pagenum, int pagesize, int roleid);
        string CaseDashboardReplyCaseCommuniqueList(string firmid, string userid, string commuid, int pagenum, int pagesize, string brieffilter, string subjectfilter);
        string DirectAddCaseToCW(string firmid, string userid, string divSCHCDistrict, string drpcourtname, string drpdistrictcourtname, 
            string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, string useremail, string usermobile, 
            string apiurl, string caseinfo, string matterid,int CWUser,string CWUserId);
        string loadnewarchivematterlist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string loadusernewarchivematterlist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string BindCaseForCWMAP(string firmid, string userid);
        string SaveCaseForCWMAP(string firmid, string userid, string matterid, string caseid);
        string UserLoadDirectorybyrowidCloudforcaseid(string caseid, string firmid, string userid, int pagenum, int pagesize, int roleid, string search);
        string CustomFieldHistory(string firmid, string userid, string vdate, int pagenum, int pagesize, string ModuleType);
        string CustomFieldHistoryHeader(string firmid, string userid, string ModuleType, string vdate);
        string CustomFieldVersion(string firmid, string userid, string ModuleType);
        string SaveCaseForNoticeMAP(string firmid, string userid, string matterid, string noticeid, string type);

        string loadNoticelinknewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string loaduserNoticelinknewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype, string casefilternotes);
        string SaveWorkTransfer(string firmid, string userid, string fromuser, string touser, string caseid);
        string RemoveWorkTransfer(string firmid, string userid, string id);
        string WorkTransferList(string firmid, string userid, int PageNumber, int Pagesize, string fromuser, string touser, string casename);
        string CaseListByCreator(string firmid, string userid, int PageNumber);
        string LoadColumnMasterChoice(string modulename, string firmid);
        string LoadColumnMasterChoiceByFirmId(string modulename, string firmid, string userid);
        string SaveColumnMasterChoice(string modulename, string firmid, string userid, string ModuleIds);
        string LoadCustomCommonDropdown(string firmid, string userid, string type);
        string InsertCommonDropdown(string firmid, string userid, string typename, string id, string type);
        string RemoveCommonDropdown(string firmid, string userid, string fid);
        string LoadCaseListByAssignUserandAll(string firmid, string userid, string optype, string pageno, string SelectConType, string SelectContacts);
        string SaveBulkCaseAssign(string firmid, string userid, string fromuser, string optype, string caseid, string SelectConType, string SelectContacts);
        string SaveExpenseStatus(string firmid, string userid, string expenseids);
        string SaveExpensePayment(string firmid, string userid, string expenseid, string payobj);
        string unlinkcasewatchcaseForLivecase(string usercaseid, string caseid, string firmid, 
            string uid, string dburl, string apiurl,int IsCWUser);
        string Removecontactslist(string companyids, string cids, string firmids);
        string Updatetimeentrystatus(string tids, string statusval, string firmids);
        string ChangeTimeEntryStatus(string[] typeIds, string firmid);
        // Task<string> Translate(string uri, string text, string key);
        string LitigationAddCaseToCW(string firmid, string userid, string divSCHCDistrict, string drpcourtname, string drpdistrictcourtname,
               string drpdistrictcourtfullname, string drpdcourtcnr, AddCaseObject1 obj, string useremail, string usermobile, string apiurl,
               string caseinfo, string usertypes, string clientid, string casename, string caseno, string clientcontact, string casetype, string auserid,
               string details, string username, string confirmPassword, string checkclient, string files, string odate, string RoleId,
               string companyIds, string assignuser, string Courtname, string OtherCourtName, string drpdcourtcnr1,
               int IsCWUser, string CWUserId);
        string SearchAddCaseToLiveupdate(string firmid, string userid, string useremail, string usermobile, string apiurl,
            string RoleId, string Cnrnos, string Casetypes, string Casenos, string Caseyears, string AppealNo, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames, string mhearingdates,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, string mkcasenames,
            string teammemberlist, string Username, string caseExternalNo, string courtName, string OtherCourtName, int IsCWUser, string CWUserId, string stampReg, string sideId, string matterId);
        string SearchAssignUserSendNotificationEmail(string firmid, string userid, string assignto, string creatorroleid, string casename, string caseid);
        Task<string> SaveNextHearingJSONdata(string firmid, string userids, string hearingjson);
        string InsertToDoListData(string firmid, string userid, string status, string scheduleDate, string vToDostext);
        string GetToDoListData(long iId, string firmId, string userId,int PageNumber,int pagesize);
        string RemoveToDO(int iId, string Firmids, string userIds);
        string UpdateToDoStatus(int iId, string vStatus, string firmid);
        string SaveShortCaseForLitigation(string firmid, string userid, string usertypes, string clientid,
            string casename, string caseno, string clientcontact, string casetype, string auserid, string details,
            string username, string confirmPassword, string checkclient, string files, string odates, string creatorroleid,
            string companyId, string assignuser,string mattertypetext, AddCaseObject1 obj,string mkcourtids,string othercourttext,
            string districtcourttxt,string statename,string districtname, string addedcnrno);
        string SaveCalculator(Savedatamodelforcalculator obj);
        string GetCalCulatorValues(string firmid, string userid, string caseid);
        string RelinkcasewatchcaseForLivecase(string usercaseid, string caseid, string firmid,
           string uid, string dburl, string apiurl, int IsCWUser);
        string EditCWMatter(string mattername, string matterids, string firmid, string userids);
        string SaveCWMatter(string mattername, string firmid, string userids, string CaseExternalNo, string Courtname, string OtherCourtName, string usercaseid, string assigntemmember,string creatorroleid);
        string LinkedCaseAddCaseToLiveupdate(string firmid, string userid, string LinkedCaseUserName, string MasterCaseIds,
            string LinkedCaseNo, string Cnrnos, string AppealNo, string Courts, string mkcasenames, string teammemberlist,
            string Username, string caseExternalNo, string courtName, string OtherCourtName, string apiUrl, string RoleId,
            int IsCWUser, string CWUserId,string Casetypes,string Casenos,string Caseyears,string ParentUserCaseIds,
            string Scasetype,string slinkedcasetype);
        string Restorematterlist(string[] typeIds, string firmid, string userid, string apiurl, string remarks, string roleid);
        //string loadnewcaselistSebi(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
        //    string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname, string mattertype,
        //    string subjectype, string casefilternotes, string casefiltercourtname, string odateto, string fillingdate,
        //    string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval, string disposeoption,
        //    string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
        //    string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter,
        //    string hearingsort, string courtstatus, string FiledByAgainstfilter, string FavourAgainstfilter, string IsCaseWatchUser);
        //string loadSebiusernewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename, string clientname,
        //       string court, string cstatus, int roletype, string createdby, int filtervalue, string companyname, string mattertype, string subjectype,
        //       string casefilternotes, string casefiltercourtname, string odateto, string fillingdate,
        //       string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval, string disposeoption,
        //       string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
        //       string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto, string courtstatusfilter, string hearingsort, string courtstatus,
        //       string FiledByAgainstfilter, string FavourAgainstfilter);
        //string SaveCWMatterOtherDetails(string ULN, string NatureOfCase, string MatterType, string MatterOf, string BriefOfMatter, string Relevance, string IssuesInvolved,
        //    string NatureOfViolation, string Casecategory, string DateOfImpugned, string IssuingAuthority, string DirectionUnderTheOrder, string ReplyField, string MatterStage, string StayOrder, string DateOfStayOrder, string NameOfParty,
        //string DateTill, string ExtendedTill, string StayVacatedOn, string DirectionOfCourt, string ExpactedDateOfCompliance, string OprationDepartmentInchargeOFCompliance,
        //string DateOfCompliance, string DisposalInFavour, string NatureOfDisposal, string OperationDepartmentForThePurposeOfSeeking, string NameOfTheDealingOfficer, string NameOfOfficer, string ProformaParty,
        //string MarketActivity, string GovernmentAuthorityParty, string Remarks, string MatterId);
        string SearchAddCaseToLiveupdateRERH(string firmid, string userid, string useremail, string usermobile, string apiurl,
            string RoleId, string Cnrnos, string Casetypes, string Casenos, string Caseyears, string AppealNo, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames, string mhearingdates,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, string mkcasenames,
            string teammemberlist, string Username, string caseExternalNo, string courtName, string OtherCourtName, int IsCWUser, string CWUserId, string stampReg, string sideId, string matterId, string Appres, string appealNo,
                         string District, string CourtType, string courtNameR, string Status);
    }
}
