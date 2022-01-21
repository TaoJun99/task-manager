import React from "react";
import { Link } from "react-router-dom";
import SubTaskList from "../components/SubTaskList";

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = { task: { title: "", description: "", deadline: "", status: "" },
                       isEditing: false };

        this.deleteTask = this.deleteTask.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    getTaskId() {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        return id;
    }

    componentDidMount() {
        const taskUrl = `/api/v1/tasks/${this.getTaskId()}`;

        fetch(taskUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({ task: response }))
            .catch(() => this.props.history.push("/tasks"));
    }

    getStatusIcon() {
        if (this.state.task.status === "incomplete") {
            return (
                <span className="badge bg-warning rounded-pill ms-2">
                    incomplete
                </span>
            );
        } else {
            return (
                <span className="badge bg-success rounded-pill ms-2">
                    complete
                </span>
            );
        }
    }

    renderDefaultView() {
        const task = this.state.task;
        const deadline = new Date(task.deadline);

        return (
            <div>
                <h1>
                    {task.title}
                    <button type="button" className="btn btn-outline-danger float-end"
                            data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                        Delete Task
                        <i className="bi-trash-fill"> </i>
                    </button>


                    <button type="button" className="btn btn-outline-primary me-3 float-end"
                            onClick={() => this.setState({isEditing: true})}>
                        Edit Task Details
                        <i className="bi-pencil-fill ms-2"> </i>
                    </button>
                    <button type="button" className="btn btn-outline-primary me-3 float-end"
                            onClick={this.changeStatus}>
                        Complete/Incomplete
                    </button>
                </h1>

                <div className="modal fade" data-bs-backdrop="false" id="confirmDeleteModal"
                     tabIndex="-1" aria-labelledby="modalConfirmation" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalConfirmation"> Confirmation </h5>
                                <button type="button" className="btn-close"
                                        data-bs-dismiss="modal" aria-label="Close"> </button>
                            </div>
                            <div className="modal-body">
                                Delete Task?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={this.deleteTask}
                                        id="modalClose">
                                    Delete
                                </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-muted">
                    {task.description}
                </p>
                <p>
                    Due: {deadline.toLocaleString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long',
                    hour: 'numeric',
                    minute: 'numeric'
                })}
                </p>
                <h4>
                    <span className="badge bg-primary"> {task.tag} </span>
                    {this.getStatusIcon()}
                </h4>
            </div>
        );
    }

    changeStatus() {
        const url = `/api/v1/tasks/${this.getTaskId()}/status`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "PUT",
            headers: {
                "X-CSRF_Token": token,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({task: response}))
            .catch(error => console.log(error.message));

    }

    deleteTask() {
        const url = `/api/v1/tasks/${this.getTaskId()}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(url, {
            method: "DELETE",
            headers: {
                "X-CSRF_Token": token,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(() => this.props.history.push("/tasks"))
            .catch(error => console.log(error.message));
    }

    renderEditView() {
        const task = this.state.task;
        return (
            <div>
                <button type="button" className="btn btn-outline-danger float-end"
                        onClick={() => this.setState({ isEditing: false})}>
                    Discard Changes
                    <i className="bi-trash-fill ms-2"> </i>
                </button>
                <button type="button" className="btn btn-outline-primary me-2 float-end" onClick={this.saveChanges}>
                    Save Changes
                    <i className="bi-save ms-2"> </i>
                </button> <br/>
                <p className="mt-4">
                    Task:
                    <input
                        type="text"
                        name="title"
                        id= "title"
                        className="form-control"
                        defaultValue={task.title}
                        onChange={this.onChange}>
                    </input>
                </p>
                <p>
                    Description:
                    <input
                        type="text"
                        name="description"
                        id= "description"
                        className="form-control"
                        defaultValue={task.description}
                        onChange={this.onChange}>
                    </input>
                </p>
                <p>
                    Deadline:
                    <input
                        type="datetime-local"
                        name="deadline"
                        id="deadline"
                        className="form-control"
                        defaultValue={task.deadline.substring(0, 16)}
                        onChange={this.onChange}>
                    </input>
                </p>
            </div>
        );
    }

    saveChanges() {
        this.updateTask();
        this.setState( {isEditing: false});
    }

    updateTask() {
        const url = `/api/v1/tasks/${this.getTaskId()}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { title, description, deadline, status } = this.state.task;
        const body = {
            title,
            description,
            deadline,
            status
        };

        fetch(url, {
            method: "PUT",
            headers: {
                "X-CSRF_Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .catch(error => console.log(error.message));
    }

    onChange(event) {
        let newTask = Object.assign({}, this.state.task);
        newTask[event.target.name] = event.target.value;
        this.setState({task: newTask} );
    }

    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link to="/" className="navbar-brand" >
                            <i className="bi-house-fill"> </i>
                        </Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link to="/tasks" className="nav-link">
                                        View All Tasks
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="py-5">
                    <main className="container">
                        {this.state.isEditing ? this.renderEditView() : this.renderDefaultView()} <br/>
                        <SubTaskList id={this.getTaskId()}/>
                    </main>
                </div>
            </>
        );
    }

}

export default Task;
