/* ============================================================
   CINESCORE MASTER ENGINE v5.0 (OPTIMIZED & SAFE)
   ============================================================ */

// 1. THE GLOBAL DOM CACHE — populated inside DOMContentLoaded so elements exist
const CineDOM = {
    loader: null,
    authModal: null,
    blankState: null,
    resultsView: null,
    backBtn: null,
    mainSearch: null,
    contentSlider: null
};

// 2. THE GLOBAL STATE MACHINE
window.CineState = {
    isLoggedIn: localStorage.getItem('cs_logged_in') === 'true',
    activeTheme: localStorage.getItem('cs_theme') || 'dark',
    currentView: 'SEARCH' // 'SEARCH' or 'RESULTS'
};

// 3. MASTER AUTH CONTROLLER (Fixes silent fails)
window.openAuthModal = () => { if (CineDOM.authModal) CineDOM.authModal.style.display = 'flex'; };
window.closeAuthModal = () => { if (CineDOM.authModal) CineDOM.authModal.style.display = 'none'; };

// 4. POSTER FALLBACK ENGINE (Global Image Error Handling)
document.addEventListener('error', (e) => {
    if (e.target.tagName?.toLowerCase() === 'img' && !e.target.dataset.fallbackApplied) {
        e.target.dataset.fallbackApplied = "true";
        e.target.src = 'https://placehold.co/600x900/0B192C/FFFFFF?text=Poster+Unavailable';
    }
}, true);

// ============================================================
// 5. MASTER INITIALIZER (The Central Brain)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Populate DOM cache NOW that the DOM is ready
    CineDOM.loader       = document.getElementById('global-page-loader');
    CineDOM.authModal    = document.getElementById('signupModal');
    CineDOM.blankState   = document.getElementById('blank-slate-view');
    CineDOM.resultsView  = document.getElementById('prediction-results-view');
    CineDOM.backBtn      = document.getElementById('back-to-lab');
    CineDOM.mainSearch   = document.getElementById('default-view-search-input') || document.querySelector('.search-input');
    CineDOM.contentSlider = document.querySelector('.content-slider');

    // Wake up Core Systems
    initLoaderSystem();
    if (typeof initThemeEngine === 'function') initThemeEngine();
    if (typeof initAuthLogic === 'function') initAuthLogic();
    if (typeof initGlobalInteractions === 'function') initGlobalInteractions();

    // Wake up Page-Specific Logic (Prediction page only)
    if (CineDOM.resultsView) {
        if (typeof initAlgorithmEngine === 'function') initAlgorithmEngine(); // routing state
        if (typeof initSliderMathEngine === 'function') initSliderMathEngine(); // slider rendering
        if (typeof initShowdownSearch === 'function') initShowdownSearch();
        initNavigationFeatures(); // Shortcuts & Scroll FAB
    }
});

// ============================================================
// 6. NAVIGATION & SHORTCUTS (Feature Injection)
// ============================================================
function initNavigationFeatures() {
    // Keyboard Shortcut (/) to focus search instantly
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            
            // Intelligently find the active/visible search bar
            const possibleSearches = [
                document.getElementById('hero-search-input'),      // Prediction Result page
                document.getElementById('default-view-search-input'), // Prediction Hub page
                document.querySelector('.search-input')              // Dashboard generic search
            ];
            
            for (let input of possibleSearches) {
                if (input && input.offsetParent !== null) { // OffsetParent is null if display is none
                    input.focus();
                    break;
                }
            }
        }
    });

    // Scroll to Top Floating Action Button
    const fab = document.createElement('button');
    fab.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    fab.style.cssText = "position:fixed; bottom:30px; right:30px; width:45px; height:45px; border-radius:50%; background:var(--color-accent); color:white; border:none; cursor:pointer; display:none; z-index:999; box-shadow:0 5px 15px rgba(0,0,0,0.3); transition: 0.3s;";
    document.body.appendChild(fab);

    window.addEventListener('scroll', () => {
        fab.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    fab.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Share Snapshot / Copy Link Feature
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            try {
                // If there's an active movie, mock a deep link (for future backend)
                const activeMovie = sessionStorage.getItem('cineScore_activePrediction');
                let urlToCopy = window.location.href;
                if (activeMovie && !urlToCopy.includes('?movie=')) {
                    // Strip existing hashes and mock a beautiful share link
                    urlToCopy = urlToCopy.split('#')[0] + "?movie=" + encodeURIComponent(activeMovie);
                }

                await navigator.clipboard.writeText(urlToCopy);
                
                const originalHTML = shareBtn.innerHTML;
                shareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Link Copied!';
                shareBtn.style.color = 'var(--color-success)';
                
                setTimeout(() => {
                    shareBtn.innerHTML = originalHTML;
                    shareBtn.style.color = '';
                }, 2500);
            } catch (err) {
                console.error('Failed to copy link: ', err);
            }
        });
    }
}

// ============================================================
// 7. THE LOADER ENGINE (Safely Encapsulated)
// ============================================================
let minLoadTimePassed = false;
let isPageLoaded = false;
let loaderInterval;

function initLoaderSystem() {
    const textEl = document.getElementById('cinematic-loader-text');
    const f1 = document.getElementById('frame-1');
    const f2 = document.getElementById('frame-2');

    if (f1 && f2 && textEl) {
        const hasSeenIntro = sessionStorage.getItem('cinescore_intro_played');

        if (!hasSeenIntro) {
            // TIER 1: First Visit
            sessionStorage.setItem('cinescore_intro_played', 'true');
            f1.style.display = 'flex';
            textEl.textContent = "Action!";
            let isClapper = false;

            loaderInterval = setInterval(() => {
                if (isClapper) {
                    f2.style.display = 'none';
                    f1.style.display = 'flex';
                    textEl.textContent = "Action!";
                } else {
                    f1.style.display = 'none';
                    f2.style.display = 'flex';
                    textEl.textContent = "Rolling Camera!";
                }
                isClapper = !isClapper;
            }, 1200);

            setTimeout(() => { minLoadTimePassed = true; checkDismissLoader(); }, 2400);
        } else {
            // TIER 2: Fast Navigation
            f2.style.display = 'flex';
            textEl.textContent = "Loading...";
            setTimeout(() => { minLoadTimePassed = true; checkDismissLoader(); }, 350);
        }
    } else {
        minLoadTimePassed = true;
    }

    window.addEventListener('load', () => {
        isPageLoaded = true;
        checkDismissLoader();
    });
}

function checkDismissLoader() {
    if (isPageLoaded && minLoadTimePassed) {
        const globalLoader = document.getElementById('global-page-loader');
        if (globalLoader) {
            if (loaderInterval) clearInterval(loaderInterval);
            globalLoader.classList.add('hidden');
        }
    }
}


// ============================================================
// 8. HELPER ENGINES & GLOBAL UI (Theme, Sliders, Formatting)
// ============================================================

/* --------------------------------------------------------
   1. GLOBAL UTILITIES (Theme & Modals)
   -------------------------------------------------------- */
function initThemeEngine() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const navLogo = document.getElementById('nav-logo');
    const footerLogo = document.getElementById('footer-logo');
    const sidebarLogo = document.getElementById('sidebar-logo');

    function updateLogos(theme) {
        const mainlogoPath = theme === 'dark' ? 'Assets/CineScore-Dark.png' : 'Assets/CineScore-Light.png';
        if (navLogo) navLogo.src = mainlogoPath;
        if (footerLogo) footerLogo.src = mainlogoPath;

        const dashboardLogoPath = theme === 'dark' ? 'Assets/CineScore-Light.png' : 'Assets/CineScore-Dark.png';
        if (sidebarLogo) sidebarLogo.src = dashboardLogoPath;
    }

    // Initialize state on load
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateLogos(currentTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            // STRICT DELEGATION: We only set the attribute. CSS does the animation.
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateLogos(newTheme);

            // Redraw charts instantly if on prediction page
            const activeMovie = JSON.parse(localStorage.getItem('cinescore_active_movie_data'));
            if (activeMovie && typeof window.renderDynamicCharts === 'function') {
                let currentScenario = 'base';
                const activeScenarioBtn = document.querySelector('.scenario-btn.active');
                if (activeScenarioBtn) {
                    if (activeScenarioBtn.classList.contains('bull')) currentScenario = 'bull';
                    if (activeScenarioBtn.classList.contains('bear')) currentScenario = 'bear';
                }
                window.renderDynamicCharts(activeMovie, currentScenario);
            }
        });
    }
}

function initGlobalInteractions() {
    initCinematicSliders(); // Start ambient background

    // Escape Key logic for Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (CineDOM.authModal) CineDOM.authModal.style.display = 'none';
        }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('user-menu-wrapper');
        const trigger = document.getElementById('user-profile-trigger');
        if (navMenu && trigger && !navMenu.contains(e.target) && !trigger.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

function initAuthLogic() {
    // Placeholder for future explicit auth bindings.
    // Currently handled cleanly by window.openAuthModal in DOM.
}

function initCinematicSliders() {
    const sliders = document.querySelectorAll('.cinematic-slider');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('img');
        if (slides.length <= 1) return;
        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 3000);
    });
}

function formatLargeNumber(num) {
    if (num === null || num === undefined) return '';
    if (typeof num === 'string' && (num.includes('M') || num.includes('K'))) return num;
    let val = parseFloat(num);
    if (isNaN(val)) return num;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val % 1 !== 0 ? val.toFixed(1) + 'M' : val.toString();
}

