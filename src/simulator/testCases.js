import { validateAndNormalize } from './validator';
import { decodeBinary } from './decoder';
import { encodeInstruction } from './encoder';

export const TEST_CASES = [
  {
    id: 'TC-01',
    name: 'Valid Arithmetic Instruction',
    input: 'ADD R1, R2, R3',
    inputType: 'assembly',
    expected: 'PASS',
    expectedAssembly: 'ADD R1, R2, R3',
  },
  {
    id: 'TC-02',
    name: 'Valid Logical Instruction',
    input: 'XOR R4, R5, R6',
    inputType: 'assembly',
    expected: 'PASS',
    expectedAssembly: 'XOR R4, R5, R6',
  },
  {
    id: 'TC-03',
    name: 'Valid Data Transfer Instruction',
    input: 'LOAD R3, 4(R2)',
    inputType: 'assembly',
    expected: 'PASS',
    expectedAssembly: 'LOAD R3, 4(R2)',
  },
  {
    id: 'TC-04',
    name: 'Valid Immediate Instruction',
    input: 'ADDI R2, R1, 5',
    inputType: 'assembly',
    expected: 'PASS',
    expectedAssembly: 'ADDI R2, R1, 5',
  },
  {
    id: 'TC-05',
    name: 'Valid Branch Instruction',
    input: 'BEQ R1, R2, 3',
    inputType: 'assembly',
    expected: 'PASS',
    expectedAssembly: 'BEQ R1, R2, 3',
  },
  {
    id: 'TC-06',
    name: 'Invalid Opcode (Binary)',
    input: '1110000000000000',
    inputType: 'binary',
    expected: 'FAIL',
    expectedErrorTitle: 'INVALID INSTRUCTION',
  },
  {
    id: 'TC-07',
    name: 'Incorrect Instruction Length',
    input: '01100',
    inputType: 'binary',
    expected: 'FAIL',
    expectedErrorTitle: 'INCORRECT INSTRUCTION LENGTH',
  },
  {
    id: 'TC-08',
    name: 'Invalid Register',
    input: 'ADD R1, R9, R3',
    inputType: 'assembly',
    expected: 'FAIL',
    expectedErrorTitle: 'INVALID REGISTER',
  },
];

export function runTestCase(tc) {
  const norm = validateAndNormalize(tc.input, tc.inputType);
  if (!norm.valid) {
    const actual = 'FAIL';
    const pass = actual === tc.expected && (!tc.expectedErrorTitle || norm.error.title === tc.expectedErrorTitle);
    return { ...tc, actual, actualDetail: `${norm.error.title}: ${norm.error.reason}`, pass };
  }

  let binary = norm.binary;
  if (tc.inputType === 'assembly') {
    const enc = encodeInstruction(norm.mnemonic, norm.operands);
    if (!enc.success) {
      return { ...tc, actual: 'FAIL', actualDetail: enc.error, pass: tc.expected === 'FAIL' };
    }
    binary = enc.binary;
  }

  const decoded = decodeBinary(binary);
  if (!decoded.success) {
    const actual = 'FAIL';
    const pass = actual === tc.expected && (!tc.expectedErrorTitle || decoded.error.title === tc.expectedErrorTitle);
    return { ...tc, actual, actualDetail: `${decoded.error.title}: ${decoded.error.reason}`, pass };
  }

  const actual = 'PASS';
  const pass = actual === tc.expected && (!tc.expectedAssembly || decoded.assembly === tc.expectedAssembly);
  return { ...tc, actual, actualDetail: decoded.assembly, pass };
}
