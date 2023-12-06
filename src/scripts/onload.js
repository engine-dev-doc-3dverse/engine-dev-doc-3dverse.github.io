import { registerCollapsibles, registerNodeSearch, triggerAllCollapsibles, registerClipboardCopyButtons } from "./components.js";
import { Prism } from "./prism.min.js";
import { getDataFromFile } from "./utils.js";
import { generateHTML } from "./generate_doc.js";

window.addEventListener('load', load);

async function load() {
    await generateDocFromData();
    loadComponents();
}

async function loadComponents() {
    await registerCollapsibles();
    registerNodeSearch();
    registerClipboardCopyButtons();

    let triggerButton = document.getElementById('trigger-all-collapsibles')
    triggerButton.addEventListener('click', (event) => { event.target.classList.toggle('active'); triggerAllCollapsibles(event.target.classList.contains("active"));  });
}

async function generateDocFromData() {
    const nodesData = await getDataFromFile("./data/app_data/nodes_data.json")
    const [sidebar, main] = await generateHTML(nodesData)
    document.getElementById("sidebar-nodes-categories-list").innerHTML = sidebar;
    document.getElementById("documentation").innerHTML = main;
    Prism.highlightAllUnder(document.getElementById("documentation"))
}
