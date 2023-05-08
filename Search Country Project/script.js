const searchBtn = document.querySelector("button");
const searchInput = document.querySelector("#search");
const countryInfoDiv = document.getElementById("country-info");

searchBtn.addEventListener("click", () => {
  const searchQuery = searchInput.value;
  if (searchQuery.trim().length > 0) {
    fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const country = data[0];
        if (!country) {
          throw new Error("Ky shtet nuk ekziston");
        }
        const flag = country.flags.svg;
        const name = country.name.common;
        const language = Object.values(country.languages)[0];
        const population = country.population;
        const currency = Object.keys(country.currencies)[0];
        const borderCountries = country.borders;

        const borderRequests = borderCountries.map((code) =>
          fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
        );

        Promise.all(borderRequests)
          .then((responses) =>
            Promise.all(responses.map((response) => response.json()))
          )
          .then((borderCountriesData) => {
            const borderCountriesInfo = [];
            borderCountriesData.forEach((data) => {
              const borderCountryName = data[0].name.common;
              const borderCountryFlag = data[0].flags.svg;
              borderCountriesInfo.push({
                name: borderCountryName,
                flag: borderCountryFlag,
              });
            });

            const borderCountriesNames = borderCountriesInfo
              .map(
                (country) =>
                  `<img src="${country.flag}" alt="Flag of ${country.name}" > ${country.name}`
              )
              .join(", ");
            const googleLink = `https://www.google.com/maps/search/${name}`;
            const sceleton = `
              <img src="${flag}" alt="Flag of ${name}">
              <h2>${name}</h2>
              <p>Language: ${language}</p>
              <p>Population: ${population}</p>
              <p>Currency: ${currency}</p>
              <p><a href="${googleLink}" target="_blank">Click to view this country on google maps</a></p>
              <p>Bordering Countries: ${borderCountriesNames}</p>

            `;
            countryInfoDiv.innerHTML = sceleton;
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        countryInfoDiv.innerHTML = `<p>${error.message}</p>`;
      });
  }
});
