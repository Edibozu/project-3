const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/api/addNote/:user_id", (req, res) => {
  const { name, datetime, user_plans } = req.body;
  console.log(req.body);
  if (!name.trim()) {
    res.status(400);
  } else {
    db.Note.create({
      name: name,
      datetime: datetime,
      user_plans: user_plans,
    })
      .then((newNote) => {
        db.User.findOneAndUpdate(
          { _id: req.params.user_id },
          { $push: { notes: newNote._id } }
        )
          .then((response) => {
            console.log(response);
            res.status(200).send("Note added");
          })
          .catch((err) => {
            console.log(err);
            res.status(401).json({
              error: true,
              data: null,
              message: "Unable to add Note",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          data: null,
          message: "Couldn't make note",
        });
      });
  }
});


router.get("/api/WeekNotes/:id", (req,res) => {
  db.User.findOne({ _id: req.params.id})
  .populate("notes")
  .then(user => {
    console.log(user);
   const notes= user.notes.filter(note => note.datetime === req.body.datetime)
    console.log(notes);
    res.status(200).json({
      error: false,
      data: notes.splice(0,2),
      message: "Here you go"
    })
  }).catch(err => {
    console.log(err);
    res.json({
      error: true,
      data: err,
      message: "Something went wrong"
    })
  })
})

router.get("/api/allNotes/:id", (req, res) => {
  db.User.findOne({ _id: req.params.id })
    .populate("notes")
    .then((user) => {
      console.log(user.notes);
      let todayNotes = [];
      for (i = 0; i < user.notes.length; i++) {
        if (user.notes[i].datetime === "Wednesday") {
          todayNotes.push(user.notes[i]);
          console.log(todayNotes);
        }
      }
      res.status(200).json({
        error: false,
        data: todayNotes,
        message: "User notes connected to them",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        data: null,
        message: "Messed up. Try again",
      });
    });
});

router.put("/api/note/:id", (req, res) => {
  db.Note.findByIdAndUpdate(
    { _id: req.params.id },
    { user_plans: req.body.user_plans },
    { new: true }
  )
    .then((updatedNote) => {
      res.json({
        error: false,
        data: updatedNote,
        message: "Note Updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Fail to update note",
      });
    });
});

router.delete("/api/deleteNote/:id", (req, res) => {
  db.Note.findByIdAndDelete({ _id: req.params.id })
    .then((DeletedNote) => {
      res.json({ error: false, data: DeletedNote, message: "Note delete" });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        data: null,
        message: "Messed up. Try again",
      });
    });
});

<<<<<<< HEAD
router.post("/api/listitems",(req,res)=>{
  db.
=======

router.route("/api/weekNotes/:id/:datetime").get((req,res)=>{
  db.User.findOne({ _id: req.params.id})
  .populate("notes")
  .then(user => {
    console.log(user);
   const notes= user.notes.filter(note => note.datetime === req.params.datetime)
    console.log(notes);
    res.status(200).json({
      error: false,
      data: notes.splice(0,2),
      message: "Here you go"
    })
  }).catch(err=> console.log(err))
>>>>>>> 39551e028e1948f5a4ecd70a26b7813250b658c2
})

module.exports = router;
