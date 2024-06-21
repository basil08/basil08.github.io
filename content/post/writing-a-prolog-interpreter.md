---
title: "In Praise of Logic Programming: Writing a Prolog Interpreter"
tags:
categories: 
draft: true
date: 2024-04-30T02:57:22+05:30
---

Comic ideas

Unification 

Difference between declarative and imperative programmers and what it led to? In a humorous way, ofc.

Something on lambda calculus


Insert XKCD comic?

(https://xkcd.com/1090/)

Personal musings mixed with technical commentary on understanding (read: drooling over) logic programming. 
Expect to be heavy on technical stuff so don't get put out if you don't get something. I am increasingly convinced that logic programming is a beautiful perspective to think about computation and I'll try to make it as intuitive as possible for you to appreciate it. 

Reading up

Failing to write the unifier as part of a previous assignment (and taking the penalty for the same)

A second attempt at writing the unifier - stack-based unifier from the art of prolog - success!

Discovering the beauty of logic programming

Day 0

Writing the lexer and parser 

Planning out



How do I define the interface to the interpreter? TAOP helps a bit but not much.
In case of multiple outputs, does the interpreter try to solve the goal again? 
For instance,

append([], R, R).
append([X|Xs], R, [X|Zs]) :- append(Xs, R, Zs).

Now, let g = append(X, Y, [1,2,3,4]).

What will be the outputs of X, Y? 

How do I systematically output all combinations of X's and Y's? or rather, more precisely, how do I systematically cycle through all combinations of possible solutions in the search tree? 


## Day 1, 2, 3, 4 - nothing 💀 coz exams.

## Day 5

## Looking ahead

When I ask myself this question, what more? I was forced to think about the deeper truth about why programming language engineers write programming language compilers/interpreters - and the answer, which is not that difficult to get, is to make money. And so, the natural question is - what more does it take to realise my interpreter as an industry-grade replacement to the standard Prolog interpreter, a descendant of Prolog-10, crafted by the very hands of the demigod Colmeraur himself?<sup>1</sup>

As it turned out, many things. 

Efficiency? 

Features? 

Insert comic? 

1: I mean, come on, surely I have done a better job than him. My interpreter features the most novel of ideas, boasts of absolutely zero bugs, and was made in the record time of a week, under the ticking clock of an introductory undergrad course assignment.