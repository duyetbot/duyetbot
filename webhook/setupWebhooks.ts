import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { Octokit } from 'https://cdn.skypack.dev/octokit?dts'

config({ export: true })
config({ export: true, path: '.env.local' })

const WEBHOOK_URL = Deno.env.get('WEBHOOK_URL')

async function setupWebhooks() {
  console.log('Setting up webhooks...')
  const octokit = new Octokit({
    auth: Deno.env.get('BOT_PAI'),
  })

  // Get a list of the repositories you have access to
  const repositories = await octokit.request('GET /user/repos')

  // Loop through the repositories and create a webhook for each one
  for (const repository of repositories.data) {
    await octokit.request('POST /repos/{owner}/{repo}/hooks', {
      owner: repository.owner.login,
      repo: repository.name,
      name: 'web',
      config: {
        url: WEBHOOK_URL,
        content_type: 'json',
      },
      events: ['issues', 'issue_comment'],
      active: true,
    })
  }
}

await setupWebhooks()
