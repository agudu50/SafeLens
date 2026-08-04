const hre = require('hardhat')

async function main() {
  console.log(`Deploying SafeLensRegistry to network: ${hre.network.name}`)

  const SafeLensRegistry = await hre.ethers.getContractFactory('SafeLensRegistry')
  const registry = await SafeLensRegistry.deploy()
  await registry.waitForDeployment()

  const address = await registry.getAddress()
  console.log(`SafeLensRegistry deployed to: ${address}`)

  if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
    console.log('\nTo verify on Basescan, run:')
    console.log(`  npx hardhat verify --network ${hre.network.name} ${address}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
