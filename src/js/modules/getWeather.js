export default class GetWeather {
    constructor() {
        this.lat = 49.84; //50.45; 
        this.lng = 24.02; //30.52;
        this.city = '';
        this.apiLocation = '';
        this.input = document.querySelector('.location__input');
        this.searchBtn = document.querySelector('.location__search-btn');
        this.gpsBtn = document.querySelector('.location__gps-btn');
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.units = 'metric';
    }

    // getting one day forecast and location lattitude and longittude by typeing in input search
    async getCityCoord() {
        try {
            const posApi = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=43ba6481c3bd842c9f1c3a6cdf5c6957&units=${this.units}`;

            let get = await fetch(posApi);
            let data = await get.json();

            let status = data.cod;
            console.log('City coord: ', data);

            if (status === '400') throw new Error('Input is empty!');
            if (status === '404') throw new Error('Please type the correct location name!');

            this.lat = data.coord.lat;
            this.lng = data.coord.lon;

            this.apiLocation = `${data.name}, ${data.sys.country.toUpperCase()}`;

        } catch (err) {
            this.input.value = '';
            if (err.name === 'Error') {
                alert(err);
            } else {
                alert('Please try again');
            }
        }

    }

    // getting one day forecast and location lattitude and longittude by current GPS location
    getGeoLocation() {
        this.gpsBtn.addEventListener('click', () => {
            this.input.value = '';
            console.log('gps');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    console.log(pos);
                    this.lng = pos.coords.longitude;
                    this.lat = pos.coords.latitude;

                    const gpsRes = `https://api.openweathermap.org/data/2.5//weather?lat=${this.lat}&lon=${this.lng}&appid=43ba6481c3bd842c9f1c3a6cdf5c6957&units=${this.units}`;

                    fetch(gpsRes)
                        .then(res => res.json())
                        .then(data => {
                            this.apiLocation = `${data.name}, ${data.sys.country.toUpperCase()}`;
                            this.getWeather();
                        })
                        .catch(err => {
                            alert('Something get wrong, please try again');
                        });

                });
            }

        });
    }

    async getWeather() {


        // Today forecast
        const todayDescription = document.querySelector('.today__description'),
            todayDegree = document.querySelector('.today__degree'),
            locationName = document.querySelector('.location-title'),
            todayIcon = document.querySelector('.today__icon'),
            todayHumidity = document.querySelector('.today__himidity'),
            todayWind = document.querySelector('.today__wind');

        //Cards - next 6 days forcast
        const cards = document.querySelectorAll('.daily__card');

        let weeklyWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.lng}&cnt=7&appid=6e4b78723374bfb2085e80fe383222a3&units=${this.units}&exclude=hourly`;

        let get = await fetch(weeklyWeatherApi);
        let data = await get.json();

        console.log(data);

        const weatherIcon = `http://openweathermap.org/img/wn//${data.current.weather[0].icon}@2x.png`;

        // Set DOM elements from the API for today forcast
        if (!this.apiLocation) {
            locationName.textContent = data.timezone.replace(/\w+\//g, '');
        } else {
            locationName.textContent = this.apiLocation;
        }

        todayDegree.textContent = `
            ${Math.round(data.current.temp)} 
            ${this.units === 'metric' ? '\xB0C' : '\xB0F'} `;
        todayDescription.textContent = data.current.weather[0].description;
        todayIcon.innerHTML = `<img src="${weatherIcon}">`;
        todayHumidity.innerHTML = `<i class="fas fa-tint"></i> ${data.current.humidity} %`;
        todayWind.innerHTML = `
            <i class="fas fa-wind"></i>
            ${this.units === 'metric' ? 'km/h' : 'mph'} `;

        // Set DOM elements from the API for daily forcast
        cards.forEach((card, i) => {
            let date = new Date(data.daily[i + 1].dt * 1000);

            card.children[0].textContent = this.weekdays[date.getDay()].slice(0, 3).toUpperCase();
            card.children[1].src = `http://openweathermap.org/img/wn//${data.daily[i + 1].weather[0].icon}@2x.png`;
            card.children[2].textContent = data.daily[i + 1].weather[0].description;
            card.children[3].textContent = `${Math.round(data.daily[i + 1].temp.day)}${this.units === 'metric' ? '\xB0C' : '\xB0F'} `;
            card.children[4].innerHTML = `<i class="fas fa-tint" ></i> ${data.daily[i + 1].humidity} % `;
            card.children[5].innerHTML = `<i class="fas fa-wind" ></i> ${Math.round(data.daily[i + 1].wind_speed)}
            ${ this.units === 'metric' ? 'km/h' : 'mph'} `;

        });

        console.log('GetWeather method : ', this.lat, this.lng);

    }

    onSearchBtn(btn) {
        btn.addEventListener('click', () => {
            this.city = this.input.value;
            document.querySelector('.location__result-list').style.display = 'none';
            this.getCityCoord();
            this.input.value = '';

            setTimeout(() => {  // setTimeout ? or somthing better?  :)
                this.getWeather();
            }, 500);
        });
    }


    onEnter() {
        this.input.addEventListener("keyup", (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                e.preventDefault();
                this.searchBtn.click();
            }
        });
    }

    degreeUnits() {
        const checkbox = document.getElementById('unitSwitch');

        checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                this.units = 'imperial';
                console.log('checked');

            } else {
                this.units = 'metric';
                console.log('not checked');
            }
            console.log('Degree method : ', this.lat, this.lng);
            this.getWeather();

        });



    }




    init() {
        this.getWeather();
        this.onSearchBtn(this.searchBtn);
        this.onEnter();
        this.getGeoLocation();
        this.degreeUnits();
    }

}

