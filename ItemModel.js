var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BusSchema = new Schema({
  Name:String,
  ShortName:String,
  Latitude:Number,
  Longitude:Number,
  Description:String,
  ParentId:String,
  Color:String
});

module.exports = {
  getModel: function getModel(connection) {
    return connection.model("BusModel", BusSchema);
  }
};
