document.addEventListener('click', (e) => {
  const el = e.target

  const menu = document.querySelector('#menu')
  const styleEl = getComputedStyle(menu)

  if (el.classList.contains('line') || el.classList.contains('menuIco') || el.classList.contains('hamburger')) {
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
})