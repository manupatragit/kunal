using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace LawPractice.Common
{
    public class ResponseError
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseError"/> class.
        /// </summary>
        public ResponseError()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseError"/> class.
        /// </summary>
        /// <param name="status">
        /// The status.
        /// </param>
        /// <param name="message">
        /// The message.
        /// </param>
        public ResponseError(bool status, string message)
        {
            Status = status;
            Message = message;
            Data = null;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseError"/> class.
        /// </summary>
        /// <param name="message">
        /// The message.
        /// </param>
        public ResponseError(string message)
        {
            Status = false;
            Message = message;
            Data = null;
        }

        /// <summary>
        /// Gets or sets a value indicating whether status.
        /// </summary>
        [DataMember]
        [XmlElement("Status", DataType = "boolean")]
        public bool Status { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        [DataMember]
        [XmlElement("Message")]
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        [DataMember]
        [XmlElement("Data")]
        public object Data { get; set; }
    }
}
