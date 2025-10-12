# logo
An online Logo interpreter written in TypeScript and HTML5 Canvas

## Reference

| Command | Syntax | Function | Implementation Status |
|----------|---------|-----------|------------------------|
| `FORWARD` | `FORWARD n` or `FD n` | Moves the turtle forward by *n* steps. | No |
| `BACKWARD` | `BACKWARD n` or `BK n` | Moves the turtle backward by *n* steps. | No |
| `RIGHT` | `RIGHT angle` or `RT angle` | Turns the turtle clockwise by *angle* degrees. | No |
| `LEFT` | `LEFT angle` or `LT angle` | Turns the turtle counterclockwise by *angle* degrees. | No |
| `PENUP` | `PENUP` or `PU` | Lifts the pen to stop drawing. | No |
| `PENDOWN` | `PENDOWN` or `PD` | Lowers the pen to start drawing. | No |
| `CLEARSCREEN` | `CLEARSCREEN` or `CS` | Clears the screen and resets the turtle. | No |
| `HOME` | `HOME` | Returns the turtle to the center of the screen. | No |
| `REPEAT` | `REPEAT n [commands]` | Repeats a block of commands *n* times. | No |
| `TO` | `TO procname :args ... END` | Defines a procedure. | No |
| `PRINT` | `PRINT value` or `PR value` | Displays a value or result. | No |
| `MAKE` | `MAKE "var value` | Creates or sets a variable. | No |
| `IF` | `IF condition [commands]` | Executes commands if condition is true. | No |
| `IFELSE` | `IFELSE condition [true] [false]` | Executes one of two command blocks. | No |
| `SETXY` | `SETXY x y` | Moves the turtle to coordinates *(x, y)*. | No |
| `SETPOS` | `SETPOS [x y]` | Moves turtle using a list of coordinates. | No |
| `SETHEADING` | `SETHEADING angle` | Sets turtle’s facing direction. | No |
| `SHOWTURTLE` | `SHOWTURTLE` or `ST` | Makes the turtle visible. | No |
| `HIDETURTLE` | `HIDETURTLE` or `HT` | Hides the turtle from view. | No |
| `STOP` | `STOP` | Stops execution of current procedure. | No |

