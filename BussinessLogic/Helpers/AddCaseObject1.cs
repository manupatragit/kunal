using System;

namespace NJDGDetail.Models
{
    public class AddCaseObject1
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
        //private Nullable<Guid> matterid=null ;
        public Nullable<System.Guid> Matterid { get; set; }
        private string casedetail = "";
        private string diaryno = "";
        private string casename = "";
        private string nexthearingdate = "";
        private string advocate = "";
        private string status = "";
        private string suffix = "";

        private string revenueCourt = "";
        private string revenueMandal = "";
        private string revenueJanpad = "";
        private string revenueTahsil = "";
        private string revenueCourtName = "";
        private string refNo = "";
        private string reraCourt = "";
        private string reracasetype = "";
        private string reracasno = "";
        private string reracaseyear = "";
        private string reraRefNo = "";

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
                courtid = value;
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

        public string Nexthearingdate
        {
            get
            {
                return nexthearingdate;
            }

            set
            {
                nexthearingdate = value;
            }
        }

        public string Advocate
        {
            get
            {
                return advocate;
            }

            set
            {
                advocate = value;
            }
        }

        public string Status
        {
            get
            {
                return status;
            }

            set
            {
                status = value;
            }
        }
        public string Suffix
        {
            get
            {
                return suffix;
            }

            set
            {
                suffix = value;
            }
        }
        public string RevenueCourt
        {
            get
            {
                return revenueCourt;
            }

            set
            {
                revenueCourt = value;
            }
        }

        public string RevenueMandal
        {
            get
            {
                return revenueMandal;
            }

            set
            {
                revenueMandal = value;
            }
        }

        public string RevenueJanpad
        {
            get
            {
                return revenueJanpad;
            }

            set
            {
                revenueJanpad = value;
            }
        }

        public string RevenueTahsil
        {
            get
            {
                return revenueTahsil;
            }

            set
            {
                revenueTahsil = value;
            }
        }

        public string RevenueCourtName
        {
            get
            {
                return revenueCourtName;
            }

            set
            {
                revenueCourtName = value;
            }
        }
        public string RefNo
        {
            get
            {
                return refNo;
            }

            set
            {
                refNo = value;
            }
        }
        //MP COURT
        public string RevenueCaseR { get; set; }
        public string RevenueCaseNo { get; set; }
        public string RevenuetxtnoREMP { get; set; }
        public string RevenueCourtNameDREMP { get; set; }

        //for Rera Court
        public string ReraCourt
        {
            get
            {
                return reraCourt;
            }

            set
            {
                reraCourt = value;
            }
        }
        public string Reracasetype
        {
            get
            {
                return reracasetype;
            }

            set
            {
                reracasetype = value;
            }
        }
        public string Reracasno
        {
            get
            {
                return reracasno;
            }

            set
            {
                reracasno = value;
            }
        }
        public string Reracaseyear
        {
            get
            {
                return reracaseyear;
            }

            set
            {
                reracaseyear = value;
            }
        }
        public string ReraRefNo
        {
            get
            {
                return reraRefNo;
            }

            set
            {
                reraRefNo = value;
            }
        }



    }


}