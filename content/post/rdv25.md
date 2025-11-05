---
title: "Trial by Fire: Tenure as Head of Technology at Rendezvous ‘25"
tags:
categories: 
date: 2025-11-05T12:41:54+05:30
---

Disclaimer: This post may contain expletives. 

{{<dropcap>}}This post{{</dropcap>}} chronicles my experiences as head of technology at [Rendezvous ‘25][1], the annual cultural fest of IIT Delhi and lays out how events unfolded in roughly chronological order, what challenges we faced, how we overcame them, how I managed a team, and finally, delivered to keep the awesome tech culture going at RDV. For those of you who didn’t get a pronite pass and are cursing me right now, please read on. 

This post is written as a review document for myself to come to later and revisit the technical challenges, social challenges, and indeed the intense drama of it all. I think the lessons drawn from this experience are timeless and apply to any intersection of humans and technology (More on this later, if you’re confused). This post is a heartfelt appreciation post for those who stood by my side during these times and it is also a warning to those who did not heed my warnings. More importantly, this post is for the thoughtful so they may learn something from this hard-earned wisdom.<sup>1</sup>


## The beginning 

For the uninitiated, Rendezvous or RDV is the annual cultural fest of IIT Delhi and witnesses more than 10K footfall from around the country to the IIT Delhi campus, hosts more than 100+ events, competitions, and is a 4 day mega-event. The entire fest is organised by students. The hierarchy has the CTMs at the top and are generally final year students followed by coordinators and executives. There are over 35 verticals ranging from marketing, publicity, events, and so on. The tech vertical is responsible for maintaining detailed records of registrations, entry, gate passes, event passes, concert night booking and security management. It facilitates the RDV campus ambassador program (CAP) with a task-based tracker system. It also develops and maintains the official RDV website which serves as the face of the fest in cyberspace. As you can imagine, this vertical facilitates tracking, accountability, and complements other verticals like security, publicity, marketing, and just about every other vertical.

## Timelines

This year, RDV was scheduled from 27th to 30th Sep. The notification for the CTM applications were floated during last week of July and I filled the form out of curiosity. I wanted to get more hands-on experience in leading a tech team and ship products that people actually use - RDV Tech is one of the best places to get this valuable experience in IIT Delhi. Sure enough, I was selected along with a junior and we started out recruiting the team. We had around 60 days to do everything. _Everything_.

## Building a team

We decided to keep a lean team with a flat hierarchy to reduce communication overhead. In practice, the tech team is involved in a workflow at the very end and other verticals just assume that everything is possible in tech (At least, that’s how it works in college fests). This meant that we needed shorter feedback cycles to deliver and keeping a 3-tiered team just won’t cut it. When other verticals had more than 20 or even 30 people, the tech team finally came down to 5 people. Yes, just five people. 

### The team mantra

The mantra I followed was to get only A players, pack as much talent as possible in as few people as possible. This required multiple cycles of hiring and firing and I am glad I did this - an excellent team is absolutely non-negotiable. A lot of what we achieved this time was only possible because of my team. I had to fire around five to six people before I settled on a team of five people who showed up everyday, did the work, and more importantly, enjoyed doing the work. Among these five people, I had two “core” juniors who were exceptionally diligent and sincere (You know who you are :)). I often used to notice how people worked - some of them just grudgingly fed the entire spec to GPT and expected a UI out of magic while some genuinely enjoyed what they were doing - looking at network tab and response code to figure out what’s wrong, using GPT to their advantage and not as a barrier, and those who didn’t tell me “This is not working” but who told me “This is not working because of X and I know how to fix it”. These are the kind of people one should vehemently seek and nurture.

I remember quite vividly what one of my team member told me in my first meet (slightly paraphrased): “_Waise toh meine socha tha ki RDV ka kaam nahi karunga magar mein log dekh kar kaam karta hun aur aap mujhe acche lage_” (I thought I would leave RDV team but I found your personality appealing, that’s why I decided to stay). _wink wink_

## Overview of Systems (Slightly technical)

I have been extolling the tech team a lot but what exactly does the tech team do? 

