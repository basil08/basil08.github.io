---
title: "Implementing Kerberos Authentication System from Scratch"
tags:
categories: 
date: 2024-09-29T06:58:24+01:00
---



### Introduction 

Sometime back, I started exploring network security systems and stumbled across [this nice course page][0]<sup>1</sup> from my institute. I thought it would be a nice complement to the introductory computer networks course I am taking this semester. I started reading this fascinating [short design principles article][1] on the Kerberos system. It was so encapsulating that I spent an entire afternoon drawing pictures in my notebook. I decided to implement the ideas given in the article from scratch. In other words, I decided to build my own Kerberos authentication system.

This blog post outlines the process and the reasoning. We’ll build the system from the ground up, that is, we will propose a system, then point out its flaws, and try to redesign the system to overcome those faults. Along the way, we’ll meet a lot of ideas and end up with a much deeper understanding of _why_ Kerberos is designed the way it is.<sup>2</sup> (The [source code][3] is available on Github).

### Motivation 

As we live in a world with limited resources, we need to distribute resources fairly among users. Irrespective of the distribution policy, it is imperative to know who is requesting a resource, that is, we need to confidently say that any resource request supposed to come from a user is actually coming from them. Symmetrically, we need to ensure that the resource/service that the user believes it is requesting is really the resource/service.<sup>3</sup>

> Question: How do we authenticate that an entity is really the entity it claims to be? 

At the heart of any authentication process is a simple idea of shared secrets. Entity A can authenticate entity B if they share a secret no one knows about. For entity A to verify that an entity is B, A only needs to ask for the secret from that entity. If the set of secrets is sufficiently large, it would be virtually impossible for a rogue entity to impersonate B. This mechanism can be even more foolproof if the secret is changed _at every authentication_.<sup>4</sup>

Kerberos implements this abstraction for hosts connected through an unreliable network. In an unreliable network, we assume the existence of malicious actors who may observe and capture any data packets shared between hosts.

But before we begin building Kerberos itself, we need to build the network model and define few other primitives.

### The user AKA the client

The user interacts with the system through a client program. The client abstracts the details of building data packets, sending/receiving packets from other servers, and parsing those packets while gracefully (well, relatively) handling any errors. The client is implemented in the `client.py` module. 

### The resource server

I have implemented a `ResourceServer` class which represents any resource / service that a user is interested to get / use. Our holy grail for this post will be to get this resource from the resource server as a user.

INSERT IMAGE

### Cryptography 

Kerberos utilises a symmetric key cryptography scheme (at least in this formulation). What this means is that any encryption/decryption happens iff the key is known to both parties _beforehand_. How is the key mutually agreed upon between the two parties? That’s a question we will repeatedly visit through this post. 

Initially, I thought I could use [XOR encryption][2] for the sake of this toy application. As it turned out, I spent much of my time debugging annoying unicode boundary errors. Worried that I wasn’t building the actual system, I decided to go old-school. And what’s more old-school than good old Caesar cipher? One funny thing about this algorithm is that it’s laughable and easy to break. If you stare long enough at the ciphertext, you can probably guess what the cleartext might be. Be as it may, it serves our purpose well, so we’ll roll with it. I present the pseudo-code for the encryption and decryption routines below. These can be found in the `/caesar.py` module.

```
encryption(clear_text, key):
 for each character in clear_text
  find the character in the position [idx(character) + key] % character_set_size
  add this character to the cipher_text string
 return cipher_text string
```


```
decryption(cipher_text, key):
 for each character in cipher_text
  find the character in the position [idx(character) - key] % character_set_size
  add this character to the clear_text string
 return clear_text string
```

Caeser cipher has this nice symmetry property, as you can see. It can easily be broken using classic cryptanalysis techniques like naive brute-forcing.<sup>5</sup>

Enough of this now. Let’s get to the good part. 

## Version 1 - The first attempt 

> What is the most basic secret sharing that you can think of? 

We can imagine each resource server maintaining a table of tuples (username, password). If I wish to access a resource, I simply present my password, which the resource server authenticates by looking up the table and matching it. This system works but as you can see, it’s dumb. It doesn’t scale well. If there are 1000 users and 100 resources, we already have 100000 records maintained on the network. Any (user,password) update has to be propagated to _every_ resource server. Moreover, this deeply couples authentication and the actual resource sharing processes. We would ideally want to decouple these two steps so that the resource server is only concerned with serving up the resources. That’s good software engineering!

INSERT IMAGE

> Question: Can we do better? 

Yes! Let’s create a dedicated authentication_server which maintains a single (username, password) table. Moreover, it also stores a (servername, password) table. For a client, it is sufficient to authenticate to this auth server. Why? Because this auth server issues an auth token - a “proof of authentication”. How does it work? The auth server first lookups the password for the user in its user table and once its satisfied, it created a data packet containing the username (and some other metadata like a network address) and encrypts it _using the servername password_. The client takes this auth token and presents it along with its username and network address to the resource server. The resource server attempts to decrypt the auth token and match the username and network address.

What exactly happened here? It is important to note that we established _two things_ through this process.
When the resource server was able to successfully decrypt the auth token, it was sure that the auth token was issued by the authentication server. Why? Shared secrets! The server password is only known to the auth server and the resource server!<sup>6</sup>
Matching the packet username and other data with the decrypted data. This ensures that the request was made by the same entity that authenticated itself to the auth server and so, must be one who should access to the resource.

> Question: What are the flaws in this system? 

1. Well, no one is stopping me from capturing these tokens and making a request to the resource server posing as someone else on the network. This is somewhat alleviated by including metadata like network addresses assumed un-editable by system users.

2. Even more concerning is that the client still has to send the password _over the network_ in cleartext! If a malicious agent can capture the user password then its pretty much game over since this is the only piece of information that the auth server uses to authenticate the user.

