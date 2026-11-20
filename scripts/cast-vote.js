import { network } from "hardhat";

const { ethers } = await network.create();

const contractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const voting = await ethers.getContractAt(
  "Voting",
  contractAddress
);

const accounts = await ethers.getSigners();
const voter = accounts[1];

console.log("Voter Address:", voter.address);

const alreadyVoted = await voting.hasVoted(voter.address);

if (alreadyVoted) {
  console.log("This account has already voted.");
} else {
  const tx = await voting.connect(voter).vote(1);

  console.log("Transaction Hash:", tx.hash);

  await tx.wait();

  console.log("Vote confirmed successfully!");
}

const apu = await voting.candidates(1);

console.log("Candidate:", apu.name);
console.log("Total Votes:", apu.voteCount.toString());

