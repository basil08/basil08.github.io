---
title: "A Discord Bot for My Friends"
tags:
categories: 
draft: true
date: 2020-11-17
---

## Abstract   

# WARNING: This tutorial is not complete. Needs work.

Nonchalance, procrastination and a particularly boring weekend. That's the perfect recipe to cook up a Discord bot.    

So, I ended up making a bot for my school friends and co.     
<!--more-->

In this and few upcoming posts, I will be making a Discord bot from the ground up. This will be a great reference for any beginner with absolutely no exposure to development to make a Discord bot and to add it to their servers. Excited? So, let's begin.   

## Prerequisites     

Like any good development project, making a bot has its prerequisites both in terms of software and expertise. Let's tackle them one by one.   

### Expertise   

Familiarity with JavaScript is assumed, at least ES6 or ES7.

**Arrow Functions**   

```javascript
[1,2,3].map(elem => 
	{ console.log('doubling!');
	 return 2*elem; 
});
```   

**Promises**

```javascript
const data = fetch(URI)
	.then(res => res.text())
	.then(tex => JSON.parse(tex))
	.catch(err => console.log(err));
```   

**`await`/`async` functions**   

```javascript
async function nano(args){
	const _r = await fs.readFile('stuff.json');
	// more code
}
```   

If you are unfamiliar with any of the constructs mentioned above, it is recommended to check out [MDN's JavaScript Module][mdnjs].   

### Software     

**Node.js**     

_What is Node.js?_   

In the layman's term, Node.js is a runtime which allows you to run JS _on your_ computer. Before Node, JS was primarily a front-end language capable of running only inside the sandbox that the browser provided (eg: Internet Explorer, Mozilla Firefox etc). After Node, developers can write back-end code in JS instead of having to learn a different language (eg: Python for Django or Flask, Ruby for Ruby on Rails, PHP etc). In fact, there are several blossoming tech stack built entirely on Node (eg: MERN and MEAN) instead of the historical LAMP etc. Needless to say, Node is a game-changer.   

_How to get Node on my computer?_   

Node is free and available [here][nodejssite]. Please verify your system OS and architecture and download a suitable image. The full-fledged installer is _extremely_ easy to navigate and you will be able to install it by following instructions after you launch the image.    

**NPM**   

_What is NPM?_   

NPM stands for Node Package Manager. It is basically a program which takes care of all the dependencies and details when you manipulate a package. A package is code someone wrote so that you don't have to reinvent the wheel each time. There is a package available for almost every common and dready task you can think of. These packages may depend on other packages and this is where NPM shines. It takes care of all that. Also, NPM is much more powerful than that but we'll get to that. :smile:   

_How to get NPM?_   

Actually you already did. NPM comes pre-packaged with the Node runtime so you already installed it. Hurray!   

**Git (Optional but highly recommended)**   

_What is Git?_  

Git is a DVCS or a distributed version control system. Phew! Wait! Let's break it down. It's a program which takes care of the code you write by giving each version a timestamp and properly weaving a _history_ as you code. It is imperative that sometime in the future you'll want to add a new feature to your program or fix a bug thereby changing the original version of the code.This is where Git shines. You can revert back in history to an older version. But this is barely scratching the surface of what is Git capable of. Again, we'll get to that!     

_How to get Git on my computer?_   

Flavours of Linux and macOS generally already have Git install on their system. You can verify it by running `git --version` on your terminal. If you get a valid output like `2.27.0` you are good to go. Otherwise, head over to the [git site][gitsite] and download and run your relevant installer. Windows users may want to check out [Git for Windows][gitforwin] instead.   

**Text Editor**  

_Any_ text editor will do (NOTE: Not a rich text editor like Word). Notepad on Windows and TextMate on macOS are good to go but if you'll spend much time editing text, there are a plethora of awesome text editors. I recommed you try all and see which one makes your heart sing. Popular choices includes [Visual Studio Code][vscode], [Vim][vim], [Emacs][emacs], [Sublime Text][sublimetext] and [Atom][atom]. I have tried all of these and Vim is my favourite, followed (very) closely  by VS Code. If you are beginning, VS Code is a no-brainer.   

_Verification of installed software_   

A general rule of thumb, for _almost all_ software you install, you can simply open a terminal and issue a command like `<software-name> --version`. It basically asks that program for its version number. If it doesn't exist, the terminal will throw an error, obviously.    

```shell
# this is a comment. Issue this on your terminal/cmd/shell
$ node --version 
v12.18.3   

$ npm --version
6.14.6  

$ git --version
git version 2.27.0windows.1  
```   

**NOTE:** These are outputs on _my_ machine at _the time of writing_. Yours will obviously differ.   

## Discord Sign Up     

If you already haven't signed up for a [Discord][discordsite] account, you'll definitely need one. After you have set up an account, head over to the [Discord site][discordsite], scroll all the way down and click Developers on the footer. Then click "Make an Application". After this point is mostly following the cat. You'll be prompted to give your app (with which your bot will be associated) a name, an optional icon etc.   

After the preliminaries, click on "Bots" on the side panel and then "Make a new Bot". Same drill and soon, you'll have your own Bot token generated.   

### Important!   

The Bot Client ID on the Application page is used to add your bot to Discord servers (we'll cover that). You DON'T want to disclose this info to anyone. Also, the "Bot Token" on the Bot page of your application is used by your Bot program to actually log in to the server (and thus be seen as online). You ALSO DON'T want to disclose these info.     


## Looking Forward To    

Woah! We have already covered so much! I hope you are enjoying yourself because it only gets better from here.   

In a gist, we have installed and confirmed all requisite software, signed up for Discord, enabled Developer Mode and created our first Bot Application! With all the dreary stuff behind, we are looking forward to _actually_ logging a bot to your server and writing a simple bot template which we'll modify in subsequent chapters. Until then, happy hacking!   


## Further Reading    

### Git    

Make friends with Git. It's the industry _lingua franca_ and you'll need it not just for this project but for many projects in years to come!   

* [Beginner] Check out this awesome resource by MIT (TODO: fish out that resource)     

* [Intermediate-ish] If you are somewhat comfortable with the terminal and stuff (and have no idea what Git is), I recommend you check out this [free online book][progit]. It is super comprehensive and has lots of real-world scenarios explained.  

* [Explorer] [This page][gitcuration] is a curation of resources for various levels of expertise. Very enticing!          

### JavaScript    

* For an introduction to JavaScript, you can check out [MDN Web Docs JavaScript Module][mdnjs].     


## Reference    

The following series is based on [this guide][discordguide] and I thank the authors for such a comprehensive one.

[mdnjs]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript
[nodejssite]: https://nodejs.org/
[gitsite]: https://git-scm.com/
[gitforwin]: https://gitforwindows.org/
[vscode]: https://code.visualstudio.com/
[vim]: https://www.vim.org/
[emacs]: https://www.gnu.org/software/emacs/
[sublimetext]: https://www.sublimetext.com/
[atom]: https://atom.io/
[discordsite]: https://discord.com/
[progit]: https://git-scm.com/book/en/v2
[gitcuration]: https://try.github.io/
[discordguide]: https://discordjs.guide