// ============================================================
// 9. THE ULTIMATE VIEW CONTROLLER (True SPA Router)
// ============================================================
window.resetToBlankState = function (isBrowserBack = false) {
    const resultsView = document.getElementById('prediction-results-view');
    const blankState = document.getElementById('blank-slate-view');

    if (resultsView && blankState) {
        // 1. Swipe Out Results Overlapping
        resultsView.style.position = 'absolute';
        resultsView.style.top = '0';
        resultsView.style.zIndex = '50';
        resultsView.classList.replace('view-visible', 'view-hidden');
        
        // 2. Fade/Swipe In Blank State immediately behind it
        blankState.style.display = 'flex';
        void blankState.offsetWidth; 
        blankState.classList.replace('view-hidden', 'view-visible');

        setTimeout(() => {
            resultsView.style.display = 'none';
            resultsView.style.position = 'relative'; // restore flow
            resultsView.style.zIndex = '';
        }, 1000); // 1-second buttery smooth swipe
    }

    // 3. UI Resets
    if (CineDOM.backBtn) CineDOM.backBtn.style.display = 'none';

    const defaultSearch = document.getElementById('defaultViewSearchInput');
    if (defaultSearch) defaultSearch.value = '';

    if (CineDOM.contentSlider) CineDOM.contentSlider.style.minHeight = 'auto';

    // 4. The SPA History Manager (Clears the ?p= from URL)
    sessionStorage.removeItem('cineScore_activePrediction');
    if (!isBrowserBack) {
        window.history.pushState({ view: 'SEARCH' }, '', window.location.pathname);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================================
// 9.5. SPA BROWSER HISTORY ROUTER (Back/Forward Arrows)
// ============================================================
window.addEventListener('popstate', (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryMovie = urlParams.get('p');

    if (queryMovie) {
        // User hit Forward to a prediction
        sessionStorage.setItem('cineScore_activePrediction', queryMovie);
        if (typeof loadMovieData === 'function') loadMovieData(queryMovie, false);
    } else {
        // User hit Back to the Blank State
        resetToBlankState(true);
    }
});

// Fired by Search Bar or Posters
window.triggerPredictionState = function (movieName) {
    if (!movieName.trim()) return;

    sessionStorage.setItem('cineScore_activePrediction', movieName);

    // THE FIX: Push URL instantly so the browser knows we changed pages!
    window.history.pushState({ view: 'RESULTS', movie: movieName }, '', '?p=' + encodeURIComponent(movieName));

    const splash = document.getElementById('splash-loader');
    if (splash) splash.classList.add('active');

    setTimeout(() => {
        if (splash) splash.classList.remove('active');
        if (typeof loadMovieData === 'function') loadMovieData(movieName, true);
    }, 1800);
};

// --- MOVED TO GLOBAL SCOPE: Universal Keyboard Navigation Helper ---

function attachKeyboardNav(inputEl, dropdownEl) {
    inputEl.addEventListener('keydown', (e) => {
        if (dropdownEl.style.display === 'none') return;

        const items = dropdownEl.querySelectorAll('.search-item');
        if (items.length === 0) return;

        let activeIdx = Array.from(items).findIndex(item => item.classList.contains('active-search-item'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = Math.min(activeIdx + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = Math.max(activeIdx - 1, 0);
        } else if (e.key === 'Enter') {
            e.preventDefault(); // THE FIX: Stops the browser from submitting forms/refreshing
            if (activeIdx >= 0) {
                items[activeIdx].click();
            } else {
                items[0].click(); // Defaults to top result
            }
            return;
        } else {
            return; // Normal typing
        }

        // Apply highlight classes
        items.forEach((item, i) => {
            if (i === activeIdx) {
                item.classList.add('active-search-item');
                // Ensure the selected item scrolls into view if list is long
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove('active-search-item');
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {

    initCinematicSliders();
    // ==========================================
    // THE LIVE HYPE METER ENGINE (Daily Rotation)
    // ==========================================
    function initLiveHypeMeter() {
        const tickerTrack = document.getElementById('live-hype-track');
        if (!tickerTrack) return;

        const db = window.mockMovies || [];
        if (db.length === 0) return;

        // 1. The Daily Shuffle Math
        const today = new Date().getDate(); // Gets the day of the month (1-31)
        // Shift the array based on today's date so it changes every 24 hours
        const shiftedDb = [...db.slice(today % db.length), ...db.slice(0, today % db.length)];
        const displayMovies = shiftedDb.slice(0, 10); // Grab exactly 10 movies

        let tickerHTML = '';

        // 2. Generate the UI
        displayMovies.forEach(movie => {
            // Generate stable, realistic stats based on the movie's title length
            const hypeVal = 65 + (movie.title.length % 33); // Range: 65% to 97%

            let trendClass = 'neon-green';
            let trendIcon = 'fa-arrow-trend-up';
            let sign = '+';

            if (hypeVal < 75) {
                trendClass = 'neon-red';
                trendIcon = 'fa-arrow-trend-down';
                sign = '-';
            } else if (hypeVal < 85) {
                trendClass = 'neon-orange';
                trendIcon = 'fa-minus';
                sign = '';
            }

            const imgUrl = movie.poster || 'https://placehold.co/32x48/111/FFF?text=Film';

            tickerHTML += `
                <div class="ticker-item">
                    <img src="${imgUrl}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                    <span>${movie.title}</span>
                    <span class="hype-tag ${trendClass}"><i class="fa-solid ${trendIcon}"></i> ${sign}${hypeVal}%</span>
                </div>
            `;
        });

        // 3. The Seamless Loop Hack
        // We inject the 10 movies TWICE. Because your CSS animates to translateX(-50%), 
        // it slides exactly 10 movies over, then instantly resets, creating a flawless infinite loop!
        tickerTrack.innerHTML = tickerHTML + tickerHTML;
    }

    // Fire the engine!
    initLiveHypeMeter();
    renderPredictionGrids();


    // --- SIDEBAR TOGGLE FIX ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // --- TAB NAVIGATION ENGINE (Persistent & Context-Aware) ---

    const overviewLink = document.querySelector('a[title="Overview"]');
    const watchlistLink = document.querySelector('a[title="Watchlist"]');
    const legacyLink = document.querySelector('a[title="Legacy"]'); // NEW

    const overviewContent = document.getElementById('content-wrapper');
    const watchlistContent = document.getElementById('watchlist-section');
    const legacyContent = document.getElementById('legacy-section'); // NEW
    const accountContent = document.getElementById('account-section');

    // THE FIX: Smart URL Hash Routing
    const urlHash = window.location.hash.replace('#', '').replace('-section', '');
    if (['overview', 'watchlist', 'legacy', 'account'].includes(urlHash)) {
        window.cinescoreCurrentTab = urlHash;
        // Clean the URL so it looks neat after routing
        history.replaceState(null, null, window.location.pathname);
    } else {
        window.cinescoreCurrentTab = localStorage.getItem('cinescore_active_tab') || 'overview';
    }

    function switchTab(tabName) {
        window.cinescoreCurrentTab = tabName;
        localStorage.setItem('cinescore_active_tab', tabName);

        if (overviewLink) overviewLink.classList.toggle('active', tabName === 'overview');
        if (watchlistLink) watchlistLink.classList.toggle('active', tabName === 'watchlist');
        if (legacyLink) legacyLink.classList.toggle('active', tabName === 'legacy');

        // Hide all contents
        if (overviewContent) overviewContent.style.display = 'none';
        if (watchlistContent) watchlistContent.style.display = 'none';
        if (legacyContent) legacyContent.style.display = 'none';
        if (accountContent) accountContent.style.display = 'none';

        // Show active with animation
        let targetContent = null;
        if (tabName === 'overview') targetContent = overviewContent;
        if (tabName === 'watchlist') targetContent = watchlistContent;
        if (tabName === 'legacy') targetContent = legacyContent;
        if (tabName === 'account') targetContent = accountContent;

        if (targetContent) {
            targetContent.style.display = tabName === 'overview' ? 'flex' : 'block';
            targetContent.style.animation = 'none';
            targetContent.offsetHeight;
            targetContent.style.animation = 'swipeIn 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        // THE FIX: Dynamic Header Title
        const headerTabName = document.getElementById('header-tab-name');
        if (headerTabName) {
            headerTabName.textContent = tabName === 'account' ? 'Account Settings' : tabName.charAt(0).toUpperCase() + tabName.slice(1);
        }

        // THE FIX: Keep Search Bar on Legacy Tab, preserve user queries!
        const searchWrapper = document.querySelector('.search-wrapper');
        const hubSearch = document.getElementById('hub-search');

        if (searchWrapper && hubSearch) {
            if (tabName === 'account') {
                searchWrapper.style.display = 'none';
            } else {
                searchWrapper.style.display = 'flex';
                if (tabName === 'legacy') {
                    hubSearch.placeholder = "Search legacy nominations...";
                } else {
                    hubSearch.placeholder = tabName === 'overview' ? "Search to Add to Tracker" : "Search to Add to Watchlist";
                }
                // We INTENTIONALLY don't clear hubSearch.value here to answer the user's UX question:
                // Global filters across tabs are an excellent design pattern.
                if (hubSearch.value.trim().length > 0) {
                    setTimeout(() => hubSearch.dispatchEvent(new Event('input')), 50);
                }
            }
        }
    }

    if (overviewLink) overviewLink.addEventListener('click', (e) => { e.preventDefault(); switchTab('overview'); });
    if (watchlistLink) watchlistLink.addEventListener('click', (e) => { e.preventDefault(); switchTab('watchlist'); });
    if (legacyLink) legacyLink.addEventListener('click', (e) => { e.preventDefault(); switchTab('legacy'); });

    // Edit Profile Button Wiring
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const settingsMenu = document.getElementById('settings-menu');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('account');
            if (settingsMenu) settingsMenu.classList.add('hidden'); // Close the menu
        });
    }

    switchTab(window.cinescoreCurrentTab);

    // --- CUSTOM SYSTEM ALERT UI CONTROLLER ---

    window.showCustomAlert = function (type, title, message) {
        const modal = document.getElementById('customAlertModal');
        const iconContainer = document.getElementById('alert-icon-container');
        const titleEl = document.getElementById('alert-title');
        const msgEl = document.getElementById('alert-message');
        const actionsEl = document.getElementById('alert-actions');

        if (!modal) return;

        titleEl.textContent = title;
        msgEl.innerHTML = message;

        if (type === 'premium') {
            iconContainer.innerHTML = '<i class="fa-solid fa-crown" style="color: var(--color-warning); filter: drop-shadow(0 0 15px rgba(255, 159, 28, 0.4));"></i>';
            actionsEl.innerHTML = `
                <button class="nav-button-primary" style="background: var(--color-warning); color: #000; padding: 12px 24px; border-radius: 100px; border: none; font-weight: 700; cursor: pointer;" onclick="triggerPaywallExplanation()">Upgrade to Pro</button>
                <button style="background: transparent; color: var(--color-secondary); border: none; cursor: pointer; font-weight: 600;" onclick="closeCustomAlert(true)">Maybe Later</button>
            `;
        } else if (type === 'paywall') {
            // THE FIX: Developer/System Icon instead of a Success Checkmark
            iconContainer.innerHTML = '<i class="fa-solid fa-envelope-open-text" style="color: var(--color-accent); filter: drop-shadow(0 0 15px rgba(0, 85, 255, 0.4));"></i>';
            actionsEl.innerHTML = `<button class="nav-button-primary" style="padding: 10px 32px; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; background: var(--color-accent); color: #fff;" onclick="closeCustomAlert(false)">Understood!</button>`;
        }

        else if (type === 'error') {

            iconContainer.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color: var(--color-danger); filter: drop-shadow(0 0 15px rgba(213, 0, 0, 0.4));"></i>';
            actionsEl.innerHTML = `<button class="nav-button-primary" style="padding: 10px 32px; border-radius: 100px; border: none; font-weight: 600; cursor: pointer;" onclick="closeCustomAlert(false)">Got it</button>`;

        } else if (type === 'success') {

            // THE FIX: Added Success UI with a working Close Button!
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--color-success); filter: drop-shadow(0 0 15px rgba(0, 200, 83, 0.4));"></i>';
            actionsEl.innerHTML = `<button class="nav-button-primary" style="padding: 10px 32px; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; background: var(--color-success); color: #fff;" onclick="closeCustomAlert(false)">Awesome</button>`;
        } else if (type === 'bot') {
            // THE FIX: Brand new Bot Modal UI!
            iconContainer.innerHTML = '<i class="fa-solid fa-user-astronaut" style="color: var(--color-accent); filter: drop-shadow(0 0 15px rgba(0, 85, 255, 0.4));"></i>';
            actionsEl.innerHTML = `<button class="nav-button-primary" style="padding: 10px 32px; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; background: var(--color-accent); color: #fff;" onclick="closeCustomAlert(false)">Got it, I'll wait!</button>`;
        }

        modal.style.display = 'flex';
    };


    // THE FIX: Click outside to close the custom alert
    const customAlertModalEl = document.getElementById('customAlertModal');
    if (customAlertModalEl) {
        customAlertModalEl.addEventListener('click', (e) => {
            if (e.target === customAlertModalEl) closeCustomAlert();
        });
    }

    // Modified to optionally close the parent Add Movie Modal too!
    window.closeCustomAlert = function (closeParent = false) {
        const modal = document.getElementById('customAlertModal');
        if (modal) modal.style.display = 'none';

        if (closeParent) {
            const addModal = document.getElementById('addMovieModal');
            if (addModal) addModal.style.display = 'none';
        }
    };

    // THE FIX: The Honesty Protocol (Simulated Paywall)
    window.triggerPaywallExplanation = function () {
        closeCustomAlert(); // Close the premium modal first

        setTimeout(() => {
            showCustomAlert(
                'paywall',
                'Simulated Paywall',
                `<strong> Greetings from the Founder! 👋🏻</strong><br><br>
                CineScore is a comprehensive portfolio project designed to showcase scalable frontend architecture, UI/UX design, and SaaS business logic.<br><br>
                "Pro" features are simulated to demonstrate monetization potential. <span style = "color: var(--color-primary);"> No REAL Payment Gateway </span> is attached. No Money of any sort is charged from the Users. Enjoy the platform freely!`
            );

            // Swap the 'Awesome' button to something more fitting
            setTimeout(() => {
                const actionsEl = document.getElementById('alert-actions');
                if (actionsEl) {
                    actionsEl.innerHTML = `<button class="nav-button-primary" style="padding: 10px 32px; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; background: var(--color-accent); color: #fff;" onclick="closeCustomAlert(false)">Understood!</button>`;
                }
            }, 10);

        }, 300); // Slight delay for a smooth transition
    };


    // --- SIDEBAR AVATAR FIX ---
    const hubSettingsBtn = document.getElementById('settings-btn');
    const hubSettingsMenu = document.getElementById('settings-menu');
    if (hubSettingsBtn && hubSettingsMenu) {
        hubSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hubSettingsMenu.classList.toggle('hidden');
        });
        window.addEventListener('click', (e) => {
            if (!hubSettingsMenu.contains(e.target)) hubSettingsMenu.classList.add('hidden');
        });
    }

    /* -----------------------------------------------------
       1.5 AUTHENTICATION STATE MANAGER (UPGRADED)
       -------------------------------------------------------- */
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu-wrapper');
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const avatarDropdown = document.getElementById('avatar-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    function updateAuthState() {
        const isLoggedIn = localStorage.getItem('cinescore_auth') === 'true';
        // THE FIX: Simulated Pro Status (Change to 'true' in console to test)
        const isPro = localStorage.getItem('cinescore_pro') === 'true';

        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu-wrapper');
        const drawerToggleBtn = document.getElementById('drawer-toggle-btn');

        const upgradeBtn = document.getElementById('nav-upgrade-btn');
        const userAvatar = document.getElementById('user-avatar-btn');
        const hoverProBadge = document.getElementById('hover-pro-badge');

        if (isLoggedIn) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (drawerToggleBtn) drawerToggleBtn.style.display = 'flex';

            // --- PRO USER UI LOGIC ---
            if (isPro) {
                if (upgradeBtn) {
                    upgradeBtn.innerHTML = '<i class="fa-solid fa-star"></i> Pro User';
                    upgradeBtn.style.background = 'rgba(255, 159, 28, 0.1)';
                    upgradeBtn.style.color = 'var(--color-warning)';
                    upgradeBtn.style.border = '1px solid rgba(255, 159, 28, 0.3)';
                    upgradeBtn.onclick = null; // Remove paywall popup
                    upgradeBtn.style.cursor = 'default';
                }
                if (userAvatar) userAvatar.classList.add('pro-avatar-glow');
                if (hoverProBadge) hoverProBadge.style.display = 'block';
            } else {
                if (upgradeBtn) {
                    // Sleek Google-style Upgrade button
                    upgradeBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Upgrade';
                    upgradeBtn.className = 'small nav-button-primary';
                    upgradeBtn.style.background = '';
                    upgradeBtn.style.color = '';
                    upgradeBtn.style.border = '';
                    upgradeBtn.onclick = triggerPaywallExplanation;
                    upgradeBtn.style.cursor = 'pointer';
                }
                if (userAvatar) userAvatar.classList.remove('pro-avatar-glow');
                if (hoverProBadge) hoverProBadge.style.display = 'none';
            }

            // --- INJECT USER DATA ---
            const savedName = localStorage.getItem('cinescore_user_name');
            const savedHandle = localStorage.getItem('cinescore_user_handle');

            if (savedName) {
                document.querySelectorAll('.profile-name-display').forEach(el => el.textContent = savedName);
                const acctNameInput = document.getElementById('account-name-input');
                if (acctNameInput) acctNameInput.value = savedName;

                document.querySelectorAll('.user-avatar').forEach(el => {
                    if (el.tagName === 'IMG') el.src = `https://placehold.co/100x100/0055FF/FFFFFF?text=${savedName.charAt(0).toUpperCase()}`;
                });
            }
            if (savedHandle) {
                document.querySelectorAll('.profile-handle-display').forEach(el => el.textContent = savedHandle);
                const acctHandleInput = document.getElementById('account-handle-input');
                if (acctHandleInput) acctHandleInput.value = savedHandle.replace('@', '');
            }
        } else {
            // --- LOGGED OUT STATE ---
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (drawerToggleBtn) drawerToggleBtn.style.display = 'none';

            // Security Redirect
            if (window.location.pathname.toLowerCase().includes('hub.html')) {
                window.location.href = 'index.html';
            }
        }
    }

    updateAuthState(); // Initialize on load

    // ==========================================
    // BULLETPROOF AVATAR HOVER & CLICK ENGINE
    // ==========================================
    const avatarContainer = document.querySelector('.avatar-container');
    const hoverCard = document.querySelector('.avatar-hover-card');

    if (avatarContainer && hoverCard) {
        // 1. Mouse enters ONLY the Avatar Container
        avatarContainer.addEventListener('mouseenter', () => {
            if (userMenu && !userMenu.classList.contains('active')) {
                hoverCard.classList.add('show-hover');
            }
        });

        // 2. Mouse leaves the Avatar Container
        avatarContainer.addEventListener('mouseleave', () => {
            hoverCard.classList.remove('show-hover');
        });
    }

    if (userAvatarBtn) {
        // 3. User Clicks the Avatar
        userAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
            if (hoverCard) hoverCard.classList.remove('show-hover'); // Force close hover
        });
    }

    window.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target)) userMenu.classList.remove('active');
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('cinescore_auth', 'false');
            sessionStorage.removeItem('cineScore_activePrediction');
            localStorage.removeItem('cinescore_active_movie_data');
            updateAuthState();
            window.location.href = 'Prediction.html';
        });
    }

    window.requireAuth = function (callback) {
        if (localStorage.getItem('cinescore_auth') === 'true') { callback(); }
        else { if (signupModal) signupModal.style.display = 'flex'; }
    };


    /* --------------------------------------------------------
        2. LOGIN, SIGNUP & RESET MODALS (SMART STATE ENGINE)
        -------------------------------------------------------- */
    const loginBtn = document.getElementById('nav-login-btn');
    const signupBtn = document.getElementById('nav-signup-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const resetModal = document.getElementById('resetModal');
    const closeButtons = document.querySelectorAll('.close');

    // NEW: Persistent Global State for Email
    let globalSavedEmail = '';

    // THE HYBRID ENGINE: Switches modals, wipes passwords, but carries over the email
    function switchModal(targetModal) {

        // 1. Capture email from whichever modal is currently open (if it has one)
        const visibleModal = [loginModal, signupModal, resetModal].find(m => m && m.style.display === 'flex');
        if (visibleModal) {
            const emailInput = visibleModal.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() !== '') {
                globalSavedEmail = emailInput.value.trim(); // Update the persistent memory
            }
        }

        // 2. Hide all modals and completely reset all forms (wipes passwords & errors)
        if (loginModal) loginModal.style.display = 'none';
        if (signupModal) signupModal.style.display = 'none';
        if (resetModal) resetModal.style.display = 'none';

        ['loginForm', 'signupForm', 'resetForm'].forEach(id => {
            const form = document.getElementById(id);
            if (form) {
                form.reset();
                const error = form.querySelector('.error');
                if (error) error.textContent = '';
            }
        });

        // 3. Open the target modal and inject the persistent email
        if (targetModal) {
            targetModal.style.display = 'flex';
            if (globalSavedEmail !== '') {
                const targetEmailInput = targetModal.querySelector('input[type="email"]');
                if (targetEmailInput) targetEmailInput.value = globalSavedEmail;
            }
        }
    }

    // THE HARD WIPE: User abandoned the flow. Destroy all data.
    function hardCloseModals() {
        globalSavedEmail = ''; // Nuke the persistent memory

        if (loginModal) loginModal.style.display = 'none';
        if (signupModal) signupModal.style.display = 'none';
        if (resetModal) resetModal.style.display = 'none';

        ['loginForm', 'signupForm', 'resetForm'].forEach(id => {
            const form = document.getElementById(id);
            if (form) {
                form.reset();
                const error = form.querySelector('.error');
                if (error) error.textContent = '';
            }
        });
    }

    // -- Open Modals from Navbar --

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchModal(loginModal);
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchModal(signupModal);
        });
    }

    // -- Switch Modals from Text Links --
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const forgotPasswordLink = document.querySelector('a[href="#"].small'); // Selects "Forgot password?"
    const backToLoginLink = document.getElementById('back-to-login');

    if (switchToSignup) switchToSignup.addEventListener('click', (e) => { e.preventDefault(); switchModal(signupModal); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); switchModal(loginModal); });
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); switchModal(resetModal); });
    if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchModal(loginModal); });

    // -- Hard Close Triggers --
    if (closeButtons) {
        closeButtons.forEach(btn => btn.addEventListener('click', hardCloseModals));
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === signupModal || e.target === resetModal) {
            hardCloseModals();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hardCloseModals();
    });

    /* --------------------------------------------------------
       2.5 UNIVERSAL FORM ENGINE: Validation & Keyboard Nav
       -------------------------------------------------------- */

    // 1. Universal Keyboard Navigation for ALL Forms
    document.querySelectorAll('form').forEach(form => {
        const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));

        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (index < inputs.length - 1) inputs[index + 1].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index > 0) inputs[index - 1].focus();
                } else if (e.key === 'Enter' && input.tagName !== 'BUTTON') {
                    e.preventDefault();
                    if (index < inputs.length - 2) {
                        inputs[index + 1].focus();
                    } else {
                        inputs[inputs.length - 1].click();
                    }
                }
            });
        });
    });

    // 2. Strict Form Validation
    function handleFormValidation(e) {
        e.preventDefault();
        const submittedForm = e.target;
        const submitBtn = submittedForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        let errorDisplay = submittedForm.querySelector('.form-error');
        if (errorDisplay) {
            errorDisplay.textContent = '';
            errorDisplay.style.color = 'var(--color-danger)';
        }

        // --- ONBOARDING FORM STRICT VALIDATION ---
        if (submittedForm.id === 'onboardingForm') {
            // THE FIX: Smart detection for either Full Name or First/Last Name HTML setups
            const fnameInput = document.getElementById('ob-fname');
            const lnameInput = document.getElementById('ob-lname');
            const nameInput = document.getElementById('ob-name');
            const handleInput = document.getElementById('ob-handle');

            let fullName = '';
            if (fnameInput && lnameInput) {

                if (!fnameInput.value.trim() || !lnameInput.value.trim()) {
                    alert("Please fill out your First and Last Name.");
                    return;
                }

                fullName = `${fnameInput.value.trim()} ${lnameInput.value.trim()}`;

            } else if (nameInput) {

                if (!nameInput.value.trim()) {
                    alert("Please fill out your Name."); return;

                }
                fullName = nameInput.value.trim();

            }

            const handleVal = handleInput ? handleInput.value.trim() : '';
            if (!handleVal) { alert("Please provide a Director Handle."); return; }

            // THE FIX: Dynamic Text
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Profile...';
            submitBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                localStorage.setItem('cinescore_user_name', fullName);
                localStorage.setItem('cinescore_user_handle', handleVal.startsWith('@') ? handleVal : '@' + handleVal);
                localStorage.setItem('cinescore_auth', 'true');
                window.location.reload();
            }, 1200);
            return;
        }

        // --- STANDARD LOGIN/SIGNUP STRICT VALIDATION ---
        const emailInput = submittedForm.querySelector('input[type="email"]');
        const passInput = submittedForm.querySelector('input[type="password"]');

        if (emailInput && !emailInput.value.includes('@')) {
            if (errorDisplay) errorDisplay.textContent = 'Please enter a valid email address.';
            return;
        }

        if (passInput && passInput.value.length < 8) {
            if (errorDisplay) errorDisplay.textContent = 'Password must be at least 8 characters.';
            return;
        }

        // THE FIX: Custom Success Texts & Dynamic Button States
        if (submittedForm.id === 'loginForm') {
            if (errorDisplay) { errorDisplay.textContent = 'Credentials matched.'; errorDisplay.style.color = 'var(--color-success)'; }
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging you in...';
        } else if (submittedForm.id === 'signupForm') {
            if (errorDisplay) { errorDisplay.textContent = 'Submission successful.'; errorDisplay.style.color = 'var(--color-success)'; }
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
        } else {
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
        }

        submitBtn.style.pointerEvents = 'none';

        // Intercept Flow
        setTimeout(() => {
            if (submittedForm.id === 'signupForm' || submittedForm.closest('#signupModal')) {
                if (typeof hardCloseModals === 'function') hardCloseModals();
                const obModal = document.getElementById('onboardingModal');
                if (obModal) {
                    obModal.style.display = 'flex';
                    // THE FIX: Auto-focus the first input of onboarding modal
                    const firstObInput = obModal.querySelector('input');
                    if (firstObInput) setTimeout(() => firstObInput.focus(), 100);
                }
                submitBtn.innerHTML = originalText;
                submitBtn.style.pointerEvents = 'auto';
            } else {
                localStorage.setItem('cinescore_auth', 'true');
                window.location.reload();
            }
        }, 1200);
    }

    document.querySelectorAll('form').forEach(form => form.addEventListener('submit', handleFormValidation));

    if (localStorage.getItem('cinescore_onboarding_pending') === 'true') {
        const obModal = document.getElementById('onboardingModal');
        if (obModal) {
            obModal.style.display = 'flex';
            const firstObInput = obModal.querySelector('input');
            if (firstObInput) setTimeout(() => firstObInput.focus(), 100);
        }
        localStorage.removeItem('cinescore_onboarding_pending');
    }

    /* --------------------------------------------------------
       UX: GLOBAL MODAL AUTO-FOCUS
       -------------------------------------------------------- */
    document.addEventListener('click', (e) => {
        const isLoginClick = e.target.closest('#nav-login-btn') || e.target.closest('#switch-to-login') || e.target.closest('#back-to-login');
        const isSignupClick = e.target.closest('#nav-signup-btn') || e.target.closest('#switch-to-signup') || e.target.closest('#pre-footer-signup-btn');

        if (isLoginClick) {
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal && loginModal.style.display === 'flex') {
                    const emailInput = loginModal.querySelector('input[type="email"]');
                    if (emailInput && !emailInput.value) emailInput.focus();
                    else if (loginModal.querySelector('input[type="password"]')) loginModal.querySelector('input[type="password"]').focus();
                }
            }, 50);
        } else if (isSignupClick) {
            setTimeout(() => {
                const signupModal = document.getElementById('signupModal');
                if (signupModal && signupModal.style.display === 'flex') {
                    const emailInput = signupModal.querySelector('input[type="email"]');
                    if (emailInput && !emailInput.value) emailInput.focus();
                    else if (signupModal.querySelector('input[type="password"]')) signupModal.querySelector('input[type="password"]').focus();
                }
            }, 50);
        }
    });

    /* --------------------------------------------------------
       2. UNIVERSAL SEARCH ENGINE (Bulletproof)
       -------------------------------------------------------- */
    const executePredictionBridge = (movieName) => {
        if (!movieName) return;

        const db = window.mockMovies || [];
        const match = db.find(m => m.title.toLowerCase().includes(movieName.toLowerCase()));

        if (match) {
            // Save their requested movie
            localStorage.setItem('cinescore_active_movie_data', JSON.stringify(match));

            // THE FIX: Tell the session storage a search is active!
            sessionStorage.setItem('cineScore_activePrediction', match.title);

            const splashLoader = document.getElementById('splash-loader');
            if (splashLoader) splashLoader.style.display = 'flex';

            // Redirect to Prediction page (where Auth state will dictate what they actually see)
            setTimeout(() => { window.location.href = 'Prediction.html'; }, 2000);
        } else {
            showCustomAlert('error', 'Movie Not Found', "We couldn't find that movie in our database. Try searching for 'Spider-man', 'Avengers', or 'Batman'.");
        }
    };

    // --- HOME PAGE SEARCH ---
    const heroInput = document.getElementById('hero-search');
    const heroBtn = document.getElementById('hero-predict-btn');
    const heroClearBtn = document.getElementById('hero-search-clear');

    if (heroInput && heroBtn) {
        // Dynamically create the dropdown if it is missing from the HTML
        let heroDropdown = document.getElementById('search-dropdown');
        if (!heroDropdown) {
            heroDropdown = document.createElement('ul');
            heroDropdown.id = 'search-dropdown';
            heroDropdown.className = 'search-dropdown-menu';

            // Ensure the input's parent wrapper can anchor the floating dropdown
            heroInput.parentElement.style.position = 'relative';
            heroInput.parentElement.appendChild(heroDropdown);
        }

        heroInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const db = window.mockMovies || [];
            heroDropdown.innerHTML = '';

            // NEW: Show 'X' if there is text, hide if empty
            if (heroClearBtn) {
                heroClearBtn.style.display = query.length > 0 ? 'block' : 'none';
            }

            // NEW: Clear Button Click Action
            if (heroClearBtn) {
                heroClearBtn.addEventListener('click', () => {
                    heroInput.value = '';
                    heroClearBtn.style.display = 'none';
                    heroDropdown.style.display = 'none';
                    heroInput.focus(); // Keeps the cursor active in the search bar
                });
            }

            if (query.length === 0) {
                heroDropdown.style.display = 'none';
                return;
            }

            const filtered = db.filter(m => m.title.toLowerCase().includes(query));

            if (filtered.length > 0) {
                heroDropdown.style.display = 'block';
                filtered.forEach(movie => {
                    const li = document.createElement('li');
                    li.className = 'search-item';
                    // Ensure the <li> itself acts as a flex container
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';

                    li.innerHTML = `
                          <div style="display: flex; align-items: center; gap: 12px; flex: 1; overflow: hidden;">
                            <img src="${movie.poster}" class="search-poster" alt="poster" style="flex-shrink: 0; width: 36px; height: 54px; object-fit: cover; border-radius: 4px;">
        
                          <div class="search-info" style="min-width: 0; flex: 1;">
                           <h4 class="search-title" style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${movie.title}</h4>
                            <p class="search-meta" style="margin: 0; font-size: 11px; color: var(--color-secondary);">${movie.year} • ${movie.studio}</p>
                        </div>
                         </div>

                       <i class="fa-solid fa-magnifying-glass-arrow-right search-right-icon" style="margin-left: auto; flex-shrink: 0;"></i>
                            `;

                    li.addEventListener('click', () => {
                        heroInput.value = movie.title;
                        heroDropdown.style.display = 'none';
                        executePredictionBridge(movie.title);
                    });
                    heroDropdown.appendChild(li);
                });
            } else {
                heroDropdown.style.display = 'block';
                heroDropdown.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--color-tertiary); cursor: default; font-size: 14px;">Movie not found in database.</li>';
            }
        });

        attachKeyboardNav(heroInput, heroDropdown);

        // Hide dropdown if user clicks anywhere else on the screen
        document.addEventListener('click', (e) => {
            if (!heroInput.contains(e.target) && !heroDropdown.contains(e.target)) {
                heroDropdown.style.display = 'none';
            }
        });

        heroBtn.addEventListener('click', () => {
            if (typeof window.executePredictionBridge === 'function') {
                window.executePredictionBridge(heroInput.value.trim());
            }
        });

        heroInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (typeof window.executePredictionBridge === 'function') {
                    window.executePredictionBridge(heroInput.value.trim());
                }
            }
        });
    }

    // --- HOME PAGE: FEATURED CARDS CLICK WIRING ---
    const featuredCards = document.querySelectorAll('.featured-movie-card');
    if (featuredCards.length > 0) {
        featuredCards.forEach(card => {
            card.addEventListener('click', function () {
                // Find the title inside the clicked card
                const titleEl = this.querySelector('.movie-title-featured');
                if (titleEl) {
                    const movieTitle = titleEl.textContent.trim();
                    executePredictionBridge(movieTitle);
                }
            });
        });
    }

    // Connect Pre-footer to Modal & Sync Email
    const preFooterBtn = document.getElementById('pre-footer-signup-btn');
    const preFooterInput = document.getElementById('pre-footer-email');

    function triggerPreFooterSignup() {
        if (signupModal) {
            signupModal.style.display = 'flex'; // Open Modal
            if (preFooterInput && preFooterInput.value.trim() !== '') {
                const modalEmailInput = document.querySelector('#signupForm input[type="email"]');
                if (modalEmailInput) {
                    modalEmailInput.value = preFooterInput.value.trim();
                    const modalPassInput = document.querySelector('#signupForm input[type="password"]');
                    if (modalPassInput) modalPassInput.focus();
                }
            }
        }
    }

    if (preFooterBtn) {
        preFooterBtn.addEventListener('click', triggerPreFooterSignup);
    }

    if (preFooterInput) {
        preFooterInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stop page reload
                triggerPreFooterSignup();
            }
        });
    }

    const isLoggedIn = localStorage.getItem('cinescore_auth') === 'true';


    /* --------------------------------------------------------
       3. PREDICTION PAGE INITIALIZER & DATA INJECTION
       -------------------------------------------------------- */

    const titleElement = document.getElementById('predicted-movie-title');
    if (titleElement) {
        window.scrollTo(0, 0); // Force top on load
        // THE FIX: Safely define the auth state inside this block so it never loses scope!
        const isLoggedIn = localStorage.getItem('cinescore_auth') === 'true';
        const savedDataString = localStorage.getItem('cinescore_active_movie_data');

        if (savedDataString) {
            const activeMovie = JSON.parse(savedDataString);

            // Text Injections
            titleElement.textContent = activeMovie.title;
            if (document.getElementById('dyn-poster')) document.getElementById('dyn-poster').src = activeMovie.poster;

            if (document.getElementById('dyn-year')) document.getElementById('dyn-year').textContent = activeMovie.year;

            if (document.getElementById('dyn-director')) document.getElementById('dyn-director').textContent = activeMovie.director;

            if (document.getElementById('dyn-cast')) document.getElementById('dyn-cast').textContent = activeMovie.cast;

            if (document.getElementById('dyn-studio')) document.getElementById('dyn-studio').textContent = activeMovie.studio;

            // Dynamic Genre Pills Injection
            const genreContainer = document.getElementById('dyn-genres');
            if (genreContainer) {
                // Check if the mock data has a genres array, otherwise fallback
                const genres = activeMovie.genres || ["Action", "Blockbuster"];
                genreContainer.innerHTML = genres.map(g => `<span class="genre-pill" style="margin: 0;">${g}</span>`).join('');
            }

            // Dynamic Trending Pill Logic
            const trendingPill = document.getElementById('dyn-trending-pill');
            if (trendingPill) {
                // If isTrending is explicitly false, hide it. Otherwise, assume true for hype movies.
                if (activeMovie.isTrending === false) {
                    trendingPill.style.display = 'none';
                } else {
                    trendingPill.style.display = 'inline-flex';
                }
            }

            // Score Injections
            if (document.getElementById('dyn-ai-score')) document.getElementById('dyn-ai-score').textContent = activeMovie.aiScore;

            if (document.getElementById('dyn-data-points')) document.getElementById('dyn-data-points').textContent = formatLargeNumber(activeMovie.dataPoints || 2400000);

            if (document.getElementById('dyn-sentiment-score')) document.getElementById('dyn-sentiment-score').textContent = activeMovie.sentimentScore;

            // ----------------------------------------------------
            // DYNAMIC HASH GENERATOR
            // ----------------------------------------------------
            const hashEl = document.getElementById('prediction-hash');
            if (hashEl) {
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                hashEl.textContent = `#CS-${randomHex}`;
            }

            // ----------------------------------------------------
            // 4TH CARD: PROFITABILITY CALCULATOR
            // ----------------------------------------------------
            let estBudgetStr = activeMovie.budget;
            let rawBudgetM = 0;

            // 1. Calculate Budget in Millions
            if (!estBudgetStr && activeMovie.boxOffice) {
                let val = parseFloat(activeMovie.boxOffice.replace(/[^0-9.]/g, ''));
                let inMillions = activeMovie.boxOffice.includes('B') ? val * 1000 : val;
                rawBudgetM = Math.round(inMillions / 3); // Standard estimate: 1/3 of Box Office
                estBudgetStr = rawBudgetM >= 1000 ? `$${(rawBudgetM / 1000).toFixed(2)}B` : `$${rawBudgetM}M`;
            } else if (estBudgetStr) {
                let bVal = parseFloat(estBudgetStr.replace(/[^0-9.]/g, ''));
                rawBudgetM = estBudgetStr.includes('B') ? bVal * 1000 : bVal;
            } else {
                estBudgetStr = "$150M"; // Ultimate Fallback
                rawBudgetM = 150;
            }

            // 2. Calculate Profit Target in Millions
            let profitTargetStr = activeMovie.profitTarget;
            if (!profitTargetStr) {
                let rawTargetM = Math.round(rawBudgetM * 2.5); // Hollywood rule: 2.5x budget to break even
                profitTargetStr = rawTargetM >= 1000 ? `$${(rawTargetM / 1000).toFixed(2)}B` : `$${rawTargetM}M`;
            }

            // ----------------------------------------------------
            // SUMMARY STATS AUTH GUARD
            // ----------------------------------------------------
            const verdictEl = document.getElementById('dyn-verdict');
            const boxOfficeEl = document.getElementById('dyn-box-office');
            const imdbEl = document.getElementById('dyn-imdb');
            const profitTargetEl = document.getElementById('dyn-profit-target');
            const estBudgetEl = document.getElementById('dyn-est-budget');

            // THE FIX: Fallback data for missing attributes to prevent 'undefined'
            const safeBoxOffice = activeMovie.boxOffice || 'N/A';
            const safeImdb = activeMovie.imdb || 'N/A';

            if (isLoggedIn) {
                // REAL DATA (LOGGED IN)
                if (verdictEl) verdictEl.textContent = activeMovie.verdict || 'Pending';

                if (boxOfficeEl) boxOfficeEl.innerHTML = `${safeBoxOffice.replace(/[MB]/g, '')}<span style="font-size: 24px;">${safeBoxOffice === 'N/A' ? '' : safeBoxOffice.slice(-1)}</span>`;

                if (imdbEl) imdbEl.innerHTML = `${safeImdb}<span style="font-size: 24px; color: var(--color-secondary);">${safeImdb === 'N/A' ? '' : '/10'}</span>`;

                if (profitTargetEl) profitTargetEl.innerHTML = `${profitTargetStr.replace(/[MB]/g, '')}<span style="font-size: 24px;">${profitTargetStr.slice(-1)}</span>`;

                if (estBudgetEl) estBudgetEl.textContent = `Est. Budget: ${estBudgetStr}`;

            } else {
                // RESTRICTED DATA (LOGGED OUT)
                const lockBadge = `<span style="display: flex; align-items: center; font-size: 10px; color: var(--color-warning); border: 1px solid var(--color-warning); padding: 3px 6px; border-radius: 4px; letter-spacing: 1px; font-weight: 800; white-space: nowrap; flex-shrink: 0; height: fit-content;"><i class="fa-solid fa-lock" style="margin-right: 4px;"></i> PRO</span>`;

                if (verdictEl) verdictEl.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; width: 100%;"><span style="filter: blur(5px); opacity: 0.5; font-size: 24px; white-space: nowrap;">Restricted</span> ${lockBadge}</div>`;

                if (boxOfficeEl) boxOfficeEl.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; width: 100%;"><span style="filter: blur(6px); opacity: 0.5; font-size: 32px; white-space: nowrap;">$850M</span> ${lockBadge}</div>`;

                if (imdbEl) imdbEl.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; width: 100%;"><span style="filter: blur(5px); opacity: 0.5; font-size: 32px; white-space: nowrap;">8.5</span> ${lockBadge}</div>`;

                if (profitTargetEl) profitTargetEl.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; width: 100%;"><span style="filter: blur(6px); opacity: 0.5; font-size: 32px; white-space: nowrap;">$650M</span> ${lockBadge}</div>`;

                if (estBudgetEl) estBudgetEl.innerHTML = `<div style="display: flex; align-items: center; gap: 6px; flex-wrap: nowrap;"><span style="color: var(--color-accent); font-weight: 700; white-space: nowrap;">Est. Budget:</span><span style="filter: blur(4px); opacity: 0.5; white-space: nowrap;">$250M</span></div>`;
            }

            // THE FIX: Safe Meta Text Injections
            if (document.getElementById('dyn-verdict-meta')) {
                document.getElementById('dyn-verdict-meta').innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> ${activeMovie.verdictMeta || 'High Audience Consensus'}`;
            }

            if (document.getElementById('dyn-box-office-meta')) {
                document.getElementById('dyn-box-office-meta').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${activeMovie.boxOfficeMeta || 'Based on theatrical run'}`;
            }

            if (document.getElementById('dyn-imdb-meta')) {
                document.getElementById('dyn-imdb-meta').innerHTML = `<i class="fa-solid fa-circle-check"></i> ${activeMovie.imdbMeta || 'Verified User Ratings'}`;
            }


            // AI Gauge Setup
            const gaugeFill = document.querySelector('.ai-gauge-fill');
            if (gaugeFill) gaugeFill.style.strokeDashoffset = 264 - (264 * (activeMovie.aiScore / 100));

            // Chart Render
            if (typeof window.renderDynamicCharts === 'function') window.renderDynamicCharts(activeMovie, 'base');
        } else {
            titleElement.textContent = "No Movie Selected. Search below.";
        }
    }

    /* --------------------------------------------------------
       4. INTERACTIVE UI (Bull/Bear Toggle & Vote Buttons)
       -------------------------------------------------------- */

    // Bull/Bear Toggle
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    const slider = document.querySelector('.scenario-slider');

    if (scenarioBtns.length > 0 && slider) {
        const activeBtn = document.querySelector('.scenario-btn.active');
        if (activeBtn) slider.style.width = `${activeBtn.offsetWidth}px`;

        scenarioBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                scenarioBtns.forEach(b => b.classList.remove('active', 'bull', 'bear'));
                this.classList.add('active');

                slider.style.transform = `translateX(${this.offsetLeft - 4}px)`;
                slider.style.width = `${this.offsetWidth}px`;

                let scenario = 'base';
                if (this.textContent.includes('Bull')) {
                    this.classList.add('bull'); scenario = 'bull';
                    slider.style.backgroundColor = 'rgba(0, 200, 83, 0.15)'; slider.style.borderColor = 'rgba(0, 200, 83, 0.2)';
                } else if (this.textContent.includes('Bear')) {
                    this.classList.add('bear'); scenario = 'bear';
                    slider.style.backgroundColor = 'rgba(213, 0, 0, 0.15)'; slider.style.borderColor = 'rgba(213, 0, 0, 0.2)';
                }

                const activeMovie = JSON.parse(localStorage.getItem('cinescore_active_movie_data'));
                if (activeMovie && typeof window.renderDynamicCharts === 'function') window.renderDynamicCharts(activeMovie, scenario);
            });
        });
    }

});


