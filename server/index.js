const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const helper = require("./helper");

app.use(cors());
app.use(express.json());

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };

const balances = new Map();

app.post("/create", (req, res) => {
  const { account } = req.body;
  balances.set(account, 100); // create new user with 100 balance
  console.log(balances);
  const balance = balances.get(account) || 0;
  res.send({ balance });
});

app.get("/users", (req, res) => {
  const users = Array.from(balances.keys());
  console.log(users);
  res.send({ users });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances.get(address) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  // Get public key and sender
  const pubKey = helper.signatureToPubKey(message, signature);
  console.log(pubKey);
  const sender = helper.pubKeyToAccount(pubKey);
  console.log(sender);
  console.log(recipient);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances.get(sender) < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    console.log(balances.get(sender));
    console.log(balances.get(recipient));
    balances.set(sender, balances.get(sender) - amount);
    balances.set(recipient, balances.get(recipient) + amount);
    res.send({ balance: balances.get(sender), recipientBalance: balances.get(recipient) });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
