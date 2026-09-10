import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(TEST_DIR, "..");
const APP_PATH = path.join(ROOT_DIR, "public", "js", "app.js");

function createMockEnvironment({ isPresentation = false } = {}) {
  const broadcastMessages = [];
  const postMessages = [];
  const storageItems = new Map();
  const eventListeners = {};

  class MockBroadcastChannel {
    constructor(name) {
      this.name = name;
      this.onmessage = null;
    }
    postMessage(data) {
      broadcastMessages.push(data);
    }
    close() {}
  }

  function createMockElement(id = "") {
    return {
      id,
      classList: {
        classes: new Set(["hidden"]),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this.classes.has(c)) this.classes.delete(c);
            else this.classes.add(c);
          } else if (force) this.classes.add(c);
          else this.classes.delete(c);
          return this.classes.has(c);
        },
        contains(c) { return this.classes.has(c); }
      },
      setAttribute() {},
      removeAttribute() {},
      appendChild() {},
      addEventListener() {},
      removeEventListener() {},
      pause() {},
      play() { return Promise.resolve(); },
      innerHTML: "",
      textContent: "",
      style: {},
      disabled: false,
      value: "",
      scrollLeft: 0,
      scrollTop: 0,
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const documentMock = {
    readyState: "complete",
    documentElement: createMockElement("documentElement"),
    body: {
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this.classes.has(c)) this.classes.delete(c);
            else this.classes.add(c);
          } else if (force) this.classes.add(c);
          else this.classes.delete(c);
          return this.classes.has(c);
        },
        contains(c) { return this.classes.has(c); }
      }
    },
    addEventListener(name, fn) {
      if (!eventListeners[name]) eventListeners[name] = [];
      eventListeners[name].push(fn);
    },
    getElementById(id) {
      return createMockElement(id);
    },
    querySelector() { return createMockElement(); },
    querySelectorAll() { return []; },
    createElement(tag) {
      return createMockElement(tag);
    }
  };

  const windowMock = {
    location: {
      origin: "http://localhost:3000",
      pathname: "/",
      search: isPresentation ? "?presentation=1" : ""
    },
    BroadcastChannel: MockBroadcastChannel,
    localStorage: {
      getItem(key) { return storageItems.get(key) || null; },
      setItem(key, val) { storageItems.set(key, String(val)); },
      removeItem(key) { storageItems.delete(key); }
    },
    addEventListener(name, fn) {
      if (!eventListeners[name]) eventListeners[name] = [];
      eventListeners[name].push(fn);
    },
    postMessage(data) {
      postMessages.push(data);
    },
    screen: {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1080,
      isExtended: true
    }
  };

  return {
    windowMock,
    documentMock,
    broadcastMessages,
    postMessages,
    storageItems,
    eventListeners,
    MockBroadcastChannel
  };
}

