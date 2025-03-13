import axios from 'axios';

export const useEmail = () => {
  const subscribeEmail = (email: string) => {
    const options = {
      method: 'POST',
      url: 'https://sightquest.ru/api/subscribers/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return {
    subscribeEmail,
  };
};
