// ============================================================
// NODE.JS BACKPRESSURE EXAMPLE
// ============================================================

// Backpressure happens when:
//
// Producer creates data FASTER
// than consumer can process it.
//
// Example:
// --------
// Fast read stream  --->  Slow write stream
//
// If not controlled:
// -------------------
// Memory can explode.
//
// Node.js streams solve this using:
// BACKPRESSURE
//
// ============================================================

const fs = require("fs");


// ============================================================
// READ STREAM (FAST PRODUCER)
// ============================================================

const readStream = fs.createReadStream("bigfile.txt", {
  highWaterMark: 1024 // 1KB chunks
});


// ============================================================
// WRITE STREAM (SLOW CONSUMER)
// ============================================================

const writeStream = fs.createWriteStream("copy.txt");


// ============================================================
// FLOW
// ============================================================

readStream.on("data", (chunk) => {

  console.log("Reading chunk...");

  /*
  write() returns:

  true  -> consumer can handle more data
  false -> consumer overloaded
  */

  const canContinue = writeStream.write(chunk);

  console.log(canContinue);

  /*
  ============================================================
  BACKPRESSURE DETECTED
  ============================================================

  If false:
  write stream buffer is FULL.

  Producer must STOP temporarily.

  Otherwise:
  memory keeps increasing.
  */

  if (!canContinue) {

    console.log("Backpressure detected!");

    // Pause reading temporarily
    readStream.pause();

    /*
    ==========================================================
    BEHIND THE SCENES
    ==========================================================

    Producer too fast.
    Consumer too slow.

    So Node says:

    "Stop sending more data for now."

    */
  }
});


// ============================================================
// DRAIN EVENT
// ============================================================

writeStream.on("drain", () => {

  console.log("Drain event -> Resume reading");

  /*
  drain means:
  write stream buffer became empty again.

  Consumer caught up.

  Safe to continue producing data.
  */

  readStream.resume();
});


// ============================================================
// END EVENT
// ============================================================

readStream.on("end", () => {

  console.log("File copy completed");

  writeStream.end();
});



// ============================================================
// VISUAL FLOW
// ============================================================

/*

                    FAST PRODUCER
                 (Read Stream/File)
                          │
                          │ produces chunks
                          ▼

                 ┌─────────────────┐
                 │     BUFFER      │
                 └─────────────────┘
                          │
                          │ write(chunk)
                          ▼

                    SLOW CONSUMER
                    (Write Stream)



============================================================
WITHOUT BACKPRESSURE
============================================================

Producer speed:
█████████████████████████

Consumer speed:
█████


Result:
--------
Buffer keeps growing ❌
Huge memory usage ❌



============================================================
WITH BACKPRESSURE
============================================================

Producer sends data
        │
        ▼

Consumer overloaded?
        │
   YES ─┘

pause producer

wait for drain event

resume producer


Result:
--------
Controlled memory usage ✅



============================================================
IMPORTANT METHODS
============================================================

write(chunk)
----------------
Returns:
true  -> continue
false -> stop temporarily


pause()
----------------
Stops producer stream temporarily


resume()
----------------
Starts producer again


drain event
----------------
Triggered when buffer frees up



============================================================
REAL WORLD ANALOGY
============================================================

Imagine:

Producer:
----------
Water pipe 🚰

Consumer:
----------
Bucket 🪣

If pipe fills bucket too fast:
bucket overflows ❌

Solution:
----------
Temporarily stop water flow.

Resume after bucket empties.


THAT is backpressure.


============================================================
IMPORTANT INTERVIEW LINE
============================================================

Backpressure is a mechanism to prevent
fast producers from overwhelming slow consumers
by temporarily pausing data flow.


*/