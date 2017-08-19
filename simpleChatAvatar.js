Template.simpleChatAvatar.helpers({
     options: function(){
       let coeff = 5;
       let username = (Template.currentData().username) ? Template.currentData().username : 'default' ;
  		 let size = (Template.currentData().size) ? Template.currentData().size : 50 ;
       let coeffHeight_width = (Template.currentData().coeffHeight_width) ? Template.currentData().coeffHeight_width : 1 ;
  		 return {
         name:username,
         textColor:'#ffffff',
        //  color:'#44cc2e',
         width:size,
         height:size/coeffHeight_width,
         charCount:6,
         fontSize:size/coeff,
         fontWeight:800,
        //  radius:0,
        //  seed:3333
       }
     }
  });
