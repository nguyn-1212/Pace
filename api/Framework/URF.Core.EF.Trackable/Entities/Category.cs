namespace URF.Core.EF.Trackable.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class CategoryCore : BaseCoreEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
