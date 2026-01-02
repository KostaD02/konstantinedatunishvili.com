---
layout: "article.njk"
title: Animate elements when they enter view
description: How to use the new CSS animation-timeline view() function.
image: "/assets/images/css-animation-timeline.png"
imageAlt: CSS animation timeline view illustration
date: 2026-01-02
chips: ["CSS", "Animations", "Web"]
tags:
  - post
  - tech
---

Scroll based animations have traditionally required [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),
[observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) or third-party libraries ([AOS](https://github.com/michalsnik/aos) was my favorite one).
With modern CSS, that's finally changing.

The new [`animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) property,
combined with [`view()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view) function, allows you to trigger animations
**based on an elements visibility in the viewport**, using **pure CSS**.

In this article, you'll learn what `animation-timeline: view()` is, how it works and how to use it safely in real projects.

> **TL;DR**: `animation-timeline: view()` lets CSS animations respond to scroll position and element visibility, no JavaScript,
> no [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), no pain. **Keep in mind** it's not fully supported in every browser. Only [Firefox](https://firefox.com) is missing this feature (User must explicitly set preference to true).
> See full [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view#browser_compatibility) before using it.

## What is animation-timeline?

Traditionally, CSS animations are time based.
They start when the element is rendered and run for a fixed duration (or infinitely).

`animation-timeline` changes that concept entirely.

Instead of time, animation can now be driven by **scroll progress** or **view progress**.
One of the most useful timelines is `view()`.

```css
.my-fancy-element {
  animation-timeline: view();
}
```

This means the animation progresses as the element moves through the viewport.

## What does view() do?

The `view()` function creates a timeline based on when an element enters and exits the viewport.

By default:

- Animation **starts** when the element **enters** the viewport.
- Animation **ends** when the element **leaves** the viewport.

You can think of it like this:

```
element enters viewport  → animation: 0%
element fully visible    → animation: 50%
element leaves viewport  → animation: 100%
```

This makes perfect animations for:

- Scroll based animations.
- Fade in effects.
- Slide-in animations.
- Selection reveals.

## Example

Lets create simple scroll driven animation:

```html
<main>
  <div class="spacer">
    <h1>Scroll down</h1>
  </div>
  <div class="fancy-element"></div>
  <div class="fancy-element"></div>
  <div class="fancy-element"></div>
  <div class="spacer"></div>
</main>
```

```css
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40vh;
  background-color: #0a192f;
  color: #ccd6f6;
}

div.spacer {
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.fancy-element {
  width: 100%;
  max-width: 300px;
  height: 500px;
  background: #64ffda;
  border-radius: 8px;
  margin: 0 auto;
  opacity: 0;
  animation: reveal 1s linear forwards;
  animation-timeline: view();
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

When `div.fancy-element` enter in the viewport, the animation starts progressing. As you as scroll animation advances.

## Controlling when the animation starts and ends

By default, `view()` uses the full visibility range, but you can adjust it using [`animation-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range).

Let's modify animation example a little bit:

```css
div.fancy-element {
  animation: reveal 1s linear forwards;
  animation-timeline: view();
  animation-range: entry 10% cover 40%;
}
```

This means:

- **Animation starts** when **10%** of the element has entered the **viewport**.
- **Animation finishes** when the element has traveled **40%** of its total "journey" across the screen.

This gives you precise control without turning your CSS into a math problem.

### entry, exit, and cover keywords

`animation-range` supports semantic keywords:

- `entry` - when the element enters the viewport.
- `exit` - when it leaves.
- `cover` - when it fully covers the viewport.
- `contain` - when fully inside the viewport.

Another example:

```css
div.fancy-element {
  animation: reveal 1s linear forwards;
  animation-timeline: view();
  animation-range: entry 10% exit 40%;
}
```

## Browser support

`animation-timeline` and `view()` are modern CSS features.
Support is improving, but not universal.

As of now:

- Chromium-based browsers: supported
- Safari: partial / evolving
- Firefox: behind a flag or not yet fully supported

## Safe fallback strategy

The easiest approach is progressive enhancement.

```css
div.fancy-element {
  opacity: 1;
  transform: none;
}

@supports (animation-timeline: view()) {
  div.fancy-element {
    opacity: 0;
    animation: reveal 1s linear forwards;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
}
```

Old browsers see content normally.
Modern browsers get the fancy stuff.

## Summary

In this guide, we covered what is `animation-timeline` and how to use it.

You can check simple example hosted [here](https://kostad02.github.io/blog-examples/animate-elements-when-they-enter-view/simple/)
and a slightly fancier one [here](https://kostad02.github.io/blog-examples/animate-elements-when-they-enter-view/)!

Have fun!
