import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Match} from 'meteor/check'
import {Chats} from './collections'
import {SimpleChat} from './config'
Meteor.methods({
    "SimpleChat.newMessage": function (message, roomId, username, avatar, name, custom) {
        check(message, String);
        check(roomId, String);
        check(username, Match.Maybe(String));
        check(avatar, Match.Maybe(String));
        check(name, Match.Maybe(String));
        check(custom, Match.Any );

        this.unblock()
        if (!SimpleChat.options.allow.call(this, message, roomId, username, avatar, name))
            throw new Meteor.Error(403, "Access deny")
        message=_.escape(message)

        const msg={
            message,
            roomId,
            username,
            name,
            sent: !this.isSimulation,
            receivedBy: [],
            receivedAll: false,
            viewedBy: [],
            viewedAll: false,
            userId: this.userId,
            avatar,
            custom,
            date: new Date()
        }
        msg._id=Chats.insert(msg)
        SimpleChat.options.onNewMessage(msg)
        return msg
    },
    "SimpleChat.notificationCount": function (roomId, username) {
        check(roomId, String);
        check(username, Match.Maybe(String));
        this.unblock();
        if (!SimpleChat.options.allow.call(this, 'message', roomId, username, null, username))
            throw new Meteor.Error(403, "Access deny");

        var lastMsg = Chats.findOne(
            {
              username: username,
              roomId: roomId
            },
            {
              sort: {  date: -1 },
              limit: 1
            });
            // console.log(lastMsg);console.log(lastMsg.date);

        var msgs = Chats.find({
            roomId: roomId,
            date: {
                $gte: lastMsg.date
            }
        }).fetch();
        return msgs.length - 1 >= 0 ? msgs.length - 1 : 0;
    } 
});
