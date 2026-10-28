
/* =================================
   PROPERTYFINDER - SHARED DATA
================================= */

const defaultProperties = [
    {
        id: 1,
        name: "Modern Family House",
        type: "House",
        location: "New Delhi",
        price: 75,
        beds: 3,
        baths: 2,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Luxury City Apartment",
        type: "Apartment",
        location: "Noida",
        price: 58,
        beds: 2,
        baths: 2,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Beautiful Garden Villa",
        type: "Villa",
        location: "Agra",
        price: 92,
        beds: 4,
        baths: 3,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    }
];

function getStored(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveStored(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.propertyToastTimer);
    window.propertyToastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2200);
}

function formatPrice(price) {
    return `₹${price} Lakh`;
}


/* =================================
   PAGE 1 - HOME PAGE
================================= */

let homeProperties = getStored("pf_properties", defaultProperties);

const homeSearchForm = document.getElementById("homeSearchForm");

if (homeSearchForm) {
    homeSearchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const location = document.getElementById("homeLocation").value.trim();
        const type = document.getElementById("homeType").value;

        const search = {
            id: Date.now(),
            location,
            type: type || "Any Type",
            budget: "Any Budget",
            active: true,
            createdAt: Date.now()
        };

        let searches = getStored("pf_searches", []);

        searches.unshift(search);
        saveStored("pf_searches", searches);

        window.location.href = "properties.html";
    });
}

const saveHomeSearch = document.getElementById("saveHomeSearch");

if (saveHomeSearch) {
    saveHomeSearch.addEventListener("click", function () {
        const location = document.getElementById("homeLocation").value.trim();
        const type = document.getElementById("homeType").value;

        if (!location && !type) {
            showToast("Enter a location or choose a property type first.");
            return;
        }

        const searches = getStored("pf_searches", []);

        searches.unshift({
            id: Date.now(),
            location,
            type: type || "Any Type",
            budget: "Any Budget",
            active: true,
            createdAt: Date.now()
        });

        saveStored("pf_searches", searches);
        showToast("Search saved successfully!");
    });
}


/* =================================
   PAGE 5 - SAVED SEARCHES & ALERTS
================================= */

let savedSearches = getStored("pf_searches", [
    {
        id: 101,
        location: "New Delhi",
        type: "House",
        budget: "Under ₹50 Lakh",
        active: true,
        createdAt: Date.now() - 3000
    },
    {
        id: 102,
        location: "Noida",
        type: "Apartment",
        budget: "₹50–80 Lakh",
        active: true,
        createdAt: Date.now() - 2000
    },
    {
        id: 103,
        location: "Agra",
        type: "Villa",
        budget: "Above ₹80 Lakh",
        active: false,
        createdAt: Date.now() - 1000
    }
]);

const searchList = document.getElementById("searchList");

function renderSearches() {
    if (!searchList) return;

    searchList.innerHTML = "";

    savedSearches.forEach((item) => {
        const row = document.createElement("article");
        row.className = "search-item";

        const icon = document.createElement("div");
        icon.className = "search-icon";
        icon.textContent = "⌕";

        const info = document.createElement("div");
        info.className = "search-info";

        const title = document.createElement("h3");
        title.textContent = item.location || "All Locations";

        const description = document.createElement("p");
        description.textContent = "Saved property search";

        const tags = document.createElement("div");
        tags.className = "filter-tags";

        const typeTag = document.createElement("span");
        typeTag.textContent = "🏠 " + item.type;

        const budgetTag = document.createElement("span");
        budgetTag.textContent = "💰 " + item.budget;

        tags.append(typeTag, budgetTag);
        info.append(title, description, tags);

        const actions = document.createElement("div");
        actions.className = "search-actions";

        const label = document.createElement("label");
        label.className = "toggle-label";

        const status = document.createElement("span");
        status.textContent = item.active ? "Alert On" : "Alert Off";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.active;
        checkbox.setAttribute("aria-label", "Toggle alert");

        checkbox.addEventListener("change", function () {
            item.active = checkbox.checked;
            saveStored("pf_searches", savedSearches);
            renderSearches();
        });

        label.append(status, checkbox);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑";
        deleteButton.setAttribute("aria-label", "Delete saved search");

        deleteButton.addEventListener("click", function () {
            savedSearches = savedSearches.filter(
                search => search.id !== item.id
            );

            saveStored("pf_searches", savedSearches);
            renderSearches();
            showToast("Saved search deleted.");
        });

        actions.append(label, deleteButton);
        row.append(icon, info, actions);
        searchList.appendChild(row);
    });

    const total = document.getElementById("totalSearches");
    const active = document.getElementById("activeAlerts");
    const count = document.getElementById("savedCount");

    if (total) total.textContent = savedSearches.length;

    if (active) {
        active.textContent = savedSearches.filter(
            item => item.active
        ).length;
    }

    if (count) count.textContent = `${savedSearches.length} Saved`;

    if (savedSearches.length === 0) {
        searchList.innerHTML = `
            <div class="empty-state">
                <h3>No saved searches yet</h3>
                <p>Save a property search to see it here.</p>
            </div>
        `;
    }
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const location = document.getElementById("searchInput").value.trim();
        const type = document.getElementById("propertyType").value;
        const budget = document.getElementById("priceRange").value;

        savedSearches.unshift({
            id: Date.now(),
            location,
            type,
            budget,
            active: true,
            createdAt: Date.now()
        });

        saveStored("pf_searches", savedSearches);
        searchForm.reset();
        renderSearches();
        showToast("Property search saved!");
    });

    renderSearches();
}


