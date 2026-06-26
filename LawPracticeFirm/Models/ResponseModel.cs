using System;

namespace NoticeManagement.Models
{
    /// <summary>
    /// Response model
    /// </summary>
    public class ResponseModel
    {
        public ResponseModel()
        {
            Message = "Success";
            IsSuccess = true;
        }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
        public object Result { get; set; }
    }
}