/* --------------------------------------------------------
   10. CHART.JS ENGINE
   -------------------------------------------------------- */
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(11, 25, 44, 0.95)';
    Chart.defaults.elements.line.tension = 0.4;
}

window.cineCharts = {};

window.renderDynamicCharts = function (movieData, scenario = 'base') {

    // THE FIX: Defensive Programming. If chart data is missing, exit gracefully instead of crashing!
    if (!movieData || !movieData.sentimentLine || !movieData.sonar || !movieData.funnel || !movieData.trajectory) {
        console.warn("Chart data missing for:", movieData?.title);
        return;
    }

    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    const cardBgColor = isDarkTheme ? "#1B263B" : "#FFFFFF";

    let mult = 1.0;
    if (scenario === 'bull') mult = 1.25;
    if (scenario === 'bear') mult = 0.75;

    const sPos = movieData.sentimentLine.pos.map(v => Math.min(100, v * mult));

    const sNeg = movieData.sentimentLine.neg.map(v => Math.min(100, v * (scenario === 'bear' ? 1.5 : 1)));

    const sSonar = movieData.sonar.map(v => Math.min(100, v * mult));

    const sFunnel = [...movieData.funnel];

    sFunnel[3] = Math.round(sFunnel[3] * mult);

    const sTraj = movieData.trajectory.map(v => Math.round(v * mult));


    Object.keys(window.cineCharts).forEach(key => { if (window.cineCharts[key]) window.cineCharts[key].destroy(); });

    const ctxSocial = document.getElementById("socialDonut");
    if (ctxSocial) {
        // Safely pad the data in case your mock data only has 4 items instead of 5
        const socialData = [...movieData.social];
        if (socialData.length === 4) socialData.push(12); // Fallback for IG

        window.cineCharts.social = new Chart(ctxSocial, {
            type: "doughnut",
            data: {
                labels: ["YouTube", "TikTok", "X / Twitter", "Reddit", "Instagram"],
                datasets: [{
                    data: socialData,
                    // Soft Pastel Palette: Red, Green, Blue, Orange-Red, Pink
                    backgroundColor: ["#C23B22", "#77DD77", "#89cff0", "#FF8533", "#FF006E"],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: "80%", plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8 } } } }
        });
    }


    const ctxSentiment = document.getElementById("sentimentLine");

    if (ctxSentiment) window.cineCharts.sentiment = new Chart(ctxSentiment, {
        type: "line",

        data: {
            labels: ["Day 1", "Day 7", "Day 14", "Day 21", "Day 30"],
            datasets: [{
                label: "Positive Buzz",
                data: sPos,
                borderColor: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 3,
                fill: true,
                pointRadius: 0
            },

            {
                label: "Negative Noise",
                data: sNeg,
                borderColor: "#F43F5E",
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },

        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } }, scales: { x: { grid: { display: false } }, y: { display: false, min: 0 } }, interaction: { intersect: false, mode: 'index' } }
    });

    const ctxSonar = document.getElementById("appealSonar");

    if (ctxSonar) window.cineCharts.sonar = new Chart(ctxSonar, {

        type: "polarArea",
        data: {
            labels: ["Action", "Story/Plot", "Visuals", "Star Power", "Pacing"],
            datasets: [{
                data: sSonar, backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(244, 63, 94, 0.8)', 'rgba(245, 158, 11, 0.8)'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { usePointStyle: true, boxWidth: 8 }
                }
            },
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor }, ticks: { display: false }
                }
            }
        }
    });

    const ctxFunnel = document.getElementById("roiFunnel");
    if (ctxFunnel) window.cineCharts.funnel = new Chart(ctxFunnel, {

        type: "bar",
        data: {
            labels: ["Budget", "P&A", "Break-Even", "Proj. Gross"],
            datasets: [{
                label: "Millions USD",
                data: sFunnel,
                backgroundColor: ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981"],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: gridColor, borderDash: [5, 5] }, ticks: { callback: v => '$' + v + 'M' } }, x: { grid: { display: false } } }
        }
    });

    const ctxTraj = document.getElementById("revenueTrajectory");

    if (ctxTraj) {
        const gradient = ctxTraj.getContext("2d").createLinearGradient(0, 0, 0, 400);

        gradient.addColorStop(0, 'rgba(0, 85, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 85, 255, 0.0)');
        window.cineCharts.trajectory = new Chart(ctxTraj, {
            type: "line",
            data: {
                labels: ["Opening Wknd", "Week 2", "Week 3", "Week 4", "Week 5", "Final Run"],
                datasets: [{
                    label: "Cumulative Gross ($M)", data: sTraj,
                    borderColor: "#0055FF",
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    pointBackgroundColor: "#FFFFFF",
                    pointBorderColor: "#0055FF",
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gridColor, borderDash: [5, 5] }, ticks: { callback: v => '$' + v + 'M' }, beginAtZero: true } }, interaction: { intersect: false, mode: 'index' }
            }
        });
    }

    // ==========================================
    // 5. DYNAMIC COMPARABLE RELEASES CHART
    // ==========================================
    const compsCtx = document.getElementById('compsChart');
    if (compsCtx) {
        // Generate 3 random comparable movies from the database
        const db = window.mockMovies || [];
        const availableComps = db.filter(m => m.title !== movieData.title);
        // Shuffle and pick 3
        const selectedComps = availableComps.sort(() => 0.5 - Math.random()).slice(0, 3);

        // Build the dynamic labels and data
        const labels = [`${movieData.title} (Predicted)`];
        const data = [sTraj[0] || 145.5]; // Uses predicted Opening Weekend

        selectedComps.forEach(comp => {
            labels.push(comp.title);
            data.push(60 + (comp.title.length * 4)); // Mock Opening Weekend
        });

        window.cineCharts.comps = new Chart(compsCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Opening Weekend ($M)',
                    data: data,
                    backgroundColor: [
                        '#0055FF', // Accent Color for Predicted
                        '#64748B', // Neutral for Comps
                        '#64748B',
                        '#64748B'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) { return '$' + context.raw + 'M'; }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: '#94A3B8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            callback: function (value) {
                                let label = this.getLabelForValue(value);
                                return label.length > 15 ? label.substring(0, 12) + '...' : label;
                            }
                        }
                    }
                }
            }
        });
    }
};


