using BussinessLogic;
using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using NoticeManagement.BusinessLayer.BusinessEntity;
using NoticeManagement.BusinessLayer.IBusinessRepository;
using QueryStringEDAES;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace NoticeManagement.BusinessLayer.BusinessRepository
{
    public class NoticeRepository : INotice
    {
        private LawPracticeEntities db;
        public NoticeRepository(LawPracticeEntities _NoticeEntities)
        {
            this.db = _NoticeEntities;
        }
        /// <summary>
        /// Get notice status list by firm id
        /// </summary>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<sp_GetNoticeStatusList_Result> GetnoticestatusByFirmId(string firmid)
        {
            List<sp_GetNoticeStatusList_Result> result = null;
            try
            {
                result = db.sp_GetNoticeStatusList(firmid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice status details by firm id
        /// </summary>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<sp_GetNoticeStatusDetailList_Result> GetnoticestatusDetailByFirmId(string firmid)
        {
            List<sp_GetNoticeStatusDetailList_Result> result = null;
            try
            {
                result = db.sp_GetNoticeStatusDetailList(firmid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get partner list details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public List<sp_getPartnerList_Result> GetPartnerList(string firmid, string userid)
        {
            List<sp_getPartnerList_Result> result = null;
            try
            {
                result = db.sp_getPartnerList(firmid, userid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Save notification details
        /// </summary>
        /// <param name="notificationfor"></param>
        /// <param name="txtnoticeids"></param>
        /// <param name="txtalrtbefore"></param>
        /// <param name="txtduedate"></param>
        /// <param name="txlalertcondition"></param>
        /// <param name="DeserializeAlertObj"></param>
        /// <returns></returns>
        public bool Savedatafornotification(string notificationfor, string txtnoticeids, string txtalrtbefore,
                                            string txtduedate, string txlalertcondition, DataTable DeserializeAlertObj)
        {
            bool result = false;
#pragma warning disable CS0219 // The variable 'txtCustomDueDate' is assigned but its value is never used
            string txtCustomDueDate = "";
#pragma warning restore CS0219 // The variable 'txtCustomDueDate' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'reminderRemark' is assigned but its value is never used
            string reminderRemark = "";
#pragma warning restore CS0219 // The variable 'reminderRemark' is assigned but its value is never used
#pragma warning disable CS0219 // The variable 'output' is assigned but its value is never used
            dynamic output = null;
#pragma warning restore CS0219 // The variable 'output' is assigned but its value is never used
            var noticeids = txtnoticeids.Split(',');
            db.sp_deletenotification(noticeids[0].ToString());
            dynamic finalresult = null;
            if (DeserializeAlertObj.Rows.Count > 0)
            {
                var notiid = noticeids[0].ToString();
                var resultfromtblnotice = db.TblNotices.Where(x => x.NoticeId.ToString() == notiid.ToString()).FirstOrDefault();
                for (int i = 0; i < DeserializeAlertObj.Rows.Count; i++)
                {
                    var customDate = "";
                    var alertBA = "";
                    var setDays = "";
                    var reminderDate = "";
                    var remark = "";
                    customDate = DeserializeAlertObj.Rows[i]["customDate"].ToString();
                    alertBA = DeserializeAlertObj.Rows[i]["alertBA"].ToString();
                    setDays = DeserializeAlertObj.Rows[i]["setDays"].ToString();
                    reminderDate = DeserializeAlertObj.Rows[i]["reminderDate"].ToString();
                    remark = DeserializeAlertObj.Rows[i]["remark"].ToString();
                    finalresult = db.sp_Savedataintblnotification(noticeids[0].ToString(), resultfromtblnotice.NoticeSubject,
                       resultfromtblnotice.NoticeTitle, resultfromtblnotice.FirmId,
                       resultfromtblnotice.CaseStatus, null, null, resultfromtblnotice.UserId, null, Convert.ToDateTime(reminderDate), Convert.ToDateTime(customDate), remark, alertBA, setDays);
                }
                if (finalresult > 0)
                {
                    result = true;
                }
            }

            return result;
        }
        /// <summary>
        /// Get set alert details
        /// </summary>
        /// <param name="NoticeId"></param>
        /// <param name="TypeofNotices"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public dynamic GetSetAlertDetails(string NoticeId, string TypeofNotices, string FirmId)
        {
            dynamic result = new List<Usp_ViewSetAlertByNoticeId_Result>();
            try
            {
                result = db.Usp_ViewSetAlertByNoticeId(NoticeId.ToString(), FirmId).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Update checkout details
        /// </summary>
        /// <param name="docid"></param>
        /// <returns></returns>
        public bool Updatecheckout(string docid)
        {
            bool result = false;
            try
            {
                var output = db.sp_updatecheckoutflag(docid, true);
                if (output > 0)
                {
                    result = true;
                }
            }
            catch (Exception)
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice list for ddl
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public List<sp_Getnoticelistforddl_Result> Getnoticelistforddl(string firmid, string userid)
        {
            List<sp_Getnoticelistforddl_Result> result = null;
            try
            {
                result = db.sp_Getnoticelistforddl(userid.ToString(), firmid.ToString()).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice list for reminder ddl
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="TypeOfNotice"></param>
        /// <returns></returns>
        public List<sp_GetnoticelistforReminderddl_Result> NoticeListForReminderddl(string firmid, string userid, string TypeOfNotice)
        {
            List<sp_GetnoticelistforReminderddl_Result> result = null;
            try
            {
                result = db.sp_GetnoticelistforReminderddl(userid.ToString(), firmid.ToString(), TypeOfNotice).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get date for alert by notice id
        /// </summary>
        /// <param name="noticeid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public sp_Getdateforalertbynoticeid_Result Dateforalertbynoticeid(string noticeid, string firmid)
        {
            sp_Getdateforalertbynoticeid_Result result = null;
            try
            {
                result = db.sp_Getdateforalertbynoticeid(noticeid, firmid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get share document
        /// </summary>
        /// <param name="docid"></param>
        /// <param name="receiverid"></param>
        /// <param name="senderid"></param>
        /// <returns></returns>
        public bool Documentshare(string docid, string receiverid, string senderid)
        {
            bool result = false;
            try
            {
                var output = db.sp_sharedocument(docid, receiverid);
                db.sp_SaveNotification(docid, "", null, "", "You have shared a documnent", null, senderid, "", null);
                var output1 = db.sp_SaveDocShareHistory(docid, receiverid, senderid);
                if (output1 > 0)
                {
                    result = true;
                }
            }
            catch (Exception)
            {
            }
            return result;
        }
        /// <summary>
        /// Get document version list
        /// </summary>
        /// <param name="docid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<sp_getdocversionbymaindocid_Result> GetDocumentVersionList(string docid, string firmid)
        {
            List<sp_getdocversionbymaindocid_Result> result = null;
            try
            {
                result = db.sp_getdocversionbymaindocid(docid, firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Remove document for doc module
        /// </summary>
        /// <param name="docid"></param>
        /// <param name="CreatedByUserId"></param>
        /// <returns></returns>
        public Message RemoveDocfromDocModule(string docid, string CreatedByUserId)
        {
            var output = new Message();
            try
            {
                var result = db.usp_deletedocfromlist(docid);
                if (result > 0)
                {
                    output.message = "Document removed successfully";
                    output.status = true;
                    db.sp_SaveNotification(docid, "", null, "", "You have removed a document.", null, CreatedByUserId, "", null);
                }
            }
            catch (Exception ex)
            {
                output.message = ex.Message;
                output.status = false;
            }
            return output;
        }
        /// <summary>
        /// Get doc description by id
        /// </summary>
        /// <param name="docid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public usp_getdocdescriptionbyId_Result GetDocDescriptionbyId(string docid, string firmid)
        {
            usp_getdocdescriptionbyId_Result output = null;
            try
            {
                output = db.usp_getdocdescriptionbyId(docid, firmid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Update doc from doc module
        /// </summary>
        /// <param name="description"></param>
        /// <param name="docid"></param>
        /// <param name="loginid"></param>
        /// <returns></returns>
        public bool updateDocfromDocModule(string description, string docid, string loginid)
        {
            bool result = false;
            try
            {
                var output = db.usp_editdocdescription(description, docid, loginid);
                if (output > 0)
                {
                    result = true;
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get document list
        /// </summary>
        /// <param name="loginid"></param>
        /// <param name="roleid"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="Doctype"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<sp_getDocumentList_Result> GetDocumentList(string loginid, int roleid, int pagenum, int pagesize, string Doctype, string firmid)
        {
            List<sp_getDocumentList_Result> result = null;
            try
            {
                result = db.sp_getDocumentList(loginid, roleid, pagenum, pagesize, Doctype, firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Add document
        /// </summary>
        /// <param name="hiddenid"></param>
        /// <param name="firmid"></param>
        /// <param name="loginid"></param>
        /// <param name="postedFiledata"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        public Message AddDocument(string hiddenid, string firmid, string loginid, string postedFiledata, string description)
        {
            var output = new Message();
            try
            {
                string id = "";
                ObjectParameter ReturnVal;
                ReturnVal = new ObjectParameter("resultid", id);
                if (hiddenid == "")
                {
                    string[] values1 = postedFiledata.Split('/');
                    var result = db.sp_addDocument(values1[0], true, hiddenid, loginid, firmid, description, ReturnVal, "");
                    id = Convert.ToString(ReturnVal.Value);
                    if (result > 0)
                    {
                        output.message = "Document uploaded successfully";
                        output.status = true;
                        db.sp_SaveNotification(id, "", firmid, "", "You have uploaded a document", null, loginid, "", null);
                    }
                }
                else
                {
                    var existcount = db.sp_getdoccountforversion(hiddenid, firmid).FirstOrDefault();
                    string[] values1 = postedFiledata.Split('/');
                    var filename = values1[0] + ":-" + "version" + (existcount + 1);
                    var result = db.sp_addDocument(filename, true, hiddenid, loginid, firmid, description, ReturnVal, "");
                    id = Convert.ToString(ReturnVal.Value);
                    var result1 = db.sp_updatecheckoutflag(hiddenid, false);
                    if (result > 0 && result1 > 0)
                    {
                        output.message = "Document uploaded successfully";
                        output.status = true;
                        db.sp_SaveNotification(id, "", firmid, "", "You have uploaded a document", null, loginid, "", null);
                    }
                }
            }
            catch (Exception ex)
            {
                output.message = ex.Message;
                output.status = false;
            }
            return output;
        }
        /// <summary>
        /// Delete notice
        /// </summary>
        /// <param name="NoticeID"></param>
        /// <param name="deleteflag"></param>
        /// <returns></returns>
        public bool DeleteNotice(string NoticeID, string deleteflag)
        {
            try
            {
                var i = db.usp_DeleteNotice(Guid.Parse(NoticeID), deleteflag);
                if (i >= 1)
                    return true;
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// Get closure notice
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="NoticeId"></param>
        /// <param name="closuredate"></param>
        /// <param name="ddlnoticestatus"></param>
        /// <param name="frombulkupload"></param>
        /// <returns></returns>
        public bool NoticeClosure(string UserId, string NoticeId, DateTime closuredate, string ddlnoticestatus, string frombulkupload)
        {
            bool result = false;
            try
            {
                if (frombulkupload == "frombulkupload")
                {
                    var output = db.sp_SetNoticeClouseFromTemplate(closuredate, UserId, NoticeId, ddlnoticestatus);
                    if (output > 0)
                    {
                        result = true;
                    }
                }
                else if (frombulkupload == "undefined" || frombulkupload == null || frombulkupload == "")
                {
                    var output = db.sp_SetNoticeClouse(closuredate, UserId, NoticeId, ddlnoticestatus);
                    if (output > 0)
                    {
                        result = true;
                    }
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                result = false;
            }
            return result;
        }
        /// <summary>
        /// Get notice details by Id
        /// </summary>
        /// <param name="noticeID"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public usp_GetNoticeByID_Result GetNoticeDetailByID(string noticeID, string firmid)
        {
            try
            {
                var Noticelist = db.usp_GetNoticeByID(noticeID, firmid).FirstOrDefault();
                return Noticelist;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return null;
            }
        }
        /// <summary>
        /// Get notice detail list by id
        /// </summary>
        /// <param name="noticeID"></param>
        /// <param name="LoginUserId"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<usp_GetNoticeByID_Result> GetNoticeDetailListByID(string noticeID, string LoginUserId, string firmid)
        {
            List<usp_GetNoticeByID_Result> result = null;
            try
            {
                db.sp_updateseennotification(noticeID);
                result = db.usp_GetNoticeByID(noticeID, firmid).ToList();
                return result;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return null;
            }
        }
        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }
        /// <summary>
        /// Save notice details
        /// </summary>
        /// <param name="notice"></param>
        /// <returns></returns>
        public Message savenotice(Notice notice)
        {
            var output = new Message();
            try
            {
                string id = "";
                ObjectParameter ReturnVal;
                ReturnVal = new ObjectParameter("resultid", id);
                var amountclaimed = notice.Amountclaimed == "" ? "0" : notice.Amountclaimed;
                var result = db.usp_AddUpdateNotices(notice.NoticeID, notice.FirmId, notice.UserId, notice.CaseStatus, notice.NoticeType,
                   notice.AssignmentofTask, notice.GenerationofAlerts, notice.DateofNotice, notice.ModeofServiceorDelivery, notice.AddressedTo,
                   notice.AddresseeAddress,
                   notice.OtherDetailsofAddressee, notice.SendersName, notice.SendersAddress, notice.OtherDetailsofSender, notice.NoticeSubject,
                   notice.NoticeTitle,
                   notice.CreateNotice, notice.NoticeThrough, notice.DateofDelivery, notice.DateofReceipt, notice.CurrentStatus,
                   0, "", notice.NoticeCreatedOn,
                   ReturnVal, notice.Criticality, amountclaimed, notice.SonOf, notice.RoOf, notice.Tag, notice.ResonForHighPriority,
                   notice.NoticeThroughId, notice.SubectId, notice.col1, notice.col2, notice.col3, notice.col4, notice.col5,
                   notice.col6, notice.col7, notice.col8, notice.col9, notice.col10, notice.col11, notice.col12, notice.col13, notice.col14,
                   notice.col15, Convert.ToInt16(notice.formtype), notice.DueDateOfNotice, notice.Senderothertxt, notice.SenderNameId, notice.ReferenceNumber,
                   notice.IntReferenceNumber);
                id = Convert.ToString(ReturnVal.Value);
                // map column
                if (notice.NoticeID == "")
                {
                    for (int i = 1; i <= notice.sum; i++)
                    {
                        var pid = id;
                        var column_no = "col" + i;
                        var column_name = "";
                        //var st="ccol" + i;
                        if (i == 1)
                        {
                            var ctxt = notice.ctxt1;
                            column_name = ctxt;
                        }
                        else if (i == 2)
                        {
                            var ctxt = notice.ctxt2;
                            column_name = ctxt;
                        }
                        else if (i == 3)
                        {
                            var ctxt = notice.ctxt3;
                            column_name = ctxt;
                        }
                        else if (i == 4)
                        {
                            var ctxt = notice.ctxt4;
                            column_name = ctxt;
                        }
                        else if (i == 5)
                        {
                            var ctxt = notice.ctxt5;
                            column_name = ctxt;
                        }
                        else if (i == 6)
                        {
                            var ctxt = notice.ctxt6;
                            column_name = ctxt;
                        }
                        else if (i == 7)
                        {
                            var ctxt = notice.ctxt7;
                            column_name = ctxt;
                        }
                        else if (i == 8)
                        {
                            var ctxt = notice.ctxt8;
                            column_name = ctxt;
                        }
                        else if (i == 9)
                        {
                            var ctxt = notice.ctxt9;
                            column_name = ctxt;
                        }
                        else if (i == 10)
                        {
                            var ctxt = notice.ctxt10;
                            column_name = ctxt;
                        }
                        else if (i == 11)
                        {
                            var ctxt = notice.ctxt11;
                            column_name = ctxt;
                        }
                        else if (i == 12)
                        {
                            var ctxt = notice.ctxt12;
                            column_name = ctxt;
                        }
                        else if (i == 13)
                        {
                            var ctxt = notice.ctxt13;
                            column_name = ctxt;
                        }
                        else if (i == 14)
                        {
                            var ctxt = notice.ctxt14;
                            column_name = ctxt;
                        }
                        else if (i == 15)
                        {
                            var ctxt = notice.ctxt15;
                            column_name = ctxt;
                        }
                        var formid = Convert.ToInt32(notice.ftype);
                        var inserrcol = db.Usp_SaveCaseColumnMapNotice(notice.FirmId, notice.UserId, column_no, column_name, pid, notice.ftype);
                        //var inserrcol = db.Usp_SaveCaseColumnMap(notice.FirmId, notice.UserId, column_no, column_name, pid);
                    }
                }
                if (result > 0)
                {
                    if (notice.NoticeID == "")
                    {
                        db.sp_SaveNotification(id, notice.NoticeSubject, notice.FirmId, notice.CaseStatus, "You have added a notice", notice.GenerationofAlerts, notice.UserId, "New Notice", null);
                        output.output = id.ToString();
                    }
                    else
                    {
                        db.sp_SaveNotification(notice.NoticeID, notice.NoticeSubject, notice.FirmId, notice.CaseStatus, "You have modified a notice", notice.GenerationofAlerts, notice.UserId, "New Notice", null);
                        output.output = notice.NoticeID.ToString();
                    }
                }
                if (notice.postedFiledata != "")
                {
                    if (notice.NoticeID == "")
                    {
                        if (notice.PostedFiledocmodule != "")
                        {
                            string id1 = "";
                            ObjectParameter ReturnVal1;
                            ReturnVal1 = new ObjectParameter("resultid", id1);
                            string[] values2 = notice.PostedFiledocmodule.Split('/');
                            var result1 = db.sp_addDocument(values2[0], true, "", notice.UserId, notice.FirmId, "", ReturnVal1, id.ToString());
                            id1 = Convert.ToString(ReturnVal.Value);
                        }
                    }
                    else
                    {
                        if (notice.PostedFiledocmodule != "")
                        {
                            string id1 = "";
                            ObjectParameter ReturnVal1;
                            ReturnVal1 = new ObjectParameter("resultid", id1);
                            string[] values2 = notice.PostedFiledocmodule.Split('/');
                            var result1 = db.sp_addDocument(values2[0], true, "", notice.UserId, notice.FirmId, "", ReturnVal1, notice.NoticeID.ToString().ToString());
                            id1 = Convert.ToString(ReturnVal.Value);
                        }
                        output.output = notice.NoticeID.ToString();
                    }
                }
                try
                {
                    var checkForDraftId = db.sp_getNoticeDraftByNoticeId(output.output.ToString()).FirstOrDefault();
                    if (checkForDraftId != null)
                    {
                        output.DraftId = checkForDraftId.Id;
                    }
                    var checkForParentDraftId = db.sp_getPrimaryNoticeDraftByNoticeId(output.output.ToString()).FirstOrDefault();
                    if (checkForParentDraftId != null)
                    {
                        output.parentDraftId = checkForParentDraftId.Id;
                    }
                }
                catch
                {
                }
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                    string logo = "";
                    try
                    {
                        var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
                        try
                        {
                            var getLogo = "";
                            var firmlogo = db.usp_GetNoticeLogoData(firmid.ToString()).FirstOrDefault();
                            if (firmlogo != null)
                            {
                                getLogo = firmlogo.LogoPath.ToString();
                            }
                            var getLogoposition = db.sp_GetLogoPosition(firmid).FirstOrDefault();
                            dynamic logoposition = "";
                            if (getLogoposition != null)
                            {
                                if (getLogoposition.LogoPosition == "Middle")
                                {
                                    logoposition = "center";
                                }
                                else
                                {
                                    logoposition = getLogoposition.LogoPosition;
                                }
                            }
                            else
                            {
                                logoposition = "right";
                            }
                            if (!string.IsNullOrEmpty(getLogo))
                            {
                                try
                                {
                                    string siteurl = System.Web.Configuration.WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                    logo = System.Web.Hosting.HostingEnvironment.MapPath(getLogo);
                                    logo = "<div style='text-align:" + logoposition + "'><img src='" + siteurl + getLogo + "' alt='logo'></div>";
                                }
                                catch
                                {
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                    catch
                    {
                    }
                    string strHTMLpath = "";
                    strHTMLpath = System.Web.Hosting.HostingEnvironment.MapPath("~\\Documents\\NoticeTemplate\\NoticeTemplate.html");
                    StreamReader reader = new StreamReader(strHTMLpath, Encoding.UTF8);
                    string strinvoicetemplate = reader.ReadToEnd().Replace('\r', ' ').Replace('\n', ' ').Replace("  ", " ");
                    var getnoticesubject = db.sp_getNoticeSubjectList(notice.FirmId.ToString()).Where(x => x.Id == notice.NoticeSubject).FirstOrDefault();
                    strinvoicetemplate = strinvoicetemplate.Replace("@noticecontent", notice.CreateNotice);
                    strinvoicetemplate = strinvoicetemplate.Replace("@logo", logo);
                    string header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
         "xmlns:w='urn:schemas-microsoft-com:office:word' " +
         "xmlns='https://www.w3.org/TR/REC-html40'>" +
         "<head><meta charset='utf-8'><title>OCR DOCS</title></head><body>";
                    string footer = "</body></html>";
                    strinvoicetemplate = header + strinvoicetemplate + footer;
                    int? draftCount = 0;
                    if (notice.NoticeID != "")
                    {
                        draftCount = db.usp_GetSaveNoticeDraftCount(notice.NoticeID, notice.FirmId).FirstOrDefault();
                        draftCount = draftCount + 1;
                    }
                    else
                    {
                        draftCount = draftCount + 1;
                    }
                    string filename = "Version - " + draftCount + "_" + notice.NoticeTitle;
                    //filename = Regex.Replace(filename, @"[^0-9a-zA-Z.]+", "");
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~//Documents/NoticeDraftDocuments/DraftNotice/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string content = strinvoicetemplate;
                    var htmfth = folderPath + filename + ".doc";
                    var pffth = folderPath + filename + ".pdf";
                    File.WriteAllText(htmfth, content, Encoding.UTF8);
                    var folderpathazure = "";
                    var input = htmfth;
                    FileInfo fi = new FileInfo(input);
                    try
                    {
                        folderpathazure = "Documents/NoticeDraftDocuments/DraftNotice/" + notice.FirmId.ToString() + "/" + notice.UserId.ToString();
                        folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                        string fakepathout = "azuredirout/" + notice.FirmId.ToString() + "/" + notice.UserId.ToString();
                        if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                        {
                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                        }
                        string outputs = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + fi.Name);
                        QueryAES.FileEncrypt(input, outputs);
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                        catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
                    }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                    catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                    {
                    }
                    if (notice.NoticeID == "")
                    {
                        db.sp_savenoticedraft(id, filename, folderpathazure + "/" + fi.Name, notice.UserId, notice.FirmId);
                    }
                    else
                    {
                        db.sp_savenoticedraft(notice.NoticeID, filename, folderpathazure + "/" + fi.Name, notice.UserId, notice.FirmId);
                    }
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        // Drafted item - Notice in one view
        public List<sp_getnoticedraft_Result> Getdraftednoticeitem(string noticeid)
        {
            List<sp_getnoticedraft_Result> result = null;
            try
            {
                result = db.sp_getnoticedraft(noticeid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// View notice detail
        /// </summary>
        /// <param name="id"></param>
        /// <param name="param"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public Message viewnotice(string id, string param, string firmid)
        {
            var message = new Message();
            try
            {
                var result = db.sp_viewmore(id, param).FirstOrDefault();
                message.status = true;
                message.message = result;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                message.status = false;
                message.message = "Something went wrong.";
            }
            return message;
        }
        /// <summary>
        /// View set alert  details
        /// </summary>
        /// <param name="id"></param>
        /// <param name="param"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public Message ViewMoreSetAlert(string id, string param, string firmid)
        {
            var message = new Message();
            try
            {
                var result = db.Usp_SetAlertViewMore(id).FirstOrDefault();
                message.status = true;
                message.message = result;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                message.status = false;
                message.message = "Something went wrong.";
            }
            return message;
        }
        /// <summary>
        /// Notice log by manager or client wise 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Usertype"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public sp_getNoticeLog_Result viewnoticelog(string id, string Usertype, string firmid)
        {
            sp_getNoticeLog_Result result = null;
            try
            {
                var userid = db.sp_getuseridbyusertype(Usertype, id, firmid).FirstOrDefault();
                result = db.sp_getNoticeLog(id, userid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        // Notice log by notice id for all history 
        public List<sp_getNoticeLogNew_Result> viewnoticelogNew(string id, string firmid, string Usertype)
        {
            List<sp_getNoticeLogNew_Result> result = null;
            try
            {
                result = db.sp_getNoticeLogNew(id, firmid, Usertype).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="NoticeStatus"></param>
        /// <param name="fromdaterange"></param>
        /// <param name="startdate"></param>
        /// <param name="enddate"></param>
        /// <param name="fromreminder"></param>
        /// <param name="noticeid"></param>
        /// <param name="sendernamesrch"></param>
        /// <param name="srchnoticesubject"></param>
        /// <param name="srhnoticetitle"></param>
        /// <param name="noticetypesrch"></param>
        /// <param name="CaseNoticeStatus"></param>
        /// <param name="IsArchived"></param>
        /// <returns></returns>
        public dynamic GetNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                               string RoleId, string NoticeStatus, string fromdaterange, string startdate,
                               string enddate, string fromreminder, string noticeid, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch, string CaseNoticeStatus, string IsArchived)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            try
            {
                Noticelist = db.usp_GetNotice(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                                         Convert.ToInt16(RoleId), NoticeStatus, firmid, Convert.ToBoolean(fromdaterange),
                                         startdate, enddate, Convert.ToBoolean(fromreminder), noticeid, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch, CaseNoticeStatus, IsArchived).ToList();
            }
            catch (Exception ex)
            {
                var exs = ex.Message;
            }
            return Noticelist;
        }
        /// <summary>
        /// Remove reminder
        /// </summary>
        /// <param name="NoticeID"></param>
        /// <returns></returns>
        public bool RemoveReminder(string NoticeID)
        {
            bool output = false;
            try
            {
                var result = db.sp_removereminder(NoticeID);
                if (result > 0)
                {
                    output = true;
                }
            }
            catch (Exception)
            {
            }
            return output;
        }
        /// <summary>
        /// Remove subject type
        /// </summary>
        /// <param name="hiddensubjectid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool RemoveSubjectType(string hiddensubjectid, string firmid, string userid)
        {
            bool output = false;
            try
            {
                var result = db.sp_RemoveNoticeSubject(hiddensubjectid, firmid, userid);
                if (result > 0)
                {
                    output = true;
                }
            }
            catch (Exception)
            {
            }
            return output;
        }
        /// <summary>
        /// Update Date Of Delivery For Notice
        /// </summary>
        /// <param name="dateOfDel"></param>
        /// <param name="ModuleType"></param>
        /// <param name="noticeId"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public Message updateDateOfDeliveryForNotice(string dateOfDel, string ModuleType, string noticeId, string firmid, string userid)
        {
            var output = new Message();
            try
            {
                var result = db.sp_saveDateOfDelivery(noticeId, Convert.ToDateTime(dateOfDel), firmid, userid, ModuleType);
                output.message = "Record saved successfully.";
                output.status = true;
            }
            catch (Exception ex)
            {
                output.message = ex.Message;
                output.status = false;
            }
            return output;
        }
        /// <summary>
        /// Save subject type details
        /// </summary>
        /// <param name="SubjectName"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool SaveSubjectType(string SubjectName, string firmid, string userid, string id)
        {
            bool output = false;
            try
            {
                var result = db.sp_SaveNoticeSubject(SubjectName, userid, firmid);
                if (result > 0)
                {
                    output = true;
                }
            }
            catch (Exception)
            {
            }
            return output;
        }
        /// <summary>
        /// Get reminder notice
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public dynamic GetReminderNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                 string RoleId, string firmid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetReminderNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, firmid
                                          ).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get filter notice list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="param"></param>
        /// <param name="paramid"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeStatus"></param>
        /// <param name="sendernamesrch"></param>
        /// <param name="srchnoticesubject"></param>
        /// <param name="srhnoticetitle"></param>
        /// <param name="noticetypesrch"></param>
        /// <returns></returns>
        public dynamic GetNoticeListFilter(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                  string RoleId, string param, string paramid, string firmid, string NoticeStatus, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetNoticeFilterByNoticeBy(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                                          Convert.ToInt16(RoleId), param, paramid, firmid, NoticeStatus, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get archive notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="notistatus"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public dynamic GetArchiveNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
            string RoleId, string notistatus, string firmid)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetArchiveNotice(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, Convert.ToInt16(RoleId), notistatus, firmid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get draft notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="notistatus"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeId"></param>
        /// <param name="sendernamesrch"></param>
        /// <param name="srchnoticesubject"></param>
        /// <param name="srhnoticetitle"></param>
        /// <param name="noticetypesrch"></param>
        /// <returns></returns>
        public dynamic GetDraftNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                       string RoleId, string notistatus, string firmid, string NoticeId, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetNoticeForUser(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, notistatus, firmid, NoticeId, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get assign notice details
        /// </summary>
        /// <param name="senderid"></param>
        /// <param name="receiverid"></param>
        /// <param name="firmid"></param>
        /// <param name="approvarType"></param>
        /// <param name="noticeid"></param>
        /// <param name="multipleNoticeArray"></param>
        /// <returns></returns>
        public bool NoticeAssign(string senderid, string receiverid, string firmid, string approvarType, string noticeid, string multipleNoticeArray)
        {
            string fromEmail = WebConfigurationManager.AppSettings["Fromemail"].ToString();
            if (multipleNoticeArray == "undefined" || multipleNoticeArray == "" || multipleNoticeArray == null)
            {
                bool result = false;
                try
                {
                    var output2 = db.usp_AddNoticeApproval(noticeid, firmid, senderid, receiverid, Convert.ToByte(approvarType));
                    //Add per as new Requiremnt
                    var receivername = db.sp_GetEmailById(receiverid, firmid, receiverid).FirstOrDefault();
                    var sendername = db.sp_GetEmailById(receiverid, firmid, senderid).FirstOrDefault();
                    var noticeDetail = db.usp_GetNoticeByID(noticeid, firmid).FirstOrDefault();
                    string dateOfNotice = "";
                    string dueDateONotice = "";
                    if (noticeDetail.DateofNotice == null || Convert.ToDateTime(noticeDetail.DateofNotice).ToString("dd/MM/yyyy") == Convert.ToDateTime("01-01-1900 00:00:00").ToString("dd/MM/yyyy"))
                    {
                        dateOfNotice = "";
                    }
                    else
                    {
                        dateOfNotice = Convert.ToDateTime(noticeDetail.DateofNotice).ToString("dd/MM/yyyy");
                    }
                    if (noticeDetail.DueDateOfNotice == null || Convert.ToDateTime(noticeDetail.DueDateOfNotice).ToString("dd/MM/yyyy") == Convert.ToDateTime("01-01-1900 00:00:00").ToString("dd/MM/yyyy"))
                    {
                        dueDateONotice = "";
                    }
                    else
                    {
                        dueDateONotice = Convert.ToDateTime(noticeDetail.DueDateOfNotice).ToString("dd/MM/yyyy");
                    }
                    if (output2 == 2)
                    {
                        result = true;
                        db.sp_SaveNotification(noticeid, "Notice Shared for approval", firmid, "", "You have a notice for feedback from " + sendername.UserName + "," +
                                          "kindly review and change the status accordingly.", null, "", "", receiverid);
                        try
                        {
                            var toemail = db.sp_GetEmailById(receiverid, firmid, receiverid).FirstOrDefault();
                            if (!string.IsNullOrEmpty(toemail.EmailId))
                            {
                                string registrationMailBody = WebConfigurationManager.AppSettings["registrationEmailTemplate"].ToString();
                                string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                                string body = "<div>" + "<p>Dear " + receivername.UserName + ",</p>" +
                                            "<p>Following Notice is shared by " + sendername.UserName + " -<br/>" +
                                            "Sender's Name: " + noticeDetail.SharedSendersName + " <br/>" +
                                            "Receiver's Name: " + noticeDetail.SharedReceiverName + " <br/>" +
                                            "Date of Notice: " + dateOfNotice + " <br/>" +
                                            "Notice Title:" + noticeDetail.NoticeTitle + " <br/>" +
                                            "Notice Subject:" + noticeDetail.NoticeSharedSubject + " <br/>" +
                                            "Notice Due Date:" + dueDateONotice + " <br/>" +
                                            "Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">myKase</a> account and share your feedback (if any).</p>" +
                                            "</div>";
                                registrationMailBody = registrationMailBody.Replace("#CONTENT#", body);
                                CommomUtility sendmail = new CommomUtility();
                                sendmail.SendEmail(fromEmail, toemail.EmailId, "", noticeDetail.MailSubject, registrationMailBody);
                            }
                        }
                        catch { }
                    }
                    else
                    {
                        result = false;
                    }
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                {
                    result = false;
                }
                return result;
            }
            else
            {
                bool result = false;
                var multiplenoticearray = multipleNoticeArray.Split(',');
                try
                {
                    foreach (var noticeid1 in multiplenoticearray)
                    {
                        var output2 = db.usp_AddNoticeApproval(noticeid1, firmid, senderid, receiverid, Convert.ToByte(approvarType));
                        var receivername = db.sp_GetEmailById(receiverid, firmid, receiverid).FirstOrDefault();
                        var sendername = db.sp_GetEmailById(receiverid, firmid, senderid).FirstOrDefault();
                        var noticeDetail = db.usp_GetNoticeByID(noticeid1, firmid).FirstOrDefault();
                        if (output2 > 0)
                        {
                            result = true;
                            db.sp_SaveNotification(noticeid1, "Notice Shared for approval In Bulk Notice", firmid, "", "You have a notice for feedback from " + sendername.UserName + "," +
                                          "kindly review and change the status accordingly.", null, "", "", receiverid);
                            try
                            {
                                // var firmidd = HttpContext.Current.Session["loginfirmid"].ToString();
                                var toemail = db.sp_GetEmailById(receiverid, firmid, receiverid).FirstOrDefault();
                                if (!string.IsNullOrEmpty(toemail.EmailId))
                                {
                                    string registrationMailBody = WebConfigurationManager.AppSettings["registrationEmailTemplate"].ToString();
                                    string body = "<div>" + "<p>Dear " + receivername.UserName + ",</p><br/>" +
                                               "<p>You have a notice for feedback in bulk notice," +
                                               "Please login to <a target=\"_blank\" href=\"https://mykase.in\">myKase</a> to review and change the status accordingly.</p>" +
                                               "</div>";
                                    registrationMailBody = registrationMailBody.Replace("#CONTENT#", body);
                                    CommomUtility sendmail = new CommomUtility();
                                    sendmail.SendEmail(fromEmail, toemail.EmailId, "", "Notice Approval", registrationMailBody);
                                }
                            }
                            catch { }
                        }
                    }
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                {
                    result = false;
                }
                return result;
            }
        }
        /// <summary>
        /// Save notice feedback details
        /// </summary>
        /// <param name="noticeId"></param>
        /// <param name="feedback"></param>
        /// <param name="status"></param>
        /// <param name="UserId"></param>
        /// <param name="RoleId"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public bool SaveNoticeFeedback(string noticeId, string feedback, string status, string UserId, string RoleId, string firmid)
        {
            bool result = false;
            try
            {
                string fromEmail = WebConfigurationManager.AppSettings["Fromemail"].ToString();
                var output1 = db.sp_savenoticefeedback(noticeId, feedback, status, UserId, Convert.ToInt16(RoleId));
                //Guid noticeguids = new Guid(noticeId);
                var noticeDetail = db.usp_GetNoticeByID(noticeId, firmid).FirstOrDefault();
                var receivername = db.sp_GetEmailById(noticeDetail.SentToManagerId, firmid, noticeDetail.SentToManagerId).FirstOrDefault();
                var managerId = string.Empty;
                if (noticeDetail.SentToManagerId == null || noticeDetail.SentToManagerId == "")
                {
                    managerId = noticeDetail.SentToClientId;
                }
                else
                {
                    managerId = noticeDetail.SentToManagerId;
                }
                var sendernames = db.sp_GetEmailById(managerId, firmid, UserId).FirstOrDefault();
                var sharedSenderName = "";
                //
                if (sendernames.UserName != null)
                {
                    sharedSenderName = sendernames.UserName;
                }
                if (output1 > 0)
                {
                    var firmids = HttpContext.Current.Session["sessionfirmid"];
                    var fromemail = db.sp_GetEmailById(UserId, firmids.ToString(), UserId).FirstOrDefault();
                    fromemail.EmailId = fromEmail;
                    Guid noticeguid = new Guid(noticeId);
                    var toemailuserid = db.TblNotices.Where(x => x.NoticeId == noticeguid).Select(x => x.UserId).FirstOrDefault();
                    var toemail = db.sp_GetEmailById(toemailuserid, firmids.ToString(), toemailuserid).FirstOrDefault();
                    if (!string.IsNullOrEmpty(toemail.EmailId))
                    {
                        string BaseDomainURL = WebConfigurationManager.AppSettings["BaseDomainURL"].ToString();
                        string registrationMailBody = WebConfigurationManager.AppSettings["registrationEmailTemplate"].ToString();
                        var DateOfNoticeDetail = string.Empty;
                        if (noticeDetail.DateofNotice == null)
                        {
                            DateOfNoticeDetail = "";
                        }
                        else
                        {
                            DateOfNoticeDetail = Convert.ToDateTime(noticeDetail.DateofNotice).ToString("dd/MM/yyyy");
                        }
                        var DueDateOfNotice = string.Empty;
                        if (noticeDetail.DueDateOfNotice == null || Convert.ToDateTime(noticeDetail.DueDateOfNotice).ToString("dd/MM/yyyy") == Convert.ToDateTime("01-01-1900 00:00:00").ToString("dd/MM/yyyy"))
                        {
                            DueDateOfNotice = "";
                        }
                        else
                        {
                            DueDateOfNotice = Convert.ToDateTime(noticeDetail.DueDateOfNotice).ToString("dd/MM/yyyy");
                        }
                        string body = "<div>" + "<p>Dear " + noticeDetail.CreatedByName + ",</p>" +
                                            "<p>" + sharedSenderName + " has shared feedback on the following Notice-<br/>" +
                                            "Sender's Name: " + noticeDetail.SharedSendersName + " <br/>" +
                                            "Receiver's Name: " + noticeDetail.SharedReceiverName + " <br/>" +
                                            "Date of Notice: " + DateOfNoticeDetail
                                            + " <br/>" +
                                            "Notice Title: " + noticeDetail.NoticeTitle + " <br/>" +
                                            "Notice Subject: " + noticeDetail.NoticeSharedSubject + " <br/>" +
                                            "Notice Due Date: " + DueDateOfNotice
                                            + " <br/>" +
                                            "Feedback: " + feedback + " <br/>" +
                                            "Please login to <a target=\"_blank\" href=\"" + BaseDomainURL + "\">myKase</a> to review and change the status accordingly.</p>" +
                                            "</div>";

                        registrationMailBody = registrationMailBody.Replace("#CONTENT#", body);
                        CommomUtility sendmail = new CommomUtility();
                        sendmail.SendEmail(fromemail.EmailId, toemail.EmailId, "", noticeDetail.FeedbackMailSubject, registrationMailBody);
                    }
                    {
                        db.sp_SaveNotification(noticeId, "", "", "", status, null, UserId, "", UserId);
                    }
                    result = true;
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                result = false;
            }
            return result;
        }
        /// <summary>
        /// Save final notice status detail
        /// </summary>
        /// <param name="postedFiledata"></param>
        /// <param name="dateofddel"></param>
        /// <param name="txtdateofreceipt"></param>
        /// <param name="currentstatus"></param>
        /// <param name="LoginUserId"></param>
        /// <param name="NoticeId"></param>
        /// <param name="FirmIdd"></param>
        /// <returns></returns>
        public bool SaveFinalStatus(string postedFiledata, string dateofddel, string txtdateofreceipt, string currentstatus, string LoginUserId, string NoticeId, string FirmIdd)
        {
            bool result = false;
            try
            {
                var output1 = db.sp_UpdateFinalStatus(Convert.ToDateTime(dateofddel), Convert.ToDateTime(txtdateofreceipt), currentstatus, NoticeId, LoginUserId);
                if (output1 > 0)
                {
                    result = true;
                }
                string[] values1 = postedFiledata.Split('/');
                for (int j = 0; j < values1.Length; j++)
                {
                    values1[j] = values1[j].Trim();
                    var chkout = db.Usp_SaveMultipleFileMap(FirmIdd.ToString(), LoginUserId.ToString(), NoticeId.ToString(), values1[j], "NewNoticeDocument", null);
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                result = false;
            }
            return result;
        }
        /// <summary>
        /// Save reply notice
        /// </summary>
        /// <param name="notice"></param>
        /// <param name="IsFileAvail"></param>
        /// <returns></returns>
        public Message saveincomingnotice(ReceivedReply notice, bool IsFileAvail)
        {
            var output = new Message();
            try
            {
                string id = "";
                ObjectParameter ReturnVal;
                ReturnVal = new ObjectParameter("resultid", id);
                if (notice.setdateofreply == "")
                {
                    notice.setdateofreply = "1900-01-01";
                }
                var result = db.sp_SaveIncomingReply(notice.NoticeId, notice.ReceivedDate, notice.ReceivedThrogh, notice.CreatedBy,
                   notice.FirmId, ReturnVal, notice.Id, Convert.ToDateTime(notice.setdateofreply), notice.DateOfReply, notice.ModeofService, IsFileAvail);
                id = Convert.ToString(ReturnVal.Value);
                if (String.IsNullOrEmpty(notice.Id))
                {
                    output.output = id.ToString();
                }
                else
                {
                    output.output = notice.Id;
                }
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Get reply notice details
        /// </summary>
        /// <param name="noticeid"></param>
        /// <param name="incomingreplyid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public List<sp_getIncomingReply_Result> GetIncominReply(string noticeid, string incomingreplyid, string firmid)
        {
            List<sp_getIncomingReply_Result> result = null;
            try
            {
                result = db.sp_getIncomingReply(noticeid, incomingreplyid, firmid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Delete reply notice by notice id
        /// </summary>
        /// <param name="IncomingNoticeID"></param>
        /// <returns></returns>
        public bool IncomingNoticeDelete(string IncomingNoticeID)
        {
            bool result = false;
            try
            {
                var output = db.sp_DeleteIncomingNotice(IncomingNoticeID);
                if (output > 0)
                {
                    result = true;
                }
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Remove field by id
        /// </summary>
        /// <param name="fid"></param>
        /// <returns></returns>
        public bool RemoveFileById(string fid)
        {
            bool result = false;
            try
            {
                var output = db.sp_RemoveFile(fid);
                if (output > 0)
                {
                    result = true;
                }
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get archive notice details
        /// </summary>
        /// <param name="ArchiveNoticeID"></param>
        /// <param name="IsArchive"></param>
        /// <returns></returns>
        public bool ArchiveNotice(string ArchiveNoticeID, string IsArchive)
        {
            bool result = false;
            try
            {
                var output = db.sp_Movetoarchive(ArchiveNoticeID, Convert.ToBoolean(IsArchive));
                if (output > 0)
                {
                    result = true;
                }
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Apply digital signature
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="signtype"></param>
        /// <param name="UserId"></param>
        /// <param name="DocNumber"></param>
        /// <param name="DocName"></param>
        /// <param name="username"></param>
        /// <param name="pageselect"></param>
        /// <param name="signatory"></param>
        /// <param name="signfor"></param>
        /// <param name="loginuserid"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public dynamic ApplyDigitalSign(string filename, string signtype, string UserId, string DocNumber, string DocName,
            string username, string pageselect, string signatory, string signfor, string loginuserid, string firmid)
        {
            dynamic output = null;
            try
            {
                Random ra = new Random();
                var ranew = ra.Next(1, 1000);
                var refnum = "REFDB" + ranew;
                var pdffile = "";
#pragma warning disable CS0219 // The variable 'position' is assigned but its value is never used
                var position = "";
#pragma warning restore CS0219 // The variable 'position' is assigned but its value is never used
                if (signfor == "Prepared")
                {
                    position = "Bottom-Left";
                }
                else if (signfor == "Approval")
                {
                    position = "Bottom-Center";
                }
                else if (signfor == "Authrization")
                {
                    position = "Bottom-Right";
                }
                try
                {
                    pdffile = System.Web.Hosting.HostingEnvironment.MapPath("~\\Documents\\DocManagement\\" + firmid + "\\" + loginuserid + "\\" + filename);
                    if (!File.Exists(pdffile))
                    {
                        pdffile = System.Web.Hosting.HostingEnvironment.MapPath("~\\Documents\\DocManagement\\" + firmid + "\\" + loginuserid + "\\" + filename);
                    }
                }
                catch
                {
                    //pdffile = System.Web.Hosting.HostingEnvironment.MapPath("~\\PurchaseOrderPdf\\" + filename + ".pdf");
                }
                Byte[] bytes1 = File.ReadAllBytes(pdffile);
                String files = Convert.ToBase64String(bytes1);
                var sessionkey = DigitalSignature.GetNewSessionKey();
                DigitalSignatureModal digisign = new DigitalSignatureModal();
                digisign.AuthToken = WebConfigurationManager.AppSettings["DigiSignAuthtoke"].ToString();
                digisign.CUrl = WebConfigurationManager.AppSettings["Cancelurl"].ToString();
                digisign.CustomizeCoordinates = null;
                digisign.EnableDrawSignature = true;
                digisign.EnableeSignaturePad = true;
                digisign.Enablefontsignature = true;
                digisign.Enableuploadsignature = true;
                digisign.EnableViewDocumentLink = true;
                digisign.File = files;
                digisign.FileType = "PDF";
                digisign.FUrl = WebConfigurationManager.AppSettings["Errorurl"].ToString();
                digisign.IsCompressed = false;
                digisign.IsCosign = true;
                digisign.IsGSTN = true;
                digisign.IsGSTN3B = false;
                digisign.Name = signatory;
                digisign.PagelevelCoordinates = null;
                digisign.PageNumber = 0;
                digisign.PreviewRequired = true;
                digisign.ReferenceNumber = refnum;
                digisign.SelectPage = "First";
                digisign.SignaturePosition = "Top-Left";
                digisign.IsCustomized = true;
                digisign.IsCosign = true;
                digisign.SignatureType = signtype;
                digisign.Storetodb = true;
                digisign.SUrl = WebConfigurationManager.AppSettings["Successurl"].ToString() + Convert.ToBase64String(sessionkey) + "&userid=" + UserId + "&docname=" + DocName + "&docnum=" + DocNumber + "&signtype=" + signtype + "";
                string jsonresult = JsonConvert.SerializeObject(digisign);
                var hasdata = DigitalSignature.Generatehash256(jsonresult);
                var bytes = Encoding.UTF8.GetBytes(jsonresult);
                var step2 = DigitalSignature.EncryptDataAES(bytes, sessionkey);
                var step4 = DigitalSignature.EncryptDataAES(hasdata, sessionkey);
                string step5 = DigitalSignature.EncryptWithPublicKey(sessionkey);
                var arlist = new ArrayList();
                arlist.Add(step2);
                arlist.Add(step4);
                arlist.Add(step5);
                return arlist;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Digital sign
        /// </summary>
        /// <param name="step2"></param>
        /// <param name="step4"></param>
        /// <param name="step5"></param>
        /// <returns></returns>
        public static dynamic Digitalsign(dynamic step2, dynamic step4, dynamic step5)
        {
            string url = WebConfigurationManager.AppSettings["DigitalSignUrl"].ToString();
            var addfClient = new WebClient();
            object rawfile = new
            {
                Parameter1 = step5,
                Parameter2 = Convert.ToBase64String(step2),
                Parameter3 = Convert.ToBase64String(step4),
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            dynamic resid = addfClient.UploadString(url, "POST", builders);
            return resid;
        }
        /// <summary>
        /// Get notice subject dropdown list
        /// </summary>
        /// <returns></returns>
        public List<sp_getNoticeSubjectList_Result> Getnoticesubjectforddl()
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            List<sp_getNoticeSubjectList_Result> result = null;
            try
            {
                result = db.sp_getNoticeSubjectList(firmid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get convert to case notice list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="notistatus"></param>
        /// <returns></returns>
        public dynamic ConvertToCaseNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
         string RoleId, string notistatus)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetConvertToCaseNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                Convert.ToInt16(RoleId), notistatus, firmid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Settled notice list details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="notistatus"></param>
        /// <returns></returns>
        public dynamic SettledNoticeList(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
          string RoleId, string notistatus)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetSettledNoticeList(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder,
                Convert.ToInt16(RoleId), notistatus, firmid).ToList();
            return Noticelist;
        }
        /// <summary>
        /// Get received notice list details
        /// </summary>
        /// <returns></returns>
        public List<sp_Getrcvnoticelistforddl_Result> Getrcvnoticelistforddl()
        {
            List<sp_Getrcvnoticelistforddl_Result> result = null;
            var loginuserid = HttpContext.Current.Session["sessionuserid"];
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_Getrcvnoticelistforddl(loginuserid.ToString(), firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice count for dashboard
        /// </summary>
        /// <param name="LoginUserId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public sp_getDashboardNoticeCountforblock_Result GetDashboardNoticeCountforblock(string LoginUserId, string RoleId)
        {
            sp_getDashboardNoticeCountforblock_Result result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_getDashboardNoticeCountforblock(Convert.ToInt16(RoleId), LoginUserId, firmid).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get high light notice date
        /// </summary>
        /// <returns></returns>
        public dynamic GetNotifyhighlighteddate()
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            var loginuserid = HttpContext.Current.Session["sessionuserid"].ToString();
            dynamic result = null;
            try
            {
                result = db.sp_gethighlightednotifydate(firmid, loginuserid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get Notice Sent To Mangerand Client Count
        /// </summary>
        /// <param name="LoginUserId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public dynamic GetNoticeSentToMangerandClientCount(string LoginUserId, string RoleId)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            var result = new ArrayList();
            try
            {
                var senttomanager = db.sp_SentToManager(LoginUserId, Convert.ToInt16(RoleId), firmid).ToList();
                var senttoclient = db.sp_SentToClientCountForGraph(LoginUserId, Convert.ToInt16(RoleId), firmid).ToList();
                result.Add(senttomanager);
                result.Add(senttoclient);
            }
            catch (Exception ex)
            {
                var abc = ex.Message;
            }
            return result;
        }
        /// <summary>
        /// Get notice type count for graph
        /// </summary>
        /// <param name="LoginUserId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public List<sp_GetNoticeTypeCountForGraph_Result> GetNoticeTypeCountForGraph(string LoginUserId, string RoleId)
        {
            List<sp_GetNoticeTypeCountForGraph_Result> result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_GetNoticeTypeCountForGraph(Convert.ToInt16(RoleId), LoginUserId, firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice subject count for graph
        /// </summary>
        /// <param name="LoginUserId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public List<sp_GetNoticeSubjectCountForGraph_Result> GetNoticeSubjectForGraph(string LoginUserId, string RoleId)
        {
            List<sp_GetNoticeSubjectCountForGraph_Result> result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_GetNoticeSubjectCountForGraph(Convert.ToInt16(RoleId), LoginUserId, firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get status count for dashboard graph count
        /// </summary>
        /// <param name="LoginUserId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public List<sp_GetStatusCountForGraph_Result> GetStatusCountForGraph(string LoginUserId, string RoleId)
        {
            List<sp_GetStatusCountForGraph_Result> result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_GetStatusCountForGraph(Convert.ToInt16(RoleId), LoginUserId, firmid).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get notice list by notify date
        /// </summary>
        /// <param name="NotifyDate"></param>
        /// <returns></returns>
        public List<usp_GetNoticeListByNotifyDate_Result> GetNoticeListByNotifyDate(string NotifyDate)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            var userid = HttpContext.Current.Session["sessionuserid"].ToString();
            List<usp_GetNoticeListByNotifyDate_Result> result = null;
            try
            {
                result = db.usp_GetNoticeListByNotifyDate(Convert.ToDateTime(NotifyDate), firmid, userid).ToList();
            }
            catch (Exception ex)
            {
                var kkk = ex.Message;
            }
            return result;
        }
        /// <summary>
        /// Get notice post details
        /// </summary>
        /// <param name="NoticeId"></param>
        /// <param name="paramnoticepostdate"></param>
        /// <param name="consignmentnum"></param>
        /// <param name="paramtrakingId"></param>
        /// <param name="dateofdelivery"></param>
        /// <returns></returns>
        public Message NoticePostDetail(string NoticeId, DateTime? paramnoticepostdate, string consignmentnum, string paramtrakingId, DateTime? dateofdelivery)
        {
            Message result = new Message();
            result.status = false;
            result.message = "";
            try
            {
                var output = db.sp_SaveNoticeSentDetail(NoticeId, paramnoticepostdate, consignmentnum, paramtrakingId, dateofdelivery).FirstOrDefault();
                if (output == 1)
                {
                    result.status = false;
                    result.message = "Tracking Id already exist.";
                }
                else if (output == 2)
                {
                    result.status = true;
                    result.message = "Record saved successfully.";
                }
                else if (output == 3)
                {
                    result.status = false;
                    result.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                result.status = false;
                result.message = "Something went wrong.";
            }
            return result;
        }
        /// <summary>
        /// Delete notice dispatch details
        /// </summary>
        /// <param name="NoticeId"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public Message DeleteDispatchDetail(string NoticeId, string FirmId)
        {
            Message result = new Message();
            result.status = false;
            result.message = "";
            try
            {
                var output = db.usp_DeleteDispatchDetails(NoticeId, FirmId).FirstOrDefault();
                if (output == 1)
                {
                    result.status = true;
                    result.message = "Record deleted successfully.";
                }
            }
            catch
            {
                result.status = false;
                result.message = "Something went wrong.";
            }
            return result;
        }
        /// <summary>
        /// View notice post details
        /// </summary>
        /// <param name="paramtrakingId"></param>
        /// <returns></returns>
        public dynamic ViewNoticePostDetail(string paramtrakingId)
        {
            dynamic result = null;
            try
            {
                result = db.sp_GetTrackingDetailById(paramtrakingId).FirstOrDefault();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Delete notice status
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Message deleteNoticeStatus(string id)
        {
            var output = new Message();
            output.status = false;
            output.message = "";
            try
            {
                var result = db.sp_RemoveCustomNoticeStatus(id);
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record removed successfully.";
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
            catch (Exception ex)
            {
                output.status = false;
                output.message = ex.Message;
            }
            return output;
        }
        /// <summary>
        /// Get sender detail by sender id
        /// </summary>
        /// <param name="senderId"></param>
        /// <returns></returns>
        public sp_GetSenderDetailsBySenderId_Result GetSenderDetailBySenderId(string senderId)
        {
            sp_GetSenderDetailsBySenderId_Result result = null;
            try
            {
                result = db.sp_GetSenderDetailsBySenderId(senderId).FirstOrDefault();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get received notice detail by notice id
        /// </summary>
        /// <param name="noticeID"></param>
        /// <returns></returns>
        public List<usp_GetNoticeReceiverDetailsById_Result> GetNoticeReceiverDetailListByID(string noticeID)
        {
            List<usp_GetNoticeReceiverDetailsById_Result> result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.usp_GetNoticeReceiverDetailsById(noticeID, firmid).ToList();
                return result;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                return null;
            }
        }
        /// <summary>
        /// Save notce status detail
        /// </summary>
        /// <param name="subjectname"></param>
        /// <returns></returns>
        public Message savenoticestatus(string subjectname)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            var createdby = HttpContext.Current.Session["sessionuserid"].ToString();
            var output = new Message();
            output.status = false;
            output.message = "";
            try
            {
                var result = db.sp_SaveCustomNoticeStatus(subjectname, createdby, firmid);
                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
            catch (Exception ex)
            {
                output.status = false;
                output.message = ex.Message;
            }
            return output;
        }
        /// <summary>
        /// Save notice details
        /// </summary>
        /// <param name="notice"></param>
        /// <param name="Noticeids"></param>
        /// <param name="moduletype"></param>
        /// <returns></returns>
        public Message SavenoticeDetils(Notice notice, string Noticeids, string moduletype)
        {
            var output = new Message();
            try
            {
                if (Noticeids != "")
                {
                    var result = db.Usp_AddNoticesDetilsForClient(Noticeids, notice.NoticeID, notice.FirmId, notice.UserId, notice.NoticeThroughId, notice.NoticeThrough, moduletype);
                    if (result > 0)
                    {
                        output.status = true;
                        output.message = "Record saved successfully.";
                    }
                    else
                    {
                        output.status = false;
                        output.message = "Something went wrong.";
                    }
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Save mode of delivery for notice
        /// </summary>
        /// <param name="notice"></param>
        /// <param name="Noticeids"></param>
        /// <param name="moduletype"></param>
        /// <param name="dateofdispatch"></param>
        /// <param name="noticepostdate"></param>
        /// <returns></returns>
        public Message SavenoticeDetilsForModeOfDelevery(Notice notice, string Noticeids, string moduletype, DateTime? dateofdispatch, DateTime? noticepostdate)
        {
            var output = new Message();
            if (notice.FirmId == null)
            {
                var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
                notice.FirmId = firmid;
            }
            if (notice.UserId == null)
            {
                var createdby = HttpContext.Current.Session["sessionuserid"].ToString();
                notice.UserId = createdby;
            }
            try
            {
                if (Noticeids != "")
                {
                    var result = db.Usp_AddNoticesDetilsForModeofService(Noticeids, notice.NoticeID, notice.FirmId, notice.UserId, notice.ModeofServiceorDelivery, moduletype, dateofdispatch, noticepostdate);
                    if (result > 0)
                    {
                        output.status = true;
                        output.message = "Record saved successfully.";
                    }
                    else
                    {
                        output.status = false;
                        output.message = "Something went wrong.";
                    }
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Save receiver other details
        /// </summary>
        /// <param name="NoticeId"></param>
        /// <param name="LoginNoticeId"></param>
        /// <param name="ReceiverEmails"></param>
        /// <param name="ReceiverPhone"></param>
        /// <param name="SecondAddress"></param>
        /// <returns></returns>
        public Message SaveOtherDetailsOfReceiver(string NoticeId, string LoginNoticeId, string ReceiverEmails, string ReceiverPhone, string SecondAddress)
        {
            var output = new Message();
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            var createdby = HttpContext.Current.Session["sessionuserid"].ToString();
            try
            {
                if (NoticeId != "")
                {
                    var result = db.Usp_AddOtherDetailsOfReceiver(NoticeId, LoginNoticeId, firmid, ReceiverEmails, ReceiverPhone, SecondAddress, createdby);
                    if (result > 0)
                    {
                        output.status = true;
                        output.message = "Record saved successfully.";
                    }
                    else
                    {
                        output.status = false;
                        output.message = "Something went wrong.";
                    }
                }
                else
                {
                    output.status = false;
                    output.message = "Something went wrong.";
                }
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return output;
        }
        /// <summary>
        /// Get receiver detail by notice id
        /// </summary>
        /// <param name="noticeid"></param>
        /// <returns></returns>
        public List<sp_GetReceiverEmailsByNoticeId_Result> GetReceiverEmailsByNoticeId(string noticeid)
        {
            List<sp_GetReceiverEmailsByNoticeId_Result> result = null;
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            try
            {
                result = db.sp_GetReceiverEmailsByNoticeId(noticeid, firmid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// Get delete notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="NoticeStatus"></param>
        /// <param name="fromreminder"></param>
        /// <param name="noticeid"></param>
        /// <param name="sendernamesrch"></param>
        /// <param name="srchnoticesubject"></param>
        /// <param name="srhnoticetitle"></param>
        /// <param name="noticetypesrch"></param>
        /// <returns></returns>
        public dynamic GetDeleteNotice(string UserId, int PageNumber, int PageSize, string RoleId, string NoticeStatus, string fromreminder, string noticeid, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch)
        {
            var firmid = HttpContext.Current.Session["sessionfirmid"].ToString();
            dynamic Noticelist = null;
            try
            {
                Noticelist = db.usp_GetDeleteNotice(UserId, PageNumber, PageSize, Convert.ToInt16(RoleId), NoticeStatus, firmid, Convert.ToBoolean(fromreminder), noticeid, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch).ToList();
            }
            catch (Exception ex)
            {
                var exs = ex.Message;
            }
            return Noticelist;
        }
        /// <summary>
        /// Permanently delete notice
        /// </summary>
        /// <param name="NoticeID"></param>
        /// <returns></returns>
        public bool FinalDeleteNotice(string NoticeID)
        {
            try
            {
                var i = db.usp_FinalDeleteNotice(Guid.Parse(NoticeID));
                if (i >= 1)
                    return true;
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// Get audit mail details
        /// </summary>
        /// <param name="noticeid"></param>
        /// <returns></returns>
        public List<sp_Getmailaudit_Result> Getmailaudit(string noticeid)
        {
            List<sp_Getmailaudit_Result> result = null;
            try
            {
                result = db.sp_Getmailaudit(noticeid).ToList();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// View mode of delivery by notice id
        /// </summary>
        /// <param name="Noticeids"></param>
        /// <returns></returns>
        public dynamic ViewDeleiveryModeByNoticeId(string Noticeids)
        {
            dynamic result = null;
            try
            {
                result = db.usp_GetModeofDeliveryByNoticeId(Noticeids).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get document detail by notice id
        /// </summary>
        /// <param name="NoticeId"></param>
        /// <returns></returns>
        public sp_GetDocumentDetailsByNoticeId_Result GetDocumentDetailByNoticeId(string NoticeId)
        {
            sp_GetDocumentDetailsByNoticeId_Result result = null;
            try
            {
                result = db.sp_GetDocumentDetailsByNoticeId(NoticeId).FirstOrDefault();
            }
            catch
            {
            }
            return result;
        }
        /// <summary>
        /// View post detail by notice id
        /// </summary>
        /// <param name="Noticeids"></param>
        /// <returns></returns>
        public dynamic ViewPostDetilsByNoticeId(string Noticeids)
        {
            dynamic result = null;
            try
            {
                result = db.usp_GetPstdetailsByNoticeId(Noticeids).ToList();
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
            }
            return result;
        }
        /// <summary>
        /// Get received draft notice details
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="RoleId"></param>
        /// <param name="notistatus"></param>
        /// <param name="firmid"></param>
        /// <param name="NoticeId"></param>
        /// <param name="sendernamesrch"></param>
        /// <param name="srchnoticesubject"></param>
        /// <param name="srhnoticetitle"></param>
        /// <param name="noticetypesrch"></param>
        /// <returns></returns>
        public dynamic GetReceivedDraftNotice(string UserId, string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize,
                                      string RoleId, string notistatus, string firmid, string NoticeId, string sendernamesrch, string srchnoticesubject, string srhnoticetitle, string noticetypesrch)
        {
            if (SearchValue == null)
            {
                SearchValue = "";
            }
            dynamic Noticelist = null;
            Noticelist = db.usp_GetReceivedNoticeForUser(UserId, SearchValue, PageNumber, PageSize, ColumName, SortedOrder, notistatus, firmid, NoticeId, sendernamesrch, srchnoticesubject, srhnoticetitle, noticetypesrch).ToList();
            return Noticelist;
        }
    }
}
