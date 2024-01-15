// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Prediction {
    struct Bet {
        address bettor;
        uint amount;
        bool outcome;
    }

    IERC20 public ghoToken;
    uint public predictionCount;
    mapping(uint => Bet[]) public betsByPrediction;

    event PredictionMade(uint predictionId, address indexed bettor, uint amount);
    event BetPlaced(uint predictionId, address indexed bettor, uint amount, bool outcome);

    constructor(address _ghoToken) {
        ghoToken = IERC20(_ghoToken);
        predictionCount = 0;
    }

    function makePrediction() external {
        require(ghoToken.balanceOf(msg.sender) > 0, "Insufficient GHO balance to make a prediction");

        uint predictionId = predictionCount;
        predictionCount++;

        betsByPrediction[predictionId].push(Bet({
            bettor: msg.sender,
            amount: 0, 
            outcome: false 
        }));

        emit PredictionMade(predictionId, msg.sender, 0);
    }

    function getPrediction(uint predictionId) external view returns (Bet[] memory) {
        return betsByPrediction[predictionId];
    }

    function betOnPrediction(uint predictionId, uint amount, bool outcome) external {
        require(predictionId < predictionCount, "Prediction does not exist");
        require(ghoToken.balanceOf(msg.sender) >= amount, "Insufficient GHO balance for the bet");

        betsByPrediction[predictionId].push(Bet({
            bettor: msg.sender,
            amount: amount,
            outcome: outcome
        }));

        ghoToken.transferFrom(msg.sender, address(this), amount);

        emit BetPlaced(predictionId, msg.sender, amount, outcome);
    }
}