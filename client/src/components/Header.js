import React from 'react';

const Header = ({ balance }) => {
    return (
        <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-6 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-2xl font-bold">Budget Visualizer</h1>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3 backdrop-blur-sm">
                        <div className="text-sm opacity-90">Current Balance</div>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                            ${Math.abs(balance).toFixed(2)}
                            <span className="text-xs ml-1">{balance >= 0 ? 'Positive' : 'Negative'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;