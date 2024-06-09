# ChatGPT Playlist Creator

This is a simple proof of concept that takes a set of user interests and uses ChatGPT to generate a playlist designed to match the user's tastes while also expanding their horizons a bit.

This requires a valid OpenAI API key in a .env file as `VITE_API_KEY`.

You can add models by adding them to the `gptModels` array in `src/utils/constants.js`.

## Setup

Create your .env file with your API key:
```
    VITE_API_KEY=[your key]
```

To install the dependencies, run:
```
    npm install
```

To start the app, run:
```
    npm run dev
```

## Dependencies

- [OpenAI](https://openai.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Bootstrap](https://react-bootstrap.netlify.app/)
