const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Book, joiBook } = require("../models/Book")
const CheckToken = require("../midellwere/CheckToken")

// get all books
router.get("/", async (req, res) => {
  const books = await Book.find().populate({
    path: "owner",
    select: "-password -__v",
  })
  res.json(books)
})

// get one book
router.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json("Id shoud be an id object type")
    }
    const book = await Book.findById(id).populate({
      path: "owner",
      select: "-password -__v",
    })
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// add book
router.post("/", CheckToken, async (req, res) => {
  const bookBody = req.body
  const result = joiBook.validate(bookBody)
  if (result.error) return res.status(400).json(result.error.details[0].message)
  const book = new Book({
    title: bookBody.title,
    description: bookBody.description,
    image: bookBody.image,
    owner: req.userId,
    author: bookBody.author,
  })
  await book.save()
  res.json("added")
})

// edit book
router.put("/:id", CheckToken, async (req, res) => {
  const id = req.params.id
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json("Id shoud be an id object type")
    }
    const { title, description, image, author } = req.body
    const book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title, description, image, author },
      },
      {
        new: true,
      }
    )
    if (!book) return res.status(404).json("book not found")
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// delete book
router.delete("/:id", CheckToken, async (req, res) => {
  const id = req.params.id
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json("Id shoud be an id object type")
    }
    const book = await Book.findByIdAndRemove(id)
    if (!book) return res.status(404).json("book not found")
    res.json("book removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})
module.exports = router
