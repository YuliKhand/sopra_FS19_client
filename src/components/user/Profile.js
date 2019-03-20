import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import Player from "../../views/Player";

//not ready
const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 400px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ProfileContainer = styled.div`
  display: block;
  justify-content: left;
`;

const ProfileString = styled.div`
   display:block;
   color: white;
   margin-bottom: 10px;
   font-weight:700;  
`;

const ProfileLabel = styled.div`
   text-transform: uppercase;
   margin-right: 15px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Profile extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            user: new User( {"username" : null, "birthday": null, "status": null, "timestamp": null} )
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
     */

    getBack(){
        this.props.history.push("/game");
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {
        var username = localStorage.getItem("chosenUser");
        fetch(`${getDomain()}/users/` + username, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(returnedUser => {
                // delays continuous execution of an async operation for 0.8 seconds.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                this.setState({ "user" : new User(returnedUser)});
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });

    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <ProfileContainer>
                            <ProfileString>
                                <ProfileLabel>Username: </ProfileLabel>{this.state.user.username}
                            </ProfileString>
                            <ProfileString>
                                <ProfileLabel>Online status: </ProfileLabel>{this.state.user.status}
                            </ProfileString>
                            <ProfileString>
                                <ProfileLabel>Creation date: </ProfileLabel>{this.state.user.timestamp}
                            </ProfileString>
                            <ProfileString>
                                <ProfileLabel>Birthday date: </ProfileLabel>{this.state.user.birthday}
                            </ProfileString>
                        </ProfileContainer>
                        <ButtonContainer>
                            <Button
                                //disables button if username or name are empty
                                width="50%"
                                onClick={() => {
                                    this.getBack();
                                }}
                            >
                                Back
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Profile);
