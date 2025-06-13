import { Logger, ConsoleFormatter, indent } from "/logger.js";

Object.prototype.print = function () {
  console.log(this);
  return this;
};
let l = (x) => console.log(x);
let sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class TuringMachine {
  static debug = false;
  static ID = 0;

  constructor(initialState, initialHeadLocation, blank, stateTable) {
    TuringMachine.ID++;
    this.ID = TuringMachine.ID;
    this.name = this.constructor.name + " #" + TuringMachine.ID;

    this.state = initialState;
    //this.stateSpace = ["A", "B", "C", "HALT"];
    ///this.finalStates = ["HALT"];
    this.stateTable = stateTable;

    //this.tapeAlphabet = ["0", "1"];
    this.blank = blank;
    this.tapeLength = 6;
    this.tape = new Array(this.tapeLength).fill(this.blank);

    this.headLocation = initialHeadLocation;
    this.head = this.tape[this.headLocation];
  }

  start(steps) {
    console.log("Starting", this.name);
    this.print();
    for (let i = 0; i < steps; i++) {
      this.run();
    }
    console.log("Halting", this.name);
  }

  read() {
    this.head = this.tape[this.headLocation];
    log.info("Read:", "Head set to:", this.head);
  }
  write(symbol) {
    if (symbol == "N") return;
    log.info("Writing:", symbol, "At", this.headLocation).indent(1);
    log.print(this);
    if (symbol == "E") this.tape[this.headLocation] = this.blank;
    else this.tape[this.headLocation] = symbol;
    log.print(this);
    log.indent(-1);
  }
  move(direction) {
    if (direction == "L") {
      log
        .info(
          "Moving: Left.",
          "From",
          this.headLocation,
          "To",
          this.headLocation - 1
        )
        .indent(1);
      log.print(this);
      if (this.tape[this.headLocation - 1] == undefined) {
        this.tape = [this.blank].concat(this.tape);
      }
      this.headLocation--;
      log.print(this);
      log.indent(-1);
    } else if (direction == "R") {
      log
        .info(
          "Moving: Right.",
          "From",
          this.headLocation,
          "To",
          this.headLocation + 1
        )
        .indent(1);
      log.print(this);
      if (this.tape[this.headLocation + 1] == undefined) {
        this.tape = this.tape.concat(this.blank);
      }
      this.headLocation++;
      log.print(this);
      log.indent(-1);
    } else if (direction == "N") {
      log
        .info(
          "Moving: None.",
          "From",
          this.headLocation,
          "To",
          this.headLocation
        )
        .indent(1);
      log.print(this);
      //this.headLocation;
      log.print(this);
      log.indent(-1);
    }
    this.read();
  }

  run() {
    log.warn("Update");
    // log.info("Waiting...");
    // await sleep(1000);
    log.info("Running Update.").indent(1);
    this.read();
    this.readStateTable();
    log.indent(-1);
    this.print();
  }

  transition(R, M, S) {
    log.info("Transitioning:").indent(1);
    this.write(R);
    this.move(M);
    log.info("State Transition: From", this.state, "To", S);
    this.state = S;
    log.indent(-1);
  }

  readStateTable() {
    log.info("State Table Called.").indent(1);
    // l(this.state);
    // l(this.head);
    let transitionRule = this.stateTable.find(
      (x) => x[0] == this.state && x[1] == this.head
    );
    if (transitionRule == -1) Error("Error");
    log.info("Current State was:", transitionRule[0]).indent(1);
    log.info("Current Head was:", transitionRule[1]).indent(1);
    this.transition(transitionRule[2], transitionRule[3], transitionRule[4]);
    log.indent(-3);
  }

  print() {
    let msg = new ConsoleFormatter({
      appendSpace: true,
      prefixIndent: indent(Logger.logIndent),
    });

    if (TuringMachine.debug == true) msg.add("Tape:", "color:royalblue;");
    msg.add("[", "color:grey;");
    for (let i = 0; i < this.tape.length; i++) {
      if (i == this.headLocation) msg.add(this.tape[i], "color:yellow;");
      else if (this.tape[i] == this.blank)
        msg.add(this.tape[i], "color:dimgrey;");
      else msg.add(this.tape[i], "color:mediumpurple;");
      if (i < this.tape.length - 1) msg.add(",", "color:grey;");
    }
    msg.add("]", "color:grey;");

    msg.print();
    return this;
  }
}

let log = new Logger(TuringMachine.debug, import.meta.url);

let stateTable;

stateTable = [
  ["A", "0", "1", "R", "B"],
  ["A", "1", "1", "L", "C"],
  ["B", "0", "1", "L", "A"],
  ["B", "1", "1", "R", "B"],
  ["C", "0", "1", "L", "B"],
  ["C", "1", "1", "N", "H"],
  ["H", "1", "1", "N", "H"],
];

