import UserModel from "./../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess, transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) =>{
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt != null){
        return reject(transErrors.account_removed);
      }
      if (!userByEmail.local.isActive){
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0], //Lấy phần đầu email làm tên người dùng
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };

    let user = await UserModel.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    //Send email
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async (error) => {
        //Nếu có Error thì ta phải remove user, vì nếu user đã tạo mà gửi mail không thành công
        //Khi người dùng đăng ký lại thì sẽ bị bắt vào các trường hợp Verify
        await UserModel.removeById(user._id);
        console.log(error);
        reject(transMail.send_failed);
      });
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
    if (!userByToken) {
      return reject(transErrors.token_undefined);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_activated);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount
};