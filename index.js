const connection = require("./db/connection.js");
const inquirer = require("inquirer");

//   * Add departments, roles, employees
function addDepartment(){
    inquirer.prompt([
        {
            message: "What is the department's name?",
            type: "input",
            name: "addDepartment"
        }
    ]).then((response) => {
        connection.query("INSERT INTO department (name) VALUES (?)", response.departmentName, (err, result) => {
            if(err) throw err;
        });
        console.log("Inserted as ID"+ result.insertId);
        console.log(response);
});
};

function addRole(){
    connection.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
    inquirer.prompt([
        {
            message: "What is the role Title?",
            type: "input",
            name: "addRollTitle"
        },
        {
            message: "What is the role Salary?",
            type: "input",
            name: "addRollSalary",
            validate: (value) => {return !isNaN(value) ? true : "Please provide a number";}
        },
        {
            message: "What department is the role in?",
            type: "input",
            name: "addRollID",
            choices: results.map(department => {
                return {name: department.name, value: department.id};
            })
        }
    ]).then((response) => {
        connection.query("INSERT INTO role (title, salary, department_id) SET (?)", response, (err, result) => {
            if(err) throw err;
        });
        console.log("Inserted as ID"+ result.insertId);
        console.log(response);
    });
    })
    };

function addEmployee(){
    connection.query("SELECT * FROM role", (err, results) => {
        if(err) throw err;
        inquirer.prompt([
            {
                message: "What is the employee's first name?",
                type: "input",
                name: "first_name"
            },
            {
                message: "What is the employee's last name?",
                type: "input",
                name: "last_name"
            },
            {
                message: "Which role ",
                type: "list",
                name: "role_id",
                choices: results.map( role => {
                    return{
                        name: role.title,
                        value: role.id
                    };
                })
            },
            // {
            //     // message: "Which manager ",
            //     // type: "input",
            //     // name: "department"
            // }
        ]).then((response) => {
            connection.query("INSERT INTO role (title, salary, department_id) SET (?)", response, (err, result) => {
                if(err) throw err;
            });
    })
});
};


addEmployee();

// //   * View departments, roles, employees

// function viewDepartment(){
// };


// function viewRole(){
    
// };


// function viewEmployee(){
    
// };
// //   * Update employee roles

// function updateDepartment(){
// };


// function updateRoll(){
    
// };


// function updateEmployee(){
    
// };

// addRole();