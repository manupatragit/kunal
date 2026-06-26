using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.ADODBAccess
{
    public class AdoDBSql
    {
        private readonly string _connectionString;

        public AdoDBSql()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["ApplicationContext"].ToString();
        }

        public DataTable GetDataTable(string procedureName, SqlParameter[] parameters = null)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataTable dataTable = new DataTable();
                        adapter.Fill(dataTable);
                        return dataTable;
                    }
                }
            }
        }

        public DataSet GetDataSet(string procedureName, SqlParameter[] parameters = null)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataSet dataSet = new DataSet();
                        adapter.Fill(dataSet);
                        return dataSet;
                    }
                }
            }
        }


        public int ExecuteNonQuery(string procedureName, SqlParameter[] parameters = null)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    connection.Open();
                    int result = command.ExecuteNonQuery();
                    connection.Close();
                    return result;
                }
            }
        }

        public SqlDataReader ExecuteReader(string procedureName, SqlParameter[] parameters = null)
        {
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlCommand command = new SqlCommand(procedureName, connection);
            command.CommandType = CommandType.StoredProcedure;

            if (parameters != null)
            {
                command.Parameters.AddRange(parameters);
            }

            connection.Open();
            // Note: It's caller's responsibility to close the connection
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }

        public void ExecuteTransaction(Action<SqlCommand> action)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.Transaction = transaction;
                        command.CommandType = CommandType.StoredProcedure;

                        try
                        {
                            action(command);
                            transaction.Commit();
                        }
                        catch
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
        }

        //public static DataTable GetDataTableSP(string sqlSP, SqlParameter[] param)
        //{
        //    return GetDataTable(sqlSP, param, CommandType.StoredProcedure, GetConnection(CONNECTION_MODULE.REGULAR));
        //}
    }
}
