---
title: "Updates to the blog"
tags:
categories: 
date: 2023-07-11T11:22:34+05:30
---

It has been [quite sometime][5] since I turned my attention to this blog. Not in terms of content but in terms of features and upgrades. It has served its purpose well, that is, helping a lazy blogger like me keep up with his habit :P. It doesn't intruding too much in terms of maintainence, silently complementing my content, and giving me the peace of mind to blog while keeping it aesthetic for you. 

And yet nothing is static. As the blog has grown, so has my needs and demands from the blog. It is particularly this part which justifies taking the hard road to maintain my own blog in this silent corner of the web and not on some popular writing community like Medium or Wordpress. The freedom to hack and control every single div on this website.   

Well, if you have been following my blog, you'll notice few changes. In no particular order, here are a number of upgrades / features added to the blog:   



## 🕶️ Dark mode 

{{<figure src="/img/changestoblog/5.jpg">}}

Did you notice the shiny new button beside the page title? Yep, this blog is now dark theme enabled! My eyes will thank me for editing stuff late at night.   

I took inspiration from [this post][1] and copied [Dan Abramov's button design CSS][2] (Thanks, Dan for this and Redux!) Still had to figure out the dark mode CSS for each page etc.  

The homepage looks like this:   

{{<figure src="/img/changestoblog/3.png">}}

{{<figure src="/img/changestoblog/4.png">}}

I like it!       


## 🗨️ Commenting system

After a long running feud with [Disqus][9] and trying to integrate a managed open-source commenting system on my blog (Looking at you [Valine][7] and [Isso][8] :/), I have settled for [gitalk][6], a commenting system built over GitHub issues so I hope it will work properly. Only catch is you need to have a GitHub account to post a comment ~~which I think you should if you don't already.~~

:warning: **WARNING**: If you're using gitalk, then make sure your post slugs are less than 50 characters as gitalk somehow can't tag issues with longer tags. :shrug: Learnt it the hard way. 

{{<figure src="/img/changestoblog/0.png">}}

Fixed that, now I should push to prod, right? Right??

{{<figure src="/img/changestoblog/1.png">}}

Ugh...._humbly goes back to VS Code._  

After half an hour of reading gitalk docs, scrolling through SO answers, and (re)learning about HTML DOM manipulation with JS...tada!

{{<figure src="/img/changestoblog/2.png">}}

This is how development is, breaking and building and breaking something else in the process. Do [let me know][0] if you notice something broken, I haven't tested the new theme for everything :)

## :1234: Mathjax support   

This was purely on a whim as I wanted to write some ✨math✨. This is surprisingly easy if you just want Mathjax support ASAP and need to start using `$$ $$` by importing a [few stylesheets][3].   

But as the SO answer points out, directly rendering Mathjax can be slow and show [unwanted unstyled content][4] before rendering which is sort of irritating. Thus, had to write a bunch of code to delay the visibility of mathjax blocks until it is rendered. Better but not sure how much I'll use it as now I have to enclose all Latex content in Hugo shortcode blocks which are sooo clumsy to use :/   

Maybe, I don't mind a bout of [FOUC][4] after all.   


[0]: mailto:gs454236@gmail.com
[1]: https://yonkov.github.io/post/add-dark-mode-toggle-to-hugo/
[2]: https://github.com/gaearon/overreacted.io/blob/master/src/components/Toggle.css
[3]: https://stackoverflow.com/a/68506928
[4]: https://en.wikipedia.org/wiki/Flash_of_unstyled_content
[5]: /post/migrating-from-jekyll-to-hugo/
[6]: https://github.com/gitalk/gitalk
[7]: https://valine.js.org/
[8]: https://isso-comments.de/
[9]: https://disqus.com