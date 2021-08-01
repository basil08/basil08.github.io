---
title: "Gemini Protocol"
tags:
categories: 
date: 2021-02-25
---



Gemini is a minimal [application layer][5] request-response protocol that aims to make a _Geminispace_ of information to be accessible to anyone even with slow/intermittent internet connection. Think HTTP 0.9 or a less restraining Gopher.

## TLDR   

If you haven't checked out Gemini yet, you [totally should][0]. This is a HTTP proxy to the actual gemini site.   

## Why Gemini?   

I really value your time and understand you have better things to do. So, I'll cut down on formalities and introductions and preludes and yada yada. My format might be quirky but my motive is always to be efficient and effective and non-conformant.  

Gemini appeals to me simply because of it's lack of _noise_. Of course, noise is a very generic term and doesn't make anything anymore clearer so hold on.   

The WWW has evolved. It is not anymore the "collaborative space where you can communicate through sharing information" but has become so much more. It's like a **clamoring, dazzling marketplace**. Which is....good...and bad. Good because there is something for everyone. The space Tim dreamt of certainly exists (and is thriving)  and I admire that. WWW and HTTP has empowered man like nothing before.      

Ironically, that is the bane too. The sheer amount of information that the modern woman seems to drowning in, she suffers from lack of clarity. It is so damn easy to get lost in the noises and forget your original motives. And that, my friend, is something I cannot do. **Clarity of thought cannot be bargained with.**

Gemini is cool precisely because it doesn't offer much (but don't be fooled to believe it can't do much). It is designed deliberately to be non-extensible and thus, only serve the real purpose for any network - **pure diffusion of information**. Gemini is text-based (however, you can use any of the MIME formats to serve data). A big upshot is because it lacks images and other media (in a pure sense), there is virtually no ads to distract you. No banners that crept up and goddamn _blink_!    

## How does it work?   

Gemini servers are applications listening on remote hosts implementing the protocol. They, by default, listen on port 1965 (the year the first manned Gemini flew as the specification so humbly states). One can have multiple domains being served from the same IP address. The protocol defines a new MIME type `text/gemini` to serve gemini files (analogous to `text/html` over HTTP) which is a light-weight markdown format and renders like HTML.     

The render process is not precisely laid out in the specification and is upto the client to implement. The resultant `.gemini` or `.gmi` files are served over a regular TCP connection which is meant for exactly one request-response cycle. Note that however it increases network latency, it serves the greater good of protecting end users from noise by preventing clients from making multiple requests for unneccessary jargon. And _I care about that_!   

The protocol can serve text or binary data and let the client handle it. And what's better? If you can't find a "rational" client, you can write one because the protocol is so simple. _I care for this empowerment. It is most crucial for me to know precisely how the system works_. **Ignorance is an eyesore**.   

You can link to other resources in the Geminispace or even link to HTTPS or Gopher resources! Besides, Gemini takes security very seriously (unlike Gopher or HTTP) by enforcing a TLS handshake for every connection.   

Check out the spec: [Gemini Protocol Specification][1].

## Gemini clients   

Due to the relative simplicity of the protocol, there is a number of clients written in a number of languages. However, I could test drive only one which is [AV-98][2], a client written in Python by the original designer of the protocol itself.   

It's a nice little application though not cross-platform. I tried it inside a VM box running Debian. I can use this thing if it can serve me daily news in my terminal, though I am not sure how many local sites here allow scraping. Would RSS be better? Yeah, I think it'd work but **who lives in the past?**    

The repo is [here][2]. Show it some love.    

I'm fiddling with writing a client myself but shhh...  

## More resources      

* This is a great repo which is comprehensive enough to get you running (wild): [Awesome Gemini][3]. 
* This is a gemlog site I found, that is hosting a site in gemini space and providing a nice proxied HTTP interface to users (possibly for convenience or to attract less tech-savvy people) which IMO is very cool. It doesn't ask for all my details and does what it should: maintain my anonymity and let me log. [gemlog.blue][4]. Definitely check it out!   


[0]: https://gemini.circumlunar.space
[1]: https://gemini.circumlunar.space/docs/specification.html
[2]: https://tildegit.org/solderpunk/AV-98/
[3]: https://github.com/kr1sp1n/awesome-gemini
[4]: https://gemlog.blue/
[5]: https://en.wikipedia.org/wiki/Application_layer
