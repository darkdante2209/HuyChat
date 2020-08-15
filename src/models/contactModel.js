import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null},
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  
  /**
   * Tìm tất cả bản ghi liên quan đến user.
   * @param {*} userId 
   */
  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  /**
   * Kiểm tra tồn tại bản ghi liên hệ giữa 2 users
   * @param {string} userId 
   * @param {string} contactId 
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },

  /**
   * Xóa contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec();
  },

  /**
   * Xóa lời mời kết bạn gửi đi
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId}
      ]
    }).exec();
  },

  /**
   * Xóa lời mời kết bạn nhận được
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * Châp nhận lời mời kết bạn nhận được
   * @param {string} userId of current user
   * @param {string} contactId 
   */
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }, {"status": true}).exec();
  },

  /**
   * Lấy contact bằng user id
   * @param {string} userId 
   * @param {number} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();//sort -1 là mới nhất
  },

  /**
   * Lấy contact sent bằng user id
   * @param {string} userId 
   * @param {number} limit 
   */
  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * Lấy contact nhận được bằng user id
   * @param {string} userId 
   * @param {number} limit 
   */
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

    /**
   * Đếm tất cả số contact bằng user id
   * @param {string} userId 
   */
  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },

  /**
   * Đếm tất cả số contact sent bằng user id
   * @param {string} userId 
   */
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * Đếm tất cả số contact nhận được bằng user id
   * @param {string} userId 
   */
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * Xem thêm danh sách bạn bè
   * @param {string} userId 
   * @param {number} skip 
   * @param {number} limit 
   */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   * Xem thêm danh sách liên hệ đã gửi
   * @param {string} userId 
   * @param {number} skip 
   * @param {number} limit 
   */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   * Xem thêm danh sách yêu cầu kết bạn đã nhận
   * @param {string} userId 
   * @param {number} skip 
   * @param {number} limit 
   */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  }
};

module.exports = mongoose.model("contact", ContactSchema);