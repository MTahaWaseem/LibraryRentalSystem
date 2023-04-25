const auth = require('../middlewares/auth');

const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();

const app = express()

router.get("/verifyToken", auth.checkToken);

module.exports = router;