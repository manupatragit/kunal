using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<IEnumerable<T>> Chunk<T>(this IEnumerable<T> source, int size)
        {
            if (size <= 0)
            {
                throw new ArgumentException("Size must be greater than 0.", nameof(size));
            }

            while (source.Any())
            {
                yield return source.Take(size).ToList();
                source = source.Skip(size);
            }
        }
    }
}