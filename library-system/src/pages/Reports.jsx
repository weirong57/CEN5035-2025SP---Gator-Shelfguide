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
import { useState, useEffect } from 'react';
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
      {/* Book Basic Info */}
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

      {/* Review Section */}
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

      {/* Reviews List */}
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