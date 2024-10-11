

const key = "2819fc53b717ff3080ffb913229bcc36";

let url="https://api.openweathermap.org/data/2.5/weather?q=";

let wholediv = document.querySelector(".main-div");

let h3 = document.querySelector("h3");

h3.classList.add("remove");

let button = document.querySelector("button");

let input = document.querySelector("input");

let img = document.querySelector("#main-img");

let temperature = document.querySelector("#temp");

let city = document.querySelector("#city");

let wind = document.querySelector("#wind");

let humidity = document.querySelector("#humidity");

wholediv.style.height = "120px";

img.classList.add("remove");


button.addEventListener("click",async ()=>{

    

    let country = input.value;

  

    let data = await getData(country);


  


    console.log(data);

    if(data.cod != 404){


        if( data.weather[0].main == "Clouds"){
            img.src = "clouds.png";
        }else if(data.weather[0].main == "Snow"){
            img.src = "snow.png";
    
        }else if(data.weather[0].main == "Rain"){
            img.src = "rain.png";
            
        }else if(data.weather[0].main == "Mist"){
            img.src = "mist.png";
            
        }else if(data.weather[0].main == "Drizzle"){
            img.src = "drizzle.png";
            
        }else if(data.weather[0].main == "Clear"){
            img.src = "clear.png";
            
        }

        h3.classList.add("remove");
        wholediv.style.height = "620px";

        img.classList.remove("remove");
    
    
        let temp = data.main.temp;
    
    
        let tempinC = Math.round(temp-273);
    
        wind.innerText = data.wind.speed + " Km/h";
    
        temperature.innerText = tempinC + "°C";
    
        humidity.innerText = data.main.humidity + " %";
    
        city.innerText = data.name;

    }else{

        h3.classList.remove("remove");

        wholediv.style.height = "180px";

img.classList.add("remove");
       


    }

        
    input.value=" ";
    
   



})


async function  getData(country) {

    try{

        let res = await fetch(url + country + `&appid=${key}`);

        let data = await res.json();
    
        return data;
    }
    catch(e){
         return e;
    }
   
    
}

getData("pakistan");