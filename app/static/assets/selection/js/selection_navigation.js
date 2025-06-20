
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
            elementType: "Non-Activity",
            dropdownButton: document.getElementById('budget-section-btn'),
            dropdownArrow: document.getElementById('budget-arrow'),
            backButton: document.getElementById('budget-back'),
            nextButton: document.getElementById('budget-next'),
            hasErrors: false
        },
        {
            elementName: "Passport",
            elementType: "Non-Activity",
            dropdownButton: document.getElementById('passport-section-btn'),
            dropdownArrow: document.getElementById('passport-arrow'),
            backButton: document.getElementById('passport-back'),
            nextButton: document.getElementById('passport-next'),
            hasErrors: false
        },
        {
            elementName: "Visa",
            elementType: "Non-Activity",
            dropdownButton: document.getElementById('visa-section-btn'),
            dropdownArrow: document.getElementById('visa-arrow'),
            backButton: document.getElementById('visa-back'),
            nextButton: document.getElementById('visa-next'),
            hasErrors: false
        },
        {
            elementName: "Preferences",
            elementType: "Non-Activity",
            dropdownButton: document.getElementById('activity-section-btn'),
            dropdownArrow: document.getElementById('activity-arrow'),
            hasErrors: false
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
                elementType: "Activity",
                dropdownButton: document.getElementById(format_category_name(category.name) + "-subsection-btn"),
                dropdownArrow: document.getElementById(format_category_name(category.name) + "-subarrow"),
                backButton: document.getElementById(format_category_name(category.name) + "-back"),
                nextButton: document.getElementById(format_category_name(category.name) + "-next"),
                hasErrors: false
            }
        );
    });  
}



//  <---------------------------------------->
//  <    FUNCTION TO ADD NAVIGATION LOGIC    >
//  <---------------------------------------->

/*
    Navigation dropdown section elements.
    Navigation logic between sections using "Back" and "Next" 
    buttons.
*/

// Toggle the display of sections
function toggle_nav_content(element, collapse) {
    
    // Get the section content DOM elements for the current element   
    const section_content = element.dropdownButton.nextElementSibling;

    //console.log(element.dropdownButton);

    // Toggle active styling from current button
    element.dropdownButton.classList.toggle('active');
    // Toggle dropdown section content
    section_content.classList.toggle('hidden'); 
    
    //console.log(section_content.classList);

    // Hide section content
    if (collapse === true) {

        // Set current arrow to down symbol
        element.dropdownArrow.innerHTML = "&#9662;"; 
    }
    else {

        // Set current arrow to up symbol  
        element.dropdownArrow.innerHTML = "&#9652;";       

        if (element.elementName !== "Preferences"){
            
            // Bring attention to section by scrolling it into view
            section_content.scrollIntoView({ behavior: "smooth", block: "center" });
        }

    }
}

// Navigates between sections
function navigate_to_dropdown(current_element, nav_to_element, skip_element) { 

    //console.log("current_element:", current_element);
    //console.log("nav_to_element:", nav_to_element);

    // If a category has unresolved errors
    if (find_category_errors() !== "None"){

        // Display error informing user to address current errors first

        //format: disable, element, message, message_type
        display_message( 
            false, //don't disable display
            find_element("feedback", current_element.elementName),
            "Please ensure priorities are set for all selected tags.",
            "error"
        ) 

        // Flag the effected categories
        flag_nav_section();
    }

    // If current element has unresolves errors
    else if (current_element.hasErrors){

        // Display error informing user to address current errors first

        //format: disable, element, message, message_type
        display_message( 
            false, //don't disable display
            find_element("feedback", current_element.elementName),
            "Please address all errors in this section.",
            "error"
        ) 

        // Flag the effected categories
        flag_nav_section();
    }

    else {      

        // Clear feedback if present            
        //format: disable, element, message, message_type
        display_message( 
            true, //disable display
            find_element("feedback", current_element.elementName),
            null,
            null
        )    

        // Unflag any effected actvity sections that had errors
        flag_nav_section();

        // Collapse the currently open dropdown
        toggle_nav_content(current_element, true);

        // Allows the opening of a subcategory at the same time as main
        if (skip_element !== undefined){   

            // Expand the sub section dropdown content
            toggle_nav_content(skip_element, false);
        }

        // Expand the target section dropdown content
        toggle_nav_content(nav_to_element, false);
    }    
}

// Bind all navigation elements to logic
function add_nav_logic(navigation_element_list){    
    
    // On click back: trigger click on previous dropdown button
    // On click next: trigger click on next dropdown button

    navigation_element_list.forEach(function (element, index, array) {

        // Determine previous and next elements in the list (if they exist)
        const previous = index > 0 ? array[index - 1] : undefined;
        const next = index < array.length - 1 ? array[index + 1] : undefined;

        // Toggle dropdown section
        let show_section = false;   

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
            
            toggle_nav_content(element, show_section);

            // Flip boolean value
            show_section = !show_section;
        });

        // If back button exists, bind click event to navigate to previous dropdown
        if (element.backButton !== undefined){

            element.backButton.addEventListener("click", function() {

                //console.log("back");

                if (previous.elementName === "Preferences"){

                    const before_previous = index > 0 ? array[index - 2] : undefined;
                    //console.log("before_previous:", before_previous);

                    navigate_to_dropdown(element, before_previous, previous);
                }
                else if (previous !== undefined) {

                    navigate_to_dropdown(element, previous);
                }
            });
        }
        
        // If next button exists, bind click event to navigate to next dropdown
        if (element.nextButton !== undefined){

            element.nextButton.addEventListener("click", function() {

                //console.log("next");
                
                if (next.elementName === "Preferences"){

                    const after_next = index < array.length - 1 ? array[index + 2] : undefined;
                    //console.log("after_next:", after_next);

                    navigate_to_dropdown(element, after_next, next);
                }
                else if (next !== undefined) {      

                    navigate_to_dropdown(element, next);
                }
            });
        }         
    });
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all navigation functions accessible globally

    // add_static_nav_els(navigation_element_list) function
    window.add_static_nav_els = add_static_nav_els;

    // add_dynamic_nav_els(category_list, navigation_element_list) function
    window.add_dynamic_nav_els = add_dynamic_nav_els;

    // toggle_nav_content(element, collapse) function
    window.toggle_nav_content = toggle_nav_content;

    // navigate_to_dropdown(current_element, nav_to_element) function
    window.navigate_to_dropdown = navigate_to_dropdown;

    // add_nav_logic(navigation_element_list) function
    window.add_nav_logic = add_nav_logic;

});