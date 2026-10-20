/* ============================================================================
   PARI'S BIRTHDAY TREASURE — flipbook behaviour.
   Diagnostic first: surface any REAL JavaScript error on screen (a silent error
   would stop the click handlers from ever attaching). Image / video / network
   load failures are ignored — they have no .message and are handled per-element.
   ============================================================================ */
window.addEventListener("error", function (ev) {
  if (!ev || !ev.message) return;                 // ignore resource-load errors
  var b = document.getElementById("__jsErr");
  if (!b) {
    b = document.createElement("div");
    b.id = "__jsErr";
    b.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:100000;" +
      "background:#b00020;color:#fff;font:13px/1.5 monospace;padding:10px;white-space:pre-wrap";
    (document.body || document.documentElement).appendChild(b);
  }
  b.textContent = "⚠ JavaScript error (this is likely why the book won't open):\n" +
    ev.message + "\n" + (ev.filename || "") + " : line " + ev.lineno;
});

// If you can read this line in the console, the script parsed with NO syntax
// error and you are running the CURRENT file (not a cached copy).
console.log("%c✅ [Pari's Birthday Treasure] loaded — 3D flipbook · 14 full-bleed pages · clean pages.",
            "font-weight:bold;color:#7d5fd0;font-size:13px");

/* ============================================================================
   ██  EDIT YOUR CONTENT HERE  ██
   ----------------------------------------------------------------------------
   Every entry below is ONE page of the book, shown in order after the cover.

     • type   : "video"  → a full-page video (e.g. assets/1.webm)
                "image"  → a full-page picture (e.g. assets/3.webp)
                "lbd"    → an interactive activity, shown in the overlay iframe
     • src    : the media file for that page.
     • delay  : (video only, optional) milliseconds to wait after landing on the
                page before the video starts (e.g. delay: 3000 → starts after 3s).
                Omit / 0 → the video starts instantly.

   Add / remove / reorder pages freely — the flip engine, the printed page
   numbers and the preloader's asset list all follow this array.
   ============================================================================ */
// PARI'S BIRTHDAY TREASURE — 14 video pages. Each one has a matching first-frame
// poster in assets/posters/ so the scene shows INSTANTLY (no dark page while the
// clip buffers). Add / remove / reorder freely — the flip engine and the printed
// page numbers update automatically.
//
// MEDIA FORMATS — one encoding per type, chosen for size at equal quality:
//   video   WebM, VP9 + Opus, yuv420p   (assets/*.webm)
//   audio   Ogg/Opus, 45–86 kbps        (sfx/*.ogg, assets/vo/*.ogg)
//   images  WebP, lossy q82–q90         (assets/**/*.webp)
//
// BROWSER SUPPORT
//   WebM/VP9 + Opus-in-WebM : Chrome, Edge, Firefox, Safari 14.1+
//                             (macOS Big Sur / iOS 14.5 onward).
//   WebP                    : Chrome, Edge, Firefox, Safari 14+.
//   Ogg/Opus                : Chrome, Edge, Firefox, Safari 17.4+ / iOS 17.4+.
//
// The Ogg line is the one with a real gap, and it is wider than it looks. Safari
// BEFORE 17.4 cannot play Ogg — and it cannot decode the Opus bytes inlined in
// sfx-data.js either, because Web Audio's decodeAudioData leans on the same
// platform codecs. (An earlier version of this comment claimed the inlined path
// sidestepped container support; it does not, and on those builds the book was
// silent on BOTH paths.) That is why sfx/ ships .mp3 siblings and _oggToMp3()
// swaps the extension after a one-time probe — see the SOUND section. Modern
// browsers never request an mp3.
//
// Video has no such fallback and needs none: VP9 support (14.1) predates the
// oldest Safari that can run the rest of this book.
const pages = [
  { type: "video", src: "assets/1.webm"  },   // 1 — opening scene
  { type: "video", src: "assets/2.webm"  },   // 2
  { type: "video", src: "assets/3.webm"  },   // 3
  { type: "video", src: "assets/4.webm"  },   // 4
  { type: "video", src: "assets/5.webm"  },   // 5
  // 6–13 — INTERACTIVE: the note block, PAIRED. Every note is worked twice in a
  // row — first the magnifier hunt, then the colour question — so the child looks
  // hard at one note and is asked about it while it is still fresh, instead of
  // meeting all six notes and only then being quizzed on the first.
  //   find → colour, find → colour, … for ₹10, ₹20, ₹50 and ₹100 here.
  // The ₹200 and ₹500 pairs are NOT here: they wait for their own story beats
  // further down (see pages 15–20), because that is where the notes appear.
  //
  // type:"lbd" hands this leaf over to the body-level iframe overlay (see the
  // LBD OVERLAY section below + #lbdStage in index.html). The leaf itself carries
  // only the poster, which is what you see while the page is turning. Each
  // find-the-* file is a generated sibling of find-the-10-features.html: same
  // code, its own artwork, aspect ratio and measured FEATURE_ZONES. All of these
  // activities share one background, so they share one leaf poster.
  { type: "lbd", src: "activities/find-the-10-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹10 features" },   // shown in the page picker
  { type: "lbd", src: "activities/what-colour-is-the-10.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹10 note?" },
  { type: "lbd", src: "activities/find-the-20-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹20 features" },
  { type: "lbd", src: "activities/what-colour-is-the-20.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹20 note?" },
  { type: "lbd", src: "activities/find-the-50-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹50 features" },
  { type: "lbd", src: "activities/what-colour-is-the-50.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹50 note?" },
  { type: "lbd", src: "activities/find-the-100-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹100 features" },
  { type: "lbd", src: "activities/what-colour-is-the-100.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹100 note?" },
  { type: "video", src: "assets/6.webm"  },   // 14
  { type: "video", src: "assets/7.webm"  },   // 15 — Ma holds up the ₹200 note
  // 16–17 — INTERACTIVE: the ₹200 pair, placed right after the story page that
  // introduces that note rather than back in the block above.
  { type: "lbd", src: "activities/find-the-200-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹200 features" },
  { type: "lbd", src: "activities/what-colour-is-the-200.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹200 note?" },
  { type: "video", src: "assets/8.webm"  },   // 18 — Pari waves the ₹500 note
  // 19–20 — INTERACTIVE: the ₹500 pair, same reasoning as the ₹200 pair above.
  { type: "lbd", src: "activities/find-the-500-features.html",
                 poster: "assets/posters/currency.webp",
                 title: "Find the ₹500 features" },
  { type: "lbd", src: "activities/what-colour-is-the-500.html",
                 poster: "assets/posters/currency.webp",
                 title: "What colour is the ₹500 note?" },
  { type: "video", src: "assets/9.webm"  },   // 21
  { type: "video", src: "assets/10.webm" },   // 22
  // 23–26 — INTERACTIVE: the coin questions, sitting inside the story rather than
  // in the currency block, so they land right after story page 22. One coin per
  // page: 10, 20, 25 then 50 Paise.
  { type: "lbd", src: "activities/which-coin-is-this-10-paise.html",
                 poster: "assets/posters/currency.webp",
                 title: "Which coin is this? (10 Paise)" },
  { type: "lbd", src: "activities/which-coin-is-this-20-paise.html",
                 poster: "assets/posters/currency.webp",
                 title: "Which coin is this? (20 Paise)" },
  { type: "lbd", src: "activities/which-coin-is-this-25-paise.html",
                 poster: "assets/posters/currency.webp",
                 title: "Which coin is this? (25 Paise)" },
  { type: "lbd", src: "activities/which-coin-is-this-50-paise.html",
                 poster: "assets/posters/currency.webp",
                 title: "Which coin is this? (50 Paise)" },
  { type: "video", src: "assets/11.webm" },   // 27
  // 28 — INTERACTIVE: "Money Catch Mania", the catch-the-money game, sitting right
  // after story page 27. It lives OUTSIDE this folder, as a sibling of FLIPBOOK
  // under the main "PARI'S BIRTHDAY TREASURE" folder. Unlike every other activity in this book it plays FULL
  // SCREEN — but only once the child presses PLAY, which is when its wrapper posts
  // "lbd-start" (see the LBD OVERLAY section below). Until then it sits in the page
  // rectangle like every other activity, so arriving here no longer throws the reader
  // into a full-screen rectangle that is still loading. It is a built Phaser game — the
  // whole thing, art and audio included, is inlined in its own bundle/ folder, so
  // the leaf only needs the poster below while the page is turning.
  /* THIS POSTER MUST BE THE GAME'S TITLE SCREEN, not its background. It is what the
     boot cover holds up for the second or so the 2.9MB bundle needs (much longer on a
     slow device — measured at 8s with the CPU throttled 8x), and the whole point of
     the cover is that the reader sees the activity rather than a bare page.
     It shipped as the game's empty SKY BACKGROUND — no logo, no piggy bank, no Play
     button — so page 28 opened on a blank blue rectangle and stayed there until the
     game booted. That is what "the blue screen on the game page" was.
     Re-capture it from the running game (title screen, "Back to the story" hidden,
     960x540 to match every other poster) if the game is ever rebuilt with new art. */
  { type: "lbd", src: "../MONEY%20CATCH%20MANIA/index.html",
                 poster: "assets/posters/money-catch-mania.webp",
                 title: "Money Catch Mania",
                 // HEAVY: a 2.9MB Phaser bundle. Compiling and booting it costs
                 // ~1.2s of BLOCKED MAIN THREAD (measured), which is what used to
                 // freeze the book for a moment on arrival. This flag asks the book
                 // to boot it one page early and silently — see prewarmHeavyActivity.
                 heavy: true,
                 // The game brings its own soundtrack, and two pieces of music at
                 // once is just noise. The book's track steps aside here — paused,
                 // not stopped, so it picks up where it left off on the way out.
                 bgm: false },
  { type: "video", src: "assets/12.webm" },   // 29
  { type: "video", src: "assets/13.webm" },   // 30
  { type: "video", src: "assets/14.webm" },   // 31 — last page (→ THE END)
];

/* Printed page numbers: set to false for a completely clean, number-free page.
   SHOW_PAGE_TOTAL adds the "/ 14" total next to the current number. */
const SHOW_PAGE_NUMBERS = false;
const SHOW_PAGE_TOTAL   = true;

/* ============================================================================
   ██  END OF EDITABLE CONTENT — engine below (no need to change) ██
   ============================================================================ */

/* Poster path for a video page. ONE definition, used by both the leaf builder
   and the preloader, so the two can never disagree about what to fetch. */
