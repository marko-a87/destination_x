
/*
    <---------------------------------------------------------->
    <-------------- SUBMISSION HANDLING FUNCTIONS ------------->
    <---------------------------------------------------------->

    logic to collect data from the form and lists 
    and submit it as a POST request.      
*/

function submit_selection_form(form_element, passport_list, visa_list, category_list) {

    // if find_errors() returns false, run the rest of this function

    // Create a FormData object from the form
    const formData = new FormData(form_element);

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
    data["Passports"] = passport_list;
    data["Visas"] = visa_list;
    data["Activities"] = category_list;

    // Log the final data object for debugging
    console.log("Submitted: ", data);

    // Send the data to the Flask endpoint via a POST request
    fetch("/selection-test", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Tell the server we’re sending JSON
        },
        body: JSON.stringify(data)  // Convert the data object to a JSON string
    })
    .then(response => {
        // Check if the response was successful
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();  // Parse the response as JSON
    })
    .then(data => console.log('Response:', data))  // Log the server's response
    .catch(err => console.error('Error:', err));  // Handle any errors

}



// Function to update passports_submit/visas_submit with selected country
function update_country_submit(country_dropdown, country_submit_list) {

    // Extract the name of the selected country from the dropdown
    let selected_country = country_dropdown.value;

    // Extract the category type ('passport' or 'visa') from the dropdown ID
    let dropdown_category = country_dropdown.id.slice(0, country_dropdown.id.indexOf("-"));

    // If the selected country is not already in submit list
    if (submit_list.find(country => country === selected_country) === undefined) {
    
        // Add the selected country to the passports_submit list
        submit_list.push(
            selected_country
        );

        // Log the updated list to console for debugging
        console.log("Add " + dropdown_category + "submit_list: ", country_submit_list);
    } 

}


// Function to update category_submit with selected activity and its priority
function update_activity_submit(event_element, slider_element, category_submit_list) {

    // Extract the name of the selected tag from its innerHTML (before the " ×")
    let selected_tag_name = extract_tag_name(event_element.target);

    // Find the category the tag belongs to
    let target_category = find_category(slider_element, category_submit_list);

    if (target_category !== undefined) {

        // Category exists; update or add activity to the category
        let activities_list = target_category.categoryActivities;

        // Check if activity is already in the category
        let activity = find_activity(selected_tag_name, activities_list);

        if (activity !== undefined) {

            // Update priority if activity is already present
            if (activity.activityName === selected_tag_name) {
                activity.activityPriority = slider_element.sliderElement.value;
            }

        } else {

            // Add new activity and priority to the category
            activities_list.push(
                {
                    activityName: selected_tag_name,
                    activityPriority: slider_element.sliderElement.value
                }
            );


        }
    } else {

    // Category not found — add new category with activity to category_submit
    category_submit_list.push(
        {
            categoryName: slider_element.elementName,
            categoryActivities: [
                {
                    activityName: selected_tag_name,
                    activityPriority: slider_element.sliderElement.value
                }
            ]
        }
    );

    }

    console.log("Add category_submit: ", category_submit_list);

    //"display_message(element, message, message_type, disable);
    display_message(
        feedback_elements.find(feedback_element => feedback_element.elementName === slider_element.elementName),
        "Priority of the <strong>'" + selected_tag_name + "'</strong> tag Saved!",
        "success",
        false
    );

}
