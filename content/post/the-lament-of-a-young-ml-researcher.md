---
title: "The Lament of a Young ML Researcher"
tags:
series: "Tech"
categories: 
date: 2026-09-08T00:42:57+05:30
---

> "I wish there was a way to know you're in the good old days, before you've actually left them."  

> ~Andy, The Office, S9E23

{{<dropcap>}}In 2026, around {{</dropcap>}} twenty thousand papers were submitted to [ICLR][12], which is a premier (A-star tier in nerd jargon) conference for machine learning and related research topics. Thousands of researchers submit resarch papers, which are peer-reviewed in a [double-blind syste][13] (neither the authors know who the reviewers are nor the reviewers know who the authors are) and form the basis for what direction the larger ML community decides to work on next. The conference attracts both veterans and young researchers teeming with energy to publish the next “big thing”. There are [thousands][1] of such [conferences][0] organized on topics ranging from theory of mind to chaos theory and the next weirdest thing you can think of.    

{{<figure src="/img/lament/0.png" caption="Figure 1: ICLR submission trends. Source: OpenAccept.org">}}

# No bots won't do your research for you  

In the past few years, ICLR and other venues have seen an exponential surge in submissions for a number of reasons. Most notorious of them are, of course, language models. Combined with coding agents and end-to-end autoresearch bots, the cost to produce a “paper-looking” pseudo research artifact is practically zero. I call them pseudo-research artifacts because most modern agents are still only good as assistants, not autonomous researchers. AI companies are exaggerating agents' use for research because that’s what pays their mounting infrastructure capex. [AI “influencers”][4] build [cheap scaffolds][3] that claim to [do autoresearch][2] for as low as $25. The sad truth is, it's all bullshit. Having used them extensively on multiple projects, I find agents are token burners because they lack epistemic context; they may sample from vast probability distributions over millions of research texts, but they lack “taste”. 


That doesn’t stop younglings from bombarding fake-ass “research” to venues like ICLR, which is [straining the ICLR review process][5], leading to suboptimality in the review process and hindering actual research progress. The fact that the coveted “quants” like Jane Street set up stalls and sneakily siphon off the brightest minds from these conferences also adds to the hype and mystery around them.

Like all things in nature, I believe research quality also follows the normal distribution. This means only about the 98th percentile of research is beyond 2 standard deviations from the average. That’s the tiny minority of consequential, moon-shot, maverick research that advances society. This means that there’s a load of crap. One can produce an “evals” paper and make a new benchmark for as little as $100. I don’t even want to comment on how broken and sorry the state of evals is right now, but with each new paper comes new methodology and introduces new metrics. There’s a benchmark for [LLMs generating music][6] to [LLMs manipulating objects in AutoCAD][7]. 

How many papers were accepted? Around five thousand. That’s a [25% acceptance rate][9]. 

# Cheating review with LLMs

Like all human things, the review process is famously [noisy and random][8]. At the same time, it is the backbone of credible ML research. I would argue it’s even more important than the act of writing and submitting a paper itself. Peer review separates performative fluff from actual research that pushes the frontier of human knowledge. To read a paper and deeply engage with it is almost like reading the mind of another researcher, which is intimate in a non-sexual way. Using LLMs breaks the sanctity of the process and discounts the hard work and thought put into the paper. When a researcher knows their merit is as likely to be acknowledged as random chance, merit dies. 
Hold your horses, young man

# Left hanging 

Gone are the days when you could hypothetically sit with a stack of 10 papers over an afternoon coffee and be positively assured you'd be intellectually kindled, learn something new, and have your curiosity's appetite whetted. 

The modern young researcher, with all their zeal, is first expected to answer the gargantuan question of “where to begin”? They cannot imagine rekindling their curiosity. They must sift through the noise, adapt, and learn to call bullshit, developing the impossible skill of an "eye” for plausible good research even before they learn a thing or two about the topic at hand. They must master human psychology before they can write an equation or write a piece of code. 

