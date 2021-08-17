const colors = require("colors/safe");

let n = process.argv[2];
let numbers = [];
let color = "green"

if(isNaN(n)){
    console.log("ошибка");
} else {
    nextPrime:
    for (let i = 2; i <= n; i++) {

        for (let j = 2; j < i; j++) { 

            if (i % j == 0) continue nextPrime; 
        }

        switch(color) {
            case 'green':
              console.log(colors.green(i)); 
              color = "yellow";
              break
            case 'yellow':
              console.log(colors.yellow(i));
              color = "red"
              break
            case 'red': 
              console.log(colors.red(i));
              color = "green"
              break
        }
        numbers.push(i)
    }

    if(numbers.length===0)console.log(colors.red("нету простых чисел"))
}