export default class Time {
    constructor() {
        this.hours = document.querySelector('.time__hours');
        this.minutes = document.querySelector('.time__minutes');
        this.seconds = document.querySelector('.time__seconds');
        this.date = document.querySelector('.time__date');
        // this.timeInfo = new Date();
    }

    updateTime() {
        const dateInfo = new Date(),
            hr = dateInfo.getHours(),
            min = dateInfo.getMinutes(),
            sec = dateInfo.getSeconds();

        if (hr < 10) { this.hours.textContent = `0${hr}`; } else { this.hours.textContent = hr; }
        if (min < 10) { this.minutes.textContent = `0${min}`; } else { this.minutes.textContent = min; }
        if (sec < 10) { this.seconds.textContent = `0${sec}`; } else { this.seconds.textContent = sec; }



        // ampm = dateInfo.getHours();

        // replace 0 with 12 at midnight, subtract 12 from hour if 13–23
        // if (dateInfo.getHours() == 0) {
        //     hr = 12;
        // } else if (dateInfo.getHours() > 12) {
        //     hr = dateInfo.getHours() - 12;
        // } else {
        //     hr = dateInfo.getHours();
        // }

        // let currentTime = `${hr}:${zero}${min}`;

        // print time



        /* date */
        let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        let month = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        let day = dateInfo.getDate();

        // store date
        let currentDate = weekday[dateInfo.getDay()] + ", " + month[dateInfo.getMonth()] + " " + day;

        this.date.textContent = currentDate;
    }

    init() {
        // print time and date once, then update them every second
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }


}




