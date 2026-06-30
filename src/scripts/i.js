const OP = {}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatDecimal(num, maxDigits = 2) {
  let str = num.toFixed(maxDigits);
  if (str.indexOf('.') !== -1) {
    while (str.endsWith('0')) {
      str = str.slice(0, -1);
    }
    if (str.endsWith('.')) {
      str = str.slice(0, -1);
    }
  }
  return str;
}


/**
 * 四年级综合计算题型 (全面覆盖人教版)
 * 包含：万以内加减、脱式计算、乘法(一位数/两位数)、除法、分数、小数
 * @param {number} q_number 题目总数
 * @param {number} q_bracket_count 括号填空题目数量
 * @param {boolean} q_hard_mode 困难模式
 */
function getOp6(q_number, q_bracket_count, q_hard_mode = false) {
  const plist = [];
  const total = parseInt(q_number);
  const bracketCount = parseInt(q_bracket_count) || 0;
  let generatedBrackets = 0;

  // 定义题型分配比例 (权重调整)
  const types = [
    { name: "plusMinus", weight: 1 }, // 万以内加减
    { name: "mul1", weight: 1 },      // 多位数乘一位数
    { name: "mul2", weight: 1 },      // 两位数乘两位数
    { name: "div", weight: 1 },       // 多位数除一位数
    { name: "div2", weight: 1 },      // 两/三位数除以两位数 (新增)
    { name: "mixed", weight: 1 },     // 混合运算
    { name: "fraction", weight: 1 },  // 同分母分数
    { name: "decimal", weight: 1 },   // 一位小数
    { name: "estimate", weight: 1 },  // 估算 (新增)
    { name: "simple", weight: 1 }     // 简便计算 (新增)
  ];
  
  const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
  
  for (const t of types) {
    let count = Math.floor((t.weight / totalWeight) * total);
    let i = 0;
    while (i < count && plist.length < total) {
      let p;
      const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
      
      switch(t.name) {
        case "plusMinus":
          p = (Math.random() < 0.5) ? get3plus3(hasBracket, true) : get3m3(hasBracket, true);
          break;
        case "mul1":
          p = getntm(randomRange(2, 3), 1);
          break;
        case "mul2":
          p = q_hard_mode ? get3t2() : ((Math.random() < 0.5) ? get3t2() : get2t2());
          break;
        case "div":
          p = getndm(randomRange(2, 3), 1, Math.random() < 0.5);
          break;
        case "div2":
          p = getndm(q_hard_mode ? 3 : randomRange(2, 3), 2, Math.random() < 0.5, q_hard_mode);
          break;
        case "mixed":
          p = getMixedOp(true, q_hard_mode);
          break;
        case "fraction":
          p = getFractionOp(hasBracket, true);
          break;
        case "decimal":
          p = getDecimalOp(true);
          break;
        case "estimate":
          p = getEstimateOp();
          break;
        case "simple":
          p = getSimpleOp(q_hard_mode);
          break;
      }
      
      if (plist.includes(p)) continue;
      // 加减法、分数、小数都共用填空计数逻辑
      if (hasBracket && (t.name === "plusMinus" || t.name === "fraction" || t.name === "decimal")) {
        generatedBrackets++;
      }
      plist.push(p);
      i++;
    }
  }

  // 补足剩余题量
  while (plist.length < total) {
    let p = getMixedOp(q_hard_mode);
    if (!plist.includes(p)) plist.push(p);
  }

  return shuffle(plist);
}

/**
 * 小数加减法进阶 (支持一位/两位小数、整数混合、进退位及简便计算)
 */
