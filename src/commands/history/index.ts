import {Command, CliUx} from '@oclif/core'
import {evmApi} from '../../providers/moralis'
import {EvmTransaction} from '@moralisweb3/evm-utils'
import {hasRequiredConfig} from '../../utilities/checks'
import {DateTime} from 'luxon'

interface PromptEvmTransaction {
  chosenTx: EvmTransaction
}

const inquirer = require('inquirer')

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
      this.log()
      this.log(`From: ${answer.chosenTx.from.checksum}`)
      this.log(`Contract address: ${answer.chosenTx.contractAddress ? answer.chosenTx.contractAddress?.checksum : 'No contract address interaction'}`)
      this.log(`To: ${answer.chosenTx.to?.checksum}`)
      this.log(`Value: ${answer.chosenTx.value}`)
      this.log()
      this.log(`Block hash: ${answer.chosenTx.blockHash}`)
      this.log(`Block number: ${answer.chosenTx.blockNumber}`)
      this.log(`Block relative timestamp: ${DateTime.fromJSDate(answer.chosenTx.blockTimestamp).toRelative()}`)
      this.log(`Block timestamp: ${answer.chosenTx.blockTimestamp}`)
      this.log()
      this.log(`Estimated Gas: ${answer.chosenTx.gas}`)
      this.log(`-> Actual gas used: ${answer.chosenTx.gasUsed}`)
      this.log(`-> Gas price: ${answer.chosenTx.gasPrice}`)
      this.log()
    })
  }
}
