
/* 
    <---------------------------------------------------->
    <----------------- DROPDOWN FUNCTIONS --------------->
    <---------------------------------------------------->        
*/


/*
Element Format:
    elementName: "{{ category.category_name | escape }}",
    dropdownElement: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-tagDropdown"),
    selectedTagsContainer: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-selectedTags"),
    priorityName: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-priority-name"),
    sliderDiv: document.getElementById("{{ category.category_name.split(' ')[0] | lower | escape }}-slider-control"),
    sliderListElement: slider_elements.find(element => element.elementName === "{{ category.category_name | escape }}")
*/

// Create tag and add to UI when dropdown value is selected
function populate_tags(element, category_submit_list) {  

//populate_tags(element.dropdownElement, element.selectedTagsContainer, element.priorityName, element.sliderDiv, element.sliderListElement);

    const value = element.dropdownElement.value;
    if (!value) return;      

    if (find_errors() && Array.from(element.selectedTagsContainer.children).length !== 0) {
    
        //"display_message(element, message, message_type, disable);
        display_message(
            feedback_elements.find(feedback_element => feedback_element.elementName === element.sliderListElement.elementName),
            "Please click <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> to set the tag priority.",
            "error",
            false
        );
        
        return;
    }

    // Prevent duplicate tags
    if (Array.from(element.selectedTagsContainer.children).some(tag => tag.dataset.value === value)) {

        //"display_message(element, message, message_type, disable);
        display_message(
            feedback_elements.find(feedback_element => feedback_element.elementName === element.sliderListElement.elementName),
            "The <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> tag already exists.",
            "error",
            false
        );
        
        // Returns dropdwon to "select a tag" after 2 secs       
        setTimeout(() => {
            element.dropdownElement.selectedIndex = 0; 
        }, 2000); // 2000ms = 2 seconds

        return;
    } 

    // Create new tag UI element
    const tag = document.createElement('div');
    tag.classList.add('selection-tag');
    tag.dataset.value = value;
    tag.innerHTML = `${value} <span class="remove-tag"> &times; </span>`;      

    // Handle click to activate tag and show priority slider
    tag.addEventListener("click", function(event_element) {

        // Check to see if we're working with a activity category rather than visa/passport
        if (element.priorityName != null) {              

            // Only one tag should be active per category
            // Check if any other tag in this container is active — and if so, don’t allow this new one to activate.
            if (Array.from(element.selectedTagsContainer.children).some(child => child !== tag && child.classList.contains("active-tag"))) {
            return;
            } else {
            // set clicked event for updating the categories and priorities
            clicked_tag = event_element;

            //"display_message(element, message, message_type, disable);
            display_message(
                feedback_elements.find(feedback_element => feedback_element.elementName === element.sliderListElement.elementName),
                "Click <strong>'Save'</strong> to save tag priority.",
                "neutral",
                false
            );

            if (tag.classList.contains("active-tag")) {
                // Deselect tag
                tag.classList.remove("active-tag");
                element.sliderDiv.style.display = "none";
                element.sliderListElement.sliderElement.value = 0;
                element.sliderListElement.amountValue.innerHTML = 0;

            } else {
                // Select tag and show slider UI
                tag.classList.add('active-tag');
                element.priorityName.innerHTML = "Adjust <strong>'" + value + "'</strong> Priority:";
                element.sliderDiv.style.display = "flex";


                let selected_tag_name = extract_tag_name(event_element.target);

                // Look for category to see if activity is already present
                let target_category = find_category(element.sliderListElement);

                if (target_category !== undefined) {        
                // If category already exists, update slider with existing priority       
                
                let activities_list = target_category.categoryActivities;
                
                // Look for the activity in category
                let activity = find_activity(selected_tag_name, activities_list);
                
                if (activity !== undefined) {
                    // If activity already exists, update slider with existing priority 

                    if (activity.activityName === selected_tag_name) {           

                    element.sliderListElement.sliderElement.value = activity.activityPriority;
                    element.sliderListElement.amountValue.innerHTML = activity.activityPriority;

                    }

                }

                } //end if target_category !== undefined

            } // end else for (tag.classList.contains("active-tag")

            } // end else for Checking if any other tag in this container is active

        } // end if element.priorityName != null
    

    }); // end of tag.addEventListener
    
    // Check to see if we're working with visa/passport
    if (element.priorityName === null)  {
        update_country_submit(element.dropdownElement);
    } else {
        //Set as recent tag
        recently_added_tag = tag;
    }


    // Add the newly selected and created tag to the container 
    element.selectedTagsContainer.appendChild(tag);      

    // Returns dropdwon to "select a tag" after 2 secs       
    setTimeout(() => {
        element.dropdownElement.selectedIndex = 0; 
    }, 2000); // 2000ms = 2 seconds
}



