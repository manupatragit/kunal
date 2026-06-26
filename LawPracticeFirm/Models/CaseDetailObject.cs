using System.Collections.Generic;

namespace NJDGDetail.Models
{
    /// <summary>
    /// Case detail object
    /// </summary>
    public class CaseDetailObject
    {
        public string caseid { get; set; }
        public string vNotesId { get; set; }
        private string csno = "";
        private string court = "";
        private string courtno = "";
        private string nexthearing = "";
        private int iid = 0;
        private string diaryno = "";
        private string vcasename = "";
        private string benchname = "";
        private string advname = "";
        private string disposeddt = "";
        private string status = "";

        private string orderdt = "";
        private string file = "";
        private string localfile = "";
        private string showstatus = "";
        private string courtname = "";
        private string notes = "";
        private string document = "";
        private string orderdateFinal = "";
        public string Csno
        {
            get
            {
                return csno;
            }
            set
            {
                csno = value;
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
                return vcasename;
            }
            set
            {
                vcasename = value;
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
        public string Advname
        {
            get
            {
                return advname;
            }
            set
            {
                advname = value;
            }
        }
        public string Disposeddt
        {
            get
            {
                return disposeddt;
            }
            set
            {
                disposeddt = value;
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
        public string Courtno
        {
            get
            {
                return courtno;
            }
            set
            {
                courtno = value;
            }
        }
        public string Nexthearing
        {
            get
            {
                return nexthearing;
            }
            set
            {
                nexthearing = value;
            }
        }

        public string Orderdt
        {
            get
            {
                return orderdt;
            }
            set
            {
                orderdt = value;
            }
        }
        public string File
        {
            get
            {
                return file;
            }
            set
            {
                file = value;
            }
        }
        public string Localfile
        {
            get
            {
                return localfile;
            }
            set
            {
                localfile = value;
            }
        }
        public string Showstatus
        {
            get
            {
                return showstatus;
            }
            set
            {
                showstatus = value;
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

        public string Notes
        {
            get
            {
                return notes;
            }
            set
            {
                notes = value;
            }
        }

        public string Document
        {
            get
            {
                return document;
            }
            set
            {
                document = value;
            }
        }
        public string OrderdateFinal
        {
            get
            {
                return orderdateFinal;
            }
            set
            {
                orderdateFinal = value;
            }
        }

    }

    public class CaseDetailObjectList : List<CaseDetailObject>
    {
        public CaseDetailObjectList()
        { }
    }

}