function posterFor(src) {
  return src.replace(/^assets\//, "assets/posters/").replace(/\.webm$/i, ".webp");
}

/* ---- BLOB URL SAFETY NET ---------------------------------------------------
   The preloader swaps every media element onto a blob: URL so that "loaded"
   means the bytes are on the device, not merely in some cache the browser may
   drop. A blob can still go bad — revoked too early, memory pressure, a decoder
   that refuses the object URL — and the failure mode is silent: an element with
   no picture on a page that otherwise looks correct.
   So every swapped element gets ONE-SHOT revert to the original file URL. Once,
   because if the real file fails too, retrying forever would spin. */
function attachBlobFallback(el, originalUrl, isVideo) {
  el.addEventListener("error", function () {
    if (el.dataset.blobReverted) return;         // already tried the real file
    const cur = el.currentSrc || el.src || "";
    if (cur.indexOf("blob:") !== 0) return;      // not a blob problem — leave it
    el.dataset.blobReverted = "1";
    const wasPlaying = isVideo && !el.paused;
    el.src = originalUrl;
    if (isVideo) {
      try { el.load(); } catch (_) {}
      if (wasPlaying || (typeof flipped === "number" && leaves[flipped] && leaves[flipped].contains(el))) {
        const p = el.play(); if (p && p.catch) p.catch(function () {});
      }
    }
  });
}

/* ==========================================================================
   FORWARD GATE  —  the arrow stays inactive until the page has been consumed
   --------------------------------------------------------------------------
   Land on a page and the forward arrow is disabled until that page's own
   "you have seen this" rule is satisfied; then it becomes active and pulses
   with a gold glow. The reader cannot skip past a scene before it has played.

   ONE RULE PER PAGE TYPE:
     • video  — the clip must reach its end (or fail trying).
     • lbd    — the activity must report "lbd-complete". All seventeen post it.
                Completing it opens the gate and lights the arrow; it does NOT
                turn the page (see exitLbd) — the child turns it, like everywhere
                else in the book. The gate is what stops them skipping the
                activity to get past it.
     • image  — a flat 3s dwell, long enough to have looked at the picture.
                No page ships as type:"image" today; the rule lives here so
                that adding one gates it like everything else instead of
                silently being the one page type you can click straight past.

   THE LAST PAGE IS GATED TOO. Forward there closes the book to THE END, and
   the final scene is a video like any other, so skipping it would skip the
   ending. It was exempt in an earlier version purely to keep the route to THE
   END unconditional; the three unlock routes below plus the page picker's own
   "The End" entry make that exemption unnecessary.

   WHY THIS CANNOT STRAND ANYONE. Every rule releases through the single unlock
   point revealPageTurnCue(), which for a video is reachable THREE ways — the
   clip's `ended`, its `error`, and a per-page watchdog armed at the clip's own
   duration plus grace — so a clip that stalls, is blocked from autoplaying or
   never fires `ended` at all still opens the gate. An activity gets the same
   treatment from the other direction: if its iframe has not even LOADED within
   LBD_LOAD_FALLBACK_MS the gate opens, because a document that never came up is
   never going to report completion. An activity that DID load and is merely
   unfinished keeps its gate — that is the feature. And BACK and the page picker
   are never gated at all, so there is always a way out regardless.

   RE-GATED ON EVERY FIRST VISIT. Flipping back to a page starts it over — the clip
   rewinds to frame 0 (refreshMedia → playVideoNow) and the activity reloads at its
   own opening state (resetLbd unloads the iframe on the way out) — but a page the
   reader has ALREADY satisfied does not ask again: see the `consumed` map below.
   So the content replays and the gate does not.
   ========================================================================== */
let advanceLocked = false;

/* ---- WHICH PAGES HAVE ALREADY BEEN SEEN ------------------------------------
   A page is "consumed" once its rule has been satisfied ONCE: its clip reached the
   end, its activity reported completion, or its image dwell elapsed. Coming back to
   a consumed SCENE leaves the forward arrow LIVE from the moment you land, so going
   back to re-watch one never costs you the wait a second time.

   This is deliberately how BACKWARD navigation stays frictionless. Note that it
   follows from the gate itself: the only way to reach page N+1 by arrow or drag is
   to have satisfied page N, so any page you can press BACK onto is consumed by
   construction. A page you have never satisfied — one you skipped past with the
   picker — is still gated when you arrive, because it has not been seen yet.

   The scene still RESTARTS from frame 0 on every arrival (see refreshMedia); what
   is dropped is only the obligation to sit through it. Replay clears this map, so a
   fresh read-through gates everything again from scratch.

   NOTE FOR QA: checkpoint TSN-011 asks for a revisited page to re-lock and be
   satisfied again. It is deliberately NOT met: the arrow is live from the start on
   any page — scene or activity — the reader has already been through. That was
   requested, reversed for activities, and then requested again for activities; it is
   the one condition on the `consumed` branch in gateAdvance() either way. */
const consumed = Object.create(null);
function markConsumed(idx) { if (typeof idx === "number" && idx >= 0) consumed[idx] = true; }
/* True when the page we are STANDING ON was already consumed at the moment we landed
   — i.e. this is a revisit, not a first pass. Set once per arrival in gateAdvance();
   read by canShowHint() together with the flag below. */
let arrivedConsumed = false;
/* Has the activity on THIS page reported completion during THIS visit? Set by the
   "lbd-complete" listener, cleared on every arrival. On a revisit the forward gate is
   already open on landing, so it cannot say whether the reader is still playing or has
   finished — this can, and it is what lets the nudge wait for the activity to end
   rather than firing over a child who is part-way through it again. */
let completedThisVisit = false;

/* A static image page's dwell, and the "this activity never loaded" escape. */
const IMAGE_GATE_MS = 3000;
const LBD_LOAD_FALLBACK_MS = 20000;
let pageGateTimer = null;      // the image dwell OR the activity load-failure net
let pageGateIdx = -1;          // which page that timer belongs to
function clearPageGate() {
  clearTimeout(pageGateTimer); pageGateTimer = null; pageGateIdx = -1;
}

function setAdvanceLocked(v) {
  if (advanceLocked === v) return;
  advanceLocked = v;
  // The dimmed look comes free from the existing .corner-arrow[disabled] rule;
  // updateProgress() is what actually sets `disabled` (it also owns the other
  // reasons the arrow can be off, like !ready), so route through it rather than
  // poking the attribute here and having the two fight.
  if (v && cornerNext) cornerNext.classList.remove("cue", "blink1");
  if (typeof updateProgress === "function") updateProgress();
  // The gate decides who owns the pointer on an activity page — see syncLbdDone().
  if (typeof syncLbdDone === "function") syncLbdDone();
}

function gateAdvance(idx) {
  const page = pages[idx];
  // Clear the pulse and any pending timer from whatever page we were on before
  // deciding about this one.
  if (cornerNext) cornerNext.classList.remove("cue", "blink1");
  clearPageGate();
  /* WAS THIS PAGE ALREADY DONE WHEN WE LANDED ON IT? Captured here, before anything
     can change it, because it is the only moment the answer is knowable. It cannot be
     read later as `consumed[flipped]`: finishing an activity calls markConsumed()
     immediately, so by the time the nudge would fire on a FIRST visit that flag is
     already true and a later test could not tell the two visits apart.
     gateAdvance runs once per arrival (refreshMedia, guarded by `arrived`), which is
     what makes this a per-visit fact rather than a running state. */
  arrivedConsumed = !!consumed[idx];
  completedThisVisit = false;         // a fresh arrival has not finished anything yet
  if (!page) { setAdvanceLocked(false); return; }

  /* ALREADY SEEN — the arrow is live the instant we land, and glows so that is
     obvious rather than merely "not disabled". This is the branch that makes going
     BACK free; everything below it applies only to a page being met for the first
     time.

     ACTIVITIES ARE INCLUDED, on request. They were briefly excluded — an activity
     reloads at its opening state, so a returning reader met a lit, glowing arrow over
     an untouched 0/2 — but the exemption is about not charging anyone twice for the
     same page, and an activity they have already completed is exactly that. So the
     arrow is live from the moment they land on one they have finished before; the
     activity is still there to play again if they want it, it is simply no longer
     the toll for moving on. FIRST visits are gated as strictly as ever. */
  if (consumed[idx]) {
    setAdvanceLocked(false);
    if (ready && cornerNext) cornerNext.classList.add("cue");
    return;
  }

  // VIDEO — locked until the clip ends. Unconditionally re-locked on arrival, even
  // for a clip that has already run once: refreshMedia rewinds and replays an ended
  // video, so the page genuinely is starting over and the gate must start over with
  // it. (An earlier version left an already-`ended` clip unlocked to save the reader
  // sitting through it again; that made "revisit" the one route that could skip a
  // scene, and it disagreed with the replay the reader was watching at the time.)
  if (page.type === "video") { setAdvanceLocked(true); return; }

  // ACTIVITY — locked until it posts "lbd-complete" (see the message listener).
  // Armed with the load-failure net described above: an activity whose document
  // never came up cannot ever report completion, so after LBD_LOAD_FALLBACK_MS with
  // no successful load we open the gate rather than leave the reader on a dead page.
  // A loaded-but-unfinished activity is left gated — that is the point of the gate.
  if (page.type === "lbd") {
    setAdvanceLocked(true);
    pageGateIdx = idx;
    pageGateTimer = setTimeout(function () {
      pageGateTimer = null;
      if (flipped !== idx) return;                 // reader moved on
      if (lbdFrameLoadedIdx === idx) return;       // alive, just unfinished → keep the gate
      revealPageTurnCue(null);
    }, LBD_LOAD_FALLBACK_MS);
    return;
  }

  // STATIC IMAGE — a flat dwell. Same unlock point as everything else, so it picks
  // up the blink, the glow and the idle nudge for free.
  setAdvanceLocked(true);
  pageGateIdx = idx;
  pageGateTimer = setTimeout(function () {
    pageGateTimer = null;
    if (flipped === idx) revealPageTurnCue(null);
  }, IMAGE_GATE_MS);
}

/* ---- "TURN THE PAGE" CUE — reachable three ways ----------------------------
   Blink + gold-glow the forward arrow for 2s and arm the nudge. Called by the
   video's `ended` event, by its `error` event, and by a per-page WATCHDOG
   (armVideoWatchdog) so a clip that stalls, is blocked from autoplaying, or
   never fires `ended` at all can't leave the reader stuck with no cue.
   Idempotent per page arrival: armBlink gates the blink to once per visit while
   the nudge itself is always re-armed (re-watching a clip should re-arm it). */
function revealPageTurnCue(media) {
  // Wrong-page guard FIRST, and it is the only thing that may stop the unlock:
  // a clip that finished on a page the reader has already left must not release
  // the gate for whatever page they are on now.
  if (media && (!leaves[flipped] || !leaves[flipped].contains(media))) return;

  /* OPEN THE FORWARD GATE — deliberately ahead of every cosmetic guard below.
     This used to sit after them, and that made the gate hostage to conditions
     that have nothing to do with navigation. A crawl of all 31 pages found the
     consequence: leaving Money Catch Mania by the PAGE PICKER left lbdFullscreen
     stuck true (see updateLbdOverlay), the guard below rejected every route into
     this function for the rest of the session, and pages 28 and 29 could not be
     advanced past AT ALL — in either direction. That flag leak is fixed too, but
     the gate must not depend on it having been: the three routes into here
     (ended / error / watchdog) are the reader's only way forward, so nothing
     cosmetic may be able to block all three at once. */
  if (opened) { setAdvanceLocked(false); markConsumed(flipped); }

  /* PAGE 2's SCENE IS OVER — bring the music in. Placed here rather than on the
     video's own `ended` because this is where all three endings converge (ended,
     error, and the stall watchdog), so a scene that fails still gets its music. */
  if (opened && flipped === BGM_START_PAGE) startBgMusicOnce();

  /* THE RESCUE TIMERS HAVE NOW DONE THEIR JOB — retire them. Both exist only to
     reach this function if the ordinary route doesn't, so once we are here they can
     only fire a SECOND time over a page that is already cued.
     That double-fire was silently costing time: on a healthy clip the watchdog is
     armed for duration + 3.5s, `ended` arrives first and opens the gate, and then
     3.5s later the watchdog ran this function again — which restarted the idle
     countdown from scratch. Measured: the nudge landed 13s after the scene finished
     instead of 10s, on every video page in the book. */
  clearVideoWatchdog();
  clearPageGate();

  // From here down is presentation only — the blink, the glow and the idle nudge.
  // These MAY be suppressed: no cue is a small loss, a locked gate is not.
  // The LAST page is included now that it is gated like every other video page —
  // an arrow that quietly stops being disabled, with no glow to say so, would read
  // as broken. `ended` is the real stop condition: once the book has closed there
  // is nothing left to cue.
  if (!opened || !ready || lbdFullscreen || ended) return;
  scheduleHintAfterVideo();
  if (!armBlink || !cornerNext) return;      // already blinked for this visit
  armBlink = false;
  cornerNext.classList.remove("blink1", "cue");
  void cornerNext.offsetWidth;               // restart the animation cleanly
  // .blink1 is the one-shot that grabs the eye; .cue is the steady pop-and-shine that
  // takes over afterwards (its animation-delay matches blink1's length) and keeps
  // going until the reader actually turns the page.
  //   The handover is NOT automatic, and adding both classes is not enough on its own:
  // `animation` is a single property, and .corner-arrow.fwd.cue outranks
  // .corner-arrow.blink1, so .cue's declaration replaces blink1's outright. styles.css
  // carries an explicit .fwd.blink1.cue rule listing both animations for exactly this
  // reason — see the note there before changing either class name.
  cornerNext.classList.add("blink1", "cue");
  setTimeout(function () {
    if (cornerNext) cornerNext.classList.remove("blink1");
  }, 2050);
}

/* Per-page watchdog: the clip's own duration plus a few seconds of grace. Armed
   fresh on every page arrival and cleared when we leave, so it can only ever
   fire for the page the reader is actually on. Duration is often still NaN when
   we arm (metadata not in yet) — fall back to a generous fixed window and let
   the `ended` path beat us to it, which it does on any healthy playback. */
const WATCHDOG_GRACE_MS = 3500;
const WATCHDOG_FALLBACK_MS = 15000;
let videoWatchdog = null;
let videoWatchdogIdx = -1;
function clearVideoWatchdog() {
  clearTimeout(videoWatchdog); videoWatchdog = null; videoWatchdogIdx = -1;
}
function armVideoWatchdog(idx, v) {
  clearVideoWatchdog();
  if (!v) return;
  videoWatchdogIdx = idx;
  const arm = function () {
    clearTimeout(videoWatchdog);
    const dur = (isFinite(v.duration) && v.duration > 0) ? v.duration * 1000 : WATCHDOG_FALLBACK_MS;
    videoWatchdog = setTimeout(function () {
      if (flipped !== idx) return;           // reader moved on — nothing to rescue
      revealPageTurnCue(v);
    }, dur + WATCHDOG_GRACE_MS);
  };
  arm();
  // Re-arm once real metadata lands, so a long clip isn't nudged at the 15s
  // fallback and a short one isn't left waiting.
  v.addEventListener("loadedmetadata", function () {
    if (videoWatchdogIdx === idx && flipped === idx) arm();
  }, { once: true });
}

/* ---- Build one page face's media (image OR video OR lbd poster) ---------- */
function makeMedia(page) {
  // "lbd" pages show a STILL poster on the leaf itself (seen while the page turns);
  // the live, interactive activity is a separate full-screen-capable overlay iframe
  // (see the LBD OVERLAY section below) — it can't live inside the 3D-transformed
  // leaf because CSS transforms trap position:fixed, so true fullscreen would fail.
  if (page.type === "lbd") {
    const img = document.createElement("img");
    img.className = "page-media";
    img.draggable = false;
    img.addEventListener("dragstart", function (e) { e.preventDefault(); });
    img.decoding = "async";
    // src is NOT set here — same reason as the video posters. All sixteen
    // activity leaves point at the same file, so setting it in the markup put a
    // second request for it in flight alongside the preloader's (the browser
    // happened to coalesce the two, but that is a timing accident, not a
    // guarantee). The preloader assigns it: a blob on success, this plain URL if
    // the fetch failed.
    img.dataset.poster = page.poster || "";
    img.alt = (page.title || "An activity") + " — tap to play";
    if (page.poster) attachBlobFallback(img, page.poster, false);
    return img;
  }
  const media = page.type === "video"
    ? document.createElement("video")
    : document.createElement("img");
  media.className = "page-media";
  media.draggable = false;                           // never let the image "ghost-drag" out
  media.addEventListener("dragstart", function (e) { e.preventDefault(); });
  media.src = page.src;
  if (page.type === "video") {
    media.loop = false;
    // vol: on a page mutes (or ducks) the clip's OWN audio, so the scene's sound
    // can come from the vo: channel instead of being re-encoded into the video.
    // Guarded on typeof so vol: 0 is honoured — `page.vol || 1` would read 0 as
    // "unset" and play the clip at full volume, which is the exact opposite.
    if (typeof page.vol === "number") media.volume = page.vol;
    media.playsInline = true;
    media.setAttribute("playsinline", "");            // iOS Safari inline playback
    media.setAttribute("webkit-playsinline", "");
    // FIRST-FRAME POSTER: the page surface (--paper) is deep night-blue, so a video
    // that hasn't painted a frame yet (still buffering, or autoplay was blocked) would
    // show as a BLANK dark-blue page. The poster is that clip's own frame 0, so the
    // scene shows INSTANTLY and — because it equals where playback starts — there's no
    // jump when the video then plays. Posters are tiny (~40KB) and live in assets/posters/.
    // DERIVED PATH: assets/7.webm → assets/posters/7.webp. The extension in this
    // regex must track the video container — it was /\.mp4$/ and would silently
    // stop matching (leaving the poster attribute as the raw video path) the
    // moment the media moved to WebM.
    //
    // The attribute is NOT set here. A poster="" on an in-DOM <video> is fetched
    // by the browser immediately, and the preloader fetches the same file a
    // moment later — measured as an exact 2x download of all 15 posters. The
    // preloader sets it instead (to a blob, or to this plain URL if the fetch
    // failed), so it is downloaded exactly once either way.
    media.dataset.poster = posterFor(page.src);
    // LAZY: do NOT eager-buffer. With 25 videos, preload="auto" made the browser
    // open + decode every clip on load (huge memory/CPU spike + open lag). We only
    // buffer the page you're on + the next one, on demand (see warmVideo()).
    media.preload = "none";
    // Tap the video to (re)start it WITH sound — a guaranteed user gesture, so
    // browsers that blocked the auto-start's audio will now allow it.
    media.addEventListener("click", function () {
      media.muted = false;
      try { if (media.ended) media.currentTime = 0; } catch (_) {}
      const p = media.play(); if (p && p.catch) p.catch(function () {});
    });
    // THREE PATHS TO THE SAME CUE — see revealPageTurnCue(). The reader must never
    // be left on a page with no way forward shown, so the "scene is over, turn the
    // page" cue is reachable by the ended event, by an error, AND by a watchdog
    // armed in refreshMedia(). Any one of them is enough.
    media.addEventListener("ended", function () { revealPageTurnCue(media); });
    media.addEventListener("error", function () { revealPageTurnCue(media); });
    // BLOB FALLBACK: the preloader swaps this element onto a blob: URL. If that
    // blob is ever unusable (revoked, out of memory, decoder refuses it) the
    // element would sit dead on a page that otherwise looks fine — so fall back
    // to the original file URL exactly once, and resume playing if this is the
    // page the reader is on. Registered before any swap happens.
    attachBlobFallback(media, page.src, true);
  } else {
    media.decoding = "async";
    media.alt = page.alt || "story page";
  }
  return media;
}

/* ---- Build one page's printed PAGE NUMBER --------------------------------
   A small gold coin in the page's bottom-right corner, styled in styles.css
   (.page-num). It lives on the leaf's FRONT face, so it turns away with the page
   just like a printed folio. `n` is 1-based; `total` is the page count. */
function makePageNumber(n, total) {
  const el = document.createElement("div");
  el.className = "page-num";
  el.setAttribute("aria-hidden", "true");
  el.textContent = String(n);
  if (SHOW_PAGE_TOTAL) {
    const of = document.createElement("span");
    of.className = "of";
    of.textContent = "/ " + total;
    el.appendChild(of);
  }
  return el;
}

/* REMOVED — makeBubble() and makeSpeechBubble(), two unused speech-bubble
   builders. makeSpeechBubble() had no caller anywhere. makeBubble() was called
   only for a page carrying a `bubble` key, and no page has one; its .bubble.neel
   / .bubble.everywhere styles also pointed at two .webp files that are not in
   assets/, so it could not have rendered even if a page had asked for it. The
   matching CSS (.bubble*, .sbub*, SBUB_TAILS, sbubPop, bubblePop) is gone too. */
/* ---- Build the pages (one CSS 3D "leaf" per entry) ---------------------- */
const flipbookEl  = document.getElementById("flipbook");
const pageStackEl = flipbookEl ? flipbookEl.querySelector(".page-stack") : null;   // right-side page stack
const flipScaleEl = document.getElementById("flipScale");
const coverScene  = document.getElementById("coverScene");
// ONE full 16:9 page per view (single display). page 1 = entry 1. The themed
// book frame forms the left spine/cover edge (always visible when open); pages
// flip normally. No two-page spread.
const totalPages = pages.length;
// Which leaf is the embedded LBD game (-1 if none). Used to show/hide the overlay.
// Is leaf i an interactive activity page? There is more than one, and they are
// ADJACENT (pages 6 and 7), so nothing here may assume a single fixed index.
function isActivityPage(i) { return !!(pages[i] && pages[i].type === "lbd"); }

// Each leaf is a full 16:9 page hinged on the LEFT spine:
//   • FRONT = the page's full-bleed image / video (+ its speech bubble, if any).
//   • BACK  = a BLANK parchment sheet (seen edge-on while the page turns).
const leaves = [];
pages.forEach(function (page, i) {
  const leaf = document.createElement("div");
  leaf.className = "leaf";

  const front = document.createElement("div");
  front.className = "face front";
  front.appendChild(makeMedia(page));                       // full-bleed image / video
  if (SHOW_PAGE_NUMBERS) front.appendChild(makePageNumber(i + 1, totalPages));  // printed folio
  const curl = document.createElement("div");               // moving page-curl shading
  curl.className = "curl";
  front.appendChild(curl);

  const back = document.createElement("div");
  back.className = "face back";                             // blank reverse side (no content)

  leaf.appendChild(front);
  leaf.appendChild(back);
  flipbookEl.appendChild(leaf);
  leaves.push(leaf);
});

/* ---- State + element references ----------------------------------------- */
const bookStage  = document.getElementById("bookStage");
const book       = document.getElementById("book");
const bookPop    = document.getElementById("bookPop");
const bookFloat  = document.getElementById("bookFloat");
const cover      = document.getElementById("cover");
const hint       = document.getElementById("hint");
// (#prev / #next are gone. They were two permanently-hidden <button>s kept in the
// markup "so existing JS refs stay valid" — the corner arrows do the job.)
const cornerPrev  = document.getElementById("cornerPrev");
const cornerNext  = document.getElementById("cornerNext");
const endOverlay  = document.getElementById("endOverlay");       // the back cover leaf (THE END)
const backCoverScene = document.getElementById("backCoverScene"); // its slide-to-centre stage
const replayBtn   = document.getElementById("replayBtn");        // gold Replay icon on the back cover
// (#homeBtn is gone too, removed on request — along with goHome() and the .home-btn
// styles. Getting back to the cover is the page picker's "Cover" option, which
// calls resetToStart() and never went via the button.)
// Declared up here (not next to the PAGE PICKER block below) because
// updateProgress() reads it and runs once at boot, before that block.
const pageSelect  = document.getElementById("pageSelect");

/* ==========================================================================
   INTERACTIVE PAGE OVERLAY  —  "Find the ₹10 features", embedded as page 6.
   (Historically the "LBD" slot; the lbd* names are kept so the whole machinery
   stays in one recognisable piece.)
   The activity lives in a body-level iframe (#lbdStage) so it can grow to true
   fullscreen (a transform on .flip-scale would otherwise trap position:fixed).
   • on arrival : the overlay is sized/positioned OVER the current page rectangle,
                  so the activity looks like it's printed inside the book. It STAYS
                  that size — the currency activity plays inside the page.
   • finished   : it posts {source:"lbd", type:"lbd-complete"} → the overlay shrinks
                  back into the page and the forward arrow lights up. The book does
                  NOT turn the page itself; the reader does. (It used to auto-flip.)
   • "lbd-start": expands the overlay to fill the screen. Kept for any future
                  activity that wants it; the currency page never sends it.
   ========================================================================== */
const lbdStage = document.getElementById("lbdStage");
const lbdFrame = document.getElementById("lbdFrame");
const lbdCover = document.getElementById("lbdCover");   // boot cover, see ensureLbdLoaded
let lbdFullscreen = false;   // is the overlay expanded to full screen right now?
let lbdWasOn      = false;   // was the overlay showing on the previous refresh?
let lbdExiting    = false;   // guard so "complete" only advances once
/* A DRAG is turning the page right now. The arrow route hides this overlay for the
   whole turn because turnLeaf() sets `animating` before refreshing — but a drag has
   no such flag while the finger is still down, and it never calls refreshMedia()
   either, so nothing told the overlay a turn had begun. The leaf rotated to -88°
   underneath an activity that sat perfectly still and square, which is not a page
   turning, it is a picture sliding off one. This is the drag's equivalent of
   `animating`, set the moment the drag commits to a leaf. */
let lbdTurning    = false;
/* The reader asked to play a finished activity again, so it needs its pointer input
   back even though the forward gate is open. See syncLbdDone(). */
let lbdReplaying  = false;

// Which activity is in the frame right now (-1 = none). Tracking the INDEX, not
// just a loaded flag, is what lets the overlay swap between two neighbouring
// activity pages — a flag alone would leave page 6 showing on page 7.
let lbdLoadedIdx = -1;

// Which activity has actually FINISHED LOADING (-1 = none). The forward gate needs
// to tell "the activity is up and the child simply hasn't finished it" from "the
// document never came up", because only the second case may open the gate on its
// own — see gateAdvance(). The iframe's own `load` event is the signal; about:blank
// (what resetLbd parks it on) doesn't count as an activity being up.
let lbdFrameLoadedIdx = -1;
if (lbdFrame) lbdFrame.addEventListener("load", function () {
  if (lbdFrame.src && lbdFrame.src.indexOf("about:blank") === -1) {
    lbdFrameLoadedIdx = lbdLoadedIdx;
    uncoverLbd();          // the document is up — the sixteen light activities end here
  }
});

// Load the activity for the page we are on, on demand (never on flipbook boot).
// Also paints that page's poster behind the frame so there is no dark flash while
// it loads — the poster is the activity's own background, so it fades in seamlessly.
/* Hold the poster over the frame until the activity is actually up, then fade it off.
   Called by the "lbd-start" message and by the iframe's own load event — whichever
   arrives first. In practice the load event is what uncovers EVERY activity now: the
   sixteen currency and coin pages never send the message at all, and Money Catch Mania
   no longer sends it on load either — it waits for the child to press Play, long after
   the frame is up. (It used to send it the moment its canvas existed, and that message
   did the uncovering.) The game's poster IS its title screen, so holding the cover
   until the 2.9MB bundle has painted is exactly right: the reader looks at the title
   screen either way and never sees the bare blue body underneath. */
function uncoverLbd() {
  if (lbdCover) lbdCover.classList.add("uncovered");
}
function coverLbd(poster) {
  if (!lbdCover) return;
  lbdCover.classList.remove("uncovered");
  lbdCover.style.backgroundImage = poster ? "url('" + poster + "')" : "none";
}

function ensureLbdLoaded() {
  const i = flipped;
  if (!lbdFrame || !isActivityPage(i) || lbdLoadedIdx === i) return;
  /* COVER FIRST, then load. Setting the poster as the FRAME's background is not
     enough on its own: it only shows until the embedded document paints, and a game
     whose 2.9MB ES module has not executed yet paints a bare blue body over it — a
     blank rectangle for 1.4s, measured, even with the bundle already cached. The
     cover sits above the frame instead and comes off when the activity says it is
     ready. The frame background stays as the backstop for letterbox edges. */
  // Re-decide who owns the pointer for whatever is going into the frame. NOT a blanket
  // "hand it back to the activity": on a page the reader has already completed the gate
  // is open and the book keeps the page flip, which is the whole point of syncLbdDone.
  // It also must not clear lbdReplaying — replayActivity() sets that and then calls
  // straight into here, and clearing it would undo the replay it just asked for.
  syncLbdDone();
  coverLbd(pages[i].poster);
  lbdFrame.style.background = pages[i].poster
    ? "#0a0f2d url('" + pages[i].poster + "') center/cover no-repeat"
    : "#0a0f2d";
  lbdFrame.src = pages[i].src;
  lbdLoadedIdx = i;
}
// Unload so the NEXT visit starts fresh from the activity's opening state.
function resetLbd() {
  if (!lbdFrame) return;
  stopGameLoader(false);               // never leave a bar running on a blanked frame
  lbdFrame.src = "about:blank";
  lbdLoadedIdx = -1;
  lbdFrameLoadedIdx = -1;      // nothing is loaded now, so nothing is "up"
  coverLbd("");                // re-armed, so the next visit opens covered again
  // Leaving the page ends any replay that was in progress; the next visit decides
  // ownership from its own gate (a page already completed keeps the page flip).
  lbdReplaying = false;
  syncLbdDone();
}
/* ---- BOOT THE HEAVY ACTIVITY EARLY -----------------------------------------
   Money Catch Mania is a 2.9MB Phaser bundle. The bytes were never the problem —
   the preloader already has them, and a warm HTTP cache serves them in ~20ms — but
   COMPILING and BOOTING them costs ~1.2s of blocked main thread, measured, and that
   is what made the book freeze for a moment the instant you reached the page.
   Nothing can make that work cheaper, so it happens EARLIER instead: one page
   ahead, into the same idle frame, while the reader is still watching page 27.
   By the time they arrive the canvas is already up, ensureLbdLoaded sees the frame
   is on the right index and returns without touching src, and the overlay simply
   becomes visible.

   ONLY WHEN THE FRAME IS IDLE. #lbdFrame is shared by all seventeen activities, so
   prewarming while an activity is on screen would throw away the one the child is
   playing. Guarded on !isActivityPage(flipped).

   SILENT UNTIL ARRIVAL. Booting the game also starts its audio, which would mean
   game music under page 27. The prewarm URL carries ?prewarm=1, and the games own
   wrapper keeps every AudioContext suspended while that flag is present until the
   book sends {source:"book", type:"go-live"} — which updateLbdOverlay does at the
   moment the page is actually reached. One boot, no sound early.

   CALLED LAST in updateLbdOverlay on purpose: the leave branch above may call
   resetLbd(), which blanks the frame, and a prewarm done before that would be
   thrown away by it. */
const PREWARM_LEAD = 1;                  // pages ahead to boot a heavy activity
let lbdPrewarmIdx = -1;                  // which index was booted early, if any
function prewarmHeavyActivity() {
  if (!lbdFrame || !opened || !ready) return;
  const target = flipped + PREWARM_LEAD;
  const page = pages[target];
  if (!page || page.type !== "lbd" || !page.heavy) return;
  if (isActivityPage(flipped)) return;   // the frame is in use by the page we are on
  if (lbdLoadedIdx === target) return;   // already booted (or already prewarmed)
  coverLbd(page.poster);                 // so arriving shows the title screen, not a flash
  lbdFrame.style.background = page.poster
    ? "#0a0f2d url(" + page.poster + ") center/cover no-repeat"
    : "#0a0f2d";
  lbdFrame.src = page.src + (page.src.indexOf("?") === -1 ? "?" : "&") + "prewarm=1";
  lbdLoadedIdx = target;
  lbdPrewarmIdx = target;
}
/* ---- THE GAME LOADING BAR --------------------------------------------------
   Only the heavy activity gets one, and only when it is actually being waited on.
   NORMALLY IT NEVER APPEARS: prewarmHeavyActivity boots the game a page early, so
   arriving finds a canvas already up and this hides on its first tick. It exists
   for the routes that skip the prewarm — jumping straight to the page from the
   picker, or arriving from another activity, which leaves the shared frame busy
   and forces the ~1.2s compile-and-boot to happen on arrival after all.

   WHY THE PROGRESS IS MODELLED, NOT MEASURED, AND WHY THAT IS HONEST HERE. There
   is nothing real to measure: the bytes are already on the device (the preloader
   fetched them before the start button ever appeared), and what the child is
   waiting for is V8 compiling 2.9MB and Phaser building its scene — neither emits
   progress. So the bar eases toward 90% on a curve and only ever reaches 100% on
   the real event: the games canvas existing. It cannot show 100% early, and it
   cannot sit at 100% while nothing has happened. A bar that lied in the other
   direction — jumping to full and then waiting — is the thing worth avoiding.
   Same-origin, so the canvas check is a direct DOM read of the frame. */
const GAME_LOADER_CAP = 90;             // ceiling for the modelled part
let gameLoaderTimer = null;
function stopGameLoader(finished) {
  clearInterval(gameLoaderTimer); gameLoaderTimer = null;
  const el = document.getElementById("lbdLoader");
  if (!el) return;
  if (finished) setGameLoaderPct(100);
  el.classList.add("done");
  setTimeout(function () { el.hidden = true; el.classList.remove("done"); }, 280);
}
function setGameLoaderPct(p) {
  const el = document.getElementById("lbdLoader");
  const fill = document.getElementById("lbdLoaderFill");
  const txt = document.getElementById("lbdLoaderText");
  if (!el) return;
  const v = Math.max(0, Math.min(100, Math.round(p)));
  if (fill) fill.style.width = v + "%";
  if (txt) txt.textContent = "Filling the piggy bank… " + v + "%";
  el.setAttribute("aria-valuenow", String(v));
}
function gameCanvasUp() {
  try { return !!(lbdFrame.contentDocument &&
                  lbdFrame.contentDocument.querySelector("#game canvas")); }
  catch (e) { return false; }          // cross-origin should be impossible here
}
function runGameLoader() {
  const el = document.getElementById("lbdLoader");
  if (!el || !lbdFrame) return;
  clearInterval(gameLoaderTimer);
  if (gameCanvasUp()) { el.hidden = true; return; }   // prewarm did its job
  el.hidden = false; el.classList.remove("done");
  let p = 0;
  const t0 = Date.now();
  setGameLoaderPct(0);
  gameLoaderTimer = setInterval(function () {
    if (gameCanvasUp()) { stopGameLoader(true); return; }
    // ease toward the cap: fast at first, slower the longer it takes, never past it
    p += Math.max(0.6, (GAME_LOADER_CAP - p) * 0.06);
    setGameLoaderPct(Math.min(p, GAME_LOADER_CAP));
    // a boot this long means something is wrong; stop pretending and get out of
    // the way so the child sees the poster rather than a bar stuck near the cap
    if (Date.now() - t0 > 30000) stopGameLoader(false);
  }, 120);
}
/* The prewarmed frame is silent until told otherwise. Say the word, once. */
function goLiveIfPrewarmed() {
  if (lbdPrewarmIdx !== flipped) return;
  lbdPrewarmIdx = -1;
  try { lbdFrame.contentWindow.postMessage({ source: "book", type: "go-live" }, "*"); } catch (e) {}
}
// Park the overlay exactly over the on-screen page rectangle (pre-LBD look).
function positionLbdStage() {
  if (!lbdStage) return;
  const r = flipScaleEl.getBoundingClientRect();   // the scaled 1280×720 page area
  lbdStage.style.left   = r.left   + "px";
  lbdStage.style.top    = r.top    + "px";
  lbdStage.style.width  = r.width  + "px";
  lbdStage.style.height = r.height + "px";
  /* MATCH THE PAGE'S ROUNDED CORNERS.
     The pages are curved (see CURVED BOOK in styles.css) and this overlay covers a
     page exactly, so a square-cornered overlay would show its own corners over the
     page's curve on all seventeen activity pages.
     It cannot just borrow the page's radius, though. The page's is authored in the
     book's unscaled 1280×720 space, so on screen it measures that many pixels TIMES
     the book scale; this overlay is a body-level box in real screen pixels. A bare
     18px here draws a visibly rounder corner than the page underneath, worst on a
     small window where the scale is smallest. So scale it the same way the book is.
     Fullscreen must be square, and the inline value has to be set to 0 explicitly:
     an inline style beats the .lbd-stage.fullscreen rule in the stylesheet.
     Keep these two numbers in step with --r-page / --r-page-spine in styles.css. */
  const s = r.width / 1280;
  // One radius, all four corners — the page is uniformly rounded now (see UNIFORM
  // CORNERS in styles.css). Keep this number equal to --r-page.
  lbdStage.style.borderRadius = lbdFullscreen ? "0px" : (22 * s).toFixed(2) + "px";
}
let lbdAnimTimer = null;
function setLbdFullscreen(on) {
  if (!lbdStage) return;
  lbdFullscreen = on;
  positionLbdStage();                        // make the inline page-rect geometry current
  lbdStage.classList.add("lbd-anim");        // turn the box-morph transition ON for this toggle
  void lbdStage.offsetWidth;                 // commit, so the class change below animates from here
  lbdStage.classList.toggle("fullscreen", on);   // expand to / shrink from full screen
  document.body.classList.toggle("lbd-fullscreen", on);
  clearTimeout(lbdAnimTimer);
  lbdAnimTimer = setTimeout(function () { lbdStage.classList.remove("lbd-anim"); }, 460);
}
// Show the overlay + LOAD the activity ONLY once we've fully landed on its page,
// and UNLOAD it the moment we leave. It is never loaded on approach, so nothing
// of it can bleed onto the previous page; unloading also guarantees the next
// visit starts clean at the splash.
function updateLbdOverlay() {
  if (!lbdStage) return;
  const onLbd = opened && ready && !animating && !lbdTurning && isActivityPage(flipped);
  /* SHOWING and LOADED are two different questions, and conflating them cost the
     reader their work. Hiding is cheap and happens for the length of every turn;
     UNLOADING throws the activity away and restarts it at its opening state. They
     used to share one condition, so a drag that was started and then ABANDONED on a
     completed activity ran the hide branch on the way back — and unloaded it.
     Measured: score 2/2 → 0, and the swipe handover (.done) revoked with it, so the
     child had to solve it a second time to get their page turn back.
     We have only really LEFT when the activity in the frame is not the one for the
     page we are now on. A snap-back leaves both unchanged, so it keeps its frame. */
  const stillHere = opened && ready && isActivityPage(flipped) && lbdLoadedIdx === flipped;
  if (onLbd) {
    ensureLbdLoaded();                    // load only now → sound starts when you REACH the page
    goLiveIfPrewarmed();                  // a frame booted early is muted until now
    if (pages[flipped] && pages[flipped].heavy) runGameLoader();
    if (!lbdFullscreen) positionLbdStage();
    lbdStage.classList.add("visible");
    lbdStage.setAttribute("aria-hidden", "false");
    lbdWasOn = true;
  } else {
    /* Leaving an activity page.
       This used to be `else if (!lbdFullscreen)` — "never hide mid-game, we can't
       leave while fullscreen". That premise only holds for the routes that are
       themselves gated on !lbdFullscreen: the corner arrows and the drag. The PAGE
       PICKER, Home and Replay all jump straight out regardless, and on those routes
       the branch was skipped, so lbdFullscreen stayed TRUE for the rest of the
       session — with the game's iframe still marked visible and full-screen behind
       the book, its audio still loaded, and every later page silently robbed of its
       page-turn cue (revealPageTurnCue bails while the flag is set). Collapse it
       here instead: if we are off the activity page, the overlay has no business
       being up, however the reader got out. */
    if (lbdFullscreen) setLbdFullscreen(false);
    lbdStage.classList.remove("visible");
    lbdStage.setAttribute("aria-hidden", "true");
    if (lbdWasOn && !stillHere) {
      lbdWasOn = false;
      resetLbd();                         // unload → stops all game audio immediately + fresh next visit
    }
  }
  prewarmHeavyActivity();   // AFTER any resetLbd above, or it would be undone
}
/* PLAY IT AGAIN — a tap anywhere on a FINISHED activity starts it over.
   ------------------------------------------------------------------------
   Only when it is finished, which is also the only time it can work: while an
   activity is live the overlay is taking every pointer event (it has to — a drag on
   the find-the-features pages is the magnifying glass), so the book never sees the
   tap at all. Completing it sets .done, the overlay goes inert, and from then on the
   book owns the page: a DRAG turns it, and a TAP replays the activity. The two are
   already told apart by the drag handler's `decided` flag, so no new gesture code.

   RELOADING THE FRAME is the reset. Every activity has a "start over" already — its
   own opening state — and re-pointing the iframe at it gets there exactly, with no
   per-activity teardown code in sixteen files to drift out of step with what they
   each need to clear (found marks, scores, glass position, spoken lines, phases).
   The boot cover comes back with it, so the reload reads as the activity restarting
   rather than as a flash of empty page.

   THE ARROW IS LEFT ALONE. The page is already consumed, so a reader who replays an
   activity is not re-earning their way out of the page; they can leave whenever they
   like, exactly as they could before they tapped. */
function replayActivity() {
  if (!lbdStage || !isActivityPage(flipped)) return;
  lbdReplaying = true;                 // being played right now — it needs the pointer
  syncLbdDone();                       // …so hand the input back to it
  lbdLoadedIdx = -1;                   // ensureLbdLoaded early-returns without this
  lbdFrameLoadedIdx = -1;
  ensureLbdLoaded();                   // re-covers with the poster, then reloads
}

/* WHO OWNS THE POINTER ON AN ACTIVITY PAGE.
   ------------------------------------------------------------------------
   One surface, two claimants: the activity needs drags (a drag IS the magnifying
   glass) and the book needs them to turn pages. The rule is the forward gate:

     gate SHUT  → the activity owns it. There is a task in front of the child and
                  the page is not going anywhere yet.
     gate OPEN  → the book owns it: a drag turns the page, a tap replays (tapReplay).

   That covers all three ways a gate can be open — just completed, a page revisited
   after being completed earlier, and one replayed and completed again — so the page
   flip works in every one of them rather than only straight after the first finish.

   `lbdReplaying` is the single exception, and it has to exist: replaying a CONSUMED
   activity leaves the gate open (the reader has already paid for the page and is not
   being charged twice), so without it the rule would hand the pointer to the book and
   the activity the child just asked to play again would be untouchable. It is set by
   replayActivity and cleared the moment that replay reports completion. */
function syncLbdDone() {
  if (!lbdStage) return;
  const bookOwnsIt = !advanceLocked && !lbdReplaying;
  lbdStage.classList.toggle("done", !!bookOwnsIt);
}
/* Called from the drag handler for a press that never became a drag. */
function tapReplay() {
  if (!lbdStage || !lbdStage.classList.contains("done")) return;  // not a finished activity
  if (animating || lbdFullscreen || !opened || !ready) return;
  replayActivity();
}

/* Activity finished: come back into the page and HAND THE READER THE ARROW.
   This used to call goNext() and turn the page by itself. It no longer does — the
   child decides when to move on, the same as on every other page in the book. Two
   reasons that matters beyond the request: the activity's own closing line ("That's
   correct! The ₹500 note is grey") was being talked over by the page turning
   underneath it, and an automatic flip gave a child no moment to look at what they
   had just got right.
   What replaces it is the ordinary end-of-page signal: the forward gate is already
   open by the time we get here (the "lbd-complete" listener opens it), and
   revealPageTurnCue lights the arrow with the same blink-then-steady-gold-pulse a
   finished video gets, so "your turn" is shown rather than assumed. */
function exitLbd() {
  if (lbdExiting) return;
  lbdExiting = true;
  setLbdFullscreen(false);                // shrink the game back into the page
  setTimeout(function () {
    lbdExiting = false;
    // Cue, don't turn. Deliberately AFTER the shrink: revealPageTurnCue suppresses
    // its cosmetics while lbdFullscreen is set, so cueing any earlier would open the
    // gate silently and the arrow would never light up.
    if (isActivityPage(flipped)) revealPageTurnCue(null);
  }, 470);                                // just after the shrink transition (.4s)
}
// Listen for the game's messages (start → fullscreen, complete → advance).
window.addEventListener("message", function (e) {
  const d = e && e.data;
  if (!d || d.source !== "lbd") return;
  if (d.type === "lbd-start") { uncoverLbd(); setLbdFullscreen(true); }
  else if (d.type === "lbd-complete") {
    // THIS is the activity's gate opening (see the FORWARD GATE section). It has to
    // happen BEFORE exitLbd, because exitLbd's whole job is to call goNext() and
    // goNext refuses to move while the gate is shut — the auto-advance would have
    // been swallowed by the very lock that completing the activity just satisfied.
    clearPageGate();
    setAdvanceLocked(false);
    markConsumed(flipped);       // finished once → coming back does not ask again
    // Finishing it AGAIN on a revisit is what re-earns the nudge. Set before
    // resetIdleHint below, so the ten seconds it starts are allowed to pay out.
    completedThisVisit = true;
    // HAND THE SWIPE BACK TO THE BOOK. Whoever was playing has finished, so the
    // replay exemption ends here and the gate — now open — decides. See syncLbdDone.
    lbdReplaying = false;
    syncLbdDone();
    // START THE TEN SECONDS FROM HERE. Finishing the activity is the reader's last
    // action, so it is where the inactivity clock begins — and it must be restarted
    // SYNCHRONOUSLY with the gate opening. exitLbd only reaches revealPageTurnCue
    // 470ms later, and in that window the nudge's own re-check would find the gate
    // suddenly open and throw the hand up half a second after the child answered.
    if (typeof resetIdleHint === "function") resetIdleHint();
    exitLbd();
  }
});

let opened = false;      // has the cover been opened?
let ready  = false;      // has the cover FINISHED opening? (flips allowed only then)
let ended  = false;      // has the reader reached THE END (book closed on the last flip)?
let flipped = 0;         // how many leaves are currently turned to the left
let animating = false;   // guard so a new turn can't start mid-flip
const FLIP_MS = 1150;    // keep in sync with --flip-ms in styles.css
const COVER_OPEN_MS = 6000;  // keep in sync with the coverOpen animation in styles.css
const CLOSE_SETTLE_MS = 560;  // keep in sync with the bookSettle animation in styles.css
const COVER_CLOSE_MS  = 2000; // Home: cover swings shut (reverse open); sync with coverClose in styles.css
let _openTimer = null;   // pending "cover finished opening" timer
/* Pending "the title sting has finished, page 1 may speak" timer. Cleared by every
   route that leaves the opening behind (Replay, Home, the page picker), so a held
   page-1 start can never fire over whatever the reader went to instead. */
let _page1Timer = null;
let _endTimer  = null;   // pending THE END timer
let _homeTimer = null;   // pending "cover finished closing → back to the cover" timer

/* ---- Responsive: scale the FIXED 1280x720 book to fit the viewport --------
   ORIGINAL fit — 96% of width / 84% of height — so the book size and the arrows
   (which stay at the viewport's bottom corners, via CSS) look exactly as before.
   The ONLY addition is a safeguard on SHORT screens: never let the book grow so
   tall that it covers the bottom controls. That safeguard changes nothing on
   normal/large screens (there the 0.84 factor is the smaller of the two); it only
   shrinks the book a little on small screens so the arrows + progress stay visible.
   Only this CSS transform scale changes, so the paper curl is never distorted. */
function fitScale() {
  const CTRL = 64;                                   // min top/bottom room kept for the controls
  const availW = window.innerWidth * 0.88;           // leave breathing space on the left + right
  const availH = Math.min(window.innerHeight * 0.80, window.innerHeight - CTRL * 2);
  const s = Math.min(availW / 1280, availH / 720);
  flipScaleEl.style.setProperty("--book-scale", s.toFixed(4));
  // keep the page-turn hint glued to the forward arrow when the viewport changes
  if (flipHint && flipHint.classList.contains("show")) positionFlipHint();
}

/* ---- Render / stacking for the CSS leaf flip ---------------------------- */
// A TURNED leaf sits to the left (rotateY -180deg, showing its blank back over
// the cover); an UN-turned leaf lies flat on top of the cover. z-index keeps the
// current (top un-turned) page in front, and stacks more-recently turned leaves
// above earlier ones on the left pile.
function updateZ() {
  leaves.forEach(function (leaf, i) {
    leaf.style.zIndex = (i < flipped) ? (200 + i) : (100 - i);
  });
}
/* ---- LEAF WINDOWING — keep the GPU texture budget in bounds ----------------
   Every leaf is a composited surface inside one preserve-3d context, and each
   one carries a full-page video or poster. Thirty of them is far more layer
   memory than a real machine's texture budget: when it overflows the browser
   EVICTS textures, and an evicted layer repaints BLANK. That shows up as pages
   that are intermittently empty on real hardware while devtools looks clean,
   because devtools isn't under the same memory pressure.
   So: only leaves within RENDER_WINDOW of the reader stay rendered. Everything
   further out is GUARANTEED occluded — turned leaves are buried under the ones
   turned after them on the left pile, and un-turned leaves lie flat beneath the
   current page — so hiding them changes nothing visually while releasing their
   layers (`visibility: hidden` stops rasterisation, `will-change: auto` drops
   the promotion hint; both live on .leaf.dormant in styles.css).
   The window must cover every leaf the flip machinery can touch: a forward turn
   animates leaves[flipped-1] and a backward drag grabs leaves[flipped-1] before
   `flipped` moves, so 2 either side is the smallest safe radius. */
const RENDER_WINDOW = 2;
function applyLeafWindow() {
  for (let i = 0; i < leaves.length; i++) {
    leaves[i].classList.toggle("dormant", Math.abs(i - flipped) > RENDER_WINDOW);
  }
}

function renderLeaves() {
  leaves.forEach(function (leaf, i) {
    if (i < flipped) leaf.classList.add("flipped");
    else             leaf.classList.remove("flipped");
  });
  updateZ();
  applyLeafWindow();          // re-window on EVERY navigation
}

/* ---- Per-page media -----------------------------------------------------
   Play the CURRENT page's video (pause every other), and pop the current page's
   speech bubble in ONCE, only after the page has fully settled. Called after
   each flip completes and once the cover has finished opening. */
let mediaDelayTimer = null;   // pending "start this video after N ms" timer
let mediaDelayIdx = -1;       // which page that pending timer belongs to
let lastMediaIdx = -1;        // last page refreshMedia handled (to arm the blink once)
let armBlink = false;         // allow the video-end arrow blink ONCE per page arrival

function playVideoNow(v) {
  try {
    v.preload = "auto";                       // make sure it's buffering before we play
    if (v.ended) v.currentTime = 0;
    v.muted = false;                          // try WITH sound (primed in the Play gesture)
    const p = v.play();
    if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); });
  } catch (_) {}
}

