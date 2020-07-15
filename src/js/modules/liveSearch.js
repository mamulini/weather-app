import GetWeather from './getWeather';

export default class LiveSearch extends GetWeather {
    constructor() {
        super();
        this.resultList = document.querySelector('.location__result-list');
    }

    // getting city list 
    async cities(city) {
        let findCityApi = `https://andruxnet-world-cities-v1.p.rapidapi.com/?query=${city}&searchby=city`;

        let res = await fetch(findCityApi, {
            "headers": {
                "x-rapidapi-host": "andruxnet-world-cities-v1.p.rapidapi.com",
                "x-rapidapi-key": "d065d49414msh0a6a0448c16029dp17184ajsnd71d512c52f0"
            }
        });

        let data = await res.json();

        data.forEach(item => {
            let listItem = document.createElement('li');

            if (item.city.search(new RegExp("^" + city, "i")) !== -1) {
                listItem.textContent = `${item.city}`;
                this.resultList.appendChild(listItem);
                listItem.style.display = "block";
            } else {
                listItem.style.display = "none";
            }

            let children = this.resultList.children;
            let set = new Set();

            for (let i = 0; i < children.length; i++) {
                if (set.has(children[i].textContent)) {
                    children[i].style.display = 'none';
                } else {
                    set.add(children[i].textContent);
                }
            }

            listItem.addEventListener('click', () => {
                this.resultList.style.display = "none";
                this.city = listItem.textContent;
                console.log(this.city);
                this.getCityCoord();

                this.input.value = '';
                setTimeout(() => {  // setTimeout ? or somthing better? : )
                    this.getWeather();
                }, 500);
            });


        });
    }

    init() {
        this.input.addEventListener('keyup', () => {
            this.resultList.innerHTML = '';
            const val = this.input.value.trim();
            if (val.length >= 3) {
                this.resultList.style.display = 'block';
                this.cities(val);
            } else {
                this.resultList.style.display = 'none';
            }
        });
    }
}