3. Moreover, if a client wishes to access another resource, they must authenticate themselves with the auth server _again_. We would ideally like the “I am a person who has access to XYZ resources, here is the proof” step to be decoupled from “Hey, can I get resource XYZ?” step. 

> Question: Can you consider modifying the current system to address these issues?

## Version 2 - Streamlining and Decoupling 


INSERT IMAGE


Let’s address point 2 first. The client doesn’t send the password along with the username while authenticating with the auth server. Remember that the authentication system is symmetric with respect to the parties, which means it can happen on the client as well. So, we somehow need to make the server send the user password without sending the user password. How is it possible? Well, the auth server just sends back the auth token encrypted _with the user password_. The client attempts to decrypt the packet (and is successful if its a legit user). No one but the user will be able to decrypt the packet and get the auth token. 

To address point 3, we will perform another decoupling. We will have two servers - an AuthenticationTokenGrantor server and a ServiceTokenGrantor server, both of which will maintain their own copies of user and service tables. Moreover, we now make these tokens expirable by attaching a `time_of_creation` and a `lifespan` to each token.  

The ATG server only issues `auth_token` which are valid for a certain duration. The STG server issues token specific for any resource server on the network if it gets a valid auth token. As you can see, the user only has to authenticate itself to the ATG server once every reasonable interval of time (say, 8 hours). It can always use the `auth_token` to get `service_token` from STG and use the `service_token` to authenticate itself to the resource server.

> Question: What are the flaws with this system? 

1. Actually, there is no guarantee that the request to the resource server that contains the `service_token` _actually_ comes from the user to which the token was issued. Why? Because there is no shared secret between the ATG and the STG. 
2. It is possible for a malicious actor to gain access to the `service_tokens` and use them to exploit the resource server as long as the tokens have not expired. This is called a [“replay attack”][4].

Let’s fix these now. 

## Version 3 - Session Keys and Authenticators 


INSERT IMAGE


> Question: What kind of secret can the ATG and the STG share? And more importantly, how? 

The way this works is by the use of finite-lived session keys. The steps are as follows:
1. The client authenticates itself to the ATG and gets the `auth token`. The ATG generates an `auth_session_key` and includes it in the `auth_token` (This is the STG’s copy of the session key). Moreover, includes this session key with the packet it sends to the client which is encrypts with the user password first, of course.
2. The client gets the session key and uses it to encrypt another object called an “authenticator” which is basically another piece of info containing the client username and network address. It encrypts this with the session key it just got.
3. The client sends both the `auth_token` and the `authenticator` to the STG. The STG decrypts the `auth_token` and uses the newly acquired session key to decrypt the `authenticator.` It then matches the username that came with the packet to the username in the token AND the username in the authenticator. It then issues the `service_token` to the client. The STG also generates a service-specific session key and includes it in the `service_token` and the data packet it sends to the client but encrypts it with the `auth_session_key` before.
4. The client decrypts the packet, gets the service session key and uses it to build another authenticator for the resource server. 
5. The resource server performs checks analogous to the STG and finally serves the resource to the client. 

> Question: What did we achieve here? 

Well, the authenticator implements the proof that the bearer of the token is _really_ the entity it claims to be. Can you find the shared secrets in this arrangement? Yes, it’s the session keys! 

Although I haven’t implemented this, the authenticator objects also have a lifespan, usually around 1-2 minutes. Thus, it becomes very hard for a malicious actor to replay these attacks. 

Elegant, isn’t it? ^_^

## Conclusion 

If you have made it this far, then I must congratulate you! This wasn’t a trivial post by any means. I have left a lot of the details out of this post for the sake of brevity. If you’re interested, feel free to browse the code and read the article which inspired this post. 

## Ideas for improvement

1. Make the authenticators finite-lived. This is straightforward to implement and will be analogous to how expiration is implemented for the tokens.
2. Implement token refreshing. I think this will be a nice add-on to have if this system should ever be put into production.
3. Abstract the client steps. Right now, the communication with ATG (command `gat`), STG (command ‘gst’), and the resource server (command `get`) happens separately and explicitly. Ideally, a nice client would hide these away from the user.
4. Extend the client to manage tokens and sessions for more than one resource. This demo only focuses on one resource on the network model. We would ideally want more than one resource on the server!
5. (Advanced) Implement an access control layer on top of this Kerberos. I imagine this would involve creating some role abstraction and storing it in the central database for each user and service. Using this abstraction, the STG may deny issuing `service_token` to the client.

## References

1. [Designing an Authentication System: A dialogue in four scenes][1]


### Footnotes

1: Please excuse me if you cannot access the webpage. It’s on IITD’s internal network so it might be accessible outside the network.

2: An additional impetus for me to understand Kerberos is because it is the foundational authentication system used by my institute for authentication and identification.

3: This is called “mutual authentication” and it is generally considered a useful property for general-purpose authentication systems.

4:  This closely relates to the idea of a one-time pad which is provably unbreakable. If you’re interested, please check any standard cryptography textbook.

5: Highly recommend reading “The Code Book” by Simon Singh. Highly accessibly and fun read. Or you may also try “Gold Bug” by E. A. Poe.

6: If you’re careful, you may ask but how do we know if the decryption was successful? For this reason, the data packet usually also contains the network identifier of the resource server. So, if the resource server finds its name in the packet, it can be sure that the decryption was successful.




[0]: https://www.cse.iitd.ernet.in/%7Esiy107537/sil765/readings.html
[1]: https://web.mit.edu/Kerberos/dialogue.html
[2]: https://en.wikipedia.org/wiki/XOR_cipher
[3]: https://github.com/basil08/smolKerberos
[4]: https://en.wikipedia.org/wiki/Replay_attack




    