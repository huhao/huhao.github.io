const OP = {}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function getOp2(q_number) {
  const operator = ["+", "-"]
  let bracketCount = q_number * 0.5;
  const plist = [];
  let generatedBrackets = 0;
  for (var i = 0; i < q_number; i++) {
    const operatorStr = operator[Math.floor(Math.random() * operator.length)];
    let num1, num2, result, p;
    
    if (operatorStr === "+") {
      // 加法：确保两数之和不超过20
      num1 = randomRange(0, 20);
      num2 = randomRange(0, 20 - num1);
      result = num1 + num2;
    } else {
      // 减法：确保被减数大于等于减数，且结果非负
      num2 = randomRange(0, 20);
      num1 = randomRange(num2, 20);
      result = num1 - num2;
    }

    const hasBracket = generatedBrackets < bracketCount ? Math.random() < 0.5: false;
    if (hasBracket) {
      generatedBrackets++;
      let i = getRandom1or2();
      if (i === 1) {
          p = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${operatorStr} ${num2} = ${result}`;
      } else {
        p = `${num1} ${operatorStr} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
      }

    } else {
       p = `${num1} ${operatorStr} ${num2} =    `;
    }
    plist.push(p);
  }

  return plist;
}


function getOp3(q_number) {
  const operator = ["×", "÷"]
  const plist = [];
  for (var i = 0; i < q_number; i++) {
    let operatorStr = operator[Math.floor(Math.random() * operator.length)];
    let p;
    if (operatorStr === "×") {
      p = get19t19()
    } else {
      p = get2d1()
    }
    
    plist.push(p);
  }

  return plist;
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
//       problem = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${operatorStr} ${num2} = ${result}`;
//   } else {
//       problem = `${num1} ${operatorStr} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
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
//         if (result1 < num3) {
//             operatorStr2 = "+"
//         }
//     }
//   }

//   if (operatorStr1 === "-") {
//         if (num1 < num2) {
//             [num1, num2] = [num2, num1];
//         }

//         if (operatorStr2 === "-") {
//             result1 = num1 - num2
//             if (result1 < num3) {
//                 operatorStr2 = "+"
//             }
//         }
//     }

//   let problem = `${num1} ${operatorStr1} ${num2} ${operatorStr2} ${num3} =    `;
//   return problem;
// }


function getOp(q_number) {
  const operator = ["multiply", "division", "minus", "plus"]
  
  // 两位数×两位数
  let twoDigitMultiplyCount = q_number * 0.1;


  const plist = [];
  for (var i = 0; i < q_number; i++) {
    const operatorStr = operator[Math.floor(Math.random() * operator.length)];
    let p;

    switch(operatorStr)
    {
      case "multiply":
        if (twoDigitMultiplyCount < 3) {
          p = get19t19();
          twoDigitMultiplyCount++;
        } else {
          p = get19t19();
        }
        break;
      case "division":
        p = get2d1();
        break;
      case "plus":
        p = get2plus2()
        break;
      case "minus":
        p = get2m2();
        break;
    }    
    plist.push(p);
  }

  return plist;
}

function get2plus2() {
  let num1 = randomRange(10, 99);
  let num2 = randomRange(10, 99);
  return `${num1} + ${num2} =    `;
}

function get2d1() {
  // 先随机选一个除数 num2（1~9）
  let num2 = randomRange(1, 9);
  // 商是 1~Math.floor(99 / num2)，保证 num1 不超过 99
  const quotient = randomRange(1, Math.floor(99 / num2));
  num1 = num2 * quotient; // 确保能整除
  return `${num1} ÷ ${num2} =    `;
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


function get2m2() {
  let num1 = randomRange(10, 99);
  let num2 = randomRange(10, 99);

  if (num1 < num2) {
      [num1, num2] = [num2, num1];
  }

  return `${num1} - ${num2} =    `;
}

function getRandom1or2() {
    return Math.random() < 0.5 ? 1 : 2;
}


function get19t19() {
  let num1 = randomRange(1, 19);
  let num2 = randomRange(1, 19);
  if (Math.random() < 0.5) {
    [num1, num2] = [num2, num1];
  }
  return `${num1} × ${num2} =    `;
}