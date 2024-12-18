

// 两位数加减混合
function getOp1(operator, q_number) {
  
  let min = 10, max = 99;
  var plusCount = 0, minusCount = 0;

  let p = []
  for (let i = 0; i < q_number; i++) {
    let operatorStr = operator[Math.floor(Math.random() * operator.length)];

    let half = q_number / 2;
    
    if (plusCount === half) operatorStr = "-";
    if (minusCount === half) operatorStr = "+";

    let num1 = randomRange(min, max);
    let num2 = randomRange(min, max);
    
    if (operatorStr === "+") {
      plusCount++;
    }

    if (operatorStr === "-") {

      if (num1 < num2) {
          [num1, num2] = [num2, num1];
      }

      minusCount++;
    }

    let problem = `${num1} ${operatorStr} ${num2} =    `
    p.push(problem)
  }
  console.log(`plusCount: ${plusCount}, minusCount: ${minusCount}   `)
  return p;
}


// 两位数加减混合
function getOp2(operator, q_number) {
  let min = 10, max = 99;
  let plusCount = 0, minusCount = 0;
  

  let p = []
  for (let i = 0; i < q_number; i++) {
    let operatorStr = operator[Math.floor(Math.random() * operator.length)];

    let half = q_number / 2;
    
    if (plusCount === half) operatorStr = "-";
    if (minusCount === half) operatorStr = "+";

    let i = Math.floor(Math.random() * 2);
    let num1 = randomRange(min, max);
    let num2 = randomRange(min, max);

    let result;
    if (operatorStr === "-") {
      if (num1 < num2) {
          [num1, num2] = [num2, num1];
      }
      result = num1 - num2;
       minusCount++;
    }

    if (operatorStr === "+") {
      result = num1 + num2;
      plusCount++;
    }

    let problem;
    if (i === 0) {
        problem = `(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ${operatorStr} ${num2} = ${result}`;
    } else {
        problem = `${num1} ${operatorStr} (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) = ${result}`;
    }

    p.push(problem)

  }
  
  console.log(`plusCount: ${plusCount}, minusCount: ${minusCount}   `)
  return p;
}


// 两位数连加连减混合
function getOp3(operator, q_number) {

  let min = 10, max = 99;
  let p = []
  for (let i = 0; i < q_number; i++) {
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
    p.push(problem)
  }
  return p;
}

// 表内乘加混合
/*
 * 表内乘加混合
 * 例：47 + 3 * 7
*/
function getOp4(q_number) {
  
  let operator = ["+", "-"], leftOrRight = ["left", "right"];

  let min = 10, max = 99;
  let multiplyMin = 1, multiplyMax = 9;

  let plusCount = 0, minusCount = 0;
  
  let p = []
  for (let i = 0; i < q_number; i++) {
    let operatorStr = operator[Math.floor(Math.random() * operator.length)];
    let leftOrRightStr = leftOrRight[Math.floor(Math.random() * leftOrRight.length)];
    let num1 = randomRange(multiplyMin, multiplyMax);
    let num2 = randomRange(multiplyMin, multiplyMax);
    let result = num1 * num2;
    let num3 = randomRange(1, 99);

    let half = q_number / 2;
    
    if (plusCount === half) operatorStr = "-";
    if (minusCount === half) operatorStr = "+";
    
    if (operatorStr === "+") {
      let expr = "";
      if (leftOrRightStr === "left") {
        expr = `${num3} + ${num1} × ${num2} =    `
      }

      if (leftOrRightStr === "right") {
        expr = `${num1} × ${num2} + ${num3} =    `
      }

      plusCount++;
      p.push(expr)
    }

    if (operatorStr === "-") {
      let expr = "";
      if (leftOrRightStr === "left") {
        if (num3 < result) {
          num3 = randomRange(result, 99);
        }
        expr = `${num3} - ${num1} × ${num2} =    `
      }

      if (leftOrRightStr === "right") {
        console.log("d1", num3)
        if (num3 > result) {
          num3 = randomRange(1, result);
        }
        console.log("d2", num3)
        expr = `${num1} × ${num2} - ${num3} =    `
      }

      minusCount++;
      p.push(expr)
    }
    
  }
  console.log(`plusCount: ${plusCount}, minusCount: ${minusCount}   `)
  return p;
}

