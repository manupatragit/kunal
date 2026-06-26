using BussinessLogic.BusinessEntity;
namespace BussinessLogic.IBusinessRepository
{
    public interface IApplicationUserBusinessRepository
    {
        ApplicationUser Login(string username, string password);
        bool Registration(string username, string password, string emailAddress);
        bool ForgotPassword(string emailAddress);
        ApplicationUser UserProfile();
        bool ChangePassword(string username, string currentpassword, string updatedpassword);
        bool ValidateEmail(string username);
    }
}
