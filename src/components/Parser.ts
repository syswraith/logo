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
    let temp_1: [string, any[]] | null = null;

    // dont read this first read the one after this
    // welcome back :) now parseRepeatBlock takes in tokens and returns an array of [token, [args...]]
    // init i to 0
    // the 0th index is the repeat cmd itself, the 1st index is the count
    // check the 3rd for '['
    // declare a block that holds the count initially
    // declare another block that holds the current commands and their arguments
    // when we're done, we will push the current commands block to the block
    // while i < tokens do stuff
    // check for ']' then do the ALMIGHTY PUSH
    // if token == string and token == repeat then recursively call the same function BUT slice the tokens
    const parseRepeatBlock = (tokens: (string | number)[]): [string, any[], number] => {
      let i = 0;
      const count = tokens[i++];
      if (tokens[i++] !== '[') throw new Error('Expected "[" after REPEAT count');

      const block: any[] = [count];
      let currentCmd: [string, any[]] | null = null;

      while (i < tokens.length) {
        const token = tokens[i];

        if (token === ']') {
          if (currentCmd) block.push(currentCmd);
          return ['REPEAT', block, i + 1];
        }

        if (typeof token === 'string') {
          if (token === 'REPEAT') {
            const [nested, nestedArgs, consumed] = parseRepeatBlock(tokens.slice(i + 1));
            block.push([nested, nestedArgs]);
            i += consumed + 1;
            currentCmd = null;
            continue;
          }
          if (currentCmd) block.push(currentCmd);
          currentCmd = [token, []];
        } else if (typeof token === 'number') {
          if (!currentCmd) throw new Error(`Number ${token} found before any command`);
          currentCmd[1].push(token);
        }

        i++;
      }

      throw new Error('Missing closing "]" for REPEAT block');
    };

    // loop over the tokens
    // if string then check for no-repeat and repeat
    //    if temp_1 exists then push temp_1 to nested_tokens and set it equal to null for next use
    //    if token equals repeat then call the parseRepeatBlock which will return the command, the arguments and the number of tokens consumed
    //      push the commands and arguments to the nested_tokens and add the consumed tokens to i so it resumes the loop after that many number of tokens
    //    else set temp_1 = [token, [arg1, arg2, ...]]
    // if number then push to arguments
    // now go read that block above
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];

      if (typeof token === 'string') {
        if (temp_1) { this.nested_tokens.push(temp_1); temp_1 = null; }

        if (token.toUpperCase() === 'REPEAT') {
          const [blockCmd, blockArgs, consumed] = parseRepeatBlock(this.tokens.slice(i + 1));
          this.nested_tokens.push([blockCmd, blockArgs]);
          i += consumed;
        } else {
          temp_1 = [token, []];
        }

      } else if (typeof token === 'number') {
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
