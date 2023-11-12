import pool from "../db.js";

class Controller {
  async addProject(req, res) {
    try {
      const { name, description, type, deadline, date_create } = req.body;
      const userId = req.user.user_id;

      const splitDate = deadline.split("-");
      const convertedDeadline = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;

      console.log(req.user.user_id);
      const projectAdd = await pool.query(
        "INSERT INTO projects (name, description,type, deadline, date_create, status, user_id) VALUES ($1, $2, $3, $4,CURRENT_DATE, false, $5)",
        [name, description, type, convertedDeadline, userId]
      );
      return res.json({ project: projectAdd.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getProject(req, res) {
    try {
      const userId = req.user.user_id;
      console.log(req.user);

      const projectList = await pool.query(
        "SELECT * FROM projects WHERE user_id = $1",
        [userId]
      );
      console.log(projectList.rows);
      return res.json(projectList.rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const projectId = req.params.id;
      const userId = req.user.user_id;
      console.log(projectId);
      const projectDel = await pool.query(
        "DELETE FROM projects WHERE id=$1 AND user_id=$2",
        [projectId, userId]
      );
      console.log(req.user.user_id);
      console.log(projectId);

      if (projectDel.rowCount === 0) {
        return res.status(404).json({
          message: `Task with id ${projectId} not found or not associated with user ${userId}`,
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async editProject(req, res) {
    if (!req.body || !req.user) {
      return res.status(400).json({ message: "Invalid request" });
    }
    try {
      const projectId = req.params.id;
      const { name, description, type, deadline } = req.body;
      const userId = req.user.user_id;

      const projectEdit = await pool.query(
        "UPDATE projects SET name=$1, description=$2, type=$3, deadline=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
        [name, description, type, deadline, projectId, userId]
      );

      if (projectEdit.rowCount === 0) {
        return res.status(404).json({
          message: `Task with id ${projectId} not found or not associated with user ${userId}`,
        });
      }
      res.json({
        message: `Task with id ${projectId} was updated`,
        project: projectEdit.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

export default new Controller();
