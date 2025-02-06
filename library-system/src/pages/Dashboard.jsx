export default function Dashboard() {
    return (
      <div>
        <h2>System overview</h2>
        <div style={{ 
          marginTop: 20,
          padding: 24,
          background: '#fff',
          borderRadius: 8
        }}>
          <p>Welcome to the Library Management System</p >
          <p>Current statistics:</p >
          <ul>
            <li>Total book collection:--</li>
            <li>Registered Users: --</li>
            <li>Borrowing:--</li>
          </ul>
        </div>
      </div>
    )
  }