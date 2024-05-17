---
title: "Distillation of \"A Circuit for Indirect Object Identification in GPT-2\""
tags:
categories: 
date: 2024-05-16T21:23:35+05:30
---

This is a [distillation][3] of the paper “Interpretability in the Wild: A Circuit for Indirect Object Identification in GPT-2 Small” by Wang. et. al. [Paper][0].

## Overview 

As LLMs continue to prove themselves capable as a general problem solver, they are increasingly being deployed to critical application settings. Thus, it is paramount to understand the algorithms that are implemented by the model in order to reason about the output of a model. 

Mechanistic interpretability seeks to discover these algorithms by looking at the constituents of a model and trying to reverse-engineer the functionality of each component based on the observed behaviour of the model.

By modelling an LLM as a graph, subgraphs have been identified in previous work that are most active during the “computation” of a fixed task. This paper finds such a subgraph (called a circuit) in the GPT-2 small (henceforth, GPT-2S) model which successfully computes the Indirect Object Identification (IOI) task. Furthermore, it runs experiments on the individual components of the circuit to assign function to each component, thus completing the analysis of the circuit. 

## Description of Transformer architecture 

We must first understand the [GPT-2S transformer architecture][1]. 

The GPT-2S is a decoder-only stack of 12 transformer blocks. Each transformer block consists of an attention layer and a standard MLP (Multilayer perceptron). There are also normalisation layers which we can ignore for the purpose of this post.

### How next token prediction works in GPT-2S

In inference mode, the model is fed a stream of embedding vectors. For each token in the input prompt, we generate a token embedding (we’ll look at how this is computed later) which forms the residual stream. The residual stream is the fundamental data flow object that passes through the stack of blocks and gets morphed. At the output, we get a probability distribution over the entire vocabulary of words for the model which can be sampled to get the next token. 

## Parameters of GPT-2S

The vocabulary of a model is built by [byte-pair encoding][2]. Starting with the ASCII character set, we pair together most common occurring characters and treat them as new tokens.

Sample vocabulary: [“A”, “B”, … “a”, “b”, …, “ t”, “as”, …., “the”, …, “this”, …]

Any input string is decomposed into tokens by matching it to the vocabulary. The list of tokens is then transformed into a one-hot vector encoding which is a vector of length `d_vocab` with all entries 0 except the index at which the token is found in the vocabulary list. 

Eg input string: “GPT-2 is a model which is capable of” 
Supposed tokens: [“G”, “P”, “T”, “-”, “2”, “ is”, “ a”, “mod”, “el”, “ whi”, “ch”, “ is”, “cap”, “able”, “ of” ]

This vector is then projected into an embedding vector by multiplying it with the token embedding matrix (`W_te`) which typically has a much lesser dimension than d_vocab<sup>2</sup>. In case of GPT-2S, `d_model` = 768.<sup>1</sup> 

Each attention layer is made of 12 attention heads and each head independently attends to each token. The output of each attention head is an updated residual stream with the added information of how much the current token should copy information from the previous tokens (Intuitively speaking, this step encapsulates the process of providing linguistic context to the model during prediction). The output of the attention layer is simply the sum of these vectors.

The MLP performs a standard forward-feed pass. The output of the final block is transformed into a probability distribution over the vocabulary space by multiplying with the so-called unembed matrix `W_ue` to get a logits vector over the vocabulary space which is normalised to a probability distribution using softmax. The distribution is then sampled to output the next token.   

The GPT-2S model has around 117M parameters as per published data but Jay Alammar found them to be around 124M. 

## Problem framing 

We have fixed our model as a pre-trained GPT-2S model. The paper picks up Indirect Object Identification as its task. It is a sufficiently challenging task while at the same time lending to interpretability on the GPT-2S. Given a sentence like, “When Mary went to meet Paul, Paul gave a flower to”, the next token should be “Mary”. As is evident, predicting the correct token involves correctly identifying the names in the input stream, building a context of names, and not mixing up the subject of the two clauses. 

The outlined algorithm as stated in the paper is:
1. Identify all names in the sentence (Eg: Mary, Paul, Paul)
2. Remove all names that are duplicated (Paul, in this case)
3. Output the remaining name.

## Circuits and Knockouts 

As mentioned before, we think of the model as a computational graph `M` where nodes are components encountered by the residual stream in the forward pass (attention heads, MLPs, etc.) and edges are interactions between those components (eg: attention, projections, etc.) A circuit `C` is a subgraph of `M` which is responsible for some behaviour (such as solving the IOI task).

A knockout can be defined as “switching off” a set of components `K` and observing the resulting logits in the remaining graph  `M \ K`. One naive way to effect this knockout would be to simply set the activation of those K components to 0 (called *zero ablate K*). However, 0 is an arbitrary term and hence leads to noisy results in practice. Another strategy is called *mean ablation*, where we set the activation to some mean activation value across some reference distribution `p_ABC` (which is different from the distribution sampled for the input namely `p_IOI`). Thus, we remove the specific information that flowed through that activation but keep the “structure” of activation intact.   

### Measures of performance

The paper uses two measures to quantity performance of the IOI task

