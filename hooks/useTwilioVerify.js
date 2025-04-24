// hooks/useTwilioVerify.js
import axios from 'axios';

export const sendCode = async (phoneOrEmail, channel) => {
  try {
    const response = await axios.post('/api/send-verification', {
      to: phoneOrEmail,
      channel,
    });

    if (response.data.status === 'pending') {
      console.log('Verification code sent!');
    }
  } catch (err) {
    console.error(err);
  }
};

export const verifyCode = async (phoneOrEmail, userEnteredCode) => {
  try {
    const response = await axios.post('/api/check-verification', {
      to: phoneOrEmail,
      code: userEnteredCode,
    });

    if (response.data.verified) {
      console.log('Verification successful!');
      // proceed with login
    } else {
      console.log('Verification failed.');
    }
  } catch (err) {
    console.error(err);
  }
};