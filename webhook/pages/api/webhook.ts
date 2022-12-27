import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from '@octokit/rest'

const BOT_USERNAME = process.env.BOT_USERNAME
const BOT_PAI = process.env.BOT_PAI

const octokit = new Octokit({
  auth: BOT_PAI,
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body
  console.log('Request', event)

  // Check if the event is a pull request review comment
  if (
    event.action === 'created' &&
    event.comment.body.includes(BOT_USERNAME)
  ) {
    // Get the comment details
    const { owner, repo, pull_number, comment_id } = event.pull_request
    console.log('PR info', owner, repo, pull_number, comment_id)

    // Post a reply to the comment
    octokit.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: 'Thanks for mentioning me! I will take a look at this pull request.',
    })

    res.json({})
  }
}
