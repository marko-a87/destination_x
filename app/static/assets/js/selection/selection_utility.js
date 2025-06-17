
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



//  <------------------------------------------------->
//  <     CATEGORY & ACTIVITIES UTILITY FUNCTIONS     >
//  <------------------------------------------------->

// Extract first word from category name, convert to lowercase
function format_category_name(category_name){
    return category_name.split(' ')[0].toLowerCase();
}

// Take name from tag element by extracting text before the span element starts (" <")
// from the tag element's inner HTML
function extract_tag_name(tag) {

    //console.log(tag);

    return tag.innerHTML.slice(0, tag.innerHTML.indexOf(" <"));
}

// Find a category from the category_submit array based on the element name
function find_category(element, category_submit_list) {

    let category_exists_check = category_submit_list.find(
        category => Object.values(category).find(category_value => category_value === element.elementName) !== undefined
    );

    return category_exists_check;
}


// Find a specific activity within a given list of activities
function find_activity(tag_name, activities) {

    let activity_exists_check = activities.find(
        activity => Object.values(activity).find(activity_value => activity_value === tag_name) !== undefined
    );

    return activity_exists_check;
}


// Look for a specific activity that matches a tag
function activity_in_category(element, tag_element, category_submit_list) {
    
    // Store name of tag
    let selected_tag_name = extract_tag_name(tag_element);

    // Look for category 
    let target_category = find_category(element.sliderListElement, category_submit_list);

    // If category related to the activity is found
    if (target_category !== undefined) {            
        
        // Get all activities previously selected under category
        let activities_list = target_category.categoryActivities;
        
        // Look for the activity in category
        let activity = find_activity(selected_tag_name, activities_list);
        
        // If a match is found for the activity
        if (activity !== undefined) {            

            if (activity.activityName === selected_tag_name) {           

                return activity;
            }            
        }

        return activity;

    }

}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all slider functions accessible globally

    // <----------- GENERAL ------------->
    // to_title_case(string) function
    window.to_title_case = to_title_case


    // <----- CATEGORY & ACTIVITIES ----->
    // format_category_name(category_name) function
    window.format_category_name = format_category_name;

    // extract_tag_name(tag) function
    window.extract_tag_name = extract_tag_name;

    // find_category(element, category_submit_list) function
    window.find_category = find_category;

    // format_category_name(category_name) function
    window.find_activity = find_activity;

    // activity_in_category(element, tag_element, category_submit_list) function
    window.activity_in_category = activity_in_category;
    
});
