---
title: "Tutorial: Mayhem bot – Part 3"
tags:
categories: 
series: "Build a Discord bot: A definitive guide" 
date: 2021-10-12T08:15:25+05:30
---

In the [last part][0] of this guide, we looked at creating our first command, `Discord.MessageEmbed()`, and modularization. In this part, we'll demonstrate API fetching and command aliases, while adding two new commands to our bot!   

## `meow` &amp; `node-fetch`  

The `meow` command is a simple command that queries a public API of cat pictures and sends one random, cute cat picture down in the channel. We will use the following endpoint:  

```
https://aws.random/cat/meow
``` 

**NOTE**: If you wish to use an API that requires some kind of authorization, then you have to generate a secret key from a dashboard usually and feed this credential to your `.env` file (this step is more or less platform-dependent. For eg: [replit][1] provides a key-value based secret storage feature). Then, you can read that value via `process.env.API_SECRET_KEY` or likewise. Consult your API documentation and hosting provider documentation. 

But to fetch on the server-side, we have to install a `fetch`-equivalent module on our server. This is achieved by the `node-fetch` package.  

```
yarn add node-fetch # or npm install node-fetch
```  

Now, let us implement the `meow` command.   

```
// New file: /commands/meow.js 
const fetch = require('node-fetch');
const {prefix} = require('../config.json');

module.exports = {
	name: 'meow',
	description: 'Coz everyone likes cats!',
	usage: `${prefix}meow`,
	cooldown: 10,
	execute(message, args){
		const file = fetch('https://aws.random.cat/meow')
			.then(file => file.text())
			.catch(err => { 
				console.error(err);
				message.channel.send(`An Error was encountered while executing that command.`);
			});
		message.channel.send(JSON.parse(file).file);

	}
}
``` 

{{<figure src="/img/may3/1.jpg" caption="The meow command">}}

Once again, the code is obvious and there is no element that requires an explanation as such. The "cooldown" parameter will be dealt with in another command. But, you can probably guess it is to prevent a indirect DDoS attack on the cat server by bad actors and/or bots.  

## `help`  

Good UI/UX don't require a manual to be used. So, like every good software, we will provide a handy help command for potentially new users of our bot. This command will demonstrate sending personal direct messages and command aliases.  

The design of the messages is decoupled from the logic. Feel free to make your bot as snazzy as possible.  

```
// New file: /commands/help.js
const {prefix, version,bot_name, bot_author} = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Display all available commands',
	aliases: ['h','?'],
	execute(message, args){
		const data = [];
		const {commands} = message.client;

		if(!args.length){
			// show all commands
			data.push(`This is the ${bot_name} Bot version ${version}`);
			data.push(commands.map(command => command.name).join(', '));
			data.push(`Use ${prefix}help [command name] to get details about [command name]`);
			data.push(`All commands are prefixed by the ${prefix}`);
			data.push(`\n\nSend your love to ${bot_author} ;)`);

			// split: true splits the message into separate messages if char count > 2000
			return message.author.send(data, {split: true})
				.then(() => {	// DM as help message can get messy
					if(message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM');
				})
				.catch(error => {  // the case when user has DM disabled must be gracefully handled
					console.error(`Could not send help DM to ${message.author.tag}.\n`,error);
					message.reply('I can\'t DM you. Do you have DMs disabled?');
				});
		}else{
      ...
```

As you can see, `message.author.send(...)` is used to send a message to the original message author's DM. If a bare `help` is invoked, we inform the user of our commands personally and ask them to explore more by using the format `help [command name]`.    

Once again, the aliases field will come handy in the next part of this function.

```
...
	}else{
			const name = args[0].toLowerCase();

      // try to make a hit, either the command or its aliases
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if(!command){
				return message.reply('Not a valid command -_-');
			}

			const embed = new Discord.MessageEmbed()
			.setTitle(`Help for ${command.name}`)
			.setColor('#02fede')
			.addFields(
				{name: 'Aliases', value: (command.aliases) ? `${command.aliases.join(', ')}`: 'There are no aliases for this command!'},
				{name: 'Description', value: (command.description) ? `${command.description}`: 'Currently no description available!'},
				{name: 'Usage', value: (command.usage) ? `${command.usage}`:'Currently no usage available!'},
				{name: 'Cooldown', value: (command.cooldown) ? `${command.cooldown} second(s)`: 'This command has no cooldown!'}
			)
			.setTimestamp();

			message.channel.send(embed);
		}
	}
}

```  

{{<figure src="/img/may3/0.jpg" caption="`help meow` command execution">}}

You can probably understand the workflow that `discord.js` promulgates. Here it is:     

> PARSE :right_arrow: EXECUTE :right_arrow: SEND     

## UPCOMING   

In this post, we finally made an API call from our bot and served some cute cat pictures to our users. Now, the sky's the limit for you! Moreover, we added a help command to be more organized.   

In the next part, we'll look at pre-fetching, cooldowns, and exclusive commands. 

[0]: /post/tutorial-mayhem-bot-part-2/
[1]: https://replit.com
