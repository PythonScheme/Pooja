const projects = require("./modules/projects.js");

projects.initialize();

console.log("All Projects:");
console.log(projects.getAllProjects());

console.log("\nProject with ID 9:");
console.log(projects.getProjectById(9));

console.log("\nProjects in Agriculture:");
console.log(projects.getProjectsBySector("agriculture"));
