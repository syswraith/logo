export class Command 
{
  command: string;
  value?: number;
  angle?: number;

  constructor(command: string, value?: number, angle?: number) {
    this.command = command;
    if (value !== undefined) { this.value = value; }
    if (angle !== undefined) { this.angle = value; }
  }

}

