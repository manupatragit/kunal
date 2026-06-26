using BussinessLogic.BusinessEntity;
using LawPractice.Common;

namespace LawPractice.Areas.Firm.Common
{
    public class FirmUserSession: UserSession
    {
        public FirmEmployee FirmUserDetails { get; set; }
    }
}