//let ThreeStateBusyBeaver = new TuringMachine("A", 3, "0", stateTable).start(15);

stateTable = [
  ["b", "_", "0", "R", "c"],
  ["c", "_", "_", "R", "e"],
  ["e", "_", "1", "R", "f"],
  ["f", "_", "_", "R", "b"],
];

//let turingsExample new TuringMachine("b", 0, "_", stateTable).start(15);

stateTable = [
  ["s1", "0", "N", "N", "H"],
  ["s1", "1", "E", "R", "s2"],
  ["s2", "0", "E", "R", "s3"],
  ["s2", "1", "1", "R", "s2"],
  ["s3", "0", "1", "L", "s4"],
  ["s3", "1", "1", "R", "s3"],
  ["s4", "0", "E", "L", "s5"],
  ["s4", "1", "1", "L", "s4"],
  ["s5", "0", "1", "R", "s1"],
  ["s5", "1", "1", "L", "s5"],
  ["H", "0", "N", "N", "H"],
  ["H", "1", "N", "N", "H"],
];

let copySubroutine = new TuringMachine("s1", 0, "0", stateTable);
copySubroutine.tape[0] = "1";
copySubroutine.tape[4] = "1";
//copySubroutine.start(15);

class TuringMachine2D {
  static debug = false;
  static ID = 0;

  constructor(initialState, initialHeadLocation, blank, stateTable) {
    TuringMachine2D.ID++;
    this.ID = TuringMachine2D.ID;
    this.name = this.constructor.name + " #" + TuringMachine2D.ID;

    this.state = initialState;
    //this.stateSpace = ["A", "B", "C", "HALT"];
    ///this.finalStates = ["HALT"];
    this.stateTable = stateTable;
    this.steps = 0;

    //this.tapeAlphabet = ["0", "1"];
    this.blank = blank;
    this.tapeLength = 10;
    this.tapeHeight = 10;
    this.tape = Array.from(Array(this.tapeLength), () =>
      new Array(this.tapeHeight).fill(this.blank)
    );

    this.headX = initialHeadLocation[0];
    this.headY = initialHeadLocation[1];
    this.headLocation = [this.headX, this.headY];
    this.head = this.tape[this.headY][this.headX];
  }

  async start(steps) {
    console.log("Starting", this.name);
    this.print();
    for (let i = 0; i < steps; i++) {
      await this.run();
      //if (i % 1000 == 0) this.print();
      if (i == steps - 1) this.print();
    }
    console.log("Halting", this.name);
  }

  read() {
    this.head = this.tape[this.headY][this.headX];
    log.info("Read:", "Head set to:", this.head);
  }
  write(symbol) {
    log.print(this);
    this.tape[this.headY][this.headX] = symbol;
    log.print(this);
  }
  move(direction) {
    if (direction == "N") {
      if (this.tape?.[this.headY - 1]?.[this.headX] == undefined) {
        this.tape.unshift(new Array(this.tape[0].length).fill(this.blank));
        this.headY++;
      }
      this.headY--;
    } else if (direction == "S") {
      if (this.tape?.[this.headY + 1]?.[this.headX] == undefined) {
        this.tape.push(new Array(this.tape[0].length).fill(this.blank));
      }
      this.headY++;
    } else if (direction == "E") {
      if (this.tape?.[this.headY]?.[this.headX + 1] == undefined) {
        this.tape = this.tape.map((x) => (x = x.concat(this.blank)));
      }
      this.headX++;
    } else if (direction == "W") {
      if (this.tape?.[this.headY]?.[this.headX - 1] == undefined) {
        this.tape = this.tape.map((x) => (x = [this.blank].concat(x)));
        this.headX++;
      }
      this.headX--;
    }
    this.read();
  }

  async run() {
    log.warn("Update");
    log.info("Waiting...");
    //await sleep(0);
    log.info("Running Update.").indent(1);
    this.read();
    this.readStateTable();
    log.indent(-1);
    this.steps++;
    //this.print();
  }

  transition(R, M, S) {
    log.info("Transitioning:").indent(1);
    this.write(R);
    this.move(M);
    log.info("State Transition: From", this.state, "To", S);
    this.state = S;
    log.indent(-1);
  }

  readStateTable() {
    //this.read();
    log.info("State Table Called.").indent(1);
    // l(this.state);
    // l(this.head);
    let transitionRule = this.stateTable.find(
      (x) => x[0] == this.state && x[1] == this.head
    );
    if (transitionRule == -1) Error("Error");
    log.info("Current State was:", transitionRule[0]).indent(1);
    log.info("Current Head was:", transitionRule[1]).indent(1);
    this.transition(transitionRule[2], transitionRule[3], transitionRule[4]);
    log.indent(-3);
  }

