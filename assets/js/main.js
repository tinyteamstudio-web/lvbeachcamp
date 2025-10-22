/* =======================================================
   LV Beach Camp — Main Script
   Functions:
   1. Populate featured stays from data/listings.json
   2. Mobile navigation toggle
   3. Auto-update footer year
   ======================================================= */

// Helper function to format PHP-like prices
function formatPrice(value) {
  return value ? `₱${value.toLocaleString()}` : "Contact";
}

// Load listing data
async function getListings() {
  try {
    const res = await fetch("data/listings.json");
    if (!res.ok) throw new Error("Failed to load listings.json");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching listings:", err);
    return [];
  }
}

// Populate Featured Stays on Home Page
async function populateFeatured() {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return; // Skip if not on index.html

  const listings = await getListings();
  featuredGrid.innerHTML = "";

  // Take only first 3 listings
  listings.slice(0, 3).forEach((listing) => {
    const card = document.createElement("div");
    card.classList.add("listing-card");
    card.innerHTML = `
      <img src="${listing.images[0] || 'assets/images/room-placeholder.jpg'}" alt="${listing.name}">
      <h3>${listing.name}</h3>
      <p>${listing.short}</p>
      <div class="listing-meta">
        <span>${listing.capacity} pax</span>
        <span>${formatPrice(listing.price)}</span>
      </div>
      <div class="center" style="margin-top:10px;">
        <a href="booking.html" class="btn">Book Now</a>
      </div>
    `;
    featuredGrid.appendChild(card);
  });
}

// Mobile Navigation Toggle
function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      navLinks.style.flexDirection = "column";
    });
  }
}

// Auto Year Update
function updateYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  populateFeatured();
  setupMobileNav();
  updateYear();
});
