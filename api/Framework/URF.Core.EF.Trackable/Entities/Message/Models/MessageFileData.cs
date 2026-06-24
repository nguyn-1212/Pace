using URF.Core.EF.Trackable.Entities.Message.Enums;

namespace URF.Core.EF.Trackable.Entities.Message.Models
{
    public class MessageFileData
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public double Size { get; set; }
        public MessageFileType FileType { get; set; }
    }
}
