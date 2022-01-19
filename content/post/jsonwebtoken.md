---
title: "A deep dive into JSON Web Tokens (JWTs)"
tags:
categories: 
date: 2021-11-22T08:03:03+05:30
---

{{<toc>}}

## What is JWT?   

A JSON Web Token or a JWT (pronounced _"jot"_) is a plaintext, human readable piece of data that enables authentication and trust between two unknown entities.  

## Why use JWT?  

There are alternative competing standards such as [SAML (Security Assertion Markup Language)][10] that cater to the same needs like a JWT but JWT has certain advantages that has made it quite common, almost _de facto_ in securing modern web applications.  

1. It is **stateless**. It means the server or the client don't have to maintain any piece of data in-memory in between requests for it to work. 

2. It can be **delegated**. It means the task of generating and issuing a JWT can be completely disjoint from the core application itself, which can be delegated the task of only validated them. Less complexity leads to more robust and bug-free applications. 

3. It is **simple**. In terms of the complexity of data (and hence the size of a JWT) which makes them ideal for low-bandwidth regions.  

4. It is **efficient** to compute. A JWT is generated and validated. Both these processes can take place without considerable constraints on resources, making them ideal for hardware critical applications.   

## Why understand it?   

Most developers and builders can get away without truly understanding the underlying mathematics or algorithms that makes JWT works and that's. . . fine. There are tons of battle-tested, production ready libraries that enable JWT generation and validation, even third-party services like [Auth0][0], to whom one can delegate the entire process of authenticaing via JWT for their applications.   

But, superficial knowledge gets one only so far. A thorough understanding of this technology will equip you to make sound decisions when designing an architecture or troubleshoot elusive JWT errors. It will empower you with a sense of self-assurance and confidence that one gets by mastery.   

## How do JWTs work?   

JWTs combine concepts from cryptography and web technologies to create a standard that allows user authentication and session management among other things. In general, it allows one to say with confidence about the authenticity of a piece of data. This has been adapted to provide security on the modern web.   

