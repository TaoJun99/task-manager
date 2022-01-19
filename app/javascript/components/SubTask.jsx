import React from "react";

class SubTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            subtask: { description: this.props.description, status: this.props.status, id: this.props.subtask_id }
        };

        this.setInput = this.setInput.bind(this);
    }

    getStatusIcon() {
        if (this.props.status === "incomplete") {
            return (
                <span className="badge bg-warning rounded-pill ms-2 me-auto">
                    incomplete
                </span>
            );
        } else {
            return (
                <span className="badge bg-success rounded-pill ms-2 me-auto">
                    complete
                </span>
            );
        }
    }

    renderDefaultView() {
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <input className="form-check-input me-2" type="checkbox" value=""
                       checked={this.props.status !== "incomplete"} onChange={() => this.props.onChange()}/>

                {this.state.subtask.description}
                {this.getStatusIcon()}

                <button type="button" className="btn btn-outline-secondary me-2"
                        onClick={() => this.setState({isEditing: true})}>
                    <i className="bi-pencil-fill"> </i>
                </button>

                <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteSubTaskModal">
                    <i className="bi-trash-fill"> </i>
                </button>

                <div className="modal fade" data-bs-backdrop="false" id="deleteSubTaskModal" tabIndex="-1" aria-labelledby="modalConfirmation" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteSubTaskConfirmation"> Confirmation </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"> </button>
                            </div>
                            <div className="modal-body">
                                Delete SubTask?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={this.props.onDelete}> Delete </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                            </div>
                        </div>
                    </div>
                </div>


            </li>
        )
    }

    setInput(event) {
        this.setState( {subtask: {description: event.target.value, status: this.props.status, id: this.props.subtask_id}});
    }

    updateSubtask() {
        this.setState({isEditing: false});
        const url = `/api/v1/tasks/${this.props.task_id}/sub_tasks/${this.props.subtask_id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { description, status } = this.state.subtask;
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

    renderEditView() {
        return (
            <li className="list-group-item d-flex align-content-center">
                <input className="form-check-input me-2" type="checkbox" value=""
                       checked={this.props.status !== "incomplete"} onChange={() => this.props.onChange()}/>
                <input
                    type="text"
                    name="description"
                    id= "description"
                    className="form-control"
                    defaultValue={this.state.subtask.description}
                    onChange={this.setInput}>
                </input>
                <button type="button" className="btn btn-outline-secondary me-2"
                        onClick={() => this.updateSubtask()}>
                    <i className="bi-save"> </i>
                </button>
                <button type="button" className="btn btn-outline-danger"
                        onClick={() => this.setState({isEditing: false})}>
                    <i className="bi-trash-fill"> </i>
                </button>

            </li>
        )
    }

    render() {
        return (
            this.state.isEditing ? this.renderEditView() : this.renderDefaultView()
        );
    }
}

export default SubTask;