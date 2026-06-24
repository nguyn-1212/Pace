using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System;

namespace URF.Core.EF.Trackable
{
    public interface IMongoEntity
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
    }
    public interface IMongoExEntity
    {
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public object CreatedBy { get; set; }
        public object UpdatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
    public interface IMongoTenantEntity : IMongoExEntity
    {
        [MaxLength(100)]
        public string TenantId { get; set; }
    }

    public abstract class MongoEntity : IMongoEntity
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
    }
    public abstract class MongoExEntity : MongoEntity, IMongoExEntity
    {
        public MongoExEntity()
        {
            IsActive = true;
            IsDelete = false;
            CreatedDate = DateTime.Now;
        }

        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public object CreatedBy { get; set; }
        public object UpdatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
    public abstract class MongoTenantEntity : MongoEntity, IMongoTenantEntity
    {
        public MongoTenantEntity()
        {
            IsActive = true;
            IsDelete = false;
            CreatedDate = DateTime.Now;
        }

        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public object CreatedBy { get; set; }
        public object UpdatedBy { get; set; }

        [MaxLength(100)]
        public string TenantId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}   