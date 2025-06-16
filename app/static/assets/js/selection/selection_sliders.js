
/* 
    <------------------------------------------------->
    <                                                 >
    <           SLIDER ELEMENTS & FUNCTIONS           >
    <                                                 >
    <------------------------------------------------->        
*/


//  <------------------------------------------------------->
//  <     FUNCTION TO HANDLE POPULATING SLIDER ELEMENTS     >
//  <------------------------------------------------------->

// Extract first word from category name, convert to lowercase
function format_category_name(category_name){
    return category_name.split(' ')[0].toLowerCase();
}

// Populate slider_elements intially with static elements like Budget
function static_slider_elements(slider_element_list){    
    
    slider_element_list.push({
        // Base budget slider and controls
        elementName: "Budget",
        sliderElement: document.getElementById("budget-amountSlider"),
        amountValue: document.getElementById("budget-amountValue"),
        increaseBtn: document.getElementById("budget-increaseBtn"),
        decreaseBtn: document.getElementById("budget-decreaseBtn"),
        stepValue: 50 // Budget slider increases in $50 increments
    });

}

/* Dynamically generate slider elements for all categories & populate
slider element list */
function dynamic_slider_elements(category_list, slider_element_list){

    category_list.forEach(category => {

            // Push additional dynamic
            slider_element_list.push({
                elementName: category.category_name,
                sliderElement: document.getElementById(format_category_name(category.category_name) + "-amountSlider"),
                amountValue: document.getElementById(format_category_name(category.category_name) + "-amountValue"),
                increaseBtn: document.getElementById(format_category_name(category.category_name) + "-increaseBtn"),
                decreaseBtn: document.getElementById(format_category_name(category.category_name) + "-decreaseBtn"),
                adjustBtn: document.getElementById(format_category_name(category.category_name) + "-adjustBtn"),
                stepValue: 1 // Category sliders increase in single units
            });
            
        }
    );    
    
}


//  <---------------------------------------->
//  <    FUNCTION TO ADD SLIDER LISTENERS    >
//  <---------------------------------------->

function add_slider_listeners(slider_element_list){    
    
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


//  <----------------------------------->
//  <    FUNCTIONS TO UPDATE SLIDERS    >
//  <----------------------------------->

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






// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    


});

