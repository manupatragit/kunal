using System.Configuration;
namespace LawPracticeFirm.Common
{
    public class ApplicationUrlGroups
    {
        public static UrlGroupConfigsSection Config = ConfigurationManager.GetSection("UrlGroupConfigs") as UrlGroupConfigsSection;
        public static MedGroupElementCollection GetUrlGroups()
        {
            return Config.UrlGroups;
        }
    }

    /// <summary>
    /// Extend the ConfigurationSection class.Your class name should match your section name and be postfixed with "Section".
    /// </summary>
    public class UrlGroupConfigsSection : ConfigurationSection
    {
        //Decorate the property with the tag for your collection.
        [ConfigurationProperty("UrlGroups")]
        public MedGroupElementCollection UrlGroups => (MedGroupElementCollection)this["UrlGroups"];
    }
    /// <summary>
    /// Extend the ConfigurationElementCollection class.
    /// Decorate the class with the class that represents a single element in the collection.
    /// </summary>
    [ConfigurationCollection(typeof(UrlGroupElement))]
    public class MedGroupElementCollection : ConfigurationElementCollection
    {
        public UrlGroupElement this[int index]
        {
            get => (UrlGroupElement)BaseGet(index);
            set
            {
                if (BaseGet(index) != null)
                    BaseRemoveAt(index);
                BaseAdd(index, value);
            }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new UrlGroupElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((UrlGroupElement)element).Name;
        }
    }
    //Extend the ConfigurationElement class.  This class represents a single element in the collection.
    //Create a property for each xml attribute in your element.
    //Decorate each property with the ConfigurationProperty decorator.  See MSDN for all available options.
    public class UrlGroupElement : ConfigurationElement
    {
        [ConfigurationProperty("id", IsRequired = true)]
        public int Id
        {
            get => (int)this["id"];
            set => this["id"] = value;
        }
        [ConfigurationProperty("sequence", IsRequired = true)]
        public int Sequence
        {
            get => (int)this["sequence"];
            set => this["sequence"] = value;
        }
        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get => (string)this["name"];
            set => this["name"] = value;
        }
        [ConfigurationProperty("title", IsRequired = true)]
        public string Title
        {
            get => (string)this["title"];
            set => this["title"] = value;
        }
        [ConfigurationProperty("url", IsRequired = true)]
        public string Url
        {
            get => (string)this["url"];
            set => this["url"] = value;
        }
        [ConfigurationProperty("type", IsRequired = true)]
        public string Type
        {
            get => (string)this["type"];
            set => this["type"] = value;
        }
    }
}