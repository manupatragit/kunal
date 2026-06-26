using DataAccess.Modals;
using Newtonsoft.Json;
using IPRManagement.BusinessLayer.BusinessEntity;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using IPRManagement.BusinessLayer.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.IPRModel;
using System.Data;

namespace IPRManagement.BusinessLayer.BusinessRepository
{
    public class IPRRepository : Iipr
    {
        public Message saveipr(string Id, string firmuser, string FirmId, string IP_Type, string Applicant_Type, string Applicant_Name, string Applicant_Address, string Applicant_Country, string Applicant_State,
                  string Applicant_District, string Applicant_EmailId, string Applicant_PhoneNo,
                  string Legal_Status, string Use_of_Mark, string Category_of_Mark, string Mark_of_title, string Image_description, string Isimage, string Conditions, string Class, string Priority, int IsActive, int IsArchive, DateTime date_tine, DateTime vUsedSince, int iptypeid)
        {
            var output = new Message();
            var db = new LawPracticeEntities();
            // var output = new Message();
            try
            {
                string id = "";
                ObjectParameter ReturnVal;
                ReturnVal = new ObjectParameter("resultid", id);

                var result = db.usp_AddIPRCase(Id, firmuser, FirmId, IP_Type, Applicant_Type, Applicant_Name, Applicant_Address, Applicant_Country, Applicant_State,
               Applicant_District, Applicant_EmailId, Applicant_PhoneNo,
               Legal_Status, Use_of_Mark, Category_of_Mark, Mark_of_title, Image_description, Isimage, Conditions, Class, Priority, IsActive, IsArchive, date_tine, vUsedSince, ReturnVal, iptypeid);

                id = Convert.ToString(ReturnVal.Value);

                if (result > 0)
                {
                    output.status = true;
                    output.message = "Record saved successfully.";
                    output.CaseID = id.ToString();
                }
            }
            catch (Exception ex)
            {

            }
            return output;
        }
        public string LoadIPRList(string firmid, string userid, int PageNumber, int PageSize)
        {

            PageNumber = 1;
            PageSize = 10;
            var db = new LawPracticeEntities();

            var list = db.GetIPRCase(Guid.Parse(firmid), Guid.Parse(userid), PageNumber, PageSize).ToList();
            var a = JsonConvert.SerializeObject(list);

            return a;
        }
        //var ds = data.GetAddedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname).ToList();
        //public List<sp_GetAddedIPRTrademark_Result> GetAddedIPRTrademark(string Userid, string firmid, string @class, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname)
        //{
        //    List<sp_GetAddedIPRTrademark_Result> list = new List<sp_GetAddedIPRTrademark_Result>();
        //    try
        //    {
        //        string message = "";
        //        var db = new LawPracticeEntities();
        //        list = db.sp_GetAddedIPRTrademark(Userid, firmid, searchtext, @class, vProprietor, dApplDatefrom, dApplDateto, vstatus, applno, pageNumber, pageSize, vsort, colname).ToList();
        //    }

        //    catch (Exception ex)
        //    {
        //        ex.InnerException.ToString();
        //        ex.Message.ToString();
        //    }

        //    return list;
        //}

        public List<AddedTrademarkResponseModel> GetAddedIPRTrademark(string Userid, string firmid, string className, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname, string dHearingDatefrom, string dHearingDateto)
        {
            List<AddedTrademarkResponseModel> list = new List<AddedTrademarkResponseModel>();
            try
            {
                var detail = DataAccessIPRADO.GetAddedIPRTrademark(Userid, firmid, searchtext, className, vProprietor, dApplDatefrom, dApplDateto, vstatus, applno, pageNumber, pageSize, vsort, colname, dHearingDatefrom, dHearingDateto);
                var result = JsonConvert.SerializeObject(detail);
                list = JsonConvert.DeserializeObject<List<AddedTrademarkResponseModel>>(result);
            }
            catch(Exception ex)
            {
                ex.InnerException.ToString();
                ex.Message.ToString();
            }
            return list;
        }

