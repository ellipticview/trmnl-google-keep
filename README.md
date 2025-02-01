# Google Keep on TRML
## Introduction
I wanted to display my Google Keep todo list on my TRMNL device. Rather than implementing a pull mechanism, this project uses Tampermonkey to add a PUSH button on any list.

Why do I prefer a push?
- I have a todo list for each project I am working on. I want to be able to swtich projects. This means that the point of control (to select a project) is actually the Google Keep page. So it makes sense to have the button there.
- There is no public API for Google Keep, and even if there was: how would I switch between projects?

## The result
The image below shows the todo list with the TRMNL button added:

![House chores](images/list-0.png)

## Creating the script
I am documenting the steps here because the ID's that we're using might change. I am using the Firefox browser.

Go to [Google Keep](https://keep.google.com/#home) and create a new list.

![Create list image](images/create-list.png)

Populate the list. Now click the list to enter the Edit dialog:

![House chores](images/list-1.png)

Click on the hamburger menu in Firefox (on the right) > More Tools > Web Developer Tools.
Click on the Element Picker:

![element picker](images/element-picker.png).

Hover over the **pin** in the top-right of the window to find the relevant HTML for the pin. It should look like this:

```
<div role="button"
class="Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe"
tabindex="0"
style="user-select: none;"
data-tooltip-text="Pin note"
aria-label="Pin note" aria-pressed="false">
</div>
```
On a longer list with a scroll bar it looks like this:

```
<div role="button"
class="Q0hgme-LgbsSe Q0hgme-Bz112c-LgbsSe IZ65Hb-nQ1Faf VIpgJd-LgbsSe K4efff"
tabindex="0" style="user-select: none;" data-tooltip-text="Unpin note" aria-label="Unpin note" aria-pressed="true"></div>
```
So we can conclude that the class name can vary, but starts with the same string.

Find the div a few levels up that surrounds the modal edit window. It will look like this:

```
<div class="VIpgJd-TUo6Hb XKSfm-L9AdLc eo9XGd"
tabindex="0" 
style="left: 549.5px; top: 145.75px;">
```