  print() {
    let msg = new ConsoleFormatter({
      appendSpace: true,
      prefixIndent: indent(Logger.logIndent),
    });

    let randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);

    let colors = [];
    for (let i = 0; i < 20; i++) {
      colors.push([`color: rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)});`]);
    }

    let color = (n) => {
      switch (n) {
        case 0:
          return "color:dimgrey;";
        case 1:
          return "color:mediumpurple;";
        case 2:
          return "color:lime;";
        case 3:
          return "color:royalblue;";
        default:
          //l(colors[n][0]);
          return colors[n][0];
      }
    };

    msg.add("\n", "");
    for (let i = 0; i < this.tape.length; i++) {
      if (TuringMachine2D.debug == true) msg.add("Tape:", "color:royalblue;");
      //if (i == 0) msg.add("", "");
      msg.add("[", "color:grey;");
      for (let j = 0; j < this.tape[i].length; j++) {
        if (i == this.headY && j == this.headX)
          msg.add(this.tape[i][j], "color:yellow;");
        else if (this.tape[i][j] == this.blank)
          msg.add(this.tape[i][j], "color:dimgrey;");
        else msg.add(this.tape[i][j], color(this.tape[i][j]));
        //console.log("%ctest", `${color(this.tape[i][j])}`);
        //if (j < this.tape[i].length - 1) msg.add(",", "color:grey;");
      }
      msg.add("]\n", "color:grey;");
    }
    msg.add(`Steps: ${this.steps}`, "color:grey;");

    msg.print();
    return this;
  }
}

// stateTable = [
//   ["N", "0", "1", "E", "E"],
//   ["N", "1", "0", "W", "W"],
//   ["S", "0", "1", "W", "W"],
//   ["S", "1", "0", "E", "E"],
//   ["E", "0", "1", "S", "S"],
//   ["E", "1", "0", "N", "N"],
//   ["W", "0", "1", "N", "N"],
//   ["W", "1", "0", "S", "S"],
// ];

// stateTable = [
//   ["N", "0", cycle(0, 1), R("N"), R("N")],
//   ["N", "1", cycle(1, 1), L("N"), L("N")],
//   ["S", "0", cycle(0, 1), R("S"), R("S")],
//   ["S", "1", cycle(1, 1), L("S"), L("S")],
//   ["E", "0", cycle(0, 1), R("E"), R("E")],
//   ["E", "1", cycle(1, 1), L("E"), L("E")],
//   ["W", "0", cycle(0, 1), R("W"), R("W")],
//   ["W", "1", cycle(1, 1), L("W"), L("W")],
// ];

function states(string) {
  let stateTable = [];
  let s = string.length;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < s; j++) {
      let sta = "NSEW"[i];
      let str;
      if (string[j] == "R") str = R;
      else if (string[j] == "L") str = L;
      stateTable.push([sta, String(j), cycle(j, s - 1), str(sta), str(sta)]);
    }
  }
  return stateTable;
}

let langtonsAnt = new TuringMachine2D("N", [5, 5], "0", states("LR"));
langtonsAnt.start(11000);

// let langtonsAnt = new TuringMachine2D("N", [5, 5], "0", states("LLRR"));
// langtonsAnt.start(123157);

// let langtonsAnt = new TuringMachine2D("N", [5, 5], "0", states("LRRRRRLLR"));
// langtonsAnt.start(70273);

//let langtonsAnt = new TuringMachine2D("N", [5, 5], "0", states("RRLLLRLLLRRR"));
//langtonsAnt.start(32734);
//langtonsAnt.start(100);

function cycle(x, n) {
  let arr = [...Array(n + 1).keys()];
  x++;
  x = x % arr.length;
  return arr[x];
}
function R(x) {
  // Clockwise
  switch (x) {
    case "N":
      return "E";
    case "S":
      return "W";
    case "E":
      return "S";
    case "W":
      return "N";
  }
}
function L(x) {
  // Counter-Clockwise
  switch (x) {
    case "N":
      return "W";
    case "S":
      return "E";
    case "E":
      return "N";
    case "W":
      return "S";
  }
}

//cycle(0, 1).print();

// function states(string) {
//   let stateTable = [];
//   let s = string.length;
//   for (let i = 0; i < 4; i++) {
//     for (let j = 0; j < s; j++) {
//       let sta = "NSEW"[i];
//       let str;
//       if (string[j] == "R") str = R;
//       else if (string[j] == "L") str = L;
//       stateTable.push([sta, String(j), cycle(j, s-1), str(sta), str(sta)]);
//     }
//   }
//   return stateTable;
// }
//states("RL").print();
