function init() { //primeira cidade a aparecer
    captureWeather('Brasília', '')
}
init()

document.addEventListener('click', (event) => {
    const el = event.target

    if (el.classList.contains('line') || el.classList.contains('menuIco') || el.classList.contains('hamburger'))
        showMenu() //mostra as opções do menu

    if (el.classList.contains('btn')) {
        document.querySelector('#loading').style.display = 'block' //mostra o loading

        document.querySelector('#name-city').innerHTML = '' //ocultam a tabela por um instante
        document.querySelector('#temp').innerHTML = ''
        document.querySelector('#sensacao-term').innerHTML = ''
        document.querySelector('#umid').innerHTML = ''
        document.querySelector('#est-temp').innerHTML = ''
        document.querySelector('#wind-vel').innerHTML = ''
        document.querySelector('#pressure').innerHTML = ''

        localSelect(event)
    }
})

function showMenu() { //mostra o menu
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

function verificaWidth() {
    const list = document.querySelector('#list')

    window.onload = function () {
        let larguraDaTela = window.innerWidth
        mediaQuery(larguraDaTela)
    }

    window.onresize = function () {
        var larguraDaTela = window.innerWidth
        mediaQuery(larguraDaTela)
    }
    
    function mediaQuery(width) {
        if (width >= 900) {
            document.querySelector('#td-menu').appendChild(list)
        } else {
            document.querySelector('#menuList').appendChild(list)
        }
    }
}
verificaWidth()

async function localSelect(e) { //obtem a cidade digitada
    e.preventDefault()
 
    let inputCity = document.querySelector('#inp-local').value

    if (!inputCity) { //caso não seja enviado nada
        alert('Digite uma cidade!')
        return
    }

    inputCity = inputCity.trim()

    const word = inputCity.split(' ') //para obter a sigla, caso digitada
    let siglaEstado = ''

    if (word.length > 1 && word[word.length - 1].length === 2) {
        const sigla = word[word.length - 1].toUpperCase()
        siglaEstado = await ObterSiglaEstado(sigla)
        word.pop()
        inputCity = word.join(' ')
    }

    captureWeather(inputCity, siglaEstado)
}

async function captureWeather(city, sigla) {
    const apiKey = '93a12f36a8cc9e0a562b1aa29fd8955b'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${sigla},BR&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)
        const data = await response.json()
console.log(data)
        if (data.sys.country !== 'BR') { //verifica se a cidade é brasileira
            alert('Este website só tem suporte a cidades brasileiras!')
            document.querySelector('#inp-local').value = ''
            return
        }

        const dataLocObj = dataLoc(data)
        showData(dataLocObj)

    } catch (error) {
        getState() //como não está sendo enviado nenhum argumento, esta função alertará um erro
    }
}

async function ObterSiglaEstado(sigla) { //verifica se a sigla digitada é válida a algum Estado
    const ibgeApiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
    const response = await fetch(ibgeApiUrl)
    const states = await response.json()

    for (let i = 0; i < states.length; i++) {
        const state = states[i]

        if (state.microrregiao.mesorregiao.UF.sigla === sigla) {
            return `,${state.microrregiao.mesorregiao.UF.sigla}`
        }
    }
    return '' //caso chegue aqui, isto não afetará o link
}

function dataLoc(data) { //obter os dados
    const coordLat = data.coord.lat
    const coordLon = data.coord.lon
    const sensacaoTerm = data.main.feels_like
    const umidade = data.main.humidity
    const temp = data.main.temp
    const nameCity = data.name
    const stateCity = data.sys.state
    const sky = data.weather[0].description
    const windVel = data.wind.speed
    const windDirecao = data.wind.deg
    const pressure = data.main.pressure

    return { coordLat, coordLon, sensacaoTerm, umidade, temp, nameCity, stateCity, sky, windVel, windDirecao, pressure }
}

async function showData(obj) { //mostra os dados
    const containNameCity = document.querySelector('#name-city')
    const containTemp = document.querySelector('#temp')
    const containSensTerm = document.querySelector('#sensacao-term')
    const containUmid = document.querySelector('#umid')
    const containEstTemp = document.querySelector('#est-temp')
    const containWindVel = document.querySelector('#wind-vel')
    const containPress = document.querySelector('#pressure')

    containNameCity.innerHTML = `${obj.nameCity} - ${await getState(obj.nameCity)}`
    containTemp.innerHTML = `Temperatura: ${obj.temp} °C`
    containSensTerm.innerHTML = `Sensação térmica de ${obj.sensacaoTerm} °C`
    containUmid.innerHTML = `Umidade dor ar: ${obj.umidade}%`
    containEstTemp.innerHTML = `Estado do tempo: ${await traduzirTemp(obj.sky)}`
    containWindVel.innerHTML = `Velocidade do vento: ${(obj.windVel * 3.6).toFixed(2)} Km/h - ${diVento(obj.windDirecao)}`
    containPress.innerHTML = `Pressão atmosférica: ${obj.pressure} hPa`

    document.querySelector('#loading').style.display = 'none' //tira o loading

    document.querySelector('#inp-local').value = ''

    maps(obj.coordLat, obj.coordLon)
}

function diVento(d) {
    if (d < 22.5 || d > 337.5) return `N &#8593;`
    if (d < 67.5) return `NE &#8599;`
    if (d < 112.5) return `L &#8594;`
    if (d < 157.5) return `SE &#8600;`
    if (d < 202.5) return `S &#8595;`
    if (d < 247.5) return `SW &#8601;`
    if (d < 292.5) return `O $&#8592;`
    if (d < 337.5) return `NW &#8598;`
}

async function getState(Namecity) { //obtem o Estado
    if (!Namecity) { //caso não tenha sido enviado argumentos (vem do catch)
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

            return Estado
        }
    }
}

function traduzirTemp(chave) {
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

let map
function maps(lat, long) {

    if (!map) { // verifica se o mapa já está inicializado
        map = L.map('map').setView([lat, long], 9)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)
    } else {
        map.setView([lat, long], 9)
    }

    map.eachLayer(function (layer) { // remove marcadores antigos, se houver
        if (layer instanceof L.Marker) {
            map.removeLayer(layer)
        }
    })

    L.marker([lat, long]).addTo(map)
}