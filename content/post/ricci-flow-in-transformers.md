---
title: "Can discrete Ricci flow signal capability transition in Transformers?"
tags:
series: "Tech"
categories: 
date: 2026-10-11T18:23:49+05:30
---

# Abstract

{{<figure src="/img/ricci-flow/2.png" caption="Headline result. A: the layer coefficient through grokking, per transition (thin) and mean (thick), against test accuracy. B: the same coefficient for a grokking run and both training controls. C: the calibrated excursion for every run in the study, grouped.">}}


{{<dropcap>}}Researchers{{</dropcap>}} have shown that the feature geometry of a feedforward neural network evolves as discrete [Ricci flow][0] where a node's curvature anti-correlates with the expansion of its neighbourhood across layers (Hehl et. al. 2025). Apart from establishing a connection between machine learning training dynamics and loss landscapes with differential geometry, this result also presents new heuristical methods for early stopping and efficient model architecture selection informed by geometric feature evolution. 

In this blog post, I asked the question: does the same geometric evolution results hold when the techniques are applied to a decoder-only transformer architecture (Vaswani et. al. 2017)? Based on my limited resources and time, I was able to achieve partial success where I show that indeed some aspects of the feature manifold evolve as Ricci flow, whereas some do not. Application of the techniques as presented in the paper presented non-trivial difficulties when applied to the transformer. This post elaborates how I overcome those issues, presents the results with some plausible explanation and notes the limitations and future work. 

# Introduction

{{<figure src="/img/ricci-flow/0.png" caption="Stylised representation of the evolution of the data manifold and the corresponding discrete graphs. Source: Hehl et. al. 2025">}}


A neural network transforms the input data manifold through complex non-linear transformations. This sequence of transformation may be viewed as an evolution or a _flow_ on the geometry of the data point cloud. Hehl et. al. studied this phenomenon and showed that for feedforward network trained on both real and synethetic datasets on the task of binary classification exhibit manifold transformation consistent with discrete Ricci flow where the surface smoothens into highly curvatured surfaces corresponding to the specific class. 

Since the manifold itself is difficult to visualise for a dataset, the authors built discrete graphs at each layer using techniques such as k-nearest neighbour and r-distance graphs. Moreover, they assigned each node a discrete scalar curvature and studied how the curvature changed with respect to the neighbourhood across the layers.

We asked if this phenomenon transfers to transformers also? And if yes, can the geometry move actually signal a capability transition? We used grokking on modular arithmetic as the motivating problem since it is fairly well-understood and is not resource-intensive to learn. Grokking refers to the observation of sharp decline in network loss, representing moments when the network "learns" or achieves "epiphany" in task comprehension and performance. 

The transfer from a simple feedforward neural network training for binary classification to auto-regressive transformer blocks was not straightforward. Some of the difficulties faced were:

1. Simple MLP are represented as complete transformation of the form, {{<mj/i>}} \( x \to g(x) \) {{</mj/i>}}. Transformers actually "modify" the residual stream instead of transforming it. This is better represented as {{<mj/i>}} \( y \to y + h(y) \) {{</mj/i>}} which means that consecutive layers carry non-negligible feature remnants from past streams.
2. Transformer sublayers alternate in kinds, namely attention and MLP blocks {{<mj/i>}} $y = \phi_1 \circ \phi_2 \circ \cdots (x)$ {{</mj/i>}} rather than simple chained MLPs {{<mj/i>}}$y = \phi \circ \phi \circ \cdots (x) ${{</mj/i>}}. 
3. The representations are per-token across the context length. Therefore, interpreting the idea of a scalar curvature at layer $l$ only makes sense if we fix a read-out position along the context. 

## Key results

1. We found that the layer Ricci coefficient indeed tracks the transition across layers. 
2. The local Ricci coefficient measured at a node through training stays around zero in transformers at every depth. 
3. Some part of the above discrepancy can be explained by the presence of residual connections in transformer blocks. For this, we observed local $\rho$ differ by +0.13 to +0.21 covering about two thirds of the feedforward-to-transformer gap. This suggests that comparing architectures that differ in skip connections may not be a good idea. 

# Preliminary background

## Discrete curvature on a feature graph 

{{<figure src="/img/ricci-flow/1.png" caption="A curve with both large and small curvatures. Source: Gab Khan">}}

As mentioned before, we pick a subset of activation at each layer {{<mj/i>}} \( X_l = \{ \textbf{x}_i \}_{i=1}^n \) {{</mj/i>}} and build an undirected graph $G_k(X)$ based on the k-nearest neighbour approach. There are many metrics mentioned in Hehl et. al. to formalise the idea of curvature (See Ollivier-Ricci and Forman-Ricci curvatures). We present the augmented Forman-Ricci curvature of an edge which is computationally more efficient to compute:

$$
AF_l(u,v) = 4 = deg_l(u) - deg_l(v) + 3 | N_l(u) \cap N_l(v)|
$$

where $N(u)$ represents the set of neighbour nodes of $u$ and the scalar curvature of the node $\kappa$ is just the mean of curvature of its incident edges.

Across layers, as the same neighbourhood of a node expands, it would mean that the nodes are more spread apart. This can be formalised as an average of the differential shortest path distance between two nodes across the two graphs at layers $l+1$ and layer $l$. 

{{<mj/b>}}
$$
\eta_l(x) = \frac{1}{deg_l(x)} \Sigma_{y \sim x_l} [d_{l+1}(x, y) - d_{l} (x, y)] = \frac{1}{deg_l(x)} \Sigma_{y \sim x_l} d_{l+1}(x,y) - 1
$$
{{</mj/b>}}
since y in same layer as x implies $d_l(x,y) = 1$. A node's $\eta$ is large when its layer $l$ neighbours are pushed far apart in layer $l+1$. 

## The local and layer Ricci coefficients

Ricci flow contracts positively curved regions and expands negatively curved regions so there is an anti-correlation between $\eta$ and $\kappa$. This can either be observed as a Pearson coefficient between $\kappa$ and $\eta$ at each layer $l$, namely $\rho_{layer}(l)$ or at a specific node across $T$ depth transitions, namely $\rho_{local}(x)$.

For feedforward networks, the authors found that $\rho_{local} \in [-0.40, -0.76]$ and $\approx 0$ for untrained networks.

## Grokking to represent capability transition

We study the problem of modular addition $c = (a+b) \mod p$ where a small transformer is trained with training set fraction pairs over few hundred steps. [Nanda et. al.][1] showed that the network abruptly generalizes and that the underlying mechanism for grokking involves principled circuits that can be cleanly interpreted as algorithmic steps. This problem is suitable for studying capability transition due to its fairly well-understood nature.  

## Where to read a transformer's "layers"? 

Unlike a MLP, the transformer's output is a residual stream per-token. Our sequence is `a`, `b`, `=` We read the prediction at the final position and log the residual stream at each sublayer boundary, namely 

```resid_pre_0, resid_mid_0, resid_post_0, resid_pre_1, ..., resid_post_L-1 ```

# Experimental setup

**Task**: We used modular addition $c = a + b \mod p$, the input sequence was $a, b, =$, and the final position was read as model output. 

**Model**: We used a decoder-only transformer, 4 heads, $d_{head} = 32$, $d_{mlp} = 512$, no Layer Norm, full batch AdamW, $lr = 10^{-3}$, weight decay 1.0, $\beta = (0.9, 0.98)$, 30,000 steps. $d_{model} \in (64, 128, 256) at L=4$. Total parameter counts were 0.41M / 0.82M / 1.64M. $L = (1, 2, 4, 8)$. We used various seed configurations across runs and swept accordingly. 

**Hardware**: All experiments on a M4 Max (36 GB) using MPS. 

# Results

{{<figure src="/img/ricci-flow/2.png" caption="A: the layer coefficient through grokking, per transition (thin) and mean (thick), against test accuracy. B: the same coefficient for a grokking run and both training controls. C: the calibrated excursion for every run in the study, grouped.">}}


<!--{{<figure src="/img/ricci-flow/3.png" caption="">}}-->

{{<figure src="/img/ricci-flow/5.png" caption="Curvature against mechanistic progress measures computed from the same run's weights. A: the three phases read off the weights - accuracy, the embedding's Fourier concentration on the five key frequencies, and the weight norm. B: the layer coefficient (faint: raw; bold: 7-checkpoint rolling median) with the four events marked. Most of the drop precedes saturation; the coefficient then deepens further through the cleanup window and bottoms out just after it.">}}

One of the surprisings results is the above figure which shows that the mean layer coefficient would lead the rise in test accuracy but it actually lags behind by around 900 steps. We found that about half of the geometric reorganization happens when test accuracy has fairly stabilized. Across 15 runs, a median of 50% of the coefficient changes after 99% test accuracy is reached. 

<!--{{<figure src="/img/ricci-flow/6.png" caption="">}}-->

## Coefficients should be interpreted differentially 


{{<figure src="/img/ricci-flow/4.png" caption="A: the local coefficient post-saturation for every well-conditioned configuration, with leave-one-transition-out ranges; the grey band is the range reported for trained feedforward networks. B: matched plain versus residual MLPs at initialization.">}}


Hehl et. al. reported the local coefficient as near zero for untrained networks. However, this does not hold for our setting and therefore, the numbers above should be interpreted differntially rather than on absolute terms. 

