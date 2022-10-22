window.addEventListener('DOMContentLoaded', () => {
    const selectTime = document.getElementById('time');
    const selectTimeItem = selectTime.querySelectorAll('.main__item-time');
    const selectRoute = document.getElementById('route');
    const selectReverseTime = document.getElementById('reverse-time');
    const selectReverseTimeItem = selectReverseTime.querySelectorAll('.main__item-time');
    let date = formatTime(new Date());

    //получить время
    function parseTime(str) {
        let arr = str.split('(');
        return arr.slice(0, 1).toString();
    }

    //получить направление
    function parseRoute(str) {
        let arr = str.split('(').slice(1, 2).toString();
        let newStr = arr.split('');
        newStr.pop();
        return newStr.join('').toString();
    }

    //изменить формат даты
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();

        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;

        return `${hours}:${minutes}`
    }

    //открытие дополнительного select
    function renderSelectTime(valueSelectRoute) {
        selectTimeItem.forEach(item => { 
            let time = parseTime(item.value);
            let route = parseRoute(item.value); 
          

            if (valueSelectRoute !== route) {
                item.classList.add('is-close');
            } else if (item.classList.contains('is-close')) {
                item.classList.remove('is-close');
            } 

            if (valueSelectRoute === "из A в B и обратно в А" && route === "из A в B") {
                if (item.classList.contains('is-close')) {
                    item.classList.remove('is-close');
                } 
            }

            if (date > time) {
                item.classList.add('is-close');
            }
        });
    }

    //получить сумму билетов
    function getSum() {
        let summa;
        if (selectRoute.value !== "из A в B и обратно в А") {
            summa = 700;
        } else summa = 1200;
        return summa;
    }

    //получить общее время поездки
    function getTimeTrevel(start, end) {
        let startArr = start.split(':'),
            endArr = end.split(':'),
            startDate = new Date(),
            endDate = new Date();

        for (let i=0; i < startArr.length; i++) {
            startDate.setHours(startArr[0]);
            startDate.setMinutes(startArr[1]);  
        }

        for (let i=0; i < endArr.length; i++) {
            endDate.setHours(endArr[0]);
            endDate.setMinutes(endArr[1]);   
        }
        
        let ms = endDate - startDate,
            time = (ms / 3600000).toString().substring(0, 4),
            arrTime = time.split('.'),
            res = '';
        
        for (let i=0; i < arrTime.length - 1; i++) {
            res = res.concat(`${arrTime[0]} час(a) ${arrTime[1]} минут(ы)`) ;
        }
       
        return res;
    }

    //добавить минуты к дате
    function addMinutes(minutes, date, arr) {
        for (let i=0; i < arr.length; i++) {
            date.setHours(arr[0]);
            date.setMinutes(arr[1]);   
        }

        date.setMinutes(date.getMinutes() + minutes);
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    //получить конечное время поездки
    function getEndTravelTime(start = null, end) {
        if (end) {
            let endTime = end.split(':');
            let endDate = new Date();

            return addMinutes(50, endDate, endTime);
        } else {
            let startTime = start.split(':'),
                startDate = new Date();

            return addMinutes(50, startDate, startTime);
        }      
    }
    
    renderSelectTime(selectRoute.value);

    //событие на выбор направления
    selectRoute.addEventListener('change', function() {   
        if (this.value === "из A в B и обратно в А") {
            selectReverseTime.classList.remove('is-close');
        } else selectReverseTime.classList.add('is-close');

        renderSelectTime(this.value);
        
        selectReverseTimeItem.forEach(item => {
            let time = parseTime(item.value);
            if (date > time) {
                item.classList.add('is-close');
            }
        });
    });

    document.querySelector('.main__btn').addEventListener('click', () => {
        let ticketQuantity = document.getElementById('num').value.trim();
        let point = selectRoute.value;
        let sum = getSum();
        let timeTrevel = '50 мнин';
        let start = parseTime(selectTime.value);
        let end = parseTime(selectReverseTime.value);
        let endTimeTravel;

        if (selectRoute.value === "из A в B и обратно в А") {
            timeTrevel = getTimeTrevel(start, end);
            endTimeTravel = getEndTravelTime(null, end);
        } else {
            endTimeTravel = getEndTravelTime(start);
        }

        console.log(`Вы выбрали ${ticketQuantity} билета по маршруту ${point} стоимостью ${sum}р.
        Это путешествие займет у вас ${timeTrevel}. 
        отправляется в ${start}, а прибудет в ${endTimeTravel}.`); 

    });
})