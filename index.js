const inquirer = require("inquirer");
const mysql = require("mysql2");
var cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
  },
  console.log("Connected to the employee_db database.")
);

//fucntion to prompt questions
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would like to do?",
        name: "choice",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ]).then(function (response) {
      switch (response.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;
      }
    })
}

//function to view all departments
function viewAllDepartments() {
  db.query("SELECT * FROM departments;", (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res);
      init();
    }
  });
}

//function to view all roles
function viewAllRoles() {
  db.query("SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;", (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res);
      init();
    }
  });
}

//function to view all employees
function viewAllEmployees() {
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees 
  LEFT JOIN roles On employees.role_id = roles.id
  LEFT JOIN departments On roles.department_id = departments.id
  LEFT JOIN employees AS manager On employees.manager_id = manager.id`, (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res);
      init();
    }
  });
}

//function to add a new department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department",
        name: "name"
      },
    ]).then(function (res) {
      db.query(
        "INSERT INTO departments SET ? ",
        {
          name: res.name
        }, (err, res) => {
          if (err) {
            throw err;
          } else {
            console.log(`Added to the database.`)
            init();
          }
        }
      );
    });
}

//function to add a new role
function addRole() {
  db.query(`SELECT name FROM departments;`, (err, res) => {
    if (err) {
      throw err;
    } else {
      let currentDepartments = res.map((department) => department.name);

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the name of the role?",
            name: "title",
          },
          {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary",
          },
          {
            type: "list",
            message: "Which department does the role belong to?",
            name: "department",
            choices: currentDepartments,
          },
        ]).then(function (res) {
          const departmentIndex = currentDepartments.indexOf(res.department) + 1;
          db.query(
            "INSERT INTO roles SET ? ",
            {
              title: res.title,
              salary: res.salary,
              department_id: departmentIndex
            }, (err, res) => {
              if (err) {
                throw err;
              } else {
                console.log(`Added to the database.`)
                init();
              }
            }
          )
        })
    }
  });
}

//function to add an new employyee
function addEmployee() {
  db.query(`SELECT title FROM roles;`, (err, res) => {
    if (err) {
      throw err;
    } else {
      let currentRoles = res.map((roles) => roles.title);

      db.query(`SELECT CONCAT(employees.first_name,' ',  employees.last_name) AS fullname FROM employees;`, (err, res) => {
        if (err) {
          throw err;
        } else {
          let currentEmployees = res.map((employee) => employee.fullname);
          inquirer.prompt([
            {
              type: "input",
              message: "What is the employee's first name?",
              name: "firstName",
            },
            {
              type: "input",
              message: "What is the employee's last name?",
              name: "lastName",
            },
            {
              type: "list",
              message: "Which is the employee's role?",
              name: "role_id",
              choices: currentRoles
            },
            {
              type: "list",
              message: "Who is the employee's manager?",
              name: "manager",
              choices: currentEmployees,
            },
          ]).then(function (res) {
            const roleIndex = currentRoles.indexOf(res.role_id) + 1;
            const managerIndex = currentEmployees.indexOf(res.manager) + 1;

            db.query(
              "INSERT INTO employees SET ? ",
              {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: roleIndex,
                manager_id: managerIndex
              }, (err, res) => {
                if (err) {
                  throw err;
                } else {
                  console.log(`Added to the database.`);
                  init();
                }
              }
            )
          })
        }
      });
    }
  })
}

//function to update an employee's role
function updateEmployeeRole() {
  db.query(`SELECT title FROM roles;`, (err, res) => {
    if (err) {
      throw err;
    } else {
      let availableRoles = res.map((roles) => roles.title);

      db.query(`SELECT CONCAT(employees.first_name,' ',  employees.last_name) AS fullname FROM employees;`, (err, res) => {
        if (err) {
          throw err;
        } else {
          let availableEmployees = res.map((employee) => employee.fullname);

          inquirer
            .prompt([
              {
                type: "list",
                message: "Which employee's role do you want to update?",
                name: "id",
                choices: availableEmployees,
              },
              {
                type: "list",
                message: "Which role do you want to assign the selected emplpyee?",
                name: "title",
                choices: availableRoles,
              },
            ]).then(function (res) {
              const roleIndex = availableRoles.indexOf(res.title) + 1;
              const employeeIndex = availableEmployees.indexOf(res.id) + 1; 
              
              db.query("UPDATE employees SET ? WHERE ?",
                  [{
                    role_id:roleIndex,
                  },
                  {
                    id:employeeIndex,
                  }], (err, res) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log(`Updated the database.`)
                      init();
                    }
                  }
                )
            })
        }
      })
    }
  })
}

init();
