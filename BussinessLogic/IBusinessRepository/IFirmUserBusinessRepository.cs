using System;
using System.Collections.Generic;
using BussinessLogic.BusinessEntity;
namespace BussinessLogic.IBusinessRepository
{
    public interface IFirmUserBusinessRepository
    {
        FirmEmployee Login(string userid, string password, string key, string firmCode);
        bool Registration(string userid, string password, string emailAddress, string firmCode);
        bool ForgotPassword(string emailAddress, string firmCode);
        List<Case> UserCases(string userid, string confId);
        List<Event> UserEvents(string userid, string confId);
        List<Task> UseTasks(string userid, string confId);
        List<Case> Clients(string confId);
        Tuple<string, string> GetUser(string firmId, string userid);
        string UserProfile(string firmId, string userid, string confId);
        bool ChangePassword(string userid, string currentpassword, string updatedpassword, string firmCode);
        bool ValidateEmail(string userid, string firmCode);
        bool AddNewUser(FirmEmployee user, List<FirmData> data, string firmId);
        bool UpdateUser(FirmEmployee user, List<FirmData> data, string firmId, string userId);
    }
}
