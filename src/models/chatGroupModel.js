import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: {type: Number, min: 3},
  messageAmount: {type: Number, default: 0},
  userId: String, //Id of room master
  members: [
    {userId: String}
  ],
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  deletedAt: {type: Number, default: null},
});

ChatGroupSchema.statics = {

  createNew(item) {
    return this.create(item);
  },
  /**
   * Lấy ra các item nhóm chat bằng userId và limit
   * @param {string} userId userId hiện tại
   * @param {number} limit 
   */
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}//Nếu có userId trùng với điều kiện thì elemMatch sẽ lấy cả mảng chứa userId đó
    }).sort({"updatedAt": -1}).limit(limit).exec();
  },

  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  /**
   * Update chat group khi có tin nhắn mới
   * @param {string} id của group chat
   * @param {number} newMessageAmount 
   */
  updateWhenHasNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      "messageAmount": newMessageAmount,
      "updatedAt": Date.now()
    }).exec();
  },

  getChatGroupIdsByUser(userId) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}}//Nếu có userId trùng với điều kiện thì elemMatch sẽ lấy cả mảng chứa userId đó
    },{_id: 1}).exec();
  }
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);