var mongoose = require("mongoose");
var NotificationSchema = new mongoose.Schema({
    text:String,
});
module.exports = mongoose.model("Notification",NotificationSchema);