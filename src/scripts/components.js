
async function collapseCollapsible(element) {
    element.style.height = 0 + 'px';
}

async function expandCollapsible(element) {
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

async function registerCollapsibles() {
    /* Init Collapsibles */
    document.querySelectorAll('.collapsible').forEach((collapsible) => collapsible.querySelector('.collapsible-trigger').addEventListener('click', () => triggerCollapsible(collapsible)));
}


function toggleDisplayState(element, displayState) {
    if(displayState) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

async function searchNodes(event) {
    const searchInput = event.target.value.toLowerCase();
    
    const categories = document.querySelectorAll('.sidebar-category-container');
    categories.forEach(category => {
        displayCategory = false;
        nodes = category.querySelectorAll('.node-anchor-link');
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

async function registerNodeSearch() {
    document.getElementById('nodes-search-input').addEventListener('keyup', searchNodes);
}

async function loadComponentsEventListeners() {
    registerCollapsibles();
    registerNodeSearch();
}

loadComponentsEventListeners();