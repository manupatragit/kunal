using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Core.Objects;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI;

namespace LawPracticeFirm.Controllers
{
    public class STFController : BaseFirmController
    {

        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "STFController";

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult STFDashboard()
        {
            var db = new LawPracticeEntities();
            string firmid = LoggedInUser.FirmId.ToString();
            var data = db.sp_Get_STF_Permission(firmid).FirstOrDefault();
            if(data==0)
            {
                return RedirectToAction("LitigationCaseList", "CW");
            }
            else  
            {
                return View();
            }
            

        }

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public int AddpwDetails(string name, string rank, string so, string contactNo, string address, string empcode, string usercaseId, string caseDetail)
        {
            try
            {
                try
                {
                    usercaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseId));

                }
                catch
                {

                }
                var decodedName = QueryAES.UrlDecode(name);
                var decodedRank = QueryAES.UrlDecode(rank);
                var decodedSo = QueryAES.UrlDecode(so);
                var decodedContactNo = QueryAES.UrlDecode(contactNo);
                var decodedAddress = QueryAES.UrlDecode(address);
                var decodedempCode = QueryAES.UrlDecode(empcode);

                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();

                var result = db.sp_Save_STF_PWDetails(0, decodedName, decodedRank, decodedSo, decodedAddress, decodedContactNo, userId, decodedempCode, Convert.ToInt32(usercaseId), caseDetail);
                int data = result.FirstOrDefault() ?? 0;
                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PwdUserTabularListData(int pageNo, int pageSize, string empCode, string usercaeId)
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                try
                {
                    usercaeId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaeId));

                }
                catch
                {

                }
                var db = new LawPracticeEntities();
                var data = db.sp_GetAll_STF_PWDetails(userId, firmId, empCode, pageNo, pageSize, Convert.ToInt32(usercaeId));
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PwdUserTabularListRemoveById(int PWId)
        {
            try
            {
                int isDelete = 1;
                string userId = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_Delete_STF_PWDetails_ById(PWId, isDelete, userId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Update userDetails by id

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public int UpdatepwDetailsById(int id, string name, string rank, string so, string contactNo, string address, string empcode, string usercaseId , string caseDetail)
        {
            try
            {

                try
                {
                    usercaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseId));

                }
                catch
                {

                }
                var decodedName = QueryAES.UrlDecode(name);
                var decodedRank = QueryAES.UrlDecode(rank);
                var decodedSo = QueryAES.UrlDecode(so);
                var decodedContactNo = QueryAES.UrlDecode(contactNo);
                var decodedAddress = QueryAES.UrlDecode(address);
                var decodeempcode = QueryAES.UrlDecode(empcode);

                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();

                var result = db.sp_Save_STF_PWDetails(id, decodedName, decodedRank, decodedSo, decodedAddress, decodedContactNo, userId, decodeempcode, Convert.ToInt32(usercaseId),caseDetail);
                int data = result.FirstOrDefault() ?? 0;
                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Download Tabular data in docx
        // [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public void PwdUserTabularListDataDownloadDocx()
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                var db = new LawPracticeEntities();
                var data = db.sp_GetAll_STF_PWDetailsDownloadExcel(userId, firmId).ToList();
                //Download logic of Excelsheet start
                List<PwUserModal> pwDetails = new List<PwUserModal>();


                    for (int i = 0; i < data.Count; i++)
                    {
                        pwDetails.Add(new PwUserModal
                        {
                            Employee_Code = Convert.ToString(data[i].emloyeeCode),
                            Name = Convert.ToString(data[i].vName),
                            Rank = Convert.ToString(data[i].vRank),

                            Parents_Name = Convert.ToString(data[i].FatherName),

                            Address = Convert.ToString(data[i].vAddress),

                            Contact_No = Convert.ToString(data[i].ContactNo),

                            Created_On = Convert.ToString(data[i].CreatedOn),
                        });
                    }

                var trialList = (from ob in pwDetails
                                 select new
                                 {
                                     Employee_Code = ob.Employee_Code,
                                     Name = ob.Name,
                                     Rank = ob.Rank,
                                     Parents_Name = ob.Parents_Name,
                                     Address = ob.Address,
                                     Contact_No = ob.Contact_No,
                                     Created_On = ob.Created_On,                             
                                 }).ToList();

                var gv = new System.Web.UI.WebControls.GridView();
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + "STF_PwUser_List" + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
                //Download logic of excelsheet end
            }
            catch (Exception ex)
            {
            }
        }

        //Process Entry View and coding Section start

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ProcessEntryDashboard()
        {

            var db = new LawPracticeEntities();
            string firmid = LoggedInUser.FirmId.ToString();
            var data = db.sp_Get_STF_Permission(firmid).FirstOrDefault();
            if (data>0)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Personaldashboard", "firm");
            }

        }

        //Get Pwd List For Select Field Start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFPwdUserForSelect()
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_Get_STF_PWDetails_ByUserId(userId, firmid);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get Pwd List For Select Field End

        //Get list of CourtProcess Start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFCourtProcess()
        {
            try
            {
                var db = new LawPracticeEntities();
                //  string userId = LoggedInUser.UserId.ToString();
                // string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_GetSTF_CourtProcess();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get list of CourtProcess End

        //Get list of WitnessServiceStatus Start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFWitnessServiceStatus()
        {
            try
            {
                var db = new LawPracticeEntities();
                //  string userId = LoggedInUser.UserId.ToString();
                // string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_GetSTF_WitnessServiceStatus();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get list of WitnessServiceStatus End

        //Get list of PWPresenceStatus Start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFPWPresenceStatus()
        {
            try
            {
                var db = new LawPracticeEntities();
                //  string userId = LoggedInUser.UserId.ToString();
                // string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_GetSTF_PWPresenceStatus();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get list of PWPresenceStatus End

        //Get list of PWCourtActionStatus Start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFPWCourtActionStatus(int id)
        {
            try
            {
                var db = new LawPracticeEntities();
                //  string userId = LoggedInUser.UserId.ToString();
                // string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_GetSTF_PWCourtActionStatus(id);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get list of PWCourtActionStatus End

        //Save Process Entry start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult SaveProcessEntry(Nullable<int> iid, string matterId,string  masterCaseId,
          string caseDetails, Nullable<System.DateTime> issueDate, Nullable<int> courtProcessId,
          Nullable<System.DateTime> evidenceDate, Nullable<int> seriviceStatusId, string notServedReason,
          Nullable<int> pWPresenceStatusId, string absentReason, Nullable<int> courtActionStatusId,
          string note, string updatedBy, string PwDetails, string otherReasonAbsent, string otherReasonPresent)
        {
            try
            {
                //masterCaseId = masterCaseId.Replace(" ", "+");
                masterCaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(masterCaseId));
               // matterId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterId));
                int caseId = Convert.ToInt32(masterCaseId);

                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                string updatedByUserId = (updatedBy == "1") ? userId : "";

                var data = db.sp_Save_STF_PWProcessEntryForm(
                  iid, userId, firmId, matterId, caseId, caseDetails, issueDate,
                  courtProcessId, evidenceDate, seriviceStatusId, notServedReason,
                  pWPresenceStatusId, absentReason, courtActionStatusId, note, updatedByUserId, Convert.ToInt32(PwDetails), otherReasonAbsent, otherReasonPresent
                );
                var result = data.FirstOrDefault();
                if (result == 0)
                {
                    return Json("This master ID has already been added.", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var results = db.sp_Save_STF_PWDetails_ProcessEntry(PwDetails, result);
                    return Json(results, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = "An error occurred while saving the data."
                });
            }
        }

        //Save Process Entry End

        //Get Process entry tabular data start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ProcessEntryTabularData(
          string searchuserId,
          string casesearch,
          int mastercaseid,
          string issudatefrm,
          string issudateto,
          int? pwdetailid,
          int? courtprocessid,
          string evidencedatefrm,
          string evidencedateto,
          int servicestatusid,
          int presenceStatusid,
          int courtactionid,
          int pageNumber,
          int pageSize)
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();


                var data = db.sp_GetSTFProcessEntryFormDataSearch(
                  userId, firmId, searchuserId, casesearch, mastercaseid, issudatefrm, issudateto,
                  pwdetailid, courtprocessid, evidencedatefrm, evidencedateto, servicestatusid,
                  presenceStatusid, courtactionid, pageNumber, pageSize);

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Handle exceptions or log the error
                return Json(new
                {
                    error = ex.Message
                });
            }
        }

        //Get process entry tabular data End

        //Get User List On the behalf on login user start 
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult UserListOntheBehalfOfLoginUser()
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                // string firmid = LoggedInUser.FirmId.ToString();

                var data = db.sp_Get_STF_UserMappingList_ByUserId(userId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        //Get User List On the behalf on login user start  End 

        //Delete process entry details by id start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ProcessEntryListRemoveById(int iid)
        {
            try
            {
                int isDelete = 1;
                string userId = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_Delete_STF_PWProcessEntryFormByiid(iid, isDelete, userId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        //Delete process entry details by id end

        //Get process entry detail by id start 
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ProcessEntryDetailsId(int iid)
        {
            try
            {
                int isDelete = 1;
                string userId = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_Get_STF_PWProcessEntryFormByiid(iid);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Get process entry detail by id end

        //Updated Process Entry
        //
        //Save Process Entry start
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult UpdateProcessEntry(Nullable<int> iid, string matterId, Nullable<int> masterCaseId,
          string caseDetails, Nullable<System.DateTime> issueDate, Nullable<int> courtProcessId,
          Nullable<System.DateTime> evidenceDate, Nullable<int> seriviceStatusId, string notServedReason,
          Nullable<int> pWPresenceStatusId, string absentReason, Nullable<int> courtActionStatusId,
          string note, string updatedBy, string PwDetails, string otherReasonAbsent, string PresentOtherReason)
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                string updatedByUserId = (updatedBy == "1") ? userId : "";

                var data = db.sp_Save_STF_PWProcessEntryForm(
                  iid, userId, firmId, matterId, masterCaseId, caseDetails, issueDate,
                  courtProcessId, evidenceDate, seriviceStatusId, notServedReason,
                  pWPresenceStatusId, absentReason, courtActionStatusId, note, updatedByUserId,Convert.ToInt32(PwDetails),otherReasonAbsent, PresentOtherReason
                );
                var result = data.FirstOrDefault();
               
                
                    var results = db.sp_Save_STF_PWDetails_ProcessEntry(PwDetails,iid);
                    return Json(results, JsonRequestBehavior.AllowGet);
              

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = "An error occurred while saving the data."
                });
            }
        }

        //End Process Entry

        //Download Process Entry Details start
        [AuthLog(Roles = "Firm,User,Client")]
        public void STFProcessEntryFormDataSearchExportExcel(string searchuserId, string casesearch, int mastercaseid, string issudatefrm, string issudateto, int? pwdetailid, int? courtprocessid, string evidencedatefrm, string evidencedateto, int servicestatusid, int presenceStatusid, int courtactionid)
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                List<ProcessEntryDetalsModal> processEntry = new List<ProcessEntryDetalsModal>();

                var data = db.sp_GetSTFProcessEntryFormDataSearchExportExcel(
                  userId, firmId, searchuserId, casesearch, mastercaseid, issudatefrm, issudateto,
                  pwdetailid, courtprocessid, evidencedatefrm, evidencedateto, servicestatusid,
                  presenceStatusid, courtactionid).ToList();

                //Download logic of Excelsheet start
                for (int i = 0; i < data.Count; i++)
                {
                    processEntry.Add(new ProcessEntryDetalsModal
                    {
                        Case_details = Convert.ToString(data[i].Casedetails),
                        Issue_date = Convert.ToString(data[i].issueDate),

                        Pw_Details = Convert.ToString(data[i].PWdetails),

                        Type_Of_Process = Convert.ToString(data[i].CourtProcess),
                        Evidance_Date = Convert.ToString(data[i].Evidencedate),

                        Service_Status = Convert.ToString(data[i].Servicestatus),

                        Not_Serve_Reason = Convert.ToString(data[i].NotServedReason),

                        Pw_Presence_status_on_date_of_evidance = Convert.ToString(data[i].PWPresenceStatus),

                        Pw_Absent_reason = Convert.ToString(data[i].Absentreason),

                        Court_Action = Convert.ToString(data[i].CourtAction),

                        Absent_other_reason = Convert.ToString(data[i].otherReason),

                        Present_other_reason = Convert.ToString(data[i].PresentotherReason),

                        Note = Convert.ToString(data[i].Note),




                    });
                }

                var trialList = (from ob in processEntry
                                 select new
                                 {
                                     Case_details = ob.Case_details,
                                     Issue_date = ob.Issue_date,

                                     Pw_Details = ob.Pw_Details,

                                     Type_Of_Process = ob.Type_Of_Process,
                                     Evidance_Date = ob.Evidance_Date,
                                     Service_Status = ob.Service_Status,

                                     Not_Serve_Reason = ob.Not_Serve_Reason,
                                     Pw_Presence_status_on_date_of_evidance = ob.Pw_Presence_status_on_date_of_evidance,

                                     Pw_Absent_reason = ob.Pw_Absent_reason,
                                     Court_Action = ob.Court_Action,

                                     Absent_other_reason = ob.Absent_other_reason,
                                     Present_other_reason = ob.Present_other_reason,
                                     Note = ob.Note,
                                 }).ToList();

                var gv = new System.Web.UI.WebControls.GridView();
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + "Process_Entry_List" + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();

                //using (OfficeOpenXml.ExcelPackage package = new ExcelPackage())
                //{
                //    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("StfPwDetails");
                //    worksheet.Cells[1, 1].Value = "Case_details";
                //    worksheet.Cells[1, 1 + 1].Value = "Issue date";
                //    worksheet.Cells[1, 1 + 2].Value = "Pw Details";
                //    worksheet.Cells[1, 1 + 3].Value = "Type Of Process";
                //    worksheet.Cells[1, 1 + 4].Value = "Evidance Date";
                //    worksheet.Cells[1, 1 + 5].Value = "Service Status";
                //    worksheet.Cells[1, 1 + 6].Value = "Not Serve Reason";
                //    worksheet.Cells[1, 1 + 7].Value = "Pw Presence status on date of evidance";
                //    worksheet.Cells[1, 1 + 8].Value = "Pw Absent reason";
                //    worksheet.Cells[1, 1 + 9].Value = "Court Action";
                //    worksheet.Cells[1, 1 + 10].Value = "Absent other reason";
                //    worksheet.Cells[1, 1 + 11].Value = "Present other reason";
                //    worksheet.Cells[1, 1 + 12].Value = "Note";

                //    int row = 2;
                //    foreach (var item in data)
                //    {
                //        worksheet.Cells["A" + row.ToString()].Value = item.Casedetails.ToString();
                //        worksheet.Cells["B" + row.ToString()].Value = item.issueDate.ToString();
                //        worksheet.Cells["C" + row.ToString()].Value = item.PWdetails.ToString();
                //        worksheet.Cells["D" + row.ToString()].Value = item.CourtProcess.ToString();
                //        worksheet.Cells["E" + row.ToString()].Value = item.Evidencedate.ToString();
                //        worksheet.Cells["F" + row.ToString()].Value = item.Servicestatus.ToString();
                //        worksheet.Cells["G" + row.ToString()].Value = item.NotServedReason.ToString();
                //        worksheet.Cells["H" + row.ToString()].Value = item.PWPresenceStatus.ToString();
                //        worksheet.Cells["I" + row.ToString()].Value = item.Absentreason.ToString();
                //        worksheet.Cells["J" + row.ToString()].Value = item.CourtAction.ToString();
                //        worksheet.Cells["K" + row.ToString()].Value = item.otherReason.ToString();
                //        worksheet.Cells["L" + row.ToString()].Value = item.PresentotherReason.ToString();
                //        worksheet.Cells["M" + row.ToString()].Value = item.Note.ToString();
                //        row++;
                //    }

                //    MemoryStream memoryStream = new MemoryStream();
                //    package.SaveAs(memoryStream);

                //    Response.Clear();
                //    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                //    Response.AddHeader("content-disposition", "attachment; filename=Stf_PwProcessDetails.xlsx");
                //    Response.BinaryWrite(memoryStream.ToArray());
                //    Response.End();
                //}

               // return "SuccessFully download.";
            }
            catch (Exception ex)
            {
            }
        }



        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult UserMapDataForSelect()
        {
            try
            {
                int isDelete = 1;
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_GetFirmUserslistonthebehalfofmapping( firmid, userId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult SecondaryUserMapDataForSelect()
        {
            try
            {
                int isDelete = 1;
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var data = db.SP_STF_GetSecondaryUsersList(firmid);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult TertiaryUserMapDataForSelect(string userid)
        {
            try
            {
                int isDelete = 1;
                //string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var data = db.SP_STF_GetTertiaryUsersList(userid,firmid);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult CaseDetailsByCaseId(string caseid)
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();

                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                int caseId = Convert.ToInt32(caseid);

                var addfClient = new WebClient();
                //var apiUrl = "http://localhost:61314/";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = "MyKase_"+userId,
                    caseid = caseId,
                    Userrefid = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString(),
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = System.Text.Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                dynamic resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseDetails"), "POST", builders);

                CaseDetailsModal caseDetailsModal = JsonConvert.DeserializeObject<CaseDetailsModal>(resid);

                return Json(caseDetailsModal.data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        //TertiaryUserMapDataForSelect


        //Download Process Entry Details End
        //Process Entry View and coding Section End

        ////Add User Section start
        //[AuthLog(Roles = "Firm,User,Client")]
        //public ActionResult AddUserDashboard()
        //{
        //    var db = new LawPracticeEntities();
        //    string userId = LoggedInUser.UserId.ToString();
        //    var data = db.sp_Get_STF_Permission(userId).FirstOrDefault();
        //    if (data.isAccess == 1)
        //    {
        //        return View();
        //    }
        //    else
        //    {
        //        return RedirectToAction("Personaldashboard", "firm");
        //    }

        //}

        ////Check User Is Exist Or Not 
        //[System.Web.Mvc.HttpPost]
        //[AuthLog(Roles = "Firm,User,Client")]
        //public ActionResult ValidateUserExistOrNot(int iid, string email, string mobile, string userid, string Password, string Name, string Zone, string Designation)
        //{
        //    try
        //    {
        //        string MKUserId = "";
        //        string Loginuserid = LoggedInUser.UserId.ToString();
        //        string firmid  = LoggedInUser.FirmId.ToString();
        //        string UpdatedBy = LoggedInUser.UserId.ToString();
        //        bool active = true;
        //        ObjectParameter message = new ObjectParameter("message", typeof(string)); 
        //        var db = new LawPracticeEntities();
        //        var data = db.sp_Check_STF_UserData(iid, email, mobile, userid, message);

        //        if (message.Value.Equals("UserId exists"))
        //        {
        //            return Json(message.Value, JsonRequestBehavior.AllowGet);
        //        }
        //        else if (message.Value.Equals("Mobile number exists"))
        //        {
        //            return Json(message.Value, JsonRequestBehavior.AllowGet);
        //        }
        //        else if (message.Value.Equals("Email exists"))
        //        {
        //            return Json(message.Value, JsonRequestBehavior.AllowGet);
        //        }
        //        else if (message.Value.Equals("No matching records found"))
        //        {
        //            dynamic password = QueryAES.GetHashedCode(Password);
        //            password = password.Replace("\n", "");
        //            ObjectParameter id = new ObjectParameter("id", typeof(string));
        //            using (var transaction = db.Database.BeginTransaction())
        //            {
        //                try
        //                {
        //                    var insertResultToMyKase = db.Usp_SaveFirmUserMember(firmid, Loginuserid, "firm", active, false, false, password, userid, 2, "dashboard", email, id, Guid.Empty.ToString(), 1, null);
        //                    var reguserResult = db.Usp_SaveRegUserMemberData(firmid, Loginuserid, id.Value.ToString(), Name, null, null, null, Designation, Zone, null, mobile, null, "India", null, null, "2", null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        //                    var rightResult = db.usp_saveuserdefaultrightsforpartner(firmid, Loginuserid, id.Value.ToString());
        //                    var result = db.sp_Save_STF_UsersData(id.Value.ToString(), Name, email, mobile, userid, Password, Zone, Designation, UpdatedBy);
        //                    if (reguserResult > 0 && result > 0)
        //                    {
        //                        transaction.Commit();
        //                        return Json("Data Saved SuccessFully.", JsonRequestBehavior.AllowGet);
        //                    }
        //                    else
        //                    {
        //                        transaction.Rollback();
        //                        return Json("Something went wrong.", JsonRequestBehavior.AllowGet);
        //                    }

        //                } catch(Exception ex)
        //                {
        //                    transaction.Rollback();
        //                    return Json("Something went wrong.", JsonRequestBehavior.AllowGet);
        //                }




        //            }

        //        }

        //        return Json(message.Value, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}

        ////Tabular data of user deatils of stf Start
        //[System.Web.Mvc.HttpPost]
        //[AuthLog(Roles = "Firm,User,Client")]
        //public ActionResult UserDetailsTabularData(int pageNo, int pageSize)
        //{
        //    try
        //    {
        //        int isDelete = 1;
        //        string userId = LoggedInUser.UserId.ToString();
        //        var db = new LawPracticeEntities();
        //        var data = db.sp_GetAll_STF_UserData(userId, pageNo,pageSize);
        //        return Json(data, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

        ////Tabular data of user deatils of stf End



        ////Add user section End
        ///


        //Stf Rights section Start
        [AuthLog(Roles = "Firm,User,Client")]
        public  ActionResult StfUserRights()
        {
            string roleId = LoggedInUser.RoleId.ToString();
            if (roleId.Equals("1"))
            {
                return View();

            }
            else
            {
                return RedirectToAction("LitigationCaseList", "CW");

            }

        }

        //Stf Rights Section End
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfRoleModule(string userid)
        {
            try
            {
               // int isDelete = 1;
               // string firmid = LoggedInUser.FirmId.ToString();
               var db = new LawPracticeEntities();
                var data = db.sp_STF_selectRoles();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfUserListForUserrights()
        {
            try
            {
                // int isDelete = 1;
                string firmid = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_STF_GetFirmUsers(Guid.Parse(firmid));
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfInsertAndUpdateUserrights(string userids,string moduleids,string isView, string isEdit)
        {
            try
            {
                // int isDelete = 1;
                string firmid = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var data = db.sp_STF_InsertOrUpdateUserRights(userids, moduleids, isView, isEdit);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfPermissionuserValidate()
        {
            try
            {
                dynamic data= null;
                var db = new LawPracticeEntities();
                if (LoggedInUser.RoleId.ToString().Equals("1"))
                {
                    data = 1;
                }
                else
                {
                    string userid = LoggedInUser.UserId.ToString();
                    string roleid = "ProcessEntry";
                     data = db.sp_Get_STF_UserPagePermission(userid, roleid).FirstOrDefault();

                }
              
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfPermissionuserValidateEditPermission(string roleiid)
        {
            try
            {
                dynamic data = null;
                var db = new LawPracticeEntities();
                if (LoggedInUser.RoleId.ToString().Equals("1"))
                {
                    data = 1;
                }
                else
                {
                    string userid = LoggedInUser.UserId.ToString();
                    //string roleid = "ProcessEntry";
                    data = db.sp_Get_STF_UserPagePermissionEdit(userid, roleiid).FirstOrDefault();

                }

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult TabularDataOFStfRolesRightUser(int pageNo, int pageSize)
        {
            try
            {
                var db = new LawPracticeEntities();

                string firmid = LoggedInUser.FirmId.ToString();
                var data = db.sp_STF_userrightTabularData(firmid, pageNo, pageSize);
                return Json(data, JsonRequestBehavior.AllowGet);

            

            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult DetailsOfStfRolesRightUser(string userid)
        {
            try
            {
                var db = new LawPracticeEntities();

                //string firmid = LoggedInUser.FirmId.ToString();
                var data = db.sp_STF_RightDataByUserId(userid);
                return Json(data, JsonRequestBehavior.AllowGet);



            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult checkEmployeeCodeExist(string empoyeeCode)
        {
            try
            {
                var db = new LawPracticeEntities();

                //string firmid = LoggedInUser.FirmId.ToString();
                var data = db.sp_STF_CheckEmployeeCodeExistOrNOT(empoyeeCode);
                return Json(data, JsonRequestBehavior.AllowGet);



            }
            catch (Exception ex)
            {
                throw;
            }
        }



        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ProcessReport(string issueDateFrom,string issueDateTo, string searchuserId)
        {
            try
            {
                var db = new LawPracticeEntities();

                //string firmid = LoggedInUser.FirmId.ToString();
                var CourtProcessReport = db.sp_STF_CourtProcessReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId) ;
                var CourtProcessReport1 = db.sp_STF_CourtProcessServeReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId);
                var CourtProcessReport2 = db.sp_STF_CourtProcessNOTServeReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId);
                var CourtProcessReport3 = db.sp_STF_CourtPWPresenceReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId);
                var CourtProcessReport4 = db.sp_STF_CourtPWAbsenteReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId);
                var CourtProcessReport5 = db.sp_STF_CourtActionStatusReportCount(Convert.ToDateTime(issueDateFrom), Convert.ToDateTime(issueDateTo), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), searchuserId);
                StfReportModal reportModal = new StfReportModal();
                reportModal.CourtProcessReport = CourtProcessReport;
                reportModal.CourtProcessServeReport = CourtProcessReport1;
                reportModal.CourtProcessNOTServeReport = CourtProcessReport2;
                reportModal.CourtPWPresenceReport = CourtProcessReport3;
                reportModal.CourtPWAbsenteReport = CourtProcessReport4;
                reportModal.CourtActionStatusReport = CourtProcessReport5;
                return Json(reportModal, JsonRequestBehavior.AllowGet);



            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult StfReports()
        {
            var db = new LawPracticeEntities();
            string firmid = LoggedInUser.FirmId.ToString();
            var data = db.sp_Get_STF_Permission(firmid).FirstOrDefault();
            if (data == 0)
            {
                return RedirectToAction("LitigationCaseList", "CW");
            }
            else
            {
                return View();
            }


        }


        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult MapPwusertoCase(string pwid, string usercaseId, string caseDetails)
        {
            try
            {
                var db = new LawPracticeEntities();
                try{
                    usercaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseId));

                }
                catch
                {

                }
                int caseId = Convert.ToInt32(usercaseId);
                string firmid = LoggedInUser.FirmId.ToString();
                string UserId = LoggedInUser.UserId.ToString();
                var data = db.sp_MapCaseToPwUser(Convert.ToInt32(pwid), caseId, UserId, caseDetails);
               
                 return Json(data, JsonRequestBehavior.AllowGet);
            
            }
            catch(Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
                throw;
            }
     


        }

        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult MapPwuserMapCaseList(string pwid,int pageNo, int pageSize)
        {
            try
            {
                var db = new LawPracticeEntities();
     
                string firmid = LoggedInUser.FirmId.ToString();
                string UserId = LoggedInUser.UserId.ToString();
                var data = db.sp_STF_PwUserCaseMapList(UserId, firmid, Convert.ToInt32(pwid), pageNo,Convert.ToInt32(pageSize));

                return Json(data, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
                throw;
            }



        }

        //Get Pwd List For Select Field Start case Mapped User
        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ListOFPwdCaseMapUserForSelect(string userCaseId)
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();
                userCaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userCaseId));
                int caseId = Convert.ToInt32(userCaseId);
                var data = db.sp_Stf_GetCaseMapPwuser(caseId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }



        [System.Web.Mvc.HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult DeleteMapCaseToPwUser(int id)
        {
            try
            {
                var db = new LawPracticeEntities();
                string userId = LoggedInUser.UserId.ToString();
                string firmid = LoggedInUser.FirmId.ToString();
           
                var data = db.sp_STF_DeleteMapCaseToPWUser(id);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        


    }
}