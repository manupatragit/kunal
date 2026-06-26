using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace NJDGDetail.Models
{
    /// <summary>
    /// Case list
    /// </summary>
    public class CauelistObj
    {

        private int iid = 0;
        private int causelistiid = 0;
        private int masteriid = 0;
        private string userid = "";
        private string bench = "";
        private string courtid = "";
        private string casename = "";
        private string filetext = "";
        private string causelistdate = "";
        private string casetype = "";
        private string caseno = "";
        private string caseyear = "";
        private int totalcase = 0;

        public int Iid
        {
            get
            {
                return iid;
            }
            set
            {
                iid = 0;
            }
        }
        public int Causelistiid
        {
            get
            {
                return causelistiid;
            }
            set
            {
                causelistiid = 0;
            }
        }
        public int Masteriid
        {
            get
            {
                return masteriid;
            }
            set
            {
                masteriid = 0;
            }
        }
        public string Userid
        {
            get
            {
                return userid;
            }
            set
            {
                userid = value;
            }
        }
        public string Bench
        {
            get
            {
                return bench;
            }
            set
            {
                bench = value;
            }
        }
        public string CourtId
        {
            get
            {
                return courtid;
            }
            set
            {
                courtid = value;
            }
        }
        public string Casename
        {
            get
            {
                return casename;
            }
            set
            {
                casename = value;
            }
        }
        public string Filetext
        {
            get
            {
                return filetext;
            }
            set
            {
                filetext = value;
            }
        }
        public string Causelistdate
        {
            get
            {
                return causelistdate;
            }
            set
            {
                causelistdate = value;
            }
        }

        public string Casetype
        {
            get
            {
                return casetype;
            }
            set
            {
                casetype = value;
            }
        }
        public string Caseno
        {
            get
            {
                return caseno;
            }
            set
            {
                caseno = value;
            }
        }
        public string Caseyear
        {
            get
            {
                return caseyear;
            }
            set
            {
                caseyear = value;
            }
        }

        public int Totalcase
        {
            get
            {
                return totalcase;
            }
            set
            {
                totalcase = 0;
            }
        }


    }

    public class CauelistObjList : List<CauelistObj>
    {
        public CauelistObjList()
        { }
    }
}