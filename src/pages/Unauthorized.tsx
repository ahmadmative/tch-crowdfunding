import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
                <p className="text-lg">You do not have access to this page.</p>
                <Link to="/" className="text-blue-500 hover:underline">Go back to the home page</Link>
            </div>
        </div>
    );
};

export default Unauthorized;