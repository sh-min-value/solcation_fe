import React from 'react';
import bear from '../../assets/images/empty_sol.svg';

const EmptyBear = ({ title, description, onClick, buttonText }) => {
    return (
        <div className="p-4">
            <div className="text-center py-12">
                <img src={bear} alt="plan" className="w-60 h-60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <p className="text-gray-500 text-sm mb-6">
                    {description}
                </p>
                <button className="bg-light-blue text-main font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors" onClick={onClick}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default EmptyBear;