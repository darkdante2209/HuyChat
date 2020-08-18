$(document).ready(function() {
    $("#link-read-more-all-chat").bind("click", function() {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;


        $("#link-read-more-all-chat").css("display", "none");
        $(".read-more-all-chat-loader").css("display", "inline-block");

        //Request Ajax
        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
            if (data.leftSideData.trim() === "") {
                alertify.notify("Bạn không còn cuộc trò chuyện nào để hiển thị nữa.", "error", 7);//7s là thời gian hiển thị thông báo
                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-all-chat-loader").css("display", "none");

                return false;
            }

            // Step 01: xử lý leftSide
            $("#all-chat").find("ul").append(data.leftSideData);

            // Step 02: xử lý scroll left
            resizeNineScrollLeft();
            nineScrollLeft();

            // Step 03: xử lý right side
            $("#screen-chat").append(data.rightSideData);

            // Step 04: call function screen chat
            changeScreenChat();

            // Step 05: convert emoji
            convertEmoji();

            // Step 06: xử lý imageModal
            $("body").append(data.imageModalData);

            // Step 07: Gọi function gridphotos:
            gridPhotos(5);

            // Step 08: xử lý attachment modal:
            $("body").append(data.attachmentModalData);

            // Step 09: update online
            socket.emit("check-status");

            $("#link-read-more-all-chat").css("display", "inline-block");
            $(".read-more-all-chat-loader").css("display", "none");
        });//Query param URL
    });
});