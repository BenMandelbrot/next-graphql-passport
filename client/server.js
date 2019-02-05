const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // .com/user/username
    server.get('/user/:username', (req, res) => {
      const mergedQuery = Object.assign({}, req.query, req.params);
      return app.render(req, res, '/user', mergedQuery);
    });

    // THIS IS THE DEFAULT ROUTE, DON'T EDIT THIS
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on port ${port}...`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
