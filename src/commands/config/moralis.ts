/* eslint-disable unicorn/prefer-module */
import {Command, Flags} from '@oclif/core'
const inquirer = require('inquirer')
import Conf = require('conf');

const config = new Conf()

export default class Moralis extends Command {
  static description = 'Set your Moralis config options here'

  static examples = [
    '$ eth config moralis -c -k',
  ]

  static flags = {
    key: Flags.boolean({char: 'k', description: 'Enter your Moralis API key', default: false}),
    chains: Flags.boolean({char: 'c', description: 'Choose your chain', default: false}),
  }

  async askToContinue(): Promise<boolean> {
    const r = await inquirer
    .prompt([{
      type: 'confirm',
      name: 'continue',
      message: 'This will change your Moralis settings. Are you sure you want to continue?',
    }])
    .then((answers: any) => answers)

    return r.continue
  }

  async askForMoralisKey(): Promise<void> {
    await inquirer
    .prompt([{
      type: 'password',
      message: 'What is your Moralis API Key?',
      name: 'apiKey',
    }])
    .then((answers: any) => {
      config.set('apiKey', answers.apiKey)

      this.log('We\'ve saved your API key')
    })
    .catch((error: { isTtyError: any }) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    })
  }

  async askForChains(): Promise<void> {
    await inquirer
    .prompt([{
      type: 'checkbox',
      message: 'Which chains do you want to query by default?',
      name: 'chains',
      choices: [{
        name: 'Ethereum',
        value: 'eth',
      }, {
        name: 'Polygon',
        value: 'polygon',
      }, {
        name: 'BSC',
        value: 'bsc',
      }],
      validate(answer: any) {
        if (answer.length === 0) {
          return 'You must choose at least one chain.'
        }

        return true
      },
    }])
    .then((answers: any) => {
      config.set('chain', answers.chains[0])
      this.log(`We've saved your choice - ${answers.chains[0]}`)
    })
    .catch((error: { isTtyError: any }) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    })
  }

  async run(): Promise<void> {
    const decision = await this.askToContinue()

    if (decision) {
      await this.askForChains()
      await this.askForMoralisKey()

      this.log('Go forth and query, fearless developer!')
    } else {
      this.log('Sure, no worries! Nothing has been changed.')
    }
  }
}
