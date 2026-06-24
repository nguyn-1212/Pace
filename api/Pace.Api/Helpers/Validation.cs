using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Lazy.Travel.Api.Helpers
{
    public static class Validation
    {
        public static bool IsPhoneNumber(string number)
        {
            return Regex.Match(number, @"(84|0[3|5|7|8|9])+([0-9]{8})\b").Success;
        }

        public static bool IsWord(string str)
        {
            return Regex.Match(str, @"^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$").Success;
        }

        public static bool IsNumber(string number)
        {
            return Regex.Match(number, @"^[0-9]+$").Success;
        }

        public static bool IsEmail(string email)
        {
            return Regex.Match(email, @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$").Success;
        }

        //public static bool IsDate(string date)
        //{
        //    return Regex.Match(date, @"^[0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{4}$").Success;
        //}

        public static bool IsDate(string date)
        {
            Regex regex = new Regex(@"(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$");

            //Verify whether date entered in dd/MM/yyyy format.
            bool isValid = regex.IsMatch(date.Trim());

            //Verify whether entered date is Valid date.
            DateTime dt;
            isValid = DateTime.TryParseExact(date, "dd/MM/yyyy", null, DateTimeStyles.None, out dt);
            return isValid;
        }
    }
}
