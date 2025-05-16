import React from 'react';

const Header = ({ balance, currencySymbol = '$', isDarkMode = false }) => {
    return (
        <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white py-8 shadow-xl">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center mb-6 md:mb-0">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Budget Visualizer</h1>
                            <p className="text-sm text-blue-100 mt-1">Manage your finances with confidence</p>
                        </div>
                    </div>

                    <div className="glass-card bg-white bg-opacity-10 rounded-xl px-6 py-4 backdrop-blur-sm border border-white border-opacity-20 shadow-lg">
                        <div className="text-sm font-medium text-blue-100 mb-1">Current Balance</div>
                        <div className={`text-3xl font-bold flex items-center ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            <span className="mr-2">{currencySymbol}</span>
                            <span>{Math.abs(balance).toFixed(2)}</span>
                            <span className="flex items-center ml-2 text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
                                {balance >= 0 ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        Positive
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                        </svg>
                                        Negative
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;