function getDecimalOp(q_hard_mode = false) {
  let p = "";
  let retry = 0;
  while(retry < 500) {
    retry++;
    let r = Math.random();
    
    if (!q_hard_mode) {
      // 普通模式
      if (r < 0.25) {
        // 1. 一位小数进退位
        let op = Math.random() < 0.5 ? "+" : "-";
        let n1 = randomRange(11, 99);
        let n2 = randomRange(11, 99);
        if (op === "+") {
          if ((n1 % 10 + n2 % 10) < 10) {
            n2 = Math.floor(n2 / 10) * 10 + (10 - (n1 % 10) + randomRange(0, 8) % 10);
            if (n2 < 11 || n2 > 99) continue;
          }
          p = `${formatDecimal(n1 / 10, 1)} + ${formatDecimal(n2 / 10, 1)} = `;
        } else {
          if (n1 < n2) [n1, n2] = [n2, n1];
          if (n1 % 10 >= n2 % 10) {
            n2 = Math.floor(n2 / 10) * 10 + (n1 % 10 + randomRange(1, 9)) % 10;
            if (n2 < 11 || n2 > 99 || n1 < n2) continue;
          }
          p = `${formatDecimal(n1 / 10, 1)} - ${formatDecimal(n2 / 10, 1)} = `;
        }
      } else if (r < 0.50) {
        // 2. 两位小数加减法 (不强制每位都进退位)
        let op = Math.random() < 0.5 ? "+" : "-";
        let n1 = randomRange(101, 899);
        let n2 = randomRange(101, 899);
        if (op === "+") {
          if (n1 + n2 > 999) continue;
          p = `${formatDecimal(n1 / 100, 2)} + ${formatDecimal(n2 / 100, 2)} = `;
        } else {
          if (n1 < n2) [n1, n2] = [n2, n1];
          p = `${formatDecimal(n1 / 100, 2)} - ${formatDecimal(n2 / 100, 2)} = `;
        }
      } else if (r < 0.75) {
        // 3. 整数与小数混合 (如 5 - 2.4 或 3.6 + 4)
        let op = Math.random() < 0.5 ? "+" : "-";
        let integer = randomRange(2, 9);
        let decimalVal = randomRange(11, 89);
        let decimalStr = formatDecimal(decimalVal / 10, 1);
        if (op === "+") {
          p = Math.random() < 0.5 ? `${integer} + ${decimalStr} = ` : `${decimalStr} + ${integer} = `;
        } else {
          if (integer * 10 <= decimalVal) continue;
          p = `${integer} - ${decimalStr} = `;
        }
      } else {
        // 4. 三数连加连减凑整 (如 2.4 + 1.8 + 3.6 或 8.5 - 2.3 - 1.7)
        let pattern = Math.random() < 0.5 ? "add" : "sub";
        if (pattern === "add") {
          let unitA = randomRange(1, 9);
          let unitC = 10 - unitA;
          let A = randomRange(1, 4) * 10 + unitA;
          let C = randomRange(1, 4) * 10 + unitC;
          let B = randomRange(11, 49);
          let aStr = formatDecimal(A / 10, 1);
          let bStr = formatDecimal(B / 10, 1);
          let cStr = formatDecimal(C / 10, 1);
          let items = [aStr, bStr, cStr];
          shuffle(items);
          p = `${items[0]} + ${items[1]} + ${items[2]} = `;
        } else {
          let unitB = randomRange(1, 9);
          let unitC = 10 - unitB;
          let B = randomRange(1, 3) * 10 + unitB;
          let C = randomRange(1, 3) * 10 + unitC;
          let A = randomRange(Math.floor((B + C) / 10) + 2, 9) * 10 + randomRange(1, 9);
          let aStr = formatDecimal(A / 10, 1);
          let bStr = formatDecimal(B / 10, 1);
          let cStr = formatDecimal(C / 10, 1);
          p = `${aStr} - ${bStr} - ${cStr} = `;
        }
      }
    } else {
      // 困难模式
      if (r < 0.3) {
        // 1. 两位小数多位进退位
        let op = Math.random() < 0.5 ? "+" : "-";
        let n1 = randomRange(111, 899);
        let n2 = randomRange(111, 899);
        if (op === "+") {
          if (n1 + n2 > 999) continue;
          if ((n1 % 10 + n2 % 10 < 10) || (Math.floor(n1 / 10) % 10 + Math.floor(n2 / 10) % 10 < 10)) continue;
          p = `${formatDecimal(n1 / 100, 2)} + ${formatDecimal(n2 / 100, 2)} = `;
        } else {
          if (n1 < n2) [n1, n2] = [n2, n1];
          if ((n1 % 10 >= n2 % 10) || (Math.floor(n1 / 10) % 10 >= Math.floor(n2 / 10) % 10)) continue;
          p = `${formatDecimal(n1 / 100, 2)} - ${formatDecimal(n2 / 100, 2)} = `;
        }
      } else if (r < 0.6) {
        // 2. 整数与两位小数混合 (如 12 - 4.75 或 8.34 + 15)
        let op = Math.random() < 0.5 ? "+" : "-";
        let integer = randomRange(11, 29);
        let decimalVal = randomRange(101, 999);
        let decimalStr = formatDecimal(decimalVal / 100, 2);
        if (op === "+") {
          p = Math.random() < 0.5 ? `${integer} + ${decimalStr} = ` : `${decimalStr} + ${integer} = `;
        } else {
          if (integer * 100 <= decimalVal) continue;
          p = `${integer} - ${decimalStr} = `;
        }
      } else {
        // 3. 两位小数连加连减/括号凑整 (如 3.62 + 4.7 + 6.38 或 6.54 - (2.54 + 1.8))
        let pattern = Math.random() < 0.5 ? "add" : "sub";
        if (pattern === "add") {
          let unitA = randomRange(1, 99);
          let unitC = 100 - unitA;
          let A = randomRange(1, 4) * 100 + unitA;
          let C = randomRange(1, 4) * 100 + unitC;
          let B = randomRange(101, 499);
          let aStr = formatDecimal(A / 100, 2);
          let bStr = formatDecimal(B / 100, 2);
          let cStr = formatDecimal(C / 100, 2);
          let items = [aStr, bStr, cStr];
          shuffle(items);
          p = `${items[0]} + ${items[1]} + ${items[2]} = `;
        } else {
          let unitB = randomRange(1, 99);
          let unitC = 100 - unitB;
          let B = randomRange(1, 3) * 100 + unitB;
          let C = randomRange(1, 3) * 100 + unitC;
          let A = randomRange(Math.floor((B + C) / 100) + 2, 9) * 100 + randomRange(1, 99);
          let aStr = formatDecimal(A / 100, 2);
          let bStr = formatDecimal(B / 100, 2);
          let cStr = formatDecimal(C / 100, 2);
          if (Math.random() < 0.5) {
            p = `${aStr} - ${bStr} - ${cStr} = `;
          } else {
            p = `${aStr} - (${bStr} + ${cStr}) = `;
          }
        }
      }
    }
    
    if (p) break;
  }
  return p || "1.2 + 0.9 = ";
}

/**
 * 估算题 (≈)
 */
function getEstimateOp() {
  let p = "";
  let retry = 0;
  while(retry < 100) {
    retry++;
    let type = randomRange(1, 4);
    
    if (type === 1) { // 加法估算 (人教版上册)
      let n1 = randomRange(105, 895);
      let n2 = randomRange(105, 895);
      p = `${n1} + ${n2} ≈ `;
    } 
    else if (type === 2) { // 减法估算 (人教版上册)
      let n1 = randomRange(505, 995);
      let n2 = randomRange(105, 495);
      p = `${n1} - ${n2} ≈ `;
    } 
    else if (type === 3) { // 乘法估算 (人教版上册)
      let n1 = randomRange(19, 499);
      let n2 = randomRange(3, 9);
      p = `${n1} × ${n2} ≈ `;
    }
    else { // 除法估算 (人教版下册专题)
      let n2 = randomRange(3, 9);
      let quotient = randomRange(15, 85);
      // 故意偏离整十数，如 124 这种需要看作 120 的
      let deviation = randomRange(1, 5) * (Math.random() < 0.5 ? 1 : -1);
      let n1 = (n2 * quotient) + deviation; 
      if (n1 < 50) n1 = 50;
      p = `${n1} ÷ ${n2} ≈ `;
    }
    break;
  }
  return p || "298 + 402 ≈ ";
}

/**
 * 分数加减法公共入口
 */
