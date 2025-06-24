
/* 
    <--------------------------------------------->
    <                                             >
    <           TAG ELEMENT & FUNCTIONS           >
    <                                             >
    <--------------------------------------------->        
*/

// Stores trackers for feedback logic, globally accessible across files
window.current_clicked_tag = null;
window.recently_added_tag = null;

//  <----------------------------------------------->
//  <    FUNCTIONS TO HANDLE HANDLE TAG CREATION    >
//  <----------------------------------------------->

// Create tag element and bind logic on click
function create_tag_element(element, tag_value) {

    // Create new tag UI element
    const tag = document.createElement('div');
    tag.classList.add('selection-tag');
    tag.dataset.value = tag_value;
    tag.innerHTML = `${tag_value} <span class="remove-tag"> &times; </span>`;   

    // Handle click to activate tag and show priority slider
    tag.addEventListener("click", function(event_element) {

        let onclick_tag = event_element.target;

        // Check to see if we're working with a activity category rather than visa/passport
        if (element.elementType === "Activity") {              

            // Only one tag should be active per category  

            if (Array.from(element.selectedTagsContainer.children).some(child => child !== tag 
                && child.classList.contains("active-tag"))) {
                
                // Checks if some other tag in this container is active and if so, disables active tag

                let activated_tag = Array.from(element.selectedTagsContainer.children).find(child => child !== tag 
                    && child.classList.contains("active-tag"));

                //console.log("activated_tag:", activated_tag);
                
                // Disable currently activated tag
                toggle_active_tag(element, activated_tag, tag_value);        
            } 
                
            // Set clicked tag as current clicked tag for updating the categories and priorities
            current_clicked_tag = onclick_tag;
            //console.log("process dropdwon, current_clicked_tag: ", current_clicked_tag);

            // Enable currently clicked tag
            toggle_active_tag(element, onclick_tag, tag_value);
        } 
    }); 

    // Return the tag element with the binded logic
    return tag;
}

// Allows for the flagging and removal of selection of tags
function toggle_active_tag(element, tag_element, tag_value){

    // Check if this tag is already active
    if (tag_element.classList.contains("active-tag")) {

        console.log(extract_tag_name(tag_element) + " Tag Deactivated");

        // Set/deselect tag as active
        tag_element.classList.remove("active-tag");

        // Hide slider UI
        hide_category_slider(element, true);
    }                
    else {

        console.log(extract_tag_name(tag_element) + " Tag Activated");

        // Set/select tag as active 
        tag_element.classList.add('active-tag');

        // Update text next to slider
        element.priorityName.innerHTML = "Adjust '" + tag_value + "' Priority:";

        // Display message to notify user to click save to set priority

        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "Click <strong>'Save'</strong> to set the new priority of <strong>'" + 
            extract_tag_name(tag_element) + "'</strong>.",
            "neutral",
            null
        ) 

        // Show slider UI
        hide_category_slider(element, false);   

        // Set any previous slider values      
        repopulate_category_slider(element, tag_element);     
    }
}



//  <--------------------------------------------->
//  <    FUNCTIONS TO HANDLE HANDLE TAG REMOVAL   >
//  <--------------------------------------------->

// Removes tag and update data structure when "×" is clicked
function remove_tags(event_element, element) { 
    
    // Only act if the close (×) icon is clicked
    if (event_element.target.classList.contains('remove-tag')) {
        
        // Clear feedback if present
        display_message( 
            true, //disable display
            find_element("feedback", element.elementName),
            null,
            null,
            null
        )    
    
        // event_element target refers to the x span element clicked, parent is the whole tag
        let onclick_tag = event_element.target.parentElement;
        console.log("deleting: ", onclick_tag)

        // Remove associated data from the submission lists
        remove_from_submit(element, onclick_tag);       
        
        // Remove tag from UI (parent is selected tags container)
        onclick_tag.remove(); 
    }        
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all functions accessible globally
    
    // toggle_active_tag(element, tag_element, tag_value) function
    window.toggle_active_tag = toggle_active_tag;

    // create_tag_element(element, tag_value, category_submit_list) function
    window.create_tag_element = create_tag_element;

    // remove_tags(event_element, element) function
    window.remove_tags = remove_tags;

});
