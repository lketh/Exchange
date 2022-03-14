// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/ERC20.sol";
import "./libraries/Ownable.sol";

contract SteakToken is Ownable, ERC20 {
  bool enabled = true;

  constructor(uint256 _initialSupply) ERC20("SteakToken", "STEAK") {
    uint256 initialSupply = _initialSupply * (10**18);
    _mint(msg.sender, initialSupply);
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
  function disable_mint() public onlyOwner {
    require(enabled, "The contract is paused");
    enabled = false;
  }

  /*
   * Enables the ability to mint tokens in the future.
   */
  function enable_mint() public onlyOwner {
    require(!enabled, "The contract is not paused");
    enabled = true;
  }
}
