---
layout: "article.njk"
title: How to deploy single Nx application
description: How to deploy your nx app with Firebase hosting.
image: "/assets/images/deploy-single-nx-application.png"
imageAlt: Nx, Firebase
date: 2025-05-12
chips: ["Nx", "Angular", "Firebase"]
tags:
  - post
  - tech
---

If you've built a single application within an [Nx monorepo](https://nx.dev/),
you might be wondering how to deploy it efficiently.

In this article, you will learn how to deploy single Nx application. As an example,
I'll demonstrate deploying an Nx [Angular](https://angular.dev/) application to [Firebase](https://firebase.google.com/),
but the steps are similar for other hosting services or application types.

Additionally, I will explain how to use [GitHub Actions](https://github.com/features/actions) to automatically
deploy the application to Firebase and set up [PR previews](https://docs.github.com/en/pull-requests).

> **TL;DR**: First, build the application, then host the dist (built) files.

## Create Nx workspace

<a class="skip" href="#build-nx-application">Skip to Build Nx application</a>

Create a new Nx workspace using the following command:

```
npx create-nx-workspace
```

Select as you like, but it's preferable to use these answers:

| Question                                           | Answer     | Is required to do same | Comment                                                                    |
| -------------------------------------------------- | ---------- | ---------------------- | -------------------------------------------------------------------------- |
| Where would you like to create your workspace?     |            |                        | Up to you                                                                  |
| Which stack do you want to use?                    | angular    | ✔                      | Can be different but in this article we will use angular                   |
| Integrated monorepo, or standalone project?        | standalone | ✔                      | Can be done with different monorepos but it's differnet approach           |
| Which bundler would you like to use?               | esbuild    |                        | Up to you                                                                  |
| Do you want to enable Server-Side Rendering (SSR)? | No         | ✔                      | Can be done with SSR but to keep simple we will not use it in this article |
| Which unit test runner would you like to use?      | jest       |                        | if you don't want choose `None`                                            |
| Test runner to use for end to end (E2E) tests      | cypress    |                        | if you don't want choose `None`                                            |
| Which CI provider would you like to use?           | github     |                        | if you don't want choose `Do it later`                                     |

After selecting the answers, the output should be similar to this:

```
NX Let's create a new workspace [https://nx.dev/getting-started/intro]

√ Where would you like to create your workspace? · myorg
√ Which stack do you want to use? · angular
√ Integrated monorepo, or standalone project? · standalone
√ Which bundler would you like to use? · esbuild
√ Default stylesheet format · scss
√ Do you want to enable Server-Side Rendering (SSR)? · No
√ Which unit test runner would you like to use? · jest
√ Test runner to use for end to end (E2E) tests · cypress
√ Which CI provider would you like to use? · github

NX   Creating your v21.0.3 workspace.

√ Installing dependencies with npm
√ Successfully created the workspace: myorg.
√ Nx Cloud has been set up successfully
√ CI workflow has been generated successfully

NX   Your CI setup is almost complete.

Finish it by visiting: **some link**
```

If you choose to have CI setup then visit generated link and finish setup.
Also create a [GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) and push commit.

## Build Nx application

<a class="skip" href="#deploying-application">Skip to Deploying application</a>

Open `package.json` and add new build script:

```json
  "scripts": {
    "start": "nx serve",
    "test": "nx test",
    "build": "nx build"
  },
```

Then run command:

```
npm run build
```

After successfully running the command, you should see the `dist` folder created, similar to this:

```
└───myorg
    │   3rdpartylicenses.txt
    │
    └───browser
            favicon.ico
            index.html
            main.5a298c85.js
            main.5a298c85.js.map
            polyfills.aa27756f.js
            polyfills.aa27756f.js.map
            runtime.6d078a63.js
            styles.0e7703da.js
            styles.ef46db37.css
```

To deploy the application, we need to host the `browser` folder.

## Deploying application

<a class="skip" href="#deploying-to-firebase">Skip to Deploying to firebase</a>

An application can be deployed on many hosting services,
but I prefer Firebase since it offers an easy setup with GitHub Actions.
While using GitHub Actions is optional, I recommend syncing it with GitHub for a smoother workflow.

If you didn't choose a CI provider, you can skip to [Deploying to firebase](#deploying-to-firebase)

We need to make a small modification to `ci.yml` to ensure it runs correctly. Find `npm ci` and replace it with `npm i`.
This change will prevent issues when installing dependencies, as it will install modules based on the current [Node.js](https://nodejs.org/en) version.

## Deploying to firebase

<a class="skip" href="#summary">Skip to Summary</a>

Deploying to Firebase can be done with a few commands.

First, let's install the [Firebase CLI](https://firebase.google.com/docs/cli):

```
npm install -g firebase-tools
```

After that, you need to authorize Firebase:

```
firebase login
```

After the authorization process, we can start the application's initialization.

```
firebase init
```

Select as you like, but it's preferable to use these answers:

| Question                                                                                            | Answer                                                                                      | Is required to do same | Comment                               |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------- |
| Which Firebase features do you want to set up for this directory?                                   | Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys | ✔                      |
| Please select an option                                                                             | Create a new project                                                                        |                        | You can connect to existing one       |
| Please specify a unique project id (warning: cannot be modified afterward) [6-30 characters]:       |                                                                                             |                        | Up to you                             |
| What would you like to call your project? (defaults to your project ID)                             |                                                                                             |                        | Up to you but you can leave it empty. |
| What do you want to use as your public directory?                                                   | `dist/myorg/browser`                                                                        |                        | Point where built files are located   |
| Configure as a single-page app (rewrite all urls to `/index.html`)?                                 | `Yes`                                                                                       | ✔                      |                                       |
| File `dist/myorg/browser/index.html` already exists. Overwrite?                                     | `No`                                                                                        | ✔                      |                                       |
| For which GitHub repository would you like to set up a GitHub workflow? (format: `user/repository`) |                                                                                             |                        | Up to you                             |
| Set up the workflow to run a build script before every deploy?                                      |                                                                                             |                        | Up to you (I suggest `Yes`)           |
| What script should be run before every deploy?                                                      | `npm ci && npm run build`                                                                   |                        | If you choose workflow                |
| Set up automatic deployment to your site's live channel when a PR is merged?                        |                                                                                             |                        | Up to you (I suggest `Yes`)           |
| What is the name of the GitHub branch associated with your site's live channel?                     |                                                                                             |                        | Up to you (I suggest `main`)          |

If you plan to deploy to GitHub, first add the following files to your `.gitignore`:

```
# Firebase

.firebase
firebase-debug.log
```

> Modify both `firebase-hosting-merge.yml` and `firebase-hosting-pull-request.yml` workflow files to replace `npm ci` with `npm i`.

If you choose to use GitHub Actions, your application will be deployed every time you commit changes.
However, if you choose not to use GitHub Actions, you will need to deploy manually each time.

To deploy manually, run the following commands:

```
npm run build && firebase deploy
```

If everything went fine you should see following output:

```
=== Deploying to 'test-myorg-deploy'...

i  deploying hosting
i  hosting[test-myorg-deploy]: beginning deploy...
i  hosting[test-myorg-deploy]: found 9 files in dist/myorg/browser
+  hosting[test-myorg-deploy]: file upload complete
i  hosting[test-myorg-deploy]: finalizing version...
+  hosting[test-myorg-deploy]: version finalized
i  hosting[test-myorg-deploy]: releasing new version...
+  hosting[test-myorg-deploy]: release complete

+  Deploy complete!

Project Console: **some link**
Hosting URL: **some link**
```

## Summary

In this guide, we covered how to deploy an Nx Angular application to Firebase.
By following these steps, you can easily deploy any app to Firebase with seamless GitHub Actions integration.

For reference, you can check my project [here](https://github.com/KostaD02/builder).

Have fun!
