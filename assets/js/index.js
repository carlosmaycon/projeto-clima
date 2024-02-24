function init() {
    captureWeather('Brasília')
}
init()

document.addEventListener('click', (event) => {
    const el = event.target

    if (el.classList.contains('line') || el.classList.contains('menuIco') || el.classList.contains('hamburger'))
        showMenu() //mostra as opções do menu

    if (el.classList.contains('btn'))
        localSelect(event)
})

function showMenu() {
    const menu = document.querySelector('#menu')
    const styleEl = getComputedStyle(menu)

    const tableIcoTd = document.querySelector('#td-menu')
    const containerIcoSpan = document.querySelector('.menuIcoContainer')
    const containMenuIco2 = document.querySelector('#menuIco2')

    if (styleEl.display === 'none') {
        menu.style.display = 'block'
        containMenuIco2.appendChild(containerIcoSpan)

    } else {
        tableIcoTd.appendChild(containerIcoSpan)
        menu.style.display = 'none'
    }
}

function localSelect(e) {
    e.preventDefault()

    let inputCity = document.querySelector('#inp-local').value

    if (!inputCity) {
        alert('Digite uma cidade!')
        return
    }

    captureWeather(inputCity)
}

async function captureWeather(city) {
    const word = city.split(' ')
    let siglaEstado = ''

    if (word.length > 1 && word[word.length - 1].length === 2) {
        const sigla = word[word.length - 1].toUpperCase()
        siglaEstado = await ObterSiglaEstado(sigla)
    }

    const apiKey = '93a12f36a8cc9e0a562b1aa29fd8955b'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${siglaEstado},BR&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)
        const data = await response.json()
        //console.log(data)
        const dataLocObj = dataLoc(data)
        showData(dataLocObj)

    } catch (error) {
        getState()
    }
}

async function ObterSiglaEstado(sigla) {
    const ibgeApiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
    const response = await fetch(ibgeApiUrl)
    const states = await response.json()

    for (let i = 0; i < states.length; i++) {
        const state = states[i]

        if (state.microrregiao.mesorregiao.UF.sigla === sigla) {
            return `, ${state.microrregiao.mesorregiao.UF.sigla}`
        }
    }
    return ''
}

function dataLoc(data) {
    const coordLat = data.coord.lat
    const coordLon = data.coord.lon
    const sensacaoTerm = data.main.feels_like
    const umidade = data.main.humidity
    const temp = data.main.temp
    const nameCity = data.name
    const stateCity = data.sys.state
    const sky = data.weather[0].description
    const windVel = data.wind.speed
    const ultraViol = data.value

    return { coordLat, coordLon, sensacaoTerm, umidade, temp, nameCity, stateCity, sky, windVel, ultraViol }
}

async function showData(obj) {
    const containNameCity = document.querySelector('#name-city')
    const containTemp = document.querySelector('#temp')
    const containSensTerm = document.querySelector('#sensacao-term')
    const containUmid = document.querySelector('#umid')
    const containEstTemp = document.querySelector('#est-temp')
    const containWindVel = document.querySelector('#wind-vel')
    const containUV = document.querySelector('#ind-uv')

    containNameCity.classList.add(wheel-and-hamster)

    containNameCity.innerHTML = `${obj.nameCity} - ${await getState(obj.nameCity)}`
    containTemp.innerHTML = `Temperatura: ${obj.temp} °C`
    containSensTerm.innerHTML = `Sensação térmica de ${obj.sensacaoTerm} °C`
    containUmid.innerHTML = `Umidade dor ar: ${obj.umidade}%`
    containEstTemp.innerHTML = `Estado do tempo: ${await traduzir(obj.sky)}`
    containWindVel.innerHTML = `Velocidade do vento: ${(obj.windVel * 3.6).toFixed(2)} Km/h`
    containUV.innerHTML = `Índice de UV: ${obj.ultraViol}`

    document.querySelector('#inp-local').value = ''
}

async function getState(Namecity) {
    if (!Namecity) {
        alert('Digite uma cidade válida!')
        document.querySelector('#inp-local').value = ''
        return
    }
    const ibgeApiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`;
    const response = await fetch(ibgeApiUrl)
    const cities = await response.json()


    for (let i = 0; i < cities.length; i++) {
        const city = cities[i]

        if (city.nome === Namecity) {
            const Estado = city.microrregiao.mesorregiao.UF.sigla

            const stadeOfCity = Estado
            return stadeOfCity
        }
    }
}

function traduzir(chave) {
    const obj = {
        'overcast clouds': 'Céu nublado',
        'broken clouds': 'Céu parcialmente nublado',
        'scattered clouds': 'Nuvens dispersas',
        'clear sky': 'Céu limpo',
        'few clouds': 'Poucas nuvens',
        'mist': 'Presença de neblina',
        'fog': 'Névoa densa',
        'snow': 'Nevando',
        'rain': 'Chuva',
        'drizzle': 'Chuva leve e fina',
        'sleet': 'Granizo',
        'haze': 'Neblina seca',
        'smoke': 'Presença de fumaça na atmosfera',
        'sand': 'Presença de areia na atmosfera (possívelmente uma tempestade de areia)',
        'thunderstorm': 'Chuva forte com trovoadas',
        'heavy intensity rain': 'Chuva intensa, possibilidade de inundações',
        'very heavy rain': 'Chuva intensa, altas chances de inundações',
        'moderate rain': 'Chuva moderada',
        'light rain': 'Chuva com precipitação baixa'
    }

    return obj[chave]
}