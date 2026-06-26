using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NJDGDetail.BAL
{
    internal partial class SpNames
    {
        internal const string ValidateLogin = "ValidateLogin";


        internal const string GetCourtName = "sp_CourtNameLawPractice";
      ///  internal const string GetCaseTypeByCourtID = "sp_GetCaseTypeByCourtID";
        internal const string GetCaseTypeByCourtID = "sp_GetCaseTypeByCourtIDLawPractice";
        
        internal const string GetBenchName = "sp_GetBenchNameLawPractice";
        internal const string GetSidebyBenchId = "sp_GetSidebyBenchId";
        internal const string GetNCBench = "sp_GetNCBench";
        internal const string AddCaseType = "sp_AddCaseTypeLawPractice";
        internal const string GetMasterCaseData = "sp_ShowMasterCaseData";
        internal const string GetMasterCaseDataLawPractice = "sp_ShowMasterCaseDataLawPractice";

        internal const string ShowFullCaseData = "sp_ShowFullCaseData";


        internal const string ValidateSignUp = "usp_ls_ValidateSignUp";
        internal const string InsertLoginCaseUser = "InsertLoginCaseUser";

        internal const string GetTotalCase = "usp_GetTotalCase";

        internal const string InsertCaseNoteDetail = "sp_InsertCaseNoteDetail";

        internal const string GetCaseNotesDetails = "sp_GetCaseNotesDetails";
        
        internal const string InsertCaseUploadDocumentDetail = "sp_InsertCaseUploadDocumentDetail";
        internal const string GetCaseUploadDetails = "sp_GetCaseuploadDetails";
        internal const string ShowFullCaseDataByUsername = "sp_ShowFullCaseDataByUsername";
        internal const string ShowMasterCaseDataBYDate = "sp_ShowMasterCaseDataBYDate";


        internal const string ShowMasterCaseBYUserName = "sp_ShowMasterCaseBYUserName";
        internal const string CountCaseBYUserName = "sp_CountCaseBYUserNameLawPractice";
        internal const string GetUserNameByCaseIdLawPractice = "sp_GetUserNameByCaseIdLawPractice";  
        internal const string ShowNextHearingDate = "sp_ShowNextHearingDate";

        internal const string ShowMasterCaseBYUserNameLawPractice = "sp_ShowMasterCaseBYUserNameLawPractice";

        internal const string ShowGetCaseDetailByCaseIDLawPractice = "usp_wf_GetCaseDetailByCaseIDLawPractice";

        internal const string ShowFullCaseDataLawpractice = "usp_wf_ShowFullCaseDataLawpractice";

        internal const string CountCaseBYUserNameAssignLawPractice = "sp_CountCaseBYUserNameAssignLawPractice";


        internal const string CountCaseBYUserNameAssign = "sp_CountCaseBYUserNameAssign";      
        internal const string ShowMasterCaseBYUserNameAssign = "sp_ShowMasterCaseBYUserNameAssign";
        internal const string ShowNextHearingDateAssign = "sp_ShowNextHearingDateAssign";

        internal const string ShowMasterCaseBYUserNameAssignLawPractice = "sp_ShowMasterCaseBYUserNameAssignLawPractice";
        internal const string ShowNextHearingDateAssignLawPractice = "sp_ShowNextHearingDateAssignLawPractice";
        internal const string ShowMasterCaseBYUserNamePopup = "sp_ShowMasterCaseBYUserNameLawPracticePopup";



     internal const string ShowNextHearingDateLawPracticePopup = "sp_ShowNextHearingDateLawPracticePopup";
        


        //Calender 08 Apr 2019
        internal const string GetCalendarEventByAllUserLawPractice = "sp_GetCalendarEventByAllUserLawPractice";
        internal const string GetNextHearingDateAllUserLawPractice = "sp_GetNextHearingDateAllUserLawPractice";
       

        internal const string GetTotalCauselistbyUserAdminLawPractice = "sp_GetCauselistbyAdminLawPractice";

        //28112019
        internal const string GetCourtNameByCourtId = "sp_CourtNameByCourtType";

        internal const string GetDistrictNameByCourt = "sp_GetDistrictNameByCourt";
        internal const string GetDistrictCourtCompEstb = "sp_GetDistrictCourtCompEstb";
        internal const string GetDistrictCaseType = "sp_GetDistrictCaseType";
        internal const string AddCaseTypeNew = "sp_AddCaseType_mykase";
        internal const string AddMykaseUser = "sp_AddUser_mykase";

        
    }

}