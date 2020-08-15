$(document).ready(function() {
    $("#link-read-more-contacts").bind("click", function() {
        let skipNumber = $("#contacts").find("li").length;//Kết quả là 1 array

        $("#link-read-more-contacts").css("display", "none");
        $(".read-more-contacts-loader").css("display", "inline-block");

        //Request Ajax
        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function(newContactUsers) {
            if (!newContactUsers.length) {
                alertify.notify("Bạn không còn liên hệ nào để hiển thị nữa.", "error", 7);//7s là thời gian hiển thị thông báo
                $("#link-read-more-contacts").css("display", "inline-block");
                $(".read-more-contacts-loader").css("display", "none");
                
                return false;
            }
            newContactUsers.forEach(function(user) {
                $("#contacts")
                    .find("ul")
                    .append(`<li class="_contactList" data-uid="${user._id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${(user.address !== null) ? user.address : ""}</span>
                            </div>
                            <div class="user-talk" data-uid="${user._id}">
                                Trò chuyện
                            </div>
                            <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                Xóa liên hệ
                            </div>
                        </div>
                    </li>`);//append sẽ in thêm ở phía dưới, ko giống prepend là bên trên
            });

            removeContact();// js/removecontact.js

            $("#link-read-more-contacts").css("display", "inline-block");
            $(".read-more-contacts-loader").css("display", "none");
        });//Query param URL
    });
});