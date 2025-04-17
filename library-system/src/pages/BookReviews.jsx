// src/pages/BookReviews.jsx
import { useState, useEffect } from 'react';
import { 
  Card, 
  Rate, 
  List, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Tag,
  Divider,
  Statistic,
  Row,
  Col,
  Spin,
  message,
  Empty
} from 'antd';
import { UserOutlined, BookOutlined, StarFilled, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function BookReviews() {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userId, setUserId] = useState(1); // Should come from authentication in a real app

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Please enter a book title');
      return;
    }

    try {
      setSearchLoading(true);
      
      // Search books with keyword as defined in API
      const booksResponse = await axios.get('http://localhost:3000/books', { 
        params: { search: searchQuery } 
      });
      
      // Check if any books were found
      if (!Array.isArray(booksResponse.data) || booksResponse.data.length === 0) {
        message.info('No books found matching your search');
        setBook(null);
        setReviews([]);
        return;
      }
      
      // Get the first matching book
      const targetBook = booksResponse.data[0];
      setBook(targetBook);
      
      // Get reviews for this book according to API
      const reviewsResponse = await axios.get('http://localhost:3000/reviews', {
        params: { bookId: targetBook.id }
      });
      
      // Set the reviews if any
      if (Array.isArray(reviewsResponse.data)) {
        setReviews(reviewsResponse.data);
      } else {
        setReviews([]);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      
      // Handle different errors based on API documentation
      if (error.response?.status === 400) {
        message.error('Invalid search query');
      } else if (error.response?.status === 500) {
        message.error('Server error. Please try again later.');
      } else {
        message.error('Failed to search for books');
      }
      
      setBook(null);
      setReviews([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!book) return;

    try {
      setLoading(true);
      
      // Create review request according to API model
      const reviewData = {
        bookId: book.id,
        userId: userId,
        rating: values.rating,
        comment: values.content
      };
      
      // Submit the review
      await axios.post('http://localhost:3000/reviews', reviewData);
      
      // Refresh reviews
      const updatedReviews = await axios.get('http://localhost:3000/reviews', {
        params: { bookId: book.id }
      });
      
      if (Array.isArray(updatedReviews.data)) {
        setReviews(updatedReviews.data);
      }
      
      // Reset form and show success message
      form.resetFields();
      message.success('Review submitted successfully!');
    } catch (error) {
      console.error('Review submission error:', error);
      
      // Handle different errors based on API documentation
      if (error.response?.status === 400) {
        message.error('Invalid review data');
      } else if (error.response?.status === 403) {
        message.error('You can only review books you have borrowed');
      } else if (error.response?.status === 409) {
        message.error('You have already reviewed this book');
      } else {
        message.error('Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  // Calculate average rating for a book
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Search area */}
      <Card 
        title={
          <div style={{ display: 'flex', gap: 16 }}>
            <Input
              placeholder="Search book by title..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 400 }}
              onPressEnter={handleSearch}
            />
            <Button 
              type="primary" 
              loading={searchLoading}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        }
        bordered={false}
      />

      {/* Book information area */}
      {book ? (
        <>
          <Card>
            <Row gutter={24}>
              <Col xs={24} md={8}>
                {/* Placeholder for book cover */}
                <div 
                  style={{ 
                    width: '100%', 
                    height: 300,
                    background: '#f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <BookOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                </div>
              </Col>
              <Col xs={24} md={16}>
                <h1 style={{ fontSize: 28, marginBottom: 8 }}>{book.title}</h1>
                <div style={{ marginBottom: 16 }}>
                  <Tag icon={<UserOutlined />} color="blue">
                    Author: {book.author}
                  </Tag>
                  <Tag icon={<BookOutlined />} color="geekblue">
                    ISBN: {book.isbn || 'N/A'}
                  </Tag>
                  <Tag color={book.available_copies > 0 ? 'green' : 'red'}>
                    Available: {book.available_copies}
                  </Tag>
                </div>
                <Row gutter={16}>
                  <Col>
                    <Statistic 
                      title="Average Rating" 
                      value={calculateAverageRating(reviews)} 
                      precision={1}
                      prefix={<StarFilled style={{ color: '#fadb14' }} />}
                      suffix={`(${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`}
                    />
                  </Col>
                  {book.genre && (
                    <Col>
                      <Statistic 
                        title="Genre" 
                        value={book.genre}
                      />
                    </Col>
                  )}
                  {book.language && (
                    <Col>
                      <Statistic 
                        title="Language" 
                        value={book.language}
                      />
                    </Col>
                  )}
                </Row>
                <Divider />
                <h3>Book Information</h3>
                <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                  {book.title} by {book.author} (ISBN: {book.isbn || 'N/A'}).
                  {book.shelf_number && ` Located at shelf number: ${book.shelf_number}.`}
                  {` Currently ${book.available_copies} ${book.available_copies === 1 ? 'copy' : 'copies'} available for borrowing.`}
                </p>
              </Col>
            </Row>
          </Card>

          <Divider />

          {/* Review submission form */}
          <Card title="Write a Review">
            <Form form={form} onFinish={handleSubmitReview} layout="vertical">
              <Form.Item 
                name="rating" 
                label="Rating" 
                rules={[{ required: true, message: 'Please give a rating' }]}
              >
                <Rate allowHalf />
              </Form.Item>
              
              <Form.Item
                name="content"
                label="Review Content"
                rules={[
                  { required: true, message: 'Please write your review' }, 
                  { max: 500, message: 'Review cannot exceed 500 characters' }
                ]}
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Share your thoughts about this book..."
                  showCount 
                  maxLength={500}
                />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Review
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Reviews list */}
          <Card title={`Reviews (${reviews.length})`}>
            {reviews.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={reviews}
                renderItem={review => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <>
                          <span style={{ fontWeight: 500 }}>
                            {review.user?.username || 'Anonymous'}
                          </span>
                          <Rate 
                            disabled 
                            value={review.rating} 
                            style={{ fontSize: 14, marginLeft: 16 }}
                          />
                        </>
                      }
                      description={
                        <>
                          <p>{review.comment}</p>
                          <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                            {formatDate(review.createdAt)}
                          </span>
                        </>
                      }
                    />
                  </List.Item>
                )}
                pagination={{
                  pageSize: 5,
                  hideOnSinglePage: true
                }}
              />
            ) : (
              <Empty description="No reviews yet. Be the first to share your thoughts!" />
            )}
          </Card>
        </>
      ) : (
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ color: 'rgba(0,0,0,0.45)', padding: 40 }}>
            {searchLoading ? (
              <Spin size="large" />
            ) : (
              'Search for a book to view details and reviews'
            )}
          </div>
        </Card>
      )}
    </div>
  );
}