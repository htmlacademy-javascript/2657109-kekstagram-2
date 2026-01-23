function lineLength(line, number) {
return line.length <= number;
}

function lineSimile(line) {
line = line.toLowerCase();
line = line.replaceAll(" ", "");

let newStroke = "";
for (let check = line.length - 1; check >= 0; check--) {
  newStroke += line[check];
}
  return line === newStroke;

}

function strokeSimile(stroke) {
   stroke = stroke.toString();
   let newStroke = "";

for (let check = 0; check < stroke.length; check++) {

if (!Number.isNaN(parseInt(stroke[check]))) {
    newStroke = newStroke + stroke[check];
}

}
return parseInt(newStroke);

}
