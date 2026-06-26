using Microsoft.Security.Application;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
namespace QueryStringEDAES
{
    public class QueryAES
    {
        /// <summary>
        /// Decrypt file
        /// </summary>
        /// <param name="inputFilePath"></param>
        /// <param name="outputfilePath"></param>
        /// <returns></returns>
        public static string FileDecrypt(string inputFilePath, string outputfilePath)
        {
            string EncryptionKey = "LAW254MYKASE65DEFTYFOEJYR";
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (FileStream fsInput = new FileStream(inputFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                {
                    using (CryptoStream cs = new CryptoStream(fsInput, encryptor.CreateDecryptor(), CryptoStreamMode.Read))
                    {
                        using (FileStream fsOutput = new FileStream(outputfilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                        {
                            try
                            {
                                using (var fileStream = new FileStream(outputfilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                                {
                                    fileStream.SetLength(0);
                                    fileStream.Flush();
                                    fileStream.Dispose();
                                    fileStream.Close();
                                }
                            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                            {
                            }
                            int data;
                            while ((data = cs.ReadByte()) != -1)
                            {
                                fsOutput.WriteByte((byte)data);
                            }
                        }
                    }
                }
            }
            return "";
        }
        /// <summary>
        /// Encrypt file
        /// </summary>
        /// <param name="inputFilePath"></param>
        /// <param name="outputfilePath"></param>
        /// <returns></returns>
        public static string FileEncrypt(string inputFilePath, string outputfilePath)
        {
            string EncryptionKey = "LAW254MYKASE65DEFTYFOEJYR";
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (FileStream fsOutput = new FileStream(outputfilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                {
                    using (CryptoStream cs = new CryptoStream(fsOutput, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        using (FileStream fsInput = new FileStream(inputFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                        {
                            try
                            {
                                using (var fileStream = new FileStream(outputfilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                                {
                                    fileStream.SetLength(0);
                                    fileStream.Flush();
                                    fileStream.Dispose();
                                    fileStream.Close();
                                }
                            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                            catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                            {
                            }
                            int data;
                            while ((data = fsInput.ReadByte()) != -1)
                            {
                                cs.WriteByte((byte)data);
                            }
                        }
                    }
                }
            }
            return "";
        }
        /// <summary>
        /// Encrypt AES
        /// </summary>
        /// <param name="clearText"></param>
        /// <returns></returns>
        public static byte[] EncryptAes(string clearText)
        {
            byte[] encriptedtext;
            string EncryptionKey = "LAWPRACTICE2018ABCDEFGHIJKL123456789";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    encriptedtext = ms.ToArray();
                }
            }
            return encriptedtext;
        }
        /// <summary>
        /// Decrypt AES
        /// </summary>
        /// <param name="cipherBytes"></param>
        /// <returns></returns>
        public static string DecryptAes(byte[] cipherBytes)
        {
            string cipherText = "";
            string EncryptionKey = "LAWPRACTICE2018ABCDEFGHIJKL123456789";
            //byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }
        public static string AESKEY()
        {
            var keydata = "7125468236514785";
            return keydata;
        }
        /// <summary>
        /// Descrypt AES string
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string DecryptStringAES(string data)
        {
            var keybytes = Encoding.UTF8.GetBytes("7125468236514785");
            var iv = Encoding.UTF8.GetBytes("7125468236514785");
            //DECRYPT FROM CRIPTOJS
            var encrypted = Convert.FromBase64String(data);
            var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);
            return string.Format(
                decriptedFromJavascript);
        }
        /// <summary>
        /// Encrypt string AES
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string EncryptStringAES(string data)
        {
            var keybytes = Encoding.UTF8.GetBytes("7125468236514785");
            var iv = Encoding.UTF8.GetBytes("7125468236514785");
            //c# encrrption
            //var encryptStringToBytes = EncryptStringToBytes("It works", keybytes, iv);
            //// Decrypt the bytes to a string.
            //var roundtrip = DecryptStringFromBytes(encryptStringToBytes, keybytes, iv);
            //DECRYPT FROM CRIPTOJS
            var encryptstring = EncryptStringToBytes(data, keybytes, iv);
            var encryptstring1 = Convert.ToBase64String(encryptstring);
            return encryptstring1.ToString();
        }
        /// <summary>
        /// Decrypt string from byte
        /// </summary>
        /// <param name="cipherText"></param>
        /// <param name="key"></param>
        /// <param name="iv"></param>
        /// <returns></returns>
        private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;
            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;
                rijAlg.Key = key;
                rijAlg.IV = iv;
                // Create a decrytor to perform the stream transform.
                var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);
                // Create the streams used for decryption.
                using (var msDecrypt = new MemoryStream(cipherText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            return plaintext;
        }

        /// <summary>
        /// Encrypt string to byte
        /// </summary>
        /// <param name="plainText"></param>
        /// <param name="key"></param>
        /// <param name="iv"></param>
        /// <returns></returns>
        private static byte[] EncryptStringToBytes(string plainText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
            {
                throw new ArgumentNullException("plainText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            byte[] encrypted;
            // Create a RijndaelManaged object
            // with the specified key and IV.
            using (var rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;
                rijAlg.Key = key;
                rijAlg.IV = iv;
                // Create a decrytor to perform the stream transform.
                var encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);
                // Create the streams used for encryption.
                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }
        /// <summary>
        /// Hexa string
        /// </summary>
        /// <param name="hexString"></param>
        /// <returns></returns>
        public static string FromHexString(string hexString)
        {
            var bytes = new byte[hexString.Length / 2];
            for (var i = 0; i < bytes.Length; i++)
            {
                bytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
            }
            return Encoding.Unicode.GetString(bytes); // returns: "Hello world" for "48656C6C6F20776F726C64"
        }
        /// <summary>
        /// Convert String To Hex
        /// </summary>
        /// <param name="input"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ConvertStringToHex(String input, System.Text.Encoding encoding)
        {
            Byte[] stringBytes = encoding.GetBytes(input);
            StringBuilder sbBytes = new StringBuilder(stringBytes.Length * 2);
            foreach (byte b in stringBytes)
            {
                sbBytes.AppendFormat("{0:X2}", b);
            }
            return sbBytes.ToString();
        }
        /// <summary>
        /// Convert Hexa to string
        /// </summary>
        /// <param name="hexInput"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string ConvertHexToString(String hexInput, System.Text.Encoding encoding)
        {
            int numberChars = hexInput.Length;
            byte[] bytes = new byte[numberChars / 2];
            for (int i = 0; i < numberChars; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hexInput.Substring(i, 2), 16);
            }
            return encoding.GetString(bytes);
        }
        /// <summary>
        /// Get hashed code
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string GetHashedCode(string password)
        {
            ASCIIEncoding enc = new ASCIIEncoding();
            byte[] byteCode = enc.GetBytes(password);
            MD5 md5 = MD5.Create();
            md5.ComputeHash(byteCode);
            return GetStringFromHash(md5.Hash);
        }
        /// <summary>
        /// Get string from Hash
        /// </summary>
        /// <param name="hashCode"></param>
        /// <returns></returns>
        public static string GetStringFromHash(byte[] hashCode)
        {
            ASCIIEncoding enc = new ASCIIEncoding();
            return enc.GetString(hashCode);
        }
        /// <summary>
        /// Decrypt string AESSSO
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string DecryptStringAESSSO(string data)
        {
            var keybytes = Encoding.UTF8.GetBytes("8125468236514789");
            var iv = Encoding.UTF8.GetBytes("8125468236514789");
            //c# encrrption
            //var encryptStringToBytes = EncryptStringToBytes("It works", keybytes, iv);
            //// Decrypt the bytes to a string.
            //var roundtrip = DecryptStringFromBytes(encryptStringToBytes, keybytes, iv);
            //DECRYPT FROM CRIPTOJS
            var encrypted = Convert.FromBase64String(data);
            var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);
            return string.Format(
                decriptedFromJavascript);
        }
        /// <summary>
        /// Encrypt string to AESSO
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string EncryptStringAESSSO(string data)
        {
            var keybytes = Encoding.UTF8.GetBytes("8125468236514789");
            var iv = Encoding.UTF8.GetBytes("8125468236514789");
            //c# encrrption
            //var encryptStringToBytes = EncryptStringToBytes("It works", keybytes, iv);
            //// Decrypt the bytes to a string.
            //var roundtrip = DecryptStringFromBytes(encryptStringToBytes, keybytes, iv);
            //DECRYPT FROM CRIPTOJS
            var encryptstring = EncryptStringToBytes(data, keybytes, iv);
            var encryptstring1 = Convert.ToBase64String(encryptstring);
            return encryptstring1.ToString();
        }
        /// <summary>
        /// Replace URI decode string
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string ReplaceURlDecodeString(string input)
        {
            if (!String.IsNullOrEmpty(input))
            {
                input = input.Replace("&#43;", "+");
                input = input.Replace("&quot;", "\"");
            }
            return input;
        }
        /// <summary>
        /// URL decode
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string UrlDecode(string input)
        {
            if (!String.IsNullOrEmpty(input))
            {
                try
                {
                    var temp = input;
                    temp = HttpUtility.UrlDecode(temp);
                    temp = temp.Replace(" ", "+");
                    var temp2 = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(temp));
                    return temp;
                }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                {
                    var match2 = Regex.Match(input, "(\\+|\\=)", RegexOptions.IgnoreCase);
                    if (match2.Success)
                    {
                        throw new Exception("Invalid Input sign(+,=)");
                    }
                }
                var match = Regex.Match(input, "<[^>]*>", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    throw new Exception("Invalid Input");
                }
                input = HttpUtility.UrlDecode(input);
                input = Sanitizer.GetSafeHtmlFragment(input);
                input = ReplaceURlDecodeString(input);
                input = Regex.Replace(input, "<[^>]*>", "");
                //  String target = input.Replace("<[^>]*>", "");
                var output = HttpUtility.UrlDecode(input);
                return output;
            }
            else
            {
                return input;
            }
        }
        /// <summary>
        /// Url Decode WithOut Input Invalid
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string UrlDecodeWithOutInputInvalid(string input)
        {
            if (!String.IsNullOrEmpty(input))
            {
                var match = Regex.Match(input, "<[^>]*>", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    throw new Exception("Invalid Input");
                }
                input = Sanitizer.GetSafeHtmlFragment(input);
                input = ReplaceURlDecodeString(input);
                input = Regex.Replace(input, "<[^>]*>", "");
                //  String target = input.Replace("<[^>]*>", "");
                var output = HttpUtility.UrlDecode(input);
                return output;
            }
            else
            {
                return input;
            }
        }
        /// <summary>
        /// URL decoder
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string UrlDecodeEditor(string input)
        {
            try
            {
                if (!String.IsNullOrEmpty(input))
                {
                    input = Regex.Replace(input, "(<script>|</script>|&lt;script&gt;|&lt;/script&gt;)", "");
                    //  String target = input.Replace("<[^>]*>", "");
                    var output = HttpUtility.UrlDecode(input);
                    return output;
                }
                else
                {
                    return input;
                }
            }
            catch (Exception)
            {
                return "";
            }
        }
        /// <summary>
        /// Replace base64 string
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static dynamic FromBase64StringWithReplace(string input)
        {
            try
            {
                if (!String.IsNullOrEmpty(input))
                {
                    input = input.Replace(" ", "+");
                    var output = Convert.FromBase64String(input);
                    return output;
                }
                else
                {
                    return input;
                }
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
