using MongoDB.Driver;

namespace URF.Core.Abstractions
{
    public interface IMongoContext
    {
        IMongoDatabase Database { get; }
    }
}