test("MacBook controller window broadcasts SLIDE_CHANGE, BUILD_STEP, and ANSWERS_UPDATE", async () => {
  const source = await fs.readFile(APP_PATH, "utf-8");
  const env = createMockEnvironment({ isPresentation: false });

  const context = vm.createContext({
    console,
    window: env.windowMock,
    document: env.documentMock,
    BroadcastChannel: env.MockBroadcastChannel,
    localStorage: env.windowMock.localStorage,
    URLSearchParams: globalThis.URLSearchParams,
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__syncHooks = {
      broadcastSlideshowSync,
      broadcastSlideshowMessage,
      initSlideshowSync,
      getBroadcastMessages: () => env.broadcastMessages,
      setDeck: (deck) => { currentDeck = deck; },
      setSlide: (idx) => { currentSlideIndex = idx; },
      setBuildStep: (step) => { currentMediaBuildStep = step; },
      isPresentation: () => isPresentationWindow,
      getClientId: () => windowClientId
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__syncHooks;
  assert.equal(hooks.isPresentation(), false, "MacBook window should not be presentation window");
  assert.ok(hooks.getClientId().startsWith("win_"), "windowClientId should be generated");

  hooks.initSlideshowSync();

  const testDeck = {
    id: "test_deck",
    slides: [
      { number: 1, title: "Slide 1" },
      { number: 2, title: "Slide 2" },
      { number: 3, title: "Slide 3", hidden: true },
      { number: 4, title: "Slide 4" }
    ]
  };
  hooks.setDeck(testDeck);
  hooks.setSlide(1);
  hooks.setBuildStep(2);

  hooks.broadcastSlideshowSync("SLIDE_CHANGE");
  assert.equal(env.broadcastMessages.length, 1);
  const slideChangeMsg = env.broadcastMessages[0];
  assert.equal(slideChangeMsg.type, "SLIDE_CHANGE");
  assert.equal(slideChangeMsg.deckId, "test_deck");
  assert.equal(slideChangeMsg.slideIndex, 1);
  assert.equal(slideChangeMsg.mediaBuildStep, 2);

  hooks.broadcastSlideshowSync("BUILD_STEP");
  assert.equal(env.broadcastMessages.length, 2);
  assert.equal(env.broadcastMessages[1].type, "BUILD_STEP");

  hooks.broadcastSlideshowSync("ANSWERS_UPDATE");
  assert.equal(env.broadcastMessages.length, 3);
  assert.equal(env.broadcastMessages[2].type, "ANSWERS_UPDATE");
});

test("Presentation window forces student mode, requests state, and guards hidden slides", async () => {
  const source = await fs.readFile(APP_PATH, "utf-8");
  const env = createMockEnvironment({ isPresentation: true });

  const context = vm.createContext({
    console,
    window: env.windowMock,
    document: env.documentMock,
    BroadcastChannel: env.MockBroadcastChannel,
    localStorage: env.windowMock.localStorage,
    URLSearchParams: globalThis.URLSearchParams,
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__presentationHooks = {
      handleSlideshowSyncMessage,
      initSlideshowSync,
      getBroadcastMessages: () => env.broadcastMessages,
      setDeck: (deck) => { currentDeck = deck; },
      getCurrentSlide: () => currentSlideIndex,
      isPresenterMode: () => presenterMode,
      isPresentation: () => isPresentationWindow
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__presentationHooks;
  assert.equal(hooks.isPresentation(), true, "Should identify as presentation window");

  hooks.initSlideshowSync();
  assert.equal(hooks.isPresenterMode(), false, "Presentation window must enforce student mode (presenterMode = false)");

  // Should have sent REQUEST_STATE on init
  const reqMsg = env.broadcastMessages.find((m) => m.type === "REQUEST_STATE");
  assert.ok(reqMsg, "Presentation window must request state on startup");

  const sampleDeck = {
    id: "biology_deck",
    slides: [
      { number: 1, title: "Slide 1" },
      { number: 2, title: "Slide 2" },
      { number: 3, title: "Slide 3 Handout", hidden: true },
      { number: 4, title: "Slide 4" }
    ]
  };
  hooks.setDeck(sampleDeck);

  // Test receiving SLIDE_CHANGE to slide index 1 (visible)
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "SLIDE_CHANGE",
      senderId: "other_macbook_win",
      slideIndex: 1,
      mediaBuildStep: 1
    }
  });
  assert.equal(hooks.getCurrentSlide(), 1, "Should sync to visible slide index 1");

  // Test receiving SLIDE_CHANGE to slide index 2 (HIDDEN SLIDE 3)
  // Presentation window must guard audience and fall back to visible slide 1
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "SLIDE_CHANGE",
      senderId: "other_macbook_win",
      slideIndex: 2,
      mediaBuildStep: 1
    }
  });
  assert.equal(hooks.getCurrentSlide(), 1, "Presentation window must never show hidden slide; must remain on nearest visible slide");
});
