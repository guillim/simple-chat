import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Chats} from './collections'
import {SimpleChat} from './config'
import moment from 'moment'
import './window.css'
import './window.html'
import './spinner.css'
import './spinner.html'


SimpleChat.scrollToEnd = function (template) {
    Template.SimpleChatWindow.endScroll = true;
    template.$(".direct-chat-messages").animate({scrollTop: template.$('.scroll-height').height()}, 300);
    template.$('.direct-chat-messages').trigger('scroll')

}

Template.SimpleChatWindow.onCreated(function () {

    this.initializing = true;
    this.limit = new ReactiveVar(this.limit || SimpleChat.options.limit)
    this.showViewed = this.data.showViewed != undefined ? this.data.showViewed : SimpleChat.options.showViewed
    this.showJoined = this.data.showJoined != undefined ? this.data.showJoined : SimpleChat.options.showJoined
    this.showReceived = this.data.showReceived != undefined ? this.data.showReceived : SimpleChat.options.showReceived
    this.increment = this.limit.get()
    //accept function (for reactive data) or plain data
    if (typeof this.data.roomId != "function")
        this.getRoomId = ()=> {
            return this.data.roomId + ""
        }
    else
        this.getRoomId = this.data.roomId

    if (typeof this.data.username != "function")
        this.getUsername = ()=> {
            return this.data.username + ""
        }
    else
        this.getUsername = this.data.username

    if (typeof this.data.name != "function")
        this.getName = ()=> {
            return this.data.name || this.getUsername()
        }
    else
        this.getName = this.data.name
    if (typeof this.data.avatar != "function")
        this.getAvatar = ()=> {
            return this.data.avatar
        }
    else
        this.getAvatar = this.data.avatar

    this.autorun(() => {
        this.subscribe("simpleChats", this.getRoomId(), this.limit.get());
        this.subscribing = true;
    })
    // Meteor.call("SimpleChat.join", this.getRoomId(), this.getUsername(), this.getAvatar(), this.getName())
});

Template.SimpleChatWindow.onRendered(function () {
    var self = this
    self.endScroll = true;
    this.$('.direct-chat-messages').scroll(function (event) {
        if (event.currentTarget.scrollHeight - event.currentTarget.scrollTop < 350) {
            self.endScroll = true;
        } else {
            self.endScroll = true;
        }
    })
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            this.subscribing = false;
            /**
             * the setTimeOut is to be sure that dom already update, and make the real calc of scroñ
             */
            // this.$('.direct-chat-messages').scrollTop(this.$('.scroll-height')[0].scrollHeight - this.scroll)


        } else {
            this.subscribing = true;
            if (this.initializing)
                Meteor.setTimeout(()=> {
                    this.initializing = false
                    // SimpleChat.scrollToEnd(this)
                },50)

        }


    })

    $(window).on('SimpleChat.newMessage', (e, id, doc)=> {
        if (this.endScroll) {
            SimpleChat.scrollToEnd(this)
        }
      })
})


Template.SimpleChatWindow.helpers({
    placeholder: function () {
        return Template.instance().data.placeholder || SimpleChat.options.texts.placeholder
    },
    button: function () {
        return Template.instance().data.button || SimpleChat.options.texts.button
    },
    join: function () {
        return Template.instance().data.join || SimpleChat.options.texts.join
    },
    left: function () {
        return Template.instance().data.left || SimpleChat.options.texts.left
    },
    room: function () {
        return Template.instance().data.room || SimpleChat.options.texts.room
    },
    showJoined: function () {
        return Template.instance().showJoined
    },
    showViewed: function () {
        return Template.instance().showViewed
    },
    showReceived: function () {
        return Template.instance().showReceived
    },
    simpleChats: function () {
        var template = Template.instance()
        var chats = Chats.find({roomId: template.getRoomId()}, {sort: {date: 1}})


        let handleChanges = chats.observeChanges({
            added: (id, doc) => {
                const username = template.getUsername()
                if (template.showReceived) {
                    if (!_.contains(doc.receivedBy, username) && doc.message) {
                        Meteor.call('SimpleChat.messageReceived', id, username)
                    }
                }
                if (!template.subscribing) {
                    $(window).trigger('SimpleChat.newMessage', [id, doc])
                }
            }
        });

        return chats;
    },
    isSimpleChatsEmpty: function () {
       var template = Template.instance();
       var chats = Chats.findOne({
           roomId: template.getRoomId()
       });
       return typeof chats == "undefined" ? true : false;
   },
    viewedMe: function () {
        return Template.instance().getUsername() == this.username || _.contains(this.viewedBy, Template.instance().getUsername())
    },
    hasMore: function () {
        return Chats.find({roomId: Template.instance().getRoomId()}, {
                sort: {date: 1},
                limit: Template.instance().limit.get()
            }).count() === Template.instance().limit.get()
    },
    notificationCount: function () {
        var template = Template.instance();
        var lastMsg = Chats.findOne({
            username: template.getUsername(),
            roomId: template.getRoomId()
        }, {
            sort: {
                date: -1
            },
            limit: 1
        });

        if (!lastMsg) {
            return 0;
        }

        var msgs = Chats.find({
            roomId: template.getRoomId(),
            date: {
                $gte: lastMsg.date
            }
        }).fetch();
        return msgs.length - 1 >= 0 ? msgs.length - 1 : 0;
    },
    me: function () {
        return Template.instance().getUsername() == this.username
    }
    ,
    formatDate: function (date) {
        return moment(date).calendar(null, {
            sameDay: 'hh:mm a',
            lastDay: '[Yesterday at ]hh:mm a',
            lastWeek: '[Last] dddd[ at ]hh:mm a',
            sameElse: 'DD/MM/YYYY hh:mm a'
        });
    }
})
;


