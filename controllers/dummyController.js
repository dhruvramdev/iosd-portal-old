let dummyController = {
  sayHello: (req, res) => {
    res.json({
      message: 'Hello world!'
    });
  },

  privateMessage: (req, res) => {
    res.json({
      message: 'This information is private'
    });
  }
};

export default dummyController;
