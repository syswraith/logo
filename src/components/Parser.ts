export class Parser {
  tokens: (string | number)[];
  nested_tokens: [string, number[]][] = [];

  constructor(tokens: (string | number)[]) {
    this.tokens = tokens;
    this.AST_constructor();
    this.AST_evaluator();
    this.evaluated_tokens = this.nested_tokens;
  }

  // Constructs the AST
  // Normal commands are parsed and pushed as string or number
  // when a repeat token appears then it calls another function to handle it
  // repeat has a different nested array to handle things, but the logic is the same

  AST_constructor(): void {
    let temp_1: [string, any[]] | null = null;

    const parseRepeatBlock = (tokens: (string | number)[]): [string, any[]] => {
      let repeatBlock: [string, any[]] = ['repeat', []];
      let subTemp: [string, number[]] | null = null;
      tokens.forEach(t => {
        if (typeof t === 'string') {
          if (subTemp) repeatBlock[1].push(subTemp);
          subTemp = [t, []];
        } else if (typeof t === 'number') {
          if (!subTemp) throw new Error(`Number ${t} found before any command inside REPEAT`);
          subTemp[1].push(t);
        }
      });
      if (subTemp) repeatBlock[1].push(subTemp);
      return repeatBlock;
    };

    for (let i = 0; i < this.tokens.length; i++) {
      let token = this.tokens[i];

      if (typeof token === "string") {
        if (temp_1) { this.nested_tokens.push(temp_1); temp_1 = null; }

        if (token.toUpperCase() === "REPEAT") {
          let start = this.tokens.indexOf("[", i);
          let end = this.tokens.indexOf("]", start);
          if (start === -1 || end === -1) throw new Error("Missing brackets for REPEAT");
          let inside = this.tokens.slice(start + 1, end);
          this.nested_tokens.push(parseRepeatBlock(inside));
          i = end;
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


AST_evaluator(): void {
  type arg_type = "number";

  interface command_type {
    command_name: string;
    arguments_number: number;
    arguments_type: arg_type[];
  }

  const command_definition: command_type[] = [
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

  const evaluateNode = (node: [string, any[]]) => {
    if (node[0].toUpperCase() === "REPEAT") {
      node[1].forEach(sub => evaluateNode(sub));
    } else {
      const matched = command_definition.some(cmd =>
        cmd.command_name === node[0] && cmd.arguments_number === node[1].length
      );
      if (!matched) throw new Error(`Invalid number of arguments (${node[1].length}) for "${node[0]}"`);
    }
  };

  this.nested_tokens.forEach(evaluateNode);
}
  

}
