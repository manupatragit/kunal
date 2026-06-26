using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using BussinessLogic.BusinessEntity;
using BussinessLogic.BusinessRepository;

namespace LawPracticeFirm.Common
{
    public static class CacheManager
    {
        private static readonly MemoryCache Cache = MemoryCache.Default;
        /// <summary>
        /// Firm list details
        /// </summary>
        public static List<string> FirmList
        {
            get
            {
                if (!Cache.Contains("FirmList"))
                    RefreshFirmList();
                return Cache.Get("FirmList") as List<string>;
            }
        }
        /// <summary>
        /// Get Application Url list from cache
        /// </summary>
        public static List<ApplicationUrl> UrlList
        {
            get
            {
                if (!Cache.Contains("UrlList"))
                    RefreshUrlList();
                return Cache.Get("UrlList") as List<ApplicationUrl>;
            }
        }
        /// <summary>
        /// Refresh url list
        /// </summary>
        static void RefreshUrlList()
        {
            var listUrl = new List<ApplicationUrl>();

            foreach (UrlGroupElement element in ApplicationUrlGroups.GetUrlGroups())
            {
                listUrl.Add(new ApplicationUrl
                {
                    Sequence = element.Sequence,
                    Name = element.Name,
                    Title = element.Title,
                    Url = element.Url,
                    Type = element.Type
                });
            }
            CacheItemPolicy cacheItemPolicy = new CacheItemPolicy
            {
                AbsoluteExpiration = DateTime.Now.AddDays(1)
            };
            Cache.Remove("UrlList");
            Cache.Add("UrlList", listUrl, cacheItemPolicy);
        }
        /// <summary>
        /// Refresh firm list details
        /// </summary>
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
        /// <summary>
        /// Get firm details by name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
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
        /// <summary>
        /// Find url by name
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string FindUrlByName(string name)
        {
            var obj = UrlList.ToList().FirstOrDefault(w => w.Name.ToUpper() == name.ToUpper());
            if (obj != null)
            {
                return obj.Url;
            }

            return string.Empty;
        }

        /// <summary>
        /// Get from cache or add via factory, with absolute expiration in minutes
        /// </summary>
        public static T GetOrAdd<T>(string key, Func<T> factory, int minutes = 60)
        {
            var result = Cache.Get(key);
            if (result != null)
                return (T)result;

            result = factory();
            Cache.Set(key, result, DateTimeOffset.Now.AddMinutes(minutes));
            return (T)result;
        }

        /// <summary>
        /// Remove an entry from cache
        /// </summary>
        public static void Remove(string key)
        {
            Cache.Remove(key);
        }
    }
}