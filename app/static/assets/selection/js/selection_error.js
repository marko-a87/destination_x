
/* 
    <----------------------------------------------------->
    <                                                     >
    <           ERROR HANDLING UTILITY FUNCTIONS          >
    <                                                     >
    <----------------------------------------------------->        
*/

// Stores elements with elements in them
let error_elements = [];


// Check if element in list storing elements with errors
function is_error_element(target_element){
    //console.log(converted_categories);
    return error_elements.find(element => element.elementName === target_element.elementName) !== undefined;
}

// Handle flagging navigation section when it has errors
function flag_nav_section(){

    // Get the error icon element inside the "Preferences" navigation dropdown button
    let pref_error_icon = Array.from(
        find_element("navigation", "Preferences").dropdownButton.children).find(child => 
            child.classList.contains('error-icon'));
    
    // Flag to disable form error if no errors need to be addressed
    let errors_present = false

    // Loop through all navigation elements
    get_element_list("navigation").forEach(function(element) {
 
        // Find the error icon element inside the current navigation section
        let nav_error_icon = Array.from(element.dropdownButton.children).find(child => 
            child.classList.contains('error-icon'));

        // If the current element has an error
        if (element.hasErrors) {            

            //console.log(element);

            errors_present = true;

            // Show the error icon in the current navigation element
            nav_error_icon.classList.remove('hidden'); 

            // If the element is of type "Activity", also show the preference error icon
            if (element.elementType === "Activity") {

                pref_error_icon.classList.remove('hidden'); 
            }
        } 
        else {

            // If no error, and the icon is currently shown, hide it
            if (!nav_error_icon.classList.contains('hidden')) { 

                nav_error_icon.classList.add('hidden'); 

                // If it's an Activity element, also hide the preference error icon
                if (element.elementType === "Activity") {

                    pref_error_icon.classList.add('hidden'); 
                }
            }
        }     
        
        if (!errors_present) {
            
            // Remove form error message
            
            //format: disable, element, message, message_type, timeout
            display_message( 
                true, //disable display
                find_element("feedback", "Form"),
                null,
                null,
                null
            ) 

        }
        
        // Debug: Log current nav error icon and pref error icon
        //console.log("nav_error_icon:", nav_error_icon);
        //console.log("pref_error_icon", pref_error_icon);
    });   
}



// Find errors in the category section
function find_category_errors() {

    error_elements = []; // reset error elements stored
    let errors_exist = "None";

    // Search all dropdown element in categories for errors
    get_element_list("dropdown").forEach(function(element) {
    
        // Check for category-based dropdowns
        if (element.elementType === "Activity") {

            // Remove flag to show having errors                
            find_element("navigation", element.elementName).hasErrors = false;   

            Array.from(element.selectedTagsContainer.children).forEach(function(tag) {    
                
                // Check for the presence of a tag or its category

                // Find the category the tag belongs to
                let target_category = find_category(element, get_submission_list("category"));               

                // Neither the tag or its category is in the submission list
                if (target_category === undefined) {

                    errors_exist = "Category Missing";     

                    //console.log("find cat:", element);

                    // Flag dropdown nagivate section as having errors                
                    find_element("navigation", element.elementName).hasErrors = true; 

                    console.log("find errors navigation:", find_element("navigation", element.elementName)); 

                    error_elements.push(element);    
                            
                } 
                
                else if (target_category !== undefined)  {           
                    console.log("else target_category === undefined:", element);     

                    // Category exists, extract list of activities
                    let activities_list = target_category.categoryActivities;

                    // Check if activity is already in the category
                    let activity = find_activity(extract_tag_name(tag), activities_list);

                    console.log("activity:", activity);

                    if (activity === undefined) {

                        errors_exist = "Activity Missing";   
                        
                        // Flag dropdown nagivate section as having errors                
                        find_element("navigation", element.elementName).hasErrors = true;  

                        error_elements.push(element);    

                    }
                    
                }                 
                 
            });            
        }        
    });   

   

    console.log("errors_exist: ", errors_exist);
    //console.log("error_elements: ", error_elements);
    
    return errors_exist;
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all functions accessible globally

    // is_error_element(target_element) function
    window.is_error_element = is_error_element;

    // flag_nav_section() function
    window.flag_nav_section = flag_nav_section;

    // find_category_errors() function
    window.find_category_errors = find_category_errors;

});

