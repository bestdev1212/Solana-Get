import { useState, useEffect } from 'react';
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bs58 from "bs58";

const connection = new Connection("https://api.devnet.solana.com");

function App() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  var publicKey;
  var loop;
  const getBalance = () => {
    (async () => {
      let _balance = await connection.getBalance(publicKey);
      var sol_balance = _balance / LAMPORTS_PER_SOL;
      if (sol_balance > balance) {
        setBalance(sol_balance)
        if (sol_balance >= 0.1) {
          alert("0.1 sol is arrived");
          clearInterval(loop);
        }
      }

    })();
  }

  useEffect(() => {

    // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
    var keyPair = Keypair.generate();
    setAddress(keyPair.publicKey.toString());
    publicKey = keyPair.publicKey;
    loop = setInterval(() => {
      getBalance();
    }, 1000);

  }, []);

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  return (
    <div className=''>
      <div className='w-1/2 rounded shadow-lg mx-auto m-4 px-4 py-2'>
        <div className='mx-auto px-4 py-2'>(This is working on Solana Devnet)</div>
        <div className='mx-auto px-4 py-2 text-lg font-bold'>Deposit 0.1 SOL to following address
          <button className='px-2 rounded bg-slate-500 mx-2 hover:bg-slate-300 focus:bg-slate-500' onClick={() => {
            copyTextToClipboard(address);
            alert("copied");
          }}>Copy</button>
        </div>
        <div className='mx-auto px-4 py-2'>{address}</div>
        <div className='mx-auto px-4 py-2'>Current balance: {balance} SOL</div>

      </div>
    </div>

  );
}

export default App;
