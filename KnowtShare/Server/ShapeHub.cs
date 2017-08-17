using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace KnowtShare
{
    public class ShapeHub : Hub
    {
        public void sayHello()
        {
            Clients.All.hello();
        }

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.recieve(name, message);
        }


        private static readonly ConcurrentDictionary<string, object> _connections = new ConcurrentDictionary<string, object>();

        #region Connection Methods
        public override Task OnConnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            var result = Clients.All.clientCountChanged(_connections.Count, "connected", this.GroupCount.Count);
            base.OnConnected();
            return result;
        }

        public override Task OnReconnected()
        {

            _connections.TryAdd(Context.ConnectionId, null);
            var result = Clients.All.clientCountChanged(_connections.Count, "reconnected", this.GroupCount.Count);
            base.OnReconnected();
            return result;
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            object value;
            _connections.TryRemove(Context.ConnectionId, out value);
            var result = Clients.All.clientCountChanged(_connections.Count, "disconnected", this.GroupCount.Count);
            base.OnDisconnected(stopCalled);
            return result;
        }

        #endregion


        //http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-server#groupsfromhub

        ConcurrentDictionary<string, int> GroupCount = new ConcurrentDictionary<string, int>();

        public Task JoinSessionGroup(string sessionKey)
        {
            var count = GroupCount.GetOrAdd(sessionKey, 0);
            GroupCount.TryUpdate(sessionKey, count + 1, count);
            return Groups.Add(Context.ConnectionId, sessionKey);
        }

        public Task LeaveSessionGroup(string sessionKey)
        {
            var count = GroupCount.GetOrAdd(sessionKey, 0);
            GroupCount.TryUpdate(sessionKey, count - 1, count);
            return Groups.Remove(Context.ConnectionId, sessionKey);
        }

        public int SessionCount(string sessionKey)
        {
            int count = 0;
            GroupCount.TryGetValue(sessionKey, out count);
            return count;
        }

        public void AuthorSessionCount(string sessionKey, string userId)
        {
            //should only callback if this session key has other players
            var total = SessionCount(sessionKey);
            Clients.Caller.playerSessionCount(sessionKey, userId, total);
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

        public void AuthorReparentModelTo(string sessionKey, string uniqueID, string oldParentID, string newParentID, string location)
        {
            Clients.OthersInGroup(sessionKey).parentModelTo(sessionKey, uniqueID, oldParentID, newParentID, location);
        }

        public void AuthorMovedShapeTo(string sessionKey, string uniqueID, double pinX, double pinY, double angle)
        {
            Clients.OthersInGroup(sessionKey).repositionShapeTo(sessionKey, uniqueID, pinX, pinY, angle);
        }

        //methods to syncrinize workspaces

        public async Task PlayerCreateSession(string sessionKey, string userId, string payload)
        {
            await JoinSessionGroup(sessionKey);
            Clients.OthersInGroup(sessionKey).authorReceiveJoinSessionFromPlayer(sessionKey, userId, payload);
            Clients.Caller.confirmCreateSession(sessionKey, userId);
        }

        public async Task PlayerJoinSession(string sessionKey, string userId, string payload)
        {
            await JoinSessionGroup(sessionKey);
            Clients.OthersInGroup(sessionKey).authorReceiveJoinSessionFromPlayer(sessionKey, userId, payload);
            Clients.Caller.confirmJoinSession(sessionKey, userId);
        }


        public void PlayerExitSession(string sessionKey, string userId, string payload)
        {
            Clients.OthersInGroup(sessionKey).receiveExitSessionFromPlayer(sessionKey, userId, payload);
            LeaveSessionGroup(sessionKey);
            Clients.Caller.confirmExitSession(sessionKey, userId);
        }

        public void AuthorResyncSession(string sessionKey, string userId)
        {
            //should only callback if this session key has other players
            var total = SessionCount(sessionKey);
            Clients.Caller.confirmResyncSession(sessionKey, userId, total);
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