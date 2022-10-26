/* function deployFunc(hre) {
   hre.getNamedAccounts()
    hre.deployments
}

module.exports.default = deployFunc
 */
const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify.js")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //if chainId is X use this address else use this address

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //if the contrct doesn't exist, we deploy a minimal version of it for local testing
    //what happen when we whan to change chain.
    //when going for localholst or hardhat network want to use a mock.
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        //name of contract
        from: deployer,
        args: args, //passing arguments from constructor,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("----------------------")
}

module.exports.tags = ["all", "fundme"]
