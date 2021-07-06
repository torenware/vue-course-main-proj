# Demo Vue 3 Project

This project is based off the course project for [Max Schwarzmüller's Udemy course on Vue 3](https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879990#overview). It's a great course and I recommend it highly. Two weeks ago I was Neu To Vue. Now I have a pretty good grasp of how to build an app with Vue. Thanks Max!

This project is supposed to be a Coaching Service's market. People browse a list of life/software coaches, and send messages asking for the services of the coaches. The site also has forms so coaches can sign up.

The original project uses plain JS with Vue 3's Options API. He encourages people to try the various parts of the app on their own, which I've done. Here's what's in the original vs. what's in this version here:

I'm using:

* Typescript throughout.
* Composition API
* The original project keeps data up on Google Firebase. Rather than do that, I've integrated [json-server](https://github.com/typicode/json-server), a simple REST server based on ExpressJS. Any special server handling can be added pretty easily using regular Express middleware, although the out-of-the-box capabilities have been enough so far. The Vue dev-server knows how to proxy to it, which has saved my sanity from the evils of CORS.
* While most of the UI is designed by Max, I've coded the forms myself and done my own styling. Like Max in the course, it's in plain CSS w/o using a framework, although I am using SASS in places.
* I did some experiments with client-side validation of the forms, and am using the [HTML 5 constraint validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation). I'm generally happy with the results, although some of the browser supplied stuff would be better done in regular JS.

More will get added once I get to the authentication portion of the course.


