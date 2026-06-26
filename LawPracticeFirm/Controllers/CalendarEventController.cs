using LawPracticeFirm.Controllers;
using NJDGDetail.BAL;
using NJDGDetail.DAL;
using NJDGDetail.Models;
using System;
using System.Data.SqlClient;
using System.Web.Mvc;

namespace NJDGDetail.Controllers
{
    public class CalendarEventController : Controller
    {
        static int idIndex = 0;
        static int startdateIndex = 0;
        static int enddateIndex = 0;
        static int textIndex = 0;
        static int useridIndex = 0;
        static int courseidIndex = 0;
        static int createdbyIndex = 0;
        static int isshowIndex = 0;
        static int createddateIndex = 0;
        static int isautocreatedIndex = 0;
        static int coursenameIndex = 0;
        static int showstatusIndex = 0;
        static int usernameIndex = 0;
        static int orderdatefinalIndex = 0;
        static int cntIndex = 0;
        static int caseidIndex = 0;
        static int casetypeIndex = 0;
        static int casenoIndex = 0;
        static int caseyearIndex = 0;
        static int courtIndex = 0;
        static int localfileIndex = 0;
        static int disposeddtIndex = 0;
        static int casenameIndex = 0;
        static int advnameIndex = 0;
        static int casetypenexthearingIndex = 0;
        static int caseyearnexthearingIndex = 0;
        static int casenonexthearingIndex = 0;
        static int disposeddtnexthearingIndex = 0;
        static int casenamenexthearingIndex = 0;
        static int advnamenexthearingIndex = 0;
        static bool isInitialized = false;
        #region Private static methods
        /// <summary>
        /// Initialize index of vorder start and end date, vlocal file, case name and status
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    startdateIndex = reader.GetOrdinal("vorderDateFinal");
                    enddateIndex = reader.GetOrdinal("vorderDateFinal");
                    textIndex = reader.GetOrdinal("vLocalFile");
                    coursenameIndex = reader.GetOrdinal("vCaseName");
                    showstatusIndex = reader.GetOrdinal("vshowstatus");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        #endregion
        #region Public static methods
        /// <summary>
        /// Read data from calender
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadData(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = reader.GetInt32(idIndex);
            if (reader.GetValue(startdateIndex) != DBNull.Value)
            {
                ce.start_date = reader.GetString(startdateIndex);
            }
            if (reader.GetValue(enddateIndex) != DBNull.Value)
            {
                ce.end_date = reader.GetString(enddateIndex);
            }
            if (reader.GetValue(textIndex) != DBNull.Value)
            {
                ce.text = reader.GetString(textIndex);
            }
            else
            {
                ce.text = "";
            }
            if (reader.GetValue(coursenameIndex) != DBNull.Value)
            {
                ce.CourseName = reader.GetString(coursenameIndex);
            }
            else
            {
                ce.CourseName = "";
            }
            if (reader.GetValue(showstatusIndex) != DBNull.Value)
            {
                ce.Showstatus = reader.GetString(showstatusIndex);
            }
            else
            {
                ce.Showstatus = "";
            }
            return ce;
        }
        /// <summary>
        /// Get calender event by user id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserId(string Id)
        {
            EventList eventList = new EventList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", Id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowFullCaseData, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList.Add(ReadData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList;
        }
        /// <summary>
        /// Initialize index of user name
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeByUsernameIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    startdateIndex = reader.GetOrdinal("vorderDateFinal");
                    enddateIndex = reader.GetOrdinal("vorderDateFinal");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read calender data by user name
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataByUsername(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = Convert.ToInt32(reader.GetInt64(idIndex));
            if (reader.GetValue(startdateIndex) != DBNull.Value)
            {
                ce.start_date = reader.GetString(startdateIndex);
            }
            if (reader.GetValue(enddateIndex) != DBNull.Value)
            {
                ce.end_date = reader.GetString(enddateIndex);
            }
            return ce;
        }
        /// <summary>
        /// Get all calender event details by user name
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserName(string username)
        {
            EventList eventList = new EventList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@username", username);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowFullCaseDataByUsername, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByUsernameIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList.Add(ReadDataByUsername(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList;
        }
        /// <summary>
        /// Initialize full index by user name
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeByUsernameFullIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    startdateIndex = reader.GetOrdinal("vorderDateFinal");
                    enddateIndex = reader.GetOrdinal("vorderDateFinal");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read full data by user name
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataByUsernameFull(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = Convert.ToInt32(reader.GetInt64(idIndex));
            if (reader.GetValue(startdateIndex) != DBNull.Value)
            {
                ce.start_date = reader.GetString(startdateIndex);
            }
            if (reader.GetValue(enddateIndex) != DBNull.Value)
            {
                ce.end_date = reader.GetString(enddateIndex);
            }
            return ce;
        }
        /// <summary>
        /// Initialize case user date full index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeByCaseUserDateFullIndextmp(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    orderdatefinalIndex = reader.GetOrdinal("vorderDateFinal1");
                    textIndex = reader.GetOrdinal("vCaseName");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Initialize by case user date by full index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeByCaseUserDateFullIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    caseidIndex = reader.GetOrdinal("vCaseid");
                    casetypeIndex = reader.GetOrdinal("casetype");
                    caseyearIndex = reader.GetOrdinal("vCaseYear");
                    casenoIndex = reader.GetOrdinal("vcaseno");
                    disposeddtIndex = reader.GetOrdinal("vDisposedDate");
                    localfileIndex = reader.GetOrdinal("vlocalFile");
                    courtIndex = reader.GetOrdinal("vCourt");
                    orderdatefinalIndex = reader.GetOrdinal("vOrderdateFinal1");
                    casenameIndex = reader.GetOrdinal("vCaseName");
                    advnameIndex = reader.GetOrdinal("vAdvocateName");
                    showstatusIndex = reader.GetOrdinal("showstatus");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read data by case user date
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataByCaseUserDateFullFulltmp(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            // ce.id = reader.GetInt32(idIndex);
            if (reader.GetValue(idIndex) != DBNull.Value)
            {
                ce.id = reader.GetInt32(idIndex);
            }
            if (reader.GetValue(orderdatefinalIndex) != DBNull.Value)
            {
                ce.start_date = reader.GetString(orderdatefinalIndex);
            }
            if (reader.GetValue(textIndex) != DBNull.Value)
            {
                ce.text = reader.GetString(textIndex);
            }
            return ce;
        }
        /// <summary>
        /// Read complete data by case user date 
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataByCaseUserDateFullFull(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = reader.GetInt32(idIndex);
            if (reader.GetValue(casetypeIndex) != DBNull.Value)
            {
                //ce.id = Convert.ToInt32(reader.GetString(caseidIndex));
            }
            if (reader.GetValue(casetypeIndex) != DBNull.Value)
            {
                ce.Casetype = reader.GetString(casetypeIndex);
            }
            if (reader.GetValue(casenoIndex) != DBNull.Value)
            {
                ce.CaseNo = reader.GetString(casenoIndex);
            }
            if (reader.GetValue(caseyearIndex) != DBNull.Value)
            {
                ce.Court = reader.GetString(courtIndex);
            }
            if (reader.GetValue(caseyearIndex) != DBNull.Value)
            {
                ce.Caseyear = reader.GetString(caseyearIndex);
            }
            if (reader.GetValue(disposeddtIndex) != DBNull.Value)
            {
                ce.Disposeddt = reader.GetString(disposeddtIndex);
            }
            if (ce.Disposeddt == " " || ce.Disposeddt == "")
            {
                if (reader.GetValue(orderdatefinalIndex) != DBNull.Value)
                {
                    ce.Disposeddt = reader.GetString(orderdatefinalIndex);
                }
            }
            if (reader.GetValue(localfileIndex) != DBNull.Value)
            {
                ce.Localfile = reader.GetString(localfileIndex);
            }
            if (reader.GetValue(orderdatefinalIndex) != DBNull.Value)
            {
                string startdate = reader.GetString(orderdatefinalIndex);
                ce.start_date = reader.GetString(orderdatefinalIndex);
            }
            if (reader.GetValue(casenameIndex) != DBNull.Value)
            {
                ce.Casename = reader.GetString(casenameIndex);
            }
            if (reader.GetValue(advnameIndex) != DBNull.Value)
            {
                ce.Advname = reader.GetString(advnameIndex);
            }
            if (reader.GetValue(showstatusIndex) != DBNull.Value)
            {
                ce.Showstatus = reader.GetString(showstatusIndex);
            }
            return ce;
        }
        /// <summary>
        /// Get calender event by assign user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserName1Assign(string username, string date)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowMasterCaseBYUserNameAssign, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFull(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Get next hearing district by assign user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetDistinctNextHearingByUserAssign(string username, string date)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDateAssign, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeDistinctNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDistinctDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Get all next hearing by assign user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetNextHearingByUserAssign(string username, string date)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDateAssign, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Get calender event by assign user name
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserName1(string username, string date)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowMasterCaseBYUserNameLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFull(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Get calender event user name in model popup
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <param name="matterid"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserName1Popup(string username, string date, string matterid)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            param[2] = new SqlParameter("@casemasterifid", matterid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowMasterCaseBYUserNamePopup, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFull(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Show master case details by user name
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList ShowMasterCaseBYUserNametmp(string username, string date)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowMasterCaseBYUserName, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndextmp(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFulltmp(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Initialize count by user name index in calender
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeCountByUsernameIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    orderdatefinalIndex = reader.GetOrdinal("vorderDateFinal1");
                    cntIndex = reader.GetOrdinal("cnt");
                    useridIndex = reader.GetOrdinal("vusername");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read data count by assign username
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataCountByUsername(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            if (reader.GetValue(cntIndex) != DBNull.Value)
            {
                ce.Count = reader.GetInt32(cntIndex);
            }
            if (reader.GetValue(orderdatefinalIndex) != DBNull.Value)
            {
                ce.Disposeddt = reader.GetString(orderdatefinalIndex);
            }
            if (reader.GetValue(useridIndex) != DBNull.Value)
            {
                ce.username_ = reader.GetString(useridIndex);
            }
            return ce;
        }
        /// <summary>
        /// Initialize get username by case id in law practice index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeGetUserNameByCaseIdLawPracticeIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    useridIndex = reader.GetOrdinal("vusername");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read data get username by case id
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static User ReadDataGetUserNameByCaseIdLawPracticee(SqlDataReader reader)
        {
            User struser = new User();
            if (reader.GetValue(useridIndex) != DBNull.Value)
            {
                struser.name = reader.GetString(useridIndex);
            }
            return struser;
        }
        /// <summary>
        /// Get calender event by all user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="iflag"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByAllUser(string username, int iflag, string id)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@iflag", iflag);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCalendarEventByAllUserLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFull(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Get all user nexthearing date
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeNextHearingAllUser(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    casetypenexthearingIndex = reader.GetOrdinal("casetype");
                    caseyearnexthearingIndex = reader.GetOrdinal("vCaseYear");
                    casenonexthearingIndex = reader.GetOrdinal("vcaseno");
                    disposeddtnexthearingIndex = reader.GetOrdinal("vordernexthearing");
                    casenamenexthearingIndex = reader.GetOrdinal("vCaseName");
                    advnamenexthearingIndex = reader.GetOrdinal("vAdvocateName");
                    courtIndex = reader.GetOrdinal("vCourt");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read next hearing data for all user
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataNextHearingAlluser(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = reader.GetInt32(idIndex);
            if (reader.GetValue(casetypenexthearingIndex) != DBNull.Value)
            {
                ce.Casetype = reader.GetString(casetypenexthearingIndex);
            }
            if (reader.GetValue(casenonexthearingIndex) != DBNull.Value)
            {
                ce.CaseNo = reader.GetString(casenonexthearingIndex);
            }
            if (reader.GetValue(caseyearnexthearingIndex) != DBNull.Value)
            {
                ce.Caseyear = reader.GetString(caseyearnexthearingIndex);
            }
            if (reader.GetValue(disposeddtnexthearingIndex) != DBNull.Value)
            {
                ce.Disposeddt = reader.GetString(disposeddtnexthearingIndex);
            }
            if (reader.GetValue(casenamenexthearingIndex) != DBNull.Value)
            {
                ce.CourseName = reader.GetString(casenamenexthearingIndex);
            }
            if (reader.GetValue(advnamenexthearingIndex) != DBNull.Value)
            {
                ce.Advname = reader.GetString(advnamenexthearingIndex);
            }
            if (reader.GetValue(courtIndex) != DBNull.Value)
            {
                ce.Court = reader.GetString(courtIndex);
            }
            return ce;
        }
        /// <summary>
        /// Get next hearing event for all user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="iflag"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList GetNextHearingEventByALLUser(string username, int iflag, string id)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@iflag", iflag);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetNextHearingDateAllUserLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingAllUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingAlluser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Count case by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public static EventList CountCaseBYUserName(string username)
        {
            EventList eventList = new EventList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@username", username);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.CountCaseBYUserName, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeCountByUsernameIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList.Add(ReadDataCountByUsername(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList;
        }
        /// <summary>
        /// Count case by assign user in law practice firm
        /// </summary>
        /// <param name="username"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList CountCaseBYUserNameAssignLawPractice(string username, string id)
        {
            EventList eventList = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.CountCaseBYUserNameAssignLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeCountByUsernameIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList.Add(ReadDataCountByUsername(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList;
        }
        /// <summary>
        /// Get username by case id in law practice firm
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static Userlist GetUserNameByCaseIdLawPractice(string userid)
        {
            Userlist userobjlist = new Userlist();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@id", userid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetUserNameByCaseIdLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetUserNameByCaseIdLawPracticeIndex(reader))
                    {
                        while (reader.Read())
                        {
                            userobjlist.Add(ReadDataGetUserNameByCaseIdLawPracticee(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return userobjlist;
        }
        /// <summary>
        /// Get calender event by assign username in law practice firm.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList GetCalendarEventByUserName1AssignLawPractice(string username, string date, string id)
        {
            EventList eventList1 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowMasterCaseBYUserNameAssignLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeByCaseUserDateFullIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList1.Add(ReadDataByCaseUserDateFullFull(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList1;
        }
        /// <summary>
        /// Get district wise next hearing date by assign user in law practice firm
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList GetDistinctNextHearingByUserAssignLawPractice(string username, string date, string id)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDateAssignLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeDistinctNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDistinctDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
       /// <summary>
       /// Get next hearing by assign user in law practice firm
       /// </summary>
       /// <param name="username"></param>
       /// <param name="date"></param>
       /// <param name="id"></param>
       /// <returns></returns>
        public static EventList GetNextHearingByUserAssignLawPractice(string username, string date, string id)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDateAssignLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
       /// <summary>
       /// Initialize next hearing date by username
       /// </summary>
       /// <param name="reader"></param>
       /// <returns></returns>
        private static bool InitializeNextHearingDateByUser(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    idIndex = reader.GetOrdinal("iid");
                    casetypenexthearingIndex = reader.GetOrdinal("casetype");
                    caseyearnexthearingIndex = reader.GetOrdinal("vCaseYear");
                    casenonexthearingIndex = reader.GetOrdinal("vcaseno");
                    disposeddtnexthearingIndex = reader.GetOrdinal("vordernexthearing");
                    casenamenexthearingIndex = reader.GetOrdinal("vCaseName");
                    advnamenexthearingIndex = reader.GetOrdinal("vAdvocateName");
                    courtIndex = reader.GetOrdinal("vCourt");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read next hearing data by user for calender
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDataNextHearingByUser(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            ce.id = reader.GetInt32(idIndex);
            if (reader.GetValue(casetypenexthearingIndex) != DBNull.Value)
            {
                ce.Casetype = reader.GetString(casetypenexthearingIndex);
            }
            if (reader.GetValue(casenonexthearingIndex) != DBNull.Value)
            {
                ce.CaseNo = reader.GetString(casenonexthearingIndex);
            }
            if (reader.GetValue(caseyearnexthearingIndex) != DBNull.Value)
            {
                ce.Caseyear = reader.GetString(caseyearnexthearingIndex);
            }
            if (reader.GetValue(disposeddtnexthearingIndex) != DBNull.Value)
            {
                ce.Disposeddt = reader.GetString(disposeddtnexthearingIndex);
            }
            if (reader.GetValue(casenamenexthearingIndex) != DBNull.Value)
            {
                ce.CourseName = reader.GetString(casenamenexthearingIndex);
                ce.Casename = reader.GetString(casenamenexthearingIndex);
            }
            if (reader.GetValue(advnamenexthearingIndex) != DBNull.Value)
            {
                ce.Advname = reader.GetString(advnamenexthearingIndex);
            }
            if (reader.GetValue(courtIndex) != DBNull.Value)
            {
                ce.Court = reader.GetString(courtIndex);
            }
            return ce;
        }
        /// <summary>
        /// Get next hearing detail by username in law practice for showing in popup
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList GetNextHearingByUserLawPracticePopup(string username, string date, string id)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            param[2] = new SqlParameter("@casemasterifid", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDateLawPracticePopup, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Get nexthearing details by username
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetNextHearingByUser(string username, string date)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDate, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Initialize district wise nexthearing date by username
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeDistinctNextHearingDateByUser(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    disposeddtnexthearingIndex = reader.GetOrdinal("vordernexthearing");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Get district wise next hearing date by username
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CalendarEventClass ReadDistinctDataNextHearingByUser(SqlDataReader reader)
        {
            CalendarEventClass ce = new CalendarEventClass();
            if (reader.GetValue(disposeddtnexthearingIndex) != DBNull.Value)
            {
                ce.Disposeddt = reader.GetString(disposeddtnexthearingIndex);
            }
            return ce;
        }
        /// <summary>
        /// Get district wise next hearing date by username and selected date
        /// </summary>
        /// <param name="username"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        public static EventList GetDistinctNextHearingByUser(string username, string date)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@username", username);
            param[1] = new SqlParameter("@date", date);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowNextHearingDate, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeDistinctNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDistinctDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        #endregion
        /// <summary>
        /// Get case details by case id in law practice firm
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public static EventList ShowGetCaseDetailByCaseIDLawPractice(long id)
        {
            EventList eventList2 = new EventList();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@id", id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowGetCaseDetailByCaseIDLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeNextHearingDateByUser(reader))
                    {
                        while (reader.Read())
                        {
                            eventList2.Add(ReadDataNextHearingByUser(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return eventList2;
        }
        /// <summary>
        /// Get case details by case id and user id
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static Userlist GetCaseDataByCaseIdLawPractice(string userid)
        {
            Userlist userobjlist = new Userlist();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@id", userid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetUserNameByCaseIdLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetCasedataByCaseIdLawPracticeIndex(reader))
                    {
                        while (reader.Read())
                        {
                            userobjlist.Add(ReadDataGetCaseDataByCaseIdLawPracticee(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return userobjlist;
        }
        /// <summary>
        /// Get case detail by case id
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static User ReadDataGetCaseDataByCaseIdLawPracticee(SqlDataReader reader)
        {
            User struser = new User();
            //ce.id = Convert.ToInt32(reader.GetInt64(idIndex));
            if (reader.GetValue(useridIndex) != DBNull.Value)
            {
                struser.name = reader.GetString(useridIndex);
            }
            if (reader.GetValue(courtIndex) != DBNull.Value)
            {
                struser.vCourt = reader.GetString(courtIndex);
            }
            return struser;
        }
        /// <summary>
        /// Get case details by case id
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeGetCasedataByCaseIdLawPracticeIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    useridIndex = reader.GetOrdinal("vusername");
                    courtIndex = reader.GetOrdinal("vCourt");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
    }
}