The RDV tech infrastructure is developed from scratch by the RDV team and combines years of experience passed on from previous CTMs. We reused a lot of the infrastructure set up by last year’s team, managed, and modified a lot of the services to cater to the growing needs of the team. The RDV tech infra is a microservices-based design comprising multiple services like the main website, CA portal, admin portal, pronite portal, a URL proxy service, a mailing server, and a centralised OAuth authentication service. We also maintain a mobile app for scanning gate and concert passes for tracking admissions. All services are hosted and managed on AWS and feature multiple layers of rate limits. We use AWS firewall (WAF) as well as cloudflare’s rate limit rules, and involve Google ReCAPTCHA service for selecting high traffic stages in our workflows (such as authentication, and pass booking) to eliminate bot attack attempts.

Some new things we tried this time:
1. Gate passes and Event level passes
2. Integration of marketing deliverables in gate pass generation workflows
3. Integration of additional biometric data as per security guidelines
4. Integration of an ML pipeline for automated task verification
5. Complete rehaul of the CA Admin portal
6. A new mailing server, and a temporary service monitor dashboard
7. Stress testing of high traffic and mission-critical services using Locust

## Early Days - Setting things up 

After I got access to the AWS and Github org, I started poking around the existing services. The last CTM had done a fantastic job of organising a lot of these things already such as dockerising services, setting up environments on AWS Beanstalk. This was even my first time managing AWS and I knew I would be managing the entire infrastructure some time in the future so I knew I had to master it. Some loss of sleep hours and I was mostly familiar with the basic tools of the trade for there is no better way to learn how to douse a fire than when there is one on your tail. 

If you are connecting AWS RDS using PgAdmin, remember to turn ssl_mode to require. This one configuration took way too long to figure out. And indeed, good DevOps is all a matter of correct configurations. I quickly started making SOPs for deployment and cleanup. See an example SOP below:

_[Redacted]_

In all this, [Perplexity][2] helped a lot in speeding up the search process and retrieving only relevant info in an easy to digest format. I think for devs, Perplexity just makes so much more sense than wading through 10 SO threads before you start getting an idea of what’s going wrong. I got a [Cursor Pro][3] subscription and gave it to the team even though they were initially reluctant (coding purists). However, later on, they told me that Cursor had, in fact, helped them quickly prototype designs, especially UI stuff, which just kept changing a lot - a typical feature of fests.

### Deploying my first app on AWS 

I remember deploying my first environment on EBS took around an hour - creating IAMs with proper roles, checking and double-checking each role’s permissions, setting env variables, configuring VPC subnets, configuring load balancers, configuring firewalls, configuring the database and the service user and double-checking their permissions, configuring third party services like 2Factor for mobile OTP service (Great service at reasonable price and very cooperative person, 10/10 recommend), instance types, and codepipelines for continuous deployment. Once again, I was reminded that there is no room for mistakes and there is no room for assumption.

Along with learning myself, I had to manage communications with the larger team and had to deliver on the CA Portal in a matter of a week since it would be used a month or so leading up to the main fest. I remember the minor exams were also coming up and I had some other prior commitments that I had to tackle as well. As usual, the design team did a sloppy job and we had to improvise on our own to make the design functional. It is partly not their fault as the designer had never used the CA portal or knew about its workflows and what kind of issues the users might face. 

The CAP took two days and at least 10 attempts to deploy partly due to poorly understood GPT written code, some overconfidence on part of the developer, and an extra front slash in the environment URL configuration. The path `BASE_URL/route` should have been used instead of `BASE_URL/route/`. Eventually, the team figured it out and I’m sure learned a lot in the process. There were _countless_ such issues that forced us to think analytically and often under time constraints.

### Work culture 

As I already said, the initial days were tumultuous in terms of team composition, I had to remove people almost on a daily basis but eventually the team settled down and the first thing I did was set up a work culture. I signalled it simply by showing up _every single day_ at the exact _same time_ at the _same location_ and asking everyone to do the same. This move meant that the RDV tech team meant business, that the team lead was not messing around, that the team had to actively take up issues and open PR against them. Surprisingly, almost all of my team were sophomores who had little idea about what git even was and so I had to painstakingly (but patiently) teach them about git workflows.

