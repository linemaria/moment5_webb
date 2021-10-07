
//variables
const coursesEl = document.getElementById("courses");
const table = document.getElementById("course_table");
const form = document.getElementById("course_form");

const codeInput = <HTMLInputElement>document.getElementById("code");
const courseNameInput = <HTMLInputElement>document.getElementById("name");
const progressionInput = <HTMLInputElement>document.getElementById("progression");
const termInput = <HTMLInputElement>document.getElementById("term");
const syllabusInput = <HTMLInputElement>document.getElementById("syllabus");
const submit = <HTMLInputElement>document.getElementById("submit");
const id = <HTMLInputElement>document.getElementById("id");

const editForm = document.getElementById("edit-form");
const idInput = document.getElementById('id');
const coursesOutputEl = document.getElementById('coursesOutput');
const addCourseButtonEl = document.getElementById('submitCourse');
const updateCourseButtonEl = document.getElementById('updateCourse');

//Eventlistners
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form Submitted");
})
window.addEventListener('load', getCourses);
submit.addEventListener("click", submitCourse);


//GET all courses
 function getCourses() {
    table.innerHTML = `<thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Progression</th>
                            <th>Term</th>
                            <th>Syllabus</th>
                        </tr>`;

    fetch("http://localhost/moment5/api.php")
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch");
        }
    })
    .then(data => {
        if(!data.message) {
            data.forEach((course : {code: string, courseName: string, progression: string, syllabus: string, term: number, id: number}) => {
                table.innerHTML += 
                            `<tr>
                                <td>${course.code}</td>
                                <td>${course.courseName}</td>
                                <td>${course.progression}</td>
                                <td>${course.term}</td>
                                <td><a href="${course.syllabus}">${course.syllabus}</a></td>
                                <td class="noBoard"><button id="${course.id}" class="tdButt2" onclick="editCourse('${course.code}', '${course.courseName}', '${course.progression}', '${course.syllabus}', '${course.term}', '${course.id}' )">Update</button></td>
                                <td class="noBoard"><button id="${course.id}" class="tdButt" onclick="deleteCourse('${course.id}')">Delete</button></td>
                            </tr>`;
            })
        } else {
            console.log("API: " + data.message);
        }
    })
    .catch(err => console.log(err));
}

//ADD course
function submitCourse() {
    let code = codeInput.value;
    let courseName = courseNameInput.value;
    let progression = progressionInput.value;
    let term = termInput.value;
    let syllabus = syllabusInput.value;

    let course = {'code': code, 'courseName': courseName, 'progression': progression, 'term': term, 'syllabus': syllabus};

    fetch("http://localhost/moment5/api.php", {
        method: 'POST',
        body: JSON.stringify(course),
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log("ERROR: ", error);
    }) 

}


//DELETE course
function deleteCourse(id: number) {

    fetch("http://localhost/moment5/api.php?id=" + id, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log("ERROR: ", error);
    })
}



 //EDIT course 

function editCourse(code: string, courseName: string, progression: string, syllabus: string, term: number, id: number) {

    editForm.innerHTML =
        `
        <form>
            <label for="code-edit">Course code: </label>
            <input type="text" name="code-edit" id="code-edit" value="${code}">
            <br>
            <label for="name-edit">Course name: </label>
            <input type="text" name="courseName-edit" id="courseName-edit" value="${courseName}">
            <br>
            <label for="progression-edit">Progression: </label>
            <input type="text" name="progression-edit" id="progression-edit" value="${progression}">
            <br>
            <label for="term-edit">Term: </label>
            <input type="text" name="term-edit" id="term-edit" value="${term}">
            <br>
            <label for="syllabus-edit">Syllabus: </label>
            <input type="text" name="syllabus-edit" id="syllabus-edit" value="${syllabus}">
            <br>
            <br>
            <button class="tdButt2" id="save">Save</button>
            <button class="tdButt" onClick="abortEdit()">Cancel</button>
        </form>
        `;

    let save = document.getElementById("save");

    save.addEventListener("click", function (e) {
        e.preventDefault();
        updateCourse(id);
    });
}

//UPDATE course, not working...
function updateCourse(id: number) {

   let codeInputEdit = <HTMLInputElement>document.getElementById("code-edit");
   let courseNameInputEdit = <HTMLInputElement>document.getElementById("courseName-edit");
   let progressionInputEdit = <HTMLInputElement>document.getElementById("progression-edit");
   let termInputEdit = <HTMLInputElement>document.getElementById("term-edit");
   let syllabusInputEdit = <HTMLInputElement>document.getElementById("syllabus-edit");

   let code = codeInputEdit.value;
   let courseName = courseNameInputEdit.value;
   let progression = progressionInputEdit.value;
   let term = termInputEdit.value;
   let syllabus = syllabusInputEdit.value;

    code.toString();
    courseName.toString();
    progression.toString();
    term.toString();
    syllabus.toString();

    let course = {'code': code, 'courseName': courseName, 'progression': progression, 'term': term, 'syllabus': syllabus};

    fetch("http://localhost/moment5/api.php?id=" + id, {
        method: "PUT",
        body: JSON.stringify(course),
    })
        .then(response => response.json())
        .then(data => {
            getCourses();
        })
        .catch(error => {
            console.log("Error: ", error);
        });

    abortEdit();
};


function abortEdit() {
    editForm.innerHTML = "";
}