function getFractionOp(hasBracket = false, q_hard_mode = false) {
  const op = Math.random() < 0.5 ? "+" : "-";
  return getFractionProblem(op, hasBracket);
}

/**
 * 混合运算 (支持两步/三步计算)
 * 包含：带中括号/小括号的加减乘除组合
 */
function getMixedOp(q_hard_mode = false, forceThreeSteps = false) {
  let p = "";
  let retry = 0;
  while(retry < 500) {
    retry++;
    if (forceThreeSteps) {
      // 生成三步复合混合运算
      let type = randomRange(1, 4);
      let num1, num2, num3, num4, res;
      if (type === 1) { // A × (B + C) - D
        num1 = randomRange(2, 9);
        num2 = randomRange(11, 49);
        num3 = randomRange(11, 49);
        num4 = randomRange(10, 99);
        res = num1 * (num2 + num3) - num4;
        if (res <= 0) continue;
        p = `${num1} × (${num2} + ${num3}) - ${num4} = `;
      } else if (type === 2) { // (A - B) × C + D
        num1 = randomRange(51, 99);
        num2 = randomRange(10, 50);
        num3 = randomRange(2, 9);
        num4 = randomRange(100, 300);
        res = (num1 - num2) * num3 + num4;
        p = `(${num1} - ${num2}) × ${num3} + ${num4} = `;
      } else if (type === 3) { // A × [ (B + C) ÷ D ]
        num4 = randomRange(2, 9); // 除数
        let quotient = randomRange(5, 15); // 中间商
        let sum = num4 * quotient; // B + C 的和
        num2 = randomRange(2, sum - 2);
        num3 = sum - num2;
        num1 = randomRange(3, 9); // 最外层乘数
        res = num1 * quotient;
        p = `${num1} × [(${num2} + ${num3}) ÷ ${num4}] = `;
      } else { // A + (B - C) × D
        num1 = randomRange(100, 400);
        num2 = randomRange(20, 99);
        num3 = randomRange(5, 19);
        num4 = randomRange(2, 9);
        res = num1 + (num2 - num3) * num4;
        p = `${num1} + (${num2} - ${num3}) × ${num4} = `;
      }
      break;
    } else {
      let type;
      if (q_hard_mode) {
        let r = Math.random();
        if (r < 0.4) type = 2;      // A + B * C (最易错)
        else if (r < 0.7) type = 4; // A - B / C (除法陷阱)
        else if (r < 0.9) type = 3; // (A + B) * C (括号识别)
        else type = 1;
      } else {
        type = randomRange(1, 4);
      }
      
      let num1, num2, num3, res;
      
      if (type === 1) { // A * B + C 或 A * B - C
        num1 = randomRange(2, 9);
        num2 = randomRange(11, 89);
        num3 = randomRange(10, 99);
        let op = Math.random() < 0.5 ? "+" : "-";
        res = op === "+" ? (num1 * num2 + num3) : (num1 * num2 - num3);
        if (res <= 0) continue;
        p = `${num1} × ${num2} ${op} ${num3} = `;
      } 
      else if (type === 2) { // A + B * C 或 A - B * C
        num1 = randomRange(100, 500);
        num2 = randomRange(2, 9);
        num3 = randomRange(11, 49);
        let op = Math.random() < 0.5 ? "+" : "-";
        res = op === "+" ? (num1 + num2 * num3) : (num1 - num2 * num3);
        if (res <= 0) continue;
        p = `${num1} ${op} ${num2} × ${num3} = `;
      }
      else if (type === 3) { // (A + B) * C 或 (A - B) * C
        num1 = randomRange(10, 50);
        num2 = randomRange(10, 50);
        num3 = randomRange(2, 9);
        let op = Math.random() < 0.5 ? "+" : "-";
        if (op === "-" && num1 <= num2) continue;
        p = `(${num1} ${op} ${num2}) × ${num3} = `;
      }
      else { // A - B / C 或 A + B / C
        num3 = randomRange(2, 9);
        let quotient = randomRange(11, 49);
        num2 = num3 * quotient; // 确保能整除
        num1 = randomRange(quotient + 10, 500);
        let op = Math.random() < 0.5 ? "+" : "-";
        p = `${num1} ${op} ${num2} ÷ ${num3} = `;
      }
      break;
    }
  }
  return p || "12 + 34 × 2 = ";
}





function getOp3(q_number, q_mul_count, q_bracket_count, q_hard_mode) {
  const plist = [];
  const total = parseInt(q_number);
  const target_mul = parseInt(q_mul_count) !== undefined ? parseInt(q_mul_count) : Math.floor(total / 2);
  const target_div = total - target_mul;

  const bracketCount = parseInt(q_bracket_count) !== undefined ? parseInt(q_bracket_count) : Math.floor(total * 0.5);
  let generatedBrackets = 0;

  // 优化：困难模式下增加“双两位数(11-19)”的权重，目标占比 60%
  const doubleTarget = q_hard_mode ? Math.floor(total * 0.6) : 0;
  let doubleGenCount = 0;

  // 生成乘法题
  let m = 0;
  while (m < target_mul) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    const forceDouble = q_hard_mode && (doubleGenCount < doubleTarget) && (Math.random() < 0.7);
    
    let p = get19t19(hasBracket, q_hard_mode, forceDouble);
    if (plist.includes(p)) continue;
    
    if (hasBracket) generatedBrackets++;
    if (forceDouble) doubleGenCount++;
    plist.push(p);
    m++;
  }

  // 生成除法题
  let d = 0;
  while (d < target_div) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    const forceDouble = q_hard_mode && (doubleGenCount < doubleTarget);

    let p = get2d1(hasBracket, q_hard_mode, forceDouble);
    if (plist.includes(p)) continue;
    
    if (hasBracket) generatedBrackets++;
    if (forceDouble) doubleGenCount++;
    plist.push(p);
    d++;
  }

  return shuffle(plist);
}



// // 两位数加减混合
// function getOp2(operator, min, max) {
//   let operatorStr = operator[Math.floor(Math.random() * operator.length)];
//   let i = Math.floor(Math.random() * 2);
//   let num1 = randomRange(min, max);
//   let num2 = randomRange(min, max);

