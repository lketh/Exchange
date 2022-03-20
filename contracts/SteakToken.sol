// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/ERC20.sol";
import "./libraries/Ownable.sol";

contract SteakToken is Ownable, ERC20 {
  bool enabled = true;

  constructor(uint256 _initialSupply) ERC20("SteakToken", "STEAK") {
    _mint(msg.sender, _initialSupply);
  }

  /**
   * Creates `amount` tokens, increasing the total supply.
   */
  function mint(address _to, uint256 _amount) public onlyOwner {
    require(enabled, "The contract is paused");
    _mint(_to, _amount);
  }

  /*
   * Disables the ability to mint tokens in the future.
   */
  function disableMint() public onlyOwner {
    require(enabled, "The contract is paused");
    enabled = false;
  }

  /*
   * Enables the ability to mint tokens in the future.
   */
  function enableMint() public onlyOwner {
    require(!enabled, "The contract is not paused");
    enabled = true;
  }
}
