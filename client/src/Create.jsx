import helper from "./helper";
import server from "./server";

function Create({ address, setAddress, setBalance}) {

    async function onGenerate(evt){
        evt.preventDefault();
    
        // Generate a new Account and its keys
        address = helper.newAccount();
        setAddress(address);
        // create account in backend
        try {
          const {
            data: { balance },
          } = await server.post(`create`, {account: address});
          setBalance(balance);
        } catch (ex) {
          alert(ex);
        }
    
      }

return (
    <form className="create" onSubmit={onGenerate}>
          <input type="submit" className="button" value="Create New Account"></input>
    </form>
  );
}

export default Create;