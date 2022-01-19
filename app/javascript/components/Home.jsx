import React from "react";
import { Link } from "react-router-dom";

export default () => (
    <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
            <div className="container secondary-color">
                <h1 className="display-4">Task Manager</h1>
                <p className="lead">
                    An efficient tool to manage your tasks.
                </p>
                <hr className="my-4" />
                <Link
                    to="/tasks"
                    className="btn btn-lg custom-button"
                    role="button"
                >
                    View Task List
                </Link>
            </div>
        </div>
    </div>
);