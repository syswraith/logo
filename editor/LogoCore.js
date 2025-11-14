"use strict";
var LogoCore = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Parser: () => Parser,
    Tokenizer: () => Tokenizer
  });

  // src/components/Parser.ts
  var Parser = class {
    constructor(tokens) {
      this.nested_tokens = [];
      this.tokens = tokens;
      this.AST_constructor();
      this.AST_evaluator();
    }
    // Constructs the AST
    // Normal commands are parsed and pushed as string or number
    // when a repeat token appears then it calls another function to handle it
    // repeat has a different nested array to handle things, but the logic is the same
    getAST() {
      return this.nested_tokens;
    }
    AST_constructor() {
      let temp_1 = null;
      const parseRepeatBlock = (tokens) => {
        let i = 0;
        const count = tokens[i++];
        if (tokens[i++] !== "[") throw new Error('Expected "[" after REPEAT count');
        const block = [count];
        let currentCmd = null;
        while (i < tokens.length) {
          const token = tokens[i];
          if (token === "]") {
            if (currentCmd) block.push(currentCmd);
            return ["REPEAT", block, i + 1];
          }
          if (typeof token === "string") {
            if (token === "REPEAT") {
              const [nested, nestedArgs, consumed] = parseRepeatBlock(tokens.slice(i + 1));
              block.push([nested, nestedArgs]);
              i += consumed + 1;
              currentCmd = null;
              continue;
            }
            if (currentCmd) block.push(currentCmd);
            currentCmd = [token, []];
          } else if (typeof token === "number") {
            if (!currentCmd) throw new Error(`Number ${token} found before any command`);
            currentCmd[1].push(token);
          }
          i++;
        }
        throw new Error('Missing closing "]" for REPEAT block');
      };
      for (let i = 0; i < this.tokens.length; i++) {
        const token = this.tokens[i];
        if (typeof token === "string") {
          if (temp_1) {
            this.nested_tokens.push(temp_1);
            temp_1 = null;
          }
          if (token.toUpperCase() === "REPEAT") {
            const [blockCmd, blockArgs, consumed] = parseRepeatBlock(this.tokens.slice(i + 1));
            this.nested_tokens.push([blockCmd, blockArgs]);
            i += consumed;
          } else {
            temp_1 = [token, []];
          }
        } else if (typeof token === "number") {
          if (!temp_1) throw new Error(`Number ${token} found before any command`);
          temp_1[1].push(token);
        }
      }
      if (temp_1) this.nested_tokens.push(temp_1);
    }
    AST_evaluator() {
      const command_definition = [
        { command_name: "FORWARD", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "FD", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "BACKWARD", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "BK", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "RIGHT", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "RT", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "LEFT", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "LT", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "PENUP", arguments_number: 0, arguments_type: [] },
        { command_name: "PU", arguments_number: 0, arguments_type: [] },
        { command_name: "PENDOWN", arguments_number: 0, arguments_type: [] },
        { command_name: "PD", arguments_number: 0, arguments_type: [] },
        { command_name: "CLEARSCREEN", arguments_number: 0, arguments_type: [] },
        { command_name: "CS", arguments_number: 0, arguments_type: [] },
        { command_name: "HOME", arguments_number: 0, arguments_type: [] },
        { command_name: "PRINT", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "PR", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "SETXY", arguments_number: 2, arguments_type: ["number", "number"] },
        { command_name: "SETPOS", arguments_number: 2, arguments_type: ["number", "number"] },
        { command_name: "SETHEADING", arguments_number: 1, arguments_type: ["number"] },
        { command_name: "SHOWTURTLE", arguments_number: 0, arguments_type: [] },
        { command_name: "ST", arguments_number: 0, arguments_type: [] },
        { command_name: "HIDETURTLE", arguments_number: 0, arguments_type: [] },
        { command_name: "HT", arguments_number: 0, arguments_type: [] }
      ];
      const evaluateNode = (node) => {
        const name = node[0].toUpperCase();
        if (name === "REPEAT") {
          const [count, ...body] = node[1];
          if (typeof count !== "number") throw new Error(`REPEAT expects numeric count, got ${typeof count}`);
          for (let i = 0; i < count; i++) body.forEach((cmd) => evaluateNode(cmd));
          return;
        }
        const matched = command_definition.some(
          (cmd) => cmd.command_name === name && cmd.arguments_number === node[1].length
        );
        if (!matched)
          throw new Error(`Invalid number of arguments (${node[1].length}) for "${node[0]}"`);
      };
      this.nested_tokens.forEach(evaluateNode);
    }
  };

  // src/components/Tokenizer.ts
  var Tokenizer = class {
    // declare a buffer that will hold a whole string regardless of spaces or newlines
    // first split by \n and filter out the empty elements
    // then tokenize them into strings by splitting with spaces
    // then take those strings and typecast them into their right types
    constructor(buffer) {
      this.lines = [];
      this.string_tokens = [];
      this.typecasted_tokens = [];
      this.tokens = [];
      this.buffer = buffer;
      let temp_arr = this.buffer.split("\n");
      this.lines = temp_arr.filter((element) => {
        return element !== "";
      });
      this.string_tokenize();
      this.typecast_tokenize();
      this.tokens = this.typecasted_tokens;
    }
    string_tokenize() {
      this.lines.forEach(
        (line) => {
          line.split(" ").forEach((token) => this.string_tokens.push(token));
        }
      );
    }
    typecast_tokenize() {
      this.string_tokens.forEach(
        (token) => {
          let n = Number(token);
          if (isNaN(n)) {
            this.typecasted_tokens.push(token.toUpperCase());
          } else {
            this.typecasted_tokens.push(n);
          }
        }
      );
    }
    dump_internals() {
      console.log(this.string_tokens);
      console.log(this.typecasted_tokens);
    }
  };
  return __toCommonJS(index_exports);
})();
