import { FORMATS, INSTRUCTION_SET, findByOpcodeAndFunct, registerName } from '../data/instructions';
import { extractField, signedBinaryToDecimal, binaryToDecimal, binaryToHex } from '../utils/bits';
import { generateControlSignals } from './controlSignals';

const OPCODE_BITS = 4;

/**
 * Decodes a 16-bit binary instruction string end to end.
 * Returns a rich result object describing every stage of decoding,
 * or an error object if the opcode/instruction is invalid.
 */
export function decodeBinary(binary) {
  const opcode = extractField(binary, 0, OPCODE_BITS);

  // Every format keeps opcode in bits [0:4), so we can determine candidate
  // instructions purely from opcode first.
  const candidates = INSTRUCTION_SET.filter((i) => i.opcode === opcode);

  if (candidates.length === 0) {
    return {
      success: false,
      binary,
      opcode,
      error: {
        title: 'INVALID INSTRUCTION',
        reason: `Opcode ${opcode} is not supported by the simulator.`,
        hint: 'Check the Opcode Explorer for the full list of supported opcodes.',
      },
    };
  }

  // For R-type families sharing an opcode, funct field (bits 13-16) disambiguates.
  const format = FORMATS[candidates[0].format];
  let def = candidates[0];

  if (candidates.length > 1) {
    const functField = extractField(binary, 13, 3);
    const match = findByOpcodeAndFunct(opcode, functField);
    if (!match) {
      return {
        success: false,
        binary,
        opcode,
        error: {
          title: 'INVALID INSTRUCTION',
          reason: `Opcode ${opcode} was recognized, but funct value ${functField} does not match any supported instruction.`,
          hint: 'Check the Opcode Explorer for valid opcode/funct combinations.',
        },
      };
    }
    def = match;
  }

  // Extract every field defined by this format
  const fieldValues = {};
  format.fields.forEach((f) => {
    fieldValues[f.name] = extractField(binary, f.start, f.bits);
  });

  // Resolve operands into human-readable form
  const operands = {};
  def.operands.forEach((opName) => {
    if (opName === 'imm') {
      operands.imm = signedBinaryToDecimal(fieldValues.imm);
    } else {
      const idx = binaryToDecimal(fieldValues[opName]);
      operands[opName] = { index: idx, name: registerName(idx), binary: fieldValues[opName] };
    }
  });

  const controlSignals = generateControlSignals(def);

  const assembly = buildAssemblyString(def, operands);

  return {
    success: true,
    binary,
    hex: binaryToHex(binary),
    opcode,
    funct: fieldValues.funct,
    format,
    definition: def,
    fieldValues,
    operands,
    controlSignals,
    assembly,
    category: def.category,
  };
}

function buildAssemblyString(def, operands) {
  switch (def.format) {
    case 'R':
      return `${def.mnemonic} ${operands.rd.name}, ${operands.rs1.name}, ${operands.rs2.name}`;
    case 'I':
      if (def.mnemonic === 'LOAD') {
        return `${def.mnemonic} ${operands.rd.name}, ${operands.imm}(${operands.rs1.name})`;
      }
      return `${def.mnemonic} ${operands.rd.name}, ${operands.rs1.name}, ${operands.imm}`;
    case 'S':
      return `${def.mnemonic} ${operands.rs2.name}, ${operands.imm}(${operands.rs1.name})`;
    case 'B':
      return `${def.mnemonic} ${operands.rs1.name}, ${operands.rs2.name}, ${operands.imm}`;
    case 'J':
      return `${def.mnemonic} ${operands.rd.name}, ${operands.imm}`;
    default:
      return def.mnemonic;
  }
}

export { OPCODE_BITS };