//   let result;
//   if (operatorStr === "-") {
//     if (num1 < num2) {
//         [num1, num2] = [num2, num1];
//     }
//     result = num1 - num2;
//   }

//   if (operatorStr === "+") {
//     result = num1 + num2;
//   }

//   let problem;
//   if (i === 0) {
//       problem = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${operatorStr} ${num2} = ${result}`;
//   } else {
//       problem = `${num1} ${operatorStr} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
//   }
  
//   return problem;
// }


// // 两位数连加连减混合
// function getOp3(operator, min, max) {
//   let operatorStr1 = operator[Math.floor(Math.random() * operator.length)];
//   let operatorStr2 = operator[Math.floor(Math.random() * operator.length)];
//   let num1 = randomRange(min, max);
//   let num2 = randomRange(min, max);
//   let num3 = randomRange(min, max);

//   if (operatorStr1 === "+") {
//     if (operatorStr2 === "-") {
//         result1 = num1 + num2
function getOp1(q_number, q_plus_count, q_bracket_count, q_hard_mode = false) {
  const plist = [];
  const total = parseInt(q_number);
  const target_plus = parseInt(q_plus_count) !== undefined ? parseInt(q_plus_count) : Math.floor(total / 2);
  const target_minus = total - target_plus;

  const bracketCount = parseInt(q_bracket_count) !== undefined ? parseInt(q_bracket_count) : 0;
  let generatedBrackets = 0;

  // 生成加法题
  let p_idx = 0;
  while (p_idx < target_plus) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    let p = get2plus2(hasBracket, q_hard_mode);
    if (plist.includes(p)) continue;
    if (hasBracket) generatedBrackets++;
    plist.push(p);
    p_idx++;
  }

  // 生成减法题
  let m_idx = 0;
  while (m_idx < target_minus) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    let p = get2m2(hasBracket, q_hard_mode);
    if (plist.includes(p)) continue;
    if (hasBracket) generatedBrackets++;
    plist.push(p);
    m_idx++;
  }

  return shuffle(plist);
}

function get2plus2(hasBracket = false, q_hard_mode = false) {
  let num1, num2;
  let retry = 0;
  while (retry < 500) {
    retry++;
    num1 = randomRange(10, 99);
    num2 = randomRange(10, 99);

    if (q_hard_mode) {
      // 困难模式：1.排除整十 2.强制进位 (个位相加 >= 10)
      if (num1 % 10 === 0 || num2 % 10 === 0) continue;
      if ((num1 % 10) + (num2 % 10) < 10) continue;
    }
    break;
  }
  
  let result = num1 + num2;

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) + ${num2} = ${result}`;
    } else {
      return `${num1} + (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} + ${num2} =    `;
}

/**
 * 三位数加减混合
 * @param {number} q_number 题目总数
 * @param {number} q_plus_count 加法占比
 * @param {number} q_bracket_count 括号占比
 * @param {boolean} q_hard_mode 困难模式
 */
function get3op(q_number, q_plus_count, q_bracket_count, q_hard_mode = false) {
  const plist = [];
  const total = parseInt(q_number);
  const target_plus = parseInt(q_plus_count) !== undefined ? parseInt(q_plus_count) : Math.floor(total / 2);
  const target_minus = total - target_plus;

  const bracketCount = parseInt(q_bracket_count) !== undefined ? parseInt(q_bracket_count) : 0;
  let generatedBrackets = 0;

  // 生成加法题
  let p_idx = 0;
  while (p_idx < target_plus) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    let p = get3plus3(hasBracket, q_hard_mode);
    if (plist.includes(p)) continue;
    if (hasBracket) generatedBrackets++;
    plist.push(p);
    p_idx++;
  }

  // 生成减法题
  let m_idx = 0;
  while (m_idx < target_minus) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < (bracketCount / total) : false;
    let p = get3m3(hasBracket, q_hard_mode);
    if (plist.includes(p)) continue;
    if (hasBracket) generatedBrackets++;
    plist.push(p);
    m_idx++;
  }

  return shuffle(plist);
}

function get3plus3(hasBracket = false, q_hard_mode = false) {
  let num1, num2, result;
  let retry = 0;
  while (retry < 500) {
    retry++;
    // 随机选择三位数或四位数作为加数
    let range = Math.random() < 0.3 ? [1000, 8999] : [100, 999];
    num1 = randomRange(range[0], range[1]);
    num2 = randomRange(range[0], range[1]);
    
    result = num1 + num2;
    if (result > 9999) continue; // 确保和在4位数（万以内）

    if (q_hard_mode) {
      // 困难模式：强制多位进位（特别针对连续进位）
      let c1 = (num1 % 10) + (num2 % 10) >= 10;
      let c2 = (Math.floor(num1/10)%10) + (Math.floor(num2/10)%10) >= 10;
      let c3 = (Math.floor(num1/100)%10) + (Math.floor(num2/100)%10) >= 10;
      if (!(c1 && c2) && !(c2 && c3)) continue; 
    }
    break;
  }

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) + ${num2} = ${result}`;
    } else {
      return `${num1} + (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} + ${num2} =    `;
}

