import 'dotenv/config'
import prompts from 'prompts'
import client from './lib/sendgrid'

async function main () {
  const { apiKey } = await prompts({
    type: 'text',
    name: 'apiKey',
    initial: process.env.SENDGRID_API_KEY,
    message: 'Enter your Sendgrid API Key'
  }, { onCancel })

  if (apiKey === undefined) {
    return
  }

  client.setApiKey(apiKey)

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select the action',
    choices: Object.entries(actions).map(([key, { title }]) => ({ title, value: key }))
  }, { onCancel })

  if (action) {
    actions[action].cb()
  }
}

const actions = {
  deleteInvalid: {
    title: 'Delete invalid email address list',
    cb: async () => {
      const subusers = await client.getSubusers()
      const subuserChoices = subusers.map(v => {
        return { title: v, value: v }
      })

      const { all, targets } = await prompts([
        {
          type: 'toggle',
          name: 'all',
          message: `Do you want to execute the action for all (${subusers.length}) subusers?`,
          active: 'Yes.',
          inactive: 'No, only specific subusers.'
        },
        {
          type: prev => prev ? null : 'multiselect',
          name: 'targets',
          message: 'Select subusers to execute action',
          choices: subuserChoices
        }
      ], { onCancel })

      if (!all && targets === undefined) {
        return
      }

      const options = { subusers: all ? subusers : targets }
      await client.deleteInvalid(options)
      console.log('Done!')
    }
  },
}

const onCancel = () => {
  console.log('canceled.')
}

main()
