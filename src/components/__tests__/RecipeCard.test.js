import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../RecipeCard';
import '@testing-library/jest-dom'; 

global.fetch = jest.fn();

describe('RecipeCard Component', () => {
  const mockProps = {
    id: '123',
    title: 'Test Recipe',
    image: 'test.jpg',
    description: 'A test recipe description',
    cookingTime: 30,
    servings: 4,
    reviews: []
  };

  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  test('renders recipe card with correct information', () => {
    render(
      <BrowserRouter>
        <RecipeCard {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByAltText(mockProps.title)).toHaveAttribute('src', mockProps.image);
    expect(screen.getByText(`${mockProps.cookingTime} min`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProps.servings} servings`)).toBeInTheDocument();
  });

  test('like button requires authentication', async () => {
    render(
      <BrowserRouter>
        <RecipeCard {...mockProps} />
      </BrowserRouter>
    );

    const likeButton = screen.getByTestId('like-button');
    window.alert = jest.fn();

    await fireEvent.click(likeButton);

    expect(window.alert).toHaveBeenCalledWith('Please log in to like recipes');
  });
});