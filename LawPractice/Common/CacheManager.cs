using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;

namespace LawPractice.Common
{
    public static class CacheManager
    {
        private static readonly MemoryCache Cache = MemoryCache.Default;

        public static List<string> FirmList
        {
            get
            {
                if (!Cache.Contains("FirmList"))
                    RefreshFirmList();
                return Cache.Get("FirmList") as List<string>;
            }
        }

        public static List<ApplicationUrl> UrlList
        {
            get
            {
                if (!Cache.Contains("UrlList"))
                    RefreshUrlList();
                return Cache.Get("UrlList") as List<ApplicationUrl>;
            }
        }

        static void RefreshUrlList()
        {
            var listUrl = new List<ApplicationUrl>();

            //foreach (UrlGroupElement element in ApplicationUrlGroups.GetUrlGroups())
            //{
            //    listUrl.Add(new ApplicationUrl
            //    {
            //        Id=element.Id,
            //        Sequence=element.Sequence,
            //        Name=element.Name,
            //        Title = element.Name,
            //        Url = element.Url,
            //        Type = element.Type
            //    });
            //}
            CacheItemPolicy cacheItemPolicy = new CacheItemPolicy
            {
                AbsoluteExpiration = DateTime.Now.AddDays(1)
            };
            Cache.Remove("UrlList");
            Cache.Add("UrlList", listUrl, cacheItemPolicy);
        }

        public static void RefreshFirmList()
        {
            var listAgency = new BusinessRepositoryFactory().Firm.FirmNamesList();

            CacheItemPolicy cacheItemPolicy = new CacheItemPolicy
            {
                AbsoluteExpiration = DateTime.Now.AddDays(1)
            };

            Cache.Remove("FirmList");
            Cache.Add("FirmList", listAgency, cacheItemPolicy);
        }

        public static bool FindFirmByName(string name)
        {
            if (FirmList.Contains(name.ToUpper()))
            {
                return true;
            }
            else
            {
                RefreshFirmList();
                return FirmList.Contains(name.ToUpper());
            }
        }

        public static string FindUrlByName(string name)
        {
            var obj= UrlList.ToList().FirstOrDefault(w=>w.Name.ToUpper()==name.ToUpper());
            if (obj!=null)
            {
                return obj.Url;
            }

            return string.Empty;
        }
    }
}