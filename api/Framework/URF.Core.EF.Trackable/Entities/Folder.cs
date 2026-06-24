using System;
using System.Collections.Generic;

namespace URF.Core.EF.Trackable.Entities
{
    public class Folder : BaseEntity
    {
        public string Name { get; set; }
        public int? ParentId { get; set; }
        public DateTime DateTime { get; set; }

        // virtual
        public virtual Folder Parent { get; set; }
        public virtual List<File> Files { get; set; }
        public virtual List<Folder> Folders { get; set; }
    }
}
