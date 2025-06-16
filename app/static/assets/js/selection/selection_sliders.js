
/* 
    <------------------------------------------------>
    <--------------- SLIDER FUNCTIONS --------------->
    <------------------------------------------------>        
*/

/*  
Element Format:
    elementName: "{{ category.category_name | escape }}",
    sliderElement: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-amountSlider"),
    amountValue: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-amountValue"),
    increaseBtn: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-increaseBtn"),
    decreaseBtn: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-decreaseBtn"),
    adjustBtn: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-adjustBtn"),
    stepValue: 1 // Category sliders increase in single units
*/

function dynamic_slider_element(category_list){
    
}

// Update display value when slider is moved manually
function set_pref_amt(slider_element) {      
    display_val = parseInt(slider_element.sliderElement.value);
    slider_element.amountValue.innerText = display_val;      
}


// Increase slider value using plus button
function increase_amt(slider_element) { 
    let current_val = parseInt(slider_element.amountValue.innerText);

    if (current_val < parseInt(slider_element.sliderElement.max)) {
    current_val += slider_element.stepValue;
    }

    slider_element.sliderElement.value = current_val;
    slider_element.amountValue.innerText = current_val;
}


// Decrease slider value using minus button
function decrease_amt(slider_element) { 
    let current_val = parseInt(slider_element.amountValue.innerText);

    if (current_val > parseInt(slider_element.sliderElement.min)) {
    current_val -= slider_element.stepValue;
    }

    slider_element.sliderElement.value = current_val;
    slider_element.amountValue.innerText = current_val;
}


function add_slider_listeners(slider_element_list) {

    //console.log(slider_element_list);

    // Add listeners for all sliders and associated UI buttons
    slider_element_list.forEach(element => {

        element.sliderElement.addEventListener("input", () => {
          set_pref_amt(element);
        });

        element.increaseBtn.addEventListener("click", () => {
          increase_amt(element);
        });

        element.decreaseBtn.addEventListener("click", () => {
          decrease_amt(element);
        });

    });

}