INSERT: meeting at 9pm at sac message

Eventually, the daily 9pm meets at SAC, often extending till 5am in the morning (!) turned out to be great for team bonding as intense coding sessions and discussions gave way to gossip and romance tales, sometimes over regular night mess treats. I think that money was well-spent in establishing trust as I established myself as a senior who was not just interested in getting work done but who was genuinely interested in the flourishing and well-being of my juniors.

### Dealing with liabilities

My Co-CTM was turning out to be more of a liability than an asset: not showing up, having to follow up multiple times, no interest in the work, no responsibility or accountability. It turned out to be so bad that work started suffering and I had to report him. The larger team decided to let them go but then I practised compassion and asked them not to. Ironically, my compassion came back to bite me later but more on this later. All I learnt from this experience was that not everyone is meant to be a leader and being too compassionate is probably not okay. Spending even one more word on this is useless just as I decided spending a minute of thought would be back at that time.

### Time for reflection 

Leading a tech team also exposes an opportunity to understand and discover oneself. I started noticing things about how I manage things, interact with others, and questioning everything. I have an eye for detail, understand people psychology (an indispensable but rare asset for engineers), and am slightly OCD-ed. I remember getting really pissed off and tensed over a single link not working on the mobile version of the footer of the main website. 

As the team got busy with assimilating the existing codebase and writing more code, I concerned myself with administrative things and the budget in particular. We needed at least 1000 USD going by last year’s cost and we got exactly 0 USD from the team. Multiple reminders to the concerned verticals were watered down or ignored at worst. Out of my self dignity, I stopped constantly reminding them. We had some leftover credits from last year and I decided to manage with that. It would mean rigorously optimising all services, adopting a lean strategy, and cutting down on frivolous costs (Ironically, we ended up wasting 200 USD on a pilot app that was of no value eventually due to carelessness on my co-CTM’s part). 

### Good software = Reduce human cognitive load

Designing the CA Portal and the accompanying Admin portal was a masterclass in developing production-grade software that thousands of people used. It also meant that even a single word in the instructions would wreak confusion on thousands. The leverage we had was insane. One thing we learnt was that keeping the target audience in mind while designing the app was most important. We had to ensure each page transition was as simple as possible for cognitive kindness and easier comprehension. If we were careless, users got confused and we had to explain things on a one-on-one basis. We even had to dumb down “clear cache” to “clear browser cookies” and then eventually to “use a different device”. One piece of advice for the future team will be to ensure good cookie management on the frontend. Even with accessibility, mobile-first approaches, there were one-off issues with devices because some had ad-blockers or pop-up blockers installed and just weird edge-cases that we had not anticipated on an average user. That is the thing, right? One is not developing for the average user, one is developing for _all users_. 

Our previous OTP service had some issues so we started searching for a new one. We found 2Factor.in which turned out to be more reliable than I expected. Due to time and resource constraints, we didn't do DLT registration and went ahead with a default mobile carrier that 2Factor helpfully provided. We did registration trend analysis to find peak demands and last year’s volume data to pick a cost-effective plan.

### The first crisis

Inspite of all precautions and SOPs I could write, it is inevitable that things would fail and I got a taste of it right on the day of the first major run of the CA Portal with the internal team. The idea was to onboard the internal team to track their progress on the task and do a makeshift identification system where we tweak their internal IDs to mark them as RDV team members. At this point, we had three types of users on the platform:
non-IITD external users - treated as a typical CA, full task management, approval system, and points tracking
IITD, non-RDV user - also treated as a typical CA but kinda redundant
IITD, RDV users - treated as a typical CA but have to complete specially marked tasks only. 

One advice for the future team will be to implement a Task Name and some kind of tagging system for accommodating one-off publicity team requirements. 

