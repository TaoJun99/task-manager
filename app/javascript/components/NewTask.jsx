import React from "react";
import { Link } from "react-router-dom";

class NewTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            tag: "",
            description: "",
            deadline: Date.now(),
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        const url = "/api/v1/tasks";
        const { title, tag, description, deadline } = this.state;

        if (title.isEmpty || tag.isEmpty || description.isEmpty || deadline.isEmpty)
            return;

        const body = {
            title,
            tag,
            description,
            deadline
        };

        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
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
            .then(response => this.props.history.push(`/task/${response.id}`))
            .catch(error => console.log(error.message));
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 col-lg-6 offset-lg-3">
                        <h1 className="font-weight-normal mb-5">
                            Add a new task.
                        </h1>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group row">
                                <div className="col-10">
                                    <label htmlFor="title">Task</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form-control"
                                        required
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-2">
                                    <label htmlFor="tag">Tag</label>
                                    <input
                                        type="text"
                                        name="tag"
                                        id="tag"
                                        className="form-control"
                                        required
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deadline">Deadline</label>
                                <input
                                    type="datetime-local"
                                    name="deadline"
                                    id="deadline"
                                    className="form-control"
                                    required
                                    onChange={this.onChange}
                                />
                            </div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                rows="4"
                                required
                                onChange={this.onChange}
                            />
                            <button type="submit" className="btn custom-button mt-3">
                                Create Task
                            </button>
                            <Link to="/tasks" className="btn btn-link mt-3">
                                Back to tasks
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewTask;