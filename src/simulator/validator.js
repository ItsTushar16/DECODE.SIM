import { WORD_SIZE, REGISTER_COUNT, INSTRUCTION_SET, findByMnemonic } from '../data/instructions';
import { isBinaryString, isHexString, hexToBinary } from '../utils/bits';

/**
 * Validates raw user input and normalizes it into a 16-bit binary string.
 * Returns { valid: boolean, binary?: string, error?: {title, reason, hint} }
 */
export function validateAndNormalize(rawInput, inputType) {
  const input = (rawInput || '').trim();

  if (!input) {
    return fail('EMPTY INPUT', 'No instruction was entered.', 'Type an instruction, or pick one of the sample instructions to get started.');
  }

  if (inputType === 'binary') {
    const cleaned = input.replace(/\s+/g, '');
    if (!isBinaryString(cleaned)) {
      return fail(
        'INVALID BINARY',
        `"${input}" contains characters other than 0 and 1.`,
        'Binary instructions may only contain the digits 0 and 1.'
      );
    }
    if (cleaned.length !== WORD_SIZE) {
      return fail(
        'INCORRECT INSTRUCTION LENGTH',
        `Expected exactly ${WORD_SIZE} bits, but received ${cleaned.length} bits.`,
        `This simulator uses a fixed ${WORD_SIZE}-bit instruction word. Pad or trim the input to ${WORD_SIZE} bits.`
      );
    }
    return { valid: true, binary: cleaned };
  }

  if (inputType === 'hex') {
    const cleaned = input.replace(/\s+/g, '');
    if (!isHexString(cleaned)) {
      return fail(
        'INVALID HEXADECIMAL',
        `"${input}" is not a valid hexadecimal value.`,
        'Hexadecimal instructions may only contain digits 0-9 and letters A-F (an optional "0x" prefix is allowed).'
      );
    }
    const binary = hexToBinary(cleaned, WORD_SIZE);
    if (binary.replace(/^0+/, '').length > WORD_SIZE) {
      return fail(
        'INCORRECT INSTRUCTION LENGTH',
        `The hex value is larger than ${WORD_SIZE} bits can hold.`,
        `This simulator uses a fixed ${WORD_SIZE}-bit instruction word.`
      );
    }
    return { valid: true, binary };
  }

  if (inputType === 'assembly') {
    return validateAssembly(input);
  }

  return fail('UNKNOWN INPUT TYPE', 'Could not determine how to interpret this input.', 'Choose Binary, Hexadecimal, or Assembly as the input type.');
}

function validateAssembly(input) {
  const tokens = input
    .replace(/,/g, ' ')
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return fail('EMPTY INPUT', 'No instruction was entered.', 'Example: ADD R1, R2, R3');
  }

  const mnemonic = tokens[0].toUpperCase();
  const def = findByMnemonic(mnemonic);

  if (!def) {
    const supported = INSTRUCTION_SET.map((i) => i.mnemonic).join(', ');
    return fail(
      'UNSUPPORTED INSTRUCTION',
      `"${tokens[0]}" is not part of this simulator's supported instruction set.`,
      `Supported instructions: ${supported}.`
    );
  }

  const operandTokens = tokens.slice(1);
  const tokenOrder = def.tokenOrder || def.operands;
  if (operandTokens.length !== tokenOrder.length) {
    return fail(
      'INCORRECT FORMAT',
      `${mnemonic} requires ${tokenOrder.length} operand(s) (${def.syntax}), but ${operandTokens.length} were given.`,
      `Expected syntax: ${def.syntax}`
    );
  }

  // Validate each operand (tokens may appear in a different order than the
  // semantic operand list, e.g. "LOAD rd, imm(rs1)" reads as rd, imm, rs1)
  const parsed = {};
  for (let i = 0; i < tokenOrder.length; i++) {
    const opName = tokenOrder[i];
    const raw = operandTokens[i];
    if (opName.startsWith('r')) {
      const regCheck = validateRegisterToken(raw);
      if (!regCheck.valid) return regCheck.error;
      parsed[opName] = regCheck.index;
    } else if (opName === 'imm') {
      if (!/^-?\d+$/.test(raw)) {
        return fail(
          'INVALID OPERAND',
          `"${raw}" is not a valid immediate (constant) value.`,
          'Immediate values must be whole numbers, e.g. 5 or -3.'
        );
      }
      const val = parseInt(raw, 10);
      const bits = def.format === 'J' ? 9 : 6;
      const min = -(1 << (bits - 1));
      const max = (1 << (bits - 1)) - 1;
      if (val < min || val > max) {
        return fail(
          'IMMEDIATE OUT OF RANGE',
          `${val} does not fit in the ${bits}-bit signed immediate field (range ${min} to ${max}).`,
          'Choose a smaller constant, or use a different instruction.'
        );
      }
      parsed[opName] = val;
    }
  }

  return { valid: true, mnemonic, def, operands: parsed };
}

function validateRegisterToken(raw) {
  const match = /^[Rr](\d+)$/.exec(raw);
  if (!match) {
    return {
      valid: false,
      error: fail(
        'INVALID REGISTER',
        `"${raw}" is not a valid register name.`,
        `Registers must be written as R0-R${REGISTER_COUNT - 1}.`
      ),
    };
  }
  const index = parseInt(match[1], 10);
  if (index < 0 || index >= REGISTER_COUNT) {
    return {
      valid: false,
      error: fail(
        'INVALID REGISTER',
        `R${index} does not exist in this architecture.`,
        `This simulator supports registers R0-R${REGISTER_COUNT - 1}.`
      ),
    };
  }
  return { valid: true, index };
}

function fail(title, reason, hint) {
  return { valid: false, error: { title, reason, hint } };
}
