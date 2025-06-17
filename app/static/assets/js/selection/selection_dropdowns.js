
/* 
    <--------------------------------------------------->
    <                                                   >
    <           DROPDOWN ELEMENTS & FUNCTIONS           >
    <                                                   >
    <--------------------------------------------------->        
*/


//  <--------------------------------------------------------->
//  <     FUNCTION TO HANDLE POPULATING DROPDOWN ELEMENTS     >
//  <--------------------------------------------------------->

// Populate dropdown_elements intially with static elements like Passport
function add_static_dropdowns(dropdown_element_list){    
    
    dropdown_element_list.push(
        {
            elementName: "Visa",
            elementType: "Non-Category",
            dropdownElement: document.getElementById('visa-tagDropdown'),
            selectedTagsContainer: document.getElementById('visa-selectedTags')
        },
        {
            elementName: "Passport",
            elementType: "Non-Category",
            dropdownElement: document.getElementById('passport-tagDropdown'),
            selectedTagsContainer: document.getElementById('passport-selectedTags')
        }   
    );

}

// Dynamically generate dropdown elements for all categories & populate
// dropdown element list 
function add_dynamic_dropdowns(category_list, dropdown_element_list, slider_element_list){

    category_list.forEach(category => { 

        dropdown_element_list.push(
            {
                elementName: category.name,
                elementType: "Category",
                dropdownElement: document.getElementById(format_category_name(category.name) + "-tagDropdown"),
                selectedTagsContainer: document.getElementById(format_category_name(category.name) + "-selectedTags"),
                priorityName: document.getElementById(format_category_name(category.name) + "-priority-name"),
                sliderDiv: document.getElementById(format_category_name(category.name) + "-slider-control"),
                sliderListElement: slider_element_list.find(element => element.elementName === category.name)
            }
        );

    });   

    //console.log(dropdown_element_list);
    
}



//  <------------------------------------------>
//  <    FUNCTION TO ADD DROPDOWN LISTENERS    >
//  <------------------------------------------>

// Bind all dropdown elements to logic
function add_dropdown_listeners(dropdown_element_list, current_clicked_tag, recently_added_tag, category_submit_list, passport_submit_list, visa_submit_list) {

    //console.log(dropdown_element_list);

    // Bind all dropdowns and tag containers to logic
    dropdown_element_list.forEach(element => {

        // Common between Static dropdowns like Visa/Passport & Category-based dropdowns

        element.dropdownElement.addEventListener('change', () => {
            process_dropdown_selection(element, current_clicked_tag, recently_added_tag, category_submit_list);            
        });

        element.selectedTagsContainer.addEventListener('click', (event_element) => {          
            remove_tags(event_element, element, category_submit_list, passport_submit_list, visa_submit_list);
        });

        if (element.elementType === "Category") {   

            element.selectedTagsContainer.addEventListener('change', () => {          

                //Display feedback to let user know upon selecting from dropdown to click on tag and add priority                

                //use find errors
                // display message - 
                // note: "Click the <strong>'" + extract_tag_name(recently_added_tag) + 
                // "'</strong> tag to set priority.",
                // false, don't disable display
            });       

            // Binding logic to Adjust/"Save" button for category-based dropdowns

            // On Adjust/"Save" button click, update the data structure
            element.sliderListElement.adjustBtn.addEventListener("click", () => {
                update_activity_submit(current_clicked_tag, element.sliderListElement);
            });           

        } 

    });

}


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




//  <--------------------------------------------->
//  <    FUNCTIONS TO HANDLE NEW TAG SELECTION    >
//  <--------------------------------------------->

