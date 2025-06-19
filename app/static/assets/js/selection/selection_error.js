
/* 
    <----------------------------------------------------->
    <                                                     >
    <           ERROR HANDLING UTILITY FUNCTIONS          >
    <                                                     >
    <----------------------------------------------------->        
*/

function flag_nav_section(){
    //display the icon next to the dropdown button name
    //run this in submit form()

    let pref_error_icon = Array.from(
        find_element("navigation", "Preferences").dropdownButton.children).find(child => 
            child.classList.contains('error-icon'));

    //use hasErrors

    // Search all dropdown element in categories for errors
    get_element_list("navigation").forEach(function(element) {
 
        let nav_error_icon = Array.from(element.dropdownButton.children).find(child => 
            child.classList.contains('error-icon'));

        if (element.hasErrors) {

            nav_error_icon.classList.remove('hidden'); 

            if (element.elementType === "Category") {

                pref_error_icon.classList.remove('hidden'); 
            }
        } else {

            if (!nav_error_icon.classList.contains('hidden')) { 

                nav_error_icon.classList.add('hidden'); 

                if (element.elementType === "Category") {

                    pref_error_icon.classList.add('hidden'); 
                }
            }
        }              
        
        //console.log("nav_error_icon:", nav_error_icon);
        
        //console.log("pref_error_icon", pref_error_icon);
    });   
}



//  <--------------------------------------------------->
//  <    FUNCTION TO FIND ERRORS IN CATEGORY SECTION    >
//  <--------------------------------------------------->

function find_category_errors() {

    let errors_exist = "None";

    // Search all dropdown element in categories for errors
    get_element_list("dropdown").forEach(function(element) {
    
        // Check for category-based dropdowns
        if (element.elementType === "Category") {

            // Remove flag to show having errors                
            find_element("navigation", element.elementName).hasErrors = false;   

            Array.from(element.selectedTagsContainer.children).forEach(function(tag) {        
                
                // Check for the presence of a tag or its category

                // Find the category the tag belongs to
                let target_category = find_category(element, get_submission_list("category"));
                
                //console.log(target_category);

                // Neither the tag or its category is in the submission list
                if (target_category === undefined) {

                    errors_exist = "Category Missing";     

                    // Flag dropdown nagivate section as having errors                
                    find_element("navigation", element.elementName).hasErrors = true;     
                            
                } 
                
                else {
                
                    if (target_category !== undefined) {

                        // Category exists, extract list of activities
                        let activities_list = target_category.categoryActivities;

                        // Check if activity is already in the category
                        let activity = find_activity(extract_tag_name(tag), activities_list);

                        if (activity === undefined) {

                            errors_exist = "Activity Missing";   
                            
                            // Flag dropdown nagivate section as having errors                
                            find_element("navigation", element.elementName).hasErrors = true;  
                            
                            //console.log(find_element("navigation", element.elementName));
                        }
                    }
                }
                 
                console.log("find errors navigation:", find_element("navigation", element.elementName));  

            });
            
        }        
    });   


    console.log("errors_exist: ", errors_exist);
    
    return errors_exist;
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all functions accessible globally

    // find_category_errors() funstion
    window.find_category_errors = find_category_errors;

});

