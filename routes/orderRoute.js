const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.showMainPage);
router.post("/", orderController.registerOrder);
router.get("/result", orderController.getResult);
router.get("/payment", orderController.showPayment);

module.exports = router;