/*
 * 表内加减乘除混合
 * 例：47 + 3 * 7
 * 例：47 + 27 ÷ 3
*/
function getOp5(q_number) {
  
  let operator = ["+", "-"], leftOrRight = ["left", "right"];
  let multiplyDivideOperator = ["×", "÷"];

  let min = 10, max = 99;
  let multiplyMin = 1, multiplyMax = 9;

  let plusCount = 0, minusCount = 0;
  let multiplyCount = 0, divideCount = 0;
  
  let p = []
  for (let i = 0; i < q_number; i++) {
    let operatorStr = operator[Math.floor(Math.random() * operator.length)];
    let multiplyDivideOperatorStr = multiplyDivideOperator[Math.floor(Math.random() * multiplyDivideOperator.length)];
    console.log(operatorStr, multiplyDivideOperatorStr)
    let leftOrRightStr = leftOrRight[Math.floor(Math.random() * leftOrRight.length)];
    let num1 = randomRange(multiplyMin, multiplyMax);
    let num2 = randomRange(multiplyMin, multiplyMax);
    let result = num1 * num2;
    let num3 = randomRange(1, 99);

    let half = q_number / 2;
    
    if (plusCount === half) operatorStr = "-";
    if (minusCount === half) operatorStr = "+";
    if (multiplyCount === half) multiplyDivideOperatorStr = "÷";
    if (divideCount === half) multiplyDivideOperatorStr = "×";
    
    if (operatorStr === "+") {
      let expr = "";
      if (leftOrRightStr === "left") {

        if (multiplyDivideOperatorStr === "×") {
          expr = `${num3} + ${num1} × ${num2} =    `
          multiplyCount++;
        } else {
          expr = `${num3} + ${result} ÷ ${num1} =    `
          divideCount++;
        }

      }

      if (leftOrRightStr === "right") {
        
        if (multiplyDivideOperatorStr === "×") {
          expr = `${num1} × ${num2} + ${num3} =    `
          multiplyCount++;
        } else {
          expr = `${result} ÷ ${num1} + ${num3} =    `
          divideCount++;
        }
      }

      plusCount++;
      p.push(expr)
    }

    if (operatorStr === "-") {
      let expr = "";
      if (leftOrRightStr === "left") {

        if (multiplyDivideOperatorStr === "×") {
          if (num3 < result) {
            num3 = randomRange(result, 99);
          }
          expr = `${num3} - ${num1} × ${num2} =    `
          multiplyCount++;
        } else {
          let divideResult = result / num1;
          if (num3 < divideResult) {
            num3 = randomRange(divideResult, 99);
          }
          expr = `${num3} - ${result} ÷ ${num1} =    `
          divideCount++;
        }


      }

      if (leftOrRightStr === "right") {

        if (multiplyDivideOperatorStr === "×") {
          if (num3 > result) {
            num3 = randomRange(1, result);
          }
          expr = `${num1} × ${num2} - ${num3} =    `
          multiplyCount++;
        } else {
          let divideResult = result / num1;
          if (num3 > divideResult) {
            num3 = randomRange(1, divideResult);
          }
          expr = `${result} ÷ ${num1} - ${num3} =    `
          divideCount++;
        }


      }

      minusCount++;
      p.push(expr)
    }
    
  }
  return p;
}

function randomRangeOneToNine() {
  return Math.floor(Math.random() * 9 + 1);
}

function randomRange(min, max) {
  let num = Math.floor(Math.random() * (max - min + 1) + min);
  if (get_unit_one(num) === 0) {
    num = get_unit_ten(num) * 10 + randomRangeOneToNine();
  }
  return num;
}

function get_unit_one(num) {
  return num % 10;
}

function get_unit_ten(num) {
  return Math.floor(num / 10);
}