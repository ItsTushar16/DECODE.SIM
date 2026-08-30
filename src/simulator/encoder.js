import { FORMATS, WORD_SIZE, findByMnemonic } from '../data/instructions';
import { decimalToBinary } from '../utils/bits';

/**
 * Encodes an instruction from its mnemonic and operand values into a
 * WORD_SIZE-bit binary string. This is the inverse of decoder.decodeBinary,
 * and both must stay logically consistent (verified by the encode -> decode
 * round trip in the Encoder page and in the automated test suite).
 *
 * operands: { rd, rs1, rs2 } as register indices (numbers), { imm } as a signed integer.
 */
export function encodeInstruction(mnemonic, operands) {
  const def = findByMnemonic(mnemonic);
  if (!def) {
    return { success: false, error: `"${mnemonic}" is not a supported instruction.` };
  }
  const format = FORMATS[def.format];

  // Start with a blank word
  let bits = new Array(WORD_SIZE).fill('0');

  const place = (start, len, value) => {
    for (let i = 0; i < len; i++) bits[start + i] = value[i];
  };

  place(0, 4, def.opcode);

  format.fields.forEach((f) => {
    if (f.name === 'opcode') return;
    if (f.name === 'funct') {
      place(f.start, f.bits, def.funct || '000');
      return;
    }
    if (f.name === 'imm') {
      const val = operands.imm ?? 0;
      place(f.start, f.bits, decimalToBinary(val, f.bits));
      return;
    }
    // register field (rd / rs1 / rs2)
    const val = operands[f.name] ?? 0;
    place(f.start, f.bits, decimalToBinary(val, f.bits));
  });

  const binary = bits.join('');
  return { success: true, binary, definition: def };
}
