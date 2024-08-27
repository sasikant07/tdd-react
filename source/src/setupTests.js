import "@testing-library/jest-dom";
import { server } from "./mocks/server";
import { TextEncoder } from 'node:util'
const { JSDOM } = require("jsdom");

global.TextEncoder = TextEncoder  

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
