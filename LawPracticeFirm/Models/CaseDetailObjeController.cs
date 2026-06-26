using NJDGDetail.BAL;
using NJDGDetail.DAL;
using System;
using System.Data.SqlClient;

namespace NJDGDetail.Models
{
    /// <summary>
    /// Case Detail Object Controller
    /// </summary>
    public class CaseDetailObjeController
    {
        static int iidIndex = 0;
        static int csnoIndex = 0;
        static int courtIndex = 0;
        static int courtnoIndex = 0;
        static int diarynoIndex = 0;
        static int casenameIndex = 0;
        static int benchnameIndex = 0;
        static int advnameIndex = 0;
        static int nexthearingIndex = 0;
        static int disposeddtIndex = 0;
        static int statusIndex = 0;
        static int OrderdtInex = 0;
        static int OrderfinalIndex = 0;
        public static int StatusIndex { get; private set; }
        static int FileIndex = 0;
        static int LocalfileIndex = 0;
        static int ShowstatusIndex = 0;
        static int CourtNameIndex = 0;
        static int NotesIndex = 0;
        static int DocumentIndex = 0;
        static bool isInitialized = false;
        private static bool InitializeAddCourtIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    csnoIndex = reader.GetOrdinal("csno");
                    courtIndex = reader.GetOrdinal("vcourt");
                    courtnoIndex = reader.GetOrdinal("courtno");
                    diarynoIndex = reader.GetOrdinal("diaryno");
                    casenameIndex = reader.GetOrdinal("vcasename");
                    benchnameIndex = reader.GetOrdinal("BenchName");
                    advnameIndex = reader.GetOrdinal("vadvocatename");
                    nexthearingIndex = reader.GetOrdinal("vnexthearing");
                    disposeddtIndex = reader.GetOrdinal("vDisposedDate");
                    statusIndex = reader.GetOrdinal("vStatus");
                    CourtNameIndex = reader.GetOrdinal("vCourtName");
                    OrderfinalIndex = reader.GetOrdinal("vorderDateFinal");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        private static CaseDetailObject ReadAddCourtNameData(SqlDataReader reader)
        {
            CaseDetailObject casedt = new CaseDetailObject();
            if (reader.GetValue(iidIndex) != DBNull.Value)
            {
                casedt.Iid = reader.GetInt32(iidIndex);
            }
            else
            {
                casedt.Iid = 0;
            }
            casedt.Csno= reader.GetString(csnoIndex);
            casedt.Court = reader.GetString(courtIndex);
            if (reader.GetValue(diarynoIndex) != DBNull.Value)
            {
                casedt.Diaryno = reader.GetString(diarynoIndex);
            }
            else
            {
                casedt.Diaryno = "";
            }
            if (reader.GetValue(casenameIndex) != DBNull.Value)
            {
                casedt.Casename = reader.GetString(casenameIndex);
            }
            else
            {
                casedt.Casename = "";
            }
            if (reader.GetValue(benchnameIndex) != DBNull.Value)
            {
                casedt.Benchname = reader.GetString(benchnameIndex);
            }
            else
            {
                casedt.Benchname = "";
            }
            if (reader.GetValue(advnameIndex) != DBNull.Value)
            {
                casedt.Advname = reader.GetString(advnameIndex);
            }
            else
            {
                casedt.Advname = "";
            }
            if (reader.GetValue(courtnoIndex) != DBNull.Value)
            {
                casedt.Courtno = reader.GetString(courtnoIndex);
            }
            else
            {
                casedt.Courtno = "";
            }
            if (reader.GetValue(nexthearingIndex) != DBNull.Value)
            {
                casedt.Nexthearing = reader.GetString(nexthearingIndex);
            }
            else
            {
                casedt.Nexthearing = "";
            }
            if (reader.GetValue(disposeddtIndex) != DBNull.Value)
            {
                casedt.Disposeddt = reader.GetString(disposeddtIndex);
            }
            else
            {
                casedt.Disposeddt = "";
            }
            if (reader.GetValue(statusIndex) != DBNull.Value)
            {
                casedt.Status = reader.GetString(statusIndex);
            }
            else
            {
                casedt.Status = "";
            }
            if (reader.GetValue(CourtNameIndex) != DBNull.Value)
            {
                casedt.Courtname = reader.GetString(CourtNameIndex);
            }
            else
            {
                casedt.Courtname = "";
            }
            if (reader.GetValue(OrderfinalIndex) != DBNull.Value)
            {
                casedt.OrderdateFinal = reader.GetString(OrderfinalIndex);
            }
            else
            {
                casedt.OrderdateFinal = "";
            }
            return casedt;
        }
        public static CaseDetailObjectList GetMasterCaseData(string crtid,string usename)
        {
            CaseDetailObjectList courtnamel = new CaseDetailObjectList();
            SqlParameter[] param=new SqlParameter[2];
            param[0] = new SqlParameter("@court", crtid);
            param[1] = new SqlParameter("@username", usename);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetMasterCaseData, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddCourtIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddCourtNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        public static CaseDetailObjectList GetMasterCaseDataLawPractice( string username, string crtid, string iid)
        {
            CaseDetailObjectList courtnamel = new CaseDetailObjectList();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@court", crtid);
            param[1] = new SqlParameter("@username", username);
            param[2] = new SqlParameter("@iid", iid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetMasterCaseDataLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeAddCourtIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadAddCourtNameData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        private static bool InitializeShowFullCaseIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    OrderdtInex = reader.GetOrdinal("vorderdate");
                    statusIndex = reader.GetOrdinal("vstatus");
                    nexthearingIndex = reader.GetOrdinal("vnexthearing");
                    FileIndex = reader.GetOrdinal("vfile");
                    LocalfileIndex = reader.GetOrdinal("vlocalfile");
                    ShowstatusIndex = reader.GetOrdinal("vshowstatus");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        private static CaseDetailObject ReadFullcaseDataData(SqlDataReader reader)
        {
            CaseDetailObject casedt = new CaseDetailObject();
            if (reader.GetValue(iidIndex) != DBNull.Value)
            {
                casedt.Iid = reader.GetInt32(iidIndex);
            }
            else
            {
                casedt.Iid = 0;
            }
            if (reader.GetValue(OrderdtInex) != DBNull.Value)
            {
                casedt.Orderdt = reader.GetString(OrderdtInex);
            }
            else
            {
                casedt.Orderdt = "";
            }
            if (reader.GetValue(statusIndex) != DBNull.Value)
            {
                casedt.Status = reader.GetString(statusIndex);
            }
            else
            {
                casedt.Status = "";
            }
            if (reader.GetValue(nexthearingIndex) != DBNull.Value)
            {
                casedt.Nexthearing = reader.GetString(nexthearingIndex);
            }
            else
            {
                casedt.Nexthearing = "";
            }
            if (reader.GetValue(FileIndex) != DBNull.Value)
            {
                casedt.File = reader.GetString(FileIndex);
            }
            else
            {
                casedt.File = "";
            }
            if (reader.GetValue(LocalfileIndex) != DBNull.Value)
            {
                casedt.Localfile = reader.GetString(LocalfileIndex);
            }
            else
            {
                casedt.Localfile = "";
            }
            if (reader.GetValue(ShowstatusIndex) != DBNull.Value)
            {
                casedt.Showstatus = reader.GetString(ShowstatusIndex);
            }
            else
            {
                casedt.Showstatus = "";
            }
            return casedt;
        }
        public static CaseDetailObjectList ShowFullCaseData(string crtid)
        {
            CaseDetailObjectList courtnamel = new CaseDetailObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", crtid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowFullCaseData, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeShowFullCaseIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadFullcaseDataData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        private static bool InitializeGetCaseNotesIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    NotesIndex = reader.GetOrdinal("vNotes");
                    OrderdtInex = reader.GetOrdinal("createddate");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        private static CaseDetailObject ReadCaseNotesData(SqlDataReader reader)
        {
            CaseDetailObject casedt = new CaseDetailObject();
            if (reader.GetValue(iidIndex) != DBNull.Value)
            {
                casedt.Iid = reader.GetInt32(iidIndex);
            }
            else
            {
                casedt.Iid = 0;
            }
            if (reader.GetValue(NotesIndex) != DBNull.Value)
            {
                casedt.Notes = reader.GetString(NotesIndex);
            }
            else
            {
                casedt.Notes = "";
            }
            if (reader.GetValue(OrderdtInex) != DBNull.Value)
            {
                casedt.Orderdt = reader.GetString(OrderdtInex);
            }
            else
            {
                casedt.Orderdt = "";
            }
            return casedt;
        }
        public static CaseDetailObjectList GetCaseNotesData(string iid)
        {
            CaseDetailObjectList courtnamel = new CaseDetailObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", iid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCaseNotesDetails, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetCaseNotesIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadCaseNotesData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        private static bool InitializeGetCaseUploadDocumentIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    iidIndex = reader.GetOrdinal("iid");
                    DocumentIndex = reader.GetOrdinal("vuploadDocument");
                    OrderdtInex = reader.GetOrdinal("createddate");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        private static CaseDetailObject ReadCaseUploadDocumentData(SqlDataReader reader)
        {
            CaseDetailObject casedt = new CaseDetailObject();
            if (reader.GetValue(iidIndex) != DBNull.Value)
            {
                casedt.Iid = reader.GetInt32(iidIndex);
            }
            else
            {
                casedt.Iid = 0;
            }
            if (reader.GetValue(DocumentIndex) != DBNull.Value)
            {
                casedt.Document = reader.GetString(DocumentIndex);
            }
            else
            {
                casedt.Document = "";
            }
            if (reader.GetValue(OrderdtInex) != DBNull.Value)
            {
                casedt.Orderdt = reader.GetString(OrderdtInex);
            }
            else
            {
                casedt.Orderdt = "";
            }
            return casedt;
        }
        public static CaseDetailObjectList GetCaseUploadData(string iid)
        {
            CaseDetailObjectList courtnamel = new CaseDetailObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", iid);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetCaseUploadDetails, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeGetCaseUploadDocumentIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadCaseUploadDocumentData(reader));
                        }
                        isInitialized = false;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return courtnamel;
        }
        public static CaseDetailObjectList GetCaseOrderById(string Id)
        {
            CaseDetailObjectList eventList = new CaseDetailObjectList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", Id);
            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.ShowFullCaseData, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeOrderIndex(reader))
                    {
                        while (reader.Read())
                        {
                            eventList.Add(ReadOrderData(reader));
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
        private static bool InitializeOrderIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    OrderdtInex = reader.GetOrdinal("vorderDateFinal");
                    StatusIndex = reader.GetOrdinal("vstatus");
                    LocalfileIndex = reader.GetOrdinal("vlocalfile");
                    ShowstatusIndex = reader.GetOrdinal("vShowStatus");
                    isInitialized = true;
                }
                return true;
            }
            return false;
        }
        private static CaseDetailObject ReadOrderData(SqlDataReader reader)
        {
            CaseDetailObject casedt = new CaseDetailObject();
            if (reader.GetValue(OrderdtInex) != DBNull.Value)
            {
                if (reader.GetString(OrderdtInex) != "01-01-1900" && reader.GetString(OrderdtInex) != "01 Jan 1900")
                {
                    casedt.Orderdt = reader.GetString(OrderdtInex);
                }
                else
                {
                    casedt.Orderdt = "";
                }
            }
            else
            {
                casedt.Orderdt = "";
            }
            if (reader.GetValue(StatusIndex) != DBNull.Value)
            {
                casedt.Status = reader.GetString(StatusIndex);
            }
            else
            {
                casedt.Status = "";
            }
            if (reader.GetValue(LocalfileIndex) != DBNull.Value)
            {
                casedt.Localfile = reader.GetString(LocalfileIndex);
            }
            else
            {
                casedt.Localfile = "";
            }
            if (reader.GetValue(ShowstatusIndex) != DBNull.Value)
            {
                casedt.Showstatus = reader.GetString(ShowstatusIndex);
            }
            else
            {
                casedt.Showstatus = "";
            }
            return casedt;
        }
    }
}