/* --------------------------------------------------------
   11. DASHBOARD HUB: MASTER DATABASE & UI ENGINE
   -------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    // --- CUSTOM UI DROPDOWNS (Status & Sort) ---
    const customDropdowns = document.querySelectorAll('.custom-dropdown');
    customDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const valueSpan = dropdown.querySelector('.dropdown-value');
        const options = dropdown.querySelectorAll('.dropdown-menu li');

        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                customDropdowns.forEach(other => {
                    if (other !== dropdown) {
                        const otherMenu = other.querySelector('.dropdown-menu');
                        if (otherMenu) otherMenu.classList.add('hidden');
                        other.classList.remove('active');
                    }
                });
                menu.classList.toggle('hidden');
                dropdown.classList.toggle('active');
            });
        }

        options.forEach(option => {
            option.addEventListener('click', () => {
                const newValue = option.textContent;
                if (valueSpan) valueSpan.textContent = newValue;
                if (menu) menu.classList.add('hidden');
                dropdown.classList.remove('active');

                // THE FIX: Update state and trigger re-render
                const context = window.cinescoreCurrentTab; // 'overview' or 'watchlist'

                // --- NEW WIRING: LEGACY VAULT SORTING ---
                if (context === 'legacy') {
                    let sortParam = 'latest';
                    if (newValue.includes('Oldest')) sortParam = 'oldest';
                    if (newValue.includes('Best')) sortParam = 'best';
                    if (newValue.includes('Worst')) sortParam = 'worst';

                    if (typeof window.renderLegacyTab === 'function') window.renderLegacyTab(sortParam);
                    return; // Exit early so it doesn't trigger the overview/watchlist logic
                }

                const isStatus = newValue.includes('Status') || newValue.includes('Released') || newValue.includes('All') || newValue.includes('Tracking');

                if (isStatus) {
                    window.csFilters[context].status = newValue;
                } else {
                    window.csFilters[context].sort = newValue;
                }

                // Re-render the correct tab
                if (context === 'overview' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                if (context === 'watchlist' && typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();
            });
        });
    });

    document.addEventListener('click', () => {
        customDropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.classList.add('hidden');
            dropdown.classList.remove('active');
        });
    });

    // --- DOM ELEMENTS ---
    const hubSearch = document.getElementById('hub-search');
    const hubClearSearchBtn = document.getElementById('hub-clear-search-btn');
    const hubSearchDropdown = document.getElementById('hub-search-dropdown');
    const contentWrapper = document.getElementById('content-wrapper');
    const movieGrid = document.querySelector('.movie-grid');

    const contextMenu = document.getElementById('context-menu');
    // const ctxPin = document.getElementById('ctx-pin');
    // const ctxEdit = document.getElementById('ctx-edit');
    // const ctxDelete = document.getElementById('ctx-delete');
    const predictionModal = document.getElementById('addMovieModal');

    let targetMovieData = null;
    let targetCardEl = null;

    // --- GLOBAL FILTER STATE & UTILITIES ---
    window.csFilters = {
        overview: { status: 'Status: All', sort: 'Sort by: Hype' },
        watchlist: { status: 'Status: All', sort: 'Sort by: Added' }
    };

    // Helper: Parses "$1.4B", "$460M" into raw numbers for accurate sorting
    function parseMoneyToRaw(str) {
        if (!str || str === 'Not Set') return 0;
        let num = parseFloat(str.replace(/[^0-9.]/g, ''));
        if (str.includes('B')) return num * 1000000000;
        if (str.includes('M')) return num * 1000000;
        if (str.includes('K')) return num * 1000;
        return num;
    }

    // Helper: Gets days until release
    function getDaysDiff(movieYear) {
        const today = new Date('2026-03-29');
        const yearStr = String(movieYear || '2026');
        let releaseDate = new Date(yearStr);
        if (yearStr.length <= 4) releaseDate = new Date(`${yearStr}-12-31`);
        return Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));
    }

    // Core Processing Engine
    function processMovieData(databaseKey, context) {
        let movies = JSON.parse(localStorage.getItem(databaseKey) || '[]');
        if (movies.length === 0) return [];

        const statusFilter = window.csFilters[context].status;
        const sortFilter = window.csFilters[context].sort;

        // 1. FILTERING
        if (statusFilter !== 'Status: All') {
            movies = movies.filter(m => {
                const days = getDaysDiff(m.year);
                if (statusFilter === 'Tracking' || statusFilter === 'Upcoming') return days > 0;
                if (statusFilter === 'Released') return days <= 0;
                return true;
            });
        }

        // 2. SORTING
        movies.sort((a, b) => {
            // Pins always override everything
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            if (sortFilter.includes('Hype')) {
                const aHype = 80 + (a.title.length % 15);
                const bHype = 80 + (b.title.length % 15);
                return bHype - aHype; // Descending
            }
            if (sortFilter.includes('Date')) {
                return getDaysDiff(a.year) - getDaysDiff(b.year); // Nearest first
            }
            if (sortFilter.includes('Value') || sortFilter.includes('Box office')) {
                // We use our AI hash as the default "Value" if it's the Overview tab
                let aVal = parseMoneyToRaw(`$${(a.title.length % 8 + 3) * 115}M`);
                let bVal = parseMoneyToRaw(`$${(b.title.length % 8 + 3) * 115}M`);
                return bVal - aVal; // Highest value first
            }
            if (sortFilter.includes('Your Prediction')) {
                return parseMoneyToRaw(b.userPrediction) - parseMoneyToRaw(a.userPrediction);
            }

            return 0; // Default (Added order)
        });

        return movies;
    }

    // --- RENDER ENGINE & DARK GLASS PILLS ---
    window.injectNewCard = function (movie) {
        if (!movieGrid) return;
        const today = new Date('2026-03-29');
        const yearStr = String(movie.year || '2026');
        let releaseDate = new Date(yearStr);
        if (yearStr.length <= 4) releaseDate = new Date(`${yearStr}-12-31`);

        const daysLeft = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));
        const isDraft = !movie.userPrediction;
        const isLocked = movie.isLocked || daysLeft <= 7;
        let badgeHTML = '';

        const baseBadgeStyle = "position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); border: none; color: white; padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 5;";

        if (isDraft) {

            badgeHTML = `<span class="badge" style="${baseBadgeStyle}"><i class="fa-solid fa-eye" style="color: var(--color-accent);"></i> TRACKING</span>`;

        }

        else if (isLocked) {
            badgeHTML = `<span class="badge" style="${baseBadgeStyle}"><i class="fa-solid fa-lock" style="color: var(--color-danger);"></i> LOCKED</span>`;
        }

        else {
            badgeHTML = `<span class="badge" style="${baseBadgeStyle}"><i class="fa-regular fa-clock" style="color: var(--color-warning);"></i> ${daysLeft > 7 ? daysLeft - 7 : 0}D LEFT</span>`;
        }

        const newCard = document.createElement('div');
        newCard.className = 'card poster-card stack';
        newCard.style.cssText = 'margin: 0; padding: 0; overflow: hidden; animation: swipeIn 0.5s ease; position: relative;';
        newCard.dataset.title = movie.title;
        newCard.dataset.daysLeft = daysLeft;
        newCard.dataset.isDraft = isDraft;

        // THE FIX: Brighter dynamic hype colors
        const hypeVal = 80 + (movie.title.length % 15);
        let hypeColor = 'var(--color-success)';
        let hypeBg = 'rgba(0, 200, 83, 0.2)';       // Brightened background
        let hypeBorder = 'rgba(0, 200, 83, 0.5)';   // Brightened border
        if (hypeVal < 88) { hypeColor = 'var(--color-warning)'; hypeBg = 'rgba(255, 159, 28, 0.2)'; hypeBorder = 'rgba(255, 159, 28, 0.5)'; }
        if (hypeVal < 83) { hypeColor = 'var(--color-danger)'; hypeBg = 'rgba(213, 0, 0, 0.2)'; hypeBorder = 'rgba(213, 0, 0, 0.5)'; }

        let trend = (movie.title.length % 4) + 1;
        let isUp = movie.title.length % 2 !== 0;
        let trendColor = isUp ? 'var(--color-success)' : 'var(--color-danger)';
        let trendSign = isUp ? '+' : '-';
        let trendIcon = isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';

        newCard.innerHTML = `
                    <div style="background: url('${movie.poster}') center/cover; height: 180px; position: relative;">
                        ${badgeHTML}
                        ${movie.isPinned ? `<span style="position: absolute; top: 12px; left: 12px; color: var(--color-warning); font-size: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); z-index: 5;"><i class="fa-solid fa-thumbtack"></i></span>` : ''}
                        <button class="card-menu-btn" title="Options" style="position: absolute !important; top: auto !important; bottom: 12px !important; right: 12px !important;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                    <div class="stack" style="padding: 20px;">
                        <h3 class="movie-title"><abbr title="${movie.title}" style="text-decoration: none;">${movie.title.substring(0, 20)}${movie.title.length > 20 ? '...' : ''}</abbr></h3>
                        
                        <div class="row row-between" style="margin-bottom: 12px; flex-wrap: nowrap; gap: 8px; align-items: center;">
                            
                            <div class="row" style="gap: 6px; align-items: center; color: var(--color-secondary); font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                <span><i class="fa-regular fa-calendar"></i> ${movie.year}</span>
                                <span style="opacity: 0.5;">|</span>
                                <span style="overflow: hidden; text-overflow: ellipsis;">${movie.studio || 'Blockbuster'}</span>
                                <span style="opacity: 0.6;">|</span>
                            </div>
                            
                            <div class="row" style="gap: 6px; align-items: center; flex-shrink: 0;">
                                <span style="color: ${hypeColor}; font-weight: 800; background: ${hypeBg}; border: 1px solid ${hypeBorder}; padding: 3px 8px; border-radius: 100px; font-size: 10px; line-height: 1; box-shadow: 0 2px 8px ${hypeBg}; text-transform: uppercase; white-space: nowrap;">HYPE: ${hypeVal}%</span>
                                <span style="color: ${trendColor}; font-weight: 800; font-size: 12px; line-height: 1; white-space: nowrap;"><i class="fa-solid ${trendIcon}"></i> ${trendSign}${trend}%</span>
                            </div>
                            
                        </div>
                        
                        <div class="grid grid-2" style="grid-template-columns: 1fr 1fr; border-top: 1px solid var(--color-border); padding-top: 16px; text-align: center;">
                            <div class="stack" style="gap: 4px; align-items: center;">
                                <span class="small" style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Your Pred.</span>
                                <h4 style="color: ${isDraft ? 'var(--color-tertiary)' : 'var(--color-success)'}; font-size: 16px; margin: 0;">${isDraft ? 'Not Set' : movie.userPrediction}</h4>
                            </div>
                            <div class="stack" style="gap: 4px; align-items: center;">
                                <span class="small" style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Confidence</span>
                                <h4 class="${isDraft ? '' : (parseInt(movie.userConfidence || '0') >= 90 ? 'conf-high' : parseInt(movie.userConfidence || '0') <= 50 ? 'conf-low' : 'conf-med')}" style="color: ${isDraft ? 'var(--color-tertiary)' : ''}; font-size: 16px; margin: 0;">${isDraft ? '--' : movie.userConfidence}</h4>
                            </div>
                        </div>
                    </div>
        `;

        movieGrid.appendChild(newCard);
    };

    window.loadSavedMovies = function () {
        if (!movieGrid) return;
        movieGrid.innerHTML = '';
        let processedMovies = processMovieData('cinescore_upcoming', 'overview');

        if (processedMovies.length === 0) {
            movieGrid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--bg-card); border: 1px dashed var(--color-border); border-radius: 16px; margin-top: 20px; display: flex; flex-direction: column; align-items: center;">
                    <i class="fa-solid fa-film" style="font-size: 48px; color: var(--color-tertiary); opacity: 0.5; margin-bottom: 16px;"></i>
                    <h3 style="margin:0; color: var(--color-primary); font-size: 20px;">List is Empty</h3>
                    <p style="margin-top:8px; color: var(--color-secondary); max-width: 400px; line-height: 1.5;">No Results found for the selected option.</p>
                </div>
            `;
            return;
        }

        processedMovies.sort((a, b) => (b.isPinned === true) - (a.isPinned === true));
        processedMovies.forEach(movie => window.injectNewCard(movie));
    };


    // --- TABULAR WATCHLIST RENDERER ---
    window.renderTabularWatchlist = function () {
        const listContainer = document.getElementById('tabular-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        let processedMovies = processMovieData('cinescore_watchlist', 'watchlist');

        if (processedMovies.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                    <i class="fa-solid fa-list" style="font-size: 40px; color: var(--color-tertiary); opacity: 0.5; margin-bottom: 16px;"></i>
                    <h3 style="margin:0; color: var(--color-secondary); font-size: 18px;">List is Empty</h3>
                    <p style="margin-top:8px; color: var(--color-secondary); max-width: 400px; line-height: 1.5;">No Results found for the selected option.</p>
                </div>
            `;
            return;
        }

        // Sort: Pinned first
        processedMovies.sort((a, b) => (b.isPinned === true) - (a.isPinned === true));

        const today = new Date('2026-03-29');

        processedMovies.forEach((movie, index) => {
            const yearStr = String(movie.year || '2026');
            let releaseDate = new Date(yearStr);
            if (yearStr.length <= 4) releaseDate = new Date(`${yearStr}-12-31`);

            const daysDiff = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

            // TIME LOGIC
            let timeString = '';
            let statusIcon = '<i class="fa-solid fa-hourglass-half"></i>';

            if (daysDiff > 0) {
                timeString = `Releasing in ${daysDiff} Days`;
                if (daysDiff <= 7) {
                    timeString = `Locks in ${daysDiff} Days`;
                    statusIcon = '<i class="fa-solid fa-fire" style="color: var(--color-danger);"></i>';
                }
            } else if (daysDiff === 0) {
                timeString = 'Releasing Today';
                statusIcon = '<i class="fa-solid fa-bolt" style="color: var(--color-success);"></i>';
            } else {
                timeString = `Released ${Math.abs(daysDiff)} Days Ago`;
                statusIcon = '<i class="fa-solid fa-check-double" style="color: var(--color-success);"></i>';
            }

            const isDraft = !movie.userPrediction;
            const predText = isDraft ? 'Not Set' : movie.userPrediction;
            const predClass = isDraft ? '' : 'success';

            // THE FIX: Realistic AI Forecast with Blockbuster Justice!
            let mathHash = (movie.title.length % 8 + 3) * 115;

            // Give massive boosts to the heavy hitters
            const tLower = movie.title.toLowerCase();
            if (tLower.includes('spider-man') || tLower.includes('avengers') || tLower.includes('batman') || tLower.includes('star wars') || tLower.includes('avatar')) {
                mathHash += 500 + (movie.title.length * 20);
            }

            let aiForecast = `$${mathHash}M`;
            if (mathHash >= 1000) aiForecast = `$${(mathHash / 1000).toFixed(1)}B`;

            // THE FIX: Theatrical Run Decay & Prediction Lockout Logic
            let hypeVal = 80 + (movie.title.length % 15);
            let trend = (movie.title.length % 4) + 1;
            let isUp = movie.title.length % 2 !== 0;

            const daysSinceRelease = daysDiff < 0 ? Math.abs(daysDiff) : 0;
            const isReleased = daysDiff <= 0;
            const theatricalWindow = 45;
            let runCompleted = false;

            if (isReleased) {
                if (daysSinceRelease <= theatricalWindow) {
                    // Post-release decay: Hype drops slowly over 45 days
                    hypeVal = Math.max(20, hypeVal - Math.floor((daysSinceRelease / theatricalWindow) * 60));

                    // After Opening Weekend (Day 3), trend goes negative as weekly grosses drop
                    if (daysSinceRelease > 3) {
                        isUp = false;
                        trend = Math.min(35, trend + Math.floor(daysSinceRelease / 2));
                    }
                } else {
                    // Run is entirely over (Older than 45 days)
                    runCompleted = true;
                }
            }

            let hypeColor = 'var(--color-success)';
            let hypeBg = 'rgba(0, 200, 83, 0.2)';
            let hypeBorder = 'rgba(0, 200, 83, 0.5)';

            if (hypeVal < 88) { hypeColor = 'var(--color-warning)'; hypeBg = 'rgba(255, 159, 28, 0.2)'; hypeBorder = 'rgba(255, 159, 28, 0.5)'; }
            if (hypeVal < 70) { hypeColor = 'var(--color-danger)'; hypeBg = 'rgba(213, 0, 0, 0.2)'; hypeBorder = 'rgba(213, 0, 0, 0.5)'; }
            if (hypeVal < 40) { hypeColor = 'var(--color-tertiary)'; hypeBg = 'rgba(148, 163, 184, 0.1)'; hypeBorder = 'rgba(148, 163, 184, 0.3)'; } // Cold

            let trendColor = isUp ? 'var(--color-success)' : 'var(--color-danger)';
            let trendIcon = isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
            let trendSign = isUp ? '+' : '-';

            // Generate HTML Variable Blocks
            const naHTML = '<span style="color: var(--color-secondary); font-size: 13px; font-weight: 700; opacity: 0.6;"><i class="fa-solid fa-ban" style="font-size: 10px; margin-right:4px;"></i> N/A</span>';

            // Hype & Trend die when the run is completed
            let hypeHTML = runCompleted ? naHTML : `<span style="color: ${hypeColor}; font-weight: 800; background: ${hypeBg}; border: 1px solid ${hypeBorder}; padding: 3px 10px; border-radius: 100px; font-size: 13px; line-height: 1;">${hypeVal}%</span>`;
            let trendHTML = runCompleted ? naHTML : `<span style="color: ${trendColor}; font-size: 13px; font-weight: 800; line-height: 1;"><i class="fa-solid ${trendIcon}"></i> ${trendSign}${trend}%</span>`;

            // Your Pred dies ONLY IF you never set it and the movie is already released
            let predHTML = `<span class="tabular-stat-value ${predClass}">${predText}</span>`;
            if (isDraft && isReleased) {
                // THE FIX: Muted "Not Set" with a lock to show the window was missed
                predHTML = '<span style="color: var(--color-tertiary); font-size: 13px; font-weight: 600; opacity: 0.7;"><i class="fa-solid fa-lock" style="font-size: 10px; margin-right:4px;"></i> Missed</span>';
            }

            // AI Forecast is immortal
            let aiForecastHTML = `<span class="tabular-stat-value accent">${aiForecast}</span>`;

            let firstGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'ACTION';
            let secondGenre = movie.genres && movie.genres.length > 0 ? movie.genres[1] : 'DRAMA';
            let studioName = movie.studio || 'Blockbuster';


            // Generate the Row
            const row = document.createElement('div');
            row.className = 'tabular-row';
            row.dataset.title = movie.title;
            row.dataset.daysLeft = daysDiff;
            row.dataset.isDraft = isDraft;

            row.innerHTML = `
                <div class="tabular-index">${movie.isPinned ? '<i class="fa-solid fa-thumbtack" style="color: var(--color-warning);"></i>' : index + 1}</div>
                
                <img src="${movie.poster}" class="tabular-squircle" alt="poster">
                
                <div class="tabular-info" style="flex: 1.5; align-self: center;">
                    <h3 class="tabular-title" style="margin: 0 0 6px 0; line-height: 1;">${movie.title}</h3>
                    <div class="tabular-meta" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">

                    <span>${studioName}</span>

                    <span style="opacity: 0.5;">|</span>
                        ${statusIcon}
                        <span>${timeString}</span>
                        <span style="background: rgba(0, 85, 255, 0.1); align-items: left; color: var(--color-accent); padding: 2px 10px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${firstGenre}</span>
                        <span style="background: rgba(0, 85, 255, 0.1); align-items: left; color: var(--color-accent); padding: 2px 10px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${secondGenre}</span>

                    </div>

                </div>

                <div class="tabular-stats" style="flex: 2; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start; padding-right: 0; margin-top: -32px;">
                    <div class="stack" style="gap: 8px; align-items: center; text-align: center;">
                        <span class="tabular-stat-label">Hype</span>
                        ${hypeHTML}
                    </div>
                    <div class="stack" style="gap: 8px; align-items: center; text-align: center;">
                        <span class="tabular-stat-label">Trend</span>
                        ${trendHTML}
                    </div>
                    <div class="stack" style="gap: 8px; align-items: center; text-align: center;">
                        <span class="tabular-stat-label">Your Pred.</span>
                        ${predHTML}
                    </div>
                    <div class="stack" style="gap: 8px; align-items: center; text-align: center;">
                        <span class="tabular-stat-label">AI Forecast</span>
                        ${aiForecastHTML}
                    </div>
                </div>

                <button class="card-menu-btn tabular-menu-btn" style="position: relative; inset: auto; margin-left: 16px;">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
            `;

            listContainer.appendChild(row);
        });
    };

    // --- HUB SEARCH ENGINE ---
    if (hubSearch && hubSearchDropdown && contentWrapper) {
        hubSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const db = window.mockMovies || [];

            const isWatchlist = window.cinescoreCurrentTab === 'watchlist';
            const currentDbKey = isWatchlist ? 'cinescore_watchlist' : 'cinescore_upcoming';
            let savedMovies = JSON.parse(localStorage.getItem(currentDbKey) || '[]');

            hubSearchDropdown.innerHTML = '';

            const isLegacy = window.cinescoreCurrentTab === 'legacy';
            const searchSelector = isWatchlist ? '.tabular-row' : (isLegacy ? '#legacy-container .poster-card' : '.movie-grid .poster-card');
            const currentMovieCards = document.querySelectorAll(searchSelector);

            if (query.length === 0) {
                hubSearchDropdown.style.display = 'none';
                hubClearSearchBtn.classList.add('hidden');
                contentWrapper.classList.remove('search-active');

                currentMovieCards.forEach(card => card.style.display = '');

                const noMsg = document.getElementById('hub-no-results');
                if (noMsg) noMsg.style.display = 'none';
                return;
            }

            contentWrapper.classList.add('search-active');
            hubClearSearchBtn.classList.remove('hidden');
            let hasVisibleCards = false;

            currentMovieCards.forEach(card => {
                const titleEl = card.querySelector('.movie-title') || card.querySelector('.tabular-title');
                if (titleEl && titleEl.textContent.toLowerCase().includes(query)) {
                    card.style.display = '';
                    hasVisibleCards = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // THE FIX: Legacy Vault Logic - Filter local nominations for the dropdown
            let currentLegacy = JSON.parse(localStorage.getItem('cinescore_legacy') || '[]');
            const queryMatches = isLegacy ? currentLegacy.filter(m => m.title.toLowerCase().includes(query)) : db.filter(m => m.title.toLowerCase().includes(query));

            const alreadyLegacy = queryMatches.filter(m => currentLegacy.some(s => s.title.toLowerCase() === m.title.toLowerCase()));
            const alreadyTracked = queryMatches.filter(m => savedMovies.some(s => s.title.toLowerCase() === m.title.toLowerCase()) && !alreadyLegacy.some(l => l.title === m.title));
            const unTracked = queryMatches.filter(m => !savedMovies.some(s => s.title.toLowerCase() === m.title.toLowerCase()) && !alreadyLegacy.some(l => l.title === m.title));

            // THE FIX: Render dropdowns dynamically per tab rules
            if (unTracked.length > 0 || alreadyTracked.length > 0 || alreadyLegacy.length > 0) {
                hubSearchDropdown.style.display = 'block';

                if (!isLegacy) {
                    // 1. Render Untracked Movies First
                    unTracked.forEach(movie => {
                        const li = document.createElement('li');
                    li.className = 'search-item row-between';

                    // THE FIX: Check if the movie is already released
                    const today = new Date('2026-03-29');
                    const yearStr = String(movie.year || '2026');
                    let releaseDate = new Date(yearStr);
                    if (yearStr.length <= 4) releaseDate = new Date(`${yearStr}-12-31`);

                    const isReleased = releaseDate <= today;
                    const isOverview = window.cinescoreCurrentTab === 'overview';

                    if (isOverview && isReleased) {
                        // RENDER AS LOCKED (Can't predict past releases!)
                        li.innerHTML = `
                            <div class="row" style="gap: 12px; align-items: center; opacity: 0.6; filter: grayscale(1);">
                                <img src="${movie.poster}" style="width: 30px; height: 45px; border-radius: 4px; object-fit: cover;">
                                <div class="search-info">
                                    <h4 class="search-title" style="margin: 0; font-size: 14px;">${movie.title}</h4>
                                    <p class="search-meta" style="margin: 0; font-size: 11px; color: var(--color-danger);">Already Released • Cannot Predict</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-lock" style="color: var(--color-danger); margin-right: 8px; opacity: 0.6;"></i>
                        `;
                        li.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            if (typeof window.showCustomAlert === 'function') {
                                window.showCustomAlert('error', 'Predictions Closed', 'This movie has already been released. You cannot add it to your active tracker.');
                            } else {
                                alert('Predictions Closed. This movie has already been released.');
                            }
                        });
                    } else {
                        // RENDER NORMALLY (Add to Tracker / Watchlist)
                        const actionText = isOverview ? 'Add to Tracker' : 'Add to Watchlist';
                        li.innerHTML = `
                            <div class="row" style="gap: 12px; align-items: center;">
                                <img src="${movie.poster}" style="width: 30px; height: 45px; border-radius: 4px; object-fit: cover;">
                                <div class="search-info">
                                    <h4 class="search-title" style="margin: 0; font-size: 14px;">${movie.title}</h4>
                                    <p class="search-meta" style="margin: 0; font-size: 11px;">${movie.year} • ${actionText}</p>
                                </div>
                            </div>
                            <button class="add-draft-btn" style="background: var(--color-accent); color: white; border: none; border-radius: 50%; width: 28px; height: 28px; padding: 0 !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer;"><i class="fa-solid fa-plus"></i></button>
                        `;

                        li.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            if (isOverview) {
                                let currentSaved = JSON.parse(localStorage.getItem('cinescore_upcoming') || '[]');
                                if (currentSaved.length >= 6) {
                                    if (typeof window.showCustomAlert === 'function') window.showCustomAlert('premium', 'Upgrade to CineScore Pro', 'You have reached the maximum of <b>6 tracking slots</b> on the free tier.');
                                    return;
                                }

                                // THE FIX: Removed Test Bypass! Back to pure blank draft state.
                                currentSaved.unshift({ ...movie, userPrediction: null, userConfidence: null, isPinned: false, isLocked: false });
                                localStorage.setItem('cinescore_upcoming', JSON.stringify(currentSaved));
                                if (typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                            } else {
                                let currentWatchlist = JSON.parse(localStorage.getItem('cinescore_watchlist') || '[]');
                                if (!currentWatchlist.some(m => m.title === movie.title)) {
                                    currentWatchlist.unshift({ ...movie, userPrediction: null, userConfidence: null, isPinned: false, isLocked: false });
                                    localStorage.setItem('cinescore_watchlist', JSON.stringify(currentWatchlist));
                                }
                                if (typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();
                            }

                            if (typeof window.calculateHubMacros === 'function') window.calculateHubMacros();

                            hubSearch.value = '';
                            hubSearch.dispatchEvent(new Event('input'));
                        });
                    }
                    hubSearchDropdown.appendChild(li);
                });

                // 2. Render Already Tracked Movies Second
                alreadyTracked.forEach(movie => {
                    const li = document.createElement('li');
                    li.className = 'search-item row-between';
                    li.style.backgroundColor = 'rgba(0, 200, 83, 0.05)';
                    li.innerHTML = `
                        <div class="row" style="gap: 12px; align-items: center;">
                            <img src="${movie.poster}" style="width: 30px; height: 45px; border-radius: 4px; object-fit: cover;">
                            <div class="search-info">
                                <h4 class="search-title" style="margin: 0; font-size: 14px; color: var(--color-success);">${movie.title}</h4>
                                <p class="search-meta" style="margin: 0; font-size: 11px; color: var(--color-success);">Already Tracking • Click to View</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-location-pin-lock" style="color: var(--color-success); margin-right: 8px; font-size: 18px;"></i>
                    `;

                    li.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        hubSearch.value = '';
                        hubSearch.dispatchEvent(new Event('input'));
                        hubSearchDropdown.style.display = 'none';

                        setTimeout(() => {
                            const isTabWatchlist = window.cinescoreCurrentTab === 'watchlist';
                            const activeSelector = isTabWatchlist ? '.tabular-row' : '.movie-grid .poster-card';
                            const cards = document.querySelectorAll(activeSelector);
                            let targetCard = Array.from(cards).find(c => c.dataset.title === movie.title);

                            if (targetCard) {
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                
                                // THE FIX: Use Spotlight Mechanic for Watchlist/Overview
                                setTimeout(() => {
                                    triggerCardSpotlight(targetCard);
                                }, 600);
                            }
                        }, 850);
                    });
                    hubSearchDropdown.appendChild(li);
                });
                } // End !isLegacy block

                // 3. Render Movies Already in the Vault (Legacy)
                alreadyLegacy.forEach(movie => {
                    const li = document.createElement('li');
                    li.className = 'search-item row-between';
                    li.style.backgroundColor = 'rgba(255, 159, 28, 0.05)'; // Amber warning tint
                    li.innerHTML = `
                        <div class="row" style="gap: 12px; align-items: center;">
                            <img src="${movie.poster}" style="width: 30px; height: 45px; border-radius: 4px; object-fit: cover;">
                            <div class="search-info">
                                <h4 class="search-title" style="margin: 0; font-size: 14px; color: var(--color-warning);">${movie.title}</h4>
                                <p class="search-meta" style="margin: 0; font-size: 11px; color: var(--color-warning);">Already Predicted • In Nomination</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-trophy" style="color: var(--color-warning); margin-right: 8px; font-size: 18px;"></i>
                    `;

                    li.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        hubSearch.value = '';
                        hubSearch.dispatchEvent(new Event('input'));
                        hubSearchDropdown.style.display = 'none';

                        setTimeout(() => {
                            const isTabWatchlist = window.cinescoreCurrentTab === 'watchlist';
                            const isTabLegacy = window.cinescoreCurrentTab === 'legacy';
                            let activeSelector = isTabWatchlist ? '.tabular-row' : '.movie-grid .poster-card';
                            if (isTabLegacy) activeSelector = '#legacy-container .poster-card';
                            
                            const cards = document.querySelectorAll(activeSelector);
                            let targetCard = Array.from(cards).find(c => c.dataset.title === movie.title);

                            if (targetCard) {
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                
                                // THE FIX: Use Spotlight Mechanic for Legacy
                                setTimeout(() => {
                                    triggerCardSpotlight(targetCard);
                                }, 600);
                            }
                        }, 50);
                    });
                    hubSearchDropdown.appendChild(li);
                });

            } else {
                hubSearchDropdown.style.display = 'block';
                hubSearchDropdown.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--color-tertiary); cursor: default; font-size: 14px;"> Movie not found in database.</li>';
            }

            let noMsg = document.getElementById('hub-no-results');
            if (!noMsg) {
                noMsg = document.createElement('div');
                noMsg.id = 'hub-no-results';
                noMsg.style.cssText = 'width: 100%; grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--color-secondary); display: flex; flex-direction: column; align-items: center;';
                noMsg.innerHTML = '<i class="fa-solid fa-video-slash" style="font-size: 48px; opacity: 0.2; margin-bottom: 16px;"></i><h3 style="margin:0; color: var(--color-primary);">No predictions found</h3><p style="margin-top:8px;">Try adding a new movie from the searchbar above.</p>';
            }

            const targetContainer = isWatchlist ? document.getElementById('tabular-list-container') : document.querySelector('.movie-grid');
            if (targetContainer) targetContainer.appendChild(noMsg);

            noMsg.style.display = (!hasVisibleCards && savedMovies.length > 0) ? 'flex' : 'none';
        });

        hubClearSearchBtn.addEventListener('click', () => {
            hubSearch.value = '';
            hubSearch.dispatchEvent(new Event('input'));
        });

        if (typeof attachKeyboardNav === 'function') attachKeyboardNav(hubSearch, hubSearchDropdown);
    }


    // --- DYNAMIC CONTEXT MENU ENGINE ---
    const hideMenu = () => {
        if (contextMenu) {
            contextMenu.classList.add('hidden');
            contextMenu.style.display = 'none';
        }
    };

    const showMenu = (x, y, card) => {
        if (!contextMenu || !card) return;
        targetCardEl = card;

        // THE FIX: Correctly identify if we are in the Legacy Vault!
        if (window.cinescoreCurrentTab === 'legacy') {
            window.activeMenuContext = 'cinescore_legacy';
        } else {
            window.activeMenuContext = card.classList.contains('tabular-row') ? 'cinescore_watchlist' : 'cinescore_upcoming';
        }

        const cardTitle = card.dataset.title || card.querySelector('.movie-title')?.innerText?.trim() || 'Unknown Movie';
        let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
        targetMovieData = savedMovies.find(m => m.title === cardTitle);

        if (!targetMovieData) {
            targetMovieData = { title: cardTitle, isPinned: false, userPrediction: null, poster: card.querySelector('img')?.src || '' };
        }

        // THE FIX: Viewport Math that accounts for page scrolling!
        let menuX = x;
        let menuY = y;

        if (menuX + 220 > window.innerWidth + window.scrollX) menuX = window.innerWidth + window.scrollX - 230;
        if (menuY + 160 > window.innerHeight + window.scrollY) menuY = window.innerHeight + window.scrollY - 160;

        contextMenu.style.left = `${menuX}px`;
        contextMenu.style.top = `${menuY}px`;

        const isDraft = !targetMovieData.userPrediction;
        const daysLeft = parseInt(card.dataset.daysLeft || '999');
        const userLocked = targetMovieData.isLocked === true;
        const systemLocked = daysLeft <= 7;

        const ul = contextMenu.querySelector('.context-links');

        if (ul) {
            // THE FIX: Independent Context Menu for the Legacy Tab
            if (window.cinescoreCurrentTab === 'legacy') {
                ul.innerHTML = `
                    <li id="ctx-flex" style="color: var(--color-primary); font-weight: 700;"><i class="fa-solid fa-share-nodes"></i> Flex </li>
                    <div class="ctx-divider"></div>
                    <li id="ctx-delete" class="ctx-danger"><i class="fa-solid fa-trash-can"></i> Delete Permanently </li>
                `;
            } else {
                // NORMAL MENU FOR OVERVIEW/WATCHLIST
                let menuHTML = `<li id="ctx-pin">${targetMovieData.isPinned ? '<i class="fa-solid fa-thumbtack-slash"></i> Unpin Movie' : '<i class="fa-solid fa-thumbtack"></i> Pin to Top'}</li>`;

                let isLegacyEligible = false;
                const today = new Date('2026-03-29'); // Simulated current date
                const yearStr = String(targetMovieData.year || '2026');
                let releaseDate = new Date(yearStr);
                if (yearStr.length <= 4) releaseDate = new Date(`${yearStr}-12-31`);

                if (window.activeMenuContext === 'cinescore_upcoming') {
                    if (Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24)) <= 0) isLegacyEligible = true;
                }

                if (isDraft) {
                    if (systemLocked) {
                        menuHTML += `<li id="ctx-locked-msg" class="ctx-warning" style="opacity: 0.8; color: var(--color-warning);"><i class="fa-solid fa-lock"></i> Locked (Click for Pro)</li>`;
                    } else {
                        menuHTML += `<li id="ctx-edit"><i class="fa-solid fa-pen"></i> Set Prediction</li>`;
                    }
                } else {
                    if (systemLocked && !isLegacyEligible) {
                        menuHTML += `<li id="ctx-locked-msg" class="ctx-warning" style="opacity: 0.8; color: var(--color-warning);"><i class="fa-solid fa-lock"></i> Locked (Click for Pro)</li>`;
                    } else if (userLocked) {
                        menuHTML += `<li id="ctx-unlock"><i class="fa-solid fa-unlock"></i> Unlock Prediction</li>`;
                    } else {
                        menuHTML += `<li id="ctx-edit"><i class="fa-solid fa-pen-to-square"></i> Edit Prediction</li>`;
                        menuHTML += `<li id="ctx-lock"><i class="fa-solid fa-lock"></i> Lock In Prediction</li>`;
                    }
                }

                if (isLegacyEligible && !isDraft) {
                    menuHTML += `<div class="ctx-divider"></div>`;
                    menuHTML += `<li id="ctx-nominate" class="ctx-warning" style="color: var(--color-warning); font-weight: 700;"><i class="fa-solid fa-trophy"></i> Submit to Nominations</li>`;
                }

                menuHTML += `<div class="ctx-divider"></div><li id="ctx-delete" class="ctx-danger"><i class="fa-solid fa-trash-can"></i> Remove</li>`;
                ul.innerHTML = menuHTML;
            }
        }
        contextMenu.classList.remove('hidden');
        contextMenu.style.display = 'block';
    }; // THIS PROPERLY CLOSES THE FUNCTION

    // EVENT DELEGATION
    document.addEventListener('click', (e) => {
        const dotsBtn = e.target.closest('.card-menu-btn');
        if (dotsBtn) {
            e.preventDefault(); e.stopPropagation();
            const card = dotsBtn.closest('.poster-card') || dotsBtn.closest('.tabular-row');
            if (!card) return;
            const rect = dotsBtn.getBoundingClientRect();
            showMenu(rect.right - 210 + window.scrollX, rect.bottom + 8 + window.scrollY, card);
            return;
        }

        const contextMenuLi = e.target.closest('#context-menu li');

        if (contextMenuLi) {
            const action = contextMenuLi.id;

            // THE FIX: Premium Alert Trigger for 7-Day Locks!
            if (action === 'ctx-locked-msg') {
                hideMenu();
                if (typeof window.showCustomAlert === 'function') {
                    window.showCustomAlert('premium', 'Predictions Locked', 'Predictions lock automatically 7 days before release. <br><br><b>Upgrade to CineScore Pro</b> to edit up to 3 days prior.');
                }
                return;
            }

            hideMenu();
            if (!targetCardEl || !targetMovieData) return;
            const title = targetMovieData.title;

            // ACTION: PIN
            if (action === 'ctx-pin') {
                let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
                const movieIndex = savedMovies.findIndex(m => m.title === title);
                const currentlyPinned = savedMovies.filter(m => m.isPinned).length;

                // THE FIX: 3 Pins allowed in Watchlist, 1 in Overview
                const maxPins = window.activeMenuContext === 'cinescore_watchlist' ? 3 : 1;

                if (!targetMovieData.isPinned && currentlyPinned >= maxPins) {
                    if (typeof window.showCustomAlert === 'function') window.showCustomAlert('premium', 'Pin Limit Reached', `Free tier allows <b>${maxPins} pinned movie${maxPins > 1 ? 's' : ''}</b> in this view.`);
                    return;
                }

                if (movieIndex > -1) {
                    savedMovies[movieIndex].isPinned = !savedMovies[movieIndex].isPinned;
                } else {
                    targetMovieData.isPinned = true;
                    savedMovies.push(targetMovieData);
                }

                localStorage.setItem(window.activeMenuContext, JSON.stringify(savedMovies));
                if (window.activeMenuContext === 'cinescore_upcoming' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                if (window.activeMenuContext === 'cinescore_watchlist' && typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();
            }

            // ACTION: DELETE
            if (action === 'ctx-delete') {
                hideMenu();

                if (window.activeMenuContext === 'cinescore_legacy') {
                    // THE FIX: AWS-Style Hardcore Delete for Vault
                    const hardcoreModal = document.getElementById('hardcoreDeleteModal');
                    const titleEl = document.getElementById('hardcore-delete-title');
                    const inputEl = document.getElementById('hardcore-delete-input');
                    const confirmBtn = document.getElementById('hardcore-confirm-btn');

                    if (hardcoreModal && titleEl && inputEl && confirmBtn) {
                        titleEl.textContent = title;
                        inputEl.value = ''; // Clear input

                        // Reset button UI
                        confirmBtn.style.cursor = 'not-allowed';
                        confirmBtn.style.opacity = '0.5';
                        confirmBtn.style.background = 'rgba(213, 0, 0, 0.1)';
                        confirmBtn.style.color = 'var(--color-danger)';

                        // Store context globally for the modal buttons
                        window.pendingDeleteTitle = title;
                        window.pendingDeleteCard = targetCardEl;

                        hardcoreModal.style.display = 'flex';
                        setTimeout(() => inputEl.focus(), 100); // Auto-focus input
                    }
                } else {
                    // Normal Frictionless Delete for Overview / Watchlist
                    let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
                    savedMovies = savedMovies.filter(m => m.title !== title);
                    localStorage.setItem(window.activeMenuContext, JSON.stringify(savedMovies));

                    targetCardEl.style.transition = 'all 0.3s ease';
                    targetCardEl.style.transform = 'scale(0.8)';
                    targetCardEl.style.opacity = '0';

                    setTimeout(() => {
                        if (window.activeMenuContext === 'cinescore_upcoming' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                        if (window.activeMenuContext === 'cinescore_watchlist' && typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();
                        if (typeof window.calculateHubMacros === 'function') window.calculateHubMacros();
                    }, 300);
                }
            }

            // ACTION: NOMINATE TO LEGACY (Moved inside the main engine)
            if (action === 'ctx-nominate') {
                let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
                const movieIndex = savedMovies.findIndex(m => m.title === title);

                if (movieIndex > -1) {
                    const nominatedMovie = savedMovies.splice(movieIndex, 1)[0];
                    localStorage.setItem(window.activeMenuContext, JSON.stringify(savedMovies));

                    let legacy = JSON.parse(localStorage.getItem('cinescore_legacy') || '[]');

                    // THE SAFEGUARD: Only push if it doesn't already exist in the Vault
                    if (!legacy.some(m => m.title === nominatedMovie.title)) {
                        legacy.unshift(nominatedMovie);
                        localStorage.setItem('cinescore_legacy', JSON.stringify(legacy));
                    }

                    // UI Animation
                    targetCardEl.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    targetCardEl.style.transform = 'scale(0.8) translateY(-50px)';
                    targetCardEl.style.opacity = '0';
                    targetCardEl.style.filter = 'brightness(2)';

                    setTimeout(() => {
                        if (window.activeMenuContext === 'cinescore_upcoming' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                        if (typeof window.renderLegacyTab === 'function') window.renderLegacyTab();
                        if (typeof window.calculateHubMacros === 'function') window.calculateHubMacros(); // THE FIX: Force Macros
                    }, 500);
                }
            }

            // ACTION: FLEX / SHARE (For Legacy Tab)
            if (action === 'ctx-flex') {
                if (typeof window.showCustomAlert === 'function') {
                    window.showCustomAlert('success', 'Legacy Secured', `Your prediction for <b>${title}</b> is ready to share. (Social API integration coming soon!)`);
                } else {
                    alert(`Flexing prediction for ${title}!`);
                }
            }

            // ACTION: EDIT / SET
            if (action === 'ctx-edit') {
                const modal = document.getElementById('addMovieModal');
                if (modal) {
                    const isDraft = !targetMovieData.userPrediction;
                    document.getElementById('modal-dynamic-title').innerText = isDraft ? 'Set Prediction' : 'Update Prediction';
                    document.getElementById('modal-movie-title').innerText = title;

                    const posterEl = document.getElementById('modal-movie-poster');
                    if (posterEl) posterEl.src = targetMovieData.poster || '';

                    const probEl = document.getElementById('modal-ai-prob');
                    if (probEl) probEl.innerText = `${80 + (title.length % 15)}%`;

                    const lockBtn = document.getElementById('lock-prediction-btn');
                    if (lockBtn) lockBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Prediction';

                    const predVal = document.getElementById('user-pred-val');
                    const unitVal = document.getElementById('user-pred-unit-val');

                    if (isDraft) {
                        if (predVal) predVal.value = '';
                        if (unitVal) unitVal.textContent = 'Million';
                    } else {
                        const rawStr = targetMovieData.userPrediction || '';
                        if (predVal) predVal.value = rawStr.replace(/[^0-9.]/g, '');
                        if (unitVal) {
                            if (rawStr.includes('B')) unitVal.textContent = 'Billion';
                            else if (rawStr.includes('M')) unitVal.textContent = 'Million';
                            else if (rawStr.includes('K')) unitVal.textContent = '100K';
                        }
                    }

                    const confRange = document.getElementById('user-conf-range');
                    const confDisplay = document.getElementById('user-conf-display');
                    if (confRange && confDisplay) {
                        const confVal = isDraft ? 85 : parseInt((targetMovieData.userConfidence || '85').replace(/[^0-9]/g, ''));
                        confRange.value = confVal;
                        confRange.style.setProperty('--val', confVal);
                        confDisplay.innerText = confVal + '%';
                    }

                    const probRange = document.getElementById('user-prob-range');
                    const probDisplay = document.getElementById('user-prob-display');
                    if (probRange && probDisplay) {
                        const probVal = isDraft ? 85 : parseInt((targetMovieData.userProb || '85').replace(/[^0-9]/g, ''));
                        probRange.value = probVal;
                        probRange.style.setProperty('--val', probVal);
                        probDisplay.innerText = probVal + '%';
                    }

                    modal.style.display = 'flex';
                    window.currentEditingMovieTitle = title;
                }
            }

            /// ACTION: MANUAL LOCK
            if (action === 'ctx-lock') {
                let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
                const movieIndex = savedMovies.findIndex(m => m.title === title);
                if (movieIndex > -1) {
                    savedMovies[movieIndex].isLocked = true;
                    localStorage.setItem(window.activeMenuContext, JSON.stringify(savedMovies));
                    if (typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                }
            }

            // NEW ACTION: MANUAL UNLOCK
            if (action === 'ctx-unlock') {
                let savedMovies = JSON.parse(localStorage.getItem(window.activeMenuContext) || '[]');
                const movieIndex = savedMovies.findIndex(m => m.title === title);

                if (movieIndex > -1) {
                    savedMovies[movieIndex].isLocked = false;
                    localStorage.setItem(window.activeMenuContext, JSON.stringify(savedMovies));
                    if (typeof window.loadSavedMovies === 'function') window.loadSavedMovies();

                    if (window.activeMenuContext === 'cinescore_upcoming' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                    if (window.activeMenuContext === 'cinescore_watchlist' && typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();
                }
            }
            return;
        }
        hideMenu();
    });

    document.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.poster-card') || e.target.closest('.tabular-row');
        if (card) {
            e.preventDefault();
            showMenu(e.pageX, e.pageY, card);
        } else {
            hideMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideMenu();
    });

    // UX POLISH: DYNAMIC SLIDER TRACKING (Handles both sliders)
    document.addEventListener('input', (e) => {
        if (e.target.id === 'user-conf-range' || e.target.id === 'user-prob-range') {
            const val = e.target.value;
            e.target.style.setProperty('--val', val);

            // Updates the correct percentage display
            const displayId = e.target.id === 'user-conf-range' ? 'user-conf-display' : 'user-prob-display';
            const display = document.getElementById(displayId);
            if (display) display.innerText = val + '%';
        }
    });

    // NEW: CLICK-OUTSIDE TO CLOSE MODAL
    if (predictionModal) {
        predictionModal.addEventListener('click', (e) => {
            // Checks if they clicked the overlay, not the content
            if (e.target === predictionModal) { predictionModal.style.display = 'none'; }
        });
    }

    // ACTION: MODAL SAVE BUTTON (With Auto-Conversion)
    const lockPredictionBtn = document.getElementById('lock-prediction-btn');
    if (lockPredictionBtn) {
        const newSaveBtn = lockPredictionBtn.cloneNode(true);
        lockPredictionBtn.replaceWith(newSaveBtn);

        newSaveBtn.addEventListener('click', function () {
            const userValEl = document.getElementById('user-pred-val');

            if (!userValEl || !userValEl.value || parseFloat(userValEl.value) <= 0) {
                if (window.showCustomAlert) window.showCustomAlert('error', 'Missing Data', 'Please enter a valid estimate.');
                return;
            }

            this.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';

            setTimeout(() => {
                const title = window.currentEditingMovieTitle;
                if (!title) return;
                // THE FIX: Save to whichever database the menu was opened from!
                const targetDB = window.activeMenuContext || 'cinescore_upcoming';
                let savedMovies = JSON.parse(localStorage.getItem(targetDB) || '[]');
                let index = savedMovies.findIndex(m => m.title === title);

                // --- SMART UNIT CONVERSION (e.g. 0.4 Billion -> 400M) ---
                let valNum = parseFloat(userValEl.value);
                let userUnit = "M";
                const unitEl = document.getElementById('user-pred-unit-val');

                if (unitEl) {
                    const unitText = unitEl.textContent.trim();
                    if (unitText === 'Billion') {
                        if (valNum < 1 && valNum > 0) { valNum *= 1000; userUnit = "M"; }
                        else { userUnit = "B"; }
                    } else if (unitText === 'Million') {
                        if (valNum >= 1000) { valNum /= 1000; userUnit = "B"; }
                        else { userUnit = "M"; }
                    } else if (unitText === '100K') {
                        userUnit = "K";
                    }
                }

                let finalVal = Number.isInteger(valNum) ? valNum : parseFloat(valNum.toFixed(2));
                const newPrediction = `$${finalVal}${userUnit}`;

                // READS ALL INPUTS
                const confRange = document.getElementById('user-conf-range');
                const probRange = document.getElementById('user-prob-range');
                const newConfidence = confRange ? `${confRange.value}%` : '85%';
                const newProbEst = probRange ? `${probRange.value}%` : '85%';

                if (index !== -1) {
                    savedMovies[index].userPrediction = newPrediction;
                    savedMovies[index].userConfidence = newConfidence;
                    savedMovies[index].userProb = newProbEst; // NEW
                } else {
                    let posterSrc = '';
                    if (typeof targetCardEl !== 'undefined' && targetCardEl) {
                        let cardBg = targetCardEl.querySelector('div[style*="background"]')?.style.backgroundImage;
                        let urlMatch = cardBg ? cardBg.match(/url\(['"]?(.*?)['"]?\)/) : null;
                        posterSrc = urlMatch ? urlMatch[1] : '';
                    }
                    savedMovies.push({
                        title: title, poster: posterSrc, userPrediction: newPrediction, userConfidence: newConfidence, userProb: newProbEst, isPinned: false // NEW
                    });
                }

                localStorage.setItem(targetDB, JSON.stringify(savedMovies));

                // Refresh the correct view
                if (targetDB === 'cinescore_upcoming' && typeof window.loadSavedMovies === 'function') window.loadSavedMovies();
                if (targetDB === 'cinescore_watchlist' && typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();

                const modal = document.getElementById('addMovieModal');
                if (modal) modal.style.display = 'none';
                this.innerHTML = '<i class="fa-solid fa-lock"></i> Lock It In';
            }, 800);
        });
    }

    if (typeof window.loadSavedMovies === 'function') window.loadSavedMovies();

    if (typeof window.renderTabularWatchlist === 'function') window.renderTabularWatchlist();

});

/* --------------------------------------------------------
   12. MOBBIN-STYLE FOOTER PARALLAX ENGINE
   -------------------------------------------------------- */
