using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace NJDGDetail.DAL
{
    public enum CONNECTION_MODULE
    {
        REGULAR = 1,
    }

    public class SqlDbDAL
    {
        // public static string connStringServer = CryptorEngine.Decrypt(System.Configuration.ConfigurationManager.AppSettings["db_checksome"], true);

      //  public static string connStringServer = System.Configuration.ConfigurationManager.AppSettings["db_checksome"];
        public static string connStringServer = ConfigurationManager.ConnectionStrings["ApplicationContext"].ToString();

        public static string CWconnStringServer = ConfigurationManager.ConnectionStrings["db_checksome"].ToString();


        private static SqlConnection GetConnection(CONNECTION_MODULE module)
        {
            if (module == CONNECTION_MODULE.REGULAR)
            {
                return new SqlConnection(connStringServer);
            }
            return new SqlConnection(connStringServer);
        }
        private static SqlConnection GetCWConnection(CONNECTION_MODULE module)
        {
            if (module == CONNECTION_MODULE.REGULAR)
            {
                return new SqlConnection(CWconnStringServer);
            }
            return new SqlConnection(CWconnStringServer);
        }
        /* Get Data Table*/


        private static DataTable GetDataTable(string queryOrSP, SqlParameter[] param, CommandType comandType, SqlConnection sqlConn)
        {
            DataTable dt = new DataTable();
            using (SqlCommand sqlCmd = new SqlCommand(queryOrSP, sqlConn))
            {
                sqlCmd.CommandType = comandType;
                if (param != null)
                    sqlCmd.Parameters.AddRange(param);
                SqlDataAdapter sqlDA = new SqlDataAdapter(sqlCmd);
                sqlDA.Fill(dt);
                sqlCmd.Parameters.Clear();
            }
            return dt;
        }

        private static DataSet GetDataSet(string queryOrSP, SqlParameter[] param, CommandType comandType, SqlConnection sqlConn)
        {
            DataSet ds = new DataSet();
            using (SqlCommand sqlCmd = new SqlCommand(queryOrSP, sqlConn))
            {
                sqlCmd.CommandType = comandType;
                if (param != null)
                    sqlCmd.Parameters.AddRange(param);
                SqlDataAdapter sqlDA = new SqlDataAdapter(sqlCmd);
                sqlDA.Fill(ds);
                sqlCmd.Parameters.Clear();
            }
            return ds;
        }

        public static DataSet GetDataSetSP(string sqlSP, SqlParameter[] param)
        {
            return GetDataSet(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
       

        public static DataSet GetDataSetQuery(string sqlQuery, SqlParameter[] param)
        {
            return GetDataSet(sqlQuery, param, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static DataSet GetDataSetSP(string sqlSP, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataSet(sqlSP, param, CommandType.StoredProcedure, GetConnection(module));
        }

        public static DataSet GetDataSetQuery(string sqlQuery, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataSet(sqlQuery, param, CommandType.Text, GetConnection(module));
        }

        public static DataTable GetDataTableSP(string sqlSP, SqlParameter[] param)
        {
            return GetDataTable(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static DataTable GetDataTableQuery(string sqlQuery, SqlParameter[] param)
        {
            return GetDataTable(sqlQuery, param, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static DataTable GetDataTableSP(string sqlSP)
        {
            return GetDataTable(sqlSP, null, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static DataTable GetDataTableQuery(string sqlQuery)
        {
            return GetDataTable(sqlQuery, null, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static DataTable GetDataTableSP(string sqlSP, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataTable(sqlSP, param, CommandType.StoredProcedure, GetConnection(module));
        }
        public static DataTable GetDataTableQuery(string sqlQuery, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataTable(sqlQuery, param, CommandType.Text, GetConnection(module));
        }
        public static DataTable GetDataTableSP(string sqlSP, CONNECTION_MODULE module)
        {
            return GetDataTable(sqlSP, null, CommandType.StoredProcedure, GetConnection(module));
        }
        public static DataTable GetDataTableQuery(string sqlQuery, CONNECTION_MODULE module)
        {
            return GetDataTable(sqlQuery, null, CommandType.Text, GetConnection(module));
        }

        /* Execute Reader*/

        private static SqlDataReader GetDataReader(string queryOrSP, SqlParameter[] param, CommandType comandType, SqlConnection sqlConn)
        {
            SqlCommand sqlCmd = new SqlCommand(queryOrSP, sqlConn);
            sqlCmd.CommandType = comandType;
            if (param != null)
                sqlCmd.Parameters.AddRange(param);
            sqlCmd.CommandTimeout = sqlConn.ConnectionTimeout;
            sqlCmd.Connection.Open();
            SqlDataReader dataReader = sqlCmd.ExecuteReader(CommandBehavior.CloseConnection);
            sqlCmd.Parameters.Clear();
            return dataReader;
        }

        public static SqlDataReader GetDataReaderSP(string sqlSP, SqlParameter[] param)
        {
            return GetDataReader(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static SqlDataReader GetDataReaderQuery(string sqlQuery, SqlParameter[] param)
        {
            return GetDataReader(sqlQuery, param, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static SqlDataReader GetDataReaderSP(string sqlSP)
        {
            return GetDataReader(sqlSP, null, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
        public static SqlDataReader GetDataReaderQuery(string sqlQuery)
        {
            return GetDataReader(sqlQuery, null, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }


        public static SqlDataReader GetDataReaderSP(string sqlSP, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataReader(sqlSP, param, CommandType.StoredProcedure, GetConnection(module));
        }
        public static SqlDataReader GetDataReaderQuery(string sqlQuery, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return GetDataReader(sqlQuery, param, CommandType.Text, GetConnection(module));
        }
        public static SqlDataReader GetDataReaderSP(string sqlSP, CONNECTION_MODULE module)
        {
            return GetDataReader(sqlSP, null, CommandType.StoredProcedure, GetConnection(module));
        }
        public static SqlDataReader GetDataReaderQuery(string sqlQuery, CONNECTION_MODULE module)
        {
            return GetDataReader(sqlQuery, null, CommandType.Text, GetConnection(module));
        }


        /* Execute Non Query*/

        private static int ExecuteNonQuery(string queryOrSP, SqlParameter[] param, CommandType comandType, SqlConnection sqlConn)
        {
            int rowAffected = 0;
            try
            {
                using (SqlCommand sqlCmd = new SqlCommand(queryOrSP, sqlConn))
                {
                    sqlCmd.CommandType = comandType;
                    if (param != null)
                        sqlCmd.Parameters.AddRange(param);
                    sqlCmd.Connection.Open();
                    rowAffected = sqlCmd.ExecuteNonQuery();
                    sqlCmd.Connection.Close();
                    sqlCmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return rowAffected;
        }

        public static int ExecuteNonQuerySP(string sqlSP, SqlParameter[] param)
        {
            return ExecuteNonQuery(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static int ExecuteNonQueryQuery(string sqlQuery, SqlParameter[] param)
        {
            return ExecuteNonQuery(sqlQuery, param, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static int ExecuteNonQuerySP(string sqlSP, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return ExecuteNonQuery(sqlSP, param, CommandType.StoredProcedure, GetConnection(module));
        }

        public static int ExecuteNonQueryQuery(string sqlQuery, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return ExecuteNonQuery(sqlQuery, param, CommandType.Text, GetConnection(module));
        }
        /* Execute Non Query*/

        private static object ExecuteScalar(string queryOrSP, SqlParameter[] param, CommandType comandType, SqlConnection sqlConn)
        {
            object data = new object();
            try
            {
                using (SqlCommand sqlCmd = new SqlCommand(queryOrSP, sqlConn))
                {
                    sqlCmd.CommandType = comandType;
                    if (param != null)
                        sqlCmd.Parameters.AddRange(param);
                    sqlCmd.Connection.Open();
                    data = sqlCmd.ExecuteScalar();
                    sqlCmd.Connection.Close();
                    sqlCmd.Parameters.Clear();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        public static object ExecuteScalarSP(string sqlSP, SqlParameter[] param)
        {
            return ExecuteScalar(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static object ExecuteScalarQuery(string sqlQuery, SqlParameter[] param)
        {
            return ExecuteScalar(sqlQuery, param, CommandType.Text, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static object ExecuteScalarSP(string sqlSP, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return ExecuteScalar(sqlSP, param, CommandType.StoredProcedure, GetConnection(module));
        }

        public static object ExecuteScalarQuery(string sqlQuery, SqlParameter[] param, CONNECTION_MODULE module)
        {
            return ExecuteScalar(sqlQuery, param, CommandType.Text, GetConnection(module));
        }

        public static DataTable GetCWDataTableSP(string sqlSP, SqlParameter[] param)
        {
            //System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            return GetDataTable(sqlSP, param, CommandType.StoredProcedure, GetCWConnection(CONNECTION_MODULE.REGULAR));
        }
        public static int InsertOrUpdateChronology(string sqlSP, SqlParameter[] param)
        {
            return ExecuteNonQuery(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static int DeleteChronologyRemarks(string sqlSP, SqlParameter[] param)
        {
            return ExecuteNonQuery(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }

        public static DataTable GetChronologyDetails(string sqlSP, SqlParameter[] param)
        {
            //System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            return GetDataTable(sqlSP, param, CommandType.StoredProcedure, GetCWConnection(CONNECTION_MODULE.REGULAR));
        }
        public static int InsertOrUpdateSummary(string sqlSP, SqlParameter[] param)
        {
            return ExecuteNonQuery(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        }
    }
}