function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh sách liên hệ?`,
            text: "Bạn không thể hoàn tác lại quá trình này!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
          }).then((result) => {
            if(!result.value) {
                return false;
            }
            $.ajax({
                url: "/contact/remove-contact",
                type: "delete",
                data: {uid: targetId},
                success: function(data) {
                    if (data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();         
                        decreaseNumberNotifContact("count-contacts");//js/caculateNotifContact.js
                        socket.emit("remove-contact", {contactId: targetId});
                        
                        //xóa user phần chat
                        //All step sau khi xóa contact

                        //Step 0: check active:
                        let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");
                        //Step 1:
                        $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
                        $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

                        //Step 2: Remove rightSide.ejs
                        $("#screen-chat").find(`div#to_${targetId}`).remove();

                        //Step 3: remove image modal
                        $("body").find(`div#imagesModal_${targetId}`).remove();

                        //Step 4: remove attachment modal
                        $("body").find(`div#attachmentsModal_${targetId}`).remove();

                        //Step 5:  click vào cuộc trò chuyện đầu
                        if (checkActive) {
                            $("ul.people").find("a")[0].click();
                        }
                        
                    }
                }
            });
        });
    });
}

//socket lắng nghe sự kiện server gửi về
socket.on("response-remove-contact", function(user) {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();         
    decreaseNumberNotifContact("count-contacts");//js/caculateNotifContact.js
    //xóa user phần chat

    //All step sau khi xóa contact

    //Step 0: check active:
    let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");
    //Step 1:
    $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

    //Step 2: Remove rightSide.ejs
    $("#screen-chat").find(`div#to_${user.id}`).remove();

    //Step 3: remove image modal
    $("body").find(`div#imagesModal_${user.id}`).remove();

    //Step 4: remove attachment modal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();
    
    //Step 5:  click vào cuộc trò chuyện đầu
    if (checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function() {
    removeContact();// js/removecontact.js
});