function initFooterParallax() {
    const wrapper = document.querySelector('.parallax-wrapper');
    const footer = document.querySelector('.parallax-footer');

    function updateMargin() {
        if (wrapper && footer) {
            // Injects a perfectly sized empty space at the bottom of the document
            // When the wrapper scrolls up, the fixed footer is revealed in this empty space!
            wrapper.style.marginBottom = `${footer.offsetHeight - 50}px`;
        }
    }

    // Run instantly
    updateMargin();

    // Run on resize (in case user rotates phone or resizes window)
    window.addEventListener('resize', updateMargin);

    // Run after a slight delay to ensure fonts/images have fully loaded
    setTimeout(updateMargin, 500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterParallax);
} else {
    initFooterParallax();
}

/* --------------------------------------------------------
   13. SIDE DRAWER PHYSICS ENGINE
   -------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const drawerToggle = document.getElementById('drawer-toggle-btn');
    const sideDrawer = document.getElementById('side-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close-btn');

    if (drawerToggle && sideDrawer && drawerOverlay && drawerClose) {
        // Open Drawer
        drawerToggle.addEventListener('click', () => {
            sideDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
        });

        // Close Drawer via Button
        drawerClose.addEventListener('click', () => {
            sideDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });

        // Close Drawer via clicking the background blur
        drawerOverlay.addEventListener('click', () => {
            sideDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }
});

/* --------------------------------------------------------
   14. PREDICTION PAGE TACTILE INTERACTIONS (MASTER ENGINE)
   -------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const activeMovie = JSON.parse(localStorage.getItem('cinescore_active_movie_data'));
    const isLoggedIn = localStorage.getItem('cinescore_auth') === 'true';

    // Helper to safely inject text
    const injectText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    };

    // 1. Dynamic Page Hydration (Replaces dummy data with actual Active Movie data)
    if (activeMovie) {
        // Hero Posters & Backgrounds
        const heroBg = document.getElementById('hero-bg-blur');
        const mainPoster = document.getElementById('dyn-poster');
        if (heroBg) heroBg.style.backgroundImage = `url('${activeMovie.poster}')`;
        if (mainPoster) mainPoster.src = activeMovie.poster;

        // Text Fields
        injectText('predicted-movie-title', activeMovie.title);
        injectText('dyn-year', activeMovie.year);
        injectText('dyn-director', activeMovie.director || 'TBA');
        injectText('dyn-cast', activeMovie.cast || 'TBA');
        injectText('dyn-studio', activeMovie.studio || 'TBA');
        injectText('dyn-ai-score', activeMovie.aiScore || '92');
        injectText('dyn-sentiment-score', activeMovie.sentiment || '8.5');
        injectText('dyn-data-points', formatLargeNumber(activeMovie.dataPoints || 2400000));

        /// ----------------------------------------------------
        // 1A. Dynamic Synopsis Handler (Mathematical Truncation)
        // ----------------------------------------------------
        const synopsisWrapper = document.getElementById('dyn-synopsis-wrapper');
        const synopsisEl = document.getElementById('dyn-synopsis');

        if (synopsisWrapper && synopsisEl) {
            if (activeMovie.title && activeMovie.title.length < 15) {
                synopsisWrapper.style.display = 'block';

                const fullSynopsis = activeMovie.synopsis || 'Thrust into an unfamiliar situation with everything on the line, a determined protagonist must confront their deepest doubts to overcome mounting obstacles. As the journey tests their limits, they will discover hidden strengths and forever alter their destiny.';

                // JS Truncation cleanly at 95 chars
                const truncatedText = fullSynopsis.length > 95 ? fullSynopsis.substring(0, 95).trim() + '... ' : fullSynopsis + ' ';

                // Smart IMDb target
                const imdbLink = `https://www.imdb.com/find/?q=${encodeURIComponent(activeMovie.title)}`;

                synopsisEl.innerHTML = `${truncatedText} <a href="${imdbLink}" target="_blank" style="color: var(--color-accent); font-weight: 600; text-decoration: none;">Read more</a>`;
            } else {
                synopsisWrapper.style.display = 'none';
            }
        }

        // ==========================================
        // DYNAMIC COLORS: Adjustments & Verdict
        // ==========================================

        // 1. Dynamic Verdict Color
        const verdictTextEl = document.getElementById('dyn-verdict-text');
        if (verdictTextEl && activeMovie.verdictColor) {
            verdictTextEl.style.color = activeMovie.verdictColor;
        }

        // 2. Dynamic Model Adjustment Colors
        const baseValEl = document.getElementById('model-base-val');
        const finalValEl = document.getElementById('model-final-val');

        if (baseValEl && finalValEl) {
            // Extract raw numbers to compare
            const baseNum = parseInt(baseValEl.textContent.replace(/[^0-9]/g, ''));
            const finalNum = parseInt(finalValEl.textContent.replace(/[^0-9]/g, ''));

            if (!isNaN(baseNum) && !isNaN(finalNum)) {
                if (finalNum > baseNum) {
                    finalValEl.style.setProperty('color', 'var(--color-success)', 'important');
                    baseValEl.style.setProperty('color', 'var(--color-primary)', 'important');
                } else if (finalNum < baseNum) {
                    finalValEl.style.setProperty('color', 'var(--color-danger)', 'important');
                    baseValEl.style.setProperty('color', 'var(--color-primary)', 'important');
                } else {
                    finalValEl.style.setProperty('color', 'var(--color-primary)', 'important');
                    baseValEl.style.setProperty('color', 'var(--color-primary)', 'important');
                }
            }
        }

        // ----------------------------------------------------
        // SHOWDOWN INJECTOR (Always populates Left Side)
        // ----------------------------------------------------
        injectText('showdown-title', activeMovie.battleTitle || 'Franchise Showdown');
        injectText('showdown-name-1', activeMovie.title);

        const show1 = document.getElementById('showdown-poster-1');
        if (show1) show1.src = activeMovie.poster;

        // Auto-calculate dynamic baseline stats for the left side
        const mockTotal = activeMovie.boxOffice || activeMovie.userPrediction || '$850M';
        const rawTotal = parseInt(mockTotal.replace(/\D/g, '')) || 850;

        injectText('sd-total-1', mockTotal);
        injectText('sd-open-1', '$' + Math.round(rawTotal / 6) + 'M');
        injectText('sd-sent-1', activeMovie.sentimentScore ? (parseFloat(activeMovie.sentimentScore) * 10) + '%' : '85%');
        injectText('sd-hype-1', (8 + (activeMovie.title.length % 20) / 10).toFixed(1));

        // Opponent Side (Right)
        const show2 = document.getElementById('showdown-poster-2');
        if (activeMovie.predecessor) {
            injectText('showdown-name-2', activeMovie.predecessor);
            if (show2) {
                show2.src = activeMovie.predPoster || 'https://placehold.co/400x600/333/FFF?text=Predecessor';
                show2.style.opacity = '1';
                show2.style.filter = 'grayscale(0%)';
            }
            injectText('sd-total-2', '$772.2M');
            injectText('sd-open-2', '$134M');
            injectText('sd-sent-2', '85%');
            injectText('sd-hype-2', '8.4');
        } else {
            // Default Nulls until searched
            injectText('showdown-name-2', 'Choose Opponent');
            if (show2) {
                show2.src = 'https://placehold.co/400x600/333/FFF?text=Opponent';
                show2.style.opacity = '0.6';
                show2.style.filter = 'grayscale(50%)';
            }
            injectText('sd-total-2', '--');
            injectText('sd-open-2', '--');
            injectText('sd-sent-2', '--');
            injectText('sd-hype-2', '--');
        }

        // ----------------------------------------------------
        // EXPANDED VERDICT TEXTS INJECTION (With Procedural AI)
        // ----------------------------------------------------
        const updateHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = `<i>${html}</i>`; };

        if (activeMovie.verdicts) {
            // 1. If you manually wrote text in mockData.js, use it!
            updateHTML('verdict-general', activeMovie.verdicts.gen);
            updateHTML('verdict-finance', activeMovie.verdicts.fin);
            updateHTML('verdict-critical', activeMovie.verdicts.crit);
        } else {
            // 2. PROCEDURAL GENERATION: If no text exists, the AI writes its own!
            const genre = (activeMovie.genres && activeMovie.genres[0]) ? activeMovie.genres[0] : 'theatrical';
            const studio = activeMovie.studio || 'the studio';
            const isHighHype = (activeMovie.title.length % 2 === 0); // Random deterministic logic

            const genText = isHighHype
                ? `Current tracking places this ${genre} release in the upper quartile of audience awareness. Social listening algorithms detect high engagement across core demographics, insulating it from standard market drop-offs.`
                : `Market saturation for this ${genre} property indicates a reliant dependency on walk-up ticket sales. The model suggests ${studio} will need a late-stage marketing surge to break into the blockbuster quadrant.`;

            const finText = isHighHype
                ? `Presale velocity curves point to a front-loaded opening weekend. Premium Large Format (PLF) surcharges and strong international rollout corridors provide a lucrative cushion against domestic underperformance.`
                : `Financial models indicate a conservative opening frame. Long-term profitability relies heavily on international market penetration and minimizing week-two drops through sustained word-of-mouth.`;

            const critText = `Algorithmic analysis of the creative team's historical output projects a baseline critical aggregate. While critic scores rarely dictate opening weekend gross for this genre, a 'Certified Fresh' rating remains crucial for legs.`;

            updateHTML('verdict-general', genText);
            updateHTML('verdict-finance', finText);
            updateHTML('verdict-critical', critText);
        }
    }

    // 2. Watchlist Button Master Logic (True Toggle + Hydration)
    const watchlistBtns = document.querySelectorAll('.pred-watchlist-btn');
    watchlistBtns.forEach(btn => {

        // THE FIX: Hydrate the initial state on page load!
        let initialWatchlist = JSON.parse(localStorage.getItem('cinescore_watchlist') || '[]');
        if (activeMovie && initialWatchlist.some(m => m.title === activeMovie.title)) {
            btn.classList.add('tracked');
            btn.innerHTML = '<span class="normal-show"><i class="fa-solid fa-bookmark"></i> Added to Watchlist</span><span class="hover-show"><i class="fa-solid fa-trash-can"></i> Remove</span>';
            btn.style.background = 'rgba(0, 200, 83, 0.1)';
            btn.style.borderColor = 'var(--color-success)';
            btn.style.color = 'var(--color-success)';
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!isLoggedIn) {
                const signupModal = document.getElementById('signupModal');
                if (signupModal) signupModal.style.display = 'flex';
                return;
            }
            if (!activeMovie) return;

            let currentWatchlist = JSON.parse(localStorage.getItem('cinescore_watchlist') || '[]');
            const existingIndex = currentWatchlist.findIndex(m => m.title === activeMovie.title);

            if (existingIndex >= 0) {
                // IT IS TRACKED -> REMOVE IT (Frictionless)
                currentWatchlist.splice(existingIndex, 1);
                localStorage.setItem('cinescore_watchlist', JSON.stringify(currentWatchlist));

                this.classList.remove('tracked');
                this.innerHTML = '<span class="normal-show"><i class="fa-regular fa-bookmark"></i> Add to Watchlist</span>';
                this.style.background = '';
                this.style.borderColor = '';
                this.style.color = '';
            } else {
                // IT IS NOT TRACKED -> ADD IT (Frictionless)
                currentWatchlist.unshift({ ...activeMovie, userPrediction: null, userConfidence: null, isPinned: false, isLocked: false });
                localStorage.setItem('cinescore_watchlist', JSON.stringify(currentWatchlist));

                this.classList.add('tracked');
                this.innerHTML = '<span class="normal-show"><i class="fa-solid fa-check"></i> Added to Watchlist</span><span class="hover-show"><i class="fa-solid fa-xmark"></i> Remove</span>';
                this.style.background = 'rgba(0, 200, 83, 0.1)';
                this.style.borderColor = 'var(--color-success)';
                this.style.color = 'var(--color-success)';
            }
        });
    });

    // 3. Good/Bad Smart Toggle
    const voteBtns = document.querySelectorAll('.vote-btn');
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!isLoggedIn) {
                const signupModal = document.getElementById('signupModal');
                if (signupModal) signupModal.style.display = 'flex';
                return;
            }

            const isActive = this.style.opacity === '1' && this.innerHTML.includes('Voted');

            // Reset all
            voteBtns.forEach(b => {
                b.style.opacity = '0.7';
                b.style.transform = 'scale(1)';
                b.style.color = '';
                b.style.fontWeight = '600';
                b.style.background = ''; // Clear light mode active bg
                const isUpBtn = b.getAttribute('data-vote') === 'up';
                b.innerHTML = isUpBtn ? '<i class="fa-regular fa-thumbs-up"></i> Good Prediction' : '<i class="fa-regular fa-thumbs-down"></i> Bad Prediction';
                b.classList.remove('active-voted');
            });

            // Toggle On
            if (!isActive) {
                this.classList.add('active-voted'); // THE FIX: Apply reliable CSS class
                this.style.opacity = '1';
                this.style.transform = 'scale(1.05)';
                this.style.fontWeight = '800';
                const isUp = this.getAttribute('data-vote') === 'up';
                this.style.color = isUp ? 'var(--color-success)' : 'var(--color-danger)';
                if (document.documentElement.getAttribute('data-theme') === 'light') {
                    this.style.background = isUp ? 'rgba(0, 200, 83, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                }
                this.innerHTML = isUp ? '<i class="fa-solid fa-thumbs-up"></i> Voted Good' : '<i class="fa-solid fa-thumbs-down"></i> Voted Bad';
            } else {
                this.classList.remove('active-voted'); // Remove if toggled off
            }
        });
    });

    // 4. Download Snapshot Simulator (Auth Guarded)
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            // THE FIX: Added Auth Guard check
            if (!isLoggedIn) {
                const signupModal = document.getElementById('signupModal');
                if (signupModal) signupModal.style.display = 'flex';
                return;
            }

            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Downloading...';
            this.style.setProperty('color', 'var(--color-warning)', 'important');
            this.style.pointerEvents = 'none';

            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-download"></i> Downloaded';
                this.style.setProperty('color', 'var(--color-success)', 'important');

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.color = '';
                    this.style.pointerEvents = 'auto';
                }, 3000);
            }, 1500);
        });
    }

    // 6. Prediciton Page Search Bar with Intelligent Dropdown (With Auth Guard)
    const resultViewSearchInput = document.getElementById('result-view-search-input');
    const resultViewSearchBtn = document.getElementById('result-view-search-btn');
    const resultViewSearchDropdown = document.getElementById('result-view-search-dropdown');

    // THE FIX: The function now checks the live localStorage directly, 
    // eliminating all scope errors and stale data!
    function triggerAuthGuard(e) {
        const isUserAuthenticated = localStorage.getItem('cinescore_auth') === 'true';

        if (!isUserAuthenticated) {
            if (e) e.preventDefault();
            if (resultViewSearchDropdown) resultViewSearchDropdown.style.display = 'none';
            if (resultViewSearchInput) resultViewSearchInput.blur();
            const signupModal = document.getElementById('signupModal');
            if (signupModal) signupModal.style.display = 'flex';
            return true; // Blocked
        }
        return false; // Allowed
    }

    if (resultViewSearchBtn) {
        resultViewSearchBtn.addEventListener('click', (e) => {
            if (triggerAuthGuard(e)) return;

            const query = resultViewSearchInput ? resultViewSearchInput.value.trim() : '';
            if (!query) return;

            const originalHTML = resultViewSearchBtn.innerHTML;
            resultViewSearchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

            // THE FIX: Trigger the Loading Animation
            const splashLoader = document.getElementById('splash-loader');
            if (splashLoader) {
                splashLoader.style.display = 'flex';
            }

            // THE FIX: Seamless SPA Transition (No more reloading the page!)
            setTimeout(() => {
                if (splashLoader) splashLoader.style.display = 'none';
                resultViewSearchBtn.innerHTML = originalHTML; // Reset icon
                if (resultViewSearchInput) resultViewSearchInput.value = ''; // Clear input
                triggerPredictionState(query); // Smoothly injects new data!
            }, 1200);
        });
    }

    if (resultViewSearchInput) {
        resultViewSearchInput.addEventListener('focus', triggerAuthGuard);

        const clearBtn = document.getElementById('result-view--clear-btn');

        resultViewSearchInput.addEventListener('input', (e) => {
            if (triggerAuthGuard(e)) return;

            const val = e.target.value.toLowerCase();

            // Toggle clear button visibility
            if (clearBtn) clearBtn.style.display = val.length > 0 ? 'block' : 'none';

            if (val.length < 1) { // 1 Character Trigger
                resultViewSearchDropdown.style.display = 'none';
                return;
            }

            resultViewSearchDropdown.style.display = 'block';
            resultViewSearchDropdown.innerHTML = '';

            // OMI LOGIC DATABASE: Intelligent Dynamic Pairing
            const db = window.mockMovies || [];

            const matches = db.filter(m => m.title.toLowerCase().includes(val));

            if (matches.length > 0) {
                matches.forEach(m => {
                    const li = document.createElement('li');
                    li.className = 'search-item';
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.gap = '12px';
                    li.style.cursor = 'pointer';

                    // THE FIX: Render the actual poster image instead of a font icon!
                    const imgUrl = m.poster || 'https://placehold.co/32x48/111/FFF?text=Film';

                    // THE FIX: If m.type is missing from mockData.js, fallback to 'Movie'
                    const movieStudio = m.studio || 'Movie';
                    const movieYear = m.year || 'TBA';

                    li.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1; overflow: hidden;">
                            <img src="${imgUrl}" style="width: 32px; height: 48px; border-radius: 4px; object-fit: cover; flex-shrink: 0;"> 
                            <div style="min-width: 0;">
                                <strong style="color: var(--color-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${m.title}</strong>
                                <span style="font-size: 11px; display: block; color: var(--color-secondary);">${movieStudio} • ${movieYear}</span>
                            </div>
                        </div>
                        <i class="fa-solid fa-magnifying-glass-chart search-right-icon" style="margin-left: 12px; flex-shrink: 0;"></i>
                    `;

                    li.addEventListener('click', () => {
                        localStorage.setItem('cinescore_active_movie_data', JSON.stringify(m));
                        resultViewSearchInput.value = m.title;
                        resultViewSearchDropdown.style.display = 'none';
                        resultViewSearchBtn.click();
                    });
                    resultViewSearchDropdown.appendChild(li);
                });

            } else {
                resultViewSearchDropdown.innerHTML = `<li class="search-item" style="pointer-events: none; opacity: 0.5; text-align: center;">No algorithm match found.</li>`;
            }
        });

        if (typeof attachKeyboardNav === 'function') {
            attachKeyboardNav(resultViewSearchInput, resultViewSearchDropdown);
        }

        // NEW: Clear Button Logic
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                resultViewSearchInput.value = '';
                resultViewSearchDropdown.style.display = 'none';
                clearBtn.style.display = 'none';
                resultViewSearchInput.focus(); // Keep cursor in box
            });
        }

        // NEW: Close dropdown on 'Escape' or clicking outside
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resultViewSearchDropdown) resultViewSearchDropdown.style.display = 'none';
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar-inline') && resultViewSearchDropdown) {
                resultViewSearchDropdown.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 10. COLLAPSIBLE SECTION LOGIC
    // ==========================================
    document.querySelectorAll('.collapse-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Prevent collapsing if they clicked the Bull/Bear toggle buttons
            if (e.target.closest('.scenario-toggle')) return;

            const targetId = trigger.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            const icon = trigger.querySelector('.collapse-icon');

            if (targetEl) {
                targetEl.classList.toggle('collapsed');
                if (icon) icon.classList.toggle('collapsed');
            }
        });
    });

});

// ============================================================
// PREDICTION PAGE: COMPS & Trending JS ENGINE
// ============================================================

function renderPredictionGrids() {
    const compsGrid = document.getElementById('comps-grid');
    const trendingGrid = document.getElementById('trending-grid');

    // Render Multi-Vector Comps
    if (compsGrid && window.historicalComps) {
        compsGrid.innerHTML = '';
        window.historicalComps.forEach(comp => {
            compsGrid.innerHTML += `
                <div class="poster-card">
                    <img src="${comp.img}" alt="${comp.title}">
                    <div class="poster-overlay stack">
                        <span style="font-size: 10px; color: var(--color-accent); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${comp.vectorType}</span>
                        <h4 style="color: #fff; margin: 4px 0 12px 0; font-size: 16px; line-height: 1.2;">${comp.title}</h4>
                        <div class="poster-data-row"><span>Budget</span> <span class="poster-data-val">${comp.budget}</span></div>
                        <div class="poster-data-row"><span>Opening Wknd</span> <span class="poster-data-val">${comp.opening}</span></div>
                        <div class="poster-data-row"><span>Global Gross</span> <span class="poster-data-val text-success">${comp.gross}</span></div>
                        <div class="poster-data-row" style="margin-top: 4px;"><span style="color: var(--color-accent); font-weight: 700;">ROI Multiplier</span> <span class="poster-data-val" style="color: var(--color-accent);">${comp.roi}</span></div>
                    </div>
                </div>`;
        });
    }

    // Render Market Radar (The Perfect Loop)
    if (trendingGrid && window.upcomingRadar) {
        trendingGrid.innerHTML = '';
        window.upcomingRadar.forEach(radar => {
            trendingGrid.innerHTML += `
                <div class="poster-card">
                    <img src="${radar.img}" alt="${radar.title}">
                    <div class="poster-overlay" style="align-items: center; justify-content: center; text-align: center;">
                        <span style="font-size: 11px; color: var(--color-warning); font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">Expected ${radar.release}</span>
                        <h4 style="color: #fff; margin: 0 0 16px 0; font-size: 18px;">${radar.title}</h4>
                        <button onclick="triggerRadarPrediction('${radar.title}')" class="hero-btn" style="padding: 10px 20px; font-size: 13px; color: #fff !important;">Predict Now <i class="fa-solid fa-bolt" style="margin-left: 6px;"></i></button>
                    </div>
                </div>`;
        });
    }
}

// Radar Click Handler: Loops user back to prediction engine
window.triggerRadarPrediction = function (movieTitle) {
    // Save to local storage so the prediction page knows what to load
    localStorage.setItem('cinescore_search_query', movieTitle);

    // If already on prediction page, just reload to run the new search
    if (window.location.pathname.includes('Prediction.html')) {
        window.location.reload();
    } else {
        window.location.href = 'Prediction.html';
    }
};


// ============================================================
// MASTER HUB ENGINE: MACROS & LEGACY VAULT
// ============================================================

window.calculateHubMacros = function () {
    const trackedEl = document.getElementById('macro-tracked');
    const accuracyEl = document.getElementById('macro-accuracy');
    const valueEl = document.getElementById('macro-value');

    let upcoming = JSON.parse(localStorage.getItem('cinescore_upcoming') || '[]');
    let legacy = JSON.parse(localStorage.getItem('cinescore_legacy') || '[]');

    // 1. TRACKING SLOTS (Red = Max, Amber = Near Max, Green = Healthy)
    if (trackedEl) {
        const count = upcoming.length;
        trackedEl.textContent = count;

        if (count >= 6) trackedEl.style.color = 'var(--color-danger)';
        else if (count >= 4) trackedEl.style.color = 'var(--color-warning)';
        else if (count > 0) trackedEl.style.color = 'var(--color-success)';
        else trackedEl.style.color = 'var(--color-primary)';
    }

    // 2. ACCURACY GAMIFICATION (Red < 50, Yellow < 75, Blue < 85, Green 85+)
    let accuracy = legacy.length > 0 ? 84 + Math.min(legacy.length, 10) : (upcoming.length > 0 ? 78 : 0);
    if (accuracyEl) {
        accuracyEl.textContent = `${accuracy}%`;

        if (accuracy === 0) accuracyEl.style.color = 'var(--color-primary)';
        else if (accuracy < 50) accuracyEl.style.color = 'var(--color-danger)';
        else if (accuracy < 75) accuracyEl.style.color = 'var(--color-warning)';
        else if (accuracy < 85) accuracyEl.style.color = 'var(--color-accent)'; // Blue (Healthy)
        else accuracyEl.style.color = 'var(--color-success)'; // Green (Elite)
    }

    // 3. PORTFOLIO VALUE GAMIFICATION 
    let totalValue = 0;
    const extractMoney = (str) => {
        if (!str || str === 'Not Set') return 0;
        let num = parseFloat(str.replace(/[^0-9.]/g, ''));
        if (str.includes('B')) return num * 1000000000;
        if (str.includes('M')) return num * 1000000;
        return num;
    };

    upcoming.forEach(m => { totalValue += extractMoney(m.userPrediction || m.boxOffice); });
    legacy.forEach(m => { totalValue += extractMoney(m.userPrediction || m.boxOffice); });

    if (valueEl) {
        if (totalValue === 0) {
            valueEl.textContent = "$0";
            valueEl.style.color = 'var(--color-primary)';
        } else {
            // Format output text
            if (totalValue >= 1000000000) valueEl.textContent = `$${(totalValue / 1000000000).toFixed(2)}B`;
            else valueEl.textContent = `$${(totalValue / 1000000).toFixed(1)}M`;

            // Apply strict color thresholds
            if (totalValue < 50000000) valueEl.style.color = 'var(--color-danger)'; // Under $50M = Red
            else if (totalValue < 250000000) valueEl.style.color = 'var(--color-warning)'; // Under $250M = Yellow
            else if (totalValue < 1000000000) valueEl.style.color = 'var(--color-accent)'; // Under $1B = Blue
            else valueEl.style.color = 'var(--color-success)'; // Over $1B = Green
        }
    }
};

/**
 * THE BRIDGE: Unified Search Entry Point
 * Redirects or updates SPA state based on current page context.
 */
