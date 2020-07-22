function increaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue += 1;

    if (currentValue === 0){
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function decreaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();//Thêm dấu cộng vào chuỗi string trong javascript để chuyển về dạng number
    currentValue -= 1;

    if (currentValue === 0){
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}