Anyways, back to the story, the entire team of ~600 have to be onboarded on the platform on Sep 26th and I start getting reports of the authentication system failing. I initially dismiss such reports because there is generally some error on their end so my reaction time is longer to classify reports of a particular kind as a genuine issue. By the time I realised there’s an issue, the team was already gearing up to onboard the platform. I realised there would be massive chaos, so I ran to fix the issue. The issue turned out to be the failing reCAPTCHA service which had exhausted the free trial limit. I laughed so hard. I added my credit card and shifted everything to a paid account. Even last year’s CTM reported that the same thing happened to him two days before the fest.

### The big mistake 

I was aware that this year’s RDV will be under strict administrative supervision due to fund misappropriation allegations last year. This also meant less funds in general. To help the larger team, I agreed to onboard a third party service (say, DumbCompany) for the pass booking workflow. The pronite pass booking workflow is one of the most critical parts of the tech infra and we have a custom server catering to it. DC was a total black box for me. Their code was closed source and there was no obvious security measure that you expect to see on a ticketing platform. Anyways, we started collaborating and it translated to a lot of grunt work on my end such as copy pasting data from one sheet to another, creating redundant event objects on their platform since they did not have user categorisation. They didn’t even have user access control!!! I approved the risk since I was too blinded by “helping the larger team” inspite of clear instructions from last year’s CTM to not integrate any stupid platform with tech. In any case, their entire system was compromised on day 2 of the fest but we are getting ahead of things here. 

One great thing I did, however, was that I approved only a partial collaboration with DC since I didn’t trust them one bit. This meant that the booking step would still be done by RDV tech and only the pass distribution would be handled by DC. This was an attempt to reduce blast radius in case of an emergency. We had no idea what information they had in their QR passes (!). Since this was a first time collaboration, a lot of the things had to makeshift as I highlighted above and all of the burden came down to me which I silently endured. They didn’t even have an API!!!! The entire system was opaque with no documentation, no statistics, no insights into what’s going on. It felt like being built over a weekend by a bunch of sophomores and definitely not a service that you roll out to cater to twenty thousand users. 

### Marketing team

You guys need to understand that tech is not child’s play. Everything has to be properly configured, designed, tested, and secured before releasing it to people. This is because people love to “hack” websites and claim they hacked “RDV”. The tech RDV has evolved over the years is built to prevent every such nonsense. Adding new tasks during registration workflows at the last minute (increasing average registration time from 30 seconds to 1+ minutes) only meant lower registration rates - a simple psychological point that was lost on the marketing team. 

As the days of the fest drew closer, conversations with DC got more intense since they had no infra to cater to RDV. As I was one of the two CTMs from the PG program, I expected feeling left out. But I started feeling treated as an outsider and the vertical at large was being neglected. The idea of not feeling welcomed didn’t bode well with me but I ignored it. I knew what I was building and I didn’t expect non-tech people to appreciate or even understand it at all. 

### The Insults and Slanders 

Due to last year’s fund misappropriation allegations, the admin had mandated that the CTM team sign an undertaking to personally bear the cost of any deficits in the fest’s expenditure. On request for this year’s budget sheet, I was once again ignored by the marketing team. That’s when I decided to post a message on the CTM group saying that I will shut down the entire tech infra if I do not get the sheet by morning. I posted the message at 3 am and went to sleep. The sly thing about this arrangement was that the declaration was given to us at 10pm a day before the fest and our access cards were conditional on signing the declaration. Needless to say, I was furious. After countless nights of toiling fruitlessly for an event, I felt I was being insulted in plain sight now. There were some bitter messages posted about me by certain people in the group. I was hurt but chose to ignore - after all, how can you empty an already hollow soul? Some screenshots of the chat as proof:

_[Redacted]_

## Day 1 

I woke up on day 1 and checked my phone and you won’t believe what I saw. A SHATTERED SCREEN! My phone was dead. I had 3 days of the ultimate test for 2 months of my team’s work. I got one of my junior’s phones as an immediate aid but lost all MFA setup on my old phone. Somehow I managed to setup auth for AWS and cloudflare on the new phone. My contacts were gone. It was a mess. I lost all my photos which included some of my most treasured memories. I was heartbroken but too numb to realise the implications back then.

