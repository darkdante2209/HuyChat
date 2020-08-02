$(document).ready(function() {
    $("#link-read-more-notif").bind("click", function() {
        let skipNumber = $("ul.list-notifications").find("li").length;//Kết quả là 1 array

        $("#link-read-more-notif").css("display", "none");
        $(".read-more-notif-loader").css("display", "inline-block");

        //Request Ajax
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
            if (!notifications.length) {
                alertify.notify("Bạn không còn thông báo nào để xem nữa.", "error", 7);//7s là thời gian hiển thị thông báo
                $("#link-read-more-notif").css("display", "inline-block");
                $(".read-more-notif-loader").css("display", "none");
                
                return false;
            }
            notifications.forEach(function(notification) {
                $("ul.list-notifications").append(`<li>${notification}</li>`);//append sẽ in thêm ở phía dưới, ko giống prepend là bên trên
            });

            $("#link-read-more-notif").css("display", "inline-block");
            $(".read-more-notif-loader").css("display", "none");
        });//Query param URL
    });
});