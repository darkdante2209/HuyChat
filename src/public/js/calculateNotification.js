function increaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue += 1;

    if (currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}

function decreaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue -= 1;
    if (currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}
