// ============================================================================
// INSTRUCTION SET DEFINITIONS
// A simplified, educational RISC-style instruction set inspired by RISC-V.
// This is NOT the full RISC-V ISA — it is a deliberately small teaching subset
// built for the "Instruction Decoding Algorithms" simulator.
//
// Word size: 16 bits (kept small so students can read a full instruction
// on screen at a glance; the *concepts* are identical to 32-bit RISC-V).
//
// ---------------------------------------------------------------------------
// FORMATS
// ---------------------------------------------------------------------------
// R-Type (Register)            : opcode(4) | rd(3) | rs1(3) | rs2(3) | funct(3)
// I-Type (Immediate)           : opcode(4) | rd(3) | rs1(3) | imm(6)
// S-Type (Store / Data transfer): opcode(4) | rs2(3) | rs1(3) | imm(6)
// B-Type (Branch)              : opcode(4) | rs1(3) | rs2(3) | imm(6)
// J-Type (Jump)                : opcode(4) | rd(3)  | imm(9)
//
// All formats total 16 bits. Register fields are 3 bits => 8 registers (R0-R7).
// ============================================================================

export const WORD_SIZE = 16;
export const REGISTER_COUNT = 8;
export const REGISTER_FIELD_BITS = 3;

export const FORMATS = {
  R: {
    id: 'R',
    name: 'R-Type',
    fullName: 'Register Type',
    description:
      'Used for operations where all operands are already inside registers (e.g. ADD, SUB, AND, OR, XOR). The opcode identifies the instruction family and the funct field disambiguates between related operations.',
    fields: [
      { name: 'opcode', bits: 4, start: 0, purpose: 'Identifies the instruction family' },
      { name: 'rd', bits: 3, start: 4, purpose: 'Destination register (where the result is written)' },
      { name: 'rs1', bits: 3, start: 7, purpose: 'First source register' },
      { name: 'rs2', bits: 3, start: 10, purpose: 'Second source register' },
      { name: 'funct', bits: 3, start: 13, purpose: 'Distinguishes instructions that share an opcode' },
    ],
    example: 'ADD R1, R2, R3',
  },
  I: {
    id: 'I',
    name: 'I-Type',
    fullName: 'Immediate Type',
    description:
      'Used when one operand is a constant ("immediate") embedded directly in the instruction rather than read from a register (e.g. ADDI, ANDI, LOAD).',
    fields: [
      { name: 'opcode', bits: 4, start: 0, purpose: 'Identifies the instruction family' },
      { name: 'rd', bits: 3, start: 4, purpose: 'Destination register' },
      { name: 'rs1', bits: 3, start: 7, purpose: 'Source register (base for LOAD, operand for ADDI/ANDI)' },
      { name: 'imm', bits: 6, start: 10, purpose: 'Signed immediate constant / address offset' },
    ],
    example: 'ADDI R1, R2, 5',
  },
  S: {
    id: 'S',
    name: 'S-Type',
    fullName: 'Store Type',
    description:
      'Used for instructions that write a register value out to memory (e.g. STORE). The value being stored and the base address register are both plain registers, plus an offset immediate.',
    fields: [
      { name: 'opcode', bits: 4, start: 0, purpose: 'Identifies the instruction family' },
      { name: 'rs2', bits: 3, start: 4, purpose: 'Register holding the value to store' },
      { name: 'rs1', bits: 3, start: 7, purpose: 'Base address register' },
      { name: 'imm', bits: 6, start: 10, purpose: 'Address offset' },
    ],
    example: 'STORE R3, 4(R2)',
  },
  B: {
    id: 'B',
    name: 'B-Type',
    fullName: 'Branch Type',
    description:
      'Used for conditional control-flow instructions that compare two registers and jump only if the condition holds (e.g. BEQ).',
    fields: [
      { name: 'opcode', bits: 4, start: 0, purpose: 'Identifies the instruction family' },
      { name: 'rs1', bits: 3, start: 4, purpose: 'First register to compare' },
      { name: 'rs2', bits: 3, start: 7, purpose: 'Second register to compare' },
      { name: 'imm', bits: 6, start: 10, purpose: 'Signed branch offset (in instructions)' },
    ],
    example: 'BEQ R1, R2, 3',
  },
  J: {
    id: 'J',
    name: 'J-Type',
    fullName: 'Jump Type',
    description:
      'Used for unconditional jumps that also save a return address (e.g. JAL — Jump And Link). A large immediate gives it reach across the program.',
    fields: [
      { name: 'opcode', bits: 4, start: 0, purpose: 'Identifies the instruction family' },
      { name: 'rd', bits: 3, start: 4, purpose: 'Register that receives the return address' },
      { name: 'imm', bits: 9, start: 7, purpose: 'Signed jump target offset' },
    ],
    example: 'JAL R7, 10',
  },
};

