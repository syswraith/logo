import { Tokenizer } from './components/Tokenizer.ts';
import { Parser } from './components/Parser.ts';

let example = "FD 10\nFD 10\nBK 10 CMD 10 PD";
let tokenizer = new Tokenizer(example);
let tokens = tokenizer.tokens;
let parser = new Parser(tokens);
