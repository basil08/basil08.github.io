---
title: "Hacking Wordle Blitz"
tags:
categories: 
date: 2023-12-19T04:36:28+05:30
---

Apologies for not blogging in _like forever_. Funny things have been happening in my life lately, perhaps the most funny is the concentration of all trips and "vacations" in my end-semester holidays. You might call that lucky but I quickly learnt that vacations are supposed to be evenly distributed, atleast from the actually-destressing-and-not-getting-tired-as-hell-from-travelling-and-not-being-able-to-catch-a-breath perspective. 

During my entire end-sem holidays, my itinerary allowed me 5 days of staying at home. _Just 5_. Before you hasten to the conclusion that 5 days is a lot of time to chill and relax, you must understand that there are relatives and friends to meet to maintain "diplomatic relations". There goes my chill and relax. 

Anyways, I'm not pissed. This information is important to put what follows in context (And also, to rant a bit :P)

It cannot be any worse. Right? RIGHT? Guess what, one of my good friends who is the secretary of the Literary club at my college approached me with the request to build a competition portal for a blitz Wordle game as soon as I landed at home. HaHa. 

_I accepted._<sup>1</sup>

This post chronicles how I hacked together the above portal in 2 days (and with a lot of procrastination).  

## Baby steps 

First, I had to find an open-source codebase to start with. Given that the competition was in one week, it would be stupid to attempt to make a Wordle clone from scratch. Luckily, I found [this][0] cute and very nicely structured codebase on Github which I forked. 

I spent sometime studying and mapping out functionalities, state changes, and components. Steadily, I started commenting out components and looking at the results (to see what breaks). All good, which means I am beginning to understand how the code is wired. Simultaneously, I started designing a flow for the app mentally which would be the path of least resistance with respect to debugging (as any respectable developer will tell you, no such path exists). 

It's a good idea to talk about the structure of this specific competition<sup>2</sup>. It was supposed to be a timed 30 minutes non-stop contest where the puzzle resets each time the current one is solved or all guesses are exhausted. Words would be non-skippable and picked at random from a list of words for each users so that no word list for two users are same. 

At first, I thought a very basic token system would do. Just map each registered email against a token and send the token as a query param to some kind of `/saveRoundData` endpoint on the backend to authorise user. I dismissed this idea quickly due to the possibility of token exchange or other funny things between users or just accidental tampering with the token. There has to be a backend service since the game data would have to be persisted. And there has to be a proper user authorisation with a `User` model. and what's a better method to authenticate than my handy JWTs. Also, I have experience with them, no nasty database calls, clean, and simple.<sup>3</sup> _Sigh, did I just make my life more difficult for an informal event that doesn't even hold that much value?_ 


---

## It's `useState()` all the way down

That's when I decided to put a brake on the user authentication subsystem and work on the actual game flow itself. There were a bunch of state management to hack into and to ensure that the flow was as per the expected business need. Besides, completing this part would just make me happy and motivated to work more.

The code base was in typescript and [God only knows][7] why tsc doesn’t like me at all. Made a few edits and a stream of errors pop up. Somehow bash those and new ones pop up. Anyhow, braved my way through this typescript mania to arrive at a somewhat stable (but still buggy) front end. In hindsight, I think typescript is a million types better than javascript and I strongly recommend it over vanilla JS for large projects. Datatype information can save tons of development and debugging time. 

Right now, I have the frontend without any backend service feeding it. I move on to the next word on win or lose and words are chosen at random. Moreover, I have made a `roundData` object that captures metadata about each round’s progress and saves it to localStorage. Neat!

{{<figure src="/img/hacking-wordle-blitz/0.png" caption="GameData schema">}}

I had originally intended the app to make a server call on _every_ round clearance for each user but then decided against it simply because I would be hosting the app on a free tier vercel instance and I have issues with latency on it. 200 odd disgruntled users would resend the request and soon it will be helltown for my free instance. Although, I think it would still have been able to withstand the anticipated load, I was too lazy to do the math and took the conservative path of _saving the roundData on the client side and sending one final request to log the entire array at the end of the countdown_.

