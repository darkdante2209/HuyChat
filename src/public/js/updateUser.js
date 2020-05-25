let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 2097152;//byte = 2MB

        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg, jpeg hoặc png.", "error", 7); //7 là thời gian hiển thị báo lỗi
            $(this).val(null);
            return false;
        }
        if (fileData.size > limit) {
            alertify.notify("Ảnh upload tối đa cho phép là 1MB", "error", 7); //7 là thời gian hiển thị báo lỗi
            $(this).val(null);
            return false;
        }

        if (typeof (FileReader) != "undefined"){
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar",
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);
            let formData = new FormData();
            formData.append("avatar", fileData);//avatar là name của input thay đổi ảnh trong userModal.ejs
            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
        }
    });

    $("#input-change-username").bind("change", function() {
        userInfo.username = $(this).val();
    });

    $("#input-change-gender-male").bind("click", function() {
        userInfo.gender = $(this).val();
    });

    $("#input-change-gender-female").bind("click", function() {
        userInfo.gender = $(this).val();
    });

    $("#input-change-address").bind("change", function() {
        userInfo.address = $(this).val();
    });

    $("#input-change-phone").bind("change", function() {
        userInfo.phone = $(this).val();
    });
}

$(document).ready(function() {
    updateUserInfo();

    originAvatarSrc = $("#user-modal-avatar").attr("src");
    $("#input-btn-update-user").bind("click", function() {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 7);
            return false;
        }
        $.ajax({
            url: "/user/update-avatar",
            type: "put",//Quy tắc chuẩn khi mình update trường dữ liệu của restfulAPI
            cache: false,
            contentType: false,
            processData: false,//Khi gửi req dữ liệu là form data thì cần khai báo ba biến.
            data: userAvatar,
            success: function() {
                //
            },
            error: function() {
                //
            },
        });
        // console.log(userAvatar);
        // console.log(userInfo);
    });
    $("#input-btn-cancel-update-user").bind("click", function() {
        userAvatar = null;
        userInfo = {};
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    });

});