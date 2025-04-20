/*import { useState } from 'react';
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
  Empty,
  Alert
} from 'antd';
import { UserOutlined, BookOutlined, StarFilled, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function BookReviews() {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  
  // 使用认证上下文获取用户信息
  const { user, isAuthenticated } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Please enter a book title');
      return;
    }

    try {
      setSearchLoading(true);
      
      // 搜索图书
      const bookRes = await fetch(`/api/books?title=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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

      // 获取图书详情
      const targetBook = foundBooks[0];
      const detailRes = await fetch(`/api/books/${targetBook.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const bookDetails = await detailRes.json();
      setBook(bookDetails);

      // 获取书评 - 使用更新后的后端路由模式
      await fetchBookReviews(targetBook.id);
      
    } catch (error) {
      console.error('Search failed:', error);
      message.error('Search failed, please try again');
      setBook(null);
      setReviews([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 单独的获取书评函数
  const fetchBookReviews = async (bookId) => {
    try {
      // 更新后的端点以匹配后端路由
      const reviewRes = await fetch(`/api/reviews/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!reviewRes.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const reviewData = await reviewRes.json();
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      message.error('Failed to load reviews');
      setReviews([]);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!book) return;
    
    // 检查用户是否已登录
    if (!isAuthenticated()) {
      message.error('Please log in to submit a review');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // 根据后端预期的结构准备书评数据
      const reviewData = {
        userId: user.id,  // 使用当前登录用户的ID
        bookId: book.id,
        rating: values.rating,
        comment: values.comment
      };
      
      console.log('Submitting review:', reviewData);
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to submit review';
        
        if (response.status === 403) {
          throw new Error('You can only review books you have borrowed');
        } else if (response.status === 409) {
          throw new Error('You have already reviewed this book');
        } else if (response.status === 400) {
          throw new Error(errorMessage || 'Invalid review data');
        } else {
          throw new Error(errorMessage);
        }
      }
      
      // 提交成功后刷新书评列表
      await fetchBookReviews(book.id);
      
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

  // 认证状态检查
  if (!isAuthenticated()) {
    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Alert
          message="Authentication Required"
          description={
            <>
              Please <a onClick={() => navigate('/login')}>log in</a> to access all book review features.
              You can still search and view books as a guest.
            </>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        {/* 保留搜索功能，即使用户未登录 */}
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
        
        {/* 显示搜索结果，但禁用评论功能 */}
        {/* 这里可以复用下面的显示逻辑，但去掉写评论的卡片 */}
      </div>
    );
  }

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
                <Rate allowHalf={false} count={5} />
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
                        <span style={{ marginRight: 16 }}>{review.username || user.username || `User`}</span>
                        <Rate 
                          disabled 
                          value={review.rating} 
                          style={{ fontSize: 14 }} 
                          allowHalf={false}
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