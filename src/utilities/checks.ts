import Conf = require('conf')

const config = new Conf()

export function hasRequiredConfig(): boolean  {
  if (config.has('apiKey') && config.has('chain')) {
    return true
  }

  return false
}
