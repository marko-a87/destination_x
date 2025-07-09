let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slide");

    for (i = 0; i < slides.length; i++) {
        
        slides[i].style.display = "none";
        slides[i].getElementsByTagName("img")[0].style.transform = "scale(1)";
    }

    slideIndex++;

    if (slideIndex > slides.length) {
        
        slideIndex = 1
    }

    slides[slideIndex-1].style.display = "block";

    setTimeout(showSlides, 7000); // Change image every 4 seconds
}