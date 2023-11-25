
document.addEventListener("DOMContentLoaded", function () {
    // Get the form and task list elements
    const form = document.getElementById("newtask");
    const taskList = document.getElementById("tasks");

    // Load tasks from localStorage when the page loads
    loadTasks();

    // Add event listener for form submission
    form.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the task input value
        const taskInput = document.getElementById("newtask_input");
        const taskText = taskInput.value;

        // Validate that the input is not empty
        if (taskText.trim() !== "") {
            // Check if an edit is in progress
            const editingTask = document.querySelector(".editing");
            
            if (editingTask) {
                // If editing, update the existing task
                updateTask(editingTask, taskText);
            } else {
                // If not editing, create a new task
                const newTask = createTaskElement(taskText);
                taskList.appendChild(newTask);
            }

            // Save tasks to localStorage
            saveTasks();

            // Clear the input field
            taskInput.value = "";
        }else {
            alert("Please Enter a Task before submitting.")
        }
    });

    // Function to create a task element
    function createTaskElement(taskText) {
        const newTask = document.createElement("div");
        newTask.classList.add("task");

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");

        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("actions");

        const taskInputField = document.createElement("input");
        taskInputField.type = "text";
        taskInputField.classList.add("text");
        taskInputField.value = taskText;
        taskInputField.readOnly = true;

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>Edit';

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';

        const doneButton = document.createElement("button");
        doneButton.classList.add("done");
        doneButton.innerHTML = '<i class="fa-solid fa-check"></i> Done';
        
        // Add event listener for delete button
        deleteButton.addEventListener("click", function () {
            if(confirm("Are you sure you want to remove this task?")){
                taskList.removeChild(newTask);
                saveTasks();
            }
        });

        // Add event listener for edit button
        editButton.addEventListener("click", function () {
            // Set the task as being edited
            newTask.classList.add("editing");

            // Enable the input field for editing
            taskInputField.readOnly = false;
            taskInputField.focus();
        });
        // Add event listener for done button
        doneButton.addEventListener("click", function () {
            // Toggle the completion status
            newTask.classList.toggle("completed");

            // Save tasks to localStorage
            saveTasks();
            //Magcelebrate pag natapos yung task
            if(newTask.classList.contains("completed")){
                celebrate(newTask)
                alert("Congratulations For completing a Task!")
            }
    });
        

        contentDiv.appendChild(taskInputField);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        actionsDiv.appendChild(doneButton);

        newTask.appendChild(contentDiv);
        newTask.appendChild(actionsDiv);

        return newTask;
    }
    function celebrate(taskElement){
        taskElement.classList.add("celebrate");
        setTimeout(function(){
            taskElement.classList.remove("celebrate");
        },1000);
    }
    function saveChanges(taskElement, newText) {
        // Get the content div and input field of the task
        const contentDiv = taskElement.querySelector(".content");
        const taskInputField = taskElement.querySelector(".text");

        // Update the task text and disable editing
        taskInputField.value = newText;
        taskInputField.readOnly = true;
        taskElement.classList.remove("editing");
    }

    // Add event listener for edit/save button (outside the form submit listener)
    taskList.addEventListener("click", function (event) {
        const target = event.target;

        if (target.classList.contains("edit")) {
            // If "Edit" button is clicked
            const taskElement = target.closest(".task");
            const taskInputField = taskElement.querySelector(".text");

            // Set the task as being edited
            taskElement.classList.add("editing");

            // Enable the input field for editing
            taskInputField.readOnly = false;
            taskInputField.focus();

            // Change the button text to "Save"
            target.innerHTML = '<i class="fa-solid fa-save"></i> Save';
            target.classList.remove("edit");
            target.classList.add("save");
        } else if (target.classList.contains("save")) {
            // If "Save" button is clicked during editing
            const taskElement = target.closest(".task");
            const taskInputField = taskElement.querySelector(".text");

            // Save the changes and update the button back to "Edit"
            saveChanges(taskElement, taskInputField.value);
            target.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit';
            target.classList.remove("save");
            target.classList.add("edit");

            // Save tasks to localStorage
            saveTasks();
        }
    });

    // Function to update an existing task
    function updateTask(taskElement, newText) {
        // Get the content div and input field of the task
        const contentDiv = taskElement.querySelector(".content");
        const taskInputField = taskElement.querySelector(".text");

        // Update the task text and disable editing
        taskInputField.value = newText;
        taskInputField.readOnly = true;
        taskElement.classList.remove("editing");
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];

        // Iterate through task elements and store their text content
        const taskElements = document.querySelectorAll(".task .text");
        taskElements.forEach(function (taskElement) {
            tasks.push(taskElement.value);
        });

        // Save tasks array to localStorage as a JSON string
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = localStorage.getItem("tasks");

        // Check if tasks exist in localStorage
        if (tasks) {
            const tasksArray = JSON.parse(tasks);

            // Create task elements for each task in the array
            tasksArray.forEach(function (taskText) {
                const newTask = createTaskElement(taskText);
                taskList.appendChild(newTask);
            });
            taskList.classList.add("fade-slide-in")
        }
    }
});