Now, some of you might have raised your eyebrows high and said _“Waaaaiiittt a minute”_ and I totally get you. I was counting on the fact that no one would be able to open the network and storage tabs, figure this out, and then manually change the array by hand in 30 minutes. The portal link was anyways private and only accessible at the start of the event so I thought this was a reasonable assumption to make.<sup>4</sup>

---

## `passport.authenticate()`

I started fleshing out the auth API using this [nice blog post][3] as a reference. It was coming along fine other than a few minor hiccups around Headers and Param types which I identified and resolved. The VS Code Postman extension is such a blessing. 

Then, I bumped into a 400 Bad Request on hitting `/login` with valid credentials. Huh? WHERE IS MY JWT?! I checked and rechecked and banged my head against the wall for a good hour trying different ways to get under the hood of what’s going on. After accepting defeat, I headed over to Stackoverflow and humbly typed my query “passport.authenticate returns bad request” and [turns out][4] passport has been a bad boy lately. After scrolling to the end of the thread, I realised maybe I’m messing up the field names (Oh, wow what a revelation) and realised that perhaps passport is opinionated about what goes into its strategy callback function. Fair enough. Problem resolved. For the time being anyways.

---

## Asking the right questions ft. ChatGPT

In my current flow, the countdown is an important component to ensure fairness and a useable app so I set out to refine it. The [`react-countdown`][8] component turned out to be horrible in being unable to retain state across page refreshes and I thought that’s probably okay if I assume people won’t refresh their page during the game which is another sane assumption to make. No JK. But then I noticed timer reset on every keystroke. Bruh. 

`yarn remove react-countdown` after spending another half an hour pouring over countdown’s documentation. How do I implement a simple countdown that retains state across page refresh? This seemed like a common and solved problem.

So, I asked ChatGPT to generate the code for me. And I must say, it did a pretty good job. Updating the timer state in a `useEffect` block using a pair of `setTimeout` and `clearTimeout` and storing timer to `localStorage`. One fine point though, the initial value of timer was also supposed to be set by first trying to read `localStorage` and find a stale value which was done conveniently in a callback to `useState`. Neat again!

---

At this point, I have pushed my repos to GitHub and setup vercel projects. I could see the project coming to an end and I was elated. Let me just go through the flow one more time, I thought. I generated a new user, took the credentials and tried to login. Worked like a charm! I cleared the token and tried to login with an incorrect password and it…worked like a charm!

Sigh. Back to the drawing board. Bunch of console.logs in and I still couldn’t figure out what’s wrong. This was, by far, the hardest bug to find because I trusted the code from that blogpost I linked earlier. The problem was in the password hash matching middleware that I copied verbatim from the website. I logged the hashes of the input password and the user password (which was saved to the database) and they turned out to be different. All good up to this point. Then I realised that upon failure of `bcrpyt.compare`, the Promise has to be rejected. This conditional was missing. I added that and bug resolved. Two lines of code.

This bug made me realised that there are probably many more such edge case bugs lying undetected just because I didn’t write tests. I sighed. This was enough. I’m done. The user flow works properly. Authorisation works properly and I’m getting my data logged at the end of the timer which is pretty much fool-proof. I should call it a day (or night, I dont remember).

I pushed to prod, dropped a message and went to sleep. I still had to create those users and send them their credentials. And I had to pack for my flight to Heathrow. Oh well.

---

Generating user password was a function I copied from Stackoverflow. A 6-character alphanumeric was sufficient for the desired security level. I whipped up a utility `‘/signupmany’` endpoint on the server and fed it a `JSON.stringify`-ied list of users. 200 OK. 

Made few changes to a python mailing script lying around and added my spare account app password. Drafted a beautiful email (Ugh, shouldn’t _this_ be done by the secretary. I thought it’s better to avoid delays anyway) Tested. Got the email. Viola. 

