import { makeDomain, success } from "../prelude";

const m = makeDomain("messages");

m.addQuery("http", "hello")()(() => success({ message: "Hello World" }));

const messages = m.actions();

export { messages };
