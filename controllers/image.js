const handleImage = (req, res, db) => {
  const { id } = req.body;

  return db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log(entries[0].entries);

      if (entries.length) {
        res.json(entries[0].entries);
      } else {
        res.status(400).json("Cannot get the entries.");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting the entries.");
    });
};

module.exports = {
  handleImage
};
