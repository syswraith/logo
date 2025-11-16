export class Parser {
  tokens: (string | number)[];
  nested_tokens: [string, number[]][] = [];

  constructor(tokens: (string | number)[]) {
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

  AST_constructor(): void {
    // this holds the tokens
    let temp_1: [string, any[]] | null = null;

    // handles nested repeated blocks recursively
    const parseRepeatBlock = (tokens: (string | number)[]): [string, any[], number] => {
      // i is the number of token starting from 0
      let i = 0;
      // keeps track of token counts
      const count = tokens[i++] as number;
      // yell if no [
      if (tokens[i++] !== "[") throw new Error('Expected "[" after REPEAT count');

      // declare a block to hold the count and the command
      const block: any[] = [count];
      // command can be of this type or any type OR null
      let currentCmd: [string, any[]] | null = null;

      while (i < tokens.length) {
        const token = tokens[i];

        // push the command if you encounter ]
        if (token === "]") {
          // parse commands and add them to the block declared above
          if (currentCmd) block.push(currentCmd);
          return ["REPEAT", block, i + 1];
        }

        if (typeof token === "string") {
          if (token.toUpperCase() === "REPEAT") {
            // handle nested repeat, nestedCmdName is repeat, nestedArgs is the parsed block
            // so if repeat 2 [ some cmd ]
            // then nestedCmdName = repeat
            // nestedArgs = [2, [cmd, []]]
            // slice tokens from current + 1 to end of tokens arr
            // keep track of it in consumed
            // null the current command, and continue the loop
            const [nestedCmdName, nestedArgs, consumed] = parseRepeatBlock(tokens.slice(i + 1));
            block.push([nestedCmdName, nestedArgs]);
            i += consumed + 1;
            currentCmd = null;
            continue;
          }
          if (currentCmd) block.push(currentCmd);
          currentCmd = [token, []];
        } else if (typeof token === "number") {
          // if the current token is a number then yell
          if (!currentCmd) throw new Error(`Number ${token} found before any command`);
          currentCmd[1].push(token);
        }

        i++;
      }
      // yell if no ]
      throw new Error('Missing closing "]" for REPEAT block');
    };


    // normal token walkthrough
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];

      if (typeof token === "string") {
        if (temp_1) { this.nested_tokens.push(temp_1); temp_1 = null; }

        // if encounter repeat then call that function above ^
        if (token.toUpperCase() === "REPEAT") {
          const [cmdName, args, consumed] = parseRepeatBlock(this.tokens.slice(i + 1));
          this.nested_tokens.push([cmdName, args]);
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
      const name = node[0].toUpperCase();

      if (name === "REPEAT") {
        const [count, ...body] = node[1];
        if (typeof count !== "number") throw new Error(`REPEAT expects numeric count, got ${typeof count}`);
        for (let i = 0; i < count; i++) body.forEach(cmd => evaluateNode(cmd));
        return;
      }

      const matched = command_definition.some(cmd =>
        cmd.command_name === name && cmd.arguments_number === node[1].length
      );

      if (!matched)
        throw new Error(`Invalid number of arguments (${node[1].length}) for "${node[0]}"`);
    };

    this.nested_tokens.forEach(evaluateNode);
  }

}
