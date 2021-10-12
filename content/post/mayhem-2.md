---
title: "Tutorial: Mayhem bot – Part 2"
tags:
categories: 
series: "Build a Discord bot: A definitive guide"
date: 2021-10-09T07:58:47+05:30
---

In [Part 1][0] of this tutorial, we had finished logging our bot into our server. In this post, we plan to give it some interactivity with human users. Moreover, we will organize our code in a modular pattern to facilitate modification and addition of more commands easily.  

## FIRST COMMAND &amp; `bot.js`

```
// New file: /bot.js
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	console.log(`[${message.channel.name}] ${message.author.username}: ${message.content}`);

	// Don't interfere when you are not required and don't be dumb enough to reply to your own msgs.
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const cmdname = args.shift().toLowerCase();

	try{
		if (cmdname == 'hi') {
			message.channel.send("Hi ${message.author}! I'm Mayhem. Nice to meet you!");
		}
	} catch(err){
		console.error(err);
		message.reply('Oops. There was an error while executing that command.');
	}
});

client.login(token);

```
The code is fairly straightforward to understand. We import the required modules and secrets. The prefix is a special character you use to invoke commands on this bot for eg: `/`, `.`, `--` etc. After instantiating an instance of `Discord.Client()`, we log simple text when bot is ready i.e. the ready event is triggered.   

Then, for every message sent to a channel, the `'message'` event is triggered which is handled by the function we supply to `client.on(...)`. The code parses the message and sends a hi message to the user for messages of the form `<PREFIX>hi`. Finally, we login with the bot token we generated before.  

```
// /config.json  
{
	"prefix": "YOUR-PREFERRED-BOT-PREFIX",
	"token": 0123456789
}

```

Run `npm start` or `node bot.js` and your bot is online!  

For now, the bot doesn't do much and only sends the 'hi' message rather annoyingly.   

The code structure as such is not very robust or versatile. We'll organize it to be modular to facilitate that. The idea is we keep code logic for each command in a seperate file in the `/commands` directory and load them into the client upon instantiation of the client object. Then, adding a new command will be as clean as adding a new file to this directory.  

## MODULARIZATION  

```
$ cd /path/to/mayhem
$ mkdir commands
$ cd commands
```

```
// New file: /commands/hi.js
const {bot_name} = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'hi',
	description: 'A nice introduction is the gentleman\'s way.',
	usage: '',
	execute(message, args){
		const embed = new Discord.MessageEmbed()
			.setColor('#00ebc7')
			.setTitle(`Hello! ${message.author.username}`)
			.addFields(
				{name: `${bot_name} bot says...`, value: `Yo! Nice to meet you!`},
			)
			.setTimestamp();

		message.channel.send(embed);
	}
}
```

As you may notice, we export few other handy metadata apart from the function `execute(...)` which contains the main logic. We will be adding other fields for unique commands as we need them. This approach was highlighted in [discordjs.guide][1].  

Now, make the following changes to `bot.js`. 

```
// /bot.js
const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const files = fs.readdirSync('./commands').filter(name => name.endsWith('.js'));

for(const f of files){
	const command = require(`./commands/${f}`);
	// According to Discord API, Discord.Collection is a JS Map Object with more convenience methods
	// Set the record with key as the command name and value as the command itself
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	console.log(`[${message.channel.name}] ${message.author.username}: ${message.content}`);

	// Don't interfere when you are not required and don't be dumb enough to reply to your own msgs.
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	// basic parsing
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const cmdname = args.shift().toLowerCase();

	// get the cmd object
	const cmd = client.commands.get(cmdname);
	if(!cmd) {
		return message.channel.send('Oops! No such command ;-;');
	}

	try{
		cmd.execute(message, args);
	}catch(err){
		console.error(err);
		message.reply('Oops. There was an error while executing that command.');
	}
});

client.login(token);
```

Most of the code is intact. The `Discord.Collection()` is a wrapper around the JS Map Object with few added convenient methods. We read the `/commands` directory using `fs` and set the object using `client.commands.set(..., ...)`. Inside the handler, we parse the incoming message, try to get a command object and execute it. At any stage, if we have an exception, gracefully inform the user.   

Run the bot again via `npm start`. Though, we cannot detect any visible changes, we have refactored the code into much more tangible form. Let me talk about one more thing that I have ignored till now.   

{{<figure src="/img/may2/0.jpg" caption="First command of Mayhem">}}

## EMBED MESSAGES   

Currently, the messages sent by the bot to the channel are simple text messages which are unattractive and less appealing to our users. If you have experience with Discord bots, you maybe aware of colourful, sprawling messages with many fields, formatted texts and images. The `Discord.MessageEmbed` object in `discord.js` allows us to construct such messages. If you see the logic of the `hi` command, we are indeed constructing one.  

```
// /commands/hi.js
...
	execute(message, args){
		const embed = new Discord.MessageEmbed()
			.setColor('#00ebc7')
			.setTitle(`Hello! ${message.author.username}`)
			.addFields(
				{name: `${bot_name} bot says...`, value: `Yo! Nice to meet you!`},
			)
			.setTimestamp();

		message.channel.send(embed);
	}
...
```  

These are all obvious imperative methods that adds a particular field one at a time. For eg: You should deliberate on a color theme because it conveys your bot's purpose and "vibe" to your users. The `setColor()` can be used to set a color. `setTitle()` adds a bold title to the message. The `addFields()` take up a JSON object and add all key-value pairs to the message body. The `setTimestamp()`, as expected, adds a timestamp field to the message.   

## UPCOMING   

In summary, we have executed our first command, modularized our codebase and paved the way to breezy development and we know how `discord.js` handles channel events (via handlers) and about `Discord.Collection()`, `Discord.Client()` and `Discord.MessageEmbed()`.  

In the next post, we'll add a command to fetch data from an external API and another to interact with the user personally over direct message.  

[0]: /post/tutorial-mayhem-bot-part-1
[1]: https://discordjs.guide