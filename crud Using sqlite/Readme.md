# write restApi using these tech typescipt, sqlite3, express

- Some explanations on the line of code db.all (sql, [], (err, rows) => { ... })
  - The 1st parameter is the SQL query to execute
  - The 2nd parameter is an array with the variables necessary for the query. Here, the value "[]" is used because the query does not need a variable.
  - The 3rd parameter is a callback function called after the execution of the SQL query.
    "(err, rows)" corresponds to the parameters passed to the callback function. "err" may contain an error object and "rows" is an array containing the list of rows returned by the SELECT
