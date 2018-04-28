import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

const firebase = window.firebase;
const supportUid = 'lLblNoQ4AuesPvrgEoZ2e3tT2LD3';

class Main extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        this.state = {
            value: '',
            authUser:null
        };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(authUser => {
            if (authUser) {
                this.setState(() => ({ authUser }))
            } else {
                this.setState(() => ({ authUser: null }));
                window.location='/login'
            }

        });
    }

    checkLogin() {
        setTimeout(() => {
            if(!this.props.authUser ) {
                //window.location = '/login';
                console.log('window.location')
            } 
        }, 2000);
    }
  
    handleChange(e) {
      this.setState({ value: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        let checkDialogPromises = []
        this.getUsers().then(users => {
            users.forEach(user => {
                checkDialogPromises.push(this.checkDialog(user.id))
            });

            Promise.all(checkDialogPromises).then(chatKeys => {
                chatKeys.forEach(chatKey => {
                    this.sendMessage(chatKey,this.state.value)
                })
            })
        })
        
    }

    createChat(anotherUid) {
        return new Promise(resolve => {
            const chatsRef = firebase.database().ref("/messenger/chats/");
            const newChatRef = chatsRef.push();
            const members = {}
            members[supportUid] = 'active';
            members[anotherUid] = 'inactive';
            const chat = {
                createdAt:firebase.database.ServerValue.TIMESTAMP,
                last_updated:supportUid,
                members,
                type:1
            }
            newChatRef.set(chat)
            resolve(newChatRef.key)
        })
    }

    checkDialog(anotherUid) {
        return new Promise(resolve => {
            const dialogRef = firebase.database().ref('/messenger/dialogs/');
            const supportDialogRef = dialogRef.child(supportUid);

            supportDialogRef.once('value', supportSnap => {
                if(supportSnap.exists()){
                    supportDialogRef.child(anotherUid).once('value', anotherUidSnap => {
                        if (anotherUidSnap.exists()) return resolve(anotherUidSnap.val()) 

                        this.createChat(anotherUid).then(chatKey => {
                            let dialogInstance = {};
                            dialogInstance[anotherUid] = chatKey;
                            supportDialogRef.update(dialogInstance)
                            resolve(chatKey) ;
                        })
                    })
                }  
            });
        })
    }

    getUsers(){
        return new Promise (resolve => {
            const profileRef = firebase.database().ref('/profiles/')
            profileRef.once('value', snap => {
                const profiles = snap.val(); 
                let realUsers = [];
                for (var key in profiles) {
                    if (!profiles[key].hasOwnProperty('type') && !profiles[key].hasOwnProperty('deleted') && profiles[key].hasOwnProperty('id')) {
                        realUsers.push(profiles[key])
                    }
                }
                resolve(realUsers);
            })
        })
    }

    sendMessage(chatId, content) {
        let messageRef = firebase.database().ref("/messenger/messages/"+ chatId);
        let newMessageRef = messageRef.push();
        let message = {
          authorId:'',
          content:content,
          contentType:'text',
          createdAt:firebase.database.ServerValue.TIMESTAMP,
          id:newMessageRef.key,
          senderId:supportUid,
          status:1
        }
        newMessageRef.set(message)
    }
  
    render() {
        return (
            <div className="body">
                <div className="container">
                <Row>
                    <Col md={6}>
                    <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Message</ControlLabel>
                        <FormControl 
                            componentClass="textarea" 
                            value={this.state.value}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                    </form>
                    </Col>
                    
                </Row>
                </div>
            </div>
            
        );
    }
  }
  
  export default Main;