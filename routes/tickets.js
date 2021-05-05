var express = require("express");
var router = express.Router();
const Controller = require("../controllers/controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/tickets", async function (req, res, next) {
  try {
    const result = await Controller.getTickets();
    //console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    // console.log("got nothing, sorry bud");
  }
});

module.exports = router;