function get3m3(hasBracket = false, q_hard_mode = false) {
  let num1, num2;
  while (true) {
    let range = Math.random() < 0.3 ? [1000, 9999] : [100, 999];
    num1 = randomRange(range[0], range[1]);
    num2 = randomRange(range[0], range[1]);

    if (num1 < num2) [num1, num2] = [num2, num1];

    if (q_hard_mode) {
      // 困难模式：强制连续退位减法（人教版难点）
      let b1 = num1 % 10 < num2 % 10;
      let b2 = Math.floor(num1/10)%10 < Math.floor(num2/10)%10;
      if (!b1 && !b2) continue;
      
      // 特殊处理：千位/百位是整百整千的退位 (如 2000 - 548)
      if (num1 % 100 === 0 && Math.random() < 0.3) break;
    }
    break;
  }
  
  let result = num1 - num2;

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) - ${num2} = ${result}`;
    } else {
      return `${num1} - (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} - ${num2} =    `;
}

function get2d1(hasBracket = false, q_hard_mode = false, forceDouble = false) {
  let num1, num2, quotient;
  let retry = 0;
  while(retry < 500) {
    retry++;
    // 先随机选一个除数 num2（1~19）
    num2 = randomRange(1, 19);
    // 商是 1~19
    quotient = randomRange(1, 19);
    num1 = num2 * quotient; 
    
    // 如果是困难模式
    if (q_hard_mode) {
      // 1. 排除九九乘法表范围（除数 <= 9 且 商 <= 9）
      if (num2 <= 9 && quotient <= 9) continue;
      // 2. 排除包含 1 或 10 的情况（低计算量）
      if (num2 === 1 || quotient === 1 || num2 === 10 || quotient === 10) continue;
      
      // 3. 强制双两位数逻辑 (11-19 范围)
      if (forceDouble && (num2 <= 10 || quotient <= 10)) continue;

      if (num1 > 361) continue; 
    } else {
      if (num1 > 361) continue;
    }
    break;
  }
  
  let result = quotient;

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ÷ ${num2} = ${result}`;
    } else {
      return `${num1} ÷ (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} ÷ ${num2} =    `;
}


/**
 * 通用多位数除法生成器 (多位数除以一位数或两位数)
 * @param {number} digitCount1 被除数位数
 * @param {number} digitCount2 除数位数
 * @param {boolean} hasRemainder 是否带余数
 * @param {boolean} forceTwoDigitQuotient 是否强制要求商为两位数 (10 ~ 99)
 * @returns {string} 题目字符串
 */
function getndm(digitCount1 = 2, digitCount2 = 1, hasRemainder = false, forceTwoDigitQuotient = false) {
  let num1, num2, quotient, remainder, min1, max1, min2, max2;
  min1 = Math.pow(10, digitCount1 - 1);
  max1 = Math.pow(10, digitCount1) - 1;
  
  // 除数位数限制，若除数为1位数，限制其不为0和1 (在2~9之间)
  min2 = digitCount2 === 1 ? 2 : Math.pow(10, digitCount2 - 1);
  max2 = Math.pow(10, digitCount2) - 1;

  let retry = 0;
  while (retry < 500) {
    retry++;
    num2 = randomRange(min2, max2);
    if (hasRemainder) {
      num1 = randomRange(min1, max1);
      if (num1 < num2) continue;
      remainder = num1 % num2;
      if (remainder === 0) continue; // 必须有余数
      if (forceTwoDigitQuotient) {
        quotient = Math.floor(num1 / num2);
        if (quotient < 10 || quotient > 99) continue;
      }
      return `${num1} ÷ ${num2} =    `;
    } else {
      // 无余数：通过 商 * 除数 反推被除数
      let qMin = Math.ceil(min1 / num2);
      let qMax = Math.floor(max1 / num2);
      if (forceTwoDigitQuotient) {
        qMin = Math.max(qMin, 10);
        qMax = Math.min(qMax, 99);
      }
      if (qMax < qMin) continue;
      quotient = randomRange(qMin, qMax);
      num1 = num2 * quotient;
      return `${num1} ÷ ${num2} =    `;
    }
  }
  return `${randomRange(10, 99)} ÷ 2 =    `; // 安全回退
}


/**
 * 通用多位数乘法生成器 (多位数乘以一位数或两位数)
 * @param {number} digitCount1 第一个因数的位数
 * @param {number} digitCount2 第二个因数的位数
 * @returns {string} 题目字符串
 */
function getntm(digitCount1 = 2, digitCount2 = 1) {
  const min1 = Math.pow(10, digitCount1 - 1);
  const max1 = Math.pow(10, digitCount1) - 1;
  const num1 = randomRange(min1, max1);
  
  const min2 = digitCount2 === 1 ? 2 : Math.pow(10, digitCount2 - 1);
  const max2 = Math.pow(10, digitCount2) - 1;
  const num2 = randomRange(min2, max2);
  
  let p1 = num1;
  let p2 = num2;
  // 随机交换乘数顺序
  if (Math.random() < 0.5) {
    [p1, p2] = [p2, p1];
  }
  
  return `${p1} × ${p2} =    `;
}


function get2t1() {
  let num1 = randomRange(1, 9);
  let num2 = randomRange(10, 99);
  if (Math.random() < 0.5) {
    [num1, num2] = [num2, num1];
  }
  return `${num1} × ${num2} =    `;
}

function get2t2() {
  let num1 = randomRange(10, 99);
  let num2 = randomRange(10, 99);
  if (Math.random() < 0.5) {
    [num1, num2] = [num2, num1];
  }
  return `${num1} × ${num2} =    `;
}

/**
 * 三位数乘以两位数
 */
function get3t2() {
  let num1 = randomRange(100, 999);
  let num2 = randomRange(10, 99);
  if (Math.random() < 0.5) {
    [num1, num2] = [num2, num1];
  }
  return `${num1} × ${num2} =    `;
}


