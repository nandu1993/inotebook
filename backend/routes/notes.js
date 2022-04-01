const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

//ROUITE 1: Get all notes : GET "/api/notes/fetchallnotes".
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    let success = false;
    try {
        const notes = await Note.find({ user: req.user.id });
        let success = true;
        res.json({ success, notes });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

//ROUITE 2: Add a new Note : POST "/api/notes/addnote".
router.post("/addnote", fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "minimum 5 characters required").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save();
        success = true;
        res.json({ success, "notes": savedNotes });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

//ROUITE 3: Update Note : PUT "/api/notes/updatenote".
router.put("/updatenote/:id", fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "minimum 5 characters required").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //If note not found
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ success, error: "Not Found" });
        }
        //if user id not match with note user id
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ success, error: "Not Allowed" });
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        success = true;
        res.json({ success, note });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

//ROUITE 4: Delete Note : PUT "/api/notes/deletenote".
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    let success = false;
    try {
        //If note not found
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ success, error: "Not Found" });
        }
        //if user id not match with note user id
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ success, error: "Not Allowed" });
        }

        note = await Note.findByIdAndDelete(req.params.id);
        success = true;
        res.json({ success, "message": "note has been deleted", note });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "Internal server error" });
    }
})

module.exports = router;