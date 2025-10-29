const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let clothes = [
  { id: 1, name: "T-Shirt", price: 200 },
  { id: 2, name: "Shirt", price: 700 },
  { id: 3, name: "Pant", price: 800 },
];

let users = []; // {id,name,cart:[{item,quantity,price}]}

app.get("/clothes", (req, res) => res.json(clothes));

app.get("/get", (req, res) => res.json(users));

app.post("/add", (req, res) => {
  const { id, name, cart } = req.body;
  users.push({ id, name, cart });
  res.json({ message: "Added successfully" });
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { cart } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.cart = cart;
    res.json({ message: "Updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
