using BussinessLogic.BusinessEntity;

namespace LawPracticeFirm.Common
{
    public class FirmUserSession: UserSession
    {
        public FirmEmployee FirmUserDetails { get; set; }
    }
}