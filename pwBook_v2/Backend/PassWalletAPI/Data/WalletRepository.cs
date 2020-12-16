using PassWalletAPI.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace PassWalletAPI.Data
{
    public class WalletRepository : IWalletRepository
    {
        private readonly AppDbContext _context;
        public WalletRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PassWalletItems> AddWallet(PassWalletItems user)
        {
            var encryptedPassword = CreatePasswordHash(user.Password);
            var encryptedUserName = CreatePasswordHash(user.Username);
            user.Password = encryptedPassword;
            user.Username = encryptedUserName;

            await _context.PassWalletItems.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<List<PassWalletItems>> GetItem(string UserId)
        {
            var passWalletUsers = await _context.PassWalletItems.Where(x => x.UserId == UserId).ToListAsync();
            if (passWalletUsers == null)
                return null;
            for (int i = 0; i < passWalletUsers.Count; i++)
            {
                var content = passWalletUsers[i].Password;
                var decrypted = DecryptString(content);
                passWalletUsers[i].Password = decrypted;
            }
            for (int i = 0; i < passWalletUsers.Count; i++)
            {
                var content = passWalletUsers[i].Username;
                var decrypted = DecryptString(content);
                passWalletUsers[i].Username = decrypted;
            }
            return passWalletUsers;
        }

        public async Task<bool> DeleteItem(Guid Id)
        {
            var passWalletItems = await _context.PassWalletItems.FindAsync(Id);
            _context.PassWalletItems.Remove(passWalletItems);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PassWalletItems> UpdateWallet(PassWalletItems user)
        {
            var Users = await _context.PassWalletItems.FirstOrDefaultAsync(x => x.Id==user.Id);
            var encryptedPassword = CreatePasswordHash(user.Password);
            var encryptedUserName = CreatePasswordHash(user.Username);
            Users.Name = user.Name;
            Users.Description = user.Description;
            Users.Password = encryptedPassword;
            Users.Username = encryptedUserName;
            _context.Entry(Users).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;

           
        }

        //var passWalletItems = await _context.PassWalletItems.FindAsync(id);
        //    if (passWalletItems == null)
        //{
        //    return NotFound();
        //}

        //_context.PassWalletItems.Remove(passWalletItems);
        //await _context.SaveChangesAsync();

        //    return passWalletItems;
        private string CreatePasswordHash(string password)
        {
            var content = password;
            var encrypted = EncryptString(content);
            return encrypted;

        }

        public string EncryptString(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            try
            {
                var key = Encoding.UTF8.GetBytes("E546C8DF278CD5931069B522E695D4F2");

                using (var aesAlg = Aes.Create())
                {
                    using (var encryptor = aesAlg.CreateEncryptor(key, aesAlg.IV))
                    {
                        using (var msEncrypt = new MemoryStream())
                        {
                            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                            using (var swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(value);
                            }

                            var iv = aesAlg.IV;

                            var decryptedContent = msEncrypt.ToArray();

                            var result = new byte[iv.Length + decryptedContent.Length];

                            Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                            Buffer.BlockCopy(decryptedContent, 0, result, iv.Length, decryptedContent.Length);

                            var str = Convert.ToBase64String(result);
                            var fullCipher = Convert.FromBase64String(str);
                            return str;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }

        public string DecryptString(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            try
            {
                value = value.Replace(" ", "+");
                var fullCipher = Convert.FromBase64String(value);

                var iv = new byte[16];
                var cipher = new byte[fullCipher.Length - iv.Length];

                Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
                Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, fullCipher.Length - iv.Length);
                var key = Encoding.UTF8.GetBytes("E546C8DF278CD5931069B522E695D4F2");

                using (var aesAlg = Aes.Create())
                {
                    using (var decryptor = aesAlg.CreateDecryptor(key, iv))
                    {
                        string result;
                        using (var msDecrypt = new MemoryStream(cipher))
                        {
                            using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                            {
                                using (var srDecrypt = new StreamReader(csDecrypt))
                                {
                                    result = srDecrypt.ReadToEnd();
                                }
                            }
                        }

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }


    }
}
