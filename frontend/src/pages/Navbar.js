import React from "react";
import "../newProposalPage.css";

function MyNavbar() {
    return (
        <div className="my-navbar">
            <div className="navbar-title">THESIS MANAGEMENT</div>
            <div className="login-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="111" height="103" viewBox="0 0 111 103" fill="none">
                    <path d="M55.9809 0.225098C40.8507 0.225098 28.4714 14.5821 28.4714 32.2719C28.4714 49.9617 40.8507 64.3187 55.9809 64.3187C71.1112 64.3187 83.4905 49.9617 83.4905 32.2719C83.4905 14.5821 71.1112 0.225098 55.9809 0.225098ZM27.2335 64.3187C12.6535 64.9596 0.961914 76.1119 0.961914 89.9562V102.775H111V89.9562C111 76.1119 99.446 64.9596 84.7284 64.3187C77.3008 72.1381 67.1223 77.1374 55.9809 77.1374C44.8396 77.1374 34.6611 72.1381 27.2335 64.3187Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}

export default Navbar;