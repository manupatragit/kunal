using System.Collections.Generic;

namespace LawPracticeFirm.Controllers
{
    public class caldata
    {
        public int id { get; internal set; }
        public string text { get; internal set; }
        public string start_date { get; internal set; }
        public string end_date { get; internal set; }
        public string type { get; internal set; }
        public string HearingType { get; internal set; }
        
    }
    public class caldatalist : List<caldata>
    {
        public caldatalist()
        {

        }
    }

    public class User
    {
        internal string vCourt;

        public string name { get; internal set; }

    }
    public class Userlist : List<User>
    {
        public string name { get; internal set; }

    }
    public class CalendarEventByAllUserLawPracticeList
    {
        public int iid { get; internal set; }
        public string showstatus { get; internal set; }
        public string vorderDateFinal { get; internal set; }
        public string vorderDateFinal1 { get; internal set; }
        public string vCaseName { get; internal set; }
        public string vAdvocateName { get; internal set; }
        public string casetype1 { get; internal set; }
        public string casetype { get; internal set; }
        public string vStatus { get; internal set; }
        public string vCaseid { get; internal set; }
        public string vCaseType { get; internal set; }
        public string vCaseNo { get; internal set; }
        public string vCaseYear { get; internal set; }
        public string vCourt { get; internal set; }
        public string vDisposedDate { get; internal set; }
        public string vLocalFile { get; internal set; }

    }
    public class NextHearingDateAllUserLawPracticeList
    {
        public int iid { get; internal set; }
        public string vordernexthearing { get; internal set; }
        public string casetype { get; internal set; }
        public string vCaseType { get; internal set; }
        public string vCaseNo { get; internal set; }
        public string vCaseYear { get; internal set; }
        public string vCourt { get; internal set; }
        public string CourtNo { get; internal set; }
        public string DiaryNo { get; internal set; }
        public string dUpdateDate { get; internal set; }
        public string vCaseName { get; internal set; }
        public string vAdvocateName { get; internal set; }
        public string vNextHearing { get; internal set; }
        public string vStatus { get; internal set; }
        public int ifid { get; internal set; }
        public string vDisposedDate { get; internal set; }
        public string vActiveCaseType { get; internal set; }
        public string vActiveBench { get; internal set; }
        public string vbench { get; internal set; }
        public string vside { get; internal set; }
        public string vActiveside { get; internal set; }
        public string vManuid { get; internal set; }
        public string vorderDateFinal { get; internal set; }
        public string vdel { get; internal set; }
        public string vDistrict { get; internal set; }
        public string vCourtCompEstbType { get; internal set; }
        public string vCourtCompEstbCourt { get; internal set; }
        public string iDistrictType { get; internal set; }
        public string IsManualNextHearing { get; internal set; }

    }
    public class CalendarData
    {
        public int iid { get; internal set; }
        public string showstatus  { get; internal set; }
        public string vorderDateFinal { get; internal set; }
        public string vorderDateFinal1 { get; internal set; }
        public string vCaseName { get; internal set; }
        public string vAdvocateName { get; internal set; }
        public string casetype1 { get; internal set; }
        public string casetype { get; internal set; }
        public string vStatus { get; internal set; }
        public string vCaseid { get; internal set; }
        public string Casetype { get; internal set; }
        public string CaseNo { get; internal set; }
        public string Caseyear { get; internal set; }
        public string Court { get; internal set; }
        public string Disposeddt { get; internal set; }
        public string vLocalFile { get; internal set; }
        public string start_date { get; internal set; }
        public string HearingType { get; internal set; }
    }
}