// Create tag and add to UI when dropdown value is selected
function process_dropdown_selection(element, current_clicked_tag, recently_added_tag, category_submit_list) {  

    //console.log(element);
    //console.log("populate_tags test");

    // Extract selected value of dropdown
    const selected_value = element.dropdownElement.value;
    
    // If dropdown selection is empty, do nothing
    if (!selected_value) { 
        return;      
    }

    // if any tag is missing a priority, do nothing (prevent new tag selection)
    /*
    //element.elementType === "Category" && (find_errors() == "Category Missing" || find_errors() == "Activity Missing") && 
    if (Array.from(element.selectedTagsContainer.children).length !== 0) {
        // Prevent new tags being selected when one is missing a priority
        console.log("test2");

        // display message - 
        // error: "Please click <strong>'" + extract_tag_name(recently_added_tag) +
        //  "'</strong> to set the tag priority.",
        // false, don't disable display

        return;
    }
    */

    // If a tag with the selected value already exists in the container, do nothing
    if (Array.from(element.selectedTagsContainer.children).some(tag => tag.dataset.value === selected_value)) {
        
        // Prevent duplicate tags
        console.log("duplicate tag");

        // display message - 
        // error: "The <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> tag already exists.",
        // false, don't disable display

        // Resets dropdown after 2 seconds to allow re-selection
        reset_dropdown_selection(element, 2000);

        return;
    } 

    // Create a new tag DOM element using the selected value if passes above checks
    const new_tag = create_tag_element(element, selected_value, current_clicked_tag, category_submit_list);    
    
    // Check if tag is for Visa or Passport (i.e., not an activity category)
    if (element.elementType === "Non-Category")  {

        // Update country submission list for visa/passport types
        update_country_submit(element.dropdownElement);
    } else {

        // Track the most recently added tag for potential feedback display
        recently_added_tag = new_tag;
        
        console.log("process dropdwon, recently_added_tag: ", recently_added_tag);
    }

    // Add the new tag element to the container in the UI
    element.selectedTagsContainer.appendChild(new_tag);      

    // Resets dropdown after 2 seconds
    reset_dropdown_selection(element, 2000);
}


// Create tag element and bind logic on click
function create_tag_element(element, tag_value, current_clicked_tag, category_submit_list) {

    // Create new tag UI element
    const tag = document.createElement('div');
    tag.classList.add('selection-tag');
    tag.dataset.value = tag_value;
    tag.innerHTML = `${tag_value} <span class="remove-tag"> &times; </span>`;   

    // Handle click to activate tag and show priority slider
    tag.addEventListener("click", function(event_element) {

        let onclick_tag = event_element.target;

        // Check to see if we're working with a activity category rather than visa/passport
        if (element.elementType === "Category") {              

            // Only one tag should be active per category            
            if (Array.from(element.selectedTagsContainer.children).some(child => child !== tag 
                && child.classList.contains("active-tag"))) {
                
                // Checks if some other tag in this container is active — and if so, 
                // won't allow this new one to activate.
                return;

                //change this to switch active tag to other clicked instead
            } 

            // if no other tag is active
            else {
                
                // Set clicked tag as current clicked tag for updating the categories and priorities
                current_clicked_tag = onclick_tag;
                console.log("process dropdwon, current_clicked_tag: ", current_clicked_tag);

                // Check if this tag is already active
                if (tag.classList.contains("active-tag")) {

                    console.log("tag deactivated");

                    // Set/deselect tag as active
                    tag.classList.remove("active-tag");

                    // Hide slider UI
                    hide_category_slider(element, true);
                }                
                else {

                    console.log("tag activated");

                    // Set/select tag as active 
                    tag.classList.add('active-tag');

                    // Show slider UI
                    hide_category_slider(element, false);   

                    // Set any previous slider values      
                    repopulate_category_slider(element, onclick_tag, category_submit_list);     
                }


                // display message - 
                // note: "Click <strong>'Save'</strong> to save tag priority.",
                // false, don't disable display

            } // end else for - checking if any other tag in this container is active

        } // end if for checking if any other tag in this container is active
    

    }); // end of tag.addEventListener

    // Return the tag element with the binded logic
    return tag
}


// If activity already exists, update slider with existing priority 
function repopulate_category_slider(element, tag_element, category_submit_list) {

    // Check if the activity is already present in the selected category list
    let activity = activity_in_category(element, tag_element, category_submit_list);
    
    // If activity is found (i.e., not undefined)
    if (activity !== undefined) {           

        // Set the slider's value to the previously selected priority
        element.sliderListElement.sliderElement.value = activity.activityPriority;

        // Update the displayed number next to the slider
        element.sliderListElement.amountValue.innerHTML = activity.activityPriority;
    }

}



//  <--------------------------------------------->
//  <    FUNCTIONS TO HANDLE HANDLE TAG REMOVAL   >
//  <--------------------------------------------->

// Removes tag and update data structure when "×" is clicked
function remove_tags(event_element, element, category_submit_list, passport_submit_list, visa_submit_list) {    
    
    // Only act if the close (×) icon is clicked
    if (event_element.target.classList.contains('remove-tag')) {

        // event_element target refers to the x span element clicked, parent is the whole tag
        let onclick_tag = event_element.target.parentElement;
        console.log("deleting: ", onclick_tag)

        // Remove associated data from the submission lists
        remove_from_submit(element, onclick_tag, category_submit_list, passport_submit_list, visa_submit_list);       
        
        // Remove tag from UI (parent is selected tags container)
        onclick_tag.parentElement.remove(); 
    }        
}


