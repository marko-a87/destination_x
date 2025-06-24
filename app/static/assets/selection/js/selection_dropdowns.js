
/* 
    <--------------------------------------------------->
    <                                                   >
    <           DROPDOWN ELEMENTS & FUNCTIONS           >
    <                                                   >
    <--------------------------------------------------->        
*/


//  <--------------------------------------------->
//  <     HANDLE POPULATING DROPDOWN ELEMENTS     >
//  <--------------------------------------------->

/*
    <------------------------------------------------------->
    <  Manages dropdowns and tag selections for categories  > 
    <  and special elements like Visa and Passport.         >
    <------------------------------------------------------->
*/
// Populate dropdown_elements intially with static elements like Passport
const dropdown_elements = [
    {
        elementName: "Visa",
        elementType: "Non-Activity",
        dropdownElement: document.getElementById('visa-tagDropdown'),
        selectedTagsContainer: document.getElementById('visa-selectedTags')
    },
    {
        elementName: "Passport",
        elementType: "Non-Activity",
        dropdownElement: document.getElementById('passport-tagDropdown'),
        selectedTagsContainer: document.getElementById('passport-selectedTags')
    }   
];


// Dynamically generate dropdown elements for all categories & populate dropdown element list 
get_categories_list().forEach(category => { 

    dropdown_elements.push(
        {
            elementName: category.name,
            elementType: "Activity",
            dropdownElement: document.getElementById(format_category_name(category.name) + "-tagDropdown"),
            selectedTagsContainer: document.getElementById(format_category_name(category.name) + "-selectedTags"),
            priorityName: document.getElementById(format_category_name(category.name) + "-priority-name"),
            sliderDiv: document.getElementById(format_category_name(category.name) + "-slider-control"),
            sliderListElement: find_element("slider", category.name)
        }
    );
});   


//  <------------------------------>
//  <    ADD DROPDOWN LISTENERS    >
//  <------------------------------>

// Bind all dropdowns and tag containers to logic
dropdown_elements.forEach(element => {

    // Common between Static dropdowns like Visa/Passport & Category-based dropdowns

    element.dropdownElement.addEventListener('change', () => {
        process_dropdown_selection(element);    
        
        // Resets dropdown after 2 seconds
        reset_dropdown_selection(element, 2000);        
    });

    element.selectedTagsContainer.addEventListener('click', (event_element) => {          
        remove_tags(event_element, element);
    });

    if (element.elementType === "Activity") {   

        // Binding logic to Adjust/"Save" button for category-based dropdowns

        // On Adjust/"Save" button click, update the data structure
        element.sliderListElement.adjustBtn.addEventListener("click", () => {
            update_activity_submit(element.sliderListElement);
        });         
    } 
});




//  <------------------------------------------------------->
//  <    UTILITY FUNCTIONS FOR DROPDOWN SELECTION & TAGS    >
//  <------------------------------------------------------->

// Returns dropdown to "Select a tag" after given secs 
function reset_dropdown_selection(element, time_ms) {
      
    setTimeout(() => {
        element.dropdownElement.selectedIndex = 0; 
    }, time_ms); // eg. 2000ms = 2 seconds
}

// Toggle display of an element's slider
function hide_category_slider(element, hide) {

    // If the hide flag is true, hide the slider and reset its value
    if (hide === true) {

        // Reset the slider's numeric value to 0
        element.sliderListElement.sliderElement.value = 0;

        // Reset the displayed amount next to the slider to 0
        element.sliderListElement.amountValue.innerHTML = 0;
        
        // Hide the slider container
        element.sliderDiv.style.display = "none";
    }     
    else {          
        
        // Otherwise, show the slider using flex layout
        element.sliderDiv.style.display = "flex";           
    }
}

// If activity already exists, update slider with existing priority 
function repopulate_category_slider(element, tag_element) {

    // Check if the activity is already present in the selected category list
    let activity = activity_in_category(element, tag_element);
    
    // If activity is found (i.e., not undefined)
    if (activity !== undefined) {           

        // Set the slider's value to the previously selected priority
        element.sliderListElement.sliderElement.value = activity.activityPriority;

        // Update the displayed number next to the slider
        element.sliderListElement.amountValue.innerHTML = activity.activityPriority;
    }
}


//  <--------------------------------------------->
//  <    FUNCTIONS TO HANDLE NEW TAG SELECTION    >
//  <--------------------------------------------->

// Create tag and add to UI when dropdown value is selected
function process_dropdown_selection(element) {  

    //console.log(element);
    //console.log("populate_tags test");

    // Clear feedback if present
    console.log("proc, display clear");
    display_message( 
        true, //disable display
        find_element("feedback", element.elementName),
        null,
        null,
        null
    ) 

    // Extract selected value of dropdown
    const selected_value = element.dropdownElement.value;
    
    // If dropdown selection is empty, do nothing
    if (!selected_value) { 
        return;      
    }

    // If a tag with the selected value already exists in the container, do nothing
    if (Array.from(element.selectedTagsContainer.children).some(tag => tag.dataset.value === selected_value)) {
        
        //console.log("duplicate tag");    

        // Display error message to notify user of duplicate tags

        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "<strong>'" + selected_value + "'</strong> was already selected.",
            "neutral",
            null
        ) 

        // Resets dropdown after 2 seconds to allow re-selection
        reset_dropdown_selection(element, 2000);
        
        // Prevent duplicate tags   
        return;
    } 

    // if any tag is missing a priority, do nothing (prevent new tag selection)
    if (element.elementType === "Activity" && 
        (find_category_errors() === "Category Missing" || find_category_errors() === "Activity Missing") && 
        Array.from(element.selectedTagsContainer.children).length !== 0) {

        // Also checks whether tags actually exist in the container

        // Prevent new tags being selected when one is missing a priority
        //console.log("test2");

        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "Please click <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> and set the tag priority.",
            "error",
            null
        ) 

        // Prevent addition of more tags until priority is set
        return;
    }

    // Create a new tag DOM element using the selected value if passes above checks
    const new_tag = create_tag_element(element, selected_value);    
    
    // Check if tag is for Visa or Passport (i.e., not an activity category)
    if (element.elementType === "Non-Activity")  {
        
        // Update country submission list for visa/passport types
        update_country_submit(element.dropdownElement);
    } 
    else {

        // Track the most recently added tag for feedback display
        recently_added_tag = new_tag;
        
        console.log("process dropdwon, recently_added_tag: ", recently_added_tag);

        // Let user know to click on tags to set priority
        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "Click the <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> tag to set priority.",
            "neutral",
            null
        ) 
    }

    // Add the new tag element to the container in the UI
    element.selectedTagsContainer.appendChild(new_tag);      

    // Resets dropdown after 2 seconds
    reset_dropdown_selection(element, 2000);
}




// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all dropdown functions accessible globally

    // reset_dropdown_selection(element, time_ms) function
    window.reset_dropdown_selection = reset_dropdown_selection;

    // hide_category_slider(element, hide) function
    window.hide_category_slider = hide_category_slider;

    // repopulate_category_slider(element, tag_element) function
    window.repopulate_category_slider = repopulate_category_slider;

    // process_dropdown_selection(element) function
    window.process_dropdown_selection = process_dropdown_selection;
});



