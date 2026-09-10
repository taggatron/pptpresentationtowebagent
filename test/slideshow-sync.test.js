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
    const postedFrameMessages = [];
    return {
      id,
      contentWindow: {
        postMessage(msg) {
          postedFrameMessages.push(msg);
        }
      },
      postedFrameMessages,
      getAttribute(attr) {
        return this[attr] || "";
      },
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
      setAttribute(k, v) { this[k] = v; },
      removeAttribute(k) { delete this[k]; },
      appendChild() {},
      addEventListener() {},
      removeEventListener() {},
      pause() { this.paused = true; },
      play() { this.paused = false; return Promise.resolve(); },
      paused: true,
      currentTime: 0,
      duration: 60,
      src: "",
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

test("MacBook controller window starts, stops, and replays video on extended display via VIDEO_CONTROL", async () => {
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
    `${source}\n;globalThis.__videoControllerHooks = {
      playSlideVideo,
      pauseSlideVideo,
      toggleSlideVideoPlayback,
      replaySlideVideo,
      formatVideoTime,
      updateVideoPlaybackStateUI,
      handleSlideshowSyncMessage,
      initSlideshowSync,
      getBroadcastMessages: () => env.broadcastMessages,
      setDeck: (deck) => { currentDeck = deck; },
      setSlide: (idx) => { currentSlideIndex = idx; },
      setBuildStep: (step) => { currentMediaBuildStep = step; },
      getVideoElement: () => slideVideo,
      getVideoPlayPauseBtn: () => videoPlayPauseBtn,
      getVideoPlayPauseText: () => videoPlayPauseText,
      getStageVideoToggleBtn: () => stageVideoToggleBtn
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__videoControllerHooks;
  hooks.initSlideshowSync();

  const videoDeck = {
    id: "deck_with_video",
    slides: [
      {
        number: 1,
        title: "Slide 1 Video",
        progressiveBuilds: [
          { version: 1, kind: "video", videoUrl: "/videos/intro.mp4", startTime: 0, endTime: 20 }
        ]
      }
    ]
  };
  hooks.setDeck(videoDeck);
  hooks.setSlide(0);
  hooks.setBuildStep(1);

  const mockVideo = hooks.getVideoElement();
  mockVideo.src = "/videos/intro.mp4";
  mockVideo.currentTime = 5.2;

  // 1. Controller plays video -> sends VIDEO_CONTROL action: "play"
  await hooks.playSlideVideo({ broadcast: true });
  const playMsg = env.broadcastMessages.find((m) => m.type === "VIDEO_CONTROL" && m.action === "play");
  assert.ok(playMsg, "Controller must broadcast VIDEO_CONTROL with action 'play'");
  assert.equal(playMsg.slideIndex, 0);
  assert.equal(playMsg.mediaBuildStep, 1);

  // 2. Controller pauses video -> sends VIDEO_CONTROL action: "pause"
  hooks.pauseSlideVideo({ broadcast: true });
  const pauseMsg = env.broadcastMessages.find((m) => m.type === "VIDEO_CONTROL" && m.action === "pause");
  assert.ok(pauseMsg, "Controller must broadcast VIDEO_CONTROL with action 'pause'");

  // 3. Controller replays video -> sends VIDEO_CONTROL action: "replay"
  hooks.replaySlideVideo({ broadcast: true });
  const replayMsg = env.broadcastMessages.find((m) => m.type === "VIDEO_CONTROL" && m.action === "replay");
  assert.ok(replayMsg, "Controller must broadcast VIDEO_CONTROL with action 'replay'");

  // 4. Controller receives VIDEO_STATE from presentation window -> UI updates
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "VIDEO_STATE",
      senderId: "ext_presentation_win",
      isPlaying: true,
      currentTime: 12.5,
      duration: 45
    }
  });
  const playPauseBtn = hooks.getVideoPlayPauseBtn();
  const playPauseText = hooks.getVideoPlayPauseText();
  assert.ok(playPauseBtn.classList.contains("is-playing"), "Button should reflect playing state");
  assert.equal(playPauseText.textContent, "Stop video", "Button text should say Stop video when playing");

  hooks.handleSlideshowSyncMessage({
    data: {
      type: "VIDEO_STATE",
      senderId: "ext_presentation_win",
      isPlaying: false,
      currentTime: 12.5,
      duration: 45
    }
  });
  assert.equal(playPauseBtn.classList.contains("is-playing"), false, "Button should reflect paused state");
  assert.equal(playPauseText.textContent, "Start video", "Button text should say Start video when stopped");
});

test("Presentation window on extended screen receives VIDEO_CONTROL and executes play, pause, and replay", async () => {
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
    `${source}\n;globalThis.__presentationVideoHooks = {
      handleSlideshowSyncMessage,
      handleVideoControlSyncMessage,
      broadcastVideoStateFromPresentation,
      initSlideshowSync,
      getBroadcastMessages: () => env.broadcastMessages,
      setDeck: (deck) => { currentDeck = deck; },
      setSlide: (idx) => { currentSlideIndex = idx; },
      setBuildStep: (step) => { currentMediaBuildStep = step; },
      getVideoElement: () => slideVideo
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__presentationVideoHooks;
  hooks.initSlideshowSync();

  const sampleDeck = {
    id: "deck_with_video",
    slides: [
      {
        number: 1,
        title: "Slide 1 Video",
        progressiveBuilds: [
          { version: 1, kind: "video", videoUrl: "/videos/lesson.mp4", startTime: 0, endTime: 30 }
        ]
      }
    ]
  };
  hooks.setDeck(sampleDeck);
  hooks.setSlide(0);
  hooks.setBuildStep(1);

  const videoEl = hooks.getVideoElement();
  videoEl.classList.remove("hidden");
  videoEl.paused = true;

  // 1. Receive VIDEO_CONTROL with action: "play"
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "VIDEO_CONTROL",
      senderId: "macbook_controller",
      action: "play",
      currentTime: 8.4,
      slideIndex: 0,
      mediaBuildStep: 1
    }
  });
  assert.equal(videoEl.paused, false, "Extended screen video must start playing on receipt of play command");

  // 2. Receive VIDEO_CONTROL with action: "pause"
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "VIDEO_CONTROL",
      senderId: "macbook_controller",
      action: "pause",
      currentTime: 10.1,
      slideIndex: 0,
      mediaBuildStep: 1
    }
  });
  assert.equal(videoEl.paused, true, "Extended screen video must pause on receipt of pause command");

  // 3. Receive VIDEO_CONTROL with action: "replay"
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "VIDEO_CONTROL",
      senderId: "macbook_controller",
      action: "replay",
      currentTime: 0,
      slideIndex: 0,
      mediaBuildStep: 1
    }
  });
  assert.equal(videoEl.paused, false, "Extended screen video must replay and start playing on receipt of replay command");
});

