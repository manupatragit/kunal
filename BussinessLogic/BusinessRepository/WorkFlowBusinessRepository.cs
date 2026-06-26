using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using DataAccess.PocoRepositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BussinessLogic.BusinessRepository
{
    public class WorkFlowBusinessRepository : IWorkFlowBusinessRepository
    {

        /// <summary>
        /// Add work flow
        /// </summary>
        /// <param name="details"></param>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public bool AddWorkFlow(WorkFlow details, string firmId)
        {
            var poco = new WorkFlowPocoRepository();
            var s = poco.All().FirstOrDefault(f => f.FirmId.ToString() == firmId.ToString() && f.IsActive && f.WorkFlowName.ToUpper() == details.WorkFlowName);

            if (s == null)
            {
                var d = new FirmWorkflow
                {
                    FirmId = firmId,
                    IsActive = true,
                    IsPublished = details.IsPublished,
                    WorkFlowName = details.WorkFlowName,
                    WorkflowDetails = details.WorkFlowInfo
                };
                poco.Create(d);
                return true;
            }
            throw new ValidationException(details.WorkFlowName + " already Exist!!");
        }

        /// <summary>
        /// Delete work flow
        /// </summary>
        /// <param name="wfId"></param>
        /// <returns></returns>
        public bool DeleteWorkFlow(string wfId)
        {
            var poco = new WorkFlowPocoRepository();
            var s = poco.All().FirstOrDefault(f => f.Id.ToString() == wfId && f.IsActive);
            if (s != null)
            {
                s.IsActive = false;
                poco.Update(s);
                return true;
            }
            throw new ValidationException("Workflow not Exist!!");
        }

        /// <summary>
        /// Get work flow detail
        /// </summary>
        /// <param name="wfId"></param>
        /// <param name="published"></param>
        /// <returns></returns>
        public WorkFlow GetWorkFlowDetail(string wfId, bool published = false)
        {
            var poco = new WorkFlowPocoRepository();
            var s = published ? poco.All().FirstOrDefault(f => f.Id.ToString() == wfId && f.IsActive && f.IsPublished) : poco.All().FirstOrDefault(f => f.Id.ToString() == wfId && f.IsActive);
            if (s != null)
            {
                return new WorkFlow
                {
                    Id = s.Id,
                    IsPublished = s.IsPublished,
                    WorkFlowInfo = s.WorkflowDetails,
                    WorkFlowName = s.WorkFlowName
                };
            }
            throw new ValidationException("Workflow not Exist!!");
        }

        /// <summary>
        /// Update work flow details
        /// </summary>
        /// <param name="details"></param>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public WorkFlow UpdateWorkFlowDetail(WorkFlow details, string firmId)
        {
            var poco = new WorkFlowPocoRepository();
            var s = poco.All().FirstOrDefault(f => f.Id == details.Id && f.IsActive);
            if (s != null)
            {
                if (s.WorkFlowName.ToUpper() != details.WorkFlowName.ToUpper())
                {
                    var x = poco.All().Where(f => f.IsActive && f.FirmId.ToString() == firmId && f.WorkFlowName.ToUpper() == details.WorkFlowName.ToUpper()).ToList();
                    if (x.Count.ToString() != "0")
                    {
                        throw new ValidationException("Workflow name " + details.WorkFlowName + " not Exist!!");
                    }
                    else
                    {
                        s.WorkFlowName = details.WorkFlowName;
                    }
                }
                s.IsPublished = details.IsPublished;
                s.WorkflowDetails = details.WorkFlowInfo;
                poco.Update(s);
                return new WorkFlow
                {
                    Id = s.Id,
                    IsPublished = s.IsPublished,
                    WorkFlowInfo = s.WorkflowDetails,
                    WorkFlowName = s.WorkFlowName
                };
            }
            return null;
        }

        /// <summary>
        /// Get work flow by firm id
        /// </summary>
        /// <param name="firmId"></param>
        /// <returns></returns>
        public List<WorkFlow> GetWorkFlows(string firmId)
        {
            var poco = new WorkFlowPocoRepository();
            var d = new List<WorkFlow>();
            d = poco.All().Where(w => w.FirmId.ToString() == firmId && w.IsActive).Select(s => new WorkFlow
            {
                Id = s.Id,
                IsPublished = s.IsPublished,
                WorkFlowInfo = s.WorkflowDetails,
                WorkFlowName = s.WorkFlowName
            }).ToList();

            return d;
        }

        /// <summary>
        /// Attach workflow 
        /// </summary>
        /// <param name="workFlow"></param>
        /// <returns></returns>
        public long AttachWorkFlow(AttachWorkFlow workFlow)
        {
            var poco = new AttachWorkFlowPocoRepository();
            var result = workFlow.WorkFlowAttachId;

            if (workFlow.WorkFlowAttachId > 0)
            {
                var wf = poco.All().FirstOrDefault(w => w.IsActive && w.Id == workFlow.WorkFlowAttachId && w.WorkFlowId == workFlow.WorkFlowId);
                if (wf != null)
                {
                    using (var context = poco.Context)
                    {
                        using (var transaction = context.Database.BeginTransaction())
                        {
                            try
                            {
                                var items = new AttachWorkFlowItemDetailPocoRepository().All().Where(w => w.WorkFlowAttachItemId == workFlow.WorkFlowAttachId).ToList();
                                foreach (var item in items)
                                {
                                    context.Set<FirmWorkFlowAttachItemDetail>().Remove(item);
                                }
                                context.SaveChanges();

                                foreach (var item in workFlow.Items)
                                {
                                    context.Set<FirmWorkFlowAttachItemDetail>().Add(new FirmWorkFlowAttachItemDetail
                                    {
                                        WorkFlowAttachItemId = workFlow.WorkFlowAttachId,
                                        ObjectId = item.ObjectId,
                                        PreviousObjectIds = item.PreviousObjectIds,
                                        NextObjctIds = item.NextObjctIds,
                                        FormId = item.FormId,
                                        AssignTo = item.AssignTo,
                                        StartDate = item.StartDate,
                                        EndDate = item.EndDate,
                                        ObjectType = item.ObjectType
                                    });
                                }
                                context.SaveChanges();


                                wf.WorkFlowId = workFlow.WorkFlowId;
                                wf.RefId = workFlow.AttachedItemId;
                                wf.ConfType = workFlow.ConfigurationTypeId;
                                wf.IsActive = true;
                                wf.IsPublished = workFlow.IsPublished;

                                poco.Update(wf);
                                transaction.Commit();
                            }
                            catch (Exception)
                            {
                                transaction.Rollback();
                            }
                        }

                    }
                }
            }
            else
            {
                using (var context = poco.Context)
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            var attachitem = context.Set<FirmWorkFlowAttachItem>().Add(new FirmWorkFlowAttachItem
                            {
                                WorkFlowId = workFlow.WorkFlowId,
                                RefId = workFlow.AttachedItemId,
                                ConfType = workFlow.ConfigurationTypeId,
                                IsActive = true,
                                IsPublished = workFlow.IsPublished
                            });
                            context.SaveChanges();

                            foreach (var item in workFlow.Items)
                            {
                                context.Set<FirmWorkFlowAttachItemDetail>().Add(new FirmWorkFlowAttachItemDetail
                                {
                                    WorkFlowAttachItemId = attachitem.Id,
                                    ObjectId = item.ObjectId,
                                    PreviousObjectIds = item.PreviousObjectIds,
                                    NextObjctIds = item.NextObjctIds,
                                    FormId = item.FormId,
                                    AssignTo = item.AssignTo,
                                    StartDate = item.StartDate,
                                    EndDate = item.EndDate,
                                    ObjectType = item.ObjectType
                                });
                            }
                            context.SaveChanges();
                            transaction.Commit();
                            result = attachitem.Id;
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                        }
                    }
                }
            }


            return result;
        }

        /// <summary>
        /// Attach workflow details
        /// </summary>
        /// <param name="workFlowAttachId"></param>
        /// <param name="workflowId"></param>
        /// <returns></returns>
        public AttachWorkFlow AttachWorkFlowDetail(string workFlowAttachId, string workflowId)
        {
            var workFlow = new AttachWorkFlow { Items = new List<AttachWorkFlowItems>() };
            var poco = new AttachWorkFlowPocoRepository();
            var wf = poco.All().FirstOrDefault(w => w.IsActive && w.Id.ToString() == workFlowAttachId && w.WorkFlowId.ToString() == workflowId);
            if (wf != null)
            {
                workFlow.WorkFlowAttachId = wf.Id;
                workFlow.WorkFlowId = wf.WorkFlowId;
                workFlow.AttachedItemId = wf.RefId;
                workFlow.ConfigurationTypeId = wf.ConfType;
                workFlow.IsPublished = wf.IsPublished;
                var items = new AttachWorkFlowItemDetailPocoRepository().All().Where(w => w.WorkFlowAttachItemId == workFlow.WorkFlowAttachId).ToList();
                foreach (var item in items)
                {
                    workFlow.Items.Add(new AttachWorkFlowItems
                    {
                        Id = item.Id,
                        ObjectId = item.ObjectId,
                        PreviousObjectIds = item.PreviousObjectIds,
                        NextObjctIds = item.NextObjctIds,
                        FormId = item.FormId.HasValue ? item.FormId.Value : 0,
                        AssignTo = item.AssignTo,
                        StartDate = item.StartDate,
                        EndDate = item.EndDate,
                        ObjectType = item.ObjectType
                    });
                }
            }
            else
            {
                workFlow = null;
            }

            return workFlow;
        }

        /// <summary>
        /// Attach work flow item list
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        public List<AttachWorkFlowItem> AttachWorkFlowItemList(string workFlowId)
        {
            var poco = new AttachWorkFlowPocoRepository();
            var d = poco.All().Where(w => w.WorkFlowId.ToString() == workFlowId && w.IsActive).ToList().Select(s => new AttachWorkFlowItem
            {
                AttachedItemConfigurationtype = s.ConfType,
                AttachedItemId = s.RefId,
                IsPublished = s.IsPublished,
                Id = s.Id
            }).ToList();
            return d;
        }
    }
}
