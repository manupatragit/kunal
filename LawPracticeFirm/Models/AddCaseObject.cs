using System;
using System.Collections.Generic;
namespace NJDGDetail.Models
{
    /// <summary>
    /// Add case object
    /// </summary>
    public class AddCaseObject
    {
        private string courtid = "";
        private string courtname = "";
        private int iid = 0;
        private string casetype = "";
        private string casetypename = "";
        private string benchID = "";
        private string benchname = "";
        private string sideID = "";
        private string sidename = "";
        private string caseno = "";
        private string caseyear = "";
        private string court = "";
        private string username = "";
        private string flag = "";
        private string courttitle = "";
        private string stampreg = "";
        private string vadd = "";
        private DateTime dentrydate = DateTime.Now;
        private string fileNo = "";
        private int totalCase = 0;
        public Nullable<System.Guid> Matterid { get; set; }
        private string casedetail = "";
        private string diaryno = "";
        public string District { get; set; }
        public int TriState { get; set; }
        public string Casedetail
        {
            get
            {
                return casedetail;
            }
            set
            {
                casedetail = value;
            }
        }
        public string Courtid
        {
            get
            {
               return courtid;
            }
            set
            {
                courtid=value;
            }
        }
        public string Courtname
        {
            get
            {
                return courtname;
            }
            set
            {
                courtname = value;
            }
        }
        public int Iid
        {
            get
            {
                return iid;
            }
            set
            {
                iid = value;
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
        public string Casetypename
        {
            get
            {
                return casetypename;
            }
            set
            {
                casetypename = value;
            }
        }
        public string BenchID
        {
            get
            {
                return benchID;
            }
            set
            {
                benchID = value;
            }
        }
        public string Benchname
        {
            get
            {
                return benchname;
            }
            set
            {
                benchname = value;
            }
        }
        public string SideID
        {
            get
            {
                return sideID;
            }
            set
            {
                sideID = value;
            }
        }
        public string Sidename
        {
            get
            {
                return sidename;
            }
            set
            {
                sidename = value;
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
        public string Court
        {
            get
            {
                return court;
            }
            set
            {
                court = value;
            }
        }
        public string Username
        {
            get
            {
                return username;
            }
            set
            {
                username = value;
            }
        }
        public string Flag
        {
            get
            {
                return flag;
            }
            set
            {
                flag = value;
            }
        }
        public string Courttitle
        {
            get
            {
                return courttitle;
            }
            set
            {
                courttitle = value;
            }
        }
        public string Stampreg
        {
            get
            {
                return stampreg;
            }
            set
            {
                stampreg = value;
            }
        }
        public string Vadd
        {
            get
            {
                return vadd;
            }
            set
            {
                vadd = value;
            }
        }
        public DateTime Dentrydate
        {
            get
            {
                return dentrydate;
            }
            set
            {
                dentrydate = value;
            }
        }
        public string FileNo
        {
            get
            {
                return fileNo;
            }
            set
            {
                fileNo = value;
            }
        }
        public int TotalCase
        {
            get
            {
                return totalCase;
            }
            set
            {
                totalCase = value;
            }
        }
        public string Diaryno
        {
            get
            {
                return diaryno;
            }
            set
            {
                diaryno = value;
            }
        }
    }
    public class AddCaseObjectList : List<AddCaseObject>
    {
        public AddCaseObjectList()
        { }
    }
}