// funct values disambiguate R-type instructions that share opcode 0110 (ALU-reg family)
export const INSTRUCTION_SET = [
  {
    mnemonic: 'ADD',
    opcode: '0110',
    funct: '000',
    format: 'R',
    category: 'Arithmetic',
    operands: ['rd', 'rs1', 'rs2'],
    syntax: 'ADD rd, rs1, rs2',
    description: 'Adds the values in rs1 and rs2, stores the result in rd.',
    semantics: 'rd = rs1 + rs2',
    aluOp: 'ADD',
  },
  {
    mnemonic: 'SUB',
    opcode: '0110',
    funct: '001',
    format: 'R',
    category: 'Arithmetic',
    operands: ['rd', 'rs1', 'rs2'],
    syntax: 'SUB rd, rs1, rs2',
    description: 'Subtracts rs2 from rs1, stores the result in rd.',
    semantics: 'rd = rs1 - rs2',
    aluOp: 'SUB',
  },
  {
    mnemonic: 'AND',
    opcode: '0111',
    funct: '000',
    format: 'R',
    category: 'Logical',
    operands: ['rd', 'rs1', 'rs2'],
    syntax: 'AND rd, rs1, rs2',
    description: 'Bitwise AND of rs1 and rs2, stores the result in rd.',
    semantics: 'rd = rs1 & rs2',
    aluOp: 'AND',
  },
  {
    mnemonic: 'OR',
    opcode: '0111',
    funct: '001',
    format: 'R',
    category: 'Logical',
    operands: ['rd', 'rs1', 'rs2'],
    syntax: 'OR rd, rs1, rs2',
    description: 'Bitwise OR of rs1 and rs2, stores the result in rd.',
    semantics: 'rd = rs1 | rs2',
    aluOp: 'OR',
  },
  {
    mnemonic: 'XOR',
    opcode: '0111',
    funct: '010',
    format: 'R',
    category: 'Logical',
    operands: ['rd', 'rs1', 'rs2'],
    syntax: 'XOR rd, rs1, rs2',
    description: 'Bitwise XOR of rs1 and rs2, stores the result in rd.',
    semantics: 'rd = rs1 ^ rs2',
    aluOp: 'XOR',
  },
  {
    mnemonic: 'LOAD',
    opcode: '0000',
    format: 'I',
    category: 'Data Transfer',
    operands: ['rd', 'rs1', 'imm'],
    tokenOrder: ['rd', 'imm', 'rs1'],
    syntax: 'LOAD rd, imm(rs1)',
    description: 'Loads the value at memory address (rs1 + imm) into rd.',
    semantics: 'rd = MEM[rs1 + imm]',
    aluOp: 'ADD',
  },
  {
    mnemonic: 'STORE',
    opcode: '0001',
    format: 'S',
    category: 'Data Transfer',
    operands: ['rs2', 'rs1', 'imm'],
    tokenOrder: ['rs2', 'imm', 'rs1'],
    syntax: 'STORE rs2, imm(rs1)',
    description: 'Stores the value in rs2 into memory address (rs1 + imm).',
    semantics: 'MEM[rs1 + imm] = rs2',
    aluOp: 'ADD',
  },
  {
    mnemonic: 'ADDI',
    opcode: '0010',
    format: 'I',
    category: 'Immediate',
    operands: ['rd', 'rs1', 'imm'],
    syntax: 'ADDI rd, rs1, imm',
    description: 'Adds an immediate constant to rs1, stores the result in rd.',
    semantics: 'rd = rs1 + imm',
    aluOp: 'ADD',
  },
  {
    mnemonic: 'ANDI',
    opcode: '0011',
    format: 'I',
    category: 'Immediate',
    operands: ['rd', 'rs1', 'imm'],
    syntax: 'ANDI rd, rs1, imm',
    description: 'Bitwise ANDs rs1 with an immediate constant, stores the result in rd.',
    semantics: 'rd = rs1 & imm',
    aluOp: 'AND',
  },
  {
    mnemonic: 'BEQ',
    opcode: '0100',
    format: 'B',
    category: 'Control Flow',
    operands: ['rs1', 'rs2', 'imm'],
    syntax: 'BEQ rs1, rs2, imm',
    description: 'Branches to PC + imm if rs1 equals rs2.',
    semantics: 'if (rs1 == rs2) PC += imm',
    aluOp: 'SUB',
  },
  {
    mnemonic: 'JAL',
    opcode: '0101',
    format: 'J',
    category: 'Control Flow',
    operands: ['rd', 'imm'],
    syntax: 'JAL rd, imm',
    description: 'Jumps to PC + imm and saves the return address (PC + 1) in rd.',
    semantics: 'rd = PC + 1; PC += imm',
    aluOp: 'ADD',
  },
];

export const CATEGORY_COLORS = {
  Arithmetic: '#FFB000',
  Logical: '#34D399',
  'Data Transfer': '#60A5FA',
  Immediate: '#C084FC',
  'Control Flow': '#F87171',
};

export function findByMnemonic(mnemonic) {
  return INSTRUCTION_SET.find((i) => i.mnemonic === mnemonic.toUpperCase());
}

export function findByOpcodeAndFunct(opcode, funct) {
  // First try exact opcode+funct match (R-type family)
  const candidates = INSTRUCTION_SET.filter((i) => i.opcode === opcode);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  // Multiple share this opcode -> disambiguate by funct
  return candidates.find((i) => i.funct === funct) || null;
}

export function registerName(index) {
  return `R${index}`;
}
