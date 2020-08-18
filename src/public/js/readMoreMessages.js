function readMoreMessages() {
    $(".right .chat").scroll(function() {

        // Lấy tin nhắn đầu tiên
        let firstMessage = $(this).find(".bubble:first");

        // Lấy vị trí tin nhắn đầu tiên
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();

        if ($(this).scrollTop() === 0) {
            let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
            $(this).prepend(messageLoading);

            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

            let thisDom = $(this);

            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
                if (data.rightSideData.trim() === "") {
                    alertify.notify("Bạn không còn tin nhắn nào để hiển thị nữa trong cuộc trò chuyện này nữa.", "error", 7);//7s là thời gian hiển thị thông báo
                    thisDom.find("img.message-loading").remove();
                    return false;
                }
                // Step 01: Xử lý rightSide
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

                // Step 1.5: prevent scroll để khi cuộn lên thì màn hình vẫn giữ nguyến nếu load thêm tin nhắn chứ ko nhảy lên đầu
                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset); 

                // Step 02: converEmoji
                convertEmoji();

                // Step 04: 
                $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                // Step 05:
                gridPhotos(5);

                // Step 06:
                $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

                // Step 07: xóa message loading
                thisDom.find("img.message-loading").remove();

            });
        }
    });
}

$(document).ready(function() {
    readMoreMessages();
});