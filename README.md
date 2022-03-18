# STEAK Exchange <---> Chainshot final project

This project was based in the classes from [ChainShot](https://www.chainshot.com/bootcamp) and also in the learning project from [Stanford CS251 class](https://cs251.stanford.edu/).

The main idea was to learn how decentralized exchanges work internally, be able to work on the contract, the frontend and tests,
while covering many of the topics seen in the bootcamp.

## Development setup

```
git clone _repo_
cd _repo_
npm install
cd frontend
npm install
```

You will need to spin up a hardhat node with:
`npx hardhat node`
and run:
`npx hardhat run scripts/deploy.js --network localhost`

and for the frontend:
`npm run start`

# TODO

[X] Ability to trade eth for steaks.
[X] Ability to trade steaks for eth.
[X] Ability to add steak-eth to the liquidity pool.
[X] Ability to remove some steak-eth from the liquidity pool.
[X] Ability to remove all steak-eth from the liquidity pool.
[] Complete the tests in the tests directory.
[] Stylize so it doesn't look like a 90's page.
