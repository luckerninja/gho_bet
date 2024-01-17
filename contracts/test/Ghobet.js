const { expect } = require("chai");

describe("Ghoprd Contract Tests", function () {
  let ghoprd;
  let ghoToken;
  let accounts;

  before(async () => {
    const GhoToken = await ethers.getContractFactory("GhoToken");
    ghoToken = await GhoToken.deploy();

    const Ghoprd = await ethers.getContractFactory("Ghoprd");
    ghoprd = await Ghoprd.deploy(ghoToken.address);

    accounts = await ethers.getSigners();
  });

  it("should create a prediction and retrieve it", async function () {
    const predictionText = "Will it rain tomorrow?";
    const endDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

    // Create a prediction
    await ghoprd.makePrediction(predictionText, endDate);

    // Retrieve the created prediction using the view function
    const predictions = await ghoprd.getPredictions();
    const retrievedPrediction = predictions[predictions.length - 1];

    // Check that the created and retrieved prediction are identical
    expect(retrievedPrediction.text).to.equal(predictionText);
    expect(retrievedPrediction.endDate).to.equal(endDate);
    expect(retrievedPrediction.totalFor).to.equal(0);
    expect(retrievedPrediction.totalAgainst).to.equal(0);
    expect(retrievedPrediction.resolved).to.equal(false);
    expect(retrievedPrediction.result).to.equal(false);
  });

  // Additional tests can be written here to cover other functionalities like
  // placing bets, resolving predictions, claiming winnings, etc.
});