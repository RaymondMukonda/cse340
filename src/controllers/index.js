// No model imports needed for home page

const showHomePage = async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
};

export { showHomePage };
