export class Tokenizer
{
  buffer: string;
  lines: string[] = [];
  string_tokens: string[] = [];
  typecasted_tokens: (string | number)[] = [];
  tokens: (string | number)[] = [];

  constructor(buffer: string) {
    this.buffer = buffer;
    let temp_arr = this.buffer.split('\n');
    this.lines = temp_arr.filter((element)=>{ return element !== '' });

    this.string_tokenize();
    this.typecast_tokenize();
    this.tokens = this.typecasted_tokens;
  }

  string_tokenize(): void {
    this.lines.forEach(
      (line)=>{
        line.split(' ').forEach((token)=>this.string_tokens.push(token));
      }
    )
  }

  typecast_tokenize(): void {
    this.string_tokens.forEach(
      (token)=>{
        let n = Number(token);
        if (isNaN(n)) { this.typecasted_tokens.push(token.toUpperCase()); }
        else { this.typecasted_tokens.push(n); }
      }
    );
  }

  dump_internals(): void {
    console.log(this.string_tokens)
    console.log(this.typecasted_tokens)
  }

}