Ran a few more tests, added a bunch of `try/except` blocks (not too many though) and debug statements. Loaded the `users.json` and ran the script. 227 people were spammed by Purple Santa (my alt account name ^_^)

I shut my laptop and started packing. My name would either go down in history in golden letters or people will curse my name for ages. Moreover, I might have put my friendship in jeopardy. Moreover, I wouldn’t know what happened until 8pm GMT which is around 4 hours after the competition in India. Sometimes, my life decisions surprises even me.<sup>5</sup>

I looked back at the code and thought of some obvious edits to make the user experience better but I let it go. Those state change loaders would have been nice. And perhaps a voluntary quit button for people stuck in the middle of the game and having better things to do.


EDIT: The app turned out to be a success. Hurray! As I connected to the Heathrow WiFi, a stream of notifications and congratulations started pouring in. I was elated. People had used my code and they had loved it. I was fascinated to realise that the line between those messages being of curses and boos was ice thin. It was a bunch of try/catchs at the end of the day that saved me. That’s probably the biggest lesson of this fascinating experience. Who says that one can’t have an adventure sitting in front of a keyboard?

Oh, what a lovely day! The world is saved yet again by untested code pushed to production by a wilful developer who believes in God.  

PS: I logged into the database and realised a mismatch between the number of gameEntry objects and gameData objects created. Hmmmm. So, just to be safe, I noted the `startTimestamp` of each user id upon first login to serve as the baseline in calculating the time deltas for each round completion later. (I have deliberately tried to keep this post jargon free but if you wish to look at the schema or the code, here they are: [frontend][5] and [backend][6]). My conjecture is that people logged in but left the game midway/closed the tab. That voluntary quit button would have been nice after all.

PPS: (Dec 21st) Just added a `Result` page to the app which shows very basic personalised performance report for each user. The metrics shown were: total attempted, wins, loses, average time per solve (basically 1800 seconds divided by the total puzzles seen), and number of tries for each word. I think this additional feature makes for a cute uupgrade in terms of completeness. How the results looked like? 

1. Total 228 participants
2. Average score of 31.28 (A multiplier table of 10 points for getting it right on the 1st attempt and subsequent decreasing points for more guesses was used)
3. Average number of attempts is 16.44
4. Average number of wins is 12.22
5. Hardest word to solve was ZOOEY (based on the number of guesses required by most people)
6. Easiest word to solve was ABASH (based on the number of guesses required by most people)

The podium finishes all scored 100+ 🤯 and the first had an insane average time to solve of around 24 seconds with 76% accuracy!

Fin.

---

### Footnotes

1: Partly because I love lit club and would hate to see one more event not organised and also partly because all attempts to pass it on to other people failed 💀

2: If you're not familiar with classic Wordle, you may check out [this][1] video.  

3: I hoped [Passport library][2] would come in handy. 

4: Moreover, I will obviously run basic analysis on the gameData to find out if someone cheated by flagging outliers and extremely exceptional performers.

5: Okay, I must admit. I was enjoying the adrenaline rush. The idea of writing code that people would interact with and the whole thing being setup in a delayed black box fashion made me more excited than nervous. Besides, I somewhat trust the code I write, okay? _Somewhat_ is the operative part here, of course.

6: You might have noticed that I have been chattier than usual. That’s partly because I haven’t written in a while and this feels nice and also because I’m sitting here all alone and bored at LHR airport waiting for a senior to join.

[0]: https://github.com/cwackerfuss/react-wordle
[1]: https://www.youtube.com/watch?v=WnWPXZ6vQB8
[2]: https://www.passportjs.org/docs/
[3]: https://www.zacfukuda.com/blog/passport-jwt-react
[4]: https://github.com/jaredhanson/passport/issues/371
[5]: https://github.com/basil08/wordle-blitz
[6]: https://github.com/basil08/wordle-blitz-backend
[7]: https://open.spotify.com/track/1Umw3vhysHBodpBFpFsVgK
[8]: https://www.npmjs.com/package/react-countdown