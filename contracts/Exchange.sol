// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./interfaces/IERC20.sol";
import "./libraries/Ownable.sol";
import "./SteakToken.sol";

import "hardhat/console.sol";

/* This exchange is based off of Uniswap V1. The original whitepaper for the constant product rule
 * can be found here:
 * https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf
 * It has been heavily simplified for learning purposes.
 */

contract SteakExchange is Ownable {
  address public admin;

  SteakToken private token;
  // Liquidity pool for the exchange
  uint256 public tokenReserves = 0;
  uint256 public ethReserves = 0;

  // Constant: x * y = k
  uint256 public k;

  // liquidity rewards
  uint256 private swapFeeNumerator = 1;
  uint256 private swapFeeDenominator = 100;

  mapping(address => uint256) public shares;
  uint256 public globalCounter;

  event AddLiquidity(address from, uint256 amount);
  event RemoveLiquidity(address to, uint256 amount);
  event Received(address from, uint256 amountETH);
  event Reinvested(uint256 amountETH, uint256 amountToken);

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  constructor(address _tokenAddres) {
    admin = msg.sender;
    token = SteakToken(_tokenAddres);
  }

  /**
   * Initializes a liquidity pool between your token and ETH.
   *
   * This is a payable function which means you can send in ETH as a quasi-parameter. In this
   * case, the amount of eth sent to the pool will be in msg.value and the number of tokens will
   * be amountTokens.
   */
  function createPool(uint256 amountTokens) external payable onlyOwner {
    // require pool does not yet exist
    require(tokenReserves == 0, "Token reserves was not 0");
    require(ethReserves == 0, "ETH reserves was not 0.");

    // require nonzero values were sent
    require(msg.value > 0, "Need ETH to create pool.");
    require(amountTokens > 0, "Need tokens to create pool.");

    token.transferFrom(msg.sender, address(this), amountTokens);
    ethReserves = msg.value;
    tokenReserves = amountTokens;
    k = ethReserves * tokenReserves;

    uint256 poolContrib = (msg.value / ethReserves) * 10;
    shares[msg.sender] = poolContrib;
    globalCounter = poolContrib * (10**18);
  }

  // Given an amount of tokens, calculates the corresponding amount of ETH
  // based on the current exchange rate of the pool.
  function amountTokenGivenETH(uint256 amountToken)
    public
    view
    returns (uint256)
  {
    return amountToken * (ethReserves / tokenReserves);
  }

  // Given an amount of ETH, calculates the corresponding amount of tokens
  // based on the current exchange rate of the pool.
  function amountETHGivenToken(uint256 amountETH)
    public
    view
    returns (uint256)
  {
    return amountETH * tokenPrice();
  }

  /* ========================= Liquidity Provider Functions =========================  */

  /**
   * Adds liquidity given a supply of ETH (sent to the contract as msg.value).
   *
   * Calculates the liquidity to be added based on what was sent in and the prices. If the
   * caller possesses insufficient tokens to equal the ETH sent, then the transaction must
   * fail. A successful transaction should update the state of the contract, including the
   * new constant product k, and then Emit an AddLiquidity event.
   *
   */
  function addLiquidity() external payable {
    // Attempt to reinvest fees BEFORE adding liquidity; this will distribute as much of the accrued unassigned fees as possible to already EXISTING LPs
    reinvestFees();

    uint256 amountTokens = (msg.value * tokenPrice());

    // Calculate new LP "token" amount received based on percent of existing ETH reserves
    uint256 poolContrib = ((globalCounter * msg.value) / ethReserves) * 10;
    shares[msg.sender] = shares[msg.sender] + poolContrib;
    globalCounter = globalCounter + poolContrib;

    // Keep track of LP "tokens", reserves, and k post changes
    ethReserves = ethReserves + msg.value;
    tokenReserves = tokenReserves + amountTokens;
    k = ethReserves * tokenReserves;

    // Transfers always last to eliminate reentrancy risk (mostly this matters on ETH)
    // requirement for sender to have sufficient permissioned token will be checked by the transferFrom function - saves gas
    token.transferFrom(msg.sender, address(this), amountTokens);

    emit AddLiquidity(msg.sender, msg.value);
  }

  /**
   * Removes liquidity given the desired amount of ETH to remove.
   *
   * Calculates the amount of your tokens that should be also removed. If the caller is not
   * entitled to remove the desired amount of liquidity, the transaction should fail. A
   * successful transaction should update the state of the contract, including the new constant
   * product k, transfer the ETH and Token to the sender and then Emit an RemoveLiquidity event.
   */
  function removeLiquidity(uint256 amountETH) public payable {
    // fail if try to remove inexistent LP on "exit all" or another zero ETH call - save gas
    require(amountETH > 0, "Nothing to remove");

    // Attempt to reinvest fees BEFORE claim; this will distribute as much of the accrued unassigned fees as possible
    reinvestFees();

    uint256 amountTokens = (amountETH * tokenPrice());

    // Calculate LP "token" amount to cancel based on percent of existing ETH reserves
    uint256 poolContrib = ((globalCounter * amountETH) / ethReserves) * 10;

    // require remaining ETH and token in the pool and sufficient LP claim to withdraw desired ETH
    require(
      ethReserves > amountETH &&
        tokenReserves > amountTokens &&
        shares[msg.sender] >= poolContrib,
      "Trying to remove more than max available"
    );

    // Keep track of LP "tokens", reserves, and k post changes
    shares[msg.sender] = shares[msg.sender] - poolContrib;
    globalCounter = globalCounter - poolContrib;
    ethReserves = ethReserves - amountETH;
    tokenReserves = tokenReserves - amountTokens;
    k = ethReserves * tokenReserves;

    // Transfers always last to eliminate reentrancy risk (mostly this matters on ETH)
    token.transfer(msg.sender, amountTokens);
    payable(msg.sender).transfer(amountETH);

    emit RemoveLiquidity(msg.sender, amountETH);
  }

  /**
   * Removes all liquidity that the sender is entitled to withdraw.
   *
   * Calculate the maximum amount of liquidity that the sender is entitled to withdraw and then
   * calls removeLiquidity() to remove that amount of liquidity from the pool.
   *
   */
  function removeAllLiquidity() public payable {
    // Can't remove all liquidity
    require(
      globalCounter > shares[msg.sender],
      "Can't have last provider withdraw all"
    );

    // Attempt to reinvest fees BEFORE claim; this will distribute as much of the accrued unassigned fees as possible
    reinvestFees();

    // Can withdraw as much of the pool ETH total as the ratio of LP "tokens" owned
    removeLiquidity(((ethReserves * shares[msg.sender]) / globalCounter) / 10);
  }

  /* ========================= Swap Functions =========================  */

  /**
   * Swaps amountTokens of Token in exchange for ETH.
   *
   * Calculates the amount of ETH that should be swapped in order to keep the constant
   * product property, and transfers that amount of ETH to the provider. If the caller
   * has insufficient tokens, the transaction should fail. If performing the swap would
   * exhaust the total supply of ETH inside the exchange, the transaction must fail.
   */
  function swapTokensForETH(uint256 amountTokens) external payable {
    uint256 amountTokensExFee = amountTokens -
      ((amountTokens * swapFeeNumerator) / swapFeeDenominator);
    uint256 newTokenReserve = tokenReserves + amountTokensExFee;
    uint256 newETHReserve = k / newTokenReserve;

    // Amount to return for the swap falls out directly from projected pool reserve
    uint256 amountETH = ethReserves - newETHReserve;

    //  If performing the swap would exhaust total ETH supply, transaction must fail.
    require(ethReserves > amountETH, "This would drain the pool");

    ethReserves = newETHReserve;
    tokenReserves = newTokenReserve;

    // Transfers always last to eliminate reentrancy risk (mostly this matters on ETH)
    // Receive all tokens including fee
    token.transferFrom(msg.sender, address(this), amountTokens);

    // Send out the k-curve ETH less fees
    payable(msg.sender).transfer(amountETH);

    // Check for x * y == k, assuming x and y are rounded to the nearest integer.
    // Check for Math.abs(tokenReserves * ethReserves - k) < (tokenReserves + ethReserves + 1));
    //   to account for the small decimal errors during uint division rounding.
    assert(_checkRounding() < (tokenReserves + ethReserves) + 1);
  }

  /**
   * Swaps msg.value ETH in exchange for your tokens.
   *
   * Calculates the amount of tokens that should be swapped in order to keep the constant
   * product property, and transfers that number of tokens to the sender. If performing
   * the swap would exhaust the total supply of tokens inside the exchange, the transaction
   * must fail.
   */
  function swapETHForTokens() external payable {
    // Calculate the new reserve projections which keep k constant after adding the msg.value to ETH pool, less fees
    // The ETH remainder (fee) just remains in the exchange account, but without being assigned to the pool yet
    uint256 amountETH = msg.value -
      ((msg.value * swapFeeNumerator) / swapFeeDenominator);
    uint256 newETHReserve = ethReserves + amountETH;
    uint256 newTokenReserve = k / newETHReserve;

    // Amount to return for the swap falls out directly from projected pool reserve
    uint256 amountTokens = tokenReserves - newTokenReserve;

    //  If performing the swap would exhaust total token supply, transaction must fail.
    require(tokenReserves > amountTokens, "This would drain the pool");

    ethReserves = newETHReserve;
    tokenReserves = newTokenReserve;

    // Transfers always last to eliminate reentrancy risk (mostly this matters on ETH)
    // Send out the k-curve exchanged tokens, ex fees
    token.transfer(msg.sender, amountTokens);

    // Check for x * y == k, assuming x and y are rounded to the nearest integer.
    // Check for Math.abs(tokenReserves * ethReserves - k) < (tokenReserves + ethReserves + 1));
    //   to account for the small decimal errors during uint division rounding.
    assert(_checkRounding() < (tokenReserves + ethReserves) + 1);
  }

  /**
   * Checks that users are not able to get "free money" due to rounding errors.
   *
   * A liquidity provider should be able to input more (up to 1) tokens than they are theoretically
   * entitled to, and should be able to withdraw less (up to -1) tokens then they are entitled to.
   *
   * Checks for Math.abs(tokenReserves * ethReserves - k) < (tokenReserves + ethReserves + 1));
   * to account for the small decimal errors during uint division rounding.
   */
  function _checkRounding() private returns (uint256) {
    uint256 check = tokenReserves * ethReserves;
    if (check >= k) {
      check = check - k;
    } else {
      check = k - check;
    }
    assert(check < (tokenReserves + ethReserves + 1));
    k = tokenReserves * ethReserves; // reset k due to small rounding errors

    return check;
  }

  /** Utility functions
   * Function tokenPrice: Calculate the price of your token in ETH.
   * This function shoulnd't be trusted instead calculate this in the client.
   */
  function tokenPrice() public view returns (uint256) {
    return tokenReserves / ethReserves;
  }

  /**
   * Function reinvestFees: reinvest everything earned.
   */
  function reinvestFees() public payable {
    // Can only reinvest fees if have positive balances of both ETH and token, not yet assigned to pool. Note we first ensure this, so that exchanges with some rounding error can still function without underflows on fee calcs
    // Also saves gas on second call from removeAllLiquidity -> removeLiquidity - just one if to evaluate
    if (
      address(this).balance > (ethReserves + msg.value) &&
      token.balanceOf(address(this)) > tokenReserves
    ) {
      // Calculate residual token and ETH balances in contract which are not yet assigned to pool reserves. These will usually be the fees plus any "gifts"
      uint256 unassignedToken = token.balanceOf(address(this)) - tokenReserves;

      // Since we call this before adding new ETH liquidity to pool, need to make sure we don't yet include new add liquidity as "fee unassigned"
      uint256 unassignedETH = address(this).balance - msg.value - ethReserves;

      // Project tentative maxETH that would balance all available unassigned tokens being added to pool reserves
      uint256 maxETH = (unassignedToken * (ethReserves / tokenReserves));
      uint256 maxToken;

      // The max ETH we can assign to the pool is the max between that unassigned ETH left and the exchange-ratio balancing for unassigned token; and vice-versa for token to assign
      if (unassignedETH >= maxETH) {
        // We have sufficient unassigned ETH to cover all the unassigned token; the token is limiting factor. Original maxETH projection correct; use up all unassigned token
        maxToken = unassignedToken;
      } else {
        // We don't have sufficient unassigned ETH to cover all the unassigned token; ETH is the limiting factor. Update original projection; project maxToken
        maxETH = unassignedETH;
        maxToken = (unassignedETH * tokenPrice());
      }

      // We adjust the reserves and k, but not the LP "tokens" or LP totals - this way the reinvestment goes to existing LPs
      ethReserves = ethReserves + maxETH;
      tokenReserves = tokenReserves + maxToken;
      k = ethReserves * tokenReserves;

      emit Reinvested(maxETH, maxToken);
    }
  }
}
