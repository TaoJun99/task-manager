import React from "react";
import SubTask from "../components/SubTask";

class SubTaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { subtasks: [],
                       newSubtask: {description: "", status:""}};
        this.changeStatus = this.changeStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateSubtask = this.updateSubtask.bind(this);
    }

    componentDidMount() {
        const { id } = this.props;

        const subtaskUrl = `/api/v1/tasks/${id}/sub_tasks`
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
        const subtasks = this.state.subtasks;
        const subtask = subtasks.find(subtask => subtask.id === subtask_id);
        const value = subtask.status === "complete" ? "incomplete" : "complete";
        let newSubtask = Object.assign({}, subtask);
        newSubtask.status = value;
        const newSubtasks = subtasks.map(subtask => {
            if (subtask.id === subtask_id) {
                return newSubtask;
            } else {
                return subtask;
            }
        });
        this.setState( { subtasks: newSubtasks });
        this.updateSubtask(newSubtask);
    }

    updateSubtask(newSubtask) {
        const { id } = this.props;

        const url = `/api/v1/tasks/${id}/sub_tasks/${newSubtask.id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { description, status } = newSubtask;
        const body = {
            description,
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
        this.setState({ newSubtask: { description: event.target.value, status: "incomplete" }});
    }

    onSubmit(event) {
        event.preventDefault();

        const newSubtask = this.state.newSubtask;
        if (newSubtask.description === "") {
            return;
        }
        const newSubtasks = this.state.subtasks.concat(newSubtask);
        this.setState({ subtasks: newSubtasks});
        this.addSubtask(this.state.newSubtask);
        this.clearInput();
    }

    clearInput() {
        this.setState({ newSubtask: {description: "", status: ""}});
    }

    addSubtask(newSubtask) {
        const { id } = this.props;

        const url = `/api/v1/tasks/${id}/sub_tasks`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { description } = newSubtask;
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
            .catch(error => console.log(error.message));
    }

    deleteSubtask(subtask_id) {
        const newSubtasks = this.state.subtasks.filter(subtask => subtask.id !== subtask_id);
        this.setState({subtasks: newSubtasks});

        const { id } = this.props;

        const url = `/api/v1/tasks/${id}/sub_tasks/${subtask_id}`;
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
        const allSubtasks = subtasks.map((subtask, index) => (
            <SubTask
                task_id={this.props.id}
                subtask_id={subtask.id}
                description={subtask.description}
                status={subtask.status}
                onChange={() => this.changeStatus(subtask.id)}
                onDelete={() => this.deleteSubtask(subtask.id)}> </SubTask>
        ));
        return (
            <div>
                <ul className="list-group mt-3">
                    <li className="list-group-item list-group-item-primary">
                        SubTasks
                    </li>
                    {allSubtasks}
                </ul>
                <form onSubmit={this.onSubmit}>
                    <div className="input-group mt-4">
                        <input type="text"
                               className="form-control"
                               placeholder="Add SubTask..."
                               value={this.state.newSubtask.description}
                               onChange={this.onChange}/>
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
