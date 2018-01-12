# Simple Chat: get your own chat, in seconds

Note: was modified from the original version of cesarve77. so all this bellow may be slightly different now, and is still under construction. Feel free to ask by opening issues.

## Features

- Deadly simple: integrate the chat icon on top of your page, done.
- your are connected with your default meteorID
- auto scroll on new message
- load more button
- Avatar based on the username


- you need to give a roomId as


## Installing

    $ meteor add guillim:simple-chat

## Usage

just integrate the template

``` 
{{> SimpleChatMessageIcon roomId=roomId uniqueLigueId=roomId ligue=roomId}} 
```

the following parameters are required:
-roomId: shared between all members of the chat. Note that is is on you to generate this roomId and handle users who have access to this chat.

-uniqueLigueId: same, will be gatehered in further version

-ligue: same, will be gatehered in further version


## Configure Globally

```
//both (client and  server)
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
       return isLoggedAndHasAccessToSeeMessage(this.userId) // for example
    },
    allow: function(message, roomId, username, avatar, name){
       return isLoggedAndHasAccessSendMessages(this.userId) // for example
    },
    onNewMessage:function(msg){ }, //both
    onReceiveMessage:function(id, message, room){  }, //server
    onJoin:function(roomId, username, name,date){  }, //server 
    onLeft:function(roomId, username, name,date){  }  //server
})

```

this options can be overwrite individually on   {{>SimpleChatWindow roomId=\<roomId> username=\<username> avatar=\<avatar> limit=\<limit> showViewed=true  showJoined= true publishChats=publishChats allow=allow}} cd simple-
as you saw below
