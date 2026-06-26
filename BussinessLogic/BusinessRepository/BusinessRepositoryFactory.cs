using BussinessLogic.IBusinessRepository;
using IPRManagement.BusinessLayer.BusinessRepository;
using IPRManagement.BusinessLayer.IBusinessRepository;

namespace BussinessLogic.BusinessRepository
{
    public class BusinessRepositoryFactory
    {
        private IApplicationUserBusinessRepository userRepository;
        private IMatterRepository matterRepository;
        private IFirmUsersRepository FirmUsersRepository;
        private ILeadBusinessRepository LeadBusinessRepository;

        private IFirmUserBusinessRepository FirmUserRepository;

        private IFirmClientBusinessRepository firmclientRepository; 

        private Adddata firmRepository;

        private IFirmCaseBusinessRepository _firmCaseRepository;

        private IFirmTaskBusinessRepository _firmTaskRepository;

        private IFirmEventBusinessRepository _firmEventRepository;

        private IConfigurationBusinessRepository configurationRepository;

        private IWorkFlowBusinessRepository workflowRepository;
        private IWorkFlowNewRepository workflownewRepository;

        private IReportBuilderRepository ReportBuilderRepository;
        private Iipr IIprRepository;
        public IApplicationUserBusinessRepository ApplicationUser
        {
            get => userRepository ?? (userRepository = new ApplicationUserBusinessRepository());
            private set { }
        }
        public IWorkFlowNewRepository WorkFlowNew
        {
            get => workflownewRepository ?? (workflownewRepository = new WorkFlowNewRepository());
            private set { }
        }
        public IMatterRepository Matter
        {
            get => matterRepository ?? (matterRepository = new MatterRepository());
            private set { }
        }

        public IFirmUsersRepository FirmUsers
        {
            get => FirmUsersRepository ?? (FirmUsersRepository = new FirmUsersRepository());
            private set { }
        }
        public ILeadBusinessRepository Lead
        {
            get => LeadBusinessRepository ?? (LeadBusinessRepository = new LeadBusinessRepository());
            private set { }
        }

        public IFirmUserBusinessRepository FirmUser
        {
            get => FirmUserRepository ?? (FirmUserRepository = new FirmUserBusinessRepository());
            private set { }
        }

        public IFirmClientBusinessRepository FirmClient
        {
            get => firmclientRepository ?? (firmclientRepository = new FirmClientBusinessRepository());
            private set { }
        }

        public Adddata Firm
        {
            get => firmRepository ?? (firmRepository = new FirmBusinessRepository());
            private set { }
        }

        public IFirmCaseBusinessRepository Case
        {
            get => _firmCaseRepository ?? (_firmCaseRepository = new FirmCaseBusinessRepository());
            private set { }
        }

        public IFirmTaskBusinessRepository Task
        {
            get => _firmTaskRepository ?? (_firmTaskRepository = new FirmTaskBusinessRepository());
            private set { }
        }

        public IFirmEventBusinessRepository Event
        {
            get => _firmEventRepository ?? (_firmEventRepository = new FirmEventBusinessRepository());
            private set { }
        }

        public IConfigurationBusinessRepository Configuration
        {
            get => configurationRepository ?? (configurationRepository = new ConfigurationBusinessRepository());
            private set { }
        }

        public IWorkFlowBusinessRepository WorkFlow {
            get => workflowRepository ?? (workflowRepository = new WorkFlowBusinessRepository());
            private set { }
        }

        public IReportBuilderRepository ReportBuilder
        {
            get => ReportBuilderRepository ?? (ReportBuilderRepository = new ReportBuilderRepository());
            private set { }
        }

        public Iipr IPR
        {
            get => IIprRepository ?? (IIprRepository = new IPRRepository());
            private set { }
        }
    }
}
