// ============================================================
// NODE.JS BUFFERING EXAMPLE
// ============================================================

// Buffer:
// --------
// A Buffer is temporary memory storage used by Node.js
// to handle binary data efficiently.
//
// Used in:
// - File reading
// - Streams
// - Network requests
// - Video/audio streaming
// - TCP packets
//
// Think of Buffer like:
// "Temporary byte container"


const fs = require("fs");


// ============================================================
// CREATE BUFFER
// ============================================================

const buffer = Buffer.from("Hello");

/*

"Hello" in memory:
-------------------

H -> 72
e -> 101
l -> 108
l -> 108
o -> 111

Buffer stores RAW BYTES.

*/

console.log(buffer);

/*
OUTPUT:
<Buffer 48 65 6c 6c 6f>

Hex values:
48 -> H
65 -> e
6c -> l
*/


console.log(buffer.toString());

/*
Converts bytes back to string.

OUTPUT:
Hello
*/


// ============================================================
// BUFFERING WITH FILE STREAMS
// ============================================================

// Large files are NOT loaded fully into memory.
//
// Node.js reads them in CHUNKS (buffers).
//
// Example:
// 1GB video file
//
// BAD:
// --------
// Read whole file into RAM.
//
// GOOD:
// --------
// Read small chunks one by one.
//
// That's buffering.
//

const readStream = fs.createReadStream("bigfile.txt", {
  highWaterMark: 5 // read 5 bytes at a time
});


/*

highWaterMark:
----------------
Controls buffer size.

Here:
Node reads:
5 bytes per chunk.

*/


readStream.on("data", (chunk) => {

  /*
  chunk is a BUFFER
  */

  console.log(chunk);

  /*
  Example:
  <Buffer 48 65 6c 6c 6f>
  */

  console.log(chunk.toString());

  /*
  Converts buffer -> readable text
  */

});


readStream.on("end", () => {
  console.log("File Reading Completed");
});



// ============================================================
// BEHIND THE SCENES
// ============================================================

/*

Suppose file contains:

"Hello World"


Node DOES NOT read everything at once.


STEP 1
================================================

Read first 5 bytes:

BUFFER:
--------
Hello


STEP 2
================================================

Read next 5 bytes:

BUFFER:
--------
 Worl


STEP 3
================================================

Read remaining bytes:

BUFFER:
--------
d


This process is called:
BUFFERING


*/



// ============================================================
// WHY BUFFERING IS IMPORTANT
// ============================================================

/*

Without buffering:
-------------------
Huge memory usage.


With buffering:
----------------
Small chunks loaded gradually.


Benefits:
----------
1. Low memory usage
2. Faster streaming
3. Efficient large file handling
4. Better performance


*/


// ============================================================
// REAL WORLD ANALOGY
// ============================================================

/*

Without buffering:
-------------------
Drinking entire water tank at once ❌


With buffering:
----------------
Drink glass by glass ✅


*/


// ============================================================
// STREAM + BUFFER FLOW
// ============================================================

/*

            BIG FILE
                │
                ▼

      ┌─────────────────┐
      │   READ STREAM   │
      └────────┬────────┘
               │
      Reads small chunks
               │
               ▼

      ┌─────────────────┐
      │     BUFFER      │
      │ Temporary bytes │
      └────────┬────────┘
               │
               ▼

      ┌─────────────────┐
      │   YOUR CODE     │
      └─────────────────┘


*/