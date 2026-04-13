// ============================================================
// CINESCORE: 2026 UPCOMING MOVIE ML DATABASE
// ============================================================

window.mockMovies = [
    {
        title: "The Super Mario Galaxy Movie",
        isTrending: true,
        year: "2026", director: "Aaron Horvath, Michael Jelenic", cast: "Chris Pratt, Anya Taylor-Joy, Jack Black", studio: "Illumination / Nintendo",
        poster: "https://www.movieposters.com/cdn/shop/files/super_mario_galaxy_movie_ver12.jpg?v=1774021772&width=1680",
        aiScore: 94, sentimentScore: "9.1", verdict: "Billion Dollar Club", boxOffice: "$1.3B", imdb: "8.0",
        verdictMeta: "Projected Massive ROI", boxOfficeMeta: "+/- 8% margin of error", imdbMeta: "Universal Audience Appeal",
        social: [30, 40, 20, 10], sentimentLine: { pos: [60, 75, 85, 92, 95], neg: [15, 10, 8, 5, 3] }, sonar: [80, 70, 95, 90, 85], funnel: [150, 100, 250, 1300], trajectory: [250, 500, 800, 1000, 1200, 1300]
    },

    {
        title: "Avengers: Doomsday",
        isTrending: true,
        year: "2026", director: "Anthony & Joe Russo", cast: "Robert Downey Jr., Pedro Pascal, Vanessa Kirby", studio: "Marvel Studios",
        poster: "https://cdn.cinematerial.com/p/297x/pgbnnfwm/avengers-doomsday-movie-poster-md.jpg?v=1766554742",
        aiScore: 98, dataPoints: "4.5", sentimentScore: "9.4", verdict: "Mega-Hit", boxOffice: "$1.8B", imdb: "8.8",
        verdictMeta: "Record-Breaking Potential", boxOfficeMeta: "+/- 5% margin of error", imdbMeta: "Strong Critical Consensus",
        social: [35, 40, 20, 5], sentimentLine: { pos: [50, 65, 80, 92, 98], neg: [10, 15, 12, 8, 5] }, sonar: [100, 85, 100, 100, 90], funnel: [250, 150, 400, 1800], trajectory: [350, 700, 1100, 1400, 1600, 1800]
    },
    {
        title: "The Mandalorian and Grogu",
        isTrending: false,
        year: "2026", director: "Jon Favreau", cast: "Pedro Pascal, Sigourney Weaver", studio: "Lucasfilm",
        poster: "https://www.movieposters.com/cdn/shop/files/star-wars-the-mandalorian-and-grogu_ylbbjy4z.jpg?v=1772724721&width=1680",
        aiScore: 88, sentimentScore: "8.6", verdict: "Blockbuster", boxOffice: "$920M", imdb: "8.1",
        verdictMeta: "High Fan Conversion", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "Solid Theatrical Return",
        social: [40, 25, 25, 10], sentimentLine: { pos: [50, 60, 75, 80, 88], neg: [15, 20, 15, 12, 10] }, sonar: [90, 75, 95, 85, 80], funnel: [160, 80, 240, 920], trajectory: [150, 350, 550, 750, 850, 920]
    },
    {
        title: "Supergirl: Woman of Tomorrow",
        isTrending: false,
        year: "2026", director: "Craig Gillespie", cast: "Milly Alcock, Matthias Schoenaerts", studio: "DC Studios",
        poster: "https://www.movieposters.com/cdn/shop/files/supergirl_gnafvyfz.jpg?v=1768848650&width=1680",
        aiScore: 78, dataPoints: "1.5", sentimentScore: "7.9", verdict: "Moderate Hit", boxOffice: "$540M", imdb: "7.5",
        verdictMeta: "Dependent on Universe Setup", boxOfficeMeta: "+/- 15% margin of error", imdbMeta: "Cautiously Optimistic",
        social: [30, 30, 30, 10], sentimentLine: { pos: [30, 45, 55, 65, 75], neg: [25, 20, 25, 20, 15] }, sonar: [85, 75, 90, 70, 80], funnel: [140, 70, 210, 540], trajectory: [110, 240, 360, 450, 500, 540]
    },
    {
        title: "Toy Story 5",
        isTrending: false,
        isTrending: true,
        year: "2026", director: "Andrew Stanton", cast: "Tom Hanks, Tim Allen", studio: "Pixar",
        poster: "https://www.movieposters.com/cdn/shop/files/toy-story-5_ueha7qwg.jpg?v=1772724247&width=1680",
        aiScore: 91, sentimentScore: "8.7", verdict: "Billion Dollar Club", boxOffice: "$1.1B", imdb: "8.2",
        verdictMeta: "Massive Multi-Gen ROI", boxOfficeMeta: "+/- 8% margin of error", imdbMeta: "High Nostalgia Factor",
        social: [20, 45, 25, 10], sentimentLine: { pos: [55, 65, 75, 85, 91], neg: [20, 15, 10, 8, 6] }, sonar: [60, 85, 90, 95, 80], funnel: [200, 100, 300, 1100], trajectory: [180, 400, 650, 850, 1000, 1100]
    },
    {
        title: "Disclosure Day",
        isTrending: true,
        year: "2026", director: "Steven Spielberg", cast: "Emily Blunt, Colin Firth, Colman Domingo", studio: "Universal Pictures",
        poster: "https://www.movieposters.com/cdn/shop/files/disclosure_day_05bc9f2f-350d-41ee-908d-95cba153c689.jpg?v=1767640278&width=1680",
        aiScore: 89, dataPoints: "2.1", sentimentScore: "8.5", verdict: "Blockbuster", boxOffice: "$780M", imdb: "8.4",
        verdictMeta: "Spielberg Sci-Fi Draw", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "Strong Critical Backing",
        social: [45, 15, 30, 10], sentimentLine: { pos: [40, 50, 65, 75, 88], neg: [15, 12, 10, 8, 5] }, sonar: [75, 95, 90, 85, 80], funnel: [130, 60, 190, 780], trajectory: [120, 300, 480, 620, 710, 780]
    },
    {
        title: "Shrek 5",
        isTrending: false,
        year: "2027", director: "Walt Dohrn", cast: "Mike Myers, Eddie Murphy, Cameron Diaz", studio: "DreamWorks",
        poster: "https://cdn.cinematerial.com/p/297x/kg5u6z3d/shrek-5-movie-poster-md.jpg?v=1740806414",
        aiScore: 96, sentimentScore: "9.2", verdict: "Billion Dollar Club", boxOffice: "$1.4B", imdb: "8.3",
        verdictMeta: "Unprecedented Hype Velocity", boxOfficeMeta: "+/- 5% margin of error", imdbMeta: "Meme-Driven Success",
        social: [25, 55, 15, 5], sentimentLine: { pos: [70, 80, 88, 94, 98], neg: [10, 8, 6, 4, 2] }, sonar: [70, 80, 85, 100, 90], funnel: [150, 80, 230, 1400], trajectory: [300, 650, 950, 1150, 1300, 1400]
    },
    {
        title: "Spider-Man: Brand New Day",
        isTrending: true,
        year: "2026", director: "Destin Daniel Cretton", cast: "Tom Holland, Zendaya", studio: "Sony / Marvel",
        poster: "https://images.thedirect.com/media/photos/bnd2.png",
        aiScore: 95, dataPoints: "4.5", sentimentScore: "9.0", verdict: "Mega-Hit", boxOffice: "$1.5B", imdb: "8.6",
        verdictMeta: "Guaranteed Global ROI", boxOfficeMeta: "+/- 7% margin of error", imdbMeta: "Fan Favorite Return",
        social: [35, 35, 20, 10], sentimentLine: { pos: [60, 70, 80, 90, 95], neg: [12, 10, 8, 6, 4] }, sonar: [95, 80, 90, 95, 85], funnel: [200, 120, 320, 1500], trajectory: [320, 700, 1050, 1300, 1420, 1500]
    },
    {
        title: "The Batman: Part II",
        isTrending: true,
        year: "2026", director: "Matt Reeves", cast: "Robert Pattinson, Zoë Kravitz, Barry Keoghan", studio: "Warner Bros.",
        poster: "https://www.movieposters.com/cdn/shop/products/the-batman_hyktligc.jpg?v=1762969722&width=1680",
        aiScore: 94, dataPoints: "3.6", sentimentScore: "8.7", verdict: "Blockbuster", boxOffice: "$847M", imdb: "8.4",
        verdictMeta: "Projected Massive ROI", boxOfficeMeta: "+/- 12% margin of error", imdbMeta: "Strong Critical Consensus",
        social: [45, 20, 25, 10], sentimentLine: { pos: [50, 60, 75, 85, 92], neg: [15, 12, 10, 8, 6] }, sonar: [90, 85, 95, 80, 75], funnel: [160, 80, 240, 847], trajectory: [180, 380, 550, 700, 790, 847]
    },
    {
        title: "Dune: Part Three",
        isTrending: true,
        year: "2026", director: "Denis Villeneuve", cast: "Timothée Chalamet, Zendaya, Florence Pugh", studio: "Warner Bros.",
        poster: "https://cdn.cinematerial.com/p/297x/bw5f0vwv/dune-part-three-movie-poster-md.jpg?v=1775526461",
        aiScore: 97, dataPoints: "3.8", sentimentScore: "9.3", verdict: "Cinematic Event", boxOffice: "$950M", imdb: "8.9",
        verdictMeta: "Premium Format Driver", boxOfficeMeta: "+/- 8% margin of error", imdbMeta: "Oscar Contender",
        social: [40, 20, 25, 15], sentimentLine: { pos: [65, 75, 85, 92, 97], neg: [10, 8, 6, 5, 3] }, sonar: [85, 100, 100, 85, 70], funnel: [190, 90, 280, 950], trajectory: [190, 420, 650, 820, 900, 950]
    },
    {
        title: "Project Hail Mary",
        isTrending: true,
        year: "2026", director: "Phil Lord, Christopher Miller", cast: "Ryan Gosling, Sandra Hüller", studio: "Amazon MGM",
        poster: "https://www.movieposters.com/cdn/shop/files/project-hail-mary_kwovprbc_e690f82c-e70d-4189-a438-c4339ce42643.jpg?v=1753215685&width=1680",
        aiScore: 86, sentimentScore: "8.8", verdict: "Sleeper Hit", boxOffice: "$480M", imdb: "8.5",
        verdictMeta: "High Word-of-Mouth", boxOfficeMeta: "+/- 15% margin of error", imdbMeta: "Strong Sci-Fi Appeal",
        social: [30, 20, 30, 20], sentimentLine: { pos: [40, 55, 70, 85, 92], neg: [20, 15, 10, 5, 3] }, sonar: [60, 95, 85, 80, 80], funnel: [110, 60, 170, 480], trajectory: [70, 160, 280, 380, 440, 480]
    },

    {
        title: "Five Nights at Freddy's 2",
        isTrending: false,
        year: "2026", director: "Emma Tammi", cast: "Josh Hutcherson, Matthew Lillard", studio: "Blumhouse",
        poster: "https://www.movieposters.com/cdn/shop/files/scan_7005f255-1934-457a-b05d-5d00ec0a92fc.jpg?v=1763741880&width=1680",
        aiScore: 85, sentimentScore: "8.1", verdict: "High ROI Horror", boxOffice: "$310M", imdb: "6.5",
        verdictMeta: "Low Budget, Massive Yield", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "Critic Proof",
        social: [30, 50, 10, 10], sentimentLine: { pos: [60, 75, 85, 90, 92], neg: [20, 15, 12, 10, 8] }, sonar: [70, 50, 60, 80, 85], funnel: [30, 40, 70, 310], trajectory: [110, 200, 260, 290, 300, 310]
    },
    {
        title: "The Hunger Games: Sunrise on the Reaping",
        isTrending: false,
        year: "2026", director: "Francis Lawrence", cast: "TBA", studio: "Lionsgate",
        poster: "https://www.movieposters.com/cdn/shop/files/the-hunger-games-sunrise-on-the-reaping_vjnrleqd.jpg?v=1766422772&width=1680",
        aiScore: 81, sentimentScore: "7.8", verdict: "Solid Performer", boxOffice: "$420M", imdb: "7.3",
        verdictMeta: "Dependable IP Return", boxOfficeMeta: "+/- 12% margin of error", imdbMeta: "Favorable YA Demographics",
        social: [25, 40, 25, 10], sentimentLine: { pos: [45, 55, 65, 75, 80], neg: [20, 18, 15, 12, 10] }, sonar: [80, 85, 80, 60, 75], funnel: [100, 60, 160, 420], trajectory: [90, 210, 310, 380, 405, 420]
    },
    {
        title: "Mortal Kombat 2",
        isTrending: false,
        year: "2026", director: "Simon McQuoid", cast: "Karl Urban, Lewis Tan", studio: "New Line Cinema",
        poster: "https://www.movieposters.com/cdn/shop/files/mortal-kombat-ii_b3ocwgkr.jpg?v=1774898759&width=1680",
        aiScore: 72, sentimentScore: "7.1", verdict: "Niche Hit", boxOffice: "$180M", imdb: "6.2",
        verdictMeta: "Breakeven Domestic", boxOfficeMeta: "+/- 15% margin of error", imdbMeta: "Action Heavy, Low Story",
        social: [35, 25, 20, 20], sentimentLine: { pos: [40, 50, 55, 60, 65], neg: [25, 25, 20, 18, 15] }, sonar: [95, 40, 80, 50, 85], funnel: [70, 40, 110, 180], trajectory: [50, 100, 140, 165, 175, 180]
    },
    {
        title: "28 Years Later: The Bone Temple",
        isTrending: false,
        year: "2026", director: "Nia DaCosta", cast: "Aaron Taylor-Johnson, Jodie Comer", studio: "Sony Pictures",
        poster: "https://www.movieposters.com/cdn/shop/files/28-years-later-the-bone-temple_hd5ivpcp_d8e06295-1c24-4ded-b935-2a794d837760.jpg?v=1760538769&width=1680",
        aiScore: 84, sentimentScore: "8.3", verdict: "Horror Standout", boxOffice: "$220M", imdb: "7.6",
        verdictMeta: "Strong Genre Performance", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "Visceral Critical Acclaim",
        social: [20, 30, 30, 20], sentimentLine: { pos: [30, 45, 60, 75, 85], neg: [15, 12, 10, 8, 5] }, sonar: [85, 80, 75, 65, 90], funnel: [60, 40, 100, 220], trajectory: [60, 130, 180, 205, 215, 220]
    },
    {
        title: "The Devil Wears Prada 2",
        isTrending: true,
        year: "2026", director: "David Frankel", cast: "Meryl Streep, Anne Hathaway, Emily Blunt", studio: "Disney",
        poster: "https://www.movieposters.com/cdn/shop/files/the-devil-wears-prada-2_294gh4cp_bd513ad0-b880-4217-b85a-c0256710e4c1.jpg?v=1774900740&width=1680",
        aiScore: 88, sentimentScore: "8.9", verdict: "Pop Culture Event", boxOffice: "$450M", imdb: "7.4",
        verdictMeta: "Massive Female Demo", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "High Re-watchability",
        social: [20, 50, 25, 5], sentimentLine: { pos: [60, 70, 80, 88, 92], neg: [10, 8, 6, 5, 4] }, sonar: [20, 85, 80, 100, 75], funnel: [70, 50, 120, 450], trajectory: [90, 220, 330, 400, 430, 450]
    },
    {
        title: "Ready or Not 2: Here I Come",
        isTrending: false,
        year: "2026", director: "Matt Bettinelli-Olpin", cast: "Samara Weaving", studio: "Searchlight",
        poster: "https://www.movieposters.com/cdn/shop/files/ready-or-not-2-here-i-come_wcsh0yxx_856d44c4-7a70-40eb-bf93-da3485b90ee4.jpg?v=1766423324&width=1680",
        aiScore: 79, sentimentScore: "8.0", verdict: "Profitable Cult Hit", boxOffice: "$120M", imdb: "7.2",
        verdictMeta: "Excellent Budget Ratio", boxOfficeMeta: "+/- 15% margin of error", imdbMeta: "Dark Comedy Favorite",
        social: [25, 35, 25, 15], sentimentLine: { pos: [40, 50, 65, 75, 82], neg: [15, 12, 10, 8, 6] }, sonar: [80, 70, 60, 50, 85], funnel: [25, 20, 45, 120], trajectory: [35, 70, 95, 110, 115, 120]
    },
    {
        title: "Minions & Monsters",
        isTrending: false,
        year: "2026", director: "Kyle Balda", cast: "Steve Carell, Pierre Coffin", studio: "Illumination",
        poster: "https://www.movieposters.com/cdn/shop/files/minions_three.jpg?v=1771616708&width=1680",
        aiScore: 87, sentimentScore: "8.2", verdict: "Blockbuster", boxOffice: "$980M", imdb: "6.8",
        verdictMeta: "Consistent Kids Draw", boxOfficeMeta: "+/- 5% margin of error", imdbMeta: "Review Proof",
        social: [30, 45, 15, 10], sentimentLine: { pos: [65, 70, 75, 80, 85], neg: [10, 10, 10, 10, 10] }, sonar: [70, 60, 85, 90, 80], funnel: [100, 80, 180, 980], trajectory: [180, 450, 680, 850, 940, 980]
    },
    {
        title: "Cliffhanger",
        isTrending: false,
        year: "2026", director: "Jaume Collet-Serra", cast: "Lily James, Pierce Brosnan", studio: "Rocket Science",
        poster: "https://cdn.cinematerial.com/p/297x/5sxu9ehw/cliffhanger-movie-poster-md.jpg?v=1765438025",
        aiScore: 68, sentimentScore: "6.5", verdict: "Mediocre", boxOffice: "$110M", imdb: "6.0",
        verdictMeta: "Struggling Reboot", boxOfficeMeta: "+/- 20% margin of error", imdbMeta: "Mediocre Action Thriller",
        social: [20, 20, 30, 30], sentimentLine: { pos: [30, 35, 40, 45, 50], neg: [20, 25, 30, 35, 35] }, sonar: [85, 50, 70, 60, 65], funnel: [60, 40, 100, 110], trajectory: [35, 65, 85, 100, 105, 110]
    },
    {
        title: "Werwulf",
        isTrending: true,
        year: "2026", director: "Robert Eggers", cast: "TBA", studio: "A24",
        poster: "https://cdn.cinematerial.com/p/297x/vqekivcc/werwulf-poster-md.jpg?v=1761759972    ",
        aiScore: 85, sentimentScore: "8.6", verdict: "Arthouse Success", boxOffice: "$65M", imdb: "8.1",
        verdictMeta: "Cinephile Domination", boxOfficeMeta: "+/- 15% margin of error", imdbMeta: "Masterpiece Horror",
        social: [30, 15, 30, 25], sentimentLine: { pos: [45, 55, 70, 85, 90], neg: [10, 8, 6, 4, 3] }, sonar: [60, 95, 100, 40, 50], funnel: [20, 15, 35, 65], trajectory: [15, 35, 50, 58, 62, 65]
    },
    {
        title: "Jumanji : 3",
        isTrending: false,
        year: "2026", director: "Jake Kasdan", cast: "Dwayne Johnson, Kevin Hart", studio: "Sony Pictures",
        poster: "https://www.movieposters.com/cdn/shop/products/jumanji_the_next_level_xlg.jpg?v=1762966135&width=1680",
        aiScore: 83, sentimentScore: "8.0", verdict: "Strong Hit", boxOffice: "$720M", imdb: "6.9",
        verdictMeta: "Dependable Four-Quadrant", boxOfficeMeta: "+/- 10% margin of error", imdbMeta: "Fun Popcorn Flick",
        social: [25, 35, 20, 20], sentimentLine: { pos: [50, 60, 65, 70, 75], neg: [15, 15, 12, 10, 10] }, sonar: [85, 60, 80, 95, 85], funnel: [130, 70, 200, 720], trajectory: [140, 320, 490, 610, 680, 720]
    },
    {
        title: "Godzilla x Kong Supernova",
        isTrending: false,
        year: "2026", director: "Adam Wingard", cast: "Rebecca Hall, Brian Tyree Henry", studio: "Legendary",
        poster: "https://cdn.cinematerial.com/p/136x/rkyxbu1j/godzilla-x-kong-supernova-movie-poster-sm.jpg?v=1746806719",
        aiScore: 81, sentimentScore: "7.7", verdict: "International Carry", boxOffice: "$550M", imdb: "6.4",
        verdictMeta: "Overseas Dependent", boxOfficeMeta: "+/- 12% margin of error", imdbMeta: "Visual Spectacle",
        social: [35, 30, 20, 15], sentimentLine: { pos: [45, 55, 65, 70, 75], neg: [20, 18, 15, 15, 12] }, sonar: [95, 40, 100, 50, 80], funnel: [150, 80, 230, 550], trajectory: [110, 260, 390, 480, 520, 550]
    },

    {
        title: "Spider-Man: No Way Home",
        poster: "https://www.movieposters.com/cdn/shop/products/301983133_1072845516765536_7607702103270945846_n.jpg?v=1762971336&width=1680",
        year: "2021",
        studio: "Marvel Studios",
        boxOffice: "$1.92B",
        imdb: "8.0",
        verdict: "Global Phenomenon",
        aiScore: 98,
        isTrending: false,
        // THE FIX: Added the missing chart arrays!
        social: [45, 25, 20, 10],
        sentimentLine: { pos: [70, 85, 95, 98, 99], neg: [15, 10, 5, 2, 1] },
        sonar: [90, 85, 95, 100, 80],
        funnel: [200, 150, 500, 1920],
        trajectory: [260, 600, 1000, 1500, 1800, 1920]
    }
];

