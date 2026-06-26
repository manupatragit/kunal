using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using NJDGDetail.DAL;
using NJDGDetail.BAL;
using System.Web.Mvc;

namespace NJDGDetail.Models
{
    /// <summary>
    /// Cause list object
    /// </summary>
    public class CauselistobjectController 
    {
        static int causelistiidIndex = 0;
        static int masteriidIndex = 0;
        static int iidIndex = 0;
        static int benchIndex = 0;
        static int casetypeIndex = 0;
        static int courtIndex = 0;
        static int useridIndex = 0;
        static int mailIndex = 0;
        static int totalcountIndex = 0;
        static int totalmemberIndex = 0;
        static int mobileIndex = 0;
        static int EntrydateIndex = 0;
        static int totalcaseIndex = 0;
        static int causelistsdataindex = 0;
        static bool isInitialized = false;
        /// <summary>
        /// Initialize License Index
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static bool InitializeLicenseIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    benchIndex = reader.GetOrdinal("vbench");

                    isInitialized = true;

                }
                return true;
            }
            return false;
        }

        private static CauelistObj ReadCauselistBenchData(SqlDataReader reader)
        {
            CauelistObj causelistbench = new CauelistObj();


            if (reader.GetValue(iidIndex) != DBNull.Value)
            {
                causelistbench.Bench = reader.GetString(benchIndex);
            }
            else
            {
                causelistbench.Bench = "";
            }



            return causelistbench;
        }

        
       
        private static bool InitializeCauselistDataIndex(SqlDataReader reader)
        {
            if (reader.HasRows)
            {
                if (!isInitialized)
                {
                    causelistiidIndex = reader.GetOrdinal("causlistid");
                    masteriidIndex = reader.GetOrdinal("masteriid");
                    casetypeIndex = reader.GetOrdinal("masterappealno");
                    causelistsdataindex = reader.GetOrdinal("Filetext");
                    courtIndex = reader.GetOrdinal("Courtname");
                    benchIndex = reader.GetOrdinal("Benchname");
                    EntrydateIndex = reader.GetOrdinal("vCauselistDate");

                    //casetypeIndex = reader.GetOrdinal("vcasetype");
                    //causelistsdataindex = reader.GetOrdinal("vcaseno");
                    //courtIndex = reader.GetOrdinal("vcourt");
                    //benchIndex = reader.GetOrdinal("vbench");
                    //EntrydateIndex = reader.GetOrdinal("vcaseyear");
                  
                    
                    isInitialized = true;

                }
                return true;
            }
            return false;
        }
        /// <summary>
        /// Read Cause list Data by User
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static CauelistObj ReadCauselistDatabyUser(SqlDataReader reader)
        {
            CauelistObj casedt = new CauelistObj();

        
            if (reader.GetValue(casetypeIndex) != DBNull.Value)
            {
                casedt.Casename = reader.GetString(casetypeIndex);
            }
            else
            {
                casedt.Casename = "";
            }
            if (reader.GetValue(causelistsdataindex) != DBNull.Value)
            {
                casedt.Filetext = reader.GetString(causelistsdataindex);
            }
            else
            {
                casedt.Filetext = "";
            }
            if (reader.GetValue(courtIndex) != DBNull.Value)
            {
                casedt.CourtId = reader.GetString(courtIndex);
            }
            else
            {
                casedt.CourtId = "";
            }
            if (reader.GetValue(benchIndex) != DBNull.Value)
            {
                casedt.Bench = reader.GetString(benchIndex);
            }
            else
            {
                casedt.Bench = "";
            }
            if (reader.GetValue(EntrydateIndex) != DBNull.Value)
            {
                casedt.Causelistdate = reader.GetString(EntrydateIndex);
            }
            else
            {
                casedt.Causelistdate = "";
            }
            if (reader.GetValue(causelistiidIndex) != DBNull.Value)
            {
                casedt.Causelistiid = reader.GetInt32(causelistiidIndex);
            }
            else
            {
                casedt.Causelistiid = 0;
            }
            if (reader.GetValue(masteriidIndex) != DBNull.Value)
            {
                casedt.Masteriid = reader.GetInt32(masteriidIndex);
            }
            else
            {
                casedt.Masteriid = 0;
            }
          
            return casedt;
        }

        /// <summary>
        /// Get Cause list Data by Admin
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static CauelistObjList GetCauselistDatabyAdmin(string caseid)
        {
            CauelistObjList courtnamel = new CauelistObjList();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@caseid", caseid);


            using (SqlDataReader reader = SqlDbDAL.GetDataReaderSP(SpNames.GetTotalCauselistbyUserAdminLawPractice, param))
            {
                try
                {
                    isInitialized = false;
                    if (InitializeCauselistDataIndex(reader))
                    {
                        while (reader.Read())
                        {
                            courtnamel.Add(ReadCauselistDatabyUser(reader));
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
      
    }
}
