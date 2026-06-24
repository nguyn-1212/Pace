using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Models
{
    public class LanguageDetailModel
    {
        public int ObjectId { get; set; }
        public string Table { get; set; }
        public int LanguageId { get; set; }
    }

    public class LanguageDetailUpdateModel
    {
        public int ObjectId { get; set; }
        public string Table { get; set; }
        public int LanguageId { get; set; }
        public Dictionary<string, string> Properties { get; set; }
    }
}
