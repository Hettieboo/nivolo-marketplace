import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Nivolo Refind in header', () => {
  render(<App />);
  const headingElements = screen.getAllByText(/Nivolo Refind/i);
  expect(headingElements.length).toBeGreaterThan(0);
  expect(headingElements[0]).toBeInTheDocument();
});

test('renders brand slogan', () => {
  render(<App />);
  const sloganElements = screen.getAllByText(/Sell Fast. Buy Smart. Find More. Pay Less./i);
  expect(sloganElements.length).toBeGreaterThan(0);
  expect(sloganElements[0]).toBeInTheDocument();
});

test('renders welcome message on home page', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Nivolo Refind/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders authentication buttons when not authenticated', () => {
  render(<App />);
  const signInButtons = screen.getAllByText(/Sign In/i);
  const signUpButtons = screen.getAllByText(/Sign Up/i);
  expect(signInButtons.length).toBeGreaterThan(0);
  expect(signUpButtons.length).toBeGreaterThan(0);
});