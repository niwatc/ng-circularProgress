Angular Circular Progress indicator
=================
A double circular progress indicator using Angular JS.

![alt tag](https://raw.githubusercontent.com/niwatc/ng-circularProgress/master/example.png)

Description
========
A simple AngularJS directive, for showing a circular progress indicator ("donut progress" widget).
This version contains two nested circular progress indicators. You can create more for inner circles by editing the directive.

## Requirements
- AngularJS 1.3+
- D3.js


## How to use it
Insert the directive mark-up in a view:

```html
<circular-progress class="cp-widget"
    data-innercurrent="1123"
    data-innertotal="2235"
    data-outercurrent="700"
    data-outertotal="1000">
</circular-progress>
```

See index.html for an example.