Day 0 pronite bookings were a breeze. I expected this because no major artists were performing so demand were low. This also didn’t push the system enough for me to diagnose that I had actually forgotten to apply the firewall to the load balancer attached to the Pronite portal application instance…Oops.

When a million requests swarmed the system for day 1 bookings and I saw the system struggle to keep up, I quickly realised that all those sleepless nights of thankless work was for this moment, it wasn’t for some dumb POR or ego satisfaction, it was to feel the adrenaline rush when your engineering systems are put to the test in the wild. After initial hiccups with the WAF, it went smoothly. 

Due to the dumb as fuck design of DC, I had to send data to the company in google sheets (yes, I know, DUMB). It was time-consuming and error prone and obviously not how things are done. Sure enough, I missed a sheet and a group of MSc students didn’t get any passes. Moreover, an important callout informing the end user about all slots filled was in white text colour and hence didn’t show up on a white background - “white on white bug”. I laughed. Good UI design is so damn important. 

“It is working on my machine” is not a valid solution, designing apps for hundreds of user demands thinking laterally - it's about empathising with conditions and experiences that you can never live by yourself.

## What happened on Day 2

DC had just exposed an endpoint to show QR codes on the portal. That dumb endpoint required us to do intensive cryptographic calculation on our end. We pushed the update at 10 am and the pass booking slots were from 12 noon. I noticed that passes were not getting booked. Fuck. 

I called the previous CTM and we got on a call to figure out the issue together. It turned out to be a memory hogging issue. Apparently, the new code had saturated all vRAM on the servers. Kudos to Shanky for diagnosing the issue in due time. I throttled the instance RAM by upgrading from small to medium and adjusted the quotas. We were fully booked.

### The setup

The entry for day 2 was supposed to start from 5pm. We anticipated around 2000 students and 1000 guests, faculty, staff, sponsors, and so on. That’s a crowd of 3000 people. Delhi Police forces and the IITD security team along with bouncers were deployed. I could feel the adrenaline building. We were in talk with CSC to ensure that the external sender was whitelisted because if people didn’t get the QR code from DC on their emails, it would be a disaster. 

Now, how DC’s system worked was that the issuer and scanner had the same login credentials. THERE WAS NO USER ACCESS CONTROL. The security team had decided to share the issuer credentials with freshers who will be scanning the passes at the venue entrance. This, in principle, meant that an inquisitive fresher could gain access to issuing passes if they could enter the OTP before it expired on the issuer portal. That’s exactly what happened.

### The discovery

Around 3pm, one of my team members noticed something curious. There were hundreds of emails being sent to the director’s email id. _Hundreds_. The dumb people at DC marketed their ticketing system as a unique token for each user, then how can there be 600+ tokens issued to the same email id? I was infuriated. But even more than that, I was trying to figure out the implication of this. Clearly, some one has gotten access to the issuer portal, there was no access or event log for tracing, there was only one admin account with all permission. This was a doomed situation. 

### The countermeasures 

We immediately called DC’s representative and he basically raised his hands saying that he has “no control” over the system. I was beyond infuriated. I had to keep calm. I had to navigate this situation. The first thing I did was pull the plug on all DC issued QR codes. We sent out an email via the dean around 4pm saying that all such QRs are invalid. We replaced the DC scanner with our native scanner. We generated our fresh tokens and made it live on the booking portal itself under the Profile section. That would take care of the already booked users but we still had ~1000 people who were given passes due to their privilege like team members, staff, and so on. My fantastic team of 2 people whipped up an endpoint for batch QR generation and we manually distributed the QR codes to these people. 

At 5:30 pm, the queues were hundreds of people long. The first scan failed. My heart sank. At that moment, I felt my second adrenaline rush of the day. I knew at the back of my mind that this subsystem was entirely untested on day 1, if this fails at this point there are thousands of people waiting to get entry. Memories of the stampede during my second year of RDV flashed at the back of my mind. Fuck. I checked the credentials and realised that the scanning schedule had to be updated. We did that and the first QR scanned. I cannot express my relief when I saw that green tick show up. Our system was deployed in production without testing and it worked. I was super proud of my team. 