function get2m2(hasBracket = false, q_hard_mode = false) {
  let num1, num2;
  let retry = 0;
  while (retry < 500) {
    retry++;
    num1 = randomRange(10, 99);
    num2 = randomRange(10, 99);

    if (num1 < num2) [num1, num2] = [num2, num1];

    if (q_hard_mode) {
      // 困难模式：1.排除整十 2.强制退位 (减数个位 > 被减数个位)
      if (num1 % 10 === 0 || num2 % 10 === 0) continue;
      if (num1 % 10 >= num2 % 10) continue;
    }
    break;
  }
  
  let result = num1 - num2;

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) - ${num2} = ${result}`;
    } else {
      return `${num1} - (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} - ${num2} =    `;
}

function getRandom1or2() {
    return Math.random() < 0.5 ? 1 : 2;
}


function get19t19(hasBracket = false, q_hard_mode = false, forceDouble = false) {
  let num1, num2;
  let retry = 0;
  while(retry < 500) {
    retry++;
    num1 = randomRange(1, 19);
    num2 = randomRange(1, 19);
    // 困难模式：
    if (q_hard_mode) {
      // 1. 排除两个因数都 <= 9 的情况
      if (num1 <= 9 && num2 <= 9) continue;
      // 2. 排除包含 1 或 10 的情况
      if (num1 === 1 || num2 === 1 || num1 === 10 || num2 === 10) continue;

      // 3. 强制双两位数逻辑 (11-19 * 11-19)
      if (forceDouble && (num1 <= 10 || num2 <= 10)) continue;
    }
    break;
  }

  if (Math.random() < 0.5) {
    [num1, num2] = [num2, num1];
  }
  let result = num1 * num2;

  if (hasBracket) {
    let i = getRandom1or2();
    if (i === 1) {
      return `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) × ${num2} = ${result}`;
    } else {
      return `${num1} × (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }
  }

  return `${num1} × ${num2} =    `;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getOp4(q_number, q_plus_count, q_bracket_count, q_hard_mode = false, q_teach_mode = false) {
  const plist = [];
  const total = parseInt(q_number);
  const bracketCount = parseInt(q_bracket_count) !== undefined ? parseInt(q_bracket_count) : 0;
  let generatedBrackets = 0;

  // 调节整体题库中 + 出现的频率
  const plus_prob = (parseInt(q_plus_count) || total/2) / total;

  let i = 0;
  while (i < total) {
    let num1, num2, num3, op1, op2, res1, res2;
    
    let retry = 0;
    while(retry < 500) {
      if (q_teach_mode) {
        // 教学模式：练习加法交换律/结合律（凑整）
        let teach_pattern = Math.random() < 0.5 ? "add" : "sub";
        
        if (teach_pattern === "add") {
          // 模式 A：连加凑整 (A + B + C，其中两个数凑十)
          let n1_unit = randomRange(1, 9);
          let n2_unit = 10 - n1_unit;
          num1 = randomRange(1, 8) * 10 + n1_unit;
          num2 = randomRange(1, 8) * 10 + n2_unit;
          num3 = randomRange(10, 80);
          op1 = "+"; op2 = "+";
        } else {
          // 模式 B：加减混合凑整 (A + B - C，其中 A, C 尾数相同便于抵消)
          let n_unit = randomRange(1, 9);
          num1 = randomRange(3, 9) * 10 + n_unit; // 被减项大一些
          num3 = randomRange(1, 2) * 10 + n_unit; // 减项小一些，确保抵消
          num2 = randomRange(10, 50);
          op1 = "+"; op2 = "-";
        }

        // 随机交换位置以练习寻找凑整项
        // 注意：如果是加减混合，减项 num3 必须带上它的符号
        let items = [
          { val: num1, sign: "+" },
          { val: num2, sign: "+" },
          { val: num3, sign: op2 }
        ];
        shuffle(items);

        // 第一个数总是正数
        num1 = items[0].val;
        op1 = items[1].sign;
        num2 = items[1].val;
        op2 = items[2].sign;
        num3 = items[2].val;

        // 计算结果（按从左到右）
        res1 = num1 + (items[1].sign === "+" ? num2 : -num2);
        res2 = res1 + (items[2].sign === "+" ? num3 : -num3);

        // 如果中间结果或最终结果出现负数，则重试
        if (res1 <= 0 || res2 <= 0) { retry++; continue; }
      } else {
        num1 = randomRange(10, 99);
        num2 = randomRange(10, 99);
        num3 = randomRange(10, 99);
        op1 = Math.random() < plus_prob ? "+" : "-";
        op2 = Math.random() < plus_prob ? "+" : "-";

        // 1. 过滤“抵消”算式（如 A+B-B, A+B-A）
        if (num1 === num3 || num2 === num3) { retry++; continue; }

        // 验证第一步
        if (op1 === "+") {
          res1 = num1 + num2;
        } else {
          res1 = num1 - num2;
        }
        if (res1 <= 0) { retry++; continue; }

        // 验证第二步
        if (op2 === "+") {
          res2 = res1 + num3;
        } else {
          res2 = res1 - num3;
        }
      }
      
      // 2. 结果区间控制
      if (res2 <= 0 || res2 > 200) { retry++; continue; }

      // 困难模式校验 (教学模式和困难模式互斥)
      if (q_hard_mode && !q_teach_mode) {
        // A. 第一步进退位检查
        let step1Hard = false;
        if (op1 === "+") {
          if ((num1 % 10) + (num2 % 10) >= 10) step1Hard = true;
        } else {
          if (num1 % 10 < num2 % 10) step1Hard = true;
        }

        // B. 第二步进退位检查
        let step2Hard = false;
        if (op2 === "+") {
          if ((res1 % 10) + (num3 % 10) >= 10) step2Hard = true;
        } else {
          if (res1 % 10 < num3 % 10) step2Hard = true;
        }

        if (!(step1Hard && step2Hard)) {
           if (Math.random() < 0.8) { retry++; continue; }
        }

        if (num1 % 10 === 0 || num2 % 10 === 0 || num3 % 10 === 0) { retry++; continue; }
        if (res1 % 10 === 0 || res2 % 10 === 0) { retry++; continue; }
      }
      break;
    }

    const hasBracket = generatedBrackets < bracketCount ? Math.random() < ((bracketCount - generatedBrackets) / (total - i)) : false;
    let p;
    if (hasBracket) {
      generatedBrackets++;
      let pos;
      if (q_hard_mode) {
        let r = Math.random();
        pos = r < 0.5 ? 2 : (r < 0.75 ? 1 : 3);
      } else {
        pos = randomRange(1, 3);
      }

      if (pos === 1) {
        p = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${op1} ${num2} ${op2} ${num3} = ${res2}`;
      } else if (pos === 2) {
        p = `${num1} ${op1} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${op2} ${num3} = ${res2}`;
      } else {
        p = `${num1} ${op1} ${num2} ${op2} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${res2}`;
      }
    } else {
      p = `${num1} ${op1} ${num2} ${op2} ${num3} =    `;
    }

    if(plist.includes(p)) continue;
    plist.push(p);
    i++;
  }

  return shuffle(plist);
}

function getOp5(q_number, q_plus_count, q_bracket_count) {
  const plist = [];
  const total = parseInt(q_number);
  const bracketCount = parseInt(q_bracket_count) !== undefined ? parseInt(q_bracket_count) : 0;
  let generatedBrackets = 0;

  let i = 0;
  while (i < total) {
    const hasBracket = generatedBrackets < bracketCount ? Math.random() < ((bracketCount - generatedBrackets) / (total - i)) : false;
    let p = getFractionOp(hasBracket);
    if (plist.includes(p)) continue;
    if (hasBracket) generatedBrackets++;
    plist.push(p);
    i++;
  }

  return shuffle(plist);
}

function getFractionProblem(op, hasBracket = false) {
  const d = randomRange(3, 15); // 分母
  let n1, n2, res_n;

  if (op === "+") {
    n1 = randomRange(1, d - 1);
    n2 = randomRange(1, d - n1); // 保证和不大于 1
    res_n = n1 + n2;
  } else {
    n1 = randomRange(2, d);
    n2 = randomRange(1, n1 - 1); // 保证差大于 0
    res_n = n1 - n2;
  }

  const bracketStr = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)`;

  if (hasBracket) {
    const pos = randomRange(1, 3);
    if (pos === 1) {
      return renderFractionProblem(bracketStr, null, op, n2, d, res_n, d);
    } else if (pos === 2) {
      return renderFractionProblem(n1, d, op, bracketStr, null, res_n, d);
    } else {
      // 等号右边不需要括号，直接留白
      return renderFractionProblem(n1, d, op, n2, d, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", null);
    }
  }

  return renderFractionProblem(n1, d, op, n2, d, "", d, true);
}

function renderFractionProblem(n1, d1, op, n2, d2, n3, d3, isStandard = false) {
  const renderPart = (n, d) => {
    // 如果分母为 null，说明是填空占位符
    if (d === null) {
      return `<span class="fraction-bracket">${n}</span>`;
    }
    // 分子等于分母时，显示 1
    if (n !== "" && Number(n) === Number(d)) {
      return `<span class="fraction-integer">1</span>`;
    }
    return `<div class="fraction"><span class="num">${n}</span><span class="den">${d}</span></div>`;
  };

  const f1 = renderPart(n1, d1);
  const f2 = renderPart(n2, d2);
  const f3 = isStandard ? "" : renderPart(n3, d3);
  
  return `<div class="math-expr">${f1}<span>&nbsp;${op}&nbsp;</span>${f2}<span>&nbsp;=&nbsp;</span>${f3}</div>`;
}

/**
 * 简便计算题型生成器
 * @param {boolean} q_hard_mode 是否为困难模式
 */
function getSimpleOp(q_hard_mode = false) {
  const type = randomRange(1, 5);
  let A, B, C, op;

  if (q_hard_mode) {
    const hardType = randomRange(1, 4);
    switch (hardType) {
      case 1: // 拆数法: 25 × 36 => 25 × 4 × 9
        const factor = Math.random() < 0.5 ? 25 : 125;
        const multiplier = factor === 25 ? 4 : 8;
        B = randomRange(3, 9) * multiplier; // 保证能拆出4或8
        return `<i>${factor} × ${B} = </i>`;

      case 2: // 分配律隐藏1: A × 99 + A
        A = randomRange(11, 99);
        if (Math.random() < 0.5) {
          return `<i>${A} × 99 + ${A} = </i>`;
        }
        return `<i>${A} × 101 - ${A} = </i>`;

      case 3: // 小数加减简算: A.BC + D.EF + G.HI (其中两个相加为整数)
        A = randomRange(11, 89) / 100;
        C = 1 - A;
        C = Math.round(C * 100) / 100;
        let intA = randomRange(1, 9);
        let intC = randomRange(1, 9);
        let intB = randomRange(1, 9);
        let floatB = randomRange(11, 89) / 100;
        let valA = intA + A;
        let valC = intC + C;
        let valB = intB + floatB;
        if (Math.random() < 0.5) {
          return `<i>${formatDecimal(valA, 2)} + ${formatDecimal(valB, 2)} + ${formatDecimal(valC, 2)} = </i>`;
        } else {
          // A - B - C (其中 B + C 是整数，5.28 - 1.3 - 0.7)
          let b_dec = randomRange(11, 89) / 100;
          let c_dec = 1 - b_dec;
          c_dec = Math.round(c_dec * 100) / 100;
          let int1 = randomRange(5, 9);
          let int2 = randomRange(1, 2);
          let int3 = randomRange(1, 2);
          let val1 = int1 + randomRange(11, 89) / 100;
          let val2 = int2 + b_dec;
          let val3 = int3 + c_dec;
          return `<i>${formatDecimal(val1, 2)} - ${formatDecimal(val2, 2)} - ${formatDecimal(val3, 2)} = </i>`;
        }

      case 4: // 双分配律 A * B + A * C (B + C = 100)
        A = randomRange(11, 99);
        B = randomRange(11, 89);
        C = 100 - B;
        return `<i>${A} × ${B} + ${A} × ${C} = </i>`;
    }
  }

  switch (type) {
    case 1: // 加法凑整 A + B + C (A + C = 100 或 200)
      A = randomRange(11, 89);
      C = 100 - A;
      B = randomRange(11, 99);
      if (Math.random() < 0.5) {
        return `<i>${A} + ${B} + ${C} = </i>`;
      }
      return `<i>${B} + ${A} + ${C} = </i>`;

    case 2: // 减法凑整 A - B - C (B + C = 100 或 200)
      B = randomRange(11, 89);
      C = 100 - B;
      A = randomRange(150, 450);
      return `<i>${A} - ${B} - ${C} = </i>`;

    case 3: // 乘法凑整 A × B × C (经典的 25*4 或 125*8)
      const pair = Math.random() < 0.5 ? [25, 4] : [125, 8];
      B = randomRange(3, 9); // 中间乘个个位数
      if (Math.random() < 0.5) {
        return `<i>${pair[0]} × ${B} × ${pair[1]} = </i>`;
      }
      return `<i>${B} × ${pair[0]} × ${pair[1]} = </i>`;

    case 4: // 乘法分配律 I (A × 101 或 A × 99)
      A = randomRange(11, 89);
      op = Math.random() < 0.5 ? 101 : 99;
      return `<i>${A} × ${op} = </i>`;

    case 5: // 乘法分配律 II (A × B + A × C)
      A = randomRange(2, 9); // 公因数
      B = randomRange(11, 89);
      C = 100 - B; // 保证两个乘数和为 100
      if (Math.random() < 0.5) {
        return `<i>${A} × ${B} + ${A} × ${C} = </i>`;
      }
      return `<i>${B} × ${A} + ${C} × ${A} = </i>`;
  }
  return "<i>25 × 4 = </i>";
}

function solveFraction(el) {
  let mathExpr = el.querySelector('.math-expr');
  if (!mathExpr) return "";
  let parts = [];
  let children = mathExpr.childNodes;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (child.nodeType === 1) { // Node.ELEMENT_NODE
      if (child.classList.contains('fraction')) {
        let num = parseInt(child.querySelector('.num').textContent);
        let den = parseInt(child.querySelector('.den').textContent);
        parts.push({ type: 'fraction', num, den });
      } else if (child.classList.contains('fraction-bracket')) {
        parts.push({ type: 'bracket' });
      } else if (child.classList.contains('fraction-integer')) {
        let val = parseInt(child.textContent);
        parts.push({ type: 'integer', val });
      } else {
        let text = child.textContent.trim();
        if (text === '+' || text === '-' || text === '=') {
          parts.push({ type: 'operator', val: text });
        }
      }
    } else if (child.nodeType === 3) { // Node.TEXT_NODE
      let text = child.textContent.trim();
      if (text === '+' || text === '-' || text === '=') {
        parts.push({ type: 'operator', val: text });
      }
    }
  }
  
  let den = 1;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].type === 'fraction') {
      den = parts[i].den;
      break;
    }
  }
  
  const getNumVal = (p) => {
    if (p.type === 'fraction') return p.num;
    if (p.type === 'integer') return p.val * den;
    return null;
  };
  
  let p1 = parts[0];
  let op = parts[1] ? parts[1].val : '+';
  let p2 = parts[2];
  let p3 = parts[4];
  
  if (!p3 || p3.type === 'bracket' || (p3.type === 'operator' && p3.val === '=')) {
    let n1 = getNumVal(p1);
    let n2 = getNumVal(p2);
    let ansNum = op === '+' ? (n1 + n2) : (n1 - n2);
    return formatFractionAns(ansNum, den);
  } else {
    let n3 = getNumVal(p3);
    if (p1.type === 'bracket') {
      let n2 = getNumVal(p2);
      let ansNum = op === '+' ? (n3 - n2) : (n3 + n2);
      return formatFractionAns(ansNum, den);
    } else if (p2.type === 'bracket') {
      let n1 = getNumVal(p1);
      let ansNum = op === '+' ? (n3 - n1) : (n1 - n3);
      return formatFractionAns(ansNum, den);
    }
  }
  return "";
}

