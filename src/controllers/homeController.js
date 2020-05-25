let getHome = (req,res) => {
  return res.render("main/home/home", {
    errors:req.flash("errors"),
    success: req.flash("success"),
    user: req.user //Như trong passport user thì ta đã lưu user vào trong req nên không cần phải querry về database nữa
  });
};

module.exports = {
  getHome: getHome
};