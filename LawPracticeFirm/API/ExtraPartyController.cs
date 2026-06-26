using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class ExtraPartyController : BaseFirmApiController
    {
        /// <summary>
        /// Get extra party
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult getExtraParty()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
            var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            try
            {
                List<sp_ExtrapartyList_Result> list = new List<sp_ExtrapartyList_Result>();
                list = db.sp_ExtrapartyList(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save extra party
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostExtraParty()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var PartyName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PartyName"]);
            var FatherName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FatherName"]);
            var Address = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Address"]);
            var AdharCardNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdharCardNo"]);
            var Gender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Gender"]);
            var DateOfBirth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DateOfBirth"]);
            var Nationality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nationality"]);
            var MobileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MobileNo"]);
            var Email = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Email"]);
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {

            }
            try
            {
                var result = db.sp_SaveCaseExternalParty(null, firmid, userid, caseid, PartyName, FatherName, Address, AdharCardNo, Gender, DateOfBirth, Nationality, MobileNo, Email, null, null, null);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Update extra party
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult UpdateExtraParty()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var PartyName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PartyName"]);
            var FatherName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FatherName"]);
            var Address = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Address"]);
            var AdharCardNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdharCardNo"]);
            var Gender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Gender"]);
            var DateOfBirth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DateOfBirth"]);
            var Nationality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nationality"]);
            var MobileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MobileNo"]);
            var Email = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Email"]);
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {

            }
            string sss = new Guid().ToString();
            try
            {
                var result = db.sp_SaveCaseExternalParty(Id, firmid, userid, caseid, PartyName, FatherName, Address, AdharCardNo, Gender, DateOfBirth, Nationality, MobileNo, Email, null, null, null);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete extra party
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DeleteExtraParty()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            try
            {
                var result = db.sp_deleteCaseExternalParty(Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get case filling dates
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult getcaseFillingDates()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch (Exception e)
            {
            }
            try
            {
                List<sp_CaseFillingDate_Result> list = new List<sp_CaseFillingDate_Result>();
                list = db.sp_CaseFillingDate(null, firmid, userid, caseid, 1).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get case Filling By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult getcaseFillingById()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch (Exception e)
            {

            }
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            try
            {
                List<sp_CaseFillingDate_Result> list = new List<sp_CaseFillingDate_Result>();
                list = db.sp_CaseFillingDate(Id, firmid, userid, caseid, 2).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save case filling dates
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostCaseFillingDates()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch (Exception e)
            {

            }
            DateTime SubmitDate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubmitDate"]));
            DateTime ReturnDate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ReturnDate"]));
            try
            {
                var result = db.sp_SaveUpdateCaseFilingDate(null, firmid, userid, caseid, SubmitDate.Date, ReturnDate.Date);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Update case filling dates
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PutCaseFillingDates()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch (Exception e)
            {
            }
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            DateTime SubmitDate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubmitDate"]));
            DateTime ReturnDate = Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ReturnDate"]));
            try
            {
                var result = db.sp_SaveUpdateCaseFilingDate(Id, firmid, userid, caseid, SubmitDate.Date, ReturnDate.Date);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete case filling date
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DeleteCaseFillingDate()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            try
            {
                var result = db.sp_CaseFillingDate(Id, firmid, userid, caseid, 3);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save Case Pretition
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostCasePretition()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {

            }
            var NameOfComplainent = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NameOfComplainent"]);
            var GaurdianName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["GaurdianName"]);
            var Address = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Address"]);
            var AdharCardNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdharCardNo"]);
            var PinCode = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PinCode"]);
            var Gender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Gender"]);
            var Nationality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nationality"]);
            string dob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DateofBirth"]);
            DateTime DateofBirth = Convert.ToDateTime("1900-01-01");
            if (!string.IsNullOrEmpty(dob))
            {
                DateofBirth = Convert.ToDateTime(dob);
            }
            var Age = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Age"]);
            var MobileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MobileNo"]);
            var Email = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Email"]);
            var ActSection = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ActSection"]);
            var ValuationOfSuit = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ValuationOfSuit"]);
            var CourtFeeAscertained = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtFeeAscertained"]);
            var CourtFeePaidDeposit = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtFeePaidDeposit"]);
            var PoliceStation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PoliceStation"]);
            var FirNoYear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FirNoYear"]);
            var DefendantName2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DefendantName"]);
            var GaurdianName2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["GaurdianName2"]);
            var Address2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Address2"]);
            var AdharCardNo2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdharCardNo2"]);
            var PinCode2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PinCode2"]);
            var Gender2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Gender2"]);
            var Nationality2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nationality2"]);
            string defdob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DateofBirth2"]);
            DateTime DateofBirth2 = Convert.ToDateTime("1900-01-01");
            if (!string.IsNullOrEmpty(defdob))
            {
                DateofBirth2 = Convert.ToDateTime(defdob);
            }
            var Age2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Age2"]);
            var MobileNo2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MobileNo2"]);
            var Email2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Email2"]);
            var AdvocateName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdvocateName"]);
            var BarRegNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["BarRegNo"]);
            var AdvocateAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdvocateAddress"]);
            var AdvocateMobile = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdvocateMobile"]);
            var AdvocateEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AdvocateEmail"]);
            string Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            if (string.IsNullOrEmpty(Id))
            {
                Id = null;
            }
            try
            {
                var result = db.sp_SaveUpdateCasePeritioner(
                    Id,
                    firmid,
                    userid,
                    caseid,
                    NameOfComplainent,
                    GaurdianName,
                    Address,
                    AdharCardNo,
                    PinCode,
                    Gender,
                    Nationality,
                    DateofBirth,
                    Age,
                    MobileNo,
                    Email,
                    ActSection,
                    ValuationOfSuit,
                    CourtFeeAscertained,
                    CourtFeePaidDeposit,
                    PoliceStation,
                    FirNoYear,
                    DefendantName2,
                    GaurdianName2,
                    Address2,
                    AdharCardNo2,
                    PinCode2,
                    Gender2,
                    Nationality2,
                    DateofBirth2,
                    Age2,
                    MobileNo2,
                    Email2,
                    AdvocateName,
                    BarRegNo,
                    AdvocateAddress,
                    AdvocateMobile,
                    AdvocateEmail
                    );
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Case Information Format list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetCaseInformationFormatlist()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            try
            {
                List<sp_getCaseInformationFormList_Result> result = new List<sp_getCaseInformationFormList_Result>();
                result = db.sp_getCaseInformationFormList(firmid, userid, caseid).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Case Information Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetCaseInformationReport()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            try
            {
                sp_PrtCaseInfoFormat_Result result = new sp_PrtCaseInfoFormat_Result();
                result = db.sp_PrtCaseInfoFormat(Id, firmid, userid, caseid).FirstOrDefault();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Extra Party Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetExtraPartyReport()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {

            }
            try
            {
                List<sp_PrintExtraPartyInfo_Result> result = new List<sp_PrintExtraPartyInfo_Result>();
                result = db.sp_PrintExtraPartyInfo(firmid, userid, caseid).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save Case Filling Dates Temp
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostCaseFillingDatesTemp()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string SubmitDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["frsubmitDate"]);
            string ReturnDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["freturnDate"]);
            try
            {
                var result = db.sp_SaveUpdateCaseFilingDateTemp(firmid, userid, SubmitDate, ReturnDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete Case Filling Date Temp
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DeleteCaseFillingDateTemp()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {

            }
            var Id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
            var flag = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]));
            try
            {
                var result = db.sp_DeleteCaseFilingDateTemp(Id, firmid, userid, flag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Temp case Filling Dates
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult TempcaseFillingDates()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            try
            {
                List<sp_GetCaseFilingDateTemp_Result> list = new List<sp_GetCaseFilingDateTemp_Result>();
                list = db.sp_GetCaseFilingDateTemp(firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Temp case Matter Details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult TempcaseMatterDetails()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            try
            {
                List<sp_GetMatterTypeTemp_Result> list = new List<sp_GetMatterTypeTemp_Result>();
                list = db.sp_GetMatterTypeTemp(firmid, userid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save Save Litigation Temp
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostSaveLitigationTemp()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            string Name = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fName"]);
            string Email = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fEmail"]);
            string Phone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fPhone"]);
            string Type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fType"]);
            try
            {
                var result = db.sp_SaveMatterTypeDetailTemp(firmid, userid, Name, Email, Phone, Type, null);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save letigation details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostSaveLitigation()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            string Name = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fName"]);
            string Email = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fEmail"]);
            string Phone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fPhone"]);
            string Type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fType"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            try
            {
                var result = db.sp_SaveMatterTypeDetails(null, firmid, userid, caseid, Name, Email, Phone, Type, null);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Case matter details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult caseMatterDetails()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch
            {
            }
            try
            {
                List<sp_GetMatterType_Result> list = new List<sp_GetMatterType_Result>();
                list = db.sp_GetMatterType(firmid, userid, caseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}