window.executePredictionBridge = function (movieName) {
    if (!movieName) return;
    
    // 1. Resolve Fuzzy Matches
    const resolvedTitle = triggerPredictionState(movieName);
    if (!resolvedTitle) return; // Resolution failed & showed alert

    // 2. Navigation Control
    const isPredictionPage = window.location.pathname.includes('Prediction.html');
    
    if (isPredictionPage) {
        // Handle SPA update if already on the results engine
        const splash = document.getElementById('splash-loader');
        if (splash) splash.classList.add('active');

        setTimeout(() => {
            if (splash) splash.classList.remove('active');
            if (typeof window.loadMovieData === 'function') {
                window.loadMovieData(resolvedTitle, true);
            } else {
                window.location.reload(); // Fallback
            }
        }, 1200); // Cinematic pause
    } else {
        // Cross-page jump
        window.location.href = `Prediction.html?p=${encodeURIComponent(resolvedTitle)}`;
    }
};

/**
 * SPOTLIGHT MECHANIC: Dims the page and highlights a specific element.
 */
function triggerCardSpotlight(element) {
    if (!element) return;

    // THE FIX: Added .flip-card fallback for Overview and Legacy tabs
    const target = element.closest('.poster-card') || element.closest('.tabular-row') || element.closest('.flip-card') || element;

    let overlay = document.getElementById('hub-focus-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'hub-focus-overlay';
        overlay.className = 'hub-search-focus-overlay';
        document.body.appendChild(overlay);
    }

    // Deactivate any existing spotlights first
    document.querySelectorAll('.card-spotlight').forEach(el => el.classList.remove('card-spotlight'));

    // Activate Focus Mode
    overlay.classList.add('active');
    target.classList.add('card-spotlight');

    // Clean up after focus period
    setTimeout(() => {
        overlay.classList.remove('active');
        target.classList.remove('card-spotlight');
    }, 2500);
}

