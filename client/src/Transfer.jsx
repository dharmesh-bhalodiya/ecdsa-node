import { useState, useEffect } from "react";
import server from "./server";
import helper from "./helper";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientBalance, setRecipientBalance] = useState(0);
  const [users, setUsers] = useState([]);

  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function getUsers() {
    const {
      data: { users },
    } = await server.get(`users`);
    setUsers(users);
    console.log(users);
  }

  useEffect(() => {getUsers();},[]);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      amount: parseInt(sendAmount),
      recipient,
    };

    const signature = await helper.sign(message);

    const transaction = {
      message,
      signature
    };

    try {
      const {
        data: { balance, recipientBalance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
      setRecipientBalance(recipientBalance);
      setSendAmount(0);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }


  async function onChange(evt) {
    evt.preventDefault();
    getUsers();
    const recipient = evt.target.value;
    setRecipient(recipient);

    if (recipient) {
      const {
        data: { balance },
      } = await server.get(`balance/${recipient}`);
      setRecipientBalance(balance);
    } else {
      setRecipientBalance(0);
    }
    
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient

        <select onChange={onChange} value={recipient}>
            <option value="">-----Select Account------</option>
            {users.map(user => (
                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>
            ))}
            {/* {wallet.ACCOUNTS.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))} */}
        </select>
      </label>

      <div className="balance">Recipient Balance: {recipientBalance}</div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
