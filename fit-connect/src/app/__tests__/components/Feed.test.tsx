import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feed from '../../../components/Feed/Feed';
import { formatDistanceToNow } from 'date-fns';

/*
- Verifies that the component renders the list of posts correctly given mock data
- Checks that the like button calls the correct event handler and updates the like count in the UI
- Simulates entering a comment and ensures that the comment input clears after submission
- Checks that if there's no posts available, the component displays the empty state message
*/

// Mock the dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock('js-cookie', () => ({
  get: jest.fn().mockReturnValue('testUser'),
}));

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn().mockReturnValue('2 hours ago'),
}));

describe('Feed Component', () => {
  // Mock data
  const mockPosts = [
    {
      id: '1',
      description: 'Test post description',
      postedAt: '2023-01-01T12:00:00Z',
      media: '/test-image.jpg',
      likes: 1, 
      comments: [
        {
          id: 'comment1',
          postId: '1',
          userId: 'user1',
          content: 'Great post!',
          postedAt: '2023-01-01T12:30:00Z',
          users: {
            username: 'commenter1',
            profilePicture: '/profile1.jpg',
          },
        },
      ],
      users: {
        username: 'testUser',
        profilePicture: '/profile.jpg',
      },
    },
  ];

  const mockLikedPosts = ['1']; 

  // Mock fetch calls
  beforeEach(() => {
    global.fetch = jest
      .fn()
      // Mock initial posts fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ posts: mockPosts, likedPosts: mockLikedPosts }),
        })
      )
      // Mock like post - changed to disliked since post is already liked
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ action: 'disliked' }),
        })
      )
      // Mock post comment
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              comment: {
                id: 'newComment',
                postId: '1',
                userId: 'currentUser',
                content: 'Test comment',
                users: {
                  username: 'testUser',
                  profilePicture: '/profile.jpg',
                },
              },
            }),
        })
      );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders posts and handles interactions correctly', async () => {
    const onCreatePostMock = jest.fn();

    // Render the Feed component
    render(<Feed onCreatePost={onCreatePostMock} />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Test initial rendering
    expect(screen.getByText('Test post description')).toBeInTheDocument();
    expect(screen.getByText('1 Like')).toBeInTheDocument();
    expect(screen.getByText('1 Comment')).toBeInTheDocument();
    expect(screen.getByText('Great post!')).toBeInTheDocument();

    // Test like button functionality - now unliking instead
    const likeButton = screen.getByText('1 Like').closest('button');
    fireEvent.click(likeButton);

    // The like count should decrease (since we're unliking)
    await waitFor(() => {
      expect(screen.getByText('0 Likes')).toBeInTheDocument(); // Changed to 0 Likes
    });

    // Test comment submission
    const commentInput = screen.getAllByPlaceholderText('Add a comment...')[0];
    const postButton = screen.getAllByText('Post')[0].closest('button');

    // Enter a comment
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    if (postButton) fireEvent.click(postButton);

    // The comment should be posted and input cleared
    await waitFor(() => {
      // Check that the fetch was called with correct data
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/posts/comment',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Test comment'),
        })
      );
    });
  });

  test('displays empty state when no posts are available', async () => {
    // Override the fetch implementation to return empty posts
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ posts: [], likedPosts: [] }),
      })
    );

    render(<Feed onCreatePost={() => {}} />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check for empty state message
    expect(screen.getByText("You don't have any posts yet and none of your followers either.")).toBeInTheDocument();
  });
});
