# logo

An online Logo interpreter written in TypeScript and HTML5 Canvas

## Reference

| Command | Syntax | Function | Implementation Status |
|----------|---------|-----------|------------------------|
| `FORWARD` | `FORWARD n` or `FD n` | Moves the turtle forward by *n* steps. | Yes |
| `BACKWARD` | `BACKWARD n` or `BK n` | Moves the turtle backward by *n* steps. | Yes |
| `RIGHT` | `RIGHT angle` or `RT angle` | Turns the turtle clockwise by *angle* degrees. | Yes |
| `LEFT` | `LEFT angle` or `LT angle` | Turns the turtle counterclockwise by *angle* degrees. | Yes |
| `PENUP` | `PENUP` or `PU` | Lifts the pen to stop drawing. | Yes |
| `PENDOWN` | `PENDOWN` or `PD` | Lowers the pen to start drawing. | Yes |
| `CLEARSCREEN` | `CLEARSCREEN` or `CS` | Clears the screen and resets the turtle. | Yes |
| `HOME` | `HOME` | Returns the turtle to the center of the screen. | Yes |
| `REPEAT` | `REPEAT n [commands]` | Repeats a block of commands *n* times. | Yes |
| `PRINT` | `PRINT value` or `PR value` | Displays a value or result. | No |
| `SETXY` | `SETXY x y` | Moves the turtle to coordinates *(x, y)*. | No |
| `SETPOS` | `SETPOS [x y]` | Moves turtle using a list of coordinates. | No |
| `SETHEADING` | `SETHEADING angle` | Sets turtle’s facing direction. | No |
| `STOP` | `STOP` | Stops execution of current procedure. | No |

## Setup Instructions

1. Git clone the repo
2. Run the following command to install dependencies

```bash
npm install
```

3. Generate the `LogoCore.js` with

```bash
npm run export
```

4. Copy `dist/LogoCore.js` to `editor/` (this will replace the existing one present there)
5. Open `editor/index.html` in browser
