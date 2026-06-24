using System.Collections.Generic;

namespace URF.Core.Services.Hubs
{
    public interface INotifyHub
    {

        public List<string> GetAllConnectionIds();
        public List<string> GetConnectionId(string email);
        public List<string> GetConnectionIdById(int userId);
        public List<string> GetConnectionIdsByTeam(int teamId);
        public List<string> GetConnectionIds(List<string> emails);
        public List<string> GetConnectionIdsByGroup(int groupId);
        public List<string> GetConnectionIdByIds(List<int> userIds);
    }
}