/* Buffer ONE page's video on demand (only the pages around the reader are ever
   warmed, so we never spin up all 25 decoders at once). */
function warmVideo(i) {
  const leaf = leaves[i];
  if (!leaf) return;
  const v = leaf.querySelector("video.page-media");
  if (v && v.preload !== "auto") {
    // The reader got here before the background preloader did: let the element's
    // own stream win and cancel the preloader's copy, so the clip isn't fetched twice.
    if (preloadYield) preloadYield(v.getAttribute("src"));
    v.preload = "auto"; try { v.load(); } catch (_) {}
  }
}
// Set by the preloader once it exists (it is defined much further down).
let preloadYield = null;

/* A video the reader has already started streaming. The background preloader must
   NOT swap its src to a blob — that would restart the clip mid-play. */
function videoEngaged(v) {
  return v.preload === "auto" || v.readyState > 0 || !v.paused;
}

/* Posters are left unset in the markup and handed out by the preloader. Since the
   book now opens before the background preload has finished, a page reached early
   takes its poster straight from the file instead of showing a blank page. */
function ensurePoster(i) {
  const leaf = leaves[i];
  if (!leaf) return;
  const v = leaf.querySelector("video.page-media");
  if (v && !v.getAttribute("poster") && v.dataset.poster) v.setAttribute("poster", v.dataset.poster);
  const im = leaf.querySelector("img.page-media");
  if (im && !im.getAttribute("src") && im.dataset.poster) im.src = im.dataset.poster;
}

