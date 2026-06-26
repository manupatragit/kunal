using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using System;

namespace LawPractice.Common
{
    [DataContract]
    [Serializable]
    [XmlRoot]
    public class ResponseData<T>
        where T : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseData{T}"/> class.
        /// </summary>
        public ResponseData()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseData{T}"/> class.
        /// </summary>
        /// <param name="data">
        /// The data.
        /// </param>
        public ResponseData(T data)
        {
            Data = data;
        }

        /// <summary>
        /// Gets a value indicating whether status.
        /// </summary>
        [DataMember]
        [XmlElement("Status", DataType = "boolean")]
        public bool Status
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        /// Gets the message.
        /// </summary>
        [DataMember]
        [XmlElement("Message")]
        public string Message
        {
            get
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        [DataMember]
        [XmlElement("Data")]
        public T Data { get; set; }
    }

    [DataContract]
    [Serializable]
    [XmlRoot]
    public class ResponseList<T>
        where T : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseList{T}"/> class.
        /// </summary>
        public ResponseList()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseList{T}"/> class.
        /// </summary>
        /// <param name="data">
        /// The data.
        /// </param>
        public ResponseList(List<T> data)
        {
            Data = data;
        }

        /// <summary>
        /// Gets a value indicating whether status.
        /// </summary>
        [DataMember]
        [XmlElement("Status", DataType = "boolean")]
        public bool Status
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        /// Gets the message.
        /// </summary>
        [DataMember]
        [XmlElement("Message")]
        public string Message
        {
            get
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        [DataMember]
        [XmlElement("Data")]
        public List<T> Data { get; set; }
    }
}
