
/* 
    <--------------------------------------------------->
    <                                                   >
    <           DROPDOWN NAVIGATION FUNCTIONS           >
    <                                                   >
    <--------------------------------------------------->        
*/


//  <----------------------------------------------------------->
//  <     FUNCTION TO HANDLE POPULATING NAVIGATION ELEMENTS     >
//  <----------------------------------------------------------->

// Populate navigation elements intially with navigation elements like Budget
function add_static_nav_els(navigation_element_list){    
    
    navigation_element_list.push(        
        {
            elementName: "Budget",
            elementType: "Non-Category",
            dropdownButton: document.getElementById('budget-section-btn'),
            dropdownArrow: document.getElementById('budget-arrow'),
            backButton: document.getElementById('budget-back'),
            nextButton: document.getElementById('budget-next')
        },
        {
            elementName: "Passport",
            elementType: "Non-Category",
            dropdownButton: document.getElementById('passport-section-btn'),
            dropdownArrow: document.getElementById('passport-arrow'),
            backButton: document.getElementById('passport-back'),
            nextButton: document.getElementById('passport-next')
        },
        {
            elementName: "Visa",
            elementType: "Non-Category",
            dropdownButton: document.getElementById('visa-section-btn'),
            dropdownArrow: document.getElementById('visa-arrow'),
            backButton: document.getElementById('visa-back'),
            nextButton: document.getElementById('visa-next')
        },
        {
            elementName: "Activity",
            elementType: "Non-Category",
            dropdownButton: document.getElementById('activity-section-btn'),
            dropdownArrow: document.getElementById('activity-arrow')
        }    
    );
}

// Dynamically generate navigation elements for all categories & populate
// navigation element list 
function add_dynamic_nav_els(category_list, navigation_element_list){

    category_list.forEach(category => { 
        
        navigation_element_list.push(
            {          
                elementName: category.name,
                elementType: "Category",
                dropdownButton: document.getElementById(format_category_name(category.name) + "-subsection-btn"),
                dropdownArrow: document.getElementById(format_category_name(category.name) + "-subarrow"),
                backButton: document.getElementById(format_category_name(category.name) + "-back"),
                nextButton: document.getElementById(format_category_name(category.name) + "-next")
            }
        );
    });  
}



//  <---------------------------------------->
//  <    FUNCTION TO ADD NAVIGATION LOGIC    >
//  <---------------------------------------->

/*
    Navigation logic between sections using "Back" and "Next" 
    buttons.
*/
// Bind all navigation elements to logic
function add_nav_logic(navigation_element_list){    
    
    // On click back: trigger click on previous dropdown button
    // On click next: trigger click on next dropdown button

    navigation_element_list.forEach(function (element, index, array) {

        // Determine previous and next elements in the list (if they exist)
        const previous = index > 0 ? array[index - 1] : undefined;
        const next = index < array.length - 1 ? array[index + 1] : undefined;

        // Hide the back button for the first element
        if (previous === undefined) {
            element.backButton.style.display = "none";  // Disables the button
        } 
        // Hide the next button for the last element
        else if (next === undefined) {
            element.nextButton.style.display = "none";  // Disables the button
        } 

        // Allows dropdown buttons to toggle visibility of their corresponding content
        element.dropdownButton.addEventListener('click', function() {

            // Toggle active class for animation/styling
            this.classList.toggle('active');

            // Get the content to toggle and the arrow indicator
            const dropdownContent = this.nextElementSibling;
            const arrow = this.querySelector('.selection-arrow, .selection-subarrow');

            // Toggle display and change arrow direction
            if (dropdownContent.style.display === "block") {

                dropdownContent.style.display = "none";
                arrow.innerHTML = "&#9662;"; // down arrow
            } else {

                dropdownContent.style.display = "block";
                arrow.innerHTML = "&#9652;"; // up arrow
            }

        });

        // If back button exists, bind click event to navigate to previous dropdown
        if (element.backButton !== undefined){

            element.backButton.addEventListener("click", function() {

                //console.log("back");

                if (previous !== undefined) {
                    navigate_to_dropdown(element, previous);
                }

            });
        }
        
        // If next button exists, bind click event to navigate to next dropdown
        if (element.nextButton !== undefined){

            element.nextButton.addEventListener("click", function() {

                //console.log("next");

                if (next !== undefined) {
                    navigate_to_dropdown(element, next);
                }

            });

        } 
        
    });

}

// Navigates between elements
function navigate_to_dropdown(current_element, nav_to_element) { 

    // Clear feedback message if necessary (commented out in this case)
    // display_message(element, message, message_type, disable);
    /*
    display_message(
        current_element,
        null,
        null,
        true
    );
    */

    // Get the dropdown content DOM elements for the current and navigation target elements
    const this_dropdown_content = current_element.dropdownButton.nextElementSibling;
    const nav_to_dropdown_content = nav_to_element.dropdownButton.nextElementSibling;

    // Collapse the currently open dropdown
    current_element.dropdownButton.classList.remove('active');          // Remove active styling from current button
    this_dropdown_content.style.display = "none";                       // Hide current dropdown content
    current_element.dropdownArrow.innerHTML = "&#9662;";               // Set current arrow to down symbol

    // Expand the target dropdown
    nav_to_element.dropdownButton.classList.add('active');              // Add active styling to target button
    nav_to_dropdown_content.style.display = "block";                    // Show target dropdown content
    nav_to_element.dropdownArrow.innerHTML = "&#9652;";                // Set target arrow to up symbol
}





// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all navigation functions accessible globally

    // add_static_nav_els(navigation_element_list) function
    window.add_static_nav_els = add_static_nav_els;

    // add_dynamic_nav_els(category_list, navigation_element_list) function
    window.add_dynamic_nav_els = add_dynamic_nav_els;

    // add_nav_logic(navigation_element_list) function
    window.add_nav_logic = add_nav_logic;

    // navigate_to_dropdown(current_element, nav_to_element) function
    window.navigate_to_dropdown = navigate_to_dropdown;

});