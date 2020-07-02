const connection = require("./db/connection");
const inquirer = require("inquirer");

function addDepartment(){
    inquirer.prompt([
        {
            message: "What is the department's name?",
            type: "input",
            name: "addDepartment"
        }
    ]).then((response) => {
        connection.query("INSERT INTO department (name) VALUES (?)", response.addDepartment, (err, result) => {
            if(err) throw err;
        console.log("Inserted as ID"+ result.insertId);
        console.log(response);
            });
        });
    };

function addRole(){
    connection.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
    inquirer.prompt([
        {
            message: "What is the role title?",
            type: "input",
            name: "title"
        },
        {
            message: "What is the role salary?",
            type: "input",
            name: "salary",
            validate: (value) => {return !isNaN(value) ? true : "Please provide a number";}
        },
        {
            message: "What department is the role in?",
            type: "list",
            name: "department_id",
            choices: results.map(department => {
                return {name: department.name, value: department.id};
            })
        }
    ]).then((response) => {
        connection.query("INSERT INTO role SET ?", response, (err, result) => {
            if(err) throw err;
        console.log("Inserted as ID"+ result.insertId);
        console.log(response);
                });
             });
    })};

function addEmployee(){
   getRoles((roles) => {
   getEmployees((employees) => {       
    const employeeSelection = employees.map( employee => {
    return{
        name: employee.first_name +" "+employee.last_name,
        value: employee.id
    };
    })
    employeeSelection.unshift({name: "None", value: null});

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
                message: "Which role does the employee have? ",
                type: "list",
                name: "role_id",
                choices: roles.map( role => {
                    return{
                        name: role.title,
                        value: role.id
                    };
                })
            },
            {
                message: "Select Manager",
                type: "list",
                name: "manager_id",
                choices: employeeSelection
            }
        ]).then((response) => {
           connection.query("INSERT INTO employee SET ?", response, (err, result) => {
            if(err) throw err;
        console.log("Inserted as ID"+ result.insertId);
        console.log(response);
            });
            })
         })
    });
};

function getRoles(cb){
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        cb(results)
});
};

function getEmployees(cb){
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        cb(results);
}); 
};


//   * View departments, roles, employees
function viewDepartment(){

};

function viewRoles(){  
    getRoles((roles) => {
        console.table(roles)
    });
};


function viewEmployees(){
    getEmployees((employees) => {
        console.table(employees)
    });
};


function updateDepartment(){

};


function updateRoll(){
    
};





// Update Employee Roles
function updateEmployee(){
    
};
