import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AboutPage() {
  return (
    <div>
    <div className="about-container text-white py-5">
      <div className="container">
        <h2 className="text-center mb-4">About CollEdge</h2>
        
        <p className="lead text-center mb-5">
          <strong>CollEdge</strong> is a collaborative platform designed to help college students and faculty share and access educational resources effortlessly.
        </p>

        <div className="row">
          <div className="col-md-6 mb-4">
            <h4>🎯 Our Purpose</h4>
            <p>
              CollEdge was built to eliminate the hassle of finding study materials. Whether it’s notes, question papers, books, or project ideas, everything is shared in one place.
            </p>
          </div>

          <div className="col-md-6 mb-4">
            <h4>👥 Who It's For</h4>
            <p>
              This platform is created for college students, faculty members, and academic communities who want to contribute and access high-quality learning resources.
            </p>
          </div>

          <div className="col-md-6 mb-4">
            <h4>🚀 Features</h4>
            <ul>
              <li>Upload and access study materials</li>
              <li>Organized dashboards for each user</li>
              <li>Filter by resource type and course</li>
              <li>Engaging design with smooth navigation</li>
            </ul>
          </div>

          <div className="col-md-6 mb-4">
            <h4>🌱 Our Vision</h4>
            <p>
              We aim to build a unified academic ecosystem where knowledge flows freely, and students are empowered to support one another beyond classroom boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
