const API_URL ='https://student-timetable-api.onrender.com/api/timetable';

const form = document.getElementById('timetableForm');
const tableBody = document.getElementById('timetableBody');
const message = document.getElementById('message');
const recordId = document.getElementById('recordId');

// Display a message to the user
function showMessage(text) {
    message.textContent = text;
}

// Load and display all timetable records
async function loadTimetable() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Could not load timetable');
        }

        const records = await response.json();
        tableBody.innerHTML = '';

        records.forEach(record => {
            const row = document.createElement('tr');

            const values = [
                record.id,
                record.course_code,
                record.course_name,
                record.day_of_week,
                record.start_time,
                record.end_time,
                record.venue || '',
                record.study_goal || ''
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editRecord(record));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteRecord(record.id));

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            row.appendChild(actions);

            tableBody.appendChild(row);
        });
    } catch (error) {
        showMessage('Error loading timetable. Check that your server is running.');
    }
}

// Add a new record or update an existing one
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const record = {
        course_code: document.getElementById('course_code').value.trim(),
        course_name: document.getElementById('course_name').value.trim(),
        day_of_week: document.getElementById('day_of_week').value,
        start_time: document.getElementById('start_time').value,
        end_time: document.getElementById('end_time').value,
        venue: document.getElementById('venue').value.trim(),
        study_goal: document.getElementById('study_goal').value.trim()
    };

    const id = recordId.value;
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not save record');
        }

        showMessage(id ? 'Record updated successfully!' : 'Record added successfully!');
        form.reset();
        recordId.value = '';
        await loadTimetable();
    } catch (error) {
        showMessage(error.message);
    }
});

// Put an existing record into the form for editing
function editRecord(record) {
    recordId.value = record.id;
    document.getElementById('course_code').value = record.course_code;
    document.getElementById('course_name').value = record.course_name;
    document.getElementById('day_of_week').value = record.day_of_week;
    document.getElementById('start_time').value = record.start_time;
    document.getElementById('end_time').value = record.end_time;
    document.getElementById('venue').value = record.venue || '';
    document.getElementById('study_goal').value = record.study_goal || '';

    showMessage('Editing record ' + record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a record
async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not delete record');
        }

        showMessage(result.message);
        await loadTimetable();
    } catch (error) {
        showMessage(error.message);
    }
}

// Clear the form when cancelling an edit
document.getElementById('cancelEdit').addEventListener('click', function () {
    form.reset();
    recordId.value = '';
    showMessage('Form cleared.');
});

// Load records when the webpage opens
loadTimetable();