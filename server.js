/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: ___Puja Marasini___________________ Student ID: _154897235_____________ Date: ______________
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

// Add middleware for URL encoded form data
app.use(express.urlencoded({ extended: true }));

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
        .then(projects => res.render("projects", { projects: projects }))
        .catch(err => res.status(404).render("404", { message: `No projects found for sector: "${sector}"` }));
    } else {
      projectData.getAllProjects()
        .then(projects => res.render("projects", { projects: projects }))
        .catch(err => res.status(404).send(err));
    }
  });

  app.get("/solutions/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);

    projectData.getProjectById(id)
      .then(project => res.render("project", { project: project }))
      .catch(err => res.status(404).render("404", { message: `No project found with ID: ${req.params.id}` }));
  });

  // GET route for add project form
  app.get("/solutions/addProject", (req, res) => {
    projectData.getAllSectors()
      .then(sectorData => {
        res.render("addProject", { sectors: sectorData });
      })
      .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
      });
  });

  // POST route for add project form
  app.post("/solutions/addProject", (req, res) => {
    projectData.addProject(req.body)
      .then(() => {
        res.redirect("/solutions/projects");
      })
      .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
      });
  });

  // GET route for edit project form
  app.get("/solutions/editProject/:id", (req, res) => {
    const projectId = req.params.id;

    Promise.all([
      projectData.getProjectById(projectId),
      projectData.getAllSectors()
    ])
      .then(([projectData, sectorData]) => {
        res.render("editProject", { sectors: sectorData, project: projectData });
      })
      .catch(err => {
        res.status(404).render("404", { message: err });
      });
  });

  // POST route for edit project form
  app.post("/solutions/editProject", (req, res) => {
    projectData.editProject(req.body.id, req.body)
      .then(() => {
        res.redirect("/solutions/projects");
      })
      .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
      });
  });

  // GET route for delete project
  app.get("/solutions/deleteProject/:id", (req, res) => {
    const projectId = req.params.id;

    projectData.deleteProject(projectId)
      .then(() => {
        res.redirect("/solutions/projects");
      })
      .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
      });
  });

  app.use((req, res) => {
    res.status(404).render("404", { message: "Sorry, the page you're looking for does not exist." });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error("Project initialization failed:", err);
});