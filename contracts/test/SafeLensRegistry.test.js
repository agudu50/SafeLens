const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('SafeLensRegistry', function () {
  let registry
  let owner
  let other

  const hashOf = (text) => ethers.keccak256(ethers.toUtf8Bytes(text))

  beforeEach(async function () {
    ;[owner, other] = await ethers.getSigners()
    const SafeLensRegistry = await ethers.getContractFactory('SafeLensRegistry')
    registry = await SafeLensRegistry.deploy()
    await registry.waitForDeployment()
  })

  it('starts with zero registered reports', async function () {
    expect(await registry.totalReports()).to.equal(0)
  })

  it('registers a new report and emits ReportRegistered', async function () {
    const reportHash = hashOf('scam-report-1')

    await expect(registry.registerReport(reportHash)).to.emit(registry, 'ReportRegistered')

    const [isRegistered, reporter] = await registry.verifyReport(reportHash)
    expect(isRegistered).to.equal(true)
    expect(reporter).to.equal(owner.address)
    expect(await registry.totalReports()).to.equal(1)
  })

  it('records the correct reporter address for the caller', async function () {
    const reportHash = hashOf('scam-report-2')
    await registry.connect(other).registerReport(reportHash)

    const [, reporter] = await registry.verifyReport(reportHash)
    expect(reporter).to.equal(other.address)
  })

  it('reverts when registering the same report hash twice', async function () {
    const reportHash = hashOf('duplicate-report')
    await registry.registerReport(reportHash)

    await expect(registry.registerReport(reportHash))
      .to.be.revertedWithCustomError(registry, 'ReportAlreadyRegistered')
      .withArgs(reportHash)
  })

  it('reverts when registering an empty hash', async function () {
    await expect(registry.registerReport(ethers.ZeroHash)).to.be.revertedWithCustomError(
      registry,
      'EmptyReportHash'
    )
  })

  it('returns false for an unregistered report hash', async function () {
    const reportHash = hashOf('never-submitted')
    const [isRegistered, reporter, timestamp] = await registry.verifyReport(reportHash)
    expect(isRegistered).to.equal(false)
    expect(reporter).to.equal(ethers.ZeroAddress)
    expect(timestamp).to.equal(0)
  })

  it('isReportRegistered reflects registration state', async function () {
    const reportHash = hashOf('check-flag')
    expect(await registry.isReportRegistered(reportHash)).to.equal(false)

    await registry.registerReport(reportHash)

    expect(await registry.isReportRegistered(reportHash)).to.equal(true)
  })
})
