const { run } = require("hardhat")

async function verify(contractAddress, args) {
    //verify contract
    console.log("Verifying contract...")
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.log(error.message)
        }
    }
}

module.exports = { verify }
