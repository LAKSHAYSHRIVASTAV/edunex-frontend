import React from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow p-4">
                    <h1 className="text-3xl font-bold">Welcome to EDUNEX</h1>
                    <p className="mt-4">
                        Your AI-powered study assistant designed to help you achieve your academic goals.
                    </p>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Home;