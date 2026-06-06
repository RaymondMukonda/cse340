import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

// Show registration form
const showUserRegistrationForm = (req, res) => {
  res.render('register', { title: 'Register', messages: req.flash() });
};

// Process registration form
const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userId = await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/');
  } catch (error) {
    console.error('Error registering user:', error);
    req.flash('error', 'An error occurred during registration. Please try again.');
    res.redirect('/register');
  }
};

// Show login form
const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login', messages: req.flash() });
};

// Process login form
const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);

    if (user) {
      // Store user info in session (now includes role_name)
      req.session.user = user;
      req.flash('success', 'Login successful!');

      if (res.locals.NODE_ENV === 'development') {
        console.log('User logged in:', user);
      }

      // Redirect to dashboard instead of home
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
};

// Process logout
const processLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      req.flash('error', 'Error logging out. Please try again.');
      return res.redirect('/');
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
  });
};

// Middleware to protect routes (login required)
const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
  }
  next();
};

// Middleware factory to require specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
      req.flash('error', 'You do not have permission to access this page.');
      return res.redirect('/');
    }

    next();
  };
};

// Show dashboard
const showDashboard = (req, res) => {
  const user = req.session.user;
  res.render('dashboard', {
    title: 'Dashboard',
    name: user.name,
    email: user.email
  });
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard
};
