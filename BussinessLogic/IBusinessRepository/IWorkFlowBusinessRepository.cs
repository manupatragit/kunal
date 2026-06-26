using BussinessLogic.BusinessEntity;
using System.Collections.Generic;

namespace BussinessLogic.IBusinessRepository
{
    public interface IWorkFlowBusinessRepository
    {
        List<WorkFlow> GetWorkFlows(string firmId);
        WorkFlow GetWorkFlowDetail(string wfId, bool published = false);
        WorkFlow UpdateWorkFlowDetail(WorkFlow details, string firmId);
        bool DeleteWorkFlow(string wfId);
        bool AddWorkFlow(WorkFlow details, string firmId);
        long AttachWorkFlow(AttachWorkFlow workFlow);
        AttachWorkFlow AttachWorkFlowDetail(string workFlowId, string workflowId);
        List<AttachWorkFlowItem> AttachWorkFlowItemList(string workFlowId);
    }
}
