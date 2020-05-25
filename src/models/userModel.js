import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;
let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: Number, default: null},
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

  findUserById(id) {
    return this.findById(id).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({"google.uid": uid}).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken": token},
      {"local.isActive": true, "local.verifyToken": null}
    ).exec();
  }
};
//Methods: Khi đã có bản ghi, gọi đến phương thức trong methods để thực hiện công việc
UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); //Return a promise has result is true or false
  }
};

module.exports = mongoose.model("user", UserSchema);