        public int AddTradeMarkDetails(int? Tradeiid, int? ifid, string vWordMark, string vProprietor, string vApplNo, string vClass, string dApplDate, string vJournalNo, string dJournalDate, string vStatus, string vUsedSince, string dValidUpto, string dGSDescription, string dCrwalDate, string vImgPath, string Agent, string AgentAddress, string UserId, string FirmId)
        {

            var db = new LawPracticeEntities();
            int result = db.sp_AddUserTrademarkData(Tradeiid, ifid, vWordMark, vProprietor, vApplNo, vClass, dApplDate, vJournalNo, dJournalDate, vStatus, vUsedSince, dValidUpto, dGSDescription, dCrwalDate, vImgPath, Agent, AgentAddress, FirmId, UserId);

            return result;
        }

        public int RemoveAddedTradeMarkDetailsById(int iid, string userId, string firmId, string Ip)
        {
            var db = new LawPracticeEntities();
            int result = db.sp_DeleteAddedTrademark(userId, firmId, iid, Ip);

            return result;
        }

        public List<sp_GetIPRList_Result> GetIPRList(string userid, string firmid)
        {
            List<sp_GetIPRList_Result> list = new List<sp_GetIPRList_Result>();
            var db = new LawPracticeEntities();
            list = db.sp_GetIPRList(userid, firmid).ToList();

            return list;
        }

        public List<sp_GetCounterForTrademark_Result> GetCounterForIP(string userid, string firmid, int? IPRList)
        {
            List<sp_GetCounterForTrademark_Result> list = new List<sp_GetCounterForTrademark_Result>();
            var db = new LawPracticeEntities();
            list = db.sp_GetCounterForTrademark(userid, firmid, IPRList).ToList();
            return list;
        }

        public int UpdateCounterForIPR(string keywordValue, string userId, string firmId)
        {
            LawPracticeEntities db = new LawPracticeEntities();
            var updatedValue = db.sp_UpdateIPRCounter(keywordValue, userId, firmId);

            return updatedValue;
        }

        public List<sp_TradeidFromAddedIPR_Result> GetCounterForAddedIPR(string userId, string firmId, int tradeId)
        {
            LawPracticeEntities LPE = new LawPracticeEntities();
            List<sp_TradeidFromAddedIPR_Result> list = new List<sp_TradeidFromAddedIPR_Result>();
            list = LPE.sp_TradeidFromAddedIPR(userId, firmId, tradeId).ToList();

            return list;
        }

        public List<sp_GetIPRCaseList_Result> ViewIPRCaseList(string userId, string firmId, int pagenum, int pagesize, int iptypeid)
        {
            List<sp_GetIPRCaseList_Result> list = new List<sp_GetIPRCaseList_Result>();
            try
            {
                LawPracticeEntities LPE = new LawPracticeEntities();
                list = LPE.sp_GetIPRCaseList(userId, firmId, pagenum, pagesize, iptypeid).ToList();
            }

            catch (Exception ex)
            { }

            return list;
        }

