using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class NumWords
    {
        /// <summary>
        /// Convert number to words
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static string ConvertNumbertoWords(int number)
        {
            if (number == 0)
                return "ZERO";
            if (number < 0)
                return "minus " + ConvertNumbertoWords(Math.Abs(number));
            string words = "";
            if ((number / 10000000) > 0)
            {
                words += ConvertNumbertoWords(number / 10000000) + " CRORE ";
                number %= 10000000;
            }
            if ((number / 1000000) > 0)
            {
                words += ConvertNumbertoWords(number / 1000000) + " MILLION ";
                number %= 1000000;
            }
            if ((number / 100000) > 0)
            {
                words += ConvertNumbertoWords(number / 100000) + " LAKH ";
                number %= 100000;
            }
            if ((number / 1000) > 0)
            {
                words += ConvertNumbertoWords(number / 1000) + " THOUSAND ";
                number %= 1000;
            }
            if ((number / 100) > 0)
            {
                words += ConvertNumbertoWords(number / 100) + " HUNDRED ";
                number %= 100;
            }
            if (number > 0)
            {
                if (words != "")
                    words += "AND ";
                string[] unitsMap = new string[] { "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN" };
                string[] tensMap = new string[] { "ZERO", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY" };

                if (number < 20)
                    words += unitsMap[number];
                else
                {
                    words += tensMap[number / 10];
                    if ((number % 10) > 0)
                        words += " " + unitsMap[number % 10];
                }
            }
            return words;
        }
        /// <summary>
        /// Convert Number to Words Title Case
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static string ConvertNumbertoWordsTitleCase(int number)
        {
            if (number == 0)
                return "Zero";
            if (number < 0)
                return "minus " + ConvertNumbertoWordsTitleCase(Math.Abs(number));
            string words = "";
            if ((number / 10000000) > 0)
            {
                words += ConvertNumbertoWordsTitleCase(number / 10000000) + " Crore ";
                number %= 10000000;
            }
            if ((number / 1000000) > 0)
            {
                words += ConvertNumbertoWordsTitleCase(number / 1000000) + " Million ";
                number %= 1000000;
            }
            if ((number / 100000) > 0)
            {
                words += ConvertNumbertoWordsTitleCase(number / 100000) + " Lakh ";
                number %= 100000;
            }
            if ((number / 1000) > 0)
            {
                words += ConvertNumbertoWordsTitleCase(number / 1000) + " Thousand ";
                number %= 1000;
            }
            if ((number / 100) > 0)
            {
                words += ConvertNumbertoWordsTitleCase(number / 100) + " Hundred ";
                number %= 100;
            }
            if (number > 0)
            {
                if (words != "")
                    words += "And ";
                string[] unitsMap = new string[] { "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
                string[] tensMap = new string[] { "Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

                if (number < 20)
                    words += unitsMap[number];
                else
                {
                    words += tensMap[number / 10];
                    if ((number % 10) > 0)
                        words += " " + unitsMap[number % 10];
                }
            }
            return words;
        }

    }
}