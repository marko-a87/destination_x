
/* 
    <--------------------------------------------------->
    <                                                   >
    <           SUBMISSION HANDLING FUNCTIONS           >
    <                                                   >
    <--------------------------------------------------->        
*/

/*
    logic to collect data from the form and lists 
    and submit it as a POST request.      
*/

// Handles data submissions from the form
function submit_selection_form() {

    // if find_category_errors() has no errors, run the rest of this function
    if (find_category_errors() !== "None") {

        // Flag the effected sections
        flag_nav_section();

        // Notify user to address errors first

        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", "Form"),
            "Please address all errors in the form.",
            "error",
            null
        ) 

    } else {

        // Create a FormData object from the form
        const formData = new FormData(get_selection_form());

        // Initialize an empty object to hold the cleaned data
        const data = {};

        // Iterate over each form field and extract necessary values
        formData.forEach((value, key) => {
            // Only include the budget_slider field, rename it to "Budget"
            if (key === "budget_slider") {
                data["Budget"] = value;
            }
        });

        // Add additional values from external variables to the data object
        data["Passports"] = get_submission_list("passport");
        data["Visas"] = get_submission_list("visa");
        data["Activities"] = get_submission_list("category");

        // Log the final data object for debugging
        console.log("Submitted: ", data);

        // Send the data to the Flask endpoint via a POST request
        fetch("/selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // Tell the server we’re sending JSON
            },
            body: JSON.stringify(data)  // Convert the data object to a JSON string
        })

        .then(response => {
            // Check if the response was successful
            if (!response.ok) {

                // Display error message

                //format: disable, element, message, message_type, timeout
                display_message( 
                    false, //don't disable display
                    find_element("feedback", "Form"),
                    "There was an internal error. Please try again later.",
                    "error",
                    null
                )

                throw new Error("Network response was not ok");
            } 
            else {

                // Display success message

                //format: disable, element, message, message_type, timeout
                display_message( 
                    false, //don't disable display
                    find_element("feedback", "Form"),
                    "User Preferences Saved! Redirecting to Destinations..." + 
                    '<strong> <i class="fa-solid fa-spinner fa-spin fa-lg"></i> </strong>',
                    "success",
                    null
                )    
            }            

            if (response.redirected) {

                let url = response.url;  // Parse the url from response

                setTimeout(() => {
                    window.location.replace(url); 
                }, 5000); // 5000ms = 5 secs
                
                // creates the second request, and change the content
                return;
            }
        })
                
        .catch(err => {
            
            console.error('Error:', err)

            // Display error message

            //format: disable, element, message, message_type, timeout
            display_message( 
                false, //don't disable display
                find_element("feedback", "Form"),
                "There was an internal error. Please try again later.",
                "error",
                null
            )
        });  // Handle any errors 
    }
    

}



//  <------------------------------------------->
//  <    FUNCTIONS TO HANDLE SUBMISSION DATA    >
//  <------------------------------------------->

// Function to update passports_submit/visas_submit with selected country
function update_country_submit(country_dropdown) {

    // Extract the name of the selected country from the dropdown
    let selected_country = country_dropdown.value;

    // Extract the category type ('passport' or 'visa') from the dropdown ID
    let dropdown_category = country_dropdown.id.slice(0, country_dropdown.id.indexOf("-"));

    // If the category is 'passport' and the selected country is not already in passport_submit_list
    if (dropdown_category === "passport" && find_country("passport", selected_country) === undefined) {
    
        // Add the selected country to passport_submit_list
        get_submission_list("passport").push(
            selected_country
        );

        // Log the updated list to console for debugging
        console.log("Add passport_submit_list: ", get_submission_list("passport"));

    } 
    // If the category is 'visa' and the selected country is not already in visa_submit_list
    else if (dropdown_category === "visa" && find_country("visa", selected_country) === undefined) {

        // Add the selected country to visa_submit_list
        get_submission_list("visa").push(
            selected_country
        );

        // Log the updated list to console for debugging
        console.log("Add visa_submit_list: ", get_submission_list("visa"));
    }


}


