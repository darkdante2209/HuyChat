function imageChat(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function() {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;//byte = 1MB

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

        let targetId = $(this).data("chat");

        let messageFormData = new FormData();
        messageFormData.append("my-image-chat", fileData);//my-image-chat là tag name của input nhập ảnh trong div image-chat rightSide.ejs
        messageFormData.append("uid", targetId);

        if ($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
        }

        $.ajax({
            url: "/message/add-new-image",
            type: "post",//Quy tắc chuẩn khi mình update trường dữ liệu của restfulAPI
            cache: false,
            contentType: false,
            processData: false,//Khi gửi req dữ liệu là form data thì cần khai báo ba biến.
            data: messageFormData,
            success: function(data) {
                console.log(data);
            },
            error: function(error) {
                alertify.notify(error.responseText, "error", 7);
            },
        });

    });
}
