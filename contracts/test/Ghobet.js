const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Ghobet", function () {
  async function deployGhoBetFixture() {
    const [owner, moderator, user1, user2] = await ethers.getSigners();
    const GhoToken = await ethers.getContractFactory("GhoToken"); // Make sure you have GhoToken contract
    const ghoToken = await GhoToken.deploy();
    const GhoBet = await ethers.getContractFactory("GhoBet");
    const ghoBet = await GhoBet.deploy(ghoToken.address);
    await ghoToken.transfer(user1.address, ethers.utils.parseEther("100"));
    await ghoToken.transfer(user2.address, ethers.utils.parseEther("100"));
    return { ghoBet, ghoToken, owner, moderator, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right GhoToken address", async function () {
      const { ghoBet, ghoToken } = await loadFixture(deployGhoBetFixture);
      expect(await ghoBet.ghoToken()).to.equal(ghoToken.address);
    });

    it("Should set the deployer as a moderator", async function () {
      const { ghoBet, owner } = await loadFixture(deployGhoBetFixture);
      expect(await ghoBet.moderators(owner.address)).to.equal(true);
    });
  });

  describe("Prediction Management", function () {
    it("Should allow users to make predictions", async function () {
      const { ghoBet, user1 } = await loadFixture(deployGhoBetFixture);
      await expect(ghoBet.connect(user1).makePrediction("Will it rain tomorrow?", time.latest() + 60)).to.emit(ghoBet, "PredictionMade");
    });

    it("Should allow users to get predictions", async function () {
      const { ghoBet, user1 } = await loadFixture(deployGhoBetFixture);
      await ghoBet.connect(user1).makePrediction("Will it rain tomorrow?", time.latest() + 60);
      const prediction = await ghoBet.getPredictions(0);
      expect(prediction.text).to.equal("Will it rain tomorrow?");
    });
  });

  describe("Betting", function () {
    it("Should allow users to place bets", async function () {
      const { ghoBet, user1 } = await loadFixture(deployGhoBetFixture);
      await ghoBet.connect(user1).makePrediction("Will it rain tomorrow?", time.latest() + 60);
      await expect(ghoBet.connect(user1).betOnPrediction(0, ethers.utils.parseEther("10"), true)).to.emit(ghoBet, "BetPlaced");
    });
  });

  describe("Prediction Resolution", function () {
    it("Should allow moderators to resolve predictions", async function () {
      const { ghoBet, moderator } = await loadFixture(deployGhoBetFixture);
      await ghoBet.connect(moderator).makePrediction("Will it rain tomorrow?", time.latest() + 60);
      await ghoBet.connect(moderator).betOnPrediction(0, ethers.utils.parseEther("10"), true);
      await time.increaseTo(time.latest() + 61);
      await expect(ghoBet.connect(moderator).resolvePrediction(0, true)).to.emit(ghoBet, "PredictionResolved");
    });
  });

  describe("Claiming Winnings", function () {
    it("Should allow users to claim winnings", async function () {
      const { ghoBet, moderator, user1 } = await loadFixture(deployGhoBetFixture);
      await ghoBet.connect(moderator).makePrediction("Will it rain tomorrow?", time.latest() + 60);
      await ghoBet.connect(moderator).betOnPrediction(0, ethers.utils.parseEther("10"), true);
      await time.increaseTo(time.latest() + 61);
      await ghoBet.connect(moderator).resolvePrediction(0, true);
      await expect(ghoBet.connect(user1).claimWinnings(0)).to.not.be.reverted;
    });
  });
});