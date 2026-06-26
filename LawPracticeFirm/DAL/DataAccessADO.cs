using DataAccess.ADODBAccess;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using NJDGDetail.DAL;
using NJDGDetail.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.DAL
{
    public class DataAccessADO
    {
  
        public static DataTable GetReportBuilderQuery(string columnnameforcustomRpt, string firmid, string filternameforcustomRpt,
                  string ordercolcollecionforcustomRpt, string groupcolcollectionforcustomRpt, string reporttypeforcustomRpt, int pagenum, int pagesize, string TempTablecolumnnameforcustomRpt,string moduleid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@columns", columnnameforcustomRpt);
            param[1] = new SqlParameter("@firmid", firmid);
            param[2] = new SqlParameter("@filters", filternameforcustomRpt);
            param[3] = new SqlParameter("@ordercolcollecion", ordercolcollecionforcustomRpt);
            param[4] = new SqlParameter("@groupcolcollection", groupcolcollectionforcustomRpt);
            param[5] = new SqlParameter("@reporttype", reporttypeforcustomRpt);
            param[6] = new SqlParameter("@PageNumber", pagenum);
            param[7] = new SqlParameter("@PageSize", pagesize);
            param[8] = new SqlParameter("@Tempcolumns", TempTablecolumnnameforcustomRpt);
            param[9] = new SqlParameter("@moduleid", moduleid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetReportBuilderQuery", param);
            return dtcs;
        }

        public static DataTable GetReportBuilderQueryPreview(string columnnameforcustomRpt, string firmid, string filternameforcustomRpt,
                 string ordercolcollecionforcustomRpt, string groupcolcollectionforcustomRpt, string reporttypeforcustomRpt, int pagenum, int pagesize, string TempTablecolumnnameforcustomRpt,string groupBycolumn, string loginuser, string userrole, string moduleid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[13];
            param[0] = new SqlParameter("@columns", columnnameforcustomRpt);
            param[1] = new SqlParameter("@firmid", firmid);
            param[2] = new SqlParameter("@filters", filternameforcustomRpt);
            param[3] = new SqlParameter("@ordercolcollecion", ordercolcollecionforcustomRpt);
            param[4] = new SqlParameter("@groupcolcollection", groupcolcollectionforcustomRpt);
            param[5] = new SqlParameter("@reporttype", reporttypeforcustomRpt);
            param[6] = new SqlParameter("@PageNumber", pagenum);
            param[7] = new SqlParameter("@PageSize", pagesize);
            param[8] = new SqlParameter("@Tempcolumns", TempTablecolumnnameforcustomRpt);
            param[9] = new SqlParameter("@groupBycolumn", groupBycolumn);
            param[10] = new SqlParameter("@loginuser", loginuser);
            param[11] = new SqlParameter("@userrole", userrole);
            param[12] = new SqlParameter("@moduleid", moduleid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetReportBuilderQueryPreview", param);
            return dtcs;
        }

        public static DataTable GetSaveReportBuilderList(string firmid, string userid, string reportnameFilter, string pagenum, string pagesize, string moduleid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@filterReportName", reportnameFilter);
            param[3] = new SqlParameter("@PageNumber", pagenum);
            param[4] = new SqlParameter("@PageSize", pagesize);
            param[5] = new SqlParameter("@moduleid", moduleid);
            

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetSaveReportBuilderList", param);
            return dtcs;
        }

        public static DataTable GetBindCustomReportFinal(string firmid, string userid, string reportid, string pagenum, string pagesize, string loginuser, string userrole, string moduleid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[7];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@reportId", reportid);
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@loginuser", loginuser);
            param[5] = new SqlParameter("@userrole", userrole);
            param[6] = new SqlParameter("@moduleid", moduleid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetReportBuilderQueryFinalbyId", param);
            return dtcs;
        }

        public static DataTable GetBindCustomReportMasterById(string firmid, string userid, string reportid, string moduleid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@reportId", reportid);
            param[2] = new SqlParameter("@moduleid", moduleid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetReportBuilderQueryMasterbyId", param);
            return dtcs;
        }
        
        public static DataTable GetNewCaseDetailByRowIdExportColumnSequence(Nullable<System.Guid> firmid, Nullable<System.Guid> userid, 
            Nullable<int> pageNumber, Nullable<int> pageSize,string opendate, string casename, string clientname, string courtname, 
            string casestatus,string casefilterCreatedBy, Nullable<int> ispersonal, string companyname, string mattertype, 
            string subjecttype, string notefilter, string othercourtname, string opendateto, string caseFilingDate, 
            string caseFilingDateTo, string isCaseArchived,string custcolname, string custcolvalue,string disposeoptions,
            string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,string caseidresirect)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[28];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", pageNumber);
            param[3] = new SqlParameter("@PageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[10] = new SqlParameter("@ispersonal", ispersonal);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjecttype);
            param[14] = new SqlParameter("@notefilter", notefilter);
            param[15] = new SqlParameter("@othercourtname", othercourtname);
            param[16] = new SqlParameter("@opendateto", opendateto);
            param[17] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[18] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[19] = new SqlParameter("@IsCaseArchived", isCaseArchived);
            param[20] = new SqlParameter("@custcolname", custcolname);
            param[21] = new SqlParameter("@custcolvalue", custcolvalue);
            param[22] = new SqlParameter("@disposeoption", disposeoptions);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseidresirect);


            dtcs = SqlDbDAL.GetDataTableSP("GetNewCaseDetailByRowIdExportColumnSequence", param);
            return dtcs;
        }



        public static DataTable GetSEBINewCaseDetailByRowIdExportColumnSequence(Nullable<System.Guid> firmid, Nullable<System.Guid> userid,
            Nullable<int> pageNumber, Nullable<int> pageSize, string opendate, string casename, string clientname, string courtname,
            string casestatus, string casefilterCreatedBy, Nullable<int> ispersonal, string companyname, string mattertype,
            string subjecttype, string notefilter, string othercourtname, string opendateto, string caseFilingDate,
            string caseFilingDateTo, string isCaseArchived, string custcolname, string custcolvalue, string disposeoptions,
            string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[28];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", pageNumber);
            param[3] = new SqlParameter("@PageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[10] = new SqlParameter("@ispersonal", ispersonal);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjecttype);
            param[14] = new SqlParameter("@notefilter", notefilter);
            param[15] = new SqlParameter("@othercourtname", othercourtname);
            param[16] = new SqlParameter("@opendateto", opendateto);
            param[17] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[18] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[19] = new SqlParameter("@IsCaseArchived", isCaseArchived);
            param[20] = new SqlParameter("@custcolname", custcolname);
            param[21] = new SqlParameter("@custcolvalue", custcolvalue);
            param[22] = new SqlParameter("@disposeoption", disposeoptions);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseidresirect);


            dtcs = SqlDbDAL.GetDataTableSP("GetSebiNewCaseDetailByRowIdExportColumnSequence", param);
            return dtcs;
        }


        public static DataTable GetUserNewCaseDetailByRowIdNEWExportColumnSequence(Nullable<System.Guid> firmid, Nullable<System.Guid> userid, 
            Nullable<int> pageNumber, Nullable<int> pageSize, string opendate, string casename, string clientname, string courtname, 
            string casestatus, Nullable<int> pageid, Nullable<int> roletype, string casefilterCreatedBy, Nullable<int> ispersonal, 
            string companyname, string mattertype, string subjecttype, string notefilter, string othercourtname, string opendateto, 
            string caseFilingDate, string caseFilingDateTo, string isCaseArchived, string custcolname, string custcolvalue, string disposeoptions,
            string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[30];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", pageNumber);
            param[3] = new SqlParameter("@PageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@pageid", casestatus);
            param[10] = new SqlParameter("@roletype", casestatus);
            param[11] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[12] = new SqlParameter("@ispersonal", ispersonal);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjecttype);
            param[16] = new SqlParameter("@notefilter", notefilter);
            param[17] = new SqlParameter("@othercourtname", othercourtname);
            param[18] = new SqlParameter("@opendateto", opendateto);
            param[19] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[20] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[21] = new SqlParameter("@IsCaseArchived", isCaseArchived);
            param[22] = new SqlParameter("@custcolname", custcolname);
            param[23] = new SqlParameter("@custcolvalue", custcolvalue);
            param[24] = new SqlParameter("@disposeoption", disposeoptions);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseidresirect);

            dtcs = SqlDbDAL.GetDataTableSP("GetUserNewCaseDetailByRowIdNEWExportColumnSequence", param);
            return dtcs;
        }


        public static DataTable GetSebiUserNewCaseDetailByRowIdNEWExportColumnSequence(Nullable<System.Guid> firmid, Nullable<System.Guid> userid,
          Nullable<int> pageNumber, Nullable<int> pageSize, string opendate, string casename, string clientname, string courtname,
          string casestatus, Nullable<int> pageid, Nullable<int> roletype, string casefilterCreatedBy, Nullable<int> ispersonal,
          string companyname, string mattertype, string subjecttype, string notefilter, string othercourtname, string opendateto,
          string caseFilingDate, string caseFilingDateTo, string isCaseArchived, string custcolname, string custcolvalue, string disposeoptions,
          string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[30];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", pageNumber);
            param[3] = new SqlParameter("@PageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@pageid", casestatus);
            param[10] = new SqlParameter("@roletype", casestatus);
            param[11] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[12] = new SqlParameter("@ispersonal", ispersonal);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjecttype);
            param[16] = new SqlParameter("@notefilter", notefilter);
            param[17] = new SqlParameter("@othercourtname", othercourtname);
            param[18] = new SqlParameter("@opendateto", opendateto);
            param[19] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[20] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[21] = new SqlParameter("@IsCaseArchived", isCaseArchived);
            param[22] = new SqlParameter("@custcolname", custcolname);
            param[23] = new SqlParameter("@custcolvalue", custcolvalue);
            param[24] = new SqlParameter("@disposeoption", disposeoptions);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseidresirect);

            dtcs = SqlDbDAL.GetDataTableSP("GetSebiUserNewCaseDetailByRowIdNEWExportColumnSequence", param);
            return dtcs;
        }

        public static DataTable GetUserCaseModuleRights(string frmids,string usrids,string assignusrids,int pageid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@firmid", frmids);
            param[1] = new SqlParameter("@userid", usrids);
            param[2] = new SqlParameter("@assignuser", assignusrids);
            param[3] = new SqlParameter("@pageid", pageid);
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetUserCaseModuleRights", param);
            return dtcs;
        }
        public static DataTable GetUserModuleRights(string frmids, string usrids, string assignusrids, int pageid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@firmid", frmids);
            param[1] = new SqlParameter("@userid", usrids);
            param[2] = new SqlParameter("@assignuser", assignusrids);
            param[3] = new SqlParameter("@pageid", pageid);
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetUserModuleRights", param);
            return dtcs;
        }

        public static int UpdateFavAgainCase(string matterid, string UserID, string usercaseid, string FirmID, string ActionStatus)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@Matterid", matterid);
            param[1] = new SqlParameter("@UserID", UserID);
            param[2] = new SqlParameter("@UserCaseid", usercaseid);
            param[3] = new SqlParameter("@FirmID", FirmID);
            param[4] = new SqlParameter("@ActionStatus", ActionStatus);
            int dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_UpdateFavAgainCase", param);
            return dtcs;
        }
        public static DataTable GetSEBIFavourAgainstbycaseid(string matterid, string UserID, int usercaseid, string FirmID)
        {
            try
            {
                DataTable dtcs = new DataTable();
                SqlParameter[] param = new SqlParameter[4];
                param[0] = new SqlParameter("@Matterid", matterid);
                param[1] = new SqlParameter("@UserID", UserID);
                param[2] = new SqlParameter("@UserCaseid", usercaseid);
                param[3] = new SqlParameter("@FirmID", FirmID);

                dtcs = SqlDbDAL.GetDataTableSP("sp_GetSEBIFavourAgainstbycaseid", param);
                string Message = "No data found.";
                if (dtcs.Rows.Count > 0)
                    Message = dtcs.Rows[0]["ActionStatus"].ToString();
                return dtcs;
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }

        public static int UpdateFiledAgaistbyusercaseid(Int64 usercaseid, string FiledByStatus)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@usercaseid", usercaseid);
            param[1] = new SqlParameter("@FiledAgainstStatus", FiledByStatus);
            int dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_UpdateFiledAgaistbyusercaseid", param);
            return dtcs;
        }

        public static DataTable GetSebiSuccessRateReport(string frmids, string usrids, string month, string Year)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@Firmid", frmids);
            param[1] = new SqlParameter("@vusername", usrids);
            param[2] = new SqlParameter("@monthid", month);
            param[3] = new SqlParameter("@year", Year);
            dtcs = SqlDbDAL.GetDataTableSP("sp_SebiSuccessRateReport", param);
            return dtcs;
        }
        public static DataSet GetSebifavourAgainstReport(string frmids, string usrids, string month, string Year)
        {
            DataSet dtcs = new DataSet();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@Firmid", frmids);
            param[1] = new SqlParameter("@vusername", usrids);
            param[2] = new SqlParameter("@monthid", month);
            param[3] = new SqlParameter("@year", Year);
            dtcs = SqlDbDAL.GetDataSetSP("sp_SebiSuccessRateReport", param);
            return dtcs;
        }

        public static int UpdateSebiOtherDetailsbyCWSync(string firmid,string userid,Int64 mastercaseid, Int64 usercaseid,string vCourtName,
             string vState, string city, string benchName, string applicant,
                        string respondent, string scasetype,DateTime? filingDate, string filedby)
        {
            SqlParameter[] param = new SqlParameter[13];
            param[0] = new SqlParameter("@Firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@mastercaseid", mastercaseid);
            param[3] = new SqlParameter("@usercaseid", usercaseid);
            param[4] = new SqlParameter("@vCourtName", vCourtName);
            param[5] = new SqlParameter("@vState", vState);
            param[6] = new SqlParameter("@city", city);
            param[7] = new SqlParameter("@benchName", benchName);
            param[8] = new SqlParameter("@applicant", applicant);
            param[9] = new SqlParameter("@respondent", respondent);
            param[10] = new SqlParameter("@scasetype", scasetype);
            param[11] = new SqlParameter("@filingDate", filingDate);
            param[12] = new SqlParameter("@filedby", filedby);
            int dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_UpdateFiledAgaistbyusercaseid", param);
            return dtcs;
        }
        public static DataTable usp_GetTeamMemberbyFirmIdForBulkAssign(string firmid, string User)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", User);
            dtcs = db.GetDataTable("usp_GetTeamMemberbyFirmIdForBulkAssign", param);
            return dtcs;
        }
        public static DataTable usp_GetMatterByFirmAndUserID(Nullable<System.Guid> firmid, Nullable<System.Guid> userid, string MatterName, string CourtType, Nullable<int> pageSize, Nullable<int> pazeNo,string CourtTypeName)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[7];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@MatterName", string.IsNullOrEmpty(MatterName) ? "" : MatterName);
            param[3] = new SqlParameter("@CourtType", string.IsNullOrEmpty(CourtType) ? "" : CourtType);
            param[4] = new SqlParameter("@PageSize", pageSize);
            param[5] = new SqlParameter("@PazeNo", pazeNo);
            param[6] = new SqlParameter("@CourtTypeName", CourtTypeName);
            dtcs = db.GetDataTable("usp_GetMatterByFirmAndUserID", param);
            return dtcs;
        }
        public static DataTable usp_BulkAssignCasetoManyUser(string userChunkString, string caseChunkString, string User, string firmid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@Userid", userChunkString);
            param[1] = new SqlParameter("@CaseID", caseChunkString);
            param[2] = new SqlParameter("@FromUser", User);
            param[3] = new SqlParameter("@FirmID", firmid);
            dtcs = db.GetDataTable("usp_BulkAssignCasetoManyUser", param);
            return dtcs;
        }
        public static string loadnewcaselistSebi(string FirmId,string UserId,int pagenum,
                       int pagesize,string odate,string casename,string clientname,string court,string cstatus,string createdby,
                       int filtervalue,string companynamefiltervalue,string mattertypefiltervalue,string subjecttypefiltervalue,
                       string casefilternotes,string casefiltercourtname,string odateto,
                       string fillingdate,string fillingdateto,string IsCaseArchived,string searchcustomcolname,string searchcustomcolvalue,
                       string filtercasedisposeoption,string casefilterCaseDetails,string casefiltermtrno,string casefilterInternalno,string casefiltercnrno,
                       string caseredirectfilter,string NextHearingfromd,string NextHearingtod,string courtstatus,string hearingsorting,
                       string casedetailsfilter,string FiledByAgainstfilter,string FavourAgainstfilter,string IsCaseWatchUser,string DeptTypefilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[35];
            param[0] = new SqlParameter("@firmid", Guid.Parse(FirmId));
            param[1] = new SqlParameter("@userid", Guid.Parse(UserId));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[10] = new SqlParameter("@ispersonal", filtervalue);
            param[11] = new SqlParameter("@companyname", companynamefiltervalue);
            param[12] = new SqlParameter("@mattertype", mattertypefiltervalue);
            param[13] = new SqlParameter("@subjecttype", subjecttypefiltervalue);
            param[14] = new SqlParameter("@notefilter", casefilternotes);
            param[15] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[16] = new SqlParameter("@opendateto", odateto);
            param[17] = new SqlParameter("@caseFilingDate", fillingdate);
            param[18] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[19] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[20] = new SqlParameter("@custcolname", searchcustomcolname);
            param[21] = new SqlParameter("@custcolvalue", searchcustomcolvalue);
            param[22] = new SqlParameter("@disposeoption", filtercasedisposeoption);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[28] = new SqlParameter("@nexthearingdatefrm", NextHearingfromd);
            param[29] = new SqlParameter("@nexthearingdateto", NextHearingtod);
            param[30] = new SqlParameter("@courtstatusfilter", courtstatus);
            param[31] = new SqlParameter("@FiledByAgainstfilter", FiledByAgainstfilter);
            param[32] = new SqlParameter("@FavourAgainstfilter", FavourAgainstfilter);
            param[33] = new SqlParameter("@litigationfilter", casedetailsfilter);
            param[34] = new SqlParameter("@DeptTypefilter", DeptTypefilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetNewCaseDetailByRowId_SEBI", param);
            var obj1=   JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string loadSebiusernewcaselist(string FirmId, string searchuser, int pagenum,
               int pagesize, string odate, string casename, string clientname, string court, string cstatus, int roletype, int pageid,string createdby,
               int filtervalue, string companynamefiltervalue, string mattertypefiltervalue, string subjecttypefiltervalue,
               string casefilternotes, string casefiltercourtname, string odateto,
               string fillingdate, string fillingdateto, string IsCaseArchived, string searchcustomcolname, string searchcustomcolvalue,
               string filtercasedisposeoption, string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno,
               string caseredirectfilter, string NextHearingfromd, string NextHearingtod, string courtstatus, string hearingsorting,
               string casedetailsfilter, string FiledByAgainstfilter, string FavourAgainstfilter, string IsCaseWatchUser,string DeptTypefilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];
            param[0] = new SqlParameter("@firmid", Guid.Parse(FirmId));
            param[1] = new SqlParameter("@userid", Guid.Parse(searchuser));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@pageid", pageid);
            param[10] = new SqlParameter("@roletype", roletype);
            param[11] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[12] = new SqlParameter("@ispersonal", filtervalue);
            param[13] = new SqlParameter("@companyname", companynamefiltervalue);
            param[14] = new SqlParameter("@mattertype", mattertypefiltervalue);
            param[15] = new SqlParameter("@subjecttype", subjecttypefiltervalue);
            param[16] = new SqlParameter("@notefilter", casefilternotes);
            param[17] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[18] = new SqlParameter("@opendateto", odateto);
            param[19] = new SqlParameter("@caseFilingDate", fillingdate);
            param[20] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[21] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[22] = new SqlParameter("@custcolname", searchcustomcolname);
            param[23] = new SqlParameter("@custcolvalue", searchcustomcolvalue);
            param[24] = new SqlParameter("@disposeoption", filtercasedisposeoption);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[30] = new SqlParameter("@nexthearingdatefrm", NextHearingfromd);
            param[31] = new SqlParameter("@nexthearingdateto", NextHearingtod);
            param[32] = new SqlParameter("@courtstatusfilter", courtstatus);
            param[33] = new SqlParameter("@FiledByAgainstfilter", FiledByAgainstfilter);
            param[34] = new SqlParameter("@FavourAgainstfilter", FavourAgainstfilter);
            param[35] = new SqlParameter("@litigationfilter", casedetailsfilter);
            param[36] = new SqlParameter("@DeptTypefilter", DeptTypefilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetUserSebiNewCaseDetailByRowIdNEW", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
            
        }
        public static string SaveCWMatterOtherDetails(string ULN, string NatureOfCase, string MatterType, string MatterOf, string BriefOfMatter, string Relevance, string IssuesInvolved, string NatureOfViolation, string Casecategory,
        string DateOfImpugned, string IssuingAuthority, string DirectionUnderTheOrder, string ReplyField, string MatterStage, string StayOrder, string DateOfStayOrder, string NameOfParty,
         string DateTill, string ExtendedTill, string StayVacatedOn, string DirectionOfCourt, string ExpactedDateOfCompliance, string OprationDepartmentInchargeOFCompliance,
         string DateOfCompliance, string DisposalInFavour, string NatureOfDisposal, string OperationDepartmentForThePurposeOfSeeking, string NameOfTheDealingOfficer, string NameOfOfficer, string ProformaParty,
         string MarketActivity, string GovernmentAuthorityParty, string Remarks, string MatterId, string solicitor, string courtorder,string connectedmtr)
        {
            //DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];
            param[0] = new SqlParameter("@ULN", ULN);
            param[1] = new SqlParameter("@NatureOfCase", NatureOfCase);
            param[2] = new SqlParameter("@MatterType", MatterType);
            param[3] = new SqlParameter("@MatterOf", MatterOf);
            param[4] = new SqlParameter("@BriefOfMatter", BriefOfMatter);
            param[5] = new SqlParameter("@Relevance", Relevance);
            param[6] = new SqlParameter("@IssuesInvolved", IssuesInvolved);
            param[7] = new SqlParameter("@NatureOfViolation", NatureOfViolation);
            param[8] = new SqlParameter("@Casecategory", Casecategory);
            param[9] = new SqlParameter("@DateOfImpugned", DateOfImpugned);
            param[10] = new SqlParameter("@IssuingAuthority", IssuingAuthority);
            param[11] = new SqlParameter("@DirectionUnderTheOrder", DirectionUnderTheOrder);
            param[12] = new SqlParameter("@ReplyField", ReplyField);
            param[13] = new SqlParameter("@MatterStage", MatterStage);
            param[14] = new SqlParameter("@StayOrder", StayOrder);
            param[15] = new SqlParameter("@DateOfStayOrder", DateOfStayOrder);
            param[16] = new SqlParameter("@NameOfParty", NameOfParty);
            param[17] = new SqlParameter("@DateTill", DateTill);
            param[18] = new SqlParameter("@ExtendedTill", ExtendedTill);
            param[19] = new SqlParameter("@StayVacatedOn", StayVacatedOn);
            param[20] = new SqlParameter("@DirectionOfCourt", DirectionOfCourt);
            param[21] = new SqlParameter("@ExpactedDateOfCompliance", ExpactedDateOfCompliance);
            param[22] = new SqlParameter("@OprationDepartmentInchargeOFCompliance", OprationDepartmentInchargeOFCompliance);
            param[23] = new SqlParameter("@DateOfCompliance", DateOfCompliance);
            param[24] = new SqlParameter("@DisposalInFavour", DisposalInFavour);
            param[25] = new SqlParameter("@NatureOfDisposal", NatureOfDisposal);
            param[26] = new SqlParameter("@OperationDepartmentForThePurposeOfSeeking", OperationDepartmentForThePurposeOfSeeking);
            param[27] = new SqlParameter("@NameOfTheDealingOfficer", NameOfTheDealingOfficer);
            param[28] = new SqlParameter("@NameOfOfficer", NameOfOfficer);
            param[29] = new SqlParameter("@ProformaParty", ProformaParty);
            param[30] = new SqlParameter("@MarketActivity", MarketActivity);
            param[31] = new SqlParameter("@GovernmentAuthorityParty", GovernmentAuthorityParty);
            param[32] = new SqlParameter("@Remarks", Remarks);
            param[33] = new SqlParameter("@MatterId", MatterId);
            param[34] = new SqlParameter("@solicitor", solicitor);
            param[35] = new SqlParameter("@courtorder", courtorder);
            param[36] = new SqlParameter("@connectedmtr", connectedmtr);
            var  dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_InsertSebiMetterOtherDetails", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string GetSebiMatterOtherDetails(string matterid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@MatterId", matterid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetSebiMatterOtherDetails", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string ViewSebiFileList(string SearchText, int PageSize, int PageNo)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@Title", SearchText);
            param[1] = new SqlParameter("@pageSize", PageSize);
            param[2] = new SqlParameter("@pageNo", PageNo);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetSebiForwardBackwardJudgeMentList", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static DataTable SyncSebiReportData(string firmid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@id", Guid.Parse(firmid));
            dtcs = SqlDbDAL.GetDataTableSP("usp_wf_GetUserNameforAPI", param);
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            return dtcs;
        }
        
           public static string GetSebiNewCaseDetailByRowIdExport(Guid firmid, Guid userid, int PageNumber, int PageSize, string ecasefilterdate,
           string esearchdata, string ecasefilterclient, string ecasefiltercourt, string ecasefilterstatus,string createdby,
           int ispersonal, string companyname,string mattertype, string subjecttype, string notefilter, string othercourtname,
           string opendateto, string caseFilingDate, string caseFilingDateTo, string IsCaseArchived, string custcolname, string custcolvalue, string disposeoption,
           string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect,
           string nexthearingdatefrm, string nexthearingdateto, string courtstatusfilter, string litigationfilter,string FiledByAgainstfilter,string FavourAgainstfilter,string DeptType_filter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[35];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", PageNumber);
            param[3] = new SqlParameter("@PageSize", PageSize);
            param[4] = new SqlParameter("@opendate", ecasefilterdate);
            param[5] = new SqlParameter("@casename", esearchdata);
            param[6] = new SqlParameter("@clientname", ecasefilterclient);
            param[7] = new SqlParameter("@courtname", ecasefiltercourt);
            param[8] = new SqlParameter("@casestatus", ecasefilterstatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[10] = new SqlParameter("@ispersonal", ispersonal);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjecttype);
            param[14] = new SqlParameter("@notefilter", notefilter);
            param[15] = new SqlParameter("@othercourtname", othercourtname);
            param[16] = new SqlParameter("@opendateto", opendateto);
            param[17] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[18] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[19] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[20] = new SqlParameter("@custcolname", custcolname);
            param[21] = new SqlParameter("@custcolvalue", custcolvalue);
            param[22] = new SqlParameter("@disposeoption", disposeoption);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseidresirect);
            param[28] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrm);
            param[29] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[30] = new SqlParameter("@courtstatusfilter", courtstatusfilter);
            param[31] = new SqlParameter("@FiledByAgainstfilter", FiledByAgainstfilter);
            param[32] = new SqlParameter("@FavourAgainstfilter", FavourAgainstfilter);
            param[33] = new SqlParameter("@litigationfilter", litigationfilter);
            param[34] = new SqlParameter("@DeptTypefilter", DeptType_filter);
            dtcs = SqlDbDAL.GetDataTableSP("GetSebiNewCaseDetailByRowIdExport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;

        }
        public static string GetSEBIUserNewCaseDetailByRowIdNEWExport(Guid firmid, Guid userid, int PageNumber, int PageSize, string opendate,
           string casename, string clientname, string courtname, string casestatus, int pageid,
           int roletype, string casefilterCreatedBy, int ispersonal, string companyname,
           string mattertype, string subjecttype, string notefilter, string othercourtname,
           string opendateto, string caseFilingDate, string caseFilingDateTo, string IsCaseArchived, string custcolname, string custcolvalue, string disposeoption,
           string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect,
           string nexthearingdatefrm, string nexthearingdateto, string courtstatusfilter, string litigationfilter, string FiledByAgainstfilter, string FavourAgainstfilter,string DeptTypefilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", PageNumber);
            param[3] = new SqlParameter("@PageSize", PageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@pageid", pageid);
            param[10] = new SqlParameter("@roletype", roletype);
            param[11] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[12] = new SqlParameter("@ispersonal", ispersonal);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjecttype);
            param[16] = new SqlParameter("@notefilter", notefilter);
            param[17] = new SqlParameter("@othercourtname", othercourtname);
            param[18] = new SqlParameter("@opendateto", opendateto);
            param[19] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[20] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[21] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[22] = new SqlParameter("@custcolname", custcolname);
            param[23] = new SqlParameter("@custcolvalue", custcolvalue);
            param[24] = new SqlParameter("@disposeoption", disposeoption);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseidresirect);
            param[30] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrm);
            param[31] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[32] = new SqlParameter("@courtstatusfilter", courtstatusfilter);
            param[33] = new SqlParameter("@litigationfilter", litigationfilter);
            param[34] = new SqlParameter("@FiledByAgainstfilter", FiledByAgainstfilter);
            param[35] = new SqlParameter("@FavourAgainstfilter", FavourAgainstfilter);
            param[36] = new SqlParameter("@DeptTypefilter", DeptTypefilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetSEBIUserNewCaseDetailByRowIdNEWExport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;

        }
        public static DataTable  GetCaseDeatilsByUserCaseId(string firmid, string userid, string court, string courtname,
                   string stateid, string districtid, string courtcompestname, string ditrictcourt, string sortdate, string CaseStatus,
                 string hearingfrom, string hearingto, string casename, string PetionerName,
                  string RespondentName, string Advocate, string CourtCaseNo,int pageindex,int pagesize)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[19];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@court", court);
            param[3] = new SqlParameter("@courtname", courtname);
            param[4] = new SqlParameter("@stateid", stateid);
            param[5] = new SqlParameter("@districtid", districtid);
            param[6] = new SqlParameter("@courtcompestname", courtcompestname);
            param[7] = new SqlParameter("@ditrictcourt", ditrictcourt);
            param[8] = new SqlParameter("@sortdate", sortdate);
            param[9] = new SqlParameter("@CaseStatus", CaseStatus);
            param[10] = new SqlParameter("@hearingfrom", hearingfrom);
            param[11] = new SqlParameter("@hearingto", hearingto);
            param[12] = new SqlParameter("@casename", casename);
            param[13] = new SqlParameter("@PetionerName", PetionerName);
            param[14] = new SqlParameter("@RespondentName", RespondentName);
            param[15] = new SqlParameter("@Advocate", Advocate);
            param[16] = new SqlParameter("@CourtCaseNo", CourtCaseNo);
            param[17] = new SqlParameter("@pageindex", pageindex);
            param[18] = new SqlParameter("@pagesize", pagesize);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetCaseDetailsByUserCaseId", param);
            return dtcs;
        }

        public static DataTable GetCaseDeatilsByUserCaseIdForUser(string firmid, string userid, string court, string courtname,
                  string stateid, string districtid, string courtcompestname, string ditrictcourt, string sortdate, string CaseStatus,
                string hearingfrom, string hearingto, string casename, string PetionerName,
                 string RespondentName, string Advocate, string CourtCaseNo, int pageindex, int pagesize)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[19];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@court", court);
            param[3] = new SqlParameter("@courtname", courtname);
            param[4] = new SqlParameter("@stateid", stateid);
            param[5] = new SqlParameter("@districtid", districtid);
            param[6] = new SqlParameter("@courtcompestname", courtcompestname);
            param[7] = new SqlParameter("@ditrictcourt", ditrictcourt);
            param[8] = new SqlParameter("@sortdate", sortdate);
            param[9] = new SqlParameter("@CaseStatus", CaseStatus);
            param[10] = new SqlParameter("@hearingfrom", hearingfrom);
            param[11] = new SqlParameter("@hearingto", hearingto);
            param[12] = new SqlParameter("@casename", casename);
            param[13] = new SqlParameter("@PetionerName", PetionerName);
            param[14] = new SqlParameter("@RespondentName", RespondentName);
            param[15] = new SqlParameter("@Advocate", Advocate);
            param[16] = new SqlParameter("@CourtCaseNo", CourtCaseNo);
            param[17] = new SqlParameter("@pageindex", pageindex);
            param[18] = new SqlParameter("@pagesize", pagesize);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetCaseDetailsByUserCaseIdForUser", param);
            return dtcs;
        }

        //Pmrda customisation start
        public static string SavePmrdaMatterAdvAndDepDetails(
            string matterId,
            string department,
            string advocateName)
        {
            // build param array (4 params total)
            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@Department", SqlDbType.NVarChar, 200)
            {
                Value = (object)department ?? DBNull.Value
            };

            param[1] = new SqlParameter("@AdvocateName", SqlDbType.NVarChar, 200)
            {
                Value = (object)advocateName ?? DBNull.Value
            };

            param[2] = new SqlParameter("@MatterId", SqlDbType.UniqueIdentifier)
            {
                Value = Guid.Parse(matterId)
            };

            param[3] = new SqlParameter("@RowId", SqlDbType.UniqueIdentifier)
            {
                Direction = ParameterDirection.Output
            };

            // call proc
            var rowsAffected = SqlDbDAL.ExecuteNonQuerySP("sp_UpsertPmrdaCaseMatterTracking", param);

            // after ExecuteNonQuerySP returns, the output param should now be filled
            var rowId = param[3].Value != null ? param[3].Value.ToString() : null;

            var resultObj = new
            {
                Success = rowsAffected > 0,
                RowId = rowId,
                MatterId = matterId,
                Department = department,
                AdvocateName = advocateName
            };

            return JsonConvert.SerializeObject(resultObj);
        }

        public static DataTable GetPmrdaAdvocateAndDepartment(string caseid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@MatterId", caseid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetPmrdaAdvocateAndDepartment", param);
            return dtcs;
        }

        public static string IprdaDashBoardData(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetMatterDashboardBreakdown", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        //Total count pmrda
        public static string IprdaDashBoardCount(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetMatterDashboardTotals", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Advocate wise status 

        public static string IprdaDashBoardAdvocateWiseStatus(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetAdvocateStatusMatrix", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Departmentwise cases
        public static string IprdaDashBoardDepartmentwise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDepartmentWiseBreakdown", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Advocate wise case
        public static string IprdaDashBoardAdvocateWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetAdvocateWiseBreakdown", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Status wise breakdown
        public static string IprdaDashBoardStatusWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetStatusWiseBreakdown", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Court wise data break down
        public static string IprdaDashBoardCourtWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetCourtWiseBreakdown", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Court name 
        public static string IprdaDashBoardCourtList(string firmId)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmId", firmId);


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctCourtsByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string IprdaDashBoardStatusList(string firmId)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmId", firmId);


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctStatusByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        //Advocate name list
        public static string IprdaDashBoardAdvocateList()
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[0];


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctAdvocateByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Pmrda customisation end
        /// <summary>
        /// Save Bridge Stone matter Unique Case id During creating the matter
        /// </summary>
        /// <param name="matterId"></param>
        /// <returns></returns>
        /// 


        public static string SaveBridgeStoneOtherMatterDetails(string matterId)
        {
            //DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@matterId", matterId);
            var dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_bridgeStoneUniqueCaseIdInsert", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="matterId"></param>
        /// <param name="PlaintiffDefendant"></param>
        /// <param name="Summary"></param>
        /// <param name="isUnknown"></param>
        /// <param name="Defendant"></param>
        /// <param name="Plaintiff"></param>
        /// <param name="Probability_of_Exposure"></param>
        /// <param name="Realised_Financial_Costs"></param>
        /// <param name="Realised_Claims"></param>
        /// <returns></returns>
        public static string SaveBridgeStoneOtherMatterDetailsRecord(string matterId, string PlaintiffDefendant, string Summary, string isUnknown, string Defendant,
            string Plaintiff, string Probability_of_Exposure, string Realised_Financial_Costs, string Realised_Claims)
        {
            //DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@matterId", matterId);
            param[1] = new SqlParameter("@PlaintiffDefendant", PlaintiffDefendant);
            param[2] = new SqlParameter("@Summary", Summary);
            param[3] = new SqlParameter("@isUnknown", isUnknown);
            param[4] = new SqlParameter("@Defendant", Defendant);
            param[5] = new SqlParameter("@Plaintiff", Plaintiff);
            param[6] = new SqlParameter("@Probability_of_Exposure", Probability_of_Exposure);
            param[7] = new SqlParameter("@Realised_Financial_Costs", Realised_Financial_Costs);
            param[8] = new SqlParameter("@Realised_Claims", Realised_Claims);
            var dtcs = SqlDbDAL.ExecuteNonQuerySP("sp_bridgeStoneOtherCaseDetailInsertAndUpdate", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        public static string BridgeStoneMetterOtherDetailsById(string matterid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@matterId", matterid);
            dtcs = SqlDbDAL.GetDataTableSP("Sp_GetBridgeStoneMatterOtherDetails", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        //Get Export metter list Brdgestone for admin
        public static DataTable GetBridgstoneNewCaseDetailByRowIdExportColumnSequence(Nullable<System.Guid> firmid, Nullable<System.Guid> userid,
           Nullable<int> pageNumber, Nullable<int> pageSize, string opendate, string casename, string clientname, string courtname,
           string casestatus, string casefilterCreatedBy, Nullable<int> ispersonal, string companyname, string mattertype,
           string subjecttype, string notefilter, string othercourtname, string opendateto, string caseFilingDate,
           string caseFilingDateTo, string isCaseArchived, string custcolname, string custcolvalue, string disposeoptions,
           string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[28];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@PageNumber", pageNumber);
            param[3] = new SqlParameter("@PageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[10] = new SqlParameter("@ispersonal", ispersonal);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjecttype);
            param[14] = new SqlParameter("@notefilter", notefilter);
            param[15] = new SqlParameter("@othercourtname", othercourtname);
            param[16] = new SqlParameter("@opendateto", opendateto);
            param[17] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[18] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[19] = new SqlParameter("@IsCaseArchived", isCaseArchived);
            param[20] = new SqlParameter("@custcolname", custcolname);
            param[21] = new SqlParameter("@custcolvalue", custcolvalue);
            param[22] = new SqlParameter("@disposeoption", disposeoptions);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseidresirect);

            //GetNewCaseDetailByRowIdExportColumnSequence
            dtcs = SqlDbDAL.GetDataTableSP("GetBridgstoneNewCaseDetailByRowIdExportColumnSequence", param);
            return dtcs;
        }
        /// <summary>
        ///Get Export metter list Brdgestone for admin and user and serch user
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="opendate"></param>
        /// <param name="casename"></param>
        /// <param name="clientname"></param>
        /// <param name="courtname"></param>
        /// <param name="casestatus"></param>
        /// <param name="pageid"></param>
        /// <param name="roletype"></param>
        /// <param name="casefilterCreatedBy"></param>
        /// <param name="ispersonal"></param>
        /// <param name="companyname"></param>
        /// <param name="mattertype"></param>
        /// <param name="subjecttype"></param>
        /// <param name="notefilter"></param>
        /// <param name="othercourtname"></param>
        /// <param name="opendateto"></param>
        /// <param name="caseFilingDate"></param>
        /// <param name="caseFilingDateTo"></param>
        /// <param name="isCaseArchived"></param>
        /// <param name="custcolname"></param>
        /// <param name="custcolvalue"></param>
        /// <param name="disposeoption"></param>
        /// <param name="casefilterCaseDetails"></param>
        /// <param name="casefiltermtrno"></param>
        /// <param name="casefilterInternalno"></param>
        /// <param name="casefiltercnrno"></param>
        /// <param name="caseidresirect"></param>
        /// <param name="nexthearingdatefrm"></param>
        /// <param name="nexthearingdateto"></param>
        /// <param name="courtstatusfilter"></param>
        /// <param name="litigationfilter"></param>
        /// <param name="hearingsortfilter"></param>
        /// <param name="petionerfilter"></param>
        /// <param name="respondentrfilter"></param>
        /// <returns></returns>
        public static DataTable GetBridgeStoneUserNewCaseDetailByRowIdNEWExport(Nullable<System.Guid> firmid, Nullable<System.Guid> userid, Nullable<int> pageNumber, Nullable<int> pageSize,
            string opendate, string casename, string clientname, string courtname, string casestatus, Nullable<int> pageid, Nullable<int> roletype, string casefilterCreatedBy,
            Nullable<int> ispersonal, string companyname, string mattertype, string subjecttype, string notefilter, string othercourtname, string opendateto, string caseFilingDate, string caseFilingDateTo, string isCaseArchived,
            string custcolname, string custcolvalue, string disposeoption, string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno, string casefiltercnrno, string caseidresirect, string nexthearingdatefrm,
            string nexthearingdateto, string courtstatusfilter, string litigationfilter, string hearingsortfilter, string petionerfilter, string respondentrfilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@pageNumber", pageNumber);
            param[3] = new SqlParameter("@pageSize", pageSize);
            param[4] = new SqlParameter("@opendate", opendate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", courtname);
            param[8] = new SqlParameter("@casestatus", casestatus);
            param[9] = new SqlParameter("@pageid", pageid);
            param[10] = new SqlParameter("@roletype", roletype);
            param[11] = new SqlParameter("@casefilterCreatedBy", casefilterCreatedBy);
            param[12] = new SqlParameter("@ispersonal", ispersonal);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjecttype);
            param[16] = new SqlParameter("@notefilter", notefilter);
            param[17] = new SqlParameter("@othercourtname", othercourtname);
            param[18] = new SqlParameter("@opendateto", opendateto);
            param[19] = new SqlParameter("@caseFilingDate", caseFilingDate);
            param[20] = new SqlParameter("@caseFilingDateTo", caseFilingDateTo);
            param[21] = new SqlParameter("@isCaseArchived", isCaseArchived);
            param[22] = new SqlParameter("@custcolname", custcolname);
            param[23] = new SqlParameter("@custcolvalue", custcolvalue);
            param[24] = new SqlParameter("@disposeoption", disposeoption);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseidresirect);
            param[30] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrm);
            param[31] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[32] = new SqlParameter("@courtstatusfilter", courtstatusfilter);
            param[33] = new SqlParameter("@litigationfilter", litigationfilter);
            param[34] = new SqlParameter("@hearingsortfilter", hearingsortfilter);
            param[35] = new SqlParameter("@petionerfilter", petionerfilter);
            param[36] = new SqlParameter("@respondentrfilter", respondentrfilter);
            //GetNewCaseDetailByRowIdExportColumnSequence
            dtcs = SqlDbDAL.GetDataTableSP("GetBridgeStoneUserNewCaseDetailByRowIdNEWExport", param);
            return dtcs;
        }
        /// <summary>
        /// User Wise Assign Matter Count 
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public static string GetDashboardCountByUserId(string firmid,string userid,int pagenumber,int pagesize,string search)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@pageindex", pagenumber);
            param[3] = new SqlParameter("@pagesize", pagesize);
            param[4] = new SqlParameter("@searcahuser", search);
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetmatterCountByUser", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static DataTable usp_GetLitigationColumnMasterChoice(string firmid,string userid, string modulename)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@modulename", modulename);           
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetLitigationColumnMasterChoice", param);
            return dtcs;
        }
        public static DataTable usp_GetLitigationColumnMasterFirm(string firmid, string userid, string modulename)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@module", modulename);
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetLitigationColumnMasterFirm", param);
            return dtcs;
        }
        public static DataTable usp_mykase_GetCaseStatusChartCount(string firmid, string userid, Nullable<int> ispersonal)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@ispersonal", ispersonal);
            dtcs = SqlDbDAL.GetDataTableSP("usp_GetCourtStatusChartCount", param);
            return dtcs;
        }
        /// <summary>
        /// Get Matter Related Right For User
        /// </summary>
        /// <param name="frmids"></param>
        /// <param name="usrids"></param>
        /// <param name="assignusrids"></param>
        /// <param name="pageid"></param>
        /// <returns></returns>
        public static DataTable GetUserCaseModuleRightsCustom(string frmids, string usrids, string assignusrids, int pageid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@firmid", frmids);
            param[1] = new SqlParameter("@userid", usrids);
            param[2] = new SqlParameter("@assignuser", assignusrids);
            param[3] = new SqlParameter("@pageid", pageid);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetUserCaseModuleRightsCustom", param);
            return dtcs;
        }
        /// <summary>
        /// Get Matter Details By UserCaseId
        /// </summary>
        /// <param name="matterid"></param>
        /// <returns></returns>
        public static string GetMatterDetailsByUserCaseId(string FirmId,string UserCaseId)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@firmid", FirmId);
            param[1] = new SqlParameter("@UserCaseId", UserCaseId);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetMattersDetilsByUserCaseId", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get BOM Zone Details
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>
        public static string GetZoneValue(string firmId, string userid, string zonename, string Courtfilter, string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter, int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetZoneWiseMatter", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get All Matters By CourtWise
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>
        public static string GetAllMattersByCourtWise(string firmId, string userid, string zonename, string Courtfilter,
            string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter,int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByCourtWise", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get All Matters By CourtStatus
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>
        public static string GetAllMattersByCourtStatus(string firmId, string userid, string zonename, string Courtfilter, string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter,int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByCourtStatus", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get All Matters Count By Zone
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <param name="Nexthearingto"></param>
        /// <returns></returns>
        public static string GetAllMattersCountByZone(string firmId, string userid, string zonename, string Courtfilter,
      string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter, int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_AllMatterCountByZone", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string GetAllAssignPartnerUerByZone(string firmId, string userid, string zonename, string Courtfilter,
            string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter,int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllmatterCountByZone", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get Matter By Sub CourtWise
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <param name="Nexthearingto"></param>
        /// <returns></returns>
        public static string GetMatterBySubCourtWise(string firmId, string userid, string zonename, string Courtfilter,
            string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter, int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[9] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetMatterBySubCourtWise", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        ///  Get Sub Court Details
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <param name="Nexthearingto"></param>
        /// <param name="subcourtname"></param>
        /// <returns></returns>
        public static string GetMatterCountBySubCourtName(string firmId, string userid, string zonename, string Courtfilter,
            string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string subcourtname, string Againstthefilter,int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[11];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", zonename);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@subcourtname", subcourtname);
            param[9] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[10] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetMatterCountByCourtName", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get Matter Details by Assign User
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="assignuser"></param>
        /// <returns></returns>
        public static string GetMatterDetailsByAssignUser(string firmId, string userid, string assignuser,
            string Zonevalue, string Courtfilter, string CourtStatus, string UserAdvocate, string Nexthearing,
            string Nexthearingto, string SubCourtName, string Againstthefilter, int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[12];
            param[0] = new SqlParameter("@Firmid", firmId);
            param[1] = new SqlParameter("@UserId", userid);
            param[2] = new SqlParameter("@Assigneduser", assignuser);
            param[3] = new SqlParameter("@zonename", Zonevalue);
            param[4] = new SqlParameter("@Courtfilter", Courtfilter);
            param[5] = new SqlParameter("@CourtStatus", CourtStatus);
            param[6] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[7] = new SqlParameter("@nexthearing", Nexthearing);
            param[8] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[9] = new SqlParameter("@subcourtname", SubCourtName);
            param[10] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[11] = new SqlParameter("@type", type);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetMatterDetailsByAssigndUser", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Custom Report Export to Excel
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="assignuser"></param>
        /// <param name="Zonevalue"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="Nexthearing"></param>
        /// <param name="Nexthearingto"></param>
        /// <param name="SubCourtName"></param>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public static string GeMatterNewGraphExport(string firmId, string userid, string assignuser, string Zonevalue,
            string Courtfilter, string CourtStatus, string UserAdvocate, string Nexthearing, string Nexthearingto,
            string SubCourtName, int pagenumber, int pagesize, string Againstthefilter, int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[14];
            param[0] = new SqlParameter("@Firmid", firmId);
            param[1] = new SqlParameter("@UserId", userid);
            param[2] = new SqlParameter("@Assigneduser", assignuser);
            param[3] = new SqlParameter("@zonename", Zonevalue);
            param[4] = new SqlParameter("@Courtfilter", Courtfilter);
            param[5] = new SqlParameter("@CourtStatus", CourtStatus);
            param[6] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[7] = new SqlParameter("@nexthearing", Nexthearing);
            param[8] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[9] = new SqlParameter("@subcourtname", SubCourtName);
            param[10] = new SqlParameter("@PageNumber", pagenumber);
            param[11] = new SqlParameter("@pagesize", pagesize);
            param[12] = new SqlParameter("@Againstfilter", Againstthefilter);
            param[13] = new SqlParameter("@type", type);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetCustomMatterReport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get Data Againt/By The Party Name
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="assignuser"></param>
        /// <param name="Zonevalue"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="Nexthearing"></param>
        /// <param name="Nexthearingto"></param>
        /// <param name="againstbytheparty"></param>
        /// <returns></returns>
        public static string GeMatterReportAgainstBytheParty(string firmId, string userid, string assignuser, string Zonevalue,
         string Courtfilter, string CourtStatus, string UserAdvocate, string Nexthearing, string Nexthearingto,
         string againstbytheparty,int type)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[10];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@zonename", Zonevalue);
            param[3] = new SqlParameter("@Courtfilter", Courtfilter);
            param[4] = new SqlParameter("@CourtStatus", CourtStatus);
            param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
            param[6] = new SqlParameter("@nexthearing", Nexthearing);
            param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[8] = new SqlParameter("@Againstfilter", againstbytheparty);
            param[9] = new SqlParameter("@type", type);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_CustomReportAgainstthebank", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get All Matters By CourtStatus
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>
        //public static string GetAllMattersByCourtContested(string firmId, string userid, string status, string Courtfilter, string CourtStatus, string UserAdvocate, string nexthearing, string Nexthearingto, string Againstthefilter)
        //{
        //    DataTable dtcs = new DataTable();
        //    SqlParameter[] param = new SqlParameter[9];
        //    param[0] = new SqlParameter("@firmId", firmId);
        //    param[1] = new SqlParameter("@userid", userid);
        //    param[2] = new SqlParameter("@status", status);
        //    param[3] = new SqlParameter("@Courtfilter", Courtfilter);
        //    param[4] = new SqlParameter("@CourtStatus", CourtStatus);
        //    param[5] = new SqlParameter("@UserAdvocate", UserAdvocate);
        //    param[6] = new SqlParameter("@nexthearing", nexthearing);
        //    param[7] = new SqlParameter("@Nexthearingto", Nexthearingto);
        //    param[8] = new SqlParameter("@Againstfilter", Againstthefilter);
        //    dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByContested", param);
        //    var obj1 = JsonConvert.SerializeObject(dtcs);
        //    return obj1;
        //}

        public static string GetAllMattersByCourtContested(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByContested", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        /// <summary>
        /// Get BOM Zone Details
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>
        //public static string GetlocationValue(string firmId, string userid, string location, string status,  string nexthearing, string Nexthearingto)
        //{
        //    DataTable dtcs = new DataTable();
        //    SqlParameter[] param = new SqlParameter[6];
        //    param[0] = new SqlParameter("@firmId", firmId);
        //    param[1] = new SqlParameter("@userid", userid);
        //    param[2] = new SqlParameter("@location", location);
        //    param[3] = new SqlParameter("@status", status);
        //    param[4] = new SqlParameter("@nexthearing", nexthearing);
        //    param[5] = new SqlParameter("@Nexthearingto", Nexthearingto);
        //    dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByLocation", param);
        //    var obj1 = JsonConvert.SerializeObject(dtcs);
        //    return obj1;
        //}


        public static string GetlocationValue(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);

            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByLocation", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        /// <summary>
        /// Get BOM Zone Details
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userid"></param>
        /// <param name="zonename"></param>
        /// <param name="Courtfilter"></param>
        /// <param name="CourtStatus"></param>
        /// <param name="UserAdvocate"></param>
        /// <param name="nexthearing"></param>
        /// <returns></returns>

        //public static string GetDepartmentValue(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department)
        //{
        //    DataTable dtcs = new DataTable();
        //    SqlParameter[] param = new SqlParameter[7];
        //    param[0] = new SqlParameter("@firmId", firmId);
        //    param[1] = new SqlParameter("@userid", userid);
        //    param[2] = new SqlParameter("@department", department);
        //    param[3] = new SqlParameter("@location", location);
        //    param[4] = new SqlParameter("@status", status);
        //    param[5] = new SqlParameter("@nexthearing", nexthearing);
        //    param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
        //    dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByDepartment", param);
        //    var obj1 = JsonConvert.SerializeObject(dtcs);
        //    return obj1;
        //}
        public static string GetDepartmentValue(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByDepartment", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }



        public static string GetSubCourtValue(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterBySubCourtName", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        public static string AllMatterCountRbi(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_RBIAllMatterCountByZone", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        public static string AllMatterCountRbinextHearing(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt,string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetAllMatterByNexthearingCount", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string AllMatterRbinextHearingTabularData(string firmId, string userid, string nexthearing,string location,string status,string department,string subCourt)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[7];
            param[0] = new SqlParameter("@userId", userid);
            param[1] = new SqlParameter("@firmId", firmId);
            param[2] = new SqlParameter("@nextHearing", nexthearing);
            param[3] = new SqlParameter("@department", @department);
            param[4] = new SqlParameter("@location", location);
            param[5] = new SqlParameter("@status", status);
            param[6] = new SqlParameter("@subcourtName", subCourt);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetTabularDataOfNextHearing", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string AllMatterCountTabularData(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetCustomRbiMatterReport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string AllMatterListTabularData(string firmId, string userid, string location, string status, string nexthearing, string Nexthearingto, string department, string subCourt, string typeFlag, string pageNumber, string PageSize)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[11];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@department", department);
            param[3] = new SqlParameter("@location", location);
            param[4] = new SqlParameter("@status", status);
            param[5] = new SqlParameter("@nexthearing", nexthearing);
            param[6] = new SqlParameter("@Nexthearingto", Nexthearingto);
            param[7] = new SqlParameter("@subcourtName", subCourt);
            param[8] = new SqlParameter("@typeFlag", typeFlag);
            param[9] = new SqlParameter("@PageNumber", pageNumber);
            param[10] = new SqlParameter("@PageSize", PageSize);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetCustomRbiMatterTabularListData", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string Usp_GetUserCaseidFavourAgainst(string firmId, string likeFlag, string courtTypeFlag, string yearFlag, string year, string monthid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@likeFlag", likeFlag);
            param[2] = new SqlParameter("@courtTypeFlag", courtTypeFlag);
            param[3] = new SqlParameter("@yearFlag", yearFlag);
            param[4] = new SqlParameter("@year", year);
            param[5] = new SqlParameter("@monthid", monthid);
            dtcs = SqlDbDAL.GetDataTableSP("Usp_GetUserCaseidFavourAgainst", param);
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            string userCaseIds = string.Join(",", dtcs.AsEnumerable().Select(row => row["usercaseid"].ToString()));
            return userCaseIds;
        }
        public static string Sp_GetUserCaseId(string firmId, string flag, string monthid, string year)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@firmId", firmId);
            param[1] = new SqlParameter("@flag", flag);
            param[2] = new SqlParameter("@monthid", monthid);
            param[3] = new SqlParameter("@year", year);
            dtcs = SqlDbDAL.GetDataTableSP("Sp_GetUserCaseId", param);
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            string userCaseIds = string.Join(",", dtcs.AsEnumerable().Select(row => row["usercaseid"].ToString()));
            return userCaseIds;
        }
        public static DataTable GetMatterTrackingStatus(string firmId, string userid, int isadmin)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@firmid", firmId);
            param[1] = new SqlParameter("@userid", userid);
            param[2] = new SqlParameter("@isadmin", isadmin);
           dtcs = SqlDbDAL.GetDataTableSP("sp_GetMatterTrackingStatus", param);
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            return dtcs;
        }
        public static List<NoticeListModal> GetNoticeSentListRecord(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                               string RoleId, string NoticeStatus, string fromdaterange, string startdate,
                               string enddate, string fromreminder, string noticeid, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch, string CaseNoticeStatus, string IsArchived, string firmId)
        {
            SqlParameter[] param = new SqlParameter[20];
            param[0] = new SqlParameter("@UserId", UserId);
            param[1] = new SqlParameter("@SearchValue", SearchValue);
            param[2] = new SqlParameter("@PageNumber", PageNumber);
            param[3] = new SqlParameter("@PageSize", PageSize);
            param[4] = new SqlParameter("@ColumName", ColumName);
            param[5] = new SqlParameter("@SortedOrder", SortedOrder);
            param[6] = new SqlParameter("@RoleId", RoleId);
            param[7] = new SqlParameter("@status", NoticeStatus);
            param[8] = new SqlParameter("@firmid", firmId);
            param[9] = new SqlParameter("@fromdaterange", fromdaterange);
            param[10] = new SqlParameter("@startdate", startdate);
            param[11] = new SqlParameter("@enddate", enddate);
            param[12] = new SqlParameter("@fromreminder", fromreminder);
            param[13] = new SqlParameter("@noticeid", noticeid);
            param[14] = new SqlParameter("@sendernamesrch", sendernamesrch);
            param[15] = new SqlParameter("@srchnoticesubject", srchnoticesubject);
            param[16] = new SqlParameter("@srhnoticetitle", srhnoticetitle);
            param[17] = new SqlParameter("@noticetypesrch", noticetypesrch);
            param[18] = new SqlParameter("@CaseStatus", CaseNoticeStatus);
            param[19] = new SqlParameter("@IsArchived", IsArchived);

            DataTable dt = SqlDbDAL.GetDataTableSP("usp_GetNotice", param);
            string json = JsonConvert.SerializeObject(dt);
            List<NoticeListModal> result = JsonConvert.DeserializeObject<List<NoticeListModal>>(json);

            return result;
        }
        public static List<RecievedNoticModal> GetNoticeRecievedListRecord(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,string RoleId,
            string firmid, string noticeid, string fromdaterange, string startdate, string enddate, string fromreminder,string noticesubjectsrch, string noticetpesrch, string noticestatussrch,
            string notisendernamesrch, string casestatusfilter, string IsArchived)
        {
            SqlParameter[] param = new SqlParameter[19];
            param[0] = new SqlParameter("@UserId", UserId);
            param[1] = new SqlParameter("@SearchValue", SearchValue);
            param[2] = new SqlParameter("@PageNumber", PageNumber);
            param[3] = new SqlParameter("@PageSize", PageSize);
            param[4] = new SqlParameter("@ColumName", ColumName);
            param[5] = new SqlParameter("@SortedOrder", SortedOrder);
            param[6] = new SqlParameter("@RoleId", RoleId);
            param[7] = new SqlParameter("@firmid", firmid);
            param[8] = new SqlParameter("@fromdaterange", fromdaterange);
            param[9] = new SqlParameter("@startdate", startdate);
            param[10] = new SqlParameter("@enddate", enddate);
            param[11] = new SqlParameter("@fromreminder", fromreminder);
            param[12] = new SqlParameter("@noticeid", noticeid);
            param[13] = new SqlParameter("@noticesubjectsrch", noticesubjectsrch);
            param[14] = new SqlParameter("@noticetpesrch", noticetpesrch);
            param[15] = new SqlParameter("@noticestatussrch", noticestatussrch);
            param[16] = new SqlParameter("@notisendernamesrch", notisendernamesrch);
            param[17] = new SqlParameter("@CaseStatus", casestatusfilter);
            param[18] = new SqlParameter("@IsArchived", IsArchived);

            DataTable dt = SqlDbDAL.GetDataTableSP("usp_GetReceivedNoticeList", param);
            string json = JsonConvert.SerializeObject(dt);
            List<RecievedNoticModal> result = JsonConvert.DeserializeObject<List<RecievedNoticModal>>(json);

            return result;
        }

        public static DataTable GetVersionHistoryDetail(string InvoiceNo, string InvoiceId,string OriginalInvId, int PageNumber,int PageSize)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@InvoiceId", InvoiceId);
            param[1] = new SqlParameter("@InvoiceNo", InvoiceNo);
            param[2] = new SqlParameter("@OriginalInvId", OriginalInvId);
            param[3] = new SqlParameter("@PageNumber", PageNumber);
            param[4] = new SqlParameter("@PageSize", PageSize);
            dtcs = SqlDbDAL.GetDataTableSP("usp_InvoiceVersionHistory", param);
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            return dtcs;
        }
        public static int InsertOrUpdateChronology(
            string jobId,
            string userCaseId,
            string masterCaseId,
            string orderIds,
            string chronology,
            string remarks,
            string action,
            string orderDates,
            string createdOn)
        {
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@MasterCaseId", Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", userCaseId ?? (object)DBNull.Value);
            param[2] = new SqlParameter("@JobId", jobId ?? (object)DBNull.Value);
            param[3] = new SqlParameter("@Chronology", chronology ?? (object)DBNull.Value);
            param[4] = new SqlParameter("@OrderIds", orderIds ?? (object)DBNull.Value);
            param[5] = new SqlParameter("@Remarks", remarks ?? (object)DBNull.Value);
            param[6] = new SqlParameter("@Action", action ?? "INSERT");
            param[7] = new SqlParameter("@OrderDates", orderDates ?? (object)DBNull.Value);
            param[8] = new SqlParameter("@CreatedOn", createdOn ?? (object)DBNull.Value);

            return SqlDbDAL.InsertOrUpdateChronology("sp_InsertOrUpdateChronology", param);
        }
        public static int DeleteChronologyRemarks(string jobId, string userCaseId, string masterCaseId, string orderIds)
        {
            return InsertOrUpdateChronology(jobId, userCaseId, masterCaseId, orderIds, null, null, "DELETE_REMARKS", null, null);
        }
        public static List<ChronologyDetail> GetChronologyDetailList(string userCaseId, string masterCaseId,string FirmId)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@MasterCaseId", string.IsNullOrEmpty(masterCaseId) ? (object)DBNull.Value : Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", string.IsNullOrEmpty(userCaseId) ? (object)DBNull.Value : userCaseId);
            param[2] = new SqlParameter("@FirmId", string.IsNullOrEmpty(FirmId) ? (object)DBNull.Value : FirmId);

            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetChronologyById", param);

            List<ChronologyDetail> chronologyDetails = new List<ChronologyDetail>();

            foreach (DataRow row in dt.Rows)
            {
                chronologyDetails.Add(new ChronologyDetail
                {
                    MasterCaseId = Convert.ToInt64(row["MasterCaseId"]),
                    UserCaseId = row["UserCaseId"]?.ToString(),
                    JobId = row["JobId"]?.ToString(),
                    Chronology = row["Chronology"]?.ToString(),
                    Remarks = row["Remarks"]?.ToString(),
                    OrderIds = row["OrderIds"]?.ToString(),
                    OrderDates = row.Table.Columns.Contains("OrderDates") ? row["OrderDates"]?.ToString() : null,
                    CreatedOn = row.Table.Columns.Contains("CreatedOn") && row["CreatedOn"] != DBNull.Value ? Convert.ToDateTime(row["CreatedOn"]) : (DateTime?)null,
                    MatterName = row.Table.Columns.Contains("MatterName") ? row["MatterName"]?.ToString() : null
                });
            }

            return chronologyDetails;
        }

        public static List<SummaryDetail> GetSummaryDetailList(string userCaseId, string masterCaseId,string firmid)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@MasterCaseId", string.IsNullOrEmpty(masterCaseId) ? (object)DBNull.Value : Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", string.IsNullOrEmpty(userCaseId) ? (object)DBNull.Value : userCaseId);
            param[2] = new SqlParameter("@Firmid", string.IsNullOrEmpty(firmid) ? (object)DBNull.Value : firmid);
            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetSummaryDetailsByCase", param);

            List<SummaryDetail> summaryDetails = new List<SummaryDetail>();

            foreach (DataRow row in dt.Rows)
            {
                summaryDetails.Add(new SummaryDetail
                {
                    MasterCaseId = Convert.ToInt64(row["MasterCaseId"]),
                    UserCaseId = row["UserCaseId"]?.ToString(),
                    JobId = row["JobId"]?.ToString(),
                    Summary = row["Summary"]?.ToString(),
                    OrderIds = row.Table.Columns.Contains("OrderIds") ? row["OrderIds"]?.ToString() : null,
                    OrderDates = row.Table.Columns.Contains("OrderDates") ? row["OrderDates"]?.ToString() : null,
                    CreatedOn = row.Table.Columns.Contains("CreatedOn") ? Convert.ToDateTime(row["CreatedOn"]) : (DateTime?)null,
                    MatterName = row.Table.Columns.Contains("MatterName") ? row["MatterName"]?.ToString() : null
                });
            }

            return summaryDetails;
        }

        public static int InsertOrUpdateSummary(
            string jobId,
            string userCaseId,
            string masterCaseId,
            string summary,
            string orderIds, string orderDates, string createdOn) 
        {
            SqlParameter[] param = new SqlParameter[7];
            param[0] = new SqlParameter("@MasterCaseId", Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", userCaseId);
            param[2] = new SqlParameter("@JobId", jobId);
            param[3] = new SqlParameter("@Summary", (object)summary ?? DBNull.Value);
            param[4] = new SqlParameter("@OrderIds", (object)orderIds ?? DBNull.Value);
            param[5] = new SqlParameter("@OrderDates", (object)orderDates ?? DBNull.Value);
            param[6] = new SqlParameter("@CreatedOn", (object)createdOn ?? DBNull.Value);

            return SqlDbDAL.InsertOrUpdateSummary("sp_InsertOrUpdateSummary", param);
        }

        public static string loadnewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
           string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname,
           string mattertype, string subjectype, string casefilternotes, string casefiltercourtname, string odateto,
           string fillingdate, string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval,
           string disposeoption, string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno,
           string casefiltercnrno, string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto,
           string casedetailsfilter,string courtstatus, string hearingsortfilter, string petionerfilter,
           string respondentrfilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[35];
            param[0] = new SqlParameter("@firmid", Guid.Parse(firmid));
            param[1] = new SqlParameter("@userid", Guid.Parse(userid));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[10] = new SqlParameter("@ispersonal", filtervalue);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjectype);
            param[14] = new SqlParameter("@notefilter", casefilternotes);
            param[15] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[16] = new SqlParameter("@opendateto", odateto);
            param[17] = new SqlParameter("@caseFilingDate", fillingdate);
            param[18] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[19] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[20] = new SqlParameter("@custcolname", srchcustcolname);
            param[21] = new SqlParameter("@custcolvalue", srchcustcolval);
            param[22] = new SqlParameter("@disposeoption", disposeoption);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[28] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrom);
            param[29] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[30] = new SqlParameter("@courtstatusfilter", courtstatus);
            param[31] = new SqlParameter("@litigationfilter", casedetailsfilter);
            param[32] = new SqlParameter("@hearingsortfilter", hearingsortfilter);
            param[33] = new SqlParameter("@petionerfilter", SqlDbType.NVarChar)
            {
                Value = petionerfilter ?? (object)DBNull.Value
            };

            param[34] = new SqlParameter("@respondentrfilter", SqlDbType.NVarChar)
            {
                Value = respondentrfilter ?? (object)DBNull.Value
            };
            dtcs = SqlDbDAL.GetDataTableSP("GetNewCaseDetailByRowId", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string loadusernewcaselist(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
            string clientname, string court, string cstatus, int pageid, int roletype, string createdby, int filtervalue,
            string companyname, string mattertype, string subjectype, string casefilternotes, string casefiltercourtname,
            string odateto, string fillingdate, string fillingdateto, string IsCaseArchived, string srchcustcolname,
            string srchcustcolval, string disposeoption, string casefilterCaseDetails, string casefiltermtrno,
            string casefilterInternalno, string casefiltercnrno, string caseredirectfilter, string nexthearingdatefrom,
            string nexthearingdateto, string courtstatus, string casedetailsfilter, string hearingsortfilter,
            string petionerfilter, string respondentrfilter)

        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];

            param[0] = new SqlParameter("@firmid", Guid.Parse(firmid));
            param[1] = new SqlParameter("@userid", Guid.Parse(userid));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@pageid", pageid);
            param[10] = new SqlParameter("@roletype", "0");
            param[11] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[12] = new SqlParameter("@ispersonal", filtervalue);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjectype);
            param[16] = new SqlParameter("@notefilter", casefilternotes);
            param[17] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[18] = new SqlParameter("@opendateto", odateto);
            param[19] = new SqlParameter("@caseFilingDate", fillingdate);
            param[20] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[21] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[22] = new SqlParameter("@custcolname", srchcustcolname);
            param[23] = new SqlParameter("@custcolvalue", srchcustcolval);
            param[24] = new SqlParameter("@disposeoption", disposeoption);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[30] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrom);
            param[31] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[32] = new SqlParameter("@courtstatusfilter", courtstatus);
            param[33] = new SqlParameter("@litigationfilter", casedetailsfilter);
            param[34] = new SqlParameter("@hearingsortfilter", hearingsortfilter);
            param[35] = new SqlParameter("@petionerfilter", petionerfilter);
            param[36] = new SqlParameter("@respondentrfilter", respondentrfilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetUserNewCaseDetailByRowIdNEW", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string loadnewcaselistRowIdExport(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
           string clientname, string court, string cstatus, string createdby, int filtervalue, string companyname,
           string mattertype, string subjectype, string casefilternotes, string casefiltercourtname, string odateto,
           string fillingdate, string fillingdateto, string IsCaseArchived, string srchcustcolname, string srchcustcolval,
           string disposeoption, string casefilterCaseDetails, string casefiltermtrno, string casefilterInternalno,
           string casefiltercnrno, string caseredirectfilter, string nexthearingdatefrom, string nexthearingdateto,
           string courtstatusfilter, string hearingsort, string courtstatus, string hearingsortfilter, string petionerfilter,
           string respondentrfilter)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[34];
            param[0] = new SqlParameter("@firmid", Guid.Parse(firmid));
            param[1] = new SqlParameter("@userid", Guid.Parse(userid));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[10] = new SqlParameter("@ispersonal", filtervalue);
            param[11] = new SqlParameter("@companyname", companyname);
            param[12] = new SqlParameter("@mattertype", mattertype);
            param[13] = new SqlParameter("@subjecttype", subjectype);
            param[14] = new SqlParameter("@notefilter", casefilternotes);
            param[15] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[16] = new SqlParameter("@opendateto", odateto);
            param[17] = new SqlParameter("@caseFilingDate", fillingdate);
            param[18] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[19] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[20] = new SqlParameter("@custcolname", srchcustcolname);
            param[21] = new SqlParameter("@custcolvalue", srchcustcolval);
            param[22] = new SqlParameter("@disposeoption", disposeoption);
            param[23] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[24] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[25] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[26] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[27] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[28] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrom);
            param[29] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[30] = new SqlParameter("@courtstatusfilter", courtstatusfilter);
            param[31] = new SqlParameter("@litigationfilter", courtstatusfilter);
            param[32] = new SqlParameter("@hearingsortfilter", hearingsortfilter);
            param[33] = new SqlParameter("@petionerfilter", petionerfilter);
            param[33] = new SqlParameter("@respondentrfilter", respondentrfilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetNewCaseDetailByRowIdExport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string loadnewcaselistRowIdExportNEW(string firmid, string userid, int pagenum, int pagesize, string odate, string casename,
            string clientname, string court, string cstatus, int pageid, int roletype, string createdby, int filtervalue,
            string companyname, string mattertype, string subjectype, string casefilternotes, string casefiltercourtname,
            string odateto, string fillingdate, string fillingdateto, string IsCaseArchived, string srchcustcolname,
            string srchcustcolval, string disposeoption, string casefilterCaseDetails, string casefiltermtrno,
            string casefilterInternalno, string casefiltercnrno, string caseredirectfilter, string nexthearingdatefrom,
            string nexthearingdateto, string courtstatus, string casedetailsfilter, string hearingsortfilter,
            string petionerfilter, string respondentrfilter)

        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[37];

            param[0] = new SqlParameter("@firmid", Guid.Parse(firmid));
            param[1] = new SqlParameter("@userid", Guid.Parse(userid));
            param[2] = new SqlParameter("@PageNumber", pagenum);
            param[3] = new SqlParameter("@PageSize", pagesize);
            param[4] = new SqlParameter("@opendate", odate);
            param[5] = new SqlParameter("@casename", casename);
            param[6] = new SqlParameter("@clientname", clientname);
            param[7] = new SqlParameter("@courtname", court);
            param[8] = new SqlParameter("@casestatus", cstatus);
            param[9] = new SqlParameter("@pageid", pageid);
            param[10] = new SqlParameter("@roletype", roletype);
            param[11] = new SqlParameter("@casefilterCreatedBy", createdby);
            param[12] = new SqlParameter("@ispersonal", filtervalue);
            param[13] = new SqlParameter("@companyname", companyname);
            param[14] = new SqlParameter("@mattertype", mattertype);
            param[15] = new SqlParameter("@subjecttype", subjectype);
            param[16] = new SqlParameter("@notefilter", casefilternotes);
            param[17] = new SqlParameter("@othercourtname", casefiltercourtname);
            param[18] = new SqlParameter("@opendateto", odateto);
            param[19] = new SqlParameter("@caseFilingDate", fillingdate);
            param[20] = new SqlParameter("@caseFilingDateTo", fillingdateto);
            param[21] = new SqlParameter("@IsCaseArchived", IsCaseArchived);
            param[22] = new SqlParameter("@custcolname", srchcustcolname);
            param[23] = new SqlParameter("@custcolvalue", srchcustcolval);
            param[24] = new SqlParameter("@disposeoption", disposeoption);
            param[25] = new SqlParameter("@casefilterCaseDetails", casefilterCaseDetails);
            param[26] = new SqlParameter("@casefiltermtrno", casefiltermtrno);
            param[27] = new SqlParameter("@casefilterInternalno", casefilterInternalno);
            param[28] = new SqlParameter("@casefiltercnrno", casefiltercnrno);
            param[29] = new SqlParameter("@caseidresirect", caseredirectfilter);
            param[30] = new SqlParameter("@nexthearingdatefrm", nexthearingdatefrom);
            param[31] = new SqlParameter("@nexthearingdateto", nexthearingdateto);
            param[32] = new SqlParameter("@courtstatusfilter", courtstatus);
            param[33] = new SqlParameter("@litigationfilter", casedetailsfilter);
            param[34] = new SqlParameter("@hearingsortfilter", hearingsortfilter);
            param[35] = new SqlParameter("@petionerfilter", petionerfilter);
            param[36] = new SqlParameter("@respondentrfilter", respondentrfilter);
            dtcs = SqlDbDAL.GetDataTableSP("GetUserNewCaseDetailByRowIdNEWExport", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static int UpdateUsedOCRQuotaLimit(string firmId, int usedPages)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@FirmID", firmId);
            param[1] = new SqlParameter("@UsedPages", usedPages);

            int result = SqlDbDAL.ExecuteNonQuerySP("sp_UpdateOCRLimitUsedQuota", param);
            return result;
        }
        public static DataTable GetOCRLimitRaw(string firmId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmID", firmId);
            DataTable dtcs = SqlDbDAL.GetDataTableSP("sp_GetOCRLimitByFirmId", param);
            return dtcs;
        }
        public static int SaveOCRFileDetails(string firmId, string userId, string jobId, string fileName, string generatedOCR, string originalFilePath)
        {
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@FirmID", firmId);
            param[1] = new SqlParameter("@UserID", userId);
            param[2] = new SqlParameter("@JobID", jobId);
            param[3] = new SqlParameter("@FileNames", fileName);
            param[4] = new SqlParameter("@GeneratedOCR", SqlDbType.NVarChar)
            {
                Value = (object)generatedOCR ?? DBNull.Value,
                Size = -1
            };
            param[5] = new SqlParameter("@OriginalFilePath", originalFilePath ?? string.Empty);
            int result = SqlDbDAL.ExecuteNonQuerySP("sp_InsertOCRFileDetails", param);
            return result;
        }
        public static DataTable GetAllOCRFileDetails(string userId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserID", userId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("sp_GetAllOCRFileDetails", param);
            return dt;
        }
        public static DataTable GetCaseTaskInOutCount(string firmid, string userid)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@firmid", firmid);
            param[1] = new SqlParameter("@userid", userid);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("Usp_GetCaseTaskInOutCount", param);
            return dt;
        }


        public static DataTable GetComparecountDetails(string firmId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmID", firmId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("sp_CheckCompareDoc", param);
            return dt;
        }

        public static DataTable GettotalcountDetails(string firmId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@firmId", firmId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("Usp_matterlistcounttabs", param);
            return dt;
        }
        public static DataTable GettotalDocumentcountDetails(string firmId, string UserId, string pfile)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FirmUser", UserId);
            param[2] = new SqlParameter("@pfile", pfile);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("GetDocumenttotalCount", param);
            return dt;
        }

        internal static object usp_InsertPasswordResetToken(string resetlink, string UserId)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@UserId", UserId);
            param[1] = new SqlParameter("@Token", resetlink);
            int result = SqlDbDAL.ExecuteNonQuerySP("sp_InsertPasswordResetToken", param);
            return result;
        }

        internal static object sp_UpdateIsUsedFlag(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            int result = SqlDbDAL.ExecuteNonQuerySP("sp_MarkPasswordResetTokenAsUsed", param);
            return result;
        }

        internal static object sp_getIsUsedForUser(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("sp_GetPasswordResetTokenStatus", param);
            String isUsed = "0";

            if (dt != null && dt.Rows.Count > 0)
            {
                isUsed = Convert.ToString(dt.Rows[0]["IsUsed"]);
            }

            return isUsed.ToLower();
        }

        internal static object getResetMailTime(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("sp_GetCreatedTokenTime", param);
            String CreatedTime = "0";

            if (dt != null && dt.Rows.Count > 0)
            {
                CreatedTime = Convert.ToString(dt.Rows[0]["CreatedAt"]);
            }

            return CreatedTime.ToLower();
        }

        public static int UpdateNextHearingNonTracking(string alertDate, string matterId, string matterName, string dateType, string firmId, string userId)
        {
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@AlertDate", alertDate);
            param[1] = new SqlParameter("@MatterId", matterId);
            param[2] = new SqlParameter("@DateType", dateType);
            param[3] = new SqlParameter("@FirmId", firmId);
            param[4] = new SqlParameter("@CreatedBy", userId);
            param[5] = new SqlParameter("@MName", matterName);
            int result = SqlDbDAL.ExecuteNonQuerySP("sp_NextHearingNonTrackingCases_InsertUpdate", param);
            return result;
        }

        public static (string Token, string ExpireTime) getOTPFromDB(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("sp_GetCreatedTokenTime", param);
            String token = "0";
            String expireTime = "0";

            if (dt != null && dt.Rows.Count > 0)
            {
                token = Convert.ToString(dt.Rows[0]["Token"]);
                expireTime = Convert.ToString(dt.Rows[0]["CreatedAt"]);
            }

            return (token, expireTime);
        }

        public static DataTable Usp_GetFirmAdminDetail(string FirmId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@firmid", FirmId);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("Usp_GetFirmAdminDetail", param);
            return dt;
        }

        public static DataTable Usp_SaveNewNoticeLogDetail(string FirmId, string UserId, string NoticeTitle, string NoticeSubject, string ReceiverMailId, string MailStatus,string NoticeFrom)
        {
            SqlParameter[] param = new SqlParameter[7];
            param[0] = new SqlParameter("@FirmId", FirmId);
            param[1] = new SqlParameter("@UserId", UserId);
            param[2] = new SqlParameter("@NoticeTitle", NoticeTitle);
            param[3] = new SqlParameter("@NoticeSubject", NoticeSubject);
            param[4] = new SqlParameter("@ReceiverMailId", ReceiverMailId);
            param[5] = new SqlParameter("@MailStatus", MailStatus);
            param[6] = new SqlParameter("@NoticeFrom", NoticeFrom);
            DataTable dt = new DataTable();
            dt = SqlDbDAL.GetDataTableSP("Usp_SaveNewNoticeLogDetail", param);
            return dt;
        }

        public static string usp_GetBulkTemplateList(string UserId, string SearchValue, int PageNumber, int PageSize, int RoleId, string firmid, string Searchtitle)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[7];

            try
            {
                param[0] = new SqlParameter("@UserId", UserId);
                param[1] = new SqlParameter("@SearchValue", SearchValue);
                param[2] = new SqlParameter("@PageNumber", Convert.ToInt32(PageNumber));
                param[3] = new SqlParameter("@PageSize", Convert.ToInt32(PageSize));
                param[4] = new SqlParameter("@RoleId", RoleId);
                param[5] = new SqlParameter("@firmid", firmid);
                param[6] = new SqlParameter("@Searchtitle", Searchtitle);

                dtcs = db.GetDataTable("usp_GetBulkTemplateList", param);
            }
            catch (Exception ex)
            {
            }
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        public static string GetAttachedTemplate(string selfTemplateId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@SelfTemplateId", selfTemplateId);
                dtcs = db.GetDataTable("Usp_GetTemplateDetails", param);
            }
            catch (Exception ex)
            {
            }
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //IOCL customisation start
        public static string SaveIOCLMatterAdvAndDepDetails(
            string matterId,
            string department,
            string advocateName,
            string amount,
            string casebyagainst,
            string nexthearing)
        {
            // build param array (4 params total)
            SqlParameter[] param = new SqlParameter[7];

            param[0] = new SqlParameter("@Department", SqlDbType.NVarChar, 200)
            {
                Value = (object)department ?? DBNull.Value
            };

            param[1] = new SqlParameter("@AdvocateName", SqlDbType.NVarChar, 200)
            {
                Value = (object)advocateName ?? DBNull.Value
            };

            param[2] = new SqlParameter("@MatterId", SqlDbType.UniqueIdentifier)
            {
                Value = Guid.Parse(matterId)
            };
            param[3] = new SqlParameter("@Amount", SqlDbType.NVarChar, 200)
            {
                Value = (object)amount ?? DBNull.Value
            };
            param[4] = new SqlParameter("@CaseByAndAgainst", SqlDbType.NVarChar, 200)
            {
                Value = (object)casebyagainst ?? DBNull.Value
            };
            param[5] = new SqlParameter("@NextHearing", SqlDbType.NVarChar, 200)
            {
                Value = (object)nexthearing ?? DBNull.Value
            };
            param[6] = new SqlParameter("@RowId", SqlDbType.UniqueIdentifier)
            {
                Direction = ParameterDirection.Output
            };

            // call proc
            var rowsAffected = SqlDbDAL.ExecuteNonQuerySP("sp_UpsertIOCLCaseMatterTracking", param);

            // after ExecuteNonQuerySP returns, the output param should now be filled
            var rowId = param[3].Value != null ? param[3].Value.ToString() : null;

            var resultObj = new
            {
                Success = rowsAffected > 0,
                RowId = rowId,
                MatterId = matterId,
                Department = department,
                AdvocateName = advocateName
            };

            return JsonConvert.SerializeObject(resultObj);
        }

        public static DataTable GetIOCLAdvocateAndDepartment(string caseid)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@MatterId", caseid);
            dtcs = SqlDbDAL.GetDataTableSP("sp_GetIOCLAdvocateAndDepartment", param);
            return dtcs;
        }

        public static string IOCLDashBoardData(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetMatterDashboardBreakdownIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }


        //Total count 
        public static string IOCLDashBoardCount(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetMatterDashboardTotalsIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Advocate wise status 

        public static string IOCLDashBoardAdvocateWiseStatus(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetAdvocateStatusMatrixIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Departmentwise cases
        public static string IOCLDashBoardDepartmentwise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDepartmentWiseBreakdownIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Advocate wise case
        public static string IOCLDashBoardAdvocateWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetAdvocateWiseBreakdownIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Status wise breakdown
        public static string IOCLDashBoardStatusWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetStatusWiseBreakdownIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Court wise data break down
        public static string IOCLDashBoardCourtWise(string firmId, string filterCourtName, string filterStatus, string filterDepartment, string filterAdvocate)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@FilterCourtName", filterCourtName);
            param[2] = new SqlParameter("@FilterStatus", filterStatus);
            param[3] = new SqlParameter("@FilterAdvocate", filterAdvocate);
            param[4] = new SqlParameter("@FilterDepartment", filterDepartment);

            dtcs = SqlDbDAL.GetDataTableSP("sp_GetCourtWiseBreakdownIOCL", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //Court name 
        public static string IOCLDashBoardCourtList(string firmId)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmId", firmId);


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctCourtsByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        public static string IOCLDashBoardStatusList(string firmId)
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@FirmId", firmId);


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctStatusByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }
        //Advocate name list
        public static string IOCLDashBoardAdvocateList()
        {
            DataTable dtcs = new DataTable();
            SqlParameter[] param = new SqlParameter[0];


            dtcs = SqlDbDAL.GetDataTableSP("sp_GetDistinctAdvocateByFirm", param);
            var obj1 = JsonConvert.SerializeObject(dtcs);
            return obj1;
        }

        //IOCL customisation end
		
		public static DataTable GetCompleteUserDetailByUserID(string FirmId,string UserId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            try
            {
                param[0] = new SqlParameter("@firmid", FirmId);
                param[1] = new SqlParameter("@userid", UserId);
                dtcs = db.GetDataTable("usp_GetCompleteUserDetailByUserID", param);
            }
            catch (Exception ex)
            {
            }
            //var obj1 = JsonConvert.SerializeObject(dtcs);
            return dtcs;
        }
public static int InsertTranslationDetails(
            string userCaseId,
            string masterCaseId,
            string summary,
            string orderIds, string orderDates, string createdOn)
        {
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@MasterCaseId", Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", userCaseId);
            param[2] = new SqlParameter("@Translation", (object)summary ?? DBNull.Value);
            param[3] = new SqlParameter("@OrderIds", (object)orderIds ?? DBNull.Value);
            param[4] = new SqlParameter("@OrderDates", (object)orderDates ?? DBNull.Value);
            param[5] = new SqlParameter("@CreatedOn", (object)createdOn ?? DBNull.Value);

            return SqlDbDAL.InsertOrUpdateSummary("sp_InsertTranslationDetails", param);
        }

        public static List<TranslationDetail> GetTranslationDetailsList(string userCaseId, string masterCaseId, string firmid)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@MasterCaseId", string.IsNullOrEmpty(masterCaseId) ? (object)DBNull.Value : Convert.ToInt64(masterCaseId));
            param[1] = new SqlParameter("@UserCaseId", string.IsNullOrEmpty(userCaseId) ? (object)DBNull.Value : userCaseId);
            param[2] = new SqlParameter("@Firmid", string.IsNullOrEmpty(firmid) ? (object)DBNull.Value : firmid);
            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetTranslationDetails", param);

            List<TranslationDetail> translationDetail = new List<TranslationDetail>();

            foreach (DataRow row in dt.Rows)
            {
                translationDetail.Add(new TranslationDetail
                {
                    MasterCaseId = Convert.ToInt64(row["MasterCaseId"]),
                    UserCaseId = row["UserCaseId"]?.ToString(),
                    Translation = row["Translation"]?.ToString(),
                    OrderIds = row.Table.Columns.Contains("OrderIds") ? row["OrderIds"]?.ToString() : null,
                    OrderDates = row.Table.Columns.Contains("OrderDates") ? row["OrderDates"]?.ToString() : null,
                    CreatedOn = row.Table.Columns.Contains("CreatedOn") ? Convert.ToDateTime(row["CreatedOn"]) : (DateTime?)null,
                    MatterName = row.Table.Columns.Contains("MatterName") ? row["MatterName"]?.ToString() : null
                });
            }

            return translationDetail;
        }

        public static void InsertAIDrafterDetails(string draftQuery, string queryType, string resultDraft, string jobId, string userId)
        {
            SqlParameter[] param = new SqlParameter[5];

            param[0] = new SqlParameter("@draftQuery",
                        string.IsNullOrEmpty(draftQuery) ? (object)DBNull.Value : draftQuery);

            param[1] = new SqlParameter("@queryType",
                        string.IsNullOrEmpty(queryType) ? (object)DBNull.Value : queryType);

            param[2] = new SqlParameter("@resultDraft",
                        string.IsNullOrEmpty(resultDraft) ? (object)DBNull.Value : resultDraft);

            param[3] = new SqlParameter("@job_id",
                        string.IsNullOrEmpty(jobId) ? (object)DBNull.Value : jobId);
            param[4] = new SqlParameter("@userId",
                        string.IsNullOrEmpty(userId) ? (object)DBNull.Value : userId);

            SqlDbDAL.ExecuteNonQuerySP("sp_InsertAIDrafterDetails_test", param);
        }


        public static List<AIDrafterDetail> GetAIDrafterDetailsByJobId(string jobId)
        {
            SqlParameter[] param = new SqlParameter[1];

            param[0] = new SqlParameter("@job_id",
             string.IsNullOrEmpty(jobId) ? (object)DBNull.Value : jobId);

            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetAIDrafterDetailsByJobId", param);

            List<AIDrafterDetail> drafterDetails = new List<AIDrafterDetail>();

            foreach (DataRow row in dt.Rows)
            {
                drafterDetails.Add(new AIDrafterDetail
                {
                    DraftQuery = row["draftQuery"]?.ToString(),
                    QueryType = row["queryType"]?.ToString(),
                    ResultDraft = row["resultDraft"]?.ToString(),
                    Job_Id = row["job_id"]?.ToString(),
                    CreatedOn = Convert.ToDateTime(row["createdOn"])
                });
            }

            return drafterDetails;
        }


        public static List<AIDrafterDetail> GetAllAIDrafterDetails(string userId)
        {
            SqlParameter[] param = new SqlParameter[1];

            param[0] = new SqlParameter("@userId", string.IsNullOrEmpty(userId) ? (object)DBNull.Value : userId);

            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetAllAIDrafterDetails_test", param);

            List<AIDrafterDetail> drafterDetails = new List<AIDrafterDetail>();

            foreach (DataRow row in dt.Rows)
            {
                drafterDetails.Add(new AIDrafterDetail
                {
                    DraftQuery = row["draftQuery"]?.ToString(),
                    QueryType = row["queryType"]?.ToString(),
                    ResultDraft = row["resultDraft"]?.ToString(),
                    Job_Id = row["job_id"]?.ToString(),
                    CreatedOn = Convert.ToDateTime(row["createdOn"])
                });
            }

            return drafterDetails;
        }

        public static int InsertAIToolsQuotaLimit(
        string firmId,
        string userId,
        int totalQuota,
        int usedQuota,
        string firmCode,
        string toolsType)                                                   
        {
            SqlParameter[] param = new SqlParameter[6];

            param[0] = new SqlParameter("@firmid", firmId);
            param[1] = new SqlParameter("@userid", userId);
            param[2] = new SqlParameter("@totalQuota", totalQuota);
            param[3] = new SqlParameter("@usedQuota", usedQuota);
            param[4] = new SqlParameter("@FirmCode", firmCode);
            param[5] = new SqlParameter("@ToolsType", toolsType);

            int result = SqlDbDAL.ExecuteNonQuerySP("sp_InsertAIToolsQuotaLimit", param);

            return result;
        }

        public static DataTable GetAIToolsQuotaLimit(
        string firmId)
        {
            SqlParameter[] param = new SqlParameter[1];

            param[0] = new SqlParameter("@firmid", string.IsNullOrEmpty(firmId) ? (object)DBNull.Value : firmId);

            DataTable dt = SqlDbDAL.GetDataTableSP("sp_GetAIToolsQuotaLimit", param);

            return dt;
        }

        public static DataSet GetConsumerCases(string caseIdDetail,
     string caseNo,
     string caseId,
     string courtDetail,
     string placeOfCourt,
     string zone,
     string branch,
     string presentStatus,

     string nextHearingDateFrom,
     string nextHearingDateTo,

     string disposalDateFrom,
     string disposalDateTo,

     string filingDateFrom,
     string filingDateTo,

     string firstSummonDateFrom,
     string firstSummonDateTo,

     string firstSummonReceivedDateFrom,
     string firstSummonReceivedDateTo,

     string writtenStatementDateFrom,
     string writtenStatementDateTo,

     string interimOrderDateFrom,
     string interimOrderDateTo,

     string interimOrderReceivedDateFrom,
     string interimOrderReceivedDateTo,

     string finalOrderReceivedDateFrom,
     string finalOrderReceivedDateTo,

     int pageNumber,
     int pageSize, string FirmId
 )
        {
            SqlParameter[] param =
            {
                new SqlParameter("@caseIdDetail", caseIdDetail),
                 new SqlParameter("@FirmId", FirmId),
        new SqlParameter("@CaseNo",
            string.IsNullOrWhiteSpace(caseNo)
                ? (object)DBNull.Value
                : caseNo),

        new SqlParameter("@CaseId",
            string.IsNullOrWhiteSpace(caseId)
                ? (object)DBNull.Value
                : caseId),

        new SqlParameter("@CourtDetail",
            string.IsNullOrWhiteSpace(courtDetail)
                ? (object)DBNull.Value
                : courtDetail),

        new SqlParameter("@PlaceOfCourt",
            string.IsNullOrWhiteSpace(placeOfCourt)
                ? (object)DBNull.Value
                : placeOfCourt),

        new SqlParameter("@Zone",
            string.IsNullOrWhiteSpace(zone)
                ? (object)DBNull.Value
                : zone),

        new SqlParameter("@Branch",
            string.IsNullOrWhiteSpace(branch)
                ? (object)DBNull.Value
                : branch),

        new SqlParameter("@PresentStatus",
            string.IsNullOrWhiteSpace(presentStatus)
                ? (object)DBNull.Value
                : presentStatus),

        new SqlParameter("@NextHearingDateFrom",
            string.IsNullOrWhiteSpace(nextHearingDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(nextHearingDateFrom)),

        new SqlParameter("@NextHearingDateTo",
            string.IsNullOrWhiteSpace(nextHearingDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(nextHearingDateTo)),

        new SqlParameter("@DisposalDateFrom",
            string.IsNullOrWhiteSpace(disposalDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(disposalDateFrom)),

        new SqlParameter("@DisposalDateTo",
            string.IsNullOrWhiteSpace(disposalDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(disposalDateTo)),

        new SqlParameter("@FilingDateFrom",
            string.IsNullOrWhiteSpace(filingDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(filingDateFrom)),

        new SqlParameter("@FilingDateTo",
            string.IsNullOrWhiteSpace(filingDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(filingDateTo)),

        new SqlParameter("@FirstSummonDateFrom",
            string.IsNullOrWhiteSpace(firstSummonDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(firstSummonDateFrom)),

        new SqlParameter("@FirstSummonDateTo",
            string.IsNullOrWhiteSpace(firstSummonDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(firstSummonDateTo)),

        new SqlParameter("@FirstSummonReceivedDateFrom",
            string.IsNullOrWhiteSpace(firstSummonReceivedDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(firstSummonReceivedDateFrom)),

        new SqlParameter("@FirstSummonReceivedDateTo",
            string.IsNullOrWhiteSpace(firstSummonReceivedDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(firstSummonReceivedDateTo)),

        new SqlParameter("@WrittenStatementDateFrom",
            string.IsNullOrWhiteSpace(writtenStatementDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(writtenStatementDateFrom)),

        new SqlParameter("@WrittenStatementDateTo",
            string.IsNullOrWhiteSpace(writtenStatementDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(writtenStatementDateTo)),

        new SqlParameter("@InterimOrderDateFrom",
            string.IsNullOrWhiteSpace(interimOrderDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(interimOrderDateFrom)),

        new SqlParameter("@InterimOrderDateTo",
            string.IsNullOrWhiteSpace(interimOrderDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(interimOrderDateTo)),

        new SqlParameter("@InterimOrderReceivedDateFrom",
            string.IsNullOrWhiteSpace(interimOrderReceivedDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(interimOrderReceivedDateFrom)),

        new SqlParameter("@InterimOrderReceivedDateTo",
            string.IsNullOrWhiteSpace(interimOrderReceivedDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(interimOrderReceivedDateTo)),

        new SqlParameter("@FinalOrderReceivedDateFrom",
            string.IsNullOrWhiteSpace(finalOrderReceivedDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(finalOrderReceivedDateFrom)),

        new SqlParameter("@FinalOrderReceivedDateTo",
            string.IsNullOrWhiteSpace(finalOrderReceivedDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(finalOrderReceivedDateTo)),

        new SqlParameter("@PageNumber", pageNumber),
        new SqlParameter("@PageSize", pageSize)
    };

            //return SqlDbDAL.GetDataSetSP("sp_Get_tblConsumerCasesBOM",param);
            return SqlDbDAL.GetDataSetSP("Usp_tblConsumerCasesBOMNew", param);
        }

        public static DataSet GetAgainstBank(string caseIdDetail,
    string caseNo,
    string caseId,
    string courtDetail,
    string placeOfCourt,
    string zone,
    string branch,
    string presentStatus,

    DateTime? nextHearingDateFrom,
    DateTime? nextHearingDateTo,

    DateTime? disposalDateFrom,
    DateTime? disposalDateTo,

    DateTime? finalOrderReceivedDateFrom,
    DateTime? finalOrderReceivedDateTo,

    DateTime? interimOrderDateFrom,
    DateTime? interimOrderDateTo,

    DateTime? interimOrderReceivedDateFrom,
    DateTime? interimOrderReceivedDateTo,

    int pageNumber,
    int pageSize, string FirmId
)
        {
            SqlParameter[] param = new SqlParameter[]
            {
                new SqlParameter("@caseIdDetail", caseIdDetail),
                 new SqlParameter("@FirmId", FirmId),
        new SqlParameter(
            "@CaseNo",
            string.IsNullOrWhiteSpace(caseNo)
                ? (object)DBNull.Value
                : caseNo
        ),

        new SqlParameter(
            "@CaseId",
            string.IsNullOrWhiteSpace(caseId)
                ? (object)DBNull.Value
                : caseId
        ),

        new SqlParameter(
            "@CourtDetail",
            string.IsNullOrWhiteSpace(courtDetail)
                ? (object)DBNull.Value
                : courtDetail
        ),

        new SqlParameter(
            "@PlaceOfCourt",
            string.IsNullOrWhiteSpace(placeOfCourt)
                ? (object)DBNull.Value
                : placeOfCourt
        ),

        new SqlParameter(
            "@Zone",
            string.IsNullOrWhiteSpace(zone)
                ? (object)DBNull.Value
                : zone
        ),

        new SqlParameter(
            "@Branch",
            string.IsNullOrWhiteSpace(branch)
                ? (object)DBNull.Value
                : branch
        ),

        new SqlParameter(
            "@PresentStatus",
            string.IsNullOrWhiteSpace(presentStatus)
                ? (object)DBNull.Value
                : presentStatus
        ),

        new SqlParameter(
            "@NextHearingDateFrom",
            nextHearingDateFrom.HasValue
                ? (object)nextHearingDateFrom.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@NextHearingDateTo",
            nextHearingDateTo.HasValue
                ? (object)nextHearingDateTo.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@DisposalDateFrom",
            disposalDateFrom.HasValue
                ? (object)disposalDateFrom.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@DisposalDateTo",
            disposalDateTo.HasValue
                ? (object)disposalDateTo.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@FinalOrderReceivedDateFrom",
            finalOrderReceivedDateFrom.HasValue
                ? (object)finalOrderReceivedDateFrom.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@FinalOrderReceivedDateTo",
            finalOrderReceivedDateTo.HasValue
                ? (object)finalOrderReceivedDateTo.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@InterimOrderDateFrom",
            interimOrderDateFrom.HasValue
                ? (object)interimOrderDateFrom.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@InterimOrderDateTo",
            interimOrderDateTo.HasValue
                ? (object)interimOrderDateTo.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@InterimOrderReceivedDateFrom",
            interimOrderReceivedDateFrom.HasValue
                ? (object)interimOrderReceivedDateFrom.Value
                : DBNull.Value
        ),

        new SqlParameter(
            "@InterimOrderReceivedDateTo",
            interimOrderReceivedDateTo.HasValue
                ? (object)interimOrderReceivedDateTo.Value
                : DBNull.Value
        ),

        new SqlParameter("@PageNumber", pageNumber),
        new SqlParameter("@PageSize", pageSize)


            };

            //return SqlDbDAL.GetDataSetSP(
            //    "sp_Get_tblAgainstTheBankBOM",
            //    param
            //);
            return SqlDbDAL.GetDataSetSP(
                "sp_Get_tblAgainstTheBankBOMNew",
                param
            );
        }

        public static DataSet GetContingentLiability(string caseIdDetail, string FirmId,
    string caseNo,
    string caseId,
    string courtDetail,
    string placeOfCourt,
    string nextHearingDateFrom,
    string nextHearingDateTo,
    string dateOfClaimFrom,
    string dateOfClaimTo,
    int pageNumber = 1,
    int pageSize = 10

)
        {
            SqlParameter[] param = new SqlParameter[]
            {
                new SqlParameter("@caseIdDetail", caseIdDetail),
                 new SqlParameter("@FirmId", FirmId),
        new SqlParameter("@CaseNo",
            string.IsNullOrEmpty(caseNo)
                ? (object)DBNull.Value
                : caseNo),

        new SqlParameter("@CaseId",
            string.IsNullOrEmpty(caseId)
                ? (object)DBNull.Value
                : caseId),

        new SqlParameter("@CourtDetail",
            string.IsNullOrEmpty(courtDetail)
                ? (object)DBNull.Value
                : courtDetail),

        new SqlParameter("@PlaceOfCourt",
            string.IsNullOrEmpty(placeOfCourt)
                ? (object)DBNull.Value
                : placeOfCourt),

        new SqlParameter("@NextHearingDateFrom",
            string.IsNullOrEmpty(nextHearingDateFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(nextHearingDateFrom)),

        new SqlParameter("@NextHearingDateTo",
            string.IsNullOrEmpty(nextHearingDateTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(nextHearingDateTo)),

        new SqlParameter("@DateOfClaimFrom",
            string.IsNullOrEmpty(dateOfClaimFrom)
                ? (object)DBNull.Value
                : Convert.ToDateTime(dateOfClaimFrom)),

        new SqlParameter("@DateOfClaimTo",
            string.IsNullOrEmpty(dateOfClaimTo)
                ? (object)DBNull.Value
                : Convert.ToDateTime(dateOfClaimTo)),

        new SqlParameter("@PageNumber", pageNumber),
        new SqlParameter("@PageSize", pageSize)
            };

            //return SqlDbDAL.GetDataSetSP(
            //    "sp_Get_tblContingentLiabilityBOM",
            //    param
            //);
            return SqlDbDAL.GetDataSetSP(
                "Usp_tblContingentLiabilityNew",
                param
            );
        }

        public static int UpsertAgainstBank(AgainstBankModel model)
        {
            SqlParameter[] param = new SqlParameter[]
            {
                new SqlParameter("@MatterId",(object)model.MatterId ?? DBNull.Value),
        new SqlParameter("@CaseNo", model.CaseNo),

        new SqlParameter("@CaseId", (object)model.CaseId ?? DBNull.Value),
        new SqlParameter("@Zone", (object)model.Zone ?? DBNull.Value),
        new SqlParameter("@Branch", (object)model.Branch ?? DBNull.Value),

        new SqlParameter("@AccountHolderName", (object)model.AccountHolderName ?? DBNull.Value),
        new SqlParameter("@ClaimantAddress", (object)model.ClaimantAddress ?? DBNull.Value),

        new SqlParameter("@CIFNo", (object)model.CIFNo ?? DBNull.Value),
        new SqlParameter("@AccountNo", (object)model.AccountNo ?? DBNull.Value),

        new SqlParameter("@FirstSummonDate", (object)model.FirstSummonDate ?? DBNull.Value),
        new SqlParameter("@FirstSummonReceivedDate", (object)model.FirstSummonReceivedDate ?? DBNull.Value),

        new SqlParameter("@RespondentDetails", (object)model.RespondentDetails ?? DBNull.Value),
        new SqlParameter("@ProformaParties", (object)model.ProformaParties ?? DBNull.Value),

        new SqlParameter("@CaseProposing", (object)model.CaseProposing ?? DBNull.Value),
        new SqlParameter("@CaseType", (object)model.CaseType ?? DBNull.Value),
        new SqlParameter("@Department", (object)model.Department ?? DBNull.Value),

        new SqlParameter("@CourtDetail", (object)model.CourtDetail ?? DBNull.Value),
        new SqlParameter("@PlaceOfCourt", (object)model.PlaceOfCourt ?? DBNull.Value),

        new SqlParameter("@AreaOfComplaint", (object)model.AreaOfComplaint ?? DBNull.Value),

        new SqlParameter("@WrittenStatementDate", (object)model.WrittenStatementDate ?? DBNull.Value),
        new SqlParameter("@FactsOfCase", (object)model.FactsOfCase ?? DBNull.Value),

        new SqlParameter("@ClaimAmount", (object)model.ClaimAmount ?? DBNull.Value),

        new SqlParameter("@AdvocateName", (object)model.AdvocateName ?? DBNull.Value),
        new SqlParameter("@AdvocateContact", (object)model.AdvocateContact ?? DBNull.Value),

        new SqlParameter("@PresentStatus", (object)model.PresentStatus ?? DBNull.Value),

        new SqlParameter("@NextHearingDate", (object)model.NextHearingDate ?? DBNull.Value),
        new SqlParameter("@NextHearingPurpose", (object)model.NextHearingPurpose ?? DBNull.Value),

        new SqlParameter("@InterimOrderDate", (object)model.InterimOrderDate ?? DBNull.Value),
        new SqlParameter("@InterimOrderReceivedDate", (object)model.InterimOrderReceivedDate ?? DBNull.Value),

        new SqlParameter("@InterimDirection", (object)model.InterimDirection ?? DBNull.Value),
        new SqlParameter("@InterimComplianceStatus", (object)model.InterimComplianceStatus ?? DBNull.Value),
        new SqlParameter("@InterimRemarks", (object)model.InterimRemarks ?? DBNull.Value),

        new SqlParameter("@DisposalDate", (object)model.DisposalDate ?? DBNull.Value),
        new SqlParameter("@FinalOrderReceivedDate", (object)model.FinalOrderReceivedDate ?? DBNull.Value),

        new SqlParameter("@AwardAmount", (object)model.AwardAmount ?? DBNull.Value),

        new SqlParameter("@FinalDirection", (object)model.FinalDirection ?? DBNull.Value),
        new SqlParameter("@FinalComplianceStatus", (object)model.FinalComplianceStatus ?? DBNull.Value),
        new SqlParameter("@FinalRemarks", (object)model.FinalRemarks ?? DBNull.Value),

        new SqlParameter("@CreatedBy", "SYSTEM")
            };

            return SqlDbDAL.ExecuteNonQuerySP("sp_Upsert_tblAgainstTheBankBOM", param);
        }

        public static int UpsertConsumerCases(ConsumerCasesModel m)
        {
            SqlParameter[] p = new SqlParameter[]
            {
        new SqlParameter("@MatterId",m.MatterId),
        new SqlParameter("@CaseNo", m.CaseNo),
        new SqlParameter("@CaseId", (object)m.CaseId ?? DBNull.Value),
        new SqlParameter("@Zone", (object)m.Zone ?? DBNull.Value),
        new SqlParameter("@Branch", (object)m.Branch ?? DBNull.Value),

        new SqlParameter("@PetitionerName", (object)m.PetitionerName ?? DBNull.Value),
        new SqlParameter("@CIFNo", (object)m.CIFNo ?? DBNull.Value),
        new SqlParameter("@AccountNo", (object)m.AccountNo ?? DBNull.Value),

        new SqlParameter("@FirstSummonDate", (object)m.FirstSummonDate ?? DBNull.Value),
        new SqlParameter("@FirstSummonReceivedDate", (object)m.FirstSummonReceivedDate ?? DBNull.Value),

        new SqlParameter("@RespondentDetails", (object)m.RespondentDetails ?? DBNull.Value),

        new SqlParameter("@FilingDate", (object)m.FilingDate ?? DBNull.Value),
        new SqlParameter("@PresentStatus", (object)m.PresentStatus ?? DBNull.Value),

        new SqlParameter("@CourtDetail", (object)m.CourtDetail ?? DBNull.Value),
        new SqlParameter("@PlaceOfCourt", (object)m.PlaceOfCourt ?? DBNull.Value),

        new SqlParameter("@ClaimAmount", (object)m.ClaimAmount ?? DBNull.Value),
        new SqlParameter("@AdvocateName", (object)m.AdvocateName ?? DBNull.Value),
        new SqlParameter("@AdvocateContact", (object)m.AdvocateContact ?? DBNull.Value),
        new SqlParameter("@CaseType", (object)m.CaseType ?? DBNull.Value),

        new SqlParameter("@AreaOfComplaint", (object)m.AreaOfComplaint ?? DBNull.Value),
        new SqlParameter("@FactsOfCase", (object)m.FactsOfCase ?? DBNull.Value),

        new SqlParameter("@WrittenStatementDate", (object)m.WrittenStatementDate ?? DBNull.Value),

        new SqlParameter("@NextHearingDate", (object)m.NextHearingDate ?? DBNull.Value),
        new SqlParameter("@NextHearingPurpose", (object)m.NextHearingPurpose ?? DBNull.Value),

        new SqlParameter("@InterimOrderDate", (object)m.InterimOrderDate ?? DBNull.Value),
        new SqlParameter("@InterimOrderReceivedDate", (object)m.InterimOrderReceivedDate ?? DBNull.Value),

        new SqlParameter("@InterimDirection", (object)m.InterimDirection ?? DBNull.Value),
        new SqlParameter("@InterimComplianceStatus", (object)m.InterimComplianceStatus ?? DBNull.Value),
        new SqlParameter("@InterimRemarks", (object)m.InterimRemarks ?? DBNull.Value),

        new SqlParameter("@DisposalDate", (object)m.DisposalDate ?? DBNull.Value),
        new SqlParameter("@FinalOrderReceivedDate", (object)m.FinalOrderReceivedDate ?? DBNull.Value),

        new SqlParameter("@AwardAmount", (object)m.AwardAmount ?? DBNull.Value),

        new SqlParameter("@FinalDirection", (object)m.FinalDirection ?? DBNull.Value),
        new SqlParameter("@FinalComplianceStatus", (object)m.FinalComplianceStatus ?? DBNull.Value),
        new SqlParameter("@FinalRemarks", (object)m.FinalRemarks ?? DBNull.Value)
            };

            return SqlDbDAL.ExecuteNonQuerySP("sp_Upsert_tblConsumerCasesBOM", p);
        }

        public static int UpsertContingentLiability(ContingentLiabilityModel m)
        {
            SqlParameter[] p = new SqlParameter[]
            {
                 new SqlParameter("@MatterId",m.MatterId),
        new SqlParameter("@CaseId", (object)m.CaseId ?? DBNull.Value),
        new SqlParameter("@CaseNo", (object)m.CaseNo ?? DBNull.Value),

        new SqlParameter("@Zone", (object)m.Zone ?? DBNull.Value),
        new SqlParameter("@Branch", (object)m.Branch ?? DBNull.Value),

        // Account Holder / Claimant
        new SqlParameter("@AccountHolderName", (object)m.AccountHolderName ?? DBNull.Value),
        new SqlParameter("@ClaimantName", (object)m.ClaimantName ?? DBNull.Value),
        new SqlParameter("@ClaimantAddress", (object)m.ClaimantAddress ?? DBNull.Value),

        // Claim Details
        new SqlParameter("@DateOfClaim", (object)m.DateOfClaim ?? DBNull.Value),

        // Claim breakup
        new SqlParameter("@BankGuarantee", (object)m.BankGuarantee ?? DBNull.Value),
        new SqlParameter("@LetterOfCredit", (object)m.LetterOfCredit ?? DBNull.Value),
        new SqlParameter("@WrongPayment", (object)m.WrongPayment ?? DBNull.Value),
        new SqlParameter("@Fraud", (object)m.Fraud ?? DBNull.Value),
        new SqlParameter("@CounterClaim", (object)m.CounterClaim ?? DBNull.Value),
        new SqlParameter("@OthersClaim", (object)m.OthersClaim ?? DBNull.Value),

        // Security
        new SqlParameter("@NatureOfSecurity", (object)m.NatureOfSecurity ?? DBNull.Value),
        new SqlParameter("@RealisableValue", (object)m.RealisableValue ?? DBNull.Value),

        // Facts
        new SqlParameter("@FactsOfCase", (object)m.FactsOfCase ?? DBNull.Value),

        // Hearing
        new SqlParameter("@NextHearingPurpose", (object)m.NextHearingPurpose ?? DBNull.Value),
        new SqlParameter("@NextHearingDate", (object)m.NextHearingDate ?? DBNull.Value),

        // Provision
        new SqlParameter("@ProvisionDetail", (object)m.ProvisionDetail ?? DBNull.Value),
        new SqlParameter("@YearOfProvision", (object)m.YearOfProvision ?? DBNull.Value),

        new SqlParameter("@AmountProvision", (object)m.AmountProvision ?? DBNull.Value),
        new SqlParameter("@AmountDepositedInCourt", (object)m.AmountDepositedInCourt ?? DBNull.Value)
            };

            return SqlDbDAL.ExecuteNonQuerySP("sp_Upsert_tblContingentLiabilityBOM", p);
        }

        public static DataTable GetAgainstBankData(
    string CaseNo,
    string CaseId,
    string Zone,
    string Branch,

    string AccountHolderName,
    string ClaimantAddress,

    string CIFNo,
    string AccountNo,

    string FirstSummonDate,
    string FirstSummonReceivedDate,

    string RespondentDetails,
    string ProformaParties,

    string CaseProposing,
    string CaseType,
    string Department,

    string CourtDetail,
    string PlaceOfCourt,

    string AreaOfComplaint,

    string WrittenStatementDate,
    string FactsOfCase,

    string ClaimAmount,

    string AdvocateName,
    string AdvocateContact,

    string PresentStatus,

    string NextHearingDate,
    string NextHearingPurpose,

    string InterimOrderDate,
    string InterimOrderReceivedDate,

    string InterimDirection,
    string InterimComplianceStatus,
    string InterimRemarks,

    string DisposalDate,
    string FinalOrderReceivedDate,

    string AwardAmount,

    string FinalDirection,
    string FinalComplianceStatus,
    string FinalRemarks
)
        {
            DataTable dt = new DataTable();

            SqlParameter[] param = new SqlParameter[37];

            param[0] = new SqlParameter("@CaseNo", CaseNo);
            param[1] = new SqlParameter("@CaseId", CaseId);

            param[2] = new SqlParameter("@Zone", Zone);
            param[3] = new SqlParameter("@Branch", Branch);

            param[4] = new SqlParameter("@AccountHolderName", AccountHolderName);
            param[5] = new SqlParameter("@ClaimantAddress", ClaimantAddress);

            param[6] = new SqlParameter("@CIFNo", CIFNo);
            param[7] = new SqlParameter("@AccountNo", AccountNo);

            param[8] = new SqlParameter("@FirstSummonDate", FirstSummonDate);
            param[9] = new SqlParameter("@FirstSummonReceivedDate", FirstSummonReceivedDate);

            param[10] = new SqlParameter("@RespondentDetails", RespondentDetails);
            param[11] = new SqlParameter("@ProformaParties", ProformaParties);

            param[12] = new SqlParameter("@CaseProposing", CaseProposing);
            param[13] = new SqlParameter("@CaseType", CaseType);
            param[14] = new SqlParameter("@Department", Department);

            param[15] = new SqlParameter("@CourtDetail", CourtDetail);
            param[16] = new SqlParameter("@PlaceOfCourt", PlaceOfCourt);

            param[17] = new SqlParameter("@AreaOfComplaint", AreaOfComplaint);

            param[18] = new SqlParameter("@WrittenStatementDate", WrittenStatementDate);
            param[19] = new SqlParameter("@FactsOfCase", FactsOfCase);

            param[20] = new SqlParameter("@ClaimAmount", ClaimAmount);

            param[21] = new SqlParameter("@AdvocateName", AdvocateName);
            param[22] = new SqlParameter("@AdvocateContact", AdvocateContact);

            param[23] = new SqlParameter("@PresentStatus", PresentStatus);

            param[24] = new SqlParameter("@NextHearingDate", NextHearingDate);
            param[25] = new SqlParameter("@NextHearingPurpose", NextHearingPurpose);

            param[26] = new SqlParameter("@InterimOrderDate", InterimOrderDate);
            param[27] = new SqlParameter("@InterimOrderReceivedDate", InterimOrderReceivedDate);

            param[28] = new SqlParameter("@InterimDirection", InterimDirection);
            param[29] = new SqlParameter("@InterimComplianceStatus", InterimComplianceStatus);
            param[30] = new SqlParameter("@InterimRemarks", InterimRemarks);

            param[31] = new SqlParameter("@DisposalDate", DisposalDate);
            param[32] = new SqlParameter("@FinalOrderReceivedDate", FinalOrderReceivedDate);

            param[33] = new SqlParameter("@AwardAmount", AwardAmount);

            param[34] = new SqlParameter("@FinalDirection", FinalDirection);
            param[35] = new SqlParameter("@FinalComplianceStatus", FinalComplianceStatus);
            param[36] = new SqlParameter("@FinalRemarks", FinalRemarks);


            dt = SqlDbDAL.GetDataTableSP("sp_GetAgainstBankData", param);

            return dt;
        }

        public static DataTable ExportToExcelConsumerCasesBOM(
            string CaseNo,
            string CaseId,
            string Zone,
            string Branch,
            string PetitionerName,
            string CIFNo,
            string AccountNo,
            string FirstSummonDate,
            string FirstSummonReceivedDate,
            string RespondentDetails,
            string FilingDate,
            string PresentStatus,
            string CourtDetail,
            string PlaceOfCourt,
            string ClaimAmount,
            string CaseType,
            string AreaOfComplaint,
            string FactsOfCase,
            string WrittenStatementDate,
            string NextHearingDate,
            string NextHearingPurpose,
            string InterimOrderDate,
            string InterimOrderReceivedDate,
            string InterimDirection,
            string InterimComplianceStatus,
            string InterimRemarks,
            string DisposalDate,
            string FinalOrderReceivedDate,
            string AwardAmount,
            string FinalDirection,
            string FinalComplianceStatus,
            string FinalRemarks,
            string AdvocateName,
            string AdvocateContact
        )
        {
            SqlParameter[] param = new SqlParameter[]
            {
        new SqlParameter("@CaseNo", CaseNo),
        new SqlParameter("@CaseId", CaseId),
        new SqlParameter("@Zone", Zone),
        new SqlParameter("@Branch", Branch),
        new SqlParameter("@PetitionerName", PetitionerName),
        new SqlParameter("@CIFNo", CIFNo),
        new SqlParameter("@AccountNo", AccountNo),
        new SqlParameter("@FirstSummonDate", FirstSummonDate),
        new SqlParameter("@FirstSummonReceivedDate", FirstSummonReceivedDate),
        new SqlParameter("@RespondentDetails", RespondentDetails),
        new SqlParameter("@FilingDate", FilingDate),
        new SqlParameter("@PresentStatus", PresentStatus),
        new SqlParameter("@CourtDetail", CourtDetail),
        new SqlParameter("@PlaceOfCourt", PlaceOfCourt),
        new SqlParameter("@ClaimAmount", ClaimAmount),
        new SqlParameter("@CaseType", CaseType),
        new SqlParameter("@AreaOfComplaint", AreaOfComplaint),
        new SqlParameter("@FactsOfCase", FactsOfCase),
        new SqlParameter("@WrittenStatementDate", WrittenStatementDate),
        new SqlParameter("@NextHearingDate", NextHearingDate),
        new SqlParameter("@NextHearingPurpose", NextHearingPurpose),
        new SqlParameter("@InterimOrderDate", InterimOrderDate),
        new SqlParameter("@InterimOrderReceivedDate", InterimOrderReceivedDate),
        new SqlParameter("@InterimDirection", InterimDirection),
        new SqlParameter("@InterimComplianceStatus", InterimComplianceStatus),
        new SqlParameter("@InterimRemarks", InterimRemarks),
        new SqlParameter("@DisposalDate", DisposalDate),
        new SqlParameter("@FinalOrderReceivedDate", FinalOrderReceivedDate),
        new SqlParameter("@AwardAmount", AwardAmount),
        new SqlParameter("@FinalDirection", FinalDirection),
        new SqlParameter("@FinalComplianceStatus", FinalComplianceStatus),
        new SqlParameter("@FinalRemarks", FinalRemarks),
        new SqlParameter("@AdvocateName", AdvocateName),
        new SqlParameter("@AdvocateContact", AdvocateContact)
            };

            return SqlDbDAL.GetDataTableSP("sp_ExportToExcelConsumerCasesBOM", param);
        }

        public static DataTable ExportToExcelContingentLiability(
            string CaseId,
            string CaseNo,
            string Zone,
            string Branch,
            string AccountHolderName,
            string ClaimantName,
            string ClaimantAddress,
            string DateOfClaim,
            string BankGuarantee,
            string LetterOfCredit,
            string WrongPayment,
            string Fraud,
            string CounterClaim,
            string OthersClaim,
            string NatureOfSecurity,
            string RealisableValue,
            string FactsOfCase,
            string NextHearingPurpose,
            string NextHearingDate,
            string ProvisionDetail,
            string YearOfProvision,
            string AmountProvision,
            string AmountDepositedInCourt
        )
        {
            SqlParameter[] param = new SqlParameter[]
            {
        new SqlParameter("@CaseId", CaseId),
        new SqlParameter("@CaseNo", CaseNo),
        new SqlParameter("@Zone", Zone),
        new SqlParameter("@Branch", Branch),
        new SqlParameter("@AccountHolderName", AccountHolderName),
        new SqlParameter("@ClaimantName", ClaimantName),
        new SqlParameter("@ClaimantAddress", ClaimantAddress),
        new SqlParameter("@DateOfClaim", DateOfClaim),
        new SqlParameter("@BankGuarantee", BankGuarantee),
        new SqlParameter("@LetterOfCredit", LetterOfCredit),
        new SqlParameter("@WrongPayment", WrongPayment),
        new SqlParameter("@Fraud", Fraud),
        new SqlParameter("@CounterClaim", CounterClaim),
        new SqlParameter("@OthersClaim", OthersClaim),
        new SqlParameter("@NatureOfSecurity", NatureOfSecurity),
        new SqlParameter("@RealisableValue", RealisableValue),
        new SqlParameter("@FactsOfCase", FactsOfCase),
        new SqlParameter("@NextHearingPurpose", NextHearingPurpose),
        new SqlParameter("@NextHearingDate", NextHearingDate),
        new SqlParameter("@ProvisionDetail", ProvisionDetail),
        new SqlParameter("@YearOfProvision", YearOfProvision),
        new SqlParameter("@AmountProvision", AmountProvision),
        new SqlParameter("@AmountDepositedInCourt", AmountDepositedInCourt)
            };

            return SqlDbDAL.GetDataTableSP("sp_ExportToExcelContingentLiability", param);
        }


        /// <summary>
        /// Consolidated Personal Dashboard Summary — replaces 10+ separate SP calls
        /// Returns raw DataSet with multiple DataTables (one per result set).
        /// Consumers should process the DataSet directly to avoid EF type conflicts.
        /// </summary>
        public static DataSet GetPersonalDashboardSummary(string firmId, string userId, int ispersonal)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@firmid", firmId);
            param[1] = new SqlParameter("@userid", userId);
            param[2] = new SqlParameter("@ispersonal", ispersonal);

            return SqlDbDAL.GetDataSetSP("usp_GetPersonalDashboardSummary", param);
        }
        public static DataSet DeleteMatterDetails(string mcaseNo, string caseType)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@mcaseNo", mcaseNo);
            param[1] = new SqlParameter("@caseType", caseType);

            return SqlDbDAL.GetDataSetSP("usp_DeleteMatterDetail", param);
        }
        public static DataTable Usp_GetMatterNameWithId(string firmId, string term)
        {
            SqlParameter[] param = new SqlParameter[2];

            param[0] = new SqlParameter("@FirmId", firmId);
            param[1] = new SqlParameter("@term", term ?? "");

            return SqlDbDAL.GetDataTableSP("Usp_GetMatterNameWithId", param);
        }
    }

}