// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import './libraries/ERC20.sol';
import './libraries/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SteakToken is Ownable, ERC20 {
  bool enabled = true;

  constructor() ERC20('SteakToken', 'STEAK') {}

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
  function mint(address _to, uint256 _amount) public onlyOwner {
    require(enabled);
    _mint(_to, _amount);
  }

  /*
   * Disables the ability to mint tokens in the future.
   */
  function disable_mint() public onlyOwner {
    enabled = false;
  }
}
