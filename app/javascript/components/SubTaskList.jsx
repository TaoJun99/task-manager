import React from "react";
import SubTask from "../components/SubTask";

class SubTaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { subtasks: [],
                       newSubtask: {description: ""}};
        this.changeStatus = this.changeStatus.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    getTaskId() {
        const { id } = this.props;
        return id;
    }

    componentDidMount() {
        const subtaskUrl = `/api/v1/tasks/${this.getTaskId()}/sub_tasks`
        fetch(subtaskUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({ subtasks: response }))
            .catch(() => this.props.history.push("/tasks"));
    }

    changeStatus(subtask_id) {
        const url = `/api/v1/tasks/${this.getTaskId()}/sub_tasks/${subtask_id}/status`;
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
            .then(response => this.setState({subtasks: response}))
            .catch(error => console.log(error.message));
    }

    onInputChange(event) {
        this.setState({ newSubtask: { description: event.target.value }});
    }

    onAdd(event) {
        event.preventDefault();

        if (this.state.newSubtask.description === "") {
            return;
        }

        const url = `/api/v1/tasks/${this.getTaskId()}/sub_tasks`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { description } = this.state.newSubtask;
        const body = {
            description,
        };

        fetch(url, {
            method: "POST",
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
            .then(response => this.setState({subtasks: response}))
            .catch(error => console.log(error.message));
        this.clearInput();
    }

    clearInput() {
        this.setState({ newSubtask: {description: "", status: ""}});
    }

    deleteSubtask(subtask_id) {
        const newSubtasks = this.state.subtasks.filter(subtask => subtask.id !== subtask_id);
        this.setState({subtasks: newSubtasks});

        const url = `/api/v1/tasks/${this.getTaskId()}/sub_tasks/${subtask_id}`;
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
            .catch(error => console.log(error.message));
    }

    render() {
        const subtasks = this.state.subtasks;
        const allSubtasks = subtasks.map(subtask => (
            <SubTask
                key={subtask.id}
                task_id={this.props.id}
                subtask_id={subtask.id}
                description={subtask.description}
                status={subtask.status}
                changeStatus={() => this.changeStatus(subtask.id)}
                onDelete={() => this.deleteSubtask(subtask.id)}> </SubTask>
        ));
        return (
            <div>
                <ul className="list-group mt-3">
                    <li className="list-group-item list-group-item-primary" key="title">
                        SubTasks
                    </li>
                    {allSubtasks}
                </ul>

                <form onSubmit={this.onAdd}>
                    <div className="input-group mt-4">
                        <input type="text"
                               className="form-control"
                               placeholder="Add SubTask..."
                               value={this.state.newSubtask.description}
                               onChange={this.onInputChange}/>
                        <button className="btn btn-primary" type="submit">
                            Add
                            <i className="bi-plus-square-fill ms-2"> </i>
                        </button>
                    </div>
                </form>

            </div>
        )
    }

}

export default SubTaskList;
