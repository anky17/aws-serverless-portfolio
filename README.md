# Serverless Portfolio & Blog

Portfolio + blog site built as a class project. Static frontend on S3, API on API Gateway + Lambda, posts in DynamoDB, Cognito login gates who can publish.

**Student ID:** 79010402

## Live

- Website: _add S3 website URL after deploy_
- API: _add API Gateway URL after deploy_

## Features

- Portfolio page
- Public blog listing and post view
- Login (Cognito) unlocks a "New Post" form
- Only a signed-in user can create posts; reads are open

## Stack

S3 · API Gateway · Lambda (Python 3.12) · DynamoDB · Cognito · CloudWatch · AWS SAM

## Layout

```
backend/            # one Lambda per route (create_post, list_posts, get_post)
frontend/           # static site (portfolio, blog, post, new-post, app.js)
template.yaml       # SAM template - all AWS resources
```

## Deploy

```bash
sam build
sam deploy --guided
```

Built against an AWS Academy Learner Lab, so `template.yaml` defaults the Lambda role to the sandbox's `LabRole`. Deploying elsewhere:

```bash
sam deploy --guided --parameter-overrides LabRoleArn=arn:aws:iam::<account-id>:role/<role-name>
```

After deploy, copy `ApiUrl` and `UserPoolClientId` from the stack outputs into `frontend/js/app.js`, then sync the frontend:

```bash
aws s3 sync frontend/ s3://<bucket-name>/
```
