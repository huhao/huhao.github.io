function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 两位数加减混合
function getOp1(operator, min, max) {
  let operatorStr = operator[Math.floor(Math.random() * operator.length)];
  let num1 = randomRange(min, max);
  let num2 = randomRange(min, max);

  if (operatorStr === "-") {
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
  }

  let problem = `${num1} ${operatorStr} ${num2} =    `;
  return problem;
}

// 两位数加减混合
function getOp1(operator, min, max) {
  let operatorStr = operator[Math.floor(Math.random() * operator.length)];
  let num1 = randomRange(min, max);
  let num2 = randomRange(min, max);

  if (operatorStr === "-") {
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
  }

  let problem = `${num1} ${operatorStr} ${num2} =    `;
  return problem;
}


// 两位数加减混合
function getOp1(operator, min, max) {
  let operatorStr = operator[Math.floor(Math.random() * operator.length)];
  let i = Math.floor(Math.random() * 2);
  let num1 = randomRange(min, max);
  let num2 = randomRange(min, max);

  if (operatorStr === "-") {
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
  }

  let problem = `${num1} ${operatorStr} ${num2} =    `;
  return problem;
}

// 两位数加减混合
function getOp2(operator, min, max) {
  let operatorStr = operator[Math.floor(Math.random() * operator.length)];
  let i = Math.floor(Math.random() * 2);
  let num1 = randomRange(min, max);
  let num2 = randomRange(min, max);

  let result;
  if (operatorStr === "-") {
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
    result = num1 - num2;
  }

  if (operatorStr === "+") {
    result = num1 + num2;
  }

  let problem;
  if (i === 0) {
      problem = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${operatorStr} ${num2} = ${result}`;
  } else {
      problem = `${num1} ${operatorStr} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
  }
  
  return problem;
}


// 两位数连加连减混合
function getOp3(operator, min, max) {
  let operatorStr1 = operator[Math.floor(Math.random() * operator.length)];
  let operatorStr2 = operator[Math.floor(Math.random() * operator.length)];
  let num1 = randomRange(min, max);
  let num2 = randomRange(min, max);
  let num3 = randomRange(min, max);

  if (operatorStr1 === "+") {
    if (operatorStr2 === "-") {
        result1 = num1 + num2
        if (result1 < num3) {
            operatorStr2 = "+"
        }
    }
  }

  if (operatorStr1 === "-") {
        if (num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        if (operatorStr2 === "-") {
            result1 = num1 - num2
            if (result1 < num3) {
                operatorStr2 = "+"
            }
        }
    }

  let problem = `${num1} ${operatorStr1} ${num2} ${operatorStr2} ${num3} =    `;
  return problem;
}