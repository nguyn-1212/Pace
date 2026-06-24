using System;

namespace URF.Core.EF.Trackable.Entities
{
    public class File : BaseEntity
    {
        public long Size { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int FolderId { get; set; }
        public string Extension { get; set; }
        public DateTime DateTime { get; set; }

        // virtual
        public virtual Folder Folder { get; set; }
    }
}
