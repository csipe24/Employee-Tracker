const connection = require("./db/connection");
const inquirer = require("inquirer");

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as " + connection.threadId + "\n");
    runApp();
  });

function runApp(){
    inquirer.prompt({
        name:"action",
        type:"list",
        message: "What would you like to do?",
        choices: [
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "View Departments",
            "View Roles",
            "View Employees",
            "Update a Department",
            "Update a Role",
            "Update an Employee",
            "Stop Application"
        ]
    })
    .then(answer =>{
        switch(answer.action){
            case "Add a Department":
                addDepartment();
            break;

            case "Add a Role":
                addRole();
            break;

            case "Add an Employee":
                addEmployee();
            break;

            case "View Departments":
                viewDepartment();
            break;

            case "View Roles":
                viewRoles();
            break;

            case "View Employees":
                viewEmployees();
            break;

            case "Update a Department":
                updateDepartment();
            break;

            case "Update a Role":
                updateRole();
            break;

            case "Update an Employee":
                updateEmployee();
            break;

            case "Stop Application":
                  connection.end();
            break;
        }
    });
}

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
        runApp();
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
        runApp();
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
        runApp();
            });
            })
         })
    });
};

function getDepartments(cb){
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        cb(results);
});
};

function getRoles(cb){
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        cb(results);
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
    getDepartments((departments) => {
        console.table(departments);
        runApp();
    });
};

function viewRoles(){  
    getRoles((roles) => {
        console.table(roles);
        runApp();
    });
};

function viewEmployees(){
    getEmployees((employees) => {
        console.table(employees);
        runApp();
    });
};


function updateDepartment(){
    console.log("Updating Departments");
    getDepartments(departments => {
    const departmentSelection = departments.map( department => {
        return{
                name: department.name,
                value: department.id
            };
        });
    inquirer.prompt([
            {
                message: "Which department would you like to update?",
                type: "list",
                name: "departments",
                choices: departmentSelection
            },
            {
                message: "What would you like to update department name to?",
                type: "input",
                name: "updateDep",
            }
        ]).then((response) => {
        console.log(response);
            connection.query("UPDATE department SET name = ? WHERE id = ?", [response.updateDep, response.departments], (err, result) => {
             if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
         console.log(response);
            });
        runApp();
        });
    })
};

function updateRole(){
    console.log("Updating Roles");
    getRoles(roles => {
        console.log(roles);
    const rolesSelection = roles.map( role => {
        return{
                name: role.title,
                value: role.id
            };
        });
    inquirer.prompt([
            {
                message: "Which role would you like to update?",
                type: "list",
                name: "roles",
                choices: rolesSelection
            },
            {
                message: "What would you like to update role title to?",
                type: "input",
                name: "title"
            },
            {
                message: "What would you like to update role salary to?",
                type: "number",
                name: "salary"
            }
        ]).then((response) => {
            console.log(response);
            connection.query("UPDATE role SET title = ? WHERE id = ?;", [response.title, response.roles], (err, result) => {
                console.log(response);
                if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
            });
            connection.query("UPDATE role SET salary = ? WHERE id = ?;", [response.salary, response.roles], (err, result) => {
                console.log(response);
                if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
            });
        runApp();
        });
    })
};


function updateEmployee(){
   console.log("Updating Employee");
    getRoles((roles) => {
    getEmployees(employees => {
    const employeeSelection = employees.map( employee => {
        return{
            name: employee.first_name +" "+employee.last_name,
            value: employee.id
            };
        });
    inquirer.prompt([
            {
                message: "Which employee would you like to update?",
                type: "list",
                name: "employee",
                choices: employeeSelection
            },
            {
                message: "What would you like to update employee first name to?",
                type: "input",
                name: "first"
            },
            {
                message: "What would you like to update employee last name to?",
                type: "input",
                name: "last"
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
            
        ]).then((response) => {
            console.log(response);

            connection.query("UPDATE employee SET first_name = ? WHERE id = ?;", [response.first, response.employee], (err, result) => {
                console.log(response);
                if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
            });

            connection.query("UPDATE employee SET last_name = ? WHERE id = ?;", [response.last, response.employees], (err, result) => {
                console.log(response);
                if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
            });

            connection.query("UPDATE employee SET role_id = ? WHERE id = ?;", [response.role_id, response.role_id], (err, result) => {
                console.log(response);
                if(err) throw err;
         console.log("Inserted as ID"+ result.insertId);
            });
        runApp();
        });
    })
})
};
