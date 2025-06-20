
// Star rating display
document.addEventListener('DOMContentLoaded', function () {
    const starContainers = document.querySelectorAll('.stars');
    starContainers.forEach(container => {
    const rating = parseFloat(container.dataset.rating);
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
        stars += '<i class="fa-solid fa-star" style="color: #f6ce3e;"></i>';
        } else if (rating >= i - 0.5) {
        stars += '<i class="fa-regular fa-star" style="color: #f6ce3e;"></i>'; 
        } else {
        stars += '<i class="fa-regular fa-star" style="color: #f6ce3e;"></i>';
        }
    }
    container.innerHTML = stars;
    });
});

const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('liked');
        btn.innerHTML = btn.classList.contains('liked') ? '<i class="fa-solid fa-heart fa-lg" style="color: #b92d3b;"></i>' : 
        '<i class="fa-regular fa-heart fa-lg" style="color: #b92d3b;"></i>';
    });
    });

const back_btn = document.querySelector(".dest-details .back-btn");

back_btn.addEventListener("click", function() {
    window.location.href = "/recommendations";
});
