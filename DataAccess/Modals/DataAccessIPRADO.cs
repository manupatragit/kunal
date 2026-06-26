using DataAccess.ADODBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace DataAccess.Modals
{
    public class DataAccessIPRADO
    {
        public static DataTable GetdeleteRestoreIPRTrademark(string userId, string firmId, string filtertradmark, string applicationno, int pageindex, int pagesize1)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", filtertradmark);
                param[3] = new SqlParameter("@applno", applicationno);
                param[4] = new SqlParameter("@PageNumber", pageindex);
                param[5] = new SqlParameter("@PageSize", pagesize1);
                //dtcs = SqlDbDAL.GetDataTableSP("sp_GetDeleteIPRTrademark", param);
                dtcs = db.GetDataTable("sp_GetDeleteIPRTrademark", param);
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
            return dtcs;
        }

        /// <summary>
        /// Restore deleted Trademark
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="trademarkId"></param>
        /// <param name="iid"></param>
        /// <returns></returns>
        public static DataTable RestoredeleteRestoreIPRTrademark(string userId, string firmId, string trademarkId, string iid, string ip)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@trademarkId", trademarkId);
                param[3] = new SqlParameter("@iid", iid);
                param[4] = new SqlParameter("@ip", ip);
                dtcs = db.GetDataTable("sp_RestoreDeleteIPRTrademark", param);
            }
            catch (Exception ex)
            {
                //return ex.Message;
            }
            return dtcs;
        }
        /// <summary>
        /// Remove deleted Trademark
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="trademarkId"></param>
        /// <param name="iid"></param>
        /// <returns></returns>
        public static DataTable RemovedeleteRestoreIPRTrademark(string userId, string firmId, string trademarkId, string iid, string ip)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@trademarkId", trademarkId);
                param[3] = new SqlParameter("@iid", iid);
                param[4] = new SqlParameter("@ip", ip);
                dtcs = db.GetDataTable("sp_RemoveDeleteIPRTrademark", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }

        public static DataTable AddUserPatentData(int ifid, string vInventionTitle, string vApplNo, string dDateOffiling, string dPriorityDate, string vApplicantName, string statusName, string patentNo, string tradeiid, string userId, string firmId, string dAddedOn, string dPublicationDate)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[13];
            try
            {
                param[0] = new SqlParameter("@ifid", ifid);
                param[1] = new SqlParameter("@vInventionTitle", vInventionTitle);
                param[2] = new SqlParameter("@vApplicationNo", vApplNo);
                param[3] = new SqlParameter("@dDateOfFiling", dDateOffiling);
                param[4] = new SqlParameter("@dPriorityDate", dPriorityDate);
                param[5] = new SqlParameter("@vApplicantName", vApplicantName);
                param[6] = new SqlParameter("@StatusName", statusName);
                param[7] = new SqlParameter("@PatentNo", patentNo);
                param[8] = new SqlParameter("@Tradeiid", tradeiid);
                param[9] = new SqlParameter("@UserId", userId);
                param[10] = new SqlParameter("@FirmId", firmId);
                param[11] = new SqlParameter("@dAddedOn", dAddedOn);
                param[12] = new SqlParameter("@dPublicationDate", dPublicationDate);
                dtcs = db.GetDataTable("sp_AddUserPatentData", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }

        public static DataTable sp_GetAddedIPRPatent(string userId, string firmId, string searchtext, string applno, string patentno, string dDateofFilingfrom,
            string dDateofFilingTo, string vStatus, string vApplicantName, string dDateofPriorityfrom, string dDateofPriorityTo, string dClassification, Nullable<int> pageNumber, Nullable<int> pageSize, Nullable<int> vsort, string vcolname, string publicationdatefrom, string publicationdateto)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[18];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@applno", applno);
                param[4] = new SqlParameter("@patentno", patentno);
                param[5] = new SqlParameter("@dDateofFilingfrom", dDateofFilingfrom);
                param[6] = new SqlParameter("@dDateofFilingTo", dDateofFilingTo);
                param[7] = new SqlParameter("@vStatus", vStatus);
                param[8] = new SqlParameter("@vApplicantName", vApplicantName);
                param[9] = new SqlParameter("@dDateofPriorityfrom", dDateofPriorityfrom);
                param[10] = new SqlParameter("@dDateofPriorityTo", dDateofPriorityTo);
                param[11] = new SqlParameter("@dClassification", dClassification);
                param[12] = new SqlParameter("@PageNumber", pageNumber);
                param[13] = new SqlParameter("@PageSize", pageSize);
                param[14] = new SqlParameter("@vsort", vsort);
                param[15] = new SqlParameter("@vcolname", vcolname);
                param[16] = new SqlParameter("@publicationDateFrom", publicationdatefrom);
                param[17] = new SqlParameter("@publicationDateTo", publicationdateto);
                dtcs = db.GetDataTable("sp_GetAddedIPRPatent", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }

        public static DataTable RemoveUserAddedTradeMarkDetails(string tradeid, string userId, string firmId, string ipList, string iid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@userid", userId);
                param[1] = new SqlParameter("@firmid", firmId);
                param[2] = new SqlParameter("@id", tradeid);
                param[3] = new SqlParameter("@ip", ipList);
                param[4] = new SqlParameter("@viid", iid);
                dtcs = db.GetDataTable("sp_DeleteAddedTrademark", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }

        public static DataTable GetTrademarkSavedMail(string userId, string firmId, string tradeId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@Tradeiid", tradeId);
                dtcs = db.GetDataTable("Usp_GetTrademarkSavedMail", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }
        public static DataTable DeleteTrademarkSavedMail(string userId, string firmId, int tradeId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@Tradeiid", tradeId);
                dtcs = db.GetDataTable("Usp_DeleteAddedEmail", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }
        /// <summary>
        /// Create Root IPR Folder
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="directoryid"></param>
        /// <param name="fname"></param>
        /// <returns></returns>
        public static DataTable CreateRootIPRFolder(string userId, string firmId, string directoryid, string fname)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            try
            {
                SqlParameter[] param = new SqlParameter[4];
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@pfile", directoryid);
                param[3] = new SqlParameter("@fname", fname);
                dtcs = db.GetDataTable("usp_GetIPRrootParentFolder", param);
            }
            catch (Exception ex)
            {

            }

            return dtcs;
        }

        /// <summary>
        /// Save trademark
        /// </summary>
        /// <param name="id"></param>
        /// <param name="firmuser"></param>
        /// <param name="FirmId"></param>
        /// <param name="IP_Type"></param>
        /// <param name="Applicant_Type"></param>
        /// <param name="Applicant_Name etc"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public static DataTable saveipr(string id, string firmuser, string FirmId, string IP_Type, string Applicant_Type, string Applicant_Name, string Applicant_Address, string Applicant_Country, string Applicant_State,
                  string Applicant_District, string Applicant_EmailId, string Applicant_PhoneNo,
                  string Legal_Status, string Use_of_Mark, string Category_of_Mark, string Mark_of_title, string Image_description, string Isimage, string Conditions, string Class, string Priority, int IsActive, int IsArchive, DateTime date_tine, string vUsedSince, int iptypeid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[27];
            try
            {
                param[0] = new SqlParameter("@Id", id);
                param[1] = new SqlParameter("@firmuser", firmuser);
                param[2] = new SqlParameter("@FirmId", FirmId);
                param[3] = new SqlParameter("@IP_Type", IP_Type);
                param[4] = new SqlParameter("@Applicant_Type", Applicant_Type);
                param[5] = new SqlParameter("@Applicant_Name", Applicant_Name);
                param[6] = new SqlParameter("@Applicant_Address", Applicant_Address);
                param[7] = new SqlParameter("@Applicant_Country", Applicant_Country);
                param[8] = new SqlParameter("@Applicant_State", Applicant_State);
                param[9] = new SqlParameter("@Applicant_District", Applicant_District);
                param[10] = new SqlParameter("@Applicant_EmailId", Applicant_EmailId);
                param[11] = new SqlParameter("@Applicant_PhoneNo", Applicant_PhoneNo);
                param[12] = new SqlParameter("@Legal_Status", Legal_Status);
                param[13] = new SqlParameter("@Use_of_Mark", Use_of_Mark);
                param[14] = new SqlParameter("@Category_of_Mark", Category_of_Mark);
                param[15] = new SqlParameter("@Mark_of_title", Mark_of_title);
                param[16] = new SqlParameter("@Image_description", Image_description);
                param[17] = new SqlParameter("@Isimage", Isimage);
                param[18] = new SqlParameter("@Conditions", Conditions);
                param[19] = new SqlParameter("@Class", Class);
                param[20] = new SqlParameter("@Priority", Priority);
                param[21] = new SqlParameter("@IsActive", IsActive);
                param[22] = new SqlParameter("@IsArchive", IsArchive);
                param[23] = new SqlParameter("@date_tine", date_tine);
                param[24] = new SqlParameter("@vUsedSince", vUsedSince);
                param[25] = new SqlParameter("@resultid", "");
                param[26] = new SqlParameter("@IP_TypeId", iptypeid);
                dtcs = db.GetDataTable("usp_AddIPRCase", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Save File folder Cloud New IPR
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="filename"></param>
        /// <param name="azurefileid"></param>
        /// <param name="ftype"></param>
        /// <returns></returns>
        public static DataTable usp_SaveFilefolderCloudNew_IPR(string firmid, string userid, string filename, string azurefileid, int ftype, string pfile, string fdetails, string filetype, string fpermission, string id, string caseid, string newParentCheckin, int isIndex, string activityflag, Nullable<decimal> docsize, string isNotice, string isIPRParent)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[17];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@userid", userid);
                param[2] = new SqlParameter("@filename", filename);
                param[3] = new SqlParameter("@azurefileid", azurefileid);
                param[4] = new SqlParameter("@ftype", ftype);
                param[5] = new SqlParameter("@pfile", pfile);
                param[6] = new SqlParameter("@fdetails", fdetails);
                param[7] = new SqlParameter("@filetype", filetype);
                param[8] = new SqlParameter("@fpermission", fpermission);
                param[9] = new SqlParameter("@id", id);
                param[10] = new SqlParameter("@caseid", caseid);
                param[11] = new SqlParameter("@newParentCheckin", newParentCheckin);
                param[12] = new SqlParameter("@IsIndex", isIndex);
                param[13] = new SqlParameter("@activityflag", activityflag);
                param[14] = new SqlParameter("@docsize", docsize);
                param[15] = new SqlParameter("@IsNotice", isNotice);
                param[16] = new SqlParameter("@IsIPRParent", isIPRParent);
                //dtcs = SqlDbDAL.GetDataTableSP("sp_GetDeleteIPRTrademark", param);
                dtcs = db.GetDataTable("usp_SaveFilefolderCloudNew_IPR", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }
        /// <summary>
        /// Save Notice Doc Map
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="documentid"></param>
        /// <param name="modulename"></param>
        /// <param name="isFolder"></param>
        /// <param name="receiveReplyId"></param>
        /// <returns></returns>
        public static DataTable usp_SaveNoticeDocMap(string firmid, string userid, string noticeid, string documentid, string modulename, Nullable<int> isFolder, string receiveReplyId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[7];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@userid", userid);
                param[2] = new SqlParameter("@noticeid", noticeid);
                param[3] = new SqlParameter("@documentid", documentid);
                param[4] = new SqlParameter("@modulename", modulename);
                param[5] = new SqlParameter("@isFolder", isFolder == null ? 0 : isFolder);
                param[6] = new SqlParameter("@ReceiveReplyId", receiveReplyId);
                dtcs = db.GetDataTable("usp_SaveNoticeDocMap", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }
        /// <summary>
        /// Client Folder Exist Or Not
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticetitle"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        public static DataTable usp_ClientFolderExistOrNot(string firmid, string userid, string noticetitle, string pid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[4];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@foldertype", noticetitle);
                param[2] = new SqlParameter("@folderid", pid);
                param[3] = new SqlParameter("@Firmuser", userid);
                dtcs = db.GetDataTable("usp_TmFolderExistOrNot", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get IPR Folder Details By NoticeId
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <returns></returns>
        public static DataTable usp_GetIPRFolderDetailsByNoticeId(string firmid, string userid, string noticeid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@userid", userid);
                param[2] = new SqlParameter("@noticeid", noticeid);
                dtcs = db.GetDataTable("usp_GetIPRFolderDetailsByNoticeId", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Modify IPR Title Folder Name
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="folderid"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static DataTable usp_ModifyIPRTitleFolderName(string firmid, string folderid, string name)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@folderid", folderid);
                param[2] = new SqlParameter("@name", name);
                dtcs = db.GetDataTable("usp_ModifyIPRTitleFolderName", param);
            }
            catch (Exception ex)
            {

            }
            return dtcs;
        }

        /// <summary>
        /// Get Trademark data from Table based on ID or All data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static DataTable ViewIPRTrademarkCaseList(string userId, string firmId, int pagenum, int pagesize, string id = "")
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[1] = new SqlParameter("@firmuser", userId);
                param[0] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@PageNumber", pagenum);
                param[3] = new SqlParameter("@PageSize", pagesize);
                param[4] = new SqlParameter("@Id", id);
                dtcs = db.GetDataTable("sp_GetIPRCaseListByID", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Save GI IPR Details
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmId"></param>
        /// <param name="UserId"></param>
        /// <param name="ApplicantName"></param>
        /// <returns></returns>
        public static DataTable saveiprGI(string Id, string firmId, string UserId, string ApplicantName, string ApplicantAddress, string ApplicationNo, string GIName, string GIDate, string Class, string Goods, string Specifications)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[11];
            try
            {
                param[0] = new SqlParameter("@Id", Id);
                param[1] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@UserId", UserId);
                param[3] = new SqlParameter("@ApplicantName", ApplicantName);
                param[4] = new SqlParameter("@ApplicantAddress", ApplicantAddress);
                param[5] = new SqlParameter("@ApplicationNo", ApplicationNo);
                param[6] = new SqlParameter("@GIName", GIName);
                param[7] = new SqlParameter("@GIDate", GIDate);
                param[8] = new SqlParameter("@Class", Class);
                param[9] = new SqlParameter("@Goods", Goods);
                param[10] = new SqlParameter("@Specifications", Specifications);
                dtcs = db.GetDataTable("usp_AddGIIPR", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Get GI data from Table based on ID or All data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static DataTable ViewIPRGICaseList(string firmId, string userId, int pagenum, int pagesize, string id = "")
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@PageNumber", pagenum);
                param[3] = new SqlParameter("@PageSize", pagesize);
                param[4] = new SqlParameter("@Id", id);
                dtcs = db.GetDataTable("usp_GetGIIPRListByID", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Save Copy Right IPR Details
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmId"></param>
        /// <param name="UserId"></param>
        /// <param name="ApplicantCat_Name"></param>
        /// <returns></returns>
        public static DataTable saveiprCopyright(string Id, string firmId, string UserId, string ApplicantCat_Name, string ApplicantCat_Address, string Title_Work, string Diary_No, string Roc_No, string Category, string date_Value)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[10];
            try
            {
                param[0] = new SqlParameter("@Id", Id);
                param[1] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@UserId", UserId);
                param[3] = new SqlParameter("@ApplicantCat_Name", ApplicantCat_Name);
                param[4] = new SqlParameter("@ApplicantCat_Address", ApplicantCat_Address);
                param[5] = new SqlParameter("@Title_Work", Title_Work);
                param[6] = new SqlParameter("@Diary_No", Diary_No);
                param[7] = new SqlParameter("@Roc_No", Roc_No);
                param[8] = new SqlParameter("@Category", Category);
                param[9] = new SqlParameter("@dDate", date_Value);
                dtcs = db.GetDataTable("usp_AddIPRCopyright", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get Copy Right data from Table based on ID or All data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static DataTable ViewIPRCopyrightCaseList(string firmId, string userId, int pagenum, int pagesize, string id = "")
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@PageNumber", pagenum);
                param[3] = new SqlParameter("@PageSize", pagesize);
                param[4] = new SqlParameter("@Id", id);
                dtcs = db.GetDataTable("sp_GetIPRCopyrightCaseListByID", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Save Patent IPR Details
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmId"></param>
        /// <param name="UserId"></param>
        /// <param name="ApplicantName"></param>
        /// <returns></returns>
        public static DataTable saveiprPatent(string Id, string firmId, string UserId, string ApplicantName, string ApplicationNo, string PublicationDate, string FilingDate, string TitleOfInvention, string InternationalClassification,
            string PriorityDocumentNo, string PriorityDate, string PriorityCountry, string InternationalApplicationNo, string InternationalFilingDate, string InternationalPublicationNo, string PatentAdditionNo, string FilingDatePatentAddition, string DivisionalNo, string FilingDateInventor, string InventorName, string Abstract, string NoOfPages, string NoOfClaims, string PatentOfficeJournal)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[24];
            try
            {
                param[0] = new SqlParameter("@Id", Id);
                param[1] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@UserId", UserId);
                param[3] = new SqlParameter("@ApplicantName", ApplicantName);
                param[4] = new SqlParameter("@ApplicationNo", ApplicationNo);
                param[5] = new SqlParameter("@PublicationDate", PublicationDate);
                param[6] = new SqlParameter("@FilingDate", FilingDate);
                param[7] = new SqlParameter("@TitleOfInvention", TitleOfInvention);
                param[8] = new SqlParameter("@InternationalClassification", InternationalClassification);
                param[9] = new SqlParameter("@PriorityDocumentNo", PriorityDocumentNo);
                param[10] = new SqlParameter("@PriorityDate", PriorityDate);
                param[11] = new SqlParameter("@PriorityCountry", PriorityCountry);
                param[12] = new SqlParameter("@InternationalApplicationNo", InternationalApplicationNo);
                param[13] = new SqlParameter("@InternationalFilingDate", InternationalFilingDate);
                param[14] = new SqlParameter("@InternationalPublicationNo", InternationalPublicationNo);
                param[15] = new SqlParameter("@PatentAdditionNo", PatentAdditionNo);
                param[16] = new SqlParameter("@FilingDatePatentAddition", FilingDatePatentAddition);
                param[17] = new SqlParameter("@DivisionalNo", DivisionalNo);
                param[18] = new SqlParameter("@FilingDateInventor", FilingDateInventor);
                param[19] = new SqlParameter("@InventorName", InventorName);
                param[20] = new SqlParameter("@Abstract", Abstract);
                param[21] = new SqlParameter("@NoOfPages", NoOfPages);
                param[22] = new SqlParameter("@NoOfClaims", NoOfClaims);
                param[23] = new SqlParameter("@PatentOfficeJournal", PatentOfficeJournal);
                dtcs = db.GetDataTable("usp_AddPatentIPR", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get Patent data from Table based on ID or All data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static DataTable ViewIPRPatentCaseList(string firmId, string userId, int pagenum, int pagesize, string id = "")
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@PageNumber", pagenum);
                param[3] = new SqlParameter("@PageSize", pagesize);
                param[4] = new SqlParameter("@Id", id);
                dtcs = db.GetDataTable("sp_GetIPRPatentCaseListById", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Save Design IPR Details
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmId"></param>
        /// <param name="UserId"></param>
        /// <param name="ApplicantName"></param>
        /// <returns></returns>
        public static DataTable saveiprDesign(string Id, string firmId, string UserId, string ApplicantName, string ApplicantAddress, string Title, string DesignNumber, string Class, string dDate,
            string JournalNumber, string PriorityNumber, string PriorityDate, string PriorityCountry)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[13];
            try
            {
                param[0] = new SqlParameter("@Id", Id);
                param[1] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@UserId", UserId);
                param[3] = new SqlParameter("@ApplicantName", ApplicantName);
                param[4] = new SqlParameter("@ApplicantAddress", ApplicantAddress);
                param[5] = new SqlParameter("@Title", Title);
                param[6] = new SqlParameter("@DesignNumber", DesignNumber);
                param[7] = new SqlParameter("@Class", Class);
                param[8] = new SqlParameter("@dDate", dDate);
                param[9] = new SqlParameter("@JournalNumber", JournalNumber);
                param[10] = new SqlParameter("@PriorityNumber", PriorityNumber);
                param[11] = new SqlParameter("@PriorityDate", PriorityDate);
                param[12] = new SqlParameter("@PriorityCountry", PriorityCountry);
                dtcs = db.GetDataTable("usp_AddDesignIPR", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get Design data from Table based on ID or All data
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static DataTable ViewIPRDesignCaseList(string firmId, string userId, int pagenum, int pagesize, string id = "")
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@PageNumber", pagenum);
                param[3] = new SqlParameter("@PageSize", pagesize);
                param[4] = new SqlParameter("@Id", id);
                dtcs = db.GetDataTable("usp_GetDesignIPRListById", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable Usp_GetApplicationHearingDate(string firmId, string userid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userid);
                dtcs = db.GetDataTable("Usp_GetApplicationHearingDate", param);
            }
            catch
            { }
            return dtcs;
        }
        public static DataTable Usp_GetTrademarkHearingDetail(string firmid, string userid, int Pageno, int PageSize, string HearingDate)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@UserId", userid);
                param[1] = new SqlParameter("@FirmId", firmid);
                param[2] = new SqlParameter("@PageNo", Pageno);
                param[3] = new SqlParameter("@PageSize", PageSize);
                param[4] = new SqlParameter("@HearingDate", HearingDate);
                dtcs = db.GetDataTable("Usp_GetTrademarkHearingDetail", param);
            }
            catch
            { }
            return dtcs;
        }

        //public static DataTable GetIPRCopyrightList(string userId, string firmId, int pageNum, int pageSize, string searchtext, string diaryno, string categoryno, string datefrom, string dateto, string vStatus, string applicant, string rocno, int sort, string colname)
        //{
        //    DataTable dtcs = new DataTable();
        //    AdoDBSql db = new AdoDBSql();
        //    SqlParameter[] param = new SqlParameter[14];
        //    try
        //    {
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[1] = new SqlParameter("@firmid", firmId);
        //        param[2] = new SqlParameter("@searchtext", searchtext);
        //        param[3] = new SqlParameter("@applno", diaryno);
        //        param[4] = new SqlParameter("@categoryName", categoryno);
        //        param[5] = new SqlParameter("@dDateofFilingfrom", datefrom);
        //        param[6] = new SqlParameter("@dDateofFilingTo", dateto);
        //        param[7] = new SqlParameter("@vStatus", vStatus);
        //        param[8] = new SqlParameter("@vApplicantName", applicant);
        //        param[9] = new SqlParameter("@rocNo", rocno);
        //        param[10] = new SqlParameter("@PageNumber", pageNum);
        //        param[11] = new SqlParameter("@PageSize", pageSize);
        //        param[12] = new SqlParameter("@vsort", sort);
        //        param[13] = new SqlParameter("@vcolname", colname);
        //        dtcs = db.GetDataTable("sp_GetIPRCopyright", param);
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return dtcs;
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="pageNum"></param>
        /// <param name="pageSize"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public static DataTable GetIPRCopyrightList(string userId, string firmId, int pageNum, int pageSize, string searchtext, string diaryno, string categoryno, string datefrom, string dateto, string vStatus, string applicant, string rocno, int sort, string colname)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[14];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmid", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@applno", diaryno);
                param[4] = new SqlParameter("@categoryName", categoryno);
                param[5] = new SqlParameter("@dDateofFilingfrom", datefrom);
                param[6] = new SqlParameter("@dDateofFilingTo", dateto);
                param[7] = new SqlParameter("@vStatus", vStatus);
                param[8] = new SqlParameter("@vApplicantName", applicant);
                param[9] = new SqlParameter("@rocNo", rocno);
                param[10] = new SqlParameter("@pageNumber", pageNum);
                param[11] = new SqlParameter("@pageSize", pageSize);
                param[12] = new SqlParameter("@vsort", sort);
                param[13] = new SqlParameter("@vcolname", colname);
                dtcs = db.GetDataTable("sp_GetAddedIPRCopyright", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Get deleted Restore IPR Copyright
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="filtertradmark"></param>
        /// <param name="applicationno"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize1"></param>
        /// <returns></returns>
        public static DataTable GetdeleteRestoreIPRCopyright(string userId, string firmId, string filtertradmark, string applicationno, int pageindex, int pagesize1)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", filtertradmark);
                param[3] = new SqlParameter("@applno", applicationno);
                param[4] = new SqlParameter("@PageNumber", pageindex);
                param[5] = new SqlParameter("@PageSize", pagesize1);
                dtcs = db.GetDataTable("sp_GetDeleteIPRCopyright", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get IPR Patent List on filter 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="pageNum"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public static DataTable GetAddedPatentDetails(string userId, string firmId, int pageNum, int pageSize, string searchtext, string datefrom, string dateto, string vStatus, string applicantName, string priorityDateFrom, string priorityDateTo, string publishDateFrom, string publishDateTo, string patentno, string applicationno)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[15];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@applicationno", applicationno);
                param[4] = new SqlParameter("@patentno", patentno);
                param[5] = new SqlParameter("@dDateofFilingfrom", datefrom);
                param[6] = new SqlParameter("@dDateofFilingTo", dateto);
                param[7] = new SqlParameter("@vStatus", vStatus);
                param[8] = new SqlParameter("@vApplicantName", applicantName);
                param[9] = new SqlParameter("@dDateofPriorityfrom", priorityDateFrom);
                param[10] = new SqlParameter("@dDateofPriorityTo", priorityDateTo);
                param[11] = new SqlParameter("@dDateofPublishfrom", publishDateFrom);
                param[12] = new SqlParameter("@dDateofPublishTo", publishDateTo);
                param[13] = new SqlParameter("@PageNumber", pageNum);
                param[14] = new SqlParameter("@PageSize", pageSize);

                dtcs = db.GetDataTable("sp_GetAddedIPRPatent", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Save Bridge Stone matter Unique Case id During creating the matter
        /// </summary>
        /// <param name="matterId"></param>
        /// <returns></returns>
        public static string SaveBridgeStoneOtherMatterDetails(string matterId)
        {

            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@matterId", matterId);
            var dtcs = db.ExecuteNonQuery("sp_bridgeStoneUniqueCaseIdInsert", param);
            return dtcs.ToString();
        }

        /// <summary>
        /// Get list of Patent deleted data
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="filtertradmark"></param>
        /// <param name="applicationno"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize1"></param>
        /// <returns></returns>
        public static DataTable GetdeleteRestoreIPRPatent(string userId, string firmId, string filtertradmark, string applicationno, int pageindex, int pagesize1)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", filtertradmark);
                param[3] = new SqlParameter("@applno", applicationno);
                param[4] = new SqlParameter("@PageNumber", pageindex);
                param[5] = new SqlParameter("@PageSize", pagesize1);
                dtcs = db.GetDataTable("sp_GetDeleteIPRPatent", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Get list of GI deleted data
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="filtertradmark"></param>
        /// <param name="applicationno"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public static DataTable GetdeleteRestoreIPRGI(string userId, string firmId, string filtertradmark, string applicationno, int pageindex, int pagesize)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", filtertradmark);
                param[3] = new SqlParameter("@applno", applicationno);
                param[4] = new SqlParameter("@PageNumber", pageindex);
                param[5] = new SqlParameter("@PageSize", pagesize);
                dtcs = db.GetDataTable("sp_GetDeleteIPRGI", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        /// <summary>
        /// Get list of Design deleted data
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="filtertradmark"></param>
        /// <param name="applicationno"></param>
        /// <param name="pageindex"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        public static DataTable GetdeleteRestoreIPRDesign(string userId, string firmId, string filtertradmark, string applicationno, int pageindex, int pagesize)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", filtertradmark);
                param[3] = new SqlParameter("@applno", applicationno);
                param[4] = new SqlParameter("@PageNumber", pageindex);
                param[5] = new SqlParameter("@PageSize", pagesize);
                dtcs = db.GetDataTable("sp_GetDeleteIPRDesign", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="searchtext"></param>
        /// <param name="applicationno"></param>
        /// <param name="status"></param>
        /// <param name="applicantname"></param>
        /// <param name="vclass"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public static DataTable BindAddedIPRGI(string userId, string firmId, string searchtext, string applicationno, string status,
            string applicantname, string vclass, string journalNo, string datefrom, string dateto, string validupto,
            int? pageNumber, int? pageSize, int? vsort, string vcolname)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[15];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@applicationno", applicationno);
                param[4] = new SqlParameter("@status", status);
                param[5] = new SqlParameter("@applicantname", applicantname);
                param[6] = new SqlParameter("@vclass", vclass);
                param[7] = new SqlParameter("@journalNo", journalNo);
                param[8] = new SqlParameter("@datefrom", datefrom);
                param[9] = new SqlParameter("@dateto", dateto);
                param[10] = new SqlParameter("@validupto", validupto);
                param[11] = new SqlParameter("@PageNumber", pageNumber);
                param[12] = new SqlParameter("@PageSize", pageSize);
                param[13] = new SqlParameter("@vsort", vsort);
                param[14] = new SqlParameter("@vcolname", vcolname);

                dtcs = db.GetDataTable("sp_GetAddedIPRGI", param);
            }
            catch { }
            return dtcs;
        }

        //public static DataTable AddUserDesignData(int ifid, string vDesignno, string vClass, string vApplDetails, string vAddress, string dDateOfRegistration,
        //    string vPatentOffJournal, string vTitle, string vPriorityNo, string userid, string firmid, int Tradeiid)
        //{
        //    DataTable dtcs = new DataTable();
        //    AdoDBSql db = new AdoDBSql();
        //    SqlParameter[] param = new SqlParameter[15];
        //    try
        //    {
        //        param[0] = new SqlParameter("@ifid", ifid);
        //        param[0] = new SqlParameter("@vDesignNo", vDesignno);
        //        param[0] = new SqlParameter("@vClass", vClass);
        //        param[0] = new SqlParameter("@vApplDetails", vApplDetails);
        //        param[0] = new SqlParameter("@vAddress", vAddress);
        //        param[0] = new SqlParameter("@dDateOfRegistration", dDateOfRegistration);
        //        param[0] = new SqlParameter("@vTitle", vTitle);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //        param[0] = new SqlParameter("@userId", userId);
        //    }
        //    catch
        //    {

        //    }
        //}
        public static DataTable GetAddedIPRDesign(string UserId, string FirmId, string searchText, string DesignNo, string vClass,
            string Appldetails, string vStatus, string vTitle, int pagenum, int pagesize, int vSort, string vColname, string dateofregisterfrom, string dateofregisterto)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[14];
            try
            {
                param[0] = new SqlParameter("@userId", UserId);
                param[1] = new SqlParameter("@firmId", FirmId);
                param[2] = new SqlParameter("@searchtext", searchText);
                param[3] = new SqlParameter("@vDesignNo", DesignNo);
                param[4] = new SqlParameter("@vClass", vClass);
                param[5] = new SqlParameter("@appldetails", Appldetails);
                param[6] = new SqlParameter("@vstatus", vStatus);
                param[7] = new SqlParameter("@vTitle", vTitle);
                param[8] = new SqlParameter("@PageNumber", pagenum);
                param[9] = new SqlParameter("@PageSize", pagesize);
                param[10] = new SqlParameter("@vsort", vSort);
                param[11] = new SqlParameter("@vcolname", vColname);
                param[12] = new SqlParameter("@dateofregisterfrom", dateofregisterfrom);
                param[13] = new SqlParameter("@dateofregisterto", dateofregisterto);
                dtcs = db.GetDataTable("sp_GetAddedIPRDesign", param);
            }
            catch (Exception ex)
            { }
            return dtcs;
        }

        /// <summary>
        /// Insert Multiple Details Through List in single db hit
        /// </summary>
        /// <param name="request"></param>
        /// <param name="firmId"></param>
        /// <param name="UserId"></param>
        /// <param name="searchType"></param>
        /// <returns></returns>
        public static string SaveMultipleDetailsToTrack(TrademarkDetailsList request, string firmId, string UserId, string searchType)
        {
            // Initialize database connection object
            AdoDBSql db = new AdoDBSql();
            DataTable dataTable = new DataTable();
            dataTable.Columns.Add("firmId", typeof(string));
            dataTable.Columns.Add("userId", typeof(string));
            dataTable.Columns.Add("iid", typeof(int));
            dataTable.Columns.Add("ifid", typeof(int));
            dataTable.Columns.Add("vWordMark", typeof(string));
            dataTable.Columns.Add("vProprietor", typeof(string));
            dataTable.Columns.Add("vApplNo", typeof(string));
            dataTable.Columns.Add("vClass", typeof(string));
            dataTable.Columns.Add("dApplDate", typeof(string));
            dataTable.Columns.Add("vJournalNo", typeof(string));
            dataTable.Columns.Add("dJournalDate", typeof(string));
            dataTable.Columns.Add("vStatus", typeof(string));
            dataTable.Columns.Add("vUsedSince", typeof(string));
            dataTable.Columns.Add("dValidUpto", typeof(string));
            dataTable.Columns.Add("dGSDescription", typeof(string));
            dataTable.Columns.Add("dCrwalDate", typeof(string));
            dataTable.Columns.Add("vImgPath", typeof(string));
            dataTable.Columns.Add("Agent", typeof(string));
            dataTable.Columns.Add("AgentAddress", typeof(string));
            dataTable.Columns.Add("SearchType", typeof(string));
            foreach (var item in request.data)
            {
                DataRow row = dataTable.NewRow();
                row["firmId"] = firmId;
                row["userId"] = UserId;
                row["iid"] = item.iid;
                row["ifid"] = item.ifid;
                row["vWordMark"] = item.vWordMark;
                row["vProprietor"] = item.vProprietor;
                row["vApplNo"] = item.vApplNo;
                row["vClass"] = item.vClass;
                row["dApplDate"] = item.dApplDate;
                row["vJournalNo"] = item.vJournalNo;
                row["dJournalDate"] = item.dJournalDate;
                row["vStatus"] = item.vStatus;
                row["vUsedSince"] = item.vUsedSince;
                row["dValidUpto"] = item.dValidUpto;
                row["dGSDescription"] = item.dGSDescription;
                row["dCrwalDate"] = item.dCrwalDate;
                row["vImgPath"] = item.vImgPath;
                row["Agent"] = item.Agent;
                row["AgentAddress"] = item.AgentAddress;
                row["SearchType"] = searchType;
                dataTable.Rows.Add(row);
            }
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@TrademarkDetails", SqlDbType.Structured)
            {
                TypeName = "dbo.AddTrackTableType",
                Value = dataTable
            };

            var result = db.ExecuteNonQuery("sp_AddUserTrademarkDataByPropSearch", param);

            return result.ToString();
        }

        /// <summary>
        /// Add design in tracker
        /// </summary>
        /// <param name="ifid"></param>
        /// <param name="vDesignno"></param>
        /// <param name="vClass"></param>
        /// <param name="vApplDetails"></param>
        /// <param name="vAddress"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public static int sp_AddUserDesignData(int ifid, string vDesignno, string vClass, string vApplDetails, string vAddress, string dDateOfRegistration,
            string vPatentOffJournal, string vTitle, string vPriorityNo, string userid, string firmid, int Tradeiid, string vStatus)
        {
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[13];
            int dtcs = 0;
            try
            {
                param[0] = new SqlParameter("@ifid", ifid);
                param[1] = new SqlParameter("@vDesignNo", vDesignno);
                param[2] = new SqlParameter("@vClass", vClass);
                param[3] = new SqlParameter("@vApplDetails", vApplDetails);
                param[4] = new SqlParameter("@vAddress", vAddress);
                param[5] = new SqlParameter("@dDateOfRegistration", dDateOfRegistration);
                param[6] = new SqlParameter("@vTitle", vTitle);
                param[7] = new SqlParameter("@vPriorityNo", vPriorityNo);
                param[8] = new SqlParameter("@vPatentOffJournalNo", vPatentOffJournal);
                param[9] = new SqlParameter("@vuserid", userid);
                param[10] = new SqlParameter("@firmid", firmid);
                param[11] = new SqlParameter("@tradeiid", Tradeiid);
                param[12] = new SqlParameter("@vStatus", vStatus);
                dtcs = db.ExecuteNonQuery("sp_AddUserDesignData", param);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dtcs;
        }
        /// <summary>
        /// Get Added IPR Trademark
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="searchtext"></param>
        /// <param name="classname"></param>
        /// <param name="vProprietor"></param>
        /// <param name="dApplDatefrom"></param>
        /// <param name="dApplDateto"></param>
        /// <param name="vstatus"></param>
        /// <param name="applno"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="vsort"></param>
        /// <param name="vcolumnname"></param>
        /// <param name="hearingDateFrom"></param>
        /// <param name="HearingDateTo"></param>
        /// <returns></returns>
        public static DataTable GetAddedIPRTrademark(string userId, string firmId, string searchtext, string classname, string vProprietor,
             string dApplDatefrom, string dApplDateto,
             string vstatus, string applno, int? pageNumber, int? pageSize, int vsort, string vcolumnname, string hearingDateFrom, string HearingDateTo)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[15];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@class", classname);
                param[4] = new SqlParameter("@vProprietor", vProprietor);
                param[5] = new SqlParameter("@dApplDatefrom", dApplDatefrom);
                param[6] = new SqlParameter("@dApplDateto", dApplDateto);
                param[7] = new SqlParameter("@vstatus", vstatus);
                param[8] = new SqlParameter("@applno", applno);
                param[9] = new SqlParameter("@PageNumber", pageNumber);
                param[10] = new SqlParameter("@PageSize", pageSize);
                param[11] = new SqlParameter("@vsort", vsort);
                param[12] = new SqlParameter("@vcolumnname", vcolumnname);
                param[13] = new SqlParameter("@vHearingDateFrom", hearingDateFrom);
                param[14] = new SqlParameter("@vHearingDateTo", HearingDateTo);

                dtcs = db.GetDataTable("sp_GetAddedIPRTrademark", param);
            }
            catch (Exception ex)
            { }
            return dtcs;
        }
        /// <summary>
        /// Get Shared IPR Trademark
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="searchtext"></param>
        /// <param name="classname"></param>
        /// <param name="vProprietor"></param>
        /// <param name="dApplDatefrom"></param>
        /// <param name="dApplDateto"></param>
        /// <param name="vstatus"></param>
        /// <param name="applno"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="vsort"></param>
        /// <param name="vcolumnname"></param>
        /// <param name="hearingDateFrom"></param>
        /// <param name="HearingDateTo"></param>
        /// <returns></returns>
        public static DataTable GetSharedIPRTrademark(string userId, string firmId, string searchtext, string classname, string vProprietor,
            string dApplDatefrom, string dApplDateto,
            string vstatus, string applno, int? pageNumber, int? pageSize, int vsort, string vcolumnname, string hearingDateFrom, string HearingDateTo)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[15];
            try
            {
                param[0] = new SqlParameter("@userId", userId);
                param[1] = new SqlParameter("@firmId", firmId);
                param[2] = new SqlParameter("@searchtext", searchtext);
                param[3] = new SqlParameter("@class", classname);
                param[4] = new SqlParameter("@vProprietor", vProprietor);
                param[5] = new SqlParameter("@dApplDatefrom", dApplDatefrom);
                param[6] = new SqlParameter("@dApplDateto", dApplDateto);
                param[7] = new SqlParameter("@vstatus", vstatus);
                param[8] = new SqlParameter("@applno", applno);
                param[9] = new SqlParameter("@PageNumber", pageNumber);
                param[10] = new SqlParameter("@PageSize", pageSize);
                param[11] = new SqlParameter("@vsort", vsort);
                param[12] = new SqlParameter("@vcolumnname", vcolumnname);
                param[13] = new SqlParameter("@vHearingDateFrom", hearingDateFrom);
                param[14] = new SqlParameter("@vHearingDateTo", HearingDateTo);

                dtcs = db.GetDataTable("usp_GetSharedIPRTrademark", param);
            }
            catch (Exception ex)
            { }
            return dtcs;
        }
        /// <summary>
        ///  Get Phonetic Sub Detail
        /// </summary>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public static DataTable GetPhoneticSubDetail(string firmId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@firmId", firmId);
                dtcs = db.GetDataTable("Usp_GetPhoneticSubscriptionDetail", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable InvoicelistNewSearch(string firmid, string userid, Nullable<int> roleid, string cname,
            string from, string to, string amount, Nullable<int> pageNumber, Nullable<int> pageSize,
            string filterinvoicetype, string invoiceStatus)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[11];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@userid", userid);
                param[2] = new SqlParameter("@roleid", roleid);
                param[3] = new SqlParameter("@cname", cname);
                param[4] = new SqlParameter("@from", from);
                param[5] = new SqlParameter("@to", to);
                param[6] = new SqlParameter("@amount", amount);
                param[7] = new SqlParameter("@PageNumber", pageNumber);
                param[8] = new SqlParameter("@PageSize", pageSize);
                param[9] = new SqlParameter("@filterinvoicetype", filterinvoicetype);
                param[10] = new SqlParameter("@InvoiceStatus", invoiceStatus);
                dtcs = db.GetDataTable("usp_InvoicelistNewSearch", param);
            }
            catch (Exception ex)
            { }
            return dtcs;
        }


        public static DataTable GetJournalAlertDetail(string firmId, string userId, string vApplNo)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@firmId", firmId);
                param[1] = new SqlParameter("@userId", userId);
                param[2] = new SqlParameter("@vApplNo", vApplNo);
                dtcs = db.GetDataTable("Usp_GetSetJournalAlertDetail", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable UpdateJournalAlertDetail(string firmId, string userId, string vApplNo, string IsSetActive)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            int IsActive = 0;
            if (IsSetActive == "Yes")
            {
                IsActive = 1;
            }
            else
            {
                IsActive = 0;
            }
            SqlParameter[] param = new SqlParameter[4];
            try
            {
                param[0] = new SqlParameter("@firmId", firmId);
                param[1] = new SqlParameter("@userId", userId);
                param[2] = new SqlParameter("@vApplNo", vApplNo);
                param[3] = new SqlParameter("@IsAlert", IsActive);
                dtcs = db.GetDataTable("Usp_UpdateSetJournalAlert", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable CheckJournalAlertSub(string firmid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmid);
                dtcs = db.GetDataTable("Usp_GetJournalSubscriptionDetail", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable GetJournalAlertHistory(string firmId, string userId, string applicationNo, int pageno, int pagesize, string trademarkName)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@vAppplNo", applicationNo);
                param[3] = new SqlParameter("@PageNumber", pageno);
                param[4] = new SqlParameter("@PageSize", pagesize);
                param[5] = new SqlParameter("@TrademarkName", trademarkName);
                dtcs = db.GetDataTable("Usp_GetJournalAlertHistory", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable ViewSimilarTrademark(string firmId, string applicationNo, string journalHId, int pageno, int pagesize)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@vAppplNo", applicationNo);
                param[2] = new SqlParameter("@jHistoryId", journalHId);
                param[3] = new SqlParameter("@PageNumber", pageno);
                param[4] = new SqlParameter("@PageSize", pagesize);
                dtcs = db.GetDataTable("Usp_ViewSimilarTrademarkDetail", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        /// <summary>
        /// Export similar trademark
        /// </summary>
        /// <param name="firmId"></param>
        /// <param name="userId"></param>
        /// <param name="applicationno"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize1"></param>
        /// <returns></returns>
        public static DataTable ExportPhoneticallySimilarTrademark(string firmId, string userId, string applicationno, string pagenum, string pagesize1)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@vAppplNo", applicationno);
                param[3] = new SqlParameter("@PageNo", Convert.ToInt32(pagenum));
                param[4] = new SqlParameter("@Pagesize", Convert.ToInt32(pagesize1));

                dtcs = db.GetDataTable("Usp_DownloadSimilarTrademark", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable AddBulkNoticesByExcelUpload(string noticeId, string templateContent,
            string firmId, string userId, string noticePath, string mainTemplateId, string selfTemplateId, out string resultId, string noticeType, string receiverEmail,string mobileNo,string LoanId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[12];
            resultId = string.Empty;

            try
            {
                param[0] = new SqlParameter("@NoticeId", noticeId);
                param[1] = new SqlParameter("@TemplateContent", templateContent);
                param[2] = new SqlParameter("@FirmId", firmId);
                param[3] = new SqlParameter("@UserId", userId);
                param[4] = new SqlParameter("@NoticePath", noticePath);
                param[5] = new SqlParameter("@MainTemplateId", mainTemplateId);
                param[6] = new SqlParameter("@SelfTemplateId", selfTemplateId);

                param[7] = new SqlParameter("@resultid", SqlDbType.VarChar, 50)
                {
                    Direction = ParameterDirection.Output
                };

                param[8] = new SqlParameter("@NoticeType", noticeType);
                param[9] = new SqlParameter("@receiverEmail", receiverEmail);
                param[10] = new SqlParameter("@mobileNo", mobileNo);
                param[11] = new SqlParameter("@LoanId", LoanId);
                //param[12] = new SqlParameter("@TemplateLanguage", TemplateLanguage);

                dtcs = db.GetDataTable("usp_AddBulkNoticesByExcelUpload", param);

                // Get output value back
                resultId = param[7].Value?.ToString();
            }
            catch (Exception ex)
            {
                // Log exception here
            }

            return dtcs;
        }


        public static DataTable SaveForBulkWhatsUp(string excelfileid, string loginId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            try
            {
                param[0] = new SqlParameter("@maintemplateId", excelfileid);
                param[1] = new SqlParameter("@createdby", loginId);

                dtcs = db.GetDataTable("Usp_InsertForBulkWhatsup", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable ShowWhatsAppAlertLog(string firmId, string userId, string mobileNo, string pagenum, string pagesize)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[5];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@UserId", userId);
                param[2] = new SqlParameter("@MobileNo", mobileNo);
                param[3] = new SqlParameter("@PageNumber", Convert.ToInt32(pagenum));
                param[4] = new SqlParameter("@PageSize", Convert.ToInt32(pagesize));

                dtcs = db.GetDataTable("Usp_ShowAlertLogDetail", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable GetExcelUploadDetails(string firmId,string pagenum, string pagesize)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@FirmId", firmId);
                param[1] = new SqlParameter("@PageNumber", Convert.ToInt32(pagenum));
                param[2] = new SqlParameter("@PageSize", Convert.ToInt32(pagesize));
                dtcs = db.GetDataTable("USP_GetUploadedNoticeDetails", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable GetNoticeDetailsById(string NoticeID)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@NoticeId", NoticeID);
                dtcs = db.GetDataTable("Usp_GetBulkNoticeDetailById", param);
            }
            catch
            {
            }
            return dtcs;
        }

        public static DataTable UpdateVerthnaNoticeDetails(string loantype, string loanId, string clientId, string schoolStudentName, string branch, string state, string branchaddress, string productname, string loanamount,
                string disbursementdate, string emiAmount, string emiduedate, string currentDPD, string borrowerschoolname, string borrowerschooladdress, string borrowerschoolphone,
                string borrowerschoolemail, string trustname, string trustnameaddress, string trustnamephoneno, string trustemail, string coapplicantname, string coapplicantaddress,
                string coapplicantphone, string coapplicantemail, string coapplicantname2, string coapplicantaddress2, string coapplicantphone2, string coapplicantemailid2, string coapplicantdunningref,
                string coapplicantdunningnoticedate, string branchcollectionmanagername, string branchcollectionmanagerno, string txtnoticetype,string noticeIdD)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[35];
            try
            {
                param[0] = new SqlParameter("@LoanType", loantype);
                param[1] = new SqlParameter("@LoanId", loanId);
                param[2] = new SqlParameter("@ClientId", clientId);
                param[3] = new SqlParameter("@SchoolStudentName", schoolStudentName);
                param[4] = new SqlParameter("@Branch", branch);
                param[5] = new SqlParameter("@State", state);
                param[6] = new SqlParameter("@BranchAddress", branchaddress);
                param[7] = new SqlParameter("@ProductName", productname);
                param[8] = new SqlParameter("@LoanAmount", loanamount);
                param[9] = new SqlParameter("@DisbursementDate", disbursementdate);
                param[10] = new SqlParameter("@EMIAmount", emiAmount);
                param[11] = new SqlParameter("@EMIDueDate", emiduedate);
                param[12] = new SqlParameter("@CurrentDPD", currentDPD);
                param[13] = new SqlParameter("@BorrowerDetailsSchoolName1", borrowerschoolname);
                param[14] = new SqlParameter("@BorrowerDetailsSchooladdress11", borrowerschooladdress);
                param[15] = new SqlParameter("@BorrowerDetailsSchoolphonenumber1", borrowerschoolphone);
                param[16] = new SqlParameter("@BorrowerDetailsSchoolemailid1", borrowerschoolemail);
                param[17] = new SqlParameter("@TrustDetailsTrustname1", trustname);
                param[18] = new SqlParameter("@TrustDetailsTrustaddress1", trustnameaddress);
                param[19] = new SqlParameter("@TrustDetailsTrustphonenumber1", trustnamephoneno);
                param[20] = new SqlParameter("@TrustDetailsTrustemailid1", trustemail);
                param[21] = new SqlParameter("@CoApplicantName1", coapplicantname);
                param[22] = new SqlParameter("@CoApplicant1Address", coapplicantaddress);
                param[23] = new SqlParameter("@CoApplicant1PhoneNumber", coapplicantphone);
                param[24] = new SqlParameter("@CoApplicant1EmailID", coapplicantemail);
                param[25] = new SqlParameter("@CoApplicantName2", coapplicantname2);
                param[26] = new SqlParameter("@CoApplicant2Address", coapplicantaddress2);
                param[27] = new SqlParameter("@CoApplicant2PhoneNumber", coapplicantphone2);
                param[28] = new SqlParameter("@CoApplicant2EmailID", coapplicantemailid2);
                param[29] = new SqlParameter("@DunningReferencenumber", coapplicantdunningref);
                param[30] = new SqlParameter("@DunningletterNoticeDate", coapplicantdunningnoticedate);
                param[31] = new SqlParameter("@BranchCollectionManagerName", branchcollectionmanagername);
                param[32] = new SqlParameter("@BranchCollectionManagerNo", branchcollectionmanagerno);
                param[33] = new SqlParameter("@TypeofNotice", txtnoticetype);
                param[34] = new SqlParameter("@NoticeIdD", noticeIdD);
                dtcs = db.GetDataTable("Usp_UpdateVerthnaNotice", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;

        }
        public static DataTable DeleteVerthnaNoticeDetails(string noticeId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@NoticeId", noticeId);
                dtcs = db.GetDataTable("Usp_DeleteNoticeByNoticeId", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable GetLoanIdBasedOnFirmIdAndNoticeId(string firmid, string noticeId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            try
            {
                param[0] = new SqlParameter("@NoticeId", noticeId);
                param[1] = new SqlParameter("@FirmId", firmid);
                dtcs = db.GetDataTable("Usp_GetLoanIdWithDetails", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }
        public static DataTable sp_AddTemplate(string CreatedBy,string FirmId,string TemplateContent,string TemplateName,string hiddenId,string target_Language)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[6];
            try
            {
                param[0] = new SqlParameter("@CreatedBy", CreatedBy);
                param[1] = new SqlParameter("@FirmId", FirmId);
                param[2] = new SqlParameter("@TemplateContent", TemplateContent);
                param[3] = new SqlParameter("@TemplateName", TemplateName);
                param[4] = new SqlParameter("@hiddenId", hiddenId);
                param[5] = new SqlParameter("@target_Language", target_Language);
                dtcs = db.GetDataTable("sp_AddTemplate", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable sp_GetTemplatedataById(string templateid)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[1];
            try
            {
                param[0] = new SqlParameter("@templateid", templateid);
                dtcs = db.GetDataTable("sp_GetTemplatedataById", param);
            }
            catch (Exception ex)
            {
            }
            return dtcs;
        }

        public static DataTable AddedTradedMarkForTracking(string applicationno, string firmId, string userId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[3];
            try
            {
                param[0] = new SqlParameter("@vApplNo", applicationno);
                param[1] = new SqlParameter("@FirmId", firmId);
                param[2] = new SqlParameter("@UserId", userId);
                dtcs = db.GetDataTable("Usp_AddTrademarkDataNotAvailable", param);
            }
            catch (Exception ex)
            {
                // Log exception here
            }

            return dtcs;
        }

        public static DataTable GetClientDetailByClientId(string firmid, string clientId)
        {
            DataTable dtcs = new DataTable();
            AdoDBSql db = new AdoDBSql();
            SqlParameter[] param = new SqlParameter[2];
            try
            {
                param[0] = new SqlParameter("@firmid", firmid);
                param[1] = new SqlParameter("@userid", clientId);
                dtcs = db.GetDataTable("usp_GetClientDetailByUserID", param);
            }
            catch (Exception ex)
            {
                // Log exception here
            }

            return dtcs;
        }
    }
}