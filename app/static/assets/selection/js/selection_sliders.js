
/* 
    <------------------------------------------------->
    <                                                 >
    <           SLIDER ELEMENTS & FUNCTIONS           >
    <                                                 >
    <------------------------------------------------->        
*/


//  <------------------------------------------->
//  <     HANDLE POPULATING SLIDER ELEMENTS     >
//  <------------------------------------------->

/*
    <---------------------------------------------------------------->
    <  This array holds all slider-related UI elements and settings  >
    <  for budget and each dynamic category created from backend.    >
    <---------------------------------------------------------------->
*/
// Populate slider elements intially with static elements like Budget    
const slider_elements = [
    {
        // Base budget slider and controls
        elementName: "Budget",
        elementType: "Non-Activity",
        sliderElement: document.getElementById("budget-amountSlider"),
        amountValue: document.getElementById("budget-amountValue"),
        increaseBtn: document.getElementById("budget-increaseBtn"),
        decreaseBtn: document.getElementById("budget-decreaseBtn"),
        stepValue: 50 // Budget slider increases in $50 increments
    }
];


// Dynamically generate slider elements for all categories & populate
// slider element list 
get_categories_list().forEach(category => {

    slider_elements.push(
        {
            elementName: category.name,
            elementType: "Activity",
            sliderElement: document.getElementById(format_category_name(category.name) + "-amountSlider"),
            amountValue: document.getElementById(format_category_name(category.name) + "-amountValue"),
            increaseBtn: document.getElementById(format_category_name(category.name) + "-increaseBtn"),
            decreaseBtn: document.getElementById(format_category_name(category.name) + "-decreaseBtn"),
            adjustBtn: document.getElementById(format_category_name(category.name) + "-adjustBtn"),
            stepValue: 1 // Category sliders increase in single units
        }
    );
        
});    
    



//  <---------------------------->
//  <    ADD SLIDER LISTENERS    >
//  <---------------------------->

// Bind all slider elements to logic
slider_elements.forEach(element => {

    element.sliderElement.addEventListener("input", () => {
        set_preference_amount(element);
    });

    element.increaseBtn.addEventListener("click", () => {
        increase_amount(element);
    });

    element.decreaseBtn.addEventListener("click", () => {
        decrease_amount(element);
    });

});




//  <----------------------------------->
//  <    FUNCTIONS TO UPDATE SLIDERS    >
//  <----------------------------------->

// Update display value when slider is moved manually
function set_preference_amount(slider_element) {      
    
    display_val = parseInt(slider_element.sliderElement.value);
    slider_element.amountValue.innerText = display_val;     

}

// Increase slider value using plus button
function increase_amount(slider_element) { 

    let current_val = parseInt(slider_element.amountValue.innerText);

    if (current_val < parseInt(slider_element.sliderElement.max)) {
    current_val += slider_element.stepValue;
    }

    slider_element.sliderElement.value = current_val;
    slider_element.amountValue.innerText = current_val;

}

// Decrease slider value using minus button
function decrease_amount(slider_element) { 

    let current_val = parseInt(slider_element.amountValue.innerText);

    if (current_val > parseInt(slider_element.sliderElement.min)) {
    current_val -= slider_element.stepValue;
    }

    slider_element.sliderElement.value = current_val;
    slider_element.amountValue.innerText = current_val;

}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all slider functions accessible globally

    // set_preference_amount(slider_element) function
    window.set_preference_amount = set_preference_amount;

    // increase_amount(slider_element) function
    window.increase_amount = increase_amount;

    // increase_amount(slider_element) function
    window.increase_amount = increase_amount;

});

