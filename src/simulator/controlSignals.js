/**
 * Generates a set of SIMULATED control signals for a decoded instruction.
 *
 * IMPORTANT (academic honesty): these signals are an educational
 * simplification designed to illustrate the concept of a control unit.
 * They do not represent the literal microarchitecture or signal names
 * used inside any real, commercial processor.
 */
export function generateControlSignals(def) {
  const base = {
    RegRead: false,
    RegWrite: false,
    ALUOp: def.aluOp || 'NONE',
    MemRead: false,
    MemWrite: false,
    Branch: false,
    Jump: false,
    ALUSrc: 'REGISTER', // REGISTER | IMMEDIATE
    MemToReg: false,
  };

  switch (def.category) {
    case 'Arithmetic':
    case 'Logical':
      return { ...base, RegRead: true, RegWrite: true, ALUSrc: 'REGISTER' };
    case 'Immediate':
      return { ...base, RegRead: true, RegWrite: true, ALUSrc: 'IMMEDIATE' };
    case 'Data Transfer':
      if (def.mnemonic === 'LOAD') {
        return {
          ...base,
          RegRead: true,
          RegWrite: true,
          MemRead: true,
          MemToReg: true,
          ALUSrc: 'IMMEDIATE',
        };
      }
      // STORE
      return {
        ...base,
        RegRead: true,
        RegWrite: false,
        MemWrite: true,
        ALUSrc: 'IMMEDIATE',
      };
    case 'Control Flow':
      if (def.mnemonic === 'BEQ') {
        return { ...base, RegRead: true, RegWrite: false, Branch: true, ALUSrc: 'REGISTER' };
      }
      // JAL
      return { ...base, RegRead: false, RegWrite: true, Jump: true, ALUSrc: 'IMMEDIATE' };
    default:
      return base;
  }
}

export const SIGNAL_DESCRIPTIONS = {
  RegRead: 'Whether the register file is read to supply ALU operands.',
  RegWrite: 'Whether a result is written back into the register file.',
  ALUOp: 'The operation the ALU performs (ADD, SUB, AND, OR, XOR).',
  MemRead: 'Whether data memory is read.',
  MemWrite: 'Whether data memory is written.',
  Branch: 'Whether the instruction may change the Program Counter conditionally.',
  Jump: 'Whether the instruction unconditionally changes the Program Counter.',
  ALUSrc: 'Whether the ALU\'s second operand comes from a register or the decoded immediate.',
  MemToReg: 'Whether the value written to a register comes from memory (vs. the ALU).',
};
