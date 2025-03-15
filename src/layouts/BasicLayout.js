import React from "react";

const BasicLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Header */}
            <header className="bg-tossBlue text-white text-center text-2xl font-bold py-4">
                TossBenenface
            </header>

            {/* Main Content */}
            <main className="flex-1 p-5 bg-gray-100">{children}</main>

            {/* Footer */}
            <footer className="bg-tossGray text-white text-center py-3">
                &copy; 2025 TossBenenface
            </footer>
        </div>
    );
};

export default BasicLayout;
