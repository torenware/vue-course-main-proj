# Demo Vue 3 Project

This project is based off the course project for [Max Schwarzmüller's Udemy course on Vue 3](https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879990#overview). It's a great course and I recommend it highly. Two weeks ago I was Neu To Vue. Now I have a pretty good grasp of how to build an app with Vue. Thanks Max!

This project is supposed to be a Coaching Service's market. People browse a list of life/software coaches, and send messages asking for the services of the coaches. The site also has forms so coaches can sign up.

The original project uses plain JS with Vue 3's Options API. He encourages people to try the various parts of the app on their own, which I've done. Here's what's in the original vs. what's in this version here:

I'm using:

* Typescript throughout.
* Composition API
* The original project keeps data up on Google Firebase. Rather than do that, I've integrated [json-server](https://github.com/typicode/json-server), a simple REST server based on ExpressJS. Any special server handling can be added pretty easily using regular Express middleware, I've gotten JWT authentication working, and for dev purposes, it's a pretty good server. The Vue dev-server knows how to proxy to it, which has saved my sanity from the evils of CORS.
* While most of the UI is designed by Max, I've coded the forms myself and done my own styling. Like Max in the course, it's in plain CSS w/o using a framework, although I am using SASS in places.
* I did some experiments with client-side validation of the forms, and am using the [HTML 5 constraint validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation). I'm generally happy with the results, although some of the browser supplied stuff would be better done in regular JS.
* I use flash messages for error notification and status updates.
* I have a count-down widget that appears a couple of minutes before the token expires.
* I've also implemented token renewal on the server, and implemented a dialog that comes up that asks if the user wants more time. If she does, the server pings a GET API endpoint that returns the new and updated token.
* I've added idle detection, and if the (configurable) time passes, I log the user off. Just before logout occurs, I put up a dialog similar to the token-time-out dialog, which comes down when logout actually occurs.
Have I gone a bit nuts here? Yeah, maybe. But I figure than this should be a good portfolio project, particularly for someone who wants to hire a Vue 3 developer.

## Setup

My packages.json file is set up with the [concurrently](https://www.npmjs.com/package/concurrently) program, which allows me to start up `yarn serve`, the standard Vue startup dev script, and `yarn api`, which starts up my modified json-server based server with the `yarn dev` command. Vue is configured in the `vue.config.js` file to proxy the API calls to the json-server router, and authentication APIs to my custom router code.

Most of the objects are saved to db.json, which is the standard name used for json-server. User objects and data are saved to user.json. You should copy the `db-sample.json` starter file to `db.json`, since json-server needs the right structure to figure out what to server to you. `user.json` will get created automatically when you start using the software, since the schema is known w/o a starter file.

You'll need to copy the `dot-env.sample` file to `.env.local`, and modify your JWT secret and the amount of time you want your tokens to live. The server will enforce this; an expired token will return a `401 Unauthorized` error.

The server should behave a lot like Google Firebase, as far as I can tell. While I'd guess there are still bugs in there somewhere, the dev experience is pretty good, since the APIs seem to be stable, and the vuex code handles errors in the standard way.

The client also has a .env file. I didn't have to do anything to make this work, since this is a (not very well documented) feature of Vue 3. I have one setting in it, which controls the idle detection code.

