const express = require("express");
const conn = require("../../connection");
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.user === undefined) {
    res.status(401).send('User Not Authenticated!');
    return;
  }
  conn.query(`SELECT * FROM Users`, [], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json(result);
    }
    else res.status(404).send("No User Found!");
  });
});

router.post("/", async (req, res) => {
  if (req.user === undefined) {
    res.status(401).send('User Not Authenticated!');
    return;
  }
  if(req.body.image == undefined && req.body.id == undefined) {
    res.status(422).send("image and id are required!");
    return;
  }
  conn.query(`UPDATE Users SET ImageUrl = ? WHERE Id = ?`, [req.body.image, req.body.id], (err, result) => {
    if (err) throw err;
    res.send("Image Updated Successfully");
  });
});

router.patch("/", async (req, res) => {
  if (req.user === undefined) {
    res.status(401).send('User Not Authenticated!');
    return;
  }
  if(req.body.password == undefined &&  req.body.confirmPassword == undefined &&  req.body.id == undefined) {
    res.status(422).send("image and id are required!");
    return;
  }
  if (req.body.password == req.body.confirmPassword) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    conn.query('UPDATE Users SET Password = ? WHERE Id = ?', [hashedPassword, id], (err, result) => {
      if (err) throw err;
      res.send("User Password Updated successfully");
    });
  }
  else {
    res.status(422).send("Passwords must match");
  }
});

module.exports = router;
