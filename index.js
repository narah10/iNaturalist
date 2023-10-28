const url = "https://api.inaturalist.org/v1/places/autocomplete?q="
const idUrl = "https://api.inaturalist.org/v1/identifications/"
const searchBtn = document.querySelector('#searchBtn')
const form = document.querySelector('#submissionForm')

//fetching the place api
async function fetchiNaturalistString(queryParam) {
    const response = await fetch(`${url}${queryParam}`);
    const result = await response.json();
    const items = result.results.map(item => {
        return item;
    });
    return items;
}

//fetching the identifications data
async function fetchIdentification(idParam) {
    const response = await fetch(`${idUrl}${idParam}`);
    const result = await response.json();
    const value = result.results[0].observation
    console.log(result.results[0].observation)
    return value;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputValue = document.querySelector('#searchValue').value;
    const locationsContainer = document.querySelector('#locations');
    const identificationsContainer = document.querySelector('#identifications');
    locationsContainer.innerHTML = '';
    identificationsContainer.innerHTML = '';

    try {
        const items = await fetchiNaturalistString(inputValue);

        for (const item of items) {
            const button = document.createElement('button');
            button.textContent = item.display_name;
            locationsContainer.appendChild(button);

            button.addEventListener('click', async () => {
                try {
                    identificationsContainer.innerHTML = ''
                    const ids = await fetchIdentification(item.id);
                    console.log(ids.photos[0].url);
                    const img = document.createElement('img');
                    const p = document.createElement('p');
                    img.src = ids.photos[0].url;
                    p.textContent = ids.taxon.preferred_common_name;
                    identificationsContainer.appendChild(p);
                    identificationsContainer.appendChild(img);
                } catch (error) {
                    console.error('Error fetching identification data:', error);
                    const p = document.createElement('p');
                    p.textContent = "Unable to find information from fetching identification data"
                    identificationsContainer.appendChild(p);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching place data:', error);
    }
});
