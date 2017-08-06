var mongoose = require("mongoose");
var Campground = require("./models/gags");
var Comment = require("./models/comments");

var data = [
    {
        name: "Cloud's rest",
        images: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel interdum sem, et porttitor tellus. Suspendisse vehicula ante dapibus ex faucibus pretium. Suspendisse quis ullamcorper turpis. Maecenas auctor id ipsum sed feugiat. Ut elementum lorem scelerisque lacinia elementum. Cras rhoncus nibh turpis, eget suscipit urna ornare a. Maecenas quis neque sollicitudin, efficitur enim quis, consectetur eros."
    },
     {
        name: "Blue beach",
        images: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel interdum sem, et porttitor tellus. Suspendisse vehicula ante dapibus ex faucibus pretium. Suspendisse quis ullamcorper turpis. Maecenas auctor id ipsum sed feugiat. Ut elementum lorem scelerisque lacinia elementum. Cras rhoncus nibh turpis, eget suscipit urna ornare a. Maecenas quis neque sollicitudin, efficitur enim quis, consectetur eros."
    },
     {
        name: "General forest",
        images: "https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel interdum sem, et porttitor tellus. Suspendisse vehicula ante dapibus ex faucibus pretium. Suspendisse quis ullamcorper turpis. Maecenas auctor id ipsum sed feugiat. Ut elementum lorem scelerisque lacinia elementum. Cras rhoncus nibh turpis, eget suscipit urna ornare a. Maecenas quis neque sollicitudin, efficitur enim quis, consectetur eros."
    }

];
//Erases all campgrounds
function seeds(){
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("all data removed");
        //Add campgrounds
         data.forEach(function(seed){
         Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else {
                console.log("Added");
                //Create comments
                Comment.create(
                    {
                        text: "Only internet is missing here!",
                        author: "Homer"
                    }, function(err, comment) {
                        if(err){
                            console.log(err)
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Comment created");
                        }
                        
                    }
                )
            }
        })
    })
    }
    //Add campgrounds
   
    
});
}

module.exports = seeds;