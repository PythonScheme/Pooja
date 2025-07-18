/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: ___Puja Marasini___________________ Student ID: _154897235_____________ Date: __7/4/2025____________
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const path = require("path");
const express = require("express");
const projectData = require("./modules/projects");
const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public')); 


projectData.initialize().then(() => {

 
  app.get("/", (req, res) => {
    res.render("home", { page: "/" });
  });

 
  app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
  });

  
  app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;

    if (sector) {
      projectData.getProjectsBySector(sector)
        .then(projects => res.render("projects", {projects: projects}))
        .catch(err => res.status(404).render("404", {message: `No projects found for sector: "${sector}"`}));
    } else {
      projectData.getAllProjects()
        .then(projects => res.render("projects", {projects: projects}))
        .catch(err => res.status(404).send(err));
    }
  });


  app.get("/solutions/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);

    projectData.getProjectById(id)
      .then(project => res.render("project", {project: project}))
      .catch(err => res.status(404).render("404", {message: `No project found with ID: ${req.params.id}`}));
  });

  
  app.use((req, res) => {
    res.status(404).render("404", {message: "Sorry, the page you're looking for does not exist."});
  });

  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error("Project initialization failed:", err);
});
