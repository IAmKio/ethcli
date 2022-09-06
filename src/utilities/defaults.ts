import {Flags} from '@oclif/core'
import {OptionFlag} from '@oclif/core/lib/interfaces'

interface IFlagDefaults {
  chain: OptionFlag<string>,
}

export function defaultFlags(): IFlagDefaults {
  return {
    chain: Flags.string({char: 'c', description: 'The chain to query', default: 'eth'}),
  }
}