/* Hand ONE page's video back.
   ------------------------------------------------------------------------
   warmVideo() raises preload to "auto" and NOTHING used to lower it again, so
   every video the reader walked past kept its buffer and kept downloading. By
   the last page all 14 were resident at once (~107s of 1080p) — exactly the
   "all 25 decoders" case the warming was meant to avoid, just reached
   gradually instead of instantly. The result was the video that actually needs
   to play competing for bandwidth and memory with a dozen it doesn't, which is
   what showed up as pages hanging.

   preload="none" ON ITS OWN DOES NOT FREE AN ALREADY-BUFFERED STREAM — the
   element has to be detached from its source and reloaded. So: drop the src,
   load() to abort the fetch and release the buffer, then put the src back with
   preload already at "none" so restoring it doesn't start a new download. The
   page can be re-warmed later at the usual one-page notice.

   `primed` is deliberately NOT cleared: a media element stays gesture-unlocked
   across a reload, and re-priming outside a gesture would just be a rejected
   play() we then have to swallow. */
function releaseVideo(i) {
  const leaf = leaves[i];
  if (!leaf) return;
  const v = leaf.querySelector("video.page-media");
  if (!v || v.preload === "none") return;       // already released, nothing to do
  const src = (pages[i] && pages[i].src) || v.currentSrc || v.getAttribute("src");
  try {
    v.pause();
    v.preload = "none";                          // set FIRST, so restoring src won't fetch
    v.removeAttribute("src");
    v.load();                                    // aborts the fetch, frees the buffer
    if (src) v.src = src;                        // ready to be warmed again later
  } catch (_) {}
}

/* How far either side of the reader a video is allowed to stay buffered. 1 keeps
   the next page instant and the previous page instant to go back to; everything
   further out is released. Raise it only if you would rather hold more memory. */
const MEDIA_WINDOW = 1;

/* Unlock ONE page's video for instant, sound-enabled playback: a muted
   play()→pause() done INSIDE a user gesture. We prime only the page being shown
   and the next one — priming all 25 at once was the opening lag. */
function primeVideo(i) {
  const leaf = leaves[i];
  if (!leaf) return;
  const v = leaf.querySelector("video.page-media");
  if (!v || v.dataset.primed) return;
  v.dataset.primed = "1";
  try {
    v.muted = true; v.preload = "auto";
    const p = v.play();                       // start within the gesture → element is "activated"
    if (p && p.catch) p.catch(function () {});
    v.pause();                                // pause synchronously
    v.currentTime = 0;
  } catch (_) {}
}

function refreshMedia() {
  const idx = flipped;                         // the front-most page right now
  // ARRIVAL, not merely "this ran again". refreshMedia() fires several times per
  // page — at the start of a flip AND once it settles, when the cover finishes
  // opening, and after a drag that was ABANDONED (endDrag calls it whether or not
  // the page turned). Only the first of those is the reader reaching a new page,
  // and the forward gate below keys off this flag for exactly that reason.
  const arrived = (idx !== lastMediaIdx);
  if (arrived) { lastMediaIdx = idx; armBlink = true; }   // arm the video-end blink once per page
  // Left the page a delayed video was counting down on? Cancel that countdown.
  if (mediaDelayTimer && mediaDelayIdx !== idx) {
    clearTimeout(mediaDelayTimer); mediaDelayTimer = null; mediaDelayIdx = -1;
  }
  // Buffer + gesture-unlock ONLY this page and the next (so the upcoming flip is
  // instant and keeps sound) — never all 25 videos at once.
  ensurePoster(idx - 1); ensurePoster(idx); ensurePoster(idx + 1);
  warmVideo(idx); warmVideo(idx + 1); primeVideo(idx + 1);
  // Pause every video that is NOT the current page, and hand back the ones the
  // reader has moved away from. Without the release the warmed set only ever
  // grew, so the further into the book you read the more streams were competing
  // with the one you were actually watching.
  leaves.forEach(function (leaf, i) {
    if (i === idx) return;
    const v = leaf.querySelector("video.page-media");
    if (v) { try { v.pause(); } catch (_) {} }
    if (i < idx - MEDIA_WINDOW || i > idx + MEDIA_WINDOW) releaseVideo(i);
  });
  // Start (or schedule) the current page's video.
  const cur = leaves[idx];
  const v = cur && cur.querySelector("video.page-media");
  // WATCHDOG (re-armed per page): the third route to the page-turn cue, so a clip
  // that stalls or is blocked can never strand the reader. Cleared for pages with
  // no video of their own (the activities), where resetIdleHint() takes over.
  if (v) armVideoWatchdog(idx, v); else clearVideoWatchdog();
  /* REVISITING A PAGE STARTS IT OVER. Re-locking the forward gate is only honest if
     the page really does begin again, and playVideoNow() rewinds only a clip that
     reached its `ended` state. That left one route through: leave a scene PART-WAY
     (the page picker is the only way out of a gated page, so this is the normal way
     it happens) and coming back resumed at 17s of an 18.8s clip — gate shut, but open
     again 1.8s later. The gate looked right and the rule behind it had been skipped.
     A clip released for being far from the reader is reloaded from 0 by releaseVideo()
     and so was never affected, which is exactly why this only showed up on the pages
     NEAREST the one you jumped from.
     Rewind on ARRIVAL only — never on a re-assert, or an abandoned drag would kick the
     scene back to the start under the reader. The other two page types already reset
     themselves on arrival: an activity's iframe is unloaded on the way out and reloads
     at its own opening state, and an image page's dwell is a fresh timer every time. */
  if (arrived && v) { try { v.currentTime = 0; } catch (_) {} }
  if (v) {
    const delayMs = (pages[idx] && pages[idx].delay) ? pages[idx].delay : 0;
    if (delayMs > 0) {
      // Already playing this page, or already counting down for it → leave it alone
      // (so the flip-start + flip-end calls don't restart the 3s countdown).
      if (mediaDelayIdx === idx && (mediaDelayTimer || !v.paused)) { /* keep going */ }
      else {
        try { v.pause(); v.currentTime = 0; } catch (_) {}   // hold on the first frame
        mediaDelayIdx = idx;
        mediaDelayTimer = setTimeout(function () {
          mediaDelayTimer = null;
          if (flipped === idx) playVideoNow(v);               // only if still on this page
        }, delayMs);
      }
    } else {
      playVideoNow(v);                          // no delay → instant
    }
  }
  // Arm the forward gate for the page just LANDED ON — `arrived` only, never on a
  // re-assert. Guarding this was not optional: endDrag() calls refreshMedia() even
  // when the drag was abandoned and the page snapped back, so an unguarded re-arm
  // meant nudging the page a few pixels shut the gate on a scene the reader had
  // already watched to the end. It also meant the flip's own settle call could clear
  // the gold cue and re-lock a short clip that finished during the 1.15s turn.
  // Nothing is lost by skipping the re-asserts: the unlock in revealPageTurnCue no
  // longer waits on `ready`, so a page-1 clip that ends inside the 6s cover-open
  // opens the gate on its own and does not need a later pass to notice.
  // Must come AFTER the video has been started/scheduled above, and after
  // armVideoWatchdog, whose timer is one of the three routes that opens it again.
  if (arrived && typeof gateAdvance === "function") gateAdvance(idx);
  // The music's fallback route in: a reader who reached a page BEYOND page 2 without
  // its scene ever finishing (the page picker jumps straight there) would otherwise
  // read the whole book in silence. No-op once the music is already playing.
  if (arrived && typeof bgMusicOnArrival === "function") bgMusicOnArrival(idx);
  // …and step the music aside on a page that brings its own (the game), or bring it
  // back on the way out. See updateBgmForPage().
  if (arrived && typeof updateBgmForPage === "function") updateBgmForPage(idx);
  // Per-page audio. AFTER the video has been started above, because updatePageVo()
  // reads v.paused to decide whether to start in sync now or wait for the clip's
  // "play" event — see the PER-PAGE AUDIO section.
  if (typeof updatePageVo  === "function") updatePageVo();
  if (typeof updatePageSfx === "function") updatePageSfx();
  updateLbdOverlay();                           // show/hide the embedded LBD game
  // Right-side page stack shrinks toward the end: 3 sheets → … → 0 on the last page.
  if (pageStackEl) pageStackEl.dataset.count = String(Math.max(0, Math.min(3, totalPages - 1 - flipped)));
  // Restart the 10s inactivity countdown for the page we've just landed on (uses the
  // NEW `flipped`, so it reads that page's own video, if any, to decide where to
  // start counting from).
  if (typeof resetIdleHint === "function") resetIdleHint();
}

/* ---- Navigation (drives the CSS leaf flip) ------------------------------ */
function turnLeaf(leaf) {                 // shared flip visuals + timing
  leaf.style.zIndex = 300;               // lift the turning sheet above everything
  leaf.classList.add("flipping");        // enables the moving curl shading
  renderLeaves();
  refreshMedia();                        // START now → the target video plays INSTANTLY
                                          // (as the page is revealed, not after the flip)
  playFlip();
  updateProgress();
  setTimeout(function () {
    leaf.classList.remove("flipping");
    animating = false; updateZ(); updateProgress();
    refreshMedia();                      // re-assert once settled (idempotent safety net)
    if (flipped >= totalPages) endBook(); // the LAST page just turned left → close to THE END
  }, FLIP_MS + 40);
}
function goNext() {
  if (!opened || !ready || animating) return;   // wait until the cover has fully opened
  // Gated on an unfinished video (see the FORWARD GATE section). Guarding goNext
  // rather than only the button covers the arrow, the ArrowRight key and the
  // forward swipe in one place — a disabled arrow next to a working swipe would
  // just look broken. Back, Home and the page picker are untouched.
  if (advanceLocked) return;
  if (flipped >= totalPages) return;             // already fully closed (THE END)
  animating = true;
  const leaf = leaves[flipped];                  // the page to turn (the LAST real page closes the book)
  flipped++;                                     // reaching totalPages → turnLeaf's settle fires endBook()
  turnLeaf(leaf);
}
function goPrev() {
  if (!opened || !ready || animating) return;   // wait until the cover has fully opened
  if (flipped <= 0) return;               // already on the first page
  animating = true;
  flipped--;
  turnLeaf(leaves[flipped]);
}

/* ---- Nav state (page counter removed) ----------------------------------- */
function updateProgress() {
  if (cornerPrev) cornerPrev.disabled = !ready || flipped <= 0;   // grey the back corner at page 1
  // Forward stays live on the last page (→ THE END), but is held while the current
  // page's video is still playing — see the FORWARD GATE section.
  if (cornerNext) cornerNext.disabled = !ready || advanceLocked;
  // Keep the page picker honest however the reader actually got here (arrows,
  // drag, Home, Replay, the activity's auto-advance). Skipped while it has focus
  // so we never fight someone mid-choice.
  if (pageSelect && document.activeElement !== pageSelect) {
    pageSelect.value = ended ? "end" : (opened ? String(flipped) : "cover");
  }
}

/* ---- Fullscreen: REMOVED for the flipbook ----------------------------------
   Opening the book used to call the browser's Fullscreen API on
   document.documentElement (and leave fullscreen again on Home / Replay), so
   tapping Play threw the whole page into fullscreen. That is gone: the book now
   opens in the page, at whatever size the window already is. fitScale() was
   always doing the real work of sizing the 1280x720 stage to the viewport, so
   nothing about the layout depended on it.
   NOTE — this removes it from the FLIPBOOK ONLY. The activity overlay keeps its
   own, separate expand-to-fill-the-screen behaviour (setLbdFullscreen /
   .lbd-stage.fullscreen), which is a CSS box-morph of the iframe rather than the
   Fullscreen API and is untouched. */

/* ---- Open the 3D cover, then hand off to the page-turning book ----------
   Shared by the first open (openBook) AND Replay (replayBook), so the dramatic
   hinge-open + post-open setup are identical both times. */
function runOpenSequence() {
  ended = false; ready = false;
  document.body.classList.remove("is-closing", "is-ended", "end-settled");
  if (endOverlay) { endOverlay.classList.remove("show", "flipped"); endOverlay.setAttribute("aria-hidden", "true"); }
  if (backCoverScene) backCoverScene.classList.remove("centered");
  document.body.classList.add("is-open");
  // The whole open motion IS the cover's own hinge — NO zoom / camera move.
  book.classList.remove("closing");
  book.classList.add("open");          // cover hinges open on the LEFT spine
  bookFloat.classList.add("rest");     // stop the idle bob
  coverScene.classList.remove("parked");
  flipbookEl.style.zIndex = "";        // cover ABOVE the pages while it swings open
  // Reveal the REAL page right away (it sits beneath the cover, masked by it).
  flipbookEl.classList.add("show");
  // A user gesture drives every open, so start audio here.
  soundOn();
  resumeAudio();
  playCoverFlip();
  // The music does NOT start here any more — it comes in when page 2's scene
  // finishes. See startBgMusicOnce().
  primeVideo(0); primeVideo(1);         // unlock page 1 + 2 inside the gesture

  /* THE COVER OPENS NOW; PAGE 1 WAITS FOR THE TITLE.
     The sting cannot autoplay on a first visit (browsers refuse audible playback
     before the reader has interacted), so it fires on the first gesture — usually
     this button. This used to call stopTitleVo() and cut it dead, because page 1's
     narration starts at 0.0s (measured, -18 LUFS from its very first frame) and the
     two would talk over each other.
     Holding the whole open back until the sting finished fixed the audio and broke
     the feel: 2.5s of nothing after tapping Play. So only page 1's MEDIA waits. The
     cover hinges open immediately, the title plays over it, and the scene starts
     with the animation still running — the open takes ~6s, so a ~2.5s hold is spent
     entirely behind a cover that is still swinging, and the reader actually sees
     MORE of page 1 than before rather than less.
     Capped by titleStingRemaining(), and 0 whenever the title has already been heard
     (a tap on the cover first, or a repeat visit where autoplay was allowed). */
  const titleWait = titleStingRemaining();
  clearTimeout(_page1Timer);
  if (titleWait > 0) {
    _page1Timer = setTimeout(function () { if (opened) refreshMedia(); }, titleWait);
  } else {
    stopTitleVo();                      // nothing to hear — page 1 speaks now
    refreshMedia();                     // start the page-1 video right away
  }
  // Once the cover has FULLY opened, park it, lift the pages above it, hand over
  // pointer events, and mark the book READY.
  clearTimeout(_openTimer);
  _openTimer = setTimeout(function () {
    coverScene.classList.add("parked");
    flipbookEl.style.zIndex = "5";        // pages now sit ABOVE the parked cover (z3)
    tapCatcher.style.pointerEvents = "none";
    flipbookEl.style.pointerEvents = "auto";
    ready = true;
    updateProgress();
    refreshMedia();
    resetIdleHint();
  }, COVER_OPEN_MS + 50);
  updateProgress();
}
function openBook() {
  // START GATE — guard the function itself, not just the button. The button is
  // hidden until the preloader finishes, but Enter/Space on a focused element,
  // the ArrowRight shortcut and any programmatic call all land here too.
  if (!assetsReady) return;
  console.log("[Pari's Birthday Treasure] openBook() called — opened was:", opened);
  if (opened) return;
  opened = true;
  runOpenSequence();          // opens in-page — no fullscreen request
}

/* ---- THE END: the LAST page has just turned left (a normal page flip). Now the
   BACK COVER flips LEFT over the spine (like a page), landing shut, then the closed
   book SLIDES to the CENTRE — showing only "THE END" + a gold Replay on a plain
   dark back cover. (Replay spins the book back to the start.) ------------- */
function endBook() {
  if (!opened || ended) return;
  ended = true; ready = false; animating = false;   // block all flips
  clearTimeout(_openTimer); clearTimeout(_page1Timer);
  hideFlipHint();
  clearTimeout(idleHintTimer); clearTimeout(nudgeHideTimer);
  // "cue" belongs in this list too: unlike .blink1 it is an INFINITE animation with
  // no self-clearing timeout, so leaving it on meant the forward arrow kept pulsing
  // behind the closed book and was still pulsing on the next page the reader landed on.
  if (cornerNext) cornerNext.classList.remove("blink", "blink1", "cue");
  clearPageGate(); clearVideoWatchdog();     // no page is being consumed any more
  var v = currentVideo(); if (v) { try { v.pause(); } catch (_) {} }
  // Drop the open cover to its closed base underneath (hidden by the back cover),
  // so Replay's spin can re-run the open cleanly.
  book.classList.remove("open");
  coverScene.classList.remove("parked");
  flipbookEl.style.pointerEvents = "none";
  tapCatcher.style.pointerEvents = "none";
  document.body.classList.add("is-ended");   // hides the play button + flip arrows + all but the back cover
  updateProgress();                           // re-sync the chrome (and the page picker) for THE END
  playCoverFlip();                            // soft close whoosh
  // STEP 1: back cover flips LEFT over the spine (rotateY 0 → -180), landing shut.
  // STEP 2: the closed book slides right into the centre.
  if (endOverlay) {
    endOverlay.classList.add("show");
    endOverlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { endOverlay.classList.add("flipped"); });   // flip left
    setTimeout(function () {                                                        // then slide to centre
      document.body.classList.add("end-settled");   // NOW hide the pile (the shut cover is covering it)
      if (backCoverScene) backCoverScene.classList.add("centered");
    }, 1180);
  }
}

/* ---- Reset the whole book to the START SCREEN: the CLOSED FRONT COVER + Play
   button, exactly like a fresh load (so tapping Play reads from the top). Shared
   by Replay and Home. ----------------------------------------------------- */
function resetToStart() {
  ended = false; ready = false; opened = false; flipped = 0;
  renderLeaves();
  leaves.forEach(function (leaf) {
    var vv = leaf.querySelector("video.page-media");
    if (vv) { try { vv.pause(); vv.currentTime = 0; } catch (_) {} }
  });
  lastMediaIdx = -1;
  /* FULL RESET, not just the page number. Everything below is per-session state that
     used to survive a Replay, so the second read-through started somewhere between
     "fresh" and "wherever the reader left off":
       • the forward gate itself — left shut by the page we replayed from, the reader
         would have opened the book onto a dead arrow that only the page-1 clip ending
         could revive;
       • the gate's pending timers, and the video watchdog, which would then fire
         against a page index the reader is no longer on;
       • a delayed video's countdown (pages carrying `delay`), which would start a clip
         on a book that is now closed;
       • the activity overlay — resetLbd unloads the iframe, so a replay cannot land
         back inside a half-played game, and the next visit opens at its own splash;
       • the arrow's cue animation, for the reason given in endBook.
     Consumption itself needs no clearing: the gate remembers nothing across visits
     (see the FORWARD GATE section), so a replayed page re-arms simply by being landed on. */
  clearPageGate(); clearVideoWatchdog();
  lbdTurning = false;
  setAdvanceLocked(false);
  // Forget which pages have been seen, so the second read-through gates every page
  // again exactly like the first. Without this, Replay would hand back a book whose
  // every scene was already skippable — which is the one thing TSN-027 is about.
  for (const k in consumed) delete consumed[k];
  if (cornerNext) cornerNext.classList.remove("blink", "blink1", "cue");
  if (mediaDelayTimer) { clearTimeout(mediaDelayTimer); mediaDelayTimer = null; }
  mediaDelayIdx = -1;
  lbdExiting = false;
  resetLbd();
  updateLbdOverlay();          // opened is false now → collapses + hides the overlay
  if (backCoverScene) backCoverScene.classList.remove("centered");
  if (endOverlay) { endOverlay.classList.remove("show", "flipped"); endOverlay.setAttribute("aria-hidden", "true"); }
  document.body.classList.remove("is-open", "is-closing", "is-ended", "end-settled");
  book.classList.remove("open", "closing");
  coverScene.classList.remove("parked");
  cover.style.transform = "";                 // cover CLOSED → front cover + Play button showing
  flipbookEl.classList.remove("show");         // pages hidden behind the closed cover
  flipbookEl.style.zIndex = "";
  flipbookEl.style.pointerEvents = "none";
  bookFloat.classList.remove("rest");          // resume the idle bob
  tapCatcher.style.pointerEvents = "auto";     // Play is tappable again
  hideFlipHint(); clearTimeout(idleHintTimer); clearTimeout(nudgeHideTimer);
  // Stop the music and RE-ARM it, so the second read-through gets the same entrance
  // (in after page 2's scene) rather than either silence or an instant restart.
  try { bgMusic.pause(); bgMusic.currentTime = 0; } catch (_) {}
  bgmStarted = false;
  restartTitleVo();                            // the cover is back on screen → re-announce the title
  updateProgress();                            // hides the progress read-out (not opened)
}

/* ---- CLOSE THE BOOK: the cover swings SHUT — the exact REVERSE of the opening
   hinge (cover −180 → 0) — and the book lands on the front cover. `afterReset`
   runs once we're back on the cover.
   Called by REPLAY (from THE END page) only. It used to be shared with HOME, which
   is why the timer it clears is still called _homeTimer — that name is historical;
   the timer itself is live and is what Replay waits on for the close to finish. */
