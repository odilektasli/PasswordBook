using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PassWalletAPI.Dtos;
using PassWalletAPI.Model;
using System.Net.Mail;
using System.Net;

namespace PassWalletAPI.Data
{
    public class LoginRepository : ILoginRepository
    {
        private readonly AppDbContext _context;

        public LoginRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Users> Login(LoginUsersDto loginUser)
        {

            
                var Users = await _context.Users.FirstOrDefaultAsync(x => x.Email == loginUser.Email);
                if (Users == null)
                    return null;
                if (!VerifyPassword(loginUser.Password, Users.Password))
                    return null;

                return Users;
            
        }

        private bool VerifyPassword(string password, string passwordHash)
        {

            var content = password;
            var decrypted = DecryptString(passwordHash); // Databaseden gelen şifre decrpyt edildi.
            for (int i = 0; i < content.Length; i++)
            {
                if (content[i] != decrypted[i])
                    return false;
            }
            
            return true;
        }

        public async Task<Users> Register(Users user, string password)
        {
            var encrypted = CreatePasswordHash(password);
 
            user.Password = encrypted;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<Users> ForgotPassword(ForgotPasswordDto userForgotPasswordDto)
        {
  
            var content = userForgotPasswordDto.Email;
            var decrypted = DecryptString(content);

            var Users = await _context.Users.FirstOrDefaultAsync(x => x.Email == decrypted);
            if (Users == null)
            {
                return null;
            }
            Users.Password = CreatePasswordHash(userForgotPasswordDto.Password);
            _context.Entry(Users).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Users;

        }

       

        //public async Task<Users> ForgotPassword(string email,string password)
        //{
        //    var key = "ZM4OBGFVFCNNRYR87OW2ZY8ERBYGGOGL";
        //    var content = password;
        //    var decrypted = DecryptString(email, key);
        //    var Users = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        //    if (Users == null)
        //    {
        //        return null;
        //    }
        //    Users.Password = CreatePasswordHash(password);
        //    _context.Entry(Users).State = EntityState.Modified;
        //    await _context.SaveChangesAsync();
        //    return Users;

        //}

        public async Task <string> EncryptEmail(string email)
        {
            
            var Users = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (Users == null)
                return null;
            var encrypted = CreateEmailHash(email);
            MailMessage mail = new MailMessage(); //yeni bir mail nesnesi Oluşturuldu.
            mail.IsBodyHtml = true; //mail içeriğinde html etiketleri kullanılsın mı?
            mail.To.Add(email); //Kime mail gönderilecek.

            //mail kimden geliyor, hangi ifade görünsün?
            mail.From = new MailAddress("passbookstaj@gmail.com", "PassBook", System.Text.Encoding.UTF8);
            mail.Subject = "PassBook Gururla Sunar " + "Want to reset your password?";//mailin konusu

            //mailin içeriği.. Bu alan isteğe göre genişletilip daraltılabilir.
            mail.Body = "localhost:3000/resetpassword/" + encrypted;
            mail.IsBodyHtml = true;
            SmtpClient smp = new SmtpClient();

            //mailin gönderileceği adres ve şifresi
            smp.Credentials = new NetworkCredential("passbookstaj@gmail.com", "passbook123");
            smp.Port = 587;
            smp.Host = "smtp.gmail.com";//gmail üzerinden gönderiliyor.
            smp.EnableSsl = true;
            smp.Send(mail);//mail isimli mail gönderiliyor.
            return "http://localhost:3000/resetpassword/" + encrypted;
        }
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutUsers(Guid id, Users users)
        //{
        //    if (id != users.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(users).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!UsersExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}


        public async Task<bool> UserExist(string email)
        {
            if (await _context.Users.AnyAsync(x => x.Email == email))
                return true;
            return false;
        }

        private string CreateEmailHash(string email)
        {
            var content = email;
          
            var encrypted = EncryptEmailString(content);
            return encrypted;

        }
      
        private string CreatePasswordHash(string password)
        {
            var content = password;
      
            var encrypted = EncryptString(content);
            return encrypted;

        }

        ///////////////////////////////////////////////////////////////////////////// ENCRYPT  DECRYPT ////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        public string EncryptEmailString(string value)
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
                            if (str.Contains("/"))
                            {
                               return EncryptEmailString(value);
                                
                            }
                            else
                            {
                                return str;
                            }
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
