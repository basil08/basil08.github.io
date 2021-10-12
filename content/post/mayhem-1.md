---
title: "Tutorial: Mayhem bot – Part 1"
tags:
categories: 
series: "Build a Discord bot: A definitive guide"
date: 2021-10-08T08:02:54+05:30
---

<!-- * Structure -->
<!-- Installation -->
<!-- Basic setup and login -->
<!-- hi command and modularisation
<!-- meow and api fetching -->
<!-- help command and DM -->
<!-- cat command and pre-fetching -->
<!-- whatis command and cooldowns -->
<!-- rm command and exclusive commands -->
<!-- ..other commands -->
<!-- deployment options -->
<!-- further development ideas -->
<!-- acknowledgements --> -->

In this guide, I will be building a Discord bot from scratch using only [discord.js][0] and a few open public APIs. I'll also explain each step and discuss the reason for preference of a particular way of implementation over others. So, let's get started. 

## WHAT ARE WE BUILDING?

**Mayhem** is a simple Discord bot that is aimed for entertainment and fun. It queries external public APIs for images, jokes, facts and definitions. Few commands are `meow`, `cat`, `whatis`, `whoami`, `ls`, `help`, `whereami` and so on. There is a subtle shoutout to UNIX if you're familiar ;).   

Moreover, these commands are chosen and designed in a way to demonstrate capabilities of the Discord API. Thus, features such as exclusive commands, cooldown periods, pre-fetching etc. are also discussed.  

### CODE REPOSITORY

The latest version of the codebase can be found [here][4]. Instructions for installation on your Discord server can be found in the [README.md][5].   

For options to host the bot, see [Deployment Options][6] in the README.

## JS PRE-REQUISITE CHECK  

You should be familiar with JavaScript and computer programming concepts such as loops and conditionals. But JS is a particularly notorious language as it is continuously being modified to suit the industry. You should know at least ES6 or ES7. If not, no worries! Below I cover few JS concepts we'll be using in this project.  

### ARROW FUNCTIONS  

```
[1,2,3].map(elem => 
	{ console.log('doubling!');
	 return 2*elem; 
});
```  

A syntactic-sugar to reduct clutter. Nothing more but highly convenient for writing chained promises (If you ever found yourself in such a situation that is).  

### PROMISES  

```
const data = fetch(URI)
	.then(res => res.text())
	.then(tex => JSON.parse(tex))
	.catch(err => console.log(err));
```   

A fix to execute asynchoronous statements synchoronously. Think of these commands as being executed _one after the other_ and not all together because they can't as the data are dependent on successful execution of previous steps. I never liked it much.  

### `await`/`async` FUNCTIONS   

```
async function nano(args){
	const _r = await fs.readFile('stuff.json');
	// more code
}
```   

Successor to Promises. Cleaner, more logical syntax. As opposed to being an API like Promises, async/await are keywords in JS now.  

If you want to gain more insights into these constructs, it is recommended to check out [MDN JavaScript module][7].  

## INSTALLATION  

You need [Node.js][8] and a package manager such as [`npm`][9] or [`yarn`][10]. `npm` comes packaged with Node. 

We will be using these npm packages:     

1. `discord.js@12.4.1` or above (Note: The code is tested with this version only)
2. `node-fetch@2.6.1` 

### BASIC SETUP  

To make a new `node` project, run the following in your terminal:  

```
$ mkdir mayhem
$ cd mayhem
$ npm init -y     # -y to say yes to all defaults
$ npm install discordjs@12.4.1 node-fetch@2.6.1
$ touch bot.js
```   

Then, open `package.json` and add a new script for convenience:  

```
...
 "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node bot.js"
  },
...
``` 

## CREATE BOT APPLICATION AND GENERATE TOKEN  

Now, we have to create a bot application through your [Discord account][11] (Make one, we need it!). The steps are as follows:  

1. Login and open the [Discord Developer Portal][12].  
2. Click on the "New Application" button.  
3. Enter a name and click "Create" button to confirm.   

<!-- Logged in discord dev portal ss -->
{{<figure src="/img/mayhem/0.jpg" caption="Created New Application in Discord Developer Portal">}}

You are free to edit other information as you wish on this page. We'll leave it to defaults. Then navigate to the "Bots" tab and click "Add Bot" button. 

{{<figure src="/img/mayhem/1.jpg" caption="Created new bot and customized with a name and image icon">}}


Clicking on "Reveal Token" will show your bot token. A **Token** is a unique identifier for your bot application and is used by Discord to authorize your bot to actually log in and appear online in a server. 

**CAUTION**: It is very important that you keep your token safe and secret. You must not mistakenly commit it to a public repo or such. The consequences can be disastrous. If the key got leaked by mistake, immediately click on "Regenerate token" to generate a new token and invalidate all previous tokens.   

**WARNING**: Make sure you copy the "Bot Token" and not the "Client Secret" or the "Client Key" which are on the Applications page.   

## GENERATE BOT INVITE LINK  

### Bot invite links explained  

A typical invite link looks like this:

```
https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
```  

The fields that need elaboration are the query parameters which are as follows:  

* `client_id`: The client id is the application that is authorized.  
* `permissions`: an integers which encodes the bot's permissions on the server in binary.  
* `scope=bot`: Yes, this is a bot invite link.  
* `applications.commands`: To enable Discord to allow `/` (slash) to invoke bot commands.  

Head over to the OAuth2 page, scroll down and select `applications.commands` and `bot`. Then, choose permissions that you want your bot to have. The page handily generates the link for you.   

{{<figure src="/img/mayhem/2.jpg" caption="Permissions for Mayhem">}}

Here, I show the permissions for our bot. As you can see, it is a fairly less-demanding bot in terms of administrative privileges.  

{{<figure src="/img/mayhem/3.jpg" caption="Authorizing your bot into a server">}}

Paste the generated link and you will be asked to authorize the server. Note: You can add them to servers in which _you_ have admin access only. If successful, you're greeted by a confirmation dialog. Congratulations, now you can see Mayhem online with a "BOT" tag!  

## UPCOMING   

This is part one of the series "Build a Discord Bot: A definitive guide". Expect part two soon!   
<!-- 
## ACKNOWLEDGEMENTS 

This is my first tech guide / tutorial on the web. What things worked for you? What did you not like? I would like to [hear from you][1]!  

For the development of Mayhem, I heavily relied upon [discordjs.guide][2], a well-explained document and the official [Discord API docs][3].   -->

[0]: https://discord.js.org
[1]: mailto:gs54236@gmail.com
[2]: https://discordjs.guide
[3]: https://docs.discordapi.com
[4]: https://github.com/basil08/mayhem
[5]: https://github.com/basil08/mayhem/blob/main/README.md
[6]: #deployment-options
[7]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript
[8]: https://nodejs.org
[9]: https://npmjs.com
[10]: https://yarnpkg.com
[11]: https://discord.com
[12]: https://discord.com/developers/applications