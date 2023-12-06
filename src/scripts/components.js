export async function registerNodeSearch() {
    document.getElementById('nodes-search-input').addEventListener('keyup', searchNodes);
}

export async function registerCollapsibles() {
    /* Init Collapsibles */
    document.querySelectorAll('.collapsible').forEach((collapsible) => collapsible.querySelector('.collapsible-trigger').addEventListener('click', () => triggerCollapsible(collapsible)));
}

export async function registerClipboardCopyButtons() {
    /* Init Collapsibles */
    document.querySelectorAll('.copy-onclick').forEach((copyButton) => { 
        copyButton.addEventListener('click', () => { copyTextToClipboard(copyButton)});
    });
}

/* COLLAPSIBLES */
function collapseCollapsible(element) {
    element.style.height = 0 + 'px';
}

function expandCollapsible(element) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
}

async function triggerCollapsible(collapsible) {
    collapsible.classList.toggle('active');
    if(collapsible.classList.contains('active')) {
        expandCollapsible(collapsible.querySelector('.collapsible-content'));
    } else {
        collapseCollapsible(collapsible.querySelector('.collapsible-content'));
    }
}

async function setCollapsibleState(collapsible, state) {
    if(state) {
        collapsible.classList.add('active');
        expandCollapsible(collapsible.querySelector('.collapsible-content'));
    } else {
        collapsible.classList.remove('active');
        collapseCollapsible(collapsible.querySelector('.collapsible-content'));
    }
}

function toggleDisplayState(element, displayState) {
    if(displayState) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

export async function triggerAllCollapsibles(newState) {
    document.getElementById('documentation').querySelectorAll('.collapsible').forEach((collapsible) => {setCollapsibleState(collapsible, newState) });
}

async function searchNodes(event) {
    const searchInput = event.target.value.toLowerCase();
    
    const categories = document.querySelectorAll('.sidebar-category-container');
    categories.forEach(category => {
        let displayCategory = false;
        const nodes = category.querySelectorAll('.node-anchor-link');
        nodes.forEach(node => {
            toggleDisplayState(node.parentElement, (node.innerText.toLowerCase().includes(searchInput)))
            displayCategory = displayCategory || (node.innerText.toLowerCase().includes(searchInput));
        });

        //Debug Collapsible Content Scrollheight
        category.querySelector('.collapsible-content').style.height = 'auto';        
        toggleDisplayState(category, displayCategory);
        setCollapsibleState(category, displayCategory);
    });
}

/* COPY TEXT TO CLIPBOARD BUTTONS */
async function copyTextToClipboard(copyButton) {
    const copiedText = copyButton.getElementsByClassName('copy-onclick-content')[0].innerHTML; 
    navigator.clipboard.writeText(copiedText).then(() => {
            let icon = copyButton.getElementsByClassName('copy-icon')[0];
            icon.classList.replace('fa-copy', 'fa-check');
            setTimeout(()=>{icon.classList.replace('fa-check', 'fa-copy');}, 3000);
        }),
        () => { /* clipboard write failed */ }
    };