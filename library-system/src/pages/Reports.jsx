/*export default function Reports() {
    return (
      <div>
        <h2>Reports</h2>
        <div style={{ 
          marginTop: 20,
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          minHeight: 400
        }}>
          <p>The function is under development</p >
        </div>
      </div>
    )
  }*/
/*import { useState, useEffect } from 'react';
import { Comment } from '@ant-design/compatible';  
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
  Col
} from 'antd';
import { UserOutlined, BookOutlined, StarFilled } from '@ant-design/icons';

// Mock data
const mockBook = {
  id: 1,
  title: 'Professional JavaScript for Web Developers',
  author: 'Nicholas C. Zakas',
  isbn: '978-7-115-33091-5',
  cover: 'https://img1.doubanio.com/view/subject/l/public/s8958650.jpg',
  averageRating: 4.2,
  totalRatings: 128,
  description: `This book provides a comprehensive guide to JavaScript core syntax, BOM, DOM, events, Ajax, animations, and more...`,
  borrowHistory: [
    { userId: 1, borrowDate: '2023-07-01', returnDate: '2023-08-01' }
  ],
  reviews: [
    {
      id: 1,
      user: 'Frontend Developer',
      rating: 5,
      content: 'An essential reference book for any JavaScript developer',
      date: '2023-07-15'
    },
    {
      id: 2,
      user: 'Full Stack Engineer',
      rating: 4,
      content: 'Great content though some parts need updates for modern ES6+ features',
      date: '2023-07-20'
    }
  ]
};

export default function BookReport() {
  const [form] = Form.useForm();
  const [book, setBook] = useState(mockBook);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Simulate borrow status check
  useEffect(() => {
    const userHasBorrowed = book.borrowHistory.some(
      record => record.userId === 1 && record.returnDate
    );
    setHasBorrowed(userHasBorrowed);
  }, []);

  // Handle review submission
  const handleSubmit = async (values) => {
    setSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReview = {
      id: Date.now(),
      user: 'Current User',
      rating: values.rating,
      content: values.content,
      date: new Date().toLocaleDateString()
    };

    setBook(prev => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
      totalRatings: prev.totalRatings + 1,
      averageRating: 
        ((prev.averageRating * prev.totalRatings) + values.rating) / 
        (prev.totalRatings + 1)
    }));

    form.resetFields();
    setSubmitting(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            < img 
              src={book.cover} 
              alt="Book Cover" 
              style={{ 
                width: '100%', 
                maxWidth: 300,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Col>
          <Col xs={24} md={16}>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>{book.title}</h1>
            <div style={{ marginBottom: 16 }}>
              <Tag icon={<UserOutlined />} color="blue">
                Author: {book.author}
              </Tag>
              <Tag icon={<BookOutlined />} color="geekblue">
                ISBN: {book.isbn}
              </Tag>
            </div>
            <Row gutter={16}>
              <Col>
                <Statistic 
                  title="Average Rating" 
                  value={book.averageRating} 
                  precision={1}
                  prefix={<StarFilled style={{ color: '#fadb14' }} />}
                />
              </Col>
              <Col>
                <Statistic 
                  title="Total Ratings" 
                  value={book.totalRatings} 
                />
              </Col>
            </Row>
            <Divider />
            <h3>Book Description</h3>
            <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
              {book.description}
            </p >
          </Col>
        </Row>
      </Card>

      <Divider />
      {hasBorrowed ? (
        <Card title="Write a Review" style={{ marginBottom: 24 }}>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item 
              name="rating" 
              label="Rating" 
              rules={[{ required: true, message: 'Please select a rating' }]}
            >
              <Rate allowHalf />
            </Form.Item>
            
            <Form.Item
              name="content"
              label="Review Content"
              rules={[
                { required: true, message: 'Please input your review' },
                { max: 500, message: 'Review cannot exceed 500 characters' }
              ]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Share your reading experience..."
                showCount 
                maxLength={500}
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
              >
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card style={{ marginBottom: 24, background: '#fafafa' }}>
          <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.45)' }}>
            You need to have borrowed this book to leave a review
          </div>
        </Card>
      )}
      <Card title={`All Reviews (${book.reviews.length})`}>
        <List
          itemLayout="vertical"
          dataSource={book.reviews}
          renderItem={item => (
            <Comment
              author={<span style={{ fontWeight: 500 }}>{item.user}</span>}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={
                <div>
                  <Rate 
                    disabled 
                    value={item.rating} 
                    style={{ fontSize: 14, marginBottom: 8 }}
                  />
                  <p style={{ marginBottom: 0 }}>{item.content}</p >
                </div>
              }
              datetime={
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                  {item.date}
                </span>
              }
            />
          )}
        />
      </Card>
    </div>
  );
}
/*
import React from 'react';
import { useState } from 'react';
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
  message 
} from 'antd';
import { UserOutlined, BookOutlined, StarFilled, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

export default function BookReport() {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Please enter a book title');
      return;
    }

    try {
      setSearchLoading(true);
      
      // 第一步：搜索书籍
      const searchRes = await axios.get(`/books?search=${encodeURIComponent(searchQuery)}`);
      if (searchRes.data.length === 0) {
        throw new Error('No books found');
      }

      // 取第一个匹配结果
      const targetBook = searchRes.data[0];
      
      // 第二步：获取书籍详情和评论
      const [bookRes, reviewsRes] = await Promise.all([
        axios.get(`/books/${targetBook.id}`),
        axios.get(`/reviews?bookId=${targetBook.id}`)
      ]);

      // 过滤有效评论
      const validReviews = reviewsRes.data.filter(
        review => review.content?.trim() && review.user?.username
      );

      setBook(bookRes.data);
      setReviews(validReviews);
    } catch (err) {
      message.error(err.response?.data?.message || err.message);
      setBook(null);
      setReviews([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!book) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login to submit review');
        return;
      }

      await axios.post('/reviews', {
        bookId: book.id,
        rating: values.rating,
        comment: values.content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 刷新评论
      const { data } = await axios.get(`/reviews?bookId=${book.id}`);
      setReviews(data.filter(r => r.content?.trim() && r.user?.username));
      form.resetFields();
      message.success('Review submitted!');
    } catch (err) {
      message.error(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
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
      {book ? (
        <>
          <Card>
            <Row gutter={24}>
              <Col xs={24} md={8}>
                < img 
                  src={book.cover} 
                  alt="Book Cover" 
                  style={{ 
                    width: '100%', 
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Col>
              <Col xs={24} md={16}>
                <h1 style={{ fontSize: 28, marginBottom: 8 }}>{book.title}</h1>
                <div style={{ marginBottom: 16 }}>
                  <Tag icon={<UserOutlined />} color="blue">
                    Author: {book.author}
                  </Tag>
                  <Tag icon={<BookOutlined />} color="geekblue">
                    ISBN: {book.isbn}
                  </Tag>
                  <Tag color={book.available_copies > 0 ? 'green' : 'red'}>
                    Available: {book.available_copies}
                  </Tag>
                </div>
                <Row gutter={16}>
                  <Col>
                    <Statistic 
                      title="Average Rating" 
                      value={book.averageRating} 
                      precision={1}
                      prefix={<StarFilled style={{ color: '#fadb14' }} />}
                    />
                  </Col>
                </Row>
                <Divider />
                <h3>Book Description</h3>
                <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                  {book.description || 'No description available'}
                </p >
              </Col>
            </Row>
          </Card>

          <Divider />
          <Card title="Write a Review">
            <Form form={form} onFinish={handleSubmitReview}>
              <Form.Item 
                name="rating" 
                label="Rating" 
                rules={[{ required: true }]}
              >
                <Rate allowHalf />
              </Form.Item>
              
              <Form.Item
                name="content"
                label="Review Content"
                rules={[{ required: true }, { max: 500 }]}
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Share your thoughts..."
                  showCount 
                  maxLength={500}
                />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit Review
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card title={`Reviews (${reviews.length})`}>
            {reviews.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={reviews}
                renderItem={review => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={<>
                        <span style={{ fontWeight: 500 }}>{review.user.username}</span>
                        <Rate 
                          disabled 
                          value={review.rating} 
                          style={{ fontSize: 14, marginLeft: 16 }}
                        />
                      </>}
                      description={
                        <>
                          <p>{review.comment}</p >
                          <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                            {dayjs(review.createdAt).format('MMM D, YYYY HH:mm')}
                          </span>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'rgba(0,0,0,0.45)' }}>
                No reviews yet. Be the first to share your thoughts!
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ color: 'rgba(0,0,0,0.45)', padding: 40 }}>
            {searchLoading ? (
              <Spin size="large" />
            ) : (
              'Search for a book to view details'
            )}
          </div>
        </Card>
      )}
    </div>
  );
}*/
import { useState } from 'react';
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

