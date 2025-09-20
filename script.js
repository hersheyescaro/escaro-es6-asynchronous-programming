class Student {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.age = data.age;
        this.course = data.course;
    }

    isOver21() {
        return this.age > 21;
    }

    getDisplayString() {
        const ageMarker = this.isOver21() ? ' *' : '';
        return `${this.name} (${this.age}) - ${this.course}${ageMarker}`;
    }

    getCourseRelationship(courseDescription) {
        return `${this.name} → ${this.course} → ${courseDescription}`;
    }
}

class Instructor {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.subjects = data.subjects;
        this.courses = data.courses;
    }

    getDisplayString() {
        return `${this.name} - ${this.subjects}`;
    }

    teachesCourse(courseName) {
        return this.courses.includes(courseName);
    }

    getCourseRelationships() {
        return this.courses.map(course => `${course} → Taught by ${this.name}`);
    }
}

class DataService {
    constructor() {
        if (DataService.instance) {
            return DataService.instance;
        }
        DataService.instance = this;
    }

    static getInstance() {
        return new DataService();
    }

    fetchDataWithPromises() {
        console.log('📡 Fetching data using Promises...');
        
        return fetch('./data/students.json')
            .then(response => {
                console.log('✅ Promise: Response received', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('📄 Promise: Data parsed successfully', data);
                return data;
            })
            .catch(error => {
                console.error('❌ Promise: Error fetching data', error);
                throw error;
            });
    }

    async fetchDataWithAsync() {
        try {
            console.log('🔄 Fetching data using Async/Await...');
            
            const response = await fetch('./data/students.json');
            console.log('✅ Async/Await: Response received', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📄 Async/Await: Data parsed successfully', data);
            
            return data;
        } catch (error) {
            console.error('❌ Async/Await: Error fetching data', error);
            throw error;
        }
    }

    processData(rawData) {
        console.log('⚙️ Processing raw data into class instances...');
        
        const students = rawData.students.map(studentData => new Student(studentData));
        const instructors = rawData.instructors.map(instructorData => new Instructor(instructorData));
        const courses = rawData.courses;
        
        console.log(`✨ Created ${students.length} Student instances`);
        console.log(`✨ Created ${instructors.length} Instructor instances`);
        console.log(`✨ Loaded ${courses.length} courses`);
        
        return { students, instructors, courses };
    }
}

class App {
    constructor() {
        this.students = [];
        this.instructors = [];
        this.courses = [];
        this.loading = true;
        this.error = null;
        this.dataService = DataService.getInstance();
    }

    async init() {
        console.log('🚀 Application started - Loading student data...');
        
        try {
            await this.loadData();
            this.render();
        } catch (err) {
            console.error('💥 Error loading data:', err);
            this.error = err.message || 'Failed to load data';
            this.loading = false;
            this.render();
        }
    }

    async loadData() {
        console.log('\n=== DEMONSTRATION: Using Promises ===');
        const rawDataPromise = await this.dataService.fetchDataWithPromises();
        
        console.log('\n=== DEMONSTRATION: Using Async/Await ===');
        const rawDataAsync = await this.dataService.fetchDataWithAsync();
        
        const { students, instructors, courses } = this.dataService.processData(rawDataAsync);
        
        console.log('\n=== FINAL PROCESSED DATA ===');
        console.log('Students:', students.map(s => s.getDisplayString()));
        console.log('Instructors:', instructors.map(i => i.getDisplayString()));
        console.log('Courses:', courses);
        
        this.students = students;
        this.instructors = instructors;
        this.courses = courses;
        this.loading = false;
        
        console.log('✨ Data loading complete!');
    }

    render() {
        const loadingEl = document.getElementById('loading-spinner');
        const errorEl = document.getElementById('error-container');
        const outputEl = document.getElementById('output');
        const footerEl = document.querySelector('.footer');

        if (this.loading) {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            outputEl.style.display = 'none';
            footerEl.style.display = 'none';
            return;
        }

        loadingEl.style.display = 'none';

        if (this.error) {
            errorEl.style.display = 'block';
            outputEl.style.display = 'none';
            footerEl.style.display = 'none';
            document.getElementById('error-text').textContent = this.error;
            return;
        }

        errorEl.style.display = 'none';
        outputEl.style.display = 'block';
        footerEl.style.display = 'block';

        this.renderStudents();
        this.renderCourses();
        this.renderInstructors();
        this.renderRelationships();
    }

    renderStudents() {
        const container = document.getElementById('students-list');
        container.innerHTML = '';

        this.students.forEach(student => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.setAttribute('data-testid', `text-student-${student.id}`);
            
            div.innerHTML = `
                <span class="item-bullet">•</span>
                <span class="item-text">${student.getDisplayString()}</span>
            `;
            
            container.appendChild(div);
        });
    }

    renderCourses() {
        const container = document.getElementById('courses-list');
        container.innerHTML = '';

        this.courses.forEach((course, index) => {
            const div = document.createElement('div');
            div.className = 'item-row course-item';
            div.setAttribute('data-testid', `text-course-${index}`);
            
            div.innerHTML = `
                <span class="item-bullet">•</span>
                <span class="course-name">${course.name}:</span>
                <span class="course-description">${course.description}</span>
            `;
            
            container.appendChild(div);
        });
    }

    renderInstructors() {
        const container = document.getElementById('instructors-list');
        container.innerHTML = '';

        this.instructors.forEach(instructor => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.setAttribute('data-testid', `text-instructor-${instructor.id}`);
            
            div.innerHTML = `
                <span class="item-bullet">•</span>
                <span class="item-text">${instructor.getDisplayString()}</span>
            `;
            
            container.appendChild(div);
        });
    }

    renderRelationships() {
        this.renderStudentCourseRelationships();
        this.renderCourseInstructorRelationships();
    }

    renderStudentCourseRelationships() {
        const container = document.getElementById('relationships-list');
        container.innerHTML = '';

        const courseDescriptions = this.courses.reduce((acc, course) => {
            acc[course.name] = course.description;
            return acc;
        }, {});

        this.students.forEach(student => {
            const courseDescription = courseDescriptions[student.course] || '';
            const div = document.createElement('div');
            div.className = 'item-row relationship-item';
            div.setAttribute('data-testid', `text-relationship-${student.id}`);
            
            div.innerHTML = `
                <span class="item-bullet relationship-arrow">→</span>
                <span class="item-text">${student.getCourseRelationship(courseDescription)}</span>
            `;
            
            container.appendChild(div);
        });
    }

    renderCourseInstructorRelationships() {
        const container = document.getElementById('course-instructor-list');
        container.innerHTML = '';

        const courseToInstructor = this.courses.reduce((acc, course) => {
            const instructor = this.instructors.find(inst => inst.teachesCourse(course.name));
            if (instructor) {
                acc[course.name] = instructor.name;
            }
            return acc;
        }, {});

        this.courses.forEach((course, index) => {
            const instructorName = courseToInstructor[course.name];
            const div = document.createElement('div');
            div.className = 'item-row relationship-item';
            div.setAttribute('data-testid', `text-course-instructor-${index}`);
            
            div.innerHTML = `
                <span class="item-bullet relationship-arrow">→</span>
                <span class="item-text">${course.name} → Taught by ${instructorName}</span>
            `;
            
            container.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});