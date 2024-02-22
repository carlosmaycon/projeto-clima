document.addEventListener('click', (event) => {
    const el = event.target

    if (el.classList.contains('line') || el.classList.contains('menuIco') || el.classList.contains('hamburger'))
        showMenu()

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

    const inputCity = document.querySelector('#inp-local').value

    captureWeather(inputCity)
}

function captureWeather(citySelect) {
    const city = citySelect.toLowerCase()
    const kay = '93a12f36a8cc9e0a562b1aa29fd8955b'
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric'
}