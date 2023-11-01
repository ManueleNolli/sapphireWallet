import {ethers} from "hardhat";
import {Signer, ZeroAddress} from "ethers";
import deployInfrastructure from "./deploy/deployInfrastructure";
import updateInfrastructureENV from "./utils/env/updateInfrastructureENV";
import {printInfrastructure} from "./utils/printInfrastructure";


async function main() {

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    console.log("Deploying contracts with the account:", deployerAddress);
    deployInfrastructure(deployer).then(updateInfrastructureENV).then(printInfrastructure);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
