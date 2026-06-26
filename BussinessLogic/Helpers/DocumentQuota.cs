using DataAccess.Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic
{
    public class DocumentQuota
    {
        /// <summary>
        /// Check document management file size
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string CheckDocumentmanagementFileSize(string firmid, string userid)
        {
            var db1 = new LawPracticeEntities();
            var Defaultize = db1.usp_getDocumentsize(firmid).FirstOrDefault();
            var TotalDocsize = db1.usp_GetFirmTotalDocumentSize(firmid, userid).FirstOrDefault();
            if (Defaultize != null)
            {
                double azuresizelimit = Convert.ToDouble(TotalDocsize);
                double firmsizelimit = Convert.ToDouble(Defaultize);
                if (azuresizelimit > firmsizelimit)
                {
                    return "EXCEEDLIMIT";
                }
                else
                {
                    return "Available";
                }
            }
            else
            {
                return "NOLIMIT";
            }


        }
    }
}