Template.SimpleChatWindow.events({
    'click #simple-chat-load-more': function () {
        let template = Template.instance()
        template.subscribing = true;
        template.limit.set(template.limit.get() + template.increment)
        template.scroll = template.$('.scroll-height')[0].scrollHeight
        template.$(".direct-chat-messages").animate({scrollTop: 0}, 0);
        template.$('.direct-chat-messages').trigger('scroll')

    },
    'keydown #simple-chat-message': function (event) {
        var $message = $(event.currentTarget)
        if (event.which == 13 && $message.val() != '') { // 13 is the enter key event
            event.preventDefault()
            Template.instance().$('button#message-send').click()
        }
    },
    'click button#message-send': function () {
        let template = Template.instance()
        var $message = template.$('#simple-chat-message')

        if ($message.val() != '') {
            var text = $message.val()
            $message.val('');
            SimpleChat.scrollToEnd(template)
            Meteor.call('SimpleChat.newMessage', text, template.getRoomId(), template.getUsername(), template.getAvatar(), template.getName(), this.custom, function (err) {
                if (err) {
                    console.error(err)
                    $message.val(text);
                }
            })
        }

    }
});





Template.SimpleChatMessageIcon.helpers({
    username: function () {
        var user = Meteor.users.findOne({
            _id: Meteor.userId()
        });
        return globalFunction_getUsername(user, 'no username');
    },
    ligue: function () {
        return Template.currentData().uniqueLigueId;
    },
    messageCount: function(){
        var user = Meteor.users.findOne({            _id: Meteor.userId()        });
        var username = globalFunction_getUsername(user, 'no username');
        var lastMsg = Chats.findOne({viewedBy: user._id,roomId: Template.currentData().uniqueLigueId}  ,   { sort: { date: -1  }, limit: 1 });
        if (!lastMsg) {     var msgs = Chats.find({ roomId: Template.currentData().uniqueLigueId },{limit: 99,fields: {roomId: 1}}).fetch();
        }else {             var msgs = Chats.find({ roomId: Template.currentData().uniqueLigueId, date: {$gte: lastMsg.date}},{limit: 99,fields: {roomId: 1}}).fetch();
        }
        return msgs.length - 1 >= 0 ? msgs.length - 1 : 0;
    },
});


Template.SimpleChatMessageIcon.events({
    'click .navbar-nav': function () {
        // let template = Template.instance()
        // template.scroll = template.$('.scroll-height')[0].scrollHeight
        var user = Meteor.users.findOne({          _id: Meteor.userId()      });
        var username = globalFunction_getUsername(user, 'no username');
        var lastMsg = Chats.findOne({ roomId: Template.currentData().uniqueLigueId }   ,   {sort: { date: -1 }, limit: 1 });
        if(lastMsg){   Meteor.call("SimpleChat.markMessageAsViewedForUser",  lastMsg._id, user._id )    }
    },
});


Template.SimpleChatAvatar.helpers({
     options: function(){
       let coeff = 5;
       let username = (Template.currentData().username) ? Template.currentData().username : 'default' ;
  		 let size = (Template.currentData().size) ? Template.currentData().size : 50 ;
       let coeffHeight_width = (Template.currentData().coeffHeight_width) ? Template.currentData().coeffHeight_width : 1 ;
  		 return {
         name:username,
         textColor:'#ffffff',
         width:size,
         height:size/coeffHeight_width,
         charCount:6,
         fontSize:size/coeff,
         fontWeight:800,
       }
     }
  });
