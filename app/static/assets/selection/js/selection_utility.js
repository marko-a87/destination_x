
/* 
    <----------------------------------------------------->
    <                                                     >
    <           SELECTION PAGE UTILITY FUNCTIONS          >
    <                                                     >
    <----------------------------------------------------->        
*/


//  <----------------------------------->
//  <     GENERAL UTILITY FUNCTIONS     >
//  <----------------------------------->

// Turn a string into title case eg. word -> Word
function to_title_case(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


//  <---------------------------------------------->
//  <     FUNCTIONS TO ACCESS DECLARED ENTITIES    >
//  <---------------------------------------------->

// Get a specific submission list declared in selection_input.html script
function get_submission_list(list_type){

    switch (list_type) {
        
        case "passport":
            return passports_submit;

        case "visa":
            return visas_submit;

        case "category":
            return category_submit;

        default:
            console.error("Invalid submission list type: ", element_type);
    }
}

// Search for specific country added to passport_submit_list or visa_submit_list
function find_country(section_type, country_name){

    switch (section_type) {
        
        case "passport":            
            return get_submission_list("passport").find(country => country === country_name);

        case "visa":
            return get_submission_list("visa").find(country => country === country_name);

        default:
            console.error("Invalid section type: ", section_type);
    }
}

// Get a specific element list declared in selection_input.html script
function get_element_list(list_type){

    switch (list_type) {
        
        case "slider":
            return slider_elements;

        case "dropdown":
            return dropdown_elements;

        case "navigation":
            return navigation_elements;

        case "feedback":
            return feedback_elements;

        default:
            console.error("Invalid element list type: ", list_type);
    }
}

// Search for specific element declared in selection_input.html script
function find_element(element_type, element_name){

    switch (element_type) {
        
        case "slider":
            return get_element_list("slider").find(slider_element => slider_element.elementName === element_name);

        case "dropdown":
            return get_element_list("dropdown").find(dropdown_element => dropdown_element.elementName === element_name);

        case "navigation":
            return get_element_list("navigation").find(navigation_element => navigation_element.elementName === element_name);

        case "feedback":
            return get_element_list("feedback").find(feedback_element => feedback_element.elementName === element_name);

        default:
            console.error("Invalid element type: ", element_type);
    }
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all slider functions accessible globally

    // <---------------- GENERAL ------------------>
    // to_title_case(string) function
    window.to_title_case = to_title_case;

    // get_element_list(list_type) function
    window.get_element_list = get_element_list;


    // <-- FUNCTIONS TO ACCESS DECLARED ENTITIES -->
    // get_submission_list(list_type) function
    window.get_submission_list = get_submission_list;

    // find_country(section_type, country_name) function
    window.find_country = find_country;

    // get_element_list(list_type) function
    window.get_element_list = get_element_list;

    // find_element(element_type, element_name) function
    window.find_element = find_element;

});
