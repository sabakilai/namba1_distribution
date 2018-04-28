import React from 'react';
import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase'
import '../components/firebaseui.css'
import { Alert } from 'react-bootstrap';


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        var config = {
            apiKey: "AIzaSyDPI5YKDWcbK4DX_WlUH250kwZJJ2QLLIY",
            authDomain: "nambaonedev3.firebaseapp.com",
            databaseURL: "https://nambaonedev3.firebaseio.com",
            projectId: "nambaonedev3",
            storageBucket: "nambaonedev3.appspot.com",
            messagingSenderId: "445999386944"
        };
        firebase.initializeApp(config);

    }
	componentDidMount() {
		firebase.auth().onAuthStateChanged(authUser => {
			if (authUser) {
				window.location = '/'
			} 
		});
	}

    render() {
        let errorMessage;
        if (this.errorId) errorMessage = (<Alert bsStyle="warning"><strong>Вы не Закир!</strong> Войдите в систему еще раз</Alert>)
        var uiConfig = {
            signInSuccessUrl: '/',
            signInOptions: [
                {
                  provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                  recaptchaParameters: {
                    type: 'image', // 'audio'
                    size: 'normal', // 'invisible' or 'compact'
                    badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                  },
                  defaultCountry: 'KG', 
                  defaultNationalNumber: '772662836',
                  loginHint: '+11234567890'
                }
              ],
            // Terms of service url.
            tosUrl: '/'
          };

        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
          ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        ui.start('#firebaseui-auth-container', uiConfig);
        return (
            <div className="container">
            {errorMessage}
            <div id="firebaseui-auth-container"></div>
            </div>
        )
    }
}

export default LoginForm;