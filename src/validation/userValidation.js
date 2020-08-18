import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let updateInfo = [
    check("username", transValidation.update_username)
    .optional()//Cho phép người dùng có thể không thay đổi giá trị này mà vẫn không được chấp nhận, nếu không, hệ thống vẫn sẽ chạy và báo lỗi
    .isLength({min: 3, max: 17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender", transValidation.update_gender)
        .optional()
        .isIn(["male", "female"]),
    check("address", transValidation.update_address)
        .optional()
        .isLength({min: 3, max: 40}),
    check("phone", transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
];

let updatePassword = [
    check("currentPassword", transValidation.password_incorrect)
        .isLength({min: 8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*().,<>?;:'"`~])[A-Za-z\d!@#$%^&*().,<>?;:'"`~]{8,}$/),
    check("newPassword", transValidation.password_incorrect)
        .isLength({min: 8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*().,<>?;:'"`~])[A-Za-z\d!@#$%^&*().,<>?;:'"`~]{8,}$/),
    check("confirmNewPassword", transValidation.password_confirmation_incorrect)
        .custom((value, {req}) => value === req.body.newPassword)
];

module.exports = {
    updateInfo: updateInfo,
    updatePassword: updatePassword
}