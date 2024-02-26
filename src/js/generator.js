function generateProblems(type, exercisequantity, digits, NumQuantity, opers) {
  var problems = [];
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var numProblems = 0;
  while (numProblems < exercisequantity) {
    var номер = [];
    var номера = [];
    var знак = [];
    var знаки = [];
    for (var i = 0; i <= NumQuantity - 1; ++i) {
      номер[i] = "num" + (i + 1);
      var число = getRandomInt(
        10 ** digits - (10 ** digits - 10 ** (digits - 1)),
        10 ** digits - 1
      );
      номера.push([номер[i], число]);
    }
    for (var i = 0; i <= NumQuantity - 2; ++i) {
      знак[i] = "operator" + (i + 1);
      for (let j = 0; j < номера.length - 1; j++) {
        var operator = opers[Math.floor(Math.random() * opers.length)];
        знаки.push([знак[i], operator]);
      }
    }
    var znkai = Object.fromEntries(знаки);
    var ВсёВместе = Object.assign(
      Object.fromEntries(знаки),
      Object.fromEntries(номера)
    );
    let str = "";
    for (let i = 0; i != номера.length; i++) {
      str += ` ${номера[i][1]} `;
      str += eval(` znkai.operator${i + 1} `);
    }

    let toCount = str.replace("undefined", "");
    let counted = eval(toCount);
    console.log(Number.isInteger(counted), Math.sign(counted));
    console.log(toCount, "=", counted);

    if (Math.sign(counted) == (-1 || Infinity)) {
      continue;
    }
    if (Number.isInteger(counted) == false) {
      continue;
    }

    ВсёВместе["id"] = numProblems;
    ВсёВместе["correctAnswer"] = counted;
    problems.push(ВсёВместе);
    numProblems++;
  }

  return problems;
}
function generateProblems2(type, exercisequantity, digits, NumQuantity, opers,toFixed) {
  var problems = [];
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min + 1) + min;
  }
  var numProblems = 0;
  while (numProblems < exercisequantity) {
    var номер = [];
    var номера = [];
    var знак = [];
    var знаки = [];
    for (var i = 0; i <= NumQuantity - 1; ++i) {
      номер[i] = "num" + (i + 1);
      var число = getRandomInt(
        10 ** digits - (10 ** digits - 10 ** (digits - 1)),
        10 ** digits - 1
      );
      номера.push([
        номер[i],
        (число).toFixed(toFixed),
      ]);
    }
    for (var i = 0; i <= NumQuantity - 2; ++i) {
      знак[i] = "operator" + (i + 1);
      for (let j = 0; j < номера.length - 1; j++) {
        var operator = opers[Math.floor(Math.random() * opers.length)];
        знаки.push([знак[i], operator]);
      }
    }
    var znkai = Object.fromEntries(знаки);
    var ВсёВместе = Object.assign(
      Object.fromEntries(знаки),
      Object.fromEntries(номера)
    );
    let str = "";
    for (let i = 0; i != номера.length; i++) {
      str += ` ${номера[i][1]} `;
      str += eval(` znkai.operator${i + 1} `);
    }

    let toCount = str.replace("undefined", "");
    let counted = eval(toCount).toFixed(toFixed);
    console.log(Number.isInteger(counted), Math.sign(counted));
    console.log(toCount, "=", counted);

    // if (Math.sign(counted) == (-1 || Infinity)) {
    //   continue;
    // }

    ВсёВместе["id"] = numProblems;
    ВсёВместе["correctAnswer"] = counted;
    problems.push(ВсёВместе);
    numProblems++;
  }

  return problems;
}
export { generateProblems, generateProblems2 };
