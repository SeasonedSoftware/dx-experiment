# Notes on architecture decisions

## Current framework design

The project is split into 3 main pieces, reflected by the root directory structure.
These parts are defined by where the code is executed and, therefore, where the state is managed in the client-server model.

* ui - code that runs in the browser. This is where all the user interface is defined, mostly accidental complexity on how to draw screens and interact through the browser.
* domain-logic - code that is shared between client and server. These are the domain actions (or events depending on terminology) that will always run on the server but have proxy functions to be called in the browser. This is where most of our essential complexity lives.
* jobs - code that runs only on server, either on a clock or upon receiving asynchronous messages.

Besides the section *Definitions* from the [README](../README.md) the framework is agnostic in relation to how the application and its database are modelled. The developer should be able to chose something closer to an event sourced application with immutable data or something more along the lines of mutable entities.

Our main goal is to remove the friction of having to think in terms of HTTP (which is an implementation detail in most systems) or any other protocol and allow the developer to focus on writing the domain logic, which is usually the main concern of the software development process.

Another project goal is to keep interfaces easy to design and enforced on the type level. This should help the developer to code against well defined interfaces reducing bugs and cognitive burden.

### Guiding Principles

* The [zen of python](https://www.python.org/dev/peps/pep-0020/) is awesome, start there.
* We care about modelling concepts from the real world, everything else is accidental complexity.
* Chose vertical over horizontal scaling as much as possible.
* The best code is the one you don't need to write.
* But if it's written somewhere, it's usually better inside your repository.
* The second best code is the one it's used only for type-checking.
* The best way to prepare software for the future is coding for the present.
* The documentation is the part of your system that runs in your fellow humans' mushy computers.
* If you can code something that will make the documentation shorter, it's usually a good idea.
* Running software is a living organism, code is its fossil, we should focus on the first.

In case you are curious about the process of how we got here check the [paths not taken](./paths-not-taken.md) document.
