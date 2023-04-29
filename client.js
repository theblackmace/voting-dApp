const pEl = document.querySelector("#output-el");
const addEl = document.querySelector("#address-el");
const dappAddress = "0x3497ea1e398f615d54df6670f991c544a7e6c57d";
var web3Instance;
const inputEl = document.querySelector('input');
var userAccount;
const chainId = 80001;
let accountHasVoted = false;
let isOwner = false;


/* not rigged
const scABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "msgSenderVote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "ownerAddCandidate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"name": "id",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

*/

const scABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "msgSenderVote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "ownerAddCandidate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"name": "id",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3js = new Web3(window.ethereum);
        console.log(web3js);
        startApp();
    } else {
        console.log("Please install MetaMask");
    }
})

document.getElementById('castVote').addEventListener('click', function() {
    if(accountHasVoted && !isOwner) {
        alert("You've already voted ser");
    }
    else{
        console.log(document.getElementById('candidatesSelect').value);
        web3Instance.methods.msgSenderVote(document.getElementById('candidatesSelect').value)
            .send({from: userAccount})
            .on("receipt", function(receipt) {
                console.log("Txn Send successfully: " + receipt);
                displayCandidates();
            })
            .on("error", function(error) {
                console.log("Error occurred: " + error);
            });
    }
});


async function startApp() {
	changeNetwork();
	try {
		var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		userAccount = accounts[0];
        console.log(userAccount);
		web3Instance = new web3js.eth.Contract(scABI, dappAddress);
		console.log(web3Instance);

        web3Instance.methods.hasVoted(userAccount).call()
            .then(function(result) {
                console.log("Has user already voted? "+result);
                accountHasVoted = result;
            });

        web3Instance.methods.isOwner().call( {from: userAccount} )
            .then(function(result) {
                isOwner = result;
                console.log("Is this user the owner of the SC? "+result);
            });

        document.getElementById('content').style.display = '';
        document.getElementById('loader').style.display = 'none';

		displayCandidates();

	} catch (error) {
        console.error(error);
		console.log('Something went wrong loading your MetaMask');
	}
}
  




function setString(parameter) {
	console.log("Sending txn...");
    return web3Instance.methods.setString(parameter)
        .send({ from: userAccount})
        .on("receipt", function(receipt) {
            console.log("Txn Sent successfully: " + receipt);
            setTimeout(function() {
                location.reload();
            }, 250)
        })
        .on("error", function(error) {
            console.log("Error occurred: " + error);
        });
}

async function displayCandidates() {
    let renderResultHtml = '';
    let renderCandidateOption = '';
    const result = await web3Instance.methods.candidatesCount().call();
    console.log("Number of candidates: " + result);
    const promises = [];
    for (let i = 1; i <= result; i++) {
      promises.push(web3Instance.methods.candidates(i).call());
    }
    const candidates = await Promise.all(promises);
    candidates.forEach(candidate => {
      console.log(candidate);
      renderResultHtml += `
        <tr><th>${candidate.id}</th><td>${candidate.name}</td><td>${candidate.voteCount}</td></tr>
      `;
      renderCandidateOption += `
        <option value=${candidate.id}>${candidate.name}</option>
      `
    });
    document.getElementById('candidatesResults').innerHTML = renderResultHtml;
    document.getElementById('candidatesSelect').innerHTML = renderCandidateOption;
}
  

const changeNetwork = async () => {
	if (window.ethereum) {
		try {
		await window.ethereum.request({
		method: 'wallet_switchEthereumChain',
			params: [{ chainId: Web3.utils.toHex(chainId) }],
		});
		} catch (error) {
		console.error(error);
		}
	}
}