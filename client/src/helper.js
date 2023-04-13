import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";


const newAccount = () => {
    const privateKey = secp.utils.randomPrivateKey();
    console.log(privateKey);
    localStorage.setItem("Secret", toHex(privateKey));
    const publicKey = secp.getPublicKey(privateKey);
    console.log(publicKey);
    const address = toHex(keccak256(publicKey.slice(1).slice(-20)));
    console.log(address);
    const account = "0x" + address.toString();
    localStorage.setItem("Account",account);
    return account;
}

const hashMessage = (message) => keccak256(Uint8Array.from(message));

const sign = async (message) => {
  const privateKey = localStorage.getItem('Secret');
  const hash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
    recovered: true,
  });
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
}


const helper = {
    newAccount,
    sign
  };

export default helper;