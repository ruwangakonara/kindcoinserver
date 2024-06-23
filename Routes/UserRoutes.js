const router = require("express").Router()
const UserController = require("../Controllers/Home/UserController")

router.post("/signin", UserController.signin)
router.post("/signup", UserController.signup)
router.get("/signout", UserController.signout)

module.exports = router