/* =================================
   PAGE 6 - FAVORITES / WISHLIST
================================= */

let wishlist = getStored("pf_wishlist", []);

function addFavorite(id) {
    const property = homeProperties.find(
        item => item.id === Number(id)
    );

    if (!property) return;

    const exists = wishlist.some(item => item.id === property.id);

    if (exists) {
        showToast("Already in your favorites!");
        return;
    }

    wishlist.push(property);
    saveStored("pf_wishlist", wishlist);
    showToast("Added to favorites!");
    updateFavoriteButtons();
}

function removeFavorite(id) {
    wishlist = wishlist.filter(item => item.id !== Number(id));
    saveStored("pf_wishlist", wishlist);
    renderWishlist();
    updateFavoriteButtons();
    showToast("Removed from favorites.");
}

function updateFavoriteButtons() {
    document.querySelectorAll(".favorite-property").forEach(button => {
        const id = Number(button.dataset.id);
        const isFavorite = wishlist.some(item => item.id === id);

        button.textContent = isFavorite
            ? "♥ Added to Favorites"
            : "♡ Add to Favorites";
    });
}

document.querySelectorAll(".favorite-property").forEach(button => {
    button.addEventListener("click", function () {
        addFavorite(this.dataset.id);
    });
});

const wishlistGrid = document.getElementById("wishlistGrid");
const sortProducts = document.getElementById("sortProducts");

function renderWishlist() {
    if (!wishlistGrid) return;

    wishlistGrid.innerHTML = "";

    const count = document.getElementById("wishlistCount");
    if (count) count.textContent = wishlist.length;

    let items = [...wishlist];
    const sort = sortProducts ? sortProducts.value : "default";

    if (sort === "low") {
        items.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        items.sort((a, b) => b.price - a.price);
    } else {
        items.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    }

    if (items.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="empty-state">
                <h3>♡ Your favorites list is empty</h3>
                <p>Go to the home page and save a property you like.</p>
                <a class="view-all" href="index.html">Explore Properties →</a>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "property-card";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "card-content";

        const type = document.createElement("p");
        type.className = "property-type";
        type.textContent = item.type;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const location = document.createElement("p");
        location.className = "location";
        location.textContent = "📍 " + item.location;

        const info = document.createElement("div");
        info.className = "property-info";
        info.innerHTML = `
            <span>🛏 ${item.beds} Beds</span>
            <span>🚿 ${item.baths} Baths</span>
        `;

        const price = document.createElement("h4");
        price.textContent = formatPrice(item.price);

        const removeButton = document.createElement("button");
        removeButton.className = "favorite-property";
        removeButton.textContent = "♥ Remove from Favorites";

        removeButton.addEventListener("click", () => {
            removeFavorite(item.id);
        });

        content.append(type, title, location, info, price, removeButton);
        card.append(image, content);
        wishlistGrid.appendChild(card);
    });
}

if (sortProducts) {
    sortProducts.addEventListener("change", renderWishlist);
}

renderWishlist();
updateFavoriteButtons();
