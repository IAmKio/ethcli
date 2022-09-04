/* eslint-disable unicorn/prefer-module */
import {Command, CliUx} from '@oclif/core'
import {bold, dim, underline} from 'colorette'
import {evmApi} from '../../providers/moralis'
import {hasRequiredConfig} from '../../utilities/checks'

const api = evmApi()

export default class Balances extends Command {
  static description = 'Fetch balances for an address'

  static examples = [
    '$ eth balances 0x11041745893Fa72629aB93ea8adaf35A1dc24AA6',
  ]

  static args = [{name: 'address', description: 'The blockchain address to query balances for', required: true}]

  async run(): Promise<void> {
    const {args} = await this.parse(Balances)

    if (!hasRequiredConfig()) {
      this.log('Sorry, before you can continue - you need to set some options. Try running $ eth config moralis')
      return
    }

    /**
     * First, get the balances...
     */
    CliUx.ux.action.start('Querying...')

    const nativeBalance = await api.account.getNativeBalance({
      address: args.address,
    })

    const tokenBalances = await api.account.getTokenBalances({
      address: args.address,
    })

    CliUx.ux.action.stop()

    this.log()
    this.log(`${underline(bold(args.address))}`)
    this.log(`${bold('➜ Native Balance:')} ${nativeBalance.result.balance.ether} Ether`)

    for (const balance of tokenBalances.result) {
      this.log()
      this.log(`${underline(balance.token ? balance.token.name : dim('No token name'))} (${balance.token ? balance.token.symbol : dim('(no symbol)')})`)
      this.log(`${bold('➜ Amount:')} ${balance.display()}`)
      this.log(`${bold('➜ Contract:')} ${balance.token?.contractAddress.checksum}`)
      this.log(`${bold('➜ Block Explorer:')} ${balance.token?.chain.getExplorerPath({erc20: balance.token?.contractAddress.checksum})}`)
    }
  }
}
