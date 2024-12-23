// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Redirect to login page if not logged in (for attendance page)
if (window.location.pathname.includes('attendance.html') && !isLoggedIn()) {
    window.location.href = 'login.html';
}

// Sign up functionality
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(user => user.username === username)) {
            alert('Username already exists');
            return;
        }
        
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign up successful');
        window.location.href = 'login.html';
    });
}

// Login functionality
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'attendance.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

// Attendance page functionality
if (window.location.pathname.includes('attendance.html')) {
    const userName = document.getElementById('user-name');
    const markAttendanceBtn = document.getElementById('mark-attendance');
    const attendanceList = document.getElementById('attendance-list');
    const logoutBtn = document.getElementById('logout');
    
    userName.textContent = localStorage.getItem('currentUser');
    
    function updateAttendanceList() {
        const currentUser = localStorage.getItem('currentUser');
        const attendanceRecords = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];
        attendanceList.innerHTML = '';
        attendanceRecords.forEach(record => {
            const li = document.createElement('li');
            li.textContent = new Date(record).toLocaleString();
            attendanceList.appendChild(li);
        });
    }
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    updateAttendanceList();
}

if (window.location.pathname.includes('attendance.html')) {
    const userName = document.getElementById('user-name');
    const markAttendanceBtn = document.getElementById('mark-attendance');
    const attendanceList = document.getElementById('attendance-list');
    const logoutBtn = document.getElementById('logout');

    // Get new elements
    const subjectDropdown = document.getElementById('subject-dropdown');
    const newSubjectInput = document.getElementById('new-subject');
    const addSubjectBtn = document.getElementById('add-subject');

    // Function to load subjects from localStorage
    function loadSubjects() {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectDropdown.appendChild(option);
        });
    }

    // Function to add new subject
    function addNewSubject() {
        const subject = newSubjectInput.value.trim();
        if (subject) {
            const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
            if (!subjects.includes(subject)) {
                subjects.push(subject);
                localStorage.setItem('subjects', JSON.stringify(subjects));
                loadSubjects();
                newSubjectInput.value = '';
            } else {
                alert('Subject already exists!');
            }
        }
    }

    // Add subject button click handler
    addSubjectBtn.addEventListener('click', addNewSubject);

    // Add subject on Enter key
    newSubjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewSubject();
        }
    });

    // updateAttendanceList function to include subjects
    function updateAttendanceList() {
        const currentUser = localStorage.getItem('currentUser');
        const attendanceRecords = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];
        attendanceList.innerHTML = '';
        attendanceRecords.forEach(record => {
            const li = document.createElement('li');
            li.textContent = `${new Date(record.timestamp).toLocaleString()} - ${record.subject || 'No subject'}`;
            attendanceList.appendChild(li);
        });
    }

    // Initialize
    userName.textContent = localStorage.getItem('currentUser');
    loadSubjects();
    updateAttendanceList();
}


if (window.location.pathname.includes('attendance.html')) {
    const userName = document.getElementById('user-name');
    const markAttendanceBtn = document.getElementById('mark-attendance');
    const attendanceList = document.getElementById('attendance-list');
    const logoutBtn = document.getElementById('logout');
    
    // Get new elements
    const subjectDropdown = document.getElementById('subject-dropdown');
    const newSubjectInput = document.getElementById('new-subject');
    const addSubjectBtn = document.getElementById('add-subject');
    
    // Function to get user-specific subjects key
    function getUserSubjectsKey(username) {
        return `subjects_${username}`;
    }
    
    // Function to load subjects from localStorage for specific user
    function loadSubjects() {
        const currentUser = localStorage.getItem('currentUser');
        const subjects = JSON.parse(localStorage.getItem(getUserSubjectsKey(currentUser))) || [];
        subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectDropdown.appendChild(option);
        });
    }
    
    // Function to add new subject for specific user
    function addNewSubject() {
        const subject = newSubjectInput.value.trim();
        if (subject) {
            const currentUser = localStorage.getItem('currentUser');
            const subjects = JSON.parse(localStorage.getItem(getUserSubjectsKey(currentUser))) || [];
            if (!subjects.includes(subject)) {
                subjects.push(subject);
                localStorage.setItem(getUserSubjectsKey(currentUser), JSON.stringify(subjects));
                loadSubjects();
                newSubjectInput.value = '';
            } else {
                alert('Subject already exists!');
            }
        }
    }
    
    // Add subject button click handler
    addSubjectBtn.addEventListener('click', addNewSubject);
    
    // Add subject on Enter key
    newSubjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewSubject();
        }
    });
    
    // updateAttendanceList function to include subjects
    function updateAttendanceList() {
        const currentUser = localStorage.getItem('currentUser');
        const attendanceRecords = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];
        attendanceList.innerHTML = '';
        attendanceRecords.forEach(record => {
            const li = document.createElement('li');
            li.textContent = `${new Date(record.timestamp).toLocaleString()} - ${record.subject || 'No subject'}`;
            attendanceList.appendChild(li);
        });
    }
    
    // Mark attendance button click handler
    markAttendanceBtn.addEventListener('click', () => {
        const selectedSubject = subjectDropdown.value;
        if (!selectedSubject) {
            alert('Please select a subject first!');
            return;
        }
    
        const currentUser = localStorage.getItem('currentUser');
        const attendanceRecords = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];
        attendanceRecords.push({
            timestamp: new Date().toISOString(),
            subject: selectedSubject
        });
        localStorage.setItem(`attendance_${currentUser}`, JSON.stringify(attendanceRecords));
        updateAttendanceList();
        alert('Attendance marked successfully');
    });
    
    // Initialize
    userName.textContent = localStorage.getItem('currentUser');
    loadSubjects();
    updateAttendanceList();
}

