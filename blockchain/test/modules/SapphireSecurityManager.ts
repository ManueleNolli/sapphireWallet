import {ethers} from 'hardhat'
import {HardhatEthersSigner} from '@nomicfoundation/hardhat-ethers/signers'
import deployInfrastructure from '../../scripts/argentContracts/deployInfrastructure'
import {InfrastructureTypes} from '../../scripts/argentContracts/utils/infrastructureTypes'
import {createWallet} from '../../scripts/argentContracts/createWallet'
import {expect} from 'chai'
import {ZeroAddress} from 'ethers'
import {ArgentModule__factory, IWallet__factory} from '../../typechain-types'
import {generateNonceForRelay, signOffchain} from "../../scripts/argentContracts/utils/genericUtils";
import {beforeEach} from "mocha";

describe('SapphireSecurityManager', function () {
    let deployer: HardhatEthersSigner
    let walletOwner: HardhatEthersSigner
    let guardian1: HardhatEthersSigner
    let guardian2: HardhatEthersSigner
    let newOwner: HardhatEthersSigner
    let walletAccountAbstraction: string
    let infrastructure: InfrastructureTypes

    beforeEach(async function () {
        ;[deployer, walletOwner, guardian1, guardian2, newOwner] = await ethers.getSigners()
        infrastructure = await deployInfrastructure(deployer)

        // create walletAccountAbstraction
        walletAccountAbstraction = await createWallet(
            infrastructure.walletFactory,
            walletOwner.address,
            guardian1.address,
            deployer.address,
            await infrastructure.argentModule.getAddress()
        )
    })

    describe('createWallet', async function () {
        it('Should get the constructor guardian', async function () {
            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian1.address)
            expect(isGuardian).to.be.true

            const guardianList = await infrastructure.argentModule.getGuardians(walletAccountAbstraction)
            expect(guardianList.length).to.be.equal(1)
            expect(guardianList[0]).to.be.equal(guardian1.address)
        })

        it('Should return the correct list of wallet for guardian', async function () {
            const wallets = await infrastructure.argentModule.connect(walletOwner).getGuardianWallets(guardian1.address)
            expect(wallets.length).to.be.equal(1)
            expect(wallets[0]).to.be.equal(walletAccountAbstraction)
        })
    })

    describe('addGuardian', async function () {
        it('Should allow the wallet owner to add a guardian', async function () {
            // Add guardian2
            await infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, guardian2.address)

            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian2.address)
            expect(isGuardian).to.be.true

            const guardianList = await infrastructure.argentModule.getGuardians(walletAccountAbstraction)
            expect(guardianList.length).to.be.equal(2)
            expect(guardianList[1]).to.be.equal(guardian2.address)
        })

        it('Should emit a GuardianAdded event', async function () {
            await expect(infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, guardian2.address))
                .to.emit(infrastructure.argentModule, 'GuardianAdded')
                .withArgs(walletAccountAbstraction, guardian2.address)
        })

        it('Should revert if the guardian is already a guardian', async function () {
            await expect(infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, guardian1.address)).to.be.revertedWith(
                'SSM: duplicate guardian'
            )
        })

        it('Should revert if the guardian is the owner', async function () {
            await expect(infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, walletOwner.address)).to.be.revertedWith(
                'SSM: guardian cannot be owner'
            )
        })

        it('Should revert if the caller is not the owner', async function () {
            await expect(infrastructure.argentModule.connect(guardian1).addGuardian(walletAccountAbstraction, guardian2.address)).to.be.revertedWith(
                'SSM: caller must be wallet/wallet owner'
            )
        })

        it('Should add a wallet to the guardian', async function () {
            const wallets = await infrastructure.argentModule.connect(walletOwner).getGuardianWallets(guardian2.address)
            expect(wallets.length).to.be.equal(0)

            // Add guardian2
            await infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, guardian2.address)

            const wallets2 = await infrastructure.argentModule.connect(walletOwner).getGuardianWallets(guardian2.address)
            expect(wallets2.length).to.be.equal(1)
            expect(wallets2[0]).to.be.equal(walletAccountAbstraction)
        })
    })

    describe('revokeGuardian', async function () {
        it('Should allow the wallet owner to remove a guardian', async function () {
            // Remove guardian1
            await infrastructure.argentModule.connect(walletOwner).revokeGuardian(walletAccountAbstraction, guardian1.address)

            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian1.address)
            expect(isGuardian).to.be.false

            const guardianList = await infrastructure.argentModule.getGuardians(walletAccountAbstraction)
            expect(guardianList.length).to.be.equal(0)
        })

        it('Should emit a GuardianRevoked event', async function () {
            await expect(infrastructure.argentModule.connect(walletOwner).revokeGuardian(walletAccountAbstraction, guardian1.address))
                .to.emit(infrastructure.argentModule, 'GuardianRevoked')
                .withArgs(walletAccountAbstraction, guardian1.address)
        })

        it('Should revert if the guardian is not a guardian', async function () {
            await expect(infrastructure.argentModule.connect(walletOwner).revokeGuardian(walletAccountAbstraction, guardian2.address)).to.be.revertedWith(
                'SSM: must be existing guardian'
            )
        })

        it('Should remove the wallet from the guardian', async function () {
            const wallets = await infrastructure.argentModule.connect(walletOwner).getGuardianWallets(guardian1.address)
            expect(wallets.length).to.be.equal(1)

            // Remove guardian1
            await infrastructure.argentModule.connect(walletOwner).revokeGuardian(walletAccountAbstraction, guardian1.address)

            const wallets2 = await infrastructure.argentModule.connect(walletOwner).getGuardianWallets(guardian1.address)
            expect(wallets2.length).to.be.equal(0)
        })
    })

    describe('executeRecovery', async function () {
        it('Should allow a guardian to recover the wallet', async function () {
            // before owner
            expect(await IWallet__factory.connect(walletAccountAbstraction, deployer).owner(), walletOwner.address)

            // Recover wallet
            await infrastructure.argentModule.connect(guardian1).executeRecovery(walletAccountAbstraction, newOwner)

            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian1.address)
            expect(isGuardian).to.be.true // guardian1 is still a guardian

            // after owner
            expect(await IWallet__factory.connect(walletAccountAbstraction, deployer).owner(), newOwner.address)
        })

        it('Should emit a Recovery event', async function () {
            await expect(infrastructure.argentModule.connect(guardian1).executeRecovery(walletAccountAbstraction, newOwner))
                .to.emit(infrastructure.argentModule, 'RecoveryFinalized')
                .withArgs(walletAccountAbstraction, newOwner.address)
        })

        it('Should revert if the new owner is the zero address', async function () {
            await expect(infrastructure.argentModule.connect(guardian1).executeRecovery(walletAccountAbstraction, ZeroAddress)).to.be.revertedWith(
                'SSM: new owner cannot be null'
            )
        })

        it('Should revert if the new owner is a guardian', async function () {
            await expect(infrastructure.argentModule.connect(guardian1).executeRecovery(walletAccountAbstraction, guardian1.address)).to.be.revertedWith(
                'SSM: new owner cannot be guardian'
            )
        })

        it('Should revert if called by a non-guardian', async function () {
            await expect(infrastructure.argentModule.connect(guardian2).executeRecovery(walletAccountAbstraction, newOwner)).to.be.revertedWith(
                'SSM: must be guardian/self'
            )
        })
    })

    describe('Integration, relayed tx', async function () {
        beforeEach(async function () {
            // Authorise the argentModule
            await infrastructure.dappRegistry
                .connect(deployer)
                .setAuthorised(await infrastructure.argentModule.getAddress(), true);
        })


        it('addGuardian', async function () {
            // walletOwner should be able to add a guardian with a relayed transaction

            const tx = ArgentModule__factory.createInterface().encodeFunctionData('addGuardian', [walletAccountAbstraction, guardian2.address])

            const preparedTx = {
                to: await infrastructure.argentModule.getAddress(),
                value: 0n,
                data: tx,
            }

            const wrappedTx = ArgentModule__factory.createInterface().encodeFunctionData('multiCall', [walletAccountAbstraction, [preparedTx]])

            const baseChainId = (await ethers.provider.getNetwork()).chainId
            const nonce = await generateNonceForRelay()
            const gasLimit = 1000000

            const signedTransaction = await signOffchain(
                [walletOwner],
                await infrastructure.argentModule.getAddress(),
                0,
                wrappedTx,
                baseChainId,
                nonce,
                0,
                gasLimit,
                '0x0000000000000000000000000000000000000000',
                ZeroAddress
            )

            const txSent = await infrastructure.argentModule
                .connect(deployer)
                .execute(
                    walletAccountAbstraction,
                    wrappedTx,
                    nonce,
                    signedTransaction,
                    0,
                    gasLimit,
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000"
                );

            await txSent.wait();

            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian2.address)
            expect(isGuardian).to.be.true
        })

        it('revokeGuardian', async function () {
            // walletOwner should be able to revoke a guardian with a relayed transaction

            const tx = ArgentModule__factory.createInterface().encodeFunctionData('revokeGuardian', [walletAccountAbstraction, guardian1.address])

            const preparedTx = {
                to: await infrastructure.argentModule.getAddress(),
                value: 0n,
                data: tx,
            }

            const wrappedTx = ArgentModule__factory.createInterface().encodeFunctionData('multiCall', [walletAccountAbstraction, [preparedTx]])

            const baseChainId = (await ethers.provider.getNetwork()).chainId
            const nonce = await generateNonceForRelay()
            const gasLimit = 1000000

            const signedTransaction = await signOffchain(
                [walletOwner],
                await infrastructure.argentModule.getAddress(),
                0,
                wrappedTx,
                baseChainId,
                nonce,
                0,
                gasLimit,
                '0x0000000000000000000000000000000000000000',
                ZeroAddress
            )

            const txSent = await infrastructure.argentModule
                .connect(deployer)
                .execute(
                    walletAccountAbstraction,
                    wrappedTx,
                    nonce,
                    signedTransaction,
                    0,
                    gasLimit,
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000"
                );

            await txSent.wait();

            const isGuardian = await infrastructure.argentModule.isGuardian(walletAccountAbstraction, guardian1.address)
            expect(isGuardian).to.be.false

            const guardianList = await infrastructure.argentModule.getGuardians(walletAccountAbstraction)
            expect(guardianList.length).to.be.equal(0)

        })

        it('executeRecovery', async function () {
            // guardian should be able to recover an address with a relayed transaction

            // remove guardian1
            await infrastructure.argentModule.connect(walletOwner).revokeGuardian(walletAccountAbstraction, guardian1.address)

            // Create wallet contract for guardian1
            const walletAccountAbstractionGuardian1 = await createWallet(
                infrastructure.walletFactory,
                guardian1.address,
                guardian2.address,
                deployer.address,
                await infrastructure.argentModule.getAddress()
            )

            // add guardian1 walletAccountAbstraction
            await infrastructure.argentModule.connect(walletOwner).addGuardian(walletAccountAbstraction, walletAccountAbstractionGuardian1)

            // before owner
            expect(await IWallet__factory.connect(walletAccountAbstraction, deployer).owner(), walletOwner.address).to.be.equal(walletOwner.address)

            const tx = ArgentModule__factory.createInterface().encodeFunctionData('executeRecovery', [walletAccountAbstraction, newOwner.address])

            const preparedTx = {
                to: await infrastructure.argentModule.getAddress(),
                value: 0n,
                data: tx,
            }

            const wrappedTx = ArgentModule__factory.createInterface().encodeFunctionData('multiCallWithGuardians', [walletAccountAbstraction, [preparedTx]])

            const baseChainId = (await ethers.provider.getNetwork()).chainId
            const nonce = await generateNonceForRelay()
            const gasLimit = 1000000

            const signedTransaction = await signOffchain(
                [guardian1],
                await infrastructure.argentModule.getAddress(),
                0,
                wrappedTx,
                baseChainId,
                nonce,
                0,
                gasLimit,
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000"
                );

            const txSent = await infrastructure.argentModule
                .connect(deployer)
                .execute(
                    walletAccountAbstraction,
                    wrappedTx,
                    nonce,
                    signedTransaction,
                    0,
                    gasLimit,
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000"
                );

            const r = await txSent.wait();

            // after owner
            const owner = await IWallet__factory.connect(walletAccountAbstraction, deployer).owner()
            expect(owner).to.be.equal(newOwner.address)
        })
    })
})
