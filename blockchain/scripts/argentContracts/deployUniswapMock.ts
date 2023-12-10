import { ethers } from "hardhat";
import {ZeroAddress} from "ethers";

export async function deployUniswapMock(){

    // Factory
    const UniswapFactory = await ethers.getContractFactory("UniswapV2FactoryMock");
    const uniswapFactoryDeployment = await UniswapFactory.deploy(ZeroAddress);
    await uniswapFactoryDeployment.waitForDeployment();

    // Router
    const UniswapRouter = await ethers.getContractFactory("UniswapV2Router01Mock");
    const uniswapRouterDeployment = await UniswapRouter.deploy(await uniswapFactoryDeployment.getAddress(), ZeroAddress);


    return { uniswapFactory: uniswapFactoryDeployment, uniswapRouter: uniswapRouterDeployment};
}
