export class Parser {
  tokens: (string | number)[];
  nested_tokens: [string, number[]][] = [];

  constructor(tokens: (string | number)[]) {
    this.tokens = tokens;
    this.AST_constructor();
    this.AST_evaluator();
    this.evaluated_tokens = this.nested_tokens;
  }

  AST_constructor(): void {
    let temp_1: [string, number[]] | null = null;

    this.tokens.forEach((token) => {

      if (typeof token === "string") {

        if (temp_1) this.nested_tokens.push(temp_1);
        temp_1 = [token, []];

      } else if (typeof token === "number") {

        if (!temp_1) throw new Error(`Number ${token} found before any command`);
        temp_1[1].push(token);

      }

    });

    if (temp_1) this.nested_tokens.push(temp_1);
  }

  AST_evaluator():void {

    type arg_type = "number";

    interface command_type {
      command_name: string;
      arguments_number: number;
      arguments_type: arg_type[];
    }

    const command_definition: command_type[] = [
      // Movement
      { command_name: "FORWARD", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "FD", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "BACKWARD", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "BK", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "RIGHT", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "RT", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "LEFT", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "LT", arguments_number: 1, arguments_type: ["number"] },

      // Pen control
      { command_name: "PENUP", arguments_number: 0, arguments_type: [] },
      { command_name: "PU", arguments_number: 0, arguments_type: [] },
      { command_name: "PENDOWN", arguments_number: 0, arguments_type: [] },
      { command_name: "PD", arguments_number: 0, arguments_type: [] },

      // Screen control
      { command_name: "CLEARSCREEN", arguments_number: 0, arguments_type: [] },
      { command_name: "CS", arguments_number: 0, arguments_type: [] },
      { command_name: "HOME", arguments_number: 0, arguments_type: [] },

      // Value/print
      { command_name: "PRINT", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "PR", arguments_number: 1, arguments_type: ["number"] },

      // Position
      { command_name: "SETXY", arguments_number: 2, arguments_type: ["number", "number"] },
      { command_name: "SETPOS", arguments_number: 2, arguments_type: ["number", "number"] },

      // Heading & visibility
      { command_name: "SETHEADING", arguments_number: 1, arguments_type: ["number"] },
      { command_name: "SHOWTURTLE", arguments_number: 0, arguments_type: [] },
      { command_name: "ST", arguments_number: 0, arguments_type: [] },
      { command_name: "HIDETURTLE", arguments_number: 0, arguments_type: [] },
      { command_name: "HT", arguments_number: 0, arguments_type: [] }
    ];
    this.nested_tokens.forEach(
      (token)=>{
        let matched = false;
        for (const command of command_definition) {

          if (command.command_name === token[0] && command.arguments_number === token[1].length) {
            matched = true;
            break;
          }

        }

        if (!matched) {
          throw new Error(`Invalid number of arguments (${token[1].length}) for "${token[0]}"`);
        }

      }
    );


  }


}
