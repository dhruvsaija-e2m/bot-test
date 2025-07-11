require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// /start-project shortcut handler
app.command('/service', async ({ ack, body, client }) => {
  console.log('Received /service command', { user_id: body.user_id, trigger_id: body.trigger_id });
  await ack();
  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'project_type_modal',
        title: { type: 'plain_text', text: 'Project Kickoff' },
        submit: { type: 'plain_text', text: 'Next' },
        close: { type: 'plain_text', text: 'Cancel' },
        blocks: [
          {
            type: 'input',
            block_id: 'project_type_block',
            label: { type: 'plain_text', text: 'Project Type' },
            element: {
              type: 'static_select',
              action_id: 'project_type',
              initial_option: {
                text: { type: 'plain_text', text: 'Messaging' },
                value: 'Messaging',
              },
              options: [
                { text: { type: 'plain_text', text: 'Architecture' }, value: 'Architecture' },
                { text: { type: 'plain_text', text: 'Copywriting' }, value: 'Copywriting' },
                { text: { type: 'plain_text', text: 'Messaging' }, value: 'Messaging' },
                { text: { type: 'plain_text', text: 'Naming' }, value: 'Naming' },
                { text: { type: 'plain_text', text: 'Research' }, value: 'Research' },
                { text: { type: 'plain_text', text: 'Strategy' }, value: 'Strategy' },
                { text: { type: 'plain_text', text: 'Visual Design' }, value: 'Visual Design' },
                { text: { type: 'plain_text', text: 'Voice' }, value: 'Voice' },
                { text: { type: 'plain_text', text: 'Web Design' }, value: 'Web Design' },
              ],
            },
          },
        ],
      },
    });
    console.log('Initial modal opened');
  } catch (error) {
    console.error('Error opening initial modal:', error);
  }
});

// Handle submission of the project type modal
app.view('project_type_modal', async ({ ack, view, body }) => {
  console.log('project_type_modal view submission received', { user: body.user.id, view_state: view.state });
  const projectType = view.state.values.project_type_block.project_type.selected_option.value;
  console.log('Selected project type:', projectType);
  if (projectType === 'Messaging') {
    console.log('Updating modal to Messaging Details');
    await ack({
      response_action: 'update',
      view: {
        type: 'modal',
        callback_id: 'messaging_project_details',
        title: { type: 'plain_text', text: 'Messaging Details' },
        submit: { type: 'plain_text', text: 'Submit' },
        close: { type: 'plain_text', text: 'Cancel' },
        private_metadata: JSON.stringify({ projectType }),
        blocks: [
          {
            type: 'input',
            block_id: 'complexity_level_block',
            label: { type: 'plain_text', text: 'Complexity Level' },
            element: {
              type: 'static_select',
              action_id: 'complexity_level',
              options: [
                { text: { type: 'plain_text', text: 'Tier 1' }, value: 'Tier 1' },
                { text: { type: 'plain_text', text: 'Tier 2' }, value: 'Tier 2' },
                { text: { type: 'plain_text', text: 'Tier 3' }, value: 'Tier 3' },
              ],
            },
          },
          {
            type: 'input',
            block_id: 'client_materials_block',
            label: { type: 'plain_text', text: 'How many client materials to review?' },
            element: {
              type: 'static_select',
              action_id: 'client_materials',
              options: [
                { text: { type: 'plain_text', text: '3' }, value: '3' },
                { text: { type: 'plain_text', text: '5' }, value: '5' },
                { text: { type: 'plain_text', text: '10' }, value: '10' },
                { text: { type: 'plain_text', text: '15' }, value: '15' },
              ],
            },
          },
          {
            type: 'input',
            block_id: 'competitors_analyze_block',
            label: { type: 'plain_text', text: 'How many competitors to analyze?' },
            element: {
              type: 'static_select',
              action_id: 'competitors_analyze',
              options: [
                { text: { type: 'plain_text', text: '2' }, value: '2' },
                { text: { type: 'plain_text', text: '3' }, value: '3' },
                { text: { type: 'plain_text', text: '5' }, value: '5' },
                { text: { type: 'plain_text', text: '8' }, value: '8' },
              ],
            },
          },
          {
            type: 'input',
            block_id: 'strategy_session_block',
            label: { type: 'plain_text', text: 'How long of a strategy work session is required?' },
            element: {
              type: 'static_select',
              action_id: 'strategy_session',
              options: [
                { text: { type: 'plain_text', text: '60 minutes' }, value: '60 minutes' },
                { text: { type: 'plain_text', text: '1.5 hours' }, value: '1.5 hours' },
                { text: { type: 'plain_text', text: '4 hours' }, value: '4 hours' },
              ],
            },
          },
          {
            type: 'input',
            block_id: 'review_rounds_block',
            label: { type: 'plain_text', text: 'How many rounds of review?' },
            element: {
              type: 'static_select',
              action_id: 'review_rounds',
              options: [
                { text: { type: 'plain_text', text: 'None' }, value: 'None' },
                { text: { type: 'plain_text', text: 'One' }, value: 'One' },
                { text: { type: 'plain_text', text: 'Two' }, value: 'Two' },
                { text: { type: 'plain_text', text: 'Three' }, value: 'Three' },
              ],
            },
          },
        ],
      }
    });
    return;
  }
  console.log('Project type is not Messaging, closing modal');
  await ack();
});

app.view('messaging_project_details', async ({ ack, view, body }) => {
  console.log('messaging_project_details view submission received', { user: body.user.id, view_state: view.state });
  await ack();
  // Collect data from the modal
  const values = view.state.values;
  const meta = view.private_metadata ? JSON.parse(view.private_metadata) : {};
  const data = {
    user: body.user.id,
    project_type: meta.projectType,
    complexity_level: values.complexity_level_block.complexity_level.selected_option.value,
    client_materials: values.client_materials_block.client_materials.selected_option.value,
    competitors_analyze: values.competitors_analyze_block.competitors_analyze.selected_option.value,
    strategy_session: values.strategy_session_block.strategy_session.selected_option.value,
    review_rounds: values.review_rounds_block.review_rounds.selected_option.value,
  };
  console.log('Sending data to webhook:', data);
  try {
    const response = await fetch('https://n8n.sitepreviews.dev/webhook/3cee73bb-dda9-4adb-8b5c-f3b9c383115e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const respText = await response.text();
    console.log('Webhook response:', respText);
  } catch (error) {
    console.error('Error sending data to webhook:', error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Slack Bolt app is running!');
})(); 