using System.Collections.Generic;

namespace Lazy.Travel.Api.Hubs
{
    public class HubUser
    {
        public int Id { get; set; }
        public bool Online { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public List<string> ConnectionIds { get; set; }
    }
}
