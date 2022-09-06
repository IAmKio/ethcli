import {Command, CliUx} from '@oclif/core'
import {bold, dim, underline} from 'colorette'
import {DateTime} from 'luxon'
import {evmApi} from '../../providers/moralis'
import {getChain} from '../../utilities/chains'
import {hasRequiredConfig} from '../../utilities/checks'
import {defaultFlags} from '../../utilities/defaults'

const api = evmApi()

export default class Nfts extends Command {
  static description = 'Fetch NFTs for an address'

  static examples = [
    '$ eth nfts 0x11041745893Fa72629aB93ea8adaf35A1dc24AA6',
  ]

  static args = [{name: 'address', description: 'The blockchain address to query NFTs for', required: true}]
  static flags = {...defaultFlags()}

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Nfts)

    if (!hasRequiredConfig()) {
      this.log('Sorry, before you can continue - you need to set some options. Try running $ eth config moralis')
      return
    }

    /**
     * First, get the balances...
     */
    CliUx.ux.action.start('Querying...')

    const nfts = await api.account.getNFTs({
      address: args.address,
      chain: getChain(flags.chain),
    })

    CliUx.ux.action.stop()

    this.log()
    this.log(`${underline(bold(args.address))}`)

    for (const nft of nfts.result) {
      this.log()
      this.log(`${underline(nft.result.name ? nft.result.name : dim('(no nft name)'))}`)
      this.log(`${bold('➜ Token ID:')} ${nft.result.tokenId}`)
      this.log(`${bold('➜ Amount:')} ${nft.result.amount}`)
      this.log(`${bold('➜ Contract Type:')} ${nft.result.contractType.toString()}`)
      this.log(`${bold('➜ Contract Address:')} ${nft.result.tokenAddress.checksum}`)
      this.log(`${bold('➜ Block Explorer:')} ${nft.result.chain.getExplorerPath({erc20: nft.result.tokenAddress.checksum})}`)
      this.log(`${bold('➜ Last metadata sync:')} ${nft.result.lastMetadataSync ? `${DateTime.fromJSDate(nft.result.lastMetadataSync).toRelative()} / ${nft.result.lastMetadataSync.toUTCString()}` : dim('(not synced)')}`)
      this.log(`${bold('➜ Last token sync:')} ${nft.result.lastTokenUriSync ? `${DateTime.fromJSDate(nft.result.lastTokenUriSync).toRelative()} / ${nft.result.lastTokenUriSync.toUTCString()}` : dim('(not synced)')}`)
    }
  }
}