# The hopelessness of the situation 

> Ignorance is bliss   
> ~Cypher, The Matrix

The ICLR interface is notoriously bad for browsing and discovering new research, so people have scrapped the platform and built better interfaces around it. I [went to one][10] and searched for “theory”. 500 papers turned up in the search. My heart sank. An average researcher like myself would require a day to fully engage with a paper, building intuition, understanding the code, perhaps trying to implement bits and pieces, reviewing past work, and so on. That’s more than a year of just trying to understand what the _state of ML is_. But wait, the _next edition_ of ICLR will be due in 365 days, and the research debt would keep piling up. You know the fiendish part of this situation? Alongside the 500 papers, it was written “2%”. It meant I was only looking at 2% of the ~20K papers submitted to ICLR this year. 

Okay, you must be silly to read all 500 papers, Basil. Apply the rule of the 98th percentile. That’s around 10 papers. Tractable. But wait, that doesn’t give you diversity. Doesn’t build the “research muscles,” so you expand it to 10%, which is around 50 papers. That’s around two months of effort, which is, to euphemistically put it, two months of a polished, cogwork machine of utmost discipline consuming research for upwards of 6-8 hours a day. _Long Sigh_. 

But wait, remember the “2%”. We are only dealing with theory papers here. What about systems? Multimodal training? Continual learning? Spectral theory? evals? What about the 98% of research? 

And my dear friend, this is just one conference. There’s NeurIPS, ICML, IROS, CVPR, EVVC, AAMAS, and 5 other “A-tier” conferences. 

{{<figure src="/img/lament/1.jpg" caption="The elephant in the room. Picture courtesy: Google, meme is by yours truly.">}}

I haven’t even factored in the fact that as a researcher one is supposed to…well, actually do research. We have only been concerned so far with keeping up to speed with the current interests and trends. The fact is, even if we forgo our own research and become cogwork machines, we will only be able to keep up with at most 2% of research at one conference, or about 0.2% of ML research, assuming we only believe the universe of all A-tier conferences consists of 10 elements, which already costs us 3 months or around 25% of the year.

An average researcher will know only a negligible amount of research. Forget about deeply engaging with it.

# Ossification of research interests

What does this lead to? Ossification of research expertise and taste. Researchers tend to specialize rather than diversify. Is it good? Is it bad? Who knows. One camp would argue that deeper expertise with decades of experience in a narrow subfield or even topic is required for a breakthrough, while the other camp (to which I belong, btw) would argue that research is a breadth-first search with many cross-edges and benefits when ideas cross-pollinate between seemingly far-away research disciplines. I mean, look at the history of human science and discovery. The legends and the giants were all polymaths – Da Vinci, Gauss, Bernoulli, Lagrange, Leibniz – they studied the natural sciences but were also masters of mathematics, philosophy, chemistry, biology, astronomy, statecraft, linguistics, and whatnot.<sup>1</sup>

There is pretty bad news for a modern-day polymath aspirant. 

What has the shape of research become? Dendritic protuberances cluster around local regions in the research state space where most researchers now tend to spend their entire lives. Only occasionally does some braveheart push forward, or some old research get rediscovered, and the frontier advances. In my opinion, the most pressing need of the hour is more ambitious, frontier research. 

TODO: INSERT ILLUSTRATION OF SHAPE OF RESEARCH 

Which begs the question: what should happen to change the incentives that have nurtured this structure? Has the flood of research itself been the Achilles' heel for fostering good researchers who produce quality work? I don’t think so. Remember the normal. We need to change its shape.  

# The “paper” black hole

Alright, all this aside, I would want to present a bitter truth to young researchers like myself. Thought of another way: what are the chances that a young paper is actually read? Assuming there are 5K accepted papers from all 10 conferences, that’s around 50K papers. Assume there are 10 subfields and the researcher only publishes in one of them, so that’s around 5000 papers. What are the chances that the paper is read? 

