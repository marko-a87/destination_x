
/* 
    <------------------------------------------------------>
    <--------------- SELECTION PAGE UTILITY --------------->
    <------------------------------------------------------>        
*/

// Ulitity function to take name from tag element by extracting text before the " <" from the tag element's HTML
function extract_tag_name(tag) {

    //console.log(tag);

    return tag.innerHTML.slice(0, tag.innerHTML.indexOf(" <"));
}



// Utility function to find a category from the category_submit array based on the element name
function find_category(element, category_submit_list) {

    let category_exists_check = category_submit_list.find(
        category => Object.values(category).find(category_value => category_value === element.elementName) !== undefined
    );

    return category_exists_check;
}



// Utility function to find a specific activity within a given list of activities
function find_activity(tag_name, activities) {

    let activity_exists_check = activities.find(
        activity => Object.values(activity).find(activity_value => activity_value === tag_name) !== undefined
    );

    return activity_exists_check;
}


// General

function toTitleCase(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


