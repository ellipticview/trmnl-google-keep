# Google Keep on TRML
## Introduction
I wanted to display my Google Keep todo list on my TRMNL device. Rather than implementing a pull mechanism, this project uses Tamperonkey to add a PUSH button on any list.

Why do I prefer a push?
- I have a todo list for each project I am working on. I want to be able to swtich projects. This means that the point of control (to select a project) is actually the Google Keep page. So it makes sense to have the button there.
- There is no public API for Google Keep, and even if there was: how would I switch between projects?

## The result
The image below shows the result of the list

## Creating the script
I am documenting the steps here because the ID's that we're using might change. I an using the Firefox browser.

Go to [Google Keep](https://keep.google.com/#home) and create a new list.
![Create list image](images/create-list.png)

