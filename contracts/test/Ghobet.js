const { expect } = require("chai");

describe("Ghobet", function () {
  let ghobet;
  let ghoToken;

  before(async () => {
    // Замените "GhoTokenAddress" на реальный адрес вашего токена GHO
    const GhoTokenAddress = "0x..."; 

    const GhoToken = await ethers.getContractFactory("GhoToken");
    ghoToken = await GhoToken.deploy();

    const Ghobet = await ethers.getContractFactory("Ghobet");
    ghobet = await Ghobet.deploy(GhoTokenAddress);
  });

  it("should create a prediction and retrieve it through view function", async function () {
    const predictionText = "Will it rain tomorrow?";
    const endDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

    // Создаем предсказание
    await ghobet.makePrediction(predictionText, endDate);

    // Получаем созданное предсказание через view функцию
    const predictions = await ghobet.getPredictions();
    const retrievedPrediction = await ghobet.getPrediction(predictions.length - 1);

    // Проверяем, что созданное и полученное предсказание идентичны
    expect(retrievedPrediction.text).to.equal(predictionText);
    expect(retrievedPrediction.endDate).to.equal(endDate);
    expect(retrievedPrediction.totalFor).to.equal(0);
    expect(retrievedPrediction.totalAgainst).to.equal(0);
    expect(retrievedPrediction.resolved).to.equal(false);
    expect(retrievedPrediction.result).to.equal(false);
  });
});