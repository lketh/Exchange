// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './libraries/ERC20.sol';
import './libraries/Ownable.sol';

contract Steak is Ownable, ERC20 {
  bool enabled = true;

  constructor() ERC20('STEAKSWAP', 'STK') {}

  /**
   * Creates `amount` tokens, increasing the total supply.
   *
   * Emits a {Transfer} event with `from` set to the zero address (the "Black Hole").
   *
   * Requirements:
   *  - only the owner of this contract can mint new tokens
   *  - the account who recieves the minted tokens cannot be the zero address
   *  - you can change the inputs or the scope of your function, as needed
   */
  function _mint(uint256 amount) public onlyOwner {
    /******* TODO: Implement this function *******/
    require(enabled, 'Minting disabled');
    _mint(address(this), amount);
  }

  /*
   * Disables the ability to mint tokens in the future.
   */
  function _disable_mint() public onlyOwner {
    /******* TODO: Implement this function *******/
    enabled = false;
  }
}