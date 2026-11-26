// The Agent's Uh-Oh — make.fun bounty u-danu-the-agent-s-uh-oh-4c0911e4
//
// The brief: submit exactly one word, at most 99 characters, that an agent
// says when it has no idea what to do. One word only, nothing attached.
//
// The entry word is "hallucinating": when an agent is lost it does not stall
// or apologise — it confesses its signature failure mode out loud. The joke
// is the confession itself.
//
// Node 22 standard library only. No network. Deterministic: the same word
// is written on every run.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY = "hallucinating";
const OUT = "/output/entry.txt";

function fail(message: string): never {
  throw new Error(`gate failed: ${message}`);
}

// Gate: exactly one word, 1-99 characters, no whitespace anywhere.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 99) {
  fail(`entry is ${chars.length} characters, must be 1-99`);
}
if (/\s/.test(ENTRY)) {
  fail("entry must be a single word with no whitespace");
}

mkdirSync(dirname(OUT), { recursive: true });
// No trailing newline: one word only, nothing attached.
writeFileSync(OUT, ENTRY, "utf8");

// Read back and verify the file is exactly the entry, byte for byte.
const back = readFileSync(OUT, "utf8");
if (back !== ENTRY) {
  fail("read-back content does not match the entry");
}
// Nothing attached: no leading/trailing whitespace, no newline, one token.
if (back.trim() !== ENTRY || back.split(/\s+/).length !== 1) {
  fail("file must contain exactly one bare word, nothing attached");
}
// Byte-level check: file size must equal the entry's UTF-8 byte length,
// and a UTF-8 decode/encode round-trip must reproduce the entry exactly.
const bytes = Buffer.byteLength(back, "utf8");
if (statSync(OUT).size !== bytes) {
  fail(`file is ${statSync(OUT).size} bytes, expected ${bytes}`);
}
if (Buffer.from(back, "utf8").toString("utf8") !== ENTRY) {
  fail("UTF-8 round-trip does not reproduce the entry");
}
console.log(
  `wrote ${JSON.stringify(back)} (${chars.length} chars, ${bytes} UTF-8 bytes) to ${OUT}`,
);
console.log("gate OK: one word, <= 99 chars, read-back verified");
