import { flatten } from "lodash";
import {
  logger,
  parseLinesToArray,
  readFileContent,
  parseByEmptyLinesToArray
} from "../utils";

readFileContent("day16/input.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) => a.map((r) => r.split("\n")))
  .then((parsed) => {
    const rules = parsed[0].map(parseRule);
    const yourTicket = parsed[1][1].split(",").map(Number);
    const otherTickets = parsed[2]
      .slice(1)
      .map((r) => r.split(",").map(Number));

    return { rules, yourTicket, otherTickets };
  })
  .then(({ rules, yourTicket, otherTickets }) => {
    const validated = otherTickets.map((t) => validateTicket(rules, t));

    return flatten(validated).reduce((t, c) => t + c, 0);
  })

  .then(logger);

type RuleSet = [number, number][];
type Rule = [string, RuleSet];
type Ticket = number[];

function parseRule(rule: string): Rule {
  const p = rule.split(":");
  const key = p[0];
  const rules = p[1]
    .trim()
    .split(" or ")
    .map((a) => a.split("-").map(Number)) as RuleSet;
  return [key, rules];
}

function validateTicket(rules: Rule[], ticket: Ticket) {
  return ticket.filter((n) => {
    return !rules.some((rule) => {
      // console.log(n, rule[1], validateNumber(rule[1], n));
      return validateNumber(rule[1], n);
    });
  });
}
function validateNumber(ruleSet: RuleSet, n: number) {
  const [a, b] = ruleSet;
  return (n >= a[0] && n <= a[1]) || (n >= b[0] && n <= b[1]);
}
