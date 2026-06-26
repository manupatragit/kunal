using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Azure operations
    /// </summary>
    public class AzureOperations
    {
        public string srcPath { get; set; }
        public string destinationPath { get; set; }
        public string storageAccountName { get; set; }
        public string containerName { get; set; }
        public string storageEndPoint { get; set; }
        public string blobName { get; set; }
        public string CreateDate { get; set; }
        public bool FileFolder { get; set; }
    }
}