function closeBookToCover(afterReset) {
  ready = false;                               // block flips during the close
  clearTimeout(_openTimer); clearTimeout(_page1Timer);
  clearTimeout(_homeTimer);
  hideFlipHint(); clearTimeout(idleHintTimer); clearTimeout(nudgeHideTimer);
  // "cue" belongs in this list too: unlike .blink1 it is an INFINITE animation with
  // no self-clearing timeout, so leaving it on meant the forward arrow kept pulsing
  // behind the closed book and was still pulsing on the next page the reader landed on.
  if (cornerNext) cornerNext.classList.remove("blink", "blink1", "cue");
  clearPageGate(); clearVideoWatchdog();     // no page is being consumed any more
  var v = currentVideo(); if (v) { try { v.pause(); } catch (_) {} }
  // Cut the per-page channels here rather than leaving it to updatePageVo/Sfx:
  // `flipped` is about to be reset out from under them, so their own "left the
  // page" branch would never fire and a narration would carry on over the cover.
  if (typeof stopPageAudio === "function") stopPageAudio();
  // pages back UNDER the cover, so the closing cover sweeps over them
  flipbookEl.style.zIndex = "";
  flipbookEl.style.pointerEvents = "none";
  tapCatcher.style.pointerEvents = "none";
  coverScene.classList.remove("parked");
  // CLOSE — reverse of the opening hinge (cover swings from -180 back to 0).
  // is-closing keeps the current page bright (hides the dark thickness block) and
  // hides the turned-page pile, so the cover folds cleanly with no stray left page.
  document.body.classList.add("is-closing");
  book.classList.remove("open");
  book.classList.add("closing");
  playCoverFlip();
  _homeTimer = setTimeout(function () {
    resetToStart();
    if (typeof afterReset === "function") afterReset();
  }, COVER_CLOSE_MS + 60);
}

/* ---- REPLAY (gold icon on the back cover): ONE flip — the closed book turns
   edge-on, we swap the back cover (THE END) for the START COVER at that instant,
   then it completes the flip and lands on the front cover, restarting the story. */
function replayBook() {
  if (!ended) return;
  clearTimeout(_endTimer);
  playCoverFlip();
  // is-replaying snaps the cover/back-cover swap INSTANTLY (kills the per-layer
  // fade/slide transitions) so nothing ghosts or slides on the side mid-flip.
  document.body.classList.add("is-replaying");
  // PHASE A: the book (THE END) flips to edge-on.
  bookStage.classList.remove("replay-flip-a", "replay-flip-b");
  void bookStage.offsetWidth;                 // restart the animation cleanly
  bookStage.classList.add("replay-flip-a");
  // At edge-on: swap to the START COVER, then flip it in from the other side so it
  // lands upright (never mirrored).
  setTimeout(function () {
    resetToStart();                            // (re-fires the cover title sting)
    bookStage.classList.remove("replay-flip-a");
    void bookStage.offsetWidth;
    bookStage.classList.add("replay-flip-b");
    setTimeout(function () {
      bookStage.classList.remove("replay-flip-b");
      document.body.classList.remove("is-replaying");
    }, 360);
  }, 320);                                     // == replayFlipA duration
}

/* ==========================================================================
   PAGE PICKER  —  the dropdown parked outside the book (top-left in index.html).
   Options are built from `pages`, so adding, removing or retitling a page keeps
   the list correct with no extra work here.
   ========================================================================== */

/* Land on a page IMMEDIATELY — no cover swing, no page-turn animation. A picker
   should arrive, not travel. This also rescues the book from any other state it
   might be in (still shut, mid-flip, or settled on THE END), which is why it
   asserts the whole open-reading state rather than assuming we are already there. */
function jumpToPage(idx) {
  if (!assetsReady) return;              // second way into the book — same gate
  idx = Math.max(0, Math.min(totalPages - 1, idx));
  // 1. cancel everything in flight, or a stale timer will fire over the top
  clearTimeout(_openTimer); clearTimeout(_endTimer); clearTimeout(_homeTimer); clearTimeout(_page1Timer);
  clearTimeout(idleHintTimer); clearTimeout(nudgeHideTimer);
  hideFlipHint(); cancelPeek();
  lbdTurning = false;                     // a drag the picker interrupted must not
                                          // leave the next activity suppressed
  if (cornerNext) cornerNext.classList.remove("blink", "blink1");
  bookStage.classList.remove("replay-flip-a", "replay-flip-b");
  // 2. assert the open reading state
  ended = false;
  document.body.classList.remove("is-replaying", "is-closing", "is-ended", "end-settled");
  if (endOverlay) { endOverlay.classList.remove("show", "flipped"); endOverlay.setAttribute("aria-hidden", "true"); }
  if (backCoverScene) backCoverScene.classList.remove("centered");
  document.body.classList.add("is-open");
  book.classList.remove("closing");
  book.classList.add("open");
  bookFloat.classList.add("rest");        // stop the idle bob
  coverScene.classList.add("parked");     // cover already open and out of the way
  cover.style.transform = "";
  flipbookEl.classList.add("show");
  flipbookEl.style.zIndex = "5";          // pages above the parked cover
  flipbookEl.style.pointerEvents = "auto";
  tapCatcher.style.pointerEvents = "none";
  opened = true; ready = true; animating = false;
  soundOn(); resumeAudio();
  // 3. land on the page. Picking from the dropdown is a user gesture, so this is
  //    the moment to unlock the target video for sound.
  flipped = idx;
  primeVideo(idx); primeVideo(idx + 1);
  renderLeaves();
  // A PICK IS ALWAYS AN ARRIVAL, even onto the page we are already on. refreshMedia()
  // decides "arrived" by comparing against lastMediaIdx, so picking the current page
  // out of the dropdown would otherwise change nothing at all — no re-lock, no restart
  // — and "take me to page 12" would silently do nothing while you were on page 12.
  // Clearing it here makes the picker re-arm the gate and restart the page like every
  // other route onto it.
  lastMediaIdx = -1;
  refreshMedia();
  updateProgress();
  resetIdleHint();
}

if (pageSelect) {
  const opts = ['<option value="cover">Cover</option>'];
  pages.forEach(function (p, i) {
    opts.push('<option value="' + i + '">Page ' + (i + 1) +
              (p.title ? " · " + p.title : "") + "</option>");
  });
  opts.push('<option value="end">The End</option>');
  pageSelect.innerHTML = opts.join("");
  pageSelect.value = "cover";
  pageSelect.addEventListener("change", function () {
    const v = pageSelect.value;
    if (v === "cover")    resetToStart();                          // back to the closed cover
    else if (v === "end") { jumpToPage(totalPages - 1); endBook(); } // play the closing sequence
    else                  jumpToPage(parseInt(v, 10));
    pageSelect.blur();    // hand focus back so the arrow keys drive the book again
  });
}

/* ==========================================================================
   INPUT  —  tap PLAY to OPEN the cover; once open, drag + corner arrows +
   keyboard drive the page flip.
   ========================================================================== */
const tapCatcher = document.getElementById("tapCatcher");

// The book opens ONLY from the play button. The tap-catcher still sits on top to
// block page gestures before opening, but it opens the book only when the tap
// lands inside the play button's (breathing) hit-circle — taps elsewhere on the
// cover do nothing.
function tapHitsPlay(e) {
  const r = hint.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const rad = Math.max(r.width, r.height) / 2;
  return Math.hypot(e.clientX - cx, e.clientY - cy) <= rad;
}
if (tapCatcher) tapCatcher.addEventListener("click", function (e) {
  if (opened) return;
  if (tapHitsPlay(e)) { openBook(); return; }
  restartTitleVo();      // tap anywhere else on the cover → re-announce the title
});
// Show the hand (pointer) cursor ONLY when hovering the play button — the sole CTA
// on the cover. Everywhere else on the tap surface stays a normal cursor.
if (tapCatcher) tapCatcher.addEventListener("mousemove", function (e) {
  tapCatcher.style.cursor = (!opened && tapHitsPlay(e)) ? "pointer" : "default";
});

// The play button itself (also covers keyboard: Enter/Space on the focused button).
hint.addEventListener("click", function (e) { e.stopPropagation(); if (!opened) openBook(); });

// Bottom-corner flip arrows (outside the book): back = left, forward = right.
cornerPrev.addEventListener("click", function (e) { e.stopPropagation(); goPrev(); this.blur(); });
cornerNext.addEventListener("click", function (e) { e.stopPropagation(); goNext(); this.blur(); });
if (replayBtn) replayBtn.addEventListener("click", function (e) { e.stopPropagation(); replayBook(); this.blur(); });

// Page interaction — DRAG TO TURN: grab the page and it follows your cursor,
// rotating about the spine, then SNAPS to the nearest state when you let go.
//   • drag LEFT  → turn the current page forward (it comes to rest on the cover)
//   • drag RIGHT → turn the previous page back
// A plain tap does nothing; the corner arrows + keyboard still work.
(function () {
  let startX = 0, startY = 0, pw = 1;
  let leaf = null, dir = 0, decided = false, dragging = false, curlEl = null;
  let lastX = 0, lastT = 0, vx = 0;                   // for flick (velocity) detection
  const DECIDE = 6;                                   // px before we commit to a drag
  const FLICK = 0.45;                                 // px/ms — a quick flick completes the turn
  const FINISH_DEG = 45;                              // turned this far (deg) → completes on release

  // how many degrees the drag has turned the page (0..180)
  function degFromDx(dx) { return Math.max(0, Math.min(180, Math.abs(dx) / pw * 180)); }
  // the live angle for the active leaf, given the raw horizontal travel
  function liveAngle(dx) {
    return (dir === 1) ? degFromDx(Math.min(0, dx))          // forward: leftward turns 0→180
                       : 180 - degFromDx(Math.max(0, dx));   // back: starts at 180, rightward → 0
  }

  flipbookEl.addEventListener("pointerdown", function (e) {
    if (!opened || !ready || animating) return;
    startX = e.clientX; startY = e.clientY;
    lastX = e.clientX; lastT = e.timeStamp || performance.now(); vx = 0;
    decided = false; dragging = true; leaf = null; dir = 0; curlEl = null;
    pw = flipbookEl.getBoundingClientRect().width || 1;
  });

  flipbookEl.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const now = e.timeStamp || performance.now();
    const dt = now - lastT;
    if (dt > 0) vx = (e.clientX - lastX) / dt;         // running horizontal velocity
    lastX = e.clientX; lastT = now;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!decided) {
      if (Math.abs(dx) < DECIDE || Math.abs(dx) <= Math.abs(dy)) return;   // wait for a clear horizontal drag
      // Forward is gated while the page's video is still running — bail before a
      // leaf is picked up, so the page never follows the finger and then snaps
      // back, which would read as the drag being broken rather than withheld.
      if (dx < 0 && advanceLocked) { dragging = false; return; }
      if (dx < 0 && flipped < totalPages) { dir = 1;  leaf = leaves[flipped]; }         // turn forward (last page closes the book)
      else if (dx > 0 && flipped > 0)      { dir = -1; leaf = leaves[flipped - 1]; }    // turn back
      else { dragging = false; return; }                  // nothing to turn that way
      decided = true;
      /* A leaf is now moving. If an activity is up, get it out of the way for the
         length of the turn — it is a body-level overlay pinned over the page rect
         and cannot rotate with the leaf, so leaving it up means the page swings out
         from under a stationary rectangle. The corner arrow already does this via
         `animating`; this is the same hide on the drag's timeline. It only hides —
         the frame stays loaded, so an abandoned drag comes back to the same
         activity in the same state (see updateLbdOverlay). */
      if (isActivityPage(flipped)) { lbdTurning = true; updateLbdOverlay(); }
      leaf.style.transition = "none";                     // follow the finger exactly
      leaf.style.zIndex = 300;
      curlEl = leaf.querySelector(".curl");
      try { flipbookEl.setPointerCapture(e.pointerId); } catch (_) {}
    }
    const ang = Math.max(0, Math.min(180, liveAngle(dx)));
    leaf.style.transform = "rotateY(" + (-ang) + "deg)";
    if (curlEl) curlEl.style.opacity = (ang <= 90 ? ang / 90 : (180 - ang) / 90) * 0.9;
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    const L = leaf, D = dir, C = curlEl;
    leaf = null; curlEl = null;
    // A press that never became a drag is a TAP. On a finished activity that means
    // "play it again" (see tapReplay); anywhere else it still means nothing.
    if (!decided || !L) { tapReplay(); return; }

    const ang = Math.max(0, Math.min(180, liveAngle(e.clientX - startX)));
    // Complete the turn if it's been dragged far enough OR flicked quickly in
    // the turn's direction — no need to drag all the way past halfway.
    const flick = (D === 1) ? (vx < -FLICK) : (vx > FLICK);
    const complete   = (D === 1) ? (ang > FINISH_DEG || flick)
                                 : (ang < 180 - FINISH_DEG || flick);
    const endFlipped = (D === 1) ? complete   : !complete;    // does this leaf end up turned?

    animating = true;
    if (C) C.style.opacity = "";
    if (complete) { playFlip(); flipped += (D === 1) ? 1 : -1; }
    // Lock in the resting classes + z-index NOW (so nothing pops in later), then
    // animate the inline transform from the dragged angle to the target. The
    // .flipped class already holds the same final angle underneath.
    L.style.transition = "";                              // restore the CSS flip transition
    void L.offsetWidth;                                   // reflow so it animates FROM the dragged angle
    L.classList.add("flipping");                          // curl shading during the snap
    renderLeaves();                                       // apply .flipped + z-index immediately
    refreshMedia();                                       // START the target video INSTANTLY
    L.style.transform = endFlipped ? "rotateY(-180deg)" : "rotateY(0deg)";
    updateProgress();

    setTimeout(function () {
      L.classList.remove("flipping");
      // Drop the inline transform WITHOUT re-animating: the .flipped class already
      // holds the final angle, so disabling the transition for this swap prevents
      // the leaf from briefly swinging back (the "page reappears on the left" glitch).
      L.style.transition = "none";
      L.style.transform = "";
      void L.offsetWidth;                                 // commit with no transition
      L.style.transition = "";                            // restore for the next turn
      animating = false; updateProgress();
      lbdTurning = false;                                 // the turn is over — BEFORE the refresh
                                                          // below, which is what puts the
                                                          // overlay back up (or loads the next one)
      refreshMedia();                                     // re-assert once settled (idempotent safety net)
      if (flipped >= totalPages) endBook();               // dragged the LAST page left → close to THE END
    }, FLIP_MS + 40);
  }
  flipbookEl.addEventListener("pointerup", endDrag);
  flipbookEl.addEventListener("pointercancel", endDrag);
})();

window.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") { e.preventDefault(); opened ? goNext() : openBook(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  else if ((e.key === " " || e.key === "Enter") && !opened) { e.preventDefault(); openBook(); }
});

// Keep the canvas scaled to fit on resize / rotate.
let _resizeSettle = null;
function onViewportChange() {
  // Suppress the page-turn transitions while the viewport is actively changing, so
  // a rapid resize / resolution change can't make the book LOOK like it's auto-
  // flipping (the leaves re-render during the scale change). Restored once settled.
  document.body.classList.add("is-resizing");
  clearTimeout(_resizeSettle);
  _resizeSettle = setTimeout(function () { document.body.classList.remove("is-resizing"); }, 220);
  fitScale();
  // Re-park the LBD overlay over the (re-scaled) page — unless it's fullscreen,
  // where it already fills the viewport via CSS.
  if (lbdStage && lbdStage.classList.contains("visible") && !lbdFullscreen) positionLbdStage();
}
window.addEventListener("resize", onViewportChange);
window.addEventListener("orientationchange", onViewportChange);

/* ---- Block ALL zoom (pinch, double-tap, ctrl+wheel, ctrl +/-) ------------
   The book is fixed-layout, so zoom would only break it. */
