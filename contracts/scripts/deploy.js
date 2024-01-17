const { ethers, upgrades } = require("hardhat");

async function main() {

  console.log("GHO Token deployed to:", ghoToken.address);

  // Deploy Ghoprd contract
  const Ghoprd = await ethers.getContractFactory("Ghoprd");
  const ghobet = await upgrades.deployProxy(Ghoprd, '0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211', { initializer: "initialize" });

  await ghobet.deployed();

  console.log("Ghoprd deployed to:", ghobet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});