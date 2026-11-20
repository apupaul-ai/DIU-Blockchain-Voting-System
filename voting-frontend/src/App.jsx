import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import votingArtifact from "./contracts/Voting.json";
import "./App.css";
import DIUView from "./DIUView";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";
const CHAIN_ID = 31337n;
const ABI = votingArtifact.abi;
const readProvider = new JsonRpcProvider(RPC_URL);

function shortAddress(address) {
  if (!address) return "Not connected";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function errorText(error) {
  if (error.code === 4001 || error.code === "ACTION_REJECTED") {
    return "Transaction cancelled by the user.";
  }
  return error.shortMessage || error.reason || error.message || "Something went wrong.";
}

export default function App() {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({
    kind: "info",
    text: "Connect MetaMask to participate in this local election."
  });

  const refresh = useCallback(async (walletAddress = "") => {
    const code = await readProvider.getCode(CONTRACT_ADDRESS);

    if (code === "0x") {
      throw new Error("Contract not found. Check the deployment address and Hardhat node.");
    }

    const contract = new Contract(CONTRACT_ADDRESS, ABI, readProvider);
    const count = Number(await contract.candidateCount());

    const results = await Promise.all(
      Array.from({ length: count }, async (_, index) => {
        const candidate = await contract.candidates(index + 1);
        return {
          id: Number(candidate.id),
          name: candidate.name,
          votes: Number(candidate.voteCount)
        };
      })
    );

    setCandidates(results);
    setHasVoted(
      walletAddress
        ? await contract.hasVoted(walletAddress)
        : false
    );
    setOnline(true);
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        await refresh();

        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts"
          });
          const chainId = await window.ethereum.request({
            method: "eth_chainId"
          });

          if (accounts.length && BigInt(chainId) === CHAIN_ID) {
            setAccount(accounts[0]);
            await refresh(accounts[0]);
          }
        }
      } catch (error) {
        setNotice({ kind: "error", text: errorText(error) });
      } finally {
        setLoading(false);
      }
    }

    initialize();

    if (!window.ethereum) return;

    async function accountsChanged(accounts) {
      const nextAccount = accounts[0] || "";
      setAccount(nextAccount);
      setHasVoted(false);

      try {
        await refresh(nextAccount);
      } catch (error) {
        setNotice({ kind: "error", text: errorText(error) });
      }
    }

    function chainChanged() {
      window.location.reload();
    }

    window.ethereum.on?.("accountsChanged", accountsChanged);
    window.ethereum.on?.("chainChanged", chainChanged);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", accountsChanged);
      window.ethereum.removeListener?.("chainChanged", chainChanged);
    };
  }, [refresh]);

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + candidate.votes, 0),
    [candidates]
  );

  const leader = useMemo(() => {
    if (!candidates.length || totalVotes === 0) return null;
    const maxVotes = Math.max(...candidates.map(c => c.votes));
    const leaders = candidates.filter(c => c.votes === maxVotes);
    return leaders.length === 1 ? leaders[0] : null;
  }, [candidates, totalVotes]);

  async function getWalletProvider() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const currentChain = await window.ethereum.request({
      method: "eth_chainId"
    });

    if (BigInt(currentChain) !== CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }]
      });
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    if (network.chainId !== CHAIN_ID) {
      throw new Error("Please select Hardhat Local (31337).");
    }

    return provider;
  }

  async function switchVoter() {
    setBusy(true);
    setNotice({
      kind: "info",
      text: "Select your new voter account in MetaMask."
    });

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      });

      const accounts = await window.ethereum.request({
        method: "eth_accounts"
      });

      if (!accounts.length) {
        throw new Error("No wallet account was selected.");
      }

      await getWalletProvider();

      const nextAccount = accounts[0];

      await refresh(nextAccount);
      setAccount(nextAccount);

      if (
        account &&
        nextAccount.toLowerCase() === account.toLowerCase()
      ) {
        setNotice({
          kind: "info",
          text: "The same wallet is selected. Change the connected account in MetaMask Permissions."
        });
      } else {
        setNotice({
          kind: "success",
          text: "Voter switched to " + shortAddress(nextAccount)
        });
      }

    } catch (error) {
      setNotice({
        kind: "error",
        text: errorText(error)
      });
    } finally {
      setBusy(false);
    }
  }

  async function connectWallet() {
    setBusy(true);
    try {
      const provider = await getWalletProvider();
      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts.length) {
        throw new Error("No wallet account selected.");
      }

      await refresh(accounts[0]);
      setAccount(accounts[0]);
      setNotice({
        kind: "success",
        text: "Wallet connected. You can now participate in the election."
      });
    } catch (error) {
      setNotice({ kind: "error", text: errorText(error) });
    } finally {
      setBusy(false);
    }
  }

  async function refreshResults() {
    setBusy(true);
    try {
      await refresh(account);
      setNotice({
        kind: "success",
        text: "Latest voting results loaded from the blockchain."
      });
    } catch (error) {
      setOnline(false);
      setNotice({ kind: "error", text: errorText(error) });
    } finally {
      setBusy(false);
    }
  }

  async function castVote(candidateId) {
    setBusy(true);
    try {
      if (!account) throw new Error("Connect your wallet first.");

      const provider = await getWalletProvider();
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        throw new Error("Wallet account changed. Please reconnect.");
      }

      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      if (await contract.hasVoted(signerAddress)) {
        setHasVoted(true);
        throw new Error("This wallet has already cast its vote.");
      }

      setNotice({
        kind: "info",
        text: "Please confirm your voting transaction in MetaMask."
      });

      const tx = await contract.vote(candidateId);

      setNotice({
        kind: "info",
        text: "Transaction submitted. Waiting for blockchain confirmation..."
      });

      await tx.wait();
      await refresh(signerAddress);

      setNotice({
        kind: "success",
        text: "Vote successfully recorded on the blockchain!"
      });
    } catch (error) {
      setNotice({ kind: "error", text: errorText(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <DIUView
      account={account}
      candidates={candidates}
      totalVotes={totalVotes}
      hasVoted={hasVoted}
      online={online}
      loading={loading}
      busy={busy}
      notice={notice}
      leader={leader}
      onConnect={connectWallet}
      onSwitch={switchVoter}
      onRefresh={refreshResults}
      onVote={castVote}
      shortAddress={shortAddress}
      contractAddress={CONTRACT_ADDRESS}
    />
  );
}
