using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace KnowtShare
{
    public class ShapeHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
        }


        private static readonly ConcurrentDictionary<string, object> _connections = new ConcurrentDictionary<string, object>();

        #region Connection Methods
        public override Task OnConnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.All.clientCountChanged(_connections.Count);
        }

        public override Task OnReconnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.All.clientCountChanged(_connections.Count);
        }

        public override Task OnDisconnected()
        {
            object value;
            _connections.TryRemove(Context.ConnectionId, out value);
            return Clients.All.clientCountChanged(_connections.Count);
        }

        #endregion


        //http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-server#groupsfromhub

        public Task JoinSessionGroup(string sessionKey)
        {
            return Groups.Add(Context.ConnectionId, sessionKey);
        }

        //public async Task JoinGroup(string groupName)
        //{
        //    await Groups.Add(Context.ConnectionId, groupName);
        //    Clients.Group(groupname).addContosoChatMessageToPage(Context.ConnectionId + " added to group");
        //}

        public Task LeaveSessionGroup(string sessionKey)
        {
            return Groups.Remove(Context.ConnectionId, sessionKey);
        }


        public void AuthorPayloadKnowtify(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).payloadKnowtify(sessionKey, userId, payload);
        }

        public void AuthorPayloadAdded(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).payloadAdded(sessionKey, userId, payload);
        }

        public void AuthorPayloadDeleted(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).payloadDeleted(sessionKey, userId, payload);
        }

        public void AuthorChangedModel(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).updateModel(sessionKey, userId, payload);
        }

        public void AuthorReparentModelTo(string sessionKey, string uniqueID, string oldParentID, string newParentID)
        {
            Clients.OthersInGroup(sessionKey).parentModelTo(sessionKey, uniqueID, oldParentID, newParentID);
        }

        public void AuthorMovedShapeTo(string sessionKey, string uniqueID, double pinX, double pinY, double angle)
        {
            Clients.OthersInGroup(sessionKey).repositionShapeTo(sessionKey, uniqueID, pinX, pinY, angle);
        }

        //methods to syncrinize workspaces

        public async Task PlayerCreateSession(string sessionKey, string userId, string payload)
        {
            await Groups.Add(Context.ConnectionId, sessionKey);
            Clients.OthersInGroup(sessionKey).authorReceiveJoinSessionFromPlayer(sessionKey, userId, payload);
        }

        public async Task PlayerJoinSession(string sessionKey, string userId, string payload)
        {
            await Groups.Add(Context.ConnectionId, sessionKey);
            Clients.OthersInGroup(sessionKey).authorReceiveJoinSessionFromPlayer(sessionKey, userId, payload);
        }


        public void PlayerExitSession(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).ReceiveExitSessionFromPlayer(sessionKey, userId, payload);
            LeaveSessionGroup(sessionKey);
        }

        public void AuthorSendJoinSessionModelToPlayers(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).playerReceiveJoinSessionModel(sessionKey, userId, payload);
        }


        public void SendPing(string sessionKey, string sender, string senderId)
        {
            Clients.All.receivePing(sessionKey, sender, senderId);
        }

        public void SendMessage(string sessionKey, string sender, string senderId, string textMessage)
        {
            Clients.All.receiveMessage(sessionKey, sender, senderId, textMessage);
        }

        public void AuthorInvite(string sessionKey, string author, string authorId, string player, string playerId)
        {
            Clients.Others.receiveInvitation(sessionKey, player, playerId, author, authorId);
        }

        public void PlayerRSVP(string sessionKey, string player, string playerId, string author, string authorId, string payload)
        {
            Clients.Others.receiveRSVP(sessionKey, player, playerId, author, authorId, payload);
        }

        public void AuthorRequestModelFromPlayer(string sessionKey, string author, string authorId)
        {
            Clients.OthersInGroup(sessionKey).sendModelToAuthor(sessionKey, author, authorId);
        }

        public void PlayerSendModelToAuthor(string sessionKey, string player, string playerId, string payload)
        {
            Clients.OthersInGroup(sessionKey).authorReceiveModelFromPlayer(sessionKey, player, playerId, payload);
        }


        public void AuthorSendModelToPlayers(string sessionKey, string author, string authorId, string payload)
        {
            Clients.OthersInGroup(sessionKey).playersReceiveSynchronizedModelFromAuthor(sessionKey, author, authorId, payload);
        }


        public void PlayerInviteSelf(string userId, string payload)
        {
            Clients.Others.selfReceiveInviteFromPlayer(userId, payload);
        }

        public void SelfSendModelToPlayers(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).playerReceiveSynchronizedModelSelf(sessionKey, userId, payload);
        }


        public void AuthorClearSession(string sessionKey, string author, string authorId, string payload)
        {
            Clients.OthersInGroup(sessionKey).playersReceiveClearSessionFromAuthor(sessionKey, author, authorId, payload);
        }



    }
}