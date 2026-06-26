using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BussinessLogic.BusinessEntity;
using DataAccess.Modals;

namespace BussinessLogic.IBusinessRepository
{
    public interface ILeadBusinessRepository
    {
        void createlead(LeadList ml, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);
        void updatelead(LeadList ml, string firmid, string ftype, int sum, string ctxt1, string ctxt2, string ctxt3, string ctxt4, string ctxt5, string ctxt6, string ctxt7, string ctxt8, string ctxt9, string ctxt10, string ctxt11, string ctxt12, string ctxt13, string ctxt14, string ctxt15);

        
        bool leadremovefield(string uid, string ctype, string cid);

        string spcolmap1(string uid, string id);
        string viewleadlist(string uid);
        string removeleadlist(string[] typeIds, string uid);
        string singleleaddetails(string mid, string FirmId);

        string viewleadlistbyrowid(string firmid, string userid, int pagenum, int pagesize);
        string viewleadlistsearchbyrowid(string firmid, string userid, int pagenum, int pagesize, string search);


    }

}