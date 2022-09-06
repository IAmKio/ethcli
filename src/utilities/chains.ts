import {EvmChain} from '@moralisweb3/evm-utils'

export function getChain(chainName?: string | undefined | null): EvmChain {
  if (!chainName) {
    return EvmChain.ETHEREUM
  }

  if (chainName.includes('eth')) {
    return EvmChain.ETHEREUM
  }

  if (chainName.includes('poly') || chainName.includes('matic')) {
    return EvmChain.POLYGON
  }

  if (chainName.includes('bsc') || chainName.includes('binance')) {
    return EvmChain.BSC
  }

  if (chainName.includes('avax') || chainName.includes('avalanche')) {
    return EvmChain.AVALANCHE
  }

  return EvmChain.ETHEREUM
}
