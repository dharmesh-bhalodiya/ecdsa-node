import server from "./server";
import { useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance }) {

  useEffect(() => {
    if(localStorage.getItem("Account")){
      address = localStorage.getItem("Account");
      setAddress(address);
    }
    onChange(address);
  },[address]);
  
  

  async function onChange(value) {
    const address = value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={ (e)=>onChange(e.target.value)}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
