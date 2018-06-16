using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Identity;
using VoidJudge.Models.Identity;

namespace VoidJudge.Test
{
    [TestClass]
    public class CryptoTest
    {
        [TestMethod]
        public void HashPasswordAsync()
        {
            var pher = new PasswordHasher<UserModel>();

            var hp1 = pher.HashPassword(null, "a");
            Debug.WriteLine(hp1);
            var hp2 = pher.HashPassword(null, "t");
            Debug.WriteLine(hp2);
            var hp3 = pher.HashPassword(null, "1");
            Debug.WriteLine(hp3);
        }
    }
}
