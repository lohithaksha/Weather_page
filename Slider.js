var slideIndex = 0;
        var slides = document.querySelectorAll('.slider img');
        showSlides();

        function plusSlides(n) {
            slideIndex += n;
            showSlides();
        }

        function showSlides() {
            if (slideIndex >= slides.length) { slideIndex = 0; }
            if (slideIndex < 0) { slideIndex = slides.length - 1; }
            slides.forEach(function (slide) {
                slide.classList.remove('active');
            });
            slides[slideIndex].classList.add('active');
        }

        // Add event listener to the slider container for click events
        document.querySelector('.slider').addEventListener('click', function (event) {
            var index = Array.from(slides).indexOf(event.target);
            if (index !== -1) {
                var destinations = [
                    'https://www.tripadvisor.com/Attractions-g60763-Activities-New_York_City_New_York.html',
                    'https://www.tripadvisor.com/Attractions-g56003-Activities-Houston_Texas.html',
                    'https://www.tripadvisor.com/Attractions-g186338-Activities-London_England.html',
                    'https://www.tripadvisor.com/Attractions-g187147-Activities-Paris_Ile_de_France.html',
                    'https://www.tripadvisor.com/Attractions-g298184-Activities-Tokyo_Tokyo_Prefecture_Kanto.html',
                    'https://www.tripadvisor.com/Attractions-g255060-Activities-Sydney_New_South_Wales.html',
                    'https://www.tripadvisor.com/Attractions-g295424-Activities-Dubai_Emirate_of_Dubai.html',
                    'https://www.tripadvisor.com/Attractions-g298484-Activities-Moscow_Central_Russia.html',
                    'https://www.tripadvisor.com/Attractions-g304554-Activities-Mumbai_Maharashtra.html',
                    'https://www.tripadvisor.com/Attractions-g155019-Activities-Toronto_Ontario.html'
                ];
                event.stopPropagation(); // Stop propagation to prevent opening multiple pages
                window.location.href = destinations[index];
            }
        });