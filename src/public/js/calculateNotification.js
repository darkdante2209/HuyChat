function increaseNumberNotification(className, number) {
    let currentValue = +$(`.${className}`).text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue += number;

    if (currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}

function decreaseNumberNotification(className, number) {
    let currentValue = +$(`.${className}`).text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue -= number;
    if (currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}