export default function BookReviews() {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Please enter a book title');
      return;
    }

    try {
      setSearchLoading(true);
      
      // Search books
      const bookRes = await fetch(`/api/books?title=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const bookData = await bookRes.json();
      const foundBooks = Array.isArray(bookData) ? bookData : bookData?.data || [];
      
      if (foundBooks.length === 0) {
        message.info('No books found');
        setBook(null);
        setReviews([]);
        return;
      }

      // Get book details
      const targetBook = foundBooks[0];
      const detailRes = await fetch(`/api/books/${targetBook.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const bookDetails = await detailRes.json();

      // Get reviews
      const reviewRes = await fetch(`/api/reviews?bookId=${targetBook.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const reviewData = await reviewRes.json();
      const bookReviews = Array.isArray(reviewData) ? reviewData : reviewData?.data || [];

      setBook(bookDetails);
      setReviews(bookReviews);
      
    } catch (error) {
      console.error('Search failed:', error);
      message.error('Search failed, please try again');
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
      
      const reviewData = {
        bookId: book.id,
        userId: localStorage.getItem('userId'), // Get actual user ID from auth
        rating: values.rating,
        comment: values.comment
      };
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You can only review borrowed books');
        }
        if (response.status === 409) {
          throw new Error('You have already reviewed this book');
        }
        throw new Error(result.message || 'Submission failed');
      }

      // Update reviews list
      setReviews([{
        ...result, // Assuming backend returns full review object
        username: localStorage.getItem('username') // Add current user's name
      }, ...reviews]);
      
      form.resetFields();
      message.success('Review submitted successfully!');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews?.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card 
        title={
          <div style={{ display: 'flex', gap: 16 }}>
            <Input
              placeholder="Search books by title..."
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

      {book ? (
        <>
          <Card>
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <div style={{ 
                  background: '#f0f2f5',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8
                }}>
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
                    />
                  </Col>
                </Row>
                <Divider />
                <h3>Description</h3>
                <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                  {book.description || 'No description available'}
                </p>
              </Col>
            </Row>
          </Card>

          <Divider />

          <Card title="Write a Review">
            <Form form={form} onFinish={handleSubmitReview} layout="vertical">
              <Form.Item 
                name="rating" 
                label="Rating" 
                rules={[{ required: true, message: 'Please select a rating' }]}
              >
                <Rate allowHalf />
              </Form.Item>
              
              <Form.Item
                name="comment"
                label="Review Content"
                rules={[
                  { required: true, message: 'Please write your review' }, 
                  { max: 500, message: 'Cannot exceed 500 characters' }
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

          <Card title={`Reviews (${reviews.length})`}>
            <List
              itemLayout="vertical"
              dataSource={reviews}
              locale={{ emptyText: <Empty description="No reviews yet" /> }}
              renderItem={review => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 16 }}>{review.username || `User ${review.userId}`}</span>
                        <Rate 
                          disabled 
                          value={review.rating} 
                          style={{ fontSize: 14 }} 
                        />
                      </div>
                    }
                    description={
                      <>
                        <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>
                          {review.comment}
                        </p>
                        <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                          {formatDate(review.createdAt)}
                        </span>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </>
      ) : (
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ color: 'rgba(0,0,0,0.45)', padding: 40 }}>
            {searchLoading ? (
              <Spin size="large" />
            ) : (
              'Search for books to view details and reviews'
            )}
          </div>
        </Card>
      )}
    </div>
  );
}