(function () {
  // Never let anything (esp. page images) start a native HTML5 drag — that was
  // showing a "ghost" of the image following the cursor during a page-flip drag.
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (t) {   // iOS pinch
    document.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false });
  });
  window.addEventListener("wheel", function (e) {                          // desktop ctrl+wheel
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });
  window.addEventListener("keydown", function (e) {                        // ctrl/⌘ +/-/0
    if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].indexOf(e.key) !== -1) e.preventDefault();
    // Block "Save page" (Ctrl/⌘+S) — a casual way to grab the media.
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) e.preventDefault();
  });
  document.addEventListener("touchmove", function (e) {                    // 2-finger pinch
    if (e.touches && e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  // NOTE: the right-click / context menu is intentionally LEFT ENABLED (so "Inspect"
  // and dev tools work). Casual image protection still stands via CSS — no drag,
  // no text-selection, no iOS long-press "Save Image" callout — plus Ctrl+S is blocked.
})();

/* ==========================================================================
   SOUND  —  real audio files in sfx/, all Ogg/Opus @64k: Page flip.ogg (every
   page flip), cover page flip.ogg (the cover opening), BGM.ogg (looping
   background music, silent by default — see BGM_VOLUME) and
   Pari's Birthday Treasure.ogg (the COVER title sting). Flip/cover sounds are
   muted until the book is opened (a user gesture); the cover sting is not — it is
   the sound of the cover itself.
   ========================================================================== */
let muted = true;

/* ---- COVER TITLE SFX  —  "Pari's Birthday Treasure" -----------------------
   The title sting that belongs to the CLOSED COVER. It fires:
     • automatically the moment the book appears on screen (page load, and again
       after Replay / Home bring the cover back), and
     • on EVERY tap anywhere on the cover page (see the tapCatcher handler).
   Browsers BLOCK audible autoplay before any user interaction, so if the
   load-time attempt is refused it fires on the very first user gesture
   (tap / key / touch) instead.
   ONE encoding now ships: Ogg/Opus. It replaced BOTH the old .mp3 and the
   Ogg/Vorbis "fallback" that sat next to it — the probe below only ever chose the
   .ogg if mp3 were unplayable, which no shipping browser does, so the second file
   was pure dead weight in the deploy.
   Support: Chrome, Edge, Firefox, and Safari 17.4+ / iOS 17.4+.

   UPDATE — the mp3 siblings are BACK, for the other direction. The note above is
   right that no browser lacks mp3; what it missed is Safari and iPadOS BEFORE
   17.4, which cannot play Ogg at all. On those the book was SILENT: the flip
   sounds decode from the base64 in sfx-data.js (Opus, which old Safari also
   cannot decode) and the <audio> fallbacks underneath pointed at .ogg too, so
   both paths failed. An old iPad is a very ordinary thing to hand a child, so
   the .mp3 files are worth their ~56KB. _CAN_OGG probes once; modern browsers
   never request an mp3. Ported from the Story Night flipbook. */
const _CAN_OGG = (function () {
  const a = document.createElement("audio");
  // Opus first (that IS what ships), Vorbis second — a browser that plays either
  // can be served the .ogg.
  return !!(a.canPlayType && (a.canPlayType('audio/ogg; codecs="opus"') ||
                              a.canPlayType('audio/ogg; codecs="vorbis"')));
})();
/* Swap a full .ogg url for its .mp3 sibling, keeping any ?query intact. Used for
   the sfx/ files and for the per-page vo:/sfx: entries in `pages`. Returns the
   url untouched wherever Ogg plays, so this is a no-op on Chrome/Edge/Firefox
   and on Safari 17.4+. */
function _oggToMp3(url) { return _CAN_OGG ? url : String(url).replace(/\.ogg(\?|$)/i, ".mp3$1"); }
const TITLE_VO_SRC = _oggToMp3("sfx/Pari%27s%20Birthday%20Treasure.ogg");
const TITLE_VO_SKIP = 0;                      // seconds to skip if the CLIP has leading silence (bump to e.g. 0.4)
const TITLE_VO_VOL  = 1.0;                    // cover sting volume
const titleVo = new Audio();
titleVo.volume = TITLE_VO_VOL;
// preload="none" ON PURPOSE: the PRELOADER below fetches this file and hands the
// element a blob: URL. Leaving it at "auto" with a real src would download the
// clip twice — once by the element, once by the preloader.
titleVo.preload = "none";
titleVo.src = TITLE_VO_SRC;
let _titleVoPlayed = false;
function _titleGesture(e) {
  // Still loading? Stay armed — play()ing now would start a SECOND download of
  // a file the preloader is already streaming, and it would play the un-blobbed
  // copy. The next gesture after the bar completes will fire it.
  if (!assetsReady) return;
  /* THE PLAY BUTTON COUNTS TOO. It used to be skipped here, because openBook() cut
     the sting a few milliseconds later and a blip of the title is worse than none —
     but that left a reader who goes straight for Play never hearing it at all.
     openBook() now waits for the sting instead (see titleStingRemaining), so this is
     the gesture that most often gets the title heard rather than the one that
     silences it. */
  window.removeEventListener("pointerdown", _titleGesture, true);
  window.removeEventListener("keydown",     _titleGesture, true);
  window.removeEventListener("touchstart",  _titleGesture, true);
  playTitleVo();
}
function playTitleVo() {
  if (!titleVo || _titleVoPlayed || !assetsReady) return;
  try { titleVo.currentTime = TITLE_VO_SKIP; } catch (_) {}
  if (document.hidden) return;            // tab is in the background — stay silent
  const p = titleVo.play();
  if (p && p.then) p.then(function () { _titleVoPlayed = true; }).catch(function () {});
  else _titleVoPlayed = true;
}
// RE-trigger the sting from the top, ignoring the once-per-appearance guard —
// used by every tap on the cover page, so repeated taps always re-announce the
// title instead of doing nothing.
function restartTitleVo() {
  if (!titleVo || !assetsReady) return;
  // Already playing and barely started? Leave it — this is the same gesture the
  // first-tap fallback above just fired on (pointerdown → click), or a double tap.
  if (!titleVo.paused && titleVo.currentTime - TITLE_VO_SKIP < 0.25) return;
  _titleVoPlayed = false;
  try { titleVo.pause(); titleVo.currentTime = TITLE_VO_SKIP; } catch (_) {}
  playTitleVo();
}
/* HOW MUCH OF THE TITLE IS LEFT TO HEAR, in ms — 0 if it is not playing.
   openBook() waits this long before opening, so the title is always heard in full
   and page 1 never has to talk over it. Capped, so a stalled element can never hold
   the book shut: whatever happens, the story starts. */
const TITLE_STING_MAX_WAIT = 3000;
function titleStingRemaining() {
  if (!titleVo || titleVo.paused || titleVo.ended) return 0;
  const dur = (isFinite(titleVo.duration) && titleVo.duration > 0)
    ? titleVo.duration : TITLE_STING_MAX_WAIT / 1000;
  const left = (dur - titleVo.currentTime) * 1000;
  return Math.max(0, Math.min(left, TITLE_STING_MAX_WAIT));
}

// Silence the sting (called when the book opens, so it can't talk over page 1).
function stopTitleVo() {
  if (!titleVo) return;
  try { titleVo.pause(); titleVo.currentTime = TITLE_VO_SKIP; } catch (_) {}
}
// If the blob the preloader hands this element is ever unusable, drop back to
// the real file rather than losing the sting silently.
attachBlobFallback(titleVo, TITLE_VO_SRC, false);

// Arm the first-gesture fallback IMMEDIATELY (so the very first tap fires the VO
// with ZERO delay). The AUTOPLAY attempt no longer happens here: at boot the clip
// is still downloading, so play() would both race the preloader and start a
// second download of the same file. revealStartButton() fires it instead, the
// moment the cover is genuinely ready. Whichever the browser allows first wins;
// the other is a no-op (guarded by _titleVoPlayed).
window.addEventListener("pointerdown", _titleGesture, true);
window.addEventListener("keydown",     _titleGesture, true);
window.addEventListener("touchstart",  _titleGesture, true);

/* ---- Looping BACKGROUND MUSIC — SILENT by request (volume 0) ---------------
   It used to be `new Audio("sfx/BGM.mp3")` with preload="auto", so every visitor
   downloaded the full track (710 KB, now 558 KB as Ogg/Opus) and then played it
   at zero volume. The wiring below is kept as the off-switch: BGM_VOLUME is the
   single gate, and while it is 0 the src is never set, playBgMusic() returns at
   once, and the preloader skips the file entirely.

   THE FILE NO LONGER SHIPS. A full-session audit — drive the preload, all 31
   pages and the game, then diff every URL requested against every file deployed —
   showed BGM.ogg was the largest thing in the bundle that literally nobody ever
   downloads: 558 KB, 3.1% of the payload, unreachable behind that zero. It is now
   listed in .assetsignore / .netlifyignore / .vercelignore, so it stays on disk
   but is left out of the deploy.
   THE MUSIC IS BACK ON, on request. Both halves were needed and both are done: the
   volume below is above zero, and FLIPBOOK/sfx/BGM.ogg has been taken out of the
   three ignore files (raising the volume alone would have shipped a 404).

   WHY 0.04 AND NOT A GUESS. The track measures -16.6 LUFS, so at full volume it would
   sit LOUDER than the narration it plays under. The page that decides the gain is the
   QUIETEST one, not the average: music that sits well under a loud page can still crowd
   a soft one. Page 2 is the floor, at -19.9 LUFS measured over its SPEECH ONLY (pauses
   excluded — see below). Target a 25 dB bed:
       gain = (-19.9 - 25) - (-16.6) = -28.3 dB  ->  10^(-28.3/20) = 0.04
   That puts the music near -44.6 LUFS: about 25 dB under the quietest page and 28 under
   the average. Audible in the gaps, gone the moment anybody speaks.

   WHY 25 dB AND NOT THE TEXTBOOK 18. This landed at 0.11 first (18 dB under a -17.9
   LUFS voice-over), then 0.08 when the re-rendered videos came in louder and re-floored
   the quiet end. Both were still reported as too loud, and the measurements say why the
   arithmetic was not at fault: speech-only and integrated loudness differ by only 0.3 dB
   here, so the 18 dB really was being met. 18 dB is a MIXING figure, for a bed under
   continuous speech. This book is a picture book — long silent stretches while a child
   looks at a page, and dialogue in short bursts — so the bed is heard on its own most of
   the time, and it has to sit far enough back to be scenery rather than content.

   Re-measure BOTH sides before changing this again: the videos are the half that moves
   (they have been re-rendered once already, and got ~1.5 dB louder doing it).
   0 is the off switch, and a real one — the file is then never even downloaded.

   IT RUNS UNBROKEN ACROSS PAGES by construction, not by effort: this is ONE Audio
   element owned by the book document, and turning a page is a DOM change, not a
   navigation — nothing reloads, so nothing restarts. `loop` covers the 59s wrap.
   The only things that stop it are the ones that should: Replay rewinds it to the
   start, and losing focus pauses it (see pauseAllAudioFB). */
const BGM_VOLUME = 0.04;                    // 0 = silent (and not downloaded)
const BGM_SRC    = "sfx/BGM.ogg";
const bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = BGM_VOLUME;
bgMusic.preload = "none";                   // the preloader feeds it, if at all
if (BGM_VOLUME > 0) bgMusic.src = BGM_SRC;
/* Does the page we are on want the book's music under it? A page carrying
   `bgm: false` has a soundtrack of its own — see page 28. */
function pageWantsBgm(idx) {
  const p = pages[idx];
  return !(p && p.bgm === false);
}
/* Pause or resume to match the page just landed on. Called on every arrival.
   PAUSE, never stop: the track keeps its position, so leaving the game picks the
   music up mid-phrase exactly where it went quiet instead of restarting it. */
function updateBgmForPage(idx) {
  if (BGM_VOLUME <= 0 || !bgmStarted) return;   // not playing yet — nothing to do
  if (pageWantsBgm(idx)) {
    if (bgMusic.paused) playBgMusic();
  } else if (!bgMusic.paused) {
    try { bgMusic.pause(); } catch (_) {}
  }
}

function playBgMusic() {
  if (BGM_VOLUME <= 0) return;              // nothing to play, nothing to fetch
  /* Guarded HERE, not only at the call sites, because the music has several ways
     back on — returning to the tab, regaining focus — and any of them would
     otherwise start it up again while the reader is in the middle of the game. */
  if (!pageWantsBgm(flipped)) return;
  /* AND NOT WHILE THE TAB IS AWAY. Same reasoning one line up, one more route:
     turning a page or jumping with the picker still works in a background tab, and
     each arrival calls through here — so without this the music started itself up
     again behind whatever the reader had switched to. Coming back runs
     resumeAllAudioFB, which is what legitimately restarts it. */
  if (document.hidden) return;
  try {
    const p = bgMusic.play();
    if (p && p.catch) p.catch(function () {});   // ignore autoplay rejections
  } catch (_) {}
}

/* WHEN THE MUSIC COMES IN  —  after page 2's scene, not on the cover.
   --------------------------------------------------------------------------
   It used to start inside openBook(), which meant it played under the opening two
   scenes. Held back to the end of page 2 instead, on request: the story gets its
   own opening without a bed under it, and the music arrives as the reader settles
   into the book.

   ONCE PER READ-THROUGH. bgmStarted is the latch — page 2 can be revisited, and its
   scene ends again every time, but the music is already playing by then and must not
   be restarted (that would rewind the track and put a seam in it). Replay clears the
   latch, so a second read-through gets the same entrance.

   TWO WAYS IN, because one is not enough. The first is page 2's scene finishing —
   which is revealPageTurnCue, so it covers the clip ending, erroring, and the
   watchdog alike. The second is simply BEING past page 2: a reader who jumps ahead
   with the page picker never finishes page 2's scene, and without this net they
   would read the whole book in silence. */
const BGM_START_PAGE = 1;                   // index of page 2
let bgmStarted = false;
function startBgMusicOnce() {
  if (bgmStarted || BGM_VOLUME <= 0) return;
  bgmStarted = true;
  playBgMusic();
}
/* Called on every page arrival: catches the reader who skipped past page 2. */
function bgMusicOnArrival(idx) {
  if (idx > BGM_START_PAGE) startBgMusicOnce();
}

/* ==========================================================================
   PER-PAGE AUDIO  —  vo: / sfx: / vol:      (ported from the Story Night book)
   --------------------------------------------------------------------------
   Three optional keys on any entry in `pages`:

     vol: 0            mute the page's OWN video audio. For a scene whose sound
                       should come from the vo: channel instead, so it can be
                       re-cut without re-encoding the video.
     vo:  "assets/x.ogg"   a narration track that starts when the reader LANDS on
                       the page and stops when they leave. On a VIDEO page it is
                       synced to the clip's actual playback start, not to the
                       flip — see the "playing" wiring below. On a static image
                       it starts on landing.
     sfx: "assets/y.ogg"   a SECOND, independent channel, so a page can layer a
                       one-shot (or an ambience, with sfxLoop: true) underneath
                       the vo:. Same land/leave lifecycle.

   Two channels rather than one because they are mixed, not sequenced — the
   Story Night book plays a room ambience under a line of narration on the same
   page, which a single element cannot do.

   NOTHING in Pari's `pages` uses these yet: this is the plumbing, so a page can
   be given a voice without touching the engine again. Both channels route
   through _oggToMp3, so they follow the same Safari fallback as everything else,
   and both are registered with the PRELOADER (see the ASSETS list) so a vo: file
   is fetched with the rest of the book rather than streaming on arrival.
   ========================================================================== */
const pageVo = new Audio();
pageVo.preload = "auto";
pageVo.volume = 1.0;
let voPageIdx = -1;                             // which page the vo: channel belongs to
let _pageVoWasPlaying = false;

function updatePageVo() {
  /* Deliberately NOT gated on !animating. refreshMedia() runs at the START of a
     flip, which is where the video is started, so the VO has to be startable
     then too — waiting for the flip to settle puts it ~1.2s behind the picture.
       Nor is it gated on `ready`, which is what the Story Night original used.
     `ready` does not go true until the cover has FINISHED swinging open, and
     COVER_OPEN_MS is 6000 — so on PAGE 1 the first refreshMedia() (called from
     runOpenSequence to start the page-1 clip) would be rejected and the narration
     would not begin until the next refreshMedia six seconds later, long after its
     own picture. The original never showed this because only its page 11 carries a
     vo:, never its first page. `opened` is enough: soundOn() and resumeAudio()
     have both already run by that first call, and the video-sync wiring below is
     what actually decides the moment playback starts. */
  const page = opened ? pages[flipped] : null;
  const vo = page && page.vo ? page.vo : "";
  if (vo) {
    if (voPageIdx !== flipped) {                 // just LANDED here → play from the top
      voPageIdx = flipped;
      pageVo.src = _oggToMp3(vo);
      const idx = flipped;
      const startVo = function () {
        if (document.hidden || voPageIdx !== idx) return;   // left the page, or tab hidden
        try { pageVo.currentTime = 0; } catch (_) {}
        const p = pageVo.play(); if (p && p.catch) p.catch(function () {});
      };
      const v = leaves[idx] && leaves[idx].querySelector("video.page-media");
      if (page.type === "video" && v) {
        /* refreshMedia has already called playVideoNow() by this point, so on an
           instant page v.paused is ALREADY false → start now, in sync. Only a
           page carrying a `delay:` is still paused; then wait for its play. */
        if (!v.paused) startVo();
        else v.addEventListener("play", startVo, { once: true });
      } else {
        startVo();
      }
    }
  } else if (voPageIdx !== -1) {                 // left the page (or mid-flip) → stop
    voPageIdx = -1;
    try { pageVo.pause(); pageVo.currentTime = 0; } catch (_) {}
  }
}

const pageSfx = new Audio();
pageSfx.preload = "auto";
pageSfx.volume = 1.0;
let sfxPageIdx = -1;
let _pageSfxWasPlaying = false;

function updatePageSfx() {
  // This one IS gated on !animating: an effect has no picture to sync to, so
  // firing it mid-flip would just make it arrive early. `ready` is dropped for the
  // same reason as in updatePageVo above — it would hold a page-1 sfx: back by the
  // full 6s cover-open.
  const page = (opened && !animating) ? pages[flipped] : null;
  const sfx = page && page.sfx ? page.sfx : "";
  if (sfx) {
    if (sfxPageIdx !== flipped) {
      sfxPageIdx = flipped;
      pageSfx.loop = !!page.sfxLoop;             // ambiences loop; one-shots do not
      pageSfx.src = _oggToMp3(sfx);
      if (!document.hidden) { const p = pageSfx.play(); if (p && p.catch) p.catch(function () {}); }
    }
  } else if (sfxPageIdx !== -1) {
    sfxPageIdx = -1;
    try { pageSfx.pause(); pageSfx.currentTime = 0; } catch (_) {}
  }
}

// Silence both channels outright — used when the book closes, goes Home or Replays,
// where "left the page" never fires because `flipped` is being reset underneath us.
function stopPageAudio() {
  voPageIdx = -1; sfxPageIdx = -1;
  _pageVoWasPlaying = false; _pageSfxWasPlaying = false;
  try { pageVo.pause();  pageVo.currentTime  = 0; } catch (_) {}
  try { pageSfx.pause(); pageSfx.currentTime = 0; } catch (_) {}
}

/* ---- Pause ALL audio when the tab / window goes to the background -----------
   Background music AND the current page's video (its voice-over) must stop the
   moment the reader switches tab or app, and resume when they come back — they
   were continuing to play in the background. Covers visibilitychange (tab switch),
   blur (other window), and pagehide (mobile app switch / bfcache). */
let _bgWasPlaying = false;
function currentVideo() {
  const leaf = leaves[flipped];
  return leaf ? leaf.querySelector("video.page-media") : null;
}
function pauseAllAudioFB() {
  if (!bgMusic.paused) { _bgWasPlaying = true; try { bgMusic.pause(); } catch (_) {} }
  if (titleVo && !titleVo.paused) { try { titleVo.pause(); } catch (_) {} }   // short sting — no resume
  // The per-page channels DO resume, unlike the sting: they are as long as the
  // page's video and cutting them dead would desync the page on the way back.
  if (!pageVo.paused)  { _pageVoWasPlaying  = true; try { pageVo.pause(); } catch (_) {} }
  if (!pageSfx.paused) { _pageSfxWasPlaying = true; try { pageSfx.pause(); } catch (_) {} }
  const v = currentVideo();
  if (v && !v.paused) { v.dataset.wasPlaying = "1"; try { v.pause(); } catch (_) {} }
  if (audioCtx && audioCtx.state === "running") { try { audioCtx.suspend(); } catch (_) {} }
  /* The two flip one-shots. No resume: they are ~0.3s stings tied to a turn that
     has already happened, so finishing them on the way back would be a sound with
     nothing on screen to explain it. Rewound so the next turn starts them clean. */
  [flipSound, coverFlipSound].forEach(function (a) {
    if (a && !a.paused) { try { a.pause(); a.currentTime = 0; } catch (_) {} }
  });
  hushActivityFrame(true);
}
/* ---- SILENCE WHATEVER IS IN THE ACTIVITY FRAME -----------------------------
   The seventeen activities and the game are IFRAMES with their own documents, and
   a background tab does not stop them: the six find-the-* pages have no visibility
   guard at all and start their voice-over on load, and the game mixes through an
   AudioContext, which keeps running. Both were audible after a tab switch.
   Same-origin, so their media elements can be paused directly; the game also gets
   a message, because its context lives inside the bundle closure where nothing
   here can reach it (see the hush handler in MONEY CATCH MANIA/index.html). */
function hushActivityFrame(hushed) {
  if (!lbdFrame) return;
  try {
    const d = lbdFrame.contentDocument;
    if (d) d.querySelectorAll("audio,video").forEach(function (m) {
      if (hushed) { if (!m.paused) { m.dataset.hushed = "1"; try { m.pause(); } catch (_) {} } }
      else if (m.dataset.hushed) { delete m.dataset.hushed; const p = m.play(); if (p && p.catch) p.catch(function () {}); }
    });
  } catch (_) {}
  try {
    lbdFrame.contentWindow.postMessage({ source: "book", type: hushed ? "hush" : "unhush" }, "*");
  } catch (_) {}
}
function resumeAllAudioFB() {
  if (document.hidden || !document.hasFocus()) return;   // only when truly back in front
  if (!opened) return;                                   // nothing plays before the book opens
  if (audioCtx && audioCtx.state === "suspended") { try { audioCtx.resume(); } catch (_) {} }
  if (_bgWasPlaying) { _bgWasPlaying = false; playBgMusic(); }
  // Resume each channel only if the reader is STILL on the page it belongs to and
  // it had not already finished — otherwise a tab-switch could drag a stale line
  // onto whatever page they came back to.
  if (_pageVoWasPlaying  && voPageIdx  === flipped && !pageVo.ended)  { _pageVoWasPlaying  = false; const p = pageVo.play();  if (p && p.catch) p.catch(function () {}); }
  if (_pageSfxWasPlaying && sfxPageIdx === flipped && !pageSfx.ended) { _pageSfxWasPlaying = false; const p = pageSfx.play(); if (p && p.catch) p.catch(function () {}); }
  const v = currentVideo();
  if (v && v.dataset.wasPlaying && !v.ended) { delete v.dataset.wasPlaying; const p = v.play(); if (p && p.catch) p.catch(function () {}); }
  hushActivityFrame(false);
}
document.addEventListener("visibilitychange", function () {
  if (document.hidden) pauseAllAudioFB(); else resumeAllAudioFB();
});
/* BLUR IS NOT ALWAYS "THE READER LEFT".
   The seventeen activities are IFRAMES, and moving focus into an iframe fires `blur`
   on THIS window — so the first time a child touched an activity the book decided
   they had gone away and paused everything. Measured:
       before click  active=BODY            bgmPaused=false
       window BLUR   active=IFRAME#lbdFrame bgmPaused=true   hidden=false
   The page never lost visibility; the reader had just started playing. And it stayed
   paused, because focus remains inside the iframe and no `focus` event comes back.
   If the thing that took focus is an iframe, it is one of ours — the reader is still
   here. Leaving is still caught by visibilitychange (tab switch, minimise) and
   pagehide (app switch, bfcache), which is where it actually matters. */
window.addEventListener("blur", function () {
  /* THREE conditions, and each one earned its place by a case that broke without it.
       isActivityPage(flipped)  — there is actually an activity on this page. Without
         it the guard misfired on ordinary VIDEO pages: activeElement stays pointing
         at the iframe long after the reader has left the activity behind, so a
         scene on page 5 would refuse to pause.
       activeElement === lbdFrame — it is THAT frame holding focus, not some other
         element that happens to be an iframe.
       document.hasFocus()      — and this page still holds focus overall. Without it,
         switching windows WHILE an activity has focus would keep the audio running.
     SYNCHRONOUS on purpose. An earlier version deferred this a tick to let focus
     settle, and that quietly changed the contract: blur no longer paused before the
     next statement ran. Measured inside the handler, activeElement is ALREADY the
     iframe by the time blur fires, so there is nothing to wait for — and pausing
     immediately means not a frame of audio leaks out after the reader has gone. */
  const playingActivity =
    isActivityPage(flipped) &&                    // there IS an activity on this page
    document.activeElement === lbdFrame &&        // and it is what holds focus
    document.hasFocus();                          // and this page still has focus
  if (playingActivity) return;
  pauseAllAudioFB();
});
window.addEventListener("focus", resumeAllAudioFB);
window.addEventListener("pagehide", pauseAllAudioFB);

/* ---- One-shot SFX via Web Audio (glitch-free, zero-latency) --------------
   An <audio> element pays a real first-play init cost and can stutter on short
   one-shots — that was the cover-flip "lag/glitch". Instead we decode each SFX
   ONCE into an AudioBuffer and play it through a BufferSource: sample-accurate,
   no start latency. Any leading silence baked into the mp3 is auto-skipped (we
   start on the first audible sample). Buffers come from base64 data URIs
   (window.SFX_DATA in sfx-data.js) so they decode even on file://, where fetch()
   of a plain path is blocked. If Web Audio is unavailable we fall back to plain
   <audio> elements (the old behaviour). */
let audioCtx = null;
const sfxBuf = {};                          // name -> { buffer, offset (seconds) }

// Fallback <audio> elements — used ONLY if Web Audio fails to init or decode,
// which on any browser that runs this book means never. preload="none" so these
// rarely-used files are fetched on demand rather than on every single load; the
// inlined base64 in sfx-data.js is the real playback path.
// _oggToMp3 matters MOST here: on Safari before 17.4 the Web Audio path above
// cannot decode the inlined Opus either, so these elements are the only thing
// left — and pointed at .ogg they were as silent as the buffers they were
// standing in for.
const flipSound = new Audio(_oggToMp3("sfx/Page%20flip.ogg"));
flipSound.preload = "none";
const coverFlipSound = new Audio(_oggToMp3("sfx/cover%20page%20flip.ogg"));
coverFlipSound.preload = "none";
coverFlipSound.volume = 0.35;

(function initSfx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  const DATA = window.SFX_DATA || {};
  if (!AC || !DATA.cover) return;           // no Web Audio / no inlined data → fallback
  try { audioCtx = new AC(); } catch (_) { audioCtx = null; return; }
  function decode(name, uri) {
    fetch(uri).then(function (r) { return r.arrayBuffer(); })
      .then(function (a) { return audioCtx.decodeAudioData(a); })
      .then(function (buf) {
        // Skip any leading silence so playback starts right on the transient.
        const ch = buf.getChannelData(0), sr = buf.sampleRate, thr = 0.008;
        let first = 0;
        for (let i = 0; i < ch.length; i++) { if (Math.abs(ch[i]) > thr) { first = i; break; } }
        sfxBuf[name] = { buffer: buf, offset: Math.max(0, first / sr - 0.004) };
      })
      .catch(function () {});               // leave name unset → falls back to <audio>
  }
  decode("cover", DATA.cover);
  decode("flip", DATA.flip);
})();

