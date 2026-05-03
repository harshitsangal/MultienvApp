import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Tickets.css";

const Tickets = ({ env }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const apiUrl = env === "prod" ? "/prod/api/tickets" : "/dev/api/tickets";

  const loadTasks = useCallback(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const raw = response.data?.tasks;
        setTasks(Array.isArray(raw) ? raw : []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTasks([]);
      });
  }, [apiUrl]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Title is required.");
      return;
    }
    setSubmitting(true);
    axios
      .post(
        apiUrl,
        { title: trimmed, description: description.trim() || undefined },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        setTitle("");
        setDescription("");
        loadTasks();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.error ||
          err.message ||
          "Could not create ticket.";
        setFormError(msg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="tickets-container">
      <p className="tickets-back">
        <Link to="/">← Home</Link>
      </p>
      <h1>{(env === "prod" ? "PROD" : "DEV")} Tickets</h1>

      <form className="ticket-form" onSubmit={handleSubmit} noValidate>
        <h2 className="ticket-form-title">Add a ticket</h2>
        {formError && <p className="ticket-form-error">{formError}</p>}
        <label className="ticket-form-label">
          Title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title"
            disabled={submitting}
            autoComplete="off"
          />
        </label>
        <label className="ticket-form-label">
          Description
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
            rows={3}
            disabled={submitting}
          />
        </label>
        <button type="submit" disabled={submitting} className="ticket-form-submit">
          {submitting ? "Adding…" : "Add ticket"}
        </button>
      </form>

      <div className="task-container">
        <div className="column completed">
          <h2>Completed Tickets</h2>
          <ul>
            {tasks
              .filter((task) => task.completed)
              .map((task, index) => (
                <li key={index} className="task-item">
                  {task.title}
                  {task.description != null && task.description !== ""
                    ? ` (${task.description})`
                    : ""}
                  <br />
                  <span className="created-at">
                    Created At: {task.created_at}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div className="column pending">
          <h2>Pending Tickets</h2>
          <ul>
            {tasks
              .filter((task) => !task.completed)
              .map((task, index) => (
                <li key={index} className="task-item">
                  {task.title}
                  {task.description != null && task.description !== ""
                    ? ` (${task.description})`
                    : ""}
                  <br />
                  <span className="created-at">
                    Created At: {task.created_at}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
