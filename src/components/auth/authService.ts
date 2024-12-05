// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import config from './config.json';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

export const signIn = async (
  username: string,
  password: string,
  newPassword?: string,
): Promise<{
  payload?: {
    jwt?: string;
    [key: string]: string | undefined;
  };
  err?: 'reset_password_required' | 'new_password_required' | any;
}> =>
  new Promise((resolve) => {
    const cognitoUserPool = new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: cognitoUserPool,
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        cognitoUser.getUserAttributes((err, attrs = []) => {
          const payload = attrs.reduce(
            (acc, attr) => {
              return {
                ...acc,
                [attr.Name]: attr.Value,
              };
            },
            {} as { [key: string]: string },
          );
          payload.jwt = result.getIdToken().getJwtToken();
          resolve({ payload });
        });
      },
      onFailure: (err) => {
        // Need to handle reset password
        if (
          err.message === 'Password reset required for the user' &&
          err.statusCode === 400
        ) {
          resolve({ err: 'reset_password_required' });
        } else {
          resolve({ err });
        }
      },
      newPasswordRequired: (userAttributes) => {
        if (newPassword) {
          delete userAttributes.email;
          delete userAttributes.email_verified;
          cognitoUser.completeNewPasswordChallenge(
            newPassword,
            userAttributes,
            {
              onSuccess: (res) => {
                cognitoUser.getUserAttributes((err, attrs = []) => {
                  const payload = attrs.reduce(
                    (acc, attr) => {
                      return {
                        ...acc,
                        [attr.Name]: attr.Value,
                      };
                    },
                    {} as Record<string, string>,
                  );
                  payload.jwt = res.getIdToken().getJwtToken();
                  resolve({ payload });
                });
              },
              onFailure: (err) => {
                console.log('Failure because', err);
                resolve({ err });
              },
            },
          );
        } else {
          const nprResponse = { err: 'new_password_required' };
          resolve(nprResponse);
        }
      },
    });

    // if (AuthenticationResult) {
    //   sessionStorage.setItem('idToken', AuthenticationResult.IdToken || '');
    //   sessionStorage.setItem(
    //     'accessToken',
    //     AuthenticationResult.AccessToken || '',
    //   );
    //   sessionStorage.setItem(
    //     'refreshToken',
    //     AuthenticationResult.RefreshToken || '',
    //   );
    //   return authResponse;
    // }
  });
