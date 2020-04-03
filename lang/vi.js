export const transValidation = {
  email_incorrect: "Email phải có dạng example@mail.com",
  gender_incorrect: "Có vấn đề với trường giới tính bạn đã chọn",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu nhập lại không trùng với mật khẩu đã nhập", 
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin răng điều này là hiểu nhầm, vui lòng liên hệ lại với bộ phận hỗ trợ của chúng tôi.",
  account_not_active: "Email này đã được đăng ký nhưng chưa được kích hoạt, vui lòng kiểm tra email của bạn",
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để kích hoạt tài khoản trước khi đăng nhập. Xin cảm ơn!`;
  }
};