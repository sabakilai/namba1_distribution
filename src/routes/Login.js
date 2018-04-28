import React from 'react';
import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase'
import '../components/firebaseui.css'
import { Alert } from 'react-bootstrap';


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        var config = {
            apiKey: "AIzaSyAPlRLYfaVydEgEHKGGjkdctpns8kNO7ao",
            authDomain: "nambaoneprod.firebaseapp.com",
            databaseURL: "https://nambaoneprod.firebaseio.com",
            projectId: "nambaoneprod",
            storageBucket: "nambaoneprod.appspot.com",
            messagingSenderId: "440103203913"
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
        var uiConfig = {
            signInSuccessUrl: '/',
            signInOptions: [
                {
                  provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                  recaptchaParameters: {
                    type: 'image',
                    size: 'normal',
                    badge: 'bottomleft'
                  },
                  defaultCountry: 'KG', 
                  defaultNationalNumber: '707371474',
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
            <div id="firebaseui-auth-container"></div>
            </div>
        )
    }
}

export default LoginForm;