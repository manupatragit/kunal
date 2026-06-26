using Dropbox.Api;
using LawPracticeFirm.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;


namespace LawPracticeFirm.Helpers
{
    [Serializable]
    public static class ModelHelpers
    {
        public static async Task<IEnumerable<DropBoxFileList>> GetFilesList(this DropboxClient client, string id)
        {

            if (String.IsNullOrEmpty(id))
            {
                var list = await client.Files.ListFolderAsync(string.Empty);


                var articles = new List<DropBoxFileList>();
                foreach (var item in list.Entries)
                {

                    articles.Add(new DropBoxFileList
                    {
                        Name = item.Name,
                        PathLower = item.PathLower,
                        PathDisplay = item.PathDisplay,
                        Id = item.Name,
                        //ContentHash = item.GetHashCode,
                        //ClientModified = item.c,
                        //ServerModified = item.Name,
                        //Size = item.Name,
                        //Rev = item.Name,
                        IsFolder = item.IsFolder,
                        IsFile = item.IsFile,
                        //IsDownloadable = item.IsDownloadable,
                        //IsDelete = item.IsDelete


                    });


                }



               //articles.Sort((l, r) => l..CompareTo(r.ServerModified));

                return articles;
            }
            else
            {
                var list = await client.Files.ListFolderAsync("/" + id);


                var articles = new List<DropBoxFileList>();
                foreach (var item in list.Entries)
                {

                    articles.Add(new DropBoxFileList
                    {
                        Name = item.Name,
                        PathLower = item.PathLower,
                        PathDisplay = item.PathDisplay,
                        //Id = item.IsDeleted,
                        //ContentHash = item.GetHashCode,
                        //ClientModified = item.c,
                        //ServerModified = item.Name,
                        //Size = item.Name,
                        //Rev = item.Name,
                        IsFolder = item.IsFolder,
                        IsFile = item.IsFile,
                        //IsDownloadable = item.IsDownloadable,
                        //IsDelete = item.IsDelete


                    });


                }



               // articles.Sort((l, r) => l.ServerModified.CompareTo(r.ServerModified));

                return articles;
            }
        }
        public static DropboxClient GetAuthenticatedClient(dynamic sessiontoken)
        {
            //user.ID != WebSecurity.CurrentUserId ||
            if (string.IsNullOrWhiteSpace(sessiontoken))
            {
                return null;
            }

            return new DropboxClient(sessiontoken, new DropboxClientConfig("LawPractice"));
        }
    }
}