1. **Logit difference**: It measures the difference in logit value when the model outputs IO or S respectively. A positive score means the correct name (IO) has higher probability. 
2. **IO probability**: It measures the absolute probability of the IO token under the model’s predictions. 

## Discovering circuit for IOI in GPT-2S

The circuit identified to perform this task included 7 classes of attention heads. The 3 major classes corresponding to the algorithm above are:
1. Duplicate Token Heads
2. S-inhibition Heads
3. Name Mover Heads

Moreover, other classes of heads discovered were:
1. Negative Name Mover Head
2. Previous Token Heads
3. Induction Heads
4. Backup Name Mover Heads

The approach involved starting from the output logits and moving backwards through the model, identifying heads that affect the logits the most by means of causal intervention. In particular, the paper describes path patching in order to identify the path through the model that most actively contributes to the output. 

## Path Patching 

Path patching replaces part of the model’s forward pass with activations from a different input. Let us assume some fixed node h and a subset of paths P emanating from it to set of components R. We take the activations obtained from h on original input for all paths not in P. For paths in P, we replace the original activations with activations from new input drawn from the reference distribution `p_ABC`. Over many random samples, we measure the average logit difference and hypothesise as follows:

Pathways `h -> R` that are critical to the model’s computation should result in a large logit difference when patched. 

## Discovery of circuits and the role of heads

To identify the circuit for IOI, the authors ran path patching on the pathways h -> Logits for each head h at the end position of the token sequence. They identified heads which attend strongly to the IO token. Thus, they were hypothesised to function as **Name Mover Heads**. Responsible for copying the IO token to the output stream. This claim was verified by checking the correlation between the logit scores and the attention probability on the IO or S token (rho = 0.91, N = 500).

The next question to ask is, which heads affect the Name Mover Heads? The researchers identified **S-inhibition heads** along the h -> Name Mover Heads pathways. Patching these heads led to greater probability on S (and thus lesser on IO), confirming the fact that these indeed serve as S-inhibition heads. 

Two sets of heads were identified to be attending to S-inhibition heads. They were **Duplicate Token Heads** which attended from S2 to S1. They copied the position of the previous occurrence to the current position. This hypothesis was verified by observing attention patterns on random sequences. A correlation was found between attention probability and presence of a duplicate token in the sequence. 

The second set of heads were **Induction Heads** which attended from S2 to S1+1th token (Thus, being able to output [B] if it observes a pattern like [A] [B] … [A]). Along with **Previous Token Heads**, which copies the information of [A] to [B]’s stream, thus allowing Induction heads to output [B] when it observes [A] as the last token. 

**Backup Name Mover Heads**: When after knocking out the Name Mover Heads, the model performed the task satisfactorily, indicating presence of redundancy in the head’s functions. The researchers identified 8 such heads which showed diverse behaviour in the presence of Name Mover Heads. They hypothesised that the model learnt these heads to become robust to dysfunctional parts. 

## Experimental metrics

We let `f(C(X); X)` denote the logit difference between S and IO token in the circuit `C`. Moreover, we define `F(C) = E[f(C(X); X)]` over `p_IOI`, which is essentially average logit difference over many samples drawn from the distribution `p_IOI`. 

Similarly, `F(M) = E[f(M(X); X)]` denotes the expected logit difference over the whole model.

Even after the circuit has been identified, are we sure that this model satisfactorily describes the model’s internal representation to solve the task? The researchers validated the circuit over three metrics: 

1. faithfulness to the original circuit
2. completeness 
3. minimality 

Faithfulness measures how similar is C’s performance to M’s performance, that is, how small is `| F(M) - F(C) |`. In the paper, C achieved 87% of M’s performance. 

Completeness means how similar does C remain to M under all possible subsets of knockouts. As the entire subset space is exponential, the researchers resorted to samping. 

Minimality focused on ensuring that each node v in C contributes to the task, that is, for each node v in C, there exists a set K such that `| F ( C \ (K U {v}) ) - F ( C \ K ) |` is maximum. 

## Limitations 

By reading the paper, I could observe the following limitations:

1. The analysis is heavily dependent on manual labour and “wishful thinking”. Thus, it is model-specific and the extent of generalisation to other models has to be backed by a theoretical basis. Moreover, due to the nature of analysis, it does not yield to analysis of bigger models.
2. The paper focused on one specific task. What kinds of heads will we observe for other classes of tasks? Will it be possible to automate the analysis for other classes of problems too? Moreover, will we be able to reason about every single algorithm by means of this analysis?
3. Intuitively, the metrics for stating that a discovered circuit performs the task as expected seem reasonable. But they involve a search over an exponential space which again is not computationally tractable.

## Footnotes

1: In reality, another vector called the positional embedding vector is computed which encodes the “locality information” of language using another matrix called `W_pe` and both vectors are added. But for simplicity, we have skipped that as it won’t affect our discussion. 

2: The `d_vocab` parameter can be anything really but the Neel Nanda toy implementation sets it to 50257. The relation between `d_vocab` and `d_model` can be an active area of research!


[0]: https://arxiv.org/abs/2211.00593
[1]: https://jalammar.github.io/illustrated-gpt2/
[2]: https://en.wikipedia.org/wiki/Byte_pair_encoding
[3]: https://www.lesswrong.com/tag/distillation-and-pedagogy