// The audio context starts suspended until a user gesture. Resume it on the first
// pointer press (fires just BEFORE the open click) so the cover-flip sound, played
// a moment later, is instant. Capture phase, not once (cheap + always safe).
function resumeAudio() {
  if (document.hidden) return;              // a hidden tab must not un-suspend the mixer
  if (audioCtx && audioCtx.state === "suspended") { try { audioCtx.resume(); } catch (_) {} }
}
document.addEventListener("pointerdown", resumeAudio, { capture: true });

// Play a decoded SFX buffer; returns false if Web Audio isn't ready (→ caller
// falls back to the <audio> element).
function playSfx(name, vol, rate) {
  const entry = sfxBuf[name];
  if (!audioCtx || !entry) return false;
  /* THE TAB IS AWAY — play nothing, and report it as HANDLED. This is the single
     choke point for every Web Audio one-shot in the book, and it is the path that
     actually runs: playFlip() only falls back to the <audio> element when this
     returns false, so guarding the element alone left the sound playing here.
     Returning true rather than false is deliberate — false means "Web Audio could
     not do it, try the element", which would just take the long way to the same
     noise. */
  if (document.hidden) return true;
  try {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const src = audioCtx.createBufferSource();
    src.buffer = entry.buffer;
    if (rate) src.playbackRate.value = rate;
    const g = audioCtx.createGain();
    g.gain.value = (vol == null ? 1 : vol);
    src.connect(g).connect(audioCtx.destination);
    src.start(0, entry.offset || 0);        // start on the first audible sample
    return true;
  } catch (_) { return false; }
}

// Page-flip sound — snappy 1.5× on every ordinary flip.
function playFlip() {
  if (muted) return;                        // sound turns on when the book opens
  if (playSfx("flip", 1.0, 1.5)) return;    // Web Audio path
  try {                                     // fallback
    flipSound.currentTime = 0; flipSound.playbackRate = 1.5;
    if (document.hidden) return;          // tab is in the background — stay silent
    const p = flipSound.play(); if (p && p.catch) p.catch(function () {});
  } catch (_) {}
}
// COVER-page flip sound — played ONLY when the cover opens (never on page flips).
function playCoverFlip() {
  if (muted) return;
  if (playSfx("cover", 0.35)) return;       // Web Audio path
  try {                                     // fallback
    coverFlipSound.currentTime = 0;
    if (document.hidden) return;          // tab is in the background — stay silent
    const p = coverFlipSound.play(); if (p && p.catch) p.catch(function () {});
  } catch (_) {}
}
// Turn sound ON when the book is opened (a clear user gesture). Safe to call
// repeatedly.
function soundOn() {
  muted = false;                     // opening the book turns sound on
}


/* ==========================================================================
   PAGE-TURN HINT  —  guidance for readers who don't know how to turn the page.
   Two cues fire together: a hand taps the forward arrow AND the page itself does a
   "ghost" half-flip (lifts toward the next page, then falls back).
   TIMING: ten seconds of inactivity, on every page. The clock starts when the page
   settles and is restarted by any tap / key / wheel / flip, so a reader who is doing
   something is never nudged; a reader who has stopped is shown how to move on, and
   reminded every 10s until they act.
   ONE EXCEPTION, at the start: on pages 1 and 2 the nudge lands AS THE SCENE ENDS
   rather than ten seconds later, because those two pages are where the page turn is
   taught to someone who has never done it. See hintDelay().

   WHAT COUNTS AS "INACTIVE" IS NOT JUST INPUT. A scene that is still playing is
   activity — canShowHint() refuses while a video is running, and the clip's `ended`
   event restarts the ten seconds — so the nudge lands 10s after the scene finishes,
   never over it, however long the scene runs. Same for a shut forward gate: the
   nudge points at the arrow, so it waits until the arrow is actually live.

   ON ALL PAGES, including the activities (which used to be excluded outright). The
   caveat there is that events inside the activity's iframe do NOT reach this
   document — a child working through one looks perfectly idle from out here, and
   the sixteen currency activities never go full screen, so `lbdFullscreen` does not
   cover them. THE GATE IS WHAT COVERS THEM: an activity holds the forward gate shut
   until it posts "lbd-complete", and the nudge refuses to run against a shut gate.
   So the only activity state that can be nudged is the one worth nudging — finished,
   sitting in the page, arrow lit — and the clock starts at the moment they finish
   (see the "lbd-complete" listener). Never on the last page: nothing to turn to.
   ========================================================================== */
// The nudge is a HAND on the RIGHT side of the book.
// This used to be an <img src="assets/hand-nudge.png"> with an error handler that
// swapped in an emoji. That file has never existed, so every single load fired a
// 404 and then threw the element away — the emoji was ALWAYS what rendered. Build
// the emoji directly; if 3D hand art is ever added, point an <img> at it here.
const flipHint = document.createElement("div");
flipHint.className = "flip-hint flip-hint--emoji";
flipHint.setAttribute("aria-hidden", "true");
flipHint.textContent = "👆";
document.body.appendChild(flipHint);

// Guidance timing. ONE number drives all of it: ten seconds of nothing happening.
// It is used in three places — the countdown on landing, the countdown restarted by
// a scene ending, and the gap between repeats — so the reader experiences a single
// consistent rule rather than three timings that happen to be close together.
const IDLE_MS = 10000;         // the inactivity that earns a nudge
const NUDGE_SHOW_MS = 2000;    // how long one nudge stays on screen
const NUDGE_GAP_MS  = IDLE_MS; // idle again after it disappears → nudge again
// When the ten seconds elapse but the nudge CAN'T show yet (scene still playing,
// gate still shut, activity full screen), re-check soon instead of writing off
// another whole cycle. Waiting a further IDLE_MS there would mean an image page
// whose 3s dwell opens the gate long before the clock runs out still nudging at 20s.
const NUDGE_RETRY_MS = 1000;
/* THE FIRST TWO PAGES TEACH THE GESTURE. A reader who has not yet turned a page has
   no reason to know the book turns at all, and ten silent seconds at the very start
   of the story is a long time to leave them guessing — so on pages 1 and 2 the nudge
   lands as the scene finishes instead. From page 3 on they have done it twice and the
   ordinary ten-second rule takes over.
   ONLY the scene-finished route is early. hintDelay() is deliberately not used by
   resetIdleHint(), so a tap on page 1 still buys a full ten seconds; a hand that
   reappeared 0.3s after every touch would be nagging the child, not teaching them.
   The 0.3s is a beat, not a wait: it keeps the hand off the same frame as the arrow's
   own one-shot blink so the two read as one cue rather than a pile-up. */
const TEACH_PAGES    = 2;      // pages 1 and 2 (indices 0 and 1)
const EARLY_NUDGE_MS = 300;
function hintDelay() { return flipped < TEACH_PAGES ? EARLY_NUDGE_MS : IDLE_MS; }
let idleHintTimer = null;
let nudgeHideTimer = null;
let peeking = false;
let peekTimers = [];

function canShowHint() {
  // `!isActivityPage(flipped)` used to sit in here, which is what kept the nudge off
  // the seventeen activity pages entirely. Activities are in now; the two conditions
  // that make that safe are already on this line (!lbdFullscreen) and the next one
  // (the gate) — see the section header.
  if (!(opened && ready && !animating && !lbdFullscreen &&
        flipped < totalPages - 1 && !document.hidden)) return false;
  // NEVER point at an arrow that cannot be pressed. The whole nudge — hand, ghost
  // flip, blink — says "turn the page now", so while the forward gate is shut it is
  // an instruction the reader would follow and find nothing happens. This also
  // subsumes the image page's 3s dwell and an activity that has not been finished.
  if (advanceLocked) return false;
  /* ON A REVISIT, WAIT FOR THE ACTIVITY TO END — then the ordinary ten seconds.
     The forward gate cannot carry this rule on a revisit: it is already open the
     moment the reader lands (see the `consumed` branch in gateAdvance), so on its own
     it would let the hand appear while they are part-way through playing the activity
     again, telling them to leave a page they chose to come back to. Waiting for
     "lbd-complete" makes the revisit behave like a first visit: finish it, then get
     nudged. The clock itself is started by resetIdleHint() in that same listener, so
     the ten seconds run from the moment they finish rather than from arrival.
     A FIRST visit is unaffected — arrivedConsumed is false there, and the gate above
     already holds the nudge until the activity is done.
     Deliberately activities only: a re-read SCENE is re-gated on arrival (refreshMedia
     rewinds and replays it), so its nudge already waits for the clip to end and is not
     the same problem. */
  if (arrivedConsumed && isActivityPage(flipped) && !completedThisVisit) return false;
  // NEVER nudge over a scene that is still running — covers the reader tapping the
  // video to re-watch it (which restarts playback after the nudge was already armed).
  const v = currentVideo();
  if (v && !v.ended && !v.paused) return false;
  return true;
}
function positionFlipHint() {
  if (!flipScaleEl) return;
  const r = flipScaleEl.getBoundingClientRect();            // the book's on-screen rect
  const w = flipHint.offsetWidth || 80, h = flipHint.offsetHeight || 80;
  // Park the hand against the book's RIGHT edge, vertically centred — the side the
  // ghost flip lifts. The swipe animation moves it right→left from here.
  flipHint.style.left = Math.round(r.right - w - r.width * 0.05) + "px";
  flipHint.style.top  = Math.round(r.top + r.height * 0.5 - h / 2) + "px";
}
function showFlipHint() {
  if (!canShowHint()) return;
  positionFlipHint();
  flipHint.classList.add("show");
}
function hideFlipHint() {
  flipHint.classList.remove("show");
}

/* ---- GHOST PAGE-FLIP -------------------------------------------------------
   Lift the current page about halfway toward the next one, then let it fall back
   — a live demo that the page turns. Purely visual; cancelled the instant the
   reader interacts, so a real drag/flip takes over cleanly. */
function cancelPeek() {
  peekTimers.forEach(clearTimeout);
  peekTimers = [];
  if (!peeking) return;
  peeking = false;
  const leaf = leaves[flipped];
  if (leaf) {
    leaf.style.transition = ""; leaf.style.transform = ""; leaf.style.zIndex = "";
    const c = leaf.querySelector(".curl"); if (c) c.style.opacity = "";
  }
  updateZ();
}
function peekFlip() {
  if (peeking || !canShowHint()) return;
  // NOT on an activity page. The activity is an iframe in .lbd-stage, a body-level
  // overlay pinned over the page rect (see positionLbdStage) — it is NOT inside the
  // leaf. Lifting the leaf would swing the page out from under an activity that
  // stayed perfectly still, which reads as a glitch rather than as a page turning.
  // The hand and the arrow blink still play there; only this half of the cue is off.
  if (isActivityPage(flipped)) return;
  const leaf = leaves[flipped];
  if (!leaf) return;
  peeking = true;
  const curl = leaf.querySelector(".curl");
  leaf.style.zIndex = 300;                               // lift above the rest while peeking
  leaf.style.transition = "transform 720ms cubic-bezier(0.33, 0, 0.2, 1)";
  void leaf.offsetWidth;                                 // commit so the lift animates from flat
  leaf.style.transform = "rotateY(-52deg)";              // turn toward the next page (~halfway)
  if (curl) curl.style.opacity = "0.85";                 // page-curl shading during the lift
  peekTimers.push(setTimeout(function () {               // ...then ease it back down
    leaf.style.transform = "rotateY(0deg)";
    if (curl) curl.style.opacity = "";
  }, 760));
  peekTimers.push(setTimeout(function () {               // clean up once settled
    leaf.style.transition = ""; leaf.style.transform = ""; leaf.style.zIndex = "";
    peeking = false; updateZ();
  }, 760 + 760));
}

// Play the nudge ONCE — hand swipe on the book's right + ghost page-flip + the
// right arrow blinks — hold ~2s, then hide and come back 9s later. Repeats while idle.
function triggerHint() {
  if (!canShowHint()) { idleHintTimer = setTimeout(triggerHint, NUDGE_RETRY_MS); return; }
  showFlipHint();
  peekFlip();
  if (cornerNext) cornerNext.classList.add("blink");
  clearTimeout(nudgeHideTimer);
  nudgeHideTimer = setTimeout(function () {
    hideFlipHint();
    if (cornerNext) cornerNext.classList.remove("blink");
    idleHintTimer = setTimeout(triggerHint, NUDGE_GAP_MS);   // ...idle 10s → nudge again
  }, NUDGE_SHOW_MS);
}
// Called the moment the page's video ENDS (and as the fallback if that video fails
// outright). A scene finishing is the point from which the reader is doing nothing,
// so it is where the clock starts — ten seconds normally, and immediately on the two
// opening pages that have to teach the page turn (see hintDelay).
function scheduleHintAfterVideo() {
  clearTimeout(idleHintTimer);
  clearTimeout(nudgeHideTimer);
  // RETIRE A NUDGE THAT IS CURRENTLY ON SCREEN. Clearing nudgeHideTimer without
  // this leaves the hand up with nothing left to take it down: it was observed
  // stranded for 11.5s instead of 2s, because the timer that would have hidden it
  // was cancelled a few hundred ms after it appeared. If we are restarting the
  // countdown, the nudge belonging to the old one is over.
  hideFlipHint();
  cancelPeek();
  if (cornerNext) cornerNext.classList.remove("blink");
  idleHintTimer = setTimeout(triggerHint, hintDelay());
}
function resetIdleHint() {
  hideFlipHint();
  cancelPeek();
  if (cornerNext) cornerNext.classList.remove("blink");
  clearTimeout(idleHintTimer);
  clearTimeout(nudgeHideTimer);
  const v = currentVideo();
  if (v && !v.ended) {
    // Scene still running → its "ended" event is what starts the ten seconds, so the
    // reader is never nudged over a playing scene however long it runs. What we arm
    // here is only a WATCHDOG: if the clip never plays (blocked autoplay, stall)
    // "ended" never fires and the reader would get no guidance at all. A normal
    // play-through always beats this — "ended" clears it and re-arms at exactly +10s.
    const rem = (isFinite(v.duration) && v.duration > 0)
      ? Math.max(0, v.duration - (v.currentTime || 0)) * 1000
      : 12000;                                    // duration unknown yet → assume ~12s
    idleHintTimer = setTimeout(triggerHint, rem + IDLE_MS + 1200);
    return;
  }
  // Nothing is playing — an image page, an activity page, or a scene that has already
  // finished. All of them get the same ten seconds from right now.
  idleHintTimer = setTimeout(triggerHint, IDLE_MS);
}
// Any interaction cancels the nudge + restarts the idle countdown.
["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (evt) {
  document.addEventListener(evt, resetIdleHint, { passive: true, capture: true });
});
// Coming BACK to the tab counts as activity too, so the reader gets their full ten
// seconds rather than a nudge in the face on return. Without this the retry poll
// above would fire within a second of the tab becoming visible, because the clock
// ran out while they were away and only `document.hidden` had been holding it back.
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) resetIdleHint();
});

/* ==========================================================================
   PRELOADER  —  TWO PHASES: the essentials, then everything else behind the reader.
   --------------------------------------------------------------------------
   On boot the play button is hidden and a themed loading bar takes its place.
   PHASE 1 (CRITICAL) is only what the cover screen and the first spread need:
   the cover art, the play button, the title sting and the first two posters —
   about half a megabyte. The bar tracks just those, and the button pops in as
   soon as they land.
   PHASE 2 (BACKGROUND) then keeps fetching the rest of the book IN STORY ORDER
   while the reader is already reading, so each page's media is normally on the
   device well before the reader turns to it. It used to gate the button on all
   ~15 MB, which on a slow 4G link meant a minute or more staring at the bar.
   A reader who outruns phase 2 is still fine: videos stream from their own src
   (and the preloader yields that file instead of fetching it twice — see
   preloadYield), posters fall back to their file URL (ensurePoster), and the
   activity iframes load their own documents.

   How it stays honest:
     • BYTES, NOT FILES. Each asset is weighted by its REAL on-disk size, read
       from asset-manifest.js (generated from the files themselves by
       tools/gen-manifest.js), then refined by the response's Content-Length.
       Progress is streamed through response.body.getReader(), so the fill
       tracks bytes actually received rather than requests actually finished.
     • BLOB SWAP. Every fetched asset becomes a blob: URL on its element, so
       "loaded" means the data is in this page's memory — not that it once
       passed through a cache the browser is free to drop. Elements the
       preloader feeds carry preload="none" so nothing is downloaded twice.
     • STORY ORDER. Each asset carries the page index where it is first needed,
       and the background queue runs in that order, with only two transfers at
       a time so it never starves the video the reader is actually watching.
     • MONOTONIC. The displayed percentage never goes backwards, even when a
       Content-Length correction shrinks the denominator.
     • FAILURE NEVER BLOCKS. A failed, stalled, aborted or timed-out transfer
       counts as DONE at full weight and the element simply keeps its original
       src. Opened from file://, fetch is blocked outright for every asset —
       the bar fills, the button appears, and the book runs exactly as it did
       before there was a preloader.
   ========================================================================== */