A JWT is human readable, encoded JSON objects concatenated by periods (`.`). Here's an example (newline added for readability):   

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```   

There are three pieces of strings:  

1. Header   
2. Payload
3. Signature  

The header and payload are Base64-URL encoded JSON objects. Their contents can be decoded and read. Note: **A JWT is not encrypted**. However, there are standards for encryption [(JWE) RFC 7516][6]. A JWT with only the header and payload is called an _unsecured JWT_ and is generally not used except to store data on the client side in special use cases.  

The signature is used by applications to verify the authenticity of the payload. There are many recommended algorithms to achieve the same but the most popular are `HS256` (`HMAC` and `SHA-256`) and `RS256` (`RSA` and `SHA-256`). Signed JWTs are defined in [RFC 7515][1]. We will look at signing and verifying later.   

### User authentication: Walkthrough  

{{<figure src="/img/jwt/0.png" caption="User authentication workflow using JWTs." width="400px">}}

In this section, we will walkthrough a process of user authentication using JWT. The outlined process is agnostic of the algorithm used upon which the process might slightly differ.   

1. The user client (browser or app) makes a HTTP request to the authorization server with the user (suppose, Alice) credentials (maybe a login form). This should be secure preferably via TLS (Transport Layer Security).  

2. The authorization server may perform necessary checks to be sure that the user is in fact who it poses to be. This maybe achieved by querying a database or via some other method like Single Sign-On (SSO).   

3. The authorization server generates a signed JWT with the header specifying `alg` and `typ` and payload containing some unique identification for this user. The misuse of this identifier shouldn't pose a secuirty risk, however, it should be adequate for our application to identify the user.  

4. Authorization server issues the token to the client.  

5. User requests resources from the application with authorization header set to `Bearer ${token}`.  

6. Application verify the token using a secret or a public key based on which algorithm is used (See below). Choosing the corresponding PUB key can be based on the `iss` field in the payload and maybe an app managed database of public keys.  

7. Application can reject the request or respond with the requested resources based on the result of the validation.  

It should be noted that all data flows through the user client in the form of parameters to the request. On a browser, this should be the key-value pairs after `?` in the URL bar. Moreover, the transaction is completely stateless. To initiate another request, the client can use the token within its `exp` period and avail the services. The application will undergo the validation process all over again.  

To mitigate many secuirty risks, the `exp` period is kept as small as possible, however, it is not convenient to login for each single request. This gave rise to the concept of **session management** and `access tokens` and `refresh tokens`.  

Refresh tokens have a longer `exp` time than access tokens and can be used in lieu of user credentials to ask for new access tokens when the previous ones expire. 

## Structure of a JWT   

### The header   

The header is a plain JSON object having atleast one field `alg` which specifies which algorithm is to be used to verify it. Another is a `typ` field which is the [media type][2] of the JWT itself. For most practical purposes, its value is `JWT`. There may be other fields (or _"claims"_) but these are necessary. A sample header:   

```
{
  "alg": "RS256",
  "typ": "JWT"
}
```

But wait. This doesn't look like what we saw earlier. What's going on? The header and payload are actually encoded by a scheme to the most common subset of UTF-8 characters to ensure portability and avoid garbled text, a sad product of multiple encoding schemes. The chosen method is `Base64URL`, a URL safe variation of `Base64` which swaps `/` and `+` characters by `_` and `-` respectively.   

<a name="alg"></a> The `alg`, if set to `none`, can become a security threat for some verification libraries. The reason being, in the past many verification libraries relied on the `alg` field to pick up the right algorithm. This was the result of ambuiguity in the implementation of verification libraries. To migitate this issue, never use `alg: none` and never allow _unsecured_ JWTs in your application. Onwards to the payload.


### The payload   

The payload is another JSON that is the data store of the token. All claims are stored in the payload. There are some _registered_ claims whose field names have been standardized. 

1. `iss`: The _issuer_. A URI string identifying the authority issuing the JWT. The data can be application specific. 

2. `sub`: The _subject_. A URI string identifying the entity that this JWT carries information about. The data can be application specific. 

3. `aud`: The _audience_. A list of URIs intended as recipients for this JWT. 

4. `exp`: The _expiration date_. Expressed in number of seconds passed since Epoch.  

5. `nbf`: _not before (time)_. The opposite of the `exp` claim. Expressed in number of seconds since Epoch.   

6. `iat`: The _issued at (time)_. Expressed in number of seconds since Epoch.  

7. `jti`: The _JWT ID_. A unique identifier of this JWT. Again, it is application specific.   

Apart from the registered claims, there are so-called **private claims** which are defined by users and add application specific communication to the JWT. Namespaces may be used to avoid key collision. **Public claims** are either registered with the [IANA JSON Web Token registry][3] (central registry to prevent name collisions) or named using collision resistant methods. 

Now, let us take a brief interlude to understand hash functions and then examine how signature works.   

## Hash functions   

_Hashing_ is a computational operation that produces a fixed length string from a data of arbitrary size. Moreover, hashing has certain interesting properties which makes them ideal for cryptographic applications. 

1. **Irreversibility**: Hash functions are one-way functions. The original data cannot be deduced from the output. The only way (known so far) is to brute force each possible data to match the output.  

2. **Reproducibility**: Hash functions are one-one functions. A piece of data is always guaranteed to produce the same output every single time.  

3. **Uniqueness**: By choosing proper parameters, it is possible to reduce collisions to practically zero. Collisions happen when two different data match to the same output.  

4. **Unpredictability**: Even if a single byte is changed in the original data, atleast 50% of the bits changes. This makes it very difficult to guess the data by cunning or intelligent guesses. See [Avalanche effect][4].  

Let us examine a popular hash function `SHA-256`. The Secure Hash Algorithm (SHA) family is defined in [FIPS-180][5]. We are going to use the native node module `crypto` to generate a SHA256 hash.  

```
// code source: https://nodejs.org/api/crypto.html
const {
  createHash
} = await import('crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

## HMAC + SHA256 = HS256   

We have all the components to actually sign and verify a JWT. As it has been noted, the issuing authority can be seperate and oblivious of the identity of the verifier. This is an advantage of JWT. The question is: how do we achieve that? HMAC or Hash-Based Message Authentication Code works this way:  

Generation of token:
1. Take the Header (H), Payload (P), and a secret data (SECRET). Concatenate them together and pass through a hash function.
2. Let the output be HASH. Append this as the signature or Message Authentication Code (MAC) for our JWT.

Validation of token:
1. Take H, P, and the **same** SECRET and produce a hash.
2. If the contents of the payload had not been tampered with, then MAC and this hash will match.  

This scheme is very simple. However, there is an obvious disadvantage: The token issuer and the validation application have to share a common secret which is essentially the crux of security. Requirement of distribution across a large or insecure network makes regular key rotation unfeasible. Moreover, since the SECRET is stored on many nodes in the network, there is more possibility of a SECRET leak or susceptibility to an attack. Public-key cryptography addresses this issue.  

## RSA + SHA256 = RS256   

HS256 suffers from the downside of being unable to distinguish between token generation and token validation. Both are essentially the same process. RSA public key cryptography is a scheme that involves 2 keys: a private key and a public key. The private key can sign a piece of data while a public key can definitively validate if the associated private key had signed the data, hence establishing data integrity. Moreover, compromise of the public key does not diminish the security of the scheme. The private key can be safely stored **only** with the token generation authority.   

Tools like [OpenSSL][8] can generate these keys for you or even online services such as [this one][7]. An example 1024-bit RSA key pair:  
```
-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFpZk5mSyh3rLS/G5+5dWqHAmXJh
vUgIbRh9UXQIoOMe+NOd+9Uu8koI1FP7whsSY5jdwR8IFxaSwOsqcaHZJY0E4S8v
f5mI3GexfoNG4sI6C1g4nk40NWpfpifhEERquHp9C2CdLkGLAlRrAhgkdbmhseWr
ZmwgrzULeSIlM/k/AgMBAAE=
-----END PUBLIC KEY-----
```

```
-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgFpZk5mSyh3rLS/G5+5dWqHAmXJhvUgIbRh9UXQIoOMe+NOd+9Uu
8koI1FP7whsSY5jdwR8IFxaSwOsqcaHZJY0E4S8vf5mI3GexfoNG4sI6C1g4nk40
NWpfpifhEERquHp9C2CdLkGLAlRrAhgkdbmhseWrZmwgrzULeSIlM/k/AgMBAAEC
gYA3LAQp/61U38vUJQ50TKWPqOELLAw99IdKMRyQUsSMbNldwFeMMwLZmtKuBkrd
5TjUnHXV0UboDe2orV5+iu+WlZAsWb7p2phjaOEhR0oWpzZELomVSMRPLMyyRzIw
75kopGYuo/G63ciytbIAVH5R+z8VwJAtq6xykDIxe61HAQJBALJJavLsWqudnA2G
Dgvqa3StiQXmT0Jno0nxuJtm0IxfV5rEVsrCJ94hAplidbRgV15NI03MSnsiZSko
/SzCxd8CQQCBu3/oELpQF4gosBvtpks/lzSRyhzd1eou70P6sDt9DV76cHhe5Mb0
edd/JsXv2V2y3sc6vW1v2sMPi+E6q3ihAkEAp3T2Ez2U3GSpUrp7Lw376Bem//eW
spSNdsKn1q73ayGSMzf/HWrH74ep3U/xpn5nEZf6dPRRcN6ZjdOGGSjImQJAbImg
E1mbZtKpOdFNLGCKaCNq+eYsjHQhvy6yoxO6UX9UTRa3vjyNL5CYeGrKA0bKG5JD
AKPm4UQXGfSfdORswQJAPezFk2XrA0+mX7dkgik6RhOVYmdNzvreL7jarS+FsL6X
WNUbh8tGmrG0BmP8qKI5Tf2iidpJ2ru810QGwaC8fw==
-----END RSA PRIVATE KEY-----
```

Token generation:
1. A RSA key pair is generated (PVT and PUB). The PUB is made public.
2. Header (H), Payload (P) is passed through a hash function (SHA256, in our case). Output is HASH.
3. The HASH is signed with the PVT key to produce SIGNED.
4. SIGNED is attached as the JWT signature and issued to a client.  

Validation:
1. H and P are used to generate a hash. Call it HASH2.
2. Using PUB, it decrypts the SIGNED to produce HASH.
3. The integrity of the data is established if HASH matches HASH2.  

We can deduce authentication because it is guaranteed that just decrypted SIGNED by the PUB key must have been signed by the associated PVT key which is (ideally) only possessed by the issuing server. The issuing server will only issue the token if it is satisfied with the user credentials. Thus, the user possessing the token and posing as the user to our application must be no one else but that user.  

One might question: Why not encrypt the header and payload directly and attach that as a signature. That is a valid question. In fact, such an approach would work in theory. It is not employed in practice because the RSA encryption process can be slow for larger payload sizes. Hashing is a relatively faster computational operation and produces fixed length smaller payloads for RSA to consume.   

## Other algorithms   

There are a plethora of other algorithms that may be used. One of them that is specified in the spec and not discussed here is [Elliptic Curve Digital Signature Algorithm (ECDSA)][11] leading to ES256. Further, there are variations based on the key or block size in the SHA family or the public-key crypto scheme. For a thorough discussion, see the [JWT Handbook][13].   

## Common pitfalls and mitigation techniques   

If you want to develop secure JWT-enabled applications, you must be aware of the common pitfalls that may allow attackers to exploit the weakness of your system. Moreover, we shall discuss some mitigation techniques to safeguard your application. It is **highly recommended** to use tested, production-ready libraries and allow oneself to thoroughly understand the nuances of the provided API. It is generally a bad idea to roll out an in-house crypto module.   

### Unsecured tokens via `alg: none`   

You must note that JWTs are _unencrypted_ in general. JWE encrypts only the payload, the header is always in unenrypted form. Thus, due to ambiguity in specification, an attackers crafted JWT having `alg: none` can be interpreted as valid because of reliance of choosing the algorithm based on that field. 

For more, see [this paragraph](#alg).

### Signature stripping   

A JWT, as you know, is made of three components &ndash; header, payload, and signature. A common method of attack is to strip the signature, manipulate the contents of the payload and mark the token as "unsecured".    

To mitigate signature stripping attacks, make sure your application rejects all signature-less tokens as invalid.   

### [Cross Site Resource Forgery (CSRF)][14]  

This attack is effective when JWTs are stored as session cookies on the browser. The attacker embeds a crafted link to the target site on a malicious page. When the browser requests the resource, it sends the cookie too, if the user had previously logged into target. If the target doesn't implement [CSRF][14] mitigation on the server side, the potentially modified token can be deemed valid.  

Short-lived tokens, not storing JWTs as cookies, and implementing CSRF mitigation on the application are used to tackle CSRF.   

### [Cross Site Scripting (XSS)][15]  

This is similar to SQL injection attacks where the attack takes advantage of improper user data validation on the back end, to inject JavaScript into the trusted sites. It then attempts to harvest JWTs from cookies or local storage. Any data received from a user must be sanitized.  

## References   

1. Blog post: [JWT: The Complete Guide to JSON Web Tokens][12] by Angular University (Good beginner introduction).  
2. Book: [The JWT Handbook][13] by Auth0 (In-depth treatment of algorithms, See Chapter 7).  

## License   

All diagrams and code used in this article is produced by the author unless otherwise noted and is licensed under [CC BY-NC-SA 3.0][9]. This means you are free to share, adapt, or modify it but you should provide credit and not use the contents for commercial purposes.   

[0]: https://auth0.com
[1]: https://tools.ietf.org/html/rfc7515
[2]: http://www.iana.org/assignments/media-types/media-types.xhtml
[3]: https://tools.ietf.org/html/rfc7519#section-10.1
[4]: https://en.wikipedia.org/wiki/Avalanche_effect
[5]: http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
[6]: https://tools.ietf.org/html/rfc7516
[7]: http://travistidwell.com/jsencrypt/demo/
[8]: https://www.openssl.org
[9]: https://creativecommons.org/licenses/by-nc-sa/3.0/
[10]: https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language
[11]: https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm
[12]: https://blog.angular-university.io/angular-jwt/
[13]: https://auth0.com/e-books/jwt-handbook
[14]: https://owasp.org/www-community/attacks/csrf
[15]: https://owasp.org/www-community/attacks/xss/