// Function to update category_submit with selected activity and its priority
function update_activity_submit(element) {

    // Extract the name of the selected tag from its innerHTML (before the " ×")
    let selected_tag_name = extract_tag_name(current_clicked_tag);

    // Find the category the tag belongs to
    let target_category = find_category(element);

    if (target_category !== undefined) {

        // Category exists; update or add activity to the category
        let activities_list = target_category.categoryActivities;

        // Check if activity is already in the category
        let activity = find_activity(selected_tag_name, activities_list);

        if (activity !== undefined) {

            // Update priority if activity is already present
            if (activity.activityName === selected_tag_name) {
                activity.activityPriority = element.sliderElement.value;
            }

        } else {

            // Add new activity and priority to the category
            activities_list.push(
                {
                    activityName: selected_tag_name,
                    activityPriority: element.sliderElement.value
                }
            );
        }

    } else {

        // Category not found — add new category with activity to category_submit
        get_submission_list("category").push(
            {
                categoryName: element.elementName,
                categoryActivities: [
                    {
                        activityName: selected_tag_name,
                        activityPriority: element.sliderElement.value
                    }
                ]
            }
        );

    }

    console.log("Add category_submit: ", get_submission_list("category"));

    //format: disable, element, message, message_type, timeout, timeout
    display_message( 
        false, //don't disable display
        find_element("feedback", element.elementName),
        "Priority of the <strong>'" + extract_tag_name(current_clicked_tag) + "'</strong> tag saved!",
        "success",
        3000
    ) 

    // Unflag any effected actvity sections that had errors
    flag_nav_section();

    // Hide slider UI
    hide_category_slider(find_element("dropdown", element.elementName), true);

    // Disable currently clicked tag
    toggle_active_tag(element, current_clicked_tag, extract_tag_name(current_clicked_tag));

}



// Remove associated data from the submission lists
function remove_from_submit(element, tag_element){

    // Check to see if we're working with a activity category rather than visa/passport
    if (element.elementType === "Activity") {

        //console.log(tag_element);

        // Remove associated data from the submission list
        let activity = activity_in_category(element, tag_element);
    
        if (activity !== undefined) {    

            let activities_list = find_category(element).categoryActivities;

            // Remove the activity from the category
            activities_list.splice(activities_list.indexOf(activity), 1);  // removes 1 item at that index

            // Disable the slider
            hide_category_slider(element, true);

            console.log("activities_list: ", activities_list);

            // If no more activities left in the category, remove the entire category
            if (activities_list.length === 0) {
                
                get_submission_list("category").splice(get_submission_list("category").indexOf(find_category(element)), 1); 

            }

            console.log("Remove category_submit_list: ", get_submission_list("category"));

        } 

        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "The <strong>'"+ extract_tag_name(current_clicked_tag.parentElement) +"'</strong> tag was successfully removed.",
            "success",
            3000
        ) 

        // Hide slider UI
        hide_category_slider(element, true);
    }
    
    // In the case the tag is from Passport/Visa
    else {

        // Get the name of the country 
        let country_name = extract_tag_name(tag_element);

        // Get the container that holds all selected tags (e.g., for passport or visa)
        let tags_container = tag_element.parentElement;

        // Extract the category (either 'passport' or 'visa') from the container's ID
        let category = tags_container.id.slice(0, tags_container.id.indexOf("-"));

        // Check if the tag belongs to the 'passport' category and is already in the passport_submit_list list
        if (category === "passport" && find_country("passport", country_name) !== undefined) {
            
            // Remove the country from passport_submit_list
            get_submission_list("passport").splice(get_submission_list("passport").indexOf(country_name), 1);

            // Log the updated list to the console
            console.log("Remove passport_submit_list: ", get_submission_list("passport"));
        } 

        // Check if the tag belongs to the 'visa' category and is already in the visa_submit_list list
        else if (category === "visa" && find_country("visa", country_name) !== undefined) {

            // Remove the country from visa_submit_list
            get_submission_list("visa").splice(get_submission_list("visa").indexOf(country_name), 1);

            // Log the updated list to the console
            console.log("Remove visa_submit_list: ", get_submission_list("visa"));
        }


        // Display successful feedback
        
        //format: disable, element, message, message_type, timeout
        display_message( 
            false, //don't disable display
            find_element("feedback", element.elementName),
            "<strong>'"+ country_name + "'</strong> was successfully removed from " + to_title_case(category) + "s.",
            "success",
            3000
        ) 

    } // end else for (element.elementType === "Activity")


    // Unflag any effected actvity sections that had errors
    flag_nav_section();
}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all submission functions accessible globally

    // submit_selection_form(form_element) function
    window.submit_selection_form = submit_selection_form;

    // update_country_submit(country_dropdown) function
    window.update_country_submit = update_country_submit;

    // update_activity_submit(slider_element) function
    window. update_activity_submit =  update_activity_submit;
    
    // remove_from_submit(element, tag_element) function
    window.remove_from_submit = remove_from_submit;

});

