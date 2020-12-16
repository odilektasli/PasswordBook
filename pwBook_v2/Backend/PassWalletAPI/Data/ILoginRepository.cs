using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PassWalletAPI.Dtos;
using PassWalletAPI.Model;

namespace PassWalletAPI.Data
{
    public interface ILoginRepository
    {
        Task<Users> Login(LoginUsersDto loginUsers);
        Task<Users> Register(Users user, string password);
        Task<Users> ForgotPassword(ForgotPasswordDto userForgotPasswordDto);
        Task<string> EncryptEmail(string email);
        Task<bool> UserExist(string email);
        
    }
}
