using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using URF.Core.EF.Trackable.Entities;
using URF.Core.Abstractions.Trackable;
using URF.Core.EF.Trackable.Entities.Message;
using URF.Core.Helper.Extensions;

namespace URF.Core.Services.Hubs
{
    public class NotifyHub : Hub, INotifyHub
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryX<UserTeam> _userTeamRepository;
        private readonly IRepositoryX<UserGroup> _userGroupRepository;
        public readonly static List<HubUser> Users = new List<HubUser>();

        public NotifyHub(
            UserManager<User> userManager,
            IRepositoryX<UserTeam> userTeamRepository,
            IRepositoryX<UserGroup> userGroupRepository)
        {
            _userManager = userManager;
            _userTeamRepository = userTeamRepository;
            _userGroupRepository = userGroupRepository;
        }


        public List<string> GetAllConnectionIds()
        {
            return Users
                .Where(c => c.ConnectionIds != null && c.ConnectionIds.Count > 0)
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionId(string email)
        {
            if (string.IsNullOrEmpty(email)) return new List<string>();
            return Users.Where(c => c.Email == email)
                .Where(c => c.ConnectionIds != null)
                .Where(c => c.ConnectionIds.Count > 0)
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionIdById(int userId)
        {
            if (userId == 0) return new List<string>();
            return Users.Where(c => c.Id == userId)
                .Where(c => c.ConnectionIds != null)
                .Where(c => c.ConnectionIds.Count > 0)
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionIdsByTeam(int teamId)
        {
            if (teamId == 0) return new List<string>();
            return Users
                .Where(c => c.ConnectionIds != null && c.ConnectionIds.Count > 0)
                .Where(c => c.Teams != null && c.Teams.Count > 0)
                .Where(c => c.Teams.Contains(teamId))
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionIdsByGroup(int groupId)
        {
            if (groupId == 0) return new List<string>();
            return Users
                .Where(c => c.ConnectionIds != null && c.ConnectionIds.Count > 0)
                .Where(c => c.Groups != null && c.Groups.Count > 0)
                .Where(c => c.Groups.Contains(groupId))
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionIds(List<string> emails)
        {
            if (emails == null || emails.Count == 0) return new List<string>();
            return Users
                .Where(c => emails.Contains(c.Email))
                .Where(c => c.ConnectionIds != null)
                .Where(c => c.ConnectionIds.Count > 0)
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }
        public List<string> GetConnectionIdByIds(List<int> userIds)
        {
            if (userIds == null || userIds.Count == 0) return new List<string>();
            return Users
                .Where(c => userIds.Contains(c.Id))
                .Where(c => c.ConnectionIds != null)
                .Where(c => c.ConnectionIds.Count > 0)
                .SelectMany(c => c.ConnectionIds)
                .Distinct()
                .ToList();
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                if (Context != null)
                {
                    var connectionId = Context.ConnectionId;
                    var exists = Users
                        .Where(c => !c.ConnectionIds.IsNullOrEmpty())
                        .Any(c => c.ConnectionIds.Contains(connectionId));
                    if (!exists)
                    {
                        User user = null;
                        var httpContext = Context.GetHttpContext();
                        var phone = httpContext.Request.Query["phone"];
                        if (!string.IsNullOrEmpty(phone))
                            user = await _userManager.FindByNameAsync(phone);
                        else
                        {
                            var email = httpContext.Request.Query["email"];
                            if (!string.IsNullOrEmpty(email))
                                user = await _userManager.FindByNameAsync(email) ?? await _userManager.FindByEmailAsync(email);
                        }
                        if (user != null)
                        {
                            // Teams
                            var teams = _userTeamRepository.Queryable()
                                .Where(c => !c.IsDelete.HasValue || !c.IsDelete.Value)
                                .Where(c => !c.IsActive.HasValue || c.IsActive.Value)
                                .Where(c => c.UserId == user.Id)
                                .Select(c => c.TeamId)
                                .Distinct()
                                .ToList();

                            // Groups
                            var groups = _userGroupRepository.Queryable()
                                .Where(c => !c.IsDelete.HasValue || !c.IsDelete.Value)
                                .Where(c => !c.IsActive.HasValue || c.IsActive.Value)
                                .Where(c => c.UserId == user.Id)
                                .Select(c => c.GroupId)
                                .Distinct()
                                .ToList();

                            var item = new HubUser
                            {
                                Id = user.Id,
                                Online = true,
                                Teams = teams,
                                Groups = groups,
                                Email = user.Email,
                                Phone = user.PhoneNumber,
                                ConnectionIds = new List<string> { Context.ConnectionId }
                            };
                            var itemDb = Users.FirstOrDefault(c => c.Id == user.Id);
                            if (itemDb != null)
                            {
                                if (itemDb.ConnectionIds.IsNullOrEmpty())
                                    itemDb.ConnectionIds = new List<string>();
                                while (itemDb.ConnectionIds.Count >= 3)
                                    itemDb.ConnectionIds.RemoveAt(0);
                                itemDb.ConnectionIds.Add(Context.ConnectionId);
                            }
                            else
                            {
                                lock (Users) Users.Add(item);
                            }
                        }
                    }
                    var hubUser = Users
                        .Where(c => !c.ConnectionIds.IsNullOrEmpty())
                        .FirstOrDefault(c => c.ConnectionIds.Contains(connectionId));
                    await Clients.All.SendAsync("online", hubUser);
                    await base.OnConnectedAsync();
                }
            }
            catch { }
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                if (Context != null)
                {
                    var connectionId = Context.ConnectionId;
                    var hubUser = Users
                        .Where(c => c.ConnectionIds != null)
                        .Where(c => c.ConnectionIds.Count > 0)
                        .FirstOrDefault(c => c.ConnectionIds.Contains(connectionId));
                    lock (Users) Users.RemoveAll(c => c.ConnectionIds.Contains(connectionId));
                    await Clients.All.SendAsync("offline", hubUser);
                    await base.OnDisconnectedAsync(exception);
                }
            }
            catch { }
        }
    }
}
