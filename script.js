const API_KEY = "ECERNKGNotYOXh9zU7XHhq3iBdfuGPSP5mdtUAuL"; // Your NASA API Key

        document.addEventListener("DOMContentLoaded", () => {
            const tabs = document.querySelectorAll(".tab");
            const contents = document.querySelectorAll(".content");

            tabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    // Remove active class from all tabs and hide all contents
                    tabs.forEach(t => t.classList.remove("active"));
                    contents.forEach(c => c.classList.remove("active"));

                    // Add active class to clicked tab and show corresponding content
                    tab.classList.add("active");
                    document.getElementById(tab.getAttribute("data-target")).classList.add("active");
                });
            });

            // Fetch NASA Data
            fetchAPOD();
            fetchMarsPhotos();
            fetchNeoWs();
            fetchEPIC();
            fetchImageLibrary();
            fetchExoplanets();
        });

        function fetchAPOD() {
            fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("apod").innerHTML = `
                        <h2>${data.title}</h2>
                        <img src="${data.url}" alt="APOD">
                        <p>${data.explanation}</p>
                    `;
                });
        }

        function fetchMarsPhotos() {
            fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    let images = data.photos.slice(0, 3).map(photo => `<img src="${photo.img_src}" alt="Mars Rover Image">`).join("");
                    document.getElementById("mars").innerHTML = `
                        <h2>Mars Rover Photos</h2>
                        ${images}
                    `;
                });
        }

        function formatDiameter(meters) {
            if (meters >= 1000) {
                return (meters / 1000).toFixed(2) + " km"; 
            } else {
                return Math.round(meters) + " meters";
            }
        }
        
        function fetchNeoWs() {
            fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    let asteroids = Object.values(data.near_earth_objects)[0].slice(0, 3).map(asteroid => {
                        let diameter = formatDiameter(asteroid.estimated_diameter.meters.estimated_diameter_max);
                        let hazardous = asteroid.is_potentially_hazardous_asteroid ? "🚨 Yes" : "✅ No";
                        let closeApproach = asteroid.close_approach_data[0]?.miss_distance.kilometers
                            ? `${Math.round(asteroid.close_approach_data[0].miss_distance.kilometers)} km`
                            : "N/A";
        
                        return `
                            <p>
                                <strong>${asteroid.name}</strong> <br>
                                🌍 Closest Distance: ${closeApproach} <br>
                                🔹 Diameter: ${diameter} <br>
                                ⚠️ Hazardous: ${hazardous}
                            </p>
                        `;
                    }).join("");
        
                    document.getElementById("neo").innerHTML = `<h2>Near-Earth Objects</h2>${asteroids}`;
                })
                .catch(error => console.error("Error fetching NEO data:", error));
        }
         

        function fetchEPIC() {
            fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    let latest = data[data.length - 1];
                    let imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${latest.date.split(" ")[0].replaceAll("-", "/")}/png/${latest.image}.png`;
                    document.getElementById("epic").innerHTML = `
                        <h2>EPIC Earth Images</h2>
                        <img src="${imageUrl}" alt="EPIC Earth">
                    `;
                });
        }

        function fetchImageLibrary() {
            fetch(`https://images-api.nasa.gov/search?q=space`)
                .then(response => response.json())
                .then(data => {
                    let images = data.collection.items.slice(0, 3).map(item => `<img src="${item.links[0].href}" alt="NASA Image">`).join("");
                    document.getElementById("library").innerHTML = `<h2>NASA Image Library</h2>${images}`;
                });
        }

        function fetchExoplanets() {
            fetch(`https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json`)
                .then(response => response.json())
                .then(data => {
                    let planets = data.slice(0, 3).map(planet => `<p><strong>${planet.pl_name}</strong> - Discovered: ${planet.discoverymethod}</p>`).join("");
                    document.getElementById("exoplanets").innerHTML = `<h2>Exoplanet Data</h2>${planets}`;
                });
        }




        function toggleSound() {
            let sound = document.getElementById("space-sound");
            let btn = document.querySelector(".sound-toggle");
            if (sound.paused) {
                sound.play();
                btn.innerText = "🔇";
            } else {
                sound.pause();
                btn.innerText = "🔊 ";
            }
        }



        // document.getElementById("play-btn").addEventListener("click", function() {
        //     let audio = document.getElementById("space-sound");
        //     if (audio.paused) {
        //         audio.play().catch(error => console.log("Playback error:", error));
        //     } else {
        //         audio.pause();
        //     }
        // });





        function showNotification() {
            let notification = document.getElementById("notification");
            notification.classList.add("show");
        
            // Auto-hide after 5 seconds
            setTimeout(() => {
                closeNotification();
            }, 5000);
        }
        
        function closeNotification() {
            let notification = document.getElementById("notification");
            notification.classList.remove("show");
        }
        
        // Show notification when site loads
        window.addEventListener("load", showNotification);
        