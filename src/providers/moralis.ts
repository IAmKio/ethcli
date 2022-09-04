import Moralis from 'moralis'
import Conf = require('conf')
import MoralisEvmApi from '@moralisweb3/evm-api'

const config = new Conf()

export function evmApi(): MoralisEvmApi {
  const apiKey = config.get('apiKey') as string

  Moralis.start({
    apiKey,
  })

  return Moralis.EvmApi
}
