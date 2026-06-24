using System.Collections.Generic;

namespace URF.Core.Services.Hubs
{
    public class HubUser
    {
        public int Id { get; set; }
        public bool Online { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public List<int> Teams { get; set; }
        public List<int> Groups { get; set; }
        public List<string> ConnectionIds { get; set; }
    }
}
