# Slack Leaderboard

This is a Slack app that can be used to track results of 1v1 games, such as ping pong. It has been built using Deno and the Slack CLI. Follow the steps under [Setup](#setup) to deploy the app to your workspace.

## Features

- Report a win/loss played against another user
- Show a channel's leaderboard, including every user's wins, losses and rating.

Each win/loss will update a player's rating using the [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system).

---

## Setup

Before getting started, make sure you have a development workspace where you have permissions to install apps. If you don’t have one set up, go ahead and [create one](https://slack.com/create). **Also, please note that the workspace requires any of [the Slack paid plans](https://slack.com/pricing).**

### Install the Slack CLI

To use this app in your workspace, you first need to install and configure the Slack CLI. Step-by-step instructions can be found in the [Quickstart Guide](https://api.slack.com/future/quickstart).

### Create a Link Trigger

[Triggers](https://api.slack.com/future/triggers) are what cause workflows to run. This app uses [link triggers](https://api.slack.com/future/triggers/link).

To create the link triggers for the workflows in this app, run the following commands:

```zsh
$ slack trigger create --trigger-def triggers/report_trigger.ts
$ slack trigger create --trigger-def triggers/leaderboard_trigger.ts
```

After selecting a workspace and environment, the output provided will include the link trigger Shortcut URL. Copy and paste this URL into a channel as a message, or add it as a bookmark in a channel of the workspace you selected.

**Note: this link won't run the workflow until the app is either running locally or deployed!**

### Deploying The App

You can deploy the production version of the app to Slack hosting using `slack deploy`:

```zsh
$ slack deploy
```

---

## Project Structure

### `manifest.ts`

The [app manifest](https://api.slack.com/future/manifest) contains the app's configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains script hooks that are executed by the CLI and implemented by the SDK.

### `/functions`

[Functions](https://api.slack.com/future/functions) are reusable building blocks of automation that accept inputs, perform calculations, and provide outputs. Functions can be used independently or as steps in workflows.

### `/workflows`

A [workflow](https://api.slack.com/future/workflows) is a set of steps that are executed in order. Each step in a workflow is a function.

Workflows can be configured to run without user input or they can collect input by beginning with a [form](https://api.slack.com/future/forms) before continuing to the next step.

### `/triggers`

[Triggers](https://api.slack.com/future/triggers) determine when workflows are executed. A trigger file describes a scenario in which a workflow should be run, such as a user pressing a button or when a specific event occurs.

### `/datastores`

[Datastores](https://api.slack.com/future/datastores) can securely store and retrieve data for your application. Required scopes to use datastores include `datastore:write` and `datastore:read`.

## Resources

To learn more about developing with the CLI, you can visit the following guides:

- [Creating a new app with the CLI](https://api.slack.com/future/create)
- [Configuring your app](https://api.slack.com/future/manifest)
- [Developing locally](https://api.slack.com/future/run)

To view all documentation and guides available, visit the [Overview page](https://api.slack.com/future/overview).
