import Conf = require('conf')

const config = new Conf()

export function hasRequiredConfig(): boolean  {
  if (config.has('apiKey') && config.has('chain')) {
    const apiKey = config.get('apiKey') as string
    console.log('API key?', apiKey)
    return true
  }

  return false
}
