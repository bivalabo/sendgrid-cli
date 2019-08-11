const { Client } = require('@sendgrid/client');

class MyClient extends Client {
  async getSubusers() {
    const [response, subusers] = await this.request({ method: 'GET', url: '/v3/subusers' })
    return subusers.filter(v => v.disabled === false).map(v => v.username).sort();
  }

  async deleteInvalid({ subusers }) {
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
      });
    }, Promise.resolve());
  }
}

module.exports = new MyClient();
