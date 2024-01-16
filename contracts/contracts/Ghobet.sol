// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ghobet {
    struct Bet {
        address bettor;
        uint amount;
        bool outcome; // true for "for," false for "against"
    }

    struct Prediction {
        string text;
        uint betDate;
        uint endDate;
        uint totalFor;
        uint totalAgainst;
        uint predictionId; // Идентификатор предсказания
        bool resolved;
        bool result; // true for "for" winning, false for "against" winning
    }

    IERC20 public ghoToken;
    Prediction[] public predictions;
    mapping(address => bool) public moderators;
    mapping(uint => Bet[]) public betsMapping; // Отображение предсказания на ставки

    event PredictionMade(uint indexed predictionId, string text, uint betDate, uint endDate);
    event BetPlaced(uint indexed predictionId, address indexed bettor, uint amount, bool outcome);
    event PredictionResolved(uint indexed predictionId, bool result);

    modifier onlyModerator() {
        require(moderators[msg.sender], "Not a moderator");
        _;
    }

    constructor(address _ghoToken) {
        ghoToken = IERC20(_ghoToken);
        moderators[msg.sender] = true;
    }

    function addModerator(address newModerator) external onlyModerator {
        moderators[newModerator] = true;
    }

    function makePrediction(string calldata text, uint endDate) external {
        uint predictionId = predictions.length;

        predictions.push(Prediction({
            text: text,
            betDate: block.timestamp,
            endDate: endDate,
            totalFor: 0,
            totalAgainst: 0,
            predictionId: predictionId,
            resolved: false,
            result: false
        }));

        emit PredictionMade(predictionId, text, block.timestamp, endDate);
    }

    function getPrediction(uint predictionId) external view returns (Prediction memory) {
        require(predictionId < predictions.length, "Prediction does not exist");
        return predictions[predictionId];
    }

    function getPredictions() external view returns (Prediction[] memory) {
        return predictions;
    }

    function getBetsForPrediction(uint predictionId) external view returns (Bet[] memory) {
        require(predictionId < predictions.length, "Prediction does not exist");
        return betsMapping[predictionId];
    }

    function betOnPrediction(uint predictionId, uint amount, bool outcome) external {
        require(predictionId < predictions.length, "Prediction does not exist");
        require(block.timestamp < predictions[predictionId].endDate, "Prediction has ended");
        require(!predictions[predictionId].resolved, "Prediction is already resolved");

        Bet memory newBet = Bet({
            bettor: msg.sender,
            amount: amount,
            outcome: outcome
        });

        predictions[predictionId].totalFor += outcome ? amount : 0;
        predictions[predictionId].totalAgainst += outcome ? 0 : amount;

        betsMapping[predictionId].push(newBet);

        ghoToken.transferFrom(msg.sender, address(this), amount);

        emit BetPlaced(predictionId, msg.sender, amount, outcome);
    }

    function resolvePrediction(uint predictionId, bool result) external onlyModerator {
        require(predictionId < predictions.length, "Prediction does not exist");
        require(block.timestamp >= predictions[predictionId].endDate, "Prediction has not ended yet");
        require(!predictions[predictionId].resolved, "Prediction is already resolved");

        predictions[predictionId].resolved = true;
        predictions[predictionId].result = result;

        emit PredictionResolved(predictionId, result);
    }

    function claimWinnings(uint predictionId) external {
        require(predictionId < predictions.length, "Prediction does not exist");
        require(predictions[predictionId].resolved, "Prediction is not yet resolved");

        Bet[] storage bets = betsMapping[predictionId];

        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].outcome == predictions[predictionId].result) {
                uint winnings = (bets[i].amount * (predictions[predictionId].totalAgainst + predictions[predictionId].totalFor)) /
                                (predictions[predictionId].result ? predictions[predictionId].totalFor : predictions[predictionId].totalAgainst);

                ghoToken.transfer(bets[i].bettor, bets[i].amount + winnings);
            }
        }

        // Clear the bets array for this prediction
        delete betsMapping[predictionId];
    }
}