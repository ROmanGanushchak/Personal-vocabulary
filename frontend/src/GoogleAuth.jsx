import React from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
  // const responseGoogle = async (response) => {
  //   const idToken = response.tokenId;

  //   try {
  //       const res = await fetch('http://127.0.0.1:8000/auth/social/google/login/', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ token: idToken }),
  //       });

  //       if (res.ok) {
  //           console.log('Successfully logged in with Google.');
  //       } else {
  //           console.error('Failed to log in with Google:', res.statusText);
  //       }
  //   } catch (error) {
  //       console.error('Error logging in with Google:', error);
  //   }
  // };

  // const logoutGoogle = () => {
  //   console.log('Logout button clicked');
  // };

  // return (
  //   <GoogleOAuthProvider clientId="765424187599-gbrm5b8s3blv83ks8dj7ijdon0q389rc.apps.googleusercontent.com">
  //     <GoogleLogin
  //       // clientId={clientId}
  //       // buttonText="Login with Google"
  //       onSuccess={responseGoogle}
  //       onError={() => {it 
  //         console.log('Login Failed');
  //       }}
  //       // isSignedIn={false}
  //     />

  //     {/* <GoogleLogout
  //       // clientId={clientId}
  //       buttonText="Logout"
  //       onLogoutSuccess={logoutGoogle}
  //     /> */}
  //   </GoogleOAuthProvider>
  // );
};

export default GoogleAuth;