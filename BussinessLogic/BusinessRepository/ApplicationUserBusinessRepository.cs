using System;
using System.Linq;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using BussinessLogic.IBusinessRepository;
using DataAccess.PocoRepositories;

namespace BussinessLogic.BusinessRepository
{
    public class ApplicationUserBusinessRepository : IApplicationUserBusinessRepository
    {
        public bool ForgotPassword(string emailAddress)
        {
            throw new NotImplementedException();
        }
        /// <summary>
        /// Login with user credential
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>

        public ApplicationUser Login(string username, string password)
        {
            var poco = new UserPocoRepository();
            var u = poco.All().FirstOrDefault(w => w.UserName.ToUpper() == username.ToUpper());
            if (u != null)
            {
                if (u.Password == password)
                {
                    return new ApplicationUser
                    {
                        Email = u.EmailAddress,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        FullName = string.Concat(u.FirstName, " ", u.LastName),
                        // UserId=u.Id,
                    };
                }
                else
                {
                    throw new ValidationException("Invalid Password!!");
                }
            }
            else
            {
                throw new ValidationException("User Doesn't Exist!!");
            }
        }

        public bool Registration(string username, string password, string emailAddress)
        {
            throw new NotImplementedException();
        }

        public ApplicationUser UserProfile()
        {
            throw new NotImplementedException();
        }

        public bool ChangePassword(string username, string currentpassword, string updatedpassword)
        {
            throw new NotImplementedException();
        }

        public bool ValidateEmail(string username)
        {
            throw new NotImplementedException();
        }
    }
}
