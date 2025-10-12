import { Tokenizer } from './components/Tokenizer.ts';

let example = "FD 10\nFD 10\n";
let tokenizer = new Tokenizer(example);
let tokens = tokenizer.tokens;
console.log(tokens);

