// Initialize admin credentials if they don't exist
if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify({
        username: 'admin',
        password: 'admin123' // In a real application, this should be properly hashed
    }));
}

// Admin Login Form Handler
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const admin = JSON.parse(localStorage.getItem('admin'));
        
        if (username === admin.username && password === admin.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid admin credentials');
        }
    });
}

// Admin Dashboard Functionality
if (window.location.pathname.includes('admin-dashboard.html')) {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
    }

    // Initialize components
    const usersList = document.getElementById('users-list');
    const addUserForm = document.getElementById('add-user-form');
    const attendanceRecords = document.getElementById('attendance-records');
    const userFilter = document.getElementById('user-filter');
    const dateFilter = document.getElementById('date-filter');
    const clearFilters = document.getElementById('clear-filters');
    const logoutBtn = document.getElementById('logout');

    // Load and display users
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        usersList.innerHTML = '';
        userFilter.innerHTML = '<option value="">All Users</option>';
        
        users.forEach(user => {
            // Add to users list
            const li = document.createElement('li');
            li.innerHTML = `
                ${user.username}
                <button onclick="deleteUser('${user.username}')">Delete</button>
            `;
            usersList.appendChild(li);

            // Add to filter dropdown
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            userFilter.appendChild(option);
        });
    }

    // Load and display attendance records
    function loadAttendance() {
        const selectedUser = userFilter.value;
        const selectedDate = dateFilter.value;
        let allRecords = [];

        // Get all users' attendance records
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach(user => {
            const userAttendance = JSON.parse(localStorage.getItem(`attendance_${user.username}`)) || [];
            userAttendance.forEach(record => {
                allRecords.push({
                    username: user.username,
                    timestamp: record
                });
            });
        });

        // Apply filters
        if (selectedUser) {
            allRecords = allRecords.filter(record => record.username === selectedUser);
        }
        if (selectedDate) {
            allRecords = allRecords.filter(record => {
                const recordDate = new Date(record.timestamp).toLocaleDateString();
                const filterDate = new Date(selectedDate).toLocaleDateString();
                return recordDate === filterDate;
            });
        }

        // Display records
        attendanceRecords.innerHTML = '';
        allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        allRecords.forEach(record => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${record.username} - ${new Date(record.timestamp).toLocaleString()}
                <button onclick="deleteAttendance('${record.username}', '${record.timestamp}')">Delete</button>
            `;
            attendanceRecords.appendChild(li);
        });
    }

    // Add new user
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.username === username)) {
                alert('Username already exists');
                return;
            }

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            addUserForm.reset();
            loadUsers();
            alert('User added successfully');
        });
    }

    // Delete user
    window.deleteUser = function(username) {
        if (confirm(`Are you sure you want to delete user ${username}?`)) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const updatedUsers = users.filter(user => user.username !== username);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            localStorage.removeItem(`attendance_${username}`);
            loadUsers();
            loadAttendance();
        }
    };

    // Delete attendance record
    window.deleteAttendance = function(username, timestamp) {
        if (confirm('Are you sure you want to delete this attendance record?')) {
            const records = JSON.parse(localStorage.getItem(`attendance_${username}`)) || [];
            const updatedRecords = records.filter(record => record !== timestamp);
            localStorage.setItem(`attendance_${username}`, JSON.stringify(updatedRecords));
            loadAttendance();
        }
    };

    // Event listeners for filters
    userFilter.addEventListener('change', loadAttendance);
    dateFilter.addEventListener('change', loadAttendance);
    clearFilters.addEventListener('click', () => {
        userFilter.value = '';
        dateFilter.value = '';
        loadAttendance();
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });

    // Initial load
    loadUsers();
    loadAttendance();
}

