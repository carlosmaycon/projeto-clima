async function checkCityInBrazil(city) {
    const ibgeApiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
    const response = await fetch(ibgeApiUrl)
    const cities = await response.json()

    // Verifica se a cidade fornecida está na lista de cidades brasileiras
    const cityInBrazil = cities
    console.log(cityInBrazil)
    return cityInBrazil
}
checkCityInBrazil('Brasília')