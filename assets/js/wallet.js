const ethers = window.ethers;

const connectModalBtn = document.getElementById("connectModalBtn");
const walletAccountBtn = document.getElementById("walletAccountBtn");
const connectModal = document.getElementById("connectModal");
const metamaskBtn = document.getElementById("metamaskBtn");
const coinbaseWalletBtn = document.getElementById("coinbaseWalletBtn");

const chainId = 1; // your chain id (1: mainnet, 137: polygon)

// TODO: update api key
const alchemyAPIKey = "";
const alchemyNftsEndpoint = `https://eth-mainnet.g.alchemy.com/nft/v2/${alchemyAPIKey}/getNFTs`;
const nftFilterContracts = []; // TODO: add contract addresses to filter nft collection

let walletType;
let walletAddress;
let walletProvider;
let isInitialized;

const ethereum = window.ethereum;

// Handle connect via Metamask
metamaskBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const activated = activateInjectedProvider("MetaMask");
  if (!activated) {
    window.alert(
      "Cannot connect to Metamask. Please make sure you have Metamask installed."
    );
    return;
  }

  const validChain = await switchChain("MetaMask");
  if (!validChain) {
    return;
  }
  await requestAccounts("MetaMask");
});

// Handle connect via Coinbase Wallet
coinbaseWalletBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  // active inject provider if  have 2 or more wallets extension
  const activated = activateInjectedProvider("CoinbaseWallet");
  if (!activated) {
    window.alert("Cannot connect to Coinbase Wallet.");
    return;
  }

  // validate chain and switch if needed
  const validChain = await switchChain("CoinbaseWallet");
  if (!validChain) {
    return;
  }

  // request to connect to account
  await requestAccounts("CoinbaseWallet");
});

// handle disconnect
walletAccountBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  // Metamask, CoinbaseWallet
  ethereum.removeListener("accountsChanged", (accounts) => {
    console.log("disconnected", "accounts", accounts);
  });

  // reset variables
  isInitialized = false;

  walletProvider = undefined;
  walletAddress = undefined;

  await connected(undefined);
});

function activateInjectedProvider(name) {
  // check wallet extension installed
  if (!ethereum) {
    return false;
  }

  // check if have 2 or more providers
  let provider;
  if (ethereum.providers && ethereum.providers.length) {
    switch (name) {
      case "MetaMask":
        provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
        break;
      case "CoinbaseWallet":
        provider = ethereum.providers.find(
          ({ isCoinbaseWallet }) => isCoinbaseWallet
        );
      default:
        break;
    }
  } else {
    provider = ethereum;
  }

  // check final provider
  if (!provider) {
    return false;
  }

  if (provider.isCoinbaseWallet) {
    if (name !== "CoinbaseWallet") {
      return false;
    }
  } else if (provider.isMetaMask) {
    if (name !== "MetaMask") {
      return false;
    }
  }

  // switch to use current provider
  ethereum.setSelectedProvider?.(provider);
  return true;
}

async function switchChain(walletType) {
  const ethereumProvider = new ethers.providers.Web3Provider(ethereum);
  const network = await ethereumProvider.getNetwork();
  // compare chain
  if (network?.chainId !== chainId) {
    try {
      // request to switch chain
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(chainId) }], // convert chainId to hex
      });
    } catch (err) {
      console.error("switchChain", "walletType", walletType, "err", err);
      return false;
    }
  }

  // init wallet provider
  walletProvider = new ethers.providers.Web3Provider(ethereum);

  if (!isInitialized) {
    isInitialized = true;

    // add events listener
    ethereum.on("accountsChanged", async (accounts) => {
      if (!accounts || accounts.length === 0) {
        // force disconnect
        await connected(undefined);
        return;
      }
      if (accounts[0] === walletAddress) {
        return;
      }
      // request if current account has been changed
      await requestAccounts(walletType);
    });
  }

  return true;
}

async function requestAccounts(walletType) {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (walletAddress !== accounts[0]) {
      walletAddress = accounts[0];
      await connected(walletType);
    }
  } catch (err) {
    console.log("requestAccounts::err", err);
    await connected(undefined);
  }
}

async function connected(type) {
  walletType = type;

  connectModal.style.display = "none";
  if (!walletType) {
    walletAccountBtn.innerHTML = "";

    walletAccountBtn.style.display = "none";
    connectModalBtn.style.display = "";
    return;
  }

  connectModalBtn.style.display = "none";
  walletAccountBtn.style.display = "";

  walletAccountBtn.innerHTML = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(walletAddress.length - 6, walletAddress.length)}`;

  let query = "owner=" + walletAddress + "&withMetadata=true&pageSize=100";
  if (nftFilterContracts.length !== 0) {
    nftFilterContracts.forEach((contract) => {
      query += "&contractAddresses[]=" + contract;
    });
  }

  $.ajax({
    type: "GET",
    url: alchemyNftsEndpoint,
    data: query,
    success: (data) => {
      // TODO: display NFTs here
      console.log("data", data.ownedNfts);
    },
  });
}