So, given that you magically survive the random lucky draw of acceptance with a 25% chance and the normal distribution of “merit” in research quality, here is the cumulative table Gemini generated:

| Distance from Center (Mean) | Benchmark Percentage | Unit Allocation | Cumulative Percentile Range |
|---|---|---|---|
| Far Left (Extremely Low: -3σ to -2σ) | 2.14% | 107 units | Up to 2.27% |
| Left Side (Below Average: -2σ to -1σ) | 13.59% | 680 units | 2.27% to 15.87% |
| Center-Left (Average/Low-Mid: -1σ to 0σ) | 34.13% | 1,707 units | 15.87% to 50.00% |
| Center-Right (Average/High-Mid: 0σ to +1σ) | 34.13% | 1,707 units | 50.00% to 84.13% |
| Right Side (Above Average: +1σ to +2σ) | 13.59% | 680 units | 84.13% to 97.73% |
| Far Right (Extremely High: +2σ to +3σ) | 2.14% | 107 units | 97.73% to 99.87% |
| Outliers (Extreme tails: Beyond ±3σ) | 0.27% | 13 units | 0.00% to 0.13% and 99.87% to 100% |


So, to get a reasonable number of peers to discover your research, you'd need to be in the 99.87th percentile+ category. Assuming we swallow our pride and relax the assumptions, the next best thing is to be in the 97th percentile bucket, with around 100 other papers competing for our peers' attention. _Long sigh_.

**Caveat**: This model makes a lot of assumptions about how research propagates and that researchers are rational creatures who only start reading from the top, and completely discounts the fact that search engines exist, which can resurface research from the average and so on. But I think it’s still a decent model to be aware of if one wants to make it, whatever that means. 

# Solutions

> Where do we go now?  
> ~Axl Rose, Sweet Child O’ Mine

The point of research is to seek and discover truth, to ask a non-trivial question about nature and try to seek an answer. I know it's sounds a whole lot corny but it sounded better in my head, trust me. It should not be Goodharted by paper count to get tenure or bag that million-dollar package or whatever. I know paper quality is hard to quantify and there are no good quantifiable proxies for good research, but oh well. 

As a young researcher, one must be ruthless about one’s choices when it comes to consuming research. There’s literally a ton of garbage out there. We must also strive to build better retrieval systems that go beyond TF-IDF, reranking, or even modern generative retrievals.

Incentivize good research. I know it’s easier said than done because such arrangements go against the principle of efficient capital allocation, but we need people who can do maverick, moon-shot research without concerns for tenure or grant cycles. 

I haven’t thought much about how to fix the rape of the review system and to maintain the integrity of the process, but some people seem to be considering a [credit-based system][11].

# Footnotes
1. Well not all of them were all of these things but you get the idea.

[0]: https://artiwari.profiles.iiti.ac.in/CORE%20Computer%20Science%20Conference%20Rankings.pdf
[1]: https://sorav.compiler.ai/cs_venue_ranked_list.html
[2]: https://www.hpc-ai.com/customer/low-cost-autoresearch
[3]: https://github.com/karpathy/autoresearch
[4]: https://x.com/_TobiasLee/status/2038467322751615264
[5]: https://blog.iclr.cc/2026/03/31/a-retrospective-on-the-iclr-2026-review-process/
[6]: https://aug5th.substack.com/p/the-bach-benchmark
[7]: https://arxiv.org/html/2605.18430v1
[8]: https://www.reddit.com/r/MachineLearning/comments/1sj76a2/just_did_an_analysis_on_iclr_2025_vs_2026_scores/
[9]: https://openaccept.org/c/ai/iclr/
[10]: https://papercopilot.com/paper-list/iclr-paper-list/iclr-2026-paper-list/

[11]: https://openreview.net/pdf?id=6IiZXiqP3Q

[12]: https://iclr.cc

[13]: https://www.exordo.com/blog/double-blind-peer-review