const assetPreloader = (function () {
  const loaderEl  = document.getElementById("loader");
  const fillEl    = document.getElementById("loaderFill");
  const textEl    = document.getElementById("loaderText");

  /* OPENED FROM DISK?  fetch() is blocked outright for file: URLs — the origin is
     opaque — so every single asset transfer fails. The book still worked, because the
     not-loaded fallback in grab() hands each element its ordinary URL and the browser
     loads it the normal way. What it did NOT do is stay quiet: ~120 assets each logged
     an "Access to fetch ... has been blocked by CORS policy" plus a Failed to load
     resource, burying any real error in noise for anyone opening the folder directly.
     So on file: we skip the attempt entirely and go straight to that fallback. Same
     end state, no failed requests, and the bar fills immediately instead of crawling
     through 120 doomed transfers. */
  const FILE_MODE     = location.protocol === "file:";

  const CONCURRENCY   = 5;        // parallel transfers while the reader waits (phase 1)
  const BG_CONCURRENCY = 2;       // parallel transfers once the reader is reading (phase 2)
  const CRITICAL      = -1;       // priority of the phase-1 assets
  const TIMEOUT_MS    = 30000;    // per-transfer abort guard
  const DEFAULT_BYTES = 120000;   // weight for anything missing from the manifest

  // ---- Font CSS. These MUST match the URLs the documents themselves request,
  // byte for byte, or the warm silently misses and the fonts are fetched again.
  // THIS DOCUMENT NO LONGER REQUESTS A WEBFONT. index.html used to <link> Fredoka
  // 600/700 and this warmed it; both are gone, because --font-head is "coiny" and
  // so nothing ever rendered in Fredoka — see the note where the <link> was.
  // Warming a font the page does not request is not free: it is a render-blocking
  // third-party round trip on the critical path, charged to the loading bar.
  // the activities' @import — THREE variants of Baloo 2, one per embedded document
  // that asks for a different weight set. These must match byte for byte or the
  // warm populates a different cache entry and the real request still goes to the
  // network, on arrival, mid-story.
  //   600;800  the find-the-* games (600 for the score counter, 800 for the pill)
  //   800      the what-colour-* and which-coin-* pages (pill only)
  //   700;800  Money Catch Mania (its own index.html <link>) — this one was MISSING
  //            until an audit compared the warm list against what each document
  //            actually requests. Everything else about the game is covered by
  //            warming its index.html and bundle (all its sprites and audio are
  //            base64 INSIDE that bundle, so there are no separate asset
  //            requests), which is exactly why the font was easy to overlook.
  const ACTIVITY_FONT_CSS = [
    "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap",
    "https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap",
    "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap",
  ];

  // ---- Build the asset list --------------------------------------------------
  // Everything here is an EXACT request URL. If a URL ever gains a ?v= cache
  // buster it must gain it here too — a warm on the un-busted URL populates a
  // different cache entry and the real request still goes to the network.
  const SIZES = window.ASSET_SIZES || {};
  const seen = Object.create(null);
  const list = [];
  // One URL is fetched ONCE but may need to be applied to MANY elements — all
  // sixteen activity pages share assets/posters/currency.webp, for instance. So
  // a repeat add() must append its callback rather than be dropped, or fifteen
  // of those leaves would keep the network URL while the bar claimed everything
  // was local. One blob is then shared by every element that wants it.
  // prio = the page index where the asset is first needed (CRITICAL for phase 1).
  // A URL added twice keeps the EARLIER of its two priorities.
  function add(url, kind, apply, prio) {
    if (!url) return;
    if (typeof prio !== "number") prio = 0;
    if (seen[url]) {
      if (apply) seen[url].applies.push(apply);
      if (prio < seen[url].prio) seen[url].prio = prio;
      return;
    }
    // Size lookup falls back to the query-stripped key. gen-manifest.js records
    // plain on-disk paths, so a URL carrying a ?v= cache buster would otherwise
    // miss the manifest entirely and be weighted at DEFAULT_BYTES — a 2.7MB video
    // counted as 120KB, which makes the bar lurch. The exact-URL warm still uses
    // the full string; only the WEIGHT tolerates the query.
    const asset = { url: url, kind: kind, applies: apply ? [apply] : [], prio: prio,
                    order: list.length,
                    bytes: SIZES[url] || SIZES[String(url).split("?")[0]] || DEFAULT_BYTES };
    seen[url] = asset;
    list.push(asset);
  }

  // 1. the cover art (a CSS background — swapped via inline style)
  add("assets/Cover%20Page.webp", "image", function (blobUrl) {
    const el = document.querySelector(".cover .front .cover-img");
    if (el) el.style.backgroundImage = 'url("' + blobUrl + '")';
  }, CRITICAL);

  // 1b. the PLAY button art, same pattern. It MUST be in this list: the button is
  // revealed the instant the bar hits 100%, so an un-preloaded image would pop in
  // as an empty box and fill a moment later. Hyphenated filename, so unlike the
  // cover there is no %20 to keep in sync.
  add("assets/play-button.webp", "image", function (blobUrl) {
    const el = document.querySelector(".play-btn .play-face");
    if (el) el.style.backgroundImage = 'url("' + blobUrl + '")';
  }, CRITICAL);

  // 2. every page's media + poster, straight off the `pages` array
  pages.forEach(function (page, i) {
    if (page.type === "video") {
      add(page.src, "video", function (blobUrl) {
        const v = leaves[i] && leaves[i].querySelector("video.page-media");
        if (!v) return;
        // Already streaming because the reader got here first: leave it alone,
        // a src swap would restart the clip.
        if (videoEngaged(v)) return;
        v.src = blobUrl;                    // fallback to page.src is already wired
      }, i);
      // The first two posters are what the open book shows first: phase 1.
      add(posterFor(page.src), "image", function (blobUrl) {
        const v = leaves[i] && leaves[i].querySelector("video.page-media");
        if (v) v.setAttribute("poster", blobUrl);
      }, i < 2 ? CRITICAL : i);
    } else if (page.type === "image") {
      add(page.src, "image", function (blobUrl) {
        const im = leaves[i] && leaves[i].querySelector("img.page-media");
        if (im) im.src = blobUrl;
      }, i < 2 ? CRITICAL : i);
    } else if (page.type === "lbd") {
      add(page.poster, "image", function (blobUrl) {
        const im = leaves[i] && leaves[i].querySelector("img.page-media");
        if (im) im.src = blobUrl;
      }, i < 2 ? CRITICAL : i);
      // The activity document itself. Warmed, NOT blob-swapped: the iframe has
      // to load it from its real path so its own relative URLs still resolve.
      add(page.src, "warm", null, i);
    }
    // Per-page audio channels (vo: / sfx:), for whichever pages carry them.
    // Warmed rather than blob-swapped: both channels set .src at LANDING time from
    // the raw page.vo / page.sfx value, so a blob would never be consulted — the
    // point here is only to have the bytes in cache before the reader arrives.
    // _oggToMp3 so the warmed URL is the one the element will actually request.
    if (page.vo)  add(_oggToMp3(page.vo),  "warm", null, i);
    if (page.sfx) add(_oggToMp3(page.sfx), "warm", null, i);
  });

  // Where the activity assets below are first needed, so the background queue
  // fetches them just ahead of those pages rather than after the whole book.
  function firstPage(test) {
    for (let k = 0; k < pages.length; k++) if (test(pages[k])) return k;
    return pages.length;
  }
  function srcHas(part) {
    return function (p) { return p.type === "lbd" && String(p.src).indexOf(part) !== -1; };
  }
  const FIRST_ACTIVITY = firstPage(function (p) { return p.type === "lbd"; }) - 0.5;
  const FIRST_COIN     = firstPage(srcHas("which-coin")) - 0.5;
  const MCM_PAGE       = firstPage(srcHas("MONEY%20CATCH%20MANIA")) - 0.5;

  // 3. the activity iframes' OWN assets, at the URLs the iframes will ask for.
  //    An activity at activities/x.html requesting "../assets/Currency/y.webp"
  //    resolves to the same absolute URL as "assets/Currency/y.webp" from here,
  //    so warming these fills the exact cache entries the iframe will hit.
  [
    "assets/Currency/background.webp",       // CSS background on body + .scene
    "assets/Currency/dialogue-box.webp",     // the speech box art
    "assets/Currency/magnifying-glass.webp", // the find-* games' glass
    "assets/Currency/note-10.webp",  "assets/Currency/note-20.webp",
    "assets/Currency/note-50.webp",  "assets/Currency/note-100.webp",
    "assets/Currency/note-200.webp", "assets/Currency/note-500.webp",
    "assets/Currency/coin-10-paise.webp", "assets/Currency/coin-20-paise.webp",
    "assets/Currency/coin-25-paise.webp", "assets/Currency/coin-50-paise.webp",
    /* Money Catch Mania's whole program: Phaser + the game + every sprite and
       sound base64-inlined into this ONE file (its vite.config.js inlines all
       assets). It is by far the biggest single item in the book, so it MUST be
       warmed here — reaching page 28 with it uncached would stall on a blank
       sky-blue frame for as long as it takes to pull ~2.7MB. Nothing else in
       that folder is ever requested at runtime.
       The path climbs OUT of this folder: the game is a sibling of FLIPBOOK under
       the main "PARI'S BIRTHDAY TREASURE" folder, so a host must serve that main
       folder as its root (serving FLIPBOOK alone would put the game above the
       root and 404 it). %20 rather than a literal space so the URL matches the
       asset-manifest key exactly. */
  ].forEach(function (u) { add(u, "warm", null, FIRST_ACTIVITY); });
  add("../MONEY%20CATCH%20MANIA/bundle/app-B_JuTLfC.js", "warm", null, MCM_PAGE);

  /* 3b. the feature-hunts' SPOKEN LINES — three per note plus one shared "Good job".
         Warmed because the intro plays the instant a hunt page is reached: an
         uncached clip would start a second or two into the sentence, or be cut off
         entirely. Generated from the same denomination list the activities use, so
         a new note cannot be added with its voice-over silently missing.
         note-<d>-write.ogg is deliberately NOT here: the bare "This is how we
         write ₹N." step was dropped when the "Perfect! …" payoff moved to the end
         of the activity, so those six clips are on disk but unused. */
  const NOTE_DENOMS = ["10", "20", "50", "100", "200", "500"];
  /* Which recording each note's payoff line uses. Every note reads
     "Perfect! This is how we write ₹N." from its -perfect take EXCEPT ₹500: that
     take was a bad recording, so ₹500 uses the bare -write reading (and its
     on-screen line drops "Perfect!" to match). Keeping this as a map rather than a
     hard-coded step name is what stops the odd one out from being missed here and
     downloading mid-activity. */
  const PAYOFF_VO = { "10": "perfect", "20": "perfect", "50": "perfect",
                      "100": "perfect", "200": "perfect", "500": "write" };
  NOTE_DENOMS.forEach(function (d) {
    ["intro", "question"].forEach(function (step) {
      add("assets/vo/note-" + d + "-" + step + ".ogg", "warm", null, FIRST_ACTIVITY);
    });
    add("assets/vo/note-" + d + "-" + PAYOFF_VO[d] + ".ogg", "warm", null, FIRST_ACTIVITY);
  });
  add("assets/vo/good-job.ogg", "warm", null, FIRST_ACTIVITY);
  /* "Can you find another ₹10 on this note?" — the ₹10 note's follow-up question,
     asked once the first find's close-up ends. Only that note has one (ANOTHER_LINE
     is empty in the other five), so this is a single line rather than a loop over
     NOTE_DENOMS. It plays about two seconds after the first find, which is far too
     soon to start fetching it then. */
  add("assets/vo/note-10-another.ogg", "warm", null, FIRST_ACTIVITY);

  /* 3c. the COLOUR quiz's lines (question + the winning line, per note) and the
         COIN quiz's (just the winning line, per coin), plus the one clip they
         share: "Which coin is this?". Same reason as above — the first line of each
         speaks the moment its page is reached.
         FIVE CLIPS ARE GONE, not merely unwarmed. coin-N-intro.ogg x4 ("This is a
         10 Paise coin.") went when the coin activities' opening line was removed — it
         announced the answer immediately before asking for it — and try-again.ogg
         went with the "Try again" line, dropped from all ten quizzes. They sat in
         assets/vo/ unreachable by any code path for several rounds of changes; they
         have now been deleted (158KB). Re-record them if either line ever returns. */
  NOTE_DENOMS.forEach(function (d) {
    add("assets/vo/colour-" + d + "-question.ogg", "warm", null, FIRST_ACTIVITY);
    add("assets/vo/colour-" + d + "-correct.ogg", "warm", null, FIRST_ACTIVITY);
  });
  ["10", "20", "25", "50"].forEach(function (d) {
    add("assets/vo/coin-" + d + "-correct.ogg", "warm", null, FIRST_COIN);
  });
  /* THE COIN QUESTION IS NO LONGER ONE SHARED CLIP. The four coins now read as a
     run — "Which coin is this?", then "Here's another one…", "Now look at this…",
     "Here's the last one…" — so only 10 Paise, which asks the plain question, is
     still on the shared take; the other three have their own. All four are warmed
     because each speaks the instant its page is reached. */
  add("assets/vo/coin-question.ogg", "warm", null, FIRST_COIN);        // 10 Paise
  ["20", "25", "50"].forEach(function (d) {
    add("assets/vo/coin-" + d + "-question.ogg", "warm", null, FIRST_COIN);
  });
  /* The wrong-answer buzzer, shared by all ten quiz activities. Warmed rather than
     blob-swapped: the activities are separate DOCUMENTS and load it themselves, so
     what they need is the file already in the HTTP cache — a blob URL held in this
     document would be useless to them. Without this the very first wrong answer waits
     on a network fetch, which is precisely the moment the sound has to be immediate. */
  add("sfx/incorrect%20buzzer.mp3", "warm", null, FIRST_ACTIVITY);

  // 4. audio. The one-shot SFX play from the inlined base64 in sfx-data.js, so
  //    only the title sting needs a blob; BGM joins the queue only if it is
  //    audible (BGM_VOLUME is 0, so today it is not fetched at all).
  add(TITLE_VO_SRC, "audio", function (blobUrl) { titleVo.src = blobUrl; }, CRITICAL);
  if (BGM_VOLUME > 0) add(BGM_SRC, "audio", function (blobUrl) { bgMusic.src = blobUrl; });

  // 5. webfonts — the stylesheet, then the woff2 files it names. Cross-origin,
  //    so these are best-effort by design; a failure just counts as done.
  const FONT_CSS = ACTIVITY_FONT_CSS.slice();   // Baloo 2 only; see the note above

  // ---- Progress bookkeeping --------------------------------------------------
  let totalBytes = list.reduce(function (s, a) { return s + a.bytes; }, 0);
  // The bar only measures PHASE 1 — the background phase runs after it is gone.
  let critBytes = list.reduce(function (s, a) { return a.prio < 0 ? s + a.bytes : s; }, 0);
  const got = Object.create(null);        // url -> bytes counted so far
  const inflight = Object.create(null);   // url -> asset currently being fetched
  let shownPct = 0;                       // never decreases
  let finished = 0;

  function paint() {
    let done = 0;
    for (const k in got) if (seen[k].prio < 0) done += got[k];
    const pct = critBytes > 0 ? Math.min(100, (done / critBytes) * 100) : 100;
    if (pct > shownPct) shownPct = pct;   // MONOTONIC
    const r = Math.floor(shownPct);
    if (fillEl) fillEl.style.width = shownPct.toFixed(2) + "%";
    if (textEl) textEl.textContent = "Gathering the treasure… " + r + "%";
    if (loaderEl) loaderEl.setAttribute("aria-valuenow", String(r));
  }

  // ---- One transfer ----------------------------------------------------------
  async function grab(asset) {
    const url = asset.url;
    // The reader reached this video before we did and it is streaming on its own:
    // fetching it again would only compete with that stream.
    if (asset.yielded) { got[url] = asset.bytes; finished++; return; }
    if (FILE_MODE) {
      // Straight to the not-loaded fallback below — see FILE_MODE above.
      if (asset.applies.length) {
        asset.applies.forEach(function (fn) { try { fn(url); } catch (_) {} });
      }
      got[url] = asset.bytes;
      finished++;
      paint();
      return;
    }
    const ctrl = new AbortController();
    const killer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    asset.ctrl = ctrl;
    inflight[url] = asset;
    try {
      const res = await fetch(url, { signal: ctrl.signal, credentials: "omit" });
      if (!res.ok) throw new Error("HTTP " + res.status);

      // Refine the weight with the real Content-Length when we get one.
      const len = +res.headers.get("content-length");
      if (len > 0 && len !== asset.bytes) {
        totalBytes += len - asset.bytes;
        if (asset.prio < 0) critBytes += len - asset.bytes;
        asset.bytes = len;
      }

      // Stream so the bar moves DURING a big transfer, not only at its end.
      let blob;
      if (res.body && res.body.getReader) {
        const reader = res.body.getReader();
        const chunks = [];
        let n = 0;
        for (;;) {
          const step = await reader.read();
          if (step.done) break;
          chunks.push(step.value);
          n += step.value.length;
          // Never let a longer-than-declared body run the bar past this asset's
          // share; the final reconcile below credits it in full anyway.
          got[url] = Math.min(n, asset.bytes);
          paint();
        }
        blob = new Blob(chunks, { type: res.headers.get("content-type") || "" });
      } else {
        blob = await res.blob();           // no streams (very old engine)
      }

      if (asset.applies.length) {
        const blobUrl = URL.createObjectURL(blob);
        asset.applies.forEach(function (fn) { try { fn(blobUrl); } catch (_) {} });
      }
      asset.applied = true;
    } catch (_) {
      // Failed / aborted / timed out / blocked (file://). Fall through to the
      // plain-URL apply below — a broken transfer must never gate the start, and
      // must never leave an element pointing at nothing.
    } finally {
      // NOT-LOADED FALLBACK. Some targets (the video posters, the cover art) are
      // deliberately left unset in the markup so they are fetched exactly once,
      // by us. If our fetch failed, hand them the ordinary file URL so the
      // browser can still load them the normal way — on file://, where fetch is
      // blocked outright, this is what makes the book look identical to before.
      if (!asset.applied && !asset.yielded && asset.applies.length) {
        asset.applies.forEach(function (fn) { try { fn(url); } catch (_) {} });
      }
      delete inflight[url];
      clearTimeout(killer);
      got[url] = asset.bytes;              // count it DONE either way
      finished++;
      paint();
    }
  }

  // ---- Fonts: fetch the CSS, then the woff2 URLs inside it -------------------
  async function warmFonts() {
    if (FILE_MODE) return;   // same reason as grab(): the fetch cannot succeed
    await Promise.all(FONT_CSS.map(async function (cssUrl) {
      try {
        const ctrl = new AbortController();
        const killer = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
        const res = await fetch(cssUrl, { signal: ctrl.signal });
        const css = await res.text();
        clearTimeout(killer);
        // Google serves woff2 URLs keyed to the User-Agent, so the files named
        // here are exactly the ones this browser will ask for.
        const urls = (css.match(/url\((https:\/\/[^)]+)\)/g) || [])
          .map(function (m) { return m.slice(4, -1); });
        await Promise.all(urls.map(function (u) {
          return fetch(u, { mode: "cors" }).catch(function () {});
        }));
      } catch (_) { /* offline / blocked / file:// — fonts fall back to system */ }
    }));
  }

  // ---- Run -------------------------------------------------------------------
  // Called by warmVideo(): the reader has reached this file first, so cancel our
  // copy (or never start it) and let the element's own stream have the link.
  preloadYield = function (url) {
    const asset = seen[url];
    if (!asset || asset.kind !== "video" || asset.applied) return;
    asset.yielded = true;
    if (inflight[url] && asset.ctrl) asset.ctrl.abort();
  };

  function drain(queue, width) {
    let i = 0;
    async function worker() { while (i < queue.length) await grab(queue[i++]); }
    const pool = [];
    for (let w = 0; w < width; w++) pool.push(worker());
    return Promise.all(pool);
  }

  // Resolves when PHASE 1 is done (the reader can start). `background` resolves
  // once the rest of the book has been fetched behind them.
  let background = Promise.resolve();
  async function run() {
    list.sort(function (a, b) { return a.prio - b.prio || a.order - b.order; });
    const critical = list.filter(function (a) { return a.prio < 0; });
    const rest     = list.filter(function (a) { return a.prio >= 0; });
    paint();

    await drain(critical, CONCURRENCY);
    shownPct = 100;
    paint();

    // Fonts run alongside the background pool; they are not part of the byte
    // total (their size is unknown up front and cross-origin responses often hide it).
    background = Promise.all([drain(rest, BG_CONCURRENCY), warmFonts()]).then(function () {
      return { total: list.length, finished: finished };
    });
    return { total: critical.length, finished: finished };
  }

  return { run: run, count: list.length, bytes: function () { return totalBytes; },
           background: function () { return background; } };
})();

/* ---- START GATE -----------------------------------------------------------
   assetsReady is the single source of truth. The button is hidden until it
   flips, AND openBook() checks it directly — so a keyboard Enter/Space, an
   arrow key, or a programmatic call all wait too, not just a mouse click. The
   page picker is disabled for the same reason: jumpToPage() is a second way
   into the book. */
let assetsReady = false;
function revealStartButton() {
  assetsReady = true;
  if (loaderNode) {
    loaderNode.classList.add("done");
    setTimeout(function () { loaderNode.hidden = true; }, 280);
  }
  if (hint) {
    hint.hidden = false;
    void hint.offsetWidth;                 // commit before animating
    hint.classList.add("ready");           // pop-in, then the breathing loop
  }
  if (pageSelect) pageSelect.disabled = false;
  document.body.classList.add("assets-ready");
  // The cover is on screen and everything is local — announce the title now.
  playTitleVo();
}

/* ---- Boot ---------------------------------------------------------------- */
const loaderNode = document.getElementById("loader");
if (hint) hint.hidden = true;              // no start button until 100%
if (pageSelect) pageSelect.disabled = true;

fitScale();                              // scale the fixed 1280x720 book to fit first
renderLeaves();                          // lay out the leaves (all on page 1 to start)
updateProgress();

console.log("[preload] " + assetPreloader.count + " assets, " +
            (assetPreloader.bytes() / 1048576).toFixed(2) + " MB expected");
assetPreloader.run().then(function (r) {
  console.log("[preload] essentials ready — " + r.total + " assets; the rest continues in the background");
  revealStartButton();
  assetPreloader.background().then(function (b) {
    console.log("[preload] complete — " + b.finished + "/" + b.total + " transfers settled");
  });
}).catch(function (e) {
  // Belt and braces: the pool already swallows per-asset failures, so this can
  // only fire on something unforeseen. Never leave the reader without a button.
  console.warn("[preload] aborted early:", e);
  revealStartButton();
});
