import { Client } from '@sendgrid/client'
import { ClientResponse } from '@sendgrid/client/src/response'
import { Subuser } from './types'

class MyClient extends Client {
  request<T> (...args: Parameters<Client['request']>): Promise<[ClientResponse, T]> {
    return super.request(...args)
  }

  async getSubusers () {
    const [, subusers] = await this.request<Subuser[]>({ method: 'GET', url: '/v3/subusers' })
    return subusers.filter(v => v.disabled === false).map(v => v.username).sort()
  }

  async deleteInvalid ({ subusers }) {
    return subusers.reduce((prev, cur) => {
      return prev.then(async () => {
        await this.request({
          method: 'DELETE',
          url: '/v3/suppression/invalid_emails',
          headers: {
            'on-behalf-of': cur
          },
          body: { delete_all: true }
        })
      })
    }, Promise.resolve())
  }
}

export default new MyClient()
