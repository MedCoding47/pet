import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUserPlus, 
  faPaw, 
  faPercent,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  // Sample data - replace with actual data in your implementation
  const dashboardData = {
    traffic: { value: 350897, change: 3.48, timeframe: 'since last month' },
    newUsers: { value: 2356, change: -3.48, timeframe: 'since last week' },
    adoptions: { value: 924, change: 1.10, timeframe: 'since yesterday' },
    successRate: { value: '49.65%', change: 12, timeframe: 'since last month' }
  };
  
  return (
    <div>
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-header">
            <p className="card-title">TRAFFIC</p>
            <div className="card-icon icon-red">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
          </div>
          <h3 className="card-value">{dashboardData.traffic.value.toLocaleString()}</h3>
          <div className={`card-stat ${dashboardData.traffic.change > 0 ? 'positive' : 'negative'}`}>
            <FontAwesomeIcon icon={dashboardData.traffic.change > 0 ? faArrowUp : faArrowDown} />
            <span>{Math.abs(dashboardData.traffic.change)}% {dashboardData.traffic.timeframe}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <p className="card-title">NEW USERS</p>
            <div className="card-icon icon-orange">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
          </div>
          <h3 className="card-value">{dashboardData.newUsers.value.toLocaleString()}</h3>
          <div className={`card-stat ${dashboardData.newUsers.change > 0 ? 'positive' : 'negative'}`}>
            <FontAwesomeIcon icon={dashboardData.newUsers.change > 0 ? faArrowUp : faArrowDown} />
            <span>{Math.abs(dashboardData.newUsers.change)}% {dashboardData.newUsers.timeframe}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <p className="card-title">ADOPTIONS</p>
            <div className="card-icon icon-yellow">
              <FontAwesomeIcon icon={faPaw} />
            </div>
          </div>
          <h3 className="card-value">{dashboardData.adoptions.value}</h3>
          <div className={`card-stat ${dashboardData.adoptions.change > 0 ? 'positive' : 'negative'}`}>
            <FontAwesomeIcon icon={dashboardData.adoptions.change > 0 ? faArrowUp : faArrowDown} />
            <span>{Math.abs(dashboardData.adoptions.change)}% {dashboardData.adoptions.timeframe}</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <p className="card-title">SUCCESS RATE</p>
            <div className="card-icon icon-blue">
              <FontAwesomeIcon icon={faPercent} />
            </div>
          </div>
          <h3 className="card-value">{dashboardData.successRate.value}</h3>
          <div className={`card-stat ${dashboardData.successRate.change > 0 ? 'positive' : 'negative'}`}>
            <FontAwesomeIcon icon={dashboardData.successRate.change > 0 ? faArrowUp : faArrowDown} />
            <span>{Math.abs(dashboardData.successRate.change)}% {dashboardData.successRate.timeframe}</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Adoption value</h3>
            <div className="chart-tabs">
              <button className="chart-tab active">Month</button>
              <button className="chart-tab">Week</button>
            </div>
          </div>
          <div className="chart-content">
            {/* Replace with actual chart component */}
            <div style={{ height: "300px", background: "#172b4d", borderRadius: "8px", position: "relative" }}>
              {/* Placeholder for chart */}
              <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                color: "white",
                fontWeight: "bold"
              }}>
                Sales Chart Placeholder
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Total adoptions</h3>
          </div>
          <div className="chart-content">
            {/* Replace with actual chart component */}
            <div style={{ height: "300px", background: "#f8f9fe", borderRadius: "8px", position: "relative" }}>
              {/* Placeholder for chart */}
              <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                color: "#172b4d",
                fontWeight: "bold"
              }}>
                Orders Chart Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="chart-title">Recent Adoption Requests</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Requester</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Buddy</td>
              <td>John Smith</td>
              <td>April 2, 2025</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>Max</td>
              <td>Sarah Johnson</td>
              <td>April 1, 2025</td>
              <td>Approved</td>
            </tr>
            <tr>
              <td>Luna</td>
              <td>Michael Brown</td>
              <td>March 30, 2025</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>Rocky</td>
              <td>Emily Davis</td>
              <td>March 28, 2025</td>
              <td>Completed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;