| Configuration | Architecture | {{<mj/i>}} \( \rho_{local} \) at init {{</mj/i>}} | {{<mj/i>}} \( \rho_{layer} \) at init {{</mj/i>}} |
|---|---|---|---|
| transformer, $L=4$ | transformer | $-0.158$  | $-0.322$  |
| transformer, $L = 8$ | transformer | $ -0.232$ | $-0.358$ |
| transformer, $L=4, d=64$ | transformer | $-0.255$  | $-0.355$ |
| MLP, $L=4$ | MLP | $-0.435$ | $-0.224$ |
| MLP, $L=8$ | MLP  | $-0.637$  | $-0.312$ |

## Effects of residual connections  

Why is there a feedforward-to-transformer gap in the first place? Can we explain it? The obvious differing mechanism is the residual stream so we constructed similar MLPs with identical depth, width, init scheme, and only differing whether the block transforms input as $h \leftarrow \sigma(Wh)$ or as $h \leftarrow h + \sigma(Wh)$. 

| Depth | Transitions | {{<mj/i>}} \( \rho_{local} \) plain {{</mj/i>}} | Residual | Shift | {{<mj/i>}} \( \rho_{layer} \) plain {{</mj/i>}} | Residual | Shift |
|---|---|---|---|---|---|---|---|
| 4 | 3 | $-0.450 \pm 0.055$ | $-0.318 \pm 0.031$ | $\mathbf{+0.133}$ | $-0.293 \pm 0.042$ | $-0.226 \pm 0.018$ | $+0.067$ |
| 8 | 7 | $-0.588 \pm 0.034$ | $-0.361 \pm 0.030$ | $\mathbf{+0.226}$ | $-0.343 \pm 0.031$ | $-0.237 \pm 0.016$ | $+0.106$ |
| 16 | 15 | $-0.638 \pm 0.018$ | $-0.430 \pm 0.026$ | $\mathbf{+0.208}$ | $-0.387 \pm 0.037$ | $-0.296 \pm 0.007$ | $+0.091$ |

Residual connections account for 0.227 of the 0.356 gap (about two thirds). The unexplained part may be transformer specific like attention mixing, single position read-out, no LayerNorm. 

The local coefficient represents an absolute level change across transitions at a particular node which is already contaminated at init time due to architectural differences so as expected, it does not transfer. However, the layer coefficient is a quantiy measuring change between layers so the constant init offset cancels. This suggests that architectures differing in skip connections may not make sense to be compared.

# Discussion and Limitations 

As discussed, $\rho_{local}$ correlates the curvature change around a fixed datapoint across depth. The additive residual stream and skip connections results in a negative result for this metric. The residual MLPs that we train separately confirms that about two-thirds of the unexplained difference can be explained by a constant offset at init time and suggests that measuring absolute local $\rho$ values across incomparable architectures is not a good idea.

Due to how we defined $\rho_{layer}$ as a change between layers, it remains immune to constant offset at init time. Geometric statistics measuring cross-data behaviour can survive residual connections but not cross-depth behaviours. 

Even the layer coefficient results are tepid as they lag behind grokking phase for our task. Obviously, this is just one task on a very small model, future work should explore expanding this scope to more architectures, bigger model sizes, and run more ablation studies. 

# Conclusion

We started out wondering if the feature geometry evolution dynamics transfer to transformers as cleanly as they exhibit in simple MLPs as demonstrated by our motivating paper. The final results are a mix of some positives and some negatives with our main motivation of developing feature geometry based training heuristics renders null as we find that there is a lag in geometry evolution and generalization, conditional on the one task we study in this post.

Moreover, the original framing of an across-depth metric does not make sense for an architecture with skip connections and an additive residual stream. This should motivate more work towards developing alternative metrics to study the feature geometry evolution dynamics in transformers and other sister architectures. 

# AI usage disclosure

This post is entirely written by me. All experiments were designed, implemented and ran by Claude Code. The figures were generated by Claude. All experiments ran under my oversight.  

# References

1. Hehl, Moritz, Max von Renesse, and Melanie Weber. "Neural feature geometry evolves as discrete Ricci flow." arXiv preprint arXiv:2509.22362 (2025).
2. Nanda, Neel, et al. "Progress measures for grokking via mechanistic interpretability." arXiv preprint arXiv:2301.05217 (2023).
3. Gabriel Khan, "AN Illustrated Introduction to the Ricci Flow, Third Version" https://differentialgeometri.wordpress.com/2022/01/13/an-illustrated-introduction-to-the-ricci-flow-third-version/

[0]: https://differentialgeometri.wordpress.com/2022/01/13/an-illustrated-introduction-to-the-ricci-flow-third-version/
[1]: https://www.neelnanda.io/grokking-paper