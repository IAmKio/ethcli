/* eslint-disable unicorn/prefer-module */
import {Command, CliUx} from '@oclif/core'
import {bold, dim} from 'colorette'
import {DateTime} from 'luxon'
import {EvmTransaction} from '@moralisweb3/evm-utils'

import {evmApi} from '../../providers/moralis'
import {hasRequiredConfig} from '../../utilities/checks'
const inquirer = require('inquirer')

interface PromptEvmTransaction {
  chosenTx: EvmTransaction
}

const api = evmApi()

export default class History extends Command {
  static description = 'Fetch history for an address'

  static examples = [
    '$ eth history 0x11041745893Fa72629aB93ea8adaf35A1dc24AA6',
  ]

  static args = [{name: 'address', description: 'The blockchain address to query history for', required: true}]

  async run(): Promise<void> {
    const {args} = await this.parse(History)

    if (!hasRequiredConfig()) {
      this.log('Sorry, before you can continue - you need to set some options. Try running $ eth config moralis')
      return
    }

    CliUx.ux.action.start(`Centralising history for ${args.address}...`)

    const transactions = await api.account.getTransactions({
      address: args.address,
    })

    CliUx.ux.action.stop()

    const txChoices = transactions.result.map(tx => {
      const blockTimestampAgo = DateTime.fromJSDate(tx.blockTimestamp).toRelative()
      const choice = {
        name: `${blockTimestampAgo} - ${tx.hash}`,
        value: tx,
      }

      return choice
    })

    await inquirer
    .prompt([{
      type: 'list',
      message: `Here's what we found for ${args.address}. Select one to view more:`,
      name: 'chosenTx',
      choices: txChoices,
    }])
    .then((answer: PromptEvmTransaction) => {
      const tx: EvmTransaction = answer.chosenTx
      const gasPercentageUsed: string | undefined = tx.gas?.div(tx.gasUsed).mul(100).toDecimal(0)

      this.log()
      this.log(`${bold('From:')} ${tx.from.checksum}`)
      this.log(`${bold('Contract address:')} ${tx.contractAddress ? tx.contractAddress?.checksum : dim('No contract address interaction')}`)
      this.log(`${bold('To:')} ${tx.to?.checksum}`)
      this.log(`${bold('Value:')} ${tx.value?.ether} Ether`)
      this.log()
      this.log(`${bold('Block hash:')} ${tx.blockHash}`)
      this.log(`${bold('➜ Block number:')} ${tx.blockNumber}`)
      this.log(`${bold('➜ Block relative timestamp:')} ${DateTime.fromJSDate(tx.blockTimestamp).toRelative()}`)
      this.log(`${bold('➜ Block timestamp:')} ${tx.blockTimestamp}`)
      this.log()
      this.log(`${bold('Estimated Gas:')} ${tx.gas}`)
      this.log(`${bold('➜ Actual gas used:')} ${tx.gasUsed} (${gasPercentageUsed}% of estimate used)`)
      this.log(`${bold('➜ Gas price at the time:')} ${tx.gasPrice}`)
      this.log()
      this.log(`${bold('Block Explorer:')}`)
      this.log(`${bold('➜ Transaction:')} ${tx.chain.getExplorerPath({transaction: tx.hash})})`)
      this.log(`${bold('➜ Block:')} ${tx.chain.getExplorerPath({block: tx.blockHash})})`)
    })
  }
}
