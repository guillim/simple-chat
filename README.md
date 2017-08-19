# Simple Chat window: the starter point to build your own chat, in seconds

Note: was modified from the original version of cesarve77. so all this bellow may be slightly different now.

## Features

- Very simple api chat window
- Multiple chat in the same view
- auto scroll on new message
- load more button

## Demo

### Working demo
[http://simpleschat.herokuapp.com/]

### Demo source

[https://github.com/guillim/demo-simple-chat]

## Installing

    $ meteor add guillim:simple-chat

## Usage

just paste the template

    {{>SimpleChatWindow roomId=<roomId> username=<username> name=<name> avatar=<avatar> limit=<limit> showViewed=<showViewed>  showJoined=<showJoined> publishChats=<publishChats> allow=<allow> custom=<custom>}}  


Where
- \<roomId>: required, plain string or function return a unique id for each room ,
- \<username>: required, plain string or function  return a string with unique user id or user name or any unique identifier  ,
- \<name>: optional, plain string or function  return a string with display name, default  username value
- \<avatar>: optional,plain string or function  return a string avatar image source
- \<limit>: optional number fot limit the last "n" messages for subscription, default 50
- \<showViewed>: optional boolean for showing or not when the messages are viewed (like whatsapp). Default false (this feature can use a lot of server resource), default false
- \<showReceived>: optional boolean for showing or not when the messages are received (like whatsapp) (this feature can use a lot of server resource), default false
- \<showJoined>: optional boolean for showing message when some user join to a room, default false
- \<publishChats>: optional function return true for allow publish message, or false to deny this function receive as arguments (roomId, limit) and context is publish context, default return true
- \<allow>: optional function return true for allow insert new message or false to deny, this function receive as argumetns (message, roomId, username, avatar, name) and context is methods context, default return true
- \<custom>: optional any custom value
- \<loadMore>: text for load more button default 'Load More'
- \<placeholder>: text for input placeholder default 'Type message...'
- \<button>: text for button submit default 'Send'
- \<join>:  text for  message Join default  'Join to'
- \<left>:  text for  message left default  'Left the'
- \<room>:  text for  message Room defaut 'room'


Note: this values can be a literal a helper or template data

Example:

    {{>SimpleChatWindow roomId="free room" username=this.username limit=limit}}
    //roomIn is a literal
    //username is data template
    //limit is a helper


## Configure Globally

```

//somewhere in both (client and  server)
import {SimpleChat} from 'meteor/cesarve:simple-chat/config'

SimpleChat.configure ({
    texts:{
        loadMore: 'Load More',
        placeholder: 'Type message ...',
        button: 'send',
        join: 'Join to',
        left: 'Left the',
        room: 'room at'

    },
    limit: 5,
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function(roomId, limi){ //server
       //here the context is the same for a Publications, that mean you have access to this.userId who are asking for subscribe.
       // for example
       return isLoggedAndHasAccessToSeeMessage(this.userId)
    },
    allow: function(message, roomId, username, avatar, name){
       //here the context is the same for a Methods, thats mean you hace access to this.userId also
       // for example
       return isLoggedAndHasAccessSendMessages(this.userId)
        return true
    },
    onNewMessage:function(msg){  //both
    },
    onReceiveMessage:function(id, message, room){ //server

    },
    onJoin:function(roomId, username, name,date){  //server
    },
    onLeft:function(roomId, username, name,date) { //server
    }
})

```

this options can be overwrite individually on   {{>SimpleChatWindow roomId=\<roomId> username=\<username> avatar=\<avatar> limit=\<limit> showViewed=true  showJoined= true publishChats=publishChats allow=allow}} cd simple-
as you saw below

# Styling

Chat html was taken from https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html
with direct chat widget

#