// Removes tag and update data structure when "×" is clicked
function remove_tags(event_element, element, category_submit_list) {    
    
    // Remove that deleted tag from the category in the submit list
    // If a category has no tags, remove it from the list
    
    // Only act if the close (×) icon is clicked
    if (event_element.target.classList.contains('remove-tag')) {

        // Check to see if we're working with a activity category rather than visa/passport
        if (element.sliderDiv != null) {

            console.log(event_element.target.parentElement);

            let selected_tag_name = extract_tag_name(event_element.target.parentElement);

            // Look for category
            let target_category = find_category(element.sliderListElement, category_submit_list);

            console.log(target_category);

            if (target_category !== undefined) {     
            
                let activities_list = target_category.categoryActivities;
                
                // Look for the activity in category
                let activity = find_activity(selected_tag_name, activities_list);
                
                if (activity !== undefined) {
                    // If activity already exists, remove the activity

                    if (activity.activityName === selected_tag_name) {  

                    // Remove the activity from the category
                    activities_list.splice(activities_list.indexOf(activity), 1);  // removes 1 item at that index
                    
                    // Disable the slider
                    element.sliderDiv.style.display = "none";

                    console.log("activities_list: ", activities_list);

                    // If no more activities left in the category, remove the entire category
                    if (activities_list.length === 0) {
                        
                        category_submit_list.splice(category_submit_list.indexOf(target_category), 1); 

                    
                    }
                    console.log("Remove category_submit_list: ", category_submit_list);

                    } // end if (activity.activityName === selected_tag_name)

                } // end if (activity !== undefined) 

            } // end if (target_category !== undefined)

            //"display_message(element, message, message_type, disable);
            display_message( 
                feedback_elements.find(feedback_element => feedback_element.elementName === element.elementName),
                "The <strong>'"+ extract_tag_name(event_element.target.parentElement) +
                "'</strong> tag was successfully removed.",
                "success",
                false
            );

        } // end if (element.sliderDiv != null)
        
        else {

            // Get the name of the country 
            let country_name = extract_tag_name(event_element.target.parentElement);

            // Get the container that holds all selected tags (e.g., for passport or visa)
            let tags_container = event_element.target.parentElement.parentElement;

            // Extract the category (either 'passport' or 'visa') from the container's ID
            let category = tags_container.id.slice(0, tags_container.id.indexOf("-"));

            // Check if the tag belongs to the 'passport' category and is already in the passports_submit list
            if (category === "passport" && passports_submit.find(country => country === country_name) !== undefined) {
                
                // Remove the country from passports_submit
                passports_submit.splice(passports_submit.indexOf(country_name), 1);

                // Log the updated list to the console
                console.log("Remove passports_submit: ", passports_submit);

            } 
            // Check if the tag belongs to the 'visa' category and is already in the visas_submit list
            else if (category === "visa" && visas_submit.find(country => country === country_name) !== undefined) {

                // Remove the country from visas_submit
                visas_submit.splice(visas_submit.indexOf(country_name), 1);

                // Log the updated list to the console
                console.log("Remove visas_submit: ", visas_submit);
            }

            
            //"display_message(element, message, message_type, disable);
            display_message( 
                feedback_elements.find(feedback_element => feedback_element.elementName === element.elementName),
                "<strong>'"+ country_name + "'</strong> was successfully removed from " +
                toTitleCase(category) + "s.",
                "success",
                false
            );

        } // end else for (element.sliderDiv != null)
        

        // Remove tag from UI
        event_element.target.parentElement.remove(); 
    }
        
}


function add_dropdown_listeners(dropdown_element_list, clicked_tag, category_submit_list) {

    //console.log(dropdown_element_list);

    // Bind all dropdowns and tag containers to logic
    dropdown_element_list.forEach(element => {

        // Static dropdowns like Visa/Passport & Category-based dropdowns
        element.dropdownElement.addEventListener('change', () => {
            populate_tags(element, category_submit_list);

            /*
            //"display_message(element, message, message_type, disable);
            display_message(
                feedback_elements.find(feedback_element => feedback_element.elementName === element.sliderElement.elementName),
                "Click the <strong>'" + extract_tag_name(recently_added_tag) + "'</strong> tag to set priority.",
                "neutral",
                false
            );
            */
        });

        element.selectedTagsContainer.addEventListener('click', (event_element) => {          
            remove_tags(event_element, element, category_submit_list);
        });


        if (element.priorityName != null) {
            // Category-based dropdowns

            // On "Adjust" button click, update the data structure
            element.sliderListElement.adjustBtn.addEventListener("click", () => {
                update_activity_submit(clicked_tag, element.sliderListElement);
            });           

        } 

    });

}
