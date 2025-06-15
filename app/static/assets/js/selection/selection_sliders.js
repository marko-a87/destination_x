
/* 
    <------------------------------------------------>
    <--------------- SLIDER FUNCTIONS --------------->
    <------------------------------------------------>        
*/


// Update display value when slider is moved manually
function set_pref_amt(el_slider, amt_val, display_val) {      
    display_val = parseInt(el_slider.value);
    amt_val.innerText = display_val;
}

// Increase slider value using plus button
function increase_amt(el_slider, amt_val, add_val) { 
    let current_val = parseInt(amt_val.innerText);

    if (current_val < parseInt(el_slider.max)) {
    current_val += add_val;
    }

    el_slider.value = current_val;
    amt_val.innerText = current_val;
}

// Decrease slider value using minus button
function decrease_amt(el_slider, amt_val, minus_val) { 
    let current_val = parseInt(amt_val.innerText);

    if (current_val > parseInt(el_slider.min)) {
    current_val -= minus_val;
    }

    el_slider.value = current_val;
    amt_val.innerText = current_val;
}

// Add listeners for all sliders and associated UI buttons
slider_elements.forEach(element => {

    element.slider.addEventListener("input", () => {
    set_pref_amt(element.slider, element.amountValue);
    });

    element.increaseBtn.addEventListener("click", () => {
    increase_amt(element.slider, element.amountValue, element.stepValue);
    });

    element.decreaseBtn.addEventListener("click", () => {
    decrease_amt(element.slider, element.amountValue, element.stepValue);
    });

});
