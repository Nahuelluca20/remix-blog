---
title: Simple blog with remix
tags: ["remix"]
date: "12/12/23"
---

# Building a BLOG with remix

> Remix is a full stack framework based in react

```js
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```