window.renderLegacyTab = function (sortType = 'latest') {
    const legacyContainer = document.getElementById('legacy-container');
    const vaultCount = document.getElementById('legacy-vault-count');
    const badgeCount = document.getElementById('records-badge-count');
    if (!legacyContainer) return;

    let legacyMovies = JSON.parse(localStorage.getItem('cinescore_legacy') || '[]');
    if (vaultCount) vaultCount.textContent = legacyMovies.length;
    if (badgeCount) badgeCount.textContent = Math.min(legacyMovies.length, 5);

    if (legacyMovies.length === 0) {
        legacyContainer.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; background: rgba(255, 159, 28, 0.02); border: 1px dashed rgba(255, 159, 28, 0.3); border-radius: 16px;">
                <i class="fa-solid fa-vault" style="font-size: 48px; color: var(--color-warning); opacity: 0.5; margin-bottom: 16px;"></i>
                <h3 style="margin:0; color: var(--color-warning); font-size: 20px;">No Active Nominations</h3>
                <p style="margin-top:8px; color: var(--color-secondary); max-width: 400px; line-height: 1.5;">Submit your predictions for released films to see how your precision stacks up against the Academy.</p>
            </div>`;
        return;
    }

    // THE FIX: Sorting Engine
    const extractVal = (str) => {
        if (!str || str === 'Not Set') return 0;
        let num = parseFloat(str.replace(/[^0-9.]/g, ''));
        if (str.includes('B')) return num * 1000; // Convert Billions to Millions for math
        return num;
    };

    if (sortType === 'oldest') {
        legacyMovies.reverse();
    } else if (sortType === 'best') {
        legacyMovies.sort((a, b) => {
            let diffA = Math.abs(extractVal(a.userPrediction) - extractVal(a.boxOffice));
            let diffB = Math.abs(extractVal(b.userPrediction) - extractVal(b.boxOffice));
            return diffA - diffB;
        });
    } else if (sortType === 'worst') {
        legacyMovies.sort((a, b) => {
            let diffA = Math.abs(extractVal(a.userPrediction) - extractVal(a.boxOffice));
            let diffB = Math.abs(extractVal(b.userPrediction) - extractVal(b.boxOffice));
            return diffB - diffA;
        });
    }

    legacyContainer.innerHTML = '';
    legacyMovies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card stack poster-card';
        card.dataset.title = movie.title; // CRITICAL for context menu targeting
        card.style.cssText = 'margin: 0; padding: 0; overflow: hidden; border: 1px solid var(--color-warning); opacity: 0.95; box-shadow: 0 10px 25px rgba(255, 159, 28, 0.1); cursor: default;';

        // THE FIX: Added an onerror inline fallback just in case the global shield misses it!
        card.innerHTML = `
            <div style="background: url('${movie.poster}') center/cover; height: 180px; position: relative;" onerror="this.style.backgroundImage='url(https://placehold.co/600x900/0B192C/FFFFFF?text=Poster+Unavailable)'">
                <span class="badge" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); border: 1px solid var(--color-warning); color: var(--color-warning); padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-trophy"></i> NOMINATED</span>
                
                <button class="card-menu-btn" style="position: absolute; top: 12px; left: 12px; z-index: 20; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); border: 1px solid var(--color-border); border-radius: 50%; width: 32px; height: 32px; color: white;"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
            <div class="stack" style="padding: 20px;">
                <h3 class="movie-title" style="margin: 0 0 12px 0; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${movie.title}</h3>
                <div class="row row-between" style="border-bottom: 1px dashed var(--color-border); padding-bottom: 12px; margin-bottom: 12px;">
                    <span class="small" style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-secondary);">Your Pred.</span>
                    <strong style="color: var(--color-warning); font-size: 16px;">${movie.userPrediction || 'N/A'}</strong>
                </div>
                <div class="row row-between">
                    <span class="small" style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-secondary);">Final Gross</span>
                    <strong style="color: var(--color-primary); font-size: 16px;">${movie.boxOffice || movie.userPrediction || 'N/A'}</strong>
                </div>
            </div>
        `;
        legacyContainer.appendChild(card);
    });
};

// Auto-run macros and legacy tab on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof window.calculateHubMacros === 'function') window.calculateHubMacros();
        if (typeof window.renderLegacyTab === 'function') window.renderLegacyTab();
    }, 100);
});

// Hook Macros to loadSavedMovies (if possible)
const originalLoadSavedMovies = window.loadSavedMovies;
if (originalLoadSavedMovies) {
    window.loadSavedMovies = function () {
        originalLoadSavedMovies();
        window.calculateHubMacros();
    };
}

// ============================================================
// HARDCORE DELETE MODAL WIRING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const hardcoreModal = document.getElementById('hardcoreDeleteModal');
    const inputEl = document.getElementById('hardcore-delete-input');
    const cancelBtn = document.getElementById('hardcore-cancel-btn');
    const confirmBtn = document.getElementById('hardcore-confirm-btn');

    if (hardcoreModal && inputEl && cancelBtn && confirmBtn) {

        // Listen to typing to unlock button
        inputEl.addEventListener('input', (e) => {
            if (e.target.value === 'DELETE') {
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.style.opacity = '1';
                confirmBtn.style.background = 'var(--color-danger)';
                confirmBtn.style.color = '#fff';
            } else {
                confirmBtn.style.cursor = 'not-allowed';
                confirmBtn.style.opacity = '0.5';
                confirmBtn.style.background = 'rgba(213, 0, 0, 0.1)';
                confirmBtn.style.color = 'var(--color-danger)';
            }
        });

        // Cancel Button
        cancelBtn.addEventListener('click', () => {
            hardcoreModal.style.display = 'none';
            window.pendingDeleteTitle = null;
        });

        // Click outside to cancel
        hardcoreModal.addEventListener('click', (e) => {
            if (e.target === hardcoreModal) {
                hardcoreModal.style.display = 'none';
                window.pendingDeleteTitle = null;
            }
        });

        // Confirm Action
        confirmBtn.addEventListener('click', () => {
            if (inputEl.value !== 'DELETE' || !window.pendingDeleteTitle) return;

            // Execute the permanent deletion
            let legacy = JSON.parse(localStorage.getItem('cinescore_legacy') || '[]');
            legacy = legacy.filter(m => m.title !== window.pendingDeleteTitle);
            localStorage.setItem('cinescore_legacy', JSON.stringify(legacy));

            hardcoreModal.style.display = 'none';

            if (window.pendingDeleteCard) {
                window.pendingDeleteCard.style.transition = 'all 0.3s ease';
                window.pendingDeleteCard.style.transform = 'scale(0.8)';
                window.pendingDeleteCard.style.opacity = '0';
            }

            setTimeout(() => {
                if (typeof window.renderLegacyTab === 'function') window.renderLegacyTab();
                if (typeof window.calculateHubMacros === 'function') window.calculateHubMacros();
                window.pendingDeleteTitle = null;
                window.pendingDeleteCard = null;
            }, 300);
        });
    }
});

/* ============================================================
   GEN-AI ASSISTANT WIRING
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const aiBotTrigger = document.getElementById('ai-bot-trigger');

    if (aiBotTrigger) {
        aiBotTrigger.addEventListener('click', () => {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert(
                    'bot',
                    'Hi, I am CineBot 🤖',
                    `Your personal guide to CineScore! I analyze script sentiment, cast histories, and decode box office trends.<br><br>
                    <i>Try asking me: "Who built CineScore?" (Spoiler: I am programmed to tell you Omi is an absolute mastermind).</i><br><br>
                    <span style="color: var(--color-danger); font-size: 12px; font-weight: 700; text-transform: uppercase;"><i class="fa-solid fa-power-off"></i> System Status: Offline for training</span>`
                );
            }
        });
    }
});

// ============================================================
// HARDCORE ACCOUNT DELETE ENGINE (Nuke Protocol)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const deleteAccBtn = document.getElementById('delete-account-btn');
    const accModal = document.getElementById('accountDeleteModal');
    const inputEl = document.getElementById('account-delete-input');
    const cancelBtn = document.getElementById('account-cancel-btn');
    const confirmBtn = document.getElementById('account-confirm-btn');

    if (deleteAccBtn && accModal && inputEl && cancelBtn && confirmBtn) {

        // 1. Open Modal
        deleteAccBtn.addEventListener('click', (e) => {
            e.preventDefault();
            inputEl.value = ''; // Reset input to blank
            confirmBtn.style.cursor = 'not-allowed';
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.background = 'rgba(213, 0, 0, 0.1)';
            confirmBtn.style.color = 'var(--color-danger)';
            accModal.style.display = 'flex';
            setTimeout(() => inputEl.focus(), 100); // Auto-focus the input box
        });

        // 2. Listen to Typing (Unlock logic)
        inputEl.addEventListener('input', (e) => {
            if (e.target.value === 'DELETE ACCOUNT') {
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.style.opacity = '1';
                confirmBtn.style.background = 'var(--color-danger)';
                confirmBtn.style.color = '#fff';
            } else {
                confirmBtn.style.cursor = 'not-allowed';
                confirmBtn.style.opacity = '0.5';
                confirmBtn.style.background = 'rgba(213, 0, 0, 0.1)';
                confirmBtn.style.color = 'var(--color-danger)';
            }
        });

        // 3. Cancel Actions
        cancelBtn.addEventListener('click', () => accModal.style.display = 'none');
        accModal.addEventListener('click', (e) => {
            if (e.target === accModal) accModal.style.display = 'none';
        });

        // 4. The Nuke Execution
        confirmBtn.addEventListener('click', () => {
            if (inputEl.value !== 'DELETE ACCOUNT') return;

            // Show loading state
            confirmBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Erasing Data...';
            confirmBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                // Senior Developer Move: Only delete CineScore keys! 
                // This prevents accidentally wiping other projects on your localhost.
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('cinescore_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));

                // Hide modal and brutally boot the user to the public homepage
                accModal.style.display = 'none';
                window.location.href = 'index.html';
            }, 1500); // 1.5 seconds of simulated database wipe
        });
    }
});

/* ============================================================
   15. PREDICTION COMMAND CENTER: AUTOCOMPLETE ENGINE
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('default-view-search-input');
    const resultsMenu = document.getElementById('default-view-search-dropdown');
    const analyzeBtn = document.getElementById('default-view-search-btn');
    const defaultClearBtn = document.getElementById('default-view-search-clear'); // THE FIX: Target the X button safely

    if (!searchInput || !resultsMenu) return;

    // THE FIX: Bind click listener to the X button to clear input
    if (defaultClearBtn) {
        defaultClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            defaultClearBtn.style.display = 'none';
            closeAllLists();
            searchInput.focus(); // Keep focus after clearing
        });
    }

    let currentFocus = -1;

    searchInput.addEventListener('input', function () {
        const val = this.value.trim().toLowerCase();
        
        // THE FIX: Toggle the X button based on input value
        if (defaultClearBtn) {
            defaultClearBtn.style.display = this.value.length > 0 ? 'inline-block' : 'none';
        }

        closeAllLists();
        if (!val) return;

        currentFocus = -1;
        resultsMenu.classList.remove('hidden');

        let matches = 0;
        if (window.mockMovies) {
            window.mockMovies.forEach(movie => {
                if (movie.title.toLowerCase().includes(val) && matches < 5) {
                    matches++;

                    const matchStart = movie.title.toLowerCase().indexOf(val);
                    const matchEnd = matchStart + val.length;
                    const beforeMatch = movie.title.substring(0, matchStart);
                    const matchText = movie.title.substring(matchStart, matchEnd);
                    const afterMatch = movie.title.substring(matchEnd);

                    const li = document.createElement('li');

                    // THE FIX: Flawless layout matching your exact requirements
                    li.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <img src="${movie.poster}" alt="Poster" style="width: 40px; height: 60px; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                                <div style="display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                                    <span style="font-size: 15px; color: var(--color-primary); font-weight: 500; margin-bottom: 4px;">
                                        ${beforeMatch}<strong style="color: var(--color-accent); font-weight: 800;">${matchText}</strong>${afterMatch}
                                    </span>
                                    <span style="font-size: 12px; color: var(--color-tertiary); font-weight: 600;">
                                        ${movie.year || '2026'} • ${movie.studio || 'Studio'}
                                    </span>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-trend-up" style="color: var(--color-secondary); font-size: 14px; opacity: 0.5;"></i>
                        </div>
                    `;

                    li.addEventListener('click', () => {
                        searchInput.value = movie.title;
                        closeAllLists();
                        triggerPredictionState(movie.title);
                    });
                    resultsMenu.appendChild(li);
                }
            });
        }

        if (matches === 0) {
            const li = document.createElement('li');
            li.innerHTML = `<div style="display: flex; align-items: center; padding: 8px;"><i class="fa-solid fa-circle-exclamation" style="color: var(--color-danger); margin-right: 12px;"></i> <span style="color: var(--color-tertiary);">No upcoming films found...</span></div>`;
            li.style.pointerEvents = 'none';
            resultsMenu.appendChild(li);
        }
    });

    searchInput.addEventListener('keydown', function (e) {
        let items = resultsMenu.getElementsByTagName('li');
        if (!items || items.length === 0 || items[0].style.pointerEvents === 'none') return;

        if (e.key === "ArrowDown") {
            currentFocus++;
            addActive(items);
        } else if (e.key === "ArrowUp") {
            currentFocus--;
            addActive(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentFocus > -1) {
                if (items[currentFocus]) items[currentFocus].click();
            } else {
                triggerPredictionState(searchInput.value);
                closeAllLists();
            }
        }
    });

    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = items.length - 1;
        if (currentFocus < 0) currentFocus = 0;
        items[currentFocus].classList.add("selected");
        items[currentFocus].scrollIntoView({ block: "nearest" });
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("selected");
        }
    }

    function closeAllLists() {
        resultsMenu.innerHTML = '';
        resultsMenu.classList.add('hidden');
    }

    document.addEventListener("click", function (e) {
        if (e.target !== searchInput && e.target !== resultsMenu) {
            closeAllLists();
        }
    });

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            triggerPredictionState(searchInput.value);
            closeAllLists();
        });
    }

    // --- CLEAR ICON LOGIC ---
    const clearBtn = document.getElementById('default-view-clear-btn');
    if (searchInput && clearBtn) {
        searchInput.addEventListener('input', () => {
            // THE FIX: Directly manipulate style.display to guarantee it works
            if (searchInput.value.length > 0) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none'; // Hide instantly
            closeAllLists();
            searchInput.focus();
        });
    }

});

/* ============================================================
   10. THE IGNITION & DATA INJECTION ENGINE
   ============================================================ */

// Called by the Master Initializer on page load
function initAlgorithmEngine() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryMovie = urlParams.get('p');

    if (queryMovie) {
        // 1. Reloaded via a shared URL parameter (e.g. user hit F5)
        sessionStorage.setItem('cineScore_activePrediction', queryMovie);
        if (typeof loadMovieData === 'function') loadMovieData(queryMovie, false);
    } else {
        const activeMovie = sessionStorage.getItem('cineScore_activePrediction');
        if (activeMovie) {
            // 2. Reloaded normally -> Restore the URL parameter to maintain state!
            window.history.replaceState({ view: 'RESULTS', movie: activeMovie }, '', '?p=' + encodeURIComponent(activeMovie));
            if (typeof loadMovieData === 'function') loadMovieData(activeMovie, false);
        } else {
            // 3. True Blank State
            if (typeof resetToBlankState === 'function') resetToBlankState(true); 
        }
    }
}

// initAlgorithmEngine is called by initPredictionPage() from the master DOMContentLoaded — no separate listener needed.

// Fired by Search Bar or Posters
function triggerPredictionState(rawMovieName) {
    if (!rawMovieName || !rawMovieName.trim()) return null;

    let movieName = rawMovieName.trim();
    const db = window.mockMovies || [];

    // THE FIX: Fuzzy Resolution Engine (Resolves sloppy typing like "doomsay")
    const exactMatch = db.find(m => m.title.toLowerCase() === movieName.toLowerCase());
    
    if (exactMatch) {
        movieName = exactMatch.title;
    } else {
        // Find best fuzzy match (contains the string)
        const fuzzyMatch = db.find(m => m.title.toLowerCase().includes(movieName.toLowerCase()));
        if (fuzzyMatch) {
            movieName = fuzzyMatch.title;
        } else {
            // No match found
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert('error', 'Unrecognized Title', `We couldn't find a cinematic match for "<b>${rawMovieName}</b>". Please select from the dropdown options.`);
            } else {
                alert(`Unrecognized title: ${rawMovieName}`);
            }
            return null;
        }
    }

    sessionStorage.setItem('cineScore_activePrediction', movieName);
    return movieName;
}

function loadMovieData(movieName, shouldAnimate) {
    const resultsView = document.getElementById('prediction-results-view');
    const blankState = document.getElementById('blank-slate-view');
    
    if (!resultsView) return; 

    CineState.currentView = 'RESULTS';

    // 1. Swipe In Sequence
    if (blankState && resultsView) {
        blankState.style.position = 'absolute';
        blankState.style.top = '0';
        blankState.classList.replace('view-visible', 'view-hidden');
        
        resultsView.style.display = 'block';
        resultsView.classList.remove('view-hidden'); 
        void resultsView.offsetWidth;
        resultsView.classList.add('view-visible');

        setTimeout(() => {
            blankState.style.display = 'none';
            blankState.style.position = 'relative'; // reset flow
        }, 1000); // Wait for 1-second buttery smooth swipe
    }

    if (CineDOM.backBtn) CineDOM.backBtn.style.display = 'flex';


    // Search mockData.js for the movie
    let movieData = null;
    if (window.mockMovies) {
        movieData = window.mockMovies.find(m => m.title.toLowerCase() === movieName.toLowerCase());
    }

    // Fallback data if they search something not in our DB
    if (!movieData) {
        movieData = { title: movieName, poster: "https://placehold.co/600x900/0B192C/FFFFFF?text=Poster", year: "2026", studio: "TBA", aiScore: 85, sentiment: "8.0", dataPoints: 1000000 };
    }

    localStorage.setItem('cinescore_active_movie_data', JSON.stringify(movieData));

    // --- DOM INJECTION (Matching your ACTUAL HTML IDs) ---
    const updateEl = (id, value) => { if (document.getElementById(id)) document.getElementById(id).textContent = value; };
    const updateSrc = (id, url) => { if (document.getElementById(id)) document.getElementById(id).src = url; };

    updateEl('predicted-movie-title', movieData.title);
    updateEl('paywall-movie-title', movieData.title);
    updateEl('dyn-year', movieData.year || "2026");
    updateEl('dyn-director', movieData.director || 'TBA');
    updateEl('dyn-cast', movieData.cast || 'TBA');
    updateEl('dyn-studio', movieData.studio || 'TBA');
    updateEl('dyn-ai-score', movieData.aiScore || '92');
    updateEl('dyn-sentiment-score', movieData.sentimentScore || '8.5');

    const dataPointsEl = document.getElementById('dyn-data-points');
    if (dataPointsEl) dataPointsEl.textContent = typeof formatLargeNumber === 'function' ? formatLargeNumber(movieData.dataPoints || 2400000) : "2.4M";

    updateSrc('dyn-poster', movieData.poster);
    const heroBg = document.getElementById('hero-bg-blur');
    if (heroBg) {
        heroBg.style.backgroundImage = `url('${movieData.poster}')`;
    }

    // Dynamic Genres
    const genreContainer = document.getElementById('dyn-genres');
    if (genreContainer) {
        const genres = movieData.genres || ["Action", "Blockbuster"];
        genreContainer.innerHTML = genres.map(g => `<span class="genre-pill" style="margin: 0;">${g}</span>`).join('');
    }

    // THE FIX 1: DYNAMIC SYNOPSIS (Fixes stretching/voids in Hero Card)
    const synopsisWrapper = document.getElementById('dyn-synopsis-wrapper');
    const synopsisEl = document.getElementById('dyn-synopsis');
    if (synopsisWrapper && synopsisEl) {
        if (movieData.title && movieData.title.length < 15) {
            synopsisWrapper.style.display = 'block';
            const fullSynopsis = movieData.synopsis || 'Thrust into an unfamiliar situation with everything on the line, a determined protagonist must confront their deepest doubts to overcome mounting obstacles. As the journey tests their limits, they will discover hidden strengths and forever alter their destiny.';
            const truncatedText = fullSynopsis.length > 95 ? fullSynopsis.substring(0, 95).trim() + '... ' : fullSynopsis + ' ';
            const imdbLink = `https://www.imdb.com/find/?q=${encodeURIComponent(movieData.title)}`;
            synopsisEl.innerHTML = `${truncatedText} <a href="${imdbLink}" target="_blank" style="color: var(--color-accent); font-weight: 600; text-decoration: none;">Read more</a>`;
        } else {
            synopsisWrapper.style.display = 'none';
        }
    }

    // THE FIX 2: SHOWDOWN LEFT-SIDE INJECTOR (Syncs Base Movie)
    const updateElSafe = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    updateElSafe('showdown-title', movieData.battleTitle || 'Franchise Showdown');
    updateElSafe('showdown-name-1', movieData.title);
    const show1 = document.getElementById('showdown-poster-1');
    if (show1) show1.src = movieData.poster;

    const mockTotal = movieData.boxOffice || movieData.userPrediction || '$850M';
    const rawTotal = parseInt(mockTotal.replace(/\D/g, '')) || 850;
    updateElSafe('sd-total-1', mockTotal);
    updateElSafe('sd-open-1', '$' + Math.round(rawTotal / 6) + 'M');
    updateElSafe('sd-sent-1', movieData.sentimentScore ? (parseFloat(movieData.sentimentScore) * 10) + '%' : '85%');
    updateElSafe('sd-hype-1', (8 + (movieData.title.length % 20) / 10).toFixed(1));

    // THE FIX 3: RESET OPPONENT (Clears Right Side on new search)
    updateElSafe('showdown-name-2', 'Choose Opponent');
    const show2 = document.getElementById('showdown-poster-2');
    if (show2) {
        show2.src = 'https://placehold.co/400x600/333/FFF?text=Opponent';
        show2.style.opacity = '0.6';
        show2.style.filter = 'grayscale(50%)';
    }
    updateElSafe('sd-total-2', '--');
    updateElSafe('sd-open-2', '--');
    updateElSafe('sd-sent-2', '--');
    updateElSafe('sd-hype-2', '--');

    // THE FIX 4: PROCEDURAL VERDICT TEXTS (Syncs bottom layout heights)
    const updateHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = `<i>${html}</i>`; };
    if (movieData.verdicts) {
        updateHTML('verdict-general', movieData.verdicts.gen);
        updateHTML('verdict-finance', movieData.verdicts.fin);
        updateHTML('verdict-critical', movieData.verdicts.crit);
    } else {
        const genre = (movieData.genres && movieData.genres[0]) ? movieData.genres[0] : 'theatrical';
        const isHighHype = (movieData.title.length % 2 === 0);
        updateHTML('verdict-general', isHighHype ? `The active prediction is positioned as a primary tentpole release within its competitive window. Current social tracking places this ${genre} property in the upper quartile of audience awareness. Real-time NLP sentiment analysis across Twitter, TikTok, and Letterboxd indicates significant pre-release momentum, suggesting high cultural penetration and an extended life-cycle at the cinematic zeitgeist.` : `Market saturation for this ${genre} property indicates a reliant dependency on walk-up ticket sales. Algorithmic forecasting models suggest a highly concentrated demographic skew with potential resistance in gaining mainstream 4-quadrant momentum. The studio's marketing footprint will need a hyper-targeted grassroots strategy to achieve organic word-of-mouth conversion and offset a slower presale velocity curve.`);
        updateHTML('verdict-finance', isHighHype ? `Factoring in comparable historical success, presale velocity curves point to a highly front-loaded opening weekend with a robust secondary multiplier. Financial modeling projects that the budget threshold will be crossed rapidly. Furthermore, strong international rollout corridors—specifically in Latin American and Asian markets—provide a lucrative cushion for long-term theatrical ROI and ancillary market profitability.` : `Financial diagnostic models indicate a highly conservative opening frame compared to similar IP weightings. Long-term profitability relies heavily on staggered international market penetration and post-theatrical streaming aggregation. Domestic holds will need to demonstrate strong week-over-week sub-30% drops to hit the break-even threshold dictated by the production budget and the estimated P&A spend.`);
        updateHTML('verdict-critical', isHighHype ? `Anticipated high-contrast cinematography combined with elite directorial pedigree positions this release as a potential critical darling. Review aggregation models predict a 'Certified Fresh' metric floor of 85%. Algorithmic analysis of the creative team's previous historical output projects a baseline critical aggregate capable of influencing late-season awards momentum and boosting premium format (IMAX/Dolby) ticket surcharges.` : `Preliminary algorithmic scans of the creative blueprint suggest a potentially polarizing response among top-tier critics and gatekeepers. The narrative structure might prompt decisive division, lowering the projected Rotten Tomatoes floor to 55-65%. However, audience disparity models signify that general ticket-buyers may overlook critical lukewarmness in favor of pure entertainment value.`);
    }

    // THE FIX 5: 4TH CARD PROFITABILITY CALCULATOR & SUMMARY STATS
    let estBudgetStr = movieData.budget;
    let rawBudgetM = 0;
    if (!estBudgetStr && movieData.boxOffice) {
        let val = parseFloat(movieData.boxOffice.replace(/[^0-9.]/g, ''));
        let inMillions = movieData.boxOffice.includes('B') ? val * 1000 : val;
        rawBudgetM = Math.round(inMillions / 3);
        estBudgetStr = rawBudgetM >= 1000 ? `$${(rawBudgetM / 1000).toFixed(2)}B` : `$${rawBudgetM}M`;
    } else if (estBudgetStr) {
        let bVal = parseFloat(estBudgetStr.replace(/[^0-9.]/g, ''));
        rawBudgetM = estBudgetStr.includes('B') ? bVal * 1000 : bVal;
    } else {
        estBudgetStr = "$150M";
        rawBudgetM = 150;
    }

    let profitTargetStr = movieData.profitTarget;
    if (!profitTargetStr) {
        let rawTargetM = Math.round(rawBudgetM * 2.5);
        profitTargetStr = rawTargetM >= 1000 ? `$${(rawTargetM / 1000).toFixed(2)}B` : `$${rawTargetM}M`;
    }

    const safeBoxOffice = movieData.boxOffice || 'N/A';
    const safeImdb = movieData.imdb || 'N/A';
    const isLoggedIn = localStorage.getItem('cinescore_auth') === 'true';

    const verdictEl = document.getElementById('dyn-verdict');
    const boxOfficeEl = document.getElementById('dyn-box-office');
    const imdbEl = document.getElementById('dyn-imdb');
    const profitTargetEl = document.getElementById('dyn-profit-target');
    const estBudgetEl = document.getElementById('dyn-est-budget');

    if (isLoggedIn) {
        if (verdictEl) verdictEl.textContent = movieData.verdict || 'Pending';
        if (boxOfficeEl) boxOfficeEl.innerHTML = `${safeBoxOffice.replace(/[MB]/g, '')}<span style="font-size: 24px;">${safeBoxOffice === 'N/A' ? '' : safeBoxOffice.slice(-1)}</span>`;
        if (imdbEl) imdbEl.innerHTML = `${safeImdb}<span style="font-size: 24px; color: var(--color-secondary);">${safeImdb === 'N/A' ? '' : '/10'}</span>`;
        if (profitTargetEl) profitTargetEl.innerHTML = `${profitTargetStr.replace(/[MB]/g, '')}<span style="font-size: 24px;">${profitTargetStr.slice(-1)}</span>`;
        if (estBudgetEl) estBudgetEl.textContent = `Est. Budget: ${estBudgetStr}`;
    }

    // THE FIX 6: META TEXTS INJECTION
    if (document.getElementById('dyn-verdict-meta')) document.getElementById('dyn-verdict-meta').innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> ${movieData.verdictMeta || 'High Audience Consensus'}`;
    if (document.getElementById('dyn-box-office-meta')) document.getElementById('dyn-box-office-meta').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${movieData.boxOfficeMeta || 'Based on theatrical run'}`;
    if (document.getElementById('dyn-imdb-meta')) document.getElementById('dyn-imdb-meta').innerHTML = `<i class="fa-solid fa-circle-check"></i> ${movieData.imdbMeta || 'Verified User Ratings'}`;

    // THE FIX 7: AI GAUGE UPDATE
    const gaugeFill = document.querySelector('.ai-gauge-fill');
    if (gaugeFill) gaugeFill.style.strokeDashoffset = 264 - (264 * ((movieData.aiScore || 85) / 100));

    // Trigger Dynamic Charts
    if (typeof window.renderDynamicCharts === 'function') window.renderDynamicCharts(movieData, 'base');

    // --- THE RESTORED PAYWALL & BLUR LOGIC ---
    const chartsWrapper = document.querySelector('.content-slider');
    const paywall = document.getElementById('paywall-overlay');

    if (!isLoggedIn && chartsWrapper && paywall) {
        chartsWrapper.classList.add('content-blurred');
        paywall.classList.remove('hidden');
        paywall.style.opacity = '1';

        const lockBadge = `<span style="display: flex; align-items: center; font-size: 10px; color: var(--color-warning); border: 1px solid var(--color-warning); padding: 3px 6px; border-radius: 4px; letter-spacing: 1px; font-weight: 800;"><i class="fa-solid fa-lock" style="margin-right: 4px;"></i> PRO</span>`;
        const blurHTML = (val) => `<div style="display: flex; align-items: center; gap: 8px;"><span style="filter: blur(5px); opacity: 0.5;">${val}</span> ${lockBadge}</div>`;

        if (verdictEl) verdictEl.innerHTML = blurHTML('Restricted');
        if (boxOfficeEl) boxOfficeEl.innerHTML = blurHTML('$850M');
        if (imdbEl) imdbEl.innerHTML = blurHTML('8.5');
        if (profitTargetEl) profitTargetEl.innerHTML = blurHTML('$650M');
    } else if (chartsWrapper && paywall) {
        chartsWrapper.classList.remove('content-blurred');
        paywall.classList.add('hidden');
    }

    if (shouldAnimate) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/* ============================================================
   THE AUTHENTICATION SIMULATOR (Paywall Unlocker)
   ============================================================ */
