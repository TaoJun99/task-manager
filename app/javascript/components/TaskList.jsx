import React from "react";
import { Link } from "react-router-dom";

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: ["initial"],
            filteredTasks: []
        };
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    componentDidMount() {
        const url = "/api/v1/tasks";
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ tasks: response });
                this.setState({ filteredTasks : response });
            })
            .catch(() => this.props.history.push("/"));
    }

    onFilterChange(event) {
        const newFilteredTasks = this.state.tasks.filter(task => task.tag.toLowerCase().startsWith(event.target.value.toLowerCase()));
        this.setState({filteredTasks: newFilteredTasks});
    }

    getStatusIcon(status) {
        if (status === "incomplete") {
            return (
                <span className="badge bg-warning rounded-pill">
                    incomplete
                </span>
            );
        } else {
            return (
                <span className="badge bg-success rounded-pill">
                    complete
                </span>
            );
        }
    }

    render() {
        const tasks = this.state.filteredTasks;

        const allTasks = tasks.map(task => (
            <div className="col-md-6 col-lg-4">
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="card-title"> {task.title} </h2>
                        <p className="card-text"> {task.description} </p>
                        <p className="card-text">
                            Due: {" "}
                            {(new Date(task.deadline)).toLocaleString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                month: 'long',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </p>
                        <span className="badge bg-primary me-2"> {task.tag} </span>
                        {this.getStatusIcon(task.status)}

                    </div>
                    <div className="card-footer bg-transparent">
                        <Link to={`/task/${task.id}`} className="btn custom-button mt-2">
                            Manage
                        </Link>
                    </div>
                </div>
            </div>
        ));

        const noTask = (
            <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
                <h4>
                    No tasks in your task list! Create one to start managing!
                    <i className="bi-emoji-smile ms-2"> </i>
                </h4>
            </div>
        );

        const noMatchingTask = (
            <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
                <h4>
                    No tasks match the given tag
                    <i className="bi-emoji-frown ms-2"> </i>
                </h4>
            </div>
        );

        const taskDisplay = tasks.length > 0 ? allTasks : (this.state.tasks.length === 0 ? noTask : noMatchingTask);

        const loading = (
            <div> <p> Loading... </p> </div>
        )

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
                                    <Link to="/task" className="nav-link">
                                        Create New Task
                                    </Link>
                                </li>
                            </ul>
                            <form className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Filter by tag"
                                       aria-label="Search" onChange={this.onFilterChange}/>
                            </form>
                        </div>
                    </div>
                </nav>

                <div className="py-5 justify-content-center">
                    <main className="container">
                        <div className="row">
                            { tasks[0] === "initial" ? loading : taskDisplay}
                        </div>
                    </main>
                </div>
            </>
        );
    }

}
export default TaskList;