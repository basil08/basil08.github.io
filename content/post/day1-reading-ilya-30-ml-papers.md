---
title: "Day 1 of n: Reading (and Implementing) Ilya's 30 ML Papers"
tags:
categories: 
series: "Tech"
date: 2026-09-02T19:01:50+05:30
---

Source material:

1. https://gist.github.com/matijagrcic/ae8353eb1e6be84a7c85d9fdc2f9631f	
2. https://luisto.fi/blog/im-planning-to-read-ilya-sutskevers-30/
3. https://aman.ai/primers/ai/top-30-papers/
4. https://www.turingpost.com/p/ilya-sutskever-reading-list

Also supplemented by Essential Deep Learning papers. See https://papers.baulab.info

The lists differ considerably due to no single source of truth and the papers are not arranged in order of attack. 

---

## My Approach 

My approach will be different in the sense that I will not just read the papers but try to grok them, implement as much as possible (with as little shameless copy-pasting from LLMs) and go into small tree search around the topic anchored by the mother paper. One day one paper, 30 papers. Let’s go.

## Group by paper category

Papers are roughly grouped into:
1. Architecture papers
2. Theory papers
3. Engineering papers
4. Applications papers

<details>
    <summary>Category-wise grouping of papers</summary>


    ### Architecture
    1. Attention is all you need
      - Go deeper into types of attention mechanisms. Most critiques don’t like attention; why? Why is it so effective then?
    2. NTM
    3. RNNs
      - Variations include LSTMs, GRUs
      - See Olah, Karpathy blogposts
      4. Pointer Networks
      5. CNN
    
    ### Theory
    
    1. Scaling Laws
    2. MDL
    3. Komogrov Complexity
    
    ### Engineering
    1. GPipe
    
    ### Applications
    1. Seq2Seq
    2. Protein folding
    3. AI4Science - see GDM research
    4. AI4Math
    5. Automated research
    6. Translation
    7. Speech to Text and family of models 
  
</details>

## Papers arranged by increasing epistemic knowledge (for beginners)

TBD

# Day 1: LSTMs, RNNs, and Complexodynamics

1. Re-read Chris Olah’s [excellent exposition of LSTM][0].

Explore my implementation in [this notebook][3] (boiler plate code is LLM-generated).

This time I took the time to implement it using basic PyTorch. I remember my last ambitious (and somewhat stupid) attempt at writing autograd “from scratch” failed marvelously and had to be abandoned with the bitter lesson (pun not intended) that I am, after all, a poor programmer. Anyways, keeping my ego aside, this time, I took the path of least resistance, focused on the main problem - namely implementing the architecture from just the blogpost text - mind you I have never read any paper on LSTM before, and worry about details like dataloaders and training loop later. 

This strategy paid off well on average as I quickly ran my code and started seeing loss collapse to zero on the second epoch! The loss was stable and barely moving. Obviously the model was not learning anything. And sure enough, Claude pointed out that I have forgotten to return the variable that is supposed to be trained and moreover, it was a class variable rather than a local variable that holds the hidden state and long-term memory register! Yeah. I felt ashamed. My ego was humbled, but it was only the beginning. 

I was asking Gemini for code snippets for “boring” bits and pieces such as DataLoader, normalization, and inference code which accelerated the process considerably and made sure I didn’t waste time on less important aspects. I think this strategy is very good and I will try to use it more in the coming days as I implement other architectures as well. I also noted that large chunks of the ML pipeline is just boilerplate code (training loop, data prep, evals, inference, etc.) and should be packaged into neat reusable modules. Who knows I might build a small library at the end of this learning project. 

Anyways, Claude pointed out glaring structural and systemic flaws in my assumptions and design decisions. For example, I was using a word-based tokenizing scheme that split on spaces (I know, don’t roll your eyes; I wanted to start simple, and I was going to implement BPE), and Claude said to use a character-based tokenizing scheme because the corpus was too small. Similarly, it prepped the data into seq_len chunks of a sliding window, essentially blowing up the training dataset. It also suggested (and wrote the code) for an evaluation subroutine for validation. I was following the conventional epoch-based training loops; it suggested using steps since the corpus was too big and there is essentially no new information to learn across epochs. It also did some back-of-the-envelope calculations to tune some key hyperparams and suggested increasing hidden dim and other practical, insightful nuggets. However, at this scale, Claude probably already has the optimal hyperparams memorized lol. I also naively implemented argmax over the softmax-ed logits. Claude suggested I move to temperature-based sampling to avoid getting into repeated phrase loops -- very valid point btw. 

The model trained alright. It generated text that, funnily, represented Shakespearean writing. Pretty cool stuff. I trained on my Mac. On default dim=128, it took around 30 mins to train for 20K steps across the whole corpus (~5M training pairs).

This exercise made me realise when people say how much of a dark science practically training ML models is. There are so many hyperparams to tune and there is no scientific grounding save a few heuristics and just accumulated industry wisdom. It’s like shooting an arrow in the dark and hoping it lands on the target. In my opinion, people who train models with trillions of parameters across distributed clusters are nothing short of modern-day wizards!

Sample Prompt:
> "I know not why I am so sad"

Sample Output: `max_chars=100` and `temperature=0.5`; some hyperparams (`dim=256`, `batch=64`, `seq_len=128`)

> Raw: ['I', ' ', 'k', 'n', 'o', 'w', ' ', 'n', 'o', 't', ' ', 'w', 'h', 'y', ' ', 'I', ' ', 'a', 'm', ' ', 's', 'o', ' ', 's', 'a', 'd', '\n', 'A', 'n', 'd', ' ', 'y', 'e', 't', ' ', 'l', 'i', 'v', 'e', 'd', ' ', 'y', 'o', 'u', 'r', ' ', 'l', 'e', 'a', 's', 't', ',', ' ', 'y', 'e', 'a', 'k', ' ', 'a', 'g', 'a', 'i', 'n', ',', ' ', 'I', ' ', 't', 'a', 'k', 'e', '\n', 't', 'h', 'e', 's', 'e', ' ', 't', 'w', 'a', 'i', 'n', ' ', 'c', 'o', 'r', 'r', 'u', 'p', 't', 's', ' ', 's', 'o', ',', ' ', 's', 'i', 'r', ',', ' ', 'w', 'i', 't', 'h', ' ', 'a', ' ', 'g', 'r', 'a', 'c', 'e', ' ', 'o', 'f', ' ', 'h', 'i', 's', ' ', 's', 'p', 'e', 'e']

> "I know not why I am so sad\nAnd yet lived your least yeak again, I take\nthese twain corrupts so, sir with a grace of his spee..."

And then I guess we'll never know what Shakespearean my model was musing over. Also interestingly note non-English words like "yeak". Pretty impressed that the model learned English words and basic grammar semantics. 

2. I also skimmed through some parts of the [Attention paper][2] but didn’t deep dive today due to lack of time. 
3. I also read through [Aaronson’s post on complexodynamics][1] - weird idea but nice to think about. Still need to get my head around the sophistication metric.

[0]: https://colah.github.io/posts/2015-08-Understanding-LSTMs/
[1]: https://scottaaronson.blog/?p=762
[2]: https://arxiv.org/abs/1706.03762
[3]: https://github.com/basil08/deeplearning/blob/main/rnn/lstm.ipynb
