const fs = require("fs").promises;
const path = require("path");

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
type Field = "byr" | "iyr" | "eyr" | "hgt" | "hcl" | "ecl" | "pid" | "cid";

async function readFileContent(fileName = "testData.txt") {
  const file = await fs.readFile(path.join(__dirname, fileName));

  return file.toString();
}

function parsePassports(content: string) {
  const passports = content.split("\n\n").map((a) => a.replace(/\n/g, " "));

  return passports.map(parsePassportProps);
}

function parsePassportProps(passport: string) {
  const props = passport.split(" ").map((a) => a.split(":", 2));

  let pass: Record<string, string> = {};
  props.forEach((a) => {
    pass[a[0]] = a[1];
  });
  return pass;
}
let intersection = (arrA: Array<unknown>, arrB: Array<unknown>) =>
  arrA.filter((x) => arrB.includes(x));

function isValidPassport(passport: any) {
  const keys = Object.keys(passport);

  //   console.log(intersection(keys, requiredFields));
  const isValid =
    intersection(keys, requiredFields).length === requiredFields.length;

  return isValid;
}

const validators: Record<Field, (v: string) => boolean> = {
  byr: (v: string) => v.length === 4 && Number(v) >= 1920 && Number(v) <= 2002,
  iyr: (v: string) => v.length === 4 && Number(v) >= 2010 && Number(v) <= 2020,
  eyr: (v: string) => v.length === 4 && Number(v) >= 2020 && Number(v) <= 2030,
  hgt: (v: string) => {
    const digits = parseInt(v);
    if (v.endsWith("in")) {
      return digits >= 59 && digits <= 76;
    }
    if (v.endsWith("cm")) {
      return digits >= 150 && digits <= 193;
    }
    return false;
  },
  hcl: (v: string) => !!v.match(/^#([a-f0-9]{6})$/),
  ecl: (v: string) => !!v.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/),
  pid: (v: string) => !!v.match(/^0*(\d{9})$/),
  cid: () => true
};

function checkRules(passport: any) {
  const keys = Object.keys(passport);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as Field;
    const val: string = passport[key];

    if (!validators[key]) {
      console.log(key, passport);
    }
    if (!validators[key](val)) {
      return false;
    }
  }
  return true;
}

readFileContent("input.txt").then((c) => {
  const passports = parsePassports(c);
  console.log(
    "Total Valid Q1:",
    passports.map(isValidPassport).filter((a) => a).length
  );

  console.log(
    "Total Valid Q2:",
    passports
      .filter(isValidPassport)
      .map(checkRules)
      .filter((a) => a).length
  );
});
