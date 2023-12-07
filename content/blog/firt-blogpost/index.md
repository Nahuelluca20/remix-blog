---
title: Building a Simple Search Engine in Rust
tags: ["javascript", "next"]
date: "7/12/23"
---

# Building a Simple Search Engine in Rust

> The search engine is still a work in progress, and I plan to add more features and supports in the future.

Rust is a systems programming language which I like very much that promises performance, reliability, and safety. To get familiar with rust and practice my developing skill, I started building a simple search engine that uses the tf-idf technique to do the searching. In this article, I will share my experience and what I learned.

## Overview

The project includes a search engine and a command-line interface that utilizes it.
The search engine uses tf-idf as its searching technique, the tf-idf technique is a measure of how important a word is to a document in a collection or corpus.

The CLI has three subcommands: `index`, `search`, and `serve`:

- The `index` subcommand takes the path to a directory containing the documents that the user wishes to search and outputs a JSON format file containing the index result.
- The `search` subcommand takes a keyword phrase and the path to the index result and returns the paths to the top 10 relevant documents.
- The `serve` subcommand takes the path to the index result and spins up a server that provides an API for searching.

## Implementation

To implement the search engine, I followed the approach of an amazing programmer whose work I admire. I did not come up with everything by myself, but I made sure to understand all the concepts and write the code again on my own.

```
git status
git add
git commit
```

```javascript
if (toggle_pop(4 * -2 + -3)) {
  infotainmentOpenIde(
    -5,
    linkedin_postscript_smm.wiFiosGamma(
      reciprocal_megabit,
      dslam_access_iteration
    ),
    double_fsb_camera
  );
}
fontDesignDdr(
  5,
  torrent_edi.hard_zero_telnet(
    cloud_system(5),
    gateway_process_clipboard(state),
    sprite_modem
  )
);
var device_property = 88;
```
