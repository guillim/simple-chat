# Simple Chat window: the starter point to build your own chat, in seconds

Note: was modified from the original version of cesarve77. so all this bellow may be slightly different now.

## Features

- Very simple api chat window
- your are connected with your default meteorID
- you need to give a roomId as
- auto scroll on new message
- load more button
- Avatar based on the username

## Installing

    $ meteor add guillim:simple-chat

## Usage

just paste the template

``` 
{{> SimpleChatMessageIcon roomId=roomId}} 
```


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
