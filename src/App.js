import "./App.css";
import Web3 from "web3";
import { ethers } from "ethers";
import { useState } from "react";

function App() {
  const [infoAccount, setInfoAccount] = useState({
    balance: 0,
    address: "",
  });
  const connectWallet = async () => {
    const { ethereum } = window;
    const data = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("data: ", data);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    // web3.eth.getAccounts().then((accounts) => {
    //   console.log("accounts: ", accounts);
    // });
    web3.eth.getBalance(data[0]).then((value) => {
      console.log("value", value);
      setInfoAccount({
        balance: ethers.utils.formatEther(value),
        address: data[0],
      });
    });

    const transactionCount = await web3.eth.getTransactionCount(data[0]);
    console.log("transactionCount: ", transactionCount);

    // ----------------------------------------------------------------
    const n = await web3.eth.getBlockNumber();
    const txs = [];
    for (var i = 0; i < n; i++) {
      var block = await web3.eth.getBlock(i + 1, true);
      for (var j = 0; j < block.transactions.length; j++) {
        if (block.transactions[j].from == data[0]) {
        }
        txs.push(block.transactions[j]);
      }
    }
    console.log("txs: ", txs);
    // for (let i = 0; i < n; i++) {
    //   let block = await web3.eth.getBlock(i, true);
    //   console.log("block: ", block);
    //   let transactions = block.transactions;
    //   if (block != null && block.transactions != null) {
    //     for (let txHash of block.transactions) {
    //       let tx = await web3.eth.getTransaction(txHash);
    //       if (data[0] == tx.to.toLowerCase()) {
    //         console.log(
    //           "from: " +
    //             tx.from.toLowerCase() +
    //             " to: " +
    //             tx.to.toLowerCase() +
    //             " value: " +
    //             tx.value
    //         );
    //       }
    //     }
    //   }
    // }
  };
  const sendTransaction = async (sender, receiver, balance) => {
    const parseAmount = ethers.utils.parseEther(balance.toString());
    const amount = Number(parseAmount.toString()).toString(16).toUpperCase();
    const { ethereum } = window;
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const value = await web3.eth.getGasPrice();
    const gas_price = web3.utils.fromWei(value, "ether");
    console.log("gas_price: ", gas_price);
    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: sender,
            to: receiver,
            value: amount,
            gasPrice: "0x09184e72a000",
            gas: "0x5208",
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  };
  return (
    <div className="App">
      <div className="address">address: {infoAccount.address}</div>
      <div className="address">balance: {infoAccount.balance} ETH</div>
      <button onClick={() => connectWallet()}>Connect wallet</button>
      <div>
        <button
          onClick={() =>
            sendTransaction(
              infoAccount.address,
              "0xFE0372692fc96BFEA3e19a569c43409b5e015e67",
              2
            )
          }
        >
          Send 1 ETH
        </button>
      </div>
    </div>
  );
}

export default App;
