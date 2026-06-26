using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Create Guid
    /// </summary>
    public class CreateGuid
    {
        public static Guid NGUID()
        {
            return Guid.NewGuid();
        }
    }
}