import React from 'react';
import * as axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { FormControl, Container, Modal, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles.css';
import './index.css';
import TextEditor from '../TextEditor';
import { authorizationHeader } from '../../actions';
import { backurl, project_roles } from '../../properties';
import DropdownItem from 'react-bootstrap/DropdownItem';

class CreateProject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            description: null,
            users: [{}],
            team: [],
            user: null,
            role: project_roles[0],
            show: false,

            editor: {
                placeholder: 'Enter description...'
            }
        };

        this.saveDescription = this.saveDescription.bind(this);

        this.onNameChange = this.onNameChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onAddUser = this.onAddUser.bind(this);
        this.onSubmitProject = this.onSubmitProject.bind(this);

        this.handleCancel = this.handleCancel.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }


    saveDescription(description) {
        if (description.length >= 3000)
            alert('no way! too long!');
        else
            this.setState({ description: description });
    }

    handleCancel(event) {
        event.preventDefault();
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow(event) {
        event.preventDefault();

        this.setState({ show: true });
    }


    onNameChange(event) {
        const newName = event.target.value;

        this.setState({ name: newName });
    }

    componentDidMount() {
        var header = authorizationHeader();
        axios.get(backurl + '/users/', header)
            .then(res => {
                const users = res.data;
                this.setState({ users: users, user: users[0] });
            })
    };

    onSubmitProject(event) {
        event.preventDefault();

        const project = {
            name: this.state.name,
            description: this.state.description
        };

        console.log('DESCRIPTION: ', JSON.stringify(project.description));

        if (!this.state.name) {
            alert('Create project: name your project!');
            this.handleClose();
            return;
        }

        if (!this.state.description) {
            alert('Create project: describe your project!');
            this.handleClose();
            return;
        }

        let header = authorizationHeader();

        axios(backurl + '/projects/', {
            method: 'POST',
            headers: header.headers,
            data: {
                project: project,
                team: this.state.team
            }
        })
            .then(res => {
                console.log(res.status);
                console.log(res.data);
                alert('Success!');
            })
            .catch(error => {
                console.log(error.response);
                alert(JSON.stringify(error.response.status))
            });

        this.handleClose();
    }

    onSelectChange(event) {
        const eventName = event.target.name;

        switch (eventName) {
            case 'user':
                var user = JSON.parse(event.target.value);
                this.setState({ user: user })
                break;

            case 'role':
                var role = JSON.parse(event.target.value);
                this.setState({ role: role })
                break;

            default:
                break;
        }

        console.log('STATE: ', JSON.stringify(this.state))
    }

    onAddUser(event) {
        event.preventDefault();

        if (!this.state.user || !this.state.role) {
            alert('Employee was not selected!');
            return;
        }
        

        var curUser = {user: this.state.user, role: this.state.role};

        var alreadySelected = this.state.team.some(e => e.user.id === curUser.user.id);

        alreadySelected ? alert(JSON.stringify(curUser.user.name) + ' has been already added')
            : this.setState({ team: [...this.state.team, curUser] });
    }

    onDeleteClick = (userToDelete) => {
        const team = this.state.team.filter(u => u.user.id !== userToDelete.id);

        console.log('Team: ', JSON.stringify(team));

        this.setState({ team: team }, () =>
            console.log('delete com.netcracker.edu.tms.user: ', userToDelete.email));
    };


    render() {
        return <div>
            {/* SAVE PROJECT DIALOG */}
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Save new project</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to save new project?</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={this.handleClose}>
                        Cancel
                        </Button>
                    <Button variant='primary' onClick={this.onSubmitProject}>
                        Save
                        </Button>
                </Modal.Footer>
            </Modal>

            <Container>
                <div id='wrapper'>
                    <div className='d-flex flex-row'>
                        <div className='py-2  flex-grow-1'>
                            <h2>Create project</h2>
                        </div>
                        <Button className='d-flex mr-4 justify-content-end align-self-end mt-2' variant='danger' onClick={this.handleCancel}>
                            Cancel
                            </Button>
                        <Button
                            className='d-flex mr-4 justify-content-end align-self-end mt-2'
                            variant='success'
                            onClick={this.handleShow}>
                            Create project
                            </Button>

                    </div>
                    <hr />

                    <form>
                        <div className='d-flex flex-row mx-1'>
                            <div className=' d-flex mr-4 justify-content-end align-self-end mt-2'>
                                <h4> Name: <input type='text' value={this.state.name} className='form-control'
                                    onChange={this.onNameChange} />
                                </h4>
                            </div>
                        </div>
                    </form>

                    <br />
                    <h4>Description:</h4>
                    <TextEditor
                        placeholder={this.state.editor.placeholder}
                        onSave={this.saveDescription}
                        maxLength={300}
                    />
                    <br />

                    <br />
                    <div className=' d-flex flex-row align-items-center'>
                        <h4>Project team:</h4>
                    </div>
                    <br />

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>User </InputGroup.Text>
                        </InputGroup.Prepend>
                        <select name='user' className='form-control'
                            onChange={this.onSelectChange}>
                            {this.state.users.map(user =>
                                <option value={JSON.stringify(user)} key={user.email}>
                                    {user.name}
                                </option>)}
                            )}
                                </select>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Role </InputGroup.Text>
                        </InputGroup.Prepend>
                        <select defaultValue={''} name='role' className='form-control'
                            onChange={this.onSelectChange}>

                            {project_roles.map(role =>
                                <option value={JSON.stringify(role)} key={role.name}>
                                    {role.name}
                                </option>)}
                            )}
                                </select>
                                <Button variant='dark' onClick={this.onAddUser}>Add</Button>
                    </InputGroup>
                    <hr/>

                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-bordered table-hover table-sm  '>
                            <thead className='thead-dark'>
                                <tr>
                                    <th style={{ 'width': '20%' }} scope='col'>Full Name</th>
                                    <th style={{ 'width': '10%' }} scope='col'>Email</th>
                                    <th style={{ 'width': '10%' }} scope='col'>Role</th>
                                    <th style={{ 'width': '4%' }} scope='col'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.team.map(({user, role}) =>
                                    <tr key={user.email}>
                                        <td> {user.name}</td>
                                        <td> {user.email}</td>
                                        <td> {role.name}</td>
                                        <th scope='row'>
                                            <Button variant='dark' onClick={this.onDeleteClick.bind(this, user)}>
                                                X
                                                </Button>
                                        </th>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container >
            <br />
            <br />
            <br />
        </div>
    }
}

export default CreateProject;

class User {
    constructor(name, email, role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }
}