test("MacBook controller window broadcasts INTERACTIVE_SYNC on interactive state updates and bundles state in SYNC_STATE", async () => {
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
    `${source}\n;globalThis.__interactiveHooks = {
      handleInteractiveSyncMessage,
      broadcastSlideshowSync,
      initSlideshowSync,
      setDeck: (d) => { currentDeck = d; },
      setSlide: (idx) => { currentSlideIndex = idx; },
      getActiveInteractiveState: () => activeInteractiveStateByUrl
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__interactiveHooks;
  hooks.initSlideshowSync();

  const deckWithEmbed = {
    id: "deck_with_embed",
    slides: [
      {
        number: 1,
        title: "Challenge",
        interactiveType: "web_embed",
        webEmbed: {
          url: "/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html",
          title: "Abiotic Biotic Challenge"
        }
      }
    ]
  };
  hooks.setDeck(deckWithEmbed);
  hooks.setSlide(0);

  // 1. Simulate an update coming from the iframe to the controller
  hooks.handleInteractiveSyncMessage({
    type: "INTERACTIVE_STATE_UPDATE",
    interactiveId: "abiotic_biotic_challenge",
    interactiveUrl: "/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html",
    action: "move_factor",
    state: {
      placements: { factor_1: "abiotic" },
      checked: false
    }
  });

  // Verify controller cached the state
  const cachedState = hooks.getActiveInteractiveState()["/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html"];
  assert.deepEqual(cachedState.placements, { factor_1: "abiotic" });

  // Verify INTERACTIVE_SYNC message was broadcast to other windows
  const syncMsg = env.broadcastMessages.find((m) => m.type === "INTERACTIVE_SYNC");
  assert.ok(syncMsg, "Controller must broadcast INTERACTIVE_SYNC to secondary display");
  assert.equal(syncMsg.interactiveId, "abiotic_biotic_challenge");
  assert.deepEqual(syncMsg.state.placements, { factor_1: "abiotic" });

  // 2. Verify state is bundled into SYNC_STATE broadcast
  env.broadcastMessages.length = 0;
  hooks.broadcastSlideshowSync("SYNC_STATE");
  const fullSyncMsg = env.broadcastMessages.find((m) => m.type === "SYNC_STATE");
  assert.ok(fullSyncMsg, "Controller must broadcast SYNC_STATE");
  assert.equal(fullSyncMsg.interactiveUrl, "/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html");
  assert.deepEqual(fullSyncMsg.interactiveState.placements, { factor_1: "abiotic" });
});

test("Presentation window on extended screen receives INTERACTIVE_SYNC and forwards state to webEmbedFrame", async () => {
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
    `${source}\n;globalThis.__presentationInteractiveHooks = {
      handleSlideshowSyncMessage,
      initSlideshowSync,
      setDeck: (d) => { currentDeck = d; },
      setSlide: (idx) => { currentSlideIndex = idx; },
      getFrame: () => webEmbedFrame,
      getActiveInteractiveState: () => activeInteractiveStateByUrl
    };`,
    context,
    { filename: APP_PATH }
  );

  const hooks = context.__presentationInteractiveHooks;
  hooks.initSlideshowSync();

  const deckWithEmbed = {
    id: "deck_with_embed",
    slides: [
      {
        number: 1,
        title: "Challenge",
        interactiveType: "web_embed",
        webEmbed: {
          url: "/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html",
          title: "Abiotic Biotic Challenge"
        }
      }
    ]
  };
  hooks.setDeck(deckWithEmbed);
  hooks.setSlide(0);

  const frame = hooks.getFrame();

  // 1. Send INTERACTIVE_SYNC message to presentation window
  hooks.handleSlideshowSyncMessage({
    data: {
      type: "INTERACTIVE_SYNC",
      senderId: "macbook_controller",
      interactiveId: "abiotic_biotic_challenge",
      interactiveUrl: "/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html",
      action: "move_factor",
      state: {
        placements: { factor_1: "abiotic", factor_2: "biotic" },
        checked: true
      }
    }
  });

  // Verify presentation window cached the state
  const cachedState = hooks.getActiveInteractiveState()["/decks/Classic_Lesson_01_Ecosystems/interactives/abiotic_biotic_challenge.html"];
  assert.ok(cachedState, "Presentation window must cache interactive state");
  assert.equal(cachedState.checked, true);
  assert.deepEqual(cachedState.placements, { factor_1: "abiotic", factor_2: "biotic" });

  // Verify postMessage was forwarded into the iframe's contentWindow
  const forwardedMsg = frame.postedFrameMessages.find((m) => m.type === "APPLY_INTERACTIVE_STATE");
  assert.ok(forwardedMsg, "Presentation window must forward APPLY_INTERACTIVE_STATE into webEmbedFrame.contentWindow");
  assert.deepEqual(forwardedMsg.state.placements, { factor_1: "abiotic", factor_2: "biotic" });
});


