//Напишите программу, которая будет принимать на вход несколько аргументов: дату и время в формате «час-день-месяц-год».
// Задача программы — создавать для каждого аргумента таймер с обратным отсчётом: посекундный вывод в
// терминал состояния таймеров (сколько осталось). По истечении какого-либо таймера, вместо сообщения о том,
// сколько осталось, требуется показать сообщение о завершении его работы. Важно, чтобы работа программы
// основывалась на событиях.
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const emitterObject = new MyEmitter();

let dates = [];
let count = 0;

process.argv.forEach(function(item, i) {
    if(i>1) {
        oneOfDate = item.split("-");
        let future = Date.parse(oneOfDate[3] + "-" + oneOfDate[2] + "-" + oneOfDate[1] + "T" +  oneOfDate[0] + ":00:00")
        let now     = new Date();
        if(future< now){
            console.log("время номер " + (i-1) + " является меньше настоящего времени. введите время превышающее настоящее");
        }else if(isNaN(future)){
            console.log("ввели некоректное значение. введите значение в формате ЧЧ-ДД-ММ-ГГГГ")
        }else { dates.push(future);
            startTimer()
        }
    }
});



function updateTimer() {
    console.clear()
    dates.forEach(function(item, i) {
        let now     = new Date();
        let diff    = item - now;

        if (diff>0) {
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let hours = Math.floor(diff / (1000 * 60 * 60));
            let mins = Math.floor(diff / (1000 * 60));
            let secs = Math.floor(diff / 1000);

            let d = days;
            let h = hours - days * 24;
            let m = mins - hours * 60;
            let s = secs - mins * 60;

            console.log('счетчик №' + (i+1) + '. осталось ' + d + 'дней ' +
                h + 'часов ' +
                m + 'минут ' +
                s + 'секунд')
        }else {
             console.log("Время вышло")
            count++

         }

        if(count == dates.length) {
            clearInterval(timer)}
    })

}

function startTimer() {
    timer = setInterval(() => emitterObject.emit('updateData'), 1000);
}

emitterObject.on('updateData', updateTimer);

