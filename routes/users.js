const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { User, userJoi } = require("../models/User")
const CheckToken = require("../midellwere/CheckToken")

// signup
router.post("/signup", async (req, res) => {
  const userBody = req.body
  const { first_Name, last_Name, email, password } = userBody
  const result = userJoi.validate(userBody)
  if (result.error) return res.status(400).json(result.error.details[0].message)

  const userFound = await User.findOne({ email })
  if (userFound) return res.status(400).json("user allready rigested")
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = new User({
    first_Name,
    last_Name,
    email,
    password: hash,
  })
  await user.save()
  res.json(user)
})

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not rigested")
    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).json("incorrect password")

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// get profile
router.get("/profile", CheckToken, async (req, res) => {
  const id = req.userId
  try {
    const user = await User.findById(id).select("-__v -password")
    if (!user) return res.status(404).json("user not found")
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