        public string AddUserPatentDetails(int ifid, string vInventionTitle, string vApplNo, string dDateOffiling, string dPriorityDate, string vApplicantName, string statusName, string patentNo, string tradeiid, string userId, string firmId, string dAddedOn, string dPublicationDate)
        {
            //var data = 0;
            //try
            //{
            //    LawPracticeEntities lpe = new LawPracticeEntities();
            //    //data = lpe.sp_AddUserPatentData(ifid, vInventionTitle, vApplNo, dDateOffiling, dPriorityDate, vApplicantName, statusName, patentNo, tradeiid, userId, firmId, dAddedOn, dPublicationDate);
            //    var data1 = DataAccessIPRADO.AddUserPatentData(ifid, vInventionTitle, vApplNo, dDateOffiling, dPriorityDate, vApplicantName, statusName, patentNo, tradeiid, userId, firmId, dAddedOn, dPublicationDate);
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
            //return data;

            DataTable dt = new DataTable();
            try
            {
                LawPracticeEntities lpe = new LawPracticeEntities();
                dt = DataAccessIPRADO.AddUserPatentData(ifid, vInventionTitle, vApplNo, dDateOffiling, dPriorityDate, vApplicantName, statusName, patentNo, tradeiid, userId, firmId, dAddedOn, dPublicationDate);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dt.Rows[0]["Status"].ToString();
        }

        public int AddUserCopyrightDetails(string vApplicantName, string vTitleofWork, string vDiaryNo, string vStatus, string dApplDate, string CategoryId, string vCategoryName, string vROCNumber, string NoofPages, string vUserId, string FirmId, int tradeiid)
        {
            int data = 0;
            try
            {
                LawPracticeEntities lpe = new LawPracticeEntities();
                data = lpe.sp_AddUserCopyrightData(vApplicantName, vTitleofWork, vDiaryNo, vStatus, dApplDate, CategoryId, vCategoryName, vROCNumber, NoofPages, vUserId, FirmId, tradeiid);
            }

            catch (Exception ex)
            {
                string msg = ex.Message;
                var ieMsg = ex.InnerException;
            }

            return data;
        }

        public int AddUserDesignDetails(int ifid, string vDesignno, string vClass, string vApplDetails, string vAddress, string dDateOfRegistration,
            string vPatentOffJournal, string vTitle, string vPriorityNo, string userid, string firmid, int Tradeiid,string status)
        {
            int data = 0;

            var lpe = new LawPracticeEntities();
            if(vApplDetails==null || vApplDetails=="null")
            {
                vApplDetails = "";
            }
            //data = lpe.sp_AddUserDesignData(ifid, vDesignno, vClass, vApplDetails, vAddress, dDateOfRegistration, vTitle, vPriorityNo, vPatentOffJournal, userid, firmid, Tradeiid);
            data = DataAccessIPRADO.sp_AddUserDesignData(ifid, vDesignno, vClass, vApplDetails, vAddress, dDateOfRegistration,
                vPatentOffJournal, vTitle, vPriorityNo, userid, firmid, Tradeiid, status);
            return data;
        }

        //public int AddUserGIDetails(int ifid, )

        public List<sp_GetAddedIPRCopyright_Result> GetAddedCopyrightDetails(string userId, string firmid, int pageNum, int pageSize, string searchtext, string diaryno, string categoryno, string datefrom, string dateto, string vStatus, string applicant, string rocno, int sort, string colname)
        {
            var lpe = new LawPracticeEntities();
            List<sp_GetAddedIPRCopyright_Result> list = new List<sp_GetAddedIPRCopyright_Result>();
            try
            {
                list = lpe.sp_GetAddedIPRCopyright(userId, firmid, searchtext, diaryno, categoryno, datefrom, dateto, vStatus, applicant, rocno, pageNum, pageSize, sort, colname).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return list;
        }

        public List<GetAddedPatentModel> GetAddedPatentDetails(string userId, string firmid, int pageNum, int pageSize, string searchtext, string datefrom, string dateto, string vStatus, string applicantName, string pdatefrom, string pdateto, string iprcounter, int sort, string colname, string patentno, string publicationdatefrom, string publicationdateto, string applicationno)
        {
            try
            {
                var lpe = new LawPracticeEntities();
                //List<sp_GetAddedIPRPatent_Result> list = new List<sp_GetAddedIPRPatent_Result>();
                List<GetAddedPatentModel> list = new List<GetAddedPatentModel>();

                //var list1 = lpe.sp_GetAddedIPRPatent(userId, firmid, searchtext, "", patentno, datefrom, dateto, vStatus, applicantName, pdatefrom, pdateto, "", pageNum, pageSize, sort, colname).ToList();
                var data = DataAccessIPRADO.sp_GetAddedIPRPatent(userId, firmid, searchtext, applicationno, patentno, datefrom, dateto, vStatus, applicantName, pdatefrom, pdateto, "", pageNum, pageSize, sort, colname, publicationdatefrom, publicationdateto);
                if (data.Rows.Count > 0)
                {
                    for (int i = 0; i < data.Rows.Count; i++)
                    {
                        GetAddedPatentModel model = new GetAddedPatentModel();
                        model.TotalRecord = Convert.ToInt32(data.Rows[i]["TotalRecord"]);
                        model.RowId = Convert.ToInt32(data.Rows[i]["RowId"]);
                        model.iid = Convert.ToInt32(data.Rows[i]["iid"]);
                        model.vApplicantName = data.Rows[i]["vApplicantName"].ToString();
                        model.vInventionTitle = data.Rows[i]["vInventionTitle"].ToString();
                        model.StatusName = data.Rows[i]["StatusName"].ToString();
                        model.vApplNo = data.Rows[i]["vApplNo"].ToString();
                        model.dDateOffiling = data.Rows[i]["dDateOffiling"].ToString();
                        model.dPriorityDate = data.Rows[i]["dPriorityDate"].ToString();
                        model.vCompSpecification = data.Rows[i]["vCompSpecification"].ToString();
                        model.dEntryDate = data.Rows[i]["dEntryDate"].ToString();
                        model.Tradeiid = data.Rows[i]["Tradeiid"].ToString();
                        model.vPatentNum = data.Rows[i]["vPatentNum"].ToString();
                        list.Add(model);
                    }
                }
                return list;
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int AddUserGIDetails(string userId, string firmId, int tradeiid, string vapplicationno, string vstatus, string vapplicantname, string ddateoffiling, string vclass, string dregisterdate, string vgoods, string vapplicantaddress, string vginame, string vregisteredprop, string vjournalno, string vgeoarea, string vgeoindication, string vprioritycountry, string davaildate, string vcertificateno, string dcertificatedate, string ddateoffilingto, string ddateoffilingfrom)
        {
            int data = 0;
            try
            {
                var lpe = new LawPracticeEntities();

                data = lpe.sp_AddUserGIData(userId, firmId, tradeiid, vapplicationno, vstatus, vapplicantname, ddateoffiling, vclass, dregisterdate, vgoods, vapplicantaddress, vginame, vregisteredprop, vjournalno, vgeoarea, vgeoindication, vprioritycountry, davaildate, vcertificateno, dcertificatedate, ddateoffilingto, ddateoffilingfrom);
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
                string ie = ex.InnerException.ToString();
            }

            return data;
        }

        public List<sp_GetQuota_Result> GetQuota(string userId, string firmId)
        {
            var lpe = new LawPracticeEntities();
            try
            {
                List<sp_GetQuota_Result> list = new List<sp_GetQuota_Result>();
                list = lpe.sp_GetQuota(userId, firmId).ToList();

                return list;
            }
            catch (Exception ex)
            {
                throw ex;

            }


        }

        //public List<sp_GetAddedIPRGI_Result> GetAddedGIDetails(string userId, string searchtext, string applicationno, string vstatus, string applicantname, string vclass, string journalno, string datefrom, string dateto, string validupto, int pagenum, int pagesize, int sort, string colname)
        //{
        //    try
        //    {
        //        var lpe = new LawPracticeEntities();
        //        List<sp_GetAddedIPRGI_Result> list = new List<sp_GetAddedIPRGI_Result>();

        //        list = lpe.sp_GetAddedIPRGI(userId, searchtext, applicationno, vstatus, applicantname, vclass, journalno, "", "", validupto, pagenum, pagesize, sort, colname).ToList();

        //        return list;
        //    }

        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}


        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmid"></param>
        /// <param name="searchtext"></param>
        /// <param name="applicationno"></param>
        /// <param name="vstatus"></param>
        /// <param name="etc"></param>
        /// <returns></returns>
        public List<AddedGIResponseModel> GetAddedGIDetails(string userId, string firmid, string searchtext, string applicationno, string vstatus,
        string applicantname, string vclass, string journalno, string datefrom, string dateto, string validupto, int pagenum,
        int pagesize, int sort, string colname)
        {
            try
            {
                var lpe = new LawPracticeEntities();
                //List<sp_GetAddedIPRGI_Result> list = new List<sp_GetAddedIPRGI_Result>();
                //sp_GetAddedIPRGI_Result model = new sp_GetAddedIPRGI_Result();
                //list = lpe.sp_GetAddedIPRGI(userId, searchtext, applicationno, vstatus, applicantname, vclass, journalno, "", "", validupto, pagenum, pagesize, sort, colname).ToList();
                List<AddedGIResponseModel> lstModel = new List<AddedGIResponseModel>();
                AddedGIResponseModel model = new AddedGIResponseModel();
                var giDetail = DataAccessIPRADO.BindAddedIPRGI(userId, firmid, searchtext, applicationno, vstatus, applicantname, vclass, journalno, datefrom,
                    dateto, validupto, pagenum, pagesize, sort, colname);
                var result = JsonConvert.SerializeObject(giDetail);
                lstModel = JsonConvert.DeserializeObject<List<AddedGIResponseModel>>(result);
                return lstModel;
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }


        public int RemoveUserAddedTradeMarkDetails(int iid, string userId, string firmId, string Ip)
        {
            var db = new LawPracticeEntities();
            int result = db.sp_DeleteAddedTrademark(userId, firmId, iid, Ip);

            return result;
        }

        public int RemoveShareTradeMarkDetails(int iid, string userId, string firmId, string Ip)
        {
            var db = new LawPracticeEntities();
            int result = db.usp_RemoveSharedTrademark(userId, firmId, iid, Ip);
            return result;

        }


        // Code added by Sunny 

        //  IPR Copyright My List data

        public Message saveiprCopyright(string Id, string firmId, string UserId, string ApplicantCat_Name, string ApplicantCat_Address, string Title_Work, string Diary_No, string Roc_No, string Category, dynamic date_Value)
        {
            var output = new Message();
            var db = new LawPracticeEntities();
            try
            {

                var result = db.usp_AddIPRCopyright(Id, firmId, UserId, ApplicantCat_Name, ApplicantCat_Address, Title_Work, Diary_No, Roc_No, Category, date_Value);

            }
            catch (Exception ex)
            {

            }
            return output;
        }


        //  IPR Patent My List data

        public Message saveiprPatent(string Id, string firmId, string UserId, string ApplicantName, string ApplicationNo, DateTime PublicationDate, DateTime FilingDate, string TitleOfInvention, string InternationalClassification,
            string PriorityDocumentNo, DateTime PriorityDate, string PriorityCountry, string InternationalApplicationNo, DateTime InternationalFilingDate, string InternationalPublicationNo, string PatentAdditionNo, DateTime FilingDatePatentAddition, string DivisionalNo, DateTime FilingDateInventor, string InventorName, string Abstract, string NoOfPages, string NoOfClaims, string PatentOfficeJournal)
        {
            var output = new Message();
            var db = new LawPracticeEntities();
            try
            {

                var result = db.usp_AddPatentIPR(Id, firmId, UserId, ApplicantName, ApplicationNo, PublicationDate, FilingDate, TitleOfInvention, InternationalClassification, PriorityDocumentNo, PriorityDate, PriorityCountry, InternationalApplicationNo, InternationalFilingDate, InternationalPublicationNo, PatentAdditionNo, FilingDatePatentAddition, DivisionalNo, FilingDateInventor, InventorName, Abstract, NoOfPages, NoOfClaims, PatentOfficeJournal);

            }
            catch (Exception ex)
            {

            }
            return output;
        }

        //  IPR GI My List data

        public Message saveiprGI(string Id, string firmId, string UserId, string ApplicantName, string ApplicantAddress, string ApplicationNo, string GIName, DateTime GIDate, string Class,
            string Goods, string Specifications)
        {
            var output = new Message();
            var db = new LawPracticeEntities();
            try
            {

                var result = db.usp_AddGIIPR(Id, firmId, UserId, ApplicantName, ApplicantAddress, ApplicationNo, GIName, GIDate, Class, Goods, Specifications);

            }
            catch (Exception ex)
            {

            }
            return output;
        }

        public List<sp_GetIPRCopyrightCaseList_Result> ViewIPRCopyrightCaseList(string userId, string firmId, int pagenum, int pagesize, int iptypeid)
        {
            List<sp_GetIPRCopyrightCaseList_Result> list = new List<sp_GetIPRCopyrightCaseList_Result>();
            try
            {
                LawPracticeEntities LPE = new LawPracticeEntities();
                list = LPE.sp_GetIPRCopyrightCaseList(firmId, userId, pagenum, pagesize).ToList();
            }

            catch (Exception ex)
            { }

            return list;
        }

        public List<sp_GetIPRPatentCaseList_Result> ViewIPRPatentCaseList(string firmId, string userId, int pagenum, int pagesize, int iptypeid)
        {
            List<sp_GetIPRPatentCaseList_Result> list = new List<sp_GetIPRPatentCaseList_Result>();
            try
            {
                LawPracticeEntities LPE = new LawPracticeEntities();
                list = LPE.sp_GetIPRPatentCaseList(firmId, userId, pagenum, pagesize).ToList();
            }

            catch (Exception ex)
            { }

            return list;
        }


        public List<usp_GetGIIPRList_Result> ViewIPRGICaseList(string firmId, string userId, int pagenum, int pagesize, int iptypeid)
        {
            List<usp_GetGIIPRList_Result> list = new List<usp_GetGIIPRList_Result>();
            try
            {
                LawPracticeEntities LPE = new LawPracticeEntities();
                list = LPE.usp_GetGIIPRList(firmId, userId, pagenum, pagesize).ToList();
            }

            catch (Exception ex)
            { }

            return list;
        }

        //  IPR Design My List data

        public Message saveiprDesign(string Id, string firmId, string UserId, string ApplicantName, string ApplicantAddress, string Title, string DesignNumber, string Class, DateTime dDate,
            string JournalNumber, string PriorityNumber, DateTime PriorityDate, string PriorityCountry)
        {
            var output = new Message();
            var db = new LawPracticeEntities();
            try
            {

                var result = db.usp_AddDesignIPR(Id, firmId, UserId, ApplicantName, ApplicantAddress, Title, DesignNumber, Class, dDate, JournalNumber, PriorityNumber, PriorityDate, PriorityCountry);

            }
            catch (Exception ex)
            {

            }
            return output;
        }

        public List<usp_GetDesignIPRList_Result> ViewIPRDesignCaseList(string firmId, string userId, int pagenum, int pagesize, int iptypeid)
        {
            List<usp_GetDesignIPRList_Result> list = new List<usp_GetDesignIPRList_Result>();
            try
            {
                LawPracticeEntities LPE = new LawPracticeEntities();
                list = LPE.usp_GetDesignIPRList(firmId, userId, pagenum, pagesize).ToList();
            }

            catch (Exception ex)
            { }

            return list;
        }

        /// <summary>
        /// Get Data for Added Designs
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="FirmId"></param>
        /// <param name="searchText"></param>
        /// <param name="DesignNo"></param>
        /// <param name="vClass"></param>
        /// <param name="Appldetails"></param>
        /// <param name="vStatus"></param>
        /// <param name="vTitle"></param>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <param name="vSort"></param>
        /// <param name="vColname"></param>
        /// <returns></returns>
        public List<AddedDesignResponseModel> ViewAddedDesign(string UserId, string FirmId, string searchText, string DesignNo, string vClass, string Appldetails, string vStatus, string vTitle, int pagenum, int pagesize, int vSort, string vColname, string dateofregisterfrom, string dateofregisterto)
        {
            //List<sp_GetAddedIPRDesign_Result> list = new List<sp_GetAddedIPRDesign_Result>();
            List<AddedDesignResponseModel> lstResponse = new List<AddedDesignResponseModel>();
            try
            {
                //LawPracticeEntities lpe = new LawPracticeEntities();
                //list = lpe.sp_GetAddedIPRDesign(UserId, FirmId, searchText, DesignNo, vClass, Appldetails, vStatus, vTitle, pagenum, pagesize, vSort, vColname).ToList();
                var detail = DataAccessIPRADO.GetAddedIPRDesign(UserId, FirmId, searchText, DesignNo, vClass, Appldetails, vStatus, vTitle, pagenum, pagesize, vSort, vColname, dateofregisterfrom, dateofregisterto);
                var result = JsonConvert.SerializeObject(detail);
                lstResponse = JsonConvert.DeserializeObject<List<AddedDesignResponseModel>>(result);
                return lstResponse;
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
                string ie = ex.InnerException.ToString();
            }

            return lstResponse;
        }

        public int RemoveIPRCaseList(string userId, string firmId, string id, int ip)
        {
            var db = new LawPracticeEntities();
            int result = db.sp_DeleteIPRCase(userId, firmId, id, ip);
            return result;
        }

        /// <summary>
        /// Method for fetching seperate User Added IPs and bnind it to the IPRDashboard (ViewUserAddedTrademark Page)
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="FirmId"></param>
        /// <returns></returns>
        public List<sp_GetMylistIndividualIP_Result> GetIPListCount(string UserId, string FirmId)
        {
            List<sp_GetMylistIndividualIP_Result> list = new List<sp_GetMylistIndividualIP_Result>();
            try
            {
                LawPracticeEntities lpe = new LawPracticeEntities();
                list = lpe.sp_GetMylistIndividualIP(UserId, FirmId).ToList();
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
                string ie = ex.InnerException.ToString();
            }
            return list;
        }

        public List<sp_GetRegisteredDashboardDataForAddedIPRs_Result> GetRegistIPRData(string userId, string firmId)
        {
            List<sp_GetRegisteredDashboardDataForAddedIPRs_Result> list = new List<sp_GetRegisteredDashboardDataForAddedIPRs_Result>();
            try
            {
                LawPracticeEntities lpe = new LawPracticeEntities();
                list = lpe.sp_GetRegisteredDashboardDataForAddedIPRs(userId, firmId).ToList();
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
                string ie = ex.InnerException.ToString();
            }

            return list;
        }

        public List<sp_GetPendingDashboardDataForAddedIPRs_Result> GetPendingIPRData(string userId, string firmId)
        {
            List<sp_GetPendingDashboardDataForAddedIPRs_Result> list = new List<sp_GetPendingDashboardDataForAddedIPRs_Result>();
            try
            {
                LawPracticeEntities lpe = new LawPracticeEntities();
                list = lpe.sp_GetPendingDashboardDataForAddedIPRs(userId, firmId).ToList();
            }

            catch (Exception ex)
            {
                string msg = ex.Message.ToString();
                string ie = ex.InnerException.ToString();
            }

            return list;
        }


        public int UploadMultipleEmails(string UserId, string FirmId, DataTable DeserializeEmailObj, int Tradeiid)
        {
            LawPracticeEntities lpe = new LawPracticeEntities();
            int result = 0;
            try
            {
                var resultDetail = DataAccessIPRADO.DeleteTrademarkSavedMail(UserId, FirmId, Tradeiid);
                for (int i = 0; i < DeserializeEmailObj.Rows.Count; i++)
                {
                    var email = DeserializeEmailObj.Rows[i]["emailVal"].ToString();
                    result = lpe.sp_InsertMultipleEmails(UserId, FirmId, email, Tradeiid);
                }
            }
            catch
            {

            }
            //try
            //{
            //    result = lpe.sp_InsertMultipleEmails(UserId, FirmId, email, Tradeiid);
            //}

            //catch (Exception ex)
            //{

            //}

            return result;


        }
        /// <summary>
        /// Save assign user
        /// </summary>
        /// <param name="tradeMarkId"></param>
        /// <param name="applicationNo"></param>
        /// <param name="assignedUser"></param>
        /// <param name="firmId"></param>
        /// <param name="loggedInUserId"></param>
        /// <param name="tradeMarkIP"></param>
        /// <returns></returns>
        public bool SaveAssignUser(string tradeMarkId, string applicationNo, string assignedUser, string firmId, string loggedInUserId, string tradeMarkIP)
        {
            bool result = false;
            try
            {

                var db = new LawPracticeEntities();
                string[] values = assignedUser.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    var checkExist = db.Usp_CheckTradeMarkUserExistOrNot(firmId, applicationNo, values[i]).FirstOrDefault();
                    if (checkExist == 0)
                    {
                        var cnt1 = db.Usp_SaveTrademarkMappedUser(firmId, tradeMarkId, values[i], loggedInUserId, applicationNo, Convert.ToInt32(tradeMarkIP));
                    }
                    else { }
                }
                result = true;
            }
            catch
            {
                result = false;
            }
            return result;
        }


        //public List<usp_GetSharedIPRTrademark_Result> GetSharedIPRTrademark(string Userid, string firmid, string @class, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname)
        //{
        //    List<usp_GetSharedIPRTrademark_Result> list = new List<usp_GetSharedIPRTrademark_Result>();
        //    try
        //    {
        //        var db = new LawPracticeEntities();
        //        list = db.usp_GetSharedIPRTrademark(Userid, firmid, searchtext, @class, vProprietor, dApplDatefrom, dApplDateto, vstatus, applno, pageNumber, pageSize, vsort, colname).ToList();
        //    }

        //    catch (Exception ex)
        //    {
        //        ex.InnerException.ToString();
        //        ex.Message.ToString();
        //    }

        //    return list;
        //}
        public List<GetIPRShareTrademarkResponseModel> GetSharedIPRTrademark(string Userid, string firmid, string @class, string vProprietor, string dApplDatefrom, string dApplDateto, string vstatus, string userdetails, string usedsincefrom, string usedsinceto, string agent, string searchtext, string applno, string type, int? pageNumber, int? pageSize, int vsort, string colname,string dHearingDatefrom,string dHearingDateto)
        {
            List<GetIPRShareTrademarkResponseModel> list = new List<GetIPRShareTrademarkResponseModel>();
            try
            {
                var detail = DataAccessIPRADO.GetSharedIPRTrademark(Userid, firmid, searchtext, @class, vProprietor, dApplDatefrom, dApplDateto, vstatus, applno, pageNumber, pageSize, vsort, colname, dHearingDatefrom, dHearingDateto);
                var result = JsonConvert.SerializeObject(detail);
                list = JsonConvert.DeserializeObject<List<GetIPRShareTrademarkResponseModel>>(result);
            }
            catch (Exception ex)
            {
                ex.InnerException.ToString();
                ex.Message.ToString();
            }
            return list;
        }

        /// <summary>
        /// Get save trademark email
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="firmId"></param>
        /// <param name="tradeId"></param>
        /// <returns></returns>
        public List<GetSavedEmailModel> GetSavedEmail(string userId, string firmId, string tradeId)
        {
            List<GetSavedEmailModel> lstModel = new List<GetSavedEmailModel>();
            try
            {
                // var data = DataAccessIPRADO.DeleteTrademarkSavedMail(userId, firmId, tradeId);

                var result = DataAccessIPRADO.GetTrademarkSavedMail(userId, firmId, tradeId);
                if (result.Rows.Count > 0)
                {
                    for (int i = 0; i <= result.Rows.Count; i++)
                    {
                        GetSavedEmailModel model = new GetSavedEmailModel();
                        model.EmailId = result.Rows[i]["EmailId"].ToString();
                        lstModel.Add(model);
                    }
                }
            }
            catch { }
            return lstModel;
        }
    }
}
