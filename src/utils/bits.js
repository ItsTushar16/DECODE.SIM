import { WORD_SIZE } from '../data/instructions';

export function isBinaryString(str) {
  return /^[01]+$/.test(str);
}

export function isHexString(str) {
  return /^(0x)?[0-9a-fA-F]+$/.test(str);
}

export function padBinary(bin, length = WORD_SIZE) {
  return bin.padStart(length, '0');
}

export function hexToBinary(hex, length = WORD_SIZE) {
  const clean = hex.replace(/^0x/i, '');
  const bin = parseInt(clean, 16).toString(2);
  return padBinary(bin, length);
}

export function binaryToHex(bin) {
  const dec = parseInt(bin, 2);
  const hexDigits = Math.ceil(bin.length / 4);
  return '0x' + dec.toString(16).toUpperCase().padStart(hexDigits, '0');
}

export function binaryToDecimal(bin) {
  return parseInt(bin, 2);
}

export function signedBinaryToDecimal(bin) {
  const unsigned = parseInt(bin, 2);
  const bits = bin.length;
  const signBit = 1 << (bits - 1);
  if (unsigned & signBit) {
    return unsigned - (1 << bits);
  }
  return unsigned;
}

export function decimalToBinary(dec, length) {
  let bin;
  if (dec < 0) {
    bin = (dec >>> 0).toString(2).slice(-32); // two's complement via JS 32-bit
    bin = bin.slice(-length);
  } else {
    bin = dec.toString(2).padStart(length, '0');
  }
  return bin.slice(-length).padStart(length, '0');
}

export function extractField(bin, start, bits) {
  return bin.substring(start, start + bits);
}
