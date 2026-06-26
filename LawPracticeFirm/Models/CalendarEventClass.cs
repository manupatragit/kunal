using System;
using System.Collections.Generic;

namespace NJDGDetail.Models
{
    /// <summary>
    /// Calendar event details
    /// </summary>
    public class CalendarEventClass
    {
        #region Variables
        #region Private variables
        string username="";
        int eventId = 0;
        string startdate = "";
        string enddate = "";
        string eventtext = "";
        int userId = 0;
        int courseId = 0;
        int createdBy = 0;
        int isShow = 0;
        DateTime createdDate = Convert.ToDateTime("1900/01/01");
        int isAutocreated = 0;
        string courseName = "";
        string showstatus = "";
        int count = 0;
        string caseid = "";
        string caseno = "";
        string casetype = "";
        string caseyear = "";
        string court = "";
        string disposeddt = "";
        string localfile = "";
        DateTime finaldate = Convert.ToDateTime("1900/01/01");
        DateTime lastfinaldate = Convert.ToDateTime("1900/01/01");
        string casename = "";
        string advname = "";
        #endregion
        #endregion
        #region Properties
        public int id
        {
            get { return eventId; }
            set { eventId = value; }
        }
        public string start_date
        {
            get { return startdate; }
            set { startdate = value; }
        }
        public string username_
        {
            get { return username; }
            set { username = value; }
        }
        public string Showstatus
        {
            get { return showstatus; }
            set { showstatus = value; }
        }
        public string end_date
        {
            get { return enddate; }
            set { enddate = value; }
        }
        public string text
        {
            get { return eventtext; }
            set { eventtext = value; }
        }
        public int UserId
        {
            get { return userId; }
            set { userId = value; }
        }
        public int CourseId
        {
            get { return courseId; }
            set { courseId = value; }
        }
        public int CraetedBy
        {
            get { return createdBy; }
            set { createdBy = value; }
        }
        public int IsShow
        {
            get { return isShow; }
            set { isShow = value; }
        }
        public DateTime CreatedDate
        {
            get { return createdDate; }
            set { createdDate = value; }
        }
        public int IsAutocreated
        {
            get { return isAutocreated; }
            set { isAutocreated = value; }
        }
        public string CourseName
        {
            get { return courseName; }
            set { courseName = value; }
        }
        public string EventDetail
        {
            get
            {
                if (eventId != 0)
                {
                    return string.Format("{0}, {1} - {2}", startdate, enddate, eventtext);
                }
                else
                    return null;
            }
        }
        public int Count
        {
            get { return count; }
            set { count = value; }
        }
        public string Caseid
        {
            get { return caseid; }
            set { caseid = value; }
        }
        public string Casetype
        {
            get { return casetype; }
            set { casetype = value; }
        }
        public string CaseNo
        {
            get { return caseno; }
            set { caseno = value; }
        }
        public string Caseyear
        {
            get { return caseyear; }
            set { caseyear = value; }
        }
        public string Court
        {
            get { return court; }
            set { court = value; }
        }
        public string Disposeddt
        {
            get { return disposeddt; }
            set { disposeddt = value; }
        }
        public string Localfile
        {
            get { return localfile; }
            set { localfile = value; }
        }
        public DateTime Finaldate
        {
            get { return finaldate; }
            set { finaldate = value; }
        }
        public DateTime LastFinaldate
        {
            get { return lastfinaldate; }
            set { lastfinaldate = value; }
        }
        public string Casename
        {
            get { return casename; }
            set { casename = value; }
        }
        public string Advname
        {
            get { return advname; }
            set { advname = value; }
        }
        #endregion
    }
    public class EventList : List<CalendarEventClass>
    {
        public EventList()
        {
        }
        public string VorderDate { get; internal set; }
        public string VLocalFile { get; internal set; }
        public string VStatus { get; internal set; }
        public string VNextHearing { get; internal set; }
        public CalendarEventClass GetCalendarEventById(int eventId)
        {
            foreach (CalendarEventClass ce in this)
            {
                if (ce.id == eventId)
                    return ce;
            }
            return new CalendarEventClass();
        }
    }
}