function formatFractionAns(num, den) {
  if (num === den) return "1";
  if (num === 0) return "0";
  return `${num}/${den}`;
}

function solveProblem(p) {
  if (typeof document === 'undefined') return "";
  let el = document.createElement('div');
  el.innerHTML = p;
  
  if (el.querySelector('.math-expr')) {
    return solveFraction(el);
  }
  
  let text = el.textContent.replace(/\s+/g, ' ').trim();
  
  if (text.includes('=')) {
    let parts = text.split('=');
    let lhs = parts[0].trim();
    let rhsStr = parts[1] ? parts[1].trim() : "";
    
    if (/\(\s*\)/.test(lhs) && rhsStr !== "") {
      let rhs = parseFloat(rhsStr);
      let op = lhs.includes('+') ? '+' : '-';
      let subParts = lhs.split(op);
      
      let first = subParts[0].trim();
      let second = subParts[1].trim();
      
      let isFirstBlank = /\(\s*\)/.test(first) || first === '';
      
      if (op === '+') {
        let known = isFirstBlank ? parseFloat(second) : parseFloat(first);
        return rhs - known;
      } else {
        if (isFirstBlank) {
          return rhs + parseFloat(second);
        } else {
          return parseFloat(first) - rhs;
        }
      }
    }
  }
  
  let expr = text.split('=')[0].trim();
  
  if (expr.includes('÷') && !expr.includes('+') && !expr.includes('-') && !expr.includes('×') && !expr.includes('(') && !expr.includes('[')) {
    let parts = expr.split('÷');
    let a = parseFloat(parts[0].trim());
    let b = parseFloat(parts[1].trim());
    if (a % b === 0) {
      return a / b;
    } else {
      return `${Math.floor(a / b)}...${a % b}`;
    }
  }
  
  let evalExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\[/g, '(').replace(/\]/g, ')');
  try {
    let res = (0, eval)(evalExpr);
    if (res % 1 !== 0) {
      return parseFloat(res.toFixed(4));
    }
    return res;
  } catch (e) {
    return "";
  }
}

function generate(
    q_number,
    q_type,
    q_mul_count,
    q_bracket_count,
    q_hard_mode,
    q_teach_mode,
    operator = ["+", "-"]
) {
    let problems = [];

    if (q_type === "1") {
        problems = getOp1(q_number, q_mul_count, q_bracket_count, q_hard_mode)
    }

    if (q_type === "3") {
        problems = getOp3(q_number, q_mul_count, q_bracket_count, q_hard_mode)
    }

    if (q_type === "4") {
        problems = getOp4(q_number, q_mul_count, q_bracket_count, q_hard_mode, q_teach_mode)
    }

    if (q_type === "5") {
        problems = getOp5(q_number, q_mul_count, q_bracket_count)
    }

    if (q_type === "6") {
        problems = getOp6(q_number, q_bracket_count, q_hard_mode)
    }

    let answers = [];
    for (let i = 0; i < problems.length; i++) {
        answers.push(solveProblem(problems[i]));
    }

    return {
        problems: problems,
        answers: answers
    };
}
window.generate = generate;