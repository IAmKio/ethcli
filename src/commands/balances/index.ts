import {Command, CliUx} from '@oclif/core'

export default class Balances extends Command {
  static description = 'Fetch balances for an address'

  static examples = [
    '$ eth balances 0x11041745893Fa72629aB93ea8adaf35A1dc24AA6',
  ]

  static args = [{name: 'address', description: 'The blockchain address to query balances for', required: true}]

  async run(): Promise<void> {
    const {args} = await this.parse(Balances)

    CliUx.ux.action.start('Querying...')
    setTimeout(() => CliUx.ux.action.stop(), 3000)

    this.log(`hello ${args.address} `)
  }
}
