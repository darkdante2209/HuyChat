import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;
let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: String, default: null},
  address: {type: String, default: null},
  avatar: {type: String, default: "avatar-default.jpg"},
  role: {type: String, default:"user"},
  local: {
    email: {type: String, trim: true},
    password: String,
    isActive: {type: Boolean, default: false},
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  google: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null},
});

//Statics: Chỉ nằm trong phạm vị schema, chỉ giúp tìm ra bản ghi
UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({"local.email": email}).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  findByToken(token) {
    return this.findOne({"local.verifyToken": token}).exec();
  },

  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },

  findUserByIdForSessionToUse(id) {
    return this.findById(id, {"local.password": 0}).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({"google.uid": uid}).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();//return old item after update
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken": token},
      {"local.isActive": true, "local.verifyToken": null}
    ).exec();
  },

  /**
   * Tìm user để thêm vào contact
   * @param {array: id các tài khoản đã thêm vào} deprecatedUserIds 
   * @param {string: keyword search} keyword 
   */
  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$nin: deprecatedUserIds}},//nin=not in
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},//$regex là cú pháp của mongoose để tìm username gần giống keyword nhất.
          {"local.email": {"$regex": new RegExp(keyword, "i") }},//i trong RegExp để không phân biệt chữ hoa chữ thường
          {"facebook.email": {"$regex": new RegExp(keyword, "i") }},
          {"google.email": {"$regex": new RegExp(keyword, "i") }}
          
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();//1 có nghĩa là được lấy ra
  },

  getNormalUserDataById(id) {
    return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },

  /**
   * Tìm user để thêm vào group chat
   * @param {array: friend userIds} id các tài khoản đã thêm vào 
   * @param {string: keyword search} keyword 
   */
  findAllToAddGroupChat(friendIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$in: friendIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},//$regex là cú pháp của mongoose để tìm username gần giống keyword nhất.
          {"local.email": {"$regex": new RegExp(keyword, "i") }},//i trong RegExp để không phân biệt chữ hoa chữ thường
          {"facebook.email": {"$regex": new RegExp(keyword, "i") }},
          {"google.email": {"$regex": new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();//1 có nghĩa là được lấy ra
  },
};
//Methods: Khi đã có bản ghi, gọi đến phương thức trong methods để thực hiện công việc
UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); //Return a promise has result is true or false
  }
};

module.exports = mongoose.model("user", UserSchema);