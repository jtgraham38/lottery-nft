import React, { Component} from "react";
import {hot} from "react-hot-loader";
import Web3 from 'web3';
import "./App.css";
import Test from '../build/contracts/Test.json'

class App extends Component{

  render(){
    return(

      <div className="App">
        <h1> Hello, World!!! </h1>
        <p> Wallet: {this.state.account}</p>
        <p> Quote: </p>
        <blockquote>{this.state.message}</blockquote>


        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.captureMessage} name="message"></input>
          <input type="submit"></input>
        </form>

      </div>
    );
  }

  constructor(props)
  {
    super(props);
    this.state = 
    {
      account: '',
      message: '',
      contract: null,
    };  //in react, whenever state is changed, the page is automatically re-rendered

    this.onSubmit = this.onSubmit.bind(this);
    //*******^bind "this" to onSubmit, so that "this" keyword is defined in onSubmit!!!!
  }
  

  async componentWillMount() //comes with react, called whenever this app component mounts to the React DOM (kind of like create event in game maker, occurs before render() but after constructor)
  {
    await this.loadWeb3();            //call these backup helper methods
    await this.loadBlockChainData();  //^
  }

  async loadBlockChainData()
  {
    const web3 = window.web3; //get web3 object
    const accounts = await web3.eth.getAccounts();  //get all connected accounts
    this.setState( {account: accounts[0]} );  //add first account to the state object
    const networkId = await web3.eth.net.getId(); //get the network id of the network the contract is deployed on
    console.log(networkId)
    const networkData = Test.networks[networkId];   //get the data for the smart contract for the network currently connected to from the abis file
    //^5777 is the network id for ganache test network
    if (networkData)  //if data about the smart contract is found for the current network...
    {
      const abi = Test.abi;                 //get the abi of the contract
      const address = networkData.address;  //get the address of the contract on this particular network
      const contract = new web3.eth.Contract(abi, address); //create a web3 contract object to interact with the smart contract
      this.setState( {contract} );  //add the contract to the React state object (es6 notation used here, equivalent to: {contrac: contract} )
      const message = await contract.methods.message().call();  //get the current meme hash stored in the contract
      this.setState( {message: message} );  //set the new memehash in the app state
    }
    else  //otherwise...
    {
      window.alert("Contract not deployed to the detected network!");
    }
  }

  

  async loadWeb3()
  {
    if (window.ethereum)  //if this is a blockchain-enabled browser (it has a crypto wallet)...
    {
      window.web3 = new Web3(window.ethereum);  //create new web3 object
      await window.ethereum.enable(); //enable ethereum
    }
    else if (window.web3) //otherwise, if there is a wallet extension installed...
    {
      window.web3 = new Web3(window.web3.currentProvider);  //create new web3 object
    }
    else   //otherwise, if there is no way to connect to a blockchain...
    {
      window.alert("This application requires and ethereum wallet.  Consider using metamask!");
    }
  }

  async onSubmit(event)
  {
    event.preventDefault(); //prevent the page from reloading on submit
    console.log("Sending message to contract...")
    const msg = event.target.message.value  //get the message submitted...
    console.log(msg)
    //console.log(this.state)
    
    this.state.contract.methods.setMessage(msg).send({ from: this.state.account }).then((r) => {
      this.setState( {message : msg} )
    });
    //^send a transaction to set the new message
    

  }
}

export default hot(module)(App);