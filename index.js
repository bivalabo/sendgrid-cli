require('dotenv').config();
const prompts = require('prompts');
const client = require('./sendgrid');

(async () => {
  const { apiKey } = await prompts({
    type: 'text',
    name: 'apiKey',
    initial: process.env.SENDGRID_API_KEY,
    message: 'Enter your Sendgrid API Key'
  });

  if (apiKey === undefined) {
    return;
  }

  client.setApiKey(apiKey);

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select the action',
    choices: [
      { title: 'Delete invalid email address list', value: 'delete_invalid' }
    ]
  });

  if (action === 'delete_invalid') {
    const subusers = await client.getSubusers();
    const subuserChoices = subusers.map(v => {
      return { title: v, value: v }
    });

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
    ]);

    const options = { subusers: all ? subusers : targets }
    await client.deleteInvalid(options);
    console.log('Done!')
  }
})();
