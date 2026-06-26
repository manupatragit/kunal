using DataAccess.Modals;
namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmUsersRepository
    {
        string ClientDetail(string uid, string firmid);
        string SaveProfile(RegUserTable obj, string email, string aadhar, string gst, string pan, string apiurl, string commuemail);
        void savecontact(AddContactsList fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        string viewcontactlistbyrowid(string firmid, string uid, int pagenum, int pagesize);
        string viewcontactlist(string firmid, string uid);
        string removecontactlist(string[] typeIds, string firmid, string uid);
        string singlecontactdetails(string mid, string FirmId, string uid);
        void editcontact(AddContactsList fm, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        string savematter(AddLawMatterList ml, RegUser ml1, string cemail, string username, string cpassword, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        string assignuserlist(string firmid);
        string matterlist(string firmid, string userid);
        string matterlistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string findmatterlistbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
        void editmatter(AddLawMatterList ml, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        string removematterlist(string typeIds, string firmid, string userid, string apiurl, string remarks, string roleid);
        string archivematterlist(string[] typeIds, string firmid, string userid, string apiurl);
        string singlematterdetails(string mid, string FirmId, string userid);
        string notelist(string uid, string firmuser);
        string eventlist(string uid, string firmuser);
        string calllist(string uid, string firmuser);
        string tasklist(string uid, string firmuser);
        string singlecalllist(string uid, string id, string firmuser);
        string singlenotelist(string uid, string id, string firmuser);
        string singleeventlist(string uid, string id, string firmuser);
        string singletasklist(string uid, string id, string firmuser);
        string removecalllist(string[] typeIds, string uid, string firmuser);
        string removetasklist(string[] typeIds, string uid, string firmuser);
        string removeeventlist(string[] typeIds, string uid, string firmuser);
        string removenotelist(string[] typeIds, string uid, string firmuser);
        bool savenote(AddNoteList ml);
        bool editnote(AddNoteList ml);
        bool savecall(AddCallList ml);
        bool editcall(AddCallList ml);
        bool saveevent(AddEventList ml, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5);
        bool editevent(AddEventList ml);
        bool savetask(AddTaskList ml, int sum, string x1, string x2, string x3, string x4, string x5, string nx1, string nx2, string nx3, string nx4, string nx5, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5);
        bool edittask(AddTaskList ml);
        string removesingleeventlist(string typeIds, string uid, string firmuser);
        string removesingletasklist(string typeIds, string uid, string firmuser);
        string savetimer(TimerList ml);
        string timerlist(string uid, string firmuser);
        string timerlistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string timerlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);
    }
}