// ============================================================
// DYNAMIC ENGINE DATA (APPENDED)
// ============================================================

// Multi-Vector Historical Comps (Simulating deep model analysis)
window.historicalComps = [
    {
        title: "Spider-Man: No Way Home",
        vectorType: "Franchise Top Benchmark",
        budget: "$200M", opening: "$260.1M", gross: "$1.92B", roi: "9.6x",
        img: "https://www.movieposters.com/cdn/shop/products/301983133_1072845516765536_7607702103270945846_n.jpg?v=1762971336&width=1680" // Actual poster
    },
    {
        title: "Avengers: Endgame",
        vectorType: "Genre Top Benchmark",
        budget: "$356M", opening: "$357.1M", gross: "$2.79B", roi: "7.8x",
        img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
    },
    {
        title: "Interstellar",
        vectorType: "Director Benchmark",
        budget: "$100M", opening: "$82.4M", gross: "$968.3M", roi: "9.6x",
        img: "https://www.movieposters.com/cdn/shop/files/interstellar-139399.jpg?v=1762974876&width=1680"
    },
    {
        title: "Oppenheimer",
        vectorType: "Lead Actor Benchmark",
        budget: "$200M", opening: "$174.1M", gross: "$1.21B", roi: "6.0x",
        img: "https://www.movieposters.com/cdn/shop/files/oppenheimer_ver3.jpg?v=1762973011&width=1680"
    }
];

// Market Radar (Upcoming Future Movies Only)
window.upcomingRadar = [
    { title: "Avengers: Doomsday", release: "May 2026", img: "https://cdn.cinematerial.com/p/297x/pgbnnfwm/avengers-doomsday-movie-poster-md.jpg?v=1766554742" }, // Using deadpool placeholder 
    { title: "Spider-Man: Brand New Day", release: "Jul 2026", img: "https://images.thedirect.com/media/photos/bnd2.png" },
    { title: "The Batman Part II", release: "Oct 2026", img: "https://www.movieposters.com/cdn/shop/products/the-batman_hyktligc.jpg?v=1762969722&width=1680" },
    { title: "Supergirl: Woman of Tomorrow", release: "Jun 2026", img: "https://www.movieposters.com/cdn/shop/files/supergirl_gnafvyfz.jpg?v=1768848650&width=1680" } // Superman placeholder
];