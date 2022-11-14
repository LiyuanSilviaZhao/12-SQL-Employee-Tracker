INSERT INTO departments(name) 
VALUES  ('Accounting'),
        ('Sales'),
        ('IT'),  
        ('Legal');  

INSERT INTO roles(title, salary, department_id)
VALUES  ('Sr.Accountant', 80000, 1),
        ('Accountant', 60000, 1),
        ('Engineer', 100000, 3),
        ('Sales Manager', 80000, 2),
        ('Salesperson', 70000, 2),
        ('Lawyer', 100000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES  ('Andy', 'Lee', 1, null),
        ('Lucy', 'Cook', 2, 1),
        ('Peter', 'Fox', 3, null),
        ('Kiki', 'Lam', 4, null),
        ('Kevin', 'Lam', 5, 4),
        ('Duidui', 'Lam', 5, 4),
        ('Zoey', 'Zhao', 6, null);