const { userGet, login, sginUp } = require("../controllers/userControllers");
const { protected } = require("../middlewares/authMiddilewares");

const userRouter = require("express").Router();


userRouter.get("/", protected, userGet)
userRouter.post("/login", login)
userRouter.post("/signup", sginUp)


module.exports = userRouter