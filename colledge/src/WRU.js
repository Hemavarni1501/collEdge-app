// WRU.js
// Updated version

import { Link } from 'react-router-dom';

function WRU() {
  return (
    <div>
      <center>
        <h1 className='title'>WHO ARE YOU ?</h1>
        <br />
        {/* This now points to /register/student */}
        <Link to="/register/student">
          <button className="btn btn-neon">STUDENT</button>
        </Link>
        <br /><br />
        {/* This now points to /register/staff */}
        <Link to="/register/staff">
          <button className="btn btn-neon">STAFF</button>
        </Link>
        <br /><br />
        {/* Visitor link remains the same */}
        <Link to="/visitor">
          <button className="btn btn-neon">VISITOR</button>
        </Link>
      </center>
    </div>
  );
}

export default WRU;