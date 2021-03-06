import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import TaskList from "../components/TaskList";
import Task from "../components/Task";
import NewTask  from "../components/NewTask";

export default (
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/tasks" exact component={TaskList}/>
            <Route path="/task/:id" exact component={Task} />
            <Route path="/task" exact component={NewTask} />
        </Switch>
    </Router>
);