window.unlockDashboard = function (isNewUser = false) {
    console.log("Authentication successful. Unlocking dashboard...");

    // 1. Save login state to browser memory
    localStorage.setItem('cinescore_auth', 'true');
    sessionStorage.setItem('cineScore_isLoggedIn', 'true');

    // THE FIX: Save whether they are fresh or returning
    if (isNewUser) localStorage.setItem('cinescore_fresh_signup', 'true');
    else localStorage.setItem('cinescore_fresh_signup', 'false');

    // 2. Hide any open Auth Modals
    document.querySelectorAll('.form').forEach(modal => modal.style.display = 'none');

    // 3. Smoothly dissolve the Paywall & Blur
    const chartsWrapper = document.querySelector('.content-slider');
    const paywall = document.getElementById('paywall-overlay');

    if (chartsWrapper) {
        chartsWrapper.classList.remove('content-blurred'); // Removes the blur CSS
    }

    if (paywall) {
        paywall.style.transition = "opacity 0.4s ease";
        paywall.style.opacity = '0';
        setTimeout(() => paywall.classList.add('hidden'), 400); // Wait for fade
    }

    // 4. Update Navbar UI
    const authGroup = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu-wrapper');
    if (authGroup) authGroup.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';

    // 5. Reload the page to inject the clean data (Simplest way to remove the hero blur)
    setTimeout(() => window.location.reload(), 600);
};

/* ============================================================
PREDICTION UI: STATE MACHINE
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    // UI Elements
    const badge = document.getElementById('state-badge');
    const heading = document.getElementById('blank-slate-heading');
    const subtext = document.getElementById('blank-slate-sub');
    const ctaGroup = document.getElementById('unlogged-cta-group');
    const posters = document.getElementById('state-trending-posters');
    const tooltip = document.getElementById('search-onboarding-tooltip');

    // Abort if not on Prediction page
    if (!heading) return;

    // --- USER SESSION STATE (single source of truth) ---
    const isUserLoggedIn = localStorage.getItem('cinescore_auth') === 'true';

    // THE FIX: Read the actual dynamic state instead of hardcoded 'false'
    const isFreshSignup = localStorage.getItem('cinescore_fresh_signup') === 'true';
    const userName = localStorage.getItem('cinescore_user_name') || "Director";

    if (!isUserLoggedIn) {
        // STATE 1: UNLOGGED NAV-LINK LANDING
        badge.innerHTML = `Predictive Precision <i class="fa-solid fa-bullseye" style="margin-right: 6px;"></i>`;

        // THE FIX: Changed to innerHTML and wrapped "Cinematic Success."
        heading.innerHTML = `Predicting <span class="text-accent">Cinematic Success.</span>`;

        subtext.innerText = "Where cinematic passion meets predictive precision. Search for an upcoming film to receive our AI Box Office forecast.";

        ctaGroup.style.display = 'flex';
        posters.style.display = 'none';
        tooltip.style.display = 'none';

    } else if (isUserLoggedIn && isFreshSignup) {
        // STATE 2: THE FRESH ONBOARD
        badge.innerHTML = `The Production Room <i class="fa-solid fa-bolt" style="margin-right: 6px;"></i>`;

        // THE FIX: Changed to innerHTML and wrapped "Verdict."
        heading.innerHTML = `Where Movie Meets Its <span class="text-accent">Verdict.</span>`;

        subtext.innerText = "Got any movie in mind? Try our new ML Model to see its forecast.";

        ctaGroup.style.display = 'none'; // Hide login buttons
        posters.style.display = 'block'; // Show Posters to help them
        tooltip.style.display = 'flex';  // Show the guiding tooltip

    } else if (isUserLoggedIn && !isFreshSignup) {
        // STATE 3: THE RETURNING DIRECTOR
        badge.innerHTML = `The Director's Chair <i class="fa-solid fa-chair" style="margin-right: 6px;"></i>`;

        // THE FIX: Changed to innerHTML and wrapped the dynamic userName
        heading.innerHTML = `Welcome Back, <span class="text-accent">${userName}.</span>`;

        subtext.innerText = "Which movie are we analyzing today? Checking on the latest Avenger's member or analyzing a new standalone? Ready when you are.";

        ctaGroup.style.display = 'none'; // Hide login buttons
        posters.style.display = 'block'; // Show Posters
        tooltip.style.display = 'none';  // Hide tooltip, they know what to do
    }
});

// ==========================================
// THE UNIVERSAL DAILY ROTATION ENGINE (V2.0)
// ==========================================
function initUniversalDailyRotations() {
    const db = window.mockMovies || [];
    if (db.length === 0) return;

    const today = new Date().getDate();

    // Helper: Calculates the exact same Hype Score as the Live Ticker
    const getHype = (title) => 65 + (title.length % 33);

    // 1. BLANK SLATE POSTERS (Now with Hover Overlays!)
    const blankSlateTrack = document.getElementById('blank-slate-trending-track');
    if (blankSlateTrack) {
        const shift1 = [...db.slice((today + 5) % db.length), ...db.slice(0, (today + 5) % db.length)];
        blankSlateTrack.innerHTML = shift1.slice(0, 3).map(m => `
            <div class="poster-card" style="width: 140px; cursor: pointer; border-radius: 8px; overflow: hidden; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.5); transition: transform 0.2s;" 
                 onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"
                 onclick="document.getElementById('default-view-search-input').value='${m.title}'; document.getElementById('default-view-search-btn').click();">
                <img src="${m.poster}" alt="${m.title}" style="width: 100%; height: 100%; object-fit: cover;">
                
                <div class="poster-overlay stack" style="align-items: center; justify-content: center; text-align: center; padding: 12px; background: rgba(11, 25, 44, 0.9);">
                    <h4 style="color: #fff; margin: 0 0 6px 0; font-size: 14px; line-height: 1.2;">${m.title}</h4>
                    <span style="font-size: 10px; color: var(--color-warning); font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">${m.year || '2026'}</span>
                    <span style="font-size: 10px; color: var(--color-secondary); margin-top: 4px;">${m.studio || 'Blockbuster'}</span>
                </div>
            </div>
        `).join('');
    }

    // 2. DASHBOARD TRENDING GRID (Unchanged)
    const trendingGrid = document.getElementById('trending-grid');
    if (trendingGrid) {
        const shift2 = [...db.slice((today + 10) % db.length), ...db.slice(0, (today + 10) % db.length)];
        trendingGrid.innerHTML = shift2.slice(0, 4).map(m => `
            <div class="poster-card" style="cursor: pointer;" onclick="triggerPredictionState('${m.title}')">
                <img src="${m.poster}" alt="${m.title}">
                <div class="poster-overlay" style="align-items: center; justify-content: center; text-align: center;">
                    <span style="font-size: 11px; color: var(--color-warning); font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">Trending Now</span>
                    <h4 style="color: #fff; margin: 0 0 16px 0; font-size: 18px;">${m.title}</h4>
                    <button class="hero-btn" style="padding: 10px 20px; font-size: 13px; color: #fff !important;">Predict Now <i class="fa-solid fa-bolt" style="margin-left: 6px;"></i></button>
                </div>
            </div>
        `).join('');
    }

    // 3. HOME SCREEN FEATURED CARDS (Sorted by Highest Hype!)
    const featuredCards = document.querySelectorAll('.featured-movie-card');
    if (featuredCards.length > 0) {
        // Map the DB to include Hype, then sort it descending (Highest Hype First)
        let sortedDb = [...db].map(m => ({ ...m, hype: getHype(m.title) })).sort((a, b) => b.hype - a.hype);

        // Grab the absolute Top 3 movies in the database
        const topMovies = sortedDb.slice(0, 3);

        featuredCards.forEach((card, i) => {
            const m = topMovies[i];
            if (m) {
                // Update Image and Title
                const img = card.querySelector('img');
                const title = card.querySelector('.movie-title-featured') || card.querySelector('h3');
                if (img) img.src = m.poster;
                if (title) title.textContent = m.title;

                // THE FIX: Find any element containing '%' and update it with real math
                const percentageEl = Array.from(card.querySelectorAll('*')).find(el => el.textContent.includes('%') && el.children.length === 0);
                if (percentageEl) {
                    percentageEl.textContent = m.hype + '%';
                }
            }
        });
    }
}

// Fire the engine on load!
document.addEventListener("DOMContentLoaded", initUniversalDailyRotations);

// ============================================================
// PHASE 4.5: THE NEURAL SANDBOX (Threshold Physics V2.0)
// ============================================================
function initSliderMathEngine() {
    const container = document.getElementById('algo-sliders-container');
    const finalScoreEl = document.getElementById('algo-final-score');
    const needleEl = document.getElementById('gauge-needle');
    if (!container || !needleEl) return;

    // THE FIX: Define the absolute minimum importance any factor can have (10%)
    const MIN_WEIGHT = 0.10;

    // Initial State (Must equal 1.0)
    // 1. Add Icons to Metrics
    const metrics = [
        { id: 'star', name: 'Star Power', icon: 'fa-star', baseScore: 75, weight: 0.25, color: '#0055FF' },
        { id: 'marketing', name: 'Marketing', icon: 'fa-bullhorn', baseScore: 80, weight: 0.25, color: '#8B5CF6' },
        { id: 'ip', name: 'IP Strength', icon: 'fa-crown', baseScore: 90, weight: 0.30, color: '#10B981' },
        { id: 'social', name: 'Social Buzz', icon: 'fa-comments', baseScore: 65, weight: 0.20, color: '#F59E0B' }
    ];

    // The Maximum a single slider can reach if all others are at minimum
    const MAX_WEIGHT = 1.0 - (MIN_WEIGHT * (metrics.length - 1));

    // 1. UPDATED SLIDER RENDER (Icons in Labels)
    function renderSliders() {
        container.innerHTML = metrics.map((m, index) => `
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
                <span style="color: var(--color-secondary);"><i class="fa-solid ${m.icon}" style="color: ${m.color}; margin-right: 4px;"></i>${m.name}</span>
                <span id="val-${m.id}">${(m.weight * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="10" max="70" value="${m.weight * 100}" class="algo-slider" data-index="${index}">
        </div>
    `).join('');

        document.querySelectorAll('.algo-slider').forEach(slider => {
            slider.addEventListener('input', (e) => handleWeightChange(parseInt(e.target.dataset.index), parseFloat(e.target.value) / 100));
        });
    }

    // THE FIX: Proportional Stealing WITH Hard Floors
    function handleWeightChange(changedIndex, newVal) {
        let oldVal = metrics[changedIndex].weight;

        // Safety Clamp
        if (newVal > MAX_WEIGHT) newVal = MAX_WEIGHT;
        if (newVal < MIN_WEIGHT) newVal = MIN_WEIGHT;

        let delta = newVal - oldVal;
        metrics[changedIndex].weight = newVal;

        let others = metrics.filter((m, i) => i !== changedIndex);

        if (delta > 0) {
            // Stealing weight from others (they decrease)
            let availableToSteal = others.reduce((sum, m) => sum + (m.weight - MIN_WEIGHT), 0);
            others.forEach(m => {
                if (availableToSteal > 0) {
                    let stealAmount = delta * ((m.weight - MIN_WEIGHT) / availableToSteal);
                    m.weight -= stealAmount;
                }
            });
        } else {
            // Giving weight back to others (they increase)
            let maxPossibleGain = others.reduce((sum, m) => sum + (MAX_WEIGHT - m.weight), 0);
            others.forEach(m => {
                if (maxPossibleGain > 0) {
                    let giveAmount = Math.abs(delta) * ((MAX_WEIGHT - m.weight) / maxPossibleGain);
                    m.weight += giveAmount;
                }
            });
        }
        updateUI();
    }

    // 3. Fix Track Gradient in updateUI()
    function updateUI() {
        let finalScore = 0;
        metrics.forEach(m => {
            m.weight = Math.round(m.weight * 1000) / 1000;
            finalScore += m.baseScore * m.weight;
            const sliderEl = document.querySelector(`.algo-slider[data-index="${metrics.indexOf(m)}"]`);
            const textEl = document.getElementById(`val-${m.id}`);
            if (sliderEl && textEl) {
                const valPercent = m.weight * 100;
                sliderEl.value = valPercent;
                textEl.textContent = `${valPercent.toFixed(0)}%`;

                let trackColor = 'var(--color-success)';
                if (valPercent <= 10) trackColor = 'var(--color-warning)';
                else if (valPercent <= 35) trackColor = '#F59E0B';
                else if (valPercent <= 60) trackColor = 'var(--color-accent)';

                // THE FIX: Only inject CSS variables! No more direct background styles.
                // Subtracting 10 from valPercent because your sliders MIN is 10, MAX is 70!
                // We need to map 10-70 to 0%-100% for the visual fill
                const visualFillPercent = ((valPercent - 10) / 60) * 100;

                sliderEl.style.setProperty('--fill-percent', visualFillPercent + '%');
                sliderEl.style.setProperty('--track-color', trackColor);
            }
        });

        // ... (Keep your needle rotation logic exactly the same below this line) ...

        finalScore = Math.round(finalScore);
        finalScoreEl.textContent = finalScore;

        const rotationAngle = (finalScore / 100) * 180 - 90;
        needleEl.style.transform = `rotate(${rotationAngle}deg)`;

        if (finalScore >= 80) finalScoreEl.style.color = "var(--color-success)";
        else if (finalScore >= 50) finalScoreEl.style.color = "var(--color-warning)";
        else finalScoreEl.style.color = "var(--color-danger)";
    }

    renderSliders();
    setTimeout(updateUI, 100);
}

// ============================================================
// PHASE 4.6: SHOWDOWN SEARCH ENGINE
// ============================================================
// ============================================================
// PHASE 4.6: SHOWDOWN SEARCH ENGINE (UPGRADED)
// ============================================================
function initShowdownSearch() {
    const input = document.getElementById('opponent-search-input');
    const resultsBox = document.getElementById('opponent-search-dropdown');
    if (!input || !resultsBox) return;

    // THE FIX: Hook up universal keyboard navigation!
    if (typeof attachKeyboardNav === 'function') {
        attachKeyboardNav(input, resultsBox);
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 1) {
            resultsBox.style.display = 'none';
            return;
        }

        const db = window.mockMovies || [];
        const matches = db.filter(m => m.title.toLowerCase().includes(query));

        if (matches.length > 0) {
            // THE FIX: Render as <li> using the 'search-item' class so hover borders work!
            resultsBox.innerHTML = matches.map(m => `
                <li class="search-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;" onclick="selectShowdownOpponent('${m.title}')">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1; overflow: hidden;">
                        <img src="${m.poster}" style="width: 32px; height: 48px; border-radius: 4px; object-fit: cover; flex-shrink: 0;">
                        <div style="min-width: 0;">
                            <strong style="color: var(--color-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${m.title}</strong>
                            <span style="font-size: 11px; display: block; color: var(--color-secondary);">${m.year || 'Upcoming'} • ${m.boxOffice || m.userPrediction || 'TBD'}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-magnifying-glass-arrow-right search-right-icon" style="margin-left: 12px; flex-shrink: 0;"></i>
                </li>
            `).join('');
            resultsBox.style.display = 'block';
        } else {
            resultsBox.innerHTML = `<li class="search-item" style="pointer-events: none; opacity: 0.5; text-align: center;">No opponent found.</li>`;
            resultsBox.style.display = 'block';
        }
    });

    // THE FIX: Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== input && !resultsBox.contains(e.target)) {
            resultsBox.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resultsBox) resultsBox.style.display = 'none';
    });

    // 3. UPDATED SHOWDOWN SELECTION (With Spring Animation)
    window.selectShowdownOpponent = function (title) {
        const movie = (window.mockMovies || []).find(m => m.title === title);
        if (movie) {
            const show2 = document.getElementById('showdown-poster-2');
            const name2 = document.getElementById('showdown-name-2');
            const metricsGrid = document.getElementById('showdown-metrics-grid');

            if (show2) {
                // STEP 1: Fast shrink and fade out the placeholder
                show2.style.transition = 'all 0.2s ease-in';
                show2.style.opacity = '0';
                show2.style.transform = 'scale(0.9)'; // Shrinks down

                // Fade out the text temporarily
                if (name2) { name2.style.transition = 'opacity 0.2s ease'; name2.style.opacity = '0'; }
                if (metricsGrid) { metricsGrid.style.transition = 'opacity 0.2s ease'; metricsGrid.style.opacity = '0'; }

                // STEP 2: Swap the data in the dark, then Spring it back up!
                setTimeout(() => {
                    show2.src = movie.poster;
                    if (name2) name2.textContent = movie.title;

                    // Metric Updates
                    document.getElementById('sd-total-2').textContent = movie.boxOffice || movie.userPrediction || '$500M';
                    document.getElementById('sd-open-2').textContent = '$' + (Math.round(parseInt(movie.boxOffice?.replace(/\D/g, '') || 500) / 6)) + 'M';
                    document.getElementById('sd-sent-2').textContent = (75 + (movie.title.length % 20)) + '%';
                    document.getElementById('sd-hype-2').textContent = (7 + (movie.title.length % 30) / 10).toFixed(1);

                    // The Cinematic Spring Animation (Apple/Netflix style bounce)
                    show2.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    show2.style.opacity = '1';
                    show2.style.filter = 'grayscale(0%)';
                    show2.style.transform = 'scale(1)'; // Bounces back to full size
                    show2.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)'; // Locks in the premium shadow

                    if (name2) name2.style.opacity = '1';
                    if (metricsGrid) metricsGrid.style.opacity = '1';

                }, 250); // 250ms delay allows the fade-out to finish before swapping
            }

            document.getElementById('opponent-search-dropdown').style.display = 'none';
            document.getElementById('opponent-search-input').value = '';
        }
    }
}

// Add to your Master Initializer!
document.addEventListener("DOMContentLoaded", initShowdownSearch);

// ============================================================
// 17. INLINE SPARKLINE ENGINE (LIHO Strategy)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.metric-card-wrapper .metric-content');
    
    // Abstract geometric paths mimicking trendlines
    const dataSets = [
        '0,25 5,20 10,22 15,10 20,12 25,2', // High spike
        '0,15 5,22 10,18 15,12 20,4 25,2',  // Smooth climb
        '0,10 5,12 10,8 15,4 20,6 25,2',   // Stable
        '0,20 5,22 10,15 15,8 20,4 25,0'   // Aggressive climb
    ];
    
    // Mapped to match the 4 cards (Accent, Success, Rating, Alt)
    const colors = ['var(--color-accent)', 'var(--color-success)', '#F5C518', '#8B5CF6'];

    cards.forEach((card, index) => {
        // Prevent duplicate appending
        if (card.querySelector('.sparkline')) return;
        
        card.parentElement.style.position = 'relative'; // Ensure absolute positioning bounds
        
        const color = colors[index % colors.length];
        const path = dataSets[index % dataSets.length];
        
        const svgHTML = `
            <svg class="sparkline" viewBox="0 0 25 30" style="width: 45px; height: 35px; position: absolute; right: 24px; top: 24px; opacity: 0.6; filter: drop-shadow(0 0 4px ${color});">
                <polyline class="sparkline-path" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${path}"></polyline>
            </svg>
        `;
        card.insertAdjacentHTML('beforeend', svgHTML);
    });
});



