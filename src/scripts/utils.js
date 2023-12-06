export function capitalizeFirstLetter(string) {
    return string.replace(/^\w/, (c) => c.toUpperCase());
}

export function escapeHTML(string) {
    return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function sortByAlphabeticalOrder(JSONData) {
    const length = JSONData.length;
    let swapped;
    
    do {
      swapped = false;
      for (let i = 0; i < length - 1; i++) {
        if (JSONData[i].name.toLowerCase() > JSONData[i + 1].name.toLowerCase()) {
          const temp = JSONData[i];
          JSONData[i] = JSONData[i + 1];
          JSONData[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  
    return JSONData;
}

export async function getDataFromFile(path) {
    const response = await fetch(path)
    let nodesData = {};
    try {
        nodesData = await response.json()
    } catch (error) {
        console.warn("Couldn't fetch data from file at '", path, "' or file was empty.")
    }
    return nodesData;
}