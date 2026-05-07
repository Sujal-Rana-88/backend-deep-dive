// ============================================================
// JAVASCRIPT EVENT LOOP - BEST VISUAL EXAMPLE
// ============================================================

console.log("1. Start");

setTimeout(() => {
  console.log("2. setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise");
});

console.log("4. End");


// ============================================================
// BEHIND THE SCENES
// ============================================================

/*

╔════════════════════════════════════════════════════════════╗
║                    INITIAL STATE                          ║
╚════════════════════════════════════════════════════════════╝


CALL STACK        MICROTASK QUEUE       MACROTASK QUEUE
────────────      ─────────────────     ─────────────────
empty             empty                 empty



============================================================
STEP 1
============================================================

console.log("1. Start")

CALL STACK
────────────
console.log()

OUTPUT:
1. Start

After execution:
CALL STACK becomes empty.



============================================================
STEP 2
============================================================

setTimeout(...)

JS DOES NOT execute timer itself.

Instead:
--------------------------------
Browser / Node Runtime handles it.

Timer starts in background.

After timer completes:
callback goes into:

MACROTASK QUEUE


CURRENT STATE:

MICROTASK QUEUE       MACROTASK QUEUE
─────────────────     ─────────────────
empty                 setTimeout cb



============================================================
STEP 3
============================================================

Promise.resolve().then(...)

Promise callback goes into:

MICROTASK QUEUE


CURRENT STATE:

MICROTASK QUEUE       MACROTASK QUEUE
─────────────────     ─────────────────
Promise cb            setTimeout cb



============================================================
STEP 4
============================================================

console.log("4. End")

OUTPUT:
4. End

Sync code finished.


============================================================
EVENT LOOP STARTS
============================================================

Event Loop continuously checks:

1. Is Call Stack empty?
2. If yes:
      First execute ALL microtasks
3. Then execute ONE macrotask
4. Repeat forever


Pseudo code:

while(true) {

   if(callStack.isEmpty()) {

      runAllMicrotasks()

      runOneMacrotask()
   }
}



============================================================
STEP 5 - MICROTASKS
============================================================

Promise callback executes FIRST.

OUTPUT:
3. Promise


Why first?

Because:
MICROTASK QUEUE has HIGHER priority
than MACROTASK QUEUE.



============================================================
STEP 6 - MACROTASK
============================================================

Now microtask queue empty.

Event Loop picks:
setTimeout callback

OUTPUT:
2. setTimeout



============================================================
FINAL OUTPUT
============================================================

1. Start
4. End
3. Promise
2. setTimeout



============================================================
COMPLETE FLOW DIAGRAM
============================================================


                 ┌──────────────────────┐
                 │      CALL STACK      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      EVENT LOOP      │
                 └──────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ MICROTASK QUEUE│  │ MACROTASK QUEUE│  │ Browser/Node   │
│ Promise.then   │  │ setTimeout     │  │ Runtime APIs   │
└────────────────┘  └────────────────┘  └────────────────┘



============================================================
PRIORITY ORDER
============================================================

1. Execute Sync Code
2. Execute ALL Microtasks
3. Execute ONE Macrotask
4. Repeat forever

*/