### What could have gone worse? 

If the adversary was a bit more clever, they could have scraped the entire IITD directory and sent an email to all ten thousand members with a QR code. The system wouldn’t have complained because there was no damn upper limit - there was no uniqueness check even. A cleverly orchestrated attack would probably masquerade this as distributed across various user categories so detecting would be harder and by the time it could be figured out, things would be too late. That would mean ten thousand people showing up anticipating an entry into a venue of only three thousand capacity. A sure-shot recipe for a stampede. Thankfully, the attacker was not that sophisticated which makes me think there were either first or second year students.

### We got lucky 

We were super lucky to discover this attack early enough to invalidate everything from DC and shift to our system in time. I am super proud of my team doing the heavy lifting within _one hour_. Talk about shipping cycles and saving the day. 

### Reflections 

During this whole time, me and my team were holed up at the PFC studio at SAC along with the marketing coordinator, CTM (the same person who had written bitter words to me in the group a day before the fest), and the overall coordinator. We also had to explain everything to the professors and the deans. I could see life getting sucked out of the coordinator who had onboarded DC as calls started pouring in from the deans. I could sense his inexperience and honestly, I felt pity for him. I was naive and uneducated in the way of the world at some point too. I hope he learnt something that day. My respect for elders also increased manifolds that day. I realised how many times they have knowingly and unknowingly saved our asses when we fucked up. Except in this case, I was the one saving the situation. Retrospecting, that split second decision to invalidate all DC issued QR code feels unprecedented and honestly, unreal. Maybe a bit reckless as well, given we hadn’t tested our native system at all. I felt like Icarus, either flying into the sun or burning to the sea. We soar.

### I didn’t get my pass, what should I do?

To everyone who didn’t get a pass, read this carefully. There are 10K members in the IITD community and the venue has a cap of 3000. Even if we were fully booked, 70% of people just won’t get a pass. That’s why there's at most one criteria to ensure at least 60% of people get to experience at least one concert. This is not tech’s fault. That’s the sad reality of it. 

If you have ever taken a computer networks course, you will understand that there are a number of random factors that affect how requests are ordered and go from client to server. The pass booking system is 100% fair in the sense that everyone has a fair chance of _requesting_ for a pass. Whether that request reaches the server depends on your local network topology, your average bandwidth, your local latency which means how many other clients are connected to your router and how many hops it takes from your router to reach the server<sup>2</sup>. In that sense, the pass booking process is essentially a fair lottery for all which is how it should be. So, if you didn’t get a pass, tough luck. 


## Day 3

The next day, the overall coordinator told me that the guy who had written bitter words about me had apologised. I forgave him. 

While I was busy with these, another set of events were unfolding on Reddit. Apparently, people who didn’t get a pass were writing hate messages about me on the r/IITDelhi. I received many concealed hate messages IRL and some of my outside juniors tried to humiliate me by using under-handed scorns for invalidating the QRs because that’s what they saw on the outside. I smiled and shrugged it off. Even if I explained what we had prevented, they probably wouldn't have the aptitude to understand. 

My “co-CTM” who had effectively stopped working but had marketed himself as a RDV CTM started receiving a lot of flak on his social media from people not getting their passes. Karma, I guess. 


The final day was a breeze. DC was gone for good. I was confident in my system. My team worked late to incorporate small cosmetic changes like color-coding passes for various categories as per feedback received from the on-ground team. These were good suggestions. In all this chaos, I missed experiencing the fest, of course. My last RDV as a student. I was only looking forward to the qawwali night which I couldn’t attend. Last year, Nizami Bandhu performed and it was surreal. It’s okay. Sacrifice is the cost of leading as I knew from Literati days as well.

My parents were in Delhi and we had a bus booking to go to Ajmer at 10pm on Day 3 (!) for a 5 day trip. I know. Crazy. Moreover, I had to buy a new phone before that. I landed up in Select Citywalk and bought a Nothing 3a from Croma. I also bought my new Mac from the adjacent Apple store since that was the last day for the offer (I got almost 50K worth of value from the offer!). I had tried to buy the laptop two days back but couldn’t due to credit limits. I think it was written that I would buy my first Mac with contributions from my parents and my father’s card. I must be one lucky guy. 

