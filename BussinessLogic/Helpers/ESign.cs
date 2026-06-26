using DataAccess.Modals;
using LawPracticeFirm.Models;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BussinessLogic
{
    public class ESign
    {
        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public static string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;

            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }
        /// <summary>
        /// Descrypt JSON data in AES
        /// </summary>
        /// <param name="toDecrypt"></param>
        /// <param name="key"></param>
        /// <param name="userid"></param>
        /// <param name="signtype"></param>
        /// <param name="docnum"></param>
        /// <param name="docname"></param>
        /// <param name="Referencenumber"></param>
        /// <param name="Transactionnumber"></param>
        /// <param name="firmid"></param>
        /// <returns></returns>
        public static byte[] DecryptJsonDataAES(byte[] toDecrypt, byte[] key, string userid, string signtype, string docnum, string docname, string Referencenumber, string Transactionnumber,string firmid)
        {

            IBufferedCipher cipher = CipherUtilities.GetCipher("AES/ECB/PKCS7");
            cipher.Init(false, new KeyParameter(key));
            byte[] output = cipher.DoFinal(toDecrypt);
            string plainText = Encoding.UTF8.GetString(output);
            string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UserSpace/" + docname + "/" + userid + "/" + signtype + "/");
            if (!Directory.Exists(folderPath))
            {
                //If Directory (Folder) does not exists. Create it.
                Directory.CreateDirectory(folderPath);
            }
            var pffth = folderPath + docnum + ".pdf";
            System.IO.File.WriteAllBytes(pffth, output);

            var localpath = "/UserSpace/" + docname + "/" + userid + "/" + signtype + "/" + docnum + ".pdf";

            LawPracticeEntities db = new LawPracticeEntities();

            var filename = "";
            try
            {
                var getfirmid = db.usp_GetFirmidByDocID(docnum).FirstOrDefault();

                firmid = getfirmid.firmid.ToString();
                filename = getfirmid.fname.ToString();
            }
            catch
            {
                filename = docname;
            }
            var origininalfilename = filename;
            var orfileNameOnly = filename.Remove(filename.LastIndexOf('.') + 1).TrimEnd('.');
            var extension = filename.Split('.').Last();

            var newfilename = orfileNameOnly + randomno() +"."+ extension;
            // ExpenseManagementEntities db = new ExpenseManagementEntities();
            //store to azure
            var tempfilepath = HttpContext.Current.Server.MapPath(localpath);
            var data = db.usp_GetViewFilesCloudById(Guid.Parse(firmid), docnum).FirstOrDefault();
            var folderpathazure = "WorkSpace/DigitalSign/" + firmid + "/" + userid;
            try
            {
                var status = AzureDocumentself.filecreateafteredit(tempfilepath, folderpathazure, newfilename, null, null);
            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
            {
                AzureDocumentself.CreateNestedDirectory(folderpathazure);

                var status = AzureDocumentself.filecreateafteredit(tempfilepath, folderpathazure, newfilename, null, null);

            }
            if(docname!= "MykaseDrive")
            {
                docname = "Drive";
            }
            var result = db.sp_SaveDigitalSignatureInfo(Convert.ToBase64String(key), newfilename, folderpathazure, userid, docnum, docname, Transactionnumber, Referencenumber, signtype,firmid,"");
            
            return output;
        }
    }
    /// <summary>
    /// Digital signature model
    /// </summary>
    public class DigitalSignatureModal
    {
        public string Name { get; set; }
        public string FileType { get; set; }
        public string SignatureType { get; set; }
        public string SelectPage { get; set; }
        public string SignaturePosition { get; set; }
        public string AuthToken { get; set; }
        public string File { get; set; }
        public int PageNumber { get; set; }
        public bool PreviewRequired { get; set; }
        public string PagelevelCoordinates { get; set; }
        public string CustomizeCoordinates { get; set; }
        public string SUrl { get; set; }
        public string FUrl { get; set; }
        public string CUrl { get; set; }
        public string ReferenceNumber { get; set; }
        public bool Enableuploadsignature { get; set; }
        public bool Enablefontsignature { get; set; }
        public bool EnableDrawSignature { get; set; }
        public bool EnableeSignaturePad { get; set; }
        public bool IsCompressed { get; set; }
        public bool IsCosign { get; set; }
        public bool EnableViewDocumentLink { get; set; }
        public bool Storetodb { get; set; }
        public bool IsGSTN { get; set; }
        public bool IsGSTN3B { get; set; }
        public bool IsCustomized { get; set; }
    }

    public class DigitalSignature
    {
        public static byte[] GetNewSessionKey()
        {
            using (Aes myAes = Aes.Create("AES"))
            {
                myAes.KeySize = 256;
                myAes.GenerateKey();
                return myAes.Key;
            }
        }
        /// <summary>
        /// Encrypt data aes
        /// </summary>
        /// <param name="toEncrypt"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static byte[] EncryptDataAES(byte[] toEncrypt, byte[] key)
        {
            IBufferedCipher cipher = CipherUtilities.GetCipher("AES/ECB/PKCS7");
            cipher.Init(true, new KeyParameter(key));
            int outputSize = cipher.GetOutputSize(toEncrypt.Length);
            byte[] tempOP = new byte[outputSize];
            int processLen = cipher.ProcessBytes(toEncrypt, 0, toEncrypt.Length, tempOP, 0);
            int outputLen = cipher.DoFinal(tempOP, processLen);
            byte[] result = new byte[processLen + outputLen];
            System.Array.Copy(tempOP, 0, result, 0, result.Length);
            return result;
        }

        public static byte[] Generatehash256(string text)
        {
            byte[] message = Encoding.UTF8.GetBytes(text);
            SHA256Managed hashString = new SHA256Managed();
#pragma warning disable CS0219 // The variable 'hex' is assigned but its value is never used
            string hex = "";
#pragma warning restore CS0219 // The variable 'hex' is assigned but its value is never used
            var hashValue = hashString.ComputeHash(message);
            return hashValue;
        }
        /// <summary>
        /// Encrypt with public key
        /// </summary>
        /// <param name="stringToEncrypt"></param>
        /// <returns></returns>
        public static string EncryptWithPublicKey(byte[] stringToEncrypt)
        {
            X509Certificate2 certificate;
            certificate = new X509Certificate2(AppDomain.CurrentDomain.BaseDirectory + "\\certificate.cer");
            byte[] cipherbytes = Convert.FromBase64String(Convert.ToBase64String(stringToEncrypt));
            RSACryptoServiceProvider rsa = (RSACryptoServiceProvider)certificate.PublicKey.Key;
            byte[] cipher = rsa.Encrypt(cipherbytes, false);
            return Convert.ToBase64String(cipher);
        }

        public static string CompressFileLZMA(string InputFileName, string filename)
        {
            string TransactionID = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            string OutputFileName = InputFileName;
            //string OutputFileName = System.Web.Hosting.HostingEnvironment.MapPath("~\\PurchaseOrderPdf\\") + TransactionID + "_" + Path.GetFileName(InputFileName.Split('.')[0]).ToString();
            Int32 dictionary = 1 << 23;
            Int32 posStateBits = 2;
            Int32 litContextBits = 3; // for normal files
                                      // UInt32 litContextBits = 0; // for 32-bit data
            Int32 litPosBits = 0;
            // UInt32 litPosBits = 2; // for 32-bit data
            Int32 algorithm = 2;
            Int32 numFastBytes = 128;

            string mf = "bt4";
            bool eos = true;
            bool stdInMode = false;


            SevenZip.Sdk.CoderPropId[] propIDs =  {
                SevenZip.Sdk.CoderPropId.DictionarySize,
                SevenZip.Sdk.CoderPropId.PosStateBits,
                SevenZip.Sdk.CoderPropId.LitContextBits,
                SevenZip.Sdk.CoderPropId.LitPosBits,
                SevenZip.Sdk.CoderPropId.Algorithm,
                SevenZip.Sdk.CoderPropId.NumFastBytes,
                SevenZip.Sdk.CoderPropId.MatchFinder,
                SevenZip.Sdk.CoderPropId.EndMarker
            };

            object[] properties = {
                (Int32)(dictionary),
                (Int32)(posStateBits),
                (Int32)(litContextBits),
                (Int32)(litPosBits),
                (Int32)(algorithm),
                (Int32)(numFastBytes),
                mf,
                eos
            };
            try
            {
                FileStream inStream = null;
                try
                {

                    using (inStream = new FileStream(OutputFileName, FileMode.Open))
                    {
                        using (FileStream outStream = new FileStream(OutputFileName, FileMode.Create))
                        {
                            SevenZip.Sdk.Compression.Lzma.Encoder encoder = new SevenZip.Sdk.Compression.Lzma.Encoder();
                            encoder.SetCoderProperties(propIDs, properties);
                            encoder.WriteCoderProperties(outStream);
                            Int64 fileSize;
                            if (eos || stdInMode)
                                fileSize = -1;
                            else
                                fileSize = inStream.Length;
                            for (int i = 0; i < 8; i++)
                                outStream.WriteByte((Byte)(fileSize >> (8 * i)));
                            encoder.Code(inStream, outStream, -1, -1, null);
                        }
                    }
                }
#pragma warning disable CS0168 // The variable 'ff' is declared but never used
                catch (Exception ff)
#pragma warning restore CS0168 // The variable 'ff' is declared but never used
                {
                    inStream.Dispose();
                }
                using (FileStream inStreams = new FileStream(OutputFileName, FileMode.Open))
                {
                    using (FileStream outStream = new FileStream(OutputFileName, FileMode.Create))
                    {
                        SevenZip.Sdk.Compression.Lzma.Encoder encoder = new SevenZip.Sdk.Compression.Lzma.Encoder();
                        encoder.SetCoderProperties(propIDs, properties);
                        encoder.WriteCoderProperties(outStream);
                        Int64 fileSize;
                        if (eos || stdInMode)
                            fileSize = -1;
                        else
                            fileSize = inStreams.Length;
                        for (int i = 0; i < 8; i++)
                            outStream.WriteByte((Byte)(fileSize >> (8 * i)));
                        encoder.Code(inStreams, outStream, -1, -1, null);
                    }
                }
            }
            catch (Exception ex)
            {
                var bh = ex.Message;
            }
            return OutputFileName;
        }

    }
}