// Remove associated data from the submission lists
function remove_from_submit(element, tag_element, category_submit_list, passport_submit_list, visa_submit_list){

    // Check to see if we're working with a activity category rather than visa/passport
    if (element.elementType === "Category") {

        //console.log(tag_element);

        // Remove associated data from the submission list
        let activity = activity_in_category(element, tag_element, category_submit_list);
    
        if (activity !== undefined) {    

            // Remove the activity from the category
            activities_list.splice(activities_list.indexOf(activity), 1);  // removes 1 item at that index

            // Disable the slider
            hide_category_slider(element, true);

            console.log("activities_list: ", activities_list);

            // If no more activities left in the category, remove the entire category
            if (activities_list.length === 0) {
                
                category_submit_list.splice(category_submit_list.indexOf(target_category), 1); 

            }

            console.log("Remove category_submit_list: ", category_submit_list);

        } 

        // display message - 
        // success: The <strong>'"+ extract_tag_name(event_element.target.parentElement) +
            "'</strong> tag was successfully removed.",
        // false, don't disable display

        // Hide slider UI
        hide_category_slider(element, true);

    }
    
    // In the case the tag is from Passport/Visa
    else {

        // Get the name of the country 
        let country_name = extract_tag_name(event_element.target.parentElement);

        // Get the container that holds all selected tags (e.g., for passport or visa)
        let tags_container = event_element.target.parentElement.parentElement;

        // Extract the category (either 'passport' or 'visa') from the container's ID
        let category = tags_container.id.slice(0, tags_container.id.indexOf("-"));

        // Check if the tag belongs to the 'passport' category and is already in the passport_submit_list list
        if (category === "passport" && passport_submit_list.find(country => country === country_name) !== undefined) {
            
            // Remove the country from passport_submit_list
            passport_submit_list.splice(passport_submit_list.indexOf(country_name), 1);

            // Log the updated list to the console
            console.log("Remove passport_submit_list: ", passport_submit_list);
        } 

        // Check if the tag belongs to the 'visa' category and is already in the visa_submit_list list
        else if (category === "visa" && visa_submit_list.find(country => country === country_name) !== undefined) {

            // Remove the country from visa_submit_list
            visa_submit_list.splice(visa_submit_list.indexOf(country_name), 1);

            // Log the updated list to the console
            console.log("Remove visa_submit_list: ", visa_submit_list);
        }


        // display message - 
        // success: "<strong>'"+ country_name + "'</strong> was successfully removed from " +
        //   to_title_case(category) + "s.",
        // false, don't disable display

    } // end else for (element.elementType === "Category")

}







// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all dropdown functions accessible globally

    // add_static_dropdowns(dropdown_element_list) function
    window.add_static_dropdowns = add_static_dropdowns;

    // add_dynamic_dropdowns(category_list, dropdown_element_list, slider_element_list) function
    window.add_dynamic_dropdowns = add_dynamic_dropdowns;

    // add_dropdown_listeners(dropdown_element_list, current_clicked_tag, 
    // recently_added_tag, category_submit_list, passport_submit_list, visa_submit_list) 
    // function
    window.add_dropdown_listeners = add_dropdown_listeners;

    // reset_dropdown_selection(element, time_ms) function
    window.reset_dropdown_selection = reset_dropdown_selection;

    //  hide_category_slider(element, hide) function
    window.hide_category_slider =  hide_category_slider;

    // process_dropdown_selection(element, current_clicked_tag, recently_added_tag, 
    // category_submit_list) function
    window.process_dropdown_selection = process_dropdown_selection;

    // create_tag_element(element, tag_value, current_clicked_tag, category_submit_list)
    // function
    window.create_tag_element = create_tag_element;

    // repopulate_category_slider(element, tag_element, category_submit_list) function
    window.repopulate_category_slider =  repopulate_category_slider;

    // remove_tags(event_element, element, category_submit_list, passport_submit_list, 
    // visa_submit_list) function
    window.remove_tags = remove_tags;

    // remove_from_submit(element, tag_element, category_submit_list, passport_submit_list, 
    // visa_submit_list) function
    window.remove_from_submit = remove_from_submit;

});



