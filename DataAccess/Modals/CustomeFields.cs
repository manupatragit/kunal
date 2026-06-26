using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Modals
{
  public  class CustomeFields
    {
        [Key]
        public long Id { get; set; }
        public long FirmId { get; set; }
        public int Sequence { get; set; }
        public long ConfigurationType { get; set; }
        public string SubConfigurationType { get; set; }
        public long FieldType { get; set; }
        public string FieldName { get; set; }
        public string FieldValues { get; set; }
        public bool IsRequired { get; set; }
        public int MinLength { get; set; }
        public int MaxLength { get; set; }
        public bool IsPositionChangable { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
    }
}