I took my parents to the Day 3 concert. [Ankit Tiwari][4] was performing. My parents saw the crowd, saw the energy, saw the vibe and I told them “This is what I have been working for”. I forgot the fatigue, the stress, and the adrenaline wearing out. It was all worth it in that moment. I am super grateful I got my parents to experience an RDV concert.

### Some numbers (because an engineer’s life is incomplete without it)

What did we deliver exactly? I looked at the Cloudflare numbers after the fest and I was shocked. We served 130K+ unique visitors and served around 13M+ requests. Entry scanning records show more than 10K visitors though this is a lower bound. We have 20K user registrations. All of this within the span of 60 days across 10+ services.

### System summary

The following section is copied from my [Linkedin post][0].

Few architecture designs: 

- Two tiered caching and rate limiting via Cloudflare and AWS. Google RECAPTCHA integration for anti-bot measures.
- AWS CloudFront CDN for optimised website experience.
- Core OAuth Service featuring multiple social media login options and integration with Kerberos, IITD's internal auth system.
- AWS WAFs, Load balancers, and EBS housed in their own VPC for scalable and secure web applications.
- VLM on AWS Bedrock for automated task verification.
- Event and Pronite passes scanned via in-house mobile app for real-time update on venue occupancy for crowd management.
- Siloed distributed services to reduce blast radius.
- Simulations run on Locust to estimate service performance under stress.
- CloudPipeline integration for one push builds via Github CI/CD.
- RDS Postgres (Database), S3 (Storage), SES (Emails), SNS (SMS), and SEO optimization using sitemaps and Google Rich Results.

## Challenges, Advice, and Lessons

If you have made it this far, thank you! What did we learn from all this? Here are my key takeaways for the future team:

1. Do NOT fuck around with tech - current system is designed taking into account years of learning, no “3rd party integration” unless every single line of their code is audited by the RDV tech team. Even then, just don’t.
2. Please give a budget to the tech vertical.
3. Make a capable Tech CTM near year. The system is more than capable to handle RDV workloads (tested for 2 years), it needs to be configured properly though.

### Personal challenges

1. Every vertical had two CTMs except tech. All workload on me.
2. Thankless working, less bonding with larger CTM team. Most of them were juniors I didn’t know. I knew only 2 or 3 (you know who you are :))
3. Extreme sacrifices made - I could have published papers in ML conferences, could have spent more time freelancing, could have prepped for placements, could have focused more on learning and upskilling but a word is a word and it must be kept even if it meant dying for it.
4. It is extremely hard to communicate tech stuff to non-tech people. These people will never understand what goes on to make things work - they just take things for granted (for instance, integrating the Gemini sponsor task which entailed opening a pop-up window but most users had pop-up blockers installed so it “didn’t work”)
5. I lost my RFID ID card. I had to register a complaint and pay a fine.
6. Potentially lost chance for a romance. There was this girl during RDV who texted. I couldn’t meet her due to my obligations. Anyways, she blocked me when I texted back after the fest so like whatever.

{{<blockquote>}}
Resiliency and hard work can overcome all odds. And a good team. It is most crucial to have a good team. This was, in all respects, a trial by fire.
{{</blockquote>}}


## Footnotes

1: I really want to emphasize “hard” here.   

2: The quant-minded amongst you might think of reducing this latency by moving your request “closer to the source”. I think this won’t work since all requests are re-routed through a proxy service and shaving a few hops in the IITD network may not be enough to get that edge. But if someone wants to try this out, happy to help. I am actually curious to see someone pull this off and report actual numbers.


[0]: https://www.linkedin.com/feed/update/urn:li:activity:7387794074851938304/
[1]: https://rdv-iitd.org/
[2]: https://www.perplexity.ai/
[3]: http://cursor.com/
[4]: https